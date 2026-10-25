import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { StatusBadge } from '../common/StatusBadge';
import { Complaint } from '../../types';
import {
  HelpCircle,
  MessageSquare,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Shield,
  Plus
} from 'lucide-react';

export const SupportCenter: React.FC = () => {
  const { lockers, complaints, raiseComplaint } = useBanking();
  const customerLockers = lockers.filter(l => l.customerId === 'cust-rahul-01');

  const [activeTab, setActiveTab] = useState<'tickets' | 'new' | 'faqs' | 'contacts'>('tickets');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // New Complaint State
  const [selectedLockerNumber, setSelectedLockerNumber] = useState(customerLockers[0]?.lockerNumber || 'A-125');
  const [category, setCategory] = useState<Complaint['category']>('Locker Rental Billing');
  const [severity, setSeverity] = useState<Complaint['severity']>('Medium');
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !details.trim()) return;

    raiseComplaint({
      customerName: 'Rahul Sharma',
      lockerNumber: selectedLockerNumber,
      category,
      severity,
      subject,
      details,
      slaTargetHours: severity === 'Critical' ? 24 : severity === 'High' ? 48 : 72,
    });

    setSubject('');
    setDetails('');
    setActiveTab('tickets');
  };

  const faqs = [
    {
      q: 'What is the standard procedure if I misplace or lose my Locker Key?',
      a: 'The bank does not maintain any duplicate master key. You must immediately notify the branch custodian to initiate an emergency freeze. A break-open appointment will be scheduled with an authorized lock manufacturer technician in your presence. Standard break-open and lock replacement charges (₹4,500 + GST) apply.'
    },
    {
      q: 'How does operating mandate work under "Either or Survivor"?',
      a: 'Under an Either or Survivor mandate, either of the registered joint hirers has full legal authority to operate the locker independently without requiring the presence or signature of the other holder.'
    },
    {
      q: 'What compensation does the Bank provide in case of vault fire or burglary?',
      a: 'Under RBI directions, the bank is liable for deficiency in safe custody services up to one hundred times (100x) the annual locker rent in cases of fire, theft, burglary, dacoity, or structural vault failure.'
    },
    {
      q: 'Why does the bank require a linked Fixed Deposit (Security Deposit)?',
      a: 'As authorized by the Reserve Bank of India, banks may obtain a term deposit covering 3 years of locker rent plus prospective break-open charges. The deposit remains the property of the customer, earns full interest, and is refunded upon surrender.'
    },
    {
      q: 'Can a nominee operate the locker during the lifetime of the primary holder?',
      a: 'No. A nominee has zero rights to operate the locker or access contents during the lifetime of the hirer. Nomination under Form DA-1 only takes effect upon the certified demise of the account holder.'
    }
  ];

  return (
    <div className="space-y-6 text-xs">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E3E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#17263C]">
              Support Desk & Banking Ombudsman Cell
            </h1>
            <span className="text-[10px] font-bold text-[#008C88] bg-[#008C88]/10 border border-[#008C88]/20 px-2 py-0.5 rounded tracking-wide uppercase">
              Statutory Redressal
            </span>
          </div>
          <p className="text-[#66758C] text-xs mt-1">
            Grievance redressal, SLA tracking, custodian contact directory, and safe custody FAQs
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#F5F7FA] p-1 rounded-lg border border-[#E3E8F0]">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'tickets' ? 'bg-white text-[#102544] shadow-xs' : 'text-[#66758C] hover:text-[#17263C]'
            }`}
          >
            My Complaints ({complaints.length})
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1 ${
              activeTab === 'new' ? 'bg-white text-[#102544] shadow-xs' : 'text-[#66758C] hover:text-[#17263C]'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-[#008C88]" />
            <span>Lodge Grievance</span>
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'faqs' ? 'bg-white text-[#102544] shadow-xs' : 'text-[#66758C] hover:text-[#17263C]'
            }`}
          >
            FAQs
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'contacts' ? 'bg-white text-[#102544] shadow-xs' : 'text-[#66758C] hover:text-[#17263C]'
            }`}
          >
            Escalation Matrix
          </button>
        </div>
      </div>

      {/* TAB 1: TICKETS LIST */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {complaints.map(comp => (
              <div
                key={comp.id}
                className="p-5 bg-white border border-[#E3E8F0] rounded-xl shadow-bank-card space-y-3"
              >
                <div className="flex items-start justify-between border-b border-[#E3E8F0] pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-[#17263C] text-sm">{comp.complaintNumber}</span>
                      <StatusBadge status={comp.status} size="sm" />
                    </div>
                    <span className="text-[11px] text-[#66758C] font-mono mt-0.5 block">
                      Category: {comp.category} · Safe {comp.lockerNumber}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    comp.severity === 'Critical' ? 'bg-rose-50 text-[#C83E44] border-rose-200' : 'bg-[#F5F7FA] text-[#17263C] border-[#E3E8F0]'
                  }`}>
                    {comp.severity} Severity
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-[#17263C] text-xs">{comp.subject}</h4>
                  <p className="text-[#66758C] mt-1 leading-relaxed text-xs">{comp.details}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-[#66758C] border-t border-[#E3E8F0]">
                  <div>
                    <span className="text-[#66758C] text-[10px] uppercase block font-medium">SLA Target</span>
                    <span className="font-mono text-[#17263C] tabular-nums font-semibold">{comp.slaTargetHours} Hours</span>
                  </div>
                  <div>
                    <span className="text-[#66758C] text-[10px] uppercase block font-medium">Assigned Desk</span>
                    <span className="text-[#17263C] truncate block font-medium">{comp.assignedTo}</span>
                  </div>
                </div>

                {comp.resolutionNote && (
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200/70 text-[#16845B] text-xs">
                    <strong>Resolution Note:</strong> {comp.resolutionNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: LODGE GRIEVANCE */}
      {activeTab === 'new' && (
        <div className="max-w-2xl mx-auto bg-white border border-[#E3E8F0] rounded-xl p-6 shadow-bank-card space-y-5">
          <div className="border-b border-[#E3E8F0] pb-3">
            <h2 className="text-sm font-bold text-[#17263C]">
              Lodge Grievance to Customer Service Committee
            </h2>
            <p className="text-[#66758C] mt-0.5 text-xs">
              Every complaint is logged with a mandatory turnaround time (TAT) under RBI guidelines
            </p>
          </div>

          <form onSubmit={handleComplaintSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#17263C] mb-1">Select Locker</label>
                <select
                  value={selectedLockerNumber}
                  onChange={e => setSelectedLockerNumber(e.target.value)}
                  className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2 font-medium text-[#17263C] text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
                >
                  {customerLockers.map(l => (
                    <option key={l.id} value={l.lockerNumber}>
                      Locker {l.lockerNumber} ({l.branchName.split('-')[0].trim()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#17263C] mb-1">Grievance Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as Complaint['category'])}
                  className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2 font-medium text-[#17263C] text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
                >
                  <option value="Locker Rental Billing">Locker Rental Billing & Overcharges</option>
                  <option value="Vault Access Delay">Vault Access Delay / Staff Unavailability</option>
                  <option value="Key / Lock Mechanism">Key / Lock Mechanism Stiffness</option>
                  <option value="Nominee Processing">Nominee Form DA-1 Processing Delay</option>
                  <option value="Staff Assistance">Staff Assistance / Facility Hygiene</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#17263C] mb-1">Severity Level</label>
              <div className="grid grid-cols-4 gap-2">
                {(['Low', 'Medium', 'High', 'Critical'] as Complaint['severity'][]).map(sev => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`py-2 text-center rounded-lg border font-semibold text-xs transition-colors ${
                      severity === sev
                        ? 'bg-[#102544] text-white border-[#102544]'
                        : 'bg-[#F5F7FA] text-[#17263C] border-[#E3E8F0] hover:bg-[#E3E8F0]'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#17263C] mb-1">Subject</label>
              <input
                type="text"
                placeholder="Brief summary of grievance..."
                value={subject}
                onChange={e => setSubject(e.target.value)}
                required
                className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2.5 font-medium text-[#17263C] text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#17263C] mb-1">Detailed Explanation</label>
              <textarea
                rows={4}
                placeholder="Provide exact dates, branch visits, and details of incident..."
                value={details}
                onChange={e => setDetails(e.target.value)}
                required
                className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-3 text-[#17263C] text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('tickets')}
                className="px-4 py-2 text-xs font-semibold text-[#66758C] hover:bg-[#F5F7FA] rounded-lg border border-[#E3E8F0]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#102544] text-white font-semibold text-xs rounded-lg hover:bg-[#0B1730] shadow-xs transition-colors"
              >
                Lodge Grievance Ticket
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: FAQS */}
      {activeTab === 'faqs' && (
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((f, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E3E8F0] rounded-xl overflow-hidden shadow-bank-card"
            >
              <button
                onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                className="w-full p-4 text-left font-semibold text-xs text-[#17263C] flex items-center justify-between hover:bg-[#F5F7FA]/70 transition-colors"
              >
                <span>{f.q}</span>
                {openFaqIdx === idx ? (
                  <ChevronUp className="w-4 h-4 text-[#66758C] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#66758C] shrink-0" />
                )}
              </button>
              {openFaqIdx === idx && (
                <div className="p-4 pt-0 text-[#66758C] text-xs leading-relaxed border-t border-[#E3E8F0] bg-[#F5F7FA]/40">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: ESCALATION MATRIX */}
      {activeTab === 'contacts' && (
        <div className="max-w-3xl mx-auto bg-white border border-[#E3E8F0] rounded-xl p-6 shadow-bank-card space-y-5">
          <h3 className="font-bold text-[#17263C] text-sm">
            4-Tier Bank Ombudsman Grievance Escalation Matrix
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-[#F5F7FA] rounded-lg border border-[#E3E8F0] space-y-1">
              <span className="font-bold text-[#102544] text-xs">Level 1: Branch Custodian & Operations Manager</span>
              <p className="text-[#66758C] text-xs">
                Ms. Priya Nair · Phone: +91 11 2334 8890 · Email: cp.custodian@apexbank.in · Resolution TAT: 48 Hours
              </p>
            </div>

            <div className="p-4 bg-[#F5F7FA] rounded-lg border border-[#E3E8F0] space-y-1">
              <span className="font-bold text-[#102544] text-xs">Level 2: Zonal Operations Head (North Zone)</span>
              <p className="text-[#66758C] text-xs">
                Mr. R. K. Singhal · Phone: +91 11 2371 4400 · Email: zonal.north@apexbank.in · Resolution TAT: 4 Business Days
              </p>
            </div>

            <div className="p-4 bg-[#F5F7FA] rounded-lg border border-[#E3E8F0] space-y-1">
              <span className="font-bold text-[#102544] text-xs">Level 3: Principal Nodal Officer (Bank Ombudsman Cell)</span>
              <p className="text-[#66758C] text-xs">
                Corporate Office, Barakhamba Road, New Delhi · Email: nodal.ombudsman@apexbank.in · Resolution TAT: 7 Days
              </p>
            </div>

            <div className="p-4 bg-[#102544] text-white rounded-lg space-y-1 shadow-bank-card border border-[#0B1730]">
              <span className="font-bold text-[#008C88] text-xs">Level 4: Reserve Bank of India - Integrated Ombudsman Scheme</span>
              <p className="text-slate-300 text-xs">
                If your grievance remains unaddressed beyond 30 days, file an appeal at cms.rbi.org.in or dial Toll-Free 14448.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
