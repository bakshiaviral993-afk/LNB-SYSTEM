import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { StatusBadge } from '../common/StatusBadge';
import { DocumentModal } from '../common/DocumentModal';
import { OtpModal } from '../common/OtpModal';
import { Holder, Nominee, StoredDocument, AuthorizedOperator } from '../../types';
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
  ShieldAlert
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
    documents
  } = useBanking();

  const customerLockers = lockers.filter(l => l.customerId === 'cust-rahul-01');
  const [activeLockerId, setActiveLockerId] = useState<string>(selectedLockerId || 'lck-125');
  const [activeTab, setActiveTab] = useState<'holders' | 'operators' | 'nominees' | 'add-nominee' | 'contact-update'>('holders');

  // Add Nominee Form State (Form DA-1)
  const [nomName, setNomName] = useState('');
  const [nomRel, setNomRel] = useState('Spouse');
  const [nomDob, setNomDob] = useState('1990-05-12');
  const [nomIsMinor, setNomIsMinor] = useState(false);
  const [nomGuardianName, setNomGuardianName] = useState('');
  const [nomPhone, setNomPhone] = useState('+91 ');
  const [nomAddress, setNomAddress] = useState('Flat 402, Oakwood Enclave, Barakhamba Road, New Delhi 110001');

  // Add Authorized Operator State
  const [opName, setOpName] = useState('');
  const [opRel, setOpRel] = useState('Father / Legal Representative');
  const [opMandate, setOpMandate] = useState<AuthorizedOperator['mandateType']>('Power of Attorney (PoA)');
  const [opPoaRef, setOpPoaRef] = useState('');
  const [opIdType, setOpIdType] = useState<AuthorizedOperator['idProofType']>('Aadhaar');
  const [opIdNum, setOpIdNum] = useState('');
  const [opPhone, setOpPhone] = useState('+91 ');
  const [opValidTill, setOpValidTill] = useState('2028-12-31');

  // Contact Details Update Form State
  const [contactMobile, setContactMobile] = useState('+91 98101 23456');
  const [contactEmail, setContactEmail] = useState('rahul.sharma@enterprise-corp.in');
  const [contactAddress, setContactAddress] = useState('Flat 402, Oakwood Enclave, Barakhamba Road, New Delhi 110001');
  const [contactReason, setContactReason] = useState('Relocation / Periodic communication update');

  // OTP Modal State
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [pendingOtpAction, setPendingOtpAction] = useState<'add-nominee' | 'cancel-nominee' | 'add-operator' | 'update-contact'>('add-nominee');
  const [targetNomineeIdToCancel, setTargetNomineeIdToCancel] = useState<string | null>(null);
  const [contactSuccessMsg, setContactSuccessMsg] = useState<string | null>(null);

  const [viewDoc, setViewDoc] = useState<StoredDocument | null>(null);

  const currentLocker = lockers.find(l => l.id === activeLockerId) || customerLockers[0];
  const currentHolders = holders[activeLockerId] || [];
  const currentNominees = nominees[activeLockerId] || [];
  const currentOperators = authorizedOperators[activeLockerId] || [];

  const handleNomineeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

  const handleCancelNomineeClick = (nomId: string) => {
    setTargetNomineeIdToCancel(nomId);
    setPendingOtpAction('cancel-nominee');
    setIsOtpOpen(true);
  };

  const handleOtpSuccess = () => {
    if (pendingOtpAction === 'add-nominee') {
      addNominee(activeLockerId, {
        name: nomName,
        relationship: nomRel,
        dateOfBirth: nomDob,
        isMinor: nomIsMinor,
        guardianName: nomIsMinor ? nomGuardianName : undefined,
        phone: nomPhone,
        address: nomAddress,
      });
      setNomName('');
      setActiveTab('nominees');
    } else if (pendingOtpAction === 'cancel-nominee' && targetNomineeIdToCancel) {
      cancelNominee(targetNomineeIdToCancel, activeLockerId);
      setTargetNomineeIdToCancel(null);
    } else if (pendingOtpAction === 'add-operator') {
      addAuthorizedOperator(activeLockerId, {
        name: opName,
        relationship: opRel,
        mandateType: opMandate,
        poaRegistrationRef: opPoaRef || undefined,
        idProofType: opIdType,
        idProofNumber: opIdNum,
        phone: opPhone,
        validFrom: new Date().toISOString().split('T')[0],
        validTill: opValidTill,
      });
      setOpName('');
      setOpPoaRef('');
      setOpIdNum('');
      setActiveTab('operators');
    } else if (pendingOtpAction === 'update-contact') {
      submitContactUpdate(contactMobile, contactEmail, contactAddress, contactReason);
      setContactSuccessMsg('Contact update request submitted with 2FA verification. Awaiting branch operations approval.');
    }
  };

  const openFormDa1Doc = (refNum: string) => {
    const doc = documents.find(d => d.documentRef === refNum) || {
      id: `doc-${refNum}`,
      title: `Form DA-1 Nomination Registration Acknowledgement`,
      category: 'Nomination Form DA-1' as const,
      issueDate: 'Today',
      fileSize: '510 KB',
      documentRef: refNum,
      signedStatus: 'Digitally e-Signed' as const,
    };
    setViewDoc(doc);
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* Title & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3E8F0]">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-[#102544]">
            Holders, Nominees & Authorized Mandates
          </h1>
          <p className="text-[#66758C] mt-0.5">
            Single/joint operating instructions, authorized Power of Attorney operators, Form DA-1 nominations, and contact update requests
          </p>
        </div>

        {/* Locker Account Selector */}
        <div className="flex items-center gap-2">
          <label className="text-[#66758C] font-semibold">Active Locker:</label>
          <select
            value={activeLockerId}
            onChange={e => {
              setActiveLockerId(e.target.value);
              setSelectedLockerId(e.target.value);
            }}
            className="bg-white border border-[#E3E8F0] rounded-xl px-3 py-1.5 font-bold font-mono text-[#102544] shadow-xs focus:outline-none focus:border-[#2457A7]"
          >
            {customerLockers.map(l => (
              <option key={l.id} value={l.id}>
                Locker {l.lockerNumber} ({l.branchName.split('-')[0].trim()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {contactSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-[#16845B] rounded-xl flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16845B] shrink-0" />
            <span className="font-semibold">{contactSuccessMsg}</span>
          </div>
          <button onClick={() => setContactSuccessMsg(null)} className="text-xs underline hover:no-underline">Dismiss</button>
        </div>
      )}

      {/* Operating Mandate Banner */}
      <div className="p-5 bg-[#102544] text-white rounded-2xl shadow-bank-card border border-[#0B1730] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#008C88] font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-white">
              Operating Mandate: {currentLocker?.operatingMode}
            </div>
            <div className="text-white/70 text-[11px] mt-0.5">
              Locker {currentLocker?.lockerNumber} · Branch: {currentLocker?.branchName}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-white/90 bg-white/10 border border-white/15 px-3 py-1 rounded-lg font-medium">
            {currentLocker?.operatingMode === 'Single'
              ? 'Individual Self Operation Only'
              : 'Either holder can operate independently'}
          </span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-1 bg-[#F5F7FA] p-1 rounded-xl border border-[#E3E8F0] overflow-x-auto font-semibold">
        <button
          onClick={() => setActiveTab('holders')}
          className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'holders' ? 'bg-[#102544] text-white shadow-xs' : 'text-[#66758C] hover:text-[#17263C]'
          }`}
        >
          Authorized Holders ({currentHolders.length})
        </button>
        <button
          onClick={() => setActiveTab('operators')}
          className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'operators' ? 'bg-[#102544] text-white shadow-xs' : 'text-[#66758C] hover:text-[#17263C]'
          }`}
        >
          Authorized Operators / PoA ({currentOperators.length})
        </button>
        <button
          onClick={() => setActiveTab('nominees')}
          className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'nominees' ? 'bg-[#102544] text-white shadow-xs' : 'text-[#66758C] hover:text-[#17263C]'
          }`}
        >
          Form DA-1 Nominees ({currentNominees.length})
        </button>
        <button
          onClick={() => setActiveTab('add-nominee')}
          className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 ${
            activeTab === 'add-nominee' ? 'bg-[#102544] text-white shadow-xs' : 'text-[#66758C] hover:text-[#17263C]'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register Nominee</span>
        </button>
        <button
          onClick={() => setActiveTab('contact-update')}
          className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 ${
            activeTab === 'contact-update' ? 'bg-[#102544] text-white shadow-xs' : 'text-[#66758C] hover:text-[#17263C]'
          }`}
        >
          <Edit className="w-3.5 h-3.5" />
          <span>Update Contact Details</span>
        </button>
      </div>

      {/* TAB 1: HOLDERS */}
      {activeTab === 'holders' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {currentHolders.map(h => (
              <div
                key={h.id}
                className="p-5 bg-white border border-[#E3E8F0] rounded-xl shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between border-b border-[#E3E8F0] pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#102544]">{h.name}</span>
                      {h.isPrimary ? (
                        <span className="text-[10px] font-bold text-[#2457A7] bg-[#2457A7]/10 border border-[#2457A7]/20 px-2 py-0.5 rounded">
                          Primary Hirer
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-[#66758C] bg-[#F5F7FA] border border-[#E3E8F0] px-2 py-0.5 rounded">
                          Joint Hirer
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#66758C]">{h.relationship}</span>
                  </div>
                  <StatusBadge status={h.kycStatus} size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-[#66758C] block">Bank CIF Number</span>
                    <span className="font-mono tabular-nums font-medium text-[#17263C]">{h.cifNumber}</span>
                  </div>
                  <div>
                    <span className="text-[#66758C] block">PAN Number</span>
                    <span className="font-mono tabular-nums font-medium text-[#17263C]">{h.panNumber}</span>
                  </div>
                  <div>
                    <span className="text-[#66758C] block">Contact Phone</span>
                    <span className="font-medium text-[#17263C] flex items-center gap-1 font-mono tabular-nums">
                      <Phone className="w-3 h-3 text-[#66758C]" />
                      {h.phone}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#66758C] block">Email Address</span>
                    <span className="font-medium text-[#17263C] truncate block">
                      {h.email}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-[#66758C] bg-[#F5F7FA] p-2.5 rounded-lg border border-[#E3E8F0]">
                  <span className="text-[#66758C] font-semibold block mb-0.5">Registered Residential Address:</span>
                  {h.address}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: AUTHORIZED OPERATORS */}
      {activeTab === 'operators' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#102544] text-sm">
                Permitted Authorized Operators & Power of Attorney (PoA)
              </h3>
              <p className="text-[#66758C] text-[11px]">
                Registered individuals empowered to access safe custody compartments under legally certified mandates
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {currentOperators.length === 0 ? (
              <div className="col-span-2 p-8 text-center bg-white border border-[#E3E8F0] rounded-xl space-y-2 text-[#66758C]">
                <Shield className="w-8 h-8 text-[#66758C]/40 mx-auto" />
                <p>No external authorized operator or Power of Attorney currently registered for Locker {currentLocker?.lockerNumber}.</p>
              </div>
            ) : (
              currentOperators.map(op => (
                <div
                  key={op.id}
                  className="p-5 bg-white border border-[#E3E8F0] rounded-xl shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between border-b border-[#E3E8F0] pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#102544]">{op.name}</span>
                        <span className="text-[10px] bg-[#F5F7FA] text-[#66758C] border border-[#E3E8F0] px-2 py-0.5 rounded font-medium">
                          {op.mandateType}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#66758C] mt-0.5 block">{op.relationship}</span>
                    </div>
                    <StatusBadge status={op.status} size="sm" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-[#66758C] block">ID Proof</span>
                      <span className="font-mono tabular-nums text-[#17263C]">{op.idProofType} ({op.idProofNumber})</span>
                    </div>
                    <div>
                      <span className="text-[#66758C] block">Contact Phone</span>
                      <span className="font-mono tabular-nums text-[#17263C]">{op.phone}</span>
                    </div>
                    <div>
                      <span className="text-[#66758C] block">Mandate Validity</span>
                      <span className="font-mono tabular-nums text-[#17263C]">{op.validFrom} to {op.validTill}</span>
                    </div>
                    {op.poaRegistrationRef && (
                      <div>
                        <span className="text-[#66758C] block">PoA Registered Ref</span>
                        <span className="font-mono tabular-nums text-[#17263C] truncate block">{op.poaRegistrationRef}</span>
                      </div>
                    )}
                  </div>

                  {op.status === 'Active' && (
                    <div className="pt-2 border-t border-[#E3E8F0] flex justify-end">
                      <button
                        onClick={() => {
                          if (confirm(`Revoke authorized operator mandate for ${op.name}?`)) {
                            revokeAuthorizedOperator(activeLockerId, op.id);
                          }
                        }}
                        className="text-[#C83E44] hover:text-[#C83E44]/80 font-semibold text-xs hover:underline"
                      >
                        Revoke Authorization
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Add Operator Form Box */}
          <div className="p-5 bg-[#F5F7FA] border border-[#E3E8F0] rounded-xl space-y-4">
            <h4 className="font-bold text-[#102544] text-xs">
              Register New Power of Attorney (PoA) or Authorized Representative
            </h4>
            <form onSubmit={handleOperatorSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#17263C] font-medium mb-1">Operator Legal Name</label>
                  <input
                    type="text"
                    value={opName}
                    onChange={e => setOpName(e.target.value)}
                    placeholder="Full Legal Name"
                    required
                    className="w-full h-9 bg-white border border-[#E3E8F0] rounded-lg px-3 text-[#17263C] focus:border-[#2457A7] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#17263C] font-medium mb-1">Mandate Type</label>
                  <select
                    value={opMandate}
                    onChange={e => setOpMandate(e.target.value as AuthorizedOperator['mandateType'])}
                    className="w-full h-9 bg-white border border-[#E3E8F0] rounded-lg px-3 text-[#17263C] focus:border-[#2457A7] focus:outline-none"
                  >
                    <option value="Power of Attorney (PoA)">Power of Attorney (PoA)</option>
                    <option value="Authorized Representative">Authorized Representative</option>
                    <option value="Legal Guardian">Legal Guardian</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#17263C] font-medium mb-1">PoA Registry Serial #</label>
                  <input
                    type="text"
                    value={opPoaRef}
                    onChange={e => setOpPoaRef(e.target.value)}
                    placeholder="e.g. POA/DEL/2026/0491"
                    className="w-full h-9 bg-white border border-[#E3E8F0] rounded-lg px-3 text-[#17263C] font-mono tabular-nums focus:border-[#2457A7] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#17263C] font-medium mb-1">ID Proof Number</label>
                  <input
                    type="text"
                    value={opIdNum}
                    onChange={e => setOpIdNum(e.target.value)}
                    placeholder="Aadhaar / Passport / PAN"
                    required
                    className="w-full h-9 bg-white border border-[#E3E8F0] rounded-lg px-3 text-[#17263C] font-mono tabular-nums focus:border-[#2457A7] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#17263C] font-medium mb-1">Operator Mobile</label>
                  <input
                    type="text"
                    value={opPhone}
                    onChange={e => setOpPhone(e.target.value)}
                    required
                    className="w-full h-9 bg-white border border-[#E3E8F0] rounded-lg px-3 text-[#17263C] font-mono tabular-nums focus:border-[#2457A7] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#17263C] font-medium mb-1">Mandate Valid Till</label>
                  <input
                    type="date"
                    value={opValidTill}
                    onChange={e => setOpValidTill(e.target.value)}
                    required
                    className="w-full h-9 bg-white border border-[#E3E8F0] rounded-lg px-3 text-[#17263C] font-mono tabular-nums focus:border-[#2457A7] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-1 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#102544] text-white font-semibold rounded-lg hover:bg-[#0B1730] shadow-xs text-xs transition-colors"
                >
                  Submit Operator Mandate with 2FA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: NOMINEES */}
      {activeTab === 'nominees' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {currentNominees.map(nom => (
              <div
                key={nom.id}
                className="p-5 bg-white border border-[#E3E8F0] rounded-xl shadow-xs space-y-4 text-xs"
              >
                <div className="flex items-start justify-between border-b border-[#E3E8F0] pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#102544]">{nom.name}</span>
                      <span className="text-[10px] bg-[#2457A7]/10 text-[#2457A7] border border-[#2457A7]/20 px-2 py-0.5 rounded font-mono">
                        {nom.relationship}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#66758C] font-mono tabular-nums mt-0.5 block">
                      Form DA-1 Ref: {nom.formDa1Reference}
                    </span>
                  </div>
                  <StatusBadge status={nom.status} size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-[#66758C] block">Date of Birth</span>
                    <span className="font-mono tabular-nums font-medium text-[#17263C]">{nom.dateOfBirth}</span>
                  </div>
                  <div>
                    <span className="text-[#66758C] block">Minor Status</span>
                    <span className="font-medium text-[#17263C]">
                      {nom.isMinor ? 'Minor (Guardian Assigned)' : 'Major (Adult)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#66758C] block">Contact</span>
                    <span className="font-medium font-mono tabular-nums text-[#17263C]">{nom.phone}</span>
                  </div>
                  <div>
                    <span className="text-[#66758C] block">Registration Date</span>
                    <span className="font-mono tabular-nums text-[#17263C]">{nom.registeredOn}</span>
                  </div>
                </div>

                <div className="text-[11px] text-[#66758C] bg-[#F5F7FA] p-2.5 rounded-lg border border-[#E3E8F0]">
                  <span className="text-[#66758C] font-semibold block mb-0.5">Nominee Address:</span>
                  {nom.address}
                </div>

                <div className="pt-2 border-t border-[#E3E8F0] flex items-center justify-between">
                  <button
                    onClick={() => openFormDa1Doc(nom.formDa1Reference)}
                    className="text-xs font-semibold text-[#2457A7] hover:text-[#102544] flex items-center gap-1 hover:underline"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Form DA-1</span>
                  </button>
                  {nom.status === 'Registered' && (
                    <button
                      onClick={() => handleCancelNomineeClick(nom.id)}
                      className="text-[#C83E44] hover:text-[#C83E44]/80 font-semibold text-[11px] hover:underline"
                    >
                      Cancel Nomination (Form DA-2)
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ADD NOMINEE FORM */}
      {activeTab === 'add-nominee' && (
        <div className="max-w-2xl mx-auto bg-white border border-[#E3E8F0] rounded-xl p-6 shadow-xs space-y-5 text-xs">
          <div>
            <h3 className="text-sm font-bold text-[#102544]">
              Form DA-1 (Nomination under Section 45ZA of the Banking Regulation Act, 1949)
            </h3>
            <p className="text-[#66758C] mt-0.5 text-[11px]">
              Nominate an individual to receive safe deposit locker contents in the event of hirer death
            </p>
          </div>

          <form onSubmit={handleNomineeSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-[#17263C] mb-1">Nominee Full Legal Name</label>
                <input
                  type="text"
                  placeholder="e.g. Shalini Sharma"
                  value={nomName}
                  onChange={e => setNomName(e.target.value)}
                  required
                  className="w-full h-9 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 font-medium text-[#17263C] focus:bg-white focus:border-[#2457A7] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-[#17263C] mb-1">Relationship with Hirer</label>
                <select
                  value={nomRel}
                  onChange={e => setNomRel(e.target.value)}
                  className="w-full h-9 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 font-medium text-[#17263C] focus:bg-white focus:border-[#2457A7] focus:outline-none"
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-[#17263C] mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={nomDob}
                  onChange={e => setNomDob(e.target.value)}
                  required
                  className="w-full h-9 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 font-mono tabular-nums text-[#17263C] focus:bg-white focus:border-[#2457A7] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-[#17263C] mb-1">Contact Phone Number</label>
                <input
                  type="text"
                  value={nomPhone}
                  onChange={e => setNomPhone(e.target.value)}
                  required
                  className="w-full h-9 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 text-[#17263C] font-mono tabular-nums focus:bg-white focus:border-[#2457A7] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer font-medium text-[#17263C]">
                <input
                  type="checkbox"
                  checked={nomIsMinor}
                  onChange={e => setNomIsMinor(e.target.checked)}
                  className="rounded text-[#102544] focus:ring-[#2457A7]"
                />
                <span>Nominee is a Minor (Under 18 Years)</span>
              </label>
            </div>

            {nomIsMinor && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
                <label className="block font-medium text-amber-900 text-xs">
                  Guardian Name & Details (Mandatory for minor nominees)
                </label>
                <input
                  type="text"
                  placeholder="Guardian Legal Full Name & Relationship"
                  value={nomGuardianName}
                  onChange={e => setNomGuardianName(e.target.value)}
                  required={nomIsMinor}
                  className="w-full h-9 bg-white border border-amber-300 rounded-lg px-3 text-[#17263C] text-xs focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block font-medium text-[#17263C] mb-1">Nominee Residential Address</label>
              <textarea
                rows={2}
                value={nomAddress}
                onChange={e => setNomAddress(e.target.value)}
                required
                className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2.5 text-[#17263C] focus:bg-white focus:border-[#2457A7] focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('nominees')}
                className="px-4 py-2 text-[#66758C] hover:bg-[#F5F7FA] rounded-lg text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#102544] text-white font-semibold rounded-lg hover:bg-[#0B1730] shadow-xs text-xs transition-colors"
              >
                Submit Form DA-1 Nomination
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: CONTACT DETAILS UPDATE */}
      {activeTab === 'contact-update' && (
        <div className="max-w-2xl mx-auto bg-white border border-[#E3E8F0] rounded-xl p-6 shadow-xs space-y-5 text-xs">
          <div>
            <h3 className="text-sm font-bold text-[#102544]">
              Update Registered Contact & Correspondence Particulars
            </h3>
            <p className="text-[#66758C] mt-0.5 text-[11px]">
              Requires mandatory 2FA OTP step-up verification and branch custodian sign-off on Core Banking System (CBS)
            </p>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-[#17263C] mb-1">New Mobile Number</label>
                <input
                  type="text"
                  value={contactMobile}
                  onChange={e => setContactMobile(e.target.value)}
                  required
                  className="w-full h-9 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 font-mono tabular-nums text-[#17263C] focus:bg-white focus:border-[#2457A7] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-[#17263C] mb-1">New Email Address</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  required
                  className="w-full h-9 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 text-[#17263C] focus:bg-white focus:border-[#2457A7] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-[#17263C] mb-1">New Correspondence Address</label>
              <textarea
                rows={3}
                value={contactAddress}
                onChange={e => setContactAddress(e.target.value)}
                required
                className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2.5 text-[#17263C] focus:bg-white focus:border-[#2457A7] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-[#17263C] mb-1">Reason for Change</label>
              <input
                type="text"
                value={contactReason}
                onChange={e => setContactReason(e.target.value)}
                className="w-full h-9 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 text-[#17263C] focus:bg-white focus:border-[#2457A7] focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-[#102544] text-white font-semibold rounded-lg hover:bg-[#0B1730] shadow-xs text-xs transition-colors"
              >
                Authorize Contact Update with 2FA
              </button>
            </div>
          </form>
        </div>
      )}

      {/* OTP Step-Up Modal */}
      <OtpModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onSuccess={handleOtpSuccess}
        title={
          pendingOtpAction === 'add-nominee'
            ? 'Authorize Form DA-1 Nomination'
            : pendingOtpAction === 'cancel-nominee'
            ? 'Confirm Form DA-2 Nomination Cancellation'
            : pendingOtpAction === 'add-operator'
            ? 'Authorize Power of Attorney Operator'
            : 'Authorize Contact Details Update'
        }
        actionDescription="2FA security authorization for locker mandate alteration"
      />

      {/* Document Modal */}
      <DocumentModal
        document={viewDoc}
        onClose={() => setViewDoc(null)}
      />

    </div>
  );
};
