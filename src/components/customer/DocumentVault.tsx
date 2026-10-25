import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { DocumentModal } from '../common/DocumentModal';
import { StoredDocument } from '../../types';
import {
  FileText,
  Download,
  Eye,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  FolderLock,
  Plus,
  Stamp,
  X,
  FileCheck2
} from 'lucide-react';

export const DocumentVault: React.FC = () => {
  const { documents, lockers, requestOfficialDocument } = useBanking();
  const customerLockers = lockers.filter(l => l.customerId === 'cust-rahul-01');

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewDoc, setViewDoc] = useState<StoredDocument | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null);

  // Form State for requesting certified extract
  const [reqLockerNum, setReqLockerNum] = useState<string>(customerLockers[0]?.lockerNumber || 'A-125');
  const [reqCategory, setReqCategory] = useState<StoredDocument['category']>('Safe Custody Certificate');
  const [reqPurpose, setReqPurpose] = useState<string>('Statutory Audit / Income Tax Disclosure');

  const categories = [
    'All',
    'Locker Agreement',
    'Allotment Letter',
    'Payment Receipt',
    'Nomination Form DA-1',
    'Safe Custody Certificate',
    'Surrender Clearance'
  ];

  const filteredDocs = documents.filter(doc => {
    if (selectedCategory !== 'All' && doc.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.documentRef.toLowerCase().includes(q) ||
        doc.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleGenerateCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    requestOfficialDocument(reqCategory, reqLockerNum);
    setIsRequestModalOpen(false);
    setRequestSuccess(`Official ${reqCategory} for Locker ${reqLockerNum} has been certified, digitally signed and added to your Vault.`);
    setTimeout(() => setRequestSuccess(null), 6000);
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* Title */}
      <div className="pb-3 border-b border-[#E3E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#17263C]">
              Document Vault & Safe Custody Certificates
            </h1>
            <span className="text-[10px] font-bold text-[#008C88] bg-[#008C88]/10 border border-[#008C88]/20 px-2 py-0.5 rounded tracking-wide uppercase">
              Digital Seal
            </span>
          </div>
          <p className="text-[#66758C] text-xs mt-1">
            Tamper-evident legal repository of executed agreements, allotment memos, stamped tax invoices, nomination certificates, and non-encumbrance extracts
          </p>
        </div>

        <button
          onClick={() => setIsRequestModalOpen(true)}
          className="px-3.5 py-2 bg-[#102544] hover:bg-[#0B1730] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs self-start"
        >
          <Stamp className="w-3.5 h-3.5 text-[#008C88]" />
          <span>Request Certified Bank Extract</span>
        </button>
      </div>

      {requestSuccess && (
        <div className="p-4 bg-emerald-50/80 border border-emerald-200/80 rounded-xl text-emerald-950 flex items-center gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-[#16845B] shrink-0" />
          <div>
            <span className="font-bold text-[#16845B]">Official Certificate Generated</span>
            <p className="text-emerald-800 text-[11px] mt-0.5">
              {requestSuccess}
            </p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-3.5 bg-white border border-[#E3E8F0] rounded-xl shadow-bank-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#102544] text-white shadow-xs'
                  : 'bg-[#F5F7FA] text-[#17263C] border border-[#E3E8F0] hover:bg-[#E3E8F0]/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#66758C] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by ref or title..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg pl-8 pr-3 py-1.5 text-[#17263C] text-xs placeholder-[#66758C] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
          />
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map(doc => (
          <div
            key={doc.id}
            className="p-5 bg-white border border-[#E3E8F0] rounded-xl shadow-bank-card hover:border-[#102544]/30 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-lg bg-[#2457A7]/10 border border-[#2457A7]/20 text-[#2457A7] flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-[#16845B] bg-[#16845B]/10 border border-[#16845B]/20 px-2 py-0.5 rounded flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#16845B]" />
                  <span>{doc.signedStatus}</span>
                </span>
              </div>

              <div>
                <h3 className="font-bold text-xs text-[#17263C] line-clamp-1">{doc.title}</h3>
                <span className="text-[11px] font-mono text-[#66758C] block mt-0.5">
                  Ref: {doc.documentRef}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#66758C] pt-2 border-t border-[#E3E8F0]">
                <div>
                  <span className="text-[#66758C] text-[10px] uppercase block font-medium">Category</span>
                  <span className="font-semibold text-[#17263C]">{doc.category}</span>
                </div>
                <div>
                  <span className="text-[#66758C] text-[10px] uppercase block font-medium">Issued / Stamped</span>
                  <span className="font-mono text-[#17263C] tabular-nums font-semibold">{doc.issueDate}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E3E8F0] flex items-center justify-between">
              <span className="text-[11px] text-[#66758C] font-mono">{doc.fileSize}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewDoc(doc)}
                  className="px-2.5 py-1 text-xs font-semibold text-[#17263C] bg-[#F5F7FA] hover:bg-[#E3E8F0] border border-[#E3E8F0] rounded-md flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3 h-3 text-[#2457A7]" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => alert(`Downloading verified copy of ${doc.documentRef}`)}
                  className="p-1.5 text-[#66758C] hover:text-[#17263C] hover:bg-[#F5F7FA] rounded-md border border-[#E3E8F0] transition-colors"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Request Certified Document Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1730]/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-[#E3E8F0] max-w-lg w-full overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E3E8F0] flex items-center justify-between bg-[#F5F7FA]">
              <div className="flex items-center gap-2">
                <Stamp className="w-4 h-4 text-[#2457A7]" />
                <h3 className="font-bold text-[#17263C] text-sm">Request Official Certified Certificate</h3>
              </div>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="text-[#66758C] hover:text-[#17263C] p-1.5 rounded-md hover:bg-[#E3E8F0]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGenerateCertificate} className="p-5 space-y-4">
              <div>
                <label className="block font-semibold text-[#17263C] mb-1">Select Locker</label>
                <select
                  value={reqLockerNum}
                  onChange={e => setReqLockerNum(e.target.value)}
                  className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 py-2 text-[#17263C] text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
                >
                  {customerLockers.map(lkr => (
                    <option key={lkr.id} value={lkr.lockerNumber}>
                      Locker {lkr.lockerNumber} - {lkr.branchName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#17263C] mb-1">Certificate Type</label>
                <select
                  value={reqCategory}
                  onChange={e => setReqCategory(e.target.value as StoredDocument['category'])}
                  className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 py-2 text-[#17263C] text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
                >
                  <option value="Safe Custody Certificate">
                    Official Safe Custody & Non-Encumbrance Certificate
                  </option>
                  <option value="Allotment Letter">
                    Certified Allotment & Tenancy Extract
                  </option>
                  <option value="Nomination Form DA-1">
                    Form DA-1 Certified Nomination Registration Certificate
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#17263C] mb-1">Purpose of Certificate</label>
                <select
                  value={reqPurpose}
                  onChange={e => setReqPurpose(e.target.value)}
                  className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg px-3 py-2 text-[#17263C] text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#102544] focus:border-[#102544]"
                >
                  <option value="Statutory Audit / Income Tax Disclosure">
                    Statutory Audit / Income Tax Disclosure
                  </option>
                  <option value="Foreign Visa / Emigration Net Worth Proof">
                    Foreign Visa / Emigration Net Worth Proof
                  </option>
                  <option value="Court / Judicial Submission">
                    Court / Judicial Submission
                  </option>
                  <option value="Family Settlement / Estate Planning">
                    Family Settlement / Estate Planning
                  </option>
                </select>
              </div>

              <div className="p-3.5 bg-[#F5F7FA] rounded-lg border border-[#E3E8F0] space-y-1 text-xs text-[#66758C]">
                <span className="font-bold text-[#102544] block">Bank Digital Attestation:</span>
                This document is generated with cryptographic hash verification, QR verification url, and branch custodian digital seal as per Section 45ZA of the Banking Regulation Act.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E3E8F0]">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-3.5 py-2 text-xs text-[#66758C] hover:text-[#17263C] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#102544] hover:bg-[#0B1730] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-[#008C88]" />
                  <span>Generate & Attest Certificate</span>
                </button>
              </div>
            </form>
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
