import React from 'react';

export type StatusPillVariant = 'success' | 'warning' | 'error' | 'info' | 'gold' | 'neutral';

export interface StatusPillProps {
  variant?: StatusPillVariant;
  label?: string;
  children?: React.ReactNode;
  pulse?: boolean;
  className?: string;
}

const VARIANT_STYLES: Record<StatusPillVariant, { bg: string; dot: string; text: string; border: string }> = {
  success: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    dot: 'bg-emerald-600 dark:bg-emerald-400',
    text: 'text-emerald-800 dark:text-emerald-300',
    border: 'border-emerald-500/20 dark:border-emerald-500/30'
  },
  warning: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/15',
    dot: 'bg-amber-600 dark:bg-amber-400',
    text: 'text-amber-800 dark:text-amber-300',
    border: 'border-amber-500/20 dark:border-amber-500/30'
  },
  error: {
    bg: 'bg-rose-500/10 dark:bg-rose-500/15',
    dot: 'bg-rose-600 dark:bg-rose-400',
    text: 'text-rose-800 dark:text-rose-300',
    border: 'border-rose-500/20 dark:border-rose-500/30'
  },
  info: {
    bg: 'bg-[#97144D]/10 dark:bg-[#97144D]/20',
    dot: 'bg-[#97144D] dark:text-[#FFDF85]',
    text: 'text-[#97144D] dark:text-[#FFDF85]',
    border: 'border-[#97144D]/20 dark:border-[#97144D]/30'
  },
  gold: {
    bg: 'bg-[#C9A24B]/12 dark:bg-[#C9A24B]/20',
    dot: 'bg-[#C9A24B]',
    text: 'text-[#946A12] dark:text-[#FFDF85]',
    border: 'border-[#C9A24B]/30 dark:border-[#C9A24B]/40'
  },
  neutral: {
    bg: 'bg-slate-500/10 dark:bg-slate-500/15',
    dot: 'bg-slate-500 dark:bg-slate-400',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-500/20 dark:border-slate-500/30'
  }
};

/**
 * Reusable StatusPill Component
 * Tinted background + 6px dot + 12px/600 text.
 * Strictly adheres to muted, tasteful tinting with no garish full-saturation fills.
 */
export const StatusPill: React.FC<StatusPillProps> = ({
  variant = 'neutral',
  label,
  children,
  pulse = false,
  className = ''
}) => {
  const styles = VARIANT_STYLES[variant];
  const content = label || children;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[0.75rem] leading-[1rem] font-semibold select-none ${styles.bg} ${styles.border} ${styles.text} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${styles.dot} ${pulse ? 'animate-pulse' : ''}`}
        aria-hidden="true"
      />
      <span>{content}</span>
    </span>
  );
};
