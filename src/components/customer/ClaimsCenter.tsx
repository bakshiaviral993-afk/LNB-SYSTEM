import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { StatusBadge } from '../common/StatusBadge';
import { ClaimRequest } from '../../types';
import {
  FileCheck,
  AlertCircle,
  Clock,
  Calendar,
  Users,
  CheckCircle2,
  Upload,
  FileText,
  Shield,
  Plus
} from 'lucide-react';

export const ClaimsCenter: React.FC = () => {
  const { lockers, claims, submitClaim } = useBanking();
  const customerLockers = lockers.filter(l => l.customerId === 'cust-rahul-01');

  const [activeTab, setActiveTab] = useState<'track' | 'new'>('track');
  const [selectedClaim, setSelectedClaim] = useState<ClaimRequest | null>(claims[0] || null);

  // New Claim Form State
  const [deceasedName, setDeceasedName] = useState('');
  const [dateOfDeath, setDateOfDeath] = useState('2026-08-15');
  const [lockerId, setLockerId] = useState(customerLockers[0]?.id || 'lck-125');
  const [claimantName, setClaimantName] = useState('');
  const [relationship, setRelationship] = useState<ClaimRequest['claimantRelationship']>('Registered Nominee');
  const [contact, setContact] = useState('+91 ');
  const [address, setAddress] = useState('');
  const [deathCertRef, setDeathCertRef] = useState('');

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lkr = lockers.find(l => l.id === lockerId);

    const clmNum = submitClaim({
      lockerId,
      lockerNumber: lkr?.lockerNumber || 'A-125',
      deceasedHolderName: deceasedName,
      dateOfDeath,
      claimantName,
      claimantRelationship: relationship,
      claimantContact: contact,
      claimantAddress: address,
      documentsUploaded: [
        { name: `Death Certificate (Reg #${deathCertRef || 'MCD-8912'})`, type: 'PDF Document', status: 'Pending Review' },
        { name: 'Claimant KYC (Aadhaar & PAN)', type: 'PDF Document', status: 'Pending Review' },
        { name: 'Nomination Form DA-1 Acknowledgement Copy', type: 'PDF Document', status: 'Pending Review' }
      ]
    });

    setDeceasedName('');
    setClaimantName('');
    setActiveTab('track');
  };

  const stages = [
    'Claim Registered',
    'Documents Under Verification',
    'Branch Committee Scrutiny',
    'Inventory Scheduled',
    'Release Authorized',
    'Settled & Closed'
  ];

  const getStageIndex = (status: string) => stages.indexOf(status);

  return (
    <div className="space-y-6 text-xs">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E3E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#17263C]">
              Deceased Hirer Claims & Safe Custody Settlement
            </h1>
            <span className="text-[10px] font-bold text-[#2457A7] bg-[#2457A7]/10 border border-[#2457A7]/20 px-2 py-0.5 rounded tracking-wide uppercase">
              Settlement Cell
            </span>
          </div>
          <p className="text-[#66758C] text-xs mt-1">
            Transparent settlement process for registered nominees and legal heirs under RBI Master Directions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('track')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'track'
                ? 'bg-[#102544] text-white shadow-xs'
                : 'bg-[#F5F7FA] text-[#17263C] border border-[#E3E8F0] hover:bg-[#E3E8F0]/60'
            }`}
          >
            Track Claims ({claims.length})
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
            <span>Initiate Deceased Claim</span>
          </button>
        </div>
      </div>

      {/* TAB 1: TRACK CLAIMS */}
      {activeTab === 'track' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Claims List (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="font-bold text-[#17263C] text-sm">
              Registered Claims ({claims.length})
            </h3>
            {claims.map(c => (
              <div
                key={c.id}
                onClick={() => setSelectedClaim(c)}
                className={`p-4 rounded-xl border transition-all cursor-pointer shadow-bank-card space-y-2.5 ${
                  selectedClaim?.id === c.id
                    ? 'border-[#102544] bg-white ring-2 ring-[#102544]'
                    : 'border-[#E3E8F0] bg-white hover:border-[#102544]/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#17263C]">{c.claimNumber}</span>
                  <StatusBadge status={c.status} size="sm" />
                </div>
                <div className="text-[#17263C]">
                  <div className="font-bold text-xs">{c.deceasedHolderName}</div>
                  <div className="text-[11px] text-[#66758C]">
                    Claimant: {c.claimantName} ({c.claimantRelationship})
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 text-[#66758C] border-t border-[#E3E8F0]">
                  <span>Safe {c.lockerNumber}</span>
                  <span className="font-mono tabular-nums">{c.submittedDate}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Claim Workflow Details (7 Cols) */}
          {selectedClaim ? (
            <div className="lg:col-span-7 bg-white border border-[#E3E8F0] rounded-xl p-6 shadow-bank-card space-y-6">
              
              <div className="border-b border-[#E3E8F0] pb-3 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-base text-[#17263C]">{selectedClaim.claimNumber}</span>
                    <StatusBadge status={selectedClaim.status} />
                  </div>
                  <p className="text-xs text-[#66758C] mt-0.5">
                    Safe {selectedClaim.lockerNumber} · Filed on {selectedClaim.submittedDate}
                  </p>
                </div>
              </div>

              {/* Progress Stage Tracker */}
              <div>
                <h4 className="font-bold text-[#17263C] text-xs mb-3">Statutory Settlement Stages</h4>
                <div className="space-y-2">
                  {stages.map((stg, idx) => {
                    const currentIdx = getStageIndex(selectedClaim.status);
                    const isCompleted = idx < currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div
                        key={stg}
                        className={`p-2.5 rounded-lg border flex items-center justify-between text-[11px] ${
                          isCurrent
                            ? 'bg-amber-50/70 border-amber-300 font-bold text-[#B7791F]'
                            : isCompleted
                            ? 'bg-emerald-50/50 border-emerald-200 text-[#16845B]'
                            : 'bg-[#F5F7FA]/70 border-[#E3E8F0] text-[#66758C]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-[#16845B] shrink-0" />
                          ) : isCurrent ? (
                            <Clock className="w-4 h-4 text-[#B7791F] shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-[#E3E8F0] flex items-center justify-center text-[9px] text-[#66758C]">
                              {idx + 1}
                            </div>
                          )}
                          <span>{stg}</span>
                        </div>
                        {isCurrent && (
                          <span className="text-[10px] bg-amber-100 text-[#B7791F] px-2 py-0.5 rounded font-mono font-semibold">
                            Current Stage
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Uploaded Documents Scrutiny */}
              <div className="space-y-2">
                <h4 className="font-bold text-[#17263C] text-xs">Submitted Statutory Proofs</h4>
                <div className="space-y-2">
                  {(selectedClaim.documentsUploaded || []).map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-[#F5F7FA] rounded-lg border border-[#E3E8F0] flex items-center justify-between text-[11px]"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#2457A7]" />
                        <div>
                          <div className="font-medium text-[#17263C]">{doc.name}</div>
                          <div className="text-[10px] text-[#66758C]">{doc.type}</div>
                        </div>
                      </div>
                      <StatusBadge status={doc.status} size="sm" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Committee Remarks */}
              {selectedClaim.officerRemarks && (
                <div className="p-3.5 bg-[#F5F7FA] rounded-lg border border-[#E3E8F0] text-xs space-y-1">
                  <span className="font-bold text-[#102544] block">Branch Committee Scrutiny Findings:</span>
                  <p className="text-[#17263C] leading-relaxed">{selectedClaim.officerRemarks}</p>
                </div>
              )}

              {selectedClaim.inventoryDate && (
                <div className="p-3.5 bg-[#2457A7]/5 border border-[#2457A7]/20 rounded-lg text-[#17263C] text-xs flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#2457A7] shrink-0" />
                  <div>
                    <strong className="text-[#2457A7]">Inventory Recording Session Scheduled:</strong>{' '}
                    <span className="font-mono font-bold tabular-nums text-[#17263C]">{selectedClaim.inventoryDate}</span> at Main Branch Strongroom. Two independent bank officers and camera recording present.
                  </div>
                </div>
              )}

            </div>
          ) : null}

        </div>
      )}

      {/* TAB 2: INITIATE CLAIM */}
      {activeTab === 'new' && (
        <div className="max-w-2xl mx-auto bg-white border border-[#E3E8F0] rounded-xl p-6 shadow-bank-card space-y-5">
          <div className="border-b border-[#E3E8F0] pb-3">
            <h2 className="text-sm font-bold text-[#17263C]">
              Initiate Deceased Hirer Claim (Form L-301)
            </h2>
            <p className="text-[#66758C] mt-0.5 text-xs">
              Submission of claim notice under Reserve Bank of India Settlement of Claims Directive
            </p>
          </div>

          <form onSubmit={handleClaimSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#17263C] mb-1">Deceased Hirer Legal Name</label>
                <input
                  type="text"
                  placeholder="Late ..."
                  value={deceasedName}
                  onChange={e => setDeceasedName(e.target.value)}
                  required
                  className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2 font-medium text-[#17263C] text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#17263C] mb-1">Date of Death</label>
                <input
                  type="date"
                  value={dateOfDeath}
                  onChange={e => setDateOfDeath(e.target.value)}
                  required
                  className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2 font-mono text-[#17263C] text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#17263C] mb-1">Target Locker</label>
                <select
                  value={lockerId}
                  onChange={e => setLockerId(e.target.value)}
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
                <label className="block font-semibold text-[#17263C] mb-1">Claimant Capacity</label>
                <select
                  value={relationship}
                  onChange={e => setRelationship(e.target.value as ClaimRequest['claimantRelationship'])}
                  className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2 font-medium text-[#17263C] text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
                >
                  <option value="Registered Nominee">Registered Nominee (Form DA-1)</option>
                  <option value="Survivor">Surviving Joint Hirer (Either or Survivor)</option>
                  <option value="Legal Heir / Succession Certificate Holder">Legal Heir / Succession Certificate Holder</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#17263C] mb-1">Claimant Full Legal Name</label>
                <input
                  type="text"
                  placeholder="Full Name as on Aadhaar / PAN"
                  value={claimantName}
                  onChange={e => setClaimantName(e.target.value)}
                  required
                  className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2 font-medium text-[#17263C] text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#17263C] mb-1">Contact Mobile Number</label>
                <input
                  type="text"
                  value={contact}
                  onChange={e => setContact(e.target.value)}
                  required
                  className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2 text-[#17263C] text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#17263C] mb-1">Municipal Death Certificate Registration #</label>
              <input
                type="text"
                placeholder="e.g. MCD/2026/099182"
                value={deathCertRef}
                onChange={e => setDeathCertRef(e.target.value)}
                required
                className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2 font-mono text-[#17263C] text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#17263C] mb-1">Claimant Residential Address</label>
              <textarea
                rows={2}
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Current residential address..."
                required
                className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2 text-[#17263C] text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
              />
            </div>

            <div className="p-3.5 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg text-xs text-[#66758C]">
              * Original Death Certificate, Form DA-1 acknowledgement, and Indemnity Bond must be presented during the scheduled branch scrutiny meeting.
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('track')}
                className="px-4 py-2 text-xs font-semibold text-[#66758C] hover:bg-[#F5F7FA] rounded-lg border border-[#E3E8F0]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#102544] text-white text-xs font-semibold rounded-lg hover:bg-[#0B1730] shadow-xs transition-colors"
              >
                Register Deceased Claim
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
