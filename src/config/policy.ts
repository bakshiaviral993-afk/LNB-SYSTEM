/**
 * Bank Policy Configuration — Safe Deposit Locker Operations
 * Demo values for POC purposes.
 * Label in UI: "Charges as per bank policy (demo values)"
 */

export interface PolicySlab {
  id: string;
  label: string;
  minHoursBeforeSlot: number;
  maxHoursBeforeSlot: number | null;
  baseCharge: number;
  gstPercent: number;
  isAllowed: boolean;
  notes: string;
}

export const CANCELLATION_POLICY = {
  name: 'Locker Visit Cancellation Policy',
  gstRate: 0.18,
  slabs: [
    {
      id: 'cancel-free',
      label: 'More than 24 hours before slot',
      minHoursBeforeSlot: 24,
      maxHoursBeforeSlot: null,
      baseCharge: 0,
      gstPercent: 18,
      isAllowed: true,
      notes: 'Free cancellation'
    },
    {
      id: 'cancel-standard',
      label: '4 to 24 hours before slot',
      minHoursBeforeSlot: 4,
      maxHoursBeforeSlot: 24,
      baseCharge: 100,
      gstPercent: 18,
      isAllowed: true,
      notes: 'Standard late cancellation charge'
    },
    {
      id: 'cancel-urgent',
      label: 'Less than 4 hours before slot',
      minHoursBeforeSlot: 0,
      maxHoursBeforeSlot: 4,
      baseCharge: 250,
      gstPercent: 18,
      isAllowed: true,
      notes: 'Urgent cancellation fee (strongroom vault reserve forfeited)'
    },
    {
      id: 'cancel-noshow',
      label: 'No-show / Missed Appointment',
      minHoursBeforeSlot: -999,
      maxHoursBeforeSlot: 0,
      baseCharge: 500,
      gstPercent: 18,
      isAllowed: false,
      notes: 'No-show penalty levied if visitor does not check in at turnstile'
    }
  ]
};

export const RESCHEDULE_POLICY = {
  name: 'Locker Visit Reschedule Policy',
  maxReschedulesPerBooking: 2,
  gstRate: 0.18,
  slabs: [
    {
      id: 'resched-first-free',
      label: 'First reschedule, > 24 hours before slot',
      baseCharge: 0,
      gstPercent: 18,
      isAllowed: true,
      notes: 'Free primary reschedule'
    },
    {
      id: 'resched-standard',
      label: 'Later reschedules, or 4 to 24 hours before slot',
      baseCharge: 100,
      gstPercent: 18,
      isAllowed: true,
      notes: 'Reschedule administrative fee'
    },
    {
      id: 'resched-locked',
      label: 'Less than 4 hours before slot',
      baseCharge: 0,
      gstPercent: 18,
      isAllowed: false,
      notes: 'Reschedule not permitted < 4h before slot. Customer must cancel and rebook.'
    }
  ]
};

/**
 * Calculates hours remaining between now and the appointment slot start
 */
export function getHoursRemainingToSlot(dateStr: string, timeSlot: string): number {
  try {
    // Expected format: dateStr: "YYYY-MM-DD" or "2026-10-30", timeSlot: "11:00 AM - 11:30 AM" or "11:00 - 11:30"
    const startTimePart = timeSlot.split('-')[0].trim();
    let [time, modifier] = startTimePart.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (!minutes) minutes = 0;

    if (modifier) {
      const mod = modifier.toUpperCase();
      if (mod === 'PM' && hours < 12) hours += 12;
      if (mod === 'AM' && hours === 12) hours = 0;
    }

    const slotDateTime = new Date(dateStr);
    slotDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const diffMs = slotDateTime.getTime() - now.getTime();
    return diffMs / (1000 * 60 * 60);
  } catch {
    return 48; // Safe fallback
  }
}

export interface FeeCalculationResult {
  slabLabel: string;
  hoursRemaining: number;
  baseCharge: number;
  gstAmount: number;
  totalCharge: number;
  isAllowed: boolean;
  notes: string;
  reasonDisallowed?: string;
}

