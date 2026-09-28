import React from 'react';
import { Check } from 'lucide-react';

interface MembershipFeatureListProps {
  benefits: string[];
  className?: string;
  isElite?: boolean;
}

export const MembershipFeatureList: React.FC<MembershipFeatureListProps> = ({ 
  benefits, 
  className = '',
  isElite = false
}) => {
  return (
    <ul className={`space-y-3 ${className}`}>
      {benefits.map((benefit, idx) => (
        <li key={idx} className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0">
            <Check className={`w-4 h-4 ${isElite ? 'text-[#C5A059]' : 'text-green-500'}`} />
          </div>
          <span className={`text-[12px] font-bold ${isElite ? 'text-white/90' : 'text-[#3C2A21]'}`}>
            {benefit}
          </span>
        </li>
      ))}
    </ul>
  );
};
