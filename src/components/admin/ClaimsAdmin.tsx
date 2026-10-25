import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { StatusBadge } from '../common/StatusBadge';
import { ClaimRequest } from '../../types';
import {
  FileCheck,
  CheckCircle2,
  Clock,
  Calendar,
  AlertTriangle,
  FileText,
  Shield,
  UserCheck
} from 'lucide-react';

export const ClaimsAdmin: React.FC = () => {
  const { claims, adminUpdateClaimStage } = useBanking();

  const [selectedClaim, setSelectedClaim] = useState<ClaimRequest | null>(claims[0] || null);
  const [targetStage, setTargetStage] = useState<ClaimRequest['status']>('Branch Committee Scrutiny');
  const [remarks, setRemarks] = useState('');

  const stages: ClaimRequest['status'][] = [
    'Claim Registered',
    'Documents Under Verification',
    'Branch Committee Scrutiny',
    'Inventory Scheduled',
    'Release Authorized',
    'Settled & Closed'
  ];

  const handleStageUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClaim) return;

    adminUpdateClaimStage(
      selectedClaim.id,
      targetStage,
      remarks || `Progressed claim to ${targetStage} by Legal Scrutiny Committee`
    );
    setRemarks('');
    setSelectedClaim(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Enterprise Page Header */}
      <div className="bg-white rounded-xl border border-[#E3E8F0] shadow-bank-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#102544]/5 text-[#102544] border border-[#102544]/15">
              RBI/2021-2022/86 • Section 45ZE
            </span>
            <span className="text-xs text-[#66758C]">Branch Legal Committee Desk</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#17263C]">
            Deceased Hirer Claims Processing & Settlement Committee
          </h1>
          <p className="text-xs text-[#66758C] mt-1">
            Dual maker-checker scrutiny of succession certificates, Form DA-1 matching, legal heir indemnity bonds, and strongroom inventory oversight.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F5F7FA] border border-[#E3E8F0] text-xs font-mono text-[#102544]">
          <Shield className="w-4 h-4 text-[#2457A7]" />
          <span>Active Claims: {claims.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Claims List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-[#17263C]">
              Deceased Cases Register ({claims.length})
            </h3>
            <span className="text-xs text-[#66758C]">Select case file</span>
          </div>

          <div className="space-y-3">
            {claims.map(c => {
              const isSelected = selectedClaim?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedClaim(c);
                    setTargetStage(c.status);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer shadow-bank-card space-y-2.5 ${
                    isSelected
                      ? 'border-[#2457A7] bg-white ring-2 ring-[#2457A7]/20 shadow-md'
                      : 'border-[#E3E8F0] bg-white hover:border-[#2457A7]/40 hover:bg-[#F5F7FA]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-[#17263C]">{c.claimNumber}</span>
                    <StatusBadge status={c.status} size="sm" />
                  </div>
                  <div>
                    <div className="font-bold text-[#17263C] text-xs">{c.deceasedHolderName}</div>
                    <div className="text-xs text-[#66758C] mt-0.5">
                      Claimant: <strong className="text-[#17263C]">{c.claimantName}</strong> ({c.claimantRelationship})
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-2 text-[#66758C] font-mono border-t border-[#E3E8F0]">
                    <span>Locker #{c.lockerNumber}</span>
                    <span>Filed: {c.submittedDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Claim Review & Approval Console (7 cols) */}
        {selectedClaim ? (
          <div className="lg:col-span-7 bg-white border border-[#E3E8F0] rounded-xl p-6 shadow-bank-card space-y-5">
            <div className="border-b border-[#E3E8F0] pb-4 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-base text-[#17263C]">{selectedClaim.claimNumber}</span>
                  <StatusBadge status={selectedClaim.status} />
                </div>
                <span className="text-[#66758C] text-xs mt-1 block">
                  Locker #{selectedClaim.lockerNumber} • Deceased: <strong className="text-[#17263C]">{selectedClaim.deceasedHolderName}</strong> (Demise: {selectedClaim.dateOfDeath})
                </span>
              </div>
            </div>

            {/* Claimant Particulars */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-[#F5F7FA] rounded-xl border border-[#E3E8F0] text-xs">
              <div>
                <span className="text-[#66758C] block text-[11px] font-semibold uppercase tracking-wider">Claimant Legal Name</span>
                <span className="font-bold text-[#17263C] mt-0.5 block">{selectedClaim.claimantName}</span>
              </div>
              <div>
                <span className="text-[#66758C] block text-[11px] font-semibold uppercase tracking-wider">Legal Capacity</span>
                <span className="font-semibold text-[#17263C] mt-0.5 block">{selectedClaim.claimantRelationship}</span>
              </div>
              <div>
                <span className="text-[#66758C] block text-[11px] font-semibold uppercase tracking-wider">Contact Phone</span>
                <span className="font-mono text-[#17263C] mt-0.5 block">{selectedClaim.claimantContact}</span>
              </div>
              <div>
                <span className="text-[#66758C] block text-[11px] font-semibold uppercase tracking-wider">Filing Date</span>
                <span className="font-mono text-[#17263C] mt-0.5 block">{selectedClaim.submittedDate}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[#66758C] block text-[11px] font-semibold uppercase tracking-wider">Registered Address</span>
                <span className="text-[#17263C] mt-0.5 block">{selectedClaim.claimantAddress}</span>
              </div>
            </div>

            {/* Document Verification Table */}
            <div>
              <h4 className="text-xs font-bold text-[#17263C] mb-2.5">Submitted Statutory Documents</h4>
              <div className="space-y-2">
                {(selectedClaim.documentsUploaded || []).map((doc, idx) => (
                  <div key={idx} className="p-3 bg-[#F5F7FA] rounded-lg border border-[#E3E8F0] flex items-center justify-between text-xs">
                    <span className="font-medium text-[#17263C] flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#2457A7]" />
                      {doc.name}
                    </span>
                    <StatusBadge status={doc.status} size="sm" />
                  </div>
                ))}
              </div>
            </div>

            {/* Update Stage Form */}
            <form onSubmit={handleStageUpdate} className="space-y-4 pt-4 border-t border-[#E3E8F0]">
              <div>
                <label className="block text-xs font-semibold text-[#17263C] mb-1.5">
                  Progress Claim Regulatory Stage
                </label>
                <select
                  value={targetStage}
                  onChange={e => setTargetStage(e.target.value as ClaimRequest['status'])}
                  className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2.5 text-xs font-medium text-[#17263C] focus:outline-none focus:ring-2 focus:ring-[#2457A7]/20 focus:border-[#2457A7]"
                >
                  {stages.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17263C] mb-1.5">
                  Scrutiny Committee Observations & Legal Order
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  placeholder="Record observations regarding indemnity bond, succession certificate, or inventory scheduling..."
                  required
                  className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2.5 text-xs text-[#17263C] focus:outline-none focus:ring-2 focus:ring-[#2457A7]/20 focus:border-[#2457A7]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#102544] hover:bg-[#0B1730] text-white text-xs font-semibold rounded-lg shadow-bank-card transition-colors flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4 text-[#008C88]" />
                  Authorize Stage Progression
                </button>
              </div>
            </form>

          </div>
        ) : null}

      </div>

    </div>
  );
};
