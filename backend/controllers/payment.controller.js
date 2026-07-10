const Razorpay = require("razorpay");
const crypto = require("crypto");
const Receipt = require("../models/Receipt");
const MembershipPlan = require("../models/MembershipPlan");
const MembershipEvent = require("../models/MembershipEvent");
const MembershipHistory = require("../models/MembershipHistory");
const PaymentTransaction = require("../models/PaymentTransaction");
const { findUserById } = require("../utils/userHelper");
const {
  applyPlanToMembership,
  evaluateMembership,
} = require("../utils/membershipLifecycle");

let razorpayClient = null;

function getRazorpayClient() {
  if (razorpayClient) return razorpayClient;
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay credentials are not configured.");
  }
  razorpayClient = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  return razorpayClient;
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function userModelNameFor(user, model) {
  const modelName =
    (model && model.modelName) ||
    (user.constructor && user.constructor.modelName) ||
    "Student";
  return modelName === "Consultant" ? "User" : modelName;
}

function toMinorUnits(amount) {
  if (amount == null || amount === "") return null;
  const numeric = Number(amount);
  if (!Number.isFinite(numeric)) return null;
  return Math.round(numeric * 100);
}

function transitionEventType(transitionType) {
  if (transitionType === "renewal") return "Membership Renewed";
  if (transitionType === "downgrade") return "Membership Downgraded";
  if (transitionType === "upgrade") return "Membership Upgraded";
  return "Membership Purchased";
}

function idempotencyKeyFor({ platform, transactionId }) {
  return `${platform}:${transactionId}`;
}

async function respondFromLedger(res, ledger, expected = {}) {
  const sameUser =
    !expected.userId || String(ledger.userId) === String(expected.userId);
  const samePlan = !expected.planId || ledger.planId === expected.planId;

  if (!sameUser || !samePlan) {
    return res.status(409).json({
      success: false,
      idempotent: true,
      message: "Payment transaction belongs to a different user or plan.",
    });
  }

  if (ledger.status === "succeeded") {
    return res.json({
      success: true,
      idempotent: true,
      message: "Payment already verified.",
      receipt: ledger.receiptId ? await Receipt.findById(ledger.receiptId) : null,
      membership: ledger.responseSnapshot?.membership || null,
    });
  }

  if (ledger.status === "processing") {
    return res.status(202).json({
      success: false,
      idempotent: true,
      message: "Payment verification is already processing.",
    });
  }

  return res.status(409).json({
    success: false,
    idempotent: true,
    message: "Payment transaction was previously rejected.",
  });
}

async function verifyRazorpayPayload({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  total,
  currency,
}) {
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return { ok: false, message: "Missing Razorpay verification fields." };
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  if (!process.env.RAZORPAY_KEY_SECRET) {
    return { ok: false, message: "Razorpay credentials are not configured." };
  }
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return { ok: false, message: "Invalid payment signature." };
  }

  const payment = await getRazorpayClient().payments.fetch(razorpay_payment_id);
  if (!payment || payment.order_id !== razorpay_order_id) {
    return { ok: false, message: "Payment does not belong to the submitted order." };
  }

  const expectedAmount = toMinorUnits(total);
  if (expectedAmount != null && Number(payment.amount) !== expectedAmount) {
    return { ok: false, message: "Payment amount mismatch." };
  }

  if (currency && payment.currency && String(payment.currency).toUpperCase() !== String(currency).toUpperCase()) {
    return { ok: false, message: "Payment currency mismatch." };
  }

  if (payment.status && !["authorized", "captured"].includes(payment.status)) {
    return { ok: false, message: `Payment status is ${payment.status}.` };
  }

  return { ok: true, payment };
}

function verifyApplePayload({ transactionId, verificationData }) {
  if (!transactionId) {
    return { ok: false, message: "Missing Apple transaction ID." };
  }
  if (!verificationData) {
    return { ok: false, message: "Missing Apple receipt." };
  }
  return { ok: true };
}

async function resolveUserIdentity({ userId, userEmail }) {
  if (!userId) {
    throw new Error("Missing user identity.");
  }

  const found = await findUserById(userId);
  if (!found || !found.user) {
    throw new Error("User not found.");
  }

  const postedEmail = normalizeEmail(userEmail);
  const actualEmail = normalizeEmail(found.user.email);
  if (postedEmail && postedEmail !== actualEmail) {
    throw new Error("User identity mismatch.");
  }

  return found;
}

