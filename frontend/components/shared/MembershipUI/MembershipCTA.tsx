import React from 'react';
import { trackMembershipEvent } from '@/app/lib/membership/analytics';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

interface MembershipCTAProps {
  planId?: string;
  /** Backend serviceId — when set, pricing opens in unlock-context mode */
  serviceId?: string;
  buttonText?: string;
  source?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'elite';
}

export const MembershipCTA: React.FC<MembershipCTAProps> = ({
  planId,
  serviceId,
  buttonText = 'Upgrade Membership',
  source = 'generic',
  className = '',
  variant = 'primary'
}) => {
  const router = useRouter();

  const handleClick = () => {
    trackMembershipEvent('upgrade_cta_clicked', {
      source,
      targetPlanId: planId,
      serviceId: serviceId || undefined,
    });

    const params = new URLSearchParams();
    if (serviceId) params.set('unlock', serviceId);
    if (planId) params.set('planId', planId);
    const q = params.toString();
    router.push(q ? `/pricing?${q}` : '/pricing');
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'elite':
        return 'bg-gradient-to-r from-[#3C2A21] to-[#2D2926] text-white hover:shadow-xl hover:shadow-[#C5A059]/20 border border-[#C5A059]/30';
      case 'secondary':
        return 'bg-[#C5A059] text-white hover:bg-[#3C2A21] shadow-lg';
      case 'outline':
        return 'bg-transparent border border-[#3C2A21] text-[#3C2A21] hover:bg-[#3C2A21] hover:text-white';
      case 'primary':
      default:
        return 'bg-[#3C2A21] text-white hover:bg-[#C5A059] shadow-xl';
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`px-6 py-3 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 group ${getVariantStyles()} ${className}`}
    >
      {buttonText}
      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
    </button>
  );
};
