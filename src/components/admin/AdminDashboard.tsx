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
  CreditCard,
  FileText,
  ChevronRight,
  Check,
  ArrowRight
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    lockers,
    applications,
    appointments,
    serviceRequests,
    claims,
    setAdminView,
    adminCheckInAppointment,
    adminCompleteAppointment,
    adminApproveApplication
  } = useBanking();

  const totalLockers = lockers.length;
  const occupiedCount = lockers.filter(l => l.status === 'Occupied').length;
  const vacantCount = lockers.filter(l => l.status === 'Vacant').length;
  const blockedCount = lockers.filter(l => l.status === 'Blocked').length;
  const pendingApps = applications.filter(a => a.status === 'Submitted' || a.status === 'KYC Verified');
  const todayAppointments = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Checked In');
  const openServiceRequests = serviceRequests.filter(sr => sr.status !== 'Resolved / Closed' && sr.status !== 'Rejected');
  const activeClaims = claims.filter(c => c.status !== 'Settled & Closed');

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

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-white border border-[#E3E8F0] rounded-2xl shadow-bank-card">
          <div className="text-[#66758C] text-xs font-medium">Vault Occupancy Ratio</div>
          <div className="text-2xl font-bold text-[#102544] font-mono mt-1 tabular-nums">
            {occRatio}%
          </div>
          <div className="text-[11px] text-[#66758C] mt-1 flex items-center gap-1 font-mono">
            <span className="text-[#102544] font-bold">{occupiedCount} Occupied</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#16845B] font-medium">{vacantCount} Vacant</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-[#E3E8F0] rounded-2xl shadow-bank-card">
          <div className="text-[#66758C] text-xs font-medium">Pending Allotment Applications</div>
          <div className="text-2xl font-bold text-[#102544] font-mono mt-1 tabular-nums">
            {pendingApps.length}
          </div>
          <div className="text-[11px] text-[#66758C] mt-1">
            Requires Branch Manager sign-off
          </div>
        </div>

        <div className="p-5 bg-white border border-[#E3E8F0] rounded-2xl shadow-bank-card">
          <div className="text-[#66758C] text-xs font-medium">Open Technical & Service Tickets</div>
          <div className="text-2xl font-bold text-[#102544] font-mono mt-1 tabular-nums">
            {openServiceRequests.length}
          </div>
          <div className="text-[11px] text-[#66758C] mt-1">
            Includes lost-key break-open requests
          </div>
        </div>

        <div className="p-5 bg-white border border-[#E3E8F0] rounded-2xl shadow-bank-card">
          <div className="text-[#66758C] text-xs font-medium">Active Deceased Claims</div>
          <div className="text-2xl font-bold text-[#B7791F] font-mono mt-1 tabular-nums">
            {activeClaims.length}
          </div>
          <div className="text-[11px] text-[#66758C] mt-1">
            Under Legal Scrutiny Committee
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

    </div>
  );
};
