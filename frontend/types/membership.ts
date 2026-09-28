// Includes backend Student.membership.status values plus legacy UI statuses
export type MembershipStatus =
  | 'active'
  | 'grace_period'
  | 'expired'
  | 'canceled'
  | 'cancelled'
  | 'none'
  | 'pending'
  | 'past_due'
  | 'unpaid'
  | 'incomplete'
  | 'incomplete_expired'
  | 'trialing';
export type EntitlementAccessType = 'unlimited' | 'metered' | 'boolean';

/** Single feature entitlement as defined on MembershipPlan (backend source of truth) */
export interface PlanFeatureEntitlement {
  enabled: boolean;
  limit?: number;
  accessDays?: number;
  renewal?: string;
}

/** Nested plan entitlements: category → featureId → spec */
export type PlanEntitlementsMap = {
  ai?: Record<string, PlanFeatureEntitlement>;
  human?: Record<string, PlanFeatureEntitlement>;
  access?: Record<string, PlanFeatureEntitlement>;
  [category: string]: Record<string, PlanFeatureEntitlement> | undefined;
};

export interface MembershipPlan {
  id: string; // Mapped from planId
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'yearly' | 'one_time'; // Mapped from type
  intervalCount?: number;
  isPopular: boolean; // Mapped from recommended
  badge: string | null;
  benefits: string[];
  /** Backend MembershipPlan.entitlements — authorization source of truth */
  entitlements: PlanEntitlementsMap;
}

export interface MembershipEntitlement {
  featureId: string;
  accessType: EntitlementAccessType;
  hasAccess: boolean;
  limit?: number; // Total limit for metered
  used?: number; // Amount used for metered
  remaining?: number; // Remaining amount for metered
}

export interface MembershipUsage {
  featureId: string;
  usedAt: string;
  amount: number;
  metadata?: Record<string, unknown>;
}

export interface Membership {
  id: string;
  userId: string;
  planId: string;
  status: MembershipStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  /** Usage counters from Student.membership.usage (not plan feature grants) */
  entitlements: Record<string, MembershipEntitlement>;
}

export interface Service {
  id: string; // Mapped from serviceId
  name: string;
  category: string;
  requiresConsultant: boolean;
  requiredPlanTier: string; // Presentation / upgrade CTA — not used for hierarchical auth
  isActive: boolean;
}

export interface MembershipCatalog {
  plans: MembershipPlan[];
  services: Service[];
}

export interface MembershipFeatureAccess {
  serviceId: string;
  name: string;
  category: string;
  canAccess: boolean;
  reason: string | null;
  code: string | null;
  requiredPlanId: string | null;
  remaining: number | null;
  used: number | null;
  limit: number | null;
  unlimited: boolean;
}

export interface MembershipAccessSummary {
  generatedAt: string;
  planId: string;
  currentPlanId: string | null;
  membershipStatus: MembershipStatus | string;
  isAccessAllowed: boolean;
  denyReason: string | null;
  features: Record<string, MembershipFeatureAccess>;
}
