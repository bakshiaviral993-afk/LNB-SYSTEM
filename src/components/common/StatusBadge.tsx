import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStyle = (s: string) => {
    switch (s.toLowerCase()) {
      case 'active':
      case 'occupied':
      case 'verified':
      case 'confirmed':
      case 'completed':
      case 'resolved':
      case 'resolved / closed':
      case 'registered':
      case 'approved - allotted':
      case 'digitally e-signed':
      case 'success':
        return 'text-[#16845B] bg-[#16845B]/10 border-[#16845B]/25';

      case 'pending':
      case 'pending approval':
      case 'under scrutiny':
      case 'in progress':
      case 'submitted':
      case 'checked in':
      case 'open':
      case 'assigned':
      case 'branch committee scrutiny':
      case 'inventory scheduled':
        return 'text-[#B7791F] bg-[#B7791F]/10 border-[#B7791F]/25';

      case 'overdue':
      case 'rejected':
      case 'failed':
      case 'cancelled':
      case 'blocked':
      case 'critical':
        return 'text-[#C83E44] bg-[#C83E44]/10 border-[#C83E44]/25';

      case 'vacant':
      case 'reserved':
      case 'under maintenance':
      case 'escalated':
        return 'text-[#008C88] bg-[#008C88]/10 border-[#008C88]/25';

      default:
        return 'text-[#66758C] bg-[#F5F7FA] border-[#E3E8F0]';
    }
  };

  const pad = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium ${pad} ${getStyle(status)}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" aria-hidden="true" />
      <span className="leading-none">{status}</span>
    </span>
  );
};

