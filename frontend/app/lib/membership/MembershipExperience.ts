/**
 * MembershipExperience
 *
 * Pure experience layer — input in, messaging model out.
 * No analytics, logging, navigation, hooks, or I/O.
 *
 * Responsibilities:
 *   How should we communicate membership / upgrade state to the user?
 *
 * Does NOT:
 *   Decide access (backend access summary)
 *   Own state (MembershipContext)
 *   Normalize APIs (MembershipMapper)
 *   Render UI (components)
 */

import { Membership, MembershipCatalog, MembershipPlan, Service } from '@/types/membership';

export type ExperienceKind =
  | 'granted'
  | 'upgrade'
  | 'expired'
  | 'usage_exhausted'
  | 'logged_out';

/**
 * Customer-facing experience model.
 * Never includes engineering language.
 */
export interface MembershipExperienceModel {
  kind: ExperienceKind;
  /** Hero title — specific service name when known */
  title: string;
  /** Benefit-led subtitle */
  subtitle: string;
  /** e.g. "Included in Premium" — never "Locked" */
  badge: string;
  /** e.g. "Included with Premium Membership" */
  membershipLine: string;
  planId: string;
  planName: string;
  primaryCta: string;
  secondaryCta: string;
  /** Derived only from MembershipCatalog (plans + services) */
  benefits: string[];
  trustLine: string;
  isEliteVariant: boolean;
  /**
   * Pure resolution flags for callers (components may log).
   * Never render these to customers.
   */
  resolved: {
    serviceId: string;
    fromCatalog: boolean;
    planFromCatalog: boolean;
  };
}

export interface GetExperienceInput {
  serviceId: string;
  catalog: MembershipCatalog | null;
  membership: Membership | null;
  currentPlan: MembershipPlan | null;
  isLoggedOut?: boolean;
  usageExhausted?: boolean;
  /** Optional page-level display name override */
  displayName?: string;
}

const PLAN_LABEL: Record<string, string> = {
  free: 'Free',
  starter: 'Starter',
  essential: 'Essential',
  premium: 'Premium',
  elite: 'Elite',
};

const DEFAULT_TIER = 'premium';

// ── pure helpers ─────────────────────────────────────────────────────────────

function planLabel(planId: string, plan: MembershipPlan | null): string {
  if (plan?.name) {
    return plan.name.replace(/\s+Global$/i, '').trim() || plan.name;
  }
  if (PLAN_LABEL[planId]) return PLAN_LABEL[planId];
  if (!planId) return 'Membership';
  return planId.charAt(0).toUpperCase() + planId.slice(1);
}

