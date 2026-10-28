import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { StatusBadge } from '../common/StatusBadge';
import { DocumentModal } from '../common/DocumentModal';
import { StoredDocument } from '../../types';
import {
  CreditCard,
  AlertTriangle,
  Receipt,
  Download,
  Building,
  RefreshCw,
  Search,
  CheckCircle2
} from 'lucide-react';

export const BillingManagement: React.FC = () => {
  const { lockers, payments, documents } = useBanking();
  const [viewDoc, setViewDoc] = useState<StoredDocument | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const overdueLockers = lockers.filter(l => (l.outstandingRent || 0) > 0);
  const totalOverdue = overdueLockers.reduce((acc, l) => acc + (l.outstandingRent || 0), 0);

  const openInvoice = (rcpNum: string) => {
    const doc = documents.find(d => d.documentRef === rcpNum) || {
      id: `doc-${rcpNum}`,
      title: `Locker Rental Receipt #${rcpNum}`,
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
      
      {/* Enterprise Page Header */}
      <div className="bg-white rounded-xl border border-[#E3E8F0] shadow-bank-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#102544]/5 text-[#102544] border border-[#102544]/15">
              CBS Clearing & Treasury Desk
            </span>
            <span className="text-xs text-[#66758C]">Daily Clearing Cycle • FY 2026-27</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#17263C]">
            Billing, NACH Auto-Debit & Treasury Reconciliation
          </h1>
          <p className="text-xs text-[#66758C] mt-1">
            Automated core banking settlement batches, overdue rental collections, GST tax invoices, and statutory audit ledgers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFeedbackMsg('Clearing reconciliation sync completed with Core Banking System (100% ledger parity).')}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#102544] bg-[#F5F7FA] border border-[#E3E8F0] hover:bg-slate-100 rounded-lg transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#2457A7]" />
            Sync CBS Clearing
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-[#16845B] rounded-xl flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16845B] shrink-0" />
            <span className="font-semibold">{feedbackMsg}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-xs underline hover:no-underline">Dismiss</button>
        </div>
      )}

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 bg-white border border-[#E3E8F0] rounded-xl shadow-bank-card flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#C83E44]/10 text-[#C83E44] flex items-center justify-center shrink-0 border border-[#C83E44]/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#66758C] block">
              Total Overdue Collections
            </span>
            <span className="text-2xl font-bold font-mono text-[#C83E44] mt-1 block tabular-nums">
              ₹{totalOverdue.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-[#66758C] mt-1 block">
              {overdueLockers.length} compartments subject to 3-year escalation
            </span>
          </div>
        </div>

        <div className="p-5 bg-white border border-[#E3E8F0] rounded-xl shadow-bank-card flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#16845B]/10 text-[#16845B] flex items-center justify-center shrink-0 border border-[#16845B]/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#66758C] block">
              NACH Auto-Debit Clearing Health
            </span>
            <span className="text-2xl font-bold font-mono text-[#16845B] mt-1 block tabular-nums">
              98.2% Success
            </span>
            <span className="text-xs text-[#66758C] mt-1 block">
              Next scheduled auto-batch: 28 Oct 2026
            </span>
          </div>
        </div>

        <div className="p-5 bg-white border border-[#E3E8F0] rounded-xl shadow-bank-card flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#102544]/10 text-[#102544] flex items-center justify-center shrink-0 border border-[#102544]/20">
            <Receipt className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#66758C] block">
              Statutory GST Collected (FY 26-27)
            </span>
            <span className="text-2xl font-bold font-mono text-[#17263C] mt-1 block tabular-nums">
              ₹38,420
            </span>
            <span className="text-xs text-[#66758C] mt-1 block">
              18% GST matched with GSTR-1 repository
            </span>
          </div>
        </div>
      </div>

      {/* Overdue Accounts Table */}
      <div className="bg-white border border-[#E3E8F0] rounded-xl overflow-hidden shadow-bank-card">
        <div className="p-5 border-b border-[#E3E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-[#17263C] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C83E44]"></span>
              Overdue Rental Accounts ({overdueLockers.length})
            </h3>
            <p className="text-xs text-[#66758C] mt-0.5">
              Non-payment beyond 1 year triggers registered notice; 3 years mandates break-open procedure under RBI/2021-2022/86.
            </p>
          </div>
          <button
            onClick={() => setFeedbackMsg('Automated SMS & registered email advisory dispatched to all delinquent hirers.')}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#C83E44] hover:bg-[#a93237] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Dispatch Overdue Advisories
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F5F7FA] text-[#66758C] border-b border-[#E3E8F0] uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-3 px-4">Locker Compartment</th>
                <th className="py-3 px-4">Branch Location</th>
                <th className="py-3 px-4">Hirer & CIF</th>
                <th className="py-3 px-4">Renewal Due Date</th>
                <th className="py-3 px-4 text-right">Overdue Amount</th>
                <th className="py-3 px-4">Mandate State</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E8F0]">
              {overdueLockers.map(lkr => (
                <tr key={lkr.id} className="hover:bg-[#F5F7FA] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#17263C]">
                    Locker #{lkr.lockerNumber}
                  </td>
                  <td className="py-3.5 px-4 text-[#17263C]">
                    {lkr.branchName}
                  </td>
                  <td className="py-3.5 px-4 text-[#17263C]">
                    <span className="font-semibold block">Rahul Sharma</span>
                    <span className="text-[11px] font-mono text-[#66758C]">CIF-90281</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#C83E44] tabular-nums">
                    {lkr.nextRenewalDate}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#C83E44] tabular-nums">
                    ₹{lkr.outstandingRent?.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-[#17263C]">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[#B7791F]/10 text-[#B7791F] border border-[#B7791F]/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B7791F]"></span>
                      NACH Active (Pending Clearing)
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setFeedbackMsg(`Statutory notice generated and logged for Locker ${lkr.lockerNumber}`)}
                      className="px-3 py-1.5 text-xs font-semibold text-[#2457A7] bg-[#2457A7]/10 hover:bg-[#2457A7]/20 border border-[#2457A7]/20 rounded-lg transition-colors"
                    >
                      Send Notice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Transactions Reconciliation Table */}
      <div className="bg-white border border-[#E3E8F0] rounded-xl overflow-hidden shadow-bank-card">
        <div className="p-5 border-b border-[#E3E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-[#17263C]">
              Recent CBS Payment Batches & Reconciliations ({payments.length})
            </h3>
            <p className="text-xs text-[#66758C] mt-0.5">
              Direct Core Banking Interface • Real-time GL voucher posting and GST tax invoice generation
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#102544]/5 text-[#102544] border border-[#102544]/15">
            GL-40192 / GST-27AAACB0912K1Z9
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F5F7FA] text-[#66758C] border-b border-[#E3E8F0] uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-3 px-4">Transaction Ref</th>
                <th className="py-3 px-4">Locker #</th>
                <th className="py-3 px-4">Billing Period</th>
                <th className="py-3 px-4 text-right">Rental Base</th>
                <th className="py-3 px-4 text-right">GST (18%)</th>
                <th className="py-3 px-4 text-right">Total Debit</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">GST Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E8F0]">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-[#F5F7FA] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-[#17263C]">
                    {p.transactionRef}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#17263C]">
                    Locker #{p.lockerNumber}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#66758C]">{p.period}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-[#17263C] tabular-nums">₹{p.amount.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-[#66758C] tabular-nums">₹{p.taxGst.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#17263C] tabular-nums">₹{p.totalAmount.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4 text-[#17263C] font-medium">{p.paymentMethod}</td>
                  <td className="py-3.5 px-4 text-center">
                    <StatusBadge status={p.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => openInvoice(p.receiptNumber)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#2457A7] hover:bg-[#2457A7]/10 rounded-md transition-colors font-mono"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      {p.receiptNumber}
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
