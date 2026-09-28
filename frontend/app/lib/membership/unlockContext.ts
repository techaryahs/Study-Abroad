/**
 * Pure unlock-context helpers for contextual pricing.
 * Driven only by Membership catalog (plans.entitlements + services).
 * No hardcoded plan/service names or tier ladders.
 */

import type { MembershipCatalog, MembershipPlan, Service } from "@/types/membership";

export type UnlockPlanRole = "not_included" | "minimum" | "higher";

export type UnlockContext = {
  serviceId: string;
  service: Service;
  serviceName: string;
  /** Plans that grant this service, lowest price first */
  qualifyingPlans: MembershipPlan[];
  /** Lowest-price plan that grants the service */
  minimumPlan: MembershipPlan | null;
  roleForPlan: (planId: string) => UnlockPlanRole | null;
  includesService: (planId: string) => boolean;
};

/** Whether a plan's entitlement map explicitly enables this serviceId. */
export function planIncludesService(plan: MembershipPlan, serviceId: string): boolean {
  if (!serviceId || !plan?.entitlements) return false;

  for (const bag of Object.values(plan.entitlements)) {
    if (!bag || typeof bag !== "object") continue;
    const row = bag[serviceId];
    if (!row) continue;
    // enabled undefined is treated as true (mapper default)
    if (row.enabled === false) continue;
    return true;
  }
  return false;
}

/**
 * Build contextual classification for /pricing?unlock=<serviceId>.
 * Returns null when unlock is absent or service unknown in catalog.
 */
export function resolveUnlockContext(
  plans: MembershipPlan[],
  catalog: MembershipCatalog | null | undefined,
  unlockServiceId: string | null | undefined
): UnlockContext | null {
  const serviceId = (unlockServiceId || "").trim();
  if (!serviceId || !plans.length) return null;

  const service =
    catalog?.services?.find((s) => s.id === serviceId) ?? null;

  // Prefer catalog name; fall back to humanized id so UI still works if services lag
  const serviceName =
    service?.name ||
    serviceId
      .split(/[_-]+/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

  const sorted = [...plans]
    .filter((p) => Boolean(p?.id))
    .sort((a, b) => (a.price || 0) - (b.price || 0));

  const qualifyingPlans = sorted.filter((p) => planIncludesService(p, serviceId));
  const minimumPlan = qualifyingPlans[0] ?? null;
  const minimumPrice = minimumPlan?.price ?? null;

  const roleMap = new Map<string, UnlockPlanRole>();
  for (const plan of sorted) {
    if (!planIncludesService(plan, serviceId)) {
      roleMap.set(plan.id, "not_included");
    } else if (minimumPlan && plan.id === minimumPlan.id) {
      roleMap.set(plan.id, "minimum");
    } else if (
      minimumPrice != null &&
      (plan.price || 0) > minimumPrice
    ) {
      roleMap.set(plan.id, "higher");
    } else {
      // Same price as minimum but different plan — treat as minimum-tier peer
      roleMap.set(plan.id, plan.id === minimumPlan?.id ? "minimum" : "higher");
    }
  }

  // Synthetic service when catalog services not yet loaded but entitlements exist
  const resolvedService: Service = service ?? {
    id: serviceId,
    name: serviceName,
    category: "unknown",
    requiresConsultant: false,
    requiredPlanTier: minimumPlan?.id || "",
    isActive: true,
  };

  return {
    serviceId,
    service: resolvedService,
    serviceName,
    qualifyingPlans,
    minimumPlan,
    roleForPlan: (planId: string) => roleMap.get(planId) ?? null,
    includesService: (planId: string) => roleMap.get(planId) !== "not_included" && roleMap.has(planId),
  };
}
