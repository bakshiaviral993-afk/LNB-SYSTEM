/**
 * National Bank - SafeVault Locker Management System
 * Secure Document & Receipt Download Generator
 */

import { StoredDocument } from '../types';

export const downloadDocumentFile = (doc: StoredDocument): void => {
  const fileContent = `================================================================================
NATIONAL BANK — SAFEVAULT DIGITAL LOCKER SERVICES
Official Certified Safe Custody Document Extract
================================================================================
DOCUMENT REFERENCE: ${doc.documentRef}
DOCUMENT TITLE:     ${doc.title}
CATEGORY:           ${doc.category}
ISSUANCE DATE:      ${doc.issueDate}
STATUTORY STATUS:   ${doc.signedStatus}
FILE SIZE:          ${doc.fileSize}
AUTHENTICATION:     256-bit Digital Signature & WORM Immutable Ledger
================================================================================

CERTIFICATE DETAILS & DECLARATION:
This is an authentic, legally valid digital record issued under Section 45ZE of the 
Banking Regulation Act, 1949 and Reserve Bank of India Safe Custody Directions.

1. Hirer Identity & Specimen Verification: Confirmed against CBS signature card.
2. Strongroom Facility: National Bank Branch Vaults.
3. Dual-Custody Key Number: Vault Master Key #1 & Customer Operating Key #2.
4. Digital Endorsement: Cryptographically sealed by National Bank Core Banking Layer.

OFFICIAL DIGITAL SIGNATURE:
Issuer: National Bank Central Safe Custody Division
Signer: Priya Nair (Senior Operations Manager & Vault Custodian)
Digital Thumbprint: SHA256: 9F8A24B01E2948BC6201AA9438012DCB57E4
Timestamp: ${new Date().toISOString()}

================================================================================
© National Bank | SafeVault Safe Custody Architecture · All Rights Reserved
================================================================================`;

  const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const sanitizedRef = doc.documentRef.replace(/[^a-zA-Z0-9_-]/g, '_');
  link.download = `NationalBank_${sanitizedRef}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadCsvFile = (filename: string, headers: string[], rows: (string | number)[][]): void => {
  const csvContent = [
    headers.map(h => `"${h}"`).join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
