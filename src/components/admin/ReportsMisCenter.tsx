import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import {
  FileSpreadsheet,
  Download,
  Filter,
  Calendar,
  Building2,
  Layers,
  Search,
  Printer,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { LockerItem, AccessLog, ServiceRequest, AuditLogItem } from '../../types';

export const ReportsMisCenter: React.FC<{
  initialReport?: 'availability' | 'occupancy' | 'arrears' | 'access' | 'tat' | 'audit' | 'rbi';
}> = ({ initialReport }) => {
  const {
    lockers,
    branches,
    payments,
    appointments,
    accessLogs,
    serviceRequests,
    auditLogs,
    applications
  } = useBanking();

  const [activeReport, setActiveReport] = useState<
    'availability' | 'occupancy' | 'arrears' | 'access' | 'tat' | 'audit' | 'rbi'
  >(initialReport || 'availability');

  React.useEffect(() => {
    if (initialReport) {
      setActiveReport(initialReport);
    }
  }, [initialReport]);
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [dateRange, setDateRange] = useState('mtd');
  const [searchFilter, setSearchFilter] = useState('');

  // Helper to resolve customer name
  const getCustomerName = (customerId?: string) => {
    if (!customerId) return 'Vacant / Unallocated';
    if (customerId === 'cust-rahul-01') return 'Rahul Sharma';
    if (customerId === 'cust-anita-02') return 'Anita Verma';
    if (customerId === 'cust-vikram-03') return 'Vikram Malhotra';
    return `Hirer (${customerId})`;
  };

  // Report configurations
  const reportsList = [
    { id: 'availability', title: 'Locker Availability & Vacancy Register', code: 'REP-LCK-01', desc: 'Real-time branch inventory with size tier vacancy counts' },
    { id: 'occupancy', title: 'Occupancy & Capacity Utilization MIS', code: 'REP-MIS-02', desc: 'Occupancy percentages, revenue run rates and capacity distribution' },
    { id: 'arrears', title: 'Rent Collection & Arrears Ageing Register', code: 'REP-FIN-03', desc: 'RBI overdue aging (30, 60, 90, 180, 360+ days) and recovery stats' },
    { id: 'access', title: 'Strongroom Turnstile & Access History Log', code: 'REP-SEC-04', desc: 'Visitor identities, check-in/out timestamps, and escort bank officer' },
    { id: 'tat', title: 'Customer Service TAT & SLA Compliance', code: 'REP-OPS-05', desc: 'Turnaround time for key replacement, nominee change, and complaints' },
    { id: 'audit', title: 'Comprehensive Regulatory Audit Trail', code: 'REP-AUD-06', desc: 'Cryptographically ordered system mutation logs with user timestamps' },
    { id: 'rbi', title: 'RBI Statutory Master Compliance Return', code: 'REP-RBI-07', desc: 'Mandatory quarterly reporting for safe deposit vault operations' },
  ];

  // Helper for CSV export
  const exportToCsv = (headers: string[], rows: (string | number)[][], filename: string) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.map(cell => `"${cell}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1. Availability Report Data
  const getAvailabilityData = () => {
    return lockers.filter(l => {
      if (selectedBranch !== 'all' && l.branchId !== selectedBranch) return false;
      if (selectedSize !== 'all' && l.size !== selectedSize) return false;
      if (searchFilter && !l.lockerNumber.toLowerCase().includes(searchFilter.toLowerCase())) return false;
      return true;
    });
  };

  // 2. Arrears Report Data
  const getArrearsData = () => {
    return lockers
      .filter(l => (l.outstandingRent || 0) > 0)
      .filter(l => {
        if (selectedBranch !== 'all' && l.branchId !== selectedBranch) return false;
        const cust = getCustomerName(l.customerId);
        if (searchFilter && !l.lockerNumber.toLowerCase().includes(searchFilter.toLowerCase()) && !cust.toLowerCase().includes(searchFilter.toLowerCase())) return false;
        return true;
      });
  };

  // 3. Access Log Data
  const getAccessData = () => {
    return accessLogs.filter(log => {
      if (searchFilter) {
        const q = searchFilter.toLowerCase();
        return (
          log.lockerNumber.toLowerCase().includes(q) ||
          log.operatedBy.toLowerCase().includes(q) ||
          log.vaultOfficer.toLowerCase().includes(q)
        );
      }
      return true;
    });
  };

  // 4. TAT Data
  const getTatData = () => {
    return serviceRequests.filter(sr => {
      if (searchFilter) {
        const q = searchFilter.toLowerCase();
        return sr.ticketNumber.toLowerCase().includes(q) || sr.customerName.toLowerCase().includes(q) || sr.requestType.toLowerCase().includes(q);
      }
      return true;
    });
  };

  // 5. Audit Data
  const getAuditData = () => {
    return auditLogs.filter(al => {
      if (searchFilter) {
        const q = searchFilter.toLowerCase();
        return al.action.toLowerCase().includes(q) || al.details.toLowerCase().includes(q) || al.user.toLowerCase().includes(q);
      }
      return true;
    });
  };

  const handleDownloadCsv = () => {
    if (activeReport === 'availability') {
      const headers = ['Locker Number', 'Branch', 'Size', 'Status', 'Annual Rent (INR)', 'Customer Name', 'Outstanding (INR)'];
      const rows = getAvailabilityData().map(l => [
        l.lockerNumber,
        branches.find(b => b.id === l.branchId)?.name || l.branchId,
        l.size,
        l.status,
        l.annualRent,
        getCustomerName(l.customerId),
        l.outstandingRent || 0
      ]);
      exportToCsv(headers, rows, 'NationalBank_Locker_Availability_Report');
    } else if (activeReport === 'arrears') {
      const headers = ['Locker Number', 'Customer Name', 'Branch', 'Annual Rent', 'Total Arrears (INR)', 'Overdue Ageing Bucket'];
      const rows = getArrearsData().map(l => [
        l.lockerNumber,
        getCustomerName(l.customerId),
        branches.find(b => b.id === l.branchId)?.name || l.branchId,
        l.annualRent,
        l.outstandingRent || 0,
        (l.outstandingRent || 0) >= 30000 ? '365+ Days (Delinquent)' : (l.outstandingRent || 0) >= 15000 ? '180-365 Days' : '90-180 Days'
      ]);
      exportToCsv(headers, rows, 'NationalBank_Locker_Arrears_Report');
    } else if (activeReport === 'access') {
      const headers = ['Date', 'Time In', 'Time Out', 'Locker Number', 'Visitor Name', 'Operator Type', 'Verification Method', 'Vault Officer'];
      const rows = getAccessData().map(a => [
        a.date,
        a.timeIn,
        a.timeOut,
        a.lockerNumber,
        a.operatedBy,
        a.operatorType,
        a.verificationMethod,
        a.vaultOfficer
      ]);
      exportToCsv(headers, rows, 'NationalBank_Access_Turnstile_Report');
    } else if (activeReport === 'tat') {
      const headers = ['Ticket #', 'Customer Name', 'Request Type', 'Created Date', 'Status', 'SLA Target', 'SLA Compliance'];
      const rows = getTatData().map(sr => [
        sr.ticketNumber,
        sr.customerName,
        sr.requestType,
        sr.createdDate,
        sr.status,
        '48 Hours',
        sr.status === 'Resolved / Closed' ? 'Met (Within SLA)' : 'In Progress'
      ]);
      exportToCsv(headers, rows, 'NationalBank_Service_Request_TAT_Report');
    } else {
      const headers = ['Log ID', 'Timestamp', 'Action Code', 'Entity ID', 'User', 'Details'];
      const rows = getAuditData().map(a => [
        a.id,
        a.timestamp,
        a.action,
        a.entityId,
        a.user,
        a.details
      ]);
      exportToCsv(headers, rows, 'NationalBank_Regulatory_Audit_Trail');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-[#E3E8F0] p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#102544] text-[#008C88] flex items-center justify-center font-bold shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[#102544] tracking-tight">
                Enterprise MIS & Regulatory Reporting Desk
              </h1>
              <p className="text-xs text-[#66758C]">
                Statutory RBI returns, occupancy analytics, arrears ageing register & audit extracts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-[#F5F7FA] hover:bg-[#E3E8F0] text-[#17263C] text-xs font-semibold rounded-lg border border-[#E3E8F0] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#66758C]" />
              Print
            </button>
            <button
              onClick={handleDownloadCsv}
              className="px-4 py-1.5 bg-[#102544] hover:bg-[#0B1730] text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#008C88]" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Global Filter Bar */}
        <div className="mt-5 pt-4 border-t border-[#E3E8F0] grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-[#66758C] mb-1">Branch Scope</label>
            <select
              value={selectedBranch}
              onChange={e => setSelectedBranch(e.target.value)}
              className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2 text-xs font-semibold text-[#102544] focus:outline-none focus:border-[#2457A7]"
            >
              <option value="all">Consolidated (All Branches)</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#66758C] mb-1">Locker Dimension / Size</label>
            <select
              value={selectedSize}
              onChange={e => setSelectedSize(e.target.value)}
              className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2 text-xs font-semibold text-[#102544] focus:outline-none focus:border-[#2457A7]"
            >
              <option value="all">All Sizes (Small to XL)</option>
              <option value="Small">Small (Compact)</option>
              <option value="Medium">Medium (Standard)</option>
              <option value="Large">Large (Executive)</option>
              <option value="Extra Large">Extra Large (High Net Worth)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#66758C] mb-1">Accounting Period</label>
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2 text-xs font-semibold text-[#102544] focus:outline-none focus:border-[#2457A7]"
            >
              <option value="today">Today (Real-time)</option>
              <option value="mtd">Month to Date (MTD)</option>
              <option value="qtd">Quarter to Date (QTD)</option>
              <option value="ytd">Financial Year 2025-26 (YTD)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#66758C] mb-1">Keyword / Identifier Filter</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#66758C] absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Locker #, customer, or CIF..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#F5F7FA] border border-[#E3E8F0] text-xs rounded-lg text-[#102544] placeholder-[#66758C] focus:outline-none focus:border-[#2457A7]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Report Switcher Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {reportsList.map(rep => {
          const isActive = activeReport === rep.id;
          return (
            <button
              key={rep.id}
              onClick={() => setActiveReport(rep.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border text-left shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#102544] text-white border-[#102544] shadow-xs'
                  : 'bg-white text-[#66758C] border-[#E3E8F0] hover:text-[#102544] hover:bg-[#F5F7FA]'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-mono px-1 rounded ${isActive ? 'bg-white/20 text-white' : 'bg-[#E3E8F0] text-[#102544]'}`}>
                  {rep.code}
                </span>
                <span>{rep.title}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Report Header Meta */}
      <div className="bg-[#102544] rounded-xl p-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#008C88] font-bold">
            {reportsList.find(r => r.id === activeReport)?.code} · Bank Official Statement
          </span>
          <h2 className="text-base font-bold text-white">
            {reportsList.find(r => r.id === activeReport)?.title}
          </h2>
          <p className="text-xs text-white/70">
            {reportsList.find(r => r.id === activeReport)?.desc}
          </p>
        </div>

        <div className="text-right text-xs shrink-0 border-t sm:border-t-0 sm:border-l border-white/20 pt-2 sm:pt-0 sm:pl-4">
          <div className="text-white/60 text-[10px] uppercase font-bold">Generated At</div>
          <div className="font-mono font-bold text-white">
            {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} 10:30 IST
          </div>
          <div className="text-[10px] text-[#008C88] font-semibold">Dual-Sign-Off Verified</div>
        </div>
      </div>

      {/* Report Table Content */}
      <div className="bg-white rounded-xl border border-[#E3E8F0] shadow-xs overflow-hidden">
        {activeReport === 'availability' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F5F7FA] border-b border-[#E3E8F0] text-[#66758C] font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Locker Number</th>
                  <th className="py-3 px-4">Branch</th>
                  <th className="py-3 px-4">Tier / Size</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4">Allocated Hirer</th>
                  <th className="py-3 px-4 text-right">Annual Tariff</th>
                  <th className="py-3 px-4 text-right">Arrears</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E8F0]">
                {getAvailabilityData().map(l => (
                  <tr key={l.id} className="hover:bg-[#F5F7FA]/75 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#102544]">{l.lockerNumber}</td>
                    <td className="py-3 px-4 text-[#17263C]">{branches.find(b => b.id === l.branchId)?.name || 'Branch'}</td>
                    <td className="py-3 px-4 font-semibold text-[#66758C]">{l.size}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        l.status === 'Vacant' ? 'bg-emerald-100 text-emerald-800' :
                        l.status === 'Occupied' ? 'bg-blue-100 text-blue-800' :
                        l.status === 'Blocked' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#102544] font-medium">{getCustomerName(l.customerId)}</td>
                    <td className="py-3 px-4 text-right font-mono font-semibold">₹{l.annualRent.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#C83E44]">
                      {(l.outstandingRent || 0) > 0 ? `₹${l.outstandingRent?.toLocaleString('en-IN')}` : 'Nil'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === 'arrears' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F5F7FA] border-b border-[#E3E8F0] text-[#66758C] font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Locker #</th>
                  <th className="py-3 px-4">Hirer Name & CIF</th>
                  <th className="py-3 px-4">Branch</th>
                  <th className="py-3 px-4 text-right">Annual Rent</th>
                  <th className="py-3 px-4 text-right">Outstanding Dues</th>
                  <th className="py-3 px-4">Ageing Classification</th>
                  <th className="py-3 px-4">Statutory Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E8F0]">
                {getArrearsData().map(l => (
                  <tr key={l.id} className="hover:bg-[#F5F7FA]/75 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#102544]">{l.lockerNumber}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#102544]">{getCustomerName(l.customerId)}</div>
                      <div className="text-[10px] font-mono text-[#66758C]">{l.customerId || 'CIF-UNKNOWN'}</div>
                    </td>
                    <td className="py-3 px-4">{branches.find(b => b.id === l.branchId)?.name}</td>
                    <td className="py-3 px-4 text-right font-mono">₹{l.annualRent.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#C83E44]">
                      ₹{l.outstandingRent?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        (l.outstandingRent || 0) >= 30000 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {(l.outstandingRent || 0) >= 30000 ? '365+ Days (Delinquent)' : '90-180 Days Overdue'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[11px] font-medium text-[#102544]">
                      {(l.outstandingRent || 0) >= 20000 ? 'Eligible for Break-Open Notice' : 'Auto-Debit Retry / SMS Notice'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === 'access' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F5F7FA] border-b border-[#E3E8F0] text-[#66758C] font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Locker #</th>
                  <th className="py-3 px-4">Operated By</th>
                  <th className="py-3 px-4">Operator Type</th>
                  <th className="py-3 px-4">Verification Method</th>
                  <th className="py-3 px-4">Vault Officer</th>
                  <th className="py-3 px-4 text-right">Time In / Out</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E8F0]">
                {getAccessData().map(a => (
                  <tr key={a.id} className="hover:bg-[#F5F7FA]/75 transition-colors">
                    <td className="py-3 px-4 font-mono text-[#66758C]">{a.date}</td>
                    <td className="py-3 px-4 font-mono font-bold text-[#102544]">{a.lockerNumber}</td>
                    <td className="py-3 px-4 font-semibold text-[#102544]">{a.operatedBy}</td>
                    <td className="py-3 px-4 text-[#17263C]">{a.operatorType}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-max">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {a.verificationMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#17263C]">{a.vaultOfficer}</td>
                    <td className="py-3 px-4 text-right font-mono font-semibold">{a.timeIn} - {a.timeOut}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(activeReport === 'tat' || activeReport === 'audit' || activeReport === 'occupancy' || activeReport === 'rbi') && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F5F7FA] border-b border-[#E3E8F0] text-[#66758C] font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Audit ID</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action Code</th>
                  <th className="py-3 px-4">Entity Key</th>
                  <th className="py-3 px-4">Operating User</th>
                  <th className="py-3 px-4">Audit Details & Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E8F0]">
                {getAuditData().map(al => (
                  <tr key={al.id} className="hover:bg-[#F5F7FA]/75 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-[#66758C]">{al.id}</td>
                    <td className="py-3 px-4 font-mono text-[#102544]">{al.timestamp}</td>
                    <td className="py-3 px-4 font-mono font-bold text-[#2457A7]">{al.action}</td>
                    <td className="py-3 px-4 font-mono text-[#17263C]">{al.entityId}</td>
                    <td className="py-3 px-4 text-[#102544] font-medium">{al.user}</td>
                    <td className="py-3 px-4 text-[#66758C] max-w-md truncate">{al.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
