"use client";

import React from 'react';
import { trackMembershipEvent } from '@/app/lib/membership/analytics';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LockedFeatureCardProps {
  /** Service / feature display name */
  title: string;
  /** Benefit-led subtitle */
  description: string;
  featureId: string;
  /** Plan display name e.g. Premium */
  requiredTierName?: string;
  /** e.g. starter | essential | premium | elite */
  planId?: string;
  /** Badge e.g. Included in Premium */
  badge?: string;
  /** Ecosystem benefits */
  benefits?: string[];
  primaryCta?: string;
  icon?: React.ReactNode;
}

export const LockedFeatureCard: React.FC<LockedFeatureCardProps> = ({
  title,
  description,
  featureId,
  requiredTierName = 'Premium',
  planId,
  badge,
  benefits = [],
  primaryCta,
  icon,
}) => {
  const router = useRouter();
  const badgeLabel = badge || `Included in ${requiredTierName}`;
  const ctaLabel = primaryCta || `Unlock ${requiredTierName}`;

  const handleUpgradeClick = () => {
    trackMembershipEvent('upgrade_intent', {
      source: 'locked_feature_card',
      featureId,
      planId: planId || requiredTierName.toLowerCase(),
    });
    const q = planId ? `?planId=${encodeURIComponent(planId)}` : '';
    router.push(`/pricing${q}`);
  };

  return (
    <div className="bg-[#FDFBF7] border border-[#EDE6DC] rounded-3xl p-8 md:p-10 flex flex-col items-center text-center relative overflow-hidden">
      <div className="absolute -top-16 -right-12 w-40 h-40 bg-[#C5A059]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-12 w-36 h-36 bg-[#3C2A21]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-14 h-14 rounded-2xl bg-white border border-[#EDE6DC] flex items-center justify-center text-[#C5A059] mb-5 shadow-sm relative z-10">
        {icon || <Sparkles size={22} className="text-[#C5A059]" />}
      </div>

      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#9A7B3C] text-[10px] font-semibold tracking-[0.16em] uppercase mb-4 relative z-10">
        <Sparkles size={11} />
        {badgeLabel}
      </span>

      <h3 className="text-xl md:text-2xl font-semibold text-[#2D2926] tracking-tight mb-3 relative z-10 max-w-md">
        {title}
      </h3>

      <p className="text-[14px] text-[#6B5E51] max-w-md mb-6 leading-relaxed relative z-10">
        {description}
      </p>

      {benefits.length > 0 && (
        <div className="w-full max-w-sm text-left bg-white border border-[#EDE6DC] rounded-2xl p-5 mb-6 relative z-10">
          <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#9A7B3C] mb-3 text-center">
            Everything included
          </p>
          <ul className="space-y-2.5">
            {benefits.slice(0, 5).map((b) => (
              <li key={b} className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#C5A059] mt-0.5 shrink-0" strokeWidth={2.5} />
                <span className="text-[13px] text-[#3C2A21] font-medium leading-snug">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleUpgradeClick}
        className="px-8 py-3.5 bg-[#2D2926] text-white rounded-xl text-[12px] font-semibold tracking-wide hover:bg-[#C5A059] hover:text-[#2D2926] transition-all shadow-md active:scale-[0.98] flex items-center gap-2 relative z-10 group/btn"
      >
        {ctaLabel}
        <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
      </button>

      <button
        type="button"
        onClick={() => router.push('/pricing')}
        className="mt-3 text-[12px] font-medium text-[#6B5E51] hover:text-[#C5A059] transition-colors relative z-10"
      >
        Compare plans
      </button>
    </div>
  );
};
