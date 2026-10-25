import React from 'react';
import { X, Download, Printer, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';
import { StoredDocument } from '../../types';

interface DocumentModalProps {
  document: StoredDocument | null;
  onClose: () => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({ document, onClose }) => {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-700" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">{document.title}</h3>
              <p className="text-xs text-slate-500 font-mono">Ref: {document.documentRef}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert(`Downloading signed copy for ${document.documentRef}`)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={() => window.print()}
              className="p-1.5 text-slate-500 hover:text-slate-700 rounded-lg border border-slate-200 bg-white"
              title="Print"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Realistic Bank Stamped Document Paper View */}
        <div className="p-8 max-h-[75vh] overflow-y-auto bg-slate-100 font-sans">
          <div className="bg-white border border-slate-300 rounded-lg shadow-sm p-8 max-w-2xl mx-auto space-y-6 text-slate-900 text-xs leading-relaxed">
            
            {/* Government Stamp Duty Simulated Header for Legal Agreements */}
            {document.category === 'Locker Agreement' && (
              <div className="border-2 border-emerald-800 rounded p-4 bg-emerald-50/40 text-center space-y-1">
                <div className="text-[10px] tracking-wider uppercase font-bold text-emerald-900">
                  Government of NCT of Delhi · e-Stamp Certificate
                </div>
                <div className="text-sm font-extrabold text-emerald-950 font-mono">
                  IN-DL89218290381029U
                </div>
                <div className="text-[10px] text-emerald-800 flex justify-center gap-4 pt-1 font-mono">
                  <span>Stamp Duty Paid: ₹500.00</span>
                  <span>·</span>
                  <span>Article 5(c) Agreement</span>
                </div>
              </div>
            )}

            {/* Bank Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="text-base font-extrabold tracking-tight text-slate-900">
                  APEX NATIONAL BANK
                </div>
                <div className="text-[11px] text-slate-500">
                  Safe Custody & Locker Operations Division · New Delhi
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  RBI Reg No: 04/9912 · IFSC: ANB000101 · CIN: L65110DL1982PLC012984
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  <ShieldCheck className="w-3 h-3" />
                  {document.signedStatus}
                </span>
                <div className="text-[10px] text-slate-500 mt-1">Date: {document.issueDate}</div>
              </div>
            </div>

            {/* Document Body */}
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 inline-block">
                  {document.title}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded border border-slate-200 text-[11px]">
                <div>
                  <span className="text-slate-500">Document Reference:</span>{' '}
                  <span className="font-mono font-medium text-slate-900">{document.documentRef}</span>
                </div>
                <div>
                  <span className="text-slate-500">Customer CIF:</span>{' '}
                  <span className="font-mono font-medium text-slate-900">CIF-9028192831</span>
                </div>
                <div>
                  <span className="text-slate-500">Hirer / Primary Holder:</span>{' '}
                  <span className="font-medium text-slate-900">Rahul Sharma</span>
                </div>
                <div>
                  <span className="text-slate-500">PAN Number:</span>{' '}
                  <span className="font-mono font-medium text-slate-900">ABCPS1234F</span>
                </div>
              </div>

              {document.category === 'Locker Agreement' && (
                <div className="space-y-2 text-slate-700 text-justify">
                  <p>
                    <strong>1. Safe Deposit Covenant:</strong> This Safe Deposit Locker Agreement is executed between National Bank (the &apos;Bank&apos;) and the customer(s) (&apos;Hirer&apos;) in accordance with Reserve Bank of India (Safe Deposit Locker/Safe Custody Article Facility) Directions.
                  </p>
                  <p>
                    <strong>2. Standard of Due Care:</strong> The Bank shall exercise due diligence and standard care as prescribed by regulatory statutes in protecting the safe deposit vault premises against burglary, theft, fire, water seepage, or building structural collapse.
                  </p>
                  <p>
                    <strong>3. Permissible Custody:</strong> The Hirer agrees that the locker compartment shall be utilized strictly for lawful purposes including safe custody of jewelry, financial securities, deeds, and personal articles. Explosive, hazardous, contraband, arms, or prohibited substances are strictly prohibited under penalty of law.
                  </p>
                  <p>
                    <strong>4. Dual Key Mechanism:</strong> Operation of the locker compartment shall be conducted solely using the Bank Custodian master key in combination with the unique Hirer key issued to the customer.
                  </p>
                  <p>
                    <strong>5. Rent & Lien:</strong> Annual rental charges shall be payable in advance. In the event of rent default exceeding three (3) consecutive years, the Bank reserves the right to initiate formal break-open proceedings following due statutory notice.
                  </p>
                </div>
              )}

              {document.category === 'Allotment Letter' && (
                <div className="space-y-2 text-slate-700 text-justify">
                  <p>
                    We have pleasure in informing you that Safe Deposit Locker No. <strong>A-125</strong> (Medium Size, 175 x 250 x 492 mm) located on the Strongroom Sub-Level 1 at our Main Branch - Connaught Place has been duly allotted to your name under Single operating mandate.
                  </p>
                  <p>
                    One (1) original key bearing manufacturer serial <strong>K-8820A</strong> has been handed over in a tamper-evident sealed envelope. No duplicate key is retained by the Bank. Loss of this key must be reported immediately to prevent unauthorized access.
                  </p>
                </div>
              )}

              {document.category === 'Nomination Form DA-1' && (
                <div className="space-y-2 text-slate-700">
                  <p className="font-semibold text-slate-900">
                    Form DA-1 (Nomination under Section 45ZA of the Banking Regulation Act, 1949)
                  </p>
                  <p>
                    I, Rahul Sharma, residing at Flat 402, Oakwood Enclave, Barakhamba Road, New Delhi, nominate the following person to whom in the event of my death the safe custody articles/contents of Locker No. A-125 may be released by National Bank:
                  </p>
                  <div className="border border-slate-200 rounded p-3 bg-slate-50 text-[11px] space-y-1">
                    <div><strong>Nominee Name:</strong> Rohan Sharma (Son)</div>
                    <div><strong>Date of Birth:</strong> 14 Aug 2004 (Major)</div>
                    <div><strong>Address:</strong> Flat 402, Oakwood Enclave, Barakhamba Road, New Delhi 110001</div>
                    <div><strong>Registration Date:</strong> 18 Jan 2024</div>
                  </div>
                </div>
              )}

              {document.category === 'Payment Receipt' && (
                <div className="space-y-3">
                  <table className="w-full border-collapse border border-slate-200 text-[11px]">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600">
                        <th className="border border-slate-200 p-2 text-left">Description</th>
                        <th className="border border-slate-200 p-2 text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-200 p-2">Annual Locker Rental Charges (FY 2026-27)</td>
                        <td className="border border-slate-200 p-2 text-right font-mono">4,500.00</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-200 p-2">CGST @ 9%</td>
                        <td className="border border-slate-200 p-2 text-right font-mono">405.00</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-200 p-2">SGST @ 9%</td>
                        <td className="border border-slate-200 p-2 text-right font-mono">405.00</td>
                      </tr>
                      <tr className="font-bold bg-slate-50 text-slate-900">
                        <td className="border border-slate-200 p-2">Total Amount Paid</td>
                        <td className="border border-slate-200 p-2 text-right font-mono">₹5,310.00</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-[10px] text-slate-500">
                    Payment Mode: CBS Electronic Account Debit. Transaction Reference: TXN-ANB-9901827361.
                  </p>
                </div>
              )}

              {document.category === 'Surrender Clearance' && (
                <div className="space-y-2 text-slate-700">
                  <p>
                    This is to certify that Safe Deposit Locker No. A-125 has been formally surrendered by the Hirer. The compartment was inspected in the presence of the customer and certified completely cleared of all personal articles.
                  </p>
                  <p>
                    Original key returned and tested. Security deposit lien of ₹15,000 has been released and refunded to Savings Account No. 5010049281720.
                  </p>
                </div>
              )}

              {/* Bank Signatures & Seal */}
              <div className="pt-6 border-t border-slate-200 flex items-end justify-between">
                <div>
                  <div className="w-24 h-10 border border-dashed border-emerald-400 bg-emerald-50/50 rounded flex items-center justify-center text-[9px] text-emerald-800 font-bold uppercase tracking-wider">
                    e-Signed (Aadhaar)
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Digitally Verified: Rahul Sharma<br />
                    Timestamp: {document.issueDate}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-serif italic text-slate-700">Priya Nair</div>
                  <div className="text-[11px] font-bold text-slate-900">For National Bank</div>
                  <div className="text-[10px] text-slate-500">
                    Senior Manager - Vault Operations & Locker Custodian
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
            <span>Cryptographically verified against Bank CBS repository</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
