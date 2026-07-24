/**
 * MembershipLifecycle — single source of truth for membership state evaluation.
 *
 * Authorization MUST use this module. Do not duplicate expiry/status checks elsewhere.
 *
 * Lifecycle (stored + effective):
 *   pending → active → grace_period (optional) → expired | cancelled | none
 *
 * Critical rule: expiryDate is evaluated at runtime. Stored status alone is never enough.
 * If expiryDate has passed, effective status becomes expired (unless within optional grace).
 */

const MembershipPlan = require("../models/MembershipPlan");

/** Optional post-expiry grace window (days). 0 = no calendar grace beyond status. */
const GRACE_PERIOD_DAYS = Number(process.env.MEMBERSHIP_GRACE_DAYS || 0);

const PLAN_RANK = {
  free: 0,
  starter: 10,
  essential: 20,
  premium: 30,
  elite: 40,
};

/**
 * Canonical MembershipHistory.transitionType values.
 * Single source of truth — schema enum and all writers must use these.
 *
 * Do NOT invent display labels (Activated, Renewed, Revoked, Expired, …).
 */
const TRANSITION_TYPES = Object.freeze({
  INITIAL_PURCHASE: "initial_purchase",
  RENEWAL: "renewal",
  UPGRADE: "upgrade",
  DOWNGRADE: "downgrade",
  RESTORATION: "restoration",
  CANCELLATION: "cancellation",
});

/** Array form for Mongoose `enum` (order matches object insertion). */
const TRANSITION_TYPE_VALUES = Object.freeze(Object.values(TRANSITION_TYPES));

/**
 * Non-purchase lifecycle events → canonical transitionType.
 * Prefer resolveHistoryTransitionType() at write sites.
 */
const LIFECYCLE_TRANSITION = Object.freeze({
  /** Paid period ended; membership enters grace (plan may still be set). */
  PERIOD_ENDED: TRANSITION_TYPES.CANCELLATION,
  /** Access removed (hard expire after grace, refund, admin revoke). */
  ACCESS_REVOKED: TRANSITION_TYPES.CANCELLATION,
  /** Store "Restore Purchases" re-linked an existing entitlement. */
  RESTORED: TRANSITION_TYPES.RESTORATION,
});

/**
 * @typedef {Object} LifecycleResult
 * @property {string} planId
 * @property {string} storedStatus - as on the document
 * @property {string} effectiveStatus - after runtime expiry evaluation
 * @property {boolean} isAccessAllowed - may use paid entitlements
 * @property {Date|null} expiryDate
 * @property {Date|null} purchaseDate
 * @property {boolean} isCalendarExpired
 * @property {boolean} shouldPersistStatus - stored status should be updated to effective
 * @property {string|null} denyReason - if !isAccessAllowed
 */

/**
 * Normalize a date-like value to Date or null.
 * @param {unknown} value
 * @returns {Date|null}
 */
function toDate(value) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Resolve purchase date from any historical / dual-written field name.
 * @param {object|null|undefined} membership
 * @returns {Date|null}
 */
function resolvePurchaseDate(membership) {
  if (!membership || typeof membership !== "object") return null;
  return (
    toDate(membership.purchaseDate) ||
    toDate(membership.purchasedAt) ||
    toDate(membership.activatedAt) ||
    toDate(membership.paymentDate) ||
    null
  );
}

/**
 * Resolve expiry date from any historical / dual-written field name.
 * @param {object|null|undefined} membership
 * @returns {Date|null}
 */
function resolveExpiryDate(membership) {
  if (!membership || typeof membership !== "object") return null;
  return toDate(membership.expiryDate) || toDate(membership.expiresAt) || null;
}

/**
 * Serialize membership for API responses with stable field names for clients.
 * Prefer canonical purchaseDate/expiryDate; include aliases for older clients.
 * Never invent catalog prices — only return stored purchase metadata.
 *
 * @param {object|null|undefined} membership
 * @returns {object|null}
 */
