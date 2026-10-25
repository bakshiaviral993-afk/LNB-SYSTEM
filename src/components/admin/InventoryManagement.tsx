import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { StatusBadge } from '../common/StatusBadge';
import { LockerItem, LockerSize, LockerStatus } from '../../types';
import {
  Layers,
  Search,
  Filter,
  Key,
  Building,
  CheckCircle2,
  Wrench,
  AlertTriangle,
  Lock,
  Edit
} from 'lucide-react';

export const InventoryManagement: React.FC = () => {
  const { branches, lockers, adminUpdateLockerStatus } = useBanking();

  const [selectedBranchId, setSelectedBranchId] = useState<string>('br-del-01');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeLockerModal, setActiveLockerModal] = useState<LockerItem | null>(null);

  const currentBranch = branches.find(b => b.id === selectedBranchId) || branches[0];

  const branchLockers = lockers.filter(l => {
    if (l.branchId !== selectedBranchId) return false;
    if (selectedSize !== 'All' && l.size !== selectedSize) return false;
    if (selectedStatus !== 'All' && l.status !== selectedStatus) return false;
    return true;
  });

  const handleStatusChange = (newStatus: LockerStatus) => {
    if (activeLockerModal) {
      adminUpdateLockerStatus(activeLockerModal.id, newStatus);
      setActiveLockerModal({ ...activeLockerModal, status: newStatus });
    }
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* Title & Branch Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E3E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#17263C]">
              Strongroom Compartment Inventory Management
            </h1>
            <span className="text-[10px] font-bold text-[#2457A7] bg-[#2457A7]/10 border border-[#2457A7]/20 px-2 py-0.5 rounded tracking-wide uppercase">
              Custody Registry
            </span>
          </div>
          <p className="text-[#66758C] text-xs mt-1">
            Physical vault tier configuration, size allocations, key register, and compartment maintenance statuses
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[#66758C] font-semibold text-xs">Active Vault Branch:</label>
          <select
            value={selectedBranchId}
            onChange={e => setSelectedBranchId(e.target.value)}
            className="bg-white border border-[#E3E8F0] rounded-lg px-3 py-1.5 font-mono text-xs font-semibold text-[#17263C] shadow-xs focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
          >
            {branches.map(b => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Branch Capacity & Stats */}
      <div className="p-4 bg-white border border-[#E3E8F0] rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-4 shadow-bank-card">
        <div>
          <span className="text-[#66758C] block text-[10px] uppercase font-bold tracking-wider">Total Vault Units</span>
          <span className="font-mono font-bold text-[#102544] text-xl tabular-nums">{currentBranch.totalLockers}</span>
        </div>
        <div>
          <span className="text-[#66758C] block text-[10px] uppercase font-bold tracking-wider">Available Units</span>
          <span className="font-mono font-bold text-[#16845B] text-xl tabular-nums">{currentBranch.availableLockers}</span>
        </div>
        <div>
          <span className="text-[#66758C] block text-[10px] uppercase font-bold tracking-wider">Vault Custodian</span>
          <span className="font-semibold text-[#17263C] text-xs truncate block mt-1">{currentBranch.custodianName}</span>
        </div>
        <div>
          <span className="text-[#66758C] block text-[10px] uppercase font-bold tracking-wider">Operating Hours</span>
          <span className="text-[#17263C] text-xs font-mono tabular-nums mt-1 block">{currentBranch.operatingHours.split('|')[0]}</span>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="p-3.5 bg-white border border-[#E3E8F0] rounded-xl shadow-bank-card flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#66758C] mb-1">Filter Size</label>
            <select
              value={selectedSize}
              onChange={e => setSelectedSize(e.target.value)}
              className="bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 py-1.5 text-[#17263C] font-semibold text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
            >
              <option value="All">All Compartment Sizes</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
              <option value="Extra Large">Extra Large</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#66758C] mb-1">Filter Status</label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 py-1.5 text-[#17263C] font-semibold text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
            >
              <option value="All">All Operational States</option>
              <option value="Occupied">Occupied</option>
              <option value="Vacant">Vacant</option>
              <option value="Reserved">Reserved</option>
              <option value="Blocked">Blocked</option>
              <option value="Under Maintenance">Under Maintenance</option>
            </select>
          </div>
        </div>

        <span className="text-[#66758C] font-mono text-xs">
          Showing <strong className="text-[#17263C]">{branchLockers.length}</strong> compartments
        </span>
      </div>

      {/* Compartments Inventory Table */}
      <div className="bg-white border border-[#E3E8F0] rounded-xl overflow-hidden shadow-bank-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F7FA] text-[#66758C] border-b border-[#E3E8F0] text-[10px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Locker #</th>
                <th className="py-3 px-4">Size & Dimensions</th>
                <th className="py-3 px-4">Floor & Tier</th>
                <th className="py-3 px-4">Assigned Customer</th>
                <th className="py-3 px-4 text-right">Annual Rent</th>
                <th className="py-3 px-4 text-right">FD Security Held</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E8F0] text-xs">
              {branchLockers.map(lkr => (
                <tr key={lkr.id} className="hover:bg-[#F5F7FA]/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#17263C] text-xs">
                    Safe {lkr.lockerNumber}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#17263C]">{lkr.size}</span>
                    <span className="text-[10px] font-mono text-[#66758C] block">{lkr.dimensions}</span>
                  </td>
                  <td className="py-3 px-4 text-[#17263C]">
                    <div>{lkr.tier}</div>
                    <div className="text-[10px] text-[#66758C]">{lkr.floor}</div>
                  </td>
                  <td className="py-3 px-4">
                    {lkr.customerId ? (
                      <div>
                        <span className="font-semibold text-[#17263C]">Rahul Sharma</span>
                        <span className="text-[10px] text-[#66758C] font-mono block tabular-nums">Allotted: {lkr.allotmentDate}</span>
                      </div>
                    ) : (
                      <span className="text-[#66758C] font-medium italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-medium text-[#17263C] tabular-nums">
                    ₹{lkr.annualRent.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-[#66758C] tabular-nums">
                    ₹{lkr.securityDeposit.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <StatusBadge status={lkr.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setActiveLockerModal(lkr)}
                      className="px-2.5 py-1 text-[#17263C] bg-[#F5F7FA] hover:bg-[#E3E8F0] border border-[#E3E8F0] rounded font-semibold text-xs transition-colors"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Locker Management Modal */}
      {activeLockerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1730]/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-[#E3E8F0] max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-[#E3E8F0] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-base text-[#17263C]">
                    Safe {activeLockerModal.lockerNumber}
                  </span>
                  <StatusBadge status={activeLockerModal.status} />
                </div>
                <span className="text-[#66758C] text-xs">
                  {activeLockerModal.branchName} · {activeLockerModal.size}
                </span>
              </div>
              <button
                onClick={() => setActiveLockerModal(null)}
                className="text-[#66758C] hover:text-[#17263C] p-1.5 rounded-md hover:bg-[#F5F7FA]"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#F5F7FA] rounded-lg border border-[#E3E8F0] text-xs">
              <div>
                <span className="text-[#66758C] text-[10px] uppercase block font-medium">Compartment Key #</span>
                <span className="font-mono font-bold text-[#17263C]">{activeLockerModal.keyNumber || 'K-UNSET'}</span>
              </div>
              <div>
                <span className="text-[#66758C] text-[10px] uppercase block font-medium">Tier Position</span>
                <span className="font-semibold text-[#17263C]">{activeLockerModal.tier}</span>
              </div>
              <div>
                <span className="text-[#66758C] text-[10px] uppercase block font-medium">Annual Base Rent</span>
                <span className="font-mono font-semibold text-[#17263C] tabular-nums">₹{activeLockerModal.annualRent.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[#66758C] text-[10px] uppercase block font-medium">FD Security Requirement</span>
                <span className="font-mono font-semibold text-[#17263C] tabular-nums">₹{activeLockerModal.securityDeposit.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#17263C] mb-1.5 text-xs">
                Update Operational Status:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Vacant', 'Occupied', 'Reserved', 'Blocked', 'Under Maintenance'] as LockerStatus[]).map(st => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className={`py-2 px-2 rounded-lg border text-center transition-colors text-xs ${
                      activeLockerModal.status === st
                        ? 'bg-[#102544] text-white border-[#102544] font-semibold'
                        : 'bg-white text-[#17263C] border-[#E3E8F0] hover:bg-[#F5F7FA]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E3E8F0] flex justify-end">
              <button
                onClick={() => setActiveLockerModal(null)}
                className="px-4 py-2 bg-[#102544] text-white font-semibold text-xs rounded-lg hover:bg-[#0B1730] shadow-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
