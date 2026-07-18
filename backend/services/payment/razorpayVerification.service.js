/**
 * P2 — Razorpay Verification Service
 *
 * Implements the PaymentGateway Interface contract for Razorpay.
 */

const crypto = require("crypto");
const Razorpay = require("razorpay");
const MembershipPlan = require("../../models/MembershipPlan");

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

/**
 * Validates a Razorpay signature and fetches the payment from the API.
 *
 * @param {Object} payload - { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * @returns {Object} Normalized TransactionResult
 */
async function verifyPurchase(payload) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = payload;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return { success: false, error: "Missing Razorpay verification fields" };
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return { success: false, error: "Razorpay credentials are not configured" };
  }

  try {
    // 1. Verify HMAC Signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return { success: false, error: "Invalid Razorpay payment signature" };
    }

    // 2. Fetch payment details from Razorpay API
    const payment = await getRazorpayClient().payments.fetch(razorpay_payment_id);
    if (!payment) {
      return { success: false, error: "Payment not found in Razorpay" };
    }

    if (payment.order_id !== razorpay_order_id) {
      return { success: false, error: "Payment does not belong to the submitted order" };
    }

    if (payment.status && !["authorized", "captured"].includes(payment.status)) {
      return { success: false, error: `Payment status is ${payment.status}` };
    }

    // 3. Resolve Plan from Notes or Amount
    const planIdFromNotes = payment.notes?.planId;
    let plan = null;
    
    if (planIdFromNotes) {
      plan = await MembershipPlan.findOne({ planId: planIdFromNotes }).lean();
    } else {
      // Fallback to price matching if notes are missing
      const amountMajor = Number(payment.amount) / 100;
      plan = await MembershipPlan.findOne({ price: amountMajor, currency: payment.currency }).lean();
    }

    if (!plan) {
      return { success: false, error: `No active plan found for Razorpay payment ${razorpay_payment_id}` };
    }

    return {
      success: true,
      gateway: "razorpay",
      externalTransactionId: razorpay_payment_id,
      planId: plan.planId,
      amount: plan.price,
      currency: plan.currency || "INR",
      normalizedVerificationData: {
        orderId: razorpay_order_id,
        paymentStatus: payment.status,
        paymentMethod: payment.method,
        email: payment.email,
        contact: payment.contact
      }
    };
  } catch (err) {
    console.error("[RazorpayVerify] Exception:", err);
    return { success: false, error: "Internal verification error" };
  }
}

/**
 * Handle Razorpay Webhooks.
 */
async function processWebhook(payload) {
  // Validate webhook signature from headers against process.env.RAZORPAY_WEBHOOK_SECRET
  // Map Razorpay event (e.g. payment.authorized, subscription.charged) to unified event
  
  return {
    success: false,
    error: "Razorpay webhook decoding not fully implemented in this abstraction."
  };
}

module.exports = {
  verifyPurchase,
  processWebhook
};
