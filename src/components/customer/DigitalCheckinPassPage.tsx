import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { useBanking } from '../../context/BankingContext';
import { Appointment } from '../../types';
import {
  computeCancellationCharge,
  computeRescheduleCharge,
  CANCELLATION_POLICY,
  RESCHEDULE_POLICY
} from '../../config/policy';
import {
  QrCode,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Download,
  Share2,
  RefreshCw,
  XCircle,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Wallet,
  ExternalLink,
  Lock,
  UserCheck,
  Copy,
  ChevronRight,
  Info,
  CreditCard
} from 'lucide-react';

interface DigitalCheckinPassPageProps {
  passId?: string;
  onBack: () => void;
  onReschedule?: (apt: Appointment) => void;
  onCancel?: (apt: Appointment) => void;
}

export const DigitalCheckinPassPage: React.FC<DigitalCheckinPassPageProps> = ({
  passId,
  onBack,
  onReschedule,
  onCancel
}) => {
  const { appointments, lockers, cancelAppointment, rescheduleAppointment } = useBanking();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedToast, setCopiedToast] = useState(false);
  const [walletToast, setWalletToast] = useState(false);

  // Policy Modal & Charges Bottom Sheet States
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [actionSheetType, setActionSheetType] = useState<'cancel' | 'reschedule' | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Live "Now serving" ticker in demo mode (advances every 20s)
  const [nowServingNumber, setNowServingNumber] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('sv_demo_now_serving');
      return saved ? parseInt(saved, 10) : 9;
    } catch {
      return 9;
    }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setNowServingNumber(prev => {
        const next = prev >= 35 ? 7 : prev + 1;
        try {
          localStorage.setItem('sv_demo_now_serving', String(next));
        } catch {
          // ignore
        }
        return next;
      });
    }, 20000);
    return () => clearInterval(timer);
  }, []);

  // Find targeted appointment or fallback to first active customer appointment
  const currentApt = appointments.find(a => a.id === passId || a.tokenNumber === passId) ||
    appointments.find(a => a.status === 'Confirmed' || a.status === 'Checked In') ||
    appointments[0];

  const relatedLocker = lockers.find(l => l.id === currentApt?.lockerId || l.lockerNumber === currentApt?.lockerNumber);

  // Parse queue position from token if formatted like SV-XXX-YYMMDD-014
  const queueSequence = currentApt?.tokenNumber ? parseInt(currentApt.tokenNumber.slice(-3), 10) || 14 : 14;
  const estimatedWaitMin = Math.max(5, Math.abs(queueSequence - nowServingNumber) * 10);

  // Dynamic countdown calculation to slot time
  const [timeLeftStr, setTimeLeftStr] = useState<string>('');

  useEffect(() => {
    if (!currentApt) return;

    // Generate real scannable QR Code
    const payload = JSON.stringify({
      passType: 'SAFEVAULT_TURNSTILE_TOKEN',
      tokenId: currentApt.tokenNumber,
      cif: 'CIF-9028192831',
      customer: currentApt.customerName || 'Rahul Sharma',
      locker: currentApt.lockerNumber,
      branch: currentApt.branchName,
      date: currentApt.date,
      timeSlot: currentApt.timeSlot,
      issuedAt: new Date().toISOString()
    });

    QRCode.toDataURL(payload, {
      width: 260,
      margin: 1,
      color: {
        dark: '#6B0E37',
        light: '#FFFFFF'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR Gen error', err));

    // Dynamic timer
    const updateCountdown = () => {
      try {
        const slotStart = currentApt.timeSlot.split(' - ')[0] || '10:00 AM';
        const [timePart, meridiem] = slotStart.split(' ');
        const [hoursStr, minutesStr] = timePart.split(':');
        let hours = parseInt(hoursStr, 10);
        if (meridiem === 'PM' && hours < 12) hours += 12;
        if (meridiem === 'AM' && hours === 12) hours = 0;

        const targetDate = new Date(currentApt.date);
        targetDate.setHours(hours, parseInt(minutesStr || '0', 10), 0, 0);

        const diffMs = targetDate.getTime() - Date.now();
        if (diffMs <= 0) {
          setTimeLeftStr('Slot Active / In Progress');
        } else {
          const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
          const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);
          setTimeLeftStr(`${diffHrs}h ${diffMins}m ${diffSecs}s`);
        }
      } catch (e) {
        setTimeLeftStr('Scheduled');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [currentApt]);

  // Handle Share
  const handleShare = async () => {
    if (navigator.share && currentApt) {
      try {
        await navigator.share({
          title: `SafeVault Pass - ${currentApt.tokenNumber}`,
          text: `SafeVault Digital Entry Pass for Locker #${currentApt.lockerNumber} at ${currentApt.branchName} on ${currentApt.date} (${currentApt.timeSlot}).`,
          url: window.location.href
        });
      } catch (err) {
        copyPassDetails();
      }
    } else {
      copyPassDetails();
    }
  };

  const copyPassDetails = () => {
    if (!currentApt) return;
    navigator.clipboard.writeText(currentApt.tokenNumber);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 3000);
  };

  const handleAddToWallet = () => {
    setWalletToast(true);
    setTimeout(() => setWalletToast(false), 3500);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  if (!currentApt) {
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-sm text-[#6B5B68] dark:text-[#A898A4]">No appointment pass selected.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-[#97144D] text-white rounded-xl text-xs font-bold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Label requirement: "Locker A-125 (Vault Visit)" or "(Locker Surrender)" only on surrender passes
  const isSurrender = currentApt.purpose?.toLowerCase().includes('surrender');
  const passHeaderLabel = isSurrender
    ? `Locker ${currentApt.lockerNumber} (Locker Surrender)`
    : `Locker ${currentApt.lockerNumber} (Vault Visit)`;

  // Fee computations for cancellation / reschedule
  const cancelFee = computeCancellationCharge(currentApt.date, currentApt.timeSlot);
  const rescheduleFee = computeRescheduleCharge(currentApt.date, currentApt.timeSlot, 0);

  const confirmCancellation = () => {
    cancelAppointment(currentApt.id);
    setActionSheetType(null);
    setActionSuccessMsg(`Visit booking cancelled. Charge of ₹${cancelFee.totalCharge} processed to linked account.`);
    setTimeout(() => {
      onBack();
    }, 2200);
  };

  const confirmReschedule = () => {
    setActionSheetType(null);
    if (onReschedule) {
      onReschedule(currentApt);
    }
  };

  return (
    <div className="min-h-dvh overflow-y-auto pb-32 text-[#1F1420] dark:text-[#F5ECF1] space-y-4">
      
      {/* Top sticky navigation bar */}
      <div className="sticky top-0 z-30 bg-[#FAF6F8]/95 dark:bg-[#14080F]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#97144D] dark:text-[#FFDF85] p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <div className="text-center">
          <span className="text-[10px] font-mono tracking-wider uppercase text-[#C9A24B] font-extrabold block">
            OFFICIAL DIGITAL PASS
          </span>
          <span className="text-xs font-extrabold text-[#1F1420] dark:text-white">
            {currentApt.tokenNumber}
          </span>
        </div>
        <button
          onClick={() => setShowPolicyModal(true)}
          className="text-[11px] font-bold text-[#97144D] dark:text-[#FFDF85] underline cursor-pointer"
        >
          Policy
        </button>
      </div>

      {copiedToast && (
        <div className="mx-4 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Token number copied to clipboard!</span>
        </div>
      )}

      {walletToast && (
        <div className="mx-4 p-3 bg-[#97144D]/10 border border-[#97144D]/30 rounded-xl text-[#97144D] dark:text-[#FFDF85] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Wallet className="w-4 h-4 shrink-0" />
          <span>Pass saved to SafeVault Digital Wallet cache.</span>
        </div>
      )}

      {actionSuccessMsg && (
        <div className="mx-4 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Main Boarding-Pass Style Card */}
      <div className="mx-4 bg-white dark:bg-[#221019] rounded-3xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] shadow-xl overflow-hidden">
        
        {/* Pass Top Banner (Burgundy Gradient) */}
        <div className="bg-gradient-to-r from-[#6B0E37] via-[#97144D] to-[#6B0E37] text-white p-5 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-28 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
          
          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#C9A24B]/30 text-[#FFDF85] border border-[#C9A24B]/40 mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FFDF85]" />
                <span>Verified Biometric Pass</span>
              </span>
              <h1 className="text-lg font-black tracking-tight text-white">
                {passHeaderLabel}
              </h1>
              <p className="text-xs text-white/80 font-mono mt-0.5">
                {currentApt.branchName}
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-xs flex items-center justify-center font-black text-xl text-[#FFDF85] shadow-inner">
              SV
            </div>
          </div>

          {/* Live Queue Position & Now Serving Ticker (Spec Requirement) */}
          <div className="mt-3.5 pt-3 border-t border-white/15 grid grid-cols-2 gap-2 text-xs text-white">
            <div className="bg-black/25 rounded-xl p-2 border border-white/10">
              <span className="text-[10px] text-white/70 block uppercase font-mono">Live Turnstile</span>
              <span className="font-extrabold text-[#FFDF85] text-xs flex items-center gap-1 mt-0.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Now Serving: #{String(nowServingNumber).padStart(3, '0')}
              </span>
            </div>
            <div className="bg-black/25 rounded-xl p-2 border border-white/10">
              <span className="text-[10px] text-white/70 block uppercase font-mono">Queue Today</span>
              <span className="font-extrabold text-white text-xs mt-0.5 block">
                Position: #{queueSequence} (~{estimatedWaitMin}m wait)
              </span>
            </div>
          </div>

          {/* Countdown indicator */}
          <div className="mt-2 flex items-center justify-between text-xs text-white/90">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FFDF85]" />
              <span className="text-[11px]">Countdown:</span>
            </span>
            <span className="font-mono font-bold text-xs text-[#FFDF85] tabular-nums">
              {timeLeftStr}
            </span>
          </div>
        </div>

        {/* Notched perforated separator */}
        <div className="relative h-6 bg-white dark:bg-[#221019] flex items-center">
          <div className="w-4 h-8 bg-[#FAF6F8] dark:bg-[#14080F] rounded-r-full -ml-2 border-r border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]" />
          <div className="flex-1 border-b-2 border-dashed border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] mx-2" />
          <div className="w-4 h-8 bg-[#FAF6F8] dark:bg-[#14080F] rounded-l-full -mr-2 border-l border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]" />
        </div>

        {/* QR Code Scannable Section — WHITE TILE IN DARK MODE SO IT SCANS */}
        <div className="p-5 flex flex-col items-center justify-center text-center space-y-3">
          <div className="p-3 bg-white rounded-2xl border-2 border-[#97144D]/30 shadow-md">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`Turnstile Access QR for ${currentApt.tokenNumber}`}
                className="w-48 h-48 rounded-xl object-contain"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-xs text-[#6B5B68]">
                Generating QR...
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono font-black text-lg tracking-wider text-[#97144D] dark:text-[#FFDF85] select-all">
                {currentApt.tokenNumber}
              </span>
              <button
                type="button"
                onClick={copyPassDetails}
                className="p-1 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 text-[#6B5B68] dark:text-[#A898A4]"
                title="Copy Token"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <span className="text-xs text-[#6B5B68] dark:text-[#A898A4] block">
              Scan at branch strongroom biometric optical turnstile
            </span>
          </div>

          {/* Live Status Chip */}
          <div className="pt-1">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              currentApt.status === 'Confirmed' || (currentApt.status as string) === 'Booked'
                ? 'bg-[#1E8E5A]/15 text-[#1E8E5A] border border-[#1E8E5A]/30'
                : currentApt.status === 'Checked In'
                ? 'bg-[#C9A24B]/15 text-[#C9A24B] border border-[#C9A24B]/30'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              <span>Status: {currentApt.status || 'Booked'}</span>
            </span>
          </div>
        </div>

        {/* Pass Details Table */}
        <div className="px-5 pb-5 space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[#FAF6F8] dark:bg-[#2E1624] p-2.5 rounded-xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
              <span className="text-[11px] text-[#6B5B68] dark:text-[#A898A4] block">Date</span>
              <span className="font-mono font-bold text-xs text-[#1F1420] dark:text-white mt-0.5 block">
                {currentApt.date}
              </span>
            </div>

            <div className="bg-[#FAF6F8] dark:bg-[#2E1624] p-2.5 rounded-xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
              <span className="text-[11px] text-[#6B5B68] dark:text-[#A898A4] block">Reserved Slot</span>
              <span className="font-mono font-bold text-xs text-[#1F1420] dark:text-white mt-0.5 block">
                {currentApt.timeSlot}
              </span>
            </div>

            <div className="bg-[#FAF6F8] dark:bg-[#2E1624] p-2.5 rounded-xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
              <span className="text-[11px] text-[#6B5B68] dark:text-[#A898A4] block">Compartment</span>
              <span className="font-mono font-bold text-xs text-[#1F1420] dark:text-white mt-0.5 block">
                Locker #{currentApt.lockerNumber} ({relatedLocker?.size || 'Standard'})
              </span>
            </div>

            <div className="bg-[#FAF6F8] dark:bg-[#2E1624] p-2.5 rounded-xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
              <span className="text-[11px] text-[#6B5B68] dark:text-[#A898A4] block">Primary Hirer</span>
              <span className="font-semibold text-xs text-[#1F1420] dark:text-white mt-0.5 block truncate">
                {currentApt.customerName || 'Rahul Sharma'}
              </span>
            </div>
          </div>

          {/* Branch & Open in Maps button */}
          <div className="p-3 bg-[#FAF6F8] dark:bg-[#2E1624] rounded-xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#97144D] dark:text-[#FFDF85] shrink-0" />
              <div>
                <span className="font-bold text-xs text-[#1F1420] dark:text-white block">
                  {currentApt.branchName}
                </span>
                <span className="text-[11px] text-[#6B5B68] dark:text-[#A898A4]">
                  Automated Biometric Strongroom
                </span>
              </div>
            </div>

            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(currentApt.branchName + ' SafeVault')}`}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1.5 rounded-lg bg-[#97144D]/10 hover:bg-[#97144D]/20 text-[#97144D] dark:text-[#FFDF85] font-bold text-xs flex items-center gap-1 transition-colors"
            >
              <span>Map</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Quick Action Grid */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={handleAddToWallet}
              className="h-11 rounded-xl bg-[#1F1420] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer active-press"
            >
              <Wallet className="w-4 h-4 text-[#C9A24B]" />
              <span>Add to Wallet</span>
            </button>

            <button
              onClick={handleShare}
              className="h-11 rounded-xl bg-white dark:bg-[#2E1624] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] hover:bg-[#FAF6F8] text-[#1F1420] dark:text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer active-press"
            >
              <Share2 className="w-4 h-4 text-[#97144D] dark:text-[#FFDF85]" />
              <span>Share Pass</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="h-11 rounded-xl bg-[#FAF6F8] dark:bg-[#2E1624] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] text-[#1F1420] dark:text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer active-press"
            >
              <Download className="w-4 h-4 text-[#97144D] dark:text-[#FFDF85]" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={() => setActionSheetType('reschedule')}
              className="h-11 rounded-xl bg-[#97144D]/10 hover:bg-[#97144D]/20 text-[#97144D] dark:text-[#FFDF85] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-[#97144D]/30 cursor-pointer active-press"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reschedule</span>
            </button>
          </div>

          <div className="pt-1">
            <button
              onClick={() => setActionSheetType('cancel')}
              className="w-full h-11 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-[#C62828] dark:text-rose-300 hover:bg-rose-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer active-press"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancel Reservation</span>
            </button>
          </div>

          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={() => setShowPolicyModal(true)}
              className="text-xs text-[#6B5B68] dark:text-[#A898A4] hover:text-[#97144D] underline cursor-pointer"
            >
              View cancellation and reschedule charges policy
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Security Instructions & Governance */}
      <div className="mx-4 p-4 bg-white dark:bg-[#221019] rounded-2xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] shadow-sm space-y-3 text-xs">
        <h3 className="font-extrabold text-sm text-[#1F1420] dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#97144D] dark:text-[#FFDF85]" />
          <span>Strongroom Protocol & Statutory Instructions</span>
        </h3>

        <div className="space-y-2.5 text-[#6B5B68] dark:text-[#A898A4] leading-relaxed">
          <div className="flex items-start gap-2.5 p-2.5 bg-[#FAF6F8] dark:bg-[#2E1624] rounded-xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
            <UserCheck className="w-4 h-4 text-[#1E8E5A] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#1F1420] dark:text-white block font-bold">Government Photo ID Required:</strong>
              Original Aadhaar Card, Passport, or PAN must be carried by all entrants for biometric physical cross-check.
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 bg-[#FAF6F8] dark:bg-[#2E1624] rounded-xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
            <Lock className="w-4 h-4 text-[#97144D] dark:text-[#FFDF85] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#1F1420] dark:text-white block font-bold">Dual-Key Operation:</strong>
              Your physical key and the custodian master key must be inserted simultaneously to unlock the safe compartment.
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Privacy & Non-Disclosure:</strong>
              Under Reserve Bank of India statutory regulations, bank officers do NOT know or inspect locker contents. Complete confidentiality is guaranteed.
            </div>
          </div>
        </div>
      </div>

      {/* POLICY SLAB MODAL */}
      {showPolicyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#221019] rounded-3xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] max-w-sm w-full p-5 space-y-4 shadow-2xl text-xs max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
              <h3 className="text-base font-extrabold text-[#1F1420] dark:text-white">
                Visit Booking Policy
              </h3>
              <button
                type="button"
                onClick={() => setShowPolicyModal(false)}
                className="p-1 rounded-lg text-[#6B5B68] hover:bg-black/5"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] font-bold uppercase tracking-wider text-[#97144D] dark:text-[#FFDF85]">
              Charges as per bank policy (demo values)
            </p>

            <div className="space-y-3">
              <div>
                <h4 className="font-bold text-[#1F1420] dark:text-white mb-1.5 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Cancellation Slabs</span>
                </h4>
                <div className="space-y-1.5">
                  {CANCELLATION_POLICY.slabs.map(s => (
                    <div key={s.id} className="p-2 bg-[#FAF6F8] dark:bg-[#2E1624] rounded-xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] flex justify-between">
                      <div>
                        <span className="font-bold text-[#1F1420] dark:text-white block">{s.label}</span>
                        <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4]">{s.notes}</span>
                      </div>
                      <span className="font-mono font-extrabold text-[#97144D] dark:text-[#FFDF85]">
                        {s.baseCharge === 0 ? 'FREE' : `₹${s.baseCharge} + GST`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#1F1420] dark:text-white mb-1.5 flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-[#97144D]" />
                  <span>Reschedule Slabs (Max 2 Allowed)</span>
                </h4>
                <div className="space-y-1.5">
                  {RESCHEDULE_POLICY.slabs.map(s => (
                    <div key={s.id} className="p-2 bg-[#FAF6F8] dark:bg-[#2E1624] rounded-xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] flex justify-between">
                      <div>
                        <span className="font-bold text-[#1F1420] dark:text-white block">{s.label}</span>
                        <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4]">{s.notes}</span>
                      </div>
                      <span className="font-mono font-extrabold text-[#97144D] dark:text-[#FFDF85]">
                        {s.baseCharge === 0 ? 'FREE' : `₹${s.baseCharge} + GST`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPolicyModal(false)}
              className="w-full h-11 bg-[#97144D] text-white font-bold rounded-xl text-xs"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* CHARGES SUMMARY BOTTOM SHEET (CANCEL / RESCHEDULE) */}
      {actionSheetType && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#221019] rounded-t-3xl sm:rounded-3xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] max-w-sm w-full p-5 space-y-4 shadow-2xl text-xs animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
              <div>
                <h3 className="text-base font-extrabold text-[#1F1420] dark:text-white">
                  {actionSheetType === 'cancel' ? 'Confirm Cancellation' : 'Confirm Reschedule'}
                </h3>
                <span className="text-[10px] font-bold text-[#97144D] dark:text-[#FFDF85] uppercase">
                  Charges as per bank policy (demo values)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActionSheetType(null)}
                className="p-1.5 rounded-lg text-[#6B5B68] hover:bg-black/5"
              >
                ✕
              </button>
            </div>

            {/* Charges Breakdown Table */}
            {(() => {
              const fee = actionSheetType === 'cancel' ? cancelFee : rescheduleFee;
              return (
                <div className="space-y-3">
                  <div className="p-3 bg-[#FAF6F8] dark:bg-[#2E1624] rounded-2xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#6B5B68] dark:text-[#A898A4]">Appointment Slot:</span>
                      <span className="font-bold font-mono text-[#1F1420] dark:text-white">{currentApt.date} · {currentApt.timeSlot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B5B68] dark:text-[#A898A4]">Hours Remaining:</span>
                      <span className="font-bold font-mono text-[#1F1420] dark:text-white">{fee.hoursRemaining} hrs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B5B68] dark:text-[#A898A4]">Applied Slab:</span>
                      <span className="font-bold text-[#97144D] dark:text-[#FFDF85] text-right">{fee.slabLabel}</span>
                    </div>
                    <div className="pt-2 border-t border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[#6B5B68] dark:text-[#A898A4]">Base Fee:</span>
                        <span className="font-mono text-[#1F1420] dark:text-white">₹{fee.baseCharge}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6B5B68] dark:text-[#A898A4]">GST (18%):</span>
                        <span className="font-mono text-[#1F1420] dark:text-white">₹{fee.gstAmount}</span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] font-extrabold text-sm">
                        <span className="text-[#1F1420] dark:text-white">Total Deductible:</span>
                        <span className="font-mono text-base text-[#97144D] dark:text-[#FFDF85]">₹{fee.totalCharge}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl text-amber-900 dark:text-amber-200">
                    <CreditCard className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Debited from linked Premier Savings account (XXXX 1720) with OTP step-up verification.</span>
                  </div>

                  {!fee.isAllowed && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-xl text-rose-700 dark:text-rose-300">
                      <strong>Action Not Permitted:</strong> {fee.reasonDisallowed}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActionSheetType(null)}
                      className="h-11 rounded-xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] font-bold text-[#1F1420] dark:text-white hover:bg-black/5"
                    >
                      Keep Booking
                    </button>
                    <button
                      type="button"
                      disabled={!fee.isAllowed}
                      onClick={actionSheetType === 'cancel' ? confirmCancellation : confirmReschedule}
                      className="h-11 rounded-xl bg-[#97144D] hover:bg-[#6B0E37] disabled:opacity-50 text-white font-bold shadow-md cursor-pointer"
                    >
                      {actionSheetType === 'cancel' ? 'Confirm Cancel' : 'Confirm Reschedule'}
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

    </div>
  );
};