function serializeMembership(membership) {
  if (!membership || typeof membership !== "object") return null;

  // Support Mongoose subdocs and plain objects
  const raw =
    typeof membership.toObject === "function"
      ? membership.toObject({ flattenMaps: true })
      : membership;

  const purchaseDate = resolvePurchaseDate(raw);
  const expiryDate = resolveExpiryDate(raw);
  const paymentDate = toDate(raw.paymentDate) || purchaseDate;

  let usage = raw.usage;
  if (usage instanceof Map) {
    usage = Object.fromEntries(usage.entries());
  } else if (usage && typeof usage === "object") {
    usage = { ...usage };
  } else {
    usage = {};
  }

  return {
    planId: raw.planId || "free",
    catalogVersion: raw.catalogVersion ?? 1,
    status: raw.status || "none",
    platform: raw.platform || "none",
    productId: raw.productId || null,
    transactionId: raw.transactionId || null,
    // Canonical
    purchaseDate: purchaseDate ? purchaseDate.toISOString() : null,
    expiryDate: expiryDate ? expiryDate.toISOString() : null,
    // Aliases (Flutter / older API consumers)
    purchasedAt: purchaseDate ? purchaseDate.toISOString() : null,
    activatedAt: purchaseDate ? purchaseDate.toISOString() : null,
    expiresAt: expiryDate ? expiryDate.toISOString() : null,
    // Payment metadata from the purchase record (not catalog)
    amountPaid: typeof raw.amountPaid === "number" ? raw.amountPaid : null,
    currency: raw.currency || null,
    paymentStatus: raw.paymentStatus || null,
    paymentDate: paymentDate ? paymentDate.toISOString() : null,
    autoRenew: Boolean(raw.autoRenew),
    usage,
  };
}

/**
 * Compute membership period end for a plan type from a base date.
 * @param {object} plan - MembershipPlan doc
 * @param {Date} baseDate
 * @returns {Date|null}
 */
function computePeriodEnd(plan, baseDate = new Date()) {
  if (!plan || !plan.type) return null;
  const base = new Date(baseDate);

  if (plan.type === "one_time" || plan.type === "lifetime") {
    return null; // no calendar end at membership level
  }
  if (plan.type === "yearly") {
    const d = new Date(base);
    d.setFullYear(d.getFullYear() + 1);
    return d;
  }
  if (plan.type === "monthly") {
    const d = new Date(base);
    d.setMonth(d.getMonth() + 1);
    return d;
  }
  return null;
}

/**
 * Renewal: extend from max(now, previousExpiry). New purchase / upgrade: from now.
 * @param {object} plan
 * @param {object|null} previousMembership
 * @param {string} newPlanId
 * @returns {Date|null}
 */
function computeExpiryForProvision(plan, previousMembership, newPlanId) {
  const now = new Date();
  if (!plan) return null;

  if (plan.type === "one_time" || plan.type === "lifetime") {
    return null;
  }

  let base = now;
  const prevPlanId = previousMembership?.planId;
  const prevExpiry = resolveExpiryDate(previousMembership);

  // Same plan renewal while still valid: stack time from previous expiry
  if (prevPlanId && prevPlanId === newPlanId && prevExpiry && prevExpiry > now) {
    base = prevExpiry;
  }

  return computePeriodEnd(plan, base);
}

/**
 * Classify plan-change transition for history logging (purchase / provision path).
 * @param {string} fromPlanId
 * @param {string} toPlanId
 * @returns {'initial_purchase'|'renewal'|'upgrade'|'downgrade'}
 */
function classifyTransition(fromPlanId, toPlanId) {
  const from = fromPlanId && fromPlanId !== "free" ? fromPlanId : null;
  if (!from) return TRANSITION_TYPES.INITIAL_PURCHASE;
  if (from === toPlanId) return TRANSITION_TYPES.RENEWAL;
  const fromRank = PLAN_RANK[from] ?? 0;
  const toRank = PLAN_RANK[toPlanId] ?? 0;
  if (toRank > fromRank) return TRANSITION_TYPES.UPGRADE;
  if (toRank < fromRank) return TRANSITION_TYPES.DOWNGRADE;
  return TRANSITION_TYPES.UPGRADE;
}

/**
 * Resolve MembershipHistory.transitionType for any history write.
 * All create/update sites should go through this or classifyTransition.
 *
 * @param {'purchase'|'period_ended'|'access_revoked'|'restoration'} kind
 * @param {{ fromPlanId?: string, toPlanId?: string }} [ctx] - required for kind === 'purchase'
 * @returns {string} one of TRANSITION_TYPE_VALUES
 */