function humanizeId(id: string): string {
  if (!id) return 'This experience';
  return id
    .split(/[_-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function findService(
  serviceId: string,
  catalog: MembershipCatalog | null
): Service | null {
  if (!catalog?.services?.length || !serviceId) return null;
  return catalog.services.find((s) => s.id === serviceId) ?? null;
}

function findPlan(
  planId: string,
  catalog: MembershipCatalog | null
): MembershipPlan | null {
  if (!catalog?.plans?.length || !planId) return null;
  return catalog.plans.find((p) => p.id === planId) ?? null;
}

/**
 * Benefits strictly from catalog:
 * 1) Current service name
 * 2) Other active services that require the same plan tier
 * 3) Plan.benefits from MembershipPlan documents
 *
 * No hardcoded feature lists.
 */
function benefitsFromCatalog(
  serviceTitle: string | null,
  tierId: string,
  plan: MembershipPlan | null,
  catalog: MembershipCatalog | null,
  excludeServiceId: string
): string[] {
  const out: string[] = [];
  const seen = new Set<string>();

  const push = (line: string | null | undefined) => {
    if (!line) return;
    const t = line.trim();
    if (!t) return;
    const key = t.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    out.push(t);
  };

  if (serviceTitle) push(serviceTitle);

  if (catalog?.services?.length && tierId) {
    for (const s of catalog.services) {
      if (out.length >= 6) break;
      if (!s.isActive) continue;
      if (s.id === excludeServiceId) continue;
      if (s.requiredPlanTier !== tierId) continue;
      push(s.name);
    }
  }

  if (plan?.benefits?.length) {
    for (const b of plan.benefits) {
      if (out.length >= 6) break;
      push(b);
    }
  }

  // If still thin, add services from higher/lower tiers only via plan.benefits already done.
  // Optionally fill with other catalog service names on any tier for ecosystem feel
  // when this tier had almost no services (e.g. sparse seed) — only from catalog.
  if (out.length < 3 && catalog?.services?.length) {
    for (const s of catalog.services) {
      if (out.length >= 5) break;
      if (!s.isActive) continue;
      push(s.name);
    }
  }

  return out.slice(0, 6);
}

function isExpiredStatus(status: string | undefined): boolean {
  return status === 'expired' || status === 'canceled' || status === 'cancelled';
}

// ── public API ───────────────────────────────────────────────────────────────

/**
 * Build customer-facing membership messaging for a service/feature.
 * Pure function: same inputs → same outputs. No side effects.
 */
export function getMembershipExperience(
  input: GetExperienceInput
): MembershipExperienceModel {
  const {
    serviceId,
    catalog,
    membership,
    currentPlan,
    isLoggedOut,
    usageExhausted,
    displayName,
  } = input;

  const service = findService(serviceId, catalog);
  const fromCatalog = Boolean(service);

  // Tier from backend service document; unknown → premium as product default (not user-visible "error")
  const tierId = service?.requiredPlanTier || DEFAULT_TIER;
  const plan = findPlan(tierId, catalog);
  const planFromCatalog = Boolean(plan);
  const planName = planLabel(tierId, plan);

  // Title: real service name when in catalog; page override; else intentional product title
  const title = fromCatalog
    ? displayName || service!.name || humanizeId(serviceId)
    : displayName || humanizeId(serviceId);

  // Subtitle: specific when known; intentional membership sell when not in catalog
  const subtitle = fromCatalog
    ? `${title} is available with ${planName} Membership.`
    : `Expert guidance, document support, and advanced study abroad tools are available with ${planName} Membership.`;

  const badge = `Included in ${planName}`;
  const membershipLine = `Included with ${planName} Membership`;
  const primaryCta = `Unlock ${planName}`;
  const secondaryCta = 'Compare plans';
  const isEliteVariant = tierId === 'elite';

  const benefits = benefitsFromCatalog(
    fromCatalog ? title : null,
    tierId,
    plan,
    catalog,
    serviceId
  );

  // When service unknown, still sell the plan ecosystem from catalog (not an empty fallback)
  const ecosystemBenefits =
    benefits.length > 0
      ? benefits
      : benefitsFromCatalog(null, tierId, plan, catalog, serviceId);

  const resolved = {
    serviceId,
    fromCatalog,
    planFromCatalog,
  };

  const trustLine = 'Private by design · Built for ambitious applicants';

  if (isLoggedOut) {
    // Identity first (login / create account). Plan upsell only after the user has a session.
    return {
      kind: 'logged_out',
      title: fromCatalog ? title : 'Continue your journey',
      subtitle: fromCatalog
        ? `Sign in to use ${title} with ${planName} Membership.`
        : `Sign in to access expert guidance, document support, and advanced tools with ${planName} Membership.`,
      badge,
      membershipLine,
      planId: tierId,
      planName,
      primaryCta: 'Sign in',
      secondaryCta: 'Create account',
      benefits: ecosystemBenefits,
      trustLine: 'Your progress stays with your account',
      isEliteVariant,
      resolved,
    };
  }

  if (membership && isExpiredStatus(membership.status)) {
    return {
      kind: 'expired',
      title: fromCatalog ? title : 'Welcome back',
      subtitle: fromCatalog
        ? `Renew to reopen ${title} and the rest of your membership benefits.`
        : `Renew to reopen expert guidance, document support, and the tools in your ${planName} Membership.`,
      badge,
      membershipLine: 'Welcome back — renew to continue',
      planId: tierId,
      planName,
      primaryCta: `Renew ${planName}`,
      secondaryCta: 'Compare plans',
      benefits: ecosystemBenefits,
      trustLine: 'Same account · Instant restore of benefits',
      isEliteVariant,
      resolved,
    };
  }

  if (usageExhausted) {
    return {
      kind: 'usage_exhausted',
      title,
      subtitle: fromCatalog
        ? `You’ve used your current allowance for ${title}. Upgrade for more room to keep moving.`
        : `You’ve used your current allowance. Upgrade for more room to keep moving with ${planName} Membership.`,
      badge,
      membershipLine: `Continue with ${planName} or higher`,
      planId: tierId,
      planName,
      primaryCta,
      secondaryCta: 'Compare plans',
      benefits: ecosystemBenefits,
      trustLine: 'Upgrade anytime · Your progress is saved',
      isEliteVariant,
      resolved,
    };
  }

  return {
    kind: 'upgrade',
    title,
    subtitle,
    badge,
    membershipLine,
    planId: tierId,
    planName,
    primaryCta,
    secondaryCta,
    benefits: ecosystemBenefits,
    trustLine,
    isEliteVariant,
    resolved,
  };
}

/**
 * Messaging when the user already has access (caller checks backend access summary).
 * Pure — no side effects.
 */
export function getGrantedExperience(
  serviceId: string,
  catalog: MembershipCatalog | null,
  currentPlan: MembershipPlan | null
): MembershipExperienceModel {
  const service = findService(serviceId, catalog);
  const title = service?.name || humanizeId(serviceId);
  const planName = currentPlan?.name || 'your plan';

  return {
    kind: 'granted',
    title,
    subtitle: `${title} is included in your ${planName}.`,
    badge: 'Included',
    membershipLine: `Part of your ${planName}`,
    planId: currentPlan?.id || '',
    planName,
    primaryCta: 'Go to dashboard',
    secondaryCta: 'Explore services',
    benefits: [],
    trustLine: 'You’re all set',
    isEliteVariant: currentPlan?.id === 'elite',
    resolved: {
      serviceId,
      fromCatalog: Boolean(service),
      planFromCatalog: Boolean(currentPlan),
    },
  };
}
