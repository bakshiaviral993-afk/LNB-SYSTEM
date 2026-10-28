import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { OtpModal } from '../common/OtpModal';
import { DocumentModal } from '../common/DocumentModal';
import { StoredDocument } from '../../types';
import {
  XCircle,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Key,
  Landmark,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const LockerClosure: React.FC = () => {
  const {
    lockers,
    initiateClosure,
    bookAppointment,
    selectedLockerId,
    setSelectedLockerId,
    documents
  } = useBanking();

  const customerLockers = lockers.filter(l => l.customerId === 'cust-rahul-01');
  const [targetLockerId, setTargetLockerId] = useState<string>(selectedLockerId || customerLockers[0]?.id || 'lck-125');
  const [reason, setReason] = useState('Relocating to another city');
  const [closureDate, setClosureDate] = useState('2026-10-28');
  const [closureSlot, setClosureSlot] = useState('11:00 AM - 11:30 AM');
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [initiatedTicket, setInitiatedTicket] = useState<string | null>(null);
  const [viewDoc, setViewDoc] = useState<StoredDocument | null>(null);
  const [closureError, setClosureError] = useState<string | null>(null);

  const targetLocker = lockers.find(l => l.id === targetLockerId) || customerLockers[0];
  const hasDues = (targetLocker?.outstandingRent || 0) > 0;

  const handleClosureClick = (e: React.FormEvent) => {
    e.preventDefault();
    setClosureError(null);
    if (hasDues) {
      setClosureError('Please settle outstanding renewal dues before initiating formal locker surrender.');
      return;
    }
    setIsOtpOpen(true);
  };

  const handleOtpSuccess = () => {
    const ticket = initiateClosure(targetLocker.id, reason);
    bookAppointment({
      customerId: 'cust-rahul-01',
      customerName: 'Rahul Sharma',
      lockerId: targetLocker.id,
      lockerNumber: targetLocker.lockerNumber,
      branchId: targetLocker.branchId,
      branchName: targetLocker.branchName,
      date: closureDate,
      timeSlot: closureSlot,
      purpose: 'Locker Surrender',
      accompanyingPersons: 0,
      specialInstructions: `Key handover & final chamber clearance inspection under ticket ${ticket}`,
    });
    setInitiatedTicket(ticket);
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* Title */}
      <div className="pb-3 border-b border-[#E3E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#17263C]">
              Locker Surrender & Security Deposit Settlement
            </h1>
            <span className="text-[10px] font-bold text-[#2457A7] bg-[#2457A7]/10 border border-[#2457A7]/20 px-2 py-0.5 rounded tracking-wide uppercase">
              Settlement Desk
            </span>
          </div>
          <p className="text-[#66758C] text-xs mt-1">
            Orderly surrender workflow, physical key handover verification, chamber clearance certificate, and linked FD lien release
          </p>
        </div>
      </div>

      {closureError && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-[#C83E44] rounded-xl flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#C83E44] shrink-0" />
            <span className="font-semibold">{closureError}</span>
          </div>
          <button onClick={() => setClosureError(null)} className="text-xs underline hover:no-underline">Dismiss</button>
        </div>
      )}

      {initiatedTicket ? (
        <div className="max-w-2xl mx-auto bg-white border border-emerald-200/80 rounded-xl p-6 shadow-bank-card space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100/80 flex items-center justify-center text-[#16845B]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#17263C]">
                Surrender Notice Registered Successfully
              </h2>
              <span className="text-xs font-mono text-[#66758C]">
                Ticket Reference: {initiatedTicket}
              </span>
            </div>
          </div>

          <p className="text-[#17263C] text-xs leading-relaxed">
            Your surrender appointment has been confirmed for <strong>{closureDate}</strong> at <strong>{closureSlot}</strong> at {targetLocker.branchName}.
          </p>

          <div className="p-4 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg space-y-2 text-xs">
            <span className="font-bold text-[#102544] block">Surrender Appointment Checklist:</span>
            <ul className="list-disc pl-4 space-y-1 text-[#17263C]">
              <li>Carry the original physical Locker Key (Serial #{targetLocker.keyNumber || 'K-8820A'}).</li>
              <li>Present Government Photo ID (Aadhaar / Passport).</li>
              <li>Both joint holders must attend if operating mandate is &quot;Jointly&quot;.</li>
              <li>Vacate all personal valuables from the compartment during the inspection.</li>
              <li>Security deposit of <strong className="font-mono text-[#16845B]">₹{targetLocker.securityDeposit.toLocaleString('en-IN')}</strong> will be credited directly to your savings account upon signing the clearance certificate.</li>
            </ul>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setInitiatedTicket(null)}
              className="px-5 py-2 bg-[#102544] text-white font-semibold text-xs rounded-lg hover:bg-[#0B1730] shadow-xs transition-colors"
            >
              Back to Surrender Overview
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Surrender Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-[#E3E8F0] rounded-xl p-6 shadow-bank-card space-y-5">
            <h2 className="text-sm font-bold text-[#17263C] flex items-center gap-2 border-b border-[#E3E8F0] pb-3">
              <XCircle className="w-4 h-4 text-[#C83E44]" />
              <span>Initiate Safe Deposit Locker Surrender</span>
            </h2>

            <form onSubmit={handleClosureClick} className="space-y-4">
              <div>
                <label className="block font-semibold text-[#17263C] mb-1.5">
                  Select Locker to Surrender
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {customerLockers.map(lkr => (
                    <div
                      key={lkr.id}
                      onClick={() => {
                        setTargetLockerId(lkr.id);
                        setSelectedLockerId(lkr.id);
                      }}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                        targetLockerId === lkr.id
                          ? 'border-[#102544] bg-[#102544] text-white shadow-xs'
                          : 'border-[#E3E8F0] bg-white text-[#17263C] hover:border-[#102544]/30'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span>Safe {lkr.lockerNumber}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${targetLockerId === lkr.id ? 'bg-white/20 text-white' : 'bg-[#F5F7FA] text-[#66758C] border border-[#E3E8F0]'}`}>
                          {lkr.size}
                        </span>
                      </div>
                      <div className={`text-[11px] mt-1 ${targetLockerId === lkr.id ? 'text-slate-300' : 'text-[#66758C]'}`}>
                        {lkr.branchName}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dues Warning if present */}
              {hasDues && (
                <div className="p-3.5 bg-rose-50/80 border border-rose-200/80 rounded-lg text-rose-950 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-[#C83E44] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-[#C83E44] block">Outstanding Rental Dues: ₹{targetLocker.outstandingRent?.toLocaleString('en-IN')}</span>
                    Please clear all outstanding rent under Rent & Payments tab before submitting surrender notice.
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-[#17263C] mb-1">
                  Reason for Surrendering Locker
                </label>
                <select
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2 font-medium text-[#17263C] text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
                >
                  <option value="Relocating to another city">Relocating to another city / abroad</option>
                  <option value="No longer require safe custody storage">No longer require safe custody storage</option>
                  <option value="Consolidating lockers at another branch">Consolidating lockers at another branch</option>
                  <option value="Rental tariff optimization">Rental tariff optimization</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#17263C] mb-1">
                    Scheduled Handover Date
                  </label>
                  <input
                    type="date"
                    value={closureDate}
                    min="2026-10-24"
                    onChange={e => setClosureDate(e.target.value)}
                    required
                    className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2 font-mono text-[#17263C] text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#17263C] mb-1">
                    Strongroom Slot
                  </label>
                  <select
                    value={closureSlot}
                    onChange={e => setClosureSlot(e.target.value)}
                    className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2 font-medium text-[#17263C] text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
                  >
                    <option value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM</option>
                    <option value="11:00 AM - 11:30 AM">11:00 AM - 11:30 AM</option>
                    <option value="02:30 PM - 03:00 PM">02:30 PM - 03:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg text-xs text-[#17263C]">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input type="checkbox" required defaultChecked className="mt-0.5 rounded border-[#E3E8F0] text-[#102544] focus:ring-[#102544]" />
                  <span className="leading-relaxed">
                    I confirm that I hold the original physical locker key and agree to hand over the compartment in undamaged condition.
                  </span>
                </label>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={hasDues}
                  className="px-6 py-2.5 bg-[#102544] text-white font-semibold text-xs rounded-lg hover:bg-[#0B1730] disabled:opacity-50 transition-colors shadow-xs"
                >
                  Confirm Surrender Notice & Schedule Appointment
                </button>
              </div>
            </form>
          </div>

          {/* Deposit Settlement Summary (5 Cols) */}
          <div className="lg:col-span-5 bg-[#F5F7FA] border border-[#E3E8F0] rounded-xl p-6 shadow-bank-card space-y-4">
            <h3 className="font-bold text-[#17263C] text-sm border-b border-[#E3E8F0] pb-2">
              Security Deposit Settlement Preview
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#66758C]">Locker Account:</span>
                <span className="font-bold text-[#17263C] font-mono">
                  Safe {targetLocker.lockerNumber} ({targetLocker.size})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#66758C]">Linked Term Deposit:</span>
                <span className="font-mono text-[#17263C]">FD-88219001</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#66758C]">Refundable Deposit:</span>
                <span className="font-mono font-bold text-[#17263C] tabular-nums">
                  ₹{targetLocker.securityDeposit.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#66758C]">Outstanding Dues:</span>
                <span className={`font-mono font-bold tabular-nums ${hasDues ? 'text-[#C83E44]' : 'text-[#17263C]'}`}>
                  ₹{(targetLocker.outstandingRent || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#66758C]">Credit Destination A/c:</span>
                <span className="font-mono text-[#17263C]">5010049281720</span>
              </div>

              <div className="pt-3 border-t border-[#E3E8F0] flex justify-between font-bold text-sm text-[#17263C]">
                <span>Net Refundable Amount</span>
                <span className="font-mono text-[#16845B] tabular-nums">
                  ₹{(targetLocker.securityDeposit - (targetLocker.outstandingRent || 0)).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-white border border-[#E3E8F0] rounded-lg text-xs text-[#66758C] leading-relaxed shadow-xs">
              Upon physical key handover and locker inspection by the Vault Custodian, the bank lien on the Term Deposit will be extinguished immediately and the amount will be unlocked into your Premier Savings Account.
            </div>
          </div>

        </div>
      )}

      {/* OTP Step-Up Modal for Surrender */}
      <OtpModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onSuccess={handleOtpSuccess}
        title="Authorize Locker Surrender Notice"
        actionDescription={`Initiating closure notice for Locker ${targetLocker?.lockerNumber}`}
      />

      {/* Document Modal */}
      <DocumentModal
        document={viewDoc}
        onClose={() => setViewDoc(null)}
      />

    </div>
  );
};
