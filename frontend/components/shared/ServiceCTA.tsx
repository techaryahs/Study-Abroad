"use client";

import { useEffect, useMemo } from "react";
import { useMembership } from "@/app/lib/membership/MembershipContext";
import { useSession } from "@/app/lib/session";
import { MembershipCTA } from "@/components/shared/MembershipUI/MembershipCTA";
import {
  ServiceAccessCard,
  serviceAccessPrimaryBtnClass,
  serviceAccessSecondaryBtnClass,
} from "@/components/shared/MembershipUI/ServiceAccessCard";
import { trackMembershipEvent } from "@/app/lib/membership/analytics";
import {
  getGrantedExperience,
  getMembershipExperience,
} from "@/app/lib/membership/MembershipExperience";
import { Check } from "lucide-react";
import Link from "next/link";

/**
 * Renders only.
 * - Session from session helper
 * - Access / plan from MembershipContext
 * - Copy from MembershipExperience
 * - Layout owned exclusively by ServiceAccessCard (fixed skeleton)
 */
export default function ServiceCTA({
  serviceId,
  displayName,
}: {
  serviceId: string;
  displayName?: string;
}) {
  const { currentPlan, canAccess, catalog, membership, loading } = useMembership();
  const { isAuthenticated } = useSession();
  const isLoggedOut = !loading && !isAuthenticated;

  const hasAccess = useMemo(
    () => Boolean(serviceId) && canAccess(serviceId),
    [canAccess, serviceId]
  );

  const experience = useMemo(() => {
    if (hasAccess) {
      return getGrantedExperience(serviceId, catalog, currentPlan);
    }
    return getMembershipExperience({
      serviceId,
      catalog,
      membership,
      currentPlan,
      isLoggedOut,
      displayName,
    });
  }, [hasAccess, serviceId, catalog, membership, currentPlan, isLoggedOut, displayName]);

  useEffect(() => {
    if (loading) return;
    if (!experience.resolved.fromCatalog) {
      console.warn("[ServiceCTA] service not in catalog — showing intentional membership experience", {
        serviceId: experience.resolved.serviceId,
        planId: experience.planId,
      });
      trackMembershipEvent("membership_lock_fallback", {
        serviceId: experience.resolved.serviceId,
        planId: experience.planId,
        fromCatalog: false,
        source: "ServiceCTA",
      });
    }
  }, [loading, experience]);

  if (loading) {
    return (
      <div
        className="mx-auto flex min-h-[560px] w-full max-w-[420px] items-center justify-center rounded-[2rem] border border-[#D4A848]/10 bg-[#40332D]/40 p-8 lg:mx-0 lg:max-w-none"
        aria-busy="true"
      >
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#C5A059] border-t-transparent" />
      </div>
    );
  }

  // ── Granted ─────────────────────────────────────────────────────────────
  if (experience.kind === "granted") {
    return (
      <ServiceAccessCard
        tone="dark"
        elite={experience.isEliteVariant}
        badge={experience.badge}
        title={experience.title}
        subtitle={experience.subtitle}
        membershipLine={experience.membershipLine}
        benefitsTitle="Included"
        benefits={[]}
        icon={<Check className="h-6 w-6 text-[#C5A059]" strokeWidth={2.5} />}
        trustLine={experience.trustLine}
        primaryAction={
          <Link href="/User/dashboard" className={serviceAccessPrimaryBtnClass}>
            {experience.primaryCta}
          </Link>
        }
      />
    );
  }

  // ── Guest / upgrade / expired / usage (same skeleton) ───────────────────
  const meta =
    currentPlan?.name && experience.kind === "upgrade" ? (
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
          Your plan
        </span>
        <span className="text-[12px] font-semibold text-[#C5A059]">{currentPlan.name}</span>
      </div>
    ) : null;

  const primaryAction =
    experience.kind === "logged_out" ? (
      <Link href="/auth/login" className={serviceAccessPrimaryBtnClass}>
        {experience.primaryCta}
      </Link>
    ) : (
      <MembershipCTA
        planId={experience.planId}
        serviceId={serviceId}
        buttonText={experience.primaryCta}
        source={`service_page_${experience.kind}`}
        variant="secondary"
        className="!w-full !rounded-xl !border-0 !bg-[#C5A059] !py-3.5 !text-[12px] !font-semibold !normal-case !tracking-wide !text-[#2D2926] hover:!bg-white hover:!text-[#2D2926]"
      />
    );

  const secondaryAction =
    experience.kind === "logged_out" ? (
      <Link href="/auth/RegisterStudent" className={serviceAccessSecondaryBtnClass}>
        {experience.secondaryCta}
      </Link>
    ) : (
      <Link
        href={`/pricing?unlock=${encodeURIComponent(serviceId)}`}
        className={serviceAccessSecondaryBtnClass}
      >
        {experience.secondaryCta}
      </Link>
    );

  return (
    <ServiceAccessCard
      tone="dark"
      elite={experience.isEliteVariant}
      badge={experience.badge}
      title={experience.title}
      subtitle={experience.subtitle}
      membershipLine={experience.membershipLine}
      benefitsTitle="Everything included"
      benefits={experience.benefits}
      meta={meta}
      trustLine={experience.trustLine}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
    />
  );
}