async function resolvePlanIdentity({ planId, productId, items, total, currency }) {
  const activePlans = await MembershipPlan.find({ isActive: true }).sort({
    sortOrder: 1,
    price: 1,
  });

  const byPlanId = planId
    ? activePlans.find((plan) => plan.planId === planId)
    : null;
  if (byPlanId) return byPlanId;
  if (planId && !byPlanId) {
    throw new Error(`Membership plan ${planId} not found.`);
  }

  const byProductId = productId
    ? activePlans.find(
        (plan) =>
          plan.appleProductId === productId || plan.razorpayPlanId === productId
      )
    : null;
  if (byProductId) return byProductId;

  const itemList = Array.isArray(items) ? items : [];
  const legacyPremium = itemList.some((item) => {
    const title = normalizeText(item.name || item.title);
    return title === "premium subscription";
  });
  if (legacyPremium) {
    const premium = activePlans.find((plan) => plan.planId === "premium");
    if (premium) return premium;
  }

  for (const item of itemList) {
    const title = normalizeText(item.name || item.title);
    const itemPrice = Number(item.price);
    const matches = activePlans.filter((plan) => {
      const planNames = [
        normalizeText(plan.name),
        normalizeText(plan.planId),
        normalizeText(`${plan.name} membership`),
      ];
      const titleMatches = planNames.includes(title);
      const priceMatches =
        Number.isFinite(itemPrice) && Number(plan.price) === itemPrice;
      return titleMatches && priceMatches;
    });
    if (matches.length === 1) return matches[0];
  }

  const totalAmount = Number(total);
  if (Number.isFinite(totalAmount)) {
    const matches = activePlans.filter(
      (plan) =>
        String(plan.currency || "INR").toUpperCase() ===
          String(currency || "INR").toUpperCase() &&
        Number(plan.price) === totalAmount
    );
    if (matches.length === 1) return matches[0];
  }

  throw new Error("Could not resolve membership plan from payment payload.");
}

async function createReceiptIfNeeded({
  items,
  user,
  total,
  subtotal,
  discount,
  currency,
  paymentId,
  orderId,
  signature,
}) {
  if (!Array.isArray(items) || items.length === 0) return null;

  try {
    const existing = await Receipt.findOne({ paymentId, orderId });
    if (existing) return existing;
  } catch {
    // Older databases may not have an index yet; the idempotency ledger is the authority.
  }

  return Receipt.create({
    userId: user._id,
    userEmail: user.email,
    items,
    subtotal,
    discount,
    total,
    currency,
    paymentId,
    orderId: orderId || paymentId,
    signature: signature || "verified-non-razorpay",
    status: "paid",
  });
}

async function provisionMembershipOnce({ user, model, plan, platform, transactionId }) {
  const duplicateHistory = await MembershipHistory.findOne({
    platform,
    transactionId,
  });
  if (duplicateHistory) {
    return {
      user,
      plan,
      transitionType: duplicateHistory.transitionType,
      history: duplicateHistory,
      duplicate: true,
    };
  }

  evaluateMembership(user.membership);

  const { transitionType, previousPlanId } = applyPlanToMembership(user, plan, {
    platform,
    transactionId,
  });

  await user.save();

  const userModel = userModelNameFor(user, model);
  const history = await MembershipHistory.create({
    userId: user._id,
    userModel,
    fromPlanId: previousPlanId === "free" ? null : previousPlanId,
    toPlanId: plan.planId,
    transitionType,
    platform,
    transactionId,
  });

  if (!user.membership.history) user.membership.history = [];
  const hasHistory = user.membership.history.some(
    (id) => String(id) === String(history._id)
  );
  if (!hasHistory) {
    user.membership.history.push(history._id);
    await user.save();
  }

  await MembershipEvent.create({
    userId: user._id,
    userModel,
    eventType: transitionEventType(transitionType),
    planId: plan.planId,
    metadata: { platform, transactionId, transitionType, previousPlanId },
  });

  return { user, plan, transitionType, history, duplicate: false };
}

