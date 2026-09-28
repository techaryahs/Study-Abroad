/**
 * P3 — Authorization Service
 *
 * Unified API for checking feature access and remaining limits.
 */

const MembershipPlan = require("../../models/MembershipPlan");
const usageService = require("./usage.service");

/**
 * Searches the MembershipPlan's entitlement maps for a specific feature.
 *
 * @param {Object} plan - The MembershipPlan document
 * @param {String} feature - The feature key (e.g., 'ai_credits')
 * @returns {Object|null} The entitlement config or null if not found
 */
function findEntitlementConfig(plan, feature) {
  if (!plan || !plan.entitlements) return null;

  const categories = ["ai", "human", "access"];
  for (const cat of categories) {
    if (plan.entitlements[cat] && plan.entitlements[cat].has(feature)) {
      return plan.entitlements[cat].get(feature);
    }
  }
  return null;
}

/**
 * Merges toggle logic and usage logic into a single authorization call.
 *
 * @param {Object} user - The mongoose user document (must contain .membership)
 * @param {String} feature - The feature key (e.g., 'resume_builder')
 * @returns {Object} { allowed: Boolean, remaining: Number, reason: String|null }
 */
async function authorize(user, feature) {
  // 1. Basic Lifecycle Check
  if (!user.membership) {
    return { allowed: false, remaining: 0, reason: "No membership found" };
  }

  const status = user.membership.status;
  if (status !== "active" && status !== "grace_period") {
    return { allowed: false, remaining: 0, reason: `Membership is ${status}` };
  }

  const planId = user.membership.planId;
  if (!planId || planId === "free") {
    return { allowed: false, remaining: 0, reason: "Feature requires a paid plan" };
  }

  // 2. Fetch Catalog Plan
  const plan = await MembershipPlan.findOne({ planId }).lean();
  if (!plan) {
    return { allowed: false, remaining: 0, reason: "Membership plan not found" };
  }

  if (plan.allAccess) {
    return { allowed: true, remaining: -1, reason: null };
  }

  // 3. Feature Toggle Check
  const entitlementConfig = findEntitlementConfig(plan, feature);
  
  if (!entitlementConfig) {
    return { allowed: false, remaining: 0, reason: "Feature not included in this plan" };
  }

  if (entitlementConfig.enabled === false) {
    return { allowed: false, remaining: 0, reason: "Feature is disabled for this plan" };
  }

  // 4. Usage Limit Check
  // If the catalog limit is undefined or explicitly null, we treat it as unlimited.
  // Wait, in UserMembership.usage, the 'limit' is copied from the catalog when granted.
  // We should read the limit from the user's usage map to support overrides or carry-overs.
  const usagePreview = usageService.preview(user, feature);

  // If the feature isn't tracked in usage map yet but is enabled in the catalog, 
  // it might be a purely access-based feature with no numerical limit.
  // If limit in catalog was null/undefined, it's unlimited.
  let limit = usagePreview.limit;
  if (limit === 0 && user.membership.usage && !user.membership.usage.has(feature)) {
     // Not in usage map. Check catalog definition.
     if (entitlementConfig.limit == null) {
       limit = -1; // Unlimited
     } else {
       limit = entitlementConfig.limit; 
     }
  }

  if (limit === -1) {
    return { allowed: true, remaining: -1, reason: null };
  }

  const used = usagePreview.used || 0;
  const remaining = Math.max(0, limit - used);

  if (remaining <= 0) {
    return { allowed: false, remaining: 0, reason: "Usage limit reached" };
  }

  return { allowed: true, remaining, reason: null };
}

module.exports = {
  authorize
};