function resolveHistoryTransitionType(kind, ctx = {}) {
  switch (kind) {
    case "purchase":
      return classifyTransition(ctx.fromPlanId, ctx.toPlanId);
    case "period_ended":
      return LIFECYCLE_TRANSITION.PERIOD_ENDED;
    case "access_revoked":
      return LIFECYCLE_TRANSITION.ACCESS_REVOKED;
    case "restoration":
      return LIFECYCLE_TRANSITION.RESTORED;
    default:
      throw new Error(`Unknown membership history transition kind: ${kind}`);
  }
}

/**
 * Pure evaluation of membership for authorization.
 * Does not write to the database.
 *
 * @param {object|null|undefined} membership - Student.membership (or plain object)
 * @param {Date} [now]
 * @returns {LifecycleResult}
 */
function evaluateMembership(membership, now = new Date()) {
  const empty = {
    planId: "free",
    storedStatus: "none",
    effectiveStatus: "none",
    isAccessAllowed: false,
    expiryDate: null,
    purchaseDate: null,
    isCalendarExpired: false,
    shouldPersistStatus: false,
    denyReason: "No membership.",
  };

  if (!membership || typeof membership !== "object") {
    return empty;
  }

  // Mongoose subdoc or plain — accept dual-written field names
  const planId = membership.planId || "free";
  const storedStatus = membership.status || "none";
  const expiryDate = resolveExpiryDate(membership);
  const purchaseDate = resolvePurchaseDate(membership);

  if (!planId || planId === "free") {
    return {
      ...empty,
      planId: planId || "free",
      storedStatus,
      effectiveStatus: storedStatus === "cancelled" ? "cancelled" : "none",
      denyReason: "No paid membership plan.",
    };
  }

  if (storedStatus === "cancelled") {
    return {
      planId,
      storedStatus,
      effectiveStatus: "cancelled",
      isAccessAllowed: false,
      expiryDate,
      purchaseDate,
      isCalendarExpired: false,
      shouldPersistStatus: false,
      denyReason: "Membership cancelled.",
    };
  }

  if (storedStatus === "none" || storedStatus === "pending") {
    return {
      planId,
      storedStatus,
      effectiveStatus: storedStatus,
      isAccessAllowed: false,
      expiryDate,
      purchaseDate,
      isCalendarExpired: false,
      shouldPersistStatus: false,
      denyReason:
        storedStatus === "pending"
          ? "Membership pending activation."
          : "No active membership.",
    };
  }

  // Calendar expiry — source of truth independent of stored status
  const isCalendarExpired = Boolean(expiryDate && expiryDate.getTime() <= now.getTime());

  if (isCalendarExpired) {
    // Optional grace: only if explicitly still in grace_period status AND within GRACE_PERIOD_DAYS after expiry
    if (storedStatus === "grace_period" && GRACE_PERIOD_DAYS > 0 && expiryDate) {
      const graceEnd = new Date(expiryDate);
      graceEnd.setDate(graceEnd.getDate() + GRACE_PERIOD_DAYS);
      if (now.getTime() <= graceEnd.getTime()) {
        return {
          planId,
          storedStatus,
          effectiveStatus: "grace_period",
          isAccessAllowed: true,
          expiryDate,
          purchaseDate,
          isCalendarExpired: true,
          shouldPersistStatus: false,
          denyReason: null,
        };
      }
    }

    return {
      planId,
      storedStatus,
      effectiveStatus: "expired",
      isAccessAllowed: false,
      expiryDate,
      purchaseDate,
      isCalendarExpired: true,
      shouldPersistStatus: storedStatus !== "expired",
      denyReason: "Membership expired.",
    };
  }

  // Not calendar-expired
  if (storedStatus === "expired") {
    // Stored expired but date still in future is inconsistent — trust date (not expired by calendar)
    // If no expiryDate and status expired, deny
    if (!expiryDate) {
      return {
        planId,
        storedStatus,
        effectiveStatus: "expired",
        isAccessAllowed: false,
        expiryDate,
        purchaseDate,
        isCalendarExpired: false,
        shouldPersistStatus: false,
        denyReason: "Membership expired.",
      };
    }
  }

  if (storedStatus === "active" || storedStatus === "grace_period") {
    return {
      planId,
      storedStatus,
      effectiveStatus: storedStatus,
      isAccessAllowed: true,
      expiryDate,
      purchaseDate,
      isCalendarExpired: false,
      shouldPersistStatus: false,
      denyReason: null,
    };
  }

  // Unknown / unexpected stored status → fail closed
  return {
    planId,
    storedStatus,
    effectiveStatus: storedStatus || "none",
    isAccessAllowed: false,
    expiryDate,
    purchaseDate,
    isCalendarExpired: false,
    shouldPersistStatus: false,
    denyReason: `Membership status is ${storedStatus || "unknown"}.`,
  };
}

