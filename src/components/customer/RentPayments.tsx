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
  Landmark
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

  const customerLockers = lockers.filter(l => l.customerId === 'cust-rahul-01');
  const [activeTab, setActiveTab] = useState<'pay' | 'history' | 'autodebit' | 'deposits'>('pay');

  // Payment Form State
  const [payLockerId, setPayLockerId] = useState<string>(selectedLockerId || 'lck-042');
  const [paymentMode, setPaymentMode] = useState<PaymentRecord['paymentMethod']>('Auto-Debit (CBS)');
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [paymentSuccessRef, setPaymentSuccessRef] = useState<string | null>(null);

  // Auto-debit preference
  const [autoDebitEnabled, setAutoDebitEnabled] = useState(true);
  const [autoDebitAccount, setAutoDebitAccount] = useState('5010049281720 (National Bank Premier Savings)');
  const [maxDebitCap, setMaxDebitCap] = useState('15,000');

  // Document modal state
  const [viewDoc, setViewDoc] = useState<StoredDocument | null>(null);

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
    setPaymentSuccessRef(`TXN-ANB-${Date.now().toString().slice(-8)}`);
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
    <div className="space-y-6">
      
      {/* Title & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3E8F0]">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-[#102544]">
            Rent & Payment Management
          </h1>
          <p className="text-xs text-[#66758C] mt-0.5">
            Transparent annual locker rental tariffs, instant settlement, auto-debit e-mandates, and linked deposit administration
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#F5F7FA] p-1 rounded-xl border border-[#E3E8F0] overflow-x-auto">
          <button
            onClick={() => setActiveTab('pay')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'pay' ? 'bg-[#102544] text-white shadow-xs' : 'text-[#66758C] hover:text-[#17263C]'
            }`}
          >
            Pay Dues
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'history' ? 'bg-[#102544] text-white shadow-xs' : 'text-[#66758C] hover:text-[#17263C]'
            }`}
          >
            Payment History ({payments.length})
          </button>
          <button
            onClick={() => setActiveTab('autodebit')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'autodebit' ? 'bg-[#102544] text-white shadow-xs' : 'text-[#66758C] hover:text-[#17263C]'
            }`}
          >
            e-Mandate / Auto-Debit
          </button>
          <button
            onClick={() => setActiveTab('deposits')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'deposits' ? 'bg-[#102544] text-white shadow-xs' : 'text-[#66758C] hover:text-[#17263C]'
            }`}
          >
            Linked Term Deposits (FDs)
          </button>
        </div>
      </div>

      {/* TAB 1: PAY DUES */}
      {activeTab === 'pay' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Pay Form (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-[#E3E8F0] rounded-2xl p-6 shadow-bank-card space-y-5 text-xs">
            <h2 className="text-sm font-bold text-[#102544] flex items-center gap-2 border-b border-[#E3E8F0] pb-3">
              <CreditCard className="w-4 h-4 text-[#2457A7]" />
              <span>Settle Annual Locker Rental</span>
            </h2>

            {/* Success Banner if paid */}
            {paymentSuccessRef && (
              <div className="p-4 bg-[#16845B]/10 border border-[#16845B]/30 rounded-xl text-[#16845B] space-y-1">
                <div className="flex items-center gap-2 font-bold text-[#16845B]">
                  <CheckCircle2 className="w-4 h-4 text-[#16845B]" />
                  <span>Payment Successfully Processed</span>
                </div>
                <p className="text-[11px] text-[#16845B]/90">
                  Transaction Reference: <span className="font-mono font-semibold">{paymentSuccessRef}</span>. The locker renewal date has been extended by 1 year.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('history')}
                    className="text-xs font-semibold text-[#16845B] underline"
                  >
                    View Official Tax Invoice in Payment History →
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handlePayClick} className="space-y-4">
              <div>
                <label className="block font-medium text-[#17263C] mb-1.5">
                  Select Locker Account
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {customerLockers.map(lkr => (
                    <div
                      key={lkr.id}
                      onClick={() => {
                        setPayLockerId(lkr.id);
                        setSelectedLockerId(lkr.id);
                        setPaymentSuccessRef(null);
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        payLockerId === lkr.id
                          ? 'border-[#102544] bg-[#102544] text-white shadow-xs'
                          : 'border-[#E3E8F0] bg-[#F5F7FA] text-[#17263C] hover:bg-[#E3E8F0]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold font-mono">Locker {lkr.lockerNumber}</span>
                        {lkr.outstandingRent && lkr.outstandingRent > 0 ? (
                          <span className="text-[10px] bg-[#C83E44] text-white px-2 py-0.5 rounded font-mono font-bold">
                            Due ₹{lkr.outstandingRent.toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className={`text-[10px] px-2 py-0.5 rounded ${payLockerId === lkr.id ? 'bg-white/20 text-white' : 'bg-white text-[#66758C] border border-[#E3E8F0]'}`}>
                            Clear
                          </span>
                        )}
                      </div>
                      <div className={`text-[11px] mt-1 ${payLockerId === lkr.id ? 'text-white/80' : 'text-[#66758C]'}`}>
                        {lkr.branchName}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Mode Selection */}
              <div>
                <label className="block font-medium text-[#17263C] mb-1.5">
                  Select Settlement Channel
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'Auto-Debit (CBS)', label: 'Linked Savings Auto-Debit', desc: 'A/c 5010049281720 (Zero fees)' },
                    { id: 'Net Banking', label: 'Retail Net Banking', desc: 'Instant authorization via CBS gateway' },
                    { id: 'UPI', label: 'Unified Payments Interface (UPI)', desc: 'Instant UPI dynamic QR / VPA' },
                    { id: 'Branch Counter Cash/Cheque', label: 'Pay at Branch Vault Desk', desc: 'Pay with physical cheque/slip' },
                  ].map(m => (
                    <div
                      key={m.id}
                      onClick={() => setPaymentMode(m.id as PaymentRecord['paymentMethod'])}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-colors ${
                        paymentMode === m.id
                          ? 'border-[#2457A7] bg-[#2457A7]/10 text-[#102544] font-medium'
                          : 'border-[#E3E8F0] bg-[#F5F7FA] text-[#17263C] hover:bg-[#E3E8F0]'
                      }`}
                    >
                      <div className="font-bold">{m.label}</div>
                      <div className="text-[11px] text-[#66758C] mt-0.5">{m.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Authorization Notice */}
              <div className="p-3.5 bg-[#F5F7FA] border border-[#E3E8F0] rounded-xl text-[11px] text-[#66758C] flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#16845B] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#102544]">Enterprise 2FA Protected:</strong> Settle payment securely. Digital tax invoice with CGST and SGST details will be generated and filed in Document Vault.
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-[#102544] hover:bg-[#0B1730] rounded-xl transition-colors shadow-xs flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4 text-[#008C88]" />
                  <span>Authorize Payment of ₹{totalDue.toLocaleString('en-IN')}</span>
                </button>
              </div>

            </form>
          </div>

          {/* Dues Breakdown Summary (5 cols) */}
          <div className="lg:col-span-5 bg-[#F5F7FA] border border-[#E3E8F0] rounded-2xl p-6 shadow-bank-card space-y-4 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#66758C] border-b border-[#E3E8F0] pb-2">
              Locker Tariff & Dues Breakdown
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[#66758C]">Locker Identification:</span>
                <span className="font-bold text-[#102544] font-mono">
                  Locker {selectedLockerObj?.lockerNumber} ({selectedLockerObj?.size})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66758C]">Branch Name:</span>
                <span className="text-[#17263C] text-right font-medium truncate max-w-[180px]">
                  {selectedLockerObj?.branchName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66758C]">Billing Cycle:</span>
                <span className="font-mono text-[#17263C]">FY 2026 - 2027</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66758C]">Base Annual Rent:</span>
                <span className="font-mono font-medium text-[#102544] tabular-nums">
                  ₹{rentBase.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66758C]">CGST (9%):</span>
                <span className="font-mono text-[#17263C] tabular-nums">₹{(gst / 2).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66758C]">SGST (9%):</span>
                <span className="font-mono text-[#17263C] tabular-nums">₹{(gst / 2).toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-3 border-t border-[#E3E8F0] flex justify-between font-bold text-sm text-[#102544]">
                <span>Total Payable Amount</span>
                <span className="font-mono text-[#16845B] tabular-nums">₹{totalDue.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-3.5 bg-white border border-[#E3E8F0] rounded-xl text-[11px] text-[#66758C] space-y-1">
              <p>• Rental paid in advance is non-refundable during the billing year.</p>
              <p>• TDS is not applicable on locker rental charges under Section 194I for individuals.</p>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: PAYMENT HISTORY & INVOICES */}
      {activeTab === 'history' && (
        <div className="bg-white border border-[#E3E8F0] rounded-2xl overflow-hidden shadow-bank-card text-xs">
          <div className="px-5 py-4 border-b border-[#E3E8F0] flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#102544]">
              Payment Transactions & Official Tax Invoices ({payments.length})
            </h3>
            <span className="text-[#66758C] font-mono text-[11px]">Authorized Bank Receipts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F7FA] text-[#102544] border-b border-[#E3E8F0]">
                  <th className="py-3 px-4 font-semibold">Receipt #</th>
                  <th className="py-3 px-4 font-semibold">Transaction Ref</th>
                  <th className="py-3 px-4 font-semibold">Locker</th>
                  <th className="py-3 px-4 font-semibold">Billing Period</th>
                  <th className="py-3 px-4 font-semibold text-right">Base Rent</th>
                  <th className="py-3 px-4 font-semibold text-right">GST (18%)</th>
                  <th className="py-3 px-4 font-semibold text-right">Total Paid</th>
                  <th className="py-3 px-4 font-semibold">Payment Mode</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E8F0]">
                {payments.map(p => (
                  <tr key={p.id} className="hover:bg-[#F5F7FA] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#102544]">
                      {p.receiptNumber}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#66758C] text-[11px]">
                      {p.transactionRef}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#17263C]">
                      Locker {p.lockerNumber}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#66758C]">
                      {p.period}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[#17263C] tabular-nums">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[#66758C] tabular-nums">
                      ₹{p.taxGst.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#102544] tabular-nums">
                      ₹{p.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-[#17263C] font-medium">
                      {p.paymentMethod}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={p.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openReceipt(p.receiptNumber)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-[#2457A7] bg-[#2457A7]/10 border border-[#2457A7]/25 rounded hover:bg-[#2457A7]/20 flex items-center gap-1 ml-auto transition-colors"
                      >
                        <Receipt className="w-3 h-3" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: AUTO-DEBIT / NACH */}
      {activeTab === 'autodebit' && (
        <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5 text-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Automated Annual Locker Rental Debit (e-Mandate)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Avoid default penalty and lock freeze by maintaining automatic CBS account deduction
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-xs block">Active CBS Standing Instruction</span>
                  <span className="text-[11px] text-slate-500">Mandate Ref: NACH/ANB/2024/001928</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoDebitEnabled}
                    onChange={e => setAutoDebitEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Deduction Account</span>
                  <span className="font-mono font-medium text-slate-800">{autoDebitAccount}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Mandate Ceiling Cap</span>
                  <span className="font-mono font-medium text-slate-800">₹{maxDebitCap} per annum</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-[11px] text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Auto-debit executes 7 days prior to renewal due date. In case of insufficient balance, an SMS advisory is triggered and manual clearance is required.
              </span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => alert('e-Mandate configuration updated successfully.')}
                className="px-5 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800"
              >
                Save Mandate Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LINKED DEPOSITS */}
      {activeTab === 'deposits' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Linked Security Term Deposits (FD Accounts)
            </h3>
            <span className="text-xs text-slate-500">Security guarantee as per RBI circular</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {customerLockers.map(lkr => (
              <div
                key={lkr.id}
                className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-slate-700" />
                    <span className="font-bold text-slate-900">Locker {lkr.lockerNumber} Deposit</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    Active Bank Lien
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">FD Account Number</span>
                    <span className="font-mono font-medium text-slate-900">
                      FD-{lkr.id === 'lck-125' ? '88219001' : '91042883'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Principal Held</span>
                    <span className="font-mono font-bold text-slate-900">
                      ₹{lkr.securityDeposit.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Interest Rate</span>
                    <span className="font-mono font-medium text-emerald-700">7.10% p.a. (Compounded)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Lien Holder</span>
                    <span className="font-medium text-slate-800">National Bank</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
                  Principal deposit remains fully intact and refundable upon locker surrender. Quarterly interest is automatically credited to your linked Premier Savings Account.
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
