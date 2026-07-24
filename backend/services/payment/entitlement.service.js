/**
 * P3 — Entitlement Service (Updated for Apple Subscriptions)
 *
 * Translates a verified PaymentTransaction into a UserMembership.
 * Payment-agnostic — no gateways, no receipts.
 *
 * Apple flow: Derives membership from AppleSubscription
 *   (expiry, productId, autoRenew, status) rather than
 *   client-supplied or transaction-level fields.
 *
 * Razorpay flow: Unchanged — derives from transaction + plan catalog.
 */

const User = require("../../models/User");
const Student = require("../../models/Student");
const MembershipPlan = require("../../models/MembershipPlan");
const MembershipHistory = require("../../models/MembershipHistory");
const AppleSubscription = require("../../models/AppleSubscription");
const { resolveHistoryTransitionType } = require("../../utils/membershipLifecycle");

async function findUser(userId, userModelName, session = null) {
  if (userModelName === "Student") {
    return Student.findById(userId).session(session);
  }
  return User.findById(userId).session(session);
}

/**
 * Parses Catalog Plan Entitlements and maps them to User Usage limits.
 */
function extractUsageLimits(plan) {
  const usageMap = {};
  if (!plan || !plan.entitlements) return usageMap;

  const categories = ["ai", "human", "access"];
  for (const cat of categories) {
    if (plan.entitlements[cat]) {
      const bag = plan.entitlements[cat];
      const entries =
        typeof bag.entries === "function"
          ? Array.from(bag.entries())
          : Object.entries(bag.toObject ? bag.toObject() : bag);

      for (const [featureKey, config] of entries) {
        const cfg = typeof config === "object" ? config : { enabled: false };
        if (cfg.enabled !== false) {
          const limit = cfg.limit == null ? -1 : Math.max(0, Number(cfg.limit));
          const used = 0;
          const remaining = limit === -1 ? 0 : Math.max(0, limit - used);
          usageMap[featureKey] = {
            used,
            remaining,
            limit,
            lastUsedAt: null,
          };
        }
      }
    }
  }
  return usageMap;
}

/**
 * Derive membership metadata from the Apple Subscription for Apple purchases.
 *
 * Returns null if transaction has no linked subscription (Razorpay path).
 */
async function deriveFromAppleSubscription(transaction, session = null) {
  console.log(`[Entitlement] ENTER deriveFromAppleSubscription — gateway=${transaction.gateway}, subscriptionId=${transaction.subscriptionId}`);
  if (transaction.gateway !== "apple" || !transaction.subscriptionId) {
    console.log("[Entitlement] EXIT deriveFromAppleSubscription — skipped (not apple or no subscriptionId)");
    return null;
  }

  const subscription = await AppleSubscription.findById(transaction.subscriptionId).session(session);
  if (!subscription) {
    console.warn(`[Entitlement] Apple transaction ${transaction.transactionId} references missing subscription ${transaction.subscriptionId}`);
    return null;
  }

  console.log(`[Entitlement] EXIT deriveFromAppleSubscription — productId=${subscription.productId}, expiryDate=${subscription.expiryDate}, status=${subscription.status}`);
  return {
    platform: "apple_iap",
    transactionId: subscription.latestTransactionId,
    productId: subscription.productId,
    expiryDate: subscription.expiryDate,
    purchaseDate: subscription.purchaseDate,
    autoRenew: subscription.autoRenewStatus === "on",
    amountPaid: transaction.amount,
    currency: transaction.currency,
    paymentStatus: subscription.status === "active" || subscription.status === "grace_period" ? "paid" : subscription.status,
    paymentDate: subscription.purchaseDate,
  };
}

/**
 * Grants or extends a membership based on a successful transaction.
 *
 * For Apple transactions: derives expiry, productId, autoRenew from
 * the AppleSubscription — never from client or transaction alone.
 *
 * @param {Object} transaction - The VERIFIED PaymentTransaction document
 * @param {import("mongoose").ClientSession|null} [session]
 * @param {{ intent?: 'purchase'|'restoration' }} [options]
 *   intent "restoration" forces transitionType restoration (Restore Purchases path).
 * @returns {Object} result - { success, user, membership, transitionType }
 */
