import React, { useState, useEffect, useRef } from 'react';
import { useBanking } from '../../context/BankingContext';
import { useTheme } from '../../context/ThemeContext';
import { formatIndianCurrency, maskAccountNumber, formatDateTimeIN } from '../../utils/formatters';
import { Overline } from '../common/Overline';
import { StatusPill } from '../common/StatusPill';
import { Chip } from '../common/Chip';
import {
  Eye,
  EyeOff,
  RefreshCw,
  CreditCard,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  FileText,
  Wallet,
  Sparkles,
  X,
  Plus,
  ArrowUpRight,
  Receipt,
  Lock,
  ChevronRight
} from 'lucide-react';

interface AccountOption {
  id: string;
  name: string;
  type: string;
  number: string;
  normalBalance: number;
  lowBalance: number;
}

const LINKED_ACCOUNTS: AccountOption[] = [
  {
    id: 'acc-1',
    name: 'Primary Savings',
    type: 'Savings Account',
    number: 'xxxx 1720',
    normalBalance: 284530.75,
    lowBalance: 3200.00
  },
  {
    id: 'acc-2',
    name: 'Wealth Salary',
    type: 'Salary Account',
    number: 'xxxx 8904',
    normalBalance: 915400.00,
    lowBalance: 915400.00
  }
];

// Mock 30-day balance history for sparkline (in ₹ thousands)
const SPARKLINE_POINTS = [
  260, 262, 258, 265, 270, 268, 275, 272, 280, 278,
  282, 280, 285, 281, 283, 286, 282, 285, 287, 284.5
];

// Last 5 locker debits for Statement modal
const MOCK_STATEMENT_DEBITS = [
  {
    id: 'stmt-1',
    date: '15 Jan 2026',
    desc: 'Annual Locker Rent FY 2025-26 (Safe #A-125)',
    ref: 'TXN-SV-90281720',
    method: 'Auto-Debit (CBS)',
    amount: 5310,
    type: 'debit'
  },
  {
    id: 'stmt-2',
    date: '28 Oct 2025',
    desc: 'Custody Operations & Lock Inspection Fee',
    ref: 'TXN-SV-88412901',
    method: 'Net Banking',
    amount: 2200,
    type: 'debit'
  },
  {
    id: 'stmt-3',
    date: '15 Jan 2025',
    desc: 'Annual Locker Rent FY 2024-25 (Safe #A-125)',
    ref: 'TXN-SV-76120934',
    method: 'Auto-Debit (CBS)',
    amount: 5310,
    type: 'debit'
  },
  {
    id: 'stmt-4',
    date: '12 Oct 2024',
    desc: 'Fixed Deposit Security Deposit Lien Allocation',
    ref: 'LKR-SEC-DEP-0918',
    method: 'CBS Reserve',
    amount: 15000,
    type: 'deposit'
  },
  {
    id: 'stmt-5',
    date: '15 Jan 2024',
    desc: 'State Stamp Duty (SHCIL e-Stamp Prepaid)',
    ref: 'SHCIL-STMP-500',
    method: 'Online Portal',
    amount: 500,
    type: 'debit'
  }
];

export interface AvailableBalanceCardProps {
  onNavigateToPayments?: () => void;
  onNavigateToAutoDebit?: () => void;
}

