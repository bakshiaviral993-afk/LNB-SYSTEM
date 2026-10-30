/**
 * SafeVault Formatting Utilities
 * Standardizes Indian digit grouping (Lakh / Crore), masked account representation,
 * and date-time formatting across all customer screens.
 */

/**
 * Formats monetary amounts using Indian numbering system (e.g. ₹2,84,530.75 or ₹4,50,000)
 */
export function formatIndianCurrency(
  amount: number,
  options?: {
    showPaisa?: boolean;
    prefix?: string;
  }
): string {
  const prefix = options?.prefix !== undefined ? options.prefix : '₹';
  const showPaisa = options?.showPaisa ?? false;

  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: showPaisa ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${prefix}${formatted}`;
}

/**
 * Ensures account numbers are ALWAYS masked across every screen in the application.
 * e.g. "5010049281720" -> "Savings Account - xxxx 1720"
 * "xxxx 1720" -> "Savings Account - xxxx 1720"
 */
export function maskAccountNumber(
  accountStr?: string,
  accountType: string = 'Savings Account'
): string {
  if (!accountStr) {
    return `${accountType} - xxxx 1720`;
  }

  // Extract last 4 digits if present
  const digits = accountStr.replace(/\D/g, '');
  const last4 = digits.length >= 4 ? digits.slice(-4) : '1720';

  return `${accountType} - xxxx ${last4}`;
}

/**
 * Returns formatted Indian date e.g. "30 Oct 2026"
 */
export function formatDateIN(dateInput?: string | Date): string {
  if (!dateInput) return '30 Oct 2026';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return String(dateInput);

  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Returns formatted Indian date and time e.g. "30 Oct 2026, 12:44 PM"
 */
export function formatDateTimeIN(dateInput?: string | Date): string {
  const d = dateInput ? (typeof dateInput === 'string' ? new Date(dateInput) : dateInput) : new Date();
  if (isNaN(d.getTime())) return '30 Oct 2026, 12:44 PM';

  const datePart = d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const timePart = d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return `${datePart}, ${timePart}`;
}
