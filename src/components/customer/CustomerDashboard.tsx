import React, { useState, useEffect, useMemo } from 'react';
import { useBanking } from '../../context/BankingContext';
import { StatusBadge } from '../common/StatusBadge';
import { OtpModal } from '../common/OtpModal';
import { Appointment, LockerItem } from '../../types';
import { useScrollLock } from '../../hooks/useScrollLock';
import { COMPLIANCE_CONFIG } from '../../config/compliance.config';
import {
  computeRescheduleCharge,
  computeCancellationCharge
} from '../../config/policy';
import {
  Key,
  Calendar,
  CreditCard,
  Search,
  Clock,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  QrCode,
  AlertCircle,
  CheckCircle2,
  Lock,
  Unlock,
  Users,
  MapPin,
  ArrowRight,
  LayoutGrid,
  FileCheck2,
  X,
  FileText,
  BadgeCheck,
  Building,
  AlertTriangle,
  HeartHandshake,
  Headphones,
  Copy,
  ExternalLink,
  Wallet,
  RefreshCw,
  TrendingUp,
  ShieldAlert,
  HelpCircle,
  Send,
  MessageSquare,
  Bot
} from 'lucide-react';

interface CustomerDashboardProps {
  onOpenPass?: (apt: Appointment) => void;
  onOpenAllServices?: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onOpenPass,
  onOpenAllServices
}) => {
  const {
    lockers,
    appointments,
    serviceRequests,
    notifications,
    accessLogs,
    payments,
    holders,
    nominees,
    setCustomerView,
    selectedLockerId,
    setSelectedLockerId,
    restrictLockerAccess,
    unrestrictLockerAccess,
    logAccessDispute
  } = useBanking();

  // Strict Customer Isolation: Rahul Sharma
  const customerLockers = lockers.filter(
    l => l.customerId === 'cust-rahul-01' || l.customerName === 'Rahul Sharma'
  );

  // Active locker index for mobile carousel/swiper
  const [activeLockerIndex, setActiveLockerIndex] = useState(0);
  const activeLocker = customerLockers[activeLockerIndex] || customerLockers[0] || lockers[0];

  // Sync selected locker with global context
  useEffect(() => {
    if (activeLocker && activeLocker.id !== selectedLockerId) {
      setSelectedLockerId(activeLocker.id);
    }
  }, [activeLocker, selectedLockerId, setSelectedLockerId]);

  // Locker Details Bottom Sheet Modal
  const [detailLocker, setDetailLocker] = useState<LockerItem | null>(null);
  useScrollLock(Boolean(detailLocker));

  // Security Freeze / Unfreeze state
  const [targetLockLockerId, setTargetLockLockerId] = useState<string | null>(null);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpAction, setOtpAction] = useState<'freeze' | 'unfreeze'>('freeze');

  // Copied token toast
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [walletToast, setWalletToast] = useState(false);

  // Reschedule Bottom Sheet State
  const [rescheduleSheetApt, setRescheduleSheetApt] = useState<Appointment | null>(null);

  // Live "Now serving" ticker in demo mode
  const [nowServingNumber, setNowServingNumber] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('sv_demo_now_serving');
      return saved ? parseInt(saved, 10) : 9;
    } catch {
      return 9;
    }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setNowServingNumber(prev => {
        const next = prev >= 35 ? 7 : prev + 1;
        try {
          localStorage.setItem('sv_demo_now_serving', String(next));
        } catch {
          // ignore
        }
        return next;
      });
    }, 20000);
    return () => clearInterval(timer);
  }, []);

  // Ask SafeVault Floating Assistant Drawer
  const [isAskOpen, setIsAskOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Hello Rahul! I am your SafeVault AI Assistant. Ask me about your annual rent due date, adding a nominee, lost key procedures, or strongroom charges.',
      time: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Activity filter state
  const [activityFilter, setActivityFilter] = useState<'All' | 'Access' | 'Payments' | 'Requests'>('All');

  // Customer specific appointments
  const customerAppointments = appointments.filter(
    a => a.customerId === 'cust-rahul-01' || customerLockers.some(l => l.id === a.lockerId)
  );

  // FILTER ONLY FUTURE APPOINTMENTS (Fixes stale past bookings like 28 Oct)
  const futureAppointments = useMemo(() => {
    const now = new Date();
    // Beginning of today in local date
    const todayStr = now.toISOString().split('T')[0];

    return customerAppointments.filter(apt => {
      if (apt.status === 'Cancelled') return false;
      // If date is today or future
      if (apt.date > todayStr) return true;
      if (apt.date === todayStr) {
        // Compare slot time
        try {
          const startTimePart = apt.timeSlot.split('-')[0].trim();
          let [time, modifier] = startTimePart.split(' ');
          let [hours, minutes] = time.split(':').map(Number);
          if (modifier === 'PM' && hours < 12) hours += 12;
          if (modifier === 'AM' && hours === 12) hours = 0;
          const slotTime = new Date();
          slotTime.setHours(hours, minutes || 0, 0, 0);
          return slotTime.getTime() > now.getTime();
        } catch {
          return true;
        }
      }
      return false;
    });
  }, [customerAppointments]);

  const nextAppointment = futureAppointments[0];

  // Helper to format date display & compute relative chip
  const formatAppointmentTime = (dateStr: string, timeSlot: string) => {
    const today = new Date();
    const aptDate = new Date(dateStr);
    
    // Day difference
    const diffTime = aptDate.setHours(0,0,0,0) - today.setHours(0,0,0,0);
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    let relativeChip = 'Upcoming';
    if (diffDays === 0) relativeChip = 'Today';
    else if (diffDays === 1) relativeChip = 'Tomorrow';
    else if (diffDays > 1) relativeChip = `In ${diffDays} days`;

    // Format: "Fri, 30 Oct - 11:00-11:30 AM"
    const dateFormatted = new Date(dateStr).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short'
    });

    return {
      formatted: `${dateFormatted} · ${timeSlot}`,
      relativeChip
    };
  };

  const handleToggleFreeze = (lockerId: string, currentStatus: string) => {
    setTargetLockLockerId(lockerId);
    setOtpAction(currentStatus === 'Blocked' ? 'unfreeze' : 'freeze');
    setIsOtpOpen(true);
  };

  const handleOtpSuccess = () => {
    if (!targetLockLockerId) return;
    if (otpAction === 'freeze') {
      restrictLockerAccess(targetLockLockerId, 'Customer-initiated temporary security freeze via mobile app (subject to bank approval)');
    } else {
      unrestrictLockerAccess(targetLockLockerId);
    }
    setTargetLockLockerId(null);
  };

  const handleViewPass = (apt: Appointment) => {
    if (onOpenPass) {
      onOpenPass(apt);
    } else {
      setCustomerView('pass');
    }
  };

  const copyTokenNumber = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  // MODULE 1: ACTION REQUIRED ITEMS
  const actionItems = useMemo(() => {
    const items: Array<{
      id: string;
      title: string;
      reason: string;
      dueDate: string;
      buttonText: string;
      action: () => void;
      urgency: 'high' | 'medium' | 'info';
    }> = [];

    // Rent overdue or due
    const overdueLocker = customerLockers.find(l => (l.outstandingRent || 0) > 0);
    if (overdueLocker) {
      items.push({
        id: 'act-rent',
        title: 'Rent Payment Due',
        reason: `₹${(overdueLocker.outstandingRent || 0).toLocaleString('en-IN')} pending for Locker #${overdueLocker.lockerNumber}`,
        dueDate: 'Due 15 Nov 2026',
        buttonText: 'Pay Now',
        action: () => setCustomerView('rent'),
        urgency: 'high'
      });
    }

    // Nominee check
    const activeNominees = nominees[activeLocker?.id || ''] || [];
    if (activeNominees.length === 0) {
      items.push({
        id: 'act-nominee',
        title: 'Statutory Nomination Pending',
        reason: 'Register nominee under Form SL-1 to avoid legal succession delays',
        dueDate: 'Mandatory per RBI',
        buttonText: 'Add Nominee',
        action: () => setCustomerView('holders'),
        urgency: 'medium'
      });
    }

    // Periodic KYC refresh advisory
    items.push({
      id: 'act-kyc',
      title: 'Periodic KYC Re-validation',
      reason: 'Low-risk 10-year refresh scheduled. Upload Aadhaar/PAN e-consent.',
      dueDate: 'Due 31 Dec 2026',
      buttonText: 'Verify KYC',
      action: () => setCustomerView('agreements'),
      urgency: 'info'
    });

    return items;
  }, [customerLockers, nominees, activeLocker, setCustomerView]);

  // MODULE 2: LOCKER HEALTH SCORE CALCULATION
  const healthChecklist = useMemo(() => {
    const rentPaid = (activeLocker?.outstandingRent || 0) === 0;
    const agreementRenewed = true; // Stamped model agreement active
    const kycValid = true;
    const hasNominee = (nominees[activeLocker?.id || ''] || []).length > 0;
    const autoDebitActive = true;

    const items = [
      { id: 'h1', label: 'Annual Rent Settled', ok: rentPaid, weight: 25, fixView: 'rent' },
      { id: 'h2', label: 'Model Agreement Stamped', ok: agreementRenewed, weight: 20, fixView: 'agreements' },
      { id: 'h3', label: 'Periodic KYC Current', ok: kycValid, weight: 20, fixView: 'agreements' },
      { id: 'h4', label: 'Nomination Registered (SL-1)', ok: hasNominee, weight: 20, fixView: 'holders' },
      { id: 'h5', label: 'CBS Auto-Debit Mandate Active', ok: autoDebitActive, weight: 15, fixView: 'rent' },
    ];

    const score = items.reduce((acc, curr) => acc + (curr.ok ? curr.weight : 0), 0);
    return { items, score };
  }, [activeLocker, nominees]);

  // Chat message submission
  const handleSendChat = (textToSend?: string) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;

    const userMsg = { sender: 'user' as const, text: query, time: 'Now' };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    // Generate intelligent assistant response
    setTimeout(() => {
      let reply = "I'm here to assist with your SafeVault account. You can explore our Locker Discovery, Visit Scheduler, or Tariff Settlement modules.";
      const q = query.toLowerCase();

      if (q.includes('rent') || q.includes('due') || q.includes('payment')) {
        reply = `Your annual rent for Locker #${activeLocker?.lockerNumber} is ₹${activeLocker?.annualRent.toLocaleString('en-IN')} + 18% GST (₹${Math.round((activeLocker?.annualRent || 0) * 1.18).toLocaleString('en-IN')} total). Payment is debited automatically 7 days prior to renewal via CBS auto-debit.`;
      } else if (q.includes('nominee') || q.includes('nominate') || q.includes('da-1') || q.includes('sl-1')) {
        reply = `Under bank compliance regulations, nomination for Safe Deposit Lockers is registered using statutory Form SL-1 (or SL-1A for minors). You can register up to 4 nominees with share percentages totaling 100%.`;
      } else if (q.includes('lost key') || q.includes('break open') || q.includes('key')) {
        reply = `If your physical key is lost, immediately raise a 'Lost Key & Break-Open' service request. Under dual-custody rules, a technician will break open the lock strictly in your presence and issue a replacement lock with fresh keys.`;
      } else if (q.includes('charge') || q.includes('cancel') || q.includes('reschedule') || q.includes('fee')) {
        reply = `As per SafeVault policy: Visit cancellations >24 hours in advance are FREE. 4–24 hours incur ₹100 + 18% GST. Under 4 hours incur ₹250 + 18% GST. Rescheduling is complimentary for your first advance reschedule!`;
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: reply, time: 'Now' }]);
    }, 400);
  };

  // Recent activity logs
  const filteredActivity = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      subtitle: string;
      date: string;
      type: 'access' | 'payment' | 'request';
      status?: string;
    }> = [];

    if (activityFilter === 'All' || activityFilter === 'Access') {
      accessLogs.forEach(al => {
        list.push({
          id: `act-acc-${al.id}`,
          title: `Vault Entry · Locker #${al.lockerNumber}`,
          subtitle: `Operated by ${al.operatedBy} (${al.verificationMethod})`,
          date: `${al.date} · ${al.inTime}`,
          type: 'access',
          status: al.status
        });
      });
    }

    if (activityFilter === 'All' || activityFilter === 'Payments') {
      payments.forEach(p => {
        list.push({
          id: `act-pay-${p.id}`,
          title: `Rent Paid · ₹${p.totalAmount.toLocaleString('en-IN')}`,
          subtitle: `Receipt #${p.receiptNumber} (${p.paymentMethod})`,
          date: p.paymentDate,
          type: 'payment',
          status: p.status
        });
      });
    }

    if (activityFilter === 'All' || activityFilter === 'Requests') {
      serviceRequests.forEach(sr => {
        list.push({
          id: `act-sr-${sr.id}`,
          title: `${sr.requestType} · Ticket ${sr.ticketNumber}`,
          subtitle: `Locker #${sr.lockerNumber} (${sr.branchName})`,
          date: sr.createdDate,
          type: 'request',
          status: sr.status
        });
      });
    }

    return list.slice(0, 6);
  }, [accessLogs, payments, serviceRequests, activityFilter]);

  // Statutory Cover Calculation: 100x annual rent
  const statutoryLiabilityCap = (activeLocker?.annualRent || 4500) * 100;

  return (
    <div className="space-y-4 pb-28 text-[#1F1420] dark:text-[#F5ECF1] selection:bg-[#97144D] selection:text-white">

      {/* ============================================================ */}
      {/* HERO SECTION: PORTFOLIO SUMMARY & ACTIVE LOCKER CARD         */}
      {/* ============================================================ */}
      <div className="space-y-3">
        {/* Top User Greeting & Status Bar */}
        <div className="flex items-center justify-between px-1">
          <div>
            <span className="text-xs text-[#6B5B68] dark:text-[#A898A4] block">Welcome back,</span>
            <h1 className="text-xl font-black text-[#1F1420] dark:text-[#F5ECF1] tracking-tight">
              Rahul Sharma
            </h1>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#97144D]/10 dark:bg-[#97144D]/25 text-[#97144D] dark:text-[#FFDF85] border border-[#97144D]/20 text-xs font-bold font-mono">
            {customerLockers.length} Active Lockers
          </span>
        </div>

        {/* Hero Active Locker Card (Burgundy Gradient with Gold Accent) */}
        {activeLocker && (
          <div className="bg-gradient-to-br from-[#6B0E37] via-[#851144] to-[#97144D] text-white rounded-3xl p-5 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />

            {/* Header row */}
            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-[#C9A24B]/30 text-[#FFDF85] border border-[#C9A24B]/40 text-[10px] font-bold uppercase tracking-wider font-mono">
                    {activeLocker.size} Compartment
                  </span>
                  <span className="text-white/70 text-xs">·</span>
                  <span className="text-[#FFDF85] text-xs font-semibold">Tier-1 Security Vault</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="font-mono font-black text-2xl tracking-wider text-white">
                    Locker #{activeLocker.lockerNumber}
                  </span>
                </div>
                <p className="text-xs text-white/85 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FFDF85] shrink-0" />
                  <span className="truncate">{activeLocker.branchName}</span>
                </p>
              </div>

              {/* Status indicator button */}
              <div className="flex flex-col items-end gap-1.5">
                <StatusBadge status={activeLocker.status} size="sm" />
                <button
                  type="button"
                  onClick={() => handleToggleFreeze(activeLocker.id, activeLocker.status)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 border transition-colors cursor-pointer active-press ${
                    activeLocker.status === 'Blocked'
                      ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40 hover:bg-emerald-500/30'
                      : 'bg-white/15 text-white border-white/20 hover:bg-white/25'
                  }`}
                  title="Security Lock / Unlock"
                >
                  {activeLocker.status === 'Blocked' ? (
                    <>
                      <Unlock className="w-3 h-3 text-emerald-300" />
                      <span>Unfreeze</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3 text-[#FFDF85]" />
                      <span>Freeze</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick stats grid inside Hero Card */}
            <div className="grid grid-cols-3 gap-2 pt-4 mt-3 border-t border-white/15 text-xs">
              <div className="bg-black/20 rounded-2xl p-2.5 border border-white/10">
                <span className="text-[10px] text-white/70 block uppercase font-mono">Annual Rent</span>
                <span className="font-mono font-extrabold text-sm text-white block mt-0.5">
                  ₹{activeLocker.annualRent.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="bg-black/20 rounded-2xl p-2.5 border border-white/10">
                <span className="text-[10px] text-white/70 block uppercase font-mono">Deposit FD</span>
                <span className="font-mono font-extrabold text-sm text-[#FFDF85] block mt-0.5">
                  ₹{activeLocker.securityDeposit.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="bg-black/20 rounded-2xl p-2.5 border border-white/10">
                <span className="text-[10px] text-white/70 block uppercase font-mono">Renewal Due</span>
                <span className="font-mono font-bold text-xs text-white block mt-0.5">
                  {activeLocker.rentDueDate || '31 Dec 2026'}
                </span>
              </div>
            </div>

            {/* Multi-locker carousel pagination */}
            {customerLockers.length > 1 && (
              <div className="flex items-center justify-between pt-3 mt-1">
                <span className="text-[11px] text-white/70">
                  Viewing {activeLockerIndex + 1} of {customerLockers.length} compartments
                </span>
                <div className="flex items-center gap-1.5">
                  {customerLockers.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveLockerIndex(idx)}
                      aria-label={`Switch to locker ${idx + 1}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        activeLockerIndex === idx ? 'w-6 bg-[#FFDF85]' : 'w-2 bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* 1. ACTION REQUIRED MODULE (Horizontal swipe cards)           */}
      {/* ============================================================ */}
      {actionItems.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-extrabold text-[#1F1420] dark:text-[#F5ECF1] tracking-tight flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#C9A24B]" />
              <span>Action Required ({actionItems.length})</span>
            </h2>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none snap-x">
            {actionItems.map(item => (
              <div
                key={item.id}
                className="min-w-[280px] max-w-[320px] snap-center bg-white dark:bg-[#221019] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] rounded-3xl p-4 shadow-sm space-y-2 shrink-0"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-[#1F1420] dark:text-[#F5ECF1] truncate max-w-[190px]">
                    {item.title}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    {item.dueDate}
                  </span>
                </div>
                <p className="text-xs text-[#6B5B68] dark:text-[#A898A4] line-clamp-2 leading-relaxed">
                  {item.reason}
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={item.action}
                    className="w-full h-9 bg-[#97144D] hover:bg-[#6B0E37] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-xs transition-colors active-press cursor-pointer"
                  >
                    <span>{item.buttonText}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. LOCKER HEALTH SCORE MODULE (Animated Ring + Checklist)   */}
      {/* ============================================================ */}
      <div className="bg-white dark:bg-[#221019] rounded-3xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#1E8E5A]/10 text-[#1E8E5A] flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-[#1F1420] dark:text-[#F5ECF1]">
                Locker Health Index
              </h2>
              <span className="text-[11px] text-[#6B5B68] dark:text-[#A898A4]">
                Compliance & Security Standing
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xl font-black font-mono text-[#97144D] dark:text-[#FFDF85]">
              {healthChecklist.score}/100
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-[#FAF6F8] dark:bg-black/30 overflow-hidden border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
          <div
            className="h-full bg-gradient-to-r from-[#97144D] to-[#1E8E5A] rounded-full transition-all duration-500"
            style={{ width: `${healthChecklist.score}%` }}
          />
        </div>

        {/* Checklist */}
        <div className="space-y-2 pt-1 text-xs">
          {healthChecklist.items.map(item => (
            <div
              key={item.id}
              onClick={() => setCustomerView(item.fixView)}
              className="flex items-center justify-between p-2 rounded-xl bg-[#FAF6F8] dark:bg-[#2E1624] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] hover:border-[#97144D] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                {item.ok ? (
                  <CheckCircle2 className="w-4 h-4 text-[#1E8E5A] shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-[#C62828] shrink-0" />
                )}
                <span className={`font-semibold ${item.ok ? 'text-[#1F1420] dark:text-white' : 'text-[#C62828] dark:text-rose-400'}`}>
                  {item.label}
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#97144D] dark:text-[#FFDF85] flex items-center gap-0.5">
                {item.ok ? 'Verified' : 'Fix Now'}
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. QUICK SERVICES: 4x2 ICON GRID                            */}
      {/* ============================================================ */}
      <div className="space-y-2">
        <h2 className="text-sm font-extrabold text-[#1F1420] dark:text-[#F5ECF1] px-1">
          Quick Services
        </h2>
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'qs-book', label: 'Book Visit', icon: Calendar, view: 'visit', badge: null, color: 'text-[#97144D] bg-[#97144D]/10' },
            { id: 'qs-rent', label: 'Pay Rent', icon: CreditCard, view: 'rent', badge: activeLocker?.outstandingRent ? 'Due' : null, color: 'text-amber-600 bg-amber-500/10' },
            { id: 'qs-find', label: 'Find Locker', icon: Search, view: 'find', badge: null, color: 'text-emerald-600 bg-emerald-500/10' },
            { id: 'qs-wait', label: 'Waitlist', icon: Clock, view: 'waitlist', badge: null, color: 'text-[#C9A24B] bg-[#C9A24B]/15' },
            { id: 'qs-agr', label: 'Agreements', icon: FileCheck2, view: 'agreements', badge: null, color: 'text-indigo-600 bg-indigo-500/10' },
            { id: 'qs-nom', label: 'Nominees', icon: Users, view: 'holders', badge: null, color: 'text-sky-600 bg-sky-500/10' },
            { id: 'qs-req', label: 'Requests', icon: FileText, view: 'requests', badge: serviceRequests.length > 0 ? String(serviceRequests.length) : null, color: 'text-purple-600 bg-purple-500/10' },
            { id: 'qs-sup', label: 'Support', icon: Headphones, view: 'support', badge: null, color: 'text-teal-600 bg-teal-500/10' },
          ].map(s => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setCustomerView(s.view)}
                className="p-2.5 bg-white dark:bg-[#221019] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] hover:border-[#97144D] rounded-2xl shadow-xs flex flex-col items-center justify-center text-center transition-all group min-h-[82px] active-press cursor-pointer relative"
              >
                {s.badge && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-[#C62828] text-white shadow-xs">
                    {s.badge}
                  </span>
                )}
                <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-1.5 transition-transform group-hover:scale-105`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-[#1F1420] dark:text-[#F5ECF1] leading-tight">
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. UPCOMING VISIT (LIVE WITH NOW SERVING TICKER)             */}
      {/* ============================================================ */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-extrabold text-[#1F1420] dark:text-[#F5ECF1] tracking-tight">
            Upcoming Vault Visit
          </h2>
          <button
            type="button"
            onClick={() => setCustomerView('visit')}
            className="text-xs font-bold text-[#97144D] dark:text-[#FFDF85] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Manage All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {nextAppointment ? (
          <div className="bg-white dark:bg-[#221019] rounded-3xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] p-4 shadow-sm space-y-3">
            {/* Top row: Token on its own line & copy button */}
            <div className="flex items-center justify-between border-b border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] pb-2.5">
              <div>
                <span className="text-[10px] font-mono text-[#6B5B68] dark:text-[#A898A4] uppercase block">
                  Queue Token Number
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-sm tracking-wider text-[#97144D] dark:text-[#FFDF85]">
                    {nextAppointment.tokenNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyTokenNumber(nextAppointment.tokenNumber)}
                    className="p-1 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 text-[#6B5B68] dark:text-[#A898A4]"
                    title="Copy Token"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {copiedToken === nextAppointment.tokenNumber && (
                    <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>
                  )}
                </div>
              </div>
              <StatusBadge status={nextAppointment.status} size="sm" />
            </div>

            {/* Date, Time, Branch, and Live Ticker */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#FAF6F8] dark:bg-[#2E1624] p-2.5 rounded-2xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4]">Schedule</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#97144D]/10 text-[#97144D] dark:text-[#FFDF85] text-[9px] font-extrabold uppercase">
                    {formatAppointmentTime(nextAppointment.date, nextAppointment.timeSlot).relativeChip}
                  </span>
                </div>
                <span className="font-bold text-xs text-[#1F1420] dark:text-white mt-0.5 block truncate">
                  {formatAppointmentTime(nextAppointment.date, nextAppointment.timeSlot).formatted}
                </span>
              </div>

              <div className="bg-[#FAF6F8] dark:bg-[#2E1624] p-2.5 rounded-2xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
                <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] block">Branch Vault</span>
                <span className="font-bold text-xs text-[#1F1420] dark:text-white mt-0.5 block truncate">
                  {nextAppointment.branchName}
                </span>
              </div>
            </div>

            {/* Live Ticker & Queue Position */}
            <div className="p-2.5 bg-gradient-to-r from-[#6B0E37]/10 to-[#97144D]/10 dark:from-[#6B0E37]/30 dark:to-[#97144D]/30 border border-[#97144D]/25 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="font-bold text-[#1F1420] dark:text-white">
                  Now Serving: #{String(nowServingNumber).padStart(3, '0')}
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#97144D] dark:text-[#FFDF85] font-extrabold">
                Your Position: #{nextAppointment.tokenNumber.slice(-3) || '014'}
              </span>
            </div>

            {/* 4 Action Buttons: Show QR Pass / Directions / Add to Wallet / Reschedule */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleViewPass(nextAppointment)}
                className="h-11 rounded-xl bg-[#97144D] hover:bg-[#6B0E37] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs active-press cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-[#FFDF85]" />
                <span>Show QR Pass</span>
              </button>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(nextAppointment.branchName + ' SafeVault')}`}
                target="_blank"
                rel="noreferrer"
                className="h-11 rounded-xl bg-[#FAF6F8] dark:bg-[#2E1624] hover:bg-slate-200 dark:hover:bg-[#381B30] text-[#1F1420] dark:text-white font-bold text-xs border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-[#97144D] dark:text-[#FFDF85]" />
                <span>Directions</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setWalletToast(true);
                  setTimeout(() => setWalletToast(false), 3000);
                }}
                className="h-10 rounded-xl bg-[#FAF6F8] dark:bg-[#2E1624] hover:bg-slate-200 dark:hover:bg-[#381B30] text-[#1F1420] dark:text-white font-bold text-xs border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <Wallet className="w-4 h-4 text-[#C9A24B]" />
                <span>Add to Wallet</span>
              </button>

              <button
                type="button"
                onClick={() => setRescheduleSheetApt(nextAppointment)}
                className="h-10 rounded-xl bg-[#97144D]/10 hover:bg-[#97144D]/20 text-[#97144D] dark:text-[#FFDF85] font-bold text-xs border border-[#97144D]/30 flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reschedule</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-white dark:bg-[#221019] rounded-3xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] text-center space-y-2">
            <Calendar className="w-8 h-8 text-[#97144D]/40 mx-auto" />
            <p className="text-xs font-medium text-[#6B5B68] dark:text-[#A898A4]">
              No future strongroom visits scheduled.
            </p>
            <button
              type="button"
              onClick={() => setCustomerView('visit')}
              className="px-4 py-2 bg-[#97144D] text-white rounded-xl text-xs font-bold shadow-xs active-press cursor-pointer"
            >
              Book a Visit
            </button>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* 5. RENT & DEPOSIT CARD                                      */}
      {/* ============================================================ */}
      <div className="bg-white dark:bg-[#221019] rounded-3xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-[#1F1420] dark:text-[#F5ECF1]">
                Rent & Deposit Summary
              </h2>
              <span className="text-[11px] text-[#6B5B68] dark:text-[#A898A4]">
                Locker #{activeLocker?.lockerNumber}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCustomerView('rent')}
            className="text-xs font-bold text-[#97144D] dark:text-[#FFDF85] hover:underline"
          >
            Pay / View
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-[#FAF6F8] dark:bg-[#2E1624] p-2.5 rounded-2xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
            <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] block">Annual Tariff (+18% GST)</span>
            <span className="font-mono font-black text-sm text-[#1F1420] dark:text-white mt-0.5 block">
              ₹{Math.round((activeLocker?.annualRent || 4500) * 1.18).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="bg-[#FAF6F8] dark:bg-[#2E1624] p-2.5 rounded-2xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
            <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] block">Security Deposit Lien</span>
            <span className="font-mono font-black text-sm text-[#1E8E5A] mt-0.5 block">
              ₹{(activeLocker?.securityDeposit || 13500).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
          <div className="flex items-center gap-1 font-bold">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Late-Fee Policy Advisory:</span>
          </div>
          <p className="leading-relaxed">
            2.5% per month late fee levied on overdue rent (maximum 25% cap - demo value). Auto-debit active on account XXXX 1720.
          </p>
        </div>

        <div className="p-2.5 bg-[#FAF6F8] dark:bg-[#2E1624] rounded-2xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] flex items-center justify-between text-xs">
          <span className="text-[#6B5B68] dark:text-[#A898A4]">Pro-rata refund if surrendered today:</span>
          <span className="font-mono font-extrabold text-[#1E8E5A]">
            ₹{Math.round((activeLocker?.annualRent || 4500) * 0.5 + (activeLocker?.securityDeposit || 13500)).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 6. SECURITY CENTRE MODULE                                    */}
      {/* ============================================================ */}
      <div className="bg-white dark:bg-[#221019] rounded-3xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-[#1F1420] dark:text-[#F5ECF1]">
                Security Centre
              </h2>
              <span className="text-[11px] text-[#6B5B68] dark:text-[#A898A4]">
                Biometric Turnstile Guardrails
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleToggleFreeze(activeLocker?.id || '', activeLocker?.status || '')}
            className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer active-press ${
              activeLocker?.status === 'Blocked'
                ? 'bg-emerald-500 text-white border-emerald-600'
                : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/40'
            }`}
          >
            {activeLocker?.status === 'Blocked' ? 'Lift Freeze' : 'Emergency Freeze'}
          </button>
        </div>

        {/* Last access details */}
        <div className="p-3 bg-[#FAF6F8] dark:bg-[#2E1624] rounded-2xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#6B5B68] dark:text-[#A898A4]">Last Verified Vault Entry:</span>
            <span className="px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
              Turnstile Passed
            </span>
          </div>
          <p className="font-bold text-[#1F1420] dark:text-white">
            18 Oct 2026 at 11:24 AM · Rahul Sharma (Biometric Fingerprint + Smartcard)
          </p>
          <div className="flex items-center gap-2 pt-1 text-[11px] text-[#6B5B68] dark:text-[#A898A4]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Access alert sent by SMS & email to registered contacts.</span>
          </div>
        </div>

        {/* Dispute button */}
        <button
          type="button"
          onClick={() => {
            logAccessDispute(
              activeLocker?.id || 'lck-125',
              'Unrecognized strongroom entry event flagged by customer from Mobile Security Centre'
            );
          }}
          className="w-full h-10 rounded-xl bg-white dark:bg-[#2E1624] border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors active-press cursor-pointer"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Not me? Report Unauthorized Entry</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* 7. COVER & STATUTORY LIABILITY CARD                         */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-[#14080F] to-[#2E1624] text-white rounded-3xl p-4 shadow-md border border-white/10 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#C9A24B]/20 text-[#FFDF85] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#FFDF85] font-extrabold block">
                STATUTORY SAFEGUARD
              </span>
              <h2 className="text-sm font-extrabold text-white">
                Bank Liability Cap: ₹{statutoryLiabilityCap.toLocaleString('en-IN')}
              </h2>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#C9A24B]/30 text-[#FFDF85] border border-[#C9A24B]/40 text-[10px] font-bold font-mono">
            100x Rent
          </span>
        </div>

        <p className="text-xs text-white/80 leading-relaxed">
          As mandated by Reserve Bank of India instructions, bank liability is statutory pegged at 100 times prevailing annual rent. The Bank does not inspect, inventory or insure locker contents.
        </p>

        <div className="pt-1">
          <button
            type="button"
            onClick={() => setCustomerView('agreements')}
            className="text-xs font-bold text-[#FFDF85] underline flex items-center gap-1 hover:text-white cursor-pointer"
          >
            <span>Review Agreement Clauses</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 8. BRANCH INSIGHTS MODULE                                    */}
      {/* ============================================================ */}
      <div className="bg-white dark:bg-[#221019] rounded-3xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] pb-2.5">
          <div>
            <h2 className="text-sm font-extrabold text-[#1F1420] dark:text-[#F5ECF1]">
              Branch Vault Insights
            </h2>
            <span className="text-[11px] text-[#6B5B68] dark:text-[#A898A4]">
              {activeLocker?.branchName}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-[#1E8E5A] border border-emerald-500/20 text-[10px] font-bold">
            Best time: 10:30 AM
          </span>
        </div>

        {/* Busy hours bar chart visual */}
        <div className="space-y-1 text-xs">
          <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] font-bold uppercase tracking-wider">
            Typical Vault Traffic (Weekdays)
          </span>
          <div className="grid grid-cols-6 gap-1 pt-1 items-end h-20 bg-[#FAF6F8] dark:bg-[#2E1624] p-2 rounded-2xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
            {[
              { time: '10 AM', height: '40%', busy: 'Low' },
              { time: '12 PM', height: '85%', busy: 'Peak' },
              { time: '2 PM', height: '55%', busy: 'Med' },
              { time: '3 PM', height: '70%', busy: 'Med' },
              { time: '4 PM', height: '95%', busy: 'Peak' },
              { time: '5 PM', height: '30%', busy: 'Low' },
            ].map(col => (
              <div key={col.time} className="flex flex-col items-center gap-1 h-full justify-end">
                <div
                  className="w-full rounded-t-lg bg-[#97144D] hover:bg-[#6B0E37] transition-all"
                  style={{ height: col.height }}
                  title={`${col.time}: ${col.busy}`}
                />
                <span className="text-[9px] font-mono text-[#6B5B68] dark:text-[#A898A4]">{col.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
          <div className="p-2 bg-[#FAF6F8] dark:bg-[#2E1624] rounded-xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
            <span className="text-[#6B5B68] dark:text-[#A898A4] block">Operating Hours</span>
            <span className="font-bold text-[#1F1420] dark:text-white">10:00 AM – 5:30 PM</span>
          </div>
          <div className="p-2 bg-[#FAF6F8] dark:bg-[#2E1624] rounded-xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
            <span className="text-[#6B5B68] dark:text-[#A898A4] block">Holiday Notice</span>
            <span className="font-bold text-[#1F1420] dark:text-white">2nd & 4th Sat Closed</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 9. COST & VISITS INSIGHTS (Two charts)                       */}
      {/* ============================================================ */}
      <div className="bg-white dark:bg-[#221019] rounded-3xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] p-4 shadow-sm space-y-3">
        <h2 className="text-sm font-extrabold text-[#1F1420] dark:text-[#F5ECF1] border-b border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] pb-2.5">
          Personal Locker Analytics
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Chart 1: Yearly cost breakdown */}
          <div className="p-3 bg-[#FAF6F8] dark:bg-[#2E1624] rounded-2xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] space-y-2">
            <span className="font-bold text-xs text-[#1F1420] dark:text-white block">
              Yearly Cost (Rent + 18% GST)
            </span>
            <div className="flex items-center gap-2 pt-1">
              <div className="flex-1 bg-slate-200 dark:bg-black/30 h-3 rounded-full overflow-hidden flex">
                <div className="bg-[#97144D] h-full" style={{ width: '82%' }} title="Base Rent" />
                <div className="bg-[#C9A24B] h-full" style={{ width: '18%' }} title="GST (18%)" />
              </div>
            </div>
            <div className="flex justify-between text-[11px] font-mono pt-1 text-[#6B5B68] dark:text-[#A898A4]">
              <span>Base: ₹{(activeLocker?.annualRent || 4500).toLocaleString('en-IN')}</span>
              <span>GST: ₹{Math.round((activeLocker?.annualRent || 4500) * 0.18).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Chart 2: Visits per month */}
          <div className="p-3 bg-[#FAF6F8] dark:bg-[#2E1624] rounded-2xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] space-y-2">
            <span className="font-bold text-xs text-[#1F1420] dark:text-white block">
              Visits Frequency (Past 4 Months)
            </span>
            <div className="flex items-end gap-2 h-10 pt-1">
              {[
                { m: 'Jul', count: 1 },
                { m: 'Aug', count: 2 },
                { m: 'Sep', count: 1 },
                { m: 'Oct', count: 3 }
              ].map(item => (
                <div key={item.m} className="flex-1 flex flex-col items-center gap-0.5">
                  <div
                    className="w-full bg-[#97144D] rounded-t-sm"
                    style={{ height: `${item.count * 8 + 4}px` }}
                  />
                  <span className="text-[9px] font-mono text-[#6B5B68] dark:text-[#A898A4]">{item.m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 10. RECENT ACTIVITY (FILTERED: ALL / ACCESS / PAYMENTS / REQ) */}
      {/* ============================================================ */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-extrabold text-[#1F1420] dark:text-[#F5ECF1] tracking-tight">
            Recent Activity
          </h2>
          {/* Activity Filters */}
          <div className="flex items-center gap-1">
            {(['All', 'Access', 'Payments', 'Requests'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActivityFilter(tab)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  activityFilter === tab
                    ? 'bg-[#97144D] text-white shadow-2xs'
                    : 'bg-white dark:bg-[#221019] text-[#6B5B68] dark:text-[#A898A4] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#221019] rounded-3xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] divide-y divide-[#E8DFE5] dark:divide-[rgba(255,255,255,0.12)] shadow-sm overflow-hidden">
          {filteredActivity.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#6B5B68] dark:text-[#A898A4]">
              No activity logs recorded under {activityFilter}.
            </div>
          ) : (
            filteredActivity.map(act => (
              <div key={act.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5 min-w-0">
                  <span className="font-bold text-xs text-[#1F1420] dark:text-white block truncate">
                    {act.title}
                  </span>
                  <span className="text-[11px] text-[#6B5B68] dark:text-[#A898A4] block truncate">
                    {act.subtitle}
                  </span>
                  <span className="text-[10px] font-mono text-[#6B5B68] dark:text-[#A898A4]/70 block">
                    {act.date}
                  </span>
                </div>
                {act.status && (
                  <StatusBadge status={act.status as any} size="sm" />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 11. ASK SAFEVAULT: FLOATING ASSISTANT BUTTON & CHAT SHEET   */}
      {/* ============================================================ */}
      <div className="fixed bottom-20 right-4 sm:right-auto sm:left-[calc(50%+130px)] z-40">
        <button
          type="button"
          onClick={() => setIsAskOpen(true)}
          className="h-12 px-4 rounded-full bg-gradient-to-r from-[#6B0E37] to-[#97144D] text-white font-extrabold text-xs shadow-xl flex items-center gap-2 border border-[#FFDF85]/40 hover:scale-105 transition-all active-press cursor-pointer"
          aria-label="Ask SafeVault Assistant"
        >
          <Bot className="w-5 h-5 text-[#FFDF85]" />
          <span className="hidden xs:inline">Ask SafeVault</span>
        </button>
      </div>

      {/* Floating Chat Bottom Sheet */}
      {isAskOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#221019] rounded-t-3xl sm:rounded-3xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] max-w-sm w-full h-[520px] flex flex-col shadow-2xl text-xs overflow-hidden animate-in slide-in-from-bottom duration-250">
            {/* Chat Header */}
            <div className="p-3.5 bg-gradient-to-r from-[#6B0E37] to-[#97144D] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-[#FFDF85]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">Ask SafeVault</h3>
                  <span className="text-[10px] text-white/80">Automated Banking Assistant</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAskOpen(false)}
                className="p-1 rounded-lg text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Prompt Pills */}
            <div className="p-2.5 bg-[#FAF6F8] dark:bg-[#2E1624] border-b border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
              {[
                'When is my rent due?',
                'How to nominate?',
                'Lost key policy',
                'Cancellation fee'
              ].map(prompt => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSendChat(prompt)}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-[#221019] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] text-[10px] font-bold text-[#97144D] dark:text-[#FFDF85] whitespace-nowrap hover:bg-[#FAF6F8] cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
              {chatMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-[#97144D] text-white rounded-br-none'
                        : 'bg-[#FAF6F8] dark:bg-[#2E1624] text-[#1F1420] dark:text-white border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] rounded-bl-none'
                    }`}
                  >
                    <p>{m.text}</p>
                    <span className="text-[9px] font-mono opacity-70 block mt-1 text-right">
                      {m.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendChat();
              }}
              className="p-3 bg-white dark:bg-[#221019] border-t border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 h-10 px-3 bg-[#FAF6F8] dark:bg-[#2E1624] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] rounded-xl text-xs text-[#1F1420] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#97144D]"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-xl bg-[#97144D] hover:bg-[#6B0E37] text-white flex items-center justify-center shrink-0 cursor-pointer active-press"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* RESCHEDULE CHARGE PREVIEW SHEET */}
      {rescheduleSheetApt && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#221019] rounded-t-3xl sm:rounded-3xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] max-w-sm w-full p-5 space-y-4 shadow-2xl text-xs animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] pb-2.5">
              <div>
                <h3 className="text-base font-extrabold text-[#1F1420] dark:text-white">
                  Reschedule Visit
                </h3>
                <span className="text-[10px] font-bold text-[#97144D] dark:text-[#FFDF85] uppercase">
                  Charges as per bank policy (demo values)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setRescheduleSheetApt(null)}
                className="p-1.5 rounded-lg text-[#6B5B68] hover:bg-black/5"
              >
                ✕
              </button>
            </div>

            {(() => {
              const resFee = computeRescheduleCharge(rescheduleSheetApt.date, rescheduleSheetApt.timeSlot, 0);
              return (
                <div className="space-y-3">
                  <div className="p-3 bg-[#FAF6F8] dark:bg-[#2E1624] rounded-2xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#6B5B68] dark:text-[#A898A4]">Current Slot:</span>
                      <span className="font-bold text-[#1F1420] dark:text-white">{rescheduleSheetApt.date} · {rescheduleSheetApt.timeSlot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B5B68] dark:text-[#A898A4]">Applied Slab:</span>
                      <span className="font-bold text-[#97144D] dark:text-[#FFDF85]">{resFee.slabLabel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B5B68] dark:text-[#A898A4]">Fee:</span>
                      <span className="font-mono font-black text-sm text-[#1F1420] dark:text-white">
                        {resFee.totalCharge === 0 ? 'FREE' : `₹${resFee.totalCharge} (incl. 18% GST)`}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setRescheduleSheetApt(null);
                      setCustomerView('visit');
                    }}
                    className="w-full h-11 bg-[#97144D] hover:bg-[#6B0E37] text-white font-bold rounded-xl text-xs shadow-md cursor-pointer active-press"
                  >
                    Proceed to Choose New Slot
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* OTP Step-Up Modal for Security Freeze */}
      <OtpModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onSuccess={handleOtpSuccess}
        title={otpAction === 'freeze' ? 'Confirm Security Freeze' : 'Lift Security Freeze'}
        actionDescription={
          otpAction === 'freeze'
            ? 'Place emergency biometric lockout on your locker compartment'
            : 'Restore normal biometric access to your locker compartment'
        }
      />

    </div>
  );
};
