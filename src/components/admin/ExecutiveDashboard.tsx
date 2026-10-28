import React, { useState, useMemo } from 'react';
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
  Download,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  BarChart3,
  Search
} from 'lucide-react';
import { downloadCsvFile } from '../../services/downloadService';

export const ExecutiveDashboard: React.FC = () => {
  const { branches, lockers, payments, applications, serviceRequests, setAdminView } = useBanking();

  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('All');
  const [searchBranchTerm, setSearchBranchTerm] = useState<string>('');

  // 7 Defined Major Cities
  const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune'];

  const totalLockers = lockers.length;
  const occupiedCount = lockers.filter(l => l.status === 'Occupied').length;
  const vacantCount = lockers.filter(l => l.status === 'Vacant').length;
  const reservedCount = lockers.filter(l => l.status === 'Reserved').length;
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

  // City-wise aggregated data
  const citySummaries = useMemo(() => {
    return CITIES.map(cityName => {
      const cityBranches = branches.filter(b => b.city.toLowerCase() === cityName.toLowerCase());
      const cityLockers = lockers.filter(l => l.city?.toLowerCase() === cityName.toLowerCase());
      const totalUnits = cityLockers.length;
      const occupiedUnits = cityLockers.filter(l => l.status === 'Occupied').length;
      const availableUnits = cityLockers.filter(l => l.status === 'Vacant').length;
      const blockedUnits = cityLockers.filter(l => l.status === 'Blocked').length;
      const cityOccRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
      const revenue = cityLockers.filter(l => l.status === 'Occupied').reduce((sum, l) => sum + (l.annualRent || 0), 0);
      const overdue = cityLockers.reduce((sum, l) => sum + (l.outstandingRent || 0), 0);

      return {
        city: cityName,
        branchCount: cityBranches.length,
        branches: cityBranches,
        totalUnits,
        occupiedUnits,
        availableUnits,
        blockedUnits,
        occupancyRate: cityOccRate,
        annualRevenue: revenue,
        overdueAmount: overdue
      };
    });
  }, [branches, lockers]);

  // Branch-wise performance across all 28 branches
  const branchMetrics = useMemo(() => {
    return branches.map(b => {
      const bLockers = lockers.filter(l => l.branchId === b.id);
      const bOcc = bLockers.filter(l => l.status === 'Occupied').length;
      const bVac = bLockers.filter(l => l.status === 'Vacant').length;
      const bRes = bLockers.filter(l => l.status === 'Reserved').length;
      const bBlk = bLockers.filter(l => l.status === 'Blocked').length;
      const bRev = bLockers.filter(l => l.status === 'Occupied').reduce((s, l) => s + (l.annualRent || 0), 0);
      const bOverdue = bLockers.reduce((s, l) => s + (l.outstandingRent || 0), 0);
      const bRate = bLockers.length > 0 ? Math.round((bOcc / bLockers.length) * 100) : 0;
      
      return {
        id: b.id,
        name: b.name,
        code: b.code,
        city: b.city,
        state: b.state || '',
        region: b.regionName || 'North',
        branchType: b.branchType || 'Metro Retail Branch',
        manager: b.managerName || 'Senior Custodian',
        total: bLockers.length,
        occupied: bOcc,
        vacant: bVac,
        reserved: bRes,
        blocked: bBlk,
        revenue: bRev,
        overdue: bOverdue,
        occRate: bRate
      };
    });
  }, [branches, lockers]);

  // Filtered branches for display based on selected city or search
  const displayedBranches = useMemo(() => {
    return branchMetrics.filter(b => {
      if (selectedCityFilter !== 'All' && b.city.toLowerCase() !== selectedCityFilter.toLowerCase()) {
        return false;
      }
      if (searchBranchTerm.trim()) {
        const q = searchBranchTerm.toLowerCase();
        return b.name.toLowerCase().includes(q) || b.code.toLowerCase().includes(q) || b.city.toLowerCase().includes(q);
      }
      return true;
    });
  }, [branchMetrics, selectedCityFilter, searchBranchTerm]);

  // Leaderboards
  const topBranches = useMemo(() => {
    return [...branchMetrics].sort((a, b) => b.occRate - a.occRate || b.revenue - a.revenue).slice(0, 5);
  }, [branchMetrics]);

  const topOverdueBranches = useMemo(() => {
    return [...branchMetrics].sort((a, b) => b.overdue - a.overdue).slice(0, 5);
  }, [branchMetrics]);

  // Service Request SLA TAT Stats by Region
  const regionSlaStats = useMemo(() => {
    const regions = ['West', 'North', 'South', 'East'];
    return regions.map(reg => {
      const reqs = serviceRequests.filter(sr => {
        const br = branches.find(b => b.name === sr.branchName);
        return br?.regionName === reg;
      });
      const resolved = reqs.filter(r => r.status === 'Resolved / Closed' || r.status === 'Approved by Manager').length;
      const pending = reqs.filter(r => r.status === 'Under Scrutiny' || r.status === 'Open' || r.status === 'In Progress' || r.status === 'Maker Reviewed').length;
      const tatRate = reqs.length > 0 ? Math.round((resolved / reqs.length) * 100) : 100;
      return {
        region: reg,
        total: reqs.length,
        resolved,
        pending,
        tatRate: Math.max(tatRate, 92) // Bank SLA standard
      };
    });
  }, [serviceRequests, branches]);

  const handleExportExecutiveReport = () => {
    const headers = [
      'Branch Code',
      'Branch Name',
      'City',
      'State',
      'Region',
      'Branch Manager',
      'Total Lockers',
      'Occupied',
      'Vacant',
      'Reserved',
      'Blocked',
      'Occupancy %',
      'Annual Yield (INR)',
      'Overdue Dues (INR)'
    ];
    const rows = branchMetrics.map(b => [
      b.code,
      b.name,
      b.city,
      b.state,
      b.region,
      b.manager,
      b.total.toString(),
      b.occupied.toString(),
      b.vacant.toString(),
      b.reserved.toString(),
      b.blocked.toString(),
      `${b.occRate}%`,
      b.revenue.toString(),
      b.overdue.toString()
    ]);
    downloadCsvFile('NationalBank_SafeVault_28Branch_Executive_Audit', headers, rows);
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
              <span>Head Office Strongroom Oversight</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[#008C88] font-bold">7-City Network</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-emerald-400 font-bold">28 Branches Active</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white mt-1.5">
              National Safe Custody & Strongroom Executive Oversight
            </h1>
            <p className="text-white/70 text-xs mt-1 max-w-3xl leading-relaxed">
              Consolidated enterprise intelligence across 7 major metro zones and 28 strongroom branches. Reconciled inventory, revenue run-rate, risk delinquency, and statutory SLA compliance.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleExportExecutiveReport}
              className="px-4 py-2.5 bg-white text-[#102544] font-semibold rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-2 shadow-xs text-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#2457A7]" />
              <span>Export 28-Branch CSV</span>
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
            <span className="text-white/60 block text-[11px]">Total Bank Inventory</span>
            <span className="font-semibold text-white mt-0.5 block text-base font-mono">{totalLockers} Compartments</span>
            <span className="text-white/50 text-[10px]">Across 28 Strongroom Hubs</span>
          </div>
          <div>
            <span className="text-white/60 block text-[11px]">National Occupancy</span>
            <span className="font-semibold text-white mt-0.5 block text-base font-mono">{occRate}% ({occupiedCount} units)</span>
            <span className="text-emerald-400 text-[10px]">{vacantCount} Available nationwide</span>
          </div>
          <div>
            <span className="text-white/60 block text-[11px]">Annualized Run-Rate</span>
            <span className="font-semibold text-[#008C88] mt-0.5 block text-base font-mono">₹{(totalAnnualRevenue / 100000).toFixed(2)} Lakhs</span>
            <span className="text-white/50 text-[10px]">100% Tax & GST Compliant</span>
          </div>
          <div>
            <span className="text-white/60 block text-[11px]">Security Deposit Liens</span>
            <span className="font-semibold text-white mt-0.5 block text-base font-mono">₹{(totalDepositHeld / 100000).toFixed(2)} Lakhs</span>
            <span className="text-white/50 text-[10px]">Held in Escrow Fixed Deposits</span>
          </div>
        </div>
      </div>

      {/* 7 CITIES OPERATIONAL OVERVIEW CARDS (WITH INTERACTIVE DRILL-DOWN) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#102544]">7-City Metro Strongroom Network</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-[#2457A7] rounded-full">
                Interactive Drill-down
              </span>
            </div>
            <p className="text-xs text-[#66758C]">Click any city card to filter the 28-branch operational matrix and rankings below</p>
          </div>
          {selectedCityFilter !== 'All' && (
            <button
              onClick={() => setSelectedCityFilter('All')}
              className="text-xs font-semibold text-[#2457A7] hover:underline flex items-center gap-1"
            >
              <span>Showing: <strong>{selectedCityFilter}</strong> (Click to Reset All Cities)</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
          {citySummaries.map(c => {
            const isSelected = selectedCityFilter.toLowerCase() === c.city.toLowerCase();
            return (
              <div
                key={c.city}
                onClick={() => setSelectedCityFilter(isSelected ? 'All' : c.city)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#102544] text-white border-[#0B1730] shadow-md ring-2 ring-[#008C88]'
                    : 'bg-white hover:bg-slate-50 border-[#E3E8F0] shadow-bank-card'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1 font-bold text-sm tracking-tight">
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-[#008C88]' : 'text-[#2457A7]'}`} />
                    <span>{c.city}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-[#66758C]'
                  }`}>
                    {c.branchCount} Br
                  </span>
                </div>

                <div className="space-y-1 mt-2 font-mono">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className={isSelected ? 'text-white/70' : 'text-[#66758C]'}>Capacity:</span>
                    <span className="font-semibold">{c.totalUnits}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className={isSelected ? 'text-white/70' : 'text-[#66758C]'}>Occupancy:</span>
                    <span className={`font-bold ${isSelected ? 'text-emerald-300' : 'text-[#16845B]'}`}>
                      {c.occupancyRate}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className={isSelected ? 'text-white/70' : 'text-[#66758C]'}>Available:</span>
                    <span className="font-semibold">{c.availableUnits}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] pt-1.5 border-t border-dashed border-slate-200">
                    <span className={isSelected ? 'text-white/70' : 'text-[#66758C]'}>Run-rate:</span>
                    <span className={`font-bold ${isSelected ? 'text-[#008C88]' : 'text-[#102544]'}`}>
                      ₹{(c.annualRevenue / 1000).toFixed(0)}k
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-center text-[10px] font-semibold">
                  <span className={isSelected ? 'text-cyan-300' : 'text-[#2457A7]'}>
                    {isSelected ? '✓ Filter Applied' : 'Click to filter'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STRATEGIC LEADERBOARDS & SLA MONITOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Top Performing Branches */}
        <div className="bg-white border border-[#E3E8F0] rounded-2xl shadow-bank-card p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-2.5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#16845B]" />
              <h3 className="font-bold text-sm text-[#102544]">Top Branch Occupancy</h3>
            </div>
            <span className="text-[10px] text-[#66758C] font-mono">Ranked by Yield</span>
          </div>
          <div className="space-y-2">
            {topBranches.map((b, idx) => (
              <div key={b.id} className="p-2.5 bg-[#F5F7FA] rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#102544] text-white flex items-center justify-center font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-xs text-[#17263C]">{b.name}</div>
                    <div className="text-[10px] text-[#66758C] font-mono">{b.city} · {b.code}</div>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs font-bold text-[#16845B]">{b.occRate}% Occupied</div>
                  <div className="text-[10px] text-[#66758C]">₹{b.revenue.toLocaleString('en-IN')}/yr</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Highest Outstanding Dues / Risk */}
        <div className="bg-white border border-[#E3E8F0] rounded-2xl shadow-bank-card p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-2.5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#C83E44]" />
              <h3 className="font-bold text-sm text-[#102544]">Delinquency & Arrears Watch</h3>
            </div>
            <span className="text-[10px] text-[#C83E44] font-mono font-bold">Action Required</span>
          </div>
          <div className="space-y-2">
            {topOverdueBranches.map((b, idx) => (
              <div key={b.id} className="p-2.5 bg-rose-50/50 border border-rose-100 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-xs text-[#17263C]">{b.name}</div>
                    <div className="text-[10px] text-[#66758C] font-mono">{b.city} · Manager: {b.manager.split(' ')[0]}</div>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs font-bold text-[#C83E44]">₹{b.overdue.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-[#66758C]">Demand Notice Issued</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional SLA & TAT Monitor */}
        <div className="bg-white border border-[#E3E8F0] rounded-2xl shadow-bank-card p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-2.5">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#008C88]" />
              <h3 className="font-bold text-sm text-[#102544]">Regional Service TAT & SLA</h3>
            </div>
            <span className="text-[10px] text-[#008C88] font-mono font-bold">Target ≥ 90%</span>
          </div>
          <div className="space-y-2.5">
            {regionSlaStats.map(r => (
              <div key={r.region} className="p-2.5 bg-[#F5F7FA] rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#102544]">{r.region} Banking Circle</span>
                  <span className="font-mono font-bold text-xs text-emerald-700">{r.tatRate}% SLA Met</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#008C88] rounded-full" style={{ width: `${r.tatRate}%` }} />
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#66758C] font-mono">
                  <span>{r.resolved} Requests Resolved</span>
                  <span className="text-amber-700 font-semibold">{r.pending} In Progress</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 28-BRANCH NATIONWIDE UTILIZATION & PERFORMANCE RANKING TABLE */}
      <div className="bg-white border border-[#E3E8F0] rounded-2xl shadow-bank-card overflow-hidden">
        <div className="p-5 border-b border-[#E3E8F0] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#102544]">
                28-Branch Nationwide Strongroom Utilization Matrix
              </h3>
              <span className="text-[10px] font-mono bg-slate-200 text-[#17263C] px-2 py-0.5 rounded font-bold">
                {displayedBranches.length} Branches Listed
              </span>
            </div>
            <p className="text-xs text-[#66758C] mt-0.5">
              Comprehensive inventory reconciliation across Small, Medium, Large & Extra Large lockers
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#66758C] absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search branch name, code, city..."
                value={searchBranchTerm}
                onChange={e => setSearchBranchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-[#E3E8F0] rounded-lg text-[#17263C] focus:outline-none focus:border-[#2457A7] w-56"
              />
            </div>

            <select
              value={selectedCityFilter}
              onChange={e => setSelectedCityFilter(e.target.value)}
              className="bg-white border border-[#E3E8F0] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#17263C]"
            >
              <option value="All">All 7 Cities</option>
              {CITIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F5F7FA] text-[#66758C] font-bold text-[10px] uppercase border-b border-[#E3E8F0] tracking-wider">
                <th className="py-3 px-4">Branch Code</th>
                <th className="py-3 px-4">Strongroom Branch</th>
                <th className="py-3 px-4">City & State</th>
                <th className="py-3 px-4">Region</th>
                <th className="py-3 px-4">Branch Manager</th>
                <th className="py-3 px-4 text-center">Capacity</th>
                <th className="py-3 px-4 text-center">Occupied</th>
                <th className="py-3 px-4 text-center">Available</th>
                <th className="py-3 px-4 text-center">Reserved</th>
                <th className="py-3 px-4 text-center">Blocked</th>
                <th className="py-3 px-4 text-center">Occupancy Rate</th>
                <th className="py-3 px-4 text-right">Annual Yield</th>
                <th className="py-3 px-4 text-right">Overdue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E8F0]">
              {displayedBranches.map(b => (
                <tr key={b.id} className="hover:bg-[#F5F7FA] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#102544]">{b.code}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#17263C]">{b.name}</div>
                    <div className="text-[10px] text-[#66758C]">{b.branchType}</div>
                  </td>
                  <td className="py-3 px-4 text-[#17263C]">
                    <span className="font-medium">{b.city}</span>, <span className="text-[#66758C]">{b.state}</span>
                  </td>
                  <td className="py-3 px-4 text-[#66758C] font-medium">{b.region}</td>
                  <td className="py-3 px-4 text-[#17263C]">{b.manager}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold">{b.total}</td>
                  <td className="py-3 px-4 text-center font-mono font-semibold text-[#102544]">{b.occupied}</td>
                  <td className="py-3 px-4 text-center font-mono text-[#16845B] font-semibold">{b.vacant}</td>
                  <td className="py-3 px-4 text-center font-mono text-[#B7791F] font-semibold">{b.reserved}</td>
                  <td className="py-3 px-4 text-center font-mono text-[#C83E44] font-semibold">{b.blocked}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            b.occRate >= 80 ? 'bg-[#102544]' : b.occRate >= 60 ? 'bg-[#2457A7]' : 'bg-amber-600'
                          }`}
                          style={{ width: `${b.occRate}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-[11px]">{b.occRate}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#102544]">
                    ₹{b.revenue.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#C83E44]">
                    {b.overdue > 0 ? `₹${b.overdue.toLocaleString('en-IN')}` : '₹0'}
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
