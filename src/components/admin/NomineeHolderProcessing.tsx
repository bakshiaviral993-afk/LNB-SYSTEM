import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { StatusBadge } from '../common/StatusBadge';
import { DocumentModal } from '../common/DocumentModal';
import { Nominee, StoredDocument } from '../../types';
import {
  Users,
  CheckCircle2,
  XCircle,
  FileText,
  Shield,
  Search,
  AlertCircle
} from 'lucide-react';

export const NomineeHolderProcessing: React.FC = () => {
  const { nominees, adminApproveNominee, adminRejectNominee, lockers, documents } = useBanking();
  const [viewDoc, setViewDoc] = useState<StoredDocument | null>(null);

  // Flatten all nominees across lockers
  const allNomineesList: { lockerId: string; lockerNum: string; nominee: Nominee }[] = [];
  Object.entries(nominees).forEach(([lkrId, list]) => {
    const lkr = lockers.find(l => l.id === lkrId);
    list.forEach(nom => {
      allNomineesList.push({
        lockerId: lkrId,
        lockerNum: lkr?.lockerNumber || 'A-125',
        nominee: nom,
      });
    });
  });

  const pendingNominees = allNomineesList.filter(n => n.nominee.status === 'Pending Approval');

  const openFormDa1 = (ref: string) => {
    const doc = documents.find(d => d.documentRef === ref) || {
      id: `doc-${ref}`,
      title: `Form DA-1 Nomination Endorsement`,
      category: 'Nomination Form DA-1' as const,
      issueDate: 'Today',
      fileSize: '510 KB',
      documentRef: ref,
      signedStatus: 'Digitally e-Signed' as const,
    };
    setViewDoc(doc);
  };

  return (
    <div className="space-y-6">
      
      {/* Enterprise Page Header */}
      <div className="bg-white rounded-xl border border-[#E3E8F0] shadow-bank-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#102544]/5 text-[#102544] border border-[#102544]/15">
              Section 45ZA • Banking Regulation Act, 1949
            </span>
            <span className="text-xs text-[#66758C]">Dual Scrutiny Desk • Maker-Checker</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#17263C]">
            Nomination (Form DA-1) & Mandate Scrutiny Desk
          </h1>
          <p className="text-xs text-[#66758C] mt-1">
            Maker-checker verification of safe deposit locker nominations, specimen signatures, and statutory Form DA-1 acknowledgement issuance.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F5F7FA] border border-[#E3E8F0] text-xs font-mono text-[#102544]">
          <Shield className="w-4 h-4 text-[#2457A7]" />
          <span>Pending Mandates: {pendingNominees.length}</span>
        </div>
      </div>

      {/* Pending Approvals Queue */}
      <div className="bg-white border border-[#E3E8F0] rounded-xl overflow-hidden shadow-bank-card">
        <div className="p-5 border-b border-[#E3E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-[#17263C] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B7791F]"></span>
              Pending Nomination Scrutiny Queue ({pendingNominees.length})
            </h3>
            <p className="text-xs text-[#66758C] mt-0.5">
              Verify customer signature card on CBS before endorsing Form DA-1 acknowledgement
            </p>
          </div>
        </div>

        <div className="p-5">
          {pendingNominees.length === 0 ? (
            <div className="p-8 text-center bg-[#F5F7FA] rounded-xl border border-dashed border-[#E3E8F0]">
              <CheckCircle2 className="w-8 h-8 text-[#16845B] mx-auto mb-2 opacity-80" />
              <p className="text-xs font-semibold text-[#17263C]">All Nomination Submissions Cleared</p>
              <p className="text-xs text-[#66758C] mt-0.5">No pending Form DA-1 requests awaiting maker verification.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingNominees.map(item => (
                <div
                  key={item.nominee.id}
                  className="p-4 bg-[#F5F7FA] rounded-xl border border-[#E3E8F0] flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-[#17263C] text-sm">{item.nominee.name}</span>
                      <span className="text-[11px] bg-[#2457A7]/10 text-[#2457A7] border border-[#2457A7]/20 px-2 py-0.5 rounded font-mono font-medium">
                        {item.nominee.relationship}
                      </span>
                      <StatusBadge status={item.nominee.status} size="sm" />
                    </div>
                    <div className="text-xs text-[#66758C] flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span>Locker: <strong className="text-[#17263C] font-mono">Locker #{item.lockerNum}</strong></span>
                      <span>•</span>
                      <span>Ref: <strong className="font-mono text-[#102544]">{item.nominee.formDa1Reference}</strong></span>
                      <span>•</span>
                      <span>DOB: <strong className="text-[#17263C] font-mono">{item.nominee.dateOfBirth}</strong></span>
                    </div>
                    <div className="text-[11px] text-[#66758C] font-mono">
                      Registered On: {item.nominee.registeredOn} • Hirer Contact: {item.nominee.phone}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      onClick={() => openFormDa1(item.nominee.formDa1Reference)}
                      className="px-3 py-1.5 text-xs font-semibold text-[#2457A7] bg-white border border-[#E3E8F0] hover:bg-slate-50 rounded-lg shadow-xs transition-colors"
                    >
                      Inspect Form DA-1
                    </button>
                    <button
                      onClick={() => adminRejectNominee(item.nominee.id, item.lockerId)}
                      className="px-3 py-1.5 border border-[#C83E44]/30 text-[#C83E44] hover:bg-[#C83E44]/10 rounded-lg font-semibold text-xs transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => adminApproveNominee(item.nominee.id, item.lockerId)}
                      className="px-4 py-1.5 bg-[#102544] hover:bg-[#0B1730] text-white rounded-lg font-semibold text-xs shadow-xs transition-colors"
                    >
                      Approve & Endorse
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* All Registered Nominees Register */}
      <div className="bg-white border border-[#E3E8F0] rounded-xl overflow-hidden shadow-bank-card">
        <div className="p-5 border-b border-[#E3E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-[#17263C]">
              Master Form DA-1 Register ({allNomineesList.length})
            </h3>
            <p className="text-xs text-[#66758C] mt-0.5">
              Complete repository of valid and archived safe deposit nomination mandates
            </p>
          </div>
          <span className="text-xs text-[#66758C] font-mono">
            Audit Archive Retention: 8 Years
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F5F7FA] text-[#66758C] border-b border-[#E3E8F0] uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-3 px-4">Form DA-1 Ref</th>
                <th className="py-3 px-4">Locker #</th>
                <th className="py-3 px-4">Nominee Name</th>
                <th className="py-3 px-4">Relationship</th>
                <th className="py-3 px-4">DOB & Minor Status</th>
                <th className="py-3 px-4">Registration Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Acknowledgement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E8F0]">
              {allNomineesList.map(item => (
                <tr key={item.nominee.id} className="hover:bg-[#F5F7FA] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#17263C]">
                    {item.nominee.formDa1Reference}
                  </td>
                  <td className="py-3.5 px-4 font-bold font-mono text-[#2457A7]">
                    Locker #{item.lockerNum}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#17263C]">
                    {item.nominee.name}
                  </td>
                  <td className="py-3.5 px-4 text-[#17263C]">
                    {item.nominee.relationship}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#66758C]">
                    {item.nominee.dateOfBirth} ({item.nominee.isMinor ? 'Minor' : 'Major'})
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#66758C]">
                    {item.nominee.registeredOn}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <StatusBadge status={item.nominee.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => openFormDa1(item.nominee.formDa1Reference)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#2457A7] hover:bg-[#2457A7]/10 rounded-md transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      View DA-1
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Modal */}
      <DocumentModal
        document={viewDoc}
        onClose={() => setViewDoc(null)}
      />

    </div>
  );
};
