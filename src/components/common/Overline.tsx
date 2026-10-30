import React from 'react';

export interface OverlineProps {
  children: React.ReactNode;
  hasDot?: boolean;
  hasUnderline?: boolean;
  className?: string;
}

/**
 * Reusable Overline Component
 * 11px/14px, weight 600, UPPERCASE, letter-spacing 0.08em
 * Muted plum (#7A5B6B light, #C9AAB9 dark), optional 2px gold dot or short gold underline
 */
export const Overline: React.FC<OverlineProps> = ({
  children,
  hasDot = false,
  hasUnderline = false,
  className = ''
}) => {
  return (
    <div className={`inline-flex items-center gap-1.5 ${hasUnderline ? 'border-b-2 border-[#C9A24B] pb-0.5' : ''} ${className}`}>
      {hasDot && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24B] shrink-0" aria-hidden="true" />
      )}
      <span className="text-overline block select-none">
        {children}
      </span>
    </div>
  );
};
