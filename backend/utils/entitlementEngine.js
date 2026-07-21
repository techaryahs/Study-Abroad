const MembershipPlan = require("../models/MembershipPlan");
const Service = require("../models/Service");
const {
  applyLifecycleToUser,
  evaluateMembership,
} = require("./membershipLifecycle");

const ENTITLEMENT_CATEGORIES = ["ai", "human", "access"];

function denyResult(reason, extra = {}) {
  return {
    allowed: false,
    reason,
    ...extra,
  };
}

function entitlementToObject(entitlement) {
  if (!entitlement) return null;
  return typeof entitlement.toObject === "function"
    ? entitlement.toObject()
    : entitlement;
}

function getPlanEntitlement(plan, featureId, category) {
  if (!plan || !featureId || !category) return null;
  if (!ENTITLEMENT_CATEGORIES.includes(category)) return null;

  const bag = plan.entitlements?.[category];
  if (!bag) return null;

  if (typeof bag.get === "function") {
    return entitlementToObject(bag.get(featureId));
  }

  const plainBag = typeof bag.toObject === "function" ? bag.toObject() : bag;
  return entitlementToObject(plainBag?.[featureId]);
}

function planGrantsFeature(plan, featureId, category) {
  const entitlement = getPlanEntitlement(plan, featureId, category);
  return Boolean(entitlement && entitlement.enabled !== false);
}

function getUsageEntry(membership, featureId) {
  if (!membership?.usage || !featureId) return null;
  if (typeof membership.usage.get === "function") {
    return membership.usage.get(featureId);
  }
  return membership.usage[featureId] || null;
}

