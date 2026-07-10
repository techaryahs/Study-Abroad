import React from 'react';
import { MembershipStatus } from '@/types/membership';
import { CheckCircle2, AlertCircle, Clock, XCircle } from 'lucide-react';

interface MembershipStatusChipProps {
  status: MembershipStatus;
  className?: string;
}

export const MembershipStatusChip: React.FC<MembershipStatusChipProps> = ({ status, className = '' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
      case 'grace_period':
      case 'trialing':
        return {
          label: status === 'trialing' ? 'Trialing' : status === 'grace_period' ? 'Grace Period' : 'Active',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          classes: 'bg-green-50 text-green-600 border-green-200'
        };
      case 'past_due':
      case 'unpaid':
        return {
          label: 'Payment Due',
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          classes: 'bg-orange-50 text-orange-600 border-orange-200'
        };
      case 'canceled':
      case 'cancelled':
        return {
          label: 'Canceled',
          icon: <Clock className="w-3.5 h-3.5" />,
          classes: 'bg-gray-50 text-gray-500 border-gray-200'
        };
      case 'expired':
      case 'incomplete_expired':
        return {
          label: 'Expired',
          icon: <XCircle className="w-3.5 h-3.5" />,
          classes: 'bg-red-50 text-red-600 border-red-200'
        };
      case 'none':
        return {
          label: 'None',
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          classes: 'bg-gray-50 text-gray-500 border-gray-200'
        };
      default:
        return {
          label: status || 'Unknown',
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          classes: 'bg-gray-50 text-gray-500 border-gray-200'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-black uppercase tracking-widest ${config.classes} ${className}`}>
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
};
