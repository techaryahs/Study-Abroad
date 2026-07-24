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

const mongoose = require("mongoose");
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
  session = null,
}) {
  const v = verificationResult.normalizedVerificationData;
  console.log(`[createAppleLedger] ENTER — extTxnId=${v.transactionId}, planId=${v.planId}, subscriptionId=${subscription._id}`);

  const [transaction] = await PaymentTransaction.create([{
    transactionId: generateTransactionId(),
    userId: user._id,
    userModel,
    gateway: "apple",
    externalTransactionId: v.transactionId,
    planId: v.planId,
    amount: amount || verificationResult.amount || 0,
    currency: currency || verificationResult.currency || "INR",
    status: "VERIFIED",
    verificationData: v,
    subscriptionId: subscription._id,
    processedAt: new Date(),
  }], { session });

  console.log(`[createAppleLedger] EXIT — created txnId=${transaction.transactionId}`);
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
  console.log("[Orchestrator] ========== PURCHASE PIPELINE START ==========");
  console.log(`[Orchestrator] STEP 1 — Request received: gateway=${gateway}, userId=${user._id}, planId=${planId}`);

  // Resolve userModel correctly (in case it is passed as a mongoose Model instead of a String)
  const resolvedUserModel = typeof userModel === "function" ? userModel.modelName : (userModel || "User");

  let attempt = null;

  try {
    // 1. Gateway-specific verification
    console.log("[Orchestrator] STEP 2 — Verifying with gateway...");
    const strategy = getStrategy(gateway);
    const verificationResult = await strategy.verifyPurchase(payload);

    if (!verificationResult.success) {
      console.error("[Orchestrator] STEP 2 FAILED — Verification error:", verificationResult.error);
      // We do not create a PaymentAttempt here because planId/amount might be unknown if Apple verification fails.
      return { success: false, error: verificationResult.error };
    }
    
    // Resolve planId from Apple verification if it was missing in the request
    const resolvedPlanId = planId || verificationResult.planId;
    
    console.log(`[Orchestrator] STEP 2 — Verification SUCCESS: originalTxnId=${verificationResult.normalizedVerificationData?.originalTransactionId}, planId=${resolvedPlanId}`);
    
    if (gateway === "apple") {
      console.log({
        productId: verificationResult.normalizedVerificationData?.productId,
        planId: verificationResult.planId,
      });
    }

    // 2. Log Attempt
    console.log("[Orchestrator] STEP 2b — Creating PaymentAttempt");
    
    const attemptData = {
      userId: user._id,
      userModel: resolvedUserModel,
      gateway,
      planId: resolvedPlanId,
      amount: amount || verificationResult.amount || 0,
      currency: currency || verificationResult.currency || "INR",
      status: "STARTED",
    };

    if (gateway === "apple" && verificationResult.normalizedVerificationData) {
      attemptData.appleProductId = verificationResult.normalizedVerificationData.productId;
      attemptData.originalTransactionId = verificationResult.normalizedVerificationData.originalTransactionId;
      attemptData.externalTransactionId = verificationResult.normalizedVerificationData.transactionId;
      attemptData.environment = verificationResult.normalizedVerificationData.environment;
    }

    // Check if PaymentAttempt already exists (idempotency guard)
    if (gateway === "apple" && attemptData.externalTransactionId) {
      attempt = await PaymentAttempt.findOne({
        gateway: "apple",
        externalTransactionId: attemptData.externalTransactionId,
      });
    }

    if (!attempt) {
      attempt = await PaymentAttempt.create(attemptData);
    }

    // 3. Route by gateway
    if (gateway === "apple") {
      console.log("[Orchestrator] STEP 3 — Starting MongoDB transaction for Apple purchase...");
      const session = await mongoose.startSession();
      try {
        let result;
        await session.withTransaction(async () => {
          // Pass resolvedUserModel down to avoid mongoose model serialization issues
          result = await processApplePurchase(user, resolvedUserModel, verificationResult, attempt, amount, currency, session);
        });
        console.log("[Orchestrator] STEP 7 — Transaction COMMITTED successfully");
        console.log("[Orchestrator] ========== PURCHASE PIPELINE SUCCESS ==========");
        return result;
      } catch (txnErr) {
        console.error("[Orchestrator] TRANSACTION ABORTED:", txnErr.message);
        console.error("[Orchestrator] TRANSACTION STACK:", txnErr.stack);
        throw txnErr;
      } finally {
        session.endSession();
      }
    }

    if (gateway === "razorpay") {
      return await processRazorpayPurchase(user, resolvedUserModel, verificationResult, attempt);
    }

    throw new Error(`Unsupported gateway: ${gateway}`);
  } catch (error) {
    console.error("==== [Orchestrator] PURCHASE FAILED ====");
    console.error("Error:", error.message);
    console.error("Code:", error.code);
    console.error("Stack:", error.stack);
    
    if (attempt) {
      attempt.status = "FAILED";
      attempt.errorMessage = error.message;
      await attempt.save();
    }

    if (error.code === "SUBSCRIPTION_OWNERSHIP_CONFLICT") {
      return {
        success: false,
        error: error.message,
        code: "SUBSCRIPTION_OWNERSHIP_CONFLICT",
        status: 403,
      };
    }

    throw error; // Let Express surface the real error
  }
}

