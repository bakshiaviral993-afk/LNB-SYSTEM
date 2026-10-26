import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Shield,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Building2,
  AlertCircle,
  CheckCircle2,
  X,
  Info,
  Layers,
  FileCheck2,
  Check,
  Fingerprint,
  ChevronRight
} from 'lucide-react';
import { UserRole } from '../../types';

interface LoginPageProps {
  onLoginSuccess: (role: UserRole) => void;
  onBackToHome: () => void;
}

interface DemoPersona {
  role: UserRole;
  label: string;
  name: string;
  designation: string;
  username: string;
  defaultPass: string;
  badge: string;
  landingDesc: string;
}

const DEMO_PERSONAS: DemoPersona[] = [
  {
    role: 'customer',
    label: 'Customer',
    name: 'Rahul Sharma',
    designation: 'Premier Banking Hirer',
    username: 'CIF-9028192831',
    defaultPass: 'Pass@2026',
    badge: 'CUSTOMER',
    landingDesc: 'Customer Self-Service Dashboard'
  },
  {
    role: 'branch_maker',
    label: 'Branch Staff',
    name: 'Anil Kumar',
    designation: 'Operations Officer (Maker)',
    username: 'EMP-10492',
    defaultPass: 'Staff@Maker',
    badge: 'MAKER',
    landingDesc: 'Branch Operations Dashboard'
  },
  {
    role: 'branch_checker',
    label: 'Branch Manager',
    name: 'Priya Nair',
    designation: 'Senior Manager & Custodian',
    username: 'EMP-10381',
    defaultPass: 'Staff@Checker',
    badge: 'CHECKER',
    landingDesc: 'Branch Management & Approvals Dashboard'
  },
  {
    role: 'ho_admin',
    label: 'Administrator',
    name: 'Sunita Rao',
    designation: 'Head Office Admin',
    username: 'EMP-HO-001',
    defaultPass: 'Admin@HO2026',
    badge: 'HO ADMIN',
    landingDesc: 'Administration & Configuration Dashboard'
  },
  {
    role: 'auditor',
    label: 'Auditor',
    name: 'Rameshwar Patil',
    designation: 'Inspection Auditor',
    username: 'EMP-AUD-502',
    defaultPass: 'Audit@2026',
    badge: 'AUDITOR',
    landingDesc: 'Audit & Compliance Dashboard'
  }
];

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onBackToHome
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Selected test persona
  const [selectedPersona, setSelectedPersona] = useState<DemoPersona>(DEMO_PERSONAS[0]);

  // Form Fields
  const [username, setUsername] = useState(DEMO_PERSONAS[0].username);
  const [password, setPassword] = useState(DEMO_PERSONAS[0].defaultPass);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberCustomerId, setRememberCustomerId] = useState(true);

  // Flow State
  const [authStep, setAuthStep] = useState<'credentials' | 'otp' | 'success'>('credentials');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  // 6-digit OTP State & Input Refs
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(45);
  const [otpResent, setOtpResent] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // OTP Countdown Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (authStep === 'otp' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [authStep, otpTimer]);

  // Auto focus first OTP input when entering OTP step
  useEffect(() => {
    if (authStep === 'otp') {
      const timer = setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [authStep]);

  // Handle Persona Selection
  const handleSelectPersona = (p: DemoPersona) => {
    setSelectedPersona(p);
    setUsername(p.username);
    setPassword(p.defaultPass);
    setErrorMessage('');
    setOtpDigits(['', '', '', '', '', '']);
  };

  // Step 1: Submit Credentials
  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('Please enter your Customer ID or Username.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);

    // Subtle 450ms verification delay before proceeding to OTP verification
    setTimeout(() => {
      setIsSubmitting(false);
      setAuthStep('otp');
      setOtpTimer(45);
      setOtpDigits(['', '', '', '', '', '']);
    }, 450);
  };

  // OTP Input Changes with Auto-Progression
  const handleOtpDigitChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];

    if (!cleanVal) {
      newDigits[index] = '';
      setOtpDigits(newDigits);
      return;
    }

    // Take the last entered character if multiple typed
    const char = cleanVal.slice(-1);
    newDigits[index] = char;
    setOtpDigits(newDigits);
    setErrorMessage('');

    // Move to next input box if available
    if (index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace navigation across OTP boxes
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Pasting full 6-digit code
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedText) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pastedText[i] || '';
    }
    setOtpDigits(newDigits);
    setErrorMessage('');

    // Focus last filled or 6th input
    const focusIndex = Math.min(pastedText.length, 5);
    otpInputRefs.current[focusIndex]?.focus();
  };

  // Convenience quick-fill for demo code 123456
  const fillDemoOtp = () => {
    setOtpDigits(['1', '2', '3', '4', '5', '6']);
    setErrorMessage('');
    otpInputRefs.current[5]?.focus();
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otpDigits.join('');
    setErrorMessage('');

    if (enteredCode.length < 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    // Validation for demo: accepts 123456 or pre-filled simulation
    if (enteredCode !== '123456') {
      setErrorMessage('Invalid simulated OTP code. Please use the simulated demo code: 123456.');
      return;
    }

    setIsSubmitting(true);

    // Show smooth verification and success feedback
    setTimeout(() => {
      setIsSubmitting(false);
      setAuthStep('success');

      // Seamless transfer to role-based dashboard
      setTimeout(() => {
        onLoginSuccess(selectedPersona.role);
      }, 700);
    }, 500);
  };

  // Resend OTP simulation
  const handleResendOtp = () => {
    setOtpTimer(45);
    setOtpResent(true);
    setErrorMessage('');
    setOtpDigits(['', '', '', '', '', '']);
    setTimeout(() => {
      setOtpResent(false);
      otpInputRefs.current[0]?.focus();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#17263C] flex flex-col font-sans selection:bg-[#102544] selection:text-white">
      {/* Top Banking Institutional Bar */}
      <header className="bg-white border-b border-[#E3E8F0] px-4 sm:px-8 py-3 flex items-center justify-between shrink-0 shadow-[0_1px_3px_rgba(11,23,48,0.03)] z-20">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#66758C] hover:text-[#102544] transition-colors cursor-pointer group"
          title="Return to National Bank SafeVault Homepage"
        >
          <ArrowLeft className="w-4 h-4 text-[#008C88] group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2.5 text-xs font-medium text-[#66758C]">
          <ShieldCheck className="w-4 h-4 text-[#008C88]" />
          <span className="font-semibold text-[#102544]">National Bank</span>
          <span className="text-slate-300">|</span>
          <span className="hidden sm:inline">SafeVault Secure Identity Gateway</span>
          <span className="hidden md:inline text-slate-300">|</span>
          <span className="hidden md:inline font-mono text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
            256-Bit SSL Encrypted
          </span>
        </div>
      </header>

      {/* Main Split-Screen Layout */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* ============================================================ */}
        {/* LEFT PANEL: Animated Banking Vault Experience & Security Brand */}
        {/* ============================================================ */}
        <div className="lg:w-1/2 bg-[#0B1730] text-white p-6 sm:p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden">
          {/* Slowly Moving Ambient Background Gradients */}
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    scale: [1, 1.15, 1],
                    opacity: [0.18, 0.28, 0.18],
                    x: [0, 20, 0],
                    y: [0, -15, 0]
                  }
            }
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-32 -left-32 w-[34rem] h-[34rem] bg-[#2457A7] rounded-full blur-[120px] pointer-events-none"
          />
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    scale: [1, 1.2, 1],
                    opacity: [0.14, 0.22, 0.14],
                    x: [0, -25, 0],
                    y: [0, 20, 0]
                  }
            }
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-32 -right-32 w-[34rem] h-[34rem] bg-[#008C88] rounded-full blur-[130px] pointer-events-none"
          />

          {/* Floating Subtle Ambient Particles */}
          {!shouldReduceMotion && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[
                { top: '15%', left: '20%', size: 4, delay: 0, dur: 7 },
                { top: '35%', left: '80%', size: 3, delay: 1.5, dur: 9 },
                { top: '65%', left: '15%', size: 5, delay: 3, dur: 8 },
                { top: '80%', left: '70%', size: 3, delay: 0.8, dur: 10 },
                { top: '25%', left: '55%', size: 4, delay: 2.2, dur: 6.5 }
              ].map((p, idx) => (
                <motion.div
                  key={idx}
                  animate={{
                    y: [0, -28, 0],
                    opacity: [0.2, 0.6, 0.2]
                  }}
                  transition={{
                    duration: p.dur,
                    delay: p.delay,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  style={{
                    position: 'absolute',
                    top: p.top,
                    left: p.left,
                    width: p.size,
                    height: p.size
                  }}
                  className="rounded-full bg-[#008C88]/70 shadow-[0_0_8px_#008C88]"
                />
              ))}
            </div>
          )}

          {/* Top Brand Lockup: National Bank · SafeVault */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative z-10 space-y-3"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#102544] to-[#0B1730] flex items-center justify-center text-white border border-[#2457A7]/40 shadow-lg shadow-black/30">
                <Shield className="w-6 h-6 text-[#008C88]" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-tight block">
                  National Bank
                </span>
                <span className="text-xs font-semibold text-[#008C88] tracking-wider uppercase">
                  SafeVault
                </span>
              </div>
            </div>

            <p className="text-xs font-bold text-slate-300 tracking-wide uppercase">
              Your Valuables. Our Priority.
            </p>
          </motion.div>

          {/* Center Graphic: 3D-Inspired Animated Vault & Core Copy */}
          <div className="relative z-10 py-6 sm:py-8 lg:py-10 space-y-6">
            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
              className="text-sm text-slate-300 font-normal leading-relaxed max-w-lg"
            >
              Experience secure, convenient and intelligent locker management through one seamless digital banking platform.
            </motion.p>

            {/* 3D-Inspired Animated Vault Chamber */}
            <motion.div
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
              className="relative max-w-md mx-auto lg:mx-0 p-6 sm:p-7 rounded-2xl bg-[#102544]/75 border border-[#2457A7]/30 shadow-2xl backdrop-blur-md overflow-hidden group"
            >
              {/* Soft Metallic Sheen Sweep */}
              <motion.div
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        x: ['-120%', '220%']
                      }
                }
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatDelay: 5,
                  ease: 'easeInOut'
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent skew-x-12 pointer-events-none"
              />

              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* SVG 3D Vault Door with Rotating Combination Dial */}
                <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                  {/* Outer Steel Bezel Ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-400 via-slate-700 to-slate-900 p-1 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_8px_20px_rgba(0,0,0,0.6)]">
                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#0F1E36] via-[#152B4D] to-[#0B1730] flex items-center justify-center border border-white/10 relative">
                      {/* Heavy Steel Perimeter Bolts */}
                      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                        <div
                          key={angle}
                          style={{
                            transform: `rotate(${angle}deg) translate(0, -56px)`
                          }}
                          className="absolute w-2 h-2 rounded-full bg-slate-300 border border-slate-600 shadow-[inset_0_1px_1px_white,0_1px_2px_black]"
                        />
                      ))}

                      {/* 4 Heavy Steel Radial Locking Bolts (Extended) */}
                      <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 opacity-80" />
                      <div className="absolute inset-y-0 w-1.5 bg-gradient-to-b from-slate-400 via-slate-200 to-slate-400 opacity-80" />

                      {/* Rotating Combination Dial */}
                      <motion.div
                        animate={
                          shouldReduceMotion
                            ? {}
                            : {
                                rotate: [0, 48, -25, 15, 0]
                              }
                        }
                        transition={{
                          duration: 4,
                          delay: 0.6,
                          ease: 'easeInOut'
                        }}
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-200 via-slate-400 to-slate-600 p-1 shadow-[0_4px_12px_rgba(0,0,0,0.6)] flex items-center justify-center relative cursor-default"
                      >
                        {/* Dial Calibration Ring with Hashmarks */}
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-[#102544] to-[#0B1730] flex items-center justify-center border border-slate-400/40 relative">
                          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                            <div
                              key={deg}
                              style={{ transform: `rotate(${deg}deg) translate(0, -30px)` }}
                              className="absolute w-0.5 h-1.5 bg-slate-300/80"
                            />
                          ))}

                          {/* 12 O'Clock Precision Alignment Marker */}
                          <div className="absolute -top-1 w-1.5 h-2 bg-[#008C88] rounded-t-xs shadow-[0_0_6px_#008C88]" />

                          {/* Center Steel Handle Wheel / Crest */}
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-300 via-slate-100 to-slate-400 shadow-md flex items-center justify-center border border-white">
                            <Lock className="w-4 h-4 text-[#102544]" />
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Heavy Steel Hinges on Left Side */}
                  <div className="absolute -left-2 top-6 w-2.5 h-6 rounded-l-md bg-gradient-to-b from-slate-400 via-slate-200 to-slate-600 border border-slate-700 shadow-md" />
                  <div className="absolute -left-2 bottom-6 w-2.5 h-6 rounded-l-md bg-gradient-to-b from-slate-400 via-slate-200 to-slate-600 border border-slate-700 shadow-md" />
                </div>

                {/* Vault State & Security Architecture Metrics */}
                <div className="space-y-3 text-left flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#008C88]" />
                      Strongroom Vault #01
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-[10px] font-bold">
                      ARMED
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-[10px] text-slate-400 block font-medium">Custody Mode</span>
                      <span className="font-bold text-white text-[11px] truncate block">Dual-Key Protocol</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-[10px] text-slate-400 block font-medium">Verification</span>
                      <span className="font-bold text-white text-[11px] truncate block">2FA Biometric</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-300 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#008C88] shrink-0" />
                    <span>Section 45ZC-ZF Statutory Compliance</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Subtle Value Pillar Indicators */}
            <div className="grid grid-cols-3 gap-2.5 max-w-md pt-2">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                <span className="text-[10px] font-bold text-slate-300 block">Secure Access</span>
                <span className="text-[10px] text-slate-400">256-Bit SSL Gateway</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                <span className="text-[10px] font-bold text-slate-300 block">Digital Services</span>
                <span className="text-[10px] text-slate-400">Visits, Rent, Nominees</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                <span className="text-[10px] font-bold text-slate-300 block">Convenience</span>
                <span className="text-[10px] text-slate-400">Anywhere 24/7 Portal</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Assurance Note */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300">National Bank SafeVault Core</span>
            <span className="font-mono text-[10px]">RBI Master Circular Compliant</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT PANEL: Secure White Login & OTP Verification Panel      */}
        {/* ============================================================ */}
        <div className="lg:w-1/2 p-6 sm:p-10 lg:p-14 flex flex-col justify-center bg-white overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-md w-full mx-auto space-y-6 text-left"
          >
            {/* Header Lockup */}
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102544] tracking-tight">
                Welcome Back
              </h1>
              <p className="text-xs sm:text-sm text-[#66758C]">
                Sign in to your SafeVault account.
              </p>
            </div>

            {/* Quick Demo Persona Switcher (Explicitly Labeled "Demo Only") */}
            <div className="p-3.5 bg-[#F5F7FA] rounded-2xl border border-[#E3E8F0] space-y-2.5">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 font-bold text-[#102544]">
                  <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 text-[9px] font-mono font-bold">
                    DEMO ONLY
                  </span>
                  <span>Select Test Persona to Auto-Fill:</span>
                </div>
                <span className="text-[10px] font-mono font-semibold text-[#2457A7] truncate max-w-[130px]">
                  {selectedPersona.name}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {DEMO_PERSONAS.map(p => {
                  const isSelected = selectedPersona.role === p.role;
                  return (
                    <button
                      key={p.role}
                      type="button"
                      onClick={() => handleSelectPersona(p)}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#102544] text-white border-[#102544] shadow-xs'
                          : 'bg-white text-[#17263C] border-[#E3E8F0] hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-[11px] font-bold leading-tight truncate">
                        {p.label}
                      </div>
                      <div className="text-[9px] opacity-75 font-mono truncate">
                        {p.badge}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="text-[10px] text-[#66758C] pt-1 border-t border-[#E3E8F0]/80">
                Destination Dashboard: <strong className="text-[#102544]">{selectedPersona.landingDesc}</strong>
              </div>
            </div>

            {/* Error Message Display */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-[#C83E44]/10 border border-[#C83E44]/30 text-[#C83E44] text-xs flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="leading-snug">{errorMessage}</span>
              </motion.div>
            )}

            {/* Animate Transitions between Steps */}
            <AnimatePresence mode="wait">
              {/* STEP 1: CREDENTIALS FORM */}
              {authStep === 'credentials' && (
                <motion.form
                  key="credentials-form"
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -12 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  onSubmit={handleCredentialsSubmit}
                  className="space-y-4"
                >
                  {/* Customer ID / Username Field */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#17263C]">
                      Customer ID / Username
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#66758C] group-focus-within:text-[#2457A7] transition-colors">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={username}
                        onChange={e => {
                          setUsername(e.target.value);
                          setErrorMessage('');
                        }}
                        placeholder="e.g. CIF-9028192831 or EMP-10492"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#F5F7FA] border border-[#E3E8F0] rounded-xl text-xs font-medium text-[#102544] placeholder-[#66758C]/60 focus:outline-none focus:border-[#2457A7] focus:bg-white focus:ring-3 focus:ring-[#2457A7]/10 transition-all font-mono"
                      />
                    </div>
                  </div>

                  {/* Password Field with Show/Hide Toggle */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-bold text-[#17263C]">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgotPasswordModal(true)}
                        className="text-[11px] font-semibold text-[#2457A7] hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#66758C] group-focus-within:text-[#2457A7] transition-colors">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => {
                          setPassword(e.target.value);
                          setErrorMessage('');
                        }}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-2.5 bg-[#F5F7FA] border border-[#E3E8F0] rounded-xl text-xs font-medium text-[#102544] placeholder-[#66758C]/60 focus:outline-none focus:border-[#2457A7] focus:bg-white focus:ring-3 focus:ring-[#2457A7]/10 transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#66758C] hover:text-[#17263C] cursor-pointer"
                        title={showPassword ? 'Hide Password' : 'Show Password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Customer ID Checkbox */}
                  <div className="pt-1 flex items-center justify-between text-xs">
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberCustomerId}
                        onChange={e => setRememberCustomerId(e.target.checked)}
                        className="w-4 h-4 rounded border-[#E3E8F0] text-[#102544] focus:ring-[#2457A7] cursor-pointer"
                      />
                      <span className="text-[#17263C] font-medium text-xs">
                        Remember Customer ID
                      </span>
                    </label>
                  </div>

                  {/* Primary Secure Sign In Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-3 rounded-xl bg-[#102544] hover:bg-[#0B1730] text-white text-xs font-bold tracking-wide uppercase shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-98"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span>Validating Credentials...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4 text-[#008C88]" />
                        <span>Secure Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}

              {/* STEP 2: INTERACTIVE 6-DIGIT OTP AUTHENTICATION */}
              {authStep === 'otp' && (
                <motion.form
                  key="otp-form"
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -12 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  onSubmit={handleVerifyOtp}
                  className="space-y-4"
                >
                  {/* Simulation Information Banner */}
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-left space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-amber-700" />
                        Two-Factor Authentication
                      </span>
                      <span className="text-[9px] font-mono bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                        DEMO ONLY
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Enter the 6-digit simulated OTP sent to your registered mobile ending in ••88. For evaluation, use simulated code <code className="font-mono font-bold bg-amber-100 px-1 rounded text-amber-900">123456</code>.
                    </p>
                  </div>

                  {/* 6 Individual Digit Inputs with Automatic Focus Progression & Paste */}
                  <div className="space-y-2 text-center">
                    <label className="block text-xs font-bold text-[#17263C]">
                      Enter 6-Digit Verification Code
                    </label>

                    <div className="flex justify-center items-center gap-2 sm:gap-2.5 py-2">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={el => { otpInputRefs.current[idx] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={e => handleOtpDigitChange(idx, e.target.value)}
                          onKeyDown={e => handleOtpKeyDown(idx, e)}
                          onPaste={idx === 0 ? handleOtpPaste : undefined}
                          className={`w-10 sm:w-12 h-12 text-center text-xl font-mono font-extrabold rounded-xl border transition-all ${
                            digit
                              ? 'bg-white border-[#2457A7] text-[#102544] ring-2 ring-[#2457A7]/15 shadow-xs'
                              : 'bg-[#F5F7FA] border-[#E3E8F0] text-[#17263C] focus:bg-white focus:border-[#2457A7] focus:ring-2 focus:ring-[#2457A7]/20'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Quick Demo Helper */}
                    <div className="pt-1 flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={fillDemoOtp}
                        className="text-[11px] font-semibold text-[#008C88] hover:text-[#00706D] hover:underline cursor-pointer inline-flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Auto-Fill Demo Code (123456)</span>
                      </button>
                    </div>
                  </div>

                  {/* Back to Credentials & Resend Countdown Controls */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-[#E3E8F0]/80">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthStep('credentials');
                        setErrorMessage('');
                      }}
                      className="text-[#66758C] hover:text-[#102544] font-semibold text-[11px] cursor-pointer flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back to Credentials
                    </button>

                    <div className="text-[11px] text-[#66758C]">
                      {otpResent ? (
                        <span className="text-[#008C88] font-bold">New code sent!</span>
                      ) : otpTimer > 0 ? (
                        <span>Resend in <strong className="font-mono text-[#102544]">{otpTimer}s</strong></span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          className="text-[#2457A7] font-bold hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Verify & Enter SafeVault Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-[#008C88] hover:bg-[#007A76] text-white text-xs font-bold tracking-wide uppercase shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-98"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span>Verifying Security Code...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify &amp; Enter Dashboard</span>
                      </>
                    )}
                  </button>
                </motion.form>
              )}

              {/* STEP 3: ANIMATED SUCCESS STATE */}
              {authStep === 'success' && (
                <motion.div
                  key="success-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="py-8 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md border border-emerald-200">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-[#102544]">
                      Authentication Successful
                    </h3>
                    <p className="text-xs text-[#66758C]">
                      Security clearance confirmed for <strong className="text-[#102544]">{selectedPersona.name}</strong>.
                    </p>
                  </div>

                  <div className="p-3 bg-[#F5F7FA] rounded-xl border border-[#E3E8F0] text-xs font-mono text-[#008C88] font-semibold flex items-center justify-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-[#008C88] border-t-transparent rounded-full animate-spin" />
                    <span>Decrypting Vault Session · Entering Portal...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Back to Home Link & Enterprise Copyright Footer */}
            <div className="pt-4 border-t border-[#E3E8F0] space-y-3 text-center">
              <div>
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="text-xs font-semibold text-[#2457A7] hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  <span>&larr; Back to Home</span>
                </button>
              </div>

              <div className="text-[11px] text-[#66758C] font-medium">
                © National Bank | SafeVault Digital Locker Services
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Institutional Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1730]/75 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E3E8F0] max-w-md w-full p-6 space-y-4 text-xs text-[#17263C]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3E8F0]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#2457A7]/10 text-[#2457A7] flex items-center justify-center">
                  <Info className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-[#102544]">Password Reset Guidance</h3>
              </div>
              <button
                onClick={() => setShowForgotPasswordModal(false)}
                className="text-[#66758C] hover:text-[#17263C] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 leading-relaxed text-[#66758C]">
              <p>
                To reset your National Bank SafeVault password or retrieve your registered Customer ID (CIF):
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[#17263C] font-medium">
                <li>Log in to your National Bank Retail NetBanking portal under <strong>Services &gt; SafeVault Locker Credentials</strong>.</li>
                <li>Visit your home branch with your original photo identity proof.</li>
                <li>Contact the Custodian Helpline at <strong className="text-[#102544]">1800-425-9922</strong> for automated IVR reset instructions.</li>
              </ul>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                <strong>Demo Mode:</strong> You can click any of the persona buttons at the top of the login card to auto-fill verified credentials.
              </div>
            </div>

            <button
              onClick={() => setShowForgotPasswordModal(false)}
              className="w-full py-2.5 bg-[#102544] hover:bg-[#0B1730] text-white font-bold rounded-xl transition-colors cursor-pointer"
            >
              Understood, Return to Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
