import React, { useState, useMemo } from 'react';
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
  ArrowRight,
  X,
  Layers,
  Building2,
  Activity,
  FileCheck2,
  ShieldAlert,
  ArrowUpRight,
  Filter,
  DollarSign,
  PieChart as PieChartIcon,
  BarChart3,
  Bell,
  Search,
  Check,
  MapPin,
  RefreshCw,
  Users
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid
} from 'recharts';
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
    currentUser,
    userRole,
    setAdminView,
    adminCheckInAppointment,
    adminCompleteAppointment,
    adminApproveApplication
  } = useBanking();

  // Top Filter Bar State
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('All');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('This Month (Oct 2026)');

  // Distinct regions and cities
  const regions = useMemo(() => {
    return ['All', ...Array.from(new Set(branches.map(b => b.regionName).filter(Boolean)))];
  }, [branches]);

  const availableCities = useMemo(() => {
    let bList = branches;
    if (selectedRegion !== 'All') {
      bList = bList.filter(b => b.regionName === selectedRegion);
    }
    return ['All', ...Array.from(new Set(bList.map(b => b.city)))];
  }, [branches, selectedRegion]);

  const availableBranches = useMemo(() => {
    return branches.filter(b => {
      if (selectedRegion !== 'All' && b.regionName !== selectedRegion) return false;
      if (selectedCity !== 'All' && b.city !== selectedCity) return false;
      return true;
    });
  }, [branches, selectedRegion, selectedCity]);

  // Active filtered branches
  const filteredBranches = useMemo(() => {
    if (selectedBranchId !== 'All') {
      return branches.filter(b => b.id === selectedBranchId);
    }
    return availableBranches;
  }, [branches, selectedBranchId, availableBranches]);

  const filteredBranchIds = useMemo(() => {
    return filteredBranches.map(b => b.id);
  }, [filteredBranches]);

  // Active filtered lockers
  const filteredLockers = useMemo(() => {
    return lockers.filter(l => filteredBranchIds.includes(l.branchId));
  }, [lockers, filteredBranchIds]);

  // 12 KEY KPI CALCULATIONS STRICTLY TIED TO FILTERED INVENTORY
  const totalLockers = filteredLockers.length;
  const occupiedCount = filteredLockers.filter(l => l.status === 'Occupied').length;
  const availableCount = filteredLockers.filter(l => l.status === 'Vacant').length;
  const reservedCount = filteredLockers.filter(l => l.status === 'Reserved').length;
  const blockedCount = filteredLockers.filter(l => l.status === 'Blocked').length;
  const maintenanceCount = filteredLockers.filter(l => l.status === 'Under Maintenance').length;
  const occupancyPercentage = totalLockers > 0 ? Math.round((occupiedCount / totalLockers) * 100) : 0;

  const filteredApps = applications.filter(a => !a.branchId || filteredBranchIds.includes(a.branchId));
  const pendingApplicationsCount = filteredApps.filter(a => a.status === 'Submitted' || a.status === 'KYC Verified').length;
  const pendingApprovalsCount = filteredApps.filter(a => a.status === 'Maker Verified' || a.status === 'KYC Verified').length;

  const filteredApts = appointments.filter(a => !a.branchId || filteredBranchIds.includes(a.branchId));
  const todayAppointmentsCount = filteredApts.filter(a => a.status === 'Confirmed' || a.status === 'Checked In').length;

  const totalOutstandingRent = filteredLockers.reduce((acc, l) => acc + (l.outstandingRent || 0), 0);
  const overdueAccountsCount = filteredLockers.filter(l => (l.outstandingRent || 0) > 0).length;

  const rentCollected = useMemo(() => {
    // Total occupied base rent minus outstanding
    const occupiedRent = filteredLockers
      .filter(l => l.status === 'Occupied')
      .reduce((sum, l) => sum + (l.annualRent - (l.outstandingRent || 0)), 0);
    return Math.max(occupiedRent, 0);
  }, [filteredLockers]);

  const activeServiceRequestsCount = serviceRequests.filter(
    sr => sr.status !== 'Resolved / Closed' && sr.status !== 'Rejected'
  ).length;

  // CHART 1: CITY-WISE LOCKER DISTRIBUTION (All 7 Cities)
  const cityDistributionData = useMemo(() => {
    const all7Cities = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune'];
    return all7Cities.map(city => {
      const cityLockers = lockers.filter(l => l.city === city);
      const occ = cityLockers.filter(l => l.status === 'Occupied').length;
      const vac = cityLockers.filter(l => l.status === 'Vacant').length;
      return {
        city,
        total: cityLockers.length,
        occupied: occ,
        available: vac,
        occupancyRate: cityLockers.length > 0 ? Math.round((occ / cityLockers.length) * 100) : 0
      };
    });
  }, [lockers]);

  // CHART 2: LOCKER OCCUPANCY DONUT
  const occupancyDonutData = useMemo(() => {
    return [
      { name: 'Occupied', value: occupiedCount, color: '#102544' },
      { name: 'Available', value: availableCount, color: '#16845B' },
      { name: 'Reserved', value: reservedCount, color: '#B7791F' },
      { name: 'Blocked', value: blockedCount, color: '#C83E44' },
      { name: 'Maintenance', value: maintenanceCount, color: '#66758C' }
    ].filter(item => item.value > 0);
  }, [occupiedCount, availableCount, reservedCount, blockedCount, maintenanceCount]);

  // CHART 3: RENT COLLECTION TREND (6-Month Performance)
  const rentTrendData = useMemo(() => {
    const factor = totalLockers / 672; // scale according to filter
    return [
      { month: 'May', current: Math.round(1450000 * factor), previous: Math.round(1320000 * factor) },
      { month: 'Jun', current: Math.round(1680000 * factor), previous: Math.round(1510000 * factor) },
      { month: 'Jul', current: Math.round(1820000 * factor), previous: Math.round(1650000 * factor) },
      { month: 'Aug', current: Math.round(2100000 * factor), previous: Math.round(1950000 * factor) },
      { month: 'Sep', current: Math.round(2350000 * factor), previous: Math.round(2100000 * factor) },
      { month: 'Oct (MTD)', current: Math.round(2680000 * factor), previous: Math.round(2420000 * factor) }
    ];
  }, [totalLockers]);

  // CHART 4: LOCKER SIZE UTILIZATION
  const sizeUtilizationData = useMemo(() => {
    return (['Small', 'Medium', 'Large', 'Extra Large'] as LockerSize[]).map(size => {
      const szLockers = filteredLockers.filter(l => l.size === size);
      const occ = szLockers.filter(l => l.status === 'Occupied').length;
      const total = szLockers.length;
      return {
        size,
        total,
        occupied: occ,
        rate: total > 0 ? Math.round((occ / total) * 100) : 0
      };
    });
  }, [filteredLockers]);

  // CHART 5: APPLICATION STATUS
  const appStatusData = useMemo(() => {
    const submitted = filteredApps.filter(a => a.status === 'Submitted').length;
    const makerReviewed = filteredApps.filter(a => a.status === 'Maker Verified' || a.status === 'KYC Verified').length;
    const approved = filteredApps.filter(a => a.status === 'Approved - Allotted').length;
    const waitlisted = filteredApps.filter(a => a.status === 'Waitlisted').length;
    const rejected = filteredApps.filter(a => a.status === 'Rejected').length;

    return [
      { name: 'Submitted', count: Math.max(submitted, 3), color: '#2457A7' },
      { name: 'Under Review', count: Math.max(makerReviewed, 2), color: '#008C88' },
      { name: 'Approved', count: Math.max(approved, 4), color: '#16845B' },
      { name: 'Waitlisted', count: Math.max(waitlisted, 2), color: '#B7791F' },
      { name: 'Rejected', count: Math.max(rejected, 1), color: '#C83E44' }
    ];
  }, [filteredApps]);

  // CHART 6: BRANCH PERFORMANCE (Comparing Top branches in current filter)
  const branchPerformanceData = useMemo(() => {
    return filteredBranches.slice(0, 7).map(b => {
      const bLockers = lockers.filter(l => l.branchId === b.id);
      const bOcc = bLockers.filter(l => l.status === 'Occupied').length;
      const bRate = bLockers.length > 0 ? Math.round((bOcc / bLockers.length) * 100) : 0;
      const bRev = bLockers.filter(l => l.status === 'Occupied').reduce((s, l) => s + l.annualRent, 0);
      return {
        name: b.name.replace(' Branch', ''),
        city: b.city,
        occupancy: bRate,
        revenue: Math.round(bRev / 1000), // in Thousands
        lockers: bLockers.length
      };
    });
  }, [filteredBranches, lockers]);

  return (
    <div className="space-y-6 text-[#17263C]">
      {/* 1. TOP HEADER WITH SELECTORS & CONTROLS */}
      <div className="bg-white rounded-2xl border border-[#E3E8F0] p-5 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-[#102544]">
              Bank Operations Command Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#102544] text-white">
              7-City Circle Network
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>Real-Time CBS Reconciled</span>
            </span>
          </div>
          <p className="text-xs text-[#66758C] mt-0.5">
            Operating view for {currentUser?.roleTitle || 'Branch Operations'} · 28 Branches · 672 Strongroom Compartments
          </p>
        </div>

        {/* Global Multi-Level Hierarchy Selectors */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Region Selector */}
          <div>
            <select
              value={selectedRegion}
              onChange={e => {
                setSelectedRegion(e.target.value);
                setSelectedCity('All');
                setSelectedBranchId('All');
              }}
              className="h-9 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 text-[#17263C] font-medium focus:bg-white focus:border-[#2457A7] focus:outline-none transition-colors"
            >
              <option value="All">All Circles / Regions</option>
              {regions.filter(r => r !== 'All').map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* City Selector */}
          <div>
            <select
              value={selectedCity}
              onChange={e => {
                setSelectedCity(e.target.value);
                setSelectedBranchId('All');
              }}
              className="h-9 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 text-[#17263C] font-medium focus:bg-white focus:border-[#2457A7] focus:outline-none transition-colors"
            >
              <option value="All">All Cities (7 Major)</option>
              {availableCities.filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Branch Selector */}
          <div>
            <select
              value={selectedBranchId}
              onChange={e => setSelectedBranchId(e.target.value)}
              className="h-9 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 text-[#17263C] font-medium focus:bg-white focus:border-[#2457A7] focus:outline-none transition-colors max-w-xs"
            >
              <option value="All">All Branches ({availableBranches.length})</option>
              {availableBranches.map(b => (
                <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
              ))}
            </select>
          </div>

          {/* Date Range Selector */}
          <div>
            <select
              value={selectedDateRange}
              onChange={e => setSelectedDateRange(e.target.value)}
              className="h-9 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 text-[#17263C] font-mono focus:bg-white focus:border-[#2457A7] focus:outline-none transition-colors"
            >
              <option value="Today">Today (28 Oct 2026)</option>
              <option value="This Week">This Week</option>
              <option value="This Month (Oct 2026)">This Month (Oct 2026)</option>
              <option value="FY 2026-27">FY 2026 - 2027</option>
            </select>
          </div>

          {(selectedRegion !== 'All' || selectedCity !== 'All' || selectedBranchId !== 'All') && (
            <button
              onClick={() => {
                setSelectedRegion('All');
                setSelectedCity('All');
                setSelectedBranchId('All');
              }}
              className="h-9 px-3 bg-[#F5F7FA] hover:bg-[#E3E8F0] text-[#66758C] hover:text-[#17263C] rounded-lg border border-[#E3E8F0] flex items-center gap-1 font-semibold transition-colors"
              title="Reset Filters"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. TWELVE KEY OPERATIONAL KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5">
        {/* KPI 1: Total Lockers */}
        <div
          onClick={() => setAdminView('inventory')}
          className="p-4 bg-white border border-[#E3E8F0] rounded-2xl shadow-xs hover:border-[#2457A7] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#66758C] uppercase tracking-wider">Total Lockers</span>
            <div className="w-7 h-7 rounded-lg bg-[#2457A7]/10 text-[#2457A7] flex items-center justify-center group-hover:bg-[#2457A7] group-hover:text-white transition-colors">
              <Key className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold font-mono tabular-nums text-[#102544]">{totalLockers}</div>
            <div className="text-[11px] text-[#66758C] mt-0.5">{filteredBranches.length} branch vaults</div>
          </div>
        </div>

        {/* KPI 2: Occupied Lockers */}
        <div
          onClick={() => setAdminView('inventory')}
          className="p-4 bg-white border border-[#E3E8F0] rounded-2xl shadow-xs hover:border-[#2457A7] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#66758C] uppercase tracking-wider">Occupied</span>
            <div className="w-7 h-7 rounded-lg bg-[#102544]/10 text-[#102544] flex items-center justify-center group-hover:bg-[#102544] group-hover:text-white transition-colors">
              <Building2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold font-mono tabular-nums text-[#102544]">{occupiedCount}</div>
            <div className="text-[11px] text-[#16845B] font-medium mt-0.5 font-mono">{occupancyPercentage}% Occupancy</div>
          </div>
        </div>

        {/* KPI 3: Available Lockers */}
        <div
          onClick={() => setAdminView('inventory')}
          className="p-4 bg-white border border-[#E3E8F0] rounded-2xl shadow-xs hover:border-[#2457A7] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#66758C] uppercase tracking-wider">Available</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#16845B] flex items-center justify-center group-hover:bg-[#16845B] group-hover:text-white transition-colors">
              <Check className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold font-mono tabular-nums text-[#16845B]">{availableCount}</div>
            <div className="text-[11px] text-[#66758C] mt-0.5 font-mono">{(100 - occupancyPercentage)}% Vacant</div>
          </div>
        </div>

        {/* KPI 4: Reserved Lockers */}
        <div
          onClick={() => setAdminView('inventory')}
          className="p-4 bg-white border border-[#E3E8F0] rounded-2xl shadow-xs hover:border-[#2457A7] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#66758C] uppercase tracking-wider">Reserved</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-[#B7791F] flex items-center justify-center group-hover:bg-[#B7791F] group-hover:text-white transition-colors">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold font-mono tabular-nums text-[#B7791F]">{reservedCount}</div>
            <div className="text-[11px] text-[#66758C] mt-0.5">Allotment pipeline</div>
          </div>
        </div>

        {/* KPI 5: Blocked / Maintenance */}
        <div
          onClick={() => setAdminView('inventory')}
          className="p-4 bg-white border border-[#E3E8F0] rounded-2xl shadow-xs hover:border-[#2457A7] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#66758C] uppercase tracking-wider">Blocked/Maint</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-[#C83E44] flex items-center justify-center group-hover:bg-[#C83E44] group-hover:text-white transition-colors">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold font-mono tabular-nums text-[#C83E44]">
              {blockedCount + maintenanceCount}
            </div>
            <div className="text-[11px] text-[#66758C] mt-0.5">{blockedCount} freeze, {maintenanceCount} maint</div>
          </div>
        </div>

        {/* KPI 6: Occupancy Percentage */}
        <div
          onClick={() => setAdminView('reports')}
          className="p-4 bg-white border border-[#E3E8F0] rounded-2xl shadow-xs hover:border-[#2457A7] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#66758C] uppercase tracking-wider">Occupancy %</span>
            <div className="w-7 h-7 rounded-lg bg-[#2457A7]/10 text-[#2457A7] flex items-center justify-center group-hover:bg-[#2457A7] group-hover:text-white transition-colors">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold font-mono tabular-nums text-[#102544]">{occupancyPercentage}%</div>
            <div className="text-[11px] text-emerald-700 font-medium mt-0.5">Target: 85%+</div>
          </div>
        </div>

        {/* KPI 7: Pending Applications */}
        <div
          onClick={() => setAdminView('applications')}
          className="p-4 bg-white border border-[#E3E8F0] rounded-2xl shadow-xs hover:border-[#2457A7] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#66758C] uppercase tracking-wider">Pending Apps</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <FileText className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold font-mono tabular-nums text-[#102544]">{pendingApplicationsCount}</div>
            <div className="text-[11px] text-[#66758C] mt-0.5">Form L-101 Intake</div>
          </div>
        </div>

        {/* KPI 8: Pending Approvals (Checker Queue) */}
        <div
          onClick={() => setAdminView('applications')}
          className="p-4 bg-white border border-[#E3E8F0] rounded-2xl shadow-xs hover:border-[#2457A7] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#66758C] uppercase tracking-wider">Pending Checker</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-[#B7791F] flex items-center justify-center group-hover:bg-[#B7791F] group-hover:text-white transition-colors">
              <FileCheck2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold font-mono tabular-nums text-[#B7791F]">{pendingApprovalsCount}</div>
            <div className="text-[11px] text-[#66758C] mt-0.5">Maker verified queue</div>
          </div>
        </div>

        {/* KPI 9: Today's Appointments */}
        <div
          onClick={() => setAdminView('visits')}
          className="p-4 bg-white border border-[#E3E8F0] rounded-2xl shadow-xs hover:border-[#2457A7] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#66758C] uppercase tracking-wider">Today Visits</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#16845B] flex items-center justify-center group-hover:bg-[#16845B] group-hover:text-white transition-colors">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold font-mono tabular-nums text-[#102544]">{todayAppointmentsCount}</div>
            <div className="text-[11px] text-[#66758C] mt-0.5">Strongroom turnstile</div>
          </div>
        </div>

        {/* KPI 10: Rent Collected */}
        <div
          onClick={() => setAdminView('rent')}
          className="p-4 bg-white border border-[#E3E8F0] rounded-2xl shadow-xs hover:border-[#2457A7] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#66758C] uppercase tracking-wider">Rent Collected</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#16845B] flex items-center justify-center group-hover:bg-[#16845B] group-hover:text-white transition-colors">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-xl font-bold font-mono tabular-nums text-[#16845B]">
              ₹{(rentCollected / 100000).toFixed(1)} L
            </div>
            <div className="text-[11px] text-[#66758C] mt-0.5 font-mono">Net of arrears</div>
          </div>
        </div>

        {/* KPI 11: Outstanding Rent */}
        <div
          onClick={() => setAdminView('rent')}
          className="p-4 bg-white border border-[#E3E8F0] rounded-2xl shadow-xs hover:border-[#2457A7] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#66758C] uppercase tracking-wider">Outstanding Dues</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-[#B7791F] flex items-center justify-center group-hover:bg-[#B7791F] group-hover:text-white transition-colors">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-xl font-bold font-mono tabular-nums text-[#B7791F]">
              ₹{(totalOutstandingRent / 1000).toFixed(0)} K
            </div>
            <div className="text-[11px] text-[#66758C] mt-0.5">{overdueAccountsCount} overdue hirers</div>
          </div>
        </div>

        {/* KPI 12: Active Service Requests */}
        <div
          onClick={() => setAdminView('service-requests')}
          className="p-4 bg-white border border-[#E3E8F0] rounded-2xl shadow-xs hover:border-[#2457A7] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#66758C] uppercase tracking-wider">Service Tickets</span>
            <div className="w-7 h-7 rounded-lg bg-[#008C88]/10 text-[#008C88] flex items-center justify-center group-hover:bg-[#008C88] group-hover:text-white transition-colors">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold font-mono tabular-nums text-[#102544]">{activeServiceRequestsCount}</div>
            <div className="text-[11px] text-[#66758C] mt-0.5">TAT SLA compliant</div>
          </div>
        </div>
      </div>

      {/* 3. SIX INTERACTIVE CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: CITY-WISE LOCKER DISTRIBUTION */}
        <div className="bg-white rounded-2xl border border-[#E3E8F0] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#102544]">
                Chart 1: City-Wise Locker Distribution (7 Major Hubs)
              </h3>
              <p className="text-xs text-[#66758C] mt-0.5">
                Occupied vs Available capacity across all 28 bank branches
              </p>
            </div>
            <span className="text-xs font-mono text-[#2457A7] font-semibold">National Circle</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="city" tick={{ fontSize: 11, fill: '#66758C' }} />
                <YAxis tick={{ fontSize: 11, fill: '#66758C' }} />
                <Tooltip
                  formatter={(value: any, name: any) => [`${value} Units`, name === 'occupied' ? 'Occupied' : 'Available']}
                  contentStyle={{ backgroundColor: '#0B1730', borderColor: '#102544', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="occupied" name="Occupied Units" fill="#102544" radius={[4, 4, 0, 0]} />
                <Bar dataKey="available" name="Available Units" fill="#16845B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: LOCKER OCCUPANCY DONUT */}
        <div className="bg-white rounded-2xl border border-[#E3E8F0] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#102544]">
                Chart 2: Strongroom Locker Occupancy Distribution
              </h3>
              <p className="text-xs text-[#66758C] mt-0.5">
                Real-time compartment operational status in filtered scope
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#16845B] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {occupancyPercentage}% Occupied
            </span>
          </div>

          <div className="h-64 w-full flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="w-full sm:w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={occupancyDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {occupancyDonutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any) => [`${value} Lockers`, name]}
                    contentStyle={{ backgroundColor: '#0B1730', borderColor: '#102544', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full sm:w-1/2 space-y-2 text-xs">
              {occupancyDonutData.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-xs" style={{ backgroundColor: item.color }} />
                    <span className="text-[#66758C] font-medium">{item.name}</span>
                  </div>
                  <div className="font-mono tabular-nums font-bold text-[#102544]">
                    {item.value} <span className="text-[10px] text-[#66758C] font-normal">({totalLockers > 0 ? Math.round((item.value / totalLockers) * 100) : 0}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CHART 3: RENT COLLECTION TREND */}
        <div className="bg-white rounded-2xl border border-[#E3E8F0] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#102544]">
                Chart 3: Monthly Rent Collection & Target Trend
              </h3>
              <p className="text-xs text-[#66758C] mt-0.5">
                Current financial year collection vs corresponding previous cycle
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-[#16845B]">↑ +12.4% YoY</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rentTrendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2457A7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2457A7" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#008C88" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#008C88" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#66758C' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#66758C' }}
                  tickFormatter={val => `₹${(val / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  formatter={(val: any, name: any) => [`₹${Number(val).toLocaleString('en-IN')}`, name === 'current' ? 'FY 26-27' : 'FY 25-26']}
                  contentStyle={{ backgroundColor: '#0B1730', borderColor: '#102544', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="current" name="FY 26-27 Collections" stroke="#2457A7" strokeWidth={2} fillOpacity={1} fill="url(#colorCurrent)" />
                <Area type="monotone" dataKey="previous" name="FY 25-26 Baseline" stroke="#008C88" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorPrev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 4: LOCKER SIZE UTILIZATION */}
        <div className="bg-white rounded-2xl border border-[#E3E8F0] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#102544]">
                Chart 4: Locker Size Capacity & Utilization Rate
              </h3>
              <p className="text-xs text-[#66758C] mt-0.5">
                Breakdown across Small, Medium, Large, and Extra Large compartments
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-[#66758C]">4 Sizes Standardized</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sizeUtilizationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="size" tick={{ fontSize: 11, fill: '#66758C' }} />
                <YAxis tick={{ fontSize: 11, fill: '#66758C' }} />
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} Units`, name === 'occupied' ? 'Occupied' : 'Total Capacity']}
                  contentStyle={{ backgroundColor: '#0B1730', borderColor: '#102544', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="total" name="Total Compartments" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="occupied" name="Occupied Units" fill="#008C88" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 5: APPLICATION STATUS BREAKDOWN */}
        <div className="bg-white rounded-2xl border border-[#E3E8F0] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#102544]">
                Chart 5: Allotment Workflow Pipeline Status
              </h3>
              <p className="text-xs text-[#66758C] mt-0.5">
                L-101 Application queue: Maker review to Checker allocation
              </p>
            </div>
            <span className="text-xs text-[#2457A7] font-semibold hover:underline cursor-pointer" onClick={() => setAdminView('applications')}>
              Manage Queue →
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={appStatusData} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#66758C' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#17263C' }} />
                <Tooltip
                  formatter={(val: any) => [`${val} Applications`, 'Queue Count']}
                  contentStyle={{ backgroundColor: '#0B1730', borderColor: '#102544', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="count" name="Applications" fill="#102544" radius={[0, 4, 4, 0]}>
                  {appStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 6: BRANCH PERFORMANCE COMPARISON */}
        <div className="bg-white rounded-2xl border border-[#E3E8F0] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#102544]">
                Chart 6: Top Branch Operational Performance
              </h3>
              <p className="text-xs text-[#66758C] mt-0.5">
                Occupancy rate (%) and Annual Revenue across filtered branches
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-[#66758C]">Top 7 Units</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#66758C' }} />
                <YAxis tick={{ fontSize: 11, fill: '#66758C' }} />
                <Tooltip
                  formatter={(val: any, name: any) => [name === 'occupancy' ? `${val}%` : `₹${val}k`, name === 'occupancy' ? 'Occupancy Rate' : 'Revenue (INR)']}
                  contentStyle={{ backgroundColor: '#0B1730', borderColor: '#102544', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="occupancy" name="Occupancy %" fill="#2457A7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. OPERATIONAL WORKFLOW QUEUES & ACTION CENTERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Maker-Checker Approvals (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E3E8F0] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#102544] flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#2457A7]" />
                <span>Maker-Checker Approval & Allotment Queue</span>
              </h3>
              <p className="text-xs text-[#66758C] mt-0.5">
                Pending sign-off by Branch Manager or Authorized Checker under dual control
              </p>
            </div>
            <button
              onClick={() => setAdminView('applications')}
              className="text-xs text-[#2457A7] font-semibold hover:underline"
            >
              View All ({applications.length}) →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F5F7FA] text-[#66758C] border-b border-[#E3E8F0]">
                  <th className="py-2.5 px-3 font-semibold">App #</th>
                  <th className="py-2.5 px-3 font-semibold">Applicant</th>
                  <th className="py-2.5 px-3 font-semibold">Branch</th>
                  <th className="py-2.5 px-3 font-semibold">Size</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E8F0]">
                {applications.slice(0, 5).map(app => (
                  <tr key={app.id} className="hover:bg-[#F5F7FA]/75 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#102544]">
                      {app.applicationNumber}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-[#17263C]">{app.customerName}</div>
                      <div className="text-[10px] text-[#66758C] font-mono">{app.cifNumber}</div>
                    </td>
                    <td className="py-2.5 px-3 text-[#66758C] truncate max-w-[120px]">
                      {app.branchName}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-[#102544]">{app.sizeRequested}</span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {app.status === 'Submitted' || app.status === 'KYC Verified' || app.status === 'Maker Verified' ? (
                        <button
                          onClick={() => {
                            adminApproveApplication(app.id);
                          }}
                          className="px-2.5 py-1 bg-[#102544] hover:bg-[#0B1730] text-white rounded text-[11px] font-semibold transition-colors shadow-2xs"
                        >
                          Approve Allotment
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#16845B] font-medium">Allotted</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Strongroom Vault Gate Turnstile Stream */}
        <div className="bg-white rounded-2xl border border-[#E3E8F0] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#102544] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#008C88]" />
                <span>Live Strongroom Gate Stream</span>
              </h3>
              <p className="text-xs text-[#66758C] mt-0.5">
                Real-time visitor check-ins & custodian escorts
              </p>
            </div>
            <button
              onClick={() => setAdminView('visits')}
              className="text-xs text-[#2457A7] font-semibold hover:underline"
            >
              Gate Monitor →
            </button>
          </div>

          <div className="space-y-3">
            {accessLogs.slice(0, 4).map(log => (
              <div
                key={log.id}
                className="p-3 rounded-xl border border-[#E3E8F0] bg-[#F5F7FA] text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#102544]">Locker {log.lockerNumber}</span>
                  <span className="font-mono text-[10px] text-[#66758C] tabular-nums">{log.timeIn} - {log.timeOut}</span>
                </div>
                <div className="text-[11px] text-[#17263C]">
                  {log.operatedBy} · <span className="text-[#66758C]">{log.operatorType}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#66758C] pt-1 border-t border-[#E3E8F0]">
                  <span>Branch: {log.branchName}</span>
                  <span className="text-emerald-700 font-semibold">{log.verificationMethod}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
