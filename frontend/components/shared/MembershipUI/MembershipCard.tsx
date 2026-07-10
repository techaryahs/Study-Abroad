import React from 'react';
import { MembershipPlan } from '@/types/membership';
import { trackMembershipEvent } from '@/app/lib/membership/analytics';
import { Check } from 'lucide-react';

interface MembershipCardProps {
  plan: MembershipPlan;
  isCurrentPlan: boolean;
  onSelectPlan: (planId: string) => void;
  isLoading?: boolean;
  /** Optional: explicit current plan id for safe comparison (preferred over trusting isCurrentPlan alone) */
  currentPlanId?: string | null;
}

export const MembershipCard: React.FC<MembershipCardProps> = ({
  plan,
  isCurrentPlan,
  onSelectPlan,
  isLoading = false,
  currentPlanId,
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

  // Display styling only (not authorization)
  const isElite = hasValidPlanId && planId === 'elite';
  const isPopular = Boolean(plan.isPopular) && !resolvedIsCurrent;

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

  return (
    <div
      className={`group relative flex h-full flex-col rounded-2xl p-7 transition-all duration-300 ${
        resolvedIsCurrent
          ? 'border-2 border-[#C5A059] bg-white shadow-[0_12px_40px_-16px_rgba(197,160,89,0.35)]'
          : isElite
            ? 'border border-[#3C2A21]/90 bg-gradient-to-b from-[#3C2A21] via-[#2D2926] to-[#1F1A17] text-white shadow-[0_20px_50px_-20px_rgba(45,41,38,0.55)] xl:-translate-y-1'
            : isPopular
              ? 'border border-[#C5A059]/35 bg-white shadow-[0_16px_40px_-18px_rgba(197,160,89,0.28)] hover:border-[#C5A059]/55'
              : 'border border-[#EDE6DC] bg-white hover:border-[#C5A059]/30 hover:shadow-[0_16px_40px_-20px_rgba(60,42,33,0.12)]'
      }`}
    >
      {/* Badge */}
      {(resolvedIsCurrent || isPopular || (plan.badge && isElite)) && (
        <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
          <span
            className={`inline-flex items-center rounded-full px-3.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] shadow-sm ${
              resolvedIsCurrent
                ? 'bg-[#C5A059] text-white'
                : isElite
                  ? 'bg-[#C5A059] text-[#2D2926]'
                  : 'bg-[#3C2A21] text-[#F5EDE0]'
            }`}
          >
            {resolvedIsCurrent
              ? 'Current plan'
              : plan.badge || 'Most popular'}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-7 pt-1">
        <h3
          className={`fd text-[1.65rem] font-semibold leading-tight tracking-tight ${
            isElite ? 'text-white' : 'text-[#2D2926]'
          }`}
        >
          {plan.name}
        </h3>
        <p
          className={`mt-2 min-h-[2.75rem] text-[13px] font-medium leading-relaxed ${
            isElite ? 'text-white/65' : 'text-[#6B5E51]'
          }`}
        >
          {plan.description}
        </p>

        <div className="mt-6 flex items-baseline gap-1.5">
          <span
            className={`text-[2rem] font-semibold tracking-tight tabular-nums ${
              isElite ? 'text-[#E4C07A]' : 'text-[#2D2926]'
            }`}
          >
            {plan.price === 0
              ? 'Free'
              : `${plan.currency || 'INR'} ${Number(plan.price || 0).toLocaleString()}`}
          </span>
          {plan.price > 0 && (
            <span
              className={`text-[11px] font-medium ${
                isElite ? 'text-white/45' : 'text-[#8B8078]'
              }`}
            >
              / {intervalLabel}
            </span>
          )}
        </div>
      </div>

      {/* Benefits */}
      <div className="flex-1">
        <ul className="space-y-3">
          {(plan.benefits || []).map((benefit, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                  isElite ? 'bg-[#C5A059]/20' : 'bg-[#C5A059]/12'
                }`}
              >
                <Check
                  className={`h-2.5 w-2.5 ${isElite ? 'text-[#E4C07A]' : 'text-[#C5A059]'}`}
                  strokeWidth={3}
                />
              </span>
              <span
                className={`text-[13px] font-medium leading-snug ${
                  isElite ? 'text-white/88' : 'text-[#3C2A21]'
                }`}
              >
                {benefit}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="mt-8">
        <button
          disabled={resolvedIsCurrent || isLoading}
          onClick={() => {
            trackMembershipEvent('plan_selected', { planId, planName: plan.name });
            onSelectPlan(planId);
          }}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[12px] font-semibold tracking-wide transition-all duration-300 active:scale-[0.98]
            ${
              resolvedIsCurrent
                ? 'cursor-not-allowed bg-[#F1EDEA] text-[#8B8078]'
                : isElite
                  ? 'bg-[#C5A059] text-[#2D2926] shadow-md hover:bg-white hover:text-[#3C2A21]'
                  : isPopular
                    ? 'bg-[#C5A059] text-white shadow-md hover:bg-[#3C2A21]'
                    : 'bg-[#3C2A21] text-white hover:bg-[#C5A059]'
            }
          `}
        >
          {isLoading ? (
            <div
              className={`h-4 w-4 animate-spin rounded-full border-2 border-t-transparent ${
                isElite ? 'border-[#2D2926]/30 border-t-[#2D2926]' : 'border-white/30 border-t-white'
              }`}
            />
          ) : resolvedIsCurrent ? (
            'Your current plan'
          ) : (
            `Continue with ${plan.name}`
          )}
        </button>
      </div>
    </div>
  );
};
