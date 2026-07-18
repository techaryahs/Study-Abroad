/**
 * P2 — Purchase Orchestrator
 *
 * The central nervous system of the Unified Payment Layer.
 * Manages the Transaction lifecycle and state machine.
 */

const PaymentTransaction = require("../../models/PaymentTransaction");
const PaymentAttempt = require("../../models/PaymentAttempt");
const WebhookLog = require("../../models/WebhookLog");

const appleVerification = require("./appleVerification.service");
const razorpayVerification = require("./razorpayVerification.service");
const entitlementService = require("./entitlement.service");

function getStrategy(gateway) {
  if (gateway === "apple") return appleVerification;
  if (gateway === "razorpay") return razorpayVerification;
  throw new Error(`Unsupported gateway: ${gateway}`);
}

/**
 * Main entry point for a new purchase verification from the frontend.
 */
async function processPurchase(user, userModelName, gateway, payload, amount, currency, planId) {
  // 1. Log Attempt
  const attempt = await PaymentAttempt.create({
    userId: user._id,
    userModel: userModelName,
    gateway,
    planId,
    amount: amount || 0,
    currency: currency || "INR",
    status: "STARTED"
  });

  try {
    const strategy = getStrategy(gateway);

    // 2. Verification
    const verificationResult = await strategy.verifyPurchase(payload);

    if (!verificationResult.success) {
      attempt.status = "FAILED";
      attempt.errorMessage = verificationResult.error;
      await attempt.save();
      return { success: false, error: verificationResult.error };
    }

    // 3. Idempotency Check & Transaction Creation
    const { externalTransactionId, planId: verifiedPlanId, amount: verifiedAmount, currency: verifiedCurrency, normalizedVerificationData } = verificationResult;
    
    let transaction = await PaymentTransaction.findOne({ gateway, externalTransactionId });

    if (!transaction) {
      // Create new transaction
      transaction = await PaymentTransaction.create({
        transactionId: `txn_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        userId: user._id,
        userModel: userModelName,
        gateway,
        externalTransactionId,
        planId: verifiedPlanId,
        amount: verifiedAmount,
        currency: verifiedCurrency,
        status: "VERIFIED",
        verificationData: normalizedVerificationData,
      });
    }

    attempt.status = "SUCCESS";
    attempt.transactionId = transaction._id;
    await attempt.save();

    // 4. Entitlement Granting (Idempotent)
    // If it's already ENTITLED, we can skip or re-grant safely.
    if (transaction.status === "VERIFIED" || transaction.status === "ENTITLEMENT_PENDING") {
      transaction.status = "ENTITLEMENT_PENDING";
      await transaction.save();

      const entitlementResult = await entitlementService.grantEntitlement(transaction);

      if (entitlementResult.success) {
        transaction.status = "ENTITLED";
        transaction.processedAt = new Date();
        await transaction.save();
      } else {
        // Leave in ENTITLEMENT_PENDING so a cron job can retry
        console.error(`[Orchestrator] Failed to grant entitlement for txn ${transaction.transactionId}:`, entitlementResult.error);
        return { success: false, error: "Payment verified but failed to grant access." };
      }
    }

    return { success: true, transactionId: transaction.transactionId };

  } catch (error) {
    console.error("[Orchestrator] Exception:", error);
    attempt.status = "FAILED";
    attempt.errorMessage = error.message;
    await attempt.save();
    return { success: false, error: "Internal processing error." };
  }
}

/**
 * Main entry point for webhooks.
 */
async function processWebhookEvent(gateway, webhookId, eventType, payload) {
  try {
    // 1. Idempotency Check
    const existingLog = await WebhookLog.findOne({ gateway, webhookId });
    if (existingLog) {
      return { success: true, duplicate: true }; // Safely ignore
    }

    const log = await WebhookLog.create({
      gateway,
      webhookId,
      eventType,
      payload, // Temporarily store for audit
      status: "PENDING"
    });

    const strategy = getStrategy(gateway);
    const eventResult = await strategy.processWebhook(payload);

    if (!eventResult.success) {
      log.status = "FAILED";
      log.error = eventResult.error;
      await log.save();
      return { success: false, error: eventResult.error };
    }

    // Determine what to do based on normalized event
    // E.g., if it's a REFUND:
    // const tx = await PaymentTransaction.findOne({ externalTransactionId: eventResult.externalTransactionId });
    // if (tx) {
    //    tx.status = "REFUNDED"; await tx.save();
    //    await entitlementService.revokeEntitlement(tx.userId, tx.userModel);
    // }

    log.status = "PROCESSED";
    log.externalTransactionId = eventResult.externalTransactionId || null;
    log.processedAt = new Date();
    await log.save();

    return { success: true };
  } catch (error) {
    console.error("[Orchestrator] Webhook Exception:", error);
    return { success: false, error: "Internal webhook processing error." };
  }
}

module.exports = {
  processPurchase,
  processWebhookEvent
};
