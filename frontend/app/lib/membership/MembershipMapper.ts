import {
  MembershipPlan,
  Service,
  MembershipCatalog,
  Membership,
  MembershipStatus,
  MembershipEntitlement,
  EntitlementAccessType,
  PlanEntitlementsMap,
  PlanFeatureEntitlement,
} from '@/types/membership';

const ACTIVE_STATUSES = new Set(['active', 'trialing', 'grace_period']);

type RawRecord = Record<string, unknown>;

function asRecord(value: unknown): RawRecord | null {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as RawRecord;
  }
  return null;
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && !Number.isNaN(value) ? value : fallback;
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

/**
 * Normalize one category bag (Map-like or plain object) into featureId → PlanFeatureEntitlement
 */
function mapFeatureBag(raw: unknown): Record<string, PlanFeatureEntitlement> {
  const out: Record<string, PlanFeatureEntitlement> = {};
  if (!raw || typeof raw !== 'object') return out;

  let entries: [string, unknown][] = [];
  if (raw instanceof Map) {
    entries = Array.from(raw.entries()) as [string, unknown][];
  } else {
    entries = Object.entries(raw as Record<string, unknown>);
  }

  for (const [featureId, spec] of entries) {
    if (!featureId || !spec || typeof spec !== 'object') continue;
    const s = spec as Record<string, unknown>;
    // Mongoose may nest as { enabled, limit, ... }
    out[featureId] = {
      enabled: s.enabled === undefined ? true : Boolean(s.enabled),
      limit: typeof s.limit === 'number' ? s.limit : undefined,
      accessDays: typeof s.accessDays === 'number' ? s.accessDays : undefined,
      renewal: typeof s.renewal === 'string' ? s.renewal : undefined,
    };
  }
  return out;
}

function mapPlanEntitlements(raw: unknown): PlanEntitlementsMap {
  const bag = asRecord(raw);
  if (!bag) return {};

  const result: PlanEntitlementsMap = {};
  for (const category of Object.keys(bag)) {
    result[category] = mapFeatureBag(bag[category]);
  }
  return result;
}

export class MembershipMapper {
  /**
   * Safely maps the raw backend catalog response into a strict UI model
   */
  static mapCatalog(rawBackendData: unknown): MembershipCatalog {
    const data = asRecord(rawBackendData);
    if (!data) return { plans: [], services: [] };

    const plans = Array.isArray(data.plans)
      ? data.plans
          .filter((p) => p != null)
          .map(MembershipMapper.mapPlan)
          .filter((p: MembershipPlan) => Boolean(p.id) && p.id !== 'unknown')
      : [];

    const services = Array.isArray(data.services)
      ? data.services
          .filter((s) => s != null)
          .map(MembershipMapper.mapService)
          .filter((s: Service) => Boolean(s.id) && s.id !== 'unknown')
      : [];

    return { plans, services };
  }

  /**
   * Safely maps a single raw backend plan to the MembershipPlan interface
   */
  static mapPlan(rawPlan: unknown): MembershipPlan {
    const plan = asRecord(rawPlan);
    if (!plan) {
      return {
        id: 'unknown',
        name: 'Unknown Plan',
        description: '',
        price: 0,
        currency: 'INR',
        interval: 'one_time',
        isPopular: false,
        badge: null,
        benefits: [],
        entitlements: {},
      };
    }

    const id = asString(plan.planId) || asString(plan.id);

    const intervalRaw = asString(plan.type, 'one_time');
    const interval =
      intervalRaw === 'month' || intervalRaw === 'yearly' || intervalRaw === 'one_time'
        ? intervalRaw
        : 'one_time';

    return {
      id,
      name: asString(plan.name, 'Unknown Plan'),
      description: asString(plan.description),
      price: asNumber(plan.price),
      currency: asString(plan.currency, 'INR'),
      interval,
      intervalCount: typeof plan.intervalCount === 'number' ? plan.intervalCount : undefined,
      isPopular: asBoolean(plan.recommended),
      badge: typeof plan.badge === 'string' ? plan.badge : null,
      benefits: Array.isArray(plan.benefits)
        ? plan.benefits.filter((b): b is string => typeof b === 'string')
        : [],
      entitlements: mapPlanEntitlements(plan.entitlements),
    };
  }

