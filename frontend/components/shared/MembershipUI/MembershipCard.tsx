import React from 'react';
import { MembershipPlan } from '@/types/membership';
import { trackMembershipEvent } from '@/app/lib/membership/analytics';
import type { UnlockPlanRole } from '@/app/lib/membership/unlockContext';
import { Check } from 'lucide-react';

/**
 * Single pricing-card design system (source of truth for /pricing).
 *
 * Unlock context (?unlock=serviceId) may only change:
 * - badge label
 * - dim / disabled state for plans that do not include the service
 * - recommendation emphasis (same highlight tokens as popular/current)
 * - CTA label
 *
 * Layout, spacing, typography, and structure stay identical.
 */
interface MembershipCardProps {
  plan: MembershipPlan;
  /**
   * Already-computed price to show (catalog price, or ₹1 in TEST_PAYMENT_MODE).
   * Parent (PricingPage → PricingClient) owns the mode flag — this card never reads env.
   */
  displayPrice: number;
  isCurrentPlan: boolean;
  onSelectPlan: (planId: string) => void;
  isLoading?: boolean;
  /** Optional: explicit current plan id for safe comparison (preferred over trusting isCurrentPlan alone) */
  currentPlanId?: string | null;
  /**
   * Contextual unlock classification when pricing was opened with ?unlock=serviceId.
   * null / undefined = generic pricing (no service context).
   */
  unlockRole?: UnlockPlanRole | null;
  /** Catalog service display name for contextual CTAs */
  unlockServiceName?: string | null;
  /** Catalog name of the minimum plan that unlocks the service (CTA/badge copy only) */
  unlockMinimumPlanName?: string | null;
}

