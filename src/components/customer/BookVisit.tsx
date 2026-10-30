import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useBanking } from '../../context/BankingContext';
import { StatusBadge } from '../common/StatusBadge';
import { Appointment } from '../../types';
import { mockBankCustomerProfile } from '../../services/bankIntegrationService';
import {
  getRolling15Days,
  computeTimeSlots,
  DaySlotInfo,
  TimeSlotOption,
  DateAvailabilityState
} from '../../utils/bookingAvailability';
import { useScrollLock } from '../../hooks/useScrollLock';
import {
  Calendar,
  Clock,
  Key,
  Shield,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Users,
  MapPin,
  XCircle,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Info,
  CalendarDays,
  Lock,
  ArrowRight,
  X,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';

interface BookVisitProps {
  onOpenPass?: (apt: Appointment) => void;
}

export const BookVisit: React.FC<BookVisitProps> = ({ onOpenPass }) => {
  const {
    lockers,
    appointments,
    bookAppointment,
    cancelAppointment,
    rescheduleAppointment,
    selectedLockerId,
    setSelectedLockerId,
    setCustomerView
  } = useBanking();

  // Strict Customer Isolation: Rahul Sharma
  const customerLockers = lockers.filter(
    l => l.customerId === 'cust-rahul-01' || l.customerName === 'Rahul Sharma'
  );

  const isHni = mockBankCustomerProfile.isHni;

  // Selected Locker
  const [targetLockerId, setTargetLockerId] = useState<string>(
    selectedLockerId || customerLockers[0]?.id || 'lck-042'
  );
  const selectedLockerObj = customerLockers.find(l => l.id === targetLockerId) || customerLockers[0];

  // 15-Day Rolling Window with Deterministic Availability
  const rollingDays = useMemo(() => {
    return getRolling15Days(
      selectedLockerObj?.branchId || 'br-nm-01',
      selectedLockerObj?.id || 'lck-042',
      appointments
    );
  }, [selectedLockerObj, appointments]);

  // Expandable Month Calendar state
  const [isMonthExpanded, setIsMonthExpanded] = useState<boolean>(false);

  // Selected Date state: default to first available date
  const firstAvailableDay = rollingDays.find(d => d.state === 'available' || d.state === 'limited');
  const [selectedDate, setSelectedDate] = useState<string>(
    firstAvailableDay?.dateStr || rollingDays[0].dateStr
  );

  // Duration: 10, 15, or 30 minutes
  const [durationMinutes, setDurationMinutes] = useState<10 | 15 | 30>(15);

  // Slots computation
  const availableSlots = useMemo(() => {
    return computeTimeSlots(
      selectedDate,
      durationMinutes,
      selectedLockerObj?.branchId || 'br-nm-01',
      selectedLockerObj?.id || 'lck-042',
      isHni,
      appointments
    );
  }, [selectedDate, durationMinutes, selectedLockerObj, isHni, appointments]);

  // Selected Slot state: default to first non-booked slot
  const firstAvailableSlot = availableSlots.find(s => !s.isBooked && !s.isPast);
  const [selectedSlot, setSelectedSlot] = useState<string>(
    firstAvailableSlot?.slot || '11:15 AM - 11:30 AM'
  );

  // Update selected slot if previous became booked
  useEffect(() => {
    const isCurrentValid = availableSlots.some(s => s.slot === selectedSlot && !s.isBooked && !s.isPast);
    if (!isCurrentValid && firstAvailableSlot) {
      setSelectedSlot(firstAvailableSlot.slot);
    }
  }, [availableSlots, selectedSlot, firstAvailableSlot]);

  // HNI Fast-Selector mode (Today / Tomorrow / Choose Date)
  const [hniPriorityMode, setHniPriorityMode] = useState<'today' | 'tomorrow' | 'custom'>('today');

  // Accompanying authorized persons count (No purpose field)
  const [accompanyingCount, setAccompanyingCount] = useState<number>(0);

  // Notice / Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [conflictMessage, setConflictMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Reschedule Bottom Sheet State
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>(rollingDays[1]?.dateStr || '');
  const [rescheduleSlot, setRescheduleSlot] = useState<string>('02:20 PM - 02:35 PM');
  const [rescheduleReason, setRescheduleReason] = useState<string>('Personal Conflict / Busy');

  // Cancellation Bottom Sheet State
  const [cancelApt, setCancelApt] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Scheduling Conflict');

  // Hook up useScrollLock for bottom sheets
  useScrollLock(Boolean(rescheduleApt || cancelApt));

  // CONFIGURED LIST OF VALUES (LOVs)
  const RESCHEDULE_REASONS = [
    'Personal Conflict / Busy',
    'Travel / Out of Station',
    'Office Work Emergency',
    'Health / Medical Reasons',
    'Joint Holder Not Available',
    'Other'
  ];

  const CANCELLATION_REASONS = [
    'No Longer Required',
    'Travel / Out of Town',
    'Scheduling Conflict',
    'Emergency at Home',
    'Other'
  ];

  // Check if user already has an active appointment in the exact same date & slot
  useEffect(() => {
    const conflict = appointments.find(
      a =>
        a.date === selectedDate &&
        a.timeSlot.includes(selectedSlot.split(' (')[0]) &&
        a.status !== 'Cancelled'
    );
    if (conflict) {
      setConflictMessage(`You already hold reservation Token #${conflict.tokenNumber} for this exact window.`);
    } else {
      setConflictMessage(null);
    }
  }, [selectedDate, selectedSlot, appointments]);

  // Submit Booking
  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLockerObj) return;

    if (conflictMessage) {
      showToast('Cannot double-book: conflict detected with an existing reservation.');
      return;
    }

    const token = bookAppointment({
      customerId: 'cust-rahul-01',
      customerName: 'Rahul Sharma',
      lockerId: selectedLockerObj.id,
      lockerNumber: selectedLockerObj.lockerNumber,
      branchId: selectedLockerObj.branchId,
      branchName: selectedLockerObj.branchName,
      date: selectedDate,
      timeSlot: selectedSlot,
      durationMinutes,
      isHniPriority: isHni && (hniPriorityMode === 'today' || hniPriorityMode === 'tomorrow'),
      accompanyingPersons: accompanyingCount,
      purpose: 'Vault Visit'
    });

    // Fire celebratory confetti!
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#97144D', '#C9A24B', '#1E8E5A', '#FFDF85']
    });

    showToast(`Appointment confirmed! Token #${token} generated.`);

    // If onOpenPass callback provided or route to pass
    setTimeout(() => {
      const created = appointments.find(a => a.tokenNumber === token);
      if (created && onOpenPass) {
        onOpenPass(created);
      }
    }, 400);
  };

  // Submit Reschedule
  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleApt) return;

    rescheduleAppointment(rescheduleApt.id, rescheduleDate, rescheduleSlot);
    showToast(`Visit Token #${rescheduleApt.tokenNumber} rescheduled to ${rescheduleDate}.`);
    setRescheduleApt(null);
  };

  // Submit Cancellation
  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelApt) return;

    cancelAppointment(cancelApt.id);
    showToast(`Visit Token #${cancelApt.tokenNumber} cancelled.`);
    setCancelApt(null);
  };

  // Customer isolated upcoming & past appointments
  const customerAppointments = appointments.filter(
    a => a.customerId === 'cust-rahul-01' || a.customerName === 'Rahul Sharma'
  );

  return (
    <div className="space-y-4 pb-28 text-[#1F1420] dark:text-[#FBF4F8]">
      
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-[#6B0E37] via-[#97144D] to-[#6B0E37] text-white p-4 rounded-3xl shadow-md border border-[#6B0E37]">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#C9A24B]" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#FFDF85] font-extrabold">
              STRONGROOM ACCESS SCHEDULER
            </span>
          </div>
          {isHni && (
            <span className="bg-[#C9A24B]/30 text-[#FFDF85] border border-[#C9A24B]/40 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#FFDF85]" />
              <span>HNI Priority</span>
            </span>
          )}
        </div>
        <h1 className="text-xl font-black tracking-tight text-white">
          Book Vault Visit
        </h1>
        <p className="text-xs text-white/80 mt-0.5">
          Reserve contactless automated entry at your branch strongroom. Generate your verified QR turnstile pass.
        </p>
      </div>

      {toastMessage && (
        <div className="p-3 bg-[#1E8E5A]/15 border border-[#1E8E5A]/30 rounded-2xl text-[#1E8E5A] text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="p-1 font-bold">✕</button>
        </div>
      )}

      {conflictMessage && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-900/40 rounded-2xl text-[#C62828] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{conflictMessage}</span>
        </div>
      )}

      {/* BOOKING FORM WIZARD */}
      <form onSubmit={handleBookSubmit} className="bg-white dark:bg-[#20101D] border border-[#E8DFE5] dark:border-[#381B30] rounded-3xl p-5 shadow-sm space-y-4 text-xs">
        
        {/* Step 1: Compartment Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5B68] dark:text-[#A898A4]">
            1. Select Compartment
          </label>
          <div className="space-y-2">
            {customerLockers.map(lkr => {
              const isSelected = lkr.id === targetLockerId;
              return (
                <div
                  key={lkr.id}
                  onClick={() => {
                    setTargetLockerId(lkr.id);
                    setSelectedLockerId(lkr.id);
                  }}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between min-h-[54px] ${
                    isSelected
                      ? 'border-[#97144D] bg-[#97144D]/5 ring-2 ring-[#97144D]/25 shadow-xs'
                      : 'border-[#E8DFE5] dark:border-[#381B30] bg-[#FAF6F8] dark:bg-[#2A1527] hover:bg-slate-100 dark:hover:bg-[#33152B]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-bold ${
                      isSelected ? 'bg-[#97144D] text-white' : 'bg-slate-200 dark:bg-slate-700 text-[#6B5B68] dark:text-[#A898A4]'
                    }`}>
                      <Key className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-mono font-bold text-sm text-[#1F1420] dark:text-white block">
                        Locker #{lkr.lockerNumber}
                      </span>
                      <span className="text-xs text-[#6B5B68] dark:text-[#A898A4] block truncate max-w-[210px]">
                        {lkr.branchName}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#97144D]/10 text-[#97144D] dark:text-[#E895B8] border border-[#97144D]/20">
                    {lkr.size}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: HNI Priority Schedule Controls */}
        {isHni && (
          <div className="p-3.5 bg-amber-50/80 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-900/40 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Premier Wealth Fast-Reserve</span>
              </span>
              <span className="text-[11px] text-amber-800 dark:text-amber-300 font-bold">
                Guaranteed Slot
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setHniPriorityMode('today');
                  setSelectedDate(rollingDays[0].dateStr);
                }}
                className={`h-10 rounded-xl text-xs font-bold transition-all ${
                  hniPriorityMode === 'today'
                    ? 'bg-[#97144D] text-white shadow-xs'
                    : 'bg-white dark:bg-[#20101D] text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-900/40 hover:bg-amber-100/50'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => {
                  setHniPriorityMode('tomorrow');
                  setSelectedDate(rollingDays[1]?.dateStr || rollingDays[0].dateStr);
                }}
                className={`h-10 rounded-xl text-xs font-bold transition-all ${
                  hniPriorityMode === 'tomorrow'
                    ? 'bg-[#97144D] text-white shadow-xs'
                    : 'bg-white dark:bg-[#20101D] text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-900/40 hover:bg-amber-100/50'
                }`}
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => setHniPriorityMode('custom')}
                className={`h-10 rounded-xl text-xs font-bold transition-all ${
                  hniPriorityMode === 'custom'
                    ? 'bg-[#97144D] text-white shadow-xs'
                    : 'bg-white dark:bg-[#20101D] text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-900/40 hover:bg-amber-100/50'
                }`}
              >
                Choose Date
              </button>
            </div>
          </div>
        )}

        {/* Step 3: 15-Day Date Strip with Deterministic Availability States */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#6B5B68] dark:text-[#A898A4]">
              2. Select Date (15-Day Permitted Window)
            </label>
            <button
              type="button"
              onClick={() => setIsMonthExpanded(!isMonthExpanded)}
              className="text-[11px] font-bold text-[#97144D] dark:text-[#E895B8] flex items-center gap-1 hover:underline"
            >
              <span>{isMonthExpanded ? 'Collapse' : 'Month View'}</span>
              {isMonthExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Horizontal Scrolling 15-day Strip */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {rollingDays.map(d => {
              const isSelected = selectedDate === d.dateStr;
              const isBooked = d.state === 'booked';
              const isClosed = d.state === 'closed';
              const isLimited = d.state === 'limited';
              const isDisabled = isBooked || isClosed;

              return (
                <button
                  key={d.dateStr}
                  type="button"
                  disabled={isDisabled}
                  aria-disabled={isDisabled}
                  onClick={() => {
                    if (isBooked) {
                      showToast('This date is fully booked. Please try another day.');
                      return;
                    }
                    if (isClosed) {
                      showToast('Strongroom is closed on Sundays and bank holidays.');
                      return;
                    }
                    setSelectedDate(d.dateStr);
                    setHniPriorityMode('custom');
                  }}
                  className={`min-w-[72px] h-18 p-2 rounded-2xl text-center border transition-all flex flex-col items-center justify-between select-none shrink-0 relative ${
                    isBooked
                      ? 'bg-[#D9D3D6] dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 opacity-70 cursor-not-allowed'
                      : isClosed
                      ? 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed bg-[repeating-linear-gradient(45deg,#f1f5f9,#f1f5f9_6px,#e2e8f0_6px,#e2e8f0_12px)] dark:bg-[repeating-linear-gradient(45deg,#1e293b,#1e293b_6px,#0f172a_6px,#0f172a_12px)]'
                      : isSelected
                      ? 'bg-[#97144D] text-white border-[#6B0E37] shadow-md ring-2 ring-[#FFDF85]'
                      : 'bg-[#FAF6F8] dark:bg-[#2A1527] text-[#1F1420] dark:text-white border-[#E8DFE5] dark:border-[#381B30] hover:bg-slate-100 dark:hover:bg-[#33152B]'
                  }`}
                >
                  <span className={`text-[10px] font-bold ${isSelected ? 'text-white/80' : 'text-[#6B5B68] dark:text-[#A898A4]'}`}>
                    {d.dayOfWeek}
                  </span>
                  
                  <span className={`font-mono font-black text-sm my-0.5 ${isBooked ? 'line-through text-slate-600 dark:text-slate-400' : ''}`}>
                    {d.dayNumber}
                  </span>

                  {/* Status Indicator Chip */}
                  {isBooked ? (
                    <span className="text-[9px] font-extrabold flex items-center gap-0.5 text-slate-600 dark:text-slate-300">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Booked</span>
                    </span>
                  ) : isClosed ? (
                    <span className="text-[9px] font-bold text-slate-500">
                      Closed
                    </span>
                  ) : isLimited ? (
                    <span className="text-[9px] font-black text-[#D98E04] flex items-center gap-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D98E04] animate-pulse" />
                      <span>Few left</span>
                    </span>
                  ) : (
                    <span className={`text-[9px] font-bold ${isSelected ? 'text-[#FFDF85]' : 'text-[#1E8E5A]'}`}>
                      {d.isToday ? 'Today' : d.isTomorrow ? 'Tmrw' : 'Open'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Expandable Month Calendar Grid */}
          {isMonthExpanded && (
            <div className="p-3.5 bg-[#FAF6F8] dark:bg-[#2A1527] rounded-2xl border border-[#E8DFE5] dark:border-[#381B30] space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-bold text-[#1F1420] dark:text-white">
                <span>Monthly Vault Access Calendar</span>
                <span className="text-xs text-[#97144D] dark:text-[#E895B8] font-mono">
                  {rollingDays[0]?.monthName} {rollingDays[0]?.year}
                </span>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((wd, idx) => (
                  <span key={idx} className="font-bold text-[10px] text-[#6B5B68] dark:text-[#A898A4] py-1">
                    {wd}
                  </span>
                ))}
                {rollingDays.map(d => {
                  const isSelected = selectedDate === d.dateStr;
                  const isBooked = d.state === 'booked';
                  const isClosed = d.state === 'closed';

                  return (
                    <button
                      key={d.dateStr}
                      type="button"
                      disabled={isBooked || isClosed}
                      onClick={() => {
                        setSelectedDate(d.dateStr);
                        setHniPriorityMode('custom');
                      }}
                      className={`h-9 rounded-xl font-mono text-xs font-bold transition-all ${
                        isBooked
                          ? 'bg-[#D9D3D6] dark:bg-slate-800 text-slate-500 line-through cursor-not-allowed'
                          : isClosed
                          ? 'bg-slate-100 dark:bg-slate-900 text-slate-400 cursor-not-allowed'
                          : isSelected
                          ? 'bg-[#97144D] text-white shadow-xs'
                          : 'bg-white dark:bg-[#20101D] text-[#1F1420] dark:text-white border border-[#E8DFE5] dark:border-[#381B30]'
                      }`}
                    >
                      {d.dayNumber}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* CALENDAR AVAILABILITY LEGEND (POC Requirement) */}
          <div className="p-2.5 bg-[#FAF6F8] dark:bg-[#2A1527] rounded-xl border border-[#E8DFE5] dark:border-[#381B30] flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#6B5B68] dark:text-[#A898A4]">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1E8E5A]" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D98E04]" />
              <span>Limited (&lt;3 slots)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D9D3D6] border border-slate-400" />
              <span>Booked (Locked)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span>Sunday Closed</span>
            </div>
          </div>
        </div>

        {/* Step 4: Duration Selector (10, 15, or 30 min) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5B68] dark:text-[#A898A4]">
            3. Operation Duration
          </label>
          <div className="grid grid-cols-3 gap-2">
            {([10, 15, 30] as const).map(mins => (
              <button
                key={mins}
                type="button"
                onClick={() => setDurationMinutes(mins)}
                className={`h-11 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all border ${
                  durationMinutes === mins
                    ? 'bg-[#97144D] text-white border-[#6B0E37] shadow-xs'
                    : 'bg-[#FAF6F8] dark:bg-[#2A1527] text-[#1F1420] dark:text-white border-[#E8DFE5] dark:border-[#381B30]'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{mins} Minutes</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 5: Available Time Slot Grid (Max 2 columns on mobile, touch targets >= 44px) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#6B5B68] dark:text-[#A898A4]">
              4. Available Strongroom Slots
            </label>
            <span className="text-xs text-[#1E8E5A] font-bold font-mono">
              {availableSlots.filter(s => !s.isBooked && !s.isPast).length} Open
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1 scrollbar-thin">
            {availableSlots.map(s => {
              const isSelected = selectedSlot === s.slot;
              const isDisabled = s.isBooked || s.isPast;

              return (
                <button
                  key={s.slot}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => setSelectedSlot(s.slot)}
                  className={`min-h-[46px] p-2.5 rounded-xl border text-left text-xs transition-all flex flex-col justify-center relative ${
                    isDisabled
                      ? 'bg-[#D9D3D6] dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 opacity-60 cursor-not-allowed'
                      : isSelected
                      ? 'bg-[#97144D] text-white border-[#6B0E37] shadow-sm font-bold ring-2 ring-[#FFDF85]'
                      : s.isHniPriority
                      ? 'bg-[#C9A24B]/15 dark:bg-[#C9A24B]/20 text-[#1F1420] dark:text-white border-[#C9A24B] hover:bg-[#C9A24B]/25'
                      : 'bg-[#FAF6F8] dark:bg-[#2A1527] text-[#1F1420] dark:text-white border-[#E8DFE5] dark:border-[#381B30] hover:bg-white dark:hover:bg-[#33152B]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-xs ${isDisabled ? 'line-through' : ''}`}>
                      {s.slot.split(' (')[0]}
                    </span>
                    {s.isBooked ? (
                      <Lock className="w-3 h-3 text-slate-500 shrink-0" />
                    ) : s.isHniPriority ? (
                      <Sparkles className="w-3 h-3 text-[#C9A24B] shrink-0" />
                    ) : null}
                  </div>

                  {s.isHniPriority ? (
                    <span className="text-[10px] text-[#C9A24B] font-extrabold uppercase mt-0.5 block">
                      Priority Express
                    </span>
                  ) : s.isBooked ? (
                    <span className="text-[10px] text-slate-500 font-bold block mt-0.5">
                      Booked
                    </span>
                  ) : s.isPast ? (
                    <span className="text-[10px] text-slate-500 font-bold block mt-0.5">
                      Elapsed
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 6: Accompanying Persons (No purpose field!) */}
        <div className="space-y-2 pt-2 border-t border-[#E8DFE5] dark:border-[#381B30]">
          <label className="block text-xs font-bold text-[#1F1420] dark:text-white">
            Accompanying Authorized Persons
          </label>
          <select
            value={accompanyingCount}
            onChange={e => setAccompanyingCount(Number(e.target.value))}
            className="w-full h-11 bg-[#FAF6F8] dark:bg-[#2A1527] border border-[#E8DFE5] dark:border-[#381B30] rounded-xl px-3 text-xs font-semibold text-[#1F1420] dark:text-white focus:outline-none"
          >
            <option value={0}>Sole Visitor (Primary Hirer Only)</option>
            <option value={1}>1 Accompanying Joint Holder</option>
            <option value={2}>2 Accompanying Persons (Max Statutory Limit)</option>
          </select>

          <div className="flex items-center gap-2 p-2.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl text-xs text-amber-900 dark:text-amber-200">
            <Shield className="w-4 h-4 text-[#97144D] dark:text-[#E895B8] shrink-0" />
            <span>Biometric fingerprint + Government Photo ID mandatory at strongroom turnstile.</span>
          </div>
        </div>

        {/* Confirm Reservation Button */}
        <button
          type="submit"
          disabled={Boolean(conflictMessage)}
          className="w-full h-12 bg-[#97144D] hover:bg-[#6B0E37] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 active-press cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4 text-[#C9A24B]" />
          <span>Confirm Reservation & Generate Turnstile Pass</span>
        </button>
      </form>

      {/* MY SCHEDULED VAULT VISITS */}
      <div className="space-y-3 pt-2">
        <h2 className="text-base font-black text-[#1F1420] dark:text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#97144D] dark:text-[#E895B8]" />
          <span>My Scheduled Visits ({customerAppointments.length})</span>
        </h2>

        {customerAppointments.length === 0 ? (
          <div className="p-6 bg-white dark:bg-[#20101D] border border-[#E8DFE5] dark:border-[#381B30] rounded-2xl text-center text-[#6B5B68] text-xs">
            No active strongroom visits scheduled.
          </div>
        ) : (
          <div className="space-y-3">
            {customerAppointments.map(apt => {
              const isPast = apt.status === 'Completed' || apt.status === 'Cancelled';

              return (
                <div
                  key={apt.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 ${
                    isPast
                      ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-80'
                      : 'bg-white dark:bg-[#20101D] border-[#E8DFE5] dark:border-[#381B30] shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-[#E8DFE5] dark:border-[#381B30] pb-2.5">
                    <div>
                      <span className="font-mono font-bold text-sm text-[#97144D] dark:text-[#E895B8]">
                        Token #{apt.tokenNumber}
                      </span>
                      <span className="text-xs text-[#6B5B68] dark:text-[#A898A4] block mt-0.5">
                        Locker #{apt.lockerNumber} · {apt.branchName}
                      </span>
                    </div>
                    <StatusBadge status={apt.status} size="sm" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#FAF6F8] dark:bg-[#2A1527] p-2 rounded-xl border border-[#E8DFE5] dark:border-[#381B30]">
                      <span className="text-[#6B5B68] dark:text-[#A898A4] block text-[11px]">Date</span>
                      <span className="font-mono font-bold text-[#1F1420] dark:text-white">{apt.date}</span>
                    </div>
                    <div className="bg-[#FAF6F8] dark:bg-[#2A1527] p-2 rounded-xl border border-[#E8DFE5] dark:border-[#381B30]">
                      <span className="text-[#6B5B68] dark:text-[#A898A4] block text-[11px]">Time Window</span>
                      <span className="font-mono font-bold text-[#1F1420] dark:text-white">{apt.timeSlot}</span>
                    </div>
                  </div>

                  {!isPast && (
                    <div className="pt-2 border-t border-[#E8DFE5] dark:border-[#381B30] grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenPass) onOpenPass(apt);
                          else setCustomerView('pass');
                        }}
                        className="h-10 bg-[#97144D] hover:bg-[#6B0E37] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-xs"
                      >
                        <QrCode className="w-3.5 h-3.5 text-[#C9A24B]" />
                        <span>Pass</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRescheduleApt(apt)}
                        className="h-10 bg-white dark:bg-[#2A1527] border border-[#E8DFE5] dark:border-[#381B30] text-[#97144D] dark:text-[#E895B8] font-bold rounded-xl text-xs flex items-center justify-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reschedule</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCancelApt(apt)}
                        className="h-10 bg-white dark:bg-[#2A1527] border border-rose-200 dark:border-rose-900/40 text-[#C62828] font-bold rounded-xl text-xs flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}

                  {apt.status === 'Cancelled' && apt.cancellationReason && (
                    <div className="p-2.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-xl text-xs text-[#C62828]">
                      <strong>Cancelled:</strong> {apt.cancellationReason}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RESCHEDULE BOTTOM SHEET */}
      {rescheduleApt && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#20101D] rounded-t-3xl sm:rounded-3xl p-5 w-full max-w-md max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl border border-[#E8DFE5] dark:border-[#381B30] text-xs">
            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto sm:hidden" />

            <div className="flex items-center justify-between border-b border-[#E8DFE5] dark:border-[#381B30] pb-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#97144D] dark:text-[#E895B8]" />
                <h3 className="font-extrabold text-base text-[#1F1420] dark:text-white">
                  Reschedule Visit #{rescheduleApt.tokenNumber}
                </h3>
              </div>
              <button onClick={() => setRescheduleApt(null)} className="p-1 rounded-lg text-[#6B5B68]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#6B5B68] dark:text-[#A898A4] mb-1">
                  Select New Date
                </label>
                <select
                  value={rescheduleDate}
                  onChange={e => setRescheduleDate(e.target.value)}
                  className="w-full h-11 bg-[#FAF6F8] dark:bg-[#2A1527] border border-[#E8DFE5] dark:border-[#381B30] rounded-xl px-3 font-semibold text-xs text-[#1F1420] dark:text-white"
                >
                  {rollingDays.filter(d => d.state !== 'closed' && d.state !== 'booked').map(d => (
                    <option key={d.dateStr} value={d.dateStr}>
                      {d.label} ({d.dayOfWeek}) {d.isToday ? '— Today' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5B68] dark:text-[#A898A4] mb-1">
                  Select New Time Slot
                </label>
                <select
                  value={rescheduleSlot}
                  onChange={e => setRescheduleSlot(e.target.value)}
                  className="w-full h-11 bg-[#FAF6F8] dark:bg-[#2A1527] border border-[#E8DFE5] dark:border-[#381B30] rounded-xl px-3 font-semibold text-xs text-[#1F1420] dark:text-white"
                >
                  {availableSlots.filter(s => !s.isBooked).map(s => (
                    <option key={s.slot} value={s.slot}>{s.slot}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5B68] dark:text-[#A898A4] mb-1">
                  Reason for Rescheduling (Mandatory)
                </label>
                <select
                  value={rescheduleReason}
                  onChange={e => setRescheduleReason(e.target.value)}
                  className="w-full h-11 bg-[#FAF6F8] dark:bg-[#2A1527] border border-[#E8DFE5] dark:border-[#381B30] rounded-xl px-3 font-medium text-xs text-[#1F1420] dark:text-white"
                >
                  {RESCHEDULE_REASONS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#6B5B68] dark:text-[#A898A4]">Reschedule Fee:</span>
                  <span className="font-bold text-[#1E8E5A]">₹0 (Complimentary Premier Wealth)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRescheduleApt(null)}
                  className="h-11 rounded-xl border border-[#E8DFE5] dark:border-[#381B30] font-bold text-xs"
                >
                  Keep Original
                </button>
                <button
                  type="submit"
                  className="h-11 bg-[#97144D] text-white font-bold rounded-xl shadow-xs text-xs"
                >
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CANCELLATION BOTTOM SHEET */}
      {cancelApt && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#20101D] rounded-t-3xl sm:rounded-3xl p-5 w-full max-w-md max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl border border-[#E8DFE5] dark:border-[#381B30] text-xs">
            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto sm:hidden" />

            <div className="flex items-center gap-3 border-b border-[#E8DFE5] dark:border-[#381B30] pb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-[#C62828] flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#1F1420] dark:text-white">
                  Cancel Visit Appointment
                </h3>
                <p className="text-xs text-[#6B5B68] dark:text-[#A898A4]">
                  Token #{cancelApt.tokenNumber}
                </p>
              </div>
            </div>

            <form onSubmit={handleCancelSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#6B5B68] dark:text-[#A898A4] mb-1">
                  Reason for Cancellation
                </label>
                <select
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  className="w-full h-11 bg-[#FAF6F8] dark:bg-[#2A1527] border border-[#E8DFE5] dark:border-[#381B30] rounded-xl px-3 font-medium text-xs text-[#1F1420] dark:text-white"
                >
                  {CANCELLATION_REASONS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#6B5B68] dark:text-[#A898A4]">Cancellation Charges:</span>
                  <span className="font-bold text-[#1E8E5A]">₹0 (Zero Charges)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelApt(null)}
                  className="h-11 rounded-xl border border-[#E8DFE5] dark:border-[#381B30] font-bold text-xs"
                >
                  Keep Visit
                </button>
                <button
                  type="submit"
                  className="h-11 bg-[#C62828] text-white font-bold rounded-xl shadow-xs text-xs"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
