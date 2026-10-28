import React, { useState, useMemo } from 'react';
import { useBanking } from '../../context/BankingContext';
import { LockerItem, LockerSize, LockerStatus } from '../../types';
import { downloadDocumentFile } from '../../services/downloadService';
import {
  Grid,
  List,
  Search,
  Filter,
  Key,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Wrench,
  CheckCircle2,
  X,
  FileText,
  Calendar,
  CreditCard,
  Lock,
  Unlock,
  AlertTriangle,
  ArrowRight,
  Eye,
  Building,
  User,
  Info
} from 'lucide-react';

export const InventoryManagement: React.FC = () => {
  const {
    branches,
    lockers,
    adminUpdateLockerStatus,
    restrictLockerAccess,
    unrestrictLockerAccess,
    setAdminView,
    serviceRequests,
    accessLogs
  } = useBanking();

  // Hierarchy Selection: Region -> City -> Branch -> Vault
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('br-del-01');
  const [selectedVaultRoom, setSelectedVaultRoom] = useState<string>('Vault Room A (Main Strongroom)');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedTier, setSelectedTier] = useState<string>('All');

  // Slide-out Drawer for Selected Locker
  const [selectedLocker, setSelectedLocker] = useState<LockerItem | null>(null);
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  const currentBranch = branches.find(b => b.id === selectedBranchId) || branches[0];

  // Distinct regions from branches
  const regions = useMemo(() => {
    const set = new Set<string>();
    branches.forEach(b => {
      if (b.regionName) set.add(b.regionName);
    });
    return Array.from(set);
  }, [branches]);

  // Filtered branches by region
  const filteredBranches = useMemo(() => {
    if (selectedRegion === 'All') return branches;
    return branches.filter(b => b.regionName === selectedRegion);
  }, [branches, selectedRegion]);

  // Filtered lockers for currently selected branch & criteria
  const filteredLockers = useMemo(() => {
    return lockers.filter(l => {
      if (l.branchId !== selectedBranchId) return false;
      if (selectedSize !== 'All' && l.size !== selectedSize) return false;
      if (selectedStatus !== 'All' && l.status !== selectedStatus) return false;
      if (selectedTier !== 'All' && l.tier !== selectedTier) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNum = l.lockerNumber.toLowerCase().includes(q);
        const matchCust = l.customerId?.toLowerCase().includes(q);
        if (!matchNum && !matchCust) return false;
      }
      return true;
    });
  }, [lockers, selectedBranchId, selectedSize, selectedStatus, selectedTier, searchQuery]);

  // Group by Tier for graphical display
  const lockersByTier = useMemo(() => {
    const tiers: Record<string, LockerItem[]> = {
      'Upper Tier': [],
      'Eye Level': [],
      'Lower Tier': []
    };
    filteredLockers.forEach(l => {
      const tierKey = l.tier || 'Eye Level';
      if (!tiers[tierKey]) tiers[tierKey] = [];
      tiers[tierKey].push(l);
    });
    return tiers;
  }, [filteredLockers]);

  // Branch statistics
  const branchAllLockers = lockers.filter(l => l.branchId === selectedBranchId);
  const totalCount = branchAllLockers.length;
  const availCount = branchAllLockers.filter(l => l.status === 'Vacant').length;
  const occCount = branchAllLockers.filter(l => l.status === 'Occupied').length;
  const resCount = branchAllLockers.filter(l => l.status === 'Reserved').length;
  const blockCount = branchAllLockers.filter(l => l.status === 'Blocked').length;
  const maintCount = branchAllLockers.filter(l => l.status === 'Under Maintenance').length;

  // Selected locker specific audit & service requests
  const relatedTickets = useMemo(() => {
    if (!selectedLocker) return [];
    return serviceRequests.filter(s => s.lockerNumber === selectedLocker.lockerNumber);
  }, [selectedLocker, serviceRequests]);

  const relatedAccessLogs = useMemo(() => {
    if (!selectedLocker) return [];
    return accessLogs.filter(a => a.lockerNumber === selectedLocker.lockerNumber);
  }, [selectedLocker, accessLogs]);

  const handleStatusUpdate = (status: LockerStatus) => {
    if (!selectedLocker) return;
    adminUpdateLockerStatus(selectedLocker.id, status);
    setSelectedLocker(prev => prev ? { ...prev, status } : null);
    setActionSuccessNotice(`Compartment ${selectedLocker.lockerNumber} status set to ${status}.`);
    setTimeout(() => setActionSuccessNotice(null), 4000);
  };

  const handleToggleFreeze = () => {
    if (!selectedLocker) return;
    if (selectedLocker.status === 'Blocked') {
      unrestrictLockerAccess(selectedLocker.id);
      setSelectedLocker(prev => prev ? { ...prev, status: 'Occupied' } : null);
      setActionSuccessNotice(`Security freeze removed for Locker ${selectedLocker.lockerNumber}.`);
    } else {
      restrictLockerAccess(selectedLocker.id, 'Custodian administrative freeze applied.');
      setSelectedLocker(prev => prev ? { ...prev, status: 'Blocked' } : null);
      setActionSuccessNotice(`Security freeze applied for Locker ${selectedLocker.lockerNumber}.`);
    }
    setTimeout(() => setActionSuccessNotice(null), 4000);
  };

  const getStatusColor = (status: LockerStatus) => {
    switch (status) {
      case 'Vacant':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-300',
          badgeBg: 'bg-emerald-600',
          text: 'text-emerald-800',
          dot: 'bg-emerald-500',
          label: 'Available'
        };
      case 'Occupied':
        return {
          bg: 'bg-[#102544]/5',
          border: 'border-[#102544]/30',
          badgeBg: 'bg-[#102544]',
          text: 'text-[#102544]',
          dot: 'bg-[#102544]',
          label: 'Occupied'
        };
      case 'Reserved':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-300',
          badgeBg: 'bg-amber-600',
          text: 'text-amber-800',
          dot: 'bg-amber-500',
          label: 'Reserved'
        };
      case 'Blocked':
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-300',
          badgeBg: 'bg-rose-600',
          text: 'text-rose-800',
          dot: 'bg-rose-500',
          label: 'Blocked'
        };
      case 'Under Maintenance':
      default:
        return {
          bg: 'bg-[#F5F7FA]',
          border: 'border-[#E3E8F0]',
          badgeBg: 'bg-[#66758C]',
          text: 'text-[#66758C]',
          dot: 'bg-[#66758C]',
          label: 'Maintenance'
        };
    }
  };

  return (
    <div className="space-y-5 text-xs text-[#17263C] relative">
      
      {/* Breadcrumb Hierarchy Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#E3E8F0]">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-[#66758C] font-mono mb-1">
            <span>Region: {currentBranch.regionName || 'North'}</span>
            <span aria-hidden="true">/</span>
            <span>City: {currentBranch.city}</span>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-[#102544]">{currentBranch.name} ({currentBranch.code})</span>
            <span aria-hidden="true">/</span>
            <span className="text-[#008C88] font-bold">{selectedVaultRoom}</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#17263C]">
            Graphical Bank Vault Inventory & Compartment Matrix
          </h1>
          <p className="text-xs text-[#66758C] mt-0.5">
            Interactive strongroom grid benchmarking SysArc SAFE. Real-time availability, key register, and transaction drawer.
          </p>
        </div>

        {/* View Mode Toggle: Grid vs Table */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-md font-semibold text-xs flex items-center gap-1.5 transition-colors ${
                viewMode === 'grid' ? 'bg-[#102544] text-white shadow-xs' : 'text-[#66758C] hover:text-[#17263C]'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Vault Grid</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md font-semibold text-xs flex items-center gap-1.5 transition-colors ${
                viewMode === 'table' ? 'bg-[#102544] text-white shadow-xs' : 'text-[#66758C] hover:text-[#17263C]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Dense Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Operational Hierarchy Bar */}
      <div className="p-3.5 bg-white border border-[#E3E8F0] rounded-xl shadow-bank-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="block text-[10px] uppercase font-bold text-[#66758C] mb-1">1. Region</label>
          <select
            value={selectedRegion}
            onChange={e => setSelectedRegion(e.target.value)}
            className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#17263C] focus:bg-white focus:outline-none focus:border-[#2457A7]"
          >
            <option value="All">All Bank Regions</option>
            {regions.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-[#66758C] mb-1">2. Strongroom Branch</label>
          <select
            value={selectedBranchId}
            onChange={e => setSelectedBranchId(e.target.value)}
            className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#17263C] focus:bg-white focus:outline-none focus:border-[#2457A7]"
          >
            {filteredBranches.map(b => (
              <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-[#66758C] mb-1">3. Vault Chamber</label>
          <select
            value={selectedVaultRoom}
            onChange={e => setSelectedVaultRoom(e.target.value)}
            className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#17263C] focus:bg-white focus:outline-none focus:border-[#2457A7]"
          >
            <option value="Vault Room A (Main Strongroom)">Vault Room A (Main Strongroom)</option>
            <option value="Vault Room B (High Security Annex)">Vault Room B (High Security Annex)</option>
            <option value="Sub-Level 1 Safe Custody Vault">Sub-Level 1 Safe Custody Vault</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-[#66758C] mb-1">Search Locker # / CIF</label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#66758C] absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="e.g. A-125, CIF-9028..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg text-[#17263C] focus:bg-white focus:outline-none focus:border-[#2457A7]"
            />
          </div>
        </div>
      </div>

      {/* Real-time Status Legend & Capacity Counters */}
      <div className="p-3.5 bg-white border border-[#E3E8F0] rounded-xl shadow-bank-card flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-600" />
            <span>Available ({availCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#102544]" />
            <span>Occupied ({occCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-600" />
            <span>Reserved ({resCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-600" />
            <span>Blocked ({blockCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-500" />
            <span>Under Maintenance ({maintCount})</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedSize}
            onChange={e => setSelectedSize(e.target.value)}
            className="bg-[#F5F7FA] border border-[#E3E8F0] rounded-md px-2.5 py-1 text-xs text-[#17263C] font-semibold"
          >
            <option value="All">All Sizes</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
            <option value="Extra Large">Extra Large</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="bg-[#F5F7FA] border border-[#E3E8F0] rounded-md px-2.5 py-1 text-xs text-[#17263C] font-semibold"
          >
            <option value="All">All Statuses</option>
            <option value="Vacant">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Reserved">Reserved</option>
            <option value="Blocked">Blocked</option>
            <option value="Under Maintenance">Maintenance</option>
          </select>

          <select
            value={selectedTier}
            onChange={e => setSelectedTier(e.target.value)}
            className="bg-[#F5F7FA] border border-[#E3E8F0] rounded-md px-2.5 py-1 text-xs text-[#17263C] font-semibold"
          >
            <option value="All">All Tiers</option>
            <option value="Upper Tier">Upper Tier</option>
            <option value="Eye Level">Eye Level</option>
            <option value="Lower Tier">Lower Tier</option>
          </select>
        </div>
      </div>

      {actionSuccessNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[#16845B] text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#16845B]" />
            <span>{actionSuccessNotice}</span>
          </div>
          <button onClick={() => setActionSuccessNotice(null)} className="text-xs hover:underline">Dismiss</button>
        </div>
      )}

      {/* Main Vault Workspace */}
      {viewMode === 'grid' ? (
        <div className="space-y-6">
          {Object.entries(lockersByTier).map(([tierName, tierLockers]) => (
            <div key={tierName} className="bg-white border border-[#E3E8F0] rounded-2xl p-5 shadow-bank-card space-y-3">
              <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#102544] text-xs uppercase tracking-wider">{tierName} Compartments</span>
                  <span className="text-[#66758C] text-[11px] font-mono">({tierLockers.length} units)</span>
                </div>
                <span className="text-[10px] text-[#66758C]">Click compartment to view transaction details</span>
              </div>

              {tierLockers.length === 0 ? (
                <div className="py-6 text-center text-[#66758C]">
                  No compartments matching active filter criteria in this tier.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                  {tierLockers.map(lkr => {
                    const statusInfo = getStatusColor(lkr.status);
                    const isSelected = selectedLocker?.id === lkr.id;

                    return (
                      <div
                        key={lkr.id}
                        onClick={() => setSelectedLocker(lkr)}
                        className={`relative rounded-xl border p-3 cursor-pointer transition-all flex flex-col justify-between select-none ${
                          statusInfo.bg
                        } ${
                          isSelected
                            ? 'ring-2 ring-[#2457A7] border-[#2457A7] shadow-md scale-[1.02]'
                            : `${statusInfo.border} hover:shadow-md hover:scale-[1.01]`
                        }`}
                        title={`Locker #${lkr.lockerNumber} (${lkr.size}) - ${statusInfo.label}`}
                      >
                        {/* Top indicator & size */}
                        <div className="flex items-center justify-between">
                          <span className={`w-2 h-2 rounded-full ${statusInfo.dot}`} />
                          <span className="text-[10px] font-mono font-bold text-[#66758C] uppercase">
                            {lkr.size.substring(0, 2)}
                          </span>
                        </div>

                        {/* Locker Number & Visual Keyhole Graphic */}
                        <div className="my-2.5 text-center space-y-1">
                          <div className="font-mono font-extrabold text-[#102544] text-sm tracking-tight">
                            #{lkr.lockerNumber}
                          </div>
                          {/* Dual Master & Hirer Keyholes Graphic */}
                          <div className="flex items-center justify-center gap-1.5 opacity-60">
                            <div className="w-1.5 h-3 bg-slate-400 rounded-xs" title="Bank Master Key" />
                            <div className="w-1.5 h-3 bg-slate-500 rounded-xs" title="Hirer Key" />
                          </div>
                        </div>

                        {/* Bottom Status & Rent */}
                        <div className="pt-2 border-t border-[#E3E8F0] flex items-center justify-between text-[10px]">
                          <span className={`font-semibold ${statusInfo.text}`}>
                            {statusInfo.label}
                          </span>
                          <span className="font-mono tabular-nums text-[#66758C]">
                            ₹{(lkr.annualRent / 1000).toFixed(1)}k
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Compact Operations Table View */
        <div className="bg-white border border-[#E3E8F0] rounded-xl overflow-hidden shadow-bank-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F5F7FA] text-[#66758C] border-b border-[#E3E8F0] text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Locker #</th>
                  <th className="py-2.5 px-3">Size & Dimensions</th>
                  <th className="py-2.5 px-3">Tier / Level</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Assigned Hirer</th>
                  <th className="py-2.5 px-3 text-right">Annual Rent</th>
                  <th className="py-2.5 px-3 text-right">Security Deposit</th>
                  <th className="py-2.5 px-3">Next Renewal</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E8F0]">
                {filteredLockers.map(lkr => {
                  const statusInfo = getStatusColor(lkr.status);
                  const isSelected = selectedLocker?.id === lkr.id;

                  return (
                    <tr
                      key={lkr.id}
                      onClick={() => setSelectedLocker(lkr)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-indigo-50/70 font-semibold' : 'hover:bg-[#F5F7FA]'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-[#102544]">
                        Locker #{lkr.lockerNumber}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-[#17263C]">{lkr.size}</span>
                        <span className="text-[10px] font-mono text-[#66758C] block">{lkr.dimensions}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span>{lkr.tier}</span>
                        <span className="text-[10px] text-[#66758C] block">{lkr.floor}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${statusInfo.bg} ${statusInfo.text} border ${statusInfo.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        {lkr.customerId ? (
                          <div>
                            <span className="font-semibold text-[#17263C]">Rahul Sharma</span>
                            <span className="text-[10px] font-mono text-[#66758C] block">CIF-9028192831</span>
                          </div>
                        ) : (
                          <span className="text-[#66758C] italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#102544]">
                        ₹{lkr.annualRent.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#66758C]">
                        ₹{lkr.securityDeposit.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[#66758C]">
                        {lkr.nextRenewalDate || '—'}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLocker(lkr);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-[#2457A7] bg-white border border-[#E3E8F0] hover:bg-slate-50 rounded-md shadow-2xs"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slide-out Transaction Side Drawer benchmarking SysArc SAFE */}
      {selectedLocker && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-[#0B1730]/50 backdrop-blur-xs flex justify-end animate-in fade-in">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl border-l border-[#E3E8F0] flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-[#E3E8F0] bg-[#102544] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#008C88] font-mono font-bold text-sm">
                  #{selectedLocker.lockerNumber}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <span>Locker Compartment #{selectedLocker.lockerNumber}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#008C88] text-white">
                      {selectedLocker.size}
                    </span>
                  </h3>
                  <p className="text-white/70 text-xs mt-0.5">
                    {selectedLocker.branchName} · {selectedLocker.floor} ({selectedLocker.tier})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedLocker(null)}
                className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              
              {/* Status & Quick Control Strip */}
              <div className="p-4 bg-[#F5F7FA] border border-[#E3E8F0] rounded-xl flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-[#66758C] uppercase block">Current Operational Status</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-2.5 h-2.5 rounded-full ${getStatusColor(selectedLocker.status).dot}`} />
                    <span className="font-bold text-sm text-[#102544]">{selectedLocker.status}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleFreeze}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      selectedLocker.status === 'Blocked'
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-rose-50 hover:bg-rose-100 text-[#C83E44] border border-rose-200'
                    }`}
                  >
                    {selectedLocker.status === 'Blocked' ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    <span>{selectedLocker.status === 'Blocked' ? 'Lift Freeze' : 'Security Freeze'}</span>
                  </button>
                </div>
              </div>

              {/* Physical Specifications */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#66758C]">
                  Physical & Custody Specifications
                </h4>
                <div className="grid grid-cols-2 gap-3 p-3.5 bg-white border border-[#E3E8F0] rounded-xl text-xs">
                  <div>
                    <span className="text-[#66758C] text-[10px] block">Compartment Dimensions</span>
                    <strong className="font-mono text-[#102544]">{selectedLocker.dimensions}</strong>
                  </div>
                  <div>
                    <span className="text-[#66758C] text-[10px] block">Manufacturer Key Serial</span>
                    <strong className="font-mono text-[#102544]">KEY-ANB-{selectedLocker.lockerNumber}-A</strong>
                  </div>
                  <div>
                    <span className="text-[#66758C] text-[10px] block">Vault Sub-Room</span>
                    <span className="font-medium text-[#17263C]">Strongroom Level 1, Bay 4</span>
                  </div>
                  <div>
                    <span className="text-[#66758C] text-[10px] block">Dual Key Mechanism</span>
                    <span className="font-medium text-emerald-700">Master #1 + Hirer #2</span>
                  </div>
                </div>
              </div>

              {/* Financial & Tariff Details */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#66758C]">
                  Financials & Security Deposit
                </h4>
                <div className="grid grid-cols-3 gap-3 p-3.5 bg-white border border-[#E3E8F0] rounded-xl text-xs">
                  <div>
                    <span className="text-[#66758C] text-[10px] block">Annual Rent</span>
                    <strong className="font-mono text-[#102544] text-sm">₹{selectedLocker.annualRent.toLocaleString('en-IN')}</strong>
                  </div>
                  <div>
                    <span className="text-[#66758C] text-[10px] block">GST Rate</span>
                    <strong className="font-mono text-[#102544]">18% (₹{Math.round(selectedLocker.annualRent * 0.18)})</strong>
                  </div>
                  <div>
                    <span className="text-[#66758C] text-[10px] block">FD Security Lien</span>
                    <strong className="font-mono text-[#16845B]">₹{selectedLocker.securityDeposit.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>

              {/* Hirer & Allotment Information */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#66758C]">
                  Hirer & Mandate Information
                </h4>
                {selectedLocker.customerId ? (
                  <div className="p-3.5 bg-white border border-[#E3E8F0] rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-sm text-[#102544]">Rahul Sharma</span>
                        <span className="text-[#66758C] font-mono text-xs block">CIF-9028192831</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-[#2457A7] border border-indigo-200">
                        {selectedLocker.operatingMode || 'Either or Survivor'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E3E8F0] text-[11px] text-[#66758C]">
                      <div>
                        <span>Allotment Date:</span> <strong className="text-[#102544]">{selectedLocker.allotmentDate || '12 Oct 2024'}</strong>
                      </div>
                      <div>
                        <span>Next Renewal Due:</span> <strong className="text-[#102544]">{selectedLocker.nextRenewalDate || '22 Oct 2027'}</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl text-center space-y-2">
                    <CheckCircle2 className="w-5 h-5 text-[#16845B] mx-auto" />
                    <p className="font-semibold text-emerald-950">Compartment Vacant & Ready for Allotment</p>
                    <button
                      onClick={() => {
                        setAdminView('applications');
                        setSelectedLocker(null);
                      }}
                      className="px-4 py-2 bg-[#102544] text-white font-semibold rounded-lg text-xs hover:bg-[#0B1730] shadow-xs"
                    >
                      Assign to Pending Applicant →
                    </button>
                  </div>
                )}
              </div>

              {/* Related Service Requests & Maintenance */}
              {relatedTickets.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#66758C]">
                    Active Work Orders & Maintenance ({relatedTickets.length})
                  </h4>
                  <div className="space-y-2">
                    {relatedTickets.map(t => (
                      <div key={t.id} className="p-3 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg flex items-center justify-between">
                        <div>
                          <strong className="text-[#102544]">{t.requestType}</strong>
                          <span className="text-[10px] font-mono text-[#66758C] block">{t.ticketNumber}</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          {t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Override Control for Custodian */}
              <div className="space-y-2 pt-2 border-t border-[#E3E8F0]">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#66758C]">
                  Administrative Status Override
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {(['Vacant', 'Occupied', 'Reserved', 'Blocked', 'Under Maintenance'] as LockerStatus[]).map(st => (
                    <button
                      key={st}
                      onClick={() => handleStatusUpdate(st)}
                      className={`p-2 rounded-lg text-xs font-semibold border transition-colors ${
                        selectedLocker.status === st
                          ? 'bg-[#102544] text-white border-[#102544]'
                          : 'bg-white text-[#17263C] border-[#E3E8F0] hover:bg-[#F5F7FA]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-[#F5F7FA] border-t border-[#E3E8F0] flex items-center justify-between">
              <span className="text-[#66758C] font-mono text-[11px]">
                Audit Hash: SHA-256-{selectedLocker.lockerNumber}
              </span>
              <button
                onClick={() => setSelectedLocker(null)}
                className="px-4 py-2 bg-[#102544] text-white font-semibold rounded-lg hover:bg-[#0B1730]"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