// POST /api/payment/create-order
const createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", planId } = req.body;

    let orderAmount = Number(amount);
    const notes = {};

    if (planId) {
      const plan = await MembershipPlan.findOne({ planId, isActive: true });
      if (!plan) return res.status(400).json({ error: "Invalid membership plan" });
      orderAmount = Number(plan.price);
      notes.planId = plan.planId;
    }

    if (!Number.isFinite(orderAmount) || orderAmount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const order = await getRazorpayClient().orders.create({
      amount: Math.round(orderAmount * 100),
      currency,
      receipt: `receipt_${Date.now()}`,
      notes,
    });
    res.json(order);
  } catch (err) {
    console.error("Razorpay create order error:", err);
    res.status(500).json({ error: "Failed to create order", details: err.message });
  }
};

// POST /api/payment/verify
const verifyPayment = async (req, res) => {
  let ledger = null;

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      userEmail,
      items,
      subtotal,
      discount,
      total,
      currency = "INR",
      platform = "razorpay",
      planId,
      productId,
      transactionId,
      verificationData,
    } = req.body;

    if (!["razorpay", "apple_iap"].includes(platform)) {
      return res.status(400).json({ success: false, message: "Unsupported payment platform." });
    }

    const finalTransactionId =
      platform === "razorpay" ? razorpay_payment_id : transactionId;
    if (!finalTransactionId) {
      return res.status(400).json({ success: false, message: "Missing transaction ID." });
    }

    const paymentVerification =
      platform === "razorpay"
        ? await verifyRazorpayPayload({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            total,
            currency,
          })
        : verifyApplePayload({ transactionId, verificationData });

    if (!paymentVerification.ok) {
      return res.status(400).json({
        success: false,
        message: paymentVerification.message,
      });
    }

    const { user, model } = await resolveUserIdentity({ userId, userEmail });
    const plan = await resolvePlanIdentity({
      planId,
      productId,
      items,
      total,
      currency,
    });
    const userModel = userModelNameFor(user, model);
    const idempotencyKey = idempotencyKeyFor({
      platform,
      transactionId: finalTransactionId,
    });

    const existingLedger = await PaymentTransaction.findOne({ idempotencyKey });
    if (existingLedger) {
      return respondFromLedger(res, existingLedger, {
        userId: user._id,
        planId: plan.planId,
      });
    }

    try {
      ledger = await PaymentTransaction.create({
        idempotencyKey,
        platform,
        transactionId: finalTransactionId,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id || finalTransactionId,
        userId: user._id,
        userModel,
        userEmail: user.email,
        planId: plan.planId,
        amount: Number(total),
        currency,
        status: "processing",
      });
    } catch (createErr) {
      if (createErr && createErr.code === 11000) {
        const racedLedger = await PaymentTransaction.findOne({ idempotencyKey });
        if (racedLedger) {
          return respondFromLedger(res, racedLedger, {
            userId: user._id,
            planId: plan.planId,
          });
        }
      }
      throw createErr;
    }

    const receipt = await createReceiptIfNeeded({
      items,
      user,
      total,
      subtotal,
      discount,
      currency,
      paymentId: razorpay_payment_id || finalTransactionId,
      orderId: razorpay_order_id || finalTransactionId,
      signature: razorpay_signature,
    });

    const provisioning = await provisionMembershipOnce({
      user,
      model,
      plan,
      platform,
      transactionId: finalTransactionId,
    });

    const responseSnapshot = {
      membership: {
        planId: plan.planId,
        transitionType: provisioning.transitionType,
        status: user.membership?.status,
        expiryDate: user.membership?.expiryDate || null,
      },
    };

    ledger.status = "succeeded";
    ledger.receiptId = receipt?._id;
    ledger.historyId = provisioning.history?._id;
    ledger.transitionType = provisioning.transitionType;
    ledger.responseSnapshot = responseSnapshot;
    ledger.processedAt = new Date();
    await ledger.save();

    res.json({
      success: true,
      idempotent: false,
      message: "Payment verified successfully",
      receipt,
      membership: responseSnapshot.membership,
    });
  } catch (err) {
    console.error("Payment verify error:", err);

    if (ledger) {
      ledger.status = "failed";
      ledger.error = err.message;
      ledger.processedAt = new Date();
      try {
        await ledger.save();
      } catch (saveErr) {
        console.error("Payment ledger failure update error:", saveErr);
      }
    }

    res.status(500).json({ error: "Verification failed", details: err.message });
  }
};

const getMyReceipts = async (req, res) => {
  try {
    const { email } = req.params;
    const receipts = await Receipt.find({ userEmail: email }).sort({ createdAt: -1 });
    res.json(receipts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch receipts" });
  }
};

module.exports = { createOrder, verifyPayment, getMyReceipts };
