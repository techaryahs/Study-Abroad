"use client";

import React from "react";
import { trackMembershipEvent } from "@/app/lib/membership/analytics";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  ServiceAccessCard,
  serviceAccessLightPrimaryBtnClass,
  serviceAccessLightSecondaryBtnClass,
} from "@/components/shared/MembershipUI/ServiceAccessCard";

/**
 * Light-theme service access card for EntitlementGuard.
 * Layout skeleton is ServiceAccessCard — not a second design system.
 */
interface LockedFeatureCardProps {
  title: string;
  description: string;
  featureId: string;
  requiredTierName?: string;
  planId?: string;
  badge?: string;
  benefits?: string[];
  primaryCta?: string;
  primaryHref?: string;
  secondaryCta?: string;
  secondaryHref?: string;
  icon?: React.ReactNode;
}

export const LockedFeatureCard: React.FC<LockedFeatureCardProps> = ({
  title,
  description,
  featureId,
  requiredTierName = "Premium",
  planId,
  badge,
  benefits = [],
  primaryCta,
  primaryHref,
  secondaryCta,
  secondaryHref,
  icon,
}) => {
  const router = useRouter();
  const badgeLabel = badge || `Included in ${requiredTierName}`;
  const ctaLabel = primaryCta || `Unlock ${requiredTierName}`;
  const isGuestIdentityFlow = Boolean(primaryHref?.includes("/auth/login"));

  const handleUpgradeClick = () => {
    trackMembershipEvent("upgrade_intent", {
      source: "locked_feature_card",
      featureId,
      planId: planId || requiredTierName.toLowerCase(),
    });
    if (primaryHref) {
      router.push(primaryHref);
      return;
    }
    const params = new URLSearchParams();
    if (featureId) params.set("unlock", featureId);
    if (planId) params.set("planId", planId);
    const q = params.toString();
    router.push(q ? `/pricing?${q}` : "/pricing");
  };

  const handleSecondaryClick = () => {
    if (secondaryHref) {
      router.push(secondaryHref);
      return;
    }
    const unlockQ = featureId ? `?unlock=${encodeURIComponent(featureId)}` : "";
    router.push(`/pricing${unlockQ}`);
  };

  return (
    <ServiceAccessCard
      tone="light"
      badge={badgeLabel}
      title={title}
      subtitle={description}
      membershipLine={`Included with ${requiredTierName} Membership`}
      benefitsTitle="Everything included"
      benefits={benefits}
      icon={icon || <Sparkles size={20} className="text-[#C5A059]" />}
      trustLine="Private by design · Built for ambitious applicants"
      primaryAction={
        <button
          type="button"
          onClick={handleUpgradeClick}
          className={`${serviceAccessLightPrimaryBtnClass} group/btn`}
        >
          {ctaLabel}
          <ArrowRight
            size={14}
            className="transition-transform group-hover/btn:translate-x-0.5"
          />
        </button>
      }
      secondaryAction={
        <button
          type="button"
          onClick={handleSecondaryClick}
          className={serviceAccessLightSecondaryBtnClass}
        >
          {secondaryCta || (isGuestIdentityFlow ? "Create account" : "Compare plans")}
        </button>
      }
    />
  );
};
