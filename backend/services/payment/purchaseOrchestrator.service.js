/**
 * P2 — Purchase Orchestrator (Production-Grade Rewrite)
 *
 * Central coordinator for payment verification across all gateways.
 *
 * Apple flow (REWRITTEN):
 *   1. Verify receipt with Apple
 *   2. Identify as new purchase / renewal / restore
 *   3. Create/update AppleSubscription (billing source of truth)
 *   4. Create immutable PaymentTransaction ledger entry
 *   5. Grant entitlement via entitlement.service → Membership Engine
 *   6. Return consolidated result to client
 *
 * Razorpay flow (UNCHANGED):
 *   1. Verify signature + fetch payment
 *   2. Create PaymentTransaction ledger
 *   3. Grant entitlement
 *
 * State machine:
 *   CREATED → VERIFIED → ENTITLEMENT_PENDING → ENTITLED
 */

const PaymentTransaction = require("../../models/PaymentTransaction");
const PaymentAttempt = require("../../models/PaymentAttempt");
const WebhookLog = require("../../models/WebhookLog");

const appleVerification = require("./appleVerification.service");
const razorpayVerification = require("./razorpayVerification.service");
const appleSubscriptionService = require("./appleSubscription.service");
const entitlementService = require("./entitlement.service");

function getStrategy(gateway) {
  if (gateway === "apple") return appleVerification;
  if (gateway === "razorpay") return razorpayVerification;
  throw new Error(`Unsupported gateway: ${gateway}`);
}

/**
 * Generate a unique internal transaction ID.
 */
