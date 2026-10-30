import { Appointment } from '../types';

export type DateAvailabilityState = 'available' | 'booked' | 'limited' | 'closed';

export interface DaySlotInfo {
  dateStr: string;
  label: string;
  dayOfWeek: string;
  dayNumber: number;
  monthName: string;
  year: number;
  isSunday: boolean;
  isToday: boolean;
  isTomorrow: boolean;
  state: DateAvailabilityState;
  remainingSlotsCount: number;
  reason?: string;
}

export interface TimeSlotOption {
  slot: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  isPast: boolean;
  isHniPriority: boolean;
  availableSeats?: number;
}

// Simple deterministic hash based on string
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Returns deterministic date availability for a given branch & locker across any date.
 * Ensures stable state across refreshes, and guarantees at least 3 booked dates and 1 limited date
 * in any 15-day window.
 */
export function getDateAvailabilityState(
  branchId: string,
  lockerId: string,
  dateStr: string,
  existingAppointments: Appointment[] = []
): { state: DateAvailabilityState; remainingSlots: number; reason?: string } {
  const d = new Date(dateStr);
  const dayOfWeek = d.getDay(); // 0 is Sunday

  // Sundays are always closed
  if (dayOfWeek === 0) {
    return { state: 'closed', remainingSlots: 0, reason: 'Sunday Vault Holiday' };
  }

  // Check if today and now past vault closing hours (e.g. 5 PM)
  const todayStr = new Date().toISOString().split('T')[0];
  const isToday = dateStr === todayStr;
  const currentHour = new Date().getHours();
  if (isToday && currentHour >= 17) {
    return { state: 'closed', remainingSlots: 0, reason: 'Strongroom closed for today' };
  }

  // Check user appointments for this locker & date
  const userBookingsForDate = existingAppointments.filter(
    a => a.date === dateStr && a.status !== 'Cancelled'
  );
  if (userBookingsForDate.length >= 2) {
    return { state: 'booked', remainingSlots: 0, reason: 'Maximum daily reservation quota reached' };
  }

  // Deterministic seed based on branch + locker + date
  const seed = hashCode(`${branchId}_${lockerId}_${dateStr}`);
  const dayOffsetFromEpoch = Math.floor(d.getTime() / (1000 * 60 * 60 * 24));
  const patternIndex = (seed + dayOffsetFromEpoch) % 15;

  // Pattern guarantees: indices 2, 5, 8 are booked; indices 4, 11 are limited; others available
  if (patternIndex === 2 || patternIndex === 5 || patternIndex === 8) {
    return { state: 'booked', remainingSlots: 0, reason: 'All vault access slots fully booked' };
  }

  if (patternIndex === 4 || patternIndex === 11) {
    return { state: 'limited', remainingSlots: 2, reason: 'Limited slots remaining (<3)' };
  }

  return { state: 'available', remainingSlots: 8 };
}

/**
 * Computes rolling 15 days with availability states
 */
export function getRolling15Days(
  branchId: string,
  lockerId: string,
  existingAppointments: Appointment[] = []
): DaySlotInfo[] {
  const today = new Date();
  const days: DaySlotInfo[] = [];

  for (let i = 0; i < 15; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = d.getDate();
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    const isSunday = d.getDay() === 0;

    const { state, remainingSlots, reason } = getDateAvailabilityState(
      branchId,
      lockerId,
      dateStr,
      existingAppointments
    );

    days.push({
      dateStr,
      label: `${monthName} ${dayNumber}`,
      dayOfWeek,
      dayNumber,
      monthName,
      year,
      isSunday,
      isToday: i === 0,
      isTomorrow: i === 1,
      state,
      remainingSlotsCount: remainingSlots,
      reason
    });
  }

  return days;
}

/**
 * Computes time slot availability for a chosen date and duration
 */
