import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { DocumentModal } from '../common/DocumentModal';
import { OtpModal } from '../common/OtpModal';
import { StoredDocument } from '../../types';
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
  ChevronRight
} from 'lucide-react';

export const Agreements: React.FC = () => {
  const { lockers, renewAgreement, documents, kycRecords, submitKycRefresh } = useBanking();
  const customerLockers = lockers.filter(l => l.customerId === 'cust-rahul-01');

  const [activeTab, setActiveTab] = useState<'agreement' | 'kyc'>('agreement');
  const [selectedLockerId, setSelectedLockerId] = useState<string>(customerLockers[0]?.id || 'lck-125');
  const [viewDoc, setViewDoc] = useState<StoredDocument | null>(null);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpActionType, setOtpActionType] = useState<'agreement' | 'kyc'>('agreement');
  const [renewedSuccess, setRenewedSuccess] = useState(false);
  const [kycSuccess, setKycSuccess] = useState(false);

  // KYC Form State
  const [aadhaarInput, setAadhaarInput] = useState('XXXX-XXXX-4912');
  const [panInput, setPanInput] = useState('ABCDE1234F');
  const [addressDeclared, setAddressDeclared] = useState(true);

  const selectedLocker = lockers.find(l => l.id === selectedLockerId) || customerLockers[0];
  const lockerKyc = kycRecords.find(k => k.lockerId === selectedLocker.id) || kycRecords[0];

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
      setRenewedSuccess(true);
      setTimeout(() => setRenewedSuccess(false), 5000);
    } else {
      submitKycRefresh(selectedLocker.id, aadhaarInput, panInput);
      setKycSuccess(true);
      setTimeout(() => setKycSuccess(false), 5000);
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

  return (
    <div className="space-y-6 text-xs">
      
      {/* Title */}
      <div className="pb-3 border-b border-[#E3E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#17263C]">
              Model Locker Agreement & Periodic KYC
            </h1>
            <span className="text-[10px] font-bold text-[#008C88] bg-[#008C88]/10 border border-[#008C88]/20 px-2 py-0.5 rounded tracking-wide uppercase">
              RBI Statutory Compliant
            </span>
          </div>
          <p className="text-[#66758C] text-xs mt-1">
            Execute stamped legal locker contracts and maintain statutory periodic KYC scrutiny compliant with RBI Safe Custody circulars
          </p>
        </div>

        {/* Tab toggle */}
        <div className="flex items-center gap-1 bg-[#F5F7FA] border border-[#E3E8F0] p-1 rounded-lg self-start">
          <button
            onClick={() => setActiveTab('agreement')}
            className={`px-3.5 py-1.5 rounded-md font-semibold text-xs transition-colors ${
              activeTab === 'agreement'
                ? 'bg-white text-[#102544] shadow-xs border border-[#E3E8F0]'
                : 'text-[#66758C] hover:text-[#17263C]'
            }`}
          >
            Model Agreement & Renewal
          </button>
          <button
            onClick={() => setActiveTab('kyc')}
            className={`px-3.5 py-1.5 rounded-md font-semibold text-xs transition-colors flex items-center gap-1.5 ${
              activeTab === 'kyc'
                ? 'bg-white text-[#102544] shadow-xs border border-[#E3E8F0]'
                : 'text-[#66758C] hover:text-[#17263C]'
            }`}
          >
            <span>Periodic KYC Scrutiny</span>
            {lockerKyc?.status === 'Refresh Due' && (
              <span className="w-2 h-2 rounded-full bg-[#B7791F]" />
            )}
          </button>
        </div>
      </div>

      {renewedSuccess && (
        <div className="p-4 bg-emerald-50/80 border border-emerald-200/80 rounded-xl text-emerald-950 flex items-center gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-[#16845B] shrink-0" />
          <div>
            <span className="font-bold text-[#16845B]">Model Locker Agreement Successfully Re-Executed</span>
            <p className="text-emerald-800 text-[11px] mt-0.5">
              The revised contract has been digitally executed with Aadhaar e-Sign verification. A copy has been indexed in your Document Vault.
            </p>
          </div>
        </div>
      )}

      {kycSuccess && (
        <div className="p-4 bg-emerald-50/80 border border-emerald-200/80 rounded-xl text-emerald-950 flex items-center gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-[#16845B] shrink-0" />
          <div>
            <span className="font-bold text-[#16845B]">Periodic KYC Refresh Documents Submitted Successfully</span>
            <p className="text-emerald-800 text-[11px] mt-0.5">
              Your identity credentials have been received under reference #{lockerKyc?.id}. The Branch Compliance & AML cell will complete periodic re-verification.
            </p>
          </div>
        </div>
      )}

      {/* Locker Selector */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-3.5 rounded-xl border border-[#E3E8F0] shadow-bank-card">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#66758C] uppercase tracking-wider">Select Portfolio:</span>
          <div className="flex items-center gap-2">
            {customerLockers.map(lkr => (
              <button
                key={lkr.id}
                onClick={() => setSelectedLockerId(lkr.id)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all ${
                  selectedLockerId === lkr.id
                    ? 'bg-[#102544] text-white shadow-xs'
                    : 'bg-[#F5F7FA] text-[#17263C] border border-[#E3E8F0] hover:bg-[#E3E8F0]/50'
                }`}
              >
                Safe {lkr.lockerNumber} • {lkr.branchName.split('-')[0].trim()}
              </button>
            ))}
          </div>
        </div>
        <div className="text-[11px] text-[#66758C] font-mono">
          CIF ID: <span className="text-[#17263C] font-bold">9028192831</span>
        </div>
      </div>

      {activeTab === 'agreement' ? (
        <div className="space-y-6">
          {/* Renewal Lifecycle Stepper */}
          <div className="bg-white border border-[#E3E8F0] rounded-xl p-5 shadow-bank-card">
            <h3 className="font-bold text-[#17263C] text-sm mb-4">Agreement Lifecycle & Execution Stages</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-start gap-3 p-3 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-[#16845B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#17263C] block">1. Legal Draft Review</span>
                  <span className="text-[11px] text-[#66758C]">Standard IBA Model Clauses verified by bank legal counsel.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-[#16845B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#17263C] block">2. Digital e-Stamping</span>
                  <span className="text-[11px] text-[#66758C]">State Stamp Act duty ₹500 prepaid via SHCIL e-Stamp certificate.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-[#16845B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#17263C] block">3. Hirer e-Consent</span>
                  <span className="text-[11px] text-[#66758C]">Aadhaar OTP authenticated dual-party digital e-Sign completed.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-[#16845B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#17263C] block">4. Vault Enrolment</span>
                  <span className="text-[11px] text-[#66758C]">CBS contract ledger updated. Active until next 3-year renewal cycle.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Agreement Status Card (5 cols) */}
            <div className="lg:col-span-5 bg-white border border-[#E3E8F0] rounded-xl p-5 shadow-bank-card space-y-4">
              <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-3">
                <h3 className="font-bold text-[#17263C] text-sm">Agreement Status</h3>
                <span className="text-[10px] font-bold text-[#16845B] bg-[#16845B]/10 border border-[#16845B]/20 px-2.5 py-0.5 rounded tracking-wide">
                  Compliant & Executed
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#66758C]">Contract Reference:</span>
                  <span className="font-mono font-bold text-[#17263C]">
                    {selectedLocker.id === 'lck-125' ? 'ANB/LKR-AGR/DEL/2024/0918' : 'ANB/LKR-AGR/BLR/2023/4412'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#66758C]">Stamp Duty Status:</span>
                  <span className="text-[#16845B] font-semibold">e-Stamp Paid (₹500.00)</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#66758C]">Execution Date:</span>
                  <span className="font-mono text-[#17263C] tabular-nums">{selectedLocker.allotmentDate}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#66758C]">Governing Law:</span>
                  <span className="text-[#17263C] font-medium">Banking Regulation Act, 1949</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#66758C]">Branch Custodian:</span>
                  <span className="text-[#17263C]">{selectedLocker.branchName}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E3E8F0] space-y-2">
                <button
                  onClick={() =>
                    openDocumentPreview(
                      `Model Locker Agreement - Locker ${selectedLocker.lockerNumber}`,
                      selectedLocker.id === 'lck-125' ? 'ANB/LKR-AGR/DEL/2024/0918' : 'ANB/LKR-AGR/BLR/2023/4412'
                    )
                  }
                  className="w-full py-2.5 px-3 text-xs font-semibold text-[#17263C] bg-[#F5F7FA] hover:bg-[#E3E8F0] border border-[#E3E8F0] rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-[#2457A7]" />
                  <span>View Stamped Agreement Document</span>
                </button>

                <button
                  onClick={handleExecuteAgreement}
                  className="w-full py-2.5 px-3 text-xs font-semibold text-white bg-[#102544] hover:bg-[#0B1730] rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <PenTool className="w-3.5 h-3.5 text-[#008C88]" />
                  <span>Re-Execute Agreement (Aadhaar e-Sign)</span>
                </button>
              </div>
            </div>

            {/* Regulatory Summary & Legal Clauses (7 cols) */}
            <div className="lg:col-span-7 bg-[#F5F7FA] border border-[#E3E8F0] rounded-xl p-5 shadow-bank-card space-y-4">
              <h3 className="font-bold text-[#17263C] text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2457A7]" />
                <span>Key Regulatory Clauses & Bank Commitments (RBI Circular 2021-22/86)</span>
              </h3>

              <div className="space-y-3 text-[11px] text-[#17263C] leading-relaxed">
                <div className="p-3.5 bg-white rounded-lg border border-[#E3E8F0] space-y-1 shadow-xs">
                  <span className="font-bold text-[#102544] block">Bank Liability Ceiling (100x Annual Rent):</span>
                  In case of events such as fire, theft, burglary, dacoity, robbery, or building collapse attributable to bank deficiency, the bank liability is statutory pegged up to one hundred times (100x) the annual locker rent (<span className="font-mono font-bold text-[#17263C]">₹{(selectedLocker.annualRent * 100).toLocaleString('en-IN')}</span>).
                </div>

                <div className="p-3.5 bg-white rounded-lg border border-[#E3E8F0] space-y-1 shadow-xs">
                  <span className="font-bold text-[#102544] block">Safe Custody Permissible Articles:</span>
                  Hirers may only store lawful personal jewelry, securities, deeds, and documents. Storage of contraband, currency notes, arms, ammunition, or explosive materials is strictly prohibited.
                </div>

                <div className="p-3.5 bg-white rounded-lg border border-[#E3E8F0] space-y-1 shadow-xs">
                  <span className="font-bold text-[#102544] block">Break-Open Due Process:</span>
                  If rent remains unpaid for consecutive 3 years or if locker remains unopened for 7 years without written notice, bank may break open the locker following statutory public notice and two independent witnesses.
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* KYC Tab */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* KYC Status & Details (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-[#E3E8F0] rounded-xl p-5 shadow-bank-card space-y-4">
            <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-3">
              <h3 className="font-bold text-[#17263C] text-sm">KYC Scrutiny Status</h3>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${
                  lockerKyc?.status === 'Verified'
                    ? 'text-[#16845B] bg-[#16845B]/10 border-[#16845B]/20'
                    : lockerKyc?.status === 'Under Scrutiny'
                    ? 'text-[#2457A7] bg-[#2457A7]/10 border-[#2457A7]/20'
                    : 'text-[#B7791F] bg-[#B7791F]/10 border-[#B7791F]/20'
                }`}
              >
                {lockerKyc?.status || 'Verified'}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#66758C]">Risk Profile:</span>
                <span className="font-bold text-[#17263C]">{lockerKyc?.riskCategory || 'Low Risk (Periodic 10yr)'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#66758C]">Customer CIF:</span>
                <span className="font-mono text-[#17263C]">CIF-9028192831</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#66758C]">Linked Locker:</span>
                <span className="font-mono font-bold text-[#17263C]">Locker {selectedLocker.lockerNumber}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#66758C]">Last Scrutiny Date:</span>
                <span className="font-mono text-[#17263C] tabular-nums">{lockerKyc?.lastKycDate || '12 Oct 2021'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#66758C]">Next Due Date:</span>
                <span className="font-mono font-bold text-[#17263C] tabular-nums">{lockerKyc?.dueDate || '12 Oct 2026'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#66758C]">AML Screening:</span>
                <span className="text-[#16845B] font-semibold">Cleared / Zero Match</span>
              </div>
            </div>

            <div className="p-3 bg-[#F5F7FA] rounded-lg border border-[#E3E8F0] space-y-1 text-[11px] text-[#66758C]">
              <span className="font-bold text-[#17263C] block">Statutory Mandate:</span>
              RBI Master Direction on KYC mandates periodic refresh every 10 years for low-risk, 8 years for medium-risk, and 2 years for high-risk customers holding Safe Custody facilities.
            </div>
          </div>

          {/* KYC Refresh Form (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-[#E3E8F0] rounded-xl p-5 shadow-bank-card space-y-4">
            <div>
              <h3 className="font-bold text-[#17263C] text-sm">Submit Periodic KYC Refresh Documents</h3>
              <p className="text-[#66758C] text-xs mt-0.5">
                Confirm your digital identity details to maintain unhindered safe access
              </p>
            </div>

            <form onSubmit={handleInitiateKyc} className="space-y-4">
              <div>
                <label className="block font-semibold text-[#17263C] mb-1">
                  Aadhaar Number (UIDAI Virtual ID or 12-digit number)
                </label>
                <input
                  type="text"
                  required
                  value={aadhaarInput}
                  onChange={e => setAadhaarInput(e.target.value)}
                  className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 py-2 text-[#17263C] font-mono text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
                />
                <span className="text-[10px] text-[#66758C] mt-1 block">
                  Encrypted offline XML e-KYC will be retrieved upon OTP authentication
                </span>
              </div>

              <div>
                <label className="block font-semibold text-[#17263C] mb-1">
                  Permanent Account Number (PAN)
                </label>
                <input
                  type="text"
                  required
                  value={panInput}
                  onChange={e => setPanInput(e.target.value.toUpperCase())}
                  className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 py-2 text-[#17263C] font-mono text-xs uppercase focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
                />
                <span className="text-[10px] text-[#66758C] mt-1 block">
                  Cross-checked with NSDL / Income Tax Department database
                </span>
              </div>

              <div className="p-3 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addressDeclared}
                    onChange={e => setAddressDeclared(e.target.checked)}
                    className="mt-0.5 rounded border-[#E3E8F0] text-[#102544] focus:ring-[#102544]"
                  />
                  <span className="text-[#17263C] text-[11px] leading-relaxed">
                    I solemnly declare that my residential address on CBS record (Flat 402, Royal Palms, Barakhamba Road, New Delhi 110001) is current and unchanged.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={!addressDeclared || lockerKyc?.status === 'Under Scrutiny'}
                className="w-full py-2.5 px-4 font-semibold text-xs text-white bg-[#102544] hover:bg-[#0B1730] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-[#008C88]" />
                <span>
                  {lockerKyc?.status === 'Under Scrutiny'
                    ? 'KYC Verification Already Under Branch Scrutiny'
                    : 'Submit Periodic KYC Refresh for Scrutiny'}
                </span>
              </button>
            </form>
          </div>

        </div>
      )}

      {/* OTP Modal */}
      <OtpModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onSuccess={handleOtpSuccess}
        title={otpActionType === 'agreement' ? "Aadhaar Digital e-Sign Consent" : "UIDAI e-KYC Step-Up Authentication"}
        actionDescription={
          otpActionType === 'agreement'
            ? `Executing digital signature on Revised Model Agreement for Locker ${selectedLocker.lockerNumber}`
            : `Authorizing periodic e-KYC document scrutiny for Locker ${selectedLocker.lockerNumber}`
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