/**
 * Apply runtime evaluation onto a user document's membership.
 * Optionally persists status flip to expired when calendar end has passed.
 *
 * @param {object} user - Mongoose user/student with membership
 * @param {{ persist?: boolean, session?: object }} [options]
 * @returns {Promise<LifecycleResult>}
 */
async function applyLifecycleToUser(user, options = {}) {
  const { persist = true, session = null } = options;
  if (!user) {
    return evaluateMembership(null);
  }

  if (!user.membership) {
    user.membership = { planId: "free", status: "none" };
  }

  const result = evaluateMembership(user.membership);

  if (persist && result.shouldPersistStatus && result.effectiveStatus === "expired") {
    user.membership.status = "expired";
    if (typeof user.markModified === "function") {
      user.markModified("membership");
    }
    if (typeof user.save === "function") {
      try {
        await user.save(session ? { session } : undefined);
      } catch (saveErr) {
        // Non-fatal: evaluation still correct for this request
        console.warn("[MembershipLifecycle] persist expired status failed:", saveErr.message);
      }
    }
  }

  return result;
}

/**
 * Authorization pre-check used by middleware and utilities.
 * @param {object|null} membership
 * @returns {{ allowed: boolean, lifecycle: LifecycleResult }}
 */
function assertMembershipAllowsAccess(membership) {
  const lifecycle = evaluateMembership(membership);
  return {
    allowed: lifecycle.isAccessAllowed,
    lifecycle,
  };
}

/**
 * Build usage map from plan entitlements (limits only).
 * Renewal resets counters only when entitlement.renewal matches the plan period.
 * Plan changes preserve overlapping used counts, capped to the new limit.
 * @param {object} plan
 * @param {object|null} previousMembership
 * @param {string} transitionType
 * @returns {Object}
 */
function buildUsageMapFromPlan(plan, previousMembership = null, transitionType = TRANSITION_TYPES.INITIAL_PURCHASE) {
  const usageMap = {};
  if (!plan || !plan.entitlements) return usageMap;

  const previousUsage = previousMembership?.usage;
  const getPreviousUsage = (featureId) => {
    if (!previousUsage || !featureId) return null;
    if (typeof previousUsage.get === "function") return previousUsage.get(featureId);
    return previousUsage[featureId] || null;
  };

  const shouldReset = (entitlement) => {
    if (transitionType === "initial_purchase") return true;
    if (transitionType !== "renewal") return false;
    if (!entitlement || entitlement.renewal == null) return false;
    return entitlement.renewal === plan.type;
  };

  for (const category of ["ai", "human", "access"]) {
    const bag = plan.entitlements[category];
    if (!bag) continue;

    // Map or plain object
    const entries =
      typeof bag.entries === "function"
        ? Array.from(bag.entries())
        : Object.entries(bag.toObject ? bag.toObject() : bag);

    for (const [featureId, entitlement] of entries) {
      if (entitlement && entitlement.limit != null) {
        const limit = Math.max(0, Number(entitlement.limit));
        const previous = getPreviousUsage(featureId);
        const previousUsed = Number.isFinite(Number(previous?.used))
          ? Math.max(0, Number(previous.used))
          : 0;
        const used = shouldReset(entitlement)
          ? 0
          : Math.min(previousUsed, limit);

        usageMap[featureId] = {
          used,
          remaining: Math.max(0, limit - used),
          lastUsedAt: used > 0 ? previous?.lastUsedAt || null : null,
        };
      }
    }
  }
  return usageMap;
}

/**
 * Validates and enforces used + remaining == limit for all metered entitlements during membership writes.
 */
