import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { StatusBadge } from '../common/StatusBadge';
import { Appointment } from '../../types';
import {
  Calendar,
  Clock,
  Key,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Search,
  ScanLine,
  ShieldCheck
} from 'lucide-react';

export const VisitManagement: React.FC = () => {
  const { appointments, adminCheckInAppointment, adminCompleteAppointment } = useBanking();

  const [searchToken, setSearchToken] = useState('');
  const [completeModalApt, setCompleteModalApt] = useState<Appointment | null>(null);
  const [custodianRemarks, setCustodianRemarks] = useState('Routine custody operation. Master key #1 & Hirer key #2 engaged. Compartment verified closed.');

  const handleSimulatedScan = () => {
    const unconfirmed = appointments.find(a => a.status === 'Confirmed');
    if (unconfirmed) {
      adminCheckInAppointment(unconfirmed.id);
      alert(`Scanned Token #${unconfirmed.tokenNumber} for ${unconfirmed.customerName} (Locker ${unconfirmed.lockerNumber}). Visitor Checked-In successfully.`);
    } else {
      alert('No pending confirmed appointment ready for scan.');
    }
  };

  const handleCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (completeModalApt) {
      adminCompleteAppointment(completeModalApt.id, custodianRemarks);
      setCompleteModalApt(null);
    }
  };

  const filteredApts = appointments.filter(a => {
    if (!searchToken.trim()) return true;
    const q = searchToken.toLowerCase();
    return (
      a.tokenNumber.toLowerCase().includes(q) ||
      a.customerName.toLowerCase().includes(q) ||
      a.lockerNumber.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 text-xs">
      
      {/* Title */}
      <div className="pb-3 border-b border-[#E3E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#17263C]">
              Strongroom Access Queue & Turnstile Validation
            </h1>
            <span className="text-[10px] font-bold text-[#008C88] bg-[#008C88]/10 border border-[#008C88]/20 px-2 py-0.5 rounded tracking-wide uppercase">
              Gate Control
            </span>
          </div>
          <p className="text-[#66758C] text-xs mt-1">
            Biometric gate turnstiles, digital QR token verification, and dual physical key completion register
          </p>
        </div>
      </div>

      {/* Quick QR Scanner Bar */}
      <div className="p-4 bg-[#102544] text-white rounded-xl shadow-bank-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#0B1730]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#008C88]/20 text-[#008C88] flex items-center justify-center font-bold">
            <ScanLine className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Branch Turnstile Token Validator</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Scan customer mobile QR pass or enter token reference manually
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulatedScan}
            className="px-4 py-2 bg-[#008C88] hover:bg-[#008C88]/90 text-white font-semibold text-xs rounded-lg flex items-center gap-2 shadow-xs transition-colors"
          >
            <QrCode className="w-4 h-4" />
            <span>Simulate Live QR Token Scan</span>
          </button>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white border border-[#E3E8F0] rounded-xl overflow-hidden shadow-bank-card space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-[#17263C] text-sm">
              Today&apos;s Visitor Register ({filteredApts.length})
            </h3>
            <span className="text-xs text-[#66758C]">Escort Custodian: Priya Nair (Senior Manager)</span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#66758C] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by token, name, locker..."
              value={searchToken}
              onChange={e => setSearchToken(e.target.value)}
              className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg pl-8 pr-3 py-1.5 text-[#17263C] text-xs placeholder-[#66758C] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F5F7FA] text-[#66758C] border-b border-[#E3E8F0] text-[10px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Token #</th>
                <th className="py-3 px-4">Locker #</th>
                <th className="py-3 px-4">Visitor Name</th>
                <th className="py-3 px-4">Scheduled Window</th>
                <th className="py-3 px-4">Purpose</th>
                <th className="py-3 px-4">Check-In Time</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Custodian Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E8F0] text-xs">
              {filteredApts.map(apt => (
                <tr key={apt.id} className="hover:bg-[#F5F7FA]/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#17263C]">
                    {apt.tokenNumber}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#2457A7]">
                    Safe {apt.lockerNumber}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#17263C]">
                    {apt.customerName}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#66758C] tabular-nums">
                    {apt.date} · {apt.timeSlot}
                  </td>
                  <td className="py-3 px-4 text-[#17263C]">
                    {apt.purpose}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#17263C] tabular-nums">
                    {apt.checkInTime || '-'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <StatusBadge status={apt.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    {apt.status === 'Confirmed' && (
                      <button
                        onClick={() => adminCheckInAppointment(apt.id)}
                        className="px-3 py-1 text-xs font-semibold text-white bg-[#102544] hover:bg-[#0B1730] rounded shadow-xs transition-colors"
                      >
                        Check-In
                      </button>
                    )}
                    {apt.status === 'Checked In' && (
                      <button
                        onClick={() => setCompleteModalApt(apt)}
                        className="px-3 py-1 text-xs font-semibold text-white bg-[#16845B] hover:bg-[#16845B]/90 rounded shadow-xs transition-colors"
                      >
                        Complete Exit
                      </button>
                    )}
                    {apt.status === 'Completed' && (
                      <span className="text-[11px] font-mono text-[#16845B] flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Logged at {apt.completedTime}</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complete Exit Modal */}
      {completeModalApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1730]/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-[#E3E8F0] max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-[#17263C] text-sm">
              Complete Vault Operation & Record Access Log
            </h3>
            <p className="text-[#66758C] text-xs">
              Safe {completeModalApt.lockerNumber} · Visitor: {completeModalApt.customerName}
            </p>

            <form onSubmit={handleCompleteSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-[#17263C] mb-1 text-xs">
                  Custodian Vault Verification Statement
                </label>
                <textarea
                  rows={3}
                  value={custodianRemarks}
                  onChange={e => setCustodianRemarks(e.target.value)}
                  required
                  className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2.5 text-[#17263C] text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-950 text-xs flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#16845B] shrink-0 mt-0.5" />
                <span>
                  Confirming will automatically register an entry in the customer&apos;s verified <strong>Access History</strong> with cryptographic timestamp.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCompleteModalApt(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-[#66758C] hover:bg-[#F5F7FA] rounded-lg border border-[#E3E8F0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-[#16845B] text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 shadow-xs transition-colors"
                >
                  Confirm Exit & Commit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
