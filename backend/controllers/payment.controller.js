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

/**
 * Phase 4 — single additional consultation purchase (not a membership product).
 * Fixed price; never upgrades plan / never adds entitlement credits.
 */
const CONSULTATION_PURCHASE = Object.freeze({
  price: 599,
  currency: "INR",
  /** Ledger discriminator only — not a MembershipPlan.planId */
  ledgerPlanId: "consultation_addon",
  serviceId: "consultation",
  purchaseType: "consultation",
});

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
  const samePurchaseType =
    !expected.purchaseType ||
    ledger.responseSnapshot?.purchaseType === expected.purchaseType ||
    (expected.purchaseType === "consultation" &&
      ledger.planId === CONSULTATION_PURCHASE.ledgerPlanId) ||
    (expected.purchaseType === "membership" &&
      ledger.planId !== CONSULTATION_PURCHASE.ledgerPlanId);

  if (!sameUser || !samePlan || !samePurchaseType) {
    return res.status(409).json({
      success: false,
      idempotent: true,
      message: "Payment transaction belongs to a different user or plan.",
    });
  }

  if (ledger.status === "succeeded") {
    const receipt = ledger.receiptId
      ? await Receipt.findById(ledger.receiptId)
      : null;
    const purchaseType =
      ledger.responseSnapshot?.purchaseType ||
      (ledger.planId === CONSULTATION_PURCHASE.ledgerPlanId
        ? "consultation"
        : "membership");

    return res.json({
      success: true,
      idempotent: true,
      message: "Payment already verified.",
      purchaseType,
      receipt,
      membership:
        purchaseType === "membership"
          ? ledger.responseSnapshot?.membership || null
          : null,
      consultation:
        purchaseType === "consultation"
          ? ledger.responseSnapshot?.consultation || {
              paymentId: ledger.paymentId || ledger.transactionId,
              amount: ledger.amount,
              currency: ledger.currency,
              creditsAdded: false,
              planChanged: false,
            }
          : null,
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

/**
 * Detect purchase kind without treating consultation as membership.
 * Explicit purchaseType/purpose wins; planId/productId ⇒ membership;
 * consultation service markers ⇒ consultation; else membership (pricing/cart).
 */
function detectPurchaseKind(body = {}) {
  const explicit = body.purchaseType || body.purpose;
  if (explicit === "consultation") return "consultation";
  if (explicit === "membership") return "membership";

  if (body.planId || body.productId) return "membership";

  const items = Array.isArray(body.items) ? body.items : [];
  const looksLikeConsultation = items.some((item) => {
    const serviceId = String(item.serviceId || "").toLowerCase();
    if (serviceId === CONSULTATION_PURCHASE.serviceId) return true;
    const title = normalizeText(item.name || item.title);
    return (
      title === "counselling session" ||
      title === "counseling session" ||
      title === "consultation session" ||
      title === "additional consultation" ||
      title === "consultation"
    );
  });

  if (looksLikeConsultation) return "consultation";
  return "membership";
}

async function createOrResumeLedger({
  idempotencyKey,
  platform,
  transactionId,
  orderId,
  paymentId,
  user,
  userModel,
  planId,
  amount,
  currency,
  expected,
  res,
}) {
  const existingLedger = await PaymentTransaction.findOne({ idempotencyKey });
  if (existingLedger) {
    return {
      ledger: null,
      earlyResponse: await respondFromLedger(res, existingLedger, expected),
    };
  }

  try {
    const ledger = await PaymentTransaction.create({
      idempotencyKey,
      platform,
      transactionId,
      orderId,
      paymentId,
      userId: user._id,
      userModel,
      userEmail: user.email,
      planId,
      amount: Number(amount),
      currency,
      status: "processing",
    });
    return { ledger, earlyResponse: null };
  } catch (createErr) {
    if (createErr && createErr.code === 11000) {
      const racedLedger = await PaymentTransaction.findOne({ idempotencyKey });
      if (racedLedger) {
        return {
          ledger: null,
          earlyResponse: await respondFromLedger(res, racedLedger, expected),
        };
      }
    }
    throw createErr;
  }
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

/**
 * Local/staging only: charge ₹1 for membership Razorpay orders.
 * Does not change catalog, UI, entitlements, or verify logic.
 */
function isTestPaymentMode() {
  const v = String(process.env.TEST_PAYMENT_MODE || "")
    .trim()
    .toLowerCase();
  return v === "true" || v === "1" || v === "yes";
}

// POST /api/payment/create-order
// Shared Razorpay order factory — membership (plan price) or consultation (₹599).
const createOrder = async (req, res) => {
  try {
    const {
      amount,
      currency = "INR",
      planId,
      purchaseType,
      purpose,
    } = req.body;

    let orderAmount = Number(amount);
    const notes = {};
    const kind = detectPurchaseKind({ purchaseType, purpose, planId });

    if (kind === "consultation") {
      // Fixed consultation addon price — never pull membership plan pricing.
      orderAmount = CONSULTATION_PURCHASE.price;
      notes.purchaseType = CONSULTATION_PURCHASE.purchaseType;
      notes.serviceId = CONSULTATION_PURCHASE.serviceId;
      notes.ledgerPlanId = CONSULTATION_PURCHASE.ledgerPlanId;
    } else if (planId) {
      const plan = await MembershipPlan.findOne({ planId, isActive: true });
      if (!plan) return res.status(400).json({ error: "Invalid membership plan" });
      orderAmount = Number(plan.price);
      notes.planId = plan.planId;
      notes.purchaseType = "membership";
    } else {
      notes.purchaseType = "membership";
    }

    // TEST_PAYMENT_MODE: membership plans only → charge ₹1 (100 paise).
    // Catalog price, UI labels, invoices/items, and verification code paths unchanged.
    const testMode = isTestPaymentMode() && kind !== "consultation";
    if (testMode) {
      notes.catalogAmount = orderAmount; // audit only — not used for entitlements
      notes.testPaymentMode = true;
      orderAmount = 1;
    }

    if (!Number.isFinite(orderAmount) || orderAmount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const order = await getRazorpayClient().orders.create({
      amount: Math.round(orderAmount * 100),
      currency:
        kind === "consultation"
          ? CONSULTATION_PURCHASE.currency
          : currency,
      receipt: `receipt_${Date.now()}`,
      notes,
    });

    res.json({
      ...order,
      purchaseType: kind,
      // Client convenience (authoritative charged amount in major units)
      expectedAmount:
        kind === "consultation" ? CONSULTATION_PURCHASE.price : orderAmount,
      testPaymentMode: testMode || undefined,
    });
  } catch (err) {
    console.error("Razorpay create order error:", err);
    res.status(500).json({ error: "Failed to create order", details: err.message });
  }
};

/**
 * Membership verification branch — plan resolution + provisionMembershipOnce.
 * Does not handle consultation add-ons.
 */
async function verifyMembershipPayment(req, res, ctx) {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    items,
    subtotal,
    discount,
    total,
    currency,
    platform,
    planId,
    productId,
    finalTransactionId,
    user,
    model,
  } = ctx;

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

  const { ledger, earlyResponse } = await createOrResumeLedger({
    idempotencyKey,
    platform,
    transactionId: finalTransactionId,
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id || finalTransactionId,
    user,
    userModel,
    planId: plan.planId,
    amount: total,
    currency,
    expected: {
      userId: user._id,
      planId: plan.planId,
      purchaseType: "membership",
    },
    res,
  });
  if (earlyResponse) return earlyResponse;

  try {
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
      purchaseType: "membership",
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

    return res.json({
      success: true,
      idempotent: false,
      purchaseType: "membership",
      message: "Payment verified successfully",
      receipt,
      membership: responseSnapshot.membership,
      consultation: null,
    });
  } catch (err) {
    ledger.status = "failed";
    ledger.error = err.message;
    ledger.processedAt = new Date();
    try {
      await ledger.save();
    } catch (saveErr) {
      console.error("Payment ledger failure update error:", saveErr);
    }
    throw err;
  }
}

/**
 * Consultation verification branch — ₹599 one-session purchase.
 * Does NOT upgrade membership, change plan, or add entitlement credits.
 * Caller books via bookConsultation({ path: "paid", paymentId }).
 */
async function verifyConsultationPayment(req, res, ctx) {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    items,
    subtotal,
    discount,
    total,
    currency,
    platform,
    finalTransactionId,
    user,
    model,
  } = ctx;

  // Authoritative price check (also covered by Razorpay amount verify).
  const paidTotal = Number(total);
  if (
    Number.isFinite(paidTotal) &&
    Math.round(paidTotal * 100) !== Math.round(CONSULTATION_PURCHASE.price * 100)
  ) {
    return res.status(400).json({
      success: false,
      message: `Consultation purchase must be ₹${CONSULTATION_PURCHASE.price}.`,
      code: "CONSULTATION_PRICE_MISMATCH",
    });
  }

  const userModel = userModelNameFor(user, model);
  const paymentId = razorpay_payment_id || finalTransactionId;
  const idempotencyKey = idempotencyKeyFor({
    platform,
    transactionId: finalTransactionId,
  });

  const { ledger, earlyResponse } = await createOrResumeLedger({
    idempotencyKey,
    platform,
    transactionId: finalTransactionId,
    orderId: razorpay_order_id,
    paymentId,
    user,
    userModel,
    planId: CONSULTATION_PURCHASE.ledgerPlanId,
    amount: CONSULTATION_PURCHASE.price,
    currency: currency || CONSULTATION_PURCHASE.currency,
    expected: {
      userId: user._id,
      planId: CONSULTATION_PURCHASE.ledgerPlanId,
      purchaseType: "consultation",
    },
    res,
  });
  if (earlyResponse) return earlyResponse;

  try {
    const receiptItems =
      Array.isArray(items) && items.length > 0
        ? items.map((item) => ({
            title: item.title || item.name || "Additional Consultation",
            price: Number(item.price) || CONSULTATION_PURCHASE.price,
            currency: item.currency || currency || CONSULTATION_PURCHASE.currency,
            serviceId: item.serviceId || CONSULTATION_PURCHASE.serviceId,
          }))
        : [
            {
              title: "Additional Consultation",
              price: CONSULTATION_PURCHASE.price,
              currency: currency || CONSULTATION_PURCHASE.currency,
              serviceId: CONSULTATION_PURCHASE.serviceId,
            },
          ];

    const receipt = await createReceiptIfNeeded({
      items: receiptItems,
      user,
      total: CONSULTATION_PURCHASE.price,
      subtotal: subtotal != null ? subtotal : CONSULTATION_PURCHASE.price,
      discount: discount != null ? discount : 0,
      currency: currency || CONSULTATION_PURCHASE.currency,
      paymentId,
      orderId: razorpay_order_id || finalTransactionId,
      signature: razorpay_signature,
    });

    // Intentionally no applyPlanToMembership / no reserveEntitlementUsage.
    const consultationSnapshot = {
      paymentId,
      orderId: razorpay_order_id || null,
      amount: CONSULTATION_PURCHASE.price,
      currency: currency || CONSULTATION_PURCHASE.currency,
      serviceId: CONSULTATION_PURCHASE.serviceId,
      creditsAdded: false,
      planChanged: false,
      sessionsGranted: 1,
    };

    const responseSnapshot = {
      purchaseType: "consultation",
      consultation: consultationSnapshot,
      // Explicit nulls so clients never confuse with membership verify payloads.
      membership: null,
    };

    ledger.status = "succeeded";
    ledger.receiptId = receipt?._id;
    ledger.historyId = null;
    ledger.transitionType = null;
    ledger.responseSnapshot = responseSnapshot;
    ledger.processedAt = new Date();
    await ledger.save();

    return res.json({
      success: true,
      idempotent: false,
      purchaseType: "consultation",
      message: "Consultation payment verified successfully",
      receipt,
      membership: null,
      consultation: consultationSnapshot,
    });
  } catch (err) {
    ledger.status = "failed";
    ledger.error = err.message;
    ledger.processedAt = new Date();
    try {
      await ledger.save();
    } catch (saveErr) {
      console.error("Payment ledger failure update error:", saveErr);
    }
    throw err;
  }
}

// POST /api/payment/verify
// Routes to membership OR consultation branch after shared Razorpay/Apple verify.
// P0-2: JWT authenticated user is the only identity — body.userId is never trusted.
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId: bodyUserId,
      userEmail: bodyUserEmail,
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
      purchaseType,
      purpose,
    } = req.body;

    // ── Identity binding (JWT is source of truth) ──────────────────────────
    const authUserId = req.user?.id || req.user?._id;
    if (!authUserId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required for payment verification.",
        code: "LOGIN_REQUIRED",
      });
    }
    if (bodyUserId && String(bodyUserId) !== String(authUserId)) {
      return res.status(403).json({
        success: false,
        message: "Payment user identity mismatch.",
        code: "IDENTITY_MISMATCH",
      });
    }

    if (!["razorpay", "apple_iap"].includes(platform)) {
      return res.status(400).json({ success: false, message: "Unsupported payment platform." });
    }

    const finalTransactionId =
      platform === "razorpay" ? razorpay_payment_id : transactionId;
    if (!finalTransactionId) {
      return res.status(400).json({ success: false, message: "Missing transaction ID." });
    }

    const purchaseKind = detectPurchaseKind({
      purchaseType,
      purpose,
      planId,
      productId,
      items,
    });

    // Shared crypto / amount verification (Razorpay infrastructure reused).
    const verifyTotal =
      purchaseKind === "consultation"
        ? CONSULTATION_PURCHASE.price
        : total;

    const paymentVerification =
      platform === "razorpay"
        ? await verifyRazorpayPayload({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            total: verifyTotal,
            currency:
              purchaseKind === "consultation"
                ? CONSULTATION_PURCHASE.currency
                : currency,
          })
        : verifyApplePayload({ transactionId, verificationData });

    if (!paymentVerification.ok) {
      return res.status(400).json({
        success: false,
        message: paymentVerification.message,
      });
    }

    // Always resolve the authenticated user — ignore body.userId for provisioning.
    const { user, model } = await resolveUserIdentity({
      userId: authUserId,
      userEmail: bodyUserEmail,
    });

    if (
      bodyUserEmail &&
      normalizeEmail(bodyUserEmail) !== normalizeEmail(user.email)
    ) {
      return res.status(403).json({
        success: false,
        message: "Payment email identity mismatch.",
        code: "IDENTITY_MISMATCH",
      });
    }

    const ctx = {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      subtotal,
      discount,
      total: verifyTotal,
      currency:
        purchaseKind === "consultation"
          ? CONSULTATION_PURCHASE.currency
          : currency,
      platform,
      planId,
      productId,
      finalTransactionId,
      user,
      model,
    };

    if (purchaseKind === "consultation") {
      return await verifyConsultationPayment(req, res, ctx);
    }

    return await verifyMembershipPayment(req, res, ctx);
  } catch (err) {
    console.error("Payment verify error:", err);
    res.status(500).json({ error: "Verification failed", details: err.message });
  }
};

/**
 * Look up a succeeded consultation-addon payment (for booking validation).
 * @param {string} paymentId
 * @returns {Promise<object|null>}
 */
async function findSucceededConsultationPayment(paymentId) {
  if (!paymentId || paymentId === "membership_entitlement") return null;
  return PaymentTransaction.findOne({
    $or: [{ paymentId }, { transactionId: paymentId }],
    planId: CONSULTATION_PURCHASE.ledgerPlanId,
    status: "succeeded",
  });
}

const getMyReceipts = async (req, res) => {
  try {
    const { email } = req.params;
    const receipts = await Receipt.find({ userEmail: email }).sort({ createdAt: -1 });
    res.json(receipts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch receipts" });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getMyReceipts,
  CONSULTATION_PURCHASE,
  detectPurchaseKind,
  findSucceededConsultationPayment,
};
