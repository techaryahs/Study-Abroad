/**
 * P2 — Apple Verification Service
 *
 * Implements the PaymentGateway Interface contract for Apple In-App Purchases.
 */

const MembershipPlan = require("../../models/MembershipPlan");

const APPLE_PRODUCTION_URL = "https://buy.itunes.apple.com/verifyReceipt";
const APPLE_SANDBOX_URL = "https://sandbox.itunes.apple.com/verifyReceipt";

/**
 * Sends the receipt to Apple's verifyReceipt endpoint.
 */
async function callApple(url, receiptData, password) {
  const fetch = (await import("node-fetch")).default; // Use dynamic import if node-fetch is ESM, or global fetch if Node 18+
  
  // Use global fetch if available (Node 18+)
  const fetchFn = typeof global.fetch !== 'undefined' ? global.fetch : fetch;

  const response = await fetchFn(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      "receipt-data": receiptData,
      password: password,
      "exclude-old-transactions": true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Apple API HTTP Error: ${response.status}`);
  }

  return response.json();
}

/**
 * Validates an Apple receipt, automatically handling 21007 sandbox fallbacks.
 *
 * @param {Object} payload - { receiptData, expectedPlanId }
 * @returns {Object} Normalized TransactionResult
 */
async function verifyPurchase(payload) {
  const { receiptData } = payload;
  const password = process.env.APPLE_SHARED_SECRET;

  if (!receiptData) {
    return { success: false, error: "Missing Apple receipt data" };
  }

  try {
    // 1. Always try Production first
    let result = await callApple(APPLE_PRODUCTION_URL, receiptData, password);

    // 2. Auto-Retry against Sandbox if we receive 21007
    if (result.status === 21007) {
      console.log("[AppleVerify] 21007 Sandbox receipt sent to production. Retrying in Sandbox...");
      result = await callApple(APPLE_SANDBOX_URL, receiptData, password);
    }

    if (result.status !== 0) {
      return { success: false, error: `Apple verification failed with status: ${result.status}` };
    }

    // 3. Extract the latest transaction
    const latestReceiptInfo = result.latest_receipt_info;
    if (!latestReceiptInfo || latestReceiptInfo.length === 0) {
      return { success: false, error: "No latest_receipt_info found in Apple response" };
    }

    // Sort by purchase_date descending to get the most recent
    latestReceiptInfo.sort((a, b) => Number(b.purchase_date_ms) - Number(a.purchase_date_ms));
    const latest = latestReceiptInfo[0];

    const appleProductId = latest.product_id;
    const transactionId = latest.transaction_id;

    // 4. Resolve against Membership Catalog
    const plan = await MembershipPlan.findOne({ "paymentMappings.apple": appleProductId }).lean() ||
                 await MembershipPlan.findOne({ appleProductId }).lean(); // Fallback to v1 schema

    if (!plan) {
      return { success: false, error: `No active plan found for Apple product: ${appleProductId}` };
    }

    return {
      success: true,
      gateway: "apple",
      externalTransactionId: transactionId,
      planId: plan.planId,
      amount: plan.price, // Apple API doesn't return amount in the receipt easily, trust our catalog for standard pricing.
      currency: plan.currency || "INR",
      normalizedVerificationData: {
        originalTransactionId: latest.original_transaction_id,
        purchaseDateMs: latest.purchase_date_ms,
        expiresDateMs: latest.expires_date_ms,
        productId: appleProductId,
        environment: result.environment
      }
    };
  } catch (err) {
    console.error("[AppleVerify] Exception:", err);
    return { success: false, error: "Internal verification error" };
  }
}

/**
 * Handle Apple Server-to-Server notifications.
 */
async function processWebhook(payload) {
  // Decoding Apple Signed Payload (JWS) is required here for real S2S v2.
  // This abstracts the entry point for the Orchestrator.
  
  // Implementation omitted for brevity; this would decode the JWS, map notificationType
  // (e.g. DID_RENEW, CANCEL, REFUND), and return a normalized event.
  return {
    success: false,
    error: "Apple S2S decoding not fully implemented in this abstraction."
  };
}

module.exports = {
  verifyPurchase,
  processWebhook
};