async function grantEntitlement(transaction, session = null, options = {}) {
  console.log(`[Entitlement] ENTER grantEntitlement — txnId=${transaction.transactionId}, gateway=${transaction.gateway}, planId=${transaction.planId}, userId=${transaction.userId}`);
  try {
    const user = await findUser(transaction.userId, transaction.userModel, session);
    if (!user) {
      console.error("[Entitlement] EXIT grantEntitlement — User not found");
      return { success: false, error: "User not found" };
    }
    console.log(`[Entitlement] User found: _id=${user._id}, currentPlan=${user.membership?.planId || "none"}, currentStatus=${user.membership?.status || "none"}`);

    const plan = await MembershipPlan.findOne({ planId: transaction.planId }).session(session);
    if (!plan) {
      console.error(`[Entitlement] EXIT grantEntitlement — Plan not found: ${transaction.planId}`);
      return { success: false, error: "Membership plan not found" };
    }
    console.log(`[Entitlement] Plan found: planId=${plan.planId}, type=${plan.type}, price=${plan.price}`);

    // Initialize membership object if missing
    if (!user.membership) {
      user.membership = { status: "none", planId: "free", usage: new Map() };
    }

    // Check for duplicate provisioning
    if (String(user.membership.transactionId) === String(transaction.transactionId)) {
      return { success: true, duplicate: true, user };
    }

    const previousPlanId = user.membership.planId || "free";

    // Canonical MembershipHistory enum — single source of truth
    const transitionType =
      options.intent === "restoration"
        ? resolveHistoryTransitionType("restoration")
        : resolveHistoryTransitionType("purchase", {
            fromPlanId: previousPlanId,
            toPlanId: plan.planId,
          });

    // Derive from AppleSubscription if this is an Apple purchase
    const appleMeta = await deriveFromAppleSubscription(transaction, session);

    // Apply the pure business fields
    user.membership.planId = plan.planId;
    user.membership.status = "active";
    user.membership.platform = transaction.gateway || user.membership.platform || "none";

    // Transaction ID: use subscription's latestTransactionId for Apple path
    if (appleMeta) {
      user.membership.transactionId = appleMeta.transactionId;
      user.membership.productId = appleMeta.productId;
    } else {
      user.membership.transactionId = transaction.transactionId;
      if (transaction.productId || plan.appleProductId) {
        user.membership.productId = transaction.productId || plan.appleProductId;
      }
    }

    user.membership.catalogVersion = plan.version || 1;

    // Dates — use Apple subscription dates when available
    const now = new Date();
    let purchaseDate = now;
    let expiryDate = null;

    if (appleMeta && appleMeta.purchaseDate) {
      purchaseDate = new Date(appleMeta.purchaseDate);
    }
    user.membership.purchaseDate = purchaseDate;
    user.membership.activatedAt = purchaseDate;
    user.membership.paymentDate = transaction.processedAt || now;

    // Expiry: Apple subscription expiry > plan-based computation
    if (appleMeta && appleMeta.expiryDate) {
      expiryDate = new Date(appleMeta.expiryDate);
    } else if (plan.type === "one_time" || plan.type === "lifetime") {
      expiryDate = null;
    } else if (plan.type === "yearly") {
      expiryDate = new Date(purchaseDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else if (plan.type === "monthly") {
      expiryDate = new Date(purchaseDate);
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else {
      const durationDays = plan.durationDays || 365;
      expiryDate = new Date(purchaseDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
    }
    user.membership.expiryDate = expiryDate;
    user.membership.expiresAt = expiryDate;
    user.membership.autoRenew = appleMeta ? appleMeta.autoRenew : (plan.type === "yearly" || plan.type === "monthly");

    // Amount and currency
    if (typeof transaction.amount === "number") {
      user.membership.amountPaid = transaction.amount;
    }
    if (transaction.currency) {
      user.membership.currency = transaction.currency;
    }
    user.membership.paymentStatus =
      transaction.status === "ENTITLED" || transaction.status === "VERIFIED"
        ? "paid"
        : String(transaction.status || "paid").toLowerCase();

    // Set usage limits from catalog
    user.membership.usage = extractUsageLimits(plan);

    console.log(`[Entitlement] Saving user membership — planId=${plan.planId}, status=active, expiryDate=${expiryDate}`);
    await user.save({ session });
    console.log("[Entitlement] User membership saved successfully.");

    // Log history
    console.log("[Entitlement] Creating MembershipHistory...");
    const targetHistoryTxnId = appleMeta ? appleMeta.transactionId : transaction.transactionId;
    const historyPlatform = transaction.gateway === "apple" ? "apple_iap" : "razorpay";

    let finalHistoryTxnId = targetHistoryTxnId;
    if (targetHistoryTxnId) {
      const existingHistory = await MembershipHistory.findOne({
        platform: historyPlatform,
        transactionId: targetHistoryTxnId,
      }).session(session);

      if (existingHistory) {
        finalHistoryTxnId = `${targetHistoryTxnId}_restore_${Date.now()}`;
      }
    }

    const [history] = await MembershipHistory.create([{
      userId: user._id,
      userModel: transaction.userModel,
      fromPlanId: previousPlanId === "free" ? null : previousPlanId,
      toPlanId: plan.planId,
      transitionType,
      platform: historyPlatform,
      transactionId: finalHistoryTxnId,
    }], { session });

    if (!user.membership.history) user.membership.history = [];
    user.membership.history.push(history._id);
    await user.save({ session });

    console.log(`[Entitlement] EXIT grantEntitlement — SUCCESS: transition=${transitionType}`);
    return {
      success: true,
      user,
      transitionType,
      membership: {
        planId: plan.planId,
        status: user.membership.status,
        purchaseDate: user.membership.purchaseDate,
        expiryDate: user.membership.expiryDate,
        platform: user.membership.platform,
        autoRenew: user.membership.autoRenew,
        productId: user.membership.productId,
      },
    };
  } catch (error) {
    console.error("[Entitlement] EXIT grantEntitlement — EXCEPTION:", error.message);
    console.error("[Entitlement] Stack:", error.stack);
    throw error; // Re-throw so the transaction can abort
  }
}

/**
 * Revokes access (e.g. after a refund or cancellation grace period expires).
 */
async function revokeEntitlement(userId, userModelName) {
  const user = await findUser(userId, userModelName);
  if (!user) return false;

  if (user.membership) {
    const previousPlanId = user.membership.planId;
    user.membership.status = "revoked";
    user.membership.planId = "free";
    user.membership.expiresAt = new Date();
    await user.save();

    const history = await MembershipHistory.create({
      userId: user._id,
      userModel: userModelName,
      fromPlanId: previousPlanId === "free" ? null : previousPlanId,
      toPlanId: "free",
      transitionType: resolveHistoryTransitionType("access_revoked"),
    });
    if (!user.membership.history) user.membership.history = [];
    user.membership.history.push(history._id);
    await user.save();
  }
  return true;
}

module.exports = {
  grantEntitlement,
  revokeEntitlement,
};