export const MembershipCard: React.FC<MembershipCardProps> = ({
  plan,
  displayPrice,
  isCurrentPlan,
  onSelectPlan,
  isLoading = false,
  currentPlanId,
  unlockRole = null,
  unlockServiceName = null,
  unlockMinimumPlanName = null,
}) => {
  // Never compare undefined ids — prevents every card becoming "Current Plan"
  const planId = plan?.id;
  const hasValidPlanId = typeof planId === 'string' && planId.length > 0;

  const resolvedIsCurrent = (() => {
    if (!hasValidPlanId) return false;
    if (currentPlanId !== undefined) {
      if (!currentPlanId) return false;
      return currentPlanId === planId;
    }
    // Trust parent flag only when plan has a real id
    return Boolean(isCurrentPlan);
  })();

  // Unlock presentation flags (labels / dim only — not a second layout)
  const isNotIncluded = unlockRole === 'not_included';
  const isMinimum = unlockRole === 'minimum' && !resolvedIsCurrent;
  const isHigher = unlockRole === 'higher';
  const serviceLabel = unlockServiceName || 'this service';

  // Display styling only (not authorization) — same tokens as /pricing source of truth
  const isElite = hasValidPlanId && planId === 'elite';
  // Recommended unlock plan reuses the "popular" highlight language
  const isPopular =
    !resolvedIsCurrent &&
    !isNotIncluded &&
    (Boolean(plan.isPopular) || isMinimum);

  if (!hasValidPlanId) {
    return (
      <div className="relative flex h-full flex-col rounded-2xl border border-[#EDE6DC] bg-white/80 p-7 opacity-70">
        <h3 className="fd mb-2 text-xl font-semibold tracking-tight text-[#3C2A21]">
          {plan?.name || 'Plan unavailable'}
        </h3>
        <p className="mb-6 text-[13px] font-medium text-[#6B5E51]">
          This plan could not be loaded correctly.
        </p>
        <button
          disabled
          className="mt-auto w-full cursor-not-allowed rounded-xl bg-[#F1EDEA] py-3.5 text-[12px] font-semibold text-[#6B5E51]"
        >
          Unavailable
        </button>
      </div>
    );
  }

  const intervalLabel =
    plan.interval === 'one_time'
      ? 'one time'
      : plan.interval === 'yearly'
        ? 'year'
        : plan.interval === 'month'
          ? 'month'
          : plan.interval;

  // Shell: identical classes to the main pricing design.
  // Unlock only tints emphasis: minimum → popular-style / current-style; not_included → opacity.
  const shellClass = resolvedIsCurrent
    ? 'border-2 border-[#C5A059] bg-white shadow-[0_12px_40px_-16px_rgba(197,160,89,0.35)]'
    : isMinimum
      ? 'border-2 border-[#C5A059] bg-white shadow-[0_12px_40px_-16px_rgba(197,160,89,0.35)]'
      : isElite
        ? 'border border-[#3C2A21]/90 bg-gradient-to-b from-[#3C2A21] via-[#2D2926] to-[#1F1A17] text-white shadow-[0_20px_50px_-20px_rgba(45,41,38,0.55)] xl:-translate-y-1'
        : isPopular
          ? 'border border-[#C5A059]/35 bg-white shadow-[0_16px_40px_-18px_rgba(197,160,89,0.28)] hover:border-[#C5A059]/55'
          : 'border border-[#EDE6DC] bg-white hover:border-[#C5A059]/30 hover:shadow-[0_16px_40px_-20px_rgba(60,42,33,0.12)]';

  const badgeLabel = (() => {
    if (resolvedIsCurrent) return 'Current plan';
    if (isNotIncluded) return 'Not included';
    if (isMinimum) return 'Recommended';
    if (isHigher && unlockMinimumPlanName) return `Includes ${unlockMinimumPlanName}+`;
    if (isPopular || (plan.badge && isElite)) return plan.badge || 'Most popular';
    return null;
  })();

  // Absolute badge — same placement for every card; does not shift content
  const showBadge = Boolean(badgeLabel);

  const ctaLabel = (() => {
    if (resolvedIsCurrent) return 'Your current plan';
    if (isNotIncluded) return 'Not included';
    if (isMinimum) return `Unlock ${serviceLabel}`;
    return `Continue with ${plan.name}`;
  })();

  const ctaDisabled = resolvedIsCurrent || isLoading || isNotIncluded;

  return (
    <div
      className={`group relative flex h-full flex-col rounded-2xl p-7 transition-all duration-300 ${shellClass} ${
        isNotIncluded ? 'opacity-60' : ''
      }`}
    >
      {/* Badge — reserved absolute slot (identical geometry for all modes) */}
      {showBadge && (
        <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
          <span
            className={`inline-flex items-center rounded-full px-3.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] shadow-sm ${
              resolvedIsCurrent || isMinimum
                ? 'bg-[#C5A059] text-white'
                : isNotIncluded
                  ? 'bg-[#EDE6DC] text-[#8B8078]'
                  : isElite
                    ? 'bg-[#C5A059] text-[#2D2926]'
                    : 'bg-[#3C2A21] text-[#F5EDE0]'
            }`}
          >
            {badgeLabel}
          </span>
        </div>
      )}

      {/* Header — exact same spacing as /pricing source of truth */}
      <div className="mb-7 pt-1">
        <h3
          className={`fd text-[1.65rem] font-semibold leading-tight tracking-tight ${
            isElite && !isMinimum && !isNotIncluded ? 'text-white' : 'text-[#2D2926]'
          }`}
        >
          {plan.name}
        </h3>
        <p
          className={`mt-2 min-h-[2.75rem] text-[13px] font-medium leading-relaxed ${
            isElite && !isMinimum && !isNotIncluded ? 'text-white/65' : 'text-[#6B5E51]'
          }`}
        >
          {plan.description}
        </p>

        <div className="mt-6 flex items-baseline gap-1.5">
          <span
            className={`text-[2rem] font-semibold tracking-tight tabular-nums ${
              isElite && !isMinimum && !isNotIncluded ? 'text-[#E4C07A]' : 'text-[#2D2926]'
            }`}
          >
            {displayPrice === 0
              ? 'Free'
              : `${plan.currency || 'INR'} ${Number(displayPrice).toLocaleString()}`}
          </span>
          {displayPrice > 0 && (
            <span
              className={`text-[11px] font-medium ${
                isElite && !isMinimum && !isNotIncluded ? 'text-white/45' : 'text-[#8B8078]'
              }`}
            >
              / {intervalLabel}
            </span>
          )}
        </div>
      </div>

      {/* Benefits — identical list geometry */}
      <div className="flex-1">
        <ul className="space-y-3">
          {(plan.benefits || []).map((benefit, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                  isElite && !isMinimum && !isNotIncluded
                    ? 'bg-[#C5A059]/20'
                    : 'bg-[#C5A059]/12'
                }`}
              >
                <Check
                  className={`h-2.5 w-2.5 ${
                    isElite && !isMinimum && !isNotIncluded
                      ? 'text-[#E4C07A]'
                      : 'text-[#C5A059]'
                  }`}
                  strokeWidth={3}
                />
              </span>
              <span
                className={`text-[13px] font-medium leading-snug ${
                  isElite && !isMinimum && !isNotIncluded
                    ? 'text-white/88'
                    : 'text-[#3C2A21]'
                }`}
              >
                {benefit}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA — same size/placement; label/disabled only for context */}
      <div className="mt-8">
        <button
          disabled={ctaDisabled}
          onClick={() => {
            if (ctaDisabled) return;
            trackMembershipEvent('plan_selected', {
              planId,
              planName: plan.name,
              unlockRole: unlockRole || undefined,
            });
            onSelectPlan(planId);
          }}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[12px] font-semibold tracking-wide transition-all duration-300 active:scale-[0.98]
            ${
              ctaDisabled
                ? 'cursor-not-allowed bg-[#F1EDEA] text-[#8B8078]'
                : isElite && !isMinimum
                  ? 'bg-[#C5A059] text-[#2D2926] shadow-md hover:bg-white hover:text-[#3C2A21]'
                  : isPopular || isMinimum
                    ? 'bg-[#C5A059] text-white shadow-md hover:bg-[#3C2A21]'
                    : 'bg-[#3C2A21] text-white hover:bg-[#C5A059]'
            }
          `}
        >
          {isLoading ? (
            <div
              className={`h-4 w-4 animate-spin rounded-full border-2 border-t-transparent ${
                isElite && !isMinimum
                  ? 'border-[#2D2926]/30 border-t-[#2D2926]'
                  : 'border-white/30 border-t-white'
              }`}
            />
          ) : (
            ctaLabel
          )}
        </button>
      </div>
    </div>
  );
};
