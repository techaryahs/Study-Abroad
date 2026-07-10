"use client";

import { useEffect, useMemo } from "react";
import { useMembership } from "@/app/lib/membership/MembershipContext";
import { MembershipCTA } from "@/components/shared/MembershipUI/MembershipCTA";
import { trackMembershipEvent } from "@/app/lib/membership/analytics";
import {
  getGrantedExperience,
  getMembershipExperience,
} from "@/app/lib/membership/MembershipExperience";
import { Check, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

/**
 * Renders only. Access state comes from the backend summary via context.
 * Copy = MembershipExperience (pure).
 */
export default function ServiceCTA({
  serviceId,
  displayName,
}: {
  serviceId: string;
  displayName?: string;
}) {
  const { currentPlan, canAccess, catalog, membership, loading } = useMembership();
  const isLoggedOut = !loading && !membership;

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

  // Side effects live in the component — never in MembershipExperience
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
      <div className="p-8 rounded-[2rem] bg-[#40332D]/40 border border-[#D4A848]/10 flex items-center justify-center min-h-[220px]">
        <div className="w-7 h-7 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (experience.kind === "granted") {
    return (
      <div className="p-8 rounded-[2rem] bg-gradient-to-br from-[#40332D] to-[#2D2926] border border-[#D4A848]/25 shadow-2xl relative overflow-hidden text-center">
        <div className="absolute -top-20 -right-16 w-40 h-40 bg-[#C5A059]/10 rounded-full blur-[70px]" />
        <div className="w-14 h-14 bg-[#C5A059]/15 rounded-full flex items-center justify-center mx-auto mb-5 relative">
          <Check className="w-7 h-7 text-[#C5A059]" strokeWidth={2.5} />
        </div>
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#C5A059] mb-3">
          {experience.badge}
        </p>
        <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight mb-2">
          {experience.title}
        </h3>
        <p className="text-[#FDFBF7]/70 text-sm leading-relaxed mb-8 max-w-[260px] mx-auto">
          {experience.subtitle}
        </p>
        <Link
          href="/User/dashboard"
          className="inline-flex items-center justify-center w-full px-6 py-3.5 bg-[#C5A059] text-[#2D2926] rounded-xl text-[12px] font-semibold tracking-wide hover:bg-white transition-colors"
        >
          {experience.primaryCta}
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`p-8 rounded-[2rem] border shadow-[0_30px_100px_-20px_rgba(194,168,120,0.35)] relative overflow-hidden ${
        experience.isEliteVariant
          ? "bg-gradient-to-b from-[#3C2A21] to-[#1a1512] border-[#C5A059]/30"
          : "bg-[#40332D] border-[#D4A848]/20"
      }`}
    >
      <div className="absolute -top-24 -right-20 w-48 h-48 bg-[#D4A848]/12 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative text-center mb-7">
        <div className="w-12 h-12 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/25 flex items-center justify-center mx-auto mb-5">
          <Sparkles className="w-5 h-5 text-[#C5A059]" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4A848]/10 border border-[#D4A848]/25 text-[#D4A848] text-[10px] font-semibold tracking-[0.18em] uppercase mb-4">
          <Sparkles className="w-3 h-3" />
          {experience.badge}
        </span>

        <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight mb-3 leading-snug">
          {experience.title}
        </h3>
        <p className="text-[#FDFBF7]/72 text-[13px] leading-relaxed max-w-[280px] mx-auto font-medium">
          {experience.subtitle}
        </p>
      </div>

      {experience.benefits.length > 0 && (
        <div className="relative mb-6 px-1">
          <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-white/40 mb-3 text-center">
            {experience.membershipLine}
          </p>
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#C5A059]/90 mb-3 text-center">
            Everything included
          </p>
          <ul className="space-y-2.5">
            {experience.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#C5A059] mt-0.5 shrink-0" strokeWidth={2.5} />
                <span className="text-[13px] text-white/90 font-medium leading-snug">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {currentPlan?.name && experience.kind === "upgrade" && (
        <div className="relative p-3.5 bg-white/[0.04] border border-white/10 rounded-xl mb-6 flex justify-between items-center">
          <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-white/45">
            Your plan
          </span>
          <span className="text-[12px] font-semibold text-[#C5A059]">{currentPlan.name}</span>
        </div>
      )}

      <div className="relative grid gap-2.5">
        {experience.kind === "logged_out" ? (
          <>
            <Link
              href="/auth/login"
              className="w-full py-3.5 rounded-xl bg-[#C5A059] text-[#2D2926] text-center text-[12px] font-semibold tracking-wide hover:bg-white transition-colors"
            >
              {experience.primaryCta}
            </Link>
            <MembershipCTA
              planId={experience.planId}
              buttonText={experience.secondaryCta}
              source="service_page_logged_out"
              variant={experience.isEliteVariant ? "elite" : "outline"}
              className="!border-white/25 !text-white hover:!bg-white/10"
            />
          </>
        ) : (
          <>
            <MembershipCTA
              planId={experience.planId}
              buttonText={experience.primaryCta}
              source={`service_page_${experience.kind}`}
              variant={experience.isEliteVariant ? "elite" : "secondary"}
            />
            <Link
              href="/pricing"
              className="w-full py-3 border border-white/15 text-white/90 rounded-xl text-[11px] font-semibold tracking-[0.14em] uppercase text-center hover:bg-white/5 transition-colors"
            >
              {experience.secondaryCta}
            </Link>
          </>
        )}
      </div>

      <div className="relative mt-6 pt-4 border-t border-white/10 text-center">
        <p className="text-[10px] font-medium text-white/35 tracking-wide flex items-center justify-center gap-2">
          <ShieldCheck size={13} className="text-[#C5A059]/80" />
          {experience.trustLine}
        </p>
      </div>
    </div>
  );
}
