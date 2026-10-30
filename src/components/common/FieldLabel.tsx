import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface FieldLabelProps {
  label: string;
  required?: boolean;
  htmlFor?: string;
  helperText?: string;
  error?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Reusable FieldLabel Component
 * Label: 13px/600 above inputs
 * Helper text: 12px muted
 * Error text: 12px/500 red with warning icon
 */
export const FieldLabel: React.FC<FieldLabelProps> = ({
  label,
  required = false,
  htmlFor,
  helperText,
  error,
  className = '',
  children
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <label
        htmlFor={htmlFor}
        className="block font-display text-[0.8125rem] leading-[1.125rem] font-semibold text-[#1F1420] dark:text-[#F5ECF1]"
      >
        {label} {required && <span className="text-[#C62828] dark:text-[#E5484D]">*</span>}
      </label>

      {children}

      {helperText && !error && (
        <p className="text-caption text-[#6B5B68] dark:text-[#A898A4]">
          {helperText}
        </p>
      )}

      {error && (
        <p className="text-caption text-[#C62828] dark:text-[#E5484D] flex items-center gap-1 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
