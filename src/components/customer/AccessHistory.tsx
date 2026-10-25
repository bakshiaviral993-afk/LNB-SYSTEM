import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { StatusBadge } from '../common/StatusBadge';
import { OtpModal } from '../common/OtpModal';
import {
  Clock,
  ShieldAlert,
  ShieldCheck,
  Building,
  Key,
  AlertTriangle,
  UserCheck,
  Search,
  Filter
} from 'lucide-react';

export const AccessHistory: React.FC = () => {
  const {
    lockers,
    accessLogs,
    accessDisputes,
    selectedLockerId,
    setSelectedLockerId,
    logAccessDispute
  } = useBanking();

  const customerLockers = lockers.filter(l => l.customerId === 'cust-rahul-01');
  const [filterLockerId, setFilterLockerId] = useState<string>('all');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedLogForReport, setSelectedLogForReport] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [disputeSuccessTicket, setDisputeSuccessTicket] = useState<string | null>(null);

  const filteredLogs = accessLogs.filter(log => {
    if (filterLockerId !== 'all') {
      const matchLocker = lockers.find(l => l.id === filterLockerId);
      if (matchLocker && log.lockerNumber !== matchLocker.lockerNumber) return false;
    }
    return true;
  });

  const handleReportSuspicious = () => {
    setIsOtpOpen(true);
  };

  const handleOtpSuccess = () => {
    if (selectedLogForReport) {
      const ticket = logAccessDispute(selectedLogForReport, reportReason || 'Unrecognized safe entry reported by customer.');
      setDisputeSuccessTicket(ticket);
      setReportModalOpen(false);
      setSelectedLogForReport(null);
      setReportReason('');
    }
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E3E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#17263C]">
              Vault Access Log & Strongroom Audits
            </h1>
            <span className="text-[10px] font-bold text-[#008C88] bg-[#008C88]/10 border border-[#008C88]/20 px-2 py-0.5 rounded tracking-wide uppercase">
              Immutable Ledger
            </span>
          </div>
          <p className="text-[#66758C] text-xs mt-1">
            Cryptographic ledger of all physical safe entries, dual-key authorizations, and biometric matches
          </p>
        </div>

        {/* Filter by locker */}
        <div className="flex items-center gap-2">
          <label className="text-[#66758C] font-semibold text-xs">Filter Safe:</label>
          <select
            value={filterLockerId}
            onChange={e => setFilterLockerId(e.target.value)}
            className="bg-white border border-[#E3E8F0] rounded-lg px-3 py-1.5 font-mono text-xs font-semibold text-[#17263C] shadow-xs focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
          >
            <option value="all">All Allotted Safes</option>
            {customerLockers.map(l => (
              <option key={l.id} value={l.id}>
                Safe {l.lockerNumber} ({l.branchName.split('-')[0].trim()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Security Monitoring Banner */}
      <div className="p-4 bg-[#102544] text-white rounded-xl shadow-bank-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#0B1730]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#008C88]/20 text-[#008C88] flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-white">
              Biometric & Dual Physical Key Integrity: Nominal
            </div>
            <div className="text-slate-300 text-[11px] mt-0.5">
              SMS and email alerts are triggered instantly upon every physical safe door unlocking.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-300 font-mono bg-white/10 px-2.5 py-1 rounded border border-white/10 tabular-nums">
            Total Accesses Recorded: <strong className="text-white">{accessLogs.length}</strong>
          </span>
        </div>
      </div>

      {/* Dispute Alert Banner if just reported */}
      {disputeSuccessTicket && (
        <div className="p-4 bg-rose-50/80 border border-rose-200/80 rounded-xl text-rose-950 space-y-1 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-xs text-[#C83E44]">
            <ShieldAlert className="w-4 h-4 text-[#C83E44]" />
            <span>Emergency Access Dispute Registered ({disputeSuccessTicket})</span>
          </div>
          <p className="text-[11px] text-rose-900 leading-relaxed">
            Your locker has been temporarily placed in restricted status to prevent further access. The branch vigilance team has been tasked with inspecting 4K CCTV and turnstile records. Case status can be tracked under Active Disputes below.
          </p>
        </div>
      )}

      {/* Active Disputes Section if any */}
      {accessDisputes.length > 0 && (
        <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#B7791F]" />
              <h3 className="font-bold text-[#B7791F] text-xs">Active Access Disputes ({accessDisputes.length})</h3>
            </div>
            <span className="text-[10px] font-mono text-[#B7791F] bg-amber-100/80 px-2 py-0.5 rounded font-bold border border-amber-200">
              INVESTIGATION UNDERWAY
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
            {accessDisputes.map(disp => (
              <div key={disp.id} className="p-3.5 bg-white border border-[#E3E8F0] rounded-lg shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#17263C]">{disp.disputeNumber}</span>
                  <StatusBadge status={disp.status} size="sm" />
                </div>
                <div className="text-[#17263C]">
                  <strong>Safe {disp.lockerNumber}</strong> · Entry Date: <span className="font-mono tabular-nums">{disp.accessDate}</span> ({disp.accessTime})
                </div>
                <div className="text-[#66758C] text-[10px]">
                  Reason: {disp.customerReason}
                </div>
                <div className="pt-1.5 border-t border-[#E3E8F0] text-[10px] font-mono text-[#2457A7]">
                  CCTV Audit: {disp.cctvFootageStatus}
                </div>
                {disp.resolutionRemarks && (
                  <div className="p-2 bg-emerald-50 text-[#16845B] rounded text-[10px] font-medium border border-emerald-200/60">
                    Resolution: {disp.resolutionRemarks}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Access Logs Table */}
      <div className="bg-white border border-[#E3E8F0] rounded-xl overflow-hidden shadow-bank-card">
        <div className="px-5 py-3.5 border-b border-[#E3E8F0] flex items-center justify-between bg-white">
          <h3 className="text-xs font-bold text-[#17263C]">
            Access Register History ({filteredLogs.length})
          </h3>
          <span className="text-[#66758C] font-mono text-[11px]">Strongroom Biometric Audit Trail</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F7FA] text-[#66758C] border-b border-[#E3E8F0] text-[10px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Locker #</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4">Operated By</th>
                <th className="py-3 px-4">Operator Mandate</th>
                <th className="py-3 px-4">Authentication Method</th>
                <th className="py-3 px-4">Vault Escort Custodian</th>
                <th className="py-3 px-4 text-right">Security Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E8F0] text-xs">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-[#F5F7FA]/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#17263C] font-mono tabular-nums">{log.date}</div>
                    <div className="text-[10px] text-[#66758C] font-mono tabular-nums">
                      {log.timeIn} - {log.timeOut}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#17263C]">
                    Safe {log.lockerNumber}
                  </td>
                  <td className="py-3 px-4 text-[#17263C]">
                    {log.branchName}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#17263C]">
                    {log.operatedBy}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[11px] font-medium text-[#17263C] bg-[#F5F7FA] border border-[#E3E8F0] px-2 py-0.5 rounded">
                      {log.operatorType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[11px] font-medium text-[#16845B] bg-[#16845B]/10 border border-[#16845B]/20 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                      <UserCheck className="w-3 h-3 text-[#16845B]" />
                      <span>{log.verificationMethod}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#17263C]">
                    <div className="font-medium text-[#17263C]">{log.vaultOfficer}</div>
                    <div className="text-[10px] text-[#66758C] line-clamp-1">{log.remarks}</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedLogForReport(log.id);
                        setReportModalOpen(true);
                      }}
                      className="px-2.5 py-1 text-[11px] font-semibold text-[#C83E44] hover:text-[#C83E44] hover:bg-rose-50 rounded border border-rose-200 transition-colors"
                      title="Report if this visit was not made by you"
                    >
                      Report Incident
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1730]/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-[#E3E8F0] max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#C83E44] font-bold">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-sm">Report Unrecognized Vault Entry</h3>
            </div>
            <p className="text-[#66758C] text-xs leading-relaxed">
              If you or your authorized joint holder did not execute this vault operation, please report it immediately. The bank will place an instantaneous emergency freeze on the locker and pull CCTV recordings.
            </p>

            <div>
              <label className="block font-semibold text-[#17263C] mb-1">
                Statement / Observations
              </label>
              <textarea
                rows={3}
                value={reportReason}
                onChange={e => setReportReason(e.target.value)}
                placeholder="State why this access is disputed..."
                required
                className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2.5 text-[#17263C] text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-[#66758C] hover:bg-[#F5F7FA] rounded-lg border border-[#E3E8F0]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReportSuspicious}
                className="px-4 py-1.5 bg-[#C83E44] text-white text-xs font-semibold rounded-lg hover:bg-rose-800 shadow-xs transition-colors"
              >
                Confirm & Freeze Safe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Step-Up Modal */}
      <OtpModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onSuccess={handleOtpSuccess}
        title="Emergency Security Incident Step-Up"
        actionDescription="Freezing locker access and raising urgent audit investigation"
      />

    </div>
  );
};