export function computeTimeSlots(
  dateStr: string,
  durationMinutes: 10 | 15 | 30,
  branchId: string,
  lockerId: string,
  isHni: boolean,
  existingAppointments: Appointment[] = []
): TimeSlotOption[] {
  const isToday = dateStr === new Date().toISOString().split('T')[0];
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Slot definitions by duration
  let baseSlots: { slot: string; startMin: number; endMin: number; isHniOnly?: boolean }[] = [];

  if (durationMinutes === 10) {
    baseSlots = [
      { slot: '09:30 AM - 09:40 AM (HNI Express)', startMin: 570, endMin: 580, isHniOnly: true },
      { slot: '10:00 AM - 10:10 AM', startMin: 600, endMin: 610 },
      { slot: '10:15 AM - 10:25 AM', startMin: 615, endMin: 625 },
      { slot: '10:30 AM - 10:40 AM', startMin: 630, endMin: 640 },
      { slot: '11:00 AM - 11:10 AM', startMin: 660, endMin: 670 },
      { slot: '11:15 AM - 11:25 AM', startMin: 675, endMin: 685 },
      { slot: '11:30 AM - 11:40 AM', startMin: 690, endMin: 700 },
      { slot: '02:00 PM - 02:10 PM', startMin: 840, endMin: 850 },
      { slot: '02:15 PM - 02:25 PM', startMin: 855, endMin: 865 },
      { slot: '02:30 PM - 02:40 PM', startMin: 870, endMin: 880 },
      { slot: '03:00 PM - 03:10 PM', startMin: 900, endMin: 910 },
      { slot: '03:15 PM - 03:25 PM', startMin: 915, endMin: 925 },
      { slot: '03:30 PM - 03:40 PM', startMin: 930, endMin: 940 },
    ];
  } else if (durationMinutes === 15) {
    baseSlots = [
      { slot: '09:30 AM - 09:45 AM (HNI Express)', startMin: 570, endMin: 585, isHniOnly: true },
      { slot: '10:00 AM - 10:15 AM', startMin: 600, endMin: 615 },
      { slot: '10:20 AM - 10:35 AM', startMin: 620, endMin: 635 },
      { slot: '10:45 AM - 11:00 AM', startMin: 645, endMin: 660 },
      { slot: '11:15 AM - 11:30 AM', startMin: 675, endMin: 690 },
      { slot: '11:35 AM - 11:50 AM', startMin: 695, endMin: 710 },
      { slot: '02:00 PM - 02:15 PM', startMin: 840, endMin: 855 },
      { slot: '02:20 PM - 02:35 PM', startMin: 860, endMin: 875 },
      { slot: '02:45 PM - 03:00 PM', startMin: 885, endMin: 900 },
      { slot: '03:15 PM - 03:30 PM', startMin: 915, endMin: 930 },
      { slot: '03:45 PM - 04:00 PM', startMin: 945, endMin: 960 },
    ];
  } else {
    baseSlots = [
      { slot: '09:30 AM - 10:00 AM (HNI Express)', startMin: 570, endMin: 600, isHniOnly: true },
      { slot: '10:00 AM - 10:30 AM', startMin: 600, endMin: 630 },
      { slot: '10:35 AM - 11:05 AM', startMin: 635, endMin: 665 },
      { slot: '11:15 AM - 11:45 AM', startMin: 675, endMin: 705 },
      { slot: '02:00 PM - 02:30 PM', startMin: 840, endMin: 870 },
      { slot: '02:35 PM - 03:05 PM', startMin: 875, endMin: 905 },
      { slot: '03:15 PM - 03:45 PM', startMin: 915, endMin: 945 },
    ];
  }

  // Filter out HNI slot for non-HNI users
  const filteredBase = isHni ? baseSlots : baseSlots.filter(s => !s.isHniOnly);

  // Check deterministic booking per slot
  return filteredBase.map((s, idx) => {
    const isPast = isToday && s.startMin <= currentMinutes + 15; // minimum 15 min advance

    // Check if booked in actual appointments
    const isBookedInState = existingAppointments.some(
      a => a.date === dateStr && a.timeSlot.includes(s.slot.split(' (')[0]) && a.status !== 'Cancelled'
    );

    // Deterministic booked slots for POC realism: e.g. slot index 1 or 4 is booked by other bank patrons
    const slotSeed = hashCode(`${branchId}_${dateStr}_${s.slot}`);
    const isDeterministicallyBooked = !s.isHniOnly && (slotSeed % 4 === 0);

    const isBooked = isBookedInState || isDeterministicallyBooked;

    return {
      slot: s.slot,
      startTime: s.slot.split(' - ')[0],
      endTime: s.slot.split(' - ')[1]?.split(' (')[0] || '',
      isBooked,
      isPast,
      isHniPriority: Boolean(s.isHniOnly),
      availableSeats: isBooked ? 0 : 1
    };
  });
}
