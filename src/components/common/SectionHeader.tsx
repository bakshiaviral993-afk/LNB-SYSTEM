import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  viewAllText?: string;
  onViewAll?: () => void;
  className?: string;
}

/**
 * Reusable SectionHeader Component
 * Section title (text-h2) with optional subtitle and right-aligned burgundy action link
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  badge,
  viewAllText,
  onViewAll,
  className = ''
}) => {
  return (
    <div className={`flex items-end justify-between gap-3 ${className}`}>
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-h2 text-[#1F1420] dark:text-[#F5ECF1]">
            {title}
          </h2>
          {badge}
        </div>
        {subtitle && (
          <p className="text-body-sm text-[#6B5B68] dark:text-[#A898A4] mt-0.5 max-w-prose">
            {subtitle}
          </p>
        )}
      </div>

      {viewAllText && onViewAll && (
        <button
          type="button"
          onClick={onViewAll}
          className="text-body-sm font-semibold text-[#97144D] dark:text-[#FFDF85] hover:underline flex items-center gap-0.5 shrink-0 pb-0.5 cursor-pointer active-press"
        >
          <span>{viewAllText}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
