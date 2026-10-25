import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { StatusBadge } from '../common/StatusBadge';
import { ServiceRequest } from '../../types';
import {
  Wrench,
  Key,
  ShieldAlert,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Plus
} from 'lucide-react';

export const ServiceRequests: React.FC = () => {
  const { lockers, serviceRequests, createServiceRequest } = useBanking();
  const customerLockers = lockers.filter(l => l.customerId === 'cust-rahul-01');

  const [activeTab, setActiveTab] = useState<'list' | 'new'>('list');
  const [selectedLockerId, setSelectedLockerId] = useState(customerLockers[0]?.id || 'lck-125');
  const [requestType, setRequestType] = useState<ServiceRequest['requestType']>('Lost Key & Break-Open');
  const [description, setDescription] = useState('');
  const [activeSrModal, setActiveSrModal] = useState<ServiceRequest | null>(null);

  const selectedLocker = lockers.find(l => l.id === selectedLockerId) || customerLockers[0];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    createServiceRequest({
      customerId: 'cust-rahul-01',
      customerName: 'Rahul Sharma',
      lockerId: selectedLocker.id,
      lockerNumber: selectedLocker.lockerNumber,
      branchName: selectedLocker.branchName,
      requestType,
      description,
      estimatedCost: requestType === 'Lost Key & Break-Open' ? 4500 : requestType === 'Lock Replacement' ? 2200 : undefined,
    });

    setDescription('');
    setActiveTab('list');
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* Title & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E3E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#17263C]">
              Locker Service & Operations Requests
            </h1>
            <span className="text-[10px] font-bold text-[#2457A7] bg-[#2457A7]/10 border border-[#2457A7]/20 px-2 py-0.5 rounded tracking-wide uppercase">
              Custody Support Desk
            </span>
          </div>
          <p className="text-[#66758C] text-xs mt-1">
            Lost key break-open protocols, lock mechanism replacements, size upgrades, and emergency custody access
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'list'
                ? 'bg-[#102544] text-white shadow-xs'
                : 'bg-[#F5F7FA] text-[#17263C] border border-[#E3E8F0] hover:bg-[#E3E8F0]/60'
            }`}
          >
            My Requests ({serviceRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'new'
                ? 'bg-[#102544] text-white shadow-xs'
                : 'bg-[#F5F7FA] text-[#17263C] border border-[#E3E8F0] hover:bg-[#E3E8F0]/60'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-[#008C88]" />
            <span>Raise New Request</span>
          </button>
        </div>
      </div>

      {/* TAB 1: LIST OF REQUESTS */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {serviceRequests.map(sr => (
              <div
                key={sr.id}
                onClick={() => setActiveSrModal(sr)}
                className="p-5 bg-white border border-[#E3E8F0] rounded-xl shadow-bank-card hover:border-[#102544]/30 transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-start justify-between border-b border-[#E3E8F0] pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-[#17263C] text-sm">{sr.ticketNumber}</span>
                      <StatusBadge status={sr.status} size="sm" />
                    </div>
                    <span className="font-semibold text-[#17263C] text-xs mt-1 block">{sr.requestType}</span>
                  </div>
                  <span className="text-[11px] font-mono font-medium text-[#66758C] bg-[#F5F7FA] px-2 py-0.5 rounded border border-[#E3E8F0]">
                    Safe {sr.lockerNumber}
                  </span>
                </div>

                <p className="text-[#66758C] text-xs line-clamp-2 leading-relaxed">
                  {sr.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-[#66758C]">
                  <div>
                    <span className="text-[#66758C] text-[10px] block uppercase font-medium">Logged Date</span>
                    <span className="font-mono text-[#17263C] tabular-nums font-medium">{sr.createdDate}</span>
                  </div>
                  <div>
                    <span className="text-[#66758C] text-[10px] block uppercase font-medium">Assigned Desk</span>
                    <span className="text-[#17263C] truncate block font-medium">
                      {sr.assignedOfficer || 'Main Branch Desk'}
                    </span>
                  </div>
                </div>

                {sr.estimatedCost && (
                  <div className="p-2.5 bg-[#F5F7FA] rounded-lg border border-[#E3E8F0] flex justify-between items-center text-[11px]">
                    <span className="text-[#66758C]">Applicable Technical Charges:</span>
                    <span className="font-mono font-bold text-[#17263C] tabular-nums">₹{sr.estimatedCost.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="pt-2.5 border-t border-[#E3E8F0] flex items-center justify-between text-[11px]">
                  <span className="text-[#66758C] font-mono">{sr.timeline.length} Audit Milestones</span>
                  <span className="text-[#2457A7] font-semibold hover:underline flex items-center gap-1">
                    <span>View Progress Trail</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: RAISE NEW REQUEST */}
      {activeTab === 'new' && (
        <div className="max-w-2xl mx-auto bg-white border border-[#E3E8F0] rounded-xl p-6 shadow-bank-card space-y-5">
          <div className="border-b border-[#E3E8F0] pb-3">
            <h2 className="text-sm font-bold text-[#17263C]">
              Submit Custody Operations or Technical Request
            </h2>
            <p className="text-[#66758C] mt-0.5 text-xs">
              Requests are reviewed by Branch Custodians and Maker-Checker compliance desk
            </p>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#17263C] mb-1">Select Locker</label>
                <select
                  value={selectedLockerId}
                  onChange={e => setSelectedLockerId(e.target.value)}
                  className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2 font-medium text-[#17263C] text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
                >
                  {customerLockers.map(l => (
                    <option key={l.id} value={l.id}>
                      Locker {l.lockerNumber} ({l.branchName.split('-')[0].trim()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#17263C] mb-1">Service Category</label>
                <select
                  value={requestType}
                  onChange={e => setRequestType(e.target.value as ServiceRequest['requestType'])}
                  className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2 font-medium text-[#17263C] text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
                >
                  <option value="Lost Key & Break-Open">Lost Key & Break-Open Protocol</option>
                  <option value="Lock Replacement">Lock Mechanism Replacement</option>
                  <option value="Size Upgrade / Downgrade">Size Upgrade / Downgrade</option>
                  <option value="Branch Relocation">Branch Relocation Transfer</option>
                  <option value="Locker Damage / Maintenance">Locker Damage / Maintenance</option>
                  <option value="Exceptional Access">Exceptional Access (Emergency/PoA)</option>
                  <option value="Surrender Locker">Surrender Locker Account</option>
                </select>
              </div>
            </div>

            {/* Special Instructions for Lost Key */}
            {requestType === 'Lost Key & Break-Open' && (
              <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-lg text-amber-950 space-y-1">
                <span className="font-bold text-[#B7791F] block text-xs">Lost Key Regulatory Protocol (RBI Mandated):</span>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  The bank does not hold any duplicate key for customer lockers. Break-open requires scheduling an appointment with an authorized manufacturer lock technician (Godrej/Steelage) in the presence of the hirer and two independent bank officers. Standard technician break-open & lock replacement charges: <strong className="font-mono text-[#17263C]">₹4,500 + GST</strong>.
                </p>
              </div>
            )}

            <div>
              <label className="block font-semibold text-[#17263C] mb-1">Detailed Description of Request / Issue</label>
              <textarea
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="State the detailed circumstances, specific requirements, or dates requested..."
                required
                className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-3 text-[#17263C] font-sans text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="px-4 py-2 text-xs font-semibold text-[#66758C] hover:bg-[#F5F7FA] rounded-lg transition-colors border border-[#E3E8F0]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold bg-[#102544] text-white rounded-lg hover:bg-[#0B1730] shadow-xs transition-colors"
              >
                Log Ticket to Branch Custodian
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DETAIL MODAL / TIMELINE VIEWER */}
      {activeSrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1730]/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-[#E3E8F0] max-w-xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#E3E8F0] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold font-mono text-base text-[#17263C]">{activeSrModal.ticketNumber}</span>
                  <StatusBadge status={activeSrModal.status} />
                </div>
                <h3 className="font-bold text-[#17263C] text-sm mt-1">{activeSrModal.requestType}</h3>
                <span className="text-[#66758C] text-xs">
                  Safe {activeSrModal.lockerNumber} · {activeSrModal.branchName}
                </span>
              </div>
              <button
                onClick={() => setActiveSrModal(null)}
                className="text-[#66758C] hover:text-[#17263C] p-1.5 rounded-md hover:bg-[#F5F7FA] font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 bg-[#F5F7FA] rounded-lg border border-[#E3E8F0] text-[#17263C]">
              <span className="text-[#66758C] block text-[11px] font-semibold uppercase tracking-wider mb-1">Customer Statement:</span>
              <p className="text-xs leading-relaxed">{activeSrModal.description}</p>
            </div>

            {activeSrModal.adminRemarks && (
              <div className="p-3.5 bg-[#2457A7]/5 rounded-lg border border-[#2457A7]/20 text-[#17263C]">
                <span className="text-[#2457A7] block text-[11px] font-bold uppercase tracking-wider mb-1">Branch Operations Manager Remarks:</span>
                <p className="text-xs text-[#17263C] leading-relaxed">{activeSrModal.adminRemarks}</p>
              </div>
            )}

            {/* Timeline */}
            <div>
              <h4 className="font-bold text-[#17263C] text-xs mb-3">Audit Timeline Trail</h4>
              <div className="relative pl-6 space-y-4 border-l-2 border-[#E3E8F0] ml-2">
                {activeSrModal.timeline.map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#102544] border-2 border-white shadow-xs" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#17263C] text-xs">{item.status}</span>
                        <span className="text-[#66758C] font-mono text-[10px] tabular-nums">{item.timestamp}</span>
                      </div>
                      <span className="text-[#66758C] font-medium block text-[11px] mt-0.5">By {item.actor}</span>
                      <p className="text-[#17263C] text-xs mt-1 leading-relaxed">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E3E8F0] flex justify-end">
              <button
                onClick={() => setActiveSrModal(null)}
                className="px-4 py-2 bg-[#102544] hover:bg-[#0B1730] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
