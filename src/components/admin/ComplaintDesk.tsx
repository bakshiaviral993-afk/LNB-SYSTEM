import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { StatusBadge } from '../common/StatusBadge';
import { Complaint } from '../../types';
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  Shield,
  Search
} from 'lucide-react';

export const ComplaintDesk: React.FC = () => {
  const { complaints, adminResolveComplaint } = useBanking();
  const [selectedComp, setSelectedComp] = useState<Complaint | null>(complaints[0] || null);
  const [resolutionText, setResolutionText] = useState('');

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComp || !resolutionText.trim()) return;

    adminResolveComplaint(selectedComp.id, resolutionText);
    setResolutionText('');
    setSelectedComp(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Enterprise Page Header */}
      <div className="bg-white rounded-xl border border-[#E3E8F0] shadow-bank-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#102544]/5 text-[#102544] border border-[#102544]/15">
              RBI Integrated Ombudsman Scheme, 2021
            </span>
            <span className="text-xs text-[#66758C]">Tier-1 Redressal Desk • Principal Nodal Officer</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#17263C]">
            Customer Grievance & Ombudsman Escalation Desk
          </h1>
          <p className="text-xs text-[#66758C] mt-1">
            Statutory redressal monitoring, 30-day turnaround enforcement, root cause logging, and regulatory escalation prevention.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F5F7FA] border border-[#E3E8F0] text-xs font-mono text-[#102544]">
          <MessageSquare className="w-4 h-4 text-[#2457A7]" />
          <span>Active Grievances: {complaints.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Complaints Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-[#17263C]">
              Grievances Queue ({complaints.length})
            </h3>
            <span className="text-xs text-[#66758C]">Select case to resolve</span>
          </div>

          <div className="space-y-3">
            {complaints.map(c => {
              const isSelected = selectedComp?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedComp(c)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer shadow-bank-card space-y-2.5 ${
                    isSelected
                      ? 'border-[#2457A7] bg-white ring-2 ring-[#2457A7]/20 shadow-md'
                      : 'border-[#E3E8F0] bg-white hover:border-[#2457A7]/40 hover:bg-[#F5F7FA]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-[#17263C]">{c.complaintNumber}</span>
                    <StatusBadge status={c.status} size="sm" />
                  </div>
                  <div>
                    <div className="font-bold text-[#17263C] text-xs">{c.subject}</div>
                    <div className="text-xs text-[#66758C] mt-0.5">
                      Locker #{c.lockerNumber} • Hirer: <strong className="text-[#17263C]">{c.customerName}</strong>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-2 text-[#66758C] font-mono border-t border-[#E3E8F0]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#2457A7]" />
                      SLA: {c.slaTargetHours}h Target
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      c.severity === 'Critical'
                        ? 'bg-[#C83E44]/10 text-[#C83E44] border border-[#C83E44]/20'
                        : 'bg-[#B7791F]/10 text-[#B7791F] border border-[#B7791F]/20'
                    }`}>
                      {c.severity} Severity
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Complaint Resolution (7 cols) */}
        {selectedComp ? (
          <div className="lg:col-span-7 bg-white border border-[#E3E8F0] rounded-xl p-6 shadow-bank-card space-y-5">
            <div className="border-b border-[#E3E8F0] pb-4 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-base text-[#17263C]">{selectedComp.complaintNumber}</span>
                  <StatusBadge status={selectedComp.status} />
                </div>
                <h3 className="font-bold text-[#17263C] text-sm mt-1">{selectedComp.subject}</h3>
                <span className="text-[#66758C] text-xs">
                  Category: {selectedComp.category} • Locker #{selectedComp.lockerNumber} • Filed {selectedComp.createdDate}
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#F5F7FA] rounded-xl border border-[#E3E8F0] text-[#17263C] space-y-1">
              <span className="text-[#66758C] block text-[11px] font-semibold uppercase tracking-wider">
                Hirer Grievance Statement:
              </span>
              <p className="text-xs leading-relaxed">{selectedComp.details}</p>
            </div>

            {selectedComp.status !== 'Resolved' ? (
              <form onSubmit={handleResolve} className="space-y-4 pt-2 border-t border-[#E3E8F0]">
                <div>
                  <label className="block text-xs font-semibold text-[#17263C] mb-1.5">
                    Formal Redressal Order & Root Cause Resolution Note
                  </label>
                  <textarea
                    rows={4}
                    value={resolutionText}
                    onChange={e => setResolutionText(e.target.value)}
                    placeholder="Enter root cause analysis, corrective action taken, and communication provided to hirer..."
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
                    Commit Resolution & Dispatch Hirer Advisory
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 bg-[#16845B]/10 rounded-xl border border-[#16845B]/20 text-[#17263C] text-xs space-y-1">
                <span className="font-bold block text-[#16845B] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16845B]" />
                  Resolution Recorded & Hirer Acknowledged:
                </span>
                <p className="text-xs leading-relaxed text-[#17263C]">{selectedComp.resolutionNote}</p>
              </div>
            )}

          </div>
        ) : null}

      </div>

    </div>
  );
};
