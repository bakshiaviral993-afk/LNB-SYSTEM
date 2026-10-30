import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { DocumentModal } from '../common/DocumentModal';
import { OtpModal } from '../common/OtpModal';
import { PageHeader } from '../common/PageHeader';
import { StoredDocument } from '../../types';
import { COMPLIANCE_CONFIG } from '../../config/compliance.config';
import {
  FileText,
  ShieldCheck,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  PenTool,
  Building,
  UserCheck,
  Send,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  ShieldAlert,
  UploadCloud,
  FileCheck2,
  Lock,
  ExternalLink
} from 'lucide-react';

export const Agreements: React.FC = () => {
  const { lockers, renewAgreement, documents, kycRecords, submitKycRefresh, setCustomerView } = useBanking();
  const customerLockers = lockers.filter(l => l.customerId === 'cust-rahul-01' || l.customerName === 'Rahul Sharma');

  const [activeTab, setActiveTab] = useState<'agreement' | 'kyc'>('agreement');
  const [selectedLockerId, setSelectedLockerId] = useState<string>(customerLockers[0]?.id || 'lck-125');
  const [viewDoc, setViewDoc] = useState<StoredDocument | null>(null);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpActionType, setOtpActionType] = useState<'agreement' | 'kyc'>('agreement');
  const [renewedSuccess, setRenewedSuccess] = useState<string | null>(null);
  const [kycSuccess, setKycSuccess] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [expandedClause, setExpandedClause] = useState<string | null>('clause-liability');

  // KYC Form State
  const [aadhaarInput, setAadhaarInput] = useState('XXXX-XXXX-4912');
  const [panInput, setPanInput] = useState('ABCDE1234F');
  const [addressDeclared, setAddressDeclared] = useState(true);
  const [pepDeclared, setPepDeclared] = useState(true);
  const [aadhaarUploaded, setAadhaarUploaded] = useState(true);
  const [panUploaded, setPanUploaded] = useState(true);

  const selectedLocker = lockers.find(l => l.id === selectedLockerId) || customerLockers[0] || lockers[0];
  const lockerKyc = kycRecords.find(k => k.lockerId === selectedLocker.id) || kycRecords[0];

  const contractRef = selectedLocker.id === 'lck-125' 
    ? 'SV/LKR-AGR/DEL/2024/0918' 
    : `SV/LKR-AGR/${selectedLocker.lockerNumber}/2024/4412`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleExecuteAgreement = () => {
    setOtpActionType('agreement');
    setIsOtpOpen(true);
  };

  const handleInitiateKyc = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpActionType('kyc');
    setIsOtpOpen(true);
  };

  const handleOtpSuccess = () => {
    if (otpActionType === 'agreement') {
      renewAgreement(selectedLocker.id);
      const newRef = `SV/LKR-AGR/RENEW/${Math.floor(1000 + Math.random() * 9000)}`;
      setRenewedSuccess(newRef);
      setTimeout(() => setRenewedSuccess(null), 6000);
    } else {
      submitKycRefresh(selectedLocker.id, aadhaarInput, panInput);
      setKycSuccess(true);
      setTimeout(() => setKycSuccess(false), 6000);
    }
  };

  const openDocumentPreview = (title: string, ref: string) => {
    const doc = documents.find(d => d.documentRef === ref) || {
      id: `doc-${ref}`,
      title,
      category: 'Locker Agreement' as const,
      issueDate: '15 Jan 2024',
      fileSize: '1.8 MB',
      documentRef: ref,
      signedStatus: 'Digitally e-Signed' as const,
    };
    setViewDoc(doc);
  };

  // Statutory liability calculation
  const annualRent = selectedLocker?.annualRent || 4500;
  const maxLiability = annualRent * COMPLIANCE_CONFIG.liabilityRule.multiplier;

  return (
    <div className="space-y-5 pb-8 text-xs">
      
      {/* Universal PageHeader with 4-row layout */}
      <PageHeader
        title="Agreements & Statutory KYC"
        subtitle="Stamped Model Locker Agreements under RBI directions & periodic AML/KYC scrutiny"
        onBack={() => setCustomerView('dashboard')}
        backAriaLabel="Back to Home Dashboard"
        badges={
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#97144D]/10 dark:bg-[#97144D]/25 text-[#97144D] dark:text-[#FFDF85] border border-[#97144D]/20 text-[10px] font-bold font-mono">
              RBI Statutory Compliant
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-[10px] font-bold">
              Prefix: SV/LKR-AGR/
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

      {/* Segmented Tab Toggle with edge scroll */}
      <div className="flex p-1 bg-[#FAF6F8] dark:bg-[#221019] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] rounded-2xl">
        <button
          onClick={() => setActiveTab('agreement')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'agreement'
              ? 'bg-[#97144D] text-white shadow-xs font-extrabold'
              : 'text-[#6B5B68] dark:text-[#A898A4] hover:text-[#1F1420] dark:hover:text-[#F5ECF1]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Model Agreement</span>
        </button>

        <button
          onClick={() => setActiveTab('kyc')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'kyc'
              ? 'bg-[#97144D] text-white shadow-xs font-extrabold'
              : 'text-[#6B5B68] dark:text-[#A898A4] hover:text-[#1F1420] dark:hover:text-[#F5ECF1]'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Periodic KYC</span>
          {lockerKyc?.status === 'Refresh Due' && (
            <span className="w-2 h-2 rounded-full bg-[#C9A24B] animate-pulse" />
          )}
        </button>
      </div>

      {/* Re-execute Success Banner */}
      {renewedSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-900 dark:text-emerald-100 flex items-start gap-3 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-emerald-800 dark:text-emerald-300 block text-xs">
              Model Locker Agreement Successfully Re-Executed!
            </span>
            <p className="text-emerald-700 dark:text-emerald-400 text-[11px] mt-0.5 leading-relaxed">
              Revised contract executed under ref <span className="font-mono font-bold text-emerald-900 dark:text-emerald-200">{renewedSuccess}</span> with Aadhaar e-Sign verification. Stored securely in your Document Vault.
            </p>
          </div>
        </div>
      )}

      {/* KYC Success Banner */}
      {kycSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-900 dark:text-emerald-100 flex items-start gap-3 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-emerald-800 dark:text-emerald-300 block text-xs">
              Periodic KYC Refresh Submitted Successfully!
            </span>
            <p className="text-emerald-700 dark:text-emerald-400 text-[11px] mt-0.5 leading-relaxed">
              Identity documents and declarations logged under Reference #{lockerKyc?.id || 'KYC-2026-DEL'}. Branch Custodian & Compliance will verify without interrupting vault access.
            </p>
          </div>
        </div>
      )}

      {/* TAB 1: MODEL AGREEMENT */}
      {activeTab === 'agreement' && (
        <div className="space-y-4">
          
          {/* Agreement Status Card */}
          <div className="bg-white dark:bg-[#1E0C16] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] pb-2.5">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#97144D] dark:text-[#FFDF85]" />
                <h3 className="font-extrabold text-[#1F1420] dark:text-[#F5ECF1] text-xs">
                  Agreement Status
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full tracking-wide">
                Compliant & Executed
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {/* Long Token on its own line with copy button */}
              <div>
                <span className="text-[10px] font-bold text-[#6B5B68] dark:text-[#A898A4] uppercase tracking-wider block mb-0.5">
                  Contract Reference Number
                </span>
                <div className="flex items-center justify-between bg-[#FAF6F8] dark:bg-[#2A1220] px-3 py-2 rounded-xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
                  <span className="font-mono text-xs font-bold text-[#97144D] dark:text-[#FFDF85] break-all">
                    {contractRef}
                  </span>
                  <button
                    onClick={() => copyToClipboard(contractRef)}
                    className="p-1 text-[#6B5B68] dark:text-[#A898A4] hover:text-[#97144D] dark:hover:text-[#FFDF85] transition-colors ml-2 shrink-0 cursor-pointer"
                    title="Copy Contract Reference"
                  >
                    {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-[#FAF6F8] dark:bg-[#2A1220] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)]">
                  <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] block">e-Stamp Duty Status</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Prepaid ₹500 (SHCIL e-Stamp)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF6F8] dark:bg-[#2A1220] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)]">
                  <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] block">Execution Date</span>
                  <span className="text-xs font-mono font-bold text-[#1F1420] dark:text-[#F5ECF1]">{selectedLocker.allotmentDate || '15 Jan 2024'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF6F8] dark:bg-[#2A1220] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)]">
                  <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] block">Branch Custodian</span>
                  <span className="text-xs font-semibold text-[#1F1420] dark:text-[#F5ECF1]">{selectedLocker.branchName}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF6F8] dark:bg-[#2A1220] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)]">
                  <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] block">Governing Law</span>
                  <span className="text-xs font-semibold text-[#1F1420] dark:text-[#F5ECF1]">Banking Regulation Act, 1949</span>
                </div>
              </div>
            </div>

            {/* Actions: View Stamped Agreement & Re-Execute */}
            <div className="pt-2 border-t border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] space-y-2">
              <button
                onClick={() =>
                  openDocumentPreview(
                    `Model Locker Agreement - Locker ${selectedLocker.lockerNumber}`,
                    contractRef
                  )
                }
                className="w-full h-11 px-4 text-xs font-bold text-[#1F1420] dark:text-[#F5ECF1] bg-[#FAF6F8] dark:bg-[#2A1220] hover:bg-[#E8DFE5] dark:hover:bg-[#341628] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer active-press"
              >
                <FileText className="w-4 h-4 text-[#97144D] dark:text-[#FFDF85]" />
                <span>View / Download Stamped Agreement</span>
              </button>

              <button
                onClick={handleExecuteAgreement}
                className="w-full h-11 px-4 text-xs font-bold text-white bg-gradient-to-r from-[#97144D] to-[#6B0E37] hover:from-[#851144] hover:to-[#5E0C30] rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer active-press"
              >
                <PenTool className="w-4 h-4 text-[#FFDF85]" />
                <span>Renew / Re-Execute Agreement (Aadhaar e-Sign)</span>
              </button>
            </div>
          </div>

          {/* Execution Stages: CLEAN VERTICAL STEPPER (No horizontal squashing) */}
          <div className="bg-white dark:bg-[#1E0C16] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#97144D] dark:text-[#FFDF85]" />
                <h3 className="font-extrabold text-[#1F1420] dark:text-[#F5ECF1] text-xs">
                  Execution Stages & Audit Stepper
                </h3>
              </div>
              <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] font-mono">4/4 Complete</span>
            </div>

            <div className="space-y-3 relative pl-6 border-l-2 border-[#97144D] dark:border-[#FFDF85] ml-2 pt-1">
              {/* Stage 1 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#97144D] dark:bg-[#FFDF85] text-white dark:text-[#1F1420] flex items-center justify-center text-[10px] font-bold">
                  ✓
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1F1420] dark:text-[#F5ECF1] text-xs">Stage 1: Legal Draft Review</span>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">Passed</span>
                  </div>
                  <p className="text-[11px] text-[#6B5B68] dark:text-[#A898A4] mt-0.5 leading-relaxed">
                    Standard IBA model agreement vetted by SafeVault Legal Directorate without unfair indemnities.
                  </p>
                </div>
              </div>

              {/* Stage 2 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#97144D] dark:bg-[#FFDF85] text-white dark:text-[#1F1420] flex items-center justify-center text-[10px] font-bold">
                  ✓
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1F1420] dark:text-[#F5ECF1] text-xs">Stage 2: Digital e-Stamping</span>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">Prepaid</span>
                  </div>
                  <p className="text-[11px] text-[#6B5B68] dark:text-[#A898A4] mt-0.5 leading-relaxed">
                    State Stamp Act Duty (₹500.00) issued via Stock Holding Corporation of India (SHCIL) e-certificate.
                  </p>
                </div>
              </div>

              {/* Stage 3 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#97144D] dark:bg-[#FFDF85] text-white dark:text-[#1F1420] flex items-center justify-center text-[10px] font-bold">
                  ✓
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1F1420] dark:text-[#F5ECF1] text-xs">Stage 3: Hirer e-Consent</span>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">e-Signed</span>
                  </div>
                  <p className="text-[11px] text-[#6B5B68] dark:text-[#A898A4] mt-0.5 leading-relaxed">
                    Aadhaar OTP authenticated dual-party digital e-Sign completed by Rahul Sharma.
                  </p>
                </div>
              </div>

              {/* Stage 4 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#97144D] dark:bg-[#FFDF85] text-white dark:text-[#1F1420] flex items-center justify-center text-[10px] font-bold">
                  ✓
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1F1420] dark:text-[#F5ECF1] text-xs">Stage 4: Vault Enrolment</span>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">Active</span>
                  </div>
                  <p className="text-[11px] text-[#6B5B68] dark:text-[#A898A4] mt-0.5 leading-relaxed">
                    CBS contract ledger updated. Physical dual-key mechanism paired with biometric entry gate.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Regulatory Clauses Accordion */}
          <div className="bg-white dark:bg-[#1E0C16] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex flex-col gap-1 border-b border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#97144D] dark:text-[#FFDF85]" />
                <h3 className="font-extrabold text-[#1F1420] dark:text-[#F5ECF1] text-xs">
                  Key Clauses & Statutory Safeguards
                </h3>
              </div>
              <p className="text-[10px] text-[#6B5B68] dark:text-[#A898A4]">
                {COMPLIANCE_CONFIG.regulatoryFramework}
              </p>
            </div>

            {/* Accordion List */}
            <div className="space-y-2">
              {COMPLIANCE_CONFIG.keyClauses.map(clause => {
                const isExpanded = expandedClause === clause.id;
                return (
                  <div
                    key={clause.id}
                    className="border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.1)] rounded-xl overflow-hidden bg-[#FAF6F8] dark:bg-[#25101E]"
                  >
                    <button
                      onClick={() => setExpandedClause(isExpanded ? null : clause.id)}
                      className="w-full px-3 py-2.5 text-left flex items-center justify-between gap-2 cursor-pointer hover:bg-[#E8DFE5]/30 dark:hover:bg-[#341628]/30 transition-colors"
                    >
                      <div className="flex-1">
                        <span className="font-bold text-[#1F1420] dark:text-[#F5ECF1] text-xs block">
                          {clause.title}
                        </span>
                        <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4]">
                          {clause.shortText}
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-[#97144D] dark:text-[#FFDF85] shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    {isExpanded && (
                      <div className="px-3 pb-3 pt-1 border-t border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#1E0C16] text-[#1F1420] dark:text-[#F5ECF1] space-y-2">
                        {clause.id === 'clause-liability' ? (
                          <>
                            <div className="p-2.5 rounded-lg bg-[#97144D]/10 dark:bg-[#97144D]/25 border border-[#97144D]/20 text-[#97144D] dark:text-[#FFDF85] font-mono text-xs font-bold">
                              Formula: 100 × ₹{annualRent.toLocaleString('en-IN')} = ₹{maxLiability.toLocaleString('en-IN')} Statutory Liability Cap
                            </div>
                            <p className="text-[11px] leading-relaxed text-[#6B5B68] dark:text-[#C5B7C2]">
                              As per RBI revised instructions effective 1 Jan 2022, SafeVault’s maximum liability for events such as fire, theft, burglary, dacoity, robbery, building collapse or employee fraud is statutory capped at 100 times the annual locker rent (<strong className="text-[#1F1420] dark:text-[#F5ECF1]">₹{maxLiability.toLocaleString('en-IN')}</strong>). SafeVault does not inspect or inventory contents.
                            </p>
                          </>
                        ) : (
                          <p className="text-[11px] leading-relaxed text-[#6B5B68] dark:text-[#C5B7C2]">
                            {clause.fullText}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PERIODIC KYC */}
      {activeTab === 'kyc' && (
        <div className="space-y-4">
          
          {/* KYC Status Summary Card */}
          <div className="bg-white dark:bg-[#1E0C16] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] pb-2.5">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#97144D] dark:text-[#FFDF85]" />
                <h3 className="font-extrabold text-[#1F1420] dark:text-[#F5ECF1] text-xs">
                  KYC Scrutiny Status
                </h3>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  lockerKyc?.status === 'Verified'
                    ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/20'
                    : 'text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/20'
                }`}
              >
                {lockerKyc?.status || 'Verified'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#FAF6F8] dark:bg-[#2A1220] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)]">
                <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] block">Risk Profile</span>
                <span className="text-xs font-bold text-[#1F1420] dark:text-[#F5ECF1]">{lockerKyc?.riskCategory || 'Low Risk (Periodic 10yr)'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF6F8] dark:bg-[#2A1220] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)]">
                <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] block">Customer CIF</span>
                <span className="text-xs font-mono font-bold text-[#1F1420] dark:text-[#F5ECF1]">CIF-9028192831</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF6F8] dark:bg-[#2A1220] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)]">
                <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] block">Last Scrutiny Date</span>
                <span className="text-xs font-mono font-bold text-[#1F1420] dark:text-[#F5ECF1]">{lockerKyc?.lastKycDate || '12 Oct 2021'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF6F8] dark:bg-[#2A1220] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)]">
                <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] block">Next Due Date</span>
                <span className="text-xs font-mono font-bold text-[#97144D] dark:text-[#FFDF85]">{lockerKyc?.dueDate || '12 Oct 2026'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF6F8] dark:bg-[#2A1220] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)] sm:col-span-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] block">AML Screening Status</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Cleared / Zero Adverse Match</span>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
            </div>

            <div className="p-3 bg-[#FAF6F8] dark:bg-[#2A1220] rounded-xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)] text-[11px] text-[#6B5B68] dark:text-[#A898A4] leading-relaxed">
              <strong className="text-[#1F1420] dark:text-[#F5ECF1]">Statutory Notice: </strong>
              RBI Master Directions mandate periodic KYC refresh every 10 years for low-risk, 8 years for medium-risk, and 2 years for high-risk hirers holding Safe Custody facilities.
            </div>
          </div>

          {/* Interactive KYC Refresh & Declarations Form */}
          <div className="bg-white dark:bg-[#1E0C16] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] rounded-2xl p-4 shadow-sm space-y-4">
            <div className="border-b border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] pb-2.5">
              <h3 className="font-extrabold text-[#1F1420] dark:text-[#F5ECF1] text-xs">
                Submit Periodic KYC Refresh Documents
              </h3>
              <p className="text-[11px] text-[#6B5B68] dark:text-[#A898A4] mt-0.5">
                Confirm digital identity credentials to maintain uninterrupted vault entry
              </p>
            </div>

            <form onSubmit={handleInitiateKyc} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-[#1F1420] dark:text-[#F5ECF1] mb-1">
                  Aadhaar Number (Virtual ID or 12-digit number)
                </label>
                <input
                  type="text"
                  required
                  value={aadhaarInput}
                  onChange={e => setAadhaarInput(e.target.value)}
                  className="w-full h-10 bg-[#FAF6F8] dark:bg-[#2A1220] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] rounded-xl px-3 text-[#1F1420] dark:text-[#F5ECF1] font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#97144D]"
                />
                <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] mt-1 block">
                  Encrypted offline XML e-KYC will be validated via UIDAI OTP
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1F1420] dark:text-[#F5ECF1] mb-1">
                  Permanent Account Number (PAN)
                </label>
                <input
                  type="text"
                  required
                  value={panInput}
                  onChange={e => setPanInput(e.target.value.toUpperCase())}
                  className="w-full h-10 bg-[#FAF6F8] dark:bg-[#2A1220] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] rounded-xl px-3 text-[#1F1420] dark:text-[#F5ECF1] font-mono text-xs uppercase focus:outline-none focus:ring-2 focus:ring-[#97144D]"
                />
                <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] mt-1 block">
                  Cross-checked with NSDL / Income Tax Department records
                </span>
              </div>

              {/* Upload Checklist */}
              <div>
                <span className="block text-[11px] font-bold text-[#1F1420] dark:text-[#F5ECF1] mb-1.5">
                  Identity Document Checklist:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    onClick={() => setAadhaarUploaded(!aadhaarUploaded)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                      aadhaarUploaded
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                        : 'bg-[#FAF6F8] dark:bg-[#2A1220] border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] text-[#6B5B68]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-semibold">Aadhaar Card</span>
                    </div>
                    {aadhaarUploaded && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>

                  <div
                    onClick={() => setPanUploaded(!panUploaded)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                      panUploaded
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                        : 'bg-[#FAF6F8] dark:bg-[#2A1220] border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] text-[#6B5B68]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-semibold">PAN Card</span>
                    </div>
                    {panUploaded && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                </div>
              </div>

              {/* Declarations */}
              <div className="space-y-2 p-3 bg-[#FAF6F8] dark:bg-[#2A1220] rounded-xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)]">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addressDeclared}
                    onChange={e => setAddressDeclared(e.target.checked)}
                    className="mt-0.5 rounded border-[#E8DFE5] text-[#97144D] focus:ring-[#97144D]"
                  />
                  <span className="text-[#1F1420] dark:text-[#F5ECF1] text-[11px] leading-relaxed">
                    I solemnly declare that my residential address on CBS record (Flat 402, Royal Palms, Barakhamba Road, New Delhi 110001) is current and unchanged.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer pt-1 border-t border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)]">
                  <input
                    type="checkbox"
                    checked={pepDeclared}
                    onChange={e => setPepDeclared(e.target.checked)}
                    className="mt-0.5 rounded border-[#E8DFE5] text-[#97144D] focus:ring-[#97144D]"
                  />
                  <span className="text-[#1F1420] dark:text-[#F5ECF1] text-[11px] leading-relaxed">
                    I declare that I am neither a Politically Exposed Person (PEP) nor a close relative of a PEP as defined under RBI AML guidelines.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={!addressDeclared || !pepDeclared || lockerKyc?.status === 'Under Scrutiny'}
                className="w-full h-11 px-4 font-bold text-xs text-white bg-gradient-to-r from-[#97144D] to-[#6B0E37] hover:from-[#851144] hover:to-[#5E0C30] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer active-press"
              >
                <UserCheck className="w-4 h-4 text-[#FFDF85]" />
                <span>
                  {lockerKyc?.status === 'Under Scrutiny'
                    ? 'KYC Verification Under Branch Scrutiny'
                    : 'Submit Periodic KYC Refresh for Scrutiny'}
                </span>
              </button>
            </form>
          </div>

        </div>
      )}

      {/* OTP Step-Up Modal */}
      <OtpModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onSuccess={handleOtpSuccess}
        title={otpActionType === 'agreement' ? "Aadhaar Digital e-Sign Consent" : "UIDAI e-KYC Step-Up Authentication"}
        actionDescription={
          otpActionType === 'agreement'
            ? `Executing digital signature on Revised Model Agreement for Locker #${selectedLocker.lockerNumber}`
            : `Authorizing periodic e-KYC document scrutiny for Locker #${selectedLocker.lockerNumber}`
        }
      />

      {/* Document Preview Modal */}
      <DocumentModal
        document={viewDoc}
        onClose={() => setViewDoc(null)}
      />

    </div>
  );
};
