import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { StatusBadge } from '../common/StatusBadge';
import { OtpModal } from '../common/OtpModal';
import { QrTokenModal } from '../common/QrTokenModal';
import { Appointment, LockerItem } from '../../types';
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
  Info,
  ExternalLink,
  ShieldCheck,
  Search,
  Bell,
  Sparkles,
  MapPin,
  Check
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const {
    lockers,
    appointments,
    payments,
    serviceRequests,
    notifications,
    accessLogs,
    setCustomerView,
    selectedLockerId,
    setSelectedLockerId,
    restrictLockerAccess,
    unrestrictLockerAccess
  } = useBanking();

  // Active customer lockers (Strictly own records for Rahul Sharma)
  const customerLockers = lockers.filter(l => l.customerId === 'cust-rahul-01');
  const activeLocker = customerLockers.find(l => l.id === selectedLockerId) || customerLockers[0] || lockers[0];
  const outstandingTotal = customerLockers.reduce((acc, curr) => acc + (curr.outstandingRent || 0), 0);
  
  // Customer specific appointments
  const customerAppointments = appointments.filter(
    a => a.customerId === 'cust-rahul-01' || customerLockers.some(l => l.id === a.lockerId)
  );
  const nextAppointment = customerAppointments.find(a => a.status === 'Confirmed' || a.status === 'Checked In');

  // Customer specific service requests
  const customerRequests = serviceRequests.filter(
    sr => sr.customerId === 'cust-rahul-01' || customerLockers.some(l => l.id === sr.lockerId)
  );

  // Customer specific access logs
  const customerAccessLogs = accessLogs.filter(
    al => customerLockers.some(l => l.id === al.lockerId)
  );

  // Security Freeze / Unfreeze state
  const [targetLockLockerId, setTargetLockLockerId] = useState<string | null>(null);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpAction, setOtpAction] = useState<'freeze' | 'unfreeze'>('freeze');
  const [selectedQrApt, setSelectedQrApt] = useState<Appointment | null>(null);

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

  // Find nearest renewal date
  const sortedByRenewal = [...customerLockers].sort((a, b) => {
    return new Date(a.nextRenewalDate || '2099-01-01').getTime() - new Date(b.nextRenewalDate || '2099-01-01').getTime();
  });
  const nearestRenewalLocker = sortedByRenewal[0];

  return (
    <div className="space-y-6 text-[#17263C]">
      {/* 1. TOP: PREMIUM WELCOME BANNER WITH SUBTLE VAULT IMAGERY & PROFILE */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B1730] via-[#102544] to-[#1E3A8A] text-white p-6 sm:p-7 shadow-lg border border-[#102544]">
        {/* Subtle background ornamentation */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
        <div className="absolute -right-10 -bottom-10 w-64 h-64 border-8 border-white/5 rounded-full pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-84 h-84 border border-white/10 rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#008C88]/25 text-[#2DD4BF] border border-[#008C88]/40">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2DD4BF]" />
                <span>KYC Compliant & Verified Hirer</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/10 text-white/90 border border-white/15">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Premier Wealth Client</span>
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                Welcome, Rahul Sharma
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                National Bank SafeVault Premier Portal · Multi-Branch Safe Custody Portfolio & Biometric Strongroom Access
              </p>
            </div>

            {/* Profile Summary Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-300/90 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-sans">CIF Number:</span>
                <span className="text-white font-semibold tabular-nums">CIF-9028192831</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-sans">PAN:</span>
                <span className="text-white tabular-nums">ABCPS****F</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-sans">Registered Mobile:</span>
                <span className="text-white tabular-nums">+91 98101 23456</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-sans">Linked CBS Account:</span>
                <span className="text-white tabular-nums">5010049281720</span>
              </div>
            </div>
          </div>

          {/* Quick CTA right box */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => setCustomerView('visit')}
              className="px-4 py-2.5 rounded-xl bg-[#2457A7] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-emerald-300" />
              <span>Schedule Strongroom Visit</span>
            </button>
            <button
              onClick={() => setCustomerView('search')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-slate-300" />
              <span>Discover & Apply Locker</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SECOND: FOUR BEAUTIFUL KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Lockers */}
        <div
          onClick={() => setCustomerView('search')}
          className="bg-white p-5 rounded-2xl border border-[#E3E8F0] shadow-xs hover:border-[#2457A7] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#66758C]">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Lockers</span>
            <div className="w-9 h-9 rounded-xl bg-[#2457A7]/10 text-[#2457A7] flex items-center justify-center group-hover:bg-[#2457A7] group-hover:text-white transition-colors">
              <Key className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-bold font-mono tabular-nums text-[#102544]">
              {customerLockers.length}
            </div>
            <span className="text-xs text-[#16845B] font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>100% Operational</span>
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#66758C] flex items-center justify-between">
            <span>Across {new Set(customerLockers.map(l => l.city)).size} Cities ({Array.from(new Set(customerLockers.map(l => l.city))).join(', ')})</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#66758C] group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* KPI 2: Outstanding Rent */}
        <div
          onClick={() => setCustomerView('rent')}
          className="bg-white p-5 rounded-2xl border border-[#E3E8F0] shadow-xs hover:border-[#2457A7] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#66758C]">
            <span className="text-xs font-semibold uppercase tracking-wider">Outstanding Rent</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              outstandingTotal > 0
                ? 'bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white'
                : 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white'
            }`}>
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className={`text-3xl font-bold font-mono tabular-nums ${
              outstandingTotal > 0 ? 'text-[#B7791F]' : 'text-[#16845B]'
            }`}>
              ₹{outstandingTotal.toLocaleString('en-IN')}
            </div>
            {outstandingTotal > 0 ? (
              <span className="text-xs text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                1 Due Account
              </span>
            ) : (
              <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                All Cleared
              </span>
            )}
          </div>
          <div className="mt-2 text-[11px] text-[#66758C] flex items-center justify-between">
            <span>{outstandingTotal > 0 ? 'Locker B-042 due for renewal' : 'All rental invoices cleared'}</span>
            <span className="text-[#2457A7] font-semibold flex items-center gap-0.5">Pay Now →</span>
          </div>
        </div>

        {/* KPI 3: Next Appointment */}
        <div
          onClick={() => setCustomerView('visit')}
          className="bg-white p-5 rounded-2xl border border-[#E3E8F0] shadow-xs hover:border-[#2457A7] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#66758C]">
            <span className="text-xs font-semibold uppercase tracking-wider">Next Strongroom Visit</span>
            <div className="w-9 h-9 rounded-xl bg-[#2457A7]/10 text-[#2457A7] flex items-center justify-center group-hover:bg-[#2457A7] group-hover:text-white transition-colors">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            {nextAppointment ? (
              <div>
                <div className="text-base font-bold text-[#102544] flex items-center gap-1.5">
                  <span className="font-mono tabular-nums">{nextAppointment.date}</span>
                </div>
                <div className="text-xs font-mono text-[#66758C] mt-0.5">
                  {nextAppointment.timeSlot} · {nextAppointment.lockerNumber}
                </div>
              </div>
            ) : (
              <div>
                <div className="text-xl font-bold text-[#66758C]">No Pending Visit</div>
                <div className="text-xs text-[#66758C] mt-0.5">Walk-in slot open</div>
              </div>
            )}
          </div>
          <div className="mt-2 text-[11px] text-[#66758C] flex items-center justify-between border-t border-[#E3E8F0] pt-2">
            <span>{nextAppointment ? `Token: ${nextAppointment.tokenNumber}` : 'Reserve 30-min slot'}</span>
            <span className="text-[#2457A7] font-semibold">{nextAppointment ? 'View QR →' : 'Book →'}</span>
          </div>
        </div>

        {/* KPI 4: Agreement / Renewal Status */}
        <div
          onClick={() => setCustomerView('agreements')}
          className="bg-white p-5 rounded-2xl border border-[#E3E8F0] shadow-xs hover:border-[#2457A7] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#66758C]">
            <span className="text-xs font-semibold uppercase tracking-wider">Agreement & Covenants</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-xl font-bold text-[#102544]">
              Active & Valid
            </div>
            <span className="text-xs font-mono tabular-nums text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              RBI Model 2024
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#66758C] flex items-center justify-between">
            <span>Next lease review: <span className="font-mono tabular-nums text-[#17263C] font-semibold">{nearestRenewalLocker?.nextRenewalDate}</span></span>
            <ChevronRight className="w-3.5 h-3.5 text-[#66758C] group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* 3. THIRD: MY LOCKER PORTFOLIO */}
      <div className="bg-white rounded-2xl border border-[#E3E8F0] shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#E3E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#102544] tracking-tight">
                My Locker Portfolio
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#102544] text-white font-mono tabular-nums">
                {customerLockers.length} Safe Custody Units
              </span>
            </div>
            <p className="text-xs text-[#66758C] mt-0.5">
              Multi-branch safe deposit lockers allotted under National Bank Model Locker Deed
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCustomerView('search')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#102544] hover:bg-[#0B1730] rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5 text-[#008C88]" />
              <span>Apply New Unit</span>
            </button>
          </div>
        </div>

        {/* Locker Cards Grid */}
        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {customerLockers.map(lkr => {
            const isSelected = lkr.id === selectedLockerId;
            const isBlocked = lkr.status === 'Blocked';
            return (
              <div
                key={lkr.id}
                className={`rounded-2xl border transition-all p-5 flex flex-col justify-between shadow-xs ${
                  isSelected
                    ? 'border-[#102544] bg-[#F5F7FA]/60 ring-2 ring-[#102544]/20'
                    : 'border-[#E3E8F0] bg-white hover:border-[#2457A7]'
                }`}
              >
                <div>
                  {/* Top Bar with Locker Number & Status */}
                  <div className="flex items-start justify-between gap-2 border-b border-[#E3E8F0] pb-3.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xl font-bold tracking-tight text-[#102544]">
                          Locker {lkr.lockerNumber}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider bg-[#2457A7]/10 text-[#2457A7] border border-[#2457A7]/20">
                          {lkr.size}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#66758C] mt-1">
                        <MapPin className="w-3 h-3 text-[#66758C]" />
                        <span className="font-medium text-[#17263C]">{lkr.branchName}</span>
                        <span>· {lkr.city}</span>
                      </div>
                    </div>
                    <StatusBadge status={lkr.status} size="sm" />
                  </div>

                  {/* Specifications & Mandates */}
                  <div className="py-3.5 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#66758C]">Operating Mandate</span>
                      <span className="font-medium text-[#17263C]">{lkr.operatingMode || 'Single (Self)'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#66758C]">Annual Rent</span>
                      <span className="font-mono tabular-nums font-semibold text-[#102544]">
                        ₹{lkr.annualRent.toLocaleString('en-IN')} + 18% GST
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#66758C]">Security Deposit</span>
                      <span className="font-mono tabular-nums text-[#17263C]">
                        ₹{lkr.securityDeposit.toLocaleString('en-IN')} (FD Lien)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#66758C]">Next Lease Renewal</span>
                      <span className="font-mono tabular-nums font-medium text-[#17263C]">
                        {lkr.nextRenewalDate || '15 Jan 2027'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#66758C]">Last Physical Access</span>
                      <span className="font-mono tabular-nums text-[#17263C]">
                        {lkr.lastAccessDate || '12 Oct 2026'}
                      </span>
                    </div>

                    {lkr.outstandingRent && lkr.outstandingRent > 0 ? (
                      <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between text-xs mt-2">
                        <span className="font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Renewal Overdue:</span>
                        </span>
                        <span className="font-mono font-bold text-amber-900 tabular-nums">
                          ₹{lkr.outstandingRent.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Locker Quick Action Strip */}
                <div className="pt-3 border-t border-[#E3E8F0] space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => {
                        setSelectedLockerId(lkr.id);
                        setCustomerView('visit');
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-[#102544] hover:bg-[#0B1730] text-white font-medium text-center transition-colors shadow-2xs flex items-center justify-center gap-1"
                    >
                      <Calendar className="w-3 h-3 text-emerald-400" />
                      <span>Book Visit</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedLockerId(lkr.id);
                        setCustomerView('rent');
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-[#F5F7FA] hover:bg-[#E3E8F0] text-[#102544] font-medium border border-[#E3E8F0] text-center transition-colors flex items-center justify-center gap-1"
                    >
                      <CreditCard className="w-3 h-3 text-[#2457A7]" />
                      <span>Pay Tariff</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <button
                      onClick={() => {
                        setSelectedLockerId(lkr.id);
                        setCustomerView('holders');
                      }}
                      className="text-[#2457A7] hover:underline font-semibold flex items-center gap-1"
                    >
                      <Users className="w-3 h-3" />
                      <span>Nominee / Mandates</span>
                    </button>

                    <button
                      onClick={() => handleToggleFreeze(lkr.id, lkr.status)}
                      className={`font-semibold flex items-center gap-1 hover:underline ${
                        isBlocked ? 'text-[#16845B]' : 'text-[#C83E44]'
                      }`}
                    >
                      {isBlocked ? (
                        <>
                          <Unlock className="w-3 h-3" />
                          <span>Unfreeze Unit</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>Security Freeze</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. FOURTH: QUICK ACTIONS STRIP */}
      <div className="bg-white rounded-2xl border border-[#E3E8F0] p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-bold text-[#102544] uppercase tracking-wider mb-4">
          Quick Self-Service Banking Workflows
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <button
            onClick={() => setCustomerView('search')}
            className="p-3.5 rounded-xl border border-[#E3E8F0] bg-[#F5F7FA] hover:bg-white hover:border-[#2457A7] hover:shadow-xs transition-all flex flex-col items-center text-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E3E8F0] text-[#2457A7] flex items-center justify-center group-hover:bg-[#2457A7] group-hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <span className="font-semibold text-[#17263C]">Find a Locker</span>
            <span className="text-[10px] text-[#66758C]">28 Branches</span>
          </button>

          <button
            onClick={() => setCustomerView('visit')}
            className="p-3.5 rounded-xl border border-[#E3E8F0] bg-[#F5F7FA] hover:bg-white hover:border-[#2457A7] hover:shadow-xs transition-all flex flex-col items-center text-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E3E8F0] text-[#16845B] flex items-center justify-center group-hover:bg-[#16845B] group-hover:text-white transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="font-semibold text-[#17263C]">Book Visit</span>
            <span className="text-[10px] text-[#66758C]">Digital Pass</span>
          </button>

          <button
            onClick={() => setCustomerView('rent')}
            className="p-3.5 rounded-xl border border-[#E3E8F0] bg-[#F5F7FA] hover:bg-white hover:border-[#2457A7] hover:shadow-xs transition-all flex flex-col items-center text-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E3E8F0] text-[#B7791F] flex items-center justify-center group-hover:bg-[#B7791F] group-hover:text-white transition-colors">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="font-semibold text-[#17263C]">Pay Rent</span>
            <span className="text-[10px] text-[#66758C]">Auto-Debit / UPI</span>
          </button>

          <button
            onClick={() => setCustomerView('agreements')}
            className="p-3.5 rounded-xl border border-[#E3E8F0] bg-[#F5F7FA] hover:bg-white hover:border-[#2457A7] hover:shadow-xs transition-all flex flex-col items-center text-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E3E8F0] text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <span className="font-semibold text-[#17263C]">View Agreements</span>
            <span className="text-[10px] text-[#66758C]">Model Deed</span>
          </button>

          <button
            onClick={() => setCustomerView('requests')}
            className="p-3.5 rounded-xl border border-[#E3E8F0] bg-[#F5F7FA] hover:bg-white hover:border-[#2457A7] hover:shadow-xs transition-all flex flex-col items-center text-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E3E8F0] text-[#008C88] flex items-center justify-center group-hover:bg-[#008C88] group-hover:text-white transition-colors">
              <AlertCircle className="w-5 h-5" />
            </div>
            <span className="font-semibold text-[#17263C]">Service Request</span>
            <span className="text-[10px] text-[#66758C]">Key / Upgrade</span>
          </button>

          <button
            onClick={() => setCustomerView('history')}
            className="p-3.5 rounded-xl border border-[#E3E8F0] bg-[#F5F7FA] hover:bg-white hover:border-[#2457A7] hover:shadow-xs transition-all flex flex-col items-center text-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E3E8F0] text-[#102544] flex items-center justify-center group-hover:bg-[#102544] group-hover:text-white transition-colors">
              <Clock className="w-5 h-5" />
            </div>
            <span className="font-semibold text-[#17263C]">Access History</span>
            <span className="text-[10px] text-[#66758C]">Gate Logs</span>
          </button>
        </div>
      </div>

      {/* 5. FIFTH: 4 MODULAR PANELS (Upcoming Appointments, Recent Access History, Active Requests, Notifications) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Upcoming Appointments */}
        <div className="bg-white rounded-2xl border border-[#E3E8F0] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#2457A7]" />
                <h3 className="text-sm font-bold text-[#102544]">
                  Upcoming Appointments ({customerAppointments.length})
                </h3>
              </div>
              <button
                onClick={() => setCustomerView('visit')}
                className="text-xs text-[#2457A7] font-semibold hover:underline flex items-center gap-1"
              >
                <span>Book New</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {customerAppointments.length === 0 ? (
              <div className="py-8 text-center text-[#66758C] text-xs">
                No active visits scheduled. Click "Book New" to reserve vault time.
              </div>
            ) : (
              <div className="space-y-3">
                {customerAppointments.slice(0, 3).map(apt => (
                  <div
                    key={apt.id}
                    className="p-3.5 rounded-xl border border-[#E3E8F0] bg-[#F5F7FA] hover:bg-white transition-all flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#102544]">{apt.tokenNumber}</span>
                        <StatusBadge status={apt.status} size="sm" />
                      </div>
                      <div className="text-[11px] text-[#66758C] mt-1 font-mono tabular-nums">
                        {apt.date} · {apt.timeSlot} · {apt.lockerNumber}
                      </div>
                      <div className="text-[11px] text-[#17263C] mt-0.5 font-medium truncate max-w-xs">
                        {apt.branchName}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedQrApt(apt)}
                      className="px-3 py-1.5 rounded-lg bg-[#2457A7]/10 hover:bg-[#2457A7]/20 text-[#2457A7] font-semibold text-xs transition-colors shrink-0 flex items-center gap-1"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>View Pass</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#E3E8F0] mt-4 flex items-center justify-between text-[11px] text-[#66758C]">
            <span>Present QR token at vault entry gate</span>
            <button
              onClick={() => setCustomerView('visit')}
              className="text-[#2457A7] font-semibold hover:underline"
            >
              Manage Appointments →
            </button>
          </div>
        </div>

        {/* Panel 2: Recent Access History */}
        <div className="bg-white rounded-2xl border border-[#E3E8F0] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#102544]" />
                <h3 className="text-sm font-bold text-[#102544]">
                  Recent Strongroom Turnstile Access ({customerAccessLogs.length})
                </h3>
              </div>
              <button
                onClick={() => setCustomerView('history')}
                className="text-xs text-[#2457A7] font-semibold hover:underline flex items-center gap-1"
              >
                <span>View Full Log</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {customerAccessLogs.slice(0, 3).map(log => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl border border-[#E3E8F0] bg-[#F5F7FA] hover:bg-white transition-all text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#102544]">Locker {log.lockerNumber}</span>
                      <span className="text-[10px] bg-slate-200 text-[#17263C] px-1.5 py-0.5 rounded font-mono">
                        {log.operatorType}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-[#66758C] tabular-nums">{log.date}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#66758C]">
                    <span>In: <span className="font-mono text-[#17263C] font-semibold">{log.timeIn}</span> · Out: <span className="font-mono text-[#17263C] font-semibold">{log.timeOut}</span></span>
                    <span>Officer: {log.vaultOfficer}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#E3E8F0] mt-4 flex items-center justify-between text-[11px] text-[#66758C]">
            <span className="flex items-center gap-1 text-[#16845B]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Biometric verification active</span>
            </span>
            <button
              onClick={() => setCustomerView('history')}
              className="text-[#C83E44] font-semibold hover:underline"
            >
              Report Discrepancy →
            </button>
          </div>
        </div>

        {/* Panel 3: Active Service Requests */}
        <div className="bg-white rounded-2xl border border-[#E3E8F0] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#008C88]" />
                <h3 className="text-sm font-bold text-[#102544]">
                  Service & Operations Requests ({customerRequests.length})
                </h3>
              </div>
              <button
                onClick={() => setCustomerView('requests')}
                className="text-xs text-[#2457A7] font-semibold hover:underline flex items-center gap-1"
              >
                <span>New Request</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {customerRequests.length === 0 ? (
              <div className="py-8 text-center text-[#66758C] text-xs">
                No open service requests. Need replacement keys or size upgrades?
              </div>
            ) : (
              <div className="space-y-3">
                {customerRequests.slice(0, 3).map(req => (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-xl border border-[#E3E8F0] bg-[#F5F7FA] text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#102544]">{req.ticketNumber}</span>
                      <StatusBadge status={req.status} size="sm" />
                    </div>
                    <div className="text-[11px] font-medium text-[#17263C]">
                      {req.requestType} · Locker {req.lockerNumber}
                    </div>
                    <div className="text-[11px] text-[#66758C] line-clamp-1">
                      {req.description}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#E3E8F0] mt-4 flex items-center justify-between text-[11px] text-[#66758C]">
            <span>Bank SLA TAT: 48 Business Hours</span>
            <button
              onClick={() => setCustomerView('requests')}
              className="text-[#2457A7] font-semibold hover:underline"
            >
              Track All Requests →
            </button>
          </div>
        </div>

        {/* Panel 4: Security Notifications & Advisories */}
        <div className="bg-white rounded-2xl border border-[#E3E8F0] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#B7791F]" />
                <h3 className="text-sm font-bold text-[#102544]">
                  Security Alerts & CBS Advisories
                </h3>
              </div>
              <span className="text-[11px] text-[#66758C] font-mono">Live Sync</span>
            </div>

            <div className="space-y-3">
              {notifications.slice(0, 3).map(notif => (
                <div
                  key={notif.id}
                  className="p-3.5 rounded-xl border border-[#E3E8F0] bg-[#F5F7FA] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#102544] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#2457A7]" />
                      {notif.title}
                    </span>
                    <span className="font-mono text-[10px] text-[#66758C]">{notif.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-[#66758C] line-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#E3E8F0] mt-4 flex items-center justify-between text-[11px] text-[#66758C]">
            <span>RBI Security Protocol 2026</span>
            <button
              onClick={() => setCustomerView('notifications')}
              className="text-[#2457A7] font-semibold hover:underline"
            >
              View All Notices →
            </button>
          </div>
        </div>
      </div>

      {/* OTP Modal for Freeze / Unfreeze */}
      <OtpModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onSuccess={handleOtpSuccess}
        title={otpAction === 'freeze' ? 'Confirm Security Freeze' : 'Lift Security Freeze'}
        actionDescription={
          otpAction === 'freeze'
            ? 'Enter 6-digit OTP sent to registered mobile to place immediate strongroom freeze on locker'
            : 'Enter 6-digit OTP to unfreeze locker access and re-enable strongroom visits'
        }
      />

      {/* QR Token Modal */}
      <QrTokenModal
        appointment={selectedQrApt}
        onClose={() => setSelectedQrApt(null)}
      />
    </div>
  );
};