function generateTransactionId() {
  return `txn_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

/**
 * Create a PaymentTransaction ledger entry for an Apple purchase.
 */
async function createAppleLedger({
  user,
  userModel,
  verificationResult,
  subscription,
  amount,
  currency,
}) {
  const v = verificationResult.normalizedVerificationData;

  const transaction = await PaymentTransaction.create({
    transactionId: generateTransactionId(),
    userId: user._id,
    userModel,
    gateway: "apple",
    externalTransactionId: v.transactionId, // transactionId from Apple (per-renewal)
    planId: v.planId,
    amount: amount || verificationResult.amount || 0,
    currency: currency || verificationResult.currency || "INR",
    status: "VERIFIED",
    verificationData: v,
    subscriptionId: subscription._id,
    processedAt: new Date(),
  });

  return transaction;
}

/**
 * Determine the purchase intent from the verification context.
 *
 * For Apple, we determine by checking if a subscription exists
 * for this originalTransactionId:
 *   - No subscription → "purchase" (first time)
 *   - Same user, existing subscription → "renewal"
 *   - Explicit restore flag → "restore"
 *
 * Client can also explicitly signal via `intent` field.
 */
async function resolvePurchaseIntent(user, verificationResult, explicitIntent) {
  if (explicitIntent === "restore") return "restore";

  const originalTransactionId = verificationResult.normalizedVerificationData?.originalTransactionId;
  if (!originalTransactionId) return "purchase";

  const existingSubscription = await appleSubscriptionService.findByOriginalTransactionId(originalTransactionId);
  if (!existingSubscription) return "purchase";

  if (String(existingSubscription.userId) !== String(user._id)) {
    return "ownership_conflict";
  }

  return "renewal";
}

/**
 * Main entry point for purchase verification (purchase + renewals).
 *
 * Handles first-time purchases and subsequent renewals/upgrades.
 * For explicit restores, use processRestore().
 */
async function processPurchase(user, userModel, gateway, payload, amount, currency, planId) {
  // 1. Log Attempt
  const attempt = await PaymentAttempt.create({
    userId: user._id,
    userModel,
    gateway,
    planId,
    amount: amount || 0,
    currency: currency || "INR",
    status: "STARTED",
  });

  try {
    // 2. Gateway-specific verification
    const strategy = getStrategy(gateway);
    const verificationResult = await strategy.verifyPurchase(payload);

    if (!verificationResult.success) {
      attempt.status = "FAILED";
      attempt.errorMessage = verificationResult.error;
      await attempt.save();
      return { success: false, error: verificationResult.error };
    }

    // 3. Route by gateway
    if (gateway === "apple") {
      return await processApplePurchase(user, userModel, verificationResult, attempt, amount, currency);
    }

    if (gateway === "razorpay") {
      return await processRazorpayPurchase(user, userModel, verificationResult, attempt);
    }

    throw new Error(`Unsupported gateway: ${gateway}`);
  } catch (error) {
    console.error("[Orchestrator] Exception:", error.message);
    attempt.status = "FAILED";
    attempt.errorMessage = error.message;
    await attempt.save();

    if (error.code === "SUBSCRIPTION_OWNERSHIP_CONFLICT") {
      return {
        success: false,
        error: error.message,
        code: "SUBSCRIPTION_OWNERSHIP_CONFLICT",
        status: 403,
      };
    }

    return { success: false, error: "Internal processing error." };
  }
}

/**
 * Process an Apple purchase (new subscription, renewal, or upgrade/downgrade).
 */
async function processApplePurchase(user, userModel, verificationResult, attempt, amount, currency) {
  const originalTransactionId = verificationResult.normalizedVerificationData.originalTransactionId;
  const existingSubscription = await appleSubscriptionService.findByOriginalTransactionId(originalTransactionId);

  let subscription;
  let isNew = false;
  let wasRenewal = false;
  let planChanged = false;

  if (!existingSubscription) {
    // First purchase — create new subscription
    const result = await appleSubscriptionService.createSubscription(verificationResult, user, userModel);
    subscription = result.subscription;
    isNew = result.isNew;
  } else {
    // Ownership guard
    if (String(existingSubscription.userId) !== String(user._id)) {
      attempt.status = "FAILED";
      attempt.errorMessage = "Subscription ownership conflict.";
      await attempt.save();

      const error = new Error("This Apple subscription is already linked to another account.");
      error.code = "SUBSCRIPTION_OWNERSHIP_CONFLICT";
      error.status = 403;
      throw error;
    }

    // Renewal or upgrade/downgrade
    const renewalResult = await appleSubscriptionService.handleRenewalOrChange(verificationResult, user);
    subscription = renewalResult.subscription;
    wasRenewal = renewalResult.wasRenewal;
    planChanged = renewalResult.planChanged;

    // If no change (same transaction idempotent re-verify), return existing ledger
    if (!renewalResult.updated) {
      const existingLedger = await PaymentTransaction.findOne({
        gateway: "apple",
        externalTransactionId: verificationResult.normalizedVerificationData.transactionId,
      });
      if (existingLedger) {
        attempt.status = "SUCCESS";
        attempt.transactionId = existingLedger._id;
        await attempt.save();

        return {
          success: true,
          idempotent: true,
          transactionId: existingLedger.transactionId,
          subscription: subscription.toObject ? subscription.toObject() : subscription,
        };
      }
    }
  }

  // Create immutable PaymentTransaction ledger entry
  const transaction = await createAppleLedger({
    user,
    userModel,
    verificationResult,
    subscription,
    amount,
    currency,
  });

  attempt.status = "SUCCESS";
  attempt.transactionId = transaction._id;
  await attempt.save();

  // Grant entitlement — derive membership from subscription
  transaction.status = "ENTITLEMENT_PENDING";
  await transaction.save();

  const entitlementResult = await entitlementService.grantEntitlement(transaction);

  if (entitlementResult.success) {
    transaction.status = "ENTITLED";
    transaction.processedAt = new Date();
    await transaction.save();
  } else {
    console.error(`[Orchestrator] Failed to grant entitlement for txn ${transaction.transactionId}:`, entitlementResult.error);
    return { success: false, error: "Payment verified but failed to grant access." };
  }

  return {
    success: true,
    transactionId: transaction.transactionId,
    subscription: subscription.toObject ? subscription.toObject() : subscription,
    isNew,
    wasRenewal,
    planChanged,
    planId: subscription.planId,
    status: subscription.status,
    membership: entitlementResult.membership || null,
  };
}

/**
 * Process a Razorpay purchase (unchanged existing flow).
 */
async function processRazorpayPurchase(user, userModel, verificationResult, attempt) {
  const { externalTransactionId, planId, amount, currency, normalizedVerificationData } = verificationResult;

  let transaction = await PaymentTransaction.findOne({
    gateway: "razorpay",
    externalTransactionId,
  });

  if (transaction) {
    // Already verified — return existing result
    attempt.status = "SUCCESS";
    attempt.transactionId = transaction._id;
    await attempt.save();

    if (transaction.status === "ENTITLED") {
      return { success: true, idempotent: true, transactionId: transaction.transactionId };
    }
  }

  if (!transaction) {
    transaction = await PaymentTransaction.create({
      transactionId: generateTransactionId(),
      userId: user._id,
      userModel,
      gateway: "razorpay",
      externalTransactionId,
      planId,
      amount,
      currency,
      status: "VERIFIED",
      verificationData: normalizedVerificationData,
    });
  }

  attempt.status = "SUCCESS";
  attempt.transactionId = transaction._id;
  await attempt.save();

  if (transaction.status === "VERIFIED" || transaction.status === "ENTITLEMENT_PENDING") {
    transaction.status = "ENTITLEMENT_PENDING";
    await transaction.save();

    const entitlementResult = await entitlementService.grantEntitlement(transaction);

    if (entitlementResult.success) {
      transaction.status = "ENTITLED";
      transaction.processedAt = new Date();
      await transaction.save();
    } else {
      console.error(`[Orchestrator] Failed to grant entitlement for txn ${transaction.transactionId}:`, entitlementResult.error);
      return { success: false, error: "Payment verified but failed to grant access." };
    }
  }

  return { success: true, transactionId: transaction.transactionId };
}

/**
 * Process a restore purchases request.
 *
 * Client calls this via "Restore Purchases" button in Flutter.
 * Different from processPurchase — explicitly indicates restoration intent.
 */
async function processRestore(user, userModel, gateway, payload) {
  if (gateway !== "apple") {
    return { success: false, error: "Restore is only supported for Apple subscriptions." };
  }

  try {
    // Verify receipt with Apple
    const verificationResult = await appleVerification.verifyPurchase(payload);

    if (!verificationResult.success) {
      return { success: false, error: verificationResult.error };
    }

    // Restore subscription
    const restoreResult = await appleSubscriptionService.restoreSubscription(verificationResult, user);
    const subscription = restoreResult.subscription;

    // If this was a new creation (subscription didn't exist before), create ledger
    if (restoreResult.subscription && !restoreResult.restored && restoreResult.wasSameUser !== false) {
      // createSubscription was called internally — create ledger
      const transaction = await createAppleLedger({
        user,
        userModel,
        verificationResult,
        subscription,
        amount: verificationResult.amount,
        currency: verificationResult.currency,
      });

      // Grant entitlement
      transaction.status = "ENTITLEMENT_PENDING";
      await transaction.save();

      const entitlementResult = await entitlementService.grantEntitlement(transaction);
      if (entitlementResult.success) {
        transaction.status = "ENTITLED";
        transaction.processedAt = new Date();
        await transaction.save();
      }

      return {
        success: true,
        restored: false,
        isNew: true,
        transactionId: transaction.transactionId,
        subscription: subscription.toObject ? subscription.toObject() : subscription,
        membership: entitlementResult.membership || null,
      };
    }

    // For existing subscriptions with new receipt data, create ledger + re-entitle
    if (restoreResult.restored) {
      const transaction = await createAppleLedger({
        user,
        userModel,
        verificationResult,
        subscription,
        amount: verificationResult.amount,
        currency: verificationResult.currency,
      });

      transaction.status = "ENTITLEMENT_PENDING";
      await transaction.save();

      const entitlementResult = await entitlementService.grantEntitlement(transaction);
      if (entitlementResult.success) {
        transaction.status = "ENTITLED";
        transaction.processedAt = new Date();
        await transaction.save();
      }

      return {
        success: true,
        restored: true,
        isNew: false,
        transactionId: transaction.transactionId,
        subscription: subscription.toObject ? subscription.toObject() : subscription,
        status: subscription.status,
        planId: subscription.planId,
        expiryDate: subscription.expiryDate,
        membership: entitlementResult.membership || null,
      };
    }

    return {
      success: true,
      restored: false,
      isNew: false,
      subscription: subscription.toObject ? subscription.toObject() : subscription,
    };
  } catch (error) {
    console.error("[Orchestrator] Restore exception:", error.message);

    if (error.code === "SUBSCRIPTION_OWNERSHIP_CONFLICT") {
      return {
        success: false,
        error: error.message,
        code: "SUBSCRIPTION_OWNERSHIP_CONFLICT",
        status: 403,
      };
    }

    return { success: false, error: "Restore processing error." };
  }
}

/**
 * Main entry point for webhooks.
 */
async function processWebhookEvent(gateway, webhookId, eventType, payload) {
  try {
    const existingLog = await WebhookLog.findOne({ gateway, webhookId });
    if (existingLog) {
      return { success: true, duplicate: true };
    }

    const log = await WebhookLog.create({
      gateway,
      webhookId,
      eventType,
      payload,
      status: "PENDING",
    });

    // For Apple webhooks, we delegate to the webhook service
    // The actual webhook route now calls appleWebhook.service.js directly
    // This method remains for Razorpay webhooks and backward compatibility
    if (gateway === "apple") {
      log.status = "PROCESSED";
      log.processedAt = new Date();
      await log.save();
      return { success: true, note: "Apple webhooks handled by dedicated service." };
    }

    const strategy = getStrategy(gateway);
    const eventResult = await strategy.processWebhook(payload);

    if (!eventResult.success) {
      log.status = "FAILED";
      log.error = eventResult.error;
      await log.save();
      return { success: false, error: eventResult.error };
    }

    log.status = "PROCESSED";
    log.externalTransactionId = eventResult.externalTransactionId || null;
    log.processedAt = new Date();
    await log.save();

    return { success: true };
  } catch (error) {
    console.error("[Orchestrator] Webhook Exception:", error.message);
    return { success: false, error: "Internal webhook processing error." };
  }
}

module.exports = {
  processPurchase,
  processRestore,
  processWebhookEvent,
  resolvePurchaseIntent,
};
