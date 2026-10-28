import React from 'react';
import { useBanking } from '../../context/BankingContext';
import {
  TrendingUp,
  Building,
  Key,
  ShieldCheck,
  CreditCard,
  Users,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  Layers,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { downloadCsvFile } from '../../services/downloadService';

export const ExecutiveDashboard: React.FC = () => {
  const { branches, lockers, payments, applications, serviceRequests, setAdminView } = useBanking();

  const totalLockers = lockers.length;
  const occupiedCount = lockers.filter(l => l.status === 'Occupied').length;
  const vacantCount = lockers.filter(l => l.status === 'Vacant').length;
  const blockedCount = lockers.filter(l => l.status === 'Blocked').length;
  const occRate = Math.round((occupiedCount / (totalLockers || 1)) * 100);

  const totalAnnualRevenue = lockers
    .filter(l => l.status === 'Occupied')
    .reduce((sum, l) => sum + (l.annualRent || 0), 0);

  const totalDepositHeld = lockers
    .filter(l => l.status === 'Occupied')
    .reduce((sum, l) => sum + (l.securityDeposit || 0), 0);

  const overdueCount = lockers.filter(l => (l.outstandingRent || 0) > 0).length;
  const totalOverdueAmount = lockers.reduce((sum, l) => sum + (l.outstandingRent || 0), 0);

  // Branch-wise performance
  const branchMetrics = branches.map(b => {
    const bLockers = lockers.filter(l => l.branchId === b.id);
    const bOcc = bLockers.filter(l => l.status === 'Occupied').length;
    const bVac = bLockers.filter(l => l.status === 'Vacant').length;
    const bRev = bLockers.filter(l => l.status === 'Occupied').reduce((s, l) => s + l.annualRent, 0);
    const bRate = Math.round((bOcc / (bLockers.length || 1)) * 100);
    return {
      id: b.id,
      name: b.name,
      code: b.code,
      city: b.city,
      region: b.regionName || 'North',
      total: bLockers.length,
      occupied: bOcc,
      vacant: bVac,
      revenue: bRev,
      occRate: bRate
    };
  });

  const handleExportExecutiveReport = () => {
    const headers = ['Branch Code', 'Branch Name', 'City', 'Region', 'Total Units', 'Occupied Units', 'Vacant Units', 'Occupancy %', 'Annual Revenue (INR)'];
    const rows = branchMetrics.map(b => [
      b.code,
      b.name,
      b.city,
      b.region,
      b.total.toString(),
      b.occupied.toString(),
      b.vacant.toString(),
      `${b.occRate}%`,
      b.revenue.toString()
    ]);
    downloadCsvFile('NationalBank_SafeVault_Executive_Report', headers, rows);
  };

  return (
    <div className="space-y-6 text-xs text-[#17263C]">
      
      {/* Executive Command Header */}
      <div className="bg-[#102544] text-white rounded-2xl p-6 shadow-md border border-[#0B1730]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-white/70 text-xs font-medium">
              <span>National Bank Executive Directorate</span>
              <span aria-hidden="true">·</span>
              <span>Safe Custody & Locker Asset Oversight</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[#008C88] font-bold">FY 2026-27</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white mt-1.5">
              Executive Strongroom Portfolio & Yield Dashboard
            </h1>
            <p className="text-white/70 text-xs mt-1 max-w-2xl leading-relaxed">
              Strategic multi-branch network capacity, rental yield performance, compliance governance, and statutory risk indicators.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleExportExecutiveReport}
              className="px-4 py-2.5 bg-white text-[#102544] font-semibold rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-2 shadow-xs text-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#2457A7]" />
              <span>Export Executive MIS</span>
            </button>
            <button
              onClick={() => setAdminView('admin-dashboard')}
              className="px-4 py-2.5 bg-[#008C88] hover:bg-[#008C88]/90 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-xs text-xs"
            >
              <Building className="w-3.5 h-3.5" />
              <span>Branch Operations View →</span>
            </button>
          </div>
        </div>

        {/* Executive Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-5 text-xs text-white/80">
          <div>
            <span className="text-white/60 block text-[11px]">Network Capacity</span>
            <span className="font-semibold text-white mt-0.5 block text-sm font-mono">{totalLockers} Compartments</span>
          </div>
          <div>
            <span className="text-white/60 block text-[11px]">Network Occupancy</span>
            <span className="font-semibold text-white mt-0.5 block text-sm font-mono">{occRate}% ({occupiedCount} units)</span>
          </div>
          <div>
            <span className="text-white/60 block text-[11px]">Annualized Run-Rate</span>
            <span className="font-semibold text-[#008C88] mt-0.5 block text-sm font-mono">₹{(totalAnnualRevenue / 100000).toFixed(2)} Lakhs</span>
          </div>
          <div>
            <span className="text-white/60 block text-[11px]">Security Deposit Lien</span>
            <span className="font-semibold text-white mt-0.5 block text-sm font-mono">₹{(totalDepositHeld / 100000).toFixed(2)} Lakhs</span>
          </div>
        </div>
      </div>

      {/* Strategic KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-white border border-[#E3E8F0] rounded-2xl shadow-bank-card space-y-2">
          <span className="text-[#66758C] text-xs font-medium">Network Occupancy</span>
          <div className="text-2xl font-bold font-mono text-[#102544] tabular-nums">{occRate}%</div>
          <div className="text-[11px] text-[#66758C] flex items-center justify-between pt-1 border-t border-[#E3E8F0]">
            <span>{occupiedCount} Occupied</span>
            <span className="text-[#16845B] font-semibold">{vacantCount} Available</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-[#E3E8F0] rounded-2xl shadow-bank-card space-y-2">
          <span className="text-[#66758C] text-xs font-medium">Rental Revenue Yield</span>
          <div className="text-2xl font-bold font-mono text-[#16845B] tabular-nums">
            ₹{totalAnnualRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#66758C] flex items-center justify-between pt-1 border-t border-[#E3E8F0]">
            <span>Active Leases</span>
            <span className="text-[#2457A7] font-semibold">100% Tax Compliant</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-[#E3E8F0] rounded-2xl shadow-bank-card space-y-2">
          <span className="text-[#66758C] text-xs font-medium">Delinquent Arrears Risk</span>
          <div className="text-2xl font-bold font-mono text-[#C83E44] tabular-nums">
            ₹{totalOverdueAmount.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#66758C] flex items-center justify-between pt-1 border-t border-[#E3E8F0]">
            <span>{overdueCount} Accounts Overdue</span>
            <span className="text-[#B7791F] font-semibold">Statutory Notices Active</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-[#E3E8F0] rounded-2xl shadow-bank-card space-y-2">
          <span className="text-[#66758C] text-xs font-medium">Allotment Pipeline</span>
          <div className="text-2xl font-bold font-mono text-[#102544] tabular-nums">
            {applications.length}
          </div>
          <div className="text-[11px] text-[#66758C] flex items-center justify-between pt-1 border-t border-[#E3E8F0]">
            <span>Pending Scrutiny</span>
            <span className="text-[#008C88] font-semibold">SLA: 24 Hours</span>
          </div>
        </div>
      </div>

      {/* Branch Network Performance Table */}
      <div className="bg-white border border-[#E3E8F0] rounded-2xl shadow-bank-card overflow-hidden">
        <div className="p-5 border-b border-[#E3E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-[#102544]">Branch Strongroom Performance & Capacity Matrix</h3>
            <p className="text-xs text-[#66758C] mt-0.5">Real-time asset deployment across nationwide vault centers</p>
          </div>
          <span className="text-xs text-[#66758C] font-mono">
            {branches.length} Active Strongroom Hubs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F5F7FA] text-[#66758C] font-bold text-[10px] uppercase border-b border-[#E3E8F0] tracking-wider">
                <th className="py-3 px-4">Branch Code</th>
                <th className="py-3 px-4">Strongroom Center</th>
                <th className="py-3 px-4">City / Region</th>
                <th className="py-3 px-4 text-center">Total Capacity</th>
                <th className="py-3 px-4 text-center">Occupied</th>
                <th className="py-3 px-4 text-center">Available</th>
                <th className="py-3 px-4 text-center">Occupancy Rate</th>
                <th className="py-3 px-4 text-right">Annualized Yield</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E8F0]">
              {branchMetrics.map(b => (
                <tr key={b.id} className="hover:bg-[#F5F7FA] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#102544]">{b.code}</td>
                  <td className="py-3 px-4 font-semibold text-[#17263C]">{b.name}</td>
                  <td className="py-3 px-4 text-[#66758C]">{b.city} ({b.region})</td>
                  <td className="py-3 px-4 text-center font-mono">{b.total}</td>
                  <td className="py-3 px-4 text-center font-mono font-semibold text-[#102544]">{b.occupied}</td>
                  <td className="py-3 px-4 text-center font-mono text-[#16845B] font-semibold">{b.vacant}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#102544] rounded-full" style={{ width: `${b.occRate}%` }} />
                      </div>
                      <span className="font-mono font-bold text-[11px]">{b.occRate}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#102544]">
                    ₹{b.revenue.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
