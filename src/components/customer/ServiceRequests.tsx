import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { StatusBadge } from '../common/StatusBadge';
import { PageHeader } from '../common/PageHeader';
import { OtpModal } from '../common/OtpModal';
import { useScrollLock } from '../../hooks/useScrollLock';
import { ServiceRequest } from '../../types';
import { COMPLIANCE_CONFIG } from '../../config/compliance.config';
import {
  Wrench,
  Key,
  ShieldAlert,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Plus,
  Copy,
  Check,
  AlertTriangle,
  ArrowUpDown,
  Move,
  Trash2,
  X,
  ExternalLink,
  Send,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

interface RequestTypeConfig {
  type: ServiceRequest['requestType'];
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  cost: number | null;
  costLabel: string;
  tatDays: number;
  description: string;
  requiresTechnician?: boolean;
}

const REQUEST_TYPES_CATALOG: RequestTypeConfig[] = [
  {
    type: 'Lost Key & Break-Open',
    title: 'Lost Key & Break-Open',
    icon: Key,
    cost: 4500,
    costLabel: '₹4,500 + 18% GST',
    tatDays: 3,
    description: 'Statutory physical drill-open by authorized manufacturer locksmith (Godrej) in hirer presence.',
    requiresTechnician: true
  },
  {
    type: 'Lock Replacement',
    title: 'Lock Replacement',
    icon: Wrench,
    cost: 2200,
    costLabel: '₹2,200 + 18% GST',
    tatDays: 2,
    description: 'Dual-key lock mechanism renewal with fresh factory sealed uncopied keys.',
    requiresTechnician: true
  },
  {
    type: 'Locker Damage / Maintenance',
    title: 'Damage / Maintenance',
    icon: AlertTriangle,
    cost: 0,
    costLabel: 'Complimentary',
    tatDays: 2,
    description: 'Hinges stiff, lock tumbler jammed, compartment alignment or cosmetic inspection.'
  },
  {
    type: 'Size Upgrade / Downgrade',
    title: 'Size Change',
    icon: ArrowUpDown,
    cost: 0,
    costLabel: 'No Admin Fee',
    tatDays: 5,
    description: 'Request migration to a Small, Medium, Large or Extra-Large safe compartment.'
  },
  {
    type: 'Branch Relocation',
    title: 'Branch Relocation',
    icon: Move,
    cost: 1000,
    costLabel: '₹1,000 + GST',
    tatDays: 7,
    description: 'Inter-branch portfolio transfer to another SafeVault flagship or retail vault.'
  },
  {
    type: 'Surrender Locker',
    title: 'Surrender Locker',
    icon: Trash2,
    cost: 0,
    costLabel: 'Pro-Rata Refund',
    tatDays: 1,
    description: 'Voluntary closure, return physical keys, release security deposit and unexpired advance rent.'
  },
  {
    type: 'Exceptional Access',
    title: 'Exceptional Access',
    icon: ShieldAlert,
    cost: 0,
    costLabel: 'Branch Discretion',
    tatDays: 1,
    description: 'Emergency custody access under PoA, medical exigency, or special bank approval.'
  }
];

export const ServiceRequests: React.FC = () => {
  const { lockers, serviceRequests, createServiceRequest, setCustomerView } = useBanking();
  const customerLockers = lockers.filter(l => l.customerId === 'cust-rahul-01' || l.customerName === 'Rahul Sharma');

  const [activeTab, setActiveTab] = useState<'list' | 'new'>('list');
  const [selectedLockerId, setSelectedLockerId] = useState(customerLockers[0]?.id || 'lck-125');
  const [selectedRequestType, setSelectedRequestType] = useState<ServiceRequest['requestType']>('Lost Key & Break-Open');
  const [description, setDescription] = useState('');
  const [activeSrModal, setActiveSrModal] = useState<ServiceRequest | null>(null);
  const [escalatingSr, setEscalatingSr] = useState<ServiceRequest | null>(null);
  const [escalationLevel, setEscalationLevel] = useState<number>(1);
  const [escalationGrievanceNote, setEscalationGrievanceNote] = useState('');
  const [escalationSubmitted, setEscalationSubmitted] = useState<string | null>(null);

  // OTP step-up for logging request
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newlyCreatedTicket, setNewlyCreatedTicket] = useState<string | null>(null);

  useScrollLock(!!activeSrModal || !!escalatingSr);

  const selectedLocker = lockers.find(l => l.id === selectedLockerId) || customerLockers[0] || lockers[0];
  const activeTypeConfig = REQUEST_TYPES_CATALOG.find(c => c.type === selectedRequestType) || REQUEST_TYPES_CATALOG[0];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    setIsOtpOpen(true);
  };

  const handleOtpSuccess = () => {
    const cost = activeTypeConfig.cost ? activeTypeConfig.cost : undefined;
    const ticket = createServiceRequest({
      customerId: 'cust-rahul-01',
      customerName: 'Rahul Sharma',
      lockerId: selectedLocker.id,
      lockerNumber: selectedLocker.lockerNumber,
      branchName: selectedLocker.branchName,
      requestType: selectedRequestType,
      description,
      estimatedCost: cost,
    });

    setDescription('');
    setNewlyCreatedTicket(ticket);
    setActiveTab('list');
    setTimeout(() => setNewlyCreatedTicket(null), 7000);
  };

  const handleEscalationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!escalatingSr) return;

    const levelObj = COMPLIANCE_CONFIG.escalationHierarchy.find(h => h.level === escalationLevel);
    // Add audit note to request timeline
    escalatingSr.timeline.unshift({
      status: `Escalated to Level ${escalationLevel}`,
      timestamp: `${new Date().toLocaleDateString('en-GB')}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      actor: 'Customer Escalation Desk',
      note: `Escalated to ${levelObj?.role || 'Nodal Officer'} (${levelObj?.contact}). Grievance: ${escalationGrievanceNote || 'SLA timeline exceeded without final resolution.'}`
    });

    setEscalationSubmitted(escalatingSr.ticketNumber);
    setEscalatingSr(null);
    setEscalationGrievanceNote('');
    setTimeout(() => setEscalationSubmitted(null), 5000);
  };

  return (
    <div className="space-y-5 pb-8 text-xs">
      
      {/* Universal PageHeader with 4-row layout */}
      <PageHeader
        title="Service & Operations Requests"
        subtitle="Technical maintenance, break-open protocols, lock replacements & custody requests"
        onBack={() => setCustomerView('dashboard')}
        backAriaLabel="Back to Home Dashboard"
        badges={
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#97144D]/10 dark:bg-[#97144D]/25 text-[#97144D] dark:text-[#FFDF85] border border-[#97144D]/20 text-[10px] font-bold font-mono">
              Custody Support Desk
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-[10px] font-bold">
              Track & Escalate SLAs
            </span>
          </div>
        }
        actionsOrSelector={
          <div className="w-full">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B5B68] dark:text-[#A898A4] mb-1">
              Active Safe Locker Compartment:
            </label>
            <select
              value={selectedLockerId}
              onChange={e => setSelectedLockerId(e.target.value)}
              className="w-full h-11 bg-white dark:bg-[#221019] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] rounded-2xl px-3 text-xs font-bold text-[#1F1420] dark:text-[#F5ECF1] focus:outline-none focus:ring-2 focus:ring-[#97144D] shadow-2xs"
            >
              {customerLockers.map(lkr => (
                <option key={lkr.id} value={lkr.id}>
                  Locker #{lkr.lockerNumber} ({lkr.size}) · {lkr.branchName}
                </option>
              ))}
            </select>
          </div>
        }
      />

      {/* Segmented Control */}
      <div className="flex p-1 bg-[#FAF6F8] dark:bg-[#221019] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] rounded-2xl">
        <button
          onClick={() => setActiveTab('list')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'list'
              ? 'bg-[#97144D] text-white shadow-xs font-extrabold'
              : 'text-[#6B5B68] dark:text-[#A898A4] hover:text-[#1F1420] dark:hover:text-[#F5ECF1]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Requests ({serviceRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('new')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'new'
              ? 'bg-[#97144D] text-white shadow-xs font-extrabold'
              : 'text-[#6B5B68] dark:text-[#A898A4] hover:text-[#1F1420] dark:hover:text-[#F5ECF1]'
          }`}
        >
          <Plus className="w-4 h-4 text-[#FFDF85]" />
          <span>Raise New Request</span>
        </button>
      </div>

      {/* Newly Created Ticket Banner */}
      {newlyCreatedTicket && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-900 dark:text-emerald-100 flex items-start gap-3 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-emerald-800 dark:text-emerald-300 block text-xs">
              Service Request Submitted Successfully!
            </span>
            <p className="text-emerald-700 dark:text-emerald-400 text-[11px] mt-0.5 leading-relaxed">
              Ticket <span className="font-mono font-bold text-emerald-900 dark:text-emerald-200">{newlyCreatedTicket}</span> logged to Branch Custodian & Maker-Checker review.
            </p>
          </div>
        </div>
      )}

      {/* Escalation Submitted Banner */}
      {escalationSubmitted && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-900 dark:text-amber-100 flex items-start gap-3 shadow-xs animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-800 dark:text-amber-300 block text-xs">
              Escalation Lodged for Ticket {escalationSubmitted}
            </span>
            <p className="text-amber-700 dark:text-amber-400 text-[11px] mt-0.5 leading-relaxed">
              Dispatched directly to the designated Supervisory / Nodal Officer with priority audit tracking.
            </p>
          </div>
        </div>
      )}

      {/* TAB 1: MY REQUESTS (SINGLE-COLUMN ON MOBILE, NO CLIPPED TEXT) */}
      {activeTab === 'list' && (
        <div className="space-y-3.5">
          {serviceRequests.length === 0 ? (
            <div className="text-center py-10 bg-white dark:bg-[#1E0C16] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] rounded-2xl p-6 space-y-2">
              <Wrench className="w-8 h-8 text-[#6B5B68] dark:text-[#A898A4] mx-auto opacity-50" />
              <p className="font-bold text-xs text-[#1F1420] dark:text-[#F5ECF1]">No Active Service Requests</p>
              <p className="text-[11px] text-[#6B5B68] dark:text-[#A898A4]">You do not have any open custody or technical requests.</p>
              <button
                onClick={() => setActiveTab('new')}
                className="mt-2 px-4 py-2 bg-[#97144D] text-white text-xs font-bold rounded-xl active-press"
              >
                Raise New Request
              </button>
            </div>
          ) : (
            serviceRequests.map(sr => {
              const matchedType = REQUEST_TYPES_CATALOG.find(t => t.type === sr.requestType);
              const IconComp = matchedType?.icon || Wrench;
              return (
                <div
                  key={sr.id}
                  className="bg-white dark:bg-[#1E0C16] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] rounded-2xl p-4 shadow-sm space-y-3 hover:border-[#97144D]/40 transition-all"
                >
                  {/* Top row: Type Icon + Status + Locker Chip */}
                  <div className="flex items-start justify-between gap-2 border-b border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)] pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#FAF6F8] dark:bg-[#2A1220] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] flex items-center justify-center shrink-0">
                        <IconComp className="w-4 h-4 text-[#97144D] dark:text-[#FFDF85]" />
                      </div>
                      <div>
                        <span className="font-extrabold text-[#1F1420] dark:text-[#F5ECF1] text-xs block leading-tight">
                          {sr.requestType}
                        </span>
                        <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4]">
                          {sr.branchName}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <StatusBadge status={sr.status} size="sm" />
                      <span className="font-mono text-[10px] font-bold text-[#6B5B68] dark:text-[#A898A4] bg-[#FAF6F8] dark:bg-[#2A1220] px-2 py-0.5 rounded border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)]">
                        Safe #{sr.lockerNumber}
                      </span>
                    </div>
                  </div>

                  {/* Token ID on its own line in small monospace with copy button */}
                  <div>
                    <span className="text-[10px] font-bold text-[#6B5B68] dark:text-[#A898A4] uppercase tracking-wider block mb-0.5">
                      Request Tracking Token
                    </span>
                    <div className="flex items-center justify-between bg-[#FAF6F8] dark:bg-[#2A1220] px-3 py-1.5 rounded-xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)]">
                      <span className="font-mono text-xs font-bold text-[#97144D] dark:text-[#FFDF85] break-all">
                        {sr.ticketNumber}
                      </span>
                      <button
                        onClick={() => copyToClipboard(sr.ticketNumber)}
                        className="p-1 text-[#6B5B68] dark:text-[#A898A4] hover:text-[#97144D] dark:hover:text-[#FFDF85] transition-colors ml-2 shrink-0 cursor-pointer"
                        title="Copy Ticket ID"
                      >
                        {copiedId === sr.ticketNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Description (Wrap, never clip) */}
                  <p className="text-[11px] text-[#1F1420] dark:text-[#F5ECF1] leading-relaxed break-words bg-[#FAF6F8]/60 dark:bg-[#25101E]/60 p-2.5 rounded-xl border border-[#E8DFE5]/60 dark:border-[rgba(255,255,255,0.06)]">
                    {sr.description}
                  </p>

                  {/* Details grid: Logged date, Assigned Desk, Fee */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-xl bg-[#FAF6F8] dark:bg-[#2A1220]">
                      <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] block">Logged Date</span>
                      <span className="font-mono font-bold text-[#1F1420] dark:text-[#F5ECF1] tabular-nums">{sr.createdDate}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#FAF6F8] dark:bg-[#2A1220]">
                      <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] block">Assigned Desk</span>
                      <span className="font-semibold text-[#1F1420] dark:text-[#F5ECF1] truncate block">
                        {sr.assignedOfficer || 'Branch Custodian'}
                      </span>
                    </div>
                    {sr.estimatedCost && (
                      <div className="p-2 rounded-xl bg-[#FAF6F8] dark:bg-[#2A1220] col-span-2 flex justify-between items-center">
                        <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4]">Technical Charges:</span>
                        <span className="font-mono font-bold text-[#97144D] dark:text-[#FFDF85]">₹{sr.estimatedCost.toLocaleString('en-IN')} + GST</span>
                      </div>
                    )}
                  </div>

                  {/* SLA line */}
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#C9A24B]">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>Expected resolution: 48 hrs (SLA: 2 working days)</span>
                  </div>

                  {/* Bottom Action buttons: View Progress & Escalate */}
                  <div className="pt-2 border-t border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)] flex items-center justify-between gap-2">
                    <button
                      onClick={() => setActiveSrModal(sr)}
                      className="flex-1 h-9 px-3 bg-[#FAF6F8] dark:bg-[#2A1220] hover:bg-[#E8DFE5] dark:hover:bg-[#341628] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] rounded-xl text-xs font-bold text-[#1F1420] dark:text-[#F5ECF1] transition-colors flex items-center justify-center gap-1.5 cursor-pointer active-press"
                    >
                      <span>View Progress ({sr.timeline.length})</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#97144D] dark:text-[#FFDF85]" />
                    </button>

                    <button
                      onClick={() => setEscalatingSr(sr)}
                      className="px-3 h-9 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer active-press"
                      title="Escalate grievance if SLA passed"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Escalate</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: RAISE NEW REQUEST */}
      {activeTab === 'new' && (
        <div className="bg-white dark:bg-[#1E0C16] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] rounded-2xl p-4 shadow-sm space-y-4">
          <div className="border-b border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] pb-2.5">
            <h2 className="text-xs font-extrabold text-[#1F1420] dark:text-[#F5ECF1]">
              Submit Custody or Operations Ticket
            </h2>
            <p className="text-[11px] text-[#6B5B68] dark:text-[#A898A4] mt-0.5">
              Select category and provide specifics for Branch Custodian and Maker-Checker action
            </p>
          </div>

          <form onSubmit={handlePreSubmit} className="space-y-4">
            
            {/* Category Grid Tiles */}
            <div>
              <label className="block text-[11px] font-bold text-[#1F1420] dark:text-[#F5ECF1] mb-1.5">
                Select Service Category:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {REQUEST_TYPES_CATALOG.map(item => {
                  const Icon = item.icon;
                  const isSelected = selectedRequestType === item.type;
                  return (
                    <div
                      key={item.type}
                      onClick={() => setSelectedRequestType(item.type)}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#97144D]/10 dark:bg-[#97144D]/25 border-[#97144D] text-[#97144D] dark:text-[#FFDF85] shadow-xs'
                          : 'bg-[#FAF6F8] dark:bg-[#2A1220] border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)] text-[#1F1420] dark:text-[#F5ECF1] hover:border-[#97144D]/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-[#97144D] dark:text-[#FFDF85]' : 'text-[#6B5B68]'}`} />
                          <span className="font-bold text-xs">{item.title}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#97144D] dark:text-[#FFDF85]" />}
                      </div>
                      <p className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] mt-1 leading-snug line-clamp-2">
                        {item.description}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono">
                        <span className="font-bold">{item.costLabel}</span>
                        <span className="text-[#6B5B68] dark:text-[#A898A4]">SLA: {item.tatDays}d</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Target Locker */}
            <div>
              <label className="block text-[11px] font-bold text-[#1F1420] dark:text-[#F5ECF1] mb-1">
                Locker Compartment:
              </label>
              <select
                value={selectedLockerId}
                onChange={e => setSelectedLockerId(e.target.value)}
                className="w-full h-10 bg-[#FAF6F8] dark:bg-[#2A1220] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] rounded-xl px-3 font-semibold text-xs text-[#1F1420] dark:text-[#F5ECF1] focus:outline-none focus:ring-2 focus:ring-[#97144D]"
              >
                {customerLockers.map(l => (
                  <option key={l.id} value={l.id}>
                    Safe #{l.lockerNumber} ({l.size}) · {l.branchName}
                  </option>
                ))}
              </select>
            </div>

            {/* Charges Preview Box */}
            <div className="p-3 bg-[#FAF6F8] dark:bg-[#2A1220] rounded-xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#1F1420] dark:text-[#F5ECF1]">
                  Applicable Technical Fee:
                </span>
                <span className="font-mono font-bold text-xs text-[#97144D] dark:text-[#FFDF85]">
                  {activeTypeConfig.costLabel}
                </span>
              </div>
              <p className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] leading-relaxed">
                {activeTypeConfig.requiresTechnician 
                  ? 'Charges cover authorized lock manufacturer technician drill, replacement dual-key lock set, and witness officer verification. Billed upon completion.' 
                  : 'Operational request governed by SafeVault service terms and RBI locker guidelines.'}
              </p>
            </div>

            {/* Description Textarea */}
            <div>
              <label className="block text-[11px] font-bold text-[#1F1420] dark:text-[#F5ECF1] mb-1">
                Detailed Circumstances & Requirements:
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="State circumstances, preferred date/time, or specific locker issues..."
                className="w-full bg-[#FAF6F8] dark:bg-[#2A1220] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] rounded-xl p-3 text-xs text-[#1F1420] dark:text-[#F5ECF1] focus:outline-none focus:ring-2 focus:ring-[#97144D]"
              />
            </div>

            {/* Statutory Disclaimer */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-amber-800 dark:text-amber-300">
                  Submitted - subject to bank verification and approval
                </strong>
                <span>
                  Physical vault operations require two-officer maker-checker concurrence and customer Aadhaar step-up authentication.
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="px-4 h-11 text-xs font-bold text-[#6B5B68] dark:text-[#A898A4] hover:bg-[#FAF6F8] dark:hover:bg-[#2A1220] rounded-xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!description.trim()}
                className="flex-1 sm:flex-initial px-5 h-11 text-xs font-bold bg-gradient-to-r from-[#97144D] to-[#6B0E37] text-white rounded-xl hover:from-[#851144] hover:to-[#5E0C30] disabled:opacity-50 shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer active-press"
              >
                <Send className="w-4 h-4 text-[#FFDF85]" />
                <span>Authorize & Submit Ticket</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DETAIL MODAL / VERTICAL PROGRESS TIMELINE */}
      {activeSrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#1E0C16] rounded-2xl shadow-2xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] max-w-lg w-full p-5 space-y-4 max-h-[85vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#97144D] dark:text-[#FFDF85]">
                    {activeSrModal.ticketNumber}
                  </span>
                  <StatusBadge status={activeSrModal.status} size="sm" />
                </div>
                <h3 className="font-extrabold text-[#1F1420] dark:text-[#F5ECF1] text-sm mt-0.5">
                  {activeSrModal.requestType}
                </h3>
                <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4]">
                  Safe #{activeSrModal.lockerNumber} · {activeSrModal.branchName}
                </span>
              </div>
              <button
                onClick={() => setActiveSrModal(null)}
                className="p-1.5 text-[#6B5B68] dark:text-[#A898A4] hover:text-[#1F1420] dark:hover:text-[#F5ECF1] rounded-lg hover:bg-[#FAF6F8] dark:hover:bg-[#2A1220] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Statement */}
            <div className="p-3 bg-[#FAF6F8] dark:bg-[#2A1220] rounded-xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B5B68] dark:text-[#A898A4] block mb-1">
                Customer Statement:
              </span>
              <p className="text-xs text-[#1F1420] dark:text-[#F5ECF1] leading-relaxed break-words">
                {activeSrModal.description}
              </p>
            </div>

            {activeSrModal.adminRemarks && (
              <div className="p-3 bg-[#97144D]/10 dark:bg-[#97144D]/20 rounded-xl border border-[#97144D]/25">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#97144D] dark:text-[#FFDF85] block mb-1">
                  Branch Custodian Remarks:
                </span>
                <p className="text-xs text-[#1F1420] dark:text-[#F5ECF1] leading-relaxed">
                  {activeSrModal.adminRemarks}
                </p>
              </div>
            )}

            {/* Vertical Audit Timeline */}
            <div>
              <h4 className="font-extrabold text-[#1F1420] dark:text-[#F5ECF1] text-xs mb-3 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#97144D] dark:text-[#FFDF85]" />
                <span>Vertical Audit Timeline Trail</span>
              </h4>
              <div className="relative pl-6 space-y-3.5 border-l-2 border-[#97144D] dark:border-[#FFDF85] ml-2">
                {activeSrModal.timeline.map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[#97144D] dark:bg-[#FFDF85] border-2 border-white dark:border-[#1E0C16] shadow-xs" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1F1420] dark:text-[#F5ECF1] text-xs">{item.status}</span>
                        <span className="text-[#6B5B68] dark:text-[#A898A4] font-mono text-[10px] tabular-nums">{item.timestamp}</span>
                      </div>
                      <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] block mt-0.5">By {item.actor}</span>
                      <p className="text-[11px] text-[#1F1420] dark:text-[#F5ECF1] mt-1 leading-relaxed bg-[#FAF6F8]/50 dark:bg-[#25101E]/50 p-2 rounded-lg border border-[#E8DFE5]/60 dark:border-[rgba(255,255,255,0.06)]">
                        {item.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] flex justify-end">
              <button
                onClick={() => setActiveSrModal(null)}
                className="w-full sm:w-auto px-5 h-10 bg-[#97144D] text-white text-xs font-bold rounded-xl active-press cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ESCALATION MODAL (4-TIER HIERARCHY) */}
      {escalatingSr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#1E0C16] rounded-2xl shadow-2xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] max-w-lg w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <h3 className="font-extrabold text-[#1F1420] dark:text-[#F5ECF1] text-sm">
                    Escalate Custody Grievance
                  </h3>
                </div>
                <p className="text-[11px] text-[#6B5B68] dark:text-[#A898A4] mt-0.5">
                  Ticket #{escalatingSr.ticketNumber} · Safe #{escalatingSr.lockerNumber}
                </p>
              </div>
              <button
                onClick={() => setEscalatingSr(null)}
                className="p-1.5 text-[#6B5B68] dark:text-[#A898A4] hover:text-[#1F1420] dark:hover:text-[#F5ECF1] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEscalationSubmit} className="space-y-3.5">
              <label className="block text-[11px] font-bold text-[#1F1420] dark:text-[#F5ECF1]">
                Select Escalation Authority:
              </label>

              {/* 4 Levels from compliance.config.ts */}
              <div className="space-y-2">
                {COMPLIANCE_CONFIG.escalationHierarchy.map(tier => {
                  const isChosen = escalationLevel === tier.level;
                  return (
                    <div
                      key={tier.level}
                      onClick={() => setEscalationLevel(tier.level)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isChosen
                          ? 'bg-[#97144D]/10 dark:bg-[#97144D]/25 border-[#97144D] text-[#97144D] dark:text-[#FFDF85]'
                          : 'bg-[#FAF6F8] dark:bg-[#2A1220] border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)] text-[#1F1420] dark:text-[#F5ECF1]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#97144D] text-white flex items-center justify-center text-[10px] font-bold">
                            {tier.level}
                          </span>
                          <span className="font-bold text-xs">{tier.role}</span>
                        </div>
                        {isChosen && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[10px] text-[#6B5B68] dark:text-[#A898A4]">
                        <span>TAT: {tier.tat}</span>
                        <span className="font-mono text-[9px]">{tier.contact}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1F1420] dark:text-[#F5ECF1] mb-1">
                  Reason for Escalation / Unresolved Issues:
                </label>
                <textarea
                  rows={3}
                  required
                  value={escalationGrievanceNote}
                  onChange={e => setEscalationGrievanceNote(e.target.value)}
                  placeholder="Explain why standard TAT was breached or what urgent assistance is required..."
                  className="w-full bg-[#FAF6F8] dark:bg-[#2A1220] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] rounded-xl p-3 text-xs text-[#1F1420] dark:text-[#F5ECF1] focus:outline-none focus:ring-2 focus:ring-[#97144D]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEscalatingSr(null)}
                  className="px-4 h-10 text-xs font-bold text-[#6B5B68] dark:text-[#A898A4] rounded-xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!escalationGrievanceNote.trim()}
                  className="flex-1 sm:flex-initial px-5 h-10 text-xs font-bold bg-[#97144D] text-white rounded-xl hover:bg-[#851144] disabled:opacity-50 transition-colors flex items-center justify-center gap-2 cursor-pointer active-press"
                >
                  <Send className="w-3.5 h-3.5 text-[#FFDF85]" />
                  <span>Transmit Priority Escalation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OTP Step-Up Modal for Submitting New Request */}
      <OtpModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onSuccess={handleOtpSuccess}
        title="Authorize Custody Request"
        actionDescription={`Authorizing ${selectedRequestType} ticket submission for Locker #${selectedLocker.lockerNumber}`}
      />

    </div>
  );
};