export function computeCancellationCharge(dateStr: string, timeSlot: string): FeeCalculationResult {
  const hoursRemaining = getHoursRemainingToSlot(dateStr, timeSlot);

  if (hoursRemaining < 0) {
    const base = 500;
    const gst = Math.round(base * CANCELLATION_POLICY.gstRate);
    return {
      slabLabel: 'No-show / Elapsed Slot',
      hoursRemaining: Math.max(0, hoursRemaining),
      baseCharge: base,
      gstAmount: gst,
      totalCharge: base + gst,
      isAllowed: true,
      notes: 'Slot time has already elapsed. Levied as missed appointment fee.'
    };
  }

  if (hoursRemaining >= 24) {
    return {
      slabLabel: 'More than 24 hours before slot',
      hoursRemaining: Math.round(hoursRemaining * 10) / 10,
      baseCharge: 0,
      gstAmount: 0,
      totalCharge: 0,
      isAllowed: true,
      notes: 'Complimentary cancellation as per advance notice policy.'
    };
  }

  if (hoursRemaining >= 4) {
    const base = 100;
    const gst = Math.round(base * CANCELLATION_POLICY.gstRate);
    return {
      slabLabel: '4 to 24 hours before slot',
      hoursRemaining: Math.round(hoursRemaining * 10) / 10,
      baseCharge: base,
      gstAmount: gst,
      totalCharge: base + gst,
      isAllowed: true,
      notes: 'Standard administrative cancellation fee + 18% GST.'
    };
  }

  // < 4 hours
  const base = 250;
  const gst = Math.round(base * CANCELLATION_POLICY.gstRate);
  return {
    slabLabel: 'Less than 4 hours before slot',
    hoursRemaining: Math.max(0, Math.round(hoursRemaining * 10) / 10),
    baseCharge: base,
    gstAmount: gst,
    totalCharge: base + gst,
    isAllowed: true,
    notes: 'Urgent cancellation fee (strongroom vault reserve forfeited).'
  };
}

export function computeRescheduleCharge(
  dateStr: string,
  timeSlot: string,
  rescheduleCount = 0
): FeeCalculationResult {
  const hoursRemaining = getHoursRemainingToSlot(dateStr, timeSlot);

  if (rescheduleCount >= RESCHEDULE_POLICY.maxReschedulesPerBooking) {
    return {
      slabLabel: 'Maximum Reschedules Reached',
      hoursRemaining: Math.round(hoursRemaining * 10) / 10,
      baseCharge: 0,
      gstAmount: 0,
      totalCharge: 0,
      isAllowed: false,
      notes: 'Maximum limit of 2 reschedules reached per booking.',
      reasonDisallowed: 'You have reached the maximum allowance of 2 reschedules for this booking. Please cancel if you cannot attend.'
    };
  }

  if (hoursRemaining < 4) {
    return {
      slabLabel: 'Less than 4 hours before slot',
      hoursRemaining: Math.max(0, Math.round(hoursRemaining * 10) / 10),
      baseCharge: 0,
      gstAmount: 0,
      totalCharge: 0,
      isAllowed: false,
      notes: 'Rescheduling is not allowed within 4 hours of the slot start.',
      reasonDisallowed: 'Rescheduling is not permitted within 4 hours of your appointment slot. You must cancel and rebook a new slot.'
    };
  }

  if (rescheduleCount === 0 && hoursRemaining >= 24) {
    return {
      slabLabel: 'First reschedule, > 24 hours before slot',
      hoursRemaining: Math.round(hoursRemaining * 10) / 10,
      baseCharge: 0,
      gstAmount: 0,
      totalCharge: 0,
      isAllowed: true,
      notes: 'First reschedule is free when notified 24+ hours in advance.'
    };
  }

  // Subsequent or 4-24 hours
  const base = 100;
  const gst = Math.round(base * RESCHEDULE_POLICY.gstRate);
  return {
    slabLabel: rescheduleCount > 0 ? 'Secondary Reschedule' : '4 to 24 hours before slot',
    hoursRemaining: Math.round(hoursRemaining * 10) / 10,
    baseCharge: base,
    gstAmount: gst,
    totalCharge: base + gst,
    isAllowed: true,
    notes: 'Reschedule processing fee: ₹100 + 18% GST (₹118 total).'
  };
}
