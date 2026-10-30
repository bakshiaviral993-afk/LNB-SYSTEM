import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { StatusBadge } from '../common/StatusBadge';
import { DocumentModal } from '../common/DocumentModal';
import { OtpModal } from '../common/OtpModal';
import { PaymentRecord, StoredDocument } from '../../types';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Download,
  Building,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Landmark,
  Key,
  ChevronRight,
  Sparkles,
  Lock,
  Wallet
} from 'lucide-react';

export const RentPayments: React.FC = () => {
  const {
    lockers,
    payments,
    payLockerRent,
    documents,
    selectedLockerId,
    setSelectedLockerId
  } = useBanking();

  const customerLockers = lockers.filter(l => l.customerId === 'cust-rahul-01' || l.customerName === 'Rahul Sharma');
  const [activeTab, setActiveTab] = useState<'pay' | 'history' | 'autodebit' | 'deposits'>('pay');

  // Payment Form State
  const [payLockerId, setPayLockerId] = useState<string>(selectedLockerId || customerLockers[0]?.id || 'lck-042');
  const [paymentMode, setPaymentMode] = useState<PaymentRecord['paymentMethod']>('Auto-Debit (CBS)');
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [paymentSuccessRef, setPaymentSuccessRef] = useState<string | null>(null);

  // Auto-debit preference
  const [autoDebitEnabled, setAutoDebitEnabled] = useState(true);
  const [autoDebitAccount, setAutoDebitAccount] = useState('Savings Account - xxxx 1720');
  const [maxDebitCap, setMaxDebitCap] = useState('15,000');

  // Document modal state
  const [viewDoc, setViewDoc] = useState<StoredDocument | null>(null);
  const [mandateSavedMsg, setMandateSavedMsg] = useState(false);

  const selectedLockerObj = lockers.find(l => l.id === payLockerId) || customerLockers[0];
  const outstandingAmount = selectedLockerObj?.outstandingRent || 0;
  const rentBase = selectedLockerObj?.annualRent || 4500;
  const gst = Math.round(rentBase * 0.18);
  const totalDue = outstandingAmount > 0 ? outstandingAmount : rentBase + gst;

  const handlePayClick = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOtpOpen(true);
  };

  const handleOtpSuccess = () => {
    payLockerRent(payLockerId, paymentMode);
    setPaymentSuccessRef(`TXN-SV-${Date.now().toString().slice(-8)}`);
  };

  const openReceipt = (rcpNum: string) => {
    const doc = documents.find(d => d.documentRef === rcpNum) || {
      id: `doc-${rcpNum}`,
      title: `Tax Invoice & Rent Receipt #${rcpNum}`,
      category: 'Payment Receipt' as const,
      issueDate: 'Today',
      fileSize: '410 KB',
      documentRef: rcpNum,
      signedStatus: 'System Generated' as const,
    };
    setViewDoc(doc);
  };

  return (
    <div className="space-y-4 pb-12 text-[#1F1420] dark:text-[#F3ECF0]">
      
      {/* Module Title Card with Axis-inspired Burgundy Gradient */}
      <div className="bg-gradient-to-r from-[#6B0E37] to-[#97144D] text-white p-4 rounded-3xl shadow-md border border-[#6B0E37]">
        <div className="flex items-center gap-1.5 mb-1.5">
          <CreditCard className="w-4 h-4 text-[#C9A24B]" />
          <span className="text-xs font-mono uppercase tracking-wider text-[#C9A24B] font-extrabold">
            Tariff & Payments
          </span>
        </div>
        <h1 className="text-xl font-black tracking-tight text-white">
          Rent & Dues Settlement
        </h1>
        <p className="text-xs text-white/80 mt-0.5">
          Annual locker rental tariffs, instant UPI/NetBanking, and e-mandates.
        </p>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('pay')}
          className={`h-10 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all active-press cursor-pointer ${
            activeTab === 'pay'
              ? 'bg-[#97144D] text-white shadow-xs'
              : 'bg-white dark:bg-[#20101D] text-[#6B5B68] dark:text-[#A898A4] border border-[#E8DFE5] dark:border-[#381B30] hover:bg-slate-50'
          }`}
        >
          Pay Dues
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`h-10 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all active-press cursor-pointer ${
            activeTab === 'history'
              ? 'bg-[#97144D] text-white shadow-xs'
              : 'bg-white dark:bg-[#20101D] text-[#6B5B68] dark:text-[#A898A4] border border-[#E8DFE5] dark:border-[#381B30] hover:bg-slate-50'
          }`}
        >
          History ({payments.length})
        </button>
        <button
          onClick={() => setActiveTab('autodebit')}
          className={`h-10 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all active-press cursor-pointer ${
            activeTab === 'autodebit'
              ? 'bg-[#97144D] text-white shadow-xs'
              : 'bg-white dark:bg-[#20101D] text-[#6B5B68] dark:text-[#A898A4] border border-[#E8DFE5] dark:border-[#381B30] hover:bg-slate-50'
          }`}
        >
          e-Mandate
        </button>
        <button
          onClick={() => setActiveTab('deposits')}
          className={`h-10 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all active-press cursor-pointer ${
            activeTab === 'deposits'
              ? 'bg-[#97144D] text-white shadow-xs'
              : 'bg-white dark:bg-[#20101D] text-[#6B5B68] dark:text-[#A898A4] border border-[#E8DFE5] dark:border-[#381B30] hover:bg-slate-50'
          }`}
        >
          Linked FDs
        </button>
      </div>

      {/* TAB 1: PAY DUES */}
      {activeTab === 'pay' && (
        <div className="space-y-4">
          
          {/* Success Banner if paid */}
          {paymentSuccessRef && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-900/40 rounded-2xl text-[#1E8E5A] space-y-1.5 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-[#1E8E5A]" />
                <span>Payment Confirmed Successfully</span>
              </div>
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                Official transaction reference: <span className="font-mono font-bold">{paymentSuccessRef}</span>. Digital GST invoice generated.
              </p>
              <button
                onClick={() => openReceipt(paymentSuccessRef)}
                className="mt-2 h-9 px-3 bg-[#97144D] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Receipt className="w-4 h-4 text-[#C9A24B]" />
                <span>Download Tax Invoice</span>
              </button>
            </div>
          )}

          {/* Dues Breakdown Summary Card */}
          <div className="bg-[#FAF6F8] dark:bg-[#20101D] border border-[#E8DFE5] dark:border-[#381B30] rounded-3xl p-4 shadow-sm space-y-3 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B5B68] dark:text-[#A898A4] border-b border-[#E8DFE5] dark:border-[#381B30] pb-2">
              Tariff & Dues Summary
            </h3>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[#6B5B68] dark:text-[#A898A4]">Compartment:</span>
                <span className="font-bold text-[#1F1420] dark:text-white font-mono text-sm">
                  Locker #{selectedLockerObj?.lockerNumber} ({selectedLockerObj?.size})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6B5B68] dark:text-[#A898A4]">Branch:</span>
                <span className="text-[#1F1420] dark:text-white font-medium truncate max-w-[200px]">
                  {selectedLockerObj?.branchName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6B5B68] dark:text-[#A898A4]">Billing Period:</span>
                <span className="font-mono text-[#1F1420] dark:text-white">FY 2026 - 2027</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6B5B68] dark:text-[#A898A4]">Base Annual Tariff:</span>
                <span className="font-mono font-medium text-[#1F1420] dark:text-white">
                  ₹{rentBase.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6B5B68] dark:text-[#A898A4]">GST (18%):</span>
                <span className="font-mono text-[#1F1420] dark:text-white">₹{gst.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-2.5 border-t border-[#E8DFE5] dark:border-[#381B30] flex justify-between items-center font-bold text-sm text-[#1F1420] dark:text-white">
                <span>Total Payable</span>
                <span className="font-mono text-base text-[#1E8E5A]">
                  ₹{totalDue.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Options Form */}
          <form onSubmit={handlePayClick} className="bg-white dark:bg-[#20101D] border border-[#E8DFE5] dark:border-[#381B30] rounded-3xl p-4 shadow-sm space-y-4 text-xs">
            <h2 className="text-sm font-bold text-[#1F1420] dark:text-white flex items-center gap-2 border-b border-[#E8DFE5] dark:border-[#381B30] pb-2.5">
              <CreditCard className="w-4 h-4 text-[#97144D] dark:text-[#E895B8]" />
              <span>Payment Details</span>
            </h2>

            {/* Target Locker Select */}
            <div>
              <label className="block text-xs font-bold text-[#6B5B68] dark:text-[#A898A4] mb-1">
                Select Compartment
              </label>
              <select
                value={payLockerId}
                onChange={e => {
                  setPayLockerId(e.target.value);
                  setSelectedLockerId(e.target.value);
                }}
                className="w-full h-11 bg-[#FAF6F8] dark:bg-[#2A1527] border border-[#E8DFE5] dark:border-[#381B30] rounded-xl px-3 text-xs font-semibold text-[#1F1420] dark:text-white focus:outline-none"
              >
                {customerLockers.map(lkr => (
                  <option key={lkr.id} value={lkr.id}>
                    Locker #{lkr.lockerNumber} ({lkr.branchName}) {lkr.outstandingRent ? '— Overdue' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method Select */}
            <div>
              <label className="block text-xs font-bold text-[#6B5B68] dark:text-[#A898A4] mb-1">
                Select Payment Method
              </label>
              <div className="space-y-2">
                {[
                  { id: 'Auto-Debit (CBS)', label: 'Auto-Debit from Linked Savings', sub: 'Account: 5010049281720' },
                  { id: 'UPI', label: 'UPI / Bharat QR', sub: 'Instant via Google Pay / PhonePe / BHIM' },
                  { id: 'Net Banking', label: 'SafeVault NetBanking', sub: 'Direct CBS instantaneous debit' },
                  { id: 'Debit Card', label: 'Debit Card (RuPay / Visa / Master)', sub: '3D Secure OTP verification' }
                ].map(opt => {
                  const isChecked = paymentMode === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setPaymentMode(opt.id as any)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isChecked
                          ? 'border-[#97144D] bg-[#97144D]/5 ring-2 ring-[#97144D]/25'
                          : 'border-[#E8DFE5] dark:border-[#381B30] bg-[#FAF6F8] dark:bg-[#2A1527] hover:bg-white dark:hover:bg-[#33152B]'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-xs text-[#1F1420] dark:text-white block">
                          {opt.label}
                        </span>
                        <span className="text-[11px] text-[#6B5B68] dark:text-[#A898A4] block mt-0.5">
                          {opt.sub}
                        </span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isChecked ? 'border-[#97144D] bg-[#97144D]' : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {isChecked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pay Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full h-12 bg-[#97144D] hover:bg-[#6B0E37] text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active-press"
              >
                <CreditCard className="w-4 h-4 text-[#C9A24B]" />
                <span>Authorize Payment of ₹{totalDue.toLocaleString('en-IN')}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: PAYMENT HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-bold text-[#1F1420] dark:text-white">
              Transaction History ({payments.length})
            </h3>
            <span className="text-xs text-[#6B5B68] dark:text-[#A898A4]">Official Invoices</span>
          </div>

          <div className="space-y-2.5">
            {payments.map(p => (
              <div
                key={p.id}
                className="p-4 bg-white dark:bg-[#20101D] border border-[#E8DFE5] dark:border-[#381B30] rounded-2xl shadow-sm text-xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-[#E8DFE5] dark:border-[#381B30] pb-2.5">
                  <div>
                    <span className="font-mono font-bold text-sm text-[#97144D] dark:text-[#E895B8]">
                      Receipt #{p.receiptNumber}
                    </span>
                    <span className="text-xs text-[#6B5B68] dark:text-[#A898A4] block mt-0.5">
                      Locker #{p.lockerNumber} · {p.period}
                    </span>
                  </div>
                  <StatusBadge status={p.status} size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#FAF6F8] dark:bg-[#2A1527] p-2 rounded-xl border border-[#E8DFE5] dark:border-[#381B30]">
                    <span className="text-[#6B5B68] dark:text-[#A898A4] block text-xs">Total Amount</span>
                    <span className="font-mono font-bold text-sm text-[#1F1420] dark:text-white">
                      ₹{p.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="bg-[#FAF6F8] dark:bg-[#2A1527] p-2 rounded-xl border border-[#E8DFE5] dark:border-[#381B30]">
                    <span className="text-[#6B5B68] dark:text-[#A898A4] block text-xs">Payment Method</span>
                    <span className="font-semibold text-xs text-[#1F1420] dark:text-white truncate block mt-0.5">
                      {p.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] text-[#6B5B68] dark:text-[#A898A4]">
                  <span className="font-mono">{p.transactionRef}</span>
                  <button
                    onClick={() => openReceipt(p.receiptNumber)}
                    className="h-8 px-3 rounded-lg bg-[#97144D]/10 hover:bg-[#97144D]/20 text-[#97144D] dark:text-[#E895B8] font-bold text-xs flex items-center gap-1 transition-colors"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>View Tax Invoice</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AUTO-DEBIT / e-MANDATE */}
      {activeTab === 'autodebit' && (
        <div className="bg-white dark:bg-[#20101D] border border-[#E8DFE5] dark:border-[#381B30] rounded-3xl p-4 shadow-sm space-y-4 text-xs">
          <div>
            <h3 className="text-base font-bold text-[#1F1420] dark:text-white">
              Annual e-Mandate (Auto-Debit)
            </h3>
            <p className="text-xs text-[#6B5B68] dark:text-[#A898A4] mt-0.5">
              Avoid overdue fees by keeping automated deduction active.
            </p>
          </div>

          <div className="p-3.5 bg-[#FAF6F8] dark:bg-[#2A1527] rounded-2xl border border-[#E8DFE5] dark:border-[#381B30] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-[#1F1420] dark:text-white text-xs block">Active Standing Instruction</span>
                <span className="text-xs text-[#6B5B68] dark:text-[#A898A4] font-mono">Mandate: NACH/SV/2026/001928</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoDebitEnabled}
                  onChange={e => setAutoDebitEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#E8DFE5] dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#E8DFE5] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#97144D]"></div>
              </label>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#E8DFE5] dark:border-[#381B30] text-xs">
              <div className="flex justify-between">
                <span className="text-[#6B5B68] dark:text-[#A898A4]">Deduction Account:</span>
                <span className="font-mono font-medium text-[#1F1420] dark:text-white">Savings Account - xxxx 1720</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B5B68] dark:text-[#A898A4]">Mandate Ceiling:</span>
                <span className="font-mono font-medium text-[#1F1420] dark:text-white">₹15,000 / yr</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-900/40 rounded-2xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Auto-debit executes 7 days prior to renewal due date. In case of insufficient balance, an SMS advisory is triggered.
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setMandateSavedMsg(true);
              setTimeout(() => setMandateSavedMsg(false), 3500);
            }}
            className="w-full h-11 bg-[#97144D] hover:bg-[#6B0E37] text-white font-bold rounded-xl text-xs shadow-xs transition-colors active-press cursor-pointer"
          >
            {mandateSavedMsg ? 'Mandate Settings Saved!' : 'Save Mandate Settings'}
          </button>
        </div>
      )}

      {/* TAB 4: LINKED DEPOSITS */}
      {activeTab === 'deposits' && (
        <div className="space-y-3">
          <div className="px-1">
            <h3 className="text-base font-bold text-[#1F1420] dark:text-white">
              Linked Security FDs
            </h3>
            <p className="text-xs text-[#6B5B68] dark:text-[#A898A4]">
              Security term deposits held under bank lien per RBI guidelines.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            {customerLockers.map(lkr => (
              <div
                key={lkr.id}
                className="p-4 bg-white dark:bg-[#20101D] border border-[#E8DFE5] dark:border-[#381B30] rounded-2xl shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between border-b border-[#E8DFE5] dark:border-[#381B30] pb-2.5">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-[#97144D] dark:text-[#E895B8]" />
                    <span className="font-bold text-[#1F1420] dark:text-white">Locker #{lkr.lockerNumber} Deposit</span>
                  </div>
                  <span className="text-xs font-bold text-[#1E8E5A] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    Active Lien
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#FAF6F8] dark:bg-[#2A1527] p-2 rounded-xl border border-[#E8DFE5] dark:border-[#381B30]">
                    <span className="text-[#6B5B68] dark:text-[#A898A4] block text-xs">FD Number</span>
                    <span className="font-mono font-medium text-[#1F1420] dark:text-white">
                      FD-{lkr.id === 'lck-125' ? '88219001' : '91042883'}
                    </span>
                  </div>
                  <div className="bg-[#FAF6F8] dark:bg-[#2A1527] p-2 rounded-xl border border-[#E8DFE5] dark:border-[#381B30]">
                    <span className="text-[#6B5B68] dark:text-[#A898A4] block text-xs">Principal Held</span>
                    <span className="font-mono font-bold text-[#1F1420] dark:text-white">
                      ₹{lkr.securityDeposit.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-[#FAF6F8] dark:bg-[#2A1527] rounded-xl border border-[#E8DFE5] dark:border-[#381B30] text-xs text-[#6B5B68] dark:text-[#A898A4]">
                  Interest earns 7.10% p.a. and is credited to your linked Premier savings account quarterly.
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* OTP Step-Up Modal for Payment */}
      <OtpModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onSuccess={handleOtpSuccess}
        title="Authorize Locker Rental Payment"
        actionDescription={`Debiting ₹${totalDue.toLocaleString('en-IN')} for Locker ${selectedLockerObj?.lockerNumber}`}
      />

      {/* Document Modal for Invoice Preview */}
      <DocumentModal
        document={viewDoc}
        onClose={() => setViewDoc(null)}
      />

    </div>
  );
};