  static mapService(rawService: unknown): Service {
    const service = asRecord(rawService);
    if (!service) {
      return {
        id: 'unknown',
        name: 'Unknown Service',
        category: 'unknown',
        requiresConsultant: false,
        requiredPlanTier: 'free',
        isActive: false,
      };
    }

    const id = asString(service.serviceId) || asString(service.id);

    return {
      id,
      name: asString(service.name, 'Unknown Service'),
      category: asString(service.category, 'unknown'),
      requiresConsultant: asBoolean(service.requiresConsultant),
      requiredPlanTier: asString(service.requiredPlanTier, 'free'),
      isActive: service.isActive === undefined ? true : asBoolean(service.isActive, true),
    };
  }

  static mapMembership(rawMembership: unknown, userId?: string): Membership | null {
    const membership = asRecord(rawMembership);
    if (!membership) return null;

    const status = MembershipMapper.normalizeStatus(membership.status);

    const entitlements = MembershipMapper.mapUsageToEntitlements(
      membership.usage,
      membership.entitlements
    );

    const periodStart =
      membership.purchaseDate ?? membership.currentPeriodStart ?? null;

    const periodEnd =
      membership.expiryDate ?? membership.currentPeriodEnd ?? null;

    return {
      id:
        asString(membership._id) ||
        asString(membership.id) ||
        asString(membership.transactionId) ||
        'membership',
      userId: userId ?? asString(membership.userId, 'unknown'),
      planId: asString(membership.planId, 'free'),
      status,
      currentPeriodStart: periodStart ? String(periodStart) : '',
      currentPeriodEnd: periodEnd ? String(periodEnd) : '',
      cancelAtPeriodEnd: asBoolean(membership.cancelAtPeriodEnd),
      entitlements,
    };
  }

  static normalizeStatus(raw: unknown): MembershipStatus {
    if (typeof raw !== 'string' || !raw) return 'none';
    if (raw === 'cancelled') return 'canceled';
    return raw as MembershipStatus;
  }

  static mapUsageToEntitlements(
    usage: unknown,
    existingEntitlements?: unknown
  ): Record<string, MembershipEntitlement> {
    const result: Record<string, MembershipEntitlement> = {};

    const existing = asRecord(existingEntitlements);
    if (existing) {
      for (const [key, value] of Object.entries(existing)) {
        const v = asRecord(value);
        if (!v) continue;
        if ('hasAccess' in v || 'featureId' in v || 'limit' in v || 'used' in v) {
          const accessType: EntitlementAccessType =
            v.accessType === 'unlimited' || v.accessType === 'metered' || v.accessType === 'boolean'
              ? v.accessType
              : v.limit != null
                ? 'metered'
                : 'boolean';

          result[key] = {
            featureId: asString(v.featureId, key),
            accessType,
            hasAccess: asBoolean(v.hasAccess, true),
            limit: typeof v.limit === 'number' ? v.limit : undefined,
            used: typeof v.used === 'number' ? v.used : undefined,
            remaining: typeof v.remaining === 'number' ? v.remaining : undefined,
          };
        }
      }
    }

    if (!usage) return result;

    let entries: [string, unknown][] = [];
    if (usage instanceof Map) {
      entries = Array.from(usage.entries()) as [string, unknown][];
    } else if (
      typeof usage === 'object' &&
      usage !== null &&
      typeof (usage as { entries?: unknown }).entries === 'function'
    ) {
      entries = Array.from((usage as Map<string, unknown>).entries());
    } else {
      const usageObj = asRecord(usage);
      if (usageObj) entries = Object.entries(usageObj);
    }

    for (const [featureId, data] of entries) {
      const row = asRecord(data);
      if (!featureId || !row) continue;

      const used = typeof row.used === 'number' ? row.used : undefined;
      const remaining = typeof row.remaining === 'number' ? row.remaining : undefined;
      const limit =
        typeof row.limit === 'number'
          ? row.limit
          : remaining != null && used != null
            ? used + remaining
            : undefined;

      result[featureId] = {
        featureId,
        accessType: limit != null || remaining != null || used != null ? 'metered' : 'boolean',
        hasAccess: true,
        used,
        remaining,
        limit,
      };
    }

    return result;
  }

  /** Status-only helper for presentation. Authorization comes from the backend access summary. */
  static isActiveStatus(status: MembershipStatus | string | undefined | null): boolean {
    if (!status) return false;
    return ACTIVE_STATUSES.has(status);
  }
}
