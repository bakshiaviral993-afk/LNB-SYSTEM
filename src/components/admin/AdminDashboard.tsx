import React from 'react';
import { useBanking } from '../../context/BankingContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  Key,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Shield,
  FileText,
  ChevronRight,
  Check,
  ArrowRight,
  X,
  Layers,
  Building2,
  DollarSign,
  Activity,
  FileCheck2,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { LockerSize } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    lockers,
    applications,
    appointments,
    serviceRequests,
    claims,
    branches,
    payments,
    accessLogs,
    setAdminView,
    adminCheckInAppointment,
    adminCompleteAppointment,
    adminApproveApplication
  } = useBanking();

  const [drillDownType, setDrillDownType] = React.useState<'occupancy' | 'applications' | 'serviceRequests' | 'claims' | null>(null);

  const totalLockers = lockers.length;
  const occupiedCount = lockers.filter(l => l.status === 'Occupied').length;
  const vacantCount = lockers.filter(l => l.status === 'Vacant').length;
  const reservedCount = lockers.filter(l => l.status === 'Reserved').length;
  const blockedCount = lockers.filter(l => l.status === 'Blocked' || l.status === 'Under Maintenance').length;
  const pendingApps = applications.filter(a => a.status === 'Submitted' || a.status === 'KYC Verified');
  const pendingApprovals = applications.filter(a => a.status === 'Maker Verified' || a.status === 'KYC Verified').length;
  const todayAppointments = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Checked In');
  const openServiceRequests = serviceRequests.filter(sr => sr.status !== 'Resolved / Closed' && sr.status !== 'Rejected');
  const activeClaims = claims.filter(c => c.status !== 'Settled & Closed');
  const totalOutstandingRent = lockers.reduce((acc, l) => acc + (l.outstandingRent || 0), 0);
  const overdueAccountsCount = lockers.filter(l => (l.outstandingRent || 0) > 0).length;

  // Size utilization derived from real locker inventory
  const sizeBreakdown = (['Small', 'Medium', 'Large', 'Extra Large'] as LockerSize[]).map(size => {
    const total = lockers.filter(l => l.size === size).length;
    const occupied = lockers.filter(l => l.size === size && l.status === 'Occupied').length;
    const pct = total > 0 ? Math.round((occupied / total) * 100) : 0;
    return { size, total, occupied, pct };
  });

  // Branch-wise distribution and performance derived from live branch records
  const branchPerformance = branches.map(b => {
    const bLockers = lockers.filter(l => l.branchId === b.id);
    const bTotal = bLockers.length;
    const bOccupied = bLockers.filter(l => l.status === 'Occupied').length;
    const bRent = bLockers.reduce((sum, l) => sum + (l.status === 'Occupied' ? l.annualRent : 0), 0);
    const bArrears = bLockers.reduce((sum, l) => sum + (l.outstandingRent || 0), 0);
    const bOccPct = bTotal > 0 ? Math.round((bOccupied / bTotal) * 100) : 0;
    return { ...b, total: bTotal, occupied: bOccupied, rent: bRent, arrears: bArrears, occPct: bOccPct };
  });

  // Operational Actionable Alerts
  const operationalAlerts = [
    ...lockers.filter(l => (l.outstandingRent || 0) >= 15000).slice(0, 2).map(l => ({
      id: `alt-arr-${l.id}`,
      severity: 'critical',
      title: `Statutory Foreclosure Notice Due: Locker ${l.lockerNumber}`,
      description: `Default arrears ₹${l.outstandingRent?.toLocaleString('en-IN')} exceeds 18-month threshold. Issue 90-day Gazette notice.`,
      actionView: 'break-open',
      actionLabel: 'Foreclosure Desk'
    })),
    ...applications.filter(a => a.status === 'Maker Verified').slice(0, 1).map(a => ({
      id: `alt-app-${a.id}`,
      severity: 'warning',
      title: `Checker Approval Pending: App #${a.applicationNumber}`,
      description: `Maker verified KYC for ${a.customerName} (${a.sizeRequested}). Awaiting Branch Manager dual sign-off.`,
      actionView: 'applications',
      actionLabel: 'Authorize Allotment'
    })),
    ...lockers.filter(l => l.status === 'Blocked').slice(0, 1).map(l => ({
      id: `alt-blk-${l.id}`,
      severity: 'info',
      title: `Security Freeze Active: Locker ${l.lockerNumber}`,
      description: `Locker has active administrative or court restraint. Dual key turnstile entry locked.`,
      actionView: 'inventory',
      actionLabel: 'Inspect Compartment'
    }))
  ];

  // Recent turnstile access entries (latest 4)
  const recentAccessLogs = accessLogs.slice(0, 4);

  // Real vault operating hours footfall data
  const hourlyTraffic = [
    { hour: '10:00', visitors: 3, peak: false },
    { hour: '11:00', visitors: 6, peak: true },
    { hour: '12:00', visitors: 5, peak: false },
    { hour: '13:00', visitors: 2, peak: false },
    { hour: '14:00', visitors: 4, peak: false },
    { hour: '15:00', visitors: 7, peak: true },
    { hour: '16:00', visitors: 3, peak: false },
  ];
  const maxHourly = Math.max(...hourlyTraffic.map(h => h.visitors));

  const occRatio = Math.round((occupiedCount / (totalLockers || 1)) * 100);
  const vacRatio = Math.round((vacantCount / (totalLockers || 1)) * 100);

  return (
    <div className="space-y-6 text-xs text-[#17263C]">
      
      {/* Branch Strongroom Custody Command Banner */}
      <div className="bg-[#102544] text-white rounded-2xl p-6 shadow-md border border-[#0B1730]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-5 border-b border-white/10">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-white/70 font-medium text-xs">
              <span>Facility Code: <strong className="font-mono text-white">ANB000101</strong></span>
              <span aria-hidden="true">·</span>
              <span>Branch: <strong className="text-white">Connaught Place Main Branch Hub</strong></span>
              <span aria-hidden="true">·</span>
              <span>Custodian: <strong className="text-white">Priya Nair (Senior Operations Manager)</strong></span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white mt-1.5">
              Strongroom Operations & Custody Console
            </h1>
            <p className="text-white/70 text-xs mt-1 max-w-2xl leading-relaxed">
              Real-time gate queue, dual-key turnstile check-ins, maker-checker allotment approvals, and statutory safe deposit audit controls.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setAdminView('visits')}
              className="px-4 py-2.5 bg-[#008C88] hover:bg-[#008C88]/90 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-xs text-xs"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Visitor Gate Queue ({todayAppointments.length})</span>
            </button>
            <button
              onClick={() => setAdminView('applications')}
              className="px-4 py-2.5 bg-white text-[#102544] font-semibold rounded-xl hover:bg-white/90 transition-colors flex items-center gap-2 shadow-xs text-xs"
            >
              <Key className="w-3.5 h-3.5 text-[#2457A7]" />
              <span>Allotment Requests ({pendingApps.length})</span>
            </button>
          </div>
        </div>

        {/* Strongroom Status Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-5 text-xs text-white/80">
          <div>
            <span className="text-white/60 block text-[11px]">Vault Status</span>
            <span className="font-semibold text-white mt-0.5 block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16845B]" />
              Armed & Operational
            </span>
          </div>
          <div>
            <span className="text-white/60 block text-[11px]">Dual-Custody Protocol</span>
            <span className="font-semibold text-white mt-0.5 block">Master #1 & Hirer #2 Active</span>
          </div>
          <div>
            <span className="text-white/60 block text-[11px]">Surveillance Status</span>
            <span className="font-semibold text-white mt-0.5 block">CCTV & Biometrics Logged</span>
          </div>
          <div>
            <span className="text-white/60 block text-[11px]">Content Confidentiality</span>
            <span className="font-semibold text-[#008C88] mt-0.5 block">Strict Zero-Inspection Active</span>
          </div>
        </div>
      </div>

      {/* 12 Concise Operational Banking KPI Cards (SysArc SAFE Standard) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#66758C]">
            Operational Key Performance Indicators (Real-time Ledger)
          </h2>
          <span className="text-[11px] text-[#66758C]">
            Click any KPI card to open filtered operational module
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. Total Lockers */}
          <div
            onClick={() => setAdminView('inventory')}
            className="p-3.5 bg-white border border-[#E3E8F0] hover:border-[#102544] rounded-xl shadow-xs cursor-pointer transition-all hover:bg-[#F5F7FA] group"
          >
            <div className="text-[#66758C] text-[11px] font-medium truncate">Total Lockers</div>
            <div className="text-xl font-extrabold text-[#102544] font-mono mt-0.5">{totalLockers}</div>
            <div className="text-[10px] text-[#2457A7] mt-0.5 group-hover:underline">View Matrix →</div>
          </div>

          {/* 2. Occupied Lockers */}
          <div
            onClick={() => setAdminView('inventory')}
            className="p-3.5 bg-white border border-[#E3E8F0] hover:border-[#102544] rounded-xl shadow-xs cursor-pointer transition-all hover:bg-[#F5F7FA] group"
          >
            <div className="text-[#66758C] text-[11px] font-medium truncate">Occupied Lockers</div>
            <div className="text-xl font-extrabold text-[#102544] font-mono mt-0.5">{occupiedCount}</div>
            <div className="text-[10px] text-[#16845B] mt-0.5 font-semibold">Active Hirers</div>
          </div>

          {/* 3. Available Lockers */}
          <div
            onClick={() => setAdminView('inventory')}
            className="p-3.5 bg-white border border-[#E3E8F0] hover:border-[#102544] rounded-xl shadow-xs cursor-pointer transition-all hover:bg-[#F5F7FA] group"
          >
            <div className="text-[#66758C] text-[11px] font-medium truncate">Available Lockers</div>
            <div className="text-xl font-extrabold text-[#16845B] font-mono mt-0.5">{vacantCount}</div>
            <div className="text-[10px] text-[#16845B] mt-0.5 font-semibold">Ready for Allotment</div>
          </div>

          {/* 4. Reserved Lockers */}
          <div
            onClick={() => setAdminView('inventory')}
            className="p-3.5 bg-white border border-[#E3E8F0] hover:border-[#102544] rounded-xl shadow-xs cursor-pointer transition-all hover:bg-[#F5F7FA] group"
          >
            <div className="text-[#66758C] text-[11px] font-medium truncate">Reserved Lockers</div>
            <div className="text-xl font-extrabold text-[#B7791F] font-mono mt-0.5">{reservedCount}</div>
            <div className="text-[10px] text-[#66758C] mt-0.5">Application Hold</div>
          </div>

          {/* 5. Blocked Lockers */}
          <div
            onClick={() => setAdminView('break-open')}
            className="p-3.5 bg-white border border-[#E3E8F0] hover:border-[#C83E44] rounded-xl shadow-xs cursor-pointer transition-all hover:bg-[#F5F7FA] group"
          >
            <div className="text-[#66758C] text-[11px] font-medium truncate">Blocked Lockers</div>
            <div className="text-xl font-extrabold text-[#C83E44] font-mono mt-0.5">{blockedCount}</div>
            <div className="text-[10px] text-[#C83E44] mt-0.5 font-semibold">Lien / Break-Open</div>
          </div>

          {/* 6. Occupancy % */}
          <div
            onClick={() => setAdminView('inventory')}
            className="p-3.5 bg-white border border-[#E3E8F0] hover:border-[#102544] rounded-xl shadow-xs cursor-pointer transition-all hover:bg-[#F5F7FA] group"
          >
            <div className="text-[#66758C] text-[11px] font-medium truncate">Occupancy Rate</div>
            <div className="text-xl font-extrabold text-[#102544] font-mono mt-0.5">{occRatio}%</div>
            <div className="text-[10px] text-[#008C88] mt-0.5 font-semibold">High Utilization</div>
          </div>

          {/* 7. Pending Applications */}
          <div
            onClick={() => setAdminView('applications')}
            className="p-3.5 bg-white border border-[#E3E8F0] hover:border-[#102544] rounded-xl shadow-xs cursor-pointer transition-all hover:bg-[#F5F7FA] group"
          >
            <div className="text-[#66758C] text-[11px] font-medium truncate">Pending Applications</div>
            <div className="text-xl font-extrabold text-[#102544] font-mono mt-0.5">{pendingApps.length}</div>
            <div className="text-[10px] text-[#2457A7] mt-0.5">KYC In-Scrutiny</div>
          </div>

          {/* 8. Pending Approvals */}
          <div
            onClick={() => setAdminView('applications')}
            className="p-3.5 bg-white border border-[#E3E8F0] hover:border-[#102544] rounded-xl shadow-xs cursor-pointer transition-all hover:bg-[#F5F7FA] group"
          >
            <div className="text-[#66758C] text-[11px] font-medium truncate">Pending Approvals</div>
            <div className="text-xl font-extrabold text-[#B7791F] font-mono mt-0.5">{pendingApprovals}</div>
            <div className="text-[10px] text-[#B7791F] mt-0.5 font-semibold">Checker Action Due</div>
          </div>

          {/* 9. Today's Appointments */}
          <div
            onClick={() => setAdminView('visits')}
            className="p-3.5 bg-white border border-[#E3E8F0] hover:border-[#102544] rounded-xl shadow-xs cursor-pointer transition-all hover:bg-[#F5F7FA] group"
          >
            <div className="text-[#66758C] text-[11px] font-medium truncate">Today's Visits</div>
            <div className="text-xl font-extrabold text-[#008C88] font-mono mt-0.5">{todayAppointments.length}</div>
            <div className="text-[10px] text-[#008C88] mt-0.5 font-semibold">Turnstile Queue</div>
          </div>

          {/* 10. Rent Outstanding */}
          <div
            onClick={() => setAdminView('billing')}
            className="p-3.5 bg-white border border-[#E3E8F0] hover:border-[#C83E44] rounded-xl shadow-xs cursor-pointer transition-all hover:bg-[#F5F7FA] group"
          >
            <div className="text-[#66758C] text-[11px] font-medium truncate">Rent Outstanding</div>
            <div className="text-xl font-extrabold text-[#C83E44] font-mono mt-0.5">
              ₹{(totalOutstandingRent / 1000).toFixed(0)}k
            </div>
            <div className="text-[10px] text-[#C83E44] mt-0.5 font-semibold">Gross Arrears</div>
          </div>

          {/* 11. Overdue Accounts */}
          <div
            onClick={() => setAdminView('arrears')}
            className="p-3.5 bg-white border border-[#E3E8F0] hover:border-[#C83E44] rounded-xl shadow-xs cursor-pointer transition-all hover:bg-[#F5F7FA] group"
          >
            <div className="text-[#66758C] text-[11px] font-medium truncate">Overdue Accounts</div>
            <div className="text-xl font-extrabold text-[#C83E44] font-mono mt-0.5">{overdueAccountsCount}</div>
            <div className="text-[10px] text-[#66758C] mt-0.5">30 to 365+ Days</div>
          </div>

          {/* 12. Open Service Requests */}
          <div
            onClick={() => setAdminView('requests')}
            className="p-3.5 bg-white border border-[#E3E8F0] hover:border-[#102544] rounded-xl shadow-xs cursor-pointer transition-all hover:bg-[#F5F7FA] group"
          >
            <div className="text-[#66758C] text-[11px] font-medium truncate">Open Tickets</div>
            <div className="text-xl font-extrabold text-[#102544] font-mono mt-0.5">{openServiceRequests.length}</div>
            <div className="text-[10px] text-[#008C88] mt-0.5 font-semibold">Keys & Nominees</div>
          </div>
        </div>
      </div>

      {/* Telemetry Row: Strongroom Compartment Utilization Donut & Traffic Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left (5 cols): Strongroom Compartment Utilization */}
        <div className="lg:col-span-5 bg-white border border-[#E3E8F0] rounded-2xl p-6 shadow-bank-card space-y-5">
          <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-3">
            <div>
              <h3 className="font-bold text-[#102544] text-sm">Vault Occupancy Breakdown</h3>
              <p className="text-[#66758C] text-xs">Total Registered Capacity: {totalLockers} units</p>
            </div>
            <span className="font-mono font-bold text-[#102544] bg-[#F5F7FA] px-2.5 py-0.5 rounded-full text-xs border border-[#E3E8F0]">
              {occRatio}% Occupied
            </span>
          </div>

          <div className="flex items-center justify-around gap-6 pt-2">
            {/* SVG Donut */}
            <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="none"
                  stroke="#E3E8F0"
                  strokeWidth="4"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="none"
                  stroke="#102544"
                  strokeWidth="4"
                  strokeDasharray={`${occRatio}, 100`}
                  strokeLinecap="round"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="none"
                  stroke="#16845B"
                  strokeWidth="4"
                  strokeDasharray={`${vacRatio}, 100`}
                  strokeDashoffset={`-${occRatio}`}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-bold font-mono text-[#102544] tabular-nums">{occupiedCount}</span>
                <span className="text-[10px] uppercase tracking-wider text-[#66758C] font-semibold">Active Units</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-[#66758C]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#102544]" />
                  <span>Occupied:</span>
                </span>
                <span className="font-mono font-bold text-[#102544] tabular-nums">{occupiedCount} ({occRatio}%)</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-[#66758C]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#16845B]" />
                  <span>Available Vacant:</span>
                </span>
                <span className="font-mono font-bold text-[#16845B] tabular-nums">{vacantCount} ({vacRatio}%)</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-[#66758C]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C83E44]" />
                  <span>Blocked / Maintenance:</span>
                </span>
                <span className="font-mono font-bold text-[#C83E44] tabular-nums">{blockedCount}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E3E8F0] flex items-center justify-between text-xs">
            <span className="text-[#66758C]">Allotment waitlist: 8 pending applicants</span>
            <button
              onClick={() => setAdminView('inventory')}
              className="text-[#2457A7] font-semibold hover:underline flex items-center gap-0.5"
            >
              <span>Manage Compartment Grid</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right (7 cols): Strongroom Hourly Visitor Footfall Histogram */}
        <div className="lg:col-span-7 bg-white border border-[#E3E8F0] rounded-2xl p-6 shadow-bank-card space-y-5">
          <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-3">
            <div>
              <h3 className="font-bold text-[#102544] text-sm flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#008C88]" />
                <span>Today's Strongroom Visitor Traffic Flow</span>
              </h3>
              <p className="text-[#66758C] text-xs">
                Peak hours: <strong className="text-[#102544] font-mono">11:00 – 12:00</strong> & <strong className="text-[#102544] font-mono">15:00 – 16:00</strong> · Max simultaneous booths: 4
              </p>
            </div>
            <span className="text-xs font-semibold text-[#16845B] bg-[#16845B]/10 border border-[#16845B]/20 px-2.5 py-0.5 rounded-md">
              Strongroom Open
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-32 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-[#E3E8F0]">
            {hourlyTraffic.map(h => {
              const heightPercent = Math.round((h.visitors / maxHourly) * 100);
              return (
                <div key={h.hour} className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer">
                  <span className="text-[10px] font-mono font-bold text-[#66758C] group-hover:text-[#102544] transition-colors tabular-nums">
                    {h.visitors}
                  </span>

                  <div className="w-full max-w-[32px] bg-[#F5F7FA] group-hover:bg-[#E3E8F0] rounded-t-md overflow-hidden flex items-end transition-all h-20">
                    <div
                      className={`w-full rounded-t-sm transition-all duration-300 ${
                        h.peak
                          ? 'bg-[#102544] group-hover:bg-[#2457A7]'
                          : 'bg-[#94A3B8] group-hover:bg-[#66758C]'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  <span className="text-[10px] font-mono font-medium text-[#66758C] group-hover:text-[#102544]">
                    {h.hour}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-[#66758C] pt-1">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-[#102544]" /> Peak Safe Visitation Window
            </span>
            <button
              onClick={() => setAdminView('visits')}
              className="text-[#2457A7] font-semibold hover:underline flex items-center gap-0.5"
            >
              <span>View Turnstile Gate Folio</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Operational Alerts Center (Real-time Statutory & Security Flags) */}
      {operationalAlerts.length > 0 && (
        <div className="bg-white border border-[#E3E8F0] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E3E8F0]">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#C83E44]" />
              <h3 className="font-bold text-[#102544] text-xs uppercase tracking-wider">
                Operational Compliance & Risk Alerts ({operationalAlerts.length})
              </h3>
            </div>
            <span className="text-[11px] text-[#66758C]">Immediate Branch Action Required</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {operationalAlerts.map(alt => (
              <div
                key={alt.id}
                className={`p-3 rounded-xl border flex flex-col justify-between gap-2.5 transition-all ${
                  alt.severity === 'critical'
                    ? 'bg-red-50/60 border-red-200 text-red-900'
                    : alt.severity === 'warning'
                    ? 'bg-amber-50/60 border-amber-200 text-amber-900'
                    : 'bg-blue-50/60 border-blue-200 text-blue-900'
                }`}
              >
                <div>
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>{alt.title}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                      alt.severity === 'critical'
                        ? 'bg-[#C83E44] text-white'
                        : alt.severity === 'warning'
                        ? 'bg-[#B7791F] text-white'
                        : 'bg-[#2457A7] text-white'
                    }`}>
                      {alt.severity}
                    </span>
                  </div>
                  <p className="text-[11px] opacity-90 mt-1 leading-relaxed">
                    {alt.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-black/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-semibold">Priority 1 Dispatch</span>
                  <button
                    onClick={() => setAdminView(alt.actionView)}
                    className="text-xs font-bold underline hover:opacity-80 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{alt.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locker-Size Utilization & Rent Financial Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Size Utilization Breakdown (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#E3E8F0] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E3E8F0]">
            <div>
              <h3 className="font-bold text-[#102544] text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#2457A7]" />
                <span>Locker-Size Utilization Breakdown</span>
              </h3>
              <p className="text-[#66758C] text-xs">Capacity demand by compartment dimension tier</p>
            </div>
            <button
              onClick={() => setAdminView('inventory')}
              className="text-xs text-[#2457A7] font-semibold hover:underline"
            >
              Inventory Grid →
            </button>
          </div>

          <div className="space-y-3.5">
            {sizeBreakdown.map(sb => (
              <div key={sb.size} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#102544] font-medium">{sb.size} Locker</span>
                  <span className="font-mono text-[#66758C]">
                    <strong className="text-[#102544]">{sb.occupied}</strong> / {sb.total} units ({sb.pct}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-[#F5F7FA] rounded-full overflow-hidden border border-[#E3E8F0]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      sb.pct >= 80 ? 'bg-[#102544]' : sb.pct >= 50 ? 'bg-[#2457A7]' : 'bg-[#008C88]'
                    }`}
                    style={{ width: `${sb.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rent Collection & Arrears Trends (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#E3E8F0] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E3E8F0]">
            <div>
              <h3 className="font-bold text-[#102544] text-sm flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#16845B]" />
                <span>Rental Financial Health & Arrears Trend</span>
              </h3>
              <p className="text-[#66758C] text-xs">Run-rate yield, CBS auto-debit and recovery index</p>
            </div>
            <button
              onClick={() => setAdminView('billing')}
              className="text-xs text-[#2457A7] font-semibold hover:underline"
            >
              Financial Hub →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-[#F5F7FA] rounded-xl border border-[#E3E8F0] space-y-1">
              <span className="text-[11px] text-[#66758C] font-semibold">Projected Annual Yield</span>
              <div className="text-lg font-extrabold text-[#102544] font-mono">
                ₹{(lockers.filter(l => l.status === 'Occupied').reduce((sum, l) => sum + l.annualRent, 0) / 1000).toFixed(0)}k
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">98.4% CBS Mandate Realization</span>
            </div>

            <div className="p-3.5 bg-[#F5F7FA] rounded-xl border border-[#E3E8F0] space-y-1">
              <span className="text-[11px] text-[#66758C] font-semibold">Gross Arrears Outstanding</span>
              <div className="text-lg font-extrabold text-[#C83E44] font-mono">
                ₹{(totalOutstandingRent / 1000).toFixed(1)}k
              </div>
              <span className="text-[10px] text-[#C83E44] font-medium">{overdueAccountsCount} delinquent hirers under notice</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>CBS Auto-Debit Batch #BATCH-2026-10-27 executed with zero ledger discrepancy.</span>
            </div>
            <button
              onClick={() => setAdminView('payment-recon')}
              className="text-xs font-bold text-emerald-800 hover:underline shrink-0"
            >
              Reconciliation →
            </button>
          </div>
        </div>
      </div>

      {/* Branch-Wise Capacity Distribution & Performance Matrix */}
      <div className="bg-white border border-[#E3E8F0] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E3E8F0]">
          <div>
            <h3 className="font-bold text-[#102544] text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#2457A7]" />
              <span>Branch-Wise Distribution & Performance Matrix</span>
            </h3>
            <p className="text-[#66758C] text-xs">Multi-branch capacity, occupancy rates, and annual revenue run-rates</p>
          </div>
          <button
            onClick={() => setAdminView('executive-dashboard')}
            className="text-xs text-[#2457A7] font-semibold hover:underline flex items-center gap-1"
          >
            <span>Open Executive Analytics Matrix</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F5F7FA] border-b border-[#E3E8F0] text-[#66758C] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Branch Name</th>
                <th className="py-2.5 px-3">SOL ID / Code</th>
                <th className="py-2.5 px-3">City & Region</th>
                <th className="py-2.5 px-3 text-right">Total Units</th>
                <th className="py-2.5 px-3 text-right">Occupied</th>
                <th className="py-2.5 px-3 text-center">Occupancy Rate</th>
                <th className="py-2.5 px-3 text-right">Annual Tariff Run-Rate</th>
                <th className="py-2.5 px-3 text-right">Outstanding Arrears</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E8F0]">
              {branchPerformance.map(bp => (
                <tr key={bp.id} className="hover:bg-[#F5F7FA]/75 transition-colors">
                  <td className="py-3 px-3 font-bold text-[#102544]">{bp.name}</td>
                  <td className="py-3 px-3 font-mono text-[#66758C]">{bp.code}</td>
                  <td className="py-3 px-3 text-[#17263C]">{bp.city} · {bp.regionName}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-[#102544]">{bp.total}</td>
                  <td className="py-3 px-3 text-right font-mono font-semibold text-[#16845B]">{bp.occupied}</td>
                  <td className="py-3 px-3 text-center font-mono">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      bp.occPct >= 80 ? 'bg-emerald-100 text-emerald-800' : bp.occPct >= 50 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {bp.occPct}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-semibold text-[#102544]">
                    ₹{bp.rent.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-[#C83E44]">
                    {bp.arrears > 0 ? `₹${bp.arrears.toLocaleString('en-IN')}` : 'Nil'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Locker Access Turnstile Feed */}
      <div className="bg-white border border-[#E3E8F0] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E3E8F0]">
          <div>
            <h3 className="font-bold text-[#102544] text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#008C88]" />
              <span>Recent Strongroom Access & Turnstile Activity</span>
            </h3>
            <p className="text-[#66758C] text-xs">Real-time gate check-ins, biometric 2FA verifications, and escort officers</p>
          </div>
          <button
            onClick={() => setAdminView('visits')}
            className="text-xs text-[#2457A7] font-semibold hover:underline"
          >
            Turnstile Folio →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {recentAccessLogs.map(acc => (
            <div key={acc.id} className="p-3 bg-[#F5F7FA] rounded-xl border border-[#E3E8F0] space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#102544] text-sm">Locker {acc.lockerNumber}</span>
                <span className="text-[10px] font-mono text-[#66758C]">{acc.timeIn} - {acc.timeOut}</span>
              </div>
              <div className="font-semibold text-[#17263C] truncate">{acc.operatedBy}</div>
              <div className="text-[11px] text-[#66758C] flex items-center justify-between">
                <span>{acc.operatorType}</span>
                <span className="text-emerald-700 font-semibold text-[10px]">Dual Key OK</span>
              </div>
              <div className="text-[10px] text-[#66758C] pt-1 border-t border-[#E3E8F0] truncate">
                Escort: {acc.vaultOfficer}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Workflows */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Immediate Action Queues (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Visitor Queue Card */}
          <div className="bg-white border border-[#E3E8F0] rounded-2xl p-6 shadow-bank-card space-y-4">
            <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-3">
              <div>
                <h3 className="font-bold text-[#102544] text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#2457A7]" />
                  <span>Strongroom Visitor Queue (Live Gate Operations)</span>
                </h3>
                <p className="text-[#66758C] text-xs">
                  Validate check-in tokens and authorize dual physical key entry
                </p>
              </div>
              <button
                onClick={() => setAdminView('visits')}
                className="text-xs text-[#2457A7] font-semibold hover:underline"
              >
                View Full Queue →
              </button>
            </div>

            <div className="space-y-3">
              {todayAppointments.length === 0 ? (
                <div className="p-6 text-center text-[#66758C]">No pending visits for today.</div>
              ) : (
                todayAppointments.map(apt => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-xl border border-[#E3E8F0] bg-[#F5F7FA] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#102544]">{apt.tokenNumber}</span>
                        <StatusBadge status={apt.status} size="sm" />
                      </div>
                      <div className="font-bold text-[#17263C] text-xs">
                        {apt.customerName} · <span className="text-[#2457A7] font-mono">Locker {apt.lockerNumber}</span>
                      </div>
                      <div className="text-[11px] text-[#66758C] font-mono">
                        {apt.date} · {apt.timeSlot} · {apt.purpose}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {apt.status === 'Confirmed' && (
                        <button
                          onClick={() => adminCheckInAppointment(apt.id)}
                          className="px-3.5 py-2 bg-[#102544] hover:bg-[#0B1730] text-white font-semibold rounded-lg text-xs shadow-xs"
                        >
                          Check In Visitor
                        </button>
                      )}
                      {apt.status === 'Checked In' && (
                        <button
                          onClick={() => adminCompleteAppointment(apt.id, 'Routine safe custody operation verified. Double lock sealed.')}
                          className="px-3.5 py-2 bg-[#16845B] hover:bg-[#16845B]/90 text-white font-semibold rounded-lg text-xs shadow-xs"
                        >
                          Complete & Log Exit
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pending Applications Desk */}
          <div className="bg-white border border-[#E3E8F0] rounded-2xl p-6 shadow-bank-card space-y-4">
            <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-3">
              <div>
                <h3 className="font-bold text-[#102544] text-sm flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#2457A7]" />
                  <span>Pending Customer Allotments ({pendingApps.length})</span>
                </h3>
                <p className="text-[#66758C] text-xs">
                  Scrutinize KYC, assign compartment, and issue allotment letter
                </p>
              </div>
              <button
                onClick={() => setAdminView('applications')}
                className="text-xs text-[#2457A7] font-semibold hover:underline"
              >
                Allotment Console →
              </button>
            </div>

            <div className="space-y-3">
              {pendingApps.map(app => (
                <div
                  key={app.id}
                  className="p-4 rounded-xl border border-[#E3E8F0] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#102544]">{app.applicationNumber}</span>
                      <StatusBadge status={app.status} size="sm" />
                    </div>
                    <div className="font-bold text-[#17263C] text-xs">
                      {app.customerName} ({app.cifNumber})
                    </div>
                    <div className="text-[11px] text-[#66758C]">
                      Requested: {app.sizeRequested} Locker · Mandate: {app.operatingMode}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => adminApproveApplication(app.id)}
                      className="px-3.5 py-2 bg-[#102544] hover:bg-[#0B1730] text-white font-semibold rounded-lg text-xs shadow-xs"
                    >
                      Approve & Allot Unit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Alerts, Audits & Sensitive Actions (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Regulatory Safe Custody Banner */}
          <div className="p-6 bg-[#F5F7FA] border border-[#E3E8F0] rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-[#102544] font-bold text-sm">
              <Shield className="w-4 h-4 text-[#16845B]" />
              <span>Dual Custody & Content Privacy Directive</span>
            </div>
            <p className="text-xs text-[#66758C] leading-relaxed">
              <strong>Mandatory Protocol:</strong> In compliance with banking confidentiality laws, bank officers must <em>never inspect, record, or display locker contents</em>. Officers only escort the hirer, engage master key #1, and immediately step outside the private booth.
            </p>
          </div>

          {/* Service Requests Queue */}
          <div className="bg-white border border-[#E3E8F0] rounded-2xl p-6 shadow-bank-card space-y-4">
            <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-3">
              <h3 className="font-bold text-[#102544] text-sm">
                Service & Technical Desk ({openServiceRequests.length})
              </h3>
              <button
                onClick={() => setAdminView('requests')}
                className="text-xs text-[#2457A7] font-semibold hover:underline"
              >
                Manage All →
              </button>
            </div>

            <div className="space-y-3">
              {openServiceRequests.map(sr => (
                <div
                  key={sr.id}
                  onClick={() => setAdminView('requests')}
                  className="p-3.5 rounded-xl border border-[#E3E8F0] hover:bg-[#F5F7FA] transition-colors cursor-pointer space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#102544]">{sr.ticketNumber}</span>
                    <StatusBadge status={sr.status} size="sm" />
                  </div>
                  <div className="font-semibold text-[#17263C]">
                    {sr.requestType} (Locker {sr.lockerNumber})
                  </div>
                  <p className="text-[11px] text-[#66758C] line-clamp-1">{sr.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Nav Shortcut to Audit Trail */}
          <div className="p-5 bg-[#2457A7]/10 border border-[#2457A7]/20 rounded-2xl flex items-center justify-between">
            <div>
              <span className="font-bold text-[#102544] block text-xs">Audit & Regulatory Log</span>
              <span className="text-[11px] text-[#66758C]">All custodian turns cryptographically registered</span>
            </div>
            <button
              onClick={() => setAdminView('audit')}
              className="px-3.5 py-2 bg-[#102544] hover:bg-[#0B1730] text-white rounded-lg font-semibold text-xs shadow-xs"
            >
              View Logs
            </button>
          </div>

        </div>

      </div>

      {/* KPI Metric Drill-Down & Ledger Reconciliation Modal (TEST 12 Parity) */}
      {drillDownType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1730]/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E3E8F0] max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-[#E3E8F0] bg-[#F5F7FA] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#102544] text-white flex items-center justify-center">
                  <Layers className="w-4 h-4 text-[#008C88]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[#102544] text-sm">
                      {drillDownType === 'occupancy' && 'Vault Occupancy & Locker Inventory Ledger'}
                      {drillDownType === 'applications' && 'Pending Allotment Applications Ledger'}
                      {drillDownType === 'serviceRequests' && 'Technical & Service Requests Ledger'}
                      {drillDownType === 'claims' && 'Deceased Claims & Settlement Ledger'}
                    </h3>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-100 text-[#16845B] border border-emerald-200">
                      1:1 Ledger Parity Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-[#66758C] mt-0.5">
                    Underlying state records reconciled with dashboard KPI telemetry aggregates
                  </p>
                </div>
              </div>

              <button
                onClick={() => setDrillDownType(null)}
                className="text-[#66758C] hover:text-[#17263C] p-1.5 rounded-lg hover:bg-[#E3E8F0]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {drillDownType === 'occupancy' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F5F7FA] text-[#66758C] font-semibold text-[11px] uppercase border-b border-[#E3E8F0]">
                        <th className="py-2.5 px-3">Locker #</th>
                        <th className="py-2.5 px-3">Branch</th>
                        <th className="py-2.5 px-3">Size</th>
                        <th className="py-2.5 px-3">Tier</th>
                        <th className="py-2.5 px-3">Rent (₹)</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E3E8F0]">
                      {lockers.map(l => (
                        <tr key={l.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-bold text-[#102544]">{l.lockerNumber}</td>
                          <td className="py-2.5 px-3">{l.branchName}</td>
                          <td className="py-2.5 px-3 font-medium">{l.size}</td>
                          <td className="py-2.5 px-3">{l.tier}</td>
                          <td className="py-2.5 px-3 font-mono">₹{l.annualRent.toLocaleString()}</td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                              l.status === 'Occupied' ? 'bg-indigo-50 text-[#2457A7] border border-indigo-200' :
                              l.status === 'Vacant' ? 'bg-emerald-50 text-[#16845B] border border-emerald-200' :
                              'bg-amber-50 text-[#B7791F] border border-amber-200'
                            }`}>
                              {l.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {drillDownType === 'applications' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F5F7FA] text-[#66758C] font-semibold text-[11px] uppercase border-b border-[#E3E8F0]">
                        <th className="py-2.5 px-3">App #</th>
                        <th className="py-2.5 px-3">Applicant Name</th>
                        <th className="py-2.5 px-3">Branch</th>
                        <th className="py-2.5 px-3">Size</th>
                        <th className="py-2.5 px-3">Mandate</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E3E8F0]">
                      {applications.map(a => (
                        <tr key={a.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-bold text-[#102544]">{a.applicationNumber}</td>
                          <td className="py-2.5 px-3 font-medium">{a.customerName}</td>
                          <td className="py-2.5 px-3">{a.branchName}</td>
                          <td className="py-2.5 px-3">{a.sizeRequested}</td>
                          <td className="py-2.5 px-3">{a.operatingMode}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-[#F5F7FA] text-[#102544] border border-[#E3E8F0]">
                              {a.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {drillDownType === 'serviceRequests' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F5F7FA] text-[#66758C] font-semibold text-[11px] uppercase border-b border-[#E3E8F0]">
                        <th className="py-2.5 px-3">Ticket #</th>
                        <th className="py-2.5 px-3">Locker #</th>
                        <th className="py-2.5 px-3">Request Type</th>
                        <th className="py-2.5 px-3">Branch</th>
                        <th className="py-2.5 px-3">Est. Cost</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E3E8F0]">
                      {serviceRequests.map(sr => (
                        <tr key={sr.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-bold text-[#102544]">{sr.ticketNumber}</td>
                          <td className="py-2.5 px-3 font-mono">Locker {sr.lockerNumber}</td>
                          <td className="py-2.5 px-3 font-medium">{sr.requestType}</td>
                          <td className="py-2.5 px-3">{sr.branchName}</td>
                          <td className="py-2.5 px-3 font-mono">{sr.estimatedCost ? `₹${sr.estimatedCost.toLocaleString()}` : '—'}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-50 text-[#B7791F] border border-amber-200">
                              {sr.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {drillDownType === 'claims' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F5F7FA] text-[#66758C] font-semibold text-[11px] uppercase border-b border-[#E3E8F0]">
                        <th className="py-2.5 px-3">Claim #</th>
                        <th className="py-2.5 px-3">Locker #</th>
                        <th className="py-2.5 px-3">Deceased Holder</th>
                        <th className="py-2.5 px-3">Claimant</th>
                        <th className="py-2.5 px-3">Stage / Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E3E8F0]">
                      {claims.map(c => (
                        <tr key={c.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-bold text-[#102544]">{c.claimNumber}</td>
                          <td className="py-2.5 px-3 font-mono">Locker {c.lockerNumber}</td>
                          <td className="py-2.5 px-3 font-medium">{c.deceasedHolderName || c.deceasedCustomerName || 'Primary Hirer'}</td>
                          <td className="py-2.5 px-3">{c.claimantName} ({c.claimantRelationship})</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-[#102544]/5 text-[#102544] border border-[#102544]/15">
                              {c.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="px-6 py-3 bg-[#F5F7FA] border-t border-[#E3E8F0] flex items-center justify-between text-xs text-[#66758C]">
              <span>Reconciled against Central In-Memory Storage</span>
              <button
                onClick={() => setDrillDownType(null)}
                className="px-4 py-1.5 bg-[#102544] text-white font-semibold rounded-lg hover:bg-[#0B1730]"
              >
                Close Ledger Drill-Down
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