export const AvailableBalanceCard: React.FC<AvailableBalanceCardProps> = ({
  onNavigateToPayments,
  onNavigateToAutoDebit
}) => {
  const { addAudit, lowBalanceDemoMode, toggleLowBalanceDemoMode, lockers } = useBanking();
  const { theme } = useTheme();

  const [selectedAccountId, setSelectedAccountId] = useState('acc-1');
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const [isStepUpOpen, setIsStepUpOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animatedBalance, setAnimatedBalance] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [hasError, setHasError] = useState(false);
  const [isStatementOpen, setIsStatementOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpSuccess, setTopUpSuccess] = useState(false);
  const [mpinInput, setMpinInput] = useState('');

  // 15-second countdown timer for auto-hide
  const [timeLeft, setTimeLeft] = useState(15);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeAccount = LINKED_ACCOUNTS.find(a => a.id === selectedAccountId) || LINKED_ACCOUNTS[0];
  const targetBalance = lowBalanceDemoMode ? activeAccount.lowBalance : activeAccount.normalBalance;

  // Rent calculation
  const primaryLocker = lockers[0];
  const baseRent = primaryLocker?.annualRent || 4500;
  const gstRent = Math.round(baseRent * 0.18);
  const nextRentDue = baseRent + gstRent; // 5,310
  const isSufficient = targetBalance >= nextRentDue;
  const shortfall = nextRentDue - targetBalance;

  // Auto-hide when visibility changes (background/lock screen) or theme changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        hideBalance();
      }
    };
    const handleWindowBlur = () => {
      hideBalance();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, []);

  // Auto-hide on theme changes
  useEffect(() => {
    hideBalance();
  }, [theme]);

  // Countdown timer logic
  useEffect(() => {
    if (isBalanceVisible) {
      setTimeLeft(15);
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            hideBalance();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isBalanceVisible]);

  const hideBalance = () => {
    setIsBalanceVisible(false);
    setIsLoading(false);
    setAnimatedBalance(0);
  };

  // Step-up verification (MPIN or Biometric)
  const handleAuthenticate = (method: 'biometric' | 'mpin') => {
    setIsStepUpOpen(false);
    setIsLoading(true);
    setHasError(false);

    // Mock 1.2s secure bank API fetch
    setTimeout(() => {
      setIsLoading(false);
      setIsBalanceVisible(true);
      setLastUpdated(formatDateTimeIN(new Date()));

      // Count-up animation
      const duration = 800; // ms
      const steps = 20;
      const stepDuration = duration / steps;
      let currentStep = 0;

      const countTimer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        // Ease-out expo
        const currentVal = targetBalance * (1 - Math.pow(2, -10 * progress));
        setAnimatedBalance(currentVal);

        if (currentStep >= steps) {
          clearInterval(countTimer);
          setAnimatedBalance(targetBalance);
        }
      }, stepDuration);

      // Audit log entry in memory
      addAudit(
        'Rahul Sharma',
        'Customer',
        'Balance Viewed',
        'Security',
        activeAccount.number,
        'Connaught Place',
        `${method === 'biometric' ? 'Biometric FaceID' : 'MPIN'} authenticated. In-memory available balance revealed for ${activeAccount.name}.`
      );
    }, 1200);
  };

  // Refresh balance with 1.2s loading shimmer
  const handleRefreshBalance = () => {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLastUpdated(formatDateTimeIN(new Date()));
      setTimeLeft(15);
    }, 1200);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6B0E37] via-[#7D1142] to-[#420822] text-white p-4 sm:p-5 shadow-lg border border-[#C9A24B]/35">
      
      {/* Subtle gold hairline and glass lighting effect */}
      <div className="absolute inset-0 bg-radial-[at_top_right] from-white/10 via-transparent to-transparent pointer-events-none" />

      {/* Countdown progress bar when balance is visible */}
      {isBalanceVisible && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FFDF85] to-[#C9A24B] transition-all duration-1000 ease-linear"
            style={{ width: `${(timeLeft / 15) * 100}%` }}
          />
        </div>
      )}

      <div className="relative space-y-3.5">
        
        {/* Top Row: Account Selector Chips & Security Lock */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {LINKED_ACCOUNTS.map(acc => {
              const isSelected = selectedAccountId === acc.id;
              return (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => {
                    setSelectedAccountId(acc.id);
                    if (isBalanceVisible) {
                      hideBalance();
                    }
                  }}
                  className={`h-7 px-2.5 rounded-full text-[11px] font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer select-none active-press ${
                    isSelected
                      ? 'bg-[#FFDF85] text-[#420822] shadow-xs font-bold'
                      : 'bg-white/10 text-white/85 hover:bg-white/20 border border-white/15'
                  }`}
                >
                  <CreditCard className="w-3 h-3" />
                  <span>{acc.name} ({acc.number})</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1">
            {/* Demo Low-Balance Toggle Button */}
            <button
              type="button"
              onClick={toggleLowBalanceDemoMode}
              title="Toggle Low Balance Simulation for QA"
              className={`h-6 px-2 rounded-full text-[10px] font-mono font-bold transition-all border ${
                lowBalanceDemoMode
                  ? 'bg-amber-400 text-amber-950 border-amber-300 shadow-xs'
                  : 'bg-white/10 text-white/70 border-white/20 hover:text-white'
              }`}
            >
              {lowBalanceDemoMode ? 'Demo: Low Balance' : 'Normal'}
            </button>

            {/* Manual Eye Toggle */}
            {isBalanceVisible && (
              <button
                type="button"
                onClick={hideBalance}
                title="Hide Balance"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/90 transition-colors"
              >
                <EyeOff className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Account Info and Overline */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFDF85]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.08em] text-[#FFDF85] font-bold">
                LINKED FOR RENT AUTO-DEBIT
              </span>
            </div>
            <p className="text-xs text-white/80 font-medium mt-0.5">
              {maskAccountNumber(activeAccount.number, activeAccount.type)}
            </p>
          </div>

          {isBalanceVisible && (
            <div className="text-right">
              <span className="text-[10px] text-white/70 font-mono block">
                Auto-hides in {timeLeft}s
              </span>
            </div>
          )}
        </div>

        {/* Balance Display Area */}
        <div className="bg-black/20 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 space-y-2">
          
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-white/70">
              Available Balance
            </span>

            {isBalanceVisible && !isLoading && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-white/60 tabular-nums">
                  As on {lastUpdated || 'Today, 12:44 PM'}
                </span>
                <button
                  type="button"
                  onClick={handleRefreshBalance}
                  title="Refresh Balance"
                  className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            )}
          </div>

          {/* Loading Shimmer State */}
          {isLoading ? (
            <div className="h-10 w-48 rounded-xl bg-white/20 animate-pulse" />
          ) : isBalanceVisible ? (
            /* Revealed Balance */
            <div className="flex items-baseline gap-2">
              <span className="text-display font-extrabold text-white tabular-nums tracking-tight">
                {formatIndianCurrency(animatedBalance, { showPaisa: true })}
              </span>
            </div>
          ) : (
            /* Hidden Balance by Default */
            <div className="flex items-center justify-between py-1">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-white/80 tracking-widest">
                ₹ ••,••,•••
              </span>

              <button
                type="button"
                onClick={() => setIsStepUpOpen(true)}
                className="h-9 px-3.5 rounded-xl bg-gradient-to-r from-[#FFDF85] to-[#C9A24B] text-[#420822] text-xs font-extrabold shadow-sm hover:brightness-105 transition-all flex items-center gap-1.5 cursor-pointer active-press"
              >
                <Fingerprint className="w-4 h-4 text-[#420822]" />
                <span>Check Balance</span>
              </button>
            </div>
          )}

          {/* Smart Rent Sufficiency Line */}
          {isBalanceVisible && !isLoading && (
            <div className={`p-2.5 rounded-xl text-xs flex items-center justify-between gap-2 border ${
              isSufficient
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-100'
                : 'bg-amber-500/20 border-amber-500/35 text-amber-100'
            }`}>
              <div className="flex items-center gap-2">
                {isSufficient ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
                )}
                <span className="text-[11px] leading-snug">
                  {isSufficient
                    ? `Enough for your next rent of ₹${nextRentDue.toLocaleString('en-IN')} (₹${baseRent.toLocaleString('en-IN')} + 18% GST) due 15 Jan 2027`
                    : `Rent shortfall of ₹${shortfall.toLocaleString('en-IN')} for next rent (₹${nextRentDue.toLocaleString('en-IN')}) due 15 Jan 2027`}
                </span>
              </div>

              {!isSufficient && (
                <button
                  type="button"
                  onClick={() => setIsTopUpOpen(true)}
                  className="h-6 px-2.5 bg-[#FFDF85] text-[#420822] rounded-lg text-[10px] font-bold shrink-0 hover:bg-white active-press"
                >
                  Top Up
                </button>
              )}
            </div>
          )}

          {/* 30-Day Sparkline (Shown when visible) */}
          {isBalanceVisible && !isLoading && (
            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-4">
              <div className="text-[10px] text-white/60">
                <span className="block font-medium">30-Day Trend</span>
                <span className="text-emerald-300 font-mono font-bold flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +₹24.5K
                </span>
              </div>

              {/* SVG Sparkline */}
              <div className="flex-1 max-w-[160px] h-6 flex items-center">
                <svg viewBox="0 0 100 24" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="balanceSparkGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FFDF85" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#FFDF85" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Smooth curve points */}
                  <path
                    d="M 0 18 Q 15 22, 30 14 T 60 10 T 85 8 T 100 4"
                    fill="none"
                    stroke="#FFDF85"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  {/* Pulse end dot */}
                  <circle cx="100" cy="4" r="3" fill="#FFDF85" />
                  <circle cx="100" cy="4" r="5" fill="#FFDF85" opacity="0.4" className="animate-ping" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* 3 Quick Action Buttons: Pay Rent | Auto-debit | Statement */}
        <div className="grid grid-cols-3 gap-2 pt-0.5">
          <button
            type="button"
            onClick={onNavigateToPayments}
            className="h-10 px-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active-press"
          >
            <CreditCard className="w-3.5 h-3.5 text-[#FFDF85]" />
            <span className="truncate">Pay Rent</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToAutoDebit || onNavigateToPayments}
            className="h-10 px-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active-press"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#FFDF85]" />
            <span className="truncate">Auto-Debit</span>
          </button>

          <button
            type="button"
            onClick={() => setIsStatementOpen(true)}
            className="h-10 px-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active-press"
          >
            <Receipt className="w-3.5 h-3.5 text-[#FFDF85]" />
            <span className="truncate">Statement</span>
          </button>
        </div>

      </div>

      {/* STEP-UP AUTHENTICATION SHEET (MPIN / BIOMETRIC) */}
      {isStepUpOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#20101D] text-[#1F1420] dark:text-[#F5ECF1] w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
            
            <div className="flex items-center justify-between border-b border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#97144D]/10 dark:bg-[#97144D]/25 flex items-center justify-center text-[#97144D] dark:text-[#FFDF85]">
                  <Fingerprint className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-h3 font-bold text-[#1F1420] dark:text-[#F5ECF1]">
                    Verify Identity
                  </h3>
                  <p className="text-[11px] text-[#6B5B68] dark:text-[#A898A4]">
                    SafeVault Security Step-Up
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsStepUpOpen(false)}
                className="p-1.5 text-[#6B5B68] hover:text-[#1F1420] dark:hover:text-[#F5ECF1] rounded-full hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#6B5B68] dark:text-[#A898A4] leading-relaxed">
              To reveal your available balance on <strong className="text-[#1F1420] dark:text-[#F5ECF1]">{activeAccount.name} ({activeAccount.number})</strong>, please authenticate with FaceID / Fingerprint or enter your 4-digit MPIN.
            </p>

            {/* Quick Biometric Button */}
            <button
              type="button"
              onClick={() => handleAuthenticate('biometric')}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#97144D] to-[#6B0E37] text-white font-bold text-xs shadow-sm hover:from-[#851144] hover:to-[#5E0C30] flex items-center justify-center gap-2 cursor-pointer active-press"
            >
              <Fingerprint className="w-5 h-5 text-[#FFDF85]" />
              <span>Authorize with Biometric (FaceID / TouchID)</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-[#6B5B68] dark:text-[#A898A4]">
              <div className="h-px bg-[#E8DFE5] dark:bg-white/10 flex-1" />
              <span>or enter 4-digit MPIN</span>
              <div className="h-px bg-[#E8DFE5] dark:bg-white/10 flex-1" />
            </div>

            {/* MPIN input */}
            <div className="space-y-3">
              <input
                type="password"
                maxLength={4}
                value={mpinInput}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '');
                  setMpinInput(val);
                  if (val.length === 4) {
                    handleAuthenticate('mpin');
                  }
                }}
                placeholder="••••"
                className="w-full h-11 text-center font-mono text-xl tracking-[0.5em] bg-[#FAF6F8] dark:bg-[#2A1220] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#97144D]"
              />

              <button
                type="button"
                disabled={mpinInput.length !== 4}
                onClick={() => handleAuthenticate('mpin')}
                className="w-full h-10 rounded-xl bg-[#FAF6F8] dark:bg-[#2A1220] hover:bg-[#E8DFE5] dark:hover:bg-[#341628] disabled:opacity-40 text-xs font-bold text-[#1F1420] dark:text-[#F5ECF1] transition-all cursor-pointer border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]"
              >
                Submit MPIN
              </button>
            </div>

          </div>
        </div>
      )}

      {/* RECENT LOCKER DEBITS STATEMENT MODAL */}
      {isStatementOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#20101D] text-[#1F1420] dark:text-[#F5ECF1] w-full max-w-md rounded-3xl p-5 space-y-4 shadow-2xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)] max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)] pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#97144D] dark:text-[#FFDF85]" />
                <div>
                  <h3 className="text-h3 font-bold text-[#1F1420] dark:text-[#F5ECF1]">
                    Locker Account Statement
                  </h3>
                  <p className="text-[11px] text-[#6B5B68] dark:text-[#A898A4]">
                    Last 5 SafeVault Locker Transactions
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsStatementOpen(false)}
                className="p-1.5 text-[#6B5B68] hover:text-[#1F1420] dark:hover:text-[#F5ECF1] rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {MOCK_STATEMENT_DEBITS.map(item => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-[#FAF6F8] dark:bg-[#2A1220] border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.06)] flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-[#1F1420] dark:text-[#F5ECF1] block leading-tight">
                      {item.desc}
                    </span>
                    <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4] font-mono mt-0.5 block">
                      {item.date} · {item.method}
                    </span>
                    <span className="text-[9px] font-mono text-white/50 block">
                      Ref: {item.ref}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`font-mono font-bold text-xs ${
                      item.type === 'deposit'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-[#C62828] dark:text-[#E5484D]'
                    }`}>
                      {item.type === 'deposit' ? '+' : '-'}{formatIndianCurrency(item.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsStatementOpen(false)}
              className="w-full h-11 bg-[#97144D] text-white font-bold rounded-xl text-xs active-press cursor-pointer"
            >
              Close Statement
            </button>
          </div>
        </div>
      )}

      {/* TOP-UP MODAL (SIMULATED INSTANT UPI/IMPS TRANSFER) */}
      {isTopUpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#20101D] text-[#1F1420] dark:text-[#F5ECF1] w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.12)]">
            
            <div className="flex items-center justify-between border-b border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)] pb-3">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#97144D] dark:text-[#FFDF85]" />
                <h3 className="text-h3 font-bold text-[#1F1420] dark:text-[#F5ECF1]">
                  Top Up Rent Account
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTopUpOpen(false)}
                className="p-1.5 text-[#6B5B68] hover:text-[#1F1420] dark:hover:text-[#F5ECF1] rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {topUpSuccess ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-800 dark:text-emerald-300 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="font-bold text-xs">Top Up Successful!</p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  ₹10,000 credited to {activeAccount.name} ({activeAccount.number}). Rent auto-debit requirement satisfied.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsTopUpOpen(false);
                    setTopUpSuccess(false);
                  }}
                  className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <p className="text-[#6B5B68] dark:text-[#A898A4]">
                  Transfer funds to <strong className="text-[#1F1420] dark:text-[#F5ECF1]">{activeAccount.name} ({activeAccount.number})</strong> to ensure uninterrupted automated rent execution on 15 Jan 2027.
                </p>

                <div className="p-3 bg-[#FAF6F8] dark:bg-[#2A1220] rounded-2xl border border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)] space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#6B5B68] dark:text-[#A898A4]">Next Rent Due:</span>
                    <span className="font-mono font-bold">₹{nextRentDue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B5B68] dark:text-[#A898A4]">Current Balance:</span>
                    <span className="font-mono font-bold text-amber-500">₹{targetBalance.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-[#E8DFE5] dark:border-[rgba(255,255,255,0.08)]">
                    <span className="font-bold">Recommended Transfer:</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">₹10,000.00</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setTopUpSuccess(true);
                  }}
                  className="w-full h-11 bg-[#97144D] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 active-press cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#FFDF85]" />
                  <span>Simulate Instant UPI Transfer (₹10,000)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