/**
 * Process an Apple purchase (new subscription, renewal, or upgrade/downgrade).
 */
async function processApplePurchase(user, userModel, verificationResult, attempt, amount, currency, session = null) {
  const originalTransactionId = verificationResult.normalizedVerificationData.originalTransactionId;
  console.log(`[Orchestrator] STEP 3a — Looking up subscription for originalTxnId=${originalTransactionId}`);
  const existingSubscription = await appleSubscriptionService.findByOriginalTransactionId(originalTransactionId, session);

  let subscription;
  let isNew = false;
  let wasRenewal = false;
  let planChanged = false;

  if (!existingSubscription) {
    // First purchase — create new subscription
    console.log("[Orchestrator] STEP 3b — No existing subscription, creating NEW...");
    const result = await appleSubscriptionService.createSubscription(verificationResult, user, userModel, session);
    subscription = result.subscription;
    isNew = result.isNew;
    console.log(`[Orchestrator] STEP 3b — Subscription CREATED: _id=${subscription._id}, isNew=${isNew}`);
  } else {
    console.log(`[Orchestrator] STEP 3b — Existing subscription found: _id=${existingSubscription._id}, owner=${existingSubscription.userId}`);
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
    console.log("[Orchestrator] STEP 3c — Processing renewal/change...");
    const renewalResult = await appleSubscriptionService.handleRenewalOrChange(verificationResult, user, session);
    subscription = renewalResult.subscription;
    wasRenewal = renewalResult.wasRenewal;
    planChanged = renewalResult.planChanged;
    console.log(`[Orchestrator] STEP 3c — Renewal result: wasRenewal=${wasRenewal}, planChanged=${planChanged}, updated=${renewalResult.updated}`);

    // If no change (same transaction idempotent re-verify), return existing ledger
    if (!renewalResult.updated) {
      const existingLedger = await PaymentTransaction.findOne({
        gateway: "apple",
        externalTransactionId: verificationResult.normalizedVerificationData.transactionId,
      }).session(session);
      if (existingLedger) {
        console.log(`[Orchestrator] STEP 3c — Idempotent hit, returning existing ledger: ${existingLedger.transactionId}`);
        attempt.status = "SUCCESS";
        attempt.paymentTransactionId = existingLedger._id;
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
  console.log("[Orchestrator] STEP 4 — Creating PaymentTransaction ledger...");
  const transaction = await createAppleLedger({
    user,
    userModel,
    verificationResult,
    subscription,
    amount,
    currency,
    session,
  });
  console.log(`[Orchestrator] STEP 4 — Ledger CREATED: txnId=${transaction.transactionId}, extTxnId=${transaction.externalTransactionId}`);

  attempt.status = "SUCCESS";
  attempt.paymentTransactionId = transaction._id;
  await attempt.save({ session });

  // Grant entitlement — derive membership from subscription
  console.log("[Orchestrator] STEP 5 — Granting entitlement...");
  transaction.status = "ENTITLEMENT_PENDING";
  await transaction.save({ session });

  const entitlementResult = await entitlementService.grantEntitlement(transaction, session);

  if (entitlementResult.success) {
    console.log(`[Orchestrator] STEP 5 — Entitlement GRANTED: transition=${entitlementResult.transitionType}`);
    transaction.status = "ENTITLED";
    transaction.processedAt = new Date();
    await transaction.save({ session });
    console.log("[Orchestrator] STEP 6 — Transaction status set to ENTITLED");
  } else {
    console.error(`[Orchestrator] STEP 5 FAILED — Entitlement error:`, entitlementResult.error);
    throw new Error("Payment verified but failed to grant access.");
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
    attempt.paymentTransactionId = transaction._id;
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
  attempt.paymentTransactionId = transaction._id;
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

    const session = await mongoose.startSession();
    try {
      let finalResult;
      await session.withTransaction(async () => {
        // Restore subscription
        const restoreResult = await appleSubscriptionService.restoreSubscription(verificationResult, user, session);
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
            session,
          });

          // Grant entitlement
          transaction.status = "ENTITLEMENT_PENDING";
          await transaction.save({ session });

          const entitlementResult = await entitlementService.grantEntitlement(transaction, session, {
            intent: "restoration",
          });
          if (entitlementResult.success) {
            transaction.status = "ENTITLED";
            transaction.processedAt = new Date();
            await transaction.save({ session });
          } else {
            throw new Error("Restore verified but failed to grant access.");
          }

          finalResult = {
            success: true,
            restored: false,
            isNew: true,
            transactionId: transaction.transactionId,
            subscription: subscription.toObject ? subscription.toObject() : subscription,
            membership: entitlementResult.membership || null,
          };
          return;
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
            session,
          });

          transaction.status = "ENTITLEMENT_PENDING";
          await transaction.save({ session });

          const entitlementResult = await entitlementService.grantEntitlement(transaction, session, {
            intent: "restoration",
          });
          if (entitlementResult.success) {
            transaction.status = "ENTITLED";
            transaction.processedAt = new Date();
            await transaction.save({ session });
          } else {
            throw new Error("Restore verified but failed to grant access.");
          }

          finalResult = {
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
          return;
        }

        finalResult = {
          success: true,
          restored: false,
          isNew: false,
          subscription: subscription.toObject ? subscription.toObject() : subscription,
        };
      });
      return finalResult;
    } finally {
      session.endSession();
    }
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
