import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { StatusBadge } from '../common/StatusBadge';
import { LockerApplication } from '../../types';
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Key,
  Shield,
  Search,
  UserCheck
} from 'lucide-react';

export const ApplicationManagement: React.FC = () => {
  const {
    applications,
    lockers,
    adminApproveApplication,
    adminRejectApplication,
    adminMakerVerifyApplication,
    adminCheckerApproveApplication,
    userRole,
    currentUser,
    switchUserRole
  } = useBanking();

  const [selectedApp, setSelectedApp] = useState<LockerApplication | null>(applications[0] || null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [specificUnit, setSpecificUnit] = useState('');
  const [makerNotes, setMakerNotes] = useState('KYC documents, CBS signature card, and linked FD verified by Maker.');

  const vacantUnits = lockers.filter(
    l => l.branchId === selectedApp?.branchId && l.size === selectedApp?.sizeRequested && l.status === 'Vacant'
  );

  const handleMakerVerify = () => {
    if (!selectedApp) return;
    adminMakerVerifyApplication(selectedApp.id, makerNotes);
  };

  const handleCheckerApprove = () => {
    if (!selectedApp) return;
    adminCheckerApproveApplication(selectedApp.id, specificUnit || undefined);
  };

  const handleReject = () => {
    if (!selectedApp) return;
    adminRejectApplication(selectedApp.id, rejectReason || 'Incomplete KYC documentation');
    setShowRejectModal(false);
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* Title */}
      <div className="pb-3 border-b border-[#E3E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#17263C]">
              Customer Locker Application Scrutiny Desk
            </h1>
            <span className="text-[10px] font-bold text-[#2457A7] bg-[#2457A7]/10 border border-[#2457A7]/20 px-2 py-0.5 rounded tracking-wide uppercase">
              Maker-Checker Vetting
            </span>
          </div>
          <p className="text-[#66758C] text-xs mt-1">
            Dual-control scrutiny of customer applications, PAN/KYC clearance, and vault compartment assignment
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Applications List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="font-bold text-[#17263C] text-sm">
            Applications Register ({applications.length})
          </h3>
          {applications.map(app => (
            <div
              key={app.id}
              onClick={() => setSelectedApp(app)}
              className={`p-4 rounded-xl border transition-all cursor-pointer shadow-bank-card space-y-2.5 ${
                selectedApp?.id === app.id
                  ? 'border-[#102544] bg-white ring-2 ring-[#102544]'
                  : 'border-[#E3E8F0] bg-white hover:border-[#102544]/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#17263C]">{app.applicationNumber}</span>
                <StatusBadge status={app.status} size="sm" />
              </div>
              <div className="text-[#17263C]">
                <div className="font-bold text-xs">{app.customerName}</div>
                <div className="text-[11px] text-[#66758C]">
                  {app.branchName} · {app.sizeRequested} Locker
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 text-[#66758C] font-mono border-t border-[#E3E8F0]">
                <span>Applied: <strong className="text-[#17263C] font-semibold">{app.appliedDate}</strong></span>
                <span>Mandate: <strong className="text-[#17263C] font-semibold">{app.operatingMode}</strong></span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Application Review & Allotment (7 Cols) */}
        {selectedApp ? (
          <div className="lg:col-span-7 bg-white border border-[#E3E8F0] rounded-xl p-6 shadow-bank-card space-y-5">
            <div className="border-b border-[#E3E8F0] pb-3 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-base text-[#17263C]">{selectedApp.applicationNumber}</span>
                  <StatusBadge status={selectedApp.status} />
                </div>
                <span className="text-[#66758C] text-xs mt-0.5 block">
                  Branch: {selectedApp.branchName} · Mandate: {selectedApp.operatingMode}
                </span>
              </div>
            </div>

            {/* Applicant Profile */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-[#F5F7FA] rounded-xl border border-[#E3E8F0] text-xs">
              <div>
                <span className="text-[#66758C] text-[10px] uppercase block font-medium">Applicant Name</span>
                <span className="font-bold text-[#17263C]">{selectedApp.customerName}</span>
              </div>
              <div>
                <span className="text-[#66758C] text-[10px] uppercase block font-medium">Customer CIF</span>
                <span className="font-mono font-bold text-[#17263C]">{selectedApp.cifNumber}</span>
              </div>
              <div>
                <span className="text-[#66758C] text-[10px] uppercase block font-medium">PAN Status</span>
                <span className="font-mono font-bold text-[#16845B]">{selectedApp.panNumber} (Verified NSDL)</span>
              </div>
              <div>
                <span className="text-[#66758C] text-[10px] uppercase block font-medium">Income Bracket</span>
                <span className="font-medium text-[#17263C]">{selectedApp.annualIncomeBracket}</span>
              </div>
              <div>
                <span className="text-[#66758C] text-[10px] uppercase block font-medium">Contact Phone</span>
                <span className="font-mono text-[#17263C]">{selectedApp.phone}</span>
              </div>
              <div>
                <span className="text-[#66758C] text-[10px] uppercase block font-medium">Linked Savings Account</span>
                <span className="font-mono text-[#17263C]">{selectedApp.linkedAccountNumber}</span>
              </div>
              {selectedApp.nomineeName && (
                <div className="col-span-2 pt-1 border-t border-[#E3E8F0]">
                  <span className="text-[#66758C] text-[10px] uppercase block font-medium">Declared Nominee (Form DA-1)</span>
                  <span className="font-medium text-[#17263C]">{selectedApp.nomineeName}</span>
                </div>
              )}
            </div>

            {/* Maker-Checker Workflow Timeline */}
            <div className="p-3.5 bg-[#F5F7FA] rounded-xl border border-[#E3E8F0] space-y-2">
              <span className="font-bold text-[#102544] text-xs block">Dual-Control Four-Eyes Sign-Off Status:</span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Maker Status */}
                <div className={`p-3 rounded-lg border ${
                  selectedApp.makerVerification
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                    : 'bg-white border-[#E3E8F0] text-[#17263C]'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold">1. Maker Scrutiny</span>
                    {selectedApp.makerVerification ? (
                      <span className="px-1.5 py-0.5 bg-emerald-200 text-emerald-900 rounded font-mono text-[9px] font-bold">VERIFIED</span>
                    ) : (
                      <span className="px-1.5 py-0.5 bg-amber-100 text-[#B7791F] rounded font-mono text-[9px] font-bold">PENDING</span>
                    )}
                  </div>
                  {selectedApp.makerVerification ? (
                    <div className="text-[10px] space-y-0.5">
                      <div>By: {selectedApp.makerVerification.verifiedBy}</div>
                      <div>Date: {selectedApp.makerVerification.verifiedDate}</div>
                      <div className="text-[#66758C] italic mt-0.5">"{selectedApp.makerVerification.notes}"</div>
                    </div>
                  ) : (
                    <div className="text-[10px] text-[#66758C]">Awaiting Maker KYC & linked FD verification</div>
                  )}
                </div>

                {/* Checker Status */}
                <div className={`p-3 rounded-lg border ${
                  selectedApp.checkerApproval || selectedApp.status === 'Approved - Allotted'
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                    : 'bg-white border-[#E3E8F0] text-[#17263C]'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold">2. Checker Allotment</span>
                    {selectedApp.status === 'Approved - Allotted' ? (
                      <span className="px-1.5 py-0.5 bg-emerald-200 text-emerald-900 rounded font-mono text-[9px] font-bold">AUTHORIZED</span>
                    ) : (
                      <span className="px-1.5 py-0.5 bg-[#F5F7FA] text-[#66758C] rounded font-mono text-[9px] font-bold border border-[#E3E8F0]">PENDING</span>
                    )}
                  </div>
                  {selectedApp.checkerApproval ? (
                    <div className="text-[10px] space-y-0.5">
                      <div>By: {selectedApp.checkerApproval.approvedBy}</div>
                      <div>Date: {selectedApp.checkerApproval.approvalDate}</div>
                    </div>
                  ) : (
                    <div className="text-[10px] text-[#66758C]">Awaiting Manager / Checker sign-off</div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions for Pending Applications */}
            {selectedApp.status !== 'Approved - Allotted' && selectedApp.status !== 'Rejected' ? (
              <div className="space-y-4 pt-2 border-t border-[#E3E8F0]">
                
                {/* Active Persona Notice */}
                <div className="flex items-center justify-between p-2.5 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg text-xs text-[#17263C]">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-[#2457A7]" />
                    <span>Active Session: <strong>{currentUser.name}</strong> ({currentUser.designation})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[#66758C]">Role Switch:</span>
                    <button
                      onClick={() => switchUserRole('branch_maker')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${userRole === 'branch_maker' ? 'bg-[#102544] text-white' : 'bg-white border border-[#E3E8F0] text-[#17263C]'}`}
                    >
                      Maker
                    </button>
                    <button
                      onClick={() => switchUserRole('branch_checker')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${userRole === 'branch_checker' ? 'bg-[#2457A7] text-white' : 'bg-white border border-[#E3E8F0] text-[#17263C]'}`}
                    >
                      Checker
                    </button>
                  </div>
                </div>

                {/* Step 1: Maker Scrutiny Action */}
                {!selectedApp.makerVerification && (
                  <div className="p-3.5 bg-[#2457A7]/5 border border-[#2457A7]/20 rounded-xl space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#2457A7] text-white flex items-center justify-center font-bold text-[10px]">1</span>
                      <h4 className="font-bold text-[#102544] text-xs">Branch Maker Scrutiny & Clearance</h4>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-[#17263C] mb-1">Maker Verification Remarks:</label>
                      <input
                        type="text"
                        value={makerNotes}
                        onChange={e => setMakerNotes(e.target.value)}
                        className="w-full bg-white border border-[#E3E8F0] rounded p-2 text-xs text-[#17263C] font-medium focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setShowRejectModal(true)}
                        className="px-3.5 py-1.5 border border-rose-200 text-[#C83E44] hover:bg-rose-50 rounded-lg text-xs font-semibold"
                      >
                        Reject Application
                      </button>
                      <button
                        onClick={handleMakerVerify}
                        className="px-4 py-1.5 bg-[#2457A7] hover:bg-[#102544] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                      >
                        Verify & Forward to Checker
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Checker Authorization Action */}
                {selectedApp.makerVerification && (
                  <div className="p-3.5 bg-[#102544]/5 border border-[#102544]/20 rounded-xl space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#102544] text-white flex items-center justify-center font-bold text-[10px]">2</span>
                      <h4 className="font-bold text-[#102544] text-xs">Branch Checker Allotment Authorization</h4>
                    </div>
                    
                    <div>
                      <label className="block font-semibold text-[#17263C] mb-1 text-xs">
                        Select Vacant Unit ({selectedApp.sizeRequested} Compartment):
                      </label>
                      <select
                        value={specificUnit}
                        onChange={e => setSpecificUnit(e.target.value)}
                        className="w-full bg-white border border-[#E3E8F0] rounded-lg p-2 font-mono font-bold text-[#17263C] text-xs focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
                      >
                        <option value="">Auto-Allot Next Available Compartment</option>
                        {vacantUnits.map(u => (
                          <option key={u.id} value={u.lockerNumber}>
                            Safe {u.lockerNumber} ({u.tier} - {u.floor})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-1">
                      <button
                        onClick={() => setShowRejectModal(true)}
                        className="px-4 py-2 border border-rose-200 text-[#C83E44] hover:bg-rose-50 rounded-lg text-xs font-semibold"
                      >
                        Reject Application
                      </button>
                      <button
                        onClick={handleCheckerApprove}
                        className="px-6 py-2 bg-[#102544] text-white text-xs font-semibold rounded-lg hover:bg-[#0B1730] shadow-xs transition-colors"
                      >
                        Authorize Allotment & Issue Memo
                      </button>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="p-3.5 bg-emerald-50 rounded-lg border border-emerald-200 text-[#16845B] text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16845B] shrink-0" />
                <span>
                  Allotted Compartment: <strong>Safe {selectedApp.allottedLockerNumber}</strong>. Key handover memo and welcome pack generated.
                </span>
              </div>
            )}

          </div>
        ) : null}

      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1730]/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-[#E3E8F0] max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-[#17263C] text-sm">Reject Locker Application</h3>
            <div>
              <label className="block font-semibold text-[#17263C] mb-1 text-xs">State Statutory Rejection Ground</label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="e.g. Non-compliant KYC documents or AML mismatch..."
                className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2.5 text-[#17263C] text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-3.5 py-1.5 text-[#66758C] hover:bg-[#F5F7FA] rounded-lg text-xs font-semibold border border-[#E3E8F0]"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-1.5 bg-[#C83E44] text-white text-xs font-semibold rounded-lg hover:bg-rose-800 shadow-xs transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