function validateMembershipUsage(usageMap) {
  if (!usageMap) return usageMap;
  const entries =
    typeof usageMap.entries === "function"
      ? Array.from(usageMap.entries())
      : Object.entries(usageMap.toObject ? usageMap.toObject() : usageMap);

  for (const [featureId, record] of entries) {
    if (record && record.limit != null && record.limit > 0) {
      const limit = Math.max(0, Number(record.limit));
      const used = Number.isFinite(Number(record.used)) ? Math.max(0, Number(record.used)) : 0;
      const remaining = Number.isFinite(Number(record.remaining)) ? Number(record.remaining) : -1;

      if (used + remaining !== limit) {
        const validUsed = Math.min(used, limit);
        const validRemaining = Math.max(0, limit - validUsed);
        if (typeof usageMap.set === "function") {
          usageMap.set(featureId, {
            ...record,
            used: validUsed,
            remaining: validRemaining,
            limit,
          });
        } else {
          usageMap[featureId] = {
            ...record,
            used: validUsed,
            remaining: validRemaining,
            limit,
          };
        }
      }
    }
  }
  return usageMap;
}

/**
 * Apply a purchased plan onto user.membership (provision / renew / upgrade / downgrade).
 * Does not save history/events — caller (payment controller) owns that.
 *
 * Purchase metadata (dates, amount, transaction) is written from the payment —
 * never from the plan catalog list price alone (amount must be passed in meta).
 *
 * @param {object} user
 * @param {object} plan - MembershipPlan document
 * @param {{
 *   platform: string,
 *   transactionId: string,
 *   productId?: string,
 *   amountPaid?: number,
 *   currency?: string,
 *   paymentStatus?: string,
 *   paymentDate?: Date|string,
 * }} meta
 * @returns {{ transitionType: string, previousPlanId: string, lifecycle: LifecycleResult }}
 */
function applyPlanToMembership(user, plan, meta) {
  if (!user.membership) user.membership = {};

  const previous = {
    planId: user.membership.planId || "free",
    status: user.membership.status,
    expiryDate: resolveExpiryDate(user.membership),
    usage: user.membership.usage,
  };

  const transitionType = classifyTransition(previous.planId, plan.planId);
  const expiryDate = computeExpiryForProvision(plan, user.membership, plan.planId);
  const usageMap = buildUsageMapFromPlan(plan, previous, transitionType);
  const now = new Date();
  const paymentDate = toDate(meta.paymentDate) || now;

  user.membership.planId = plan.planId;
  user.membership.catalogVersion = plan.version || 1;
  user.membership.status = "active";
  user.membership.platform = meta.platform || "none";
  user.membership.transactionId = meta.transactionId;
  if (meta.productId) user.membership.productId = meta.productId;

  // Dual-write canonical + alias date fields so all readers see purchase metadata
  user.membership.purchaseDate = now;
  user.membership.activatedAt = now;
  user.membership.expiryDate = expiryDate;
  user.membership.expiresAt = expiryDate;

  // Amount actually paid for this purchase (from payment verification, not catalog)
  if (meta.amountPaid != null && meta.amountPaid !== "") {
    const paid = Number(meta.amountPaid);
    if (!Number.isNaN(paid)) {
      user.membership.amountPaid = paid;
    }
  }
  if (meta.currency) {
    user.membership.currency = String(meta.currency);
  }
  user.membership.paymentStatus = meta.paymentStatus || "paid";
  user.membership.paymentDate = paymentDate;
  user.membership.autoRenew = plan.type === "yearly" || plan.type === "monthly";
  user.membership.usage = validateMembershipUsage(usageMap);

  if (typeof user.markModified === "function") {
    user.markModified("membership");
  }

  const lifecycle = evaluateMembership(user.membership);
  return {
    transitionType,
    previousPlanId: previous.planId,
    lifecycle,
  };
}

/**
 * Load plan by planId (active preferred).
 * @param {string} planId
 * @param {object} [session]
 */
async function loadActivePlan(planId, session = null) {
  const q = MembershipPlan.findOne({ planId, isActive: true });
  if (session) q.session(session);
  return q;
}

module.exports = {
  GRACE_PERIOD_DAYS,
  PLAN_RANK,
  TRANSITION_TYPES,
  TRANSITION_TYPE_VALUES,
  LIFECYCLE_TRANSITION,
  evaluateMembership,
  applyLifecycleToUser,
  assertMembershipAllowsAccess,
  computePeriodEnd,
  computeExpiryForProvision,
  classifyTransition,
  resolveHistoryTransitionType,
  buildUsageMapFromPlan,
  applyPlanToMembership,
  loadActivePlan,
  toDate,
  resolvePurchaseDate,
  resolveExpiryDate,
  serializeMembership,
};
