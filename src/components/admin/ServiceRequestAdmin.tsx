import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { StatusBadge } from '../common/StatusBadge';
import { ServiceRequest } from '../../types';
import {
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Key,
  Shield,
  Edit
} from 'lucide-react';

export const ServiceRequestAdmin: React.FC = () => {
  const {
    serviceRequests,
    adminUpdateServiceRequest,
    adminFinalizeClosure,
    adminCheckerApproveServiceRequest,
    adminMakerReviewServiceRequest
  } = useBanking();

  const [selectedSr, setSelectedSr] = useState<ServiceRequest | null>(serviceRequests[0] || null);
  const [newStatus, setNewStatus] = useState<ServiceRequest['status']>('Under Scrutiny');
  const [remarks, setRemarks] = useState('');
  const [cost, setCost] = useState<string>('');
  const [srError, setSrError] = useState<string | null>(null);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSr) return;
    setSrError(null);

    if (newStatus === 'Resolved / Closed' && selectedSr.requestType === 'Surrender Locker') {
      adminFinalizeClosure(selectedSr.lockerId, selectedSr.id);
      setSelectedSr(null);
      return;
    }

    if (newStatus === 'Resolved / Closed' || newStatus === 'Approved by Manager') {
      const result = adminCheckerApproveServiceRequest(selectedSr.id, remarks || `Approved by Checker (${newStatus})`);
      if (result && !result.success) {
        setSrError(result.error || 'Dual-control authorization failed.');
        return;
      }
    } else if (newStatus === 'In Progress' || newStatus === 'Under Scrutiny') {
      adminMakerReviewServiceRequest(selectedSr.id, remarks || 'Maker verification recorded', cost ? parseFloat(cost) : undefined);
    } else {
      adminUpdateServiceRequest(
        selectedSr.id,
        newStatus,
        remarks || `Status updated to ${newStatus} by Branch Operations Manager`,
        cost ? parseFloat(cost) : undefined
      );
    }
    setRemarks('');
    setSelectedSr(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Enterprise Page Header */}
      <div className="bg-white rounded-xl border border-[#E3E8F0] shadow-bank-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#102544]/5 text-[#102544] border border-[#102544]/15">
              Vault Technical Operations
            </span>
            <span className="text-xs text-[#66758C]">SLA Management & Locksmith Desk</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#17263C]">
            Service Requests & Technical Operations Desk
          </h1>
          <p className="text-xs text-[#66758C] mt-1">
            Process lost key break-open protocols, manufacturer locksmith scheduling, compartment upgrades, and statutory surrender closures.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F5F7FA] border border-[#E3E8F0] text-xs font-mono text-[#102544]">
          <Wrench className="w-4 h-4 text-[#2457A7]" />
          <span>Active Operations: {serviceRequests.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Requests List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-[#17263C]">
              Active Operations Queue ({serviceRequests.length})
            </h3>
            <span className="text-xs text-[#66758C]">Select ticket to act</span>
          </div>

          <div className="space-y-3">
            {serviceRequests.map(sr => {
              const isSelected = selectedSr?.id === sr.id;
              return (
                <div
                  key={sr.id}
                  onClick={() => {
                    setSelectedSr(sr);
                    setNewStatus(sr.status);
                    setCost(sr.estimatedCost ? sr.estimatedCost.toString() : '');
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer shadow-bank-card space-y-2.5 ${
                    isSelected
                      ? 'border-[#2457A7] bg-white ring-2 ring-[#2457A7]/20 shadow-md'
                      : 'border-[#E3E8F0] bg-white hover:border-[#2457A7]/40 hover:bg-[#F5F7FA]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-[#17263C]">{sr.ticketNumber}</span>
                    <StatusBadge status={sr.status} size="sm" />
                  </div>
                  <div>
                    <div className="font-bold text-[#17263C] text-xs">{sr.requestType}</div>
                    <div className="text-xs text-[#66758C] mt-0.5">
                      Locker #{sr.lockerNumber} • Hirer: <strong className="text-[#17263C]">{sr.customerName}</strong>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-2 text-[#66758C] font-mono border-t border-[#E3E8F0]">
                    <span>Updated: {sr.lastUpdated}</span>
                    <span>{sr.timeline.length} audit entries</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Request Action Console (7 cols) */}
        {selectedSr ? (
          <div className="lg:col-span-7 bg-white border border-[#E3E8F0] rounded-xl p-6 shadow-bank-card space-y-5">
            <div className="border-b border-[#E3E8F0] pb-4 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-base text-[#17263C]">{selectedSr.ticketNumber}</span>
                  <StatusBadge status={selectedSr.status} />
                </div>
                <h3 className="font-bold text-[#17263C] text-sm mt-1">{selectedSr.requestType}</h3>
                <span className="text-[#66758C] text-xs">
                  Locker #{selectedSr.lockerNumber} • {selectedSr.branchName}
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#F5F7FA] rounded-xl border border-[#E3E8F0] text-[#17263C] space-y-1">
              <span className="text-[#66758C] block text-[11px] font-semibold uppercase tracking-wider">
                Customer Request Description:
              </span>
              <p className="text-xs leading-relaxed">{selectedSr.description}</p>
            </div>

            {/* Special Callout for Surrender */}
            {selectedSr.requestType === 'Surrender Locker' && (
              <div className="p-4 bg-[#B7791F]/10 border border-[#B7791F]/20 rounded-xl text-[#17263C] text-xs space-y-1">
                <span className="font-bold block text-[#B7791F] flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#B7791F]" />
                  Surrender Finalization Advisory:
                </span>
                <p className="text-[#17263C] text-xs leading-relaxed">
                  Selecting <strong>Resolved / Closed</strong> will finalize the locker surrender: marking the compartment vacant in branch inventory, extinguishing the security deposit lien, and generating the official Surrender Certificate.
                </p>
              </div>
            )}

            {/* Action Form */}
            <form onSubmit={handleUpdate} className="space-y-4 pt-2 border-t border-[#E3E8F0]">
              {srError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-[#C83E44] flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold block">Maker-Checker Rule Enforcement</span>
                    <span>{srError}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17263C] mb-1.5">
                    Update Workflow Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value as ServiceRequest['status'])}
                    className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2.5 text-xs font-medium text-[#17263C] focus:outline-none focus:ring-2 focus:ring-[#2457A7]/20 focus:border-[#2457A7]"
                  >
                    <option value="Open">Open</option>
                    <option value="Under Scrutiny">Under Scrutiny</option>
                    <option value="Approved by Manager">Approved by Manager</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved / Closed">Resolved / Closed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17263C] mb-1.5">
                    Technical Cost / Break-Open Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={cost}
                    onChange={e => setCost(e.target.value)}
                    placeholder="e.g. 4500"
                    className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2.5 text-xs font-mono text-[#17263C] focus:outline-none focus:ring-2 focus:ring-[#2457A7]/20 focus:border-[#2457A7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17263C] mb-1.5">
                  Manager Decision & Compliance Remarks
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  placeholder="Record verification notes, locksmith dispatch date, or compliance observations..."
                  required
                  className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2.5 text-xs text-[#17263C] focus:outline-none focus:ring-2 focus:ring-[#2457A7]/20 focus:border-[#2457A7]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#102544] hover:bg-[#0B1730] text-white text-xs font-semibold rounded-lg shadow-bank-card transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#008C88]" />
                  Save Decision & Notify Customer
                </button>
              </div>
            </form>

            {/* Timeline View */}
            <div className="pt-4 border-t border-[#E3E8F0]">
              <h4 className="text-xs font-bold text-[#17263C] mb-3">Audit Timeline & Change Log</h4>
              <div className="space-y-2.5">
                {selectedSr.timeline.map((item, idx) => (
                  <div key={idx} className="p-3 bg-[#F5F7FA] rounded-lg border border-[#E3E8F0] text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#17263C]">{item.status}</span>
                      <span className="font-mono text-[11px] text-[#66758C]">{item.timestamp}</span>
                    </div>
                    <span className="text-[#66758C] text-[11px] font-medium block mt-0.5">By {item.actor}</span>
                    <p className="text-[#17263C] mt-1 leading-relaxed">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : null}

      </div>

    </div>
  );
};
