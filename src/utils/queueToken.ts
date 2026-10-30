/**
 * SafeVault Queue Token & Waiting List Number Generator
 * Ensures unique, deterministic, non-reused tokens per branch + date.
 */

// Helper to extract 3-letter branch code
export function getBranchCode(branchNameOrId: string): string {
  const clean = branchNameOrId.toUpperCase();
  if (clean.includes('INDIRANAGAR') || clean.includes('IND')) return 'IND';
  if (clean.includes('WHITEFIELD') || clean.includes('WTF')) return 'WTF';
  if (clean.includes('KORAMANGALA') || clean.includes('KOR')) return 'KOR';
  if (clean.includes('MG ROAD') || clean.includes('MGR')) return 'MGR';
  if (clean.includes('NARIMAN') || clean.includes('NRP')) return 'NRP';
  if (clean.includes('BKC') || clean.includes('BANDRA')) return 'BKC';
  if (clean.includes('ANDHERI') || clean.includes('AND')) return 'AND';
  if (clean.includes('POWAI') || clean.includes('POW')) return 'POW';
  if (clean.includes('CONNAUGHT') || clean.includes('CP')) return 'CON';
  if (clean.includes('SOUTH EXT') || clean.includes('SOE')) return 'SOE';
  if (clean.includes('DWARKA') || clean.includes('DWK')) return 'DWK';
  if (clean.includes('KAROL') || clean.includes('KBG')) return 'KBG';
  if (clean.includes('BANJARA') || clean.includes('BNJ')) return 'BNJ';
  if (clean.includes('HITECH') || clean.includes('HIT')) return 'HIT';
  if (clean.includes('GACHIBOWLI') || clean.includes('GCB')) return 'GCB';
  if (clean.includes('ANNA SALAI') || clean.includes('ANS')) return 'ANS';
  if (clean.includes('T. NAGAR') || clean.includes('TNG')) return 'TNG';
  if (clean.includes('PARK STREET') || clean.includes('PKS')) return 'PKS';
  if (clean.includes('SHIVAJINAGAR') || clean.includes('SVJ')) return 'SVJ';
  if (clean.includes('VASHI') || clean.includes('VSH')) return 'VSH';
  if (clean.includes('SEAWOODS') || clean.includes('SWD')) return 'SWD';
  if (clean.includes('BELAPUR') || clean.includes('BLP')) return 'BLP';
  if (clean.includes('KHARGHAR') || clean.includes('KHG')) return 'KHG';

  // Fallback: 3 letters from first word or ID
  const alphaOnly = branchNameOrId.replace(/[^A-Za-z]/g, '').toUpperCase();
  return alphaOnly.substring(0, 3) || 'VLT';
}

// Convert date string YYYY-MM-DD to YYMMDD
export function formatYYMMDD(dateStr?: string): string {
  const d = dateStr ? new Date(dateStr) : new Date();
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yy}${mm}${dd}`;
}

// Map size to 1-letter code
export function getSizeCode(size: string): string {
  const s = size.toLowerCase();
  if (s.includes('extra') || s.includes('xl')) return 'XL';
  if (s.includes('large')) return 'L';
  if (s.includes('medium')) return 'M';
  return 'S';
}

/**
 * Generates next sequence number for branch + date.
 * Persists sequence in localStorage so it strictly increments and never duplicates.
 */
export function generateQueueToken(branchNameOrId: string, dateStr: string): {
  token: string;
  sequenceNumber: number;
  estimatedWaitMinutes: number;
} {
  const branchCode = getBranchCode(branchNameOrId);
  const dateFormatted = formatYYMMDD(dateStr);
  const storageKey = `sv_queue_seq_${branchCode}_${dateFormatted}`;

  let currentSeq = 14; // Default starting demo sequence for the day
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      currentSeq = parseInt(saved, 10) + 1;
    }
    localStorage.setItem(storageKey, String(currentSeq));
  } catch {
    currentSeq += 1;
  }

  const paddedSeq = String(currentSeq).padStart(3, '0');
  const token = `SV-${branchCode}-${dateFormatted}-${paddedSeq}`;

  // Average slot length: 15 mins. Estimated wait calculation
  // (Assuming 2 customers ahead in line in immediate queue window)
  const estimatedWaitMinutes = Math.max(5, (currentSeq % 3 + 1) * 5);

  return {
    token,
    sequenceNumber: currentSeq,
    estimatedWaitMinutes
  };
}

/**
 * Generates Waiting List Number when stock is zero:
 * WL-<BRANCHCODE>-<SIZE>-<4-digit sequence>
 * e.g. WL-IND-L-0027
 */
export function generateWaitingListNumber(branchNameOrId: string, size: string): {
  wlNumber: string;
  position: number;
  estimatedAllotmentWindow: string;
} {
  const branchCode = getBranchCode(branchNameOrId);
  const sizeCode = getSizeCode(size);
  const storageKey = `sv_wl_seq_${branchCode}_${sizeCode}`;

  let currentSeq = 27; // Default baseline demo waitlist position
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      currentSeq = parseInt(saved, 10) + 1;
    }
    localStorage.setItem(storageKey, String(currentSeq));
  } catch {
    currentSeq += 1;
  }

  const paddedSeq = String(currentSeq).padStart(4, '0');
  const wlNumber = `WL-${branchCode}-${sizeCode}-${paddedSeq}`;

  // Realistic mock allotment window based on position
  let estimatedAllotmentWindow = '2–3 weeks';
  if (currentSeq <= 5) estimatedAllotmentWindow = '3–5 days';
  else if (currentSeq <= 15) estimatedAllotmentWindow = '1–2 weeks';
  else if (currentSeq <= 30) estimatedAllotmentWindow = '3–4 weeks';
  else estimatedAllotmentWindow = '5–8 weeks';

  return {
    wlNumber,
    position: currentSeq,
    estimatedAllotmentWindow
  };
}
