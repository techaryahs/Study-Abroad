/**
 * Membership authorization middleware.
 *
 * Backend is the final authority. All feature decisions are delegated to
 * utils/entitlementEngine.js, which reads MembershipPlan.entitlements only.
 */

const Student = require("../models/Student");
const {
  applyLifecycleToUser,
  canAccess,
  remainingUsage,
} = require("../utils/entitlementEngine");
const MembershipPlan = require("../models/MembershipPlan");

async function loadAndRefreshMembership(req) {
  const userId = req.user?._id || req.user?.id;
  if (!userId) {
    return {
      ok: false,
      status: 401,
      body: { message: "Unauthorized. No user ID found." },
    };
  }

  if (req.student && req.membershipLifecycle && req.plan !== undefined) {
    return { ok: true };
  }

  const student = await Student.findById(userId);
  if (!student) {
    return {
      ok: false,
      status: 401,
      body: { message: "User not found. Membership is available for student accounts." },
    };
  }

  const lifecycle = await applyLifecycleToUser(student, { persist: true });
  const plan =
    lifecycle.isAccessAllowed && lifecycle.planId && lifecycle.planId !== "free"
      ? await MembershipPlan.findOne({ planId: lifecycle.planId, isActive: true })
      : null;

  req.student = student;
  req.membership = student.membership;
  req.membershipLifecycle = lifecycle;
  req.plan = plan;

  return { ok: true };
}

function deny(res, status, message, extra = {}) {
  return res.status(status).json({ message, ...extra });
}

function requireMembership() {
  return async (req, res, next) => {
    try {
      const loaded = await loadAndRefreshMembership(req);
      if (!loaded.ok) {
        return deny(res, loaded.status, loaded.body.message);
      }

      const lifecycle = req.membershipLifecycle;
      if (!lifecycle.isAccessAllowed) {
        return deny(res, 403, lifecycle.denyReason || "Inactive membership.", {
          membershipStatus: lifecycle.effectiveStatus,
          planId: lifecycle.planId,
        });
      }

      if (!req.plan) {
        return deny(res, 403, "Unknown plan.", {
          membershipStatus: lifecycle.effectiveStatus,
          planId: lifecycle.planId,
        });
      }

      next();
    } catch (err) {
      console.error("[requireMembership]", err);
      return deny(res, 500, "Server error validating membership.");
    }
  };
}

function requireEntitlement(category, featureId) {
  if (!category || !featureId) {
    throw new Error("requireEntitlement(category, featureId) requires both arguments");
  }

  return async (req, res, next) => {
    try {
      const loaded = await loadAndRefreshMembership(req);
      if (!loaded.ok) {
        return deny(res, loaded.status, loaded.body.message);
      }

      const access = await canAccess(featureId, {
        category,
        student: req.student,
        membership: req.membership,
        lifecycle: req.membershipLifecycle,
        plan: req.plan,
        checkUsage: false,
      });

      if (!access.allowed) {
        return deny(res, 403, access.reason || "Entitlement denied.", {
          featureId,
          category,
          planId: access.planId || req.membershipLifecycle?.planId,
          membershipStatus: req.membershipLifecycle?.effectiveStatus,
          code: access.code || "ENTITLEMENT_DENIED",
        });
      }

      req.entitlement = {
        ...access.entitlement,
        featureId: access.featureId,
        category: access.category,
      };
      next();
    } catch (err) {
      console.error(`[requireEntitlement ${category}/${featureId}]`, err);
      return deny(res, 500, "Server error validating entitlements.");
    }
  };
}

function requireUsage(featureId) {
  if (!featureId) {
    throw new Error("requireUsage(featureId) requires featureId");
  }

  return async (req, res, next) => {
    try {
      const loaded = await loadAndRefreshMembership(req);
      if (!loaded.ok) {
        return deny(res, loaded.status, loaded.body.message);
      }

      const usage = await remainingUsage(featureId, {
        student: req.student,
        membership: req.membership,
        lifecycle: req.membershipLifecycle,
        plan: req.plan,
      });

      if (!usage.unlimited && usage.remaining <= 0) {
        return deny(res, 403, usage.reason || `Usage limit reached for ${featureId}.`, {
          featureId,
          used: usage.used,
          limit: usage.limit,
          remaining: usage.remaining,
        });
      }

      req.usageSnapshot = usage;
      next();
    } catch (err) {
      console.error(`[requireUsage ${featureId}]`, err);
      return deny(res, 500, "Server error validating usage.");
    }
  };
}

function requirePaidFeature(category, featureId) {
  return [
    requireMembership(),
    requireEntitlement(category, featureId),
    requireUsage(featureId),
  ];
}

module.exports = {
  requireMembership,
  requireEntitlement,
  requireUsage,
  requirePaidFeature,
  loadAndRefreshMembership,
};
