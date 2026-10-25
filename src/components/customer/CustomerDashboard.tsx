import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { StatusBadge } from '../common/StatusBadge';
import { OtpModal } from '../common/OtpModal';
import { QrTokenModal } from '../common/QrTokenModal';
import {
  Key,
  Calendar,
  AlertCircle,
  CreditCard,
  FileText,
  Clock,
  Shield,
  Lock,
  Unlock,
  ChevronRight,
  ArrowUpRight,
  AlertTriangle,
  Building,
  CheckCircle2,
  Users,
  TrendingUp,
  FileCheck2,
  QrCode,
  Download,
  Info
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const {
    lockers,
    appointments,
    payments,
    serviceRequests,
    setCustomerView,
    selectedLockerId,
    setSelectedLockerId,
    restrictLockerAccess,
    unrestrictLockerAccess
  } = useBanking();

  // Active customer lockers
  const customerLockers = lockers.filter(l => l.customerId === 'cust-rahul-01');
  const activeLocker = customerLockers.find(l => l.id === selectedLockerId) || customerLockers[0] || lockers[0];
  const outstandingTotal = customerLockers.reduce((acc, curr) => acc + (curr.outstandingRent || 0), 0);
  const nextAppointment = appointments.find(a => a.status === 'Confirmed' || a.status === 'Checked In');

  // Freeze / Unfreeze state
  const [targetLockLockerId, setTargetLockLockerId] = useState<string | null>(null);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpAction, setOtpAction] = useState<'freeze' | 'unfreeze'>('freeze');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Chart hover state
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  const handleToggleFreeze = (lockerId: string, currentStatus: string) => {
    setTargetLockLockerId(lockerId);
    setOtpAction(currentStatus === 'Blocked' ? 'unfreeze' : 'freeze');
    setIsOtpOpen(true);
  };

  const handleOtpSuccess = () => {
    if (!targetLockLockerId) return;
    if (otpAction === 'freeze') {
      restrictLockerAccess(targetLockLockerId, 'Customer initiated security freeze via Self-Service Dashboard');
    } else {
      unrestrictLockerAccess(targetLockLockerId);
    }
    setTargetLockLockerId(null);
  };

  // Real 6-month historical visit frequency data
  const visitHistoryData = [
    { month: 'May', visits: 1, duration: '14 mins', date: '12 May 2026', operator: 'Rahul Sharma (Primary)' },
    { month: 'Jun', visits: 2, duration: '22 mins', date: '24 Jun 2026', operator: 'Pooja Sharma (Joint)' },
    { month: 'Jul', visits: 0, duration: '0 mins', date: 'No operations', operator: 'None' },
    { month: 'Aug', visits: 3, duration: '35 mins', date: '18 Aug 2026', operator: 'Rahul Sharma (Primary)' },
    { month: 'Sep', visits: 1, duration: '18 mins', date: '08 Sep 2026', operator: 'Rahul Sharma (Primary)' },
    { month: 'Oct', visits: 2, duration: '26 mins', date: '14 Oct 2026', operator: 'Rahul Sharma (Primary)' },
  ];
  const maxVisits = Math.max(...visitHistoryData.map(d => d.visits), 4);

  const isOverdue = (activeLocker?.outstandingRent || 0) > 0;
  const renewalPercent = isOverdue ? 100 : 74;

  return (
    <div className="space-y-6 text-xs text-slate-800">
      
      {/* Executive Welcome & Portfolio Summary Card */}
      <div className="bg-white border border-[#E3E8F0] rounded-2xl p-6 shadow-bank-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E3E8F0]">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#66758C] font-medium">
              <span>Customer Identification: <strong className="font-mono text-[#102544] font-semibold">CIF-9028192831</strong></span>
              <span aria-hidden="true">·</span>
              <span>Account Status: <strong className="text-[#16845B] font-semibold">Premier Standing</strong></span>
              <span aria-hidden="true">·</span>
              <span>Branch: <strong className="text-[#17263C]">Connaught Place Main Branch</strong></span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-[#102544] mt-2">
              Safe Deposit Locker Portfolio
            </h1>

            <p className="text-[#66758C] text-xs mt-1 max-w-2xl leading-relaxed">
              Manage your safe deposit lockers, schedule verified branch visits, review executed legal agreements, and manage nominee records under RBI Safe Custody Guidelines.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCustomerView('visit')}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-[#102544] hover:bg-[#0B1730] rounded-xl transition-all shadow-xs flex items-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5 text-[#008C88]" />
              <span>Schedule Vault Visit</span>
            </button>
            <button
              onClick={() => setCustomerView('find')}
              className="px-4 py-2.5 text-xs font-semibold text-[#102544] bg-[#F5F7FA] hover:bg-[#E3E8F0] border border-[#E3E8F0] rounded-xl transition-all flex items-center gap-2"
            >
              <Key className="w-3.5 h-3.5 text-[#2457A7]" />
              <span>Apply for New Locker</span>
            </button>
          </div>
        </div>

        {/* Portfolio Metric Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-5">
          <div>
            <span className="text-[#66758C] text-xs block font-medium">Allotted Lockers</span>
            <div className="text-2xl font-bold font-mono text-[#102544] mt-0.5 tabular-nums">
              {customerLockers.length} Compartments
            </div>
            <span className="text-[11px] text-[#66758C] mt-0.5 block">
              1 Primary Sole · 1 Joint Survivor
            </span>
          </div>

          <div>
            <span className="text-[#66758C] text-xs block font-medium">Outstanding Rental Dues</span>
            <div className={`text-2xl font-bold font-mono mt-0.5 tabular-nums ${outstandingTotal > 0 ? 'text-[#C83E44]' : 'text-[#102544]'}`}>
              ₹{outstandingTotal.toLocaleString('en-IN')}.00
            </div>
            <span className="text-[11px] text-[#66758C] mt-0.5 block">
              {outstandingTotal > 0 ? 'Due for Locker B-042' : 'All rental accounts cleared'}
            </span>
          </div>

          <div>
            <span className="text-[#66758C] text-xs block font-medium">Upcoming Vault Visit</span>
            <div className="text-sm font-bold text-[#102544] mt-1.5 truncate">
              {nextAppointment ? `${nextAppointment.date} (${nextAppointment.timeSlot})` : 'No Active Appointment'}
            </div>
            <span className="text-[11px] text-[#66758C] mt-0.5 block truncate">
              {nextAppointment ? `Token: ${nextAppointment.tokenNumber}` : 'Reserve 30-min slot prior to visit'}
            </span>
          </div>

          <div>
            <span className="text-[#66758C] text-xs block font-medium">Statutory Compliance (RBI)</span>
            <div className="text-sm font-bold text-[#16845B] mt-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#16845B]" />
              <span>Fully Compliant</span>
            </div>
            <span className="text-[11px] text-[#66758C] mt-0.5 block">
              Model Agreement & DA-1 Verified
            </span>
          </div>
        </div>
      </div>

      {/* Critical Overdue Banner (if overdue) */}
      {outstandingTotal > 0 && (
        <div className="p-4 bg-[#B7791F]/10 border border-[#B7791F]/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#B7791F] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#102544]">
                Annual Rental Renewal Notice: ₹{outstandingTotal.toLocaleString('en-IN')}.00
              </p>
              <p className="text-[#66758C] text-[11px] mt-0.5">
                Locker B-042 (Indiranagar Branch) renewal is due. Settle payment online to maintain unhindered safe access.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedLockerId('lck-042');
              setCustomerView('rent');
            }}
            className="px-4 py-2 bg-[#B7791F] text-white font-semibold rounded-lg hover:bg-[#B7791F]/90 transition-colors text-xs whitespace-nowrap shrink-0 shadow-xs"
          >
            Settle Dues Online →
          </button>
        </div>
      )}

      {/* Main Locker Inspection & Digital Twin Section */}
      <div className="bg-white border border-[#E3E8F0] rounded-2xl p-6 shadow-bank-card space-y-6">
        
        {/* Locker Tab Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3E8F0]">
          <div>
            <h2 className="text-base font-bold text-[#102544] flex items-center gap-2">
              <Key className="w-4 h-4 text-[#2457A7]" />
              <span>Safe Deposit Compartment Details</span>
            </h2>
            <p className="text-[#66758C] text-xs mt-0.5">
              Select an allocated locker unit to inspect custody terms, dimensions, access history, and renewal runway
            </p>
          </div>

          <div className="flex items-center gap-2">
            {customerLockers.map(lkr => (
              <button
                key={lkr.id}
                onClick={() => setSelectedLockerId(lkr.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
                  activeLocker.id === lkr.id
                    ? 'bg-[#102544] text-white border-[#102544] shadow-xs'
                    : 'bg-[#F5F7FA] text-[#17263C] border-[#E3E8F0] hover:bg-[#E3E8F0]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${lkr.status === 'Blocked' ? 'bg-[#C83E44]' : 'bg-[#16845B]'}`} />
                <span className="font-mono">Locker {lkr.lockerNumber}</span>
                <span className="text-[10px] opacity-75 font-normal">({lkr.size})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Locker Schematic & Operational Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Authentic Safe Deposit Compartment Plate (5 Cols) */}
          <div className="lg:col-span-5 bg-[#102544] text-white rounded-2xl p-6 border border-[#0B1730] shadow-md flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Unit Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center font-mono font-extrabold text-[#008C88] text-base shadow-inner">
                    {activeLocker.lockerNumber}
                  </div>
                  <div>
                    <span className="font-mono font-bold text-white text-sm block">
                      SAFE DEPOSIT UNIT {activeLocker.lockerNumber}
                    </span>
                    <span className="text-[11px] text-white/70 font-medium">
                      {activeLocker.branchName}
                    </span>
                  </div>
                </div>

                <StatusBadge status={activeLocker.status} size="sm" />
              </div>

              {/* Physical Specifications & Dual Tumbler */}
              <div className="p-4 rounded-xl bg-[#0B1730]/60 border border-white/10 space-y-4">
                <div className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">
                  Dual-Key Custody Mechanism
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#B7791F]">
                      <Key className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-white/60 block">Lock Cylinder 1</span>
                      <span className="font-semibold text-xs text-white">Bank Master Key</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#008C88]">
                      <Key className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-white/60 block">Lock Cylinder 2</span>
                      <span className="font-semibold text-xs text-white">Hirer Custody Key</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-white/60 text-[10px] block font-sans">Dimensions</span>
                    <span className="text-white font-bold">{activeLocker.dimensions}</span>
                  </div>
                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-white/60 text-[10px] block font-sans">Internal Volume</span>
                    <span className="text-white font-bold">5,040 in³</span>
                  </div>
                  <div className="p-2.5 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-white/60 text-[10px] block font-sans">Mandate</span>
                    <span className="text-white font-bold">{activeLocker.operatingMode}</span>
                  </div>
                </div>
              </div>

              {/* Legal & Financial Notes */}
              <div className="space-y-2 text-[11px] text-white/70">
                <div className="flex justify-between">
                  <span>Annual Rent:</span>
                  <span className="font-mono text-white font-semibold tabular-nums">₹{activeLocker.annualRent.toLocaleString('en-IN')} + 18% GST</span>
                </div>
                <div className="flex justify-between">
                  <span>Security Deposit (FD Lien):</span>
                  <span className="font-mono text-white font-semibold tabular-nums">₹{activeLocker.securityDeposit.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Vault Access:</span>
                  <span className="font-mono text-white font-semibold">{activeLocker.lastAccessDate || 'Never operated'}</span>
                </div>
              </div>

            </div>

            {/* Bottom Actions for Active Unit */}
            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-white/60 block">Emergency Safety:</span>
                <span className="text-xs font-medium text-white/90">
                  {activeLocker.status === 'Blocked' ? 'Access Locked by Customer' : 'Access Open & Normal'}
                </span>
              </div>

              <button
                onClick={() => handleToggleFreeze(activeLocker.id, activeLocker.status)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs ${
                  activeLocker.status === 'Blocked'
                    ? 'bg-[#C83E44] hover:bg-[#C83E44]/90 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
              >
                {activeLocker.status === 'Blocked' ? (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-white" />
                    <span>Lift Security Freeze</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-white" />
                    <span>Temporary Freeze</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Right Column: Renewal Runway & 6-Month Access History (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Renewal Runway Timeline */}
            <div className="p-5 bg-[#F5F7FA] border border-[#E3E8F0] rounded-2xl space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#102544] text-xs flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#2457A7]" />
                    <span>Annual Rental Horizon & Renewal Schedule</span>
                  </h4>
                  <p className="text-[#66758C] text-[11px] mt-0.5">
                    Cycle: Annual Tenancy · Allotted: {activeLocker.allotmentDate || '01 Nov 2025'}
                  </p>
                </div>
                <span className={`font-mono font-bold text-xs ${isOverdue ? 'text-[#C83E44]' : 'text-[#102544]'}`}>
                  Due Date: {activeLocker.nextRenewalDate}
                </span>
              </div>

              {/* Visual Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full bg-[#E3E8F0] h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isOverdue
                        ? 'bg-[#C83E44]'
                        : 'bg-[#102544]'
                    }`}
                    style={{ width: `${renewalPercent}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-[#66758C] font-mono">
                  <span>Start: {activeLocker.allotmentDate || '01 Nov 2025'}</span>
                  <span>{isOverdue ? 'Overdue Cycle' : 'Current Active Cycle'}</span>
                  <span>Renewal: {activeLocker.nextRenewalDate}</span>
                </div>
              </div>

              {isOverdue ? (
                <div className="p-3 bg-[#C83E44]/10 border border-[#C83E44]/25 rounded-xl text-[#C83E44] flex items-center justify-between text-xs">
                  <span>Renewal overdue. Pay within statutory grace window to prevent account suspension.</span>
                  <button
                    onClick={() => {
                      setSelectedLockerId(activeLocker.id);
                      setCustomerView('rent');
                    }}
                    className="font-bold underline hover:opacity-80 whitespace-nowrap ml-2"
                  >
                    Pay Dues (₹{activeLocker.outstandingRent}) →
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between text-[11px] text-[#66758C] pt-1">
                  <span>Auto-debit registered on Premier Savings Account (5010049281720)</span>
                  <button
                    onClick={() => setCustomerView('rent')}
                    className="text-[#2457A7] font-semibold hover:underline"
                  >
                    Manage Mandate →
                  </button>
                </div>
              )}
            </div>

            {/* 2. Monthly Vault Access History Histogram */}
            <div className="p-5 bg-white border border-[#E3E8F0] rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#102544] text-xs flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#008C88]" />
                    <span>Vault Access Operations History (Past 6 Months)</span>
                  </h4>
                  <p className="text-[#66758C] text-[11px] mt-0.5">
                    Average dwell time: <strong className="font-mono text-[#102544]">19.5 minutes</strong> · Total logged visits: <strong className="font-mono text-[#102544]">9</strong>
                  </p>
                </div>

                {hoveredMonth && (
                  <span className="text-[11px] font-mono font-semibold text-[#102544] bg-[#F5F7FA] px-2.5 py-0.5 rounded border border-[#E3E8F0]">
                    {hoveredMonth}
                  </span>
                )}
              </div>

              {/* Bar Chart Visualization */}
              <div className="h-32 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-[#E3E8F0]">
                {visitHistoryData.map(d => {
                  const heightPercent = d.visits === 0 ? 6 : Math.round((d.visits / maxVisits) * 100);
                  return (
                    <div
                      key={d.month}
                      onMouseEnter={() => setHoveredMonth(`${d.month}: ${d.visits} visit(s) · Last: ${d.date} (${d.duration})`)}
                      onMouseLeave={() => setHoveredMonth(null)}
                      className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer"
                    >
                      <span className="text-[10px] font-mono font-semibold text-[#66758C] group-hover:text-[#102544] transition-colors tabular-nums">
                        {d.visits}
                      </span>

                      <div className="w-full max-w-[32px] bg-[#F5F7FA] group-hover:bg-[#E3E8F0] rounded-t-md overflow-hidden flex items-end transition-all h-20">
                        <div
                          className={`w-full rounded-t-sm transition-all duration-300 ${
                            d.visits > 0
                              ? 'bg-[#102544] group-hover:bg-[#2457A7]'
                              : 'bg-[#CBD5E1]'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>

                      <span className="text-[10px] font-mono font-medium text-[#66758C] group-hover:text-[#102544]">
                        {d.month}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#66758C] pt-1">
                <span>All physical vault entries require biometric & dual-key verification</span>
                <button
                  onClick={() => setCustomerView('access')}
                  className="text-[#2457A7] font-semibold hover:underline flex items-center gap-0.5"
                >
                  <span>Detailed Vault Access Folio</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Upcoming Confirmed Visit Banner (if any) */}
      {nextAppointment && (
        <div className="bg-white border border-[#E3E8F0] rounded-2xl p-5 shadow-bank-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#2457A7]/10 border border-[#2457A7]/20 text-[#2457A7] flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#102544] text-sm">Scheduled Strongroom Visit</span>
                <StatusBadge status={nextAppointment.status} size="sm" />
              </div>
              <p className="text-[#17263C] text-xs mt-0.5">
                Token <strong className="font-mono text-[#102544]">{nextAppointment.tokenNumber}</strong> · Scheduled for <strong className="font-mono text-[#102544]">{nextAppointment.date} at {nextAppointment.timeSlot}</strong>
              </p>
              <p className="text-[11px] text-[#66758C] mt-0.5">
                Locker {nextAppointment.lockerNumber} · Purpose: {nextAppointment.purpose} · Escort: Dual Custodian
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="px-3.5 py-2 bg-[#102544] hover:bg-[#0B1730] text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
            >
              <QrCode className="w-3.5 h-3.5 text-[#008C88]" />
              <span>View Digital Check-In Pass</span>
            </button>
            <button
              onClick={() => setCustomerView('visit')}
              className="px-3.5 py-2 bg-[#F5F7FA] hover:bg-[#E3E8F0] text-[#17263C] font-semibold rounded-xl text-xs border border-[#E3E8F0]"
            >
              Reschedule
            </button>
          </div>
        </div>
      )}

      {/* 6-Pillar Core Self-Service Grid */}
      <div>
        <h3 className="font-bold text-[#102544] text-sm mb-3">Safe Deposit Self-Service Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          
          <button
            onClick={() => setCustomerView('visit')}
            className="p-5 bg-white border border-[#E3E8F0] hover:border-[#2457A7] hover:shadow-bank-card rounded-xl text-left transition-all flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#F5F7FA] text-[#102544] group-hover:bg-[#102544] group-hover:text-white flex items-center justify-center transition-colors">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="mt-4">
              <span className="font-bold text-[#102544] block text-xs">Book Visit</span>
              <span className="text-[11px] text-[#66758C]">Reserve 30-min slot</span>
            </div>
          </button>

          <button
            onClick={() => setCustomerView('rent')}
            className="p-5 bg-white border border-[#E3E8F0] hover:border-[#2457A7] hover:shadow-bank-card rounded-xl text-left transition-all flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#F5F7FA] text-[#102544] group-hover:bg-[#102544] group-hover:text-white flex items-center justify-center transition-colors">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="mt-4">
              <span className="font-bold text-[#102544] block text-xs">Rent & Dues</span>
              <span className="text-[11px] text-[#66758C]">Pay & auto-debit</span>
            </div>
          </button>

          <button
            onClick={() => setCustomerView('holders')}
            className="p-5 bg-white border border-[#E3E8F0] hover:border-[#2457A7] hover:shadow-bank-card rounded-xl text-left transition-all flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#F5F7FA] text-[#102544] group-hover:bg-[#102544] group-hover:text-white flex items-center justify-center transition-colors">
              <Users className="w-4 h-4" />
            </div>
            <div className="mt-4">
              <span className="font-bold text-[#102544] block text-xs">Form DA-1</span>
              <span className="text-[11px] text-[#66758C]">Nominee & PoA</span>
            </div>
          </button>

          <button
            onClick={() => setCustomerView('agreements')}
            className="p-5 bg-white border border-[#E3E8F0] hover:border-[#2457A7] hover:shadow-bank-card rounded-xl text-left transition-all flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#F5F7FA] text-[#102544] group-hover:bg-[#102544] group-hover:text-white flex items-center justify-center transition-colors">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div className="mt-4">
              <span className="font-bold text-[#102544] block text-xs">Agreement</span>
              <span className="text-[11px] text-[#66758C]">e-Stamp & KYC</span>
            </div>
          </button>

          <button
            onClick={() => setCustomerView('vault')}
            className="p-5 bg-white border border-[#E3E8F0] hover:border-[#2457A7] hover:shadow-bank-card rounded-xl text-left transition-all flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#F5F7FA] text-[#102544] group-hover:bg-[#102544] group-hover:text-white flex items-center justify-center transition-colors">
              <FileText className="w-4 h-4" />
            </div>
            <div className="mt-4">
              <span className="font-bold text-[#102544] block text-xs">Deed Vault</span>
              <span className="text-[11px] text-[#66758C]">Official certs</span>
            </div>
          </button>

          <button
            onClick={() => setCustomerView('requests')}
            className="p-5 bg-white border border-[#E3E8F0] hover:border-[#2457A7] hover:shadow-bank-card rounded-xl text-left transition-all flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#F5F7FA] text-[#102544] group-hover:bg-[#102544] group-hover:text-white flex items-center justify-center transition-colors">
              <Key className="w-4 h-4" />
            </div>
            <div className="mt-4">
              <span className="font-bold text-[#102544] block text-xs">Service Desk</span>
              <span className="text-[11px] text-[#66758C]">Key loss & repair</span>
            </div>
          </button>

        </div>
      </div>

      {/* Two Column Section: Live Service Requests & Statutory Custody Charter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Operational Tickets (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E3E8F0] rounded-2xl p-6 shadow-bank-card space-y-4">
          <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-3">
            <div>
              <h3 className="font-bold text-[#102544] text-sm">Active Service Requests & Operations</h3>
              <p className="text-[#66758C] text-xs">Track status updates, technician remarks, and approvals</p>
            </div>
            <button
              onClick={() => setCustomerView('requests')}
              className="text-xs text-[#2457A7] hover:underline font-semibold flex items-center gap-0.5"
            >
              <span>View All Requests</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {serviceRequests.slice(0, 3).map(sr => (
              <div
                key={sr.id}
                onClick={() => setCustomerView('requests')}
                className="p-4 rounded-xl border border-[#E3E8F0] hover:bg-[#F5F7FA] transition-colors cursor-pointer flex items-start justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#102544]">{sr.ticketNumber}</span>
                    <span className="text-[#CBD5E1]">·</span>
                    <span className="font-semibold text-[#17263C]">{sr.requestType}</span>
                    <span className="text-[#CBD5E1]">·</span>
                    <span className="text-[#66758C] font-mono">Locker {sr.lockerNumber}</span>
                  </div>
                  <p className="text-[#66758C] line-clamp-1 text-xs">{sr.description}</p>
                  <p className="text-[11px] text-[#66758C]/80 font-mono">
                    Last Updated: {sr.lastUpdated} · Assigned: {sr.assignedOfficer || 'Branch Custodian Desk'}
                  </p>
                </div>
                <StatusBadge status={sr.status} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory Safe Custody Guidelines (5 cols) */}
        <div className="lg:col-span-5 bg-[#F5F7FA] border border-[#E3E8F0] rounded-2xl p-6 shadow-bank-card space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#102544] font-bold text-sm">
              <Shield className="w-4 h-4 text-[#16845B]" />
              <span>RBI Safe Custody Directives & Protections</span>
            </div>

            <div className="space-y-2.5 text-xs text-[#66758C] leading-relaxed">
              <p>
                • <strong>Statutory Liability Ceiling (100x Rent):</strong> For events such as fire, theft, or burglary attributable to bank deficiencies, bank liability is statutorily pegged up to 100 times the annual rent (₹{(activeLocker.annualRent * 100).toLocaleString('en-IN')}).
              </p>
              <p>
                • <strong>Confidentiality & Content Privacy:</strong> Bank custodians never inspect or inventory locker contents during routine visits. Private booths ensure total privacy.
              </p>
              <p>
                • <strong>Break-Open Protocol:</strong> In the rare event of lost keys, break-open operations are scheduled exclusively in your presence and with two independent witnesses.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E3E8F0] flex items-center justify-between text-xs">
            <span className="text-[#66758C]">Ombudsman Grievance SLA: 24h</span>
            <button
              onClick={() => setCustomerView('support')}
              className="text-[#2457A7] font-semibold hover:underline"
            >
              Support & Branch Directory →
            </button>
          </div>
        </div>

      </div>

      {/* Step-Up OTP Verification Modal for Freeze / Unfreeze */}
      <OtpModal
        isOpen={isOtpOpen}
        onClose={() => {
          setIsOtpOpen(false);
          setTargetLockLockerId(null);
        }}
        onSuccess={handleOtpSuccess}
        title={otpAction === 'freeze' ? 'Confirm Emergency Locker Freeze' : 'Confirm Lifting Access Freeze'}
        actionDescription={
          otpAction === 'freeze'
            ? 'You are initiating an emergency security freeze on Locker access'
            : 'You are lifting the security freeze on your Locker'
        }
      />

      {/* QR Token Modal for Upcoming Appointment */}
      {isQrModalOpen && nextAppointment && (
        <QrTokenModal
          appointment={nextAppointment}
          onClose={() => setIsQrModalOpen(false)}
        />
      )}

    </div>
  );
};

