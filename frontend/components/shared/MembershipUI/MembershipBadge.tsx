import React from 'react';
import { MembershipPlan } from '@/types/membership';
import { Crown, Sparkles, Shield, Star } from 'lucide-react';

interface MembershipBadgeProps {
  plan: MembershipPlan | null;
  className?: string;
  showIcon?: boolean;
}

export const MembershipBadge: React.FC<MembershipBadgeProps> = ({ 
  plan, 
  className = '',
  showIcon = true 
}) => {
  if (!plan?.id) return null;

  // Display styling only — authorization never goes through this component
  let icon = <Star className="w-3 h-3" />;
  let colorClass = 'bg-[#F1EDEA] text-[#6B5E51] border-[#E5DFD9]';

  if (plan.id === 'elite') {
    icon = <Crown className="w-3 h-3 text-[#C5A059]" />;
    colorClass = 'bg-gradient-to-r from-[#3C2A21] to-[#2D2926] text-[#C5A059] border-[#C5A059]/30 shadow-md';
  } else if (plan.id === 'premium') {
    icon = <Sparkles className="w-3 h-3" />;
    colorClass = 'bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/20';
  } else if (plan.id === 'essential') {
    icon = <Shield className="w-3 h-3 text-blue-600" />;
    colorClass = 'bg-blue-50 text-blue-600 border-blue-100';
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-black uppercase tracking-widest ${colorClass} ${className}`}>
      {showIcon && icon}
      <span>{plan.name}</span>
    </div>
  );
};
