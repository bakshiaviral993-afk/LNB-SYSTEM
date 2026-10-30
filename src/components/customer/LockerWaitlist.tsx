import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { WaitingListEntry } from '../../types';
import {
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Bell,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  XCircle,
  FileText,
  Info,
  Building
} from 'lucide-react';

export const LockerWaitlist: React.FC = () => {
  const { waitingList, branches, setCustomerView } = useBanking();
  const [selectedEntry, setSelectedEntry] = useState<WaitingListEntry | null>(null);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawalSuccess, setWithdrawalSuccess] = useState<string | null>(null);

  // STRICT DATA ISOLATION: Show ONLY the authenticated customer's waitlist entries!
  // Rahul Sharma: cust-rahul-01 / CIF-9028192831
  const customerWaitlist = waitingList.filter(
    w => w.customerId === 'cust-rahul-01' || w.cifNumber === 'CIF-9028192831'
  );

  const handleWithdraw = (entry: WaitingListEntry) => {
    setWithdrawalSuccess(`Waitlist Token ${entry.waitlistNumber || entry.waitlistCode} has been withdrawn successfully. Priority capacity released.`);
    setWithdrawModalOpen(false);
    setSelectedEntry(null);
  };

  return (
    <div className="space-y-4 pb-20 text-xs text-[#17263C]">
      
      {/* Top Banner */}
      <div className="bg-[#102544] text-white p-4 rounded-2xl shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#008C88] animate-pulse" />
            <span className="text-[11px] font-mono font-semibold tracking-wide text-white/80">
              RBI TRANSPARENT ALLOTMENT MANDATE
            </span>
          </div>
          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-mono text-white/90">
            {customerWaitlist.length} Active Positions
          </span>
        </div>
        <h1 className="text-lg font-extrabold tracking-tight text-white">
          Locker Waitlist
        </h1>
        <p className="text-[11px] text-white/70 leading-relaxed">
          Transparent, automated queue management. When existing lockers are surrendered or new sub-vault chambers commissioned, allocations are made strictly according to waitlist timestamp and priority status.
        </p>
      </div>

      {withdrawalSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{withdrawalSuccess}</span>
          </div>
          <button
            onClick={() => setWithdrawalSuccess(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold ml-2 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Customer Waitlist Cards */}
      {customerWaitlist.length === 0 ? (
        <div className="bg-white border border-[#E3E8F0] rounded-2xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-[#66758C]">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-[#102544]">No Active Waitlist Tokens</h3>
          <p className="text-xs text-[#66758C] max-w-sm mx-auto">
            You do not currently have any pending locker waitlist registrations under CIF-9028192831.
          </p>
          <button
            onClick={() => setCustomerView('find')}
            className="px-4 py-2 bg-[#102544] text-white text-xs font-semibold rounded-xl hover:bg-[#0B1730] shadow-xs"
          >
            Browse Available Vaults →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {customerWaitlist.map(entry => {
            const isOfferSent = entry.status === 'Offer Sent';

            return (
              <div
                key={entry.id}
                className="bg-white border border-[#E3E8F0] rounded-2xl p-4 shadow-bank-card space-y-3 relative overflow-hidden transition-all hover:border-[#2457A7]"
              >
                {/* Offer Sent Alert Badge */}
                {isOfferSent && (
                  <div className="bg-amber-500 text-white px-3 py-1 text-[10px] font-bold tracking-wider uppercase -mx-4 -mt-4 mb-2 flex items-center justify-between">
                    <span>⚡ Allotment Offer Generated — Action Required</span>
                    <span className="font-mono">Expires in 6 days</span>
                  </div>
                )}

                {/* Header: Waitlist # & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-sm text-[#102544]">
                        {entry.waitlistNumber || entry.waitlistCode}
                      </span>
                      <span className="text-[10px] font-mono text-[#66758C]">
                        (App: {entry.applicationReference || 'APP-91823'})
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#66758C] mt-0.5">
                      <MapPin className="w-3 h-3 text-[#2457A7]" />
                      <span className="font-medium text-[#17263C]">{entry.branchName}</span>
                      <span>·</span>
                      <span>{entry.city || 'Mumbai'}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      isOfferSent
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-blue-50 text-[#2457A7] border border-blue-200'
                    }`}
                  >
                    {entry.status}
                  </span>
                </div>

                {/* Queue Position & Compartment Specs (Strictly separate fields) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-[#F5F7FA] rounded-xl text-xs">
                  <div>
                    <span className="text-[#66758C] text-[10px] block">Current Position</span>
                    <span className="font-mono font-bold text-sm text-[#102544]">
                      {entry.queuePosition || `#${entry.currentQueuePosition || 1} in Queue`}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#66758C] text-[10px] block">Locker Size</span>
                    <span className="font-semibold text-xs text-[#17263C]">
                      {entry.sizeRequested} Locker
                    </span>
                  </div>

                  <div>
                    <span className="text-[#66758C] text-[10px] block">Requested Date</span>
                    <span className="font-mono text-xs text-[#17263C]">
                      {entry.requestedDate || entry.joinedDate}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#66758C] text-[10px] block">Priority Index</span>
                    <span className="font-mono font-bold text-xs text-emerald-700">
                      {entry.priorityScore || 95}/100 (High)
                    </span>
                  </div>
                </div>

                {/* Offer Action Button if Active */}
                {isOfferSent && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-2">
                    <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>Compartment Allocated at {entry.branchName}</span>
                    </div>
                    <p className="text-[11px] text-emerald-900 leading-relaxed">
                      Locker XL-204 is now reserved for you. Proceed to book your in-branch document execution and key-handover visit.
                    </p>
                    <button
                      onClick={() => setCustomerView('visit')}
                      className="w-full py-2 bg-[#102544] text-white font-bold rounded-lg text-xs hover:bg-[#0B1730] transition-colors flex items-center justify-center gap-2 shadow-xs"
                    >
                      <span>Schedule Key Handover Appointment →</span>
                    </button>
                  </div>
                )}

                {/* Status History Timeline */}
                {entry.statusHistory && entry.statusHistory.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#66758C] block">
                      Status History & Audit Trail
                    </span>
                    <div className="space-y-2 pl-2 border-l-2 border-[#E3E8F0] text-[11px]">
                      {entry.statusHistory.map((step, idx) => (
                        <div key={idx} className="relative pl-3">
                          <span className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-[#2457A7]" />
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#17263C]">{step.status}</span>
                            <span className="font-mono text-[10px] text-[#66758C]">{step.timestamp}</span>
                          </div>
                          <p className="text-[10px] text-[#66758C] mt-0.5">{step.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notifications & Cancellation Footer */}
                <div className="pt-2 border-t border-[#E3E8F0] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#66758C] text-[11px]">
                    <Bell className="w-3.5 h-3.5 text-[#008C88]" />
                    <span>Real-time SMS/Email alerts active</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedEntry(entry);
                      setWithdrawModalOpen(true);
                    }}
                    className="text-xs font-semibold text-[#C83E44] hover:underline flex items-center gap-1"
                  >
                    <span>Withdraw Token</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Withdrawal Confirmation Dialog */}
      {withdrawModalOpen && selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1730]/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-xl border border-[#E3E8F0]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#C83E44] flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#102544]">Withdraw Waitlist Entry?</h3>
                <p className="text-[11px] text-[#66758C] mt-0.5">
                  Token #{selectedEntry.waitlistNumber || selectedEntry.waitlistCode}
                </p>
              </div>
            </div>

            <p className="text-xs text-[#66758C] leading-relaxed">
              Withdrawing will relinquish your priority rank ({selectedEntry.queuePosition || '#2 in Queue'}) at {selectedEntry.branchName}. If you apply again later, a fresh queue position will be generated.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setWithdrawModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-[#E3E8F0] text-xs font-semibold hover:bg-slate-50"
              >
                Keep Position
              </button>
              <button
                onClick={() => handleWithdraw(selectedEntry)}
                className="px-4 py-1.5 bg-[#C83E44] text-white text-xs font-bold rounded-lg hover:bg-red-700 shadow-xs"
              >
                Confirm Withdrawal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
