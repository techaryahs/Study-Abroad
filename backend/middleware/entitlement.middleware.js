const Student = require("../models/Student");
const MembershipPlan = require("../models/MembershipPlan");

/**
 * Validates if the user has access to a specific feature based on their membership.
 * Does NOT decrement usage. Usage should be decremented atomically upon success.
 * @param {String} category - 'ai', 'human', or 'access'
 * @param {String} featureId - e.g., 'ai_sop', 'consultation'
 */
const requireEntitlement = (category, featureId) => {
  return async (req, res, next) => {
    try {
      const userId = req.user._id || req.user.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized. No user ID found." });
      }

      const student = await Student.findById(userId);
      if (!student) {
        return res.status(401).json({ message: "User not found." });
      }

      const userMembership = student.membership;
      if (!userMembership || userMembership.status === 'none') {
        return res.status(403).json({ message: `Access denied to ${featureId}. No active membership.` });
      }

      if (userMembership.status !== 'active' && userMembership.status !== 'grace_period') {
        return res.status(403).json({ message: `Membership status is ${userMembership.status}.` });
      }

      const plan = await MembershipPlan.findOne({ planId: userMembership.planId });
      if (!plan) {
        return res.status(403).json({ message: "Membership plan not found." });
      }

      if (plan.allAccess) {
        req.student = student;
        req.plan = plan;
        return next();
      }

      const categoryEntitlements = plan.entitlements[category];
      if (!categoryEntitlements || !categoryEntitlements.get(featureId)) {
        return res.status(403).json({ message: `Access denied. Feature ${featureId} not included in your plan.` });
      }

      const entitlement = categoryEntitlements.get(featureId);
      if (!entitlement.enabled) {
        return res.status(403).json({ message: `Feature ${featureId} is disabled in your plan.` });
      }

      if (entitlement.accessDays != null && userMembership.purchaseDate != null) {
        const msPerDay = 1000 * 60 * 60 * 24;
        const daysSincePurchase = Math.floor((Date.now() - userMembership.purchaseDate.getTime()) / msPerDay);
        if (daysSincePurchase > entitlement.accessDays) {
          return res.status(403).json({ message: `Access to ${featureId} expired after ${entitlement.accessDays} days.` });
        }
      }

      if (entitlement.limit != null) {
        let usage = userMembership.usage.get(featureId);
        if (!usage) {
          usage = { used: 0, lastUsedAt: null };
          userMembership.usage.set(featureId, usage);
        }
        if (usage.used >= entitlement.limit) {
          return res.status(403).json({ message: `Usage limit reached for ${featureId}. Limit: ${entitlement.limit}.` });
        }
      }

      // Validated successfully
      req.student = student;
      req.plan = plan;
      next();
    } catch (error) {
      console.error(`Entitlement check error for ${featureId}:`, error);
      res.status(500).json({ message: "Server error validating entitlements." });
    }
  };
};

module.exports = requireEntitlement;
