import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import {
  Hammer,
  AlertTriangle,
  FileText,
  Users,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  FileCheck,
  Video,
  Key,
  Archive,
  Download,
  AlertCircle
} from 'lucide-react';
import { LockerItem } from '../../types';

export const BreakOpenManagement: React.FC = () => {
  const {
    lockers,
    adminUpdateLockerStatus,
    currentUser,
    branches
  } = useBanking();

  const [selectedBranch, setSelectedBranch] = useState('all');
  const [activeTab, setActiveTab] = useState<'eligible' | 'in_progress' | 'executed'>('eligible');
  const [searchQuery, setSearchQuery] = useState('');
  const [noticeModalLocker, setNoticeModalLocker] = useState<any | null>(null);
  const [executionModalLocker, setExecutionModalLocker] = useState<any | null>(null);

  // Form states for execution
  const [committeeMembers, setCommitteeMembers] = useState({
    branchManager: currentUser.name,
    independentValuer: 'R. K. Sharma (Govt Approved Valuer Reg #V-4421)',
    notaryPublic: 'Adv. S. K. Mahajan (Notary Reg #NT-8812)',
    locksmith: 'Godrej Security Field Specialist ID #GS-901'
  });
  const [videoLogUrl, setVideoLogUrl] = useState('SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  const [contentsSummary, setContentsSummary] = useState('Sealed tamper-evident pouch containing personal documents, 2 certified envelopes, no contraband.');
  const [executionSuccess, setExecutionSuccess] = useState<string | null>(null);

  // Helper to resolve customer name
  const getCustomerName = (customerId?: string) => {
    if (!customerId) return 'Unallocated / Vacant';
    if (customerId === 'cust-rahul-01') return 'Rahul Sharma';
    if (customerId === 'cust-anita-02') return 'Anita Verma';
    if (customerId === 'cust-vikram-03') return 'Vikram Malhotra';
    return `Hirer (${customerId})`;
  };

  // Track break open lifecycle stages locally and via locker.status
  const breakOpenCases = lockers.map(l => {
    const isOverdue = (l.outstandingRent || 0) >= 15000;
    const isBlocked = l.status === 'Blocked';
    const isMaintenance = l.status === 'Under Maintenance';
    const customerName = getCustomerName(l.customerId);

    return {
      ...l,
      customerName,
      isOverdue,
      noticeStage: isMaintenance
        ? 'Physical Break-Open Executed'
        : isBlocked
        ? 'Final Gazette Published (90-Day Expired)'
        : isOverdue
        ? 'Notice 1 Dispatched'
        : 'Inspection Required'
    };
  });

  const filteredCases = breakOpenCases.filter(c => {
    if (selectedBranch !== 'all' && c.branchId !== selectedBranch) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchNum = c.lockerNumber.toLowerCase().includes(q);
      const matchCust = c.customerName.toLowerCase().includes(q);
      if (!matchNum && !matchCust) return false;
    }
    if (activeTab === 'eligible') {
      return (c.isOverdue || c.status === 'Occupied') && c.status !== 'Blocked' && c.status !== 'Under Maintenance';
    }
    if (activeTab === 'in_progress') {
      return c.status === 'Blocked';
    }
    if (activeTab === 'executed') {
      return c.status === 'Under Maintenance';
    }
    return true;
  });

  const handleInitiateNotice = (locker: any) => {
    adminUpdateLockerStatus(locker.id, 'Blocked');
    setNoticeModalLocker(null);
    setExecutionSuccess(`Statutory legal notice issued & Locker ${locker.lockerNumber} locked under foreclosure status.`);
    setTimeout(() => setExecutionSuccess(null), 4000);
  };

  const handleExecuteBreakOpen = (lockerId: string) => {
    adminUpdateLockerStatus(lockerId, 'Under Maintenance');
    setExecutionModalLocker(null);
    setExecutionSuccess(`Locker ${executionModalLocker?.lockerNumber} broken open under 3-member committee and safe custody seal applied.`);
    setTimeout(() => setExecutionSuccess(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-[#E3E8F0] p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-[#C83E44]/10 text-[#C83E44] flex items-center justify-center font-bold">
                <Hammer className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-[#102544] tracking-tight">
                  Statutory Break-Open & Foreclosure Protocol
                </h1>
                <p className="text-xs text-[#66758C]">
                  RBI Master Circular RBI/2021-2022/86: Delinquent lockers, untraceable hirers & lost keys committee protocol
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#66758C]">Branch Filter:</span>
            <select
              value={selectedBranch}
              onChange={e => setSelectedBranch(e.target.value)}
              className="bg-[#F5F7FA] border border-[#E3E8F0] text-xs font-semibold rounded-lg px-3 py-1.5 text-[#102544] focus:outline-none focus:border-[#2457A7]"
            >
              <option value="all">All Controlled Branches</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Workflow Compliance Steps */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-4 gap-3 pt-4 border-t border-[#E3E8F0] text-xs">
          <div className="p-3 bg-[#F5F7FA] rounded-lg border border-[#E3E8F0]">
            <div className="flex items-center gap-2 font-bold text-[#102544]">
              <span className="w-5 h-5 rounded-full bg-[#102544] text-white flex items-center justify-center text-[10px]">1</span>
              <span>Notice Dispatch</span>
            </div>
            <p className="text-[11px] text-[#66758C] mt-1">
              Registered Post A.D. sent to last recorded address + 2 reminders.
            </p>
          </div>
          <div className="p-3 bg-[#F5F7FA] rounded-lg border border-[#E3E8F0]">
            <div className="flex items-center gap-2 font-bold text-[#102544]">
              <span className="w-5 h-5 rounded-full bg-[#102544] text-white flex items-center justify-center text-[10px]">2</span>
              <span>Gazette Publication</span>
            </div>
            <p className="text-[11px] text-[#66758C] mt-1">
              Public notice in 2 daily newspapers (English & regional language).
            </p>
          </div>
          <div className="p-3 bg-[#F5F7FA] rounded-lg border border-[#E3E8F0]">
            <div className="flex items-center gap-2 font-bold text-[#102544]">
              <span className="w-5 h-5 rounded-full bg-[#102544] text-white flex items-center justify-center text-[10px]">3</span>
              <span>Committee Presence</span>
            </div>
            <p className="text-[11px] text-[#66758C] mt-1">
              BM, Independent Notary & Govt Valuer with HD video recording.
            </p>
          </div>
          <div className="p-3 bg-[#F5F7FA] rounded-lg border border-[#E3E8F0]">
            <div className="flex items-center gap-2 font-bold text-[#102544]">
              <span className="w-5 h-5 rounded-full bg-[#102544] text-white flex items-center justify-center text-[10px]">4</span>
              <span>Sealed Inventory</span>
            </div>
            <p className="text-[11px] text-[#66758C] mt-1">
              Tamper-evident sealed bag stored in strongroom dual-custody.
            </p>
          </div>
        </div>
      </div>

      {executionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{executionSuccess}</span>
        </div>
      )}

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#E3E8F0]">
        <div className="flex items-center gap-1 bg-[#F5F7FA] p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('eligible')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeTab === 'eligible'
                ? 'bg-[#102544] text-white shadow-xs'
                : 'text-[#66758C] hover:text-[#102544]'
            }`}
          >
            Eligible for Foreclosure ({breakOpenCases.filter(c => (c.isOverdue || c.status === 'Occupied') && c.status !== 'Blocked' && c.status !== 'Under Maintenance').length})
          </button>
          <button
            onClick={() => setActiveTab('in_progress')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeTab === 'in_progress'
                ? 'bg-[#102544] text-white shadow-xs'
                : 'text-[#66758C] hover:text-[#102544]'
            }`}
          >
            Under Statutory Notice ({breakOpenCases.filter(c => c.status === 'Blocked').length})
          </button>
          <button
            onClick={() => setActiveTab('executed')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeTab === 'executed'
                ? 'bg-[#102544] text-white shadow-xs'
                : 'text-[#66758C] hover:text-[#102544]'
            }`}
          >
            Executed / Sealed ({breakOpenCases.filter(c => c.status === 'Under Maintenance').length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#66758C] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search locker or customer..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#F5F7FA] border border-[#E3E8F0] text-xs rounded-lg text-[#102544] placeholder-[#66758C] focus:outline-none focus:border-[#2457A7]"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-[#E3E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F5F7FA] border-b border-[#E3E8F0] text-[#66758C] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Locker & Branch</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Outstanding Arrears</th>
                <th className="py-3 px-4">Overdue Duration</th>
                <th className="py-3 px-4">Statutory Status</th>
                <th className="py-3 px-4 text-right">Committee Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E8F0]">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#66758C]">
                    No locker records currently in this break-open phase.
                  </td>
                </tr>
              ) : (
                filteredCases.map(locker => {
                  return (
                    <tr key={locker.id} className="hover:bg-[#F5F7FA]/75 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#102544] font-mono text-sm">
                          {locker.lockerNumber}
                        </div>
                        <div className="text-[11px] text-[#66758C]">
                          {branches.find(b => b.id === locker.branchId)?.name || 'Branch'} · {locker.size}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#102544]">
                          {locker.customerName}
                        </div>
                        <div className="text-[11px] text-[#66758C] font-mono">
                          {locker.customerId || 'CIF-UNKNOWN'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#C83E44] font-mono">
                          ₹{(locker.outstandingRent || 0).toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-[#66758C]">
                          Annual Rent: ₹{locker.annualRent.toLocaleString('en-IN')}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#17263C]">
                          {(locker.outstandingRent || 0) >= 20000 ? '3+ Years Default' : '18 Months Default'}
                        </span>
                        <div className="text-[10px] text-[#66758C]">
                          Last Access: 420+ days ago
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          locker.status === 'Under Maintenance'
                            ? 'bg-purple-100 text-purple-800'
                            : locker.status === 'Blocked'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {locker.noticeStage}
                        </span>
                        <div className="text-[10px] text-[#66758C] mt-0.5">
                          Status: {locker.status}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {activeTab === 'eligible' && (
                          <button
                            onClick={() => setNoticeModalLocker(locker)}
                            className="px-3 py-1.5 bg-[#102544] hover:bg-[#0B1730] text-white font-semibold rounded-lg text-xs transition-colors shadow-xs"
                          >
                            Serve Legal Notice
                          </button>
                        )}
                        {activeTab === 'in_progress' && (
                          <button
                            onClick={() => setExecutionModalLocker(locker)}
                            className="px-3 py-1.5 bg-[#C83E44] hover:bg-[#a82d33] text-white font-semibold rounded-lg text-xs transition-colors shadow-xs flex items-center gap-1.5 ml-auto"
                          >
                            <Hammer className="w-3.5 h-3.5" />
                            Execute Break-Open
                          </button>
                        )}
                        {activeTab === 'executed' && (
                          <button
                            onClick={() => alert(`Sealed Inventory Dossier #${locker.lockerNumber}\nLocation: Strongroom Safe Custody Bin #SC-${locker.lockerNumber}\nVideo Digest: SHA256-OK\nCommittee Sign-Off: Complete`)}
                            className="px-3 py-1.5 bg-[#F5F7FA] hover:bg-[#E3E8F0] text-[#102544] font-semibold rounded-lg text-xs border border-[#E3E8F0] transition-colors"
                          >
                            View Inventory Seal
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Initiate Legal Notice */}
      {noticeModalLocker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1730]/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-[#E3E8F0] max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#102544]">
                  Issue Statutory Foreclosure Notice
                </h3>
                <p className="text-xs text-[#66758C]">
                  Locker {noticeModalLocker.lockerNumber} · Hirer: {noticeModalLocker.customerName}
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#F5F7FA] rounded-xl text-xs space-y-2 border border-[#E3E8F0]">
              <div className="flex justify-between">
                <span className="text-[#66758C]">Accumulated Arrears:</span>
                <span className="font-bold text-[#C83E44]">₹{noticeModalLocker.outstandingRent?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66758C]">Statutory Notice Period:</span>
                <span className="font-semibold text-[#102544]">90 Days Mandatory</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66758C]">Public Notice Media:</span>
                <span className="font-semibold text-[#102544]">Economic Times & Regional Daily</span>
              </div>
            </div>

            <p className="text-[11px] text-[#66758C] leading-relaxed">
              By confirming, registered dispatch slip #RPAD-{noticeModalLocker.lockerNumber}-2026 will be stamped and locker status will shift to <strong>Blocked (Foreclosure Notice)</strong> under legal oversight.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setNoticeModalLocker(null)}
                className="px-4 py-2 text-xs font-semibold text-[#66758C] hover:bg-[#F5F7FA] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleInitiateNotice(noticeModalLocker)}
                className="px-4 py-2 text-xs font-bold bg-[#102544] hover:bg-[#0B1730] text-white rounded-lg shadow-xs transition-colors"
              >
                Dispatch Statutory Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Execute Physical Break-Open */}
      {executionModalLocker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1730]/75 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-[#E3E8F0] max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                <Hammer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#102544]">
                  Physical Break-Open & Valuation Record
                </h3>
                <p className="text-xs text-[#66758C]">
                  Locker {executionModalLocker.lockerNumber} · Dual-Custody Committee Sign-off
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#17263C] mb-1">
                  1. Statutory Committee Constitution (RBI Mandatory)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={committeeMembers.branchManager}
                    onChange={e => setCommitteeMembers({ ...committeeMembers, branchManager: e.target.value })}
                    className="p-2 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg text-xs"
                    placeholder="Branch Manager"
                  />
                  <input
                    type="text"
                    value={committeeMembers.notaryPublic}
                    onChange={e => setCommitteeMembers({ ...committeeMembers, notaryPublic: e.target.value })}
                    className="p-2 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg text-xs"
                    placeholder="Notary Public / Gazetted Officer"
                  />
                  <input
                    type="text"
                    value={committeeMembers.independentValuer}
                    onChange={e => setCommitteeMembers({ ...committeeMembers, independentValuer: e.target.value })}
                    className="p-2 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg text-xs"
                    placeholder="Govt Approved Valuer"
                  />
                  <input
                    type="text"
                    value={committeeMembers.locksmith}
                    onChange={e => setCommitteeMembers({ ...committeeMembers, locksmith: e.target.value })}
                    className="p-2 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg text-xs"
                    placeholder="Certified Locksmith"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#17263C] mb-1">
                  2. Tamper-Proof Video Recording SHA-256 Hash
                </label>
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#66758C] shrink-0" />
                  <input
                    type="text"
                    value={videoLogUrl}
                    onChange={e => setVideoLogUrl(e.target.value)}
                    className="w-full p-2 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#17263C] mb-1">
                  3. Locker Inventory & Safe Custody Summary
                </label>
                <textarea
                  rows={2}
                  value={contentsSummary}
                  onChange={e => setContentsSummary(e.target.value)}
                  className="w-full p-2 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>
                Irreversible Action: Physical lever locks will be drilled. Tamper-evident container moved to Safe Custody Bin with an indelible audit marker.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setExecutionModalLocker(null)}
                className="px-4 py-2 text-xs font-semibold text-[#66758C] hover:bg-[#F5F7FA] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleExecuteBreakOpen(executionModalLocker.id)}
                className="px-4 py-2 text-xs font-bold bg-[#C83E44] hover:bg-[#a82d33] text-white rounded-lg shadow-xs transition-colors flex items-center gap-2"
              >
                <Hammer className="w-4 h-4" />
                Sign & Finalize Break-Open
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