function accessDaysExpired(entitlement, membership, now = new Date()) {
  if (!entitlement || entitlement.accessDays == null) return false;
  const purchaseDate = membership?.purchaseDate;
  if (!purchaseDate) return false;

  const purchase = new Date(purchaseDate);
  if (Number.isNaN(purchase.getTime())) return false;

  const daysSince = Math.floor(
    (now.getTime() - purchase.getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysSince > entitlement.accessDays;
}

async function loadActiveService(featureId) {
  if (!featureId) return null;
  return Service.findOne({ serviceId: featureId, isActive: true }).lean();
}

async function loadActivePlan(planId) {
  if (!planId || planId === "free") return null;
  return MembershipPlan.findOne({ planId, isActive: true });
}

async function requiredPlan(featureId, options = {}) {
  const service = options.service || (await loadActiveService(featureId));
  if (!service) return null;

  const plans =
    options.plans ||
    (await MembershipPlan.find({ isActive: true }).sort({
      sortOrder: 1,
      price: 1,
    }));

  return (
    plans.find((plan) =>
      planGrantsFeature(plan, service.serviceId, service.category)
    ) || null
  );
}

function remainingUsageFromEntitlement({ membership, featureId, entitlement }) {
  if (!entitlement || entitlement.enabled === false) {
    return { remaining: 0, used: 0, limit: 0, unlimited: false, knownUsage: false };
  }

  if (entitlement.limit == null) {
    return { remaining: null, used: null, limit: null, unlimited: true, knownUsage: true };
  }

  const usage = getUsageEntry(membership, featureId);
  const limit = Math.max(0, Number(entitlement.limit));

  // Missing usage record is normal for users who purchased before
  // a catalog update added new metered services, or if usage was
  // never initialized. Treat as fresh (0 used, full remaining).
  if (!usage) {
    return {
      remaining: limit,
      used: 0,
      limit,
      unlimited: false,
      knownUsage: true,
    };
  }

  const usedNumber = Number(usage.used);
  const remainingNumber = Number(usage.remaining);

  // Structurally invalid usage record — fail closed
  if (
    !Number.isFinite(usedNumber) ||
    !Number.isFinite(remainingNumber) ||
    usedNumber < 0 ||
    remainingNumber < 0 ||
    usedNumber > limit ||
    remainingNumber > limit ||
    usedNumber + remainingNumber !== limit
  ) {
    return {
      remaining: 0,
      used: Number.isFinite(usedNumber) ? Math.max(0, usedNumber) : 0,
      limit,
      unlimited: false,
      knownUsage: false,
      reason: "Unknown usage.",
    };
  }

  const used = Math.max(0, usedNumber);
  const remaining = Math.max(0, Math.min(limit, remainingNumber));

  return {
    remaining,
    used,
    limit,
    unlimited: false,
    knownUsage: true,
  };
}

async function remainingUsage(featureId, options = {}) {
  const service = options.service || (await loadActiveService(featureId));
  if (!service) {
    return {
      featureId,
      knownFeature: false,
      remaining: 0,
      used: 0,
      limit: 0,
      unlimited: false,
      reason: "Unknown feature.",
    };
  }

  const membership = options.membership || options.student?.membership || null;
  const lifecycle = options.lifecycle || evaluateMembership(membership);
  if (!lifecycle.isAccessAllowed) {
    return {
      featureId,
      knownFeature: true,
      remaining: 0,
      used: 0,
      limit: 0,
      unlimited: false,
      reason: lifecycle.denyReason || "Inactive membership.",
    };
  }

  const plan = options.plan || (await loadActivePlan(lifecycle.planId));
  if (!plan) {
    return {
      featureId,
      knownFeature: true,
      remaining: 0,
      used: 0,
      limit: 0,
      unlimited: false,
      reason: "Unknown plan.",
    };
  }

  const entitlement = getPlanEntitlement(plan, service.serviceId, service.category);
  if (!entitlement || entitlement.enabled === false) {
    return {
      featureId,
      knownFeature: true,
      remaining: 0,
      used: 0,
      limit: 0,
      unlimited: false,
      reason: "Entitlement not granted.",
    };
  }

  if (accessDaysExpired(entitlement, membership)) {
    return {
      featureId,
      knownFeature: true,
      remaining: 0,
      used: 0,
      limit: entitlement.limit ?? null,
      unlimited: false,
      reason: "Feature access window expired.",
    };
  }

  return {
    featureId,
    knownFeature: true,
    ...remainingUsageFromEntitlement({
      membership,
      featureId: service.serviceId,
      entitlement,
    }),
    reason: null,
  };
}

async function canAccess(featureId, options = {}) {
  const service = options.service || (await loadActiveService(featureId));
  if (!service) {
    return denyResult("Unknown feature.", {
      featureId,
      code: "UNKNOWN_FEATURE",
    });
  }

  if (options.category && service.category !== options.category) {
    return denyResult("Feature category mismatch.", {
      featureId: service.serviceId,
      category: options.category,
      actualCategory: service.category,
      code: "UNKNOWN_FEATURE",
    });
  }

  const membership = options.membership || options.student?.membership || null;
  const lifecycle = options.lifecycle || evaluateMembership(membership);

  if (!lifecycle.isAccessAllowed) {
    return denyResult(lifecycle.denyReason || "Inactive membership.", {
      featureId: service.serviceId,
      category: service.category,
      membershipStatus: lifecycle.effectiveStatus,
      planId: lifecycle.planId,
      code: "UNKNOWN_MEMBERSHIP",
    });
  }

  const plan = options.plan || (await loadActivePlan(lifecycle.planId));
  if (!plan) {
    return denyResult("Unknown plan.", {
      featureId: service.serviceId,
      category: service.category,
      planId: lifecycle.planId,
      code: "UNKNOWN_PLAN",
    });
  }

  const entitlement = getPlanEntitlement(plan, service.serviceId, service.category);
  if (!entitlement || entitlement.enabled === false) {
    return denyResult("Entitlement not granted.", {
      featureId: service.serviceId,
      category: service.category,
      planId: plan.planId,
      code: "ENTITLEMENT_DENIED",
    });
  }

  if (accessDaysExpired(entitlement, membership)) {
    return denyResult("Feature access window expired.", {
      featureId: service.serviceId,
      category: service.category,
      planId: plan.planId,
      code: "ACCESS_WINDOW_EXPIRED",
    });
  }

  const usage = remainingUsageFromEntitlement({
    membership,
    featureId: service.serviceId,
    entitlement,
  });

  if (!usage.knownUsage) {
    return denyResult(usage.reason || "Unknown usage.", {
      featureId: service.serviceId,
      category: service.category,
      planId: plan.planId,
      code: "UNKNOWN_USAGE",
      ...usage,
    });
  }

  if (options.checkUsage !== false && !usage.unlimited && usage.remaining <= 0) {
    return denyResult("Usage limit reached.", {
      featureId: service.serviceId,
      category: service.category,
      planId: plan.planId,
      code: "USAGE_LIMIT_REACHED",
      ...usage,
    });
  }

  return {
    allowed: true,
    reason: null,
    featureId: service.serviceId,
    category: service.category,
    planId: plan.planId,
    entitlement,
    ...usage,
  };
}

async function buildAccessSummary(student, options = {}) {
  const membership = student?.membership || null;
  const lifecycle = options.lifecycle || evaluateMembership(membership);
  const plan = lifecycle.isAccessAllowed
    ? await loadActivePlan(lifecycle.planId)
    : null;
  const services = await Service.find({ isActive: true }).sort({
    category: 1,
    requiredPlanTier: 1,
    name: 1,
  }).lean();
  const plans = await MembershipPlan.find({ isActive: true }).sort({
    sortOrder: 1,
    price: 1,
  });

  // Lazy backfill: if the user has an active plan, detect missing usage
  // entries for metered entitlements and persist them so future checks
  // never encounter a missing record again.
  if (plan && lifecycle.isAccessAllowed && membership) {
    const {
      buildUsageMapFromPlan,
    } = require("./membershipLifecycle");
    const expectedUsage = buildUsageMapFromPlan(plan, membership, "initial_purchase");
    let needsSave = false;
    for (const [featureId, entry] of Object.entries(expectedUsage)) {
      if (!getUsageEntry(membership, featureId)) {
        if (!membership.usage) membership.usage = {};
        if (typeof membership.usage.set === "function") {
          membership.usage.set(featureId, entry);
        } else {
          membership.usage[featureId] = entry;
        }
        needsSave = true;
      }
    }
    if (needsSave && typeof student.markModified === "function") {
      student.markModified("membership");
      try {
        await student.save();
      } catch (saveErr) {
        // Non-fatal: access check results are still correct for this request
        console.warn("[buildAccessSummary] usage backfill save failed:", saveErr.message);
      }
    }
  }

  const features = {};
  for (const service of services) {
    const required = await requiredPlan(service.serviceId, { service, plans });
    const access = await canAccess(service.serviceId, {
      service,
      student,
      membership,
      lifecycle,
      plan,
      checkUsage: true,
    });

    features[service.serviceId] = {
      serviceId: service.serviceId,
      name: service.name,
      category: service.category,
      canAccess: access.allowed,
      reason: access.reason,
      code: access.code || null,
      requiredPlanId: required?.planId || null,
      remaining: access.remaining ?? 0,
      used: access.used ?? null,
      limit: access.limit ?? null,
      unlimited: Boolean(access.unlimited),
    };
  }

  return {
    generatedAt: new Date().toISOString(),
    planId: lifecycle.planId,
    currentPlanId: plan?.planId || null,
    membershipStatus: lifecycle.effectiveStatus,
    isAccessAllowed: lifecycle.isAccessAllowed && Boolean(plan),
    denyReason: plan ? lifecycle.denyReason : lifecycle.denyReason || "Unknown plan.",
    features,
  };
}

module.exports = {
  ENTITLEMENT_CATEGORIES,
  applyLifecycleToUser,
  canAccess,
  remainingUsage,
  requiredPlan,
  planGrantsFeature,
  getPlanEntitlement,
  buildAccessSummary,
};
