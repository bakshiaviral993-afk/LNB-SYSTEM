import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  EyeOff,
  UserCheck,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const AuditSecurityControls: React.FC = () => {
  const { auditLogs } = useBanking();
  const [filterAction, setFilterAction] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLogs = auditLogs.filter(log => {
    if (filterAction !== 'All' && log.entityType !== filterAction) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.user.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.entityId.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Enterprise Page Header */}
      <div className="bg-white rounded-xl border border-[#E3E8F0] shadow-bank-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#102544]/5 text-[#102544] border border-[#102544]/15">
              RBI Master Direction • Information Security & Governance
            </span>
            <span className="text-xs text-[#66758C]">Immutable Audit Ledger • ISO/IEC 27001</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#17263C]">
            Audit Trail, Access Controls & Regulatory Governance
          </h1>
          <p className="text-xs text-[#66758C] mt-1">
            Dual authorization logs, maker-checker electronic sign-offs, step-up verifications, and privacy compliance records.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F5F7FA] border border-[#E3E8F0] text-xs font-mono text-[#102544]">
          <ShieldCheck className="w-4 h-4 text-[#16845B]" />
          <span>WORM Compliant Ledger Active</span>
        </div>
      </div>

      {/* Strict Privacy & Security Protocols Banner */}
      <div className="p-5 bg-[#0B1730] text-white rounded-xl shadow-bank-card space-y-2.5 border border-[#102544]">
        <div className="flex items-center gap-2 text-[#008C88] font-bold uppercase tracking-wider text-xs">
          <EyeOff className="w-4 h-4" />
          <span>Statutory Locker Privacy & Zero-Content Inspection Protocol</span>
        </div>
        <p className="text-slate-300 text-xs leading-relaxed max-w-4xl">
          Under Section 45ZE of the Banking Regulation Act, 1949 and Reserve Bank of India Safe Custody Directions, bank officers, software systems, and external auditors are strictly prohibited from inspecting, surveying, cataloging, or storing the contents of customer safe deposit lockers. System logs record custody turns and operational events exclusively.
        </p>
      </div>

      {/* Role-Based Access Control (RBAC) Architecture Matrix */}
      <div className="bg-white border border-[#E3E8F0] rounded-xl p-5 shadow-bank-card space-y-4">
        <h3 className="text-sm font-bold text-[#17263C] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#2457A7]" />
          <span>Role-Based Access Control (RBAC) & Four-Eyes Dual Control Matrix</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-[#F5F7FA] rounded-xl border border-[#E3E8F0] space-y-1.5">
            <span className="font-bold text-xs text-[#17263C] block">Locker Custodian (Officer)</span>
            <p className="text-xs text-[#66758C] leading-relaxed">
              Master key physical custody, turnstile check-in, booth escort, and key handover memo counter-signatures.
            </p>
          </div>

          <div className="p-4 bg-[#F5F7FA] rounded-xl border border-[#E3E8F0] space-y-1.5">
            <span className="font-bold text-xs text-[#17263C] block">Branch Operations Manager</span>
            <p className="text-xs text-[#66758C] leading-relaxed">
              Allotment scrutiny, lock break-open orders, surrender finalization, and periodic KYC refresh approvals.
            </p>
          </div>

          <div className="p-4 bg-[#F5F7FA] rounded-xl border border-[#E3E8F0] space-y-1.5">
            <span className="font-bold text-xs text-[#17263C] block">Legal & Claims Committee</span>
            <p className="text-xs text-[#66758C] leading-relaxed">
              Deceased hirer claim scrutiny, succession certificates verification, Form DA-1 matching, and inventory release.
            </p>
          </div>

          <div className="p-4 bg-[#F5F7FA] rounded-xl border border-[#E3E8F0] space-y-1.5">
            <span className="font-bold text-xs text-[#17263C] block">Hirer / Joint Operating Customer</span>
            <p className="text-xs text-[#66758C] leading-relaxed">
              Self-service portal access, visit appointment booking, rental settlements, 2FA emergency freeze, and Form DA-1.
            </p>
          </div>
        </div>
      </div>

      {/* Cryptographic Audit Trail Table */}
      <div className="bg-white border border-[#E3E8F0] rounded-xl overflow-hidden shadow-bank-card space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E3E8F0] pb-4">
          <div>
            <h3 className="text-sm font-bold text-[#17263C]">
              Immutable System Audit Trail ({filteredLogs.length} events)
            </h3>
            <p className="text-xs text-[#66758C] mt-0.5">Time-stamped audit entries cryptographically linked by CBS Core Security Layer</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={filterAction}
              onChange={e => setFilterAction(e.target.value)}
              className="bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 py-2 text-xs text-[#17263C] font-medium focus:outline-none focus:ring-2 focus:ring-[#2457A7]/20 focus:border-[#2457A7]"
            >
              <option value="All">All Entity Types</option>
              <option value="Locker">Locker Events</option>
              <option value="Appointment">Appointment Visits</option>
              <option value="Payment">Payments & Dues</option>
              <option value="Nominee">Nominees</option>
              <option value="ServiceRequest">Service Requests</option>
              <option value="Claim">Claims</option>
              <option value="Agreement">Agreements</option>
            </select>

            <div className="relative w-56">
              <Search className="w-3.5 h-3.5 text-[#66758C] absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search audit records..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg pl-8.5 pr-3 py-2 text-xs text-[#17263C] focus:outline-none focus:ring-2 focus:ring-[#2457A7]/20 focus:border-[#2457A7]"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F5F7FA] text-[#66758C] border-b border-[#E3E8F0] uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor / User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Action Performed</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">IP / Channel</th>
                <th className="py-3 px-4">Details & Observations</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E8F0]">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-[#F5F7FA] transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[#66758C] whitespace-nowrap tabular-nums">
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#17263C] whitespace-nowrap">
                    {log.user}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-[#102544]/5 text-[#102544] border border-[#102544]/15 font-medium">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#17263C] whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#2457A7] whitespace-nowrap">
                    {log.entityId}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#66758C] whitespace-nowrap">
                    {log.ipAddress}
                  </td>
                  <td className="py-3.5 px-4 text-[#66758C] max-w-xs text-xs leading-relaxed">
                    {log.details}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <StatusBadge status={log.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
