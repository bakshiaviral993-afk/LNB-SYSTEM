import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { StatusBadge } from '../common/StatusBadge';
import { DocumentModal } from '../common/DocumentModal';
import { OtpModal } from '../common/OtpModal';
import { PageHeader } from '../common/PageHeader';
import { Holder, Nominee, StoredDocument, AuthorizedOperator } from '../../types';
import { COMPLIANCE_CONFIG } from '../../config/compliance.config';
import {
  Users,
  UserCheck,
  UserPlus,
  Shield,
  FileText,
  AlertCircle,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Lock,
  Plus,
  XCircle,
  Edit,
  ShieldAlert,
  Copy,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';

export const HoldersNominees: React.FC = () => {
  const {
    lockers,
    holders,
    nominees,
    addNominee,
    cancelNominee,
    authorizedOperators,
    addAuthorizedOperator,
    revokeAuthorizedOperator,
    contactUpdates,
    submitContactUpdate,
    selectedLockerId,
    setSelectedLockerId,
    documents,
    setCustomerView
  } = useBanking();

  const customerLockers = lockers.filter(l => l.customerId === 'cust-rahul-01' || l.customerName === 'Rahul Sharma');
  const [activeLockerId, setActiveLockerId] = useState<string>(selectedLockerId || 'lck-125');
  const [activeTab, setActiveTab] = useState<'holders' | 'operators' | 'nominees' | 'add-nominee' | 'contact'>('holders');

  // Multi-Nominee state (supports up to 4 nominees with share % totaling 100)
  const [nomFormCode, setNomFormCode] = useState<'SL-1' | 'SL-1A'>('SL-1');
  const [nomName, setNomName] = useState('');
  const [nomRel, setNomRel] = useState('Spouse');
  const [nomDob, setNomDob] = useState('1992-06-14');
  const [nomSharePercent, setNomSharePercent] = useState<number>(100);
  const [nomIsMinor, setNomIsMinor] = useState(false);
  const [nomGuardianName, setNomGuardianName] = useState('');
  const [nomPhone, setNomPhone] = useState('+91 98101 23456');
  const [nomAddress, setNomAddress] = useState('Flat 402, Oakwood Enclave, Barakhamba Road, New Delhi 110001');
  const [eNominationConsent, setENominationConsent] = useState(true);

  // Add Authorized Operator State
  const [opName, setOpName] = useState('');
  const [opRel, setOpRel] = useState('Father / Legal Representative');
  const [opMandate, setOpMandate] = useState<AuthorizedOperator['mandateType']>('Power of Attorney (PoA)');
  const [opPoaRef, setOpPoaRef] = useState('SV/POA/2026/0491');
  const [opIdType, setOpIdType] = useState<AuthorizedOperator['idProofType']>('Aadhaar');
  const [opIdNum, setOpIdNum] = useState('XXXX-XXXX-4819');
  const [opPhone, setOpPhone] = useState('+91 98200 11223');
  const [opValidTill, setOpValidTill] = useState('2028-12-31');

  // Contact Details Update Form State
  const [contactMobile, setContactMobile] = useState('+91 98101 23456');
  const [contactEmail, setContactEmail] = useState('rahul.sharma@enterprise-corp.in');
  const [contactAddress, setContactAddress] = useState('Flat 402, Oakwood Enclave, Barakhamba Road, New Delhi 110001');
  const [contactReason, setContactReason] = useState('Relocation / Periodic communication update');

  // OTP Modal State
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [pendingOtpAction, setPendingOtpAction] = useState<'add-nominee' | 'cancel-nominee' | 'add-operator' | 'revoke-operator' | 'update-contact'>('add-nominee');
  const [targetNomineeIdToCancel, setTargetNomineeIdToCancel] = useState<string | null>(null);
  const [targetOperatorIdToRevoke, setTargetOperatorIdToRevoke] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [copiedText, setCopiedText] = useState<string | null>(null);

  const currentLocker = lockers.find(l => l.id === activeLockerId) || customerLockers[0];
  const currentHolders = holders[activeLockerId] || [];
  const currentNominees = nominees[activeLockerId] || [];
  const currentOperators = authorizedOperators[activeLockerId] || [];

  // Calculate total existing nominee share %
  const currentTotalShare = currentNominees.reduce((acc, curr) => acc + (curr.sharePercentage || 100), 0);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleNomineeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nomSharePercent <= 0 || nomSharePercent > 100) {
      alert('Nominee share percentage must be between 1% and 100%');
      return;
    }
    setPendingOtpAction('add-nominee');
    setIsOtpOpen(true);
  };

  const handleOperatorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPendingOtpAction('add-operator');
    setIsOtpOpen(true);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPendingOtpAction('update-contact');
    setIsOtpOpen(true);
  };

  const handleOtpSuccess = () => {
    if (pendingOtpAction === 'add-nominee') {
      addNominee(activeLockerId, {
        name: nomName || 'Priya Sharma',
        relationship: nomRel,
        dateOfBirth: nomDob,
        isMinor: nomIsMinor,
        guardianName: nomIsMinor ? nomGuardianName : undefined,
        address: nomAddress,
        phone: nomPhone,
        sharePercentage: nomSharePercent
      });
      setStatusMessage(`Nominee registered successfully under Form ${nomFormCode}. Registered on CBS.`);
      setActiveTab('nominees');
    } else if (pendingOtpAction === 'cancel-nominee' && targetNomineeIdToCancel) {
      cancelNominee(targetNomineeIdToCancel, activeLockerId);
      setStatusMessage('Nomination cancelled under statutory Form SL-2.');
      setTargetNomineeIdToCancel(null);
    } else if (pendingOtpAction === 'add-operator') {
      addAuthorizedOperator(activeLockerId, {
        name: opName || 'Vikas Sharma',
        relationship: opRel,
        mandateType: opMandate,
        poaRegistrationRef: opPoaRef,
        idProofType: opIdType,
        idProofNumber: opIdNum || 'XXXX-XXXX-4819',
        phone: opPhone,
        validFrom: new Date().toISOString().split('T')[0],
        validTill: opValidTill
      });
      setStatusMessage('Authorized Operator mandate registered and submitted for branch custodian verification.');
      setActiveTab('operators');
    } else if (pendingOtpAction === 'revoke-operator' && targetOperatorIdToRevoke) {
      revokeAuthorizedOperator(activeLockerId, targetOperatorIdToRevoke);
      setStatusMessage('Authorized Operator mandate revoked successfully.');
      setTargetOperatorIdToRevoke(null);
    } else if (pendingOtpAction === 'update-contact') {
      submitContactUpdate(contactMobile, contactEmail, contactAddress, contactReason);
      setStatusMessage('Contact update request submitted. SMS/Email confirmation dispatched.');
    }

    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Plain language operating mandate explanation
  const getPlainLanguageMandate = (mode: string) => {
    switch (mode) {
      case 'Either or Survivor':
        return 'Either holder can operate the locker alone without requiring the co-hirer present.';
      case 'Jointly':
        return 'Both joint holders must be physically present simultaneously with original IDs to unlock.';
      case 'Former or Survivor':
        return 'Only the primary hirer operates during lifetime; secondary hirer gains access thereafter.';
      default:
        return 'Single hirer sole operation mandate.';
    }
  };

  return (
    <div className="space-y-4 pb-28 text-[#1F1420] dark:text-[#F5ECF1]">
      
      {/* Universal PageHeader (Title never squeezed!) */}
      <PageHeader
        title="Holders & Nominees"
        subtitle="Manage joint hirers, authorized Power of Attorney operators, and statutory nomination under RBI locker guidelines."
        onBack={() => setCustomerView('dashboard')}
        badges={
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#97144D]/10 dark:bg-[#97144D]/25 text-[#97144D] dark:text-[#FFDF85] border border-[#97144D]/20 text-[10px] font-bold font-mono">
              Statutory Forms SL-1 / SL-2 / SL-3
            </span>
            <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] italic">
              (validate with bank compliance)
            </span>
          </div>
        }
        actionsOrSelector={
          <div className="w-full">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B5B68] dark:text-[#A898A4] mb-1">
              Active Safe Locker Compartment:
            </label>
            <select
              value={activeLockerId}
              onChange={e => {
                setActiveLockerId(e.target.value);
                setSelectedLockerId(e.target.value);
              }}
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

      {statusMessage && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Operating Mandate Card (Burgundy Gradient with Plain Language Line) */}
      <div className="bg-gradient-to-r from-[#6B0E37] via-[#851144] to-[#97144D] text-white p-4 rounded-3xl shadow-md border border-[#6B0E37] space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#FFDF85]" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#FFDF85] font-extrabold">
              OPERATING MANDATE
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-mono text-xs font-bold">
            {currentLocker?.operatingMode || 'Either or Survivor'}
          </span>
        </div>

        <p className="text-xs font-medium text-white/95 leading-relaxed">
          {getPlainLanguageMandate(currentLocker?.operatingMode || 'Either or Survivor')}
        </p>

        <div className="pt-1 flex items-center justify-between text-[11px] text-white/80 border-t border-white/15">
          <span>Registered Mandate: SafeVault CBS-2026</span>
          <span className="font-mono text-[#FFDF85]">Locker #{currentLocker?.lockerNumber}</span>
        </div>
      </div>

      {/* Clean Tab Bar (Scroll-snap, no clipped labels, theme colors) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none snap-x">
        {[
          { id: 'holders', label: `Holders (${currentHolders.length})` },
          { id: 'operators', label: `Operators (${currentOperators.length})` },
          { id: 'nominees', label: `Nominees (${currentNominees.length})` },
          { id: 'add-nominee', label: '+ Add Nominee' },
          { id: 'contact', label: 'Contact' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`h-10 px-4 rounded-xl text-xs font-bold whitespace-nowrap snap-start transition-all cursor-pointer active-press ${
              activeTab === tab.id
                ? 'bg-[#97144D] text-white shadow-xs'
                : 'bg-white dark:bg-[#221019] text-[#6B5B68] dark:text-[#A898A4] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] hover:bg-[#FAF6F8]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: HOLDERS (Single Column Cards) */}
      {activeTab === 'holders' && (
        <div className="space-y-3">
          <div className="px-1 flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#1F1420] dark:text-[#F5ECF1]">
              Registered Hirers for Locker #{currentLocker?.lockerNumber}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentHolders.map(h => (
              <div
                key={h.id}
                className="bg-white dark:bg-[#221019] rounded-3xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] p-4 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between border-b border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#97144D]/10 text-[#97144D] dark:text-[#FFDF85] flex items-center justify-center font-black text-sm">
                      {h.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-[#1F1420] dark:text-white">
                        {h.name}
                      </h3>
                      <span className="text-[11px] text-[#6B5B68] dark:text-[#A898A4]">
                        {h.isPrimary ? 'Primary Hirer' : 'Joint Co-Hirer'}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-[#1E8E5A] border border-emerald-500/20 text-[10px] font-bold">
                    KYC Verified
                  </span>
                </div>

                {/* Identity details with long IDs on their own line */}
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-[#FAF6F8] dark:bg-[#2E1624] rounded-xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
                    <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] block">Customer Identification File (CIF)</span>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="font-mono font-bold text-xs text-[#1F1420] dark:text-white">{h.cifNumber}</span>
                      <button type="button" onClick={() => handleCopy(h.cifNumber)} className="text-[#6B5B68]">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-[#FAF6F8] dark:bg-[#2E1624] rounded-xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
                      <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] block">Masked Aadhaar</span>
                      <span className="font-mono font-bold text-xs text-[#1F1420] dark:text-white">XXXX-XXXX-4819</span>
                    </div>
                    <div className="p-2 bg-[#FAF6F8] dark:bg-[#2E1624] rounded-xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
                      <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] block">PAN Reference</span>
                      <span className="font-mono font-bold text-xs text-[#1F1420] dark:text-white">{h.panNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-[#6B5B68] dark:text-[#A898A4] flex items-center justify-between pt-1">
                  <span>Linked Phone: {h.phone}</span>
                  <span className="font-mono">Joined: {h.joinedDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: OPERATORS / POA (Single Column Cards) */}
      {activeTab === 'operators' && (
        <div className="space-y-3">
          <div className="px-1 flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#1F1420] dark:text-[#F5ECF1]">
              Power of Attorney & Authorized Mandate Delegates
            </span>
          </div>

          {currentOperators.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#221019] rounded-3xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] space-y-2">
              <Users className="w-8 h-8 text-[#97144D]/40 mx-auto" />
              <p className="text-xs text-[#6B5B68] dark:text-[#A898A4]">No authorized operators registered.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentOperators.map(op => (
                <div
                  key={op.id}
                  className="bg-white dark:bg-[#221019] rounded-3xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] p-4 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between border-b border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm">
                        {op.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-[#1F1420] dark:text-white">
                          {op.name}
                        </h3>
                        <span className="text-[11px] text-[#6B5B68] dark:text-[#A898A4]">
                          {op.mandateType}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={op.status} size="sm" />
                  </div>

                  <div className="space-y-2 text-xs">
                    {op.poaRegistrationRef && (
                      <div className="p-2 bg-[#FAF6F8] dark:bg-[#2E1624] rounded-xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
                        <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] block">PoA Registration Ref:</span>
                        <span className="font-mono font-bold text-xs text-[#97144D] dark:text-[#FFDF85] block mt-0.5">
                          {op.poaRegistrationRef}
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-[#FAF6F8] dark:bg-[#2E1624] rounded-xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
                        <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] block">ID Proof ({op.idProofType})</span>
                        <span className="font-mono font-bold text-xs text-[#1F1420] dark:text-white">{op.idProofNumber}</span>
                      </div>
                      <div className="p-2 bg-[#FAF6F8] dark:bg-[#2E1624] rounded-xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
                        <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] block">Valid Till</span>
                        <span className="font-mono font-bold text-xs text-[#1F1420] dark:text-white">{op.validTill}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setTargetOperatorIdToRevoke(op.id);
                        setPendingOtpAction('revoke-operator');
                        setIsOtpOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-50 cursor-pointer"
                    >
                      Revoke Mandate (OTP)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: NOMINEES (Statutory Form SL-1, Up to 4 nominees with share % totaling 100) */}
      {activeTab === 'nominees' && (
        <div className="space-y-3">
          <div className="px-1 flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#1F1420] dark:text-[#F5ECF1]">
              Locker Nominees ({currentNominees.length}/4 registered)
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-[#1E8E5A] border border-emerald-500/20 text-[10px] font-bold">
              Total Share: {currentTotalShare}%
            </span>
          </div>

          {currentNominees.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#221019] rounded-3xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] space-y-3">
              <ShieldAlert className="w-8 h-8 text-amber-500 mx-auto" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-[#1F1420] dark:text-white">
                  No Nominee Registered for Locker #{currentLocker?.lockerNumber}
                </p>
                <p className="text-[11px] text-[#6B5B68] dark:text-[#A898A4]">
                  As per RBI guidelines, register a nominee under Form SL-1 to avoid legal heir succession hurdles.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('add-nominee')}
                className="px-4 py-2 bg-[#97144D] text-white font-bold rounded-xl text-xs active-press cursor-pointer"
              >
                + Register Nominee (Form SL-1)
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentNominees.map(nom => (
                <div
                  key={nom.id}
                  className="bg-white dark:bg-[#221019] rounded-3xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] p-4 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between border-b border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-[#97144D]/10 text-[#97144D] dark:text-[#FFDF85] flex items-center justify-center font-black text-sm">
                        {nom.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-[#1F1420] dark:text-white">
                          {nom.name}
                        </h3>
                        <span className="text-[11px] text-[#6B5B68] dark:text-[#A898A4]">
                          {nom.relationship} · {nom.sharePercentage || 100}% Share
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-[#1E8E5A] border border-emerald-500/20 text-[10px] font-bold">
                      Registered on CBS
                    </span>
                  </div>

                  {/* Form SL reference on its own line */}
                  <div className="p-2 bg-[#FAF6F8] dark:bg-[#2E1624] rounded-xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
                    <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] block">Compliance Form Code:</span>
                    <span className="font-mono font-bold text-xs text-[#97144D] dark:text-[#FFDF85] block mt-0.5">
                      {nom.formDa1Reference || 'SL-1/2026/0891'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-[#FAF6F8] dark:bg-[#2E1624] rounded-xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
                      <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] block">Registration Date</span>
                      <span className="font-mono font-bold text-xs text-[#1F1420] dark:text-white">{nom.registeredOn || '2026-01-15'}</span>
                    </div>
                    <div className="p-2 bg-[#FAF6F8] dark:bg-[#2E1624] rounded-xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
                      <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] block">Minor Status</span>
                      <span className="font-semibold text-xs text-[#1F1420] dark:text-white">{nom.isMinor ? 'Minor (Guardian Assigned)' : 'Major (18+)'}</span>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setTargetNomineeIdToCancel(nom.id);
                        setPendingOtpAction('cancel-nominee');
                        setIsOtpOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-50 cursor-pointer"
                    >
                      Cancel (Form SL-2)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ADD NOMINEE (FORM SL-1 / SL-1A) */}
      {activeTab === 'add-nominee' && (
        <form onSubmit={handleNomineeSubmit} className="bg-white dark:bg-[#221019] rounded-3xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] p-4 shadow-sm space-y-4 text-xs">
          <div className="border-b border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] pb-2.5">
            <h3 className="font-extrabold text-sm text-[#1F1420] dark:text-white">
              Nomination Registration (Form SL-1 / SL-1A)
            </h3>
            <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4]">
              Mandatory under Safe Deposit Locker regulatory framework. Up to 4 nominees allowed.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-[#6B5B68] dark:text-[#A898A4] mb-1">
                Statutory Form Code
              </label>
              <select
                value={nomFormCode}
                onChange={e => {
                  const val = e.target.value as any;
                  setNomFormCode(val);
                  setNomIsMinor(val === 'SL-1A');
                }}
                className="w-full h-10 bg-[#FAF6F8] dark:bg-[#2E1624] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] rounded-xl px-2.5 text-xs font-bold"
              >
                <option value="SL-1">SL-1 (Major Nominee)</option>
                <option value="SL-1A">SL-1A (Minor Nominee)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6B5B68] dark:text-[#A898A4] mb-1">
                Share Allocation (%)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={nomSharePercent}
                onChange={e => setNomSharePercent(Number(e.target.value))}
                className="w-full h-10 bg-[#FAF6F8] dark:bg-[#2E1624] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] rounded-xl px-3 font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#6B5B68] dark:text-[#A898A4] mb-1">
              Full Legal Name
            </label>
            <input
              type="text"
              required
              value={nomName}
              onChange={e => setNomName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className="w-full h-10 bg-[#FAF6F8] dark:bg-[#2E1624] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] rounded-xl px-3 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-[#6B5B68] dark:text-[#A898A4] mb-1">
                Relationship
              </label>
              <select
                value={nomRel}
                onChange={e => setNomRel(e.target.value)}
                className="w-full h-10 bg-[#FAF6F8] dark:bg-[#2E1624] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] rounded-xl px-2.5 text-xs"
              >
                <option>Spouse</option>
                <option>Son</option>
                <option>Daughter</option>
                <option>Father</option>
                <option>Mother</option>
                <option>Brother</option>
                <option>Sister</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6B5B68] dark:text-[#A898A4] mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={nomDob}
                onChange={e => setNomDob(e.target.value)}
                className="w-full h-10 bg-[#FAF6F8] dark:bg-[#2E1624] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] rounded-xl px-2.5 text-xs font-mono"
              />
            </div>
          </div>

          {nomIsMinor && (
            <div>
              <label className="block text-[11px] font-bold text-[#6B5B68] dark:text-[#A898A4] mb-1">
                Appointed Guardian Name (Statutory)
              </label>
              <input
                type="text"
                required
                value={nomGuardianName}
                onChange={e => setNomGuardianName(e.target.value)}
                placeholder="Guardian legal name"
                className="w-full h-10 bg-[#FAF6F8] dark:bg-[#2E1624] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] rounded-xl px-3 text-xs"
              />
            </div>
          )}

          <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-[11px]">
            <input
              type="checkbox"
              id="enomConsent"
              checked={eNominationConsent}
              onChange={e => setENominationConsent(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="enomConsent" className="text-[#1F1420] dark:text-white font-medium cursor-pointer">
              I consent to e-Nomination with Aadhaar OTP e-signature under RBI Safe Deposit Locker guidelines.
            </label>
          </div>

          <button
            type="submit"
            className="w-full h-11 bg-[#97144D] hover:bg-[#6B0E37] text-white font-bold rounded-xl text-xs shadow-md transition-colors active-press cursor-pointer"
          >
            Authorize Nomination via OTP Step-Up
          </button>
        </form>
      )}

      {/* TAB 5: CONTACT UPDATE */}
      {activeTab === 'contact' && (
        <form onSubmit={handleContactSubmit} className="bg-white dark:bg-[#221019] rounded-3xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] p-4 shadow-sm space-y-4 text-xs">
          <div className="border-b border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] pb-2.5">
            <h3 className="font-extrabold text-sm text-[#1F1420] dark:text-white">
              Communication & Advisory Contacts
            </h3>
            <span className="text-[11px] text-[#6B5B68] dark:text-[#A898A4]">
              Real-time SMS and email alerts dispatched on every strongroom turnstile entry.
            </span>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#6B5B68] dark:text-[#A898A4] mb-1">
              Registered Mobile Number
            </label>
            <input
              type="text"
              value={contactMobile}
              onChange={e => setContactMobile(e.target.value)}
              className="w-full h-10 bg-[#FAF6F8] dark:bg-[#2E1624] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] rounded-xl px-3 font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#6B5B68] dark:text-[#A898A4] mb-1">
              Registered Email ID
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={e => setContactEmail(e.target.value)}
              className="w-full h-10 bg-[#FAF6F8] dark:bg-[#2E1624] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] rounded-xl px-3 font-bold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#6B5B68] dark:text-[#A898A4] mb-1">
              Residential Address
            </label>
            <textarea
              rows={2}
              value={contactAddress}
              onChange={e => setContactAddress(e.target.value)}
              className="w-full p-2.5 bg-[#FAF6F8] dark:bg-[#2E1624] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] rounded-xl text-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full h-11 bg-[#97144D] hover:bg-[#6B0E37] text-white font-bold rounded-xl text-xs shadow-md active-press cursor-pointer"
          >
            Update Contact Details (OTP Step-Up)
          </button>
        </form>
      )}

      {/* OTP STEP-UP MODAL */}
      <OtpModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onSuccess={handleOtpSuccess}
        title={
          pendingOtpAction === 'add-nominee'
            ? 'Authorize Nomination Registration'
            : pendingOtpAction === 'cancel-nominee'
            ? 'Authorize Nomination Cancellation'
            : pendingOtpAction === 'add-operator'
            ? 'Authorize Operator Mandate'
            : pendingOtpAction === 'revoke-operator'
            ? 'Revoke Operator Authority'
            : 'Update CBS Contact Details'
        }
        actionDescription="Statutory 2-Factor Authentication step-up per SafeVault banking security policy."
      />

    </div>
  );
};
