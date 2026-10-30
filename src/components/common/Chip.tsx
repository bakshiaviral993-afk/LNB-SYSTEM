import React from 'react';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  variant?: 'default' | 'burgundy' | 'gold' | 'outline';
}

/**
 * Reusable Chip Component
 * 28-32px high, 999px radius, 1px tinted border
 * For interactive category/account filters and selectors
 */
export const Chip: React.FC<ChipProps> = ({
  active = false,
  icon,
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  let styleClasses = '';

  if (active) {
    styleClasses = 'bg-[#97144D] text-white border-[#97144D] shadow-xs font-bold';
  } else if (variant === 'gold') {
    styleClasses = 'bg-[#C9A24B]/10 dark:bg-[#C9A24B]/20 text-[#946A12] dark:text-[#FFDF85] border-[#C9A24B]/30 hover:border-[#C9A24B]';
  } else if (variant === 'burgundy') {
    styleClasses = 'bg-[#97144D]/10 dark:bg-[#97144D]/25 text-[#97144D] dark:text-[#FFDF85] border-[#97144D]/25 hover:border-[#97144D]';
  } else {
    styleClasses = 'bg-[#FAF6F8] dark:bg-[#2A1220] text-[#1F1420] dark:text-[#F5ECF1] border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] hover:bg-[#E8DFE5]/50 dark:hover:bg-[#341628]';
  }

  return (
    <button
      type="button"
      className={`h-[1.875rem] min-h-[1.75rem] max-h-[2rem] px-3 rounded-full border text-[0.8125rem] font-medium inline-flex items-center gap-1.5 transition-all select-none cursor-pointer shrink-0 active-press ${styleClasses} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </button>
  );
};
