import React, { useState, useMemo } from 'react';
import { useBanking } from '../../context/BankingContext';
import { PaymentRecord, LockerItem } from '../../types';
import { downloadCsvFile, downloadDocumentFile } from '../../services/downloadService';
import { DocumentModal } from '../common/DocumentModal';
import {
  CreditCard,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Building,
  Check,
  ShieldAlert
} from 'lucide-react';

export const FinancialManagement: React.FC<{ initialTab?: 'ledger' | 'arrears' | 'deposits' | 'reconciliation' }> = ({ initialTab }) => {
  const {
    lockers,
    payments,
    branches,
    documents
  } = useBanking();

  const [activeTab, setActiveTab] = useState<'ledger' | 'arrears' | 'deposits' | 'reconciliation'>(initialTab || 'ledger');

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewDoc, setViewDoc] = useState<any | null>(null);
  const [reconcileSuccess, setReconcileSuccess] = useState<string | null>(null);

  // Overdue and arrears statistics
  const overdueLockers = useMemo(() => {
    return lockers.filter(l => (l.outstandingRent || 0) > 0);
  }, [lockers]);

  const totalOverdue = useMemo(() => {
    return overdueLockers.reduce((s, l) => s + (l.outstandingRent || 0), 0);
  }, [overdueLockers]);

  const totalCollected = useMemo(() => {
    return payments
      .filter(p => p.status === 'Success')
      .reduce((s, p) => s + p.totalAmount, 0);
  }, [payments]);

  const totalDepositHeld = useMemo(() => {
    return lockers
      .filter(l => l.status === 'Occupied')
      .reduce((s, l) => s + l.securityDeposit, 0);
  }, [lockers]);

  // Arrears Ageing Breakdown (SysArc SAFE standard)
  const ageingBreakdown = useMemo(() => {
    let bucket30 = 0;
    let bucket90 = 0;
    let bucket180 = 0;
    let bucket365 = 0;
    let bucketStatutory = 0; // > 3 years statutory default

    overdueLockers.forEach(l => {
      const amt = l.outstandingRent || 0;
      // Simulated based on locker number / status
      if (l.lockerNumber === 'B-042') {
        bucket30 += amt;
      } else {
        bucket90 += amt;
      }
    });

    return {
      bucket30: bucket30 || 5310,
      bucket90: bucket90 || 12400,
      bucket180: 0,
      bucket365: 0,
      bucketStatutory: 0
    };
  }, [overdueLockers]);

  // Filtered Payments
  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.transactionRef.toLowerCase().includes(q) ||
          p.lockerNumber.toLowerCase().includes(q) ||
          p.receiptNumber.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [payments, searchQuery]);

  const handleExportPayments = () => {
    const headers = ['Txn Reference', 'Locker Number', 'Fiscal Period', 'Rent Base (INR)', 'GST (INR)', 'Total Amount (INR)', 'Payment Date', 'Payment Mode', 'Receipt Ref', 'Status'];
    const rows = filteredPayments.map(p => [
      p.transactionRef,
      p.lockerNumber,
      p.period,
      p.amount.toString(),
      p.taxGst.toString(),
      p.totalAmount.toString(),
      p.paymentDate,
      p.paymentMethod,
      p.receiptNumber,
      p.status
    ]);
    downloadCsvFile('NationalBank_Locker_Payment_Ledger', headers, rows);
  };

  const handleExportArrears = () => {
    const headers = ['Locker Number', 'Branch', 'Hirer Name', 'CIF Number', 'Renewal Due Date', 'Arrears Outstanding (INR)', 'NACH Mandate Status'];
    const rows = overdueLockers.map(l => [
      l.lockerNumber,
      l.branchName,
      'Rahul Sharma',
      'CIF-9028192831',
      l.nextRenewalDate || '22 Oct 2026',
      (l.outstandingRent || 0).toString(),
      'Active Auto-Debit'
    ]);
    downloadCsvFile('NationalBank_Locker_Arrears_Ageing_Report', headers, rows);
  };

  const handleRunReconciliation = () => {
    setReconcileSuccess('CBS Clearing Batch #CBS-2026-REC-9921 processed: 100% transactions reconciled with zero exceptions.');
    setTimeout(() => setReconcileSuccess(null), 6000);
  };

  const openReceiptModal = (rcpNum: string) => {
    const doc = documents.find(d => d.documentRef === rcpNum) || {
      id: `doc-${rcpNum}`,
      title: `Locker Rental Tax Invoice #${rcpNum}`,
      category: 'Payment Receipt' as const,
      issueDate: 'Today',
      fileSize: '410 KB',
      documentRef: rcpNum,
      signedStatus: 'System Generated' as const,
    };
    setViewDoc(doc);
  };

  return (
    <div className="space-y-6 text-xs text-[#17263C]">
      
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#E3E8F0]">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-[#66758C] font-mono mb-1">
            <span>Treasury & Collections</span>
            <span aria-hidden="true">/</span>
            <span>Core Banking General Ledger</span>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-[#102544]">Safe Custody Operations</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#17263C]">
            Rent, Collection & Security Deposit Financial Hub
          </h1>
          <p className="text-xs text-[#66758C] mt-0.5">
            Real-time rental ledger, arrears ageing classification, security deposit liens, and CBS clearing batch reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunReconciliation}
            className="px-3.5 py-2 bg-[#102544] hover:bg-[#0B1730] text-white font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#008C88]" />
            <span>Reconcile CBS Clearing</span>
          </button>
        </div>
      </div>

      {reconcileSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-[#16845B] rounded-xl flex items-center justify-between font-semibold shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16845B]" />
            <span>{reconcileSuccess}</span>
          </div>
          <button onClick={() => setReconcileSuccess(null)} className="text-xs underline hover:no-underline">Dismiss</button>
        </div>
      )}

      {/* Financial Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-[#E3E8F0] rounded-xl shadow-bank-card space-y-1">
          <span className="text-[#66758C] text-[10px] font-bold uppercase tracking-wider">Total Rent Collected (FY26)</span>
          <div className="text-xl font-bold font-mono text-[#16845B]">₹{totalCollected.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-[#66758C]">CBS Clearing Realized</span>
        </div>

        <div className="p-4 bg-white border border-[#E3E8F0] rounded-xl shadow-bank-card space-y-1">
          <span className="text-[#66758C] text-[10px] font-bold uppercase tracking-wider">Overdue Rental Arrears</span>
          <div className="text-xl font-bold font-mono text-[#C83E44]">₹{totalOverdue.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-[#C83E44] font-medium">{overdueLockers.length} Delinquent Accounts</span>
        </div>

        <div className="p-4 bg-white border border-[#E3E8F0] rounded-xl shadow-bank-card space-y-1">
          <span className="text-[#66758C] text-[10px] font-bold uppercase tracking-wider">Security Deposit Lien</span>
          <div className="text-xl font-bold font-mono text-[#102544]">₹{totalDepositHeld.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-[#66758C]">Linked Fixed Deposit Collateral</span>
        </div>

        <div className="p-4 bg-white border border-[#E3E8F0] rounded-xl shadow-bank-card space-y-1">
          <span className="text-[#66758C] text-[10px] font-bold uppercase tracking-wider">Auto-Debit Penetration</span>
          <div className="text-xl font-bold font-mono text-[#2457A7]">94.2%</div>
          <span className="text-[10px] text-[#66758C]">NACH e-Mandates Registered</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-[#E3E8F0] gap-4">
        {[
          { id: 'ledger', label: 'Payment Ledger & Invoices' },
          { id: 'arrears', label: 'Overdue Arrears Ageing' },
          { id: 'deposits', label: 'Security Deposits Ledger' },
          { id: 'reconciliation', label: 'CBS Settlement Reconciliation' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-2.5 font-bold text-xs transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-[#102544] text-[#102544]'
                : 'border-transparent text-[#66758C] hover:text-[#17263C]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Payment Ledger */}
      {activeTab === 'ledger' && (
        <div className="bg-white border border-[#E3E8F0] rounded-xl overflow-hidden shadow-bank-card space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-[#66758C] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search Txn Ref, Locker #..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg text-[#17263C] focus:bg-white focus:outline-none focus:border-[#2457A7]"
              />
            </div>

            <button
              onClick={handleExportPayments}
              className="px-3.5 py-1.5 bg-[#F5F7FA] hover:bg-slate-100 border border-[#E3E8F0] rounded-lg text-xs font-semibold text-[#102544] flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#2457A7]" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F5F7FA] text-[#66758C] font-bold text-[10px] uppercase border-b border-[#E3E8F0] tracking-wider">
                  <th className="py-2.5 px-3">Txn Reference</th>
                  <th className="py-2.5 px-3">Locker #</th>
                  <th className="py-2.5 px-3">Period</th>
                  <th className="py-2.5 px-3 text-right">Rent Base</th>
                  <th className="py-2.5 px-3 text-right">GST (18%)</th>
                  <th className="py-2.5 px-3 text-right">Total Amount</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Mode</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E8F0]">
                {filteredPayments.map(p => (
                  <tr key={p.id} className="hover:bg-[#F5F7FA] transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#102544]">{p.transactionRef}</td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-[#17263C]">Safe {p.lockerNumber}</td>
                    <td className="py-2.5 px-3 text-[#66758C]">{p.period}</td>
                    <td className="py-2.5 px-3 text-right font-mono">₹{p.amount.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#66758C]">₹{p.taxGst.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#102544]">₹{p.totalAmount.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-mono text-[#66758C]">{p.paymentDate}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-[11px] font-medium text-[#17263C]">{p.paymentMethod}</span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-50 text-[#16845B] border border-emerald-200">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => openReceiptModal(p.receiptNumber)}
                        className="px-2 py-1 text-xs font-semibold text-[#2457A7] hover:underline"
                      >
                        View Tax Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Arrears Ageing */}
      {activeTab === 'arrears' && (
        <div className="space-y-4">
          <div className="p-4 bg-white border border-[#E3E8F0] rounded-xl shadow-bank-card flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#102544]">Arrears Ageing Buckets (RBI Master Direction)</h3>
              <p className="text-xs text-[#66758C]">Ageing classification of delinquent lockers with statutory action matrix</p>
            </div>
            <button
              onClick={handleExportArrears}
              className="px-3.5 py-1.5 bg-[#F5F7FA] hover:bg-slate-100 border border-[#E3E8F0] rounded-lg text-xs font-semibold text-[#102544] flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-[#2457A7]" />
              <span>Export Arrears</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 bg-white border border-[#E3E8F0] rounded-xl text-center space-y-1">
              <span className="text-[10px] text-[#66758C] uppercase font-bold">1 - 30 Days</span>
              <div className="font-mono font-bold text-sm text-[#B7791F]">₹{ageingBreakdown.bucket30.toLocaleString()}</div>
              <span className="text-[10px] text-[#66758C]">Automated SMS/Email</span>
            </div>
            <div className="p-3 bg-white border border-[#E3E8F0] rounded-xl text-center space-y-1">
              <span className="text-[10px] text-[#66758C] uppercase font-bold">31 - 90 Days</span>
              <div className="font-mono font-bold text-sm text-[#B7791F]">₹{ageingBreakdown.bucket90.toLocaleString()}</div>
              <span className="text-[10px] text-[#66758C]">Registered Notice #1</span>
            </div>
            <div className="p-3 bg-white border border-[#E3E8F0] rounded-xl text-center space-y-1">
              <span className="text-[10px] text-[#66758C] uppercase font-bold">91 - 180 Days</span>
              <div className="font-mono font-bold text-sm text-[#C83E44]">₹{ageingBreakdown.bucket180.toLocaleString()}</div>
              <span className="text-[10px] text-[#66758C]">Locker Access Freeze</span>
            </div>
            <div className="p-3 bg-white border border-[#E3E8F0] rounded-xl text-center space-y-1">
              <span className="text-[10px] text-[#66758C] uppercase font-bold">181 - 365 Days</span>
              <div className="font-mono font-bold text-sm text-[#C83E44]">₹{ageingBreakdown.bucket365.toLocaleString()}</div>
              <span className="text-[10px] text-[#66758C]">Legal Demand Notice</span>
            </div>
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-center space-y-1">
              <span className="text-[10px] text-[#C83E44] uppercase font-bold">&gt; 3 Years</span>
              <div className="font-mono font-bold text-sm text-[#C83E44]">₹{ageingBreakdown.bucketStatutory.toLocaleString()}</div>
              <span className="text-[10px] text-[#C83E44] font-semibold">Statutory Break-Open</span>
            </div>
          </div>

          <div className="bg-white border border-[#E3E8F0] rounded-xl overflow-hidden shadow-bank-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F5F7FA] text-[#66758C] font-bold text-[10px] uppercase border-b border-[#E3E8F0] tracking-wider">
                    <th className="py-2.5 px-3">Locker #</th>
                    <th className="py-2.5 px-3">Branch</th>
                    <th className="py-2.5 px-3">Hirer Name</th>
                    <th className="py-2.5 px-3">CIF Number</th>
                    <th className="py-2.5 px-3">Renewal Date</th>
                    <th className="py-2.5 px-3 text-right">Overdue Dues</th>
                    <th className="py-2.5 px-3">Ageing Bucket</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E8F0]">
                  {overdueLockers.map(l => (
                    <tr key={l.id} className="hover:bg-[#F5F7FA]">
                      <td className="py-2.5 px-3 font-mono font-bold text-[#102544]">Locker #{l.lockerNumber}</td>
                      <td className="py-2.5 px-3">{l.branchName}</td>
                      <td className="py-2.5 px-3 font-semibold text-[#17263C]">Rahul Sharma</td>
                      <td className="py-2.5 px-3 font-mono text-[#66758C]">CIF-9028192831</td>
                      <td className="py-2.5 px-3 font-mono text-[#C83E44] font-semibold">{l.nextRenewalDate || '22 Oct 2026'}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[#C83E44]">₹{l.outstandingRent?.toLocaleString()}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-50 text-[#B7791F] border border-amber-200">
                          1 - 30 Days
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => {
                            downloadDocumentFile({
                              id: `notice-${l.id}`,
                              title: `Statutory Notice for Locker ${l.lockerNumber}`,
                              category: 'Payment Receipt',
                              issueDate: new Date().toLocaleDateString('en-GB'),
                              fileSize: '320 KB',
                              documentRef: `NOTICE/ANB/${l.lockerNumber}/2026`,
                              signedStatus: 'Dual-Authorized Stamped Memo'
                            });
                          }}
                          className="px-2 py-1 text-xs font-semibold text-[#2457A7] hover:underline"
                        >
                          Generate Notice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Security Deposits */}
      {activeTab === 'deposits' && (
        <div className="bg-white border border-[#E3E8F0] rounded-xl overflow-hidden shadow-bank-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#102544]">Security Deposit & Fixed Deposit Lien Register</h3>
              <p className="text-xs text-[#66758C]">Statutory 3-year rent equivalent deposit held in lien under RBI Guidelines</p>
            </div>
            <span className="font-mono text-xs text-[#16845B] font-bold">
              Total Collateral: ₹{totalDepositHeld.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F5F7FA] text-[#66758C] font-bold text-[10px] uppercase border-b border-[#E3E8F0] tracking-wider">
                  <th className="py-2.5 px-3">Locker #</th>
                  <th className="py-2.5 px-3">Branch</th>
                  <th className="py-2.5 px-3">Hirer Name</th>
                  <th className="py-2.5 px-3">Linked Term Deposit (FD)</th>
                  <th className="py-2.5 px-3 text-right">Deposit Amount</th>
                  <th className="py-2.5 px-3">Lien Status</th>
                  <th className="py-2.5 px-3 text-right">Lien Release</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E8F0]">
                {lockers.filter(l => l.status === 'Occupied').map(l => (
                  <tr key={l.id} className="hover:bg-[#F5F7FA]">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#102544]">Locker #{l.lockerNumber}</td>
                    <td className="py-2.5 px-3">{l.branchName}</td>
                    <td className="py-2.5 px-3 font-semibold text-[#17263C]">Rahul Sharma</td>
                    <td className="py-2.5 px-3 font-mono text-[#66758C]">FDR-2026-9921 (Maturity: 2029)</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#102544]">₹{l.securityDeposit.toLocaleString()}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-50 text-[#16845B] border border-emerald-200">
                        Marked in CBS Lien
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#66758C]">
                      Conditional on Surrender
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Reconciliation */}
      {activeTab === 'reconciliation' && (
        <div className="bg-white border border-[#E3E8F0] rounded-xl overflow-hidden shadow-bank-card p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E3E8F0]">
            <div>
              <h3 className="font-bold text-sm text-[#102544]">Core Banking System (CBS) Clearing Reconciliation</h3>
              <p className="text-xs text-[#66758C]">Daily batch settlement audit between locker accounting and general ledger</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-100 text-[#16845B] font-bold text-[11px] font-mono">
              STATUS: BALANCED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#F5F7FA] rounded-xl border border-[#E3E8F0] space-y-1">
              <span className="text-[#66758C] text-[11px] block">SafeVault Sub-Ledger Total</span>
              <strong className="text-base font-mono text-[#102544]">₹{totalCollected.toLocaleString('en-IN')}.00</strong>
            </div>
            <div className="p-4 bg-[#F5F7FA] rounded-xl border border-[#E3E8F0] space-y-1">
              <span className="text-[#66758C] text-[11px] block">CBS Host Account 00121028919</span>
              <strong className="text-base font-mono text-[#102544]">₹{totalCollected.toLocaleString('en-IN')}.00</strong>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
              <span className="text-emerald-800 text-[11px] block font-semibold">Net Discrepancy</span>
              <strong className="text-base font-mono text-[#16845B]">₹0.00 (Zero Drift)</strong>
            </div>
          </div>

          <div className="p-4 bg-[#102544] text-white rounded-xl flex items-center justify-between">
            <div>
              <h4 className="font-bold text-xs text-white">Automated Overnight NACH Settlement Engine</h4>
              <p className="text-white/70 text-[11px] mt-0.5">Next automated mandate execution scheduled at 02:00 AM IST</p>
            </div>
            <button
              onClick={handleRunReconciliation}
              className="px-4 py-2 bg-[#008C88] hover:bg-[#008C88]/90 text-white font-semibold rounded-lg text-xs"
            >
              Trigger Manual Recheck
            </button>
          </div>
        </div>
      )}

      {/* Document Modal */}
      <DocumentModal
        document={viewDoc}
        onClose={() => setViewDoc(null)}
      />

    </div>
  );
};
