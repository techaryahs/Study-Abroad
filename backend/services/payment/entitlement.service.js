/**
 * P3 — Entitlement Service
 *
 * Strictly responsible for translating a verified PaymentTransaction into a UserMembership.
 * Remains payment-agnostic (no gateways, no receipts).
 */

const User = require("../../models/User");
const Student = require("../../models/Student");
const MembershipPlan = require("../../models/MembershipPlan");
const MembershipHistory = require("../../models/MembershipHistory");

async function findUser(userId, userModelName) {
  if (userModelName === "Student") {
    return Student.findById(userId);
  }
  return User.findById(userId);
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
      for (const [featureKey, config] of plan.entitlements[cat].entries()) {
        if (config.enabled) {
           // -1 denotes unlimited
           usageMap[featureKey] = {
             used: 0,
             limit: config.limit == null ? -1 : config.limit,
             lastUsedAt: null
           };
        }
      }
    }
  }
  return usageMap;
}

/**
 * Grants or extends a membership based on a successful transaction.
 *
 * @param {Object} transaction - The VERIFIED PaymentTransaction document
 * @returns {Object} result - { success, user }
 */
async function grantEntitlement(transaction) {
  try {
    const user = await findUser(transaction.userId, transaction.userModel);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    const plan = await MembershipPlan.findOne({ planId: transaction.planId });
    if (!plan) {
      return { success: false, error: "Membership plan not found" };
    }

    // Initialize membership object if missing
    if (!user.membership) {
      user.membership = { status: "none", planId: "free", usage: new Map() };
    }

    // Check for duplicate provisioning
    if (String(user.membership.transactionId) === String(transaction.transactionId)) {
      return { success: true, duplicate: true, user };
    }

    const previousPlanId = user.membership.planId || "free";
    
    let transitionType = "Activated";
    if (previousPlanId !== "free" && previousPlanId === plan.planId) {
      transitionType = "Renewed";
    } else if (previousPlanId !== "free") {
      transitionType = "Upgraded/Downgraded"; 
    }

    // Apply the pure business fields
    user.membership.planId = plan.planId;
    user.membership.status = "active";
    user.membership.transactionId = transaction.transactionId;
    user.membership.platform = transaction.gateway || user.membership.platform || "none";
    if (transaction.productId || plan.appleProductId) {
      user.membership.productId = transaction.productId || plan.appleProductId;
    }
    user.membership.catalogVersion = plan.version || 1;

    // Dates — dual-write canonical + alias fields
    const now = new Date();
    user.membership.purchaseDate = now;
    user.membership.activatedAt = now;
    user.membership.paymentDate = transaction.processedAt || now;

    // Expiry: respect plan type (lifetime/one_time → null; else duration)
    let expiry = null;
    if (plan.type === "one_time" || plan.type === "lifetime") {
      expiry = null;
    } else if (plan.type === "yearly") {
      expiry = new Date(now);
      expiry.setFullYear(expiry.getFullYear() + 1);
    } else if (plan.type === "monthly") {
      expiry = new Date(now);
      expiry.setMonth(expiry.getMonth() + 1);
    } else {
      const durationDays = plan.durationDays || 365;
      expiry = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);
    }
    user.membership.expiryDate = expiry;
    user.membership.expiresAt = expiry;
    user.membership.autoRenew = plan.type === "yearly" || plan.type === "monthly";

    // Amount actually paid (from verified transaction — not catalog list price alone)
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

    await user.save();

    // Log History (Lightweight, only transitions)
    const history = await MembershipHistory.create({
      userId: user._id,
      userModel: transaction.userModel,
      fromPlanId: previousPlanId === "free" ? null : previousPlanId,
      toPlanId: plan.planId,
      transitionType,
      platform: transaction.gateway, 
      transactionId: transaction.transactionId,
    });

    if (!user.membership.history) user.membership.history = [];
    user.membership.history.push(history._id);
    await user.save();

    return { success: true, user, transitionType };
  } catch (error) {
    console.error("[EntitlementService] Error granting entitlement:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Revokes access (e.g. after a refund or cancellation grace period expires)
 */
async function revokeEntitlement(userId, userModelName) {
  const user = await findUser(userId, userModelName);
  if (!user) return false;

  if (user.membership) {
    user.membership.status = "revoked";
    user.membership.planId = "free";
    user.membership.expiresAt = new Date(); 
    await user.save();
    
    const history = await MembershipHistory.create({
      userId: user._id,
      userModel: userModelName,
      fromPlanId: user.membership.planId,
      toPlanId: "free",
      transitionType: "Revoked"
    });
    user.membership.history.push(history._id);
    await user.save();
  }
  return true;
}

module.exports = {
  grantEntitlement,
  revokeEntitlement
};
