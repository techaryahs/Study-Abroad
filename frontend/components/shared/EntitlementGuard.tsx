"use client";

import React, { useEffect, useMemo } from 'react';
import { useMembership } from '@/app/lib/membership/MembershipContext';
import { LockedFeatureCard } from './MembershipUI/LockedFeatureCard';
import { trackMembershipEvent } from '@/app/lib/membership/analytics';
import { getMembershipExperience } from '@/app/lib/membership/MembershipExperience';

interface EntitlementGuardProps {
  featureId: string;
  /** Optional context only — experience layer owns customer copy */
  fallbackTitle?: string;
  fallbackDescription?: string;
  requiredTierName?: string;
  children: React.ReactNode;
  showLoading?: boolean;
}

/**
 * Renders only. Access state comes from the backend summary. Copy = MembershipExperience.
 */
export const EntitlementGuard: React.FC<EntitlementGuardProps> = ({
  featureId,
  children,
  showLoading = true,
}) => {
  const { canAccess, loading, membership, catalog, currentPlan } = useMembership();
  const isLoggedOut = !loading && !membership;

  const experience = useMemo(
    () =>
      getMembershipExperience({
        serviceId: featureId,
        catalog,
        membership,
        currentPlan,
        isLoggedOut,
      }),
    [featureId, catalog, membership, currentPlan, isLoggedOut]
  );

  // Side effects in the component boundary only
  useEffect(() => {
    if (loading) return;
    if (!experience.resolved.fromCatalog) {
      console.warn('[EntitlementGuard] service not in catalog — intentional membership experience', {
        serviceId: experience.resolved.serviceId,
        planId: experience.planId,
      });
      trackMembershipEvent('membership_lock_fallback', {
        serviceId: experience.resolved.serviceId,
        planId: experience.planId,
        fromCatalog: false,
        source: 'EntitlementGuard',
      });
    }
  }, [loading, experience]);

  if (loading) {
    return showLoading ? (
      <div className="flex justify-center items-center p-12">
        <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
      </div>
    ) : null;
  }

  if (canAccess(featureId)) {
    return <>{children}</>;
  }

  return (
    <LockedFeatureCard
      featureId={featureId}
      title={experience.title}
      description={experience.subtitle}
      requiredTierName={experience.planName}
      planId={experience.planId}
      badge={experience.badge}
      benefits={experience.benefits}
      primaryCta={experience.primaryCta}
    />
  );
};
