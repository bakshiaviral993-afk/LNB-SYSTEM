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
  ArrowRight,
  ShieldCheck,
  Building
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

  const customerLockers = lockers.filter(
    l => l.customerId === 'cust-rahul-01' || l.customerName === 'Rahul Sharma'
  );

  // Compute dynamic today's date + 2 days for default handover
  const defaultHandoverDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  })();

  const [targetLockerId, setTargetLockerId] = useState<string>(
    selectedLockerId || customerLockers[0]?.id || 'lck-042'
  );
  const [reason, setReason] = useState('Relocating to another city');
  const [closureDate, setClosureDate] = useState(defaultHandoverDate);
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
    <div className="space-y-4 pb-28 text-xs text-[#1F1420] dark:text-[#FBF4F8]">
      
      {/* Title Header Card */}
      <div className="bg-gradient-to-r from-[#6B0E37] via-[#97144D] to-[#6B0E37] text-white p-4 rounded-3xl shadow-md border border-[#6B0E37]">
        <div className="flex items-center gap-1.5 mb-1.5">
          <XCircle className="w-4 h-4 text-[#FFDF85]" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#FFDF85] font-extrabold">
            SURRENDER & SETTLEMENT DESK
          </span>
        </div>
        <h1 className="text-xl font-black tracking-tight text-white">
          Locker Surrender & Settlement
        </h1>
        <p className="text-xs text-white/80 mt-0.5">
          Orderly surrender workflow, physical key handover inspection, and linked FD security deposit refund credit.
        </p>
      </div>

      {closureError && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-900/40 text-[#C62828] rounded-2xl flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#C62828] shrink-0" />
            <span className="font-bold">{closureError}</span>
          </div>
          <button onClick={() => setClosureError(null)} className="text-xs font-bold p-1">✕</button>
        </div>
      )}

      {initiatedTicket ? (
        <div className="bg-white dark:bg-[#20101D] border border-emerald-300 dark:border-emerald-800 rounded-3xl p-5 shadow-sm space-y-4 text-xs">
          <div className="flex items-center gap-3 border-b border-[#E8DFE5] dark:border-[#381B30] pb-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center text-[#1E8E5A] shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-black text-[#1F1420] dark:text-white">
                Surrender Notice Registered Successfully
              </h2>
              <span className="text-xs font-mono font-bold text-[#97144D] dark:text-[#E895B8]">
                Ticket Reference: {initiatedTicket}
              </span>
            </div>
          </div>

          <p className="text-xs text-[#1F1420] dark:text-white leading-relaxed">
            Your surrender appointment has been confirmed for <strong>{closureDate}</strong> at <strong>{closureSlot}</strong> at {targetLocker.branchName}.
          </p>

          <div className="p-3.5 bg-[#FAF6F8] dark:bg-[#2A1527] border border-[#E8DFE5] dark:border-[#381B30] rounded-2xl space-y-2 text-xs">
            <span className="font-extrabold text-[#1F1420] dark:text-white block">
              Handover Inspection Checklist:
            </span>
            <ul className="list-disc pl-4 space-y-1 text-[#6B5B68] dark:text-[#A898A4]">
              <li>Carry the original physical Locker Key (Serial #{targetLocker.keyNumber || 'K-8820A'}).</li>
              <li>Present Government Photo ID (Aadhaar / Passport).</li>
              <li>Both joint holders must attend if operating mandate is &quot;Jointly&quot;.</li>
              <li>Vacate all personal valuables from the compartment during inspection.</li>
              <li>Security deposit of <strong className="font-mono text-[#1E8E5A]">₹{targetLocker.securityDeposit.toLocaleString('en-IN')}</strong> will be credited directly to your linked savings account upon signing the clearance deed.</li>
            </ul>
          </div>

          <button
            onClick={() => setInitiatedTicket(null)}
            className="w-full h-11 bg-[#97144D] text-white font-bold text-xs rounded-xl hover:bg-[#6B0E37] shadow-xs transition-colors"
          >
            Back to Surrender Overview
          </button>
        </div>
      ) : (
        /* Single column layout on mobile to prevent squashing and line breaking */
        <div className="space-y-4">
          
          {/* Surrender Form */}
          <div className="bg-white dark:bg-[#20101D] border border-[#E8DFE5] dark:border-[#381B30] rounded-3xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-[#1F1420] dark:text-white flex items-center gap-2 border-b border-[#E8DFE5] dark:border-[#381B30] pb-2.5">
              <XCircle className="w-4 h-4 text-[#C62828]" />
              <span>Initiate Safe Deposit Locker Surrender</span>
            </h2>

            <form onSubmit={handleClosureClick} className="space-y-3.5">
              
              {/* Locker selection in clean single column */}
              <div>
                <label className="block text-xs font-bold text-[#6B5B68] dark:text-[#A898A4] mb-1.5">
                  Select Locker to Surrender
                </label>
                <div className="space-y-2">
                  {customerLockers.map(lkr => {
                    const isSelected = targetLockerId === lkr.id;
                    return (
                      <div
                        key={lkr.id}
                        onClick={() => {
                          setTargetLockerId(lkr.id);
                          setSelectedLockerId(lkr.id);
                        }}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-[#97144D] bg-[#97144D]/5 ring-2 ring-[#97144D]/25 shadow-xs'
                            : 'border-[#E8DFE5] dark:border-[#381B30] bg-[#FAF6F8] dark:bg-[#2A1527] hover:bg-slate-100 dark:hover:bg-[#33152B]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-bold ${
                            isSelected ? 'bg-[#97144D] text-white' : 'bg-slate-200 dark:bg-slate-700 text-[#6B5B68]'
                          }`}>
                            <Key className="w-4 h-4" />
                          </div>
                          <div>
                            {/* Single line, no wrapping */}
                            <span className="font-mono font-bold text-sm text-[#1F1420] dark:text-white block whitespace-nowrap">
                              Locker #{lkr.lockerNumber}
                            </span>
                            <span className="text-xs text-[#6B5B68] dark:text-[#A898A4] block truncate max-w-[200px]">
                              {lkr.branchName}
                            </span>
                          </div>
                        </div>

                        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#97144D]/10 text-[#97144D] dark:text-[#E895B8] border border-[#97144D]/20">
                          {lkr.size}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dues Warning if present */}
              {hasDues && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-900/40 rounded-2xl text-[#C62828] flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-[#C62828] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold block">
                      Outstanding Rental Dues: ₹{targetLocker.outstandingRent?.toLocaleString('en-IN')}
                    </span>
                    Please clear all outstanding rent under Rent & Payments tab before submitting surrender notice.
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#6B5B68] dark:text-[#A898A4] mb-1">
                  Reason for Surrendering Locker
                </label>
                <select
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full h-11 bg-[#FAF6F8] dark:bg-[#2A1527] border border-[#E8DFE5] dark:border-[#381B30] rounded-xl px-3 font-semibold text-xs text-[#1F1420] dark:text-white focus:bg-white dark:focus:bg-[#20101D] focus:outline-none"
                >
                  <option value="Relocating to another city">Relocating to another city / abroad</option>
                  <option value="No longer require safe custody storage">No longer require safe custody storage</option>
                  <option value="Consolidating lockers at another branch">Consolidating lockers at another branch</option>
                  <option value="Rental tariff optimization">Rental tariff optimization</option>
                </select>
              </div>

              {/* Single column date and slot on mobile */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#6B5B68] dark:text-[#A898A4] mb-1">
                    Scheduled Handover Date
                  </label>
                  <input
                    type="date"
                    value={closureDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setClosureDate(e.target.value)}
                    required
                    className="w-full h-11 bg-[#FAF6F8] dark:bg-[#2A1527] border border-[#E8DFE5] dark:border-[#381B30] rounded-xl px-3 font-mono font-bold text-xs text-[#1F1420] dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6B5B68] dark:text-[#A898A4] mb-1">
                    Strongroom Inspection Slot
                  </label>
                  <select
                    value={closureSlot}
                    onChange={e => setClosureSlot(e.target.value)}
                    className="w-full h-11 bg-[#FAF6F8] dark:bg-[#2A1527] border border-[#E8DFE5] dark:border-[#381B30] rounded-xl px-3 font-semibold text-xs text-[#1F1420] dark:text-white focus:outline-none"
                  >
                    <option value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM</option>
                    <option value="11:00 AM - 11:30 AM">11:00 AM - 11:30 AM</option>
                    <option value="02:30 PM - 03:00 PM">02:30 PM - 03:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Refund Credit Summary */}
              <div className="p-3.5 bg-[#FAF6F8] dark:bg-[#2A1527] border border-[#E8DFE5] dark:border-[#381B30] rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#6B5B68] dark:text-[#A898A4]">Security Deposit Refund:</span>
                  <span className="font-mono font-bold text-[#1E8E5A] text-sm">
                    ₹{targetLocker.securityDeposit.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6B5B68] dark:text-[#A898A4]">FD Lien Release:</span>
                  <span className="font-bold text-[#1E8E5A]">Immediate upon Key Return</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6B5B68] dark:text-[#A898A4]">Credit Account:</span>
                  <span className="font-mono font-bold text-[#1F1420] dark:text-white">Savings Account - xxxx 1720</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={hasDues}
                className="w-full h-12 bg-[#97144D] hover:bg-[#6B0E37] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all active-press"
              >
                <XCircle className="w-4 h-4 text-[#FFDF85]" />
                <span>Submit Surrender Notice & Book Key Handover</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Step-up OTP Modal */}
      <OtpModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onSuccess={handleOtpSuccess}
        title="Authorize Locker Surrender"
        actionDescription={`Authorizing formal surrender notice for Locker #${targetLocker.lockerNumber}`}
      />

    </div>
  );
};
