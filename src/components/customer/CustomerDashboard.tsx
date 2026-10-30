import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useBanking } from '../../context/BankingContext';
import { OtpModal } from '../common/OtpModal';
import { Appointment, LockerItem } from '../../types';
import { useScrollLock } from '../../hooks/useScrollLock';
import { formatIndianCurrency, maskAccountNumber } from '../../utils/formatters';
import { Overline } from '../common/Overline';
import { StatusPill } from '../common/StatusPill';
import { SectionHeader } from '../common/SectionHeader';
import { AvailableBalanceCard } from './AvailableBalanceCard';

// Recharts components
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip
} from 'recharts';

import {
  Key,
  Calendar,
  CreditCard,
  Search,
  Clock,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  QrCode,
  AlertCircle,
  CheckCircle2,
  Lock,
  Unlock,
  Users,
  MapPin,
  ArrowRight,
  X,
  FileText,
  Building,
  Copy,
  ExternalLink,
  Bot,
  Send,
  MoreVertical,
  Grid,
  ShieldAlert,
  Check,
  HeartHandshake
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
    unrestrictLockerAccess
  } = useBanking();

  // Strict Customer Isolation: Rahul Sharma
  const customerLockers = useMemo(() => {
    return lockers.filter(
      l => l.customerId === 'cust-rahul-01' || l.customerName === 'Rahul Sharma'
    );
  }, [lockers]);

  // Active locker index for mobile carousel/swiper
  const [activeLockerIndex, setActiveLockerIndex] = useState(0);
  const activeLocker = customerLockers[activeLockerIndex] || customerLockers[0] || lockers[0];

  // Sync selected locker with global context
  useEffect(() => {
    if (activeLocker && activeLocker.id !== selectedLockerId) {
      setSelectedLockerId(activeLocker.id);
    }
  }, [activeLocker, selectedLockerId, setSelectedLockerId]);

  // Main 3-Tab Segmented Control State: Overview | Insights | Activity
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'activity'>('overview');

  // Bottom sheets & Modal states
  const [isHealthSheetOpen, setIsHealthSheetOpen] = useState(false);
  const [isKebabMenuOpen, setIsKebabMenuOpen] = useState(false);
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);
  const [isBalanceSheetOpen, setIsBalanceSheetOpen] = useState(false);
  const [detailLocker, setDetailLocker] = useState<LockerItem | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Security Freeze OTP state
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpAction, setOtpAction] = useState<'freeze' | 'unfreeze'>('freeze');

  // Copied token indicator
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Scroll direction for floating "Ask SafeVault" button
  const [showChatButton, setShowChatButton] = useState(true);
  const lastScrollY = useRef(0);

  // Accordion state in Insights tab
  const [isHealthAccordionOpen, setIsHealthAccordionOpen] = useState(false);

  // Activity filter state & pagination
  const [activityFilter, setActivityFilter] = useState<'All' | 'Access' | 'Payments' | 'Requests'>('All');
  const [activityPageSize, setActivityPageSize] = useState(5);

  // Lock scroll for modal sheets
  useScrollLock(
    isHealthSheetOpen ||
    isKebabMenuOpen ||
    isMoreSheetOpen ||
    isBalanceSheetOpen ||
    Boolean(detailLocker) ||
    isChatOpen
  );

  // Floating button scroll direction listener
  useEffect(() => {
    const handleScroll = (currentY: number) => {
      if (currentY > lastScrollY.current + 8 && currentY > 60) {
        setShowChatButton(false);
      } else if (currentY < lastScrollY.current - 8) {
        setShowChatButton(true);
      }
      lastScrollY.current = currentY;
    };

    const onWindowScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      handleScroll(y);
    };

    const mainElem = document.querySelector('main');
    const onMainScroll = () => {
      if (mainElem) handleScroll(mainElem.scrollTop);
    };

    window.addEventListener('scroll', onWindowScroll, { passive: true });
    if (mainElem) {
      mainElem.addEventListener('scroll', onMainScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', onWindowScroll);
      if (mainElem) mainElem.removeEventListener('scroll', onMainScroll);
    };
  }, []);

  // Time-based greeting: "Good morning, Rahul" / "Good afternoon, Rahul" / "Good evening, Rahul"
  const greetingText = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning, Rahul';
    if (hour < 17) return 'Good afternoon, Rahul';
    return 'Good evening, Rahul';
  }, []);

  // Filter ONLY FUTURE appointments for Upcoming Visit
  const upcomingAppointment = useMemo(() => {
    const now = new Date();
    return appointments
      .filter(apt => {
        if (apt.status === 'Cancelled' || apt.status === 'Completed') return false;
        const aptDate = new Date(`${apt.date}T23:59:59`);
        return aptDate >= now;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }, [appointments]);

  // Health checklist score
  const healthChecklist = useMemo(() => {
    const rentPaid = (activeLocker?.outstandingRent || 0) === 0;
    const agreementRenewed = true;
    const kycValid = true;
    const hasNominee = (nominees[activeLocker?.id || ''] || []).length > 0;
    const autoDebitActive = true;

    const items = [
      { id: 'h1', label: 'Annual Rent Settled (FY 2026-27)', ok: rentPaid, weight: 25, fixView: 'rent' },
      { id: 'h2', label: 'Model Agreement Stamped & Executed', ok: agreementRenewed, weight: 20, fixView: 'agreements' },
      { id: 'h3', label: 'Periodic KYC Re-validation Current', ok: kycValid, weight: 20, fixView: 'agreements' },
      { id: 'h4', label: 'Nomination Registered (Form SL-1)', ok: hasNominee, weight: 20, fixView: 'holders' },
      { id: 'h5', label: 'CBS Auto-Debit Mandate Configured', ok: autoDebitActive, weight: 15, fixView: 'rent' },
    ];

    const score = items.reduce((acc, curr) => acc + (curr.ok ? curr.weight : 0), 0);
    return { items, score };
  }, [activeLocker, nominees]);

  // Needs Attention (max 3 items, horizontal snap cards, ~280x88 each)
  const actionItems = useMemo(() => {
    const items: Array<{
      id: string;
      title: string;
      detail: string;
      ctaText: string;
      action: () => void;
      urgency: 'high' | 'medium' | 'info';
    }> = [];

    // Rent overdue or due
    const overdueLocker = customerLockers.find(l => (l.outstandingRent || 0) > 0);
    if (overdueLocker) {
      items.push({
        id: 'act-rent',
        title: 'Rent Payment Due',
        detail: `${formatIndianCurrency(overdueLocker.outstandingRent || 0)} due for Locker #${overdueLocker.lockerNumber}`,
        ctaText: 'Pay Now',
        action: () => setCustomerView('rent'),
        urgency: 'high'
      });
    }

    // Nominee check
    const activeNominees = nominees[activeLocker?.id || ''] || [];
    if (activeNominees.length === 0) {
      items.push({
        id: 'act-nominee',
        title: 'Nomination Pending',
        detail: 'Register nominee under Form SL-1 per RBI mandate',
        ctaText: 'Add Nominee',
        action: () => setCustomerView('holders'),
        urgency: 'medium'
      });
    }

    // Periodic KYC refresh
    items.push({
      id: 'act-kyc',
      title: 'Periodic KYC Refresh',
      detail: 'Scheduled re-validation due by 31 Dec 2026',
      ctaText: 'Verify KYC',
      action: () => setCustomerView('agreements'),
      urgency: 'info'
    });

    return items.slice(0, 3);
  }, [customerLockers, nominees, activeLocker, setCustomerView]);

  // Copy to clipboard helper
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(text);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  // Toggle security freeze
  const handleToggleFreeze = () => {
    setIsKebabMenuOpen(false);
    setOtpAction(activeLocker?.status === 'Blocked' ? 'unfreeze' : 'freeze');
    setIsOtpOpen(true);
  };

  const handleOtpSuccess = () => {
    if (!activeLocker) return;
    if (otpAction === 'freeze') {
      restrictLockerAccess(activeLocker.id, 'Customer initiated security freeze');
    } else {
      unrestrictLockerAccess(activeLocker.id);
    }
  };

  // Chat message submission
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Namaste Rahul! I am your SafeVault Vault Assistant. How can I help you with your safe deposit locker today?',
      time: '10:00 AM'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSendChat = (textToSend?: string) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;

    const userMsg = { sender: 'user' as const, text: query, time: 'Now' };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      let botReply = 'I have noted your request. Branch operations team has been notified.';
      const lower = query.toLowerCase();
      if (lower.includes('timing') || lower.includes('hour') || lower.includes('time')) {
        botReply = 'Connaught Place Main Branch vault is open Mon-Fri from 10:00 AM to 5:30 PM. 1st & 3rd Saturdays: 10:00 AM to 2:00 PM. Best visitation slot is 10:30 AM.';
      } else if (lower.includes('nominee') || lower.includes('sl-1')) {
        botReply = 'You can register up to 4 nominees under statutory Form SL-1 or SL-1A (for minors) in the Holders & Nominees section with Aadhaar step-up.';
      } else if (lower.includes('key') || lower.includes('lost')) {
        botReply = 'The bank does not hold duplicate keys. In case of lost keys, raise a Lost Key & Break-Open ticket in Service Requests. Authorized Godrej locksmith fee is ₹4,500 + GST.';
      } else if (lower.includes('rent') || lower.includes('tax') || lower.includes('gst')) {
        botReply = 'Your annual rent for Locker #A-125 is ₹4,500 + 18% GST (₹810) = ₹5,310 due on 15 Jan 2027.';
      } else if (lower.includes('liability') || lower.includes('insurance')) {
        botReply = 'Under RBI circular, SafeVault statutory liability is capped at 100x annual rent (₹4,50,000). The bank does not inspect or insure contents.';
      }

      setChatMessages(prev => [
        ...prev,
        { sender: 'bot' as const, text: botReply, time: 'Now' }
      ]);
    }, 500);
  };

  // Yearly Cost Donut Data
  const yearlyCostData = [
    { name: 'Base Annual Rent', value: 4500, color: '#97144D' },
    { name: 'GST (18%)', value: 810, color: '#C9A24B' },
    { name: 'Maintenance & Security', value: 0, color: '#008C88' },
    { name: 'Penalties / Late Fees', value: 0, color: '#E895B8' },
  ];

  // Monthly Visits Frequency Bar Chart Data
  const visitsBarData = [
    { month: 'Jul', visits: 1, isCurrent: false },
    { month: 'Aug', visits: 2, isCurrent: false },
    { month: 'Sep', visits: 1, isCurrent: false },
    { month: 'Oct', visits: 3, isCurrent: true },
  ];

  // Busy hours heat strip data
  const busyHoursData = [
    { hour: '9 AM', level: 'Low', occupancy: 20, color: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' },
    { hour: '10 AM', level: 'Best', occupancy: 35, isBest: true, color: 'bg-emerald-500/30 text-emerald-800 dark:text-emerald-200 ring-2 ring-[#C9A24B]' },
    { hour: '11 AM', level: 'Busy', occupancy: 85, color: 'bg-[#97144D]/25 text-[#97144D] dark:text-[#FFDF85]' },
    { hour: '12 PM', level: 'Peak', occupancy: 95, color: 'bg-[#97144D]/40 text-[#97144D] dark:text-[#FFDF85]' },
    { hour: '1 PM', level: 'Moderate', occupancy: 50, color: 'bg-amber-500/20 text-amber-800 dark:text-amber-200' },
    { hour: '2 PM', level: 'Low', occupancy: 25, color: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' },
    { hour: '3 PM', level: 'Moderate', occupancy: 60, color: 'bg-amber-500/20 text-amber-800 dark:text-amber-200' },
    { hour: '4 PM', level: 'Busy', occupancy: 80, color: 'bg-[#97144D]/25 text-[#97144D] dark:text-[#FFDF85]' },
    { hour: '5 PM', level: 'Low', occupancy: 30, color: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' },
  ];

  // Activity items grouped by date ("Today", "Yesterday", "Earlier")
  const groupedActivity = useMemo(() => {
    const rawItems: Array<{
      id: string;
      title: string;
      subtitle: string;
      dateGroup: 'Today' | 'Yesterday' | 'Earlier';
      formattedDate: string;
      type: 'access' | 'payment' | 'request';
      status?: string;
    }> = [];

    if (activityFilter === 'All' || activityFilter === 'Access') {
      accessLogs.forEach((log, idx) => {
        rawItems.push({
          id: `acc-${log.id}`,
          title: `Vault Entry · Safe #${log.lockerNumber}`,
          subtitle: `${log.operatedBy} · Turnstile Key Verified`,
          dateGroup: idx === 0 ? 'Today' : idx === 1 ? 'Yesterday' : 'Earlier',
          formattedDate: `${log.date} · ${log.timeIn}`,
          type: 'access',
          status: 'Turnstile Verified'
        });
      });
    }

    if (activityFilter === 'All' || activityFilter === 'Payments') {
      payments.forEach((p, idx) => {
        rawItems.push({
          id: `pay-${p.id}`,
          title: `Rent Payment · ${formatIndianCurrency(p.totalAmount)}`,
          subtitle: `CBS Auto-Debit · Ref: ${p.transactionRef}`,
          dateGroup: 'Earlier',
          formattedDate: p.paymentDate,
          type: 'payment',
          status: p.status
        });
      });
    }

    if (activityFilter === 'All' || activityFilter === 'Requests') {
      serviceRequests.forEach(sr => {
        rawItems.push({
          id: `sr-${sr.id}`,
          title: `${sr.requestType} · ${sr.ticketNumber}`,
          subtitle: `Safe #${sr.lockerNumber} · ${sr.branchName}`,
          dateGroup: 'Earlier',
          formattedDate: sr.createdDate,
          type: 'request',
          status: sr.status
        });
      });
    }

    const visibleItems = rawItems.slice(0, activityPageSize);

    const groups: { [key in 'Today' | 'Yesterday' | 'Earlier']?: typeof visibleItems } = {};
    visibleItems.forEach(item => {
      if (!groups[item.dateGroup]) groups[item.dateGroup] = [];
      groups[item.dateGroup]!.push(item);
    });

    return { groups, totalCount: rawItems.length, hasMore: rawItems.length > activityPageSize };
  }, [activityFilter, accessLogs, payments, serviceRequests, activityPageSize]);

  return (
    <div className="space-y-3.5 pb-20 text-[#1F1420] dark:text-[#F5ECF1] selection:bg-[#97144D] selection:text-white">
      
      {/* ============================================================ */}
      {/* 1. GREETING & STATUS CHIPS (NO "2 Active Lockers" pill)      */}
      {/* ============================================================ */}
      <div className="pt-0.5 px-0.5">
        <h1 className="text-[22px] font-bold leading-[28px] text-[#1F1420] dark:text-[#F3ECF0] tracking-tight font-['Manrope']">
          {greetingText}
        </h1>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#C9A24B]/15 text-[#8F6A1A] dark:text-[#FFDF85] border border-[#C9A24B]/30 tracking-tight">
            Premier Wealth
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#1E8E5A]/15 text-[#1E8E5A] dark:text-[#4ADE80] border border-[#1E8E5A]/30 tracking-tight">
            <Check className="w-3 h-3 stroke-[2.5]" />
            KYC verified
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. STICKY SEGMENTED CONTROL (36px): Overview|Insights|Activity */}
      {/* ============================================================ */}
      <div className="sticky top-[56px] z-20 bg-[#FAF6F8]/95 dark:bg-[#1A0C18]/95 backdrop-blur-md py-1 -mx-3.5 sm:-mx-4 px-3.5 sm:px-4 border-b border-[#E8DFE5]/60 dark:border-white/5">
        <div className="h-[36px] bg-black/5 dark:bg-white/10 p-0.5 rounded-xl flex items-center justify-between text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex-1 h-full rounded-lg transition-all flex items-center justify-center cursor-pointer active-press ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-[#2B1626] text-[#97144D] dark:text-[#FFDF85] shadow-xs font-bold'
                : 'text-[#6B5B68] dark:text-[#A898A4] hover:text-[#1F1420] dark:hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('insights')}
            className={`flex-1 h-full rounded-lg transition-all flex items-center justify-center cursor-pointer active-press ${
              activeTab === 'insights'
                ? 'bg-white dark:bg-[#2B1626] text-[#97144D] dark:text-[#FFDF85] shadow-xs font-bold'
                : 'text-[#6B5B68] dark:text-[#A898A4] hover:text-[#1F1420] dark:hover:text-white'
            }`}
          >
            Insights
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('activity')}
            className={`flex-1 h-full rounded-lg transition-all flex items-center justify-center cursor-pointer active-press ${
              activeTab === 'activity'
                ? 'bg-white dark:bg-[#2B1626] text-[#97144D] dark:text-[#FFDF85] shadow-xs font-bold'
                : 'text-[#6B5B68] dark:text-[#A898A4] hover:text-[#1F1420] dark:hover:text-white'
            }`}
          >
            Activity
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: OVERVIEW (EXACTLY 5 BLOCKS)                          */}
      {/* ============================================================ */}
      {activeTab === 'overview' && (
        <div className="space-y-3.5">
          
          {/* BLOCK 1: LOCKER CAROUSEL (THE ONLY GRADIENT CARD ON PAGE) */}
          <div className="space-y-2">
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-1">
              {customerLockers.map((locker, idx) => (
                <div
                  key={locker.id}
                  className="w-[90%] shrink-0 snap-center min-h-[152px] bg-gradient-to-br from-[#6B0E37] via-[#851144] to-[#97144D] text-white rounded-[20px] p-4 shadow-md relative overflow-hidden border border-[#6B0E37]/50 flex flex-col justify-between"
                >
                  {/* Row 1: Locker number (Manrope 22/700, NOT monospace), size chip, status pill, 44px health ring */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-['Manrope'] font-bold text-[22px] tracking-tight text-white leading-none">
                        A-125
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-medium border border-white/20">
                        {locker.size}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-200 border border-emerald-400/30 text-[11px] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {locker.status === 'Blocked' ? 'Frozen' : 'Occupied'}
                      </span>
                    </div>

                    {/* Small 44px Health Ring Button */}
                    <button
                      type="button"
                      onClick={() => setIsHealthSheetOpen(true)}
                      className="w-[44px] h-[44px] relative flex items-center justify-center cursor-pointer active-press shrink-0"
                      title="Compliance Checklist"
                      aria-label="Locker Health Score 100"
                    >
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-white/20"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-[#FFDF85]"
                          strokeDasharray="100, 100"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="absolute font-['Manrope'] font-bold text-[12px] text-[#FFDF85]">
                        100
                      </span>
                    </button>
                  </div>

                  {/* Row 2: Branch location (14px) */}
                  <div className="text-[14px] font-medium text-white/90 truncate mt-1">
                    {locker.branchName || 'Main Branch, Connaught Place'}
                  </div>

                  {/* Row 3: Single line rent/renewal/mandate */}
                  <div className="text-[12px] text-white/80 truncate no-wrap-amount tabular-nums mt-1">
                    ₹4,500/yr + GST · Renews 15 Jan 2027 · Single mandate
                  </div>

                  {/* Row 4: Two buttons [Book Visit] primary gold + [Details] ghost + kebab button */}
                  <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-white/15">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCustomerView('visit')}
                        className="bg-[#C9A24B] hover:bg-[#B89139] text-[#1F1420] font-semibold text-xs px-3.5 py-1.5 rounded-xl shadow-xs active-press cursor-pointer transition-colors"
                      >
                        Book Visit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDetailLocker(locker)}
                        className="bg-white/15 hover:bg-white/25 text-white font-medium text-xs px-3 py-1.5 rounded-xl active-press cursor-pointer transition-colors"
                      >
                        Details
                      </button>
                    </div>

                    {/* Kebab ... Button */}
                    <button
                      type="button"
                      onClick={() => setIsKebabMenuOpen(true)}
                      className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white active-press cursor-pointer transition-colors"
                      title="More Options"
                      aria-label="More Options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel dots */}
            {customerLockers.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 pt-0.5">
                {customerLockers.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveLockerIndex(idx)}
                    className={`transition-all rounded-full ${
                      idx === activeLockerIndex
                        ? 'w-5 h-1.5 bg-[#97144D]'
                        : 'w-1.5 h-1.5 bg-[#E8DFE5] dark:bg-[#381B30]'
                    }`}
                    aria-label={`Go to locker card ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* BLOCK 2: QUICK ACTIONS (ONE ROW OF 4 TILES + 5th "More") */}
          <div className="grid grid-cols-5 gap-2">
            {/* 1. Book Visit */}
            <button
              type="button"
              onClick={() => setCustomerView('visit')}
              className="h-[56px] flex flex-col items-center justify-center bg-white dark:bg-[#231221] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)] rounded-2xl active-press cursor-pointer hover:border-[#97144D]/30 shadow-xs transition-colors p-1"
            >
              <Calendar className="w-4 h-4 text-[#97144D] dark:text-[#FFDF85]" />
              <span className="text-[12px] font-medium text-[#1F1420] dark:text-[#F3ECF0] mt-1 truncate">
                Book Visit
              </span>
            </button>

            {/* 2. Pay Rent */}
            <button
              type="button"
              onClick={() => setCustomerView('rent')}
              className="h-[56px] flex flex-col items-center justify-center bg-white dark:bg-[#231221] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)] rounded-2xl active-press cursor-pointer hover:border-[#97144D]/30 shadow-xs transition-colors p-1"
            >
              <CreditCard className="w-4 h-4 text-[#97144D] dark:text-[#FFDF85]" />
              <span className="text-[12px] font-medium text-[#1F1420] dark:text-[#F3ECF0] mt-1 truncate">
                Pay Rent
              </span>
            </button>

            {/* 3. Find Locker */}
            <button
              type="button"
              onClick={() => setCustomerView('find')}
              className="h-[56px] flex flex-col items-center justify-center bg-white dark:bg-[#231221] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)] rounded-2xl active-press cursor-pointer hover:border-[#97144D]/30 shadow-xs transition-colors p-1"
            >
              <Search className="w-4 h-4 text-[#97144D] dark:text-[#FFDF85]" />
              <span className="text-[12px] font-medium text-[#1F1420] dark:text-[#F3ECF0] mt-1 truncate">
                Find Locker
              </span>
            </button>

            {/* 4. Nominees */}
            <button
              type="button"
              onClick={() => setCustomerView('holders')}
              className="h-[56px] flex flex-col items-center justify-center bg-white dark:bg-[#231221] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)] rounded-2xl active-press cursor-pointer hover:border-[#97144D]/30 shadow-xs transition-colors p-1"
            >
              <Users className="w-4 h-4 text-[#97144D] dark:text-[#FFDF85]" />
              <span className="text-[12px] font-medium text-[#1F1420] dark:text-[#F3ECF0] mt-1 truncate">
                Nominees
              </span>
            </button>

            {/* 5. More */}
            <button
              type="button"
              onClick={() => setIsMoreSheetOpen(true)}
              className="h-[56px] flex flex-col items-center justify-center bg-white dark:bg-[#231221] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)] rounded-2xl active-press cursor-pointer hover:border-[#97144D]/30 shadow-xs transition-colors p-1"
            >
              <Grid className="w-4 h-4 text-[#97144D] dark:text-[#FFDF85]" />
              <span className="text-[12px] font-medium text-[#1F1420] dark:text-[#F3ECF0] mt-1 truncate">
                More
              </span>
            </button>
          </div>

          {/* BLOCK 3: NEXT VISIT CARD (COMPACT ~96px, ONLY FUTURE VISITS) */}
          <div className="bg-white dark:bg-[#231221] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)] rounded-[20px] p-3.5 shadow-xs">
            {upcomingAppointment ? (
              <div className="space-y-1.5">
                {/* Row 1: Date & Time (14/600) */}
                <div className="flex items-center justify-between text-[14px] font-semibold text-[#1F1420] dark:text-[#F3ECF0]">
                  <span className="truncate">Tomorrow, Sat 31 Oct · 9:30-10:00 AM</span>
                  <span className="text-[11px] font-mono text-[#6B5B68] dark:text-[#A898A4] shrink-0">
                    Slot #2
                  </span>
                </div>

                {/* Row 2: Token chip on its own line with copy button */}
                <div className="flex items-center gap-1.5">
                  <div className="bg-[#97144D]/10 dark:bg-[#97144D]/25 text-[#97144D] dark:text-[#FFDF85] border border-[#97144D]/20 px-2 py-0.5 rounded-lg font-mono text-[12px] font-semibold inline-flex items-center gap-1.5">
                    <span>{upcomingAppointment.queueToken || 'SV-CON-261031-014'}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(upcomingAppointment.queueToken || 'SV-CON-261031-014')}
                      className="p-0.5 hover:bg-[#97144D]/20 rounded cursor-pointer"
                      title="Copy token"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  {copiedToken && (
                    <span className="text-[10px] text-emerald-600 font-bold animate-in fade-in">
                      Copied!
                    </span>
                  )}
                </div>

                {/* Row 3: Live countdown chip | buttons [QR Pass] and [Reschedule] */}
                <div className="flex items-center justify-between pt-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                    <Clock className="w-3 h-3" />
                    In 18h 42m
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCustomerView('pass')}
                      className="bg-[#97144D] hover:bg-[#851144] text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs active-press cursor-pointer transition-colors"
                    >
                      QR Pass
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomerView('visit')}
                      className="bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-[#1F1420] dark:text-white text-xs font-medium px-2.5 py-1.5 rounded-xl active-press cursor-pointer transition-colors"
                    >
                      Reschedule
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between py-1">
                <span className="text-[14px] font-medium text-[#6B5B68] dark:text-[#A898A4]">
                  No visit scheduled
                </span>
                <button
                  type="button"
                  onClick={() => setCustomerView('visit')}
                  className="bg-[#97144D] hover:bg-[#851144] text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl shadow-xs active-press cursor-pointer transition-colors"
                >
                  Book a visit
                </button>
              </div>
            )}
          </div>

          {/* BLOCK 4: NEEDS ATTENTION (HORIZONTAL SNAP CARDS, MAX 3, ~280x88 EACH) */}
          {actionItems.length > 0 && (
            <div className="space-y-2">
              <SectionHeader title="Needs Attention" />
              <div className="flex gap-2.5 overflow-x-auto snap-x no-scrollbar pb-0.5">
                {actionItems.map(item => (
                  <div
                    key={item.id}
                    className="snap-start w-[280px] h-[88px] shrink-0 bg-white dark:bg-[#231221] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)] rounded-[20px] p-3 shadow-xs flex items-center justify-between gap-2.5"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-[#97144D] shrink-0" />
                        <span className="text-[14px] font-semibold text-[#1F1420] dark:text-[#F3ECF0] truncate">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#6B5B68] dark:text-[#A898A4] truncate max-w-[170px]">
                        {item.detail}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={item.action}
                      className="bg-[#97144D]/10 hover:bg-[#97144D] text-[#97144D] hover:text-white dark:bg-[#97144D]/25 dark:text-[#FFDF85] dark:hover:text-white text-xs font-semibold px-2.5 py-1.5 rounded-xl transition-all shrink-0 active-press cursor-pointer"
                    >
                      {item.ctaText}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BLOCK 5: RENT ACCOUNT ROW (SLIM ~72px, NEVER SHOWS BALANCE ON CARD) */}
          <div className="bg-white dark:bg-[#231221] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)] rounded-[20px] p-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[14px] font-semibold text-[#1F1420] dark:text-[#F3ECF0]">
                  Savings Account - xxxx 1720
                </div>
                <div className="text-[12px] text-[#1E8E5A] dark:text-[#4ADE80] font-medium flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1E8E5A] dark:bg-[#4ADE80]" />
                  Auto-debit active
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsBalanceSheetOpen(true)}
                className="bg-[#97144D] hover:bg-[#851144] text-[#FFDF85] text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs active-press cursor-pointer transition-colors"
              >
                Check balance
              </button>
            </div>

            <div className="text-[12px] text-[#1E8E5A] dark:text-[#4ADE80] font-medium flex items-center gap-1 mt-2.5 pt-2 border-t border-[#E8DFE5]/60 dark:border-white/5 truncate no-wrap-amount tabular-nums">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Enough for next rent ₹5,310 (₹4,500 + 18% GST) due 15 Jan 2027</span>
            </div>
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: INSIGHTS (ALL FULL WIDTH, STACKED, NO SIDE-BY-SIDE)   */}
      {/* ============================================================ */}
      {activeTab === 'insights' && (
        <div className="space-y-3.5">
          
          {/* 1. HEALTH CARD (56px radial ring score + accordion checklist) */}
          <div className="bg-white dark:bg-[#231221] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)] rounded-[20px] p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-3.5">
              {/* 56px radial ring */}
              <div className="w-14 h-14 relative flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-black/10 dark:text-white/10"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#97144D] dark:text-[#FFDF85]"
                    strokeDasharray={`${healthChecklist.score}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center leading-none">
                  <span className="font-['Manrope'] font-bold text-[14px] text-[#1F1420] dark:text-[#F3ECF0]">
                    {healthChecklist.score}
                  </span>
                  <span className="text-[9px] text-[#6B5B68] dark:text-[#A898A4] block">/100</span>
                </div>
              </div>

              <div className="min-w-0">
                <div className="text-[16px] font-bold text-[#1F1420] dark:text-[#F3ECF0]">
                  Locker Health Score
                </div>
                <p className="text-[12px] text-[#1E8E5A] dark:text-[#4ADE80] font-medium mt-0.5">
                  Tier-1 Optimal · Full Statutory Compliance
                </p>
                <p className="text-[11px] text-[#6B5B68] dark:text-[#A898A4] mt-0.5">
                  RBI safe deposit protocol checklist
                </p>
              </div>
            </div>

            {/* Accordion toggle: "View 5 checks" */}
            <div className="pt-2 border-t border-[#E8DFE5]/60 dark:border-white/5">
              <button
                type="button"
                onClick={() => setIsHealthAccordionOpen(!isHealthAccordionOpen)}
                className="w-full flex items-center justify-between text-xs font-semibold text-[#97144D] dark:text-[#FFDF85] py-1 cursor-pointer"
              >
                <span>{isHealthAccordionOpen ? 'Hide compliance checks' : 'View 5 checks'}</span>
                {isHealthAccordionOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {isHealthAccordionOpen && (
                <div className="space-y-2 pt-2 text-xs">
                  {healthChecklist.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-1 border-b border-[#E8DFE5]/40 dark:border-white/5 last:border-none">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="text-[#1F1420] dark:text-[#F3ECF0]">{item.label}</span>
                      </div>
                      <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                        +{item.weight} pts
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 2. YEARLY COST: RECHARTS DONUT WITH CENTER TOTAL & LEGEND BELOW */}
          <div className="bg-white dark:bg-[#231221] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)] rounded-[20px] p-4 shadow-xs space-y-3">
            <SectionHeader title="Yearly Cost Breakdown" />

            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={yearlyCostData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {yearlyCostData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(val: any) => [`₹${Number(val || 0).toLocaleString('en-IN')}`, 'Amount']}
                    contentStyle={{ borderRadius: 12, fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Total in Donut */}
              <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="font-['Manrope'] font-bold text-[18px] text-[#1F1420] dark:text-[#F3ECF0] tabular-nums no-wrap-amount">
                  ₹5,310
                </span>
                <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4]">Total/year</span>
              </div>
            </div>

            {/* Legend BELOW (Not beside) */}
            <div className="space-y-1.5 pt-2 border-t border-[#E8DFE5]/60 dark:border-white/5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#97144D]" />
                  <span className="text-[#6B5B68] dark:text-[#A898A4]">Base Annual Rent</span>
                </div>
                <span className="font-semibold text-[#1F1420] dark:text-[#F3ECF0] tabular-nums no-wrap-amount">
                  ₹4,500
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C9A24B]" />
                  <span className="text-[#6B5B68] dark:text-[#A898A4]">GST (18%)</span>
                </div>
                <span className="font-semibold text-[#1F1420] dark:text-[#F3ECF0] tabular-nums no-wrap-amount">
                  ₹810
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#008C88]" />
                  <span className="text-[#6B5B68] dark:text-[#A898A4]">Maintenance & Security</span>
                </div>
                <span className="font-semibold text-[#1F1420] dark:text-[#F3ECF0] tabular-nums no-wrap-amount">
                  ₹0
                </span>
              </div>
            </div>
          </div>

          {/* 3. VISITS PER MONTH: FULL WIDTH BAR CHART WITH 12px AXIS LABELS */}
          <div className="bg-white dark:bg-[#231221] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)] rounded-[20px] p-4 shadow-xs space-y-3">
            <SectionHeader title="Visits Frequency" />

            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={visitsBarData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B5B68', fontSize: 12, fontFamily: 'Manrope' }}
                  />
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B5B68', fontSize: 11 }}
                  />
                  <RechartsTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white dark:bg-[#2B1626] border border-[#E8DFE5] dark:border-white/10 p-2 rounded-xl text-xs shadow-md">
                            <p className="font-bold">{data.month}</p>
                            <p className="text-[#97144D] dark:text-[#FFDF85] font-semibold">
                              {data.visits} Strongroom Visit{data.visits > 1 ? 's' : ''}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="visits" radius={[6, 6, 0, 0]}>
                    {visitsBarData.map((entry, index) => (
                      <Cell
                        key={`bar-${index}`}
                        fill={entry.isCurrent ? '#C9A24B' : '#97144D'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#6B5B68] dark:text-[#A898A4] pt-1 border-t border-[#E8DFE5]/60 dark:border-white/5">
              <span>Current month (Oct) highlighted in gold</span>
              <span className="font-bold text-[#C9A24B]">3 visits logged</span>
            </div>
          </div>

          {/* 4. BRANCH BUSY HOURS: HORIZONTALLY SCROLLABLE HEAT STRIP */}
          <div className="bg-white dark:bg-[#231221] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)] rounded-[20px] p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <SectionHeader title="Branch Busy Hours" />
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-[11px] font-semibold">
                Best time: 10:30 AM
              </span>
            </div>

            {/* Horizontal Heat Strip */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {busyHoursData.map(slot => (
                <div
                  key={slot.hour}
                  className={`min-w-[64px] h-[58px] rounded-xl flex flex-col items-center justify-center p-1.5 shrink-0 ${slot.color}`}
                >
                  <span className="text-[12px] font-bold font-['Manrope']">{slot.hour}</span>
                  <span className="text-[10px] opacity-80">{slot.level}</span>
                </div>
              ))}
            </div>

            {/* Operating hours & holiday notice */}
            <div className="space-y-1 pt-2 border-t border-[#E8DFE5]/60 dark:border-white/5 text-[11px] text-[#6B5B68] dark:text-[#A898A4]">
              <p>Mon – Fri: 10:00 AM – 5:30 PM · 1st & 3rd Sat: 10:00 AM – 2:00 PM</p>
              <p className="opacity-75">
                Closed on 2nd & 4th Saturdays, Sundays & Negotiable Instruments Act Holidays
              </p>
            </div>
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: ACTIVITY (DATE-GROUPED TIMELINE)                     */}
      {/* ============================================================ */}
      {activeTab === 'activity' && (
        <div className="space-y-3.5">
          
          {/* Filter Chips: All | Access | Payments | Requests */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {(['All', 'Access', 'Payments', 'Requests'] as const).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => {
                  setActivityFilter(f);
                  setActivityPageSize(5);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activityFilter === f
                    ? 'bg-[#97144D] text-white shadow-xs font-bold'
                    : 'bg-white dark:bg-[#231221] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)] text-[#6B5B68] dark:text-[#A898A4]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Date-grouped timeline items */}
          <div className="space-y-3">
            {(['Today', 'Yesterday', 'Earlier'] as const).map(groupName => {
              const items = groupedActivity.groups[groupName];
              if (!items || items.length === 0) return null;

              return (
                <div key={groupName} className="space-y-2">
                  <div className="text-[12px] font-bold text-[#6B5B68] dark:text-[#A898A4] px-1 uppercase tracking-wider">
                    {groupName}
                  </div>

                  <div className="space-y-2">
                    {items.map(item => (
                      <div
                        key={item.id}
                        className="p-3 bg-white dark:bg-[#231221] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)] rounded-[18px] flex items-center justify-between gap-3 text-xs shadow-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-black/5 dark:bg-white/10 flex items-center justify-center shrink-0 text-[#97144D] dark:text-[#FFDF85]">
                            {item.type === 'access' ? (
                              <Key className="w-4 h-4" />
                            ) : item.type === 'payment' ? (
                              <CreditCard className="w-4 h-4" />
                            ) : (
                              <FileText className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-[14px] text-[#1F1420] dark:text-[#F3ECF0] block truncate">
                              {item.title}
                            </span>
                            <span className="text-[12px] text-[#6B5B68] dark:text-[#A898A4] block truncate">
                              {item.subtitle}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[11px] font-mono text-[#6B5B68] dark:text-[#A898A4] block tabular-nums">
                            {item.formattedDate}
                          </span>
                          {item.status && (
                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                              {item.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* "Load more" button */}
          {groupedActivity.hasMore && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setActivityPageSize(prev => prev + 5)}
                className="w-full py-2.5 bg-white dark:bg-[#231221] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)] rounded-xl text-xs font-semibold text-[#97144D] dark:text-[#FFDF85] active-press cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Load more activity
              </button>
            </div>
          )}

        </div>
      )}

      {/* ============================================================ */}
      {/* FLOATING "ASK SAFEVAULT" BUTTON (48px ROUND ICON-ONLY)       */}
      {/* ============================================================ */}
      <div
        className={`fixed bottom-20 right-4 sm:right-auto sm:left-[calc(50%+150px)] z-30 transition-all duration-300 ${
          showChatButton ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
      >
        <button
          type="button"
          onClick={() => setIsChatOpen(true)}
          className="w-12 h-12 rounded-full bg-[#97144D] hover:bg-[#851144] text-[#FFDF85] shadow-xl flex items-center justify-center active:scale-95 transition-transform cursor-pointer border border-[#FFDF85]/40"
          title="Ask SafeVault Assistant"
          aria-label="Ask SafeVault Assistant"
        >
          <Bot className="w-6 h-6 text-[#FFDF85]" />
        </button>
      </div>

      {/* ============================================================ */}
      {/* BOTTOM SHEET 1: COMPLIANCE CHECKLIST (FROM 44px HEALTH RING) */}
      {/* ============================================================ */}
      {isHealthSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#1E0C16] text-[#1F1420] dark:text-[#F5ECF1] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
            <div className="flex items-center justify-between border-b border-[#E8DFE5]/60 dark:border-white/10 pb-3">
              <div>
                <h3 className="text-[17px] font-bold text-[#1F1420] dark:text-[#F3ECF0]">
                  Locker Compliance Checklist
                </h3>
                <span className="text-[12px] text-[#1E8E5A] dark:text-[#4ADE80] font-medium">
                  Score: 100/100 · Tier-1 Maximum Security
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsHealthSheetOpen(false)}
                className="p-1.5 rounded-full text-[#6B5B68] hover:text-[#1F1420] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {healthChecklist.items.map(item => (
                <div
                  key={item.id}
                  className="p-3 bg-[#FAF6F8] dark:bg-[#2A1220] rounded-xl border border-[#E8DFE5]/60 dark:border-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-[#1F1420] dark:text-[#F3ECF0] block">
                        {item.label}
                      </span>
                      <span className="text-[11px] text-[#6B5B68] dark:text-[#A898A4]">
                        Status: Verified active in CBS
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    +{item.weight} pts
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-xl border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-200">
              Your locker is fully compliant with all RBI statutory operating mandates, insurance criteria, and KYC norms.
            </div>

            <button
              type="button"
              onClick={() => setIsHealthSheetOpen(false)}
              className="w-full h-11 bg-[#97144D] text-white font-bold rounded-xl text-xs active-press cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* BOTTOM SHEET 2: KEBAB ... MENU (QUICK INFO & ACTIONS)        */}
      {/* ============================================================ */}
      {isKebabMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#1E0C16] text-[#1F1420] dark:text-[#F5ECF1] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
            <div className="flex items-center justify-between border-b border-[#E8DFE5]/60 dark:border-white/10 pb-3">
              <div>
                <h3 className="text-[17px] font-bold text-[#1F1420] dark:text-[#F3ECF0]">
                  Locker Options · Safe #{activeLocker.lockerNumber}
                </h3>
                <span className="text-[12px] text-[#6B5B68] dark:text-[#A898A4]">
                  Key #K-9821 · Godrej Pentabolt Strongroom
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsKebabMenuOpen(false)}
                className="p-1.5 rounded-full text-[#6B5B68] hover:text-[#1F1420] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {/* Emergency Vault Freeze Toggle */}
              <button
                type="button"
                onClick={handleToggleFreeze}
                className="w-full p-3 bg-[#FAF6F8] dark:bg-[#2A1220] rounded-xl border border-[#E8DFE5]/60 dark:border-white/5 flex items-center justify-between text-left active-press cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#97144D]/10 dark:bg-[#97144D]/25 flex items-center justify-center text-[#97144D] dark:text-[#FFDF85]">
                    {activeLocker.status === 'Blocked' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="font-semibold text-xs text-[#1F1420] dark:text-[#F3ECF0] block">
                      {activeLocker.status === 'Blocked' ? 'Lift Security Restriction' : 'Emergency Security Freeze'}
                    </span>
                    <span className="text-[11px] text-[#6B5B68] dark:text-[#A898A4]">
                      {activeLocker.status === 'Blocked' ? 'Re-enable strongroom biometric access' : 'Instantly halt turnstile entry'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#6B5B68]" />
              </button>

              {/* View Full Specifications */}
              <button
                type="button"
                onClick={() => {
                  setIsKebabMenuOpen(false);
                  setDetailLocker(activeLocker);
                }}
                className="w-full p-3 bg-[#FAF6F8] dark:bg-[#2A1220] rounded-xl border border-[#E8DFE5]/60 dark:border-white/5 flex items-center justify-between text-left active-press cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/10 flex items-center justify-center text-[#1F1420] dark:text-white">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-xs text-[#1F1420] dark:text-[#F3ECF0] block">
                      Locker Specifications
                    </span>
                    <span className="text-[11px] text-[#6B5B68] dark:text-[#A898A4]">
                      Dimensions, deposit lien, branch sector
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#6B5B68]" />
              </button>

              {/* Surrender Locker */}
              <button
                type="button"
                onClick={() => {
                  setIsKebabMenuOpen(false);
                  setCustomerView('closure');
                }}
                className="w-full p-3 bg-[#FAF6F8] dark:bg-[#2A1220] rounded-xl border border-[#E8DFE5]/60 dark:border-white/5 flex items-center justify-between text-left active-press cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-600">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-xs text-[#1F1420] dark:text-[#F3ECF0] block">
                      Surrender Locker
                    </span>
                    <span className="text-[11px] text-[#6B5B68] dark:text-[#A898A4]">
                      Initiate surrender settlement & FD refund
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#6B5B68]" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsKebabMenuOpen(false)}
              className="w-full h-10 bg-black/5 dark:bg-white/10 text-[#1F1420] dark:text-white font-semibold rounded-xl text-xs active-press cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* BOTTOM SHEET 3: "MORE" ACTIONS SHEET                         */}
      {/* ============================================================ */}
      {isMoreSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#1E0C16] text-[#1F1420] dark:text-[#F5ECF1] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
            <div className="flex items-center justify-between border-b border-[#E8DFE5]/60 dark:border-white/10 pb-3">
              <div>
                <h3 className="text-[17px] font-bold text-[#1F1420] dark:text-[#F3ECF0]">
                  More Services
                </h3>
                <span className="text-[12px] text-[#6B5B68] dark:text-[#A898A4]">
                  SafeVault operations & documentation
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMoreSheetOpen(false)}
                className="p-1.5 rounded-full text-[#6B5B68] hover:text-[#1F1420] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setIsMoreSheetOpen(false);
                  setCustomerView('vault');
                }}
                className="p-3 bg-[#FAF6F8] dark:bg-[#2A1220] rounded-xl border border-[#E8DFE5]/60 dark:border-white/5 text-left active-press cursor-pointer space-y-1"
              >
                <FileText className="w-5 h-5 text-[#97144D] dark:text-[#FFDF85]" />
                <span className="font-semibold block text-[#1F1420] dark:text-[#F3ECF0]">Documents</span>
                <span className="text-[11px] text-[#6B5B68] dark:text-[#A898A4] block">Allotment letter, receipts</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMoreSheetOpen(false);
                  setCustomerView('agreements');
                }}
                className="p-3 bg-[#FAF6F8] dark:bg-[#2A1220] rounded-xl border border-[#E8DFE5]/60 dark:border-white/5 text-left active-press cursor-pointer space-y-1"
              >
                <ShieldCheck className="w-5 h-5 text-[#97144D] dark:text-[#FFDF85]" />
                <span className="font-semibold block text-[#1F1420] dark:text-[#F3ECF0]">Agreements & KYC</span>
                <span className="text-[11px] text-[#6B5B68] dark:text-[#A898A4] block">Model agreement, SHCIL</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMoreSheetOpen(false);
                  setCustomerView('requests');
                }}
                className="p-3 bg-[#FAF6F8] dark:bg-[#2A1220] rounded-xl border border-[#E8DFE5]/60 dark:border-white/5 text-left active-press cursor-pointer space-y-1"
              >
                <Key className="w-5 h-5 text-[#97144D] dark:text-[#FFDF85]" />
                <span className="font-semibold block text-[#1F1420] dark:text-[#F3ECF0]">Service Requests</span>
                <span className="text-[11px] text-[#6B5B68] dark:text-[#A898A4] block">Lock break-open, repair</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMoreSheetOpen(false);
                  setCustomerView('waitlist');
                }}
                className="p-3 bg-[#FAF6F8] dark:bg-[#2A1220] rounded-xl border border-[#E8DFE5]/60 dark:border-white/5 text-left active-press cursor-pointer space-y-1"
              >
                <Clock className="w-5 h-5 text-[#97144D] dark:text-[#FFDF85]" />
                <span className="font-semibold block text-[#1F1420] dark:text-[#F3ECF0]">Waitlist</span>
                <span className="text-[11px] text-[#6B5B68] dark:text-[#A898A4] block">Track queue position</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMoreSheetOpen(false);
                  setCustomerView('support');
                }}
                className="p-3 bg-[#FAF6F8] dark:bg-[#2A1220] rounded-xl border border-[#E8DFE5]/60 dark:border-white/5 text-left active-press cursor-pointer space-y-1"
              >
                <HeartHandshake className="w-5 h-5 text-[#97144D] dark:text-[#FFDF85]" />
                <span className="font-semibold block text-[#1F1420] dark:text-[#F3ECF0]">Support</span>
                <span className="text-[11px] text-[#6B5B68] dark:text-[#A898A4] block">Helpdesk & grievance</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMoreSheetOpen(false);
                  if (onOpenAllServices) onOpenAllServices();
                }}
                className="p-3 bg-[#FAF6F8] dark:bg-[#2A1220] rounded-xl border border-[#E8DFE5]/60 dark:border-white/5 text-left active-press cursor-pointer space-y-1"
              >
                <Grid className="w-5 h-5 text-[#97144D] dark:text-[#FFDF85]" />
                <span className="font-semibold block text-[#1F1420] dark:text-[#F3ECF0]">All Services</span>
                <span className="text-[11px] text-[#6B5B68] dark:text-[#A898A4] block">Full directory</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* BOTTOM SHEET 4: AVAILABLE BALANCE STEP-UP SHEET              */}
      {/* ============================================================ */}
      {isBalanceSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#1E0C16] text-[#1F1420] dark:text-[#F5ECF1] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
            <div className="flex items-center justify-between border-b border-[#E8DFE5]/60 dark:border-white/10 pb-3">
              <div>
                <h3 className="text-[17px] font-bold text-[#1F1420] dark:text-[#F3ECF0]">
                  Available Balance
                </h3>
                <span className="text-[12px] text-[#6B5B68] dark:text-[#A898A4]">
                  Step-up authenticated rent debit account
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsBalanceSheetOpen(false)}
                className="p-1.5 rounded-full text-[#6B5B68] hover:text-[#1F1420] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <AvailableBalanceCard
              onNavigateToPayments={() => {
                setIsBalanceSheetOpen(false);
                setCustomerView('rent');
              }}
              onNavigateToAutoDebit={() => {
                setIsBalanceSheetOpen(false);
                setCustomerView('rent');
              }}
            />
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* BOTTOM SHEET 5: FULL LOCKER DETAILS SHEET                    */}
      {/* ============================================================ */}
      {detailLocker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#1E0C16] text-[#1F1420] dark:text-[#F5ECF1] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
            <div className="flex items-center justify-between border-b border-[#E8DFE5]/60 dark:border-white/10 pb-3">
              <div>
                <span className="text-[11px] font-bold text-[#97144D] dark:text-[#FFDF85] uppercase tracking-wider block">
                  VAULT SPECIFICATION
                </span>
                <h3 className="text-[18px] font-bold text-[#1F1420] dark:text-white">
                  Safe #{detailLocker.lockerNumber} ({detailLocker.size})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailLocker(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-[#FAF6F8] dark:bg-[#2A1220] rounded-xl border border-[#E8DFE5]/60 dark:border-white/5">
                <span className="text-[#6B5B68] dark:text-[#A898A4] block">Dimensions</span>
                <span className="font-mono font-bold text-[#1F1420] dark:text-white">{detailLocker.dimensions || '125 x 175 x 492 mm'}</span>
              </div>
              <div className="p-2.5 bg-[#FAF6F8] dark:bg-[#2A1220] rounded-xl border border-[#E8DFE5]/60 dark:border-white/5">
                <span className="text-[#6B5B68] dark:text-[#A898A4] block">Allotment Date</span>
                <span className="font-mono font-bold text-[#1F1420] dark:text-white">{detailLocker.allotmentDate || '15 Jan 2024'}</span>
              </div>
              <div className="p-2.5 bg-[#FAF6F8] dark:bg-[#2A1220] rounded-xl border border-[#E8DFE5]/60 dark:border-white/5">
                <span className="text-[#6B5B68] dark:text-[#A898A4] block">Key Identifier</span>
                <span className="font-mono font-bold text-[#97144D] dark:text-[#FFDF85]">{detailLocker.keyNumber || 'K-9821'}</span>
              </div>
              <div className="p-2.5 bg-[#FAF6F8] dark:bg-[#2A1220] rounded-xl border border-[#E8DFE5]/60 dark:border-white/5">
                <span className="text-[#6B5B68] dark:text-[#A898A4] block">Security Deposit (FD)</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{formatIndianCurrency(detailLocker.securityDeposit)}</span>
              </div>
            </div>

            <div className="p-3 bg-[#FAF6F8] dark:bg-[#2A1220] rounded-2xl border border-[#E8DFE5]/60 dark:border-white/5 space-y-1 text-xs">
              <span className="text-[#6B5B68] dark:text-[#A898A4] font-bold block uppercase text-[10px]">Branch Strongroom Location</span>
              <p className="font-semibold text-[#1F1420] dark:text-white">{detailLocker.branchName}</p>
              <p className="text-[#6B5B68] dark:text-[#A898A4] text-[11px]">Vault Chamber Alpha · Strongroom Turnstile Sector 4</p>
            </div>

            <button
              type="button"
              onClick={() => setDetailLocker(null)}
              className="w-full h-11 bg-[#97144D] text-white font-bold rounded-xl text-xs active-press cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* BOTTOM SHEET 6: ASK SAFEVAULT CHAT SHEET                     */}
      {/* ============================================================ */}
      {isChatOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#1E0C16] text-[#1F1420] dark:text-[#F5ECF1] w-full max-w-md h-[80vh] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] flex flex-col overflow-hidden">
            
            {/* Sheet Header */}
            <div className="p-4 border-b border-[#E8DFE5]/60 dark:border-white/10 flex items-center justify-between shrink-0 bg-[#FAF6F8] dark:bg-[#2A1220]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#97144D] text-[#FFDF85] flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#1F1420] dark:text-[#F5ECF1]">
                    Ask SafeVault
                  </h3>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online Vault Support Assistant
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 rounded-full text-[#6B5B68] hover:text-[#1F1420] dark:hover:text-[#F5ECF1]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Queries */}
            <div className="p-2 border-b border-[#E8DFE5]/60 dark:border-white/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {[
                'Branch timings?',
                'How to add nominee?',
                'Lost locker key?',
                'Annual rent breakdown',
                'Statutory liability'
              ].map(pill => (
                <button
                  key={pill}
                  type="button"
                  onClick={() => handleSendChat(pill)}
                  className="px-2.5 py-1 rounded-full bg-[#FAF6F8] dark:bg-[#2A1220] border border-[#E8DFE5]/60 dark:border-white/10 text-[10px] font-semibold text-[#1F1420] dark:text-[#F5ECF1] hover:border-[#97144D] shrink-0 active-press cursor-pointer"
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#97144D] text-white rounded-br-xs'
                        : 'bg-[#FAF6F8] dark:bg-[#2A1220] border border-[#E8DFE5]/60 dark:border-white/10 text-[#1F1420] dark:text-[#F5ECF1] rounded-bl-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="text-[9px] opacity-60 block text-right mt-1 font-mono">
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-[#E8DFE5]/60 dark:border-white/10 flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                placeholder="Ask about lockers, visits, or policies..."
                className="flex-1 h-10 rounded-xl bg-[#FAF6F8] dark:bg-[#2A1220] border border-[#E8DFE5]/60 dark:border-white/10 px-3 text-xs text-[#1F1420] dark:text-[#F5ECF1] focus:outline-none focus:ring-2 focus:ring-[#97144D]"
              />
              <button
                type="button"
                onClick={() => handleSendChat()}
                className="w-10 h-10 rounded-xl bg-[#97144D] text-white flex items-center justify-center hover:bg-[#6B0E37] transition-colors shrink-0 active-press cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#FFDF85]" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* OTP MODAL FOR FREEZE / UNFREEZE */}
      <OtpModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onSuccess={handleOtpSuccess}
        title={otpAction === 'freeze' ? 'Emergency Vault Freeze' : 'Lift Access Restriction'}
        actionDescription={`Authorizing ${otpAction === 'freeze' ? 'immediate security freeze' : 'unfreezing'} on Safe #${activeLocker?.lockerNumber}`}
      />

    </div>
  );
};
