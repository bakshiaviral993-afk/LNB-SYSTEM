import React from 'react';
import { ChevronLeft } from 'lucide-react';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backAriaLabel?: string;
  badges?: React.ReactNode;
  actionsOrSelector?: React.ReactNode;
  className?: string;
}

/**
 * Universal Mobile-First PageHeader Component
 * Ensures title never gets squeezed or truncated on small devices (360-430px).
 * Layout hierarchy:
 * Row 1: Back button + Title (full width, text-xl, wraps naturally)
 * Row 2: Subtitle (max 2 lines, muted)
 * Row 3: Badges / Chips (strictly below title, never beside it)
 * Row 4: Selectors / Action Controls (full width)
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  onBack,
  backAriaLabel = 'Go back',
  badges,
  actionsOrSelector,
  className = ''
}) => {
  return (
    <div className={`space-y-3 pb-3 border-b border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] ${className}`}>
      {/* ROW 1: Back button + Page Title (Full width, wraps naturally) */}
      <div className="flex items-center gap-2.5 w-full">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label={backAriaLabel}
            className="w-10 h-10 rounded-xl bg-white dark:bg-[#221019] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] flex items-center justify-center text-[#1F1420] dark:text-[#F5ECF1] hover:bg-[#FAF6F8] dark:hover:bg-[#2E1624] transition-colors shrink-0 cursor-pointer active-press shadow-2xs"
          >
            <ChevronLeft className="w-5 h-5 text-[#97144D] dark:text-[#FFDF85]" />
          </button>
        )}
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#1F1420] dark:text-[#F5ECF1] leading-tight break-words flex-1">
          {title}
        </h1>
      </div>

      {/* ROW 2: Subtitle (max 2 lines, muted) */}
      {subtitle && (
        <p className="text-xs sm:text-sm text-[#6B5B68] dark:text-[#A898A4] leading-relaxed line-clamp-2">
          {subtitle}
        </p>
      )}

      {/* ROW 3: Badges / Chips (Strictly below the title, never beside it) */}
      {badges && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          {badges}
        </div>
      )}

      {/* ROW 4: Selectors / Action Controls (Full width) */}
      {actionsOrSelector && (
        <div className="w-full pt-1">
          {actionsOrSelector}
        </div>
      )}
    </div>
  );
};
