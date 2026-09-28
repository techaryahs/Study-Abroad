import React from 'react';
import { trackMembershipEvent } from '@/app/lib/membership/analytics';
import { useRouter } from 'next/navigation';
import { ArrowRight, Zap } from 'lucide-react';

interface UsageProgressProps {
  featureId: string;
  featureName: string;
  used: number;
  limit: number;
  showUpgradeCTA?: boolean;
}

export const UsageProgress: React.FC<UsageProgressProps> = ({
  featureId,
  featureName,
  used,
  limit,
  showUpgradeCTA = true,
}) => {
  const router = useRouter();
  const percentage = Math.min(100, Math.max(0, (used / limit) * 100));
  const isNearLimit = percentage >= 80;
  const isExhausted = percentage >= 100;

  const handleUpgradeClick = () => {
    trackMembershipEvent('upgrade_intent', { source: 'usage_progress', featureId });
    router.push('/pricing');
  };

  return (
    <div className="bg-white border border-[#F1EDEA] rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-end mb-3">
        <div>
          <h4 className="text-[12px] font-black text-[#3C2A21] uppercase tracking-[0.2em] mb-1">
            {featureName}
          </h4>
          <p className="text-[11px] font-bold text-[#6B5E51]">
            {limit - used} remaining
          </p>
        </div>
        <div className="text-right">
          <span className={`text-lg font-black italic tracking-tighter ${isExhausted ? 'text-red-500' : isNearLimit ? 'text-orange-500' : 'text-[#C5A059]'}`}>
            {used}
          </span>
          <span className="text-[11px] font-bold text-[#6B5E51]"> / {limit}</span>
        </div>
      </div>

      <div className="h-1.5 w-full bg-[#FDFBF7] rounded-full border border-[#F1EDEA] overflow-hidden mb-4">
        <div 
          className={`h-full transition-all duration-500 ${isExhausted ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : isNearLimit ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {(isNearLimit || isExhausted) && showUpgradeCTA && (
        <div className={`mt-4 p-3 rounded-xl border flex items-center justify-between gap-4 ${isExhausted ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100'}`}>
          <div className="flex items-center gap-2">
            <Zap className={`w-4 h-4 ${isExhausted ? 'text-red-500' : 'text-orange-500'}`} />
            <span className={`text-[11px] font-black uppercase tracking-widest ${isExhausted ? 'text-red-700' : 'text-orange-700'}`}>
              {isExhausted ? 'Limit Reached' : 'Running Low'}
            </span>
          </div>
          <button
            onClick={handleUpgradeClick}
            className="text-[11px] font-black uppercase tracking-widest text-[#3C2A21] hover:text-[#C5A059] transition-colors flex items-center gap-1"
          >
            Upgrade <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
