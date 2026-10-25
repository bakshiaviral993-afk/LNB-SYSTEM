import React, { useState, useEffect } from 'react';
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
  FileCheck2
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

  // Form State
  const [selectedPersona, setSelectedPersona] = useState<DemoPersona>(DEMO_PERSONAS[0]);
  const [username, setUsername] = useState(DEMO_PERSONAS[0].username);
  const [password, setPassword] = useState(DEMO_PERSONAS[0].defaultPass);
  const [showPassword, setShowPassword] = useState(false);
  const [requireMfa, setRequireMfa] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Authentication Flow State
  const [authStep, setAuthStep] = useState<'credentials' | 'otp'>('credentials');
  const [otpCode, setOtpCode] = useState('');
  const [otpTimer, setOtpTimer] = useState(45);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  // OTP Countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (authStep === 'otp' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [authStep, otpTimer]);

  const handleSelectPersona = (p: DemoPersona) => {
    setSelectedPersona(p);
    setUsername(p.username);
    setPassword(p.defaultPass);
    setErrorMessage('');
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('Please enter your registered Customer ID or Staff Username.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password or security passcode.');
      return;
    }

    setIsSubmitting(true);

    // Subtle authentication loading delay
    setTimeout(() => {
      setIsSubmitting(false);
      if (requireMfa) {
        setAuthStep('otp');
        setOtpCode('482910'); // Pre-fill mock OTP for frictionless evaluation
        setOtpTimer(45);
      } else {
        onLoginSuccess(selectedPersona.role);
      }
    }, 500);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (otpCode.length < 6) {
      setErrorMessage('Please enter the 6-digit simulated OTP code.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(selectedPersona.role);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#17263C] flex flex-col font-sans selection:bg-[#102544] selection:text-white">
      {/* Top Utility Bar */}
      <div className="bg-white border-b border-[#E3E8F0] px-4 sm:px-8 py-3 flex items-center justify-between shrink-0">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#66758C] hover:text-[#102544] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-[#008C88] group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-medium text-[#66758C]">
          <ShieldCheck className="w-4 h-4 text-[#16845B]" />
          <span>National Bank Secure Identity Gateway</span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="hidden sm:inline font-mono text-[11px]">256-Bit SSL</span>
        </div>
      </div>

      {/* Split-Screen Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Left Panel: Banking Vault Visual & Security Highlights */}
        <div className="lg:w-1/2 bg-[#0B1730] text-white p-8 lg:p-14 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Lighting Overlays */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#2457A7]/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#008C88]/20 rounded-full blur-[100px] pointer-events-none" />

          {/* Top Brand Lockup */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#102544] flex items-center justify-center text-white border border-[#2457A7]/40 shadow-xs">
                <Shield className="w-6 h-6 text-[#008C88]" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white leading-tight block">
                  National Bank
                </span>
                <span className="text-xs font-semibold text-slate-300 tracking-wider">
                  SafeVault Locker Portal
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 border border-white/15 text-[11px] font-mono font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              RBI Master Circular Compliant Gateway
            </div>
          </div>

          {/* Center Graphic & Heading */}
          <div className="relative z-10 py-10 lg:py-16 space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug">
                Secure Access. <br />
                <span className="text-[#008C88]">Complete Peace of Mind.</span>
              </h2>
              <p className="text-sm text-slate-300 font-normal leading-relaxed max-w-lg">
                Your authenticated portal for safe deposit locker reservations, visit passes, nominee covenants, and rent billing. Protected by bank-grade access security.
              </p>
            </div>

            {/* Visual Vault Compartment Display */}
            <div className="bg-[#102544]/80 rounded-2xl p-5 border border-white/10 backdrop-blur-xs space-y-3 shadow-bank-card max-w-md">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-[#008C88]" />
                  Active Strongroom Security State
                </span>
                <span className="text-emerald-400 font-mono text-[10px] font-bold">ARMED</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-slate-400 block">Mechanical</span>
                  <span className="font-bold text-white text-xs">Dual Key</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-slate-400 block">Identity</span>
                  <span className="font-bold text-white text-xs">2FA Bio</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-slate-400 block">Surveillance</span>
                  <span className="font-bold text-white text-xs">180d CCTV</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>&ldquo;Your Valuables. Our Priority.&rdquo;</span>
            <span className="font-mono">Section 45ZC-ZF Protected</span>
          </div>
        </div>

        {/* Right Panel: Split-Screen Authentication Form */}
        <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex flex-col justify-center bg-white overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md w-full mx-auto space-y-6 text-left"
          >
            {/* Header */}
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-[#102544] tracking-tight">
                Welcome Back
              </h2>
              <p className="text-xs text-[#66758C]">
                Sign in to your National Bank SafeVault account to continue.
              </p>
            </div>

            {/* Demo Persona Switcher (Clearly Labeled Demo Only) */}
            <div className="p-3.5 bg-[#F5F7FA] rounded-2xl border border-[#E3E8F0] space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 font-bold text-[#102544]">
                  <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 text-[9px] font-mono">
                    DEMO ONLY
                  </span>
                  <span>Select Test Persona to Auto-Fill:</span>
                </div>
                <span className="text-[10px] font-mono font-semibold text-[#2457A7]">
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
                          : 'bg-white text-[#17263C] border-[#E3E8F0] hover:bg-slate-100'
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
                Destination: <strong className="text-[#102544]">{selectedPersona.landingDesc}</strong>
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-[#C83E44]/10 border border-[#C83E44]/30 text-[#C83E44] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Step 1: Credentials Form */}
            {authStep === 'credentials' && (
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                {/* Username / Customer ID */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#17263C]">
                    Customer ID / Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#66758C]">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="e.g. CIF-9028192831 or EMP-10492"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#F5F7FA] border border-[#E3E8F0] rounded-xl text-xs font-medium text-[#102544] placeholder-[#66758C]/60 focus:outline-none focus:border-[#2457A7] focus:bg-white focus:ring-2 focus:ring-[#2457A7]/10 transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Password Field */}
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
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#66758C]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-[#F5F7FA] border border-[#E3E8F0] rounded-xl text-xs font-medium text-[#102544] placeholder-[#66758C]/60 focus:outline-none focus:border-[#2457A7] focus:bg-white focus:ring-2 focus:ring-[#2457A7]/10 transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#66758C] hover:text-[#17263C] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Simulated MFA / OTP Toggle */}
                <div className="pt-1 flex items-center justify-between text-xs">
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={requireMfa}
                      onChange={e => setRequireMfa(e.target.checked)}
                      className="w-4 h-4 rounded border-[#E3E8F0] text-[#008C88] focus:ring-[#008C88]"
                    />
                    <span className="text-[#008C88] font-bold text-[11px] flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5" />
                      Simulate 2-Factor OTP Verification
                    </span>
                  </label>
                </div>

                {/* Secure Sign In Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 rounded-xl bg-[#102544] hover:bg-[#0B1730] text-white text-xs font-bold tracking-wide uppercase shadow-bank-card hover:shadow-bank-dropdown transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-98"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Authenticating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4 text-[#008C88]" />
                      <span>Secure Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 2: Simulated OTP Verification */}
            {authStep === 'otp' && (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-left space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-amber-700" />
                      Simulated OTP Verification
                    </span>
                    <span className="text-[9px] font-mono bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                      SIMULATION ONLY
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    This is an explicitly labeled mock authentication step for demonstration purposes. It is not connected to actual cellular SMS or production banking systems.
                  </p>
                </div>

                <div className="space-y-2 text-center">
                  <label className="block text-xs font-bold text-[#17263C]">
                    Enter 6-Digit Simulated OTP Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    className="w-48 mx-auto text-center tracking-[0.4em] text-2xl font-mono font-bold bg-[#F5F7FA] border-2 border-[#2457A7] rounded-xl p-3 text-[#102544] focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#2457A7]/10"
                  />
                  <span className="block text-[11px] text-[#66758C]">
                    Demo OTP pre-filled: <code className="font-mono font-bold text-[#2457A7]">482910</code>
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setAuthStep('credentials')}
                    className="text-[#66758C] hover:text-[#102544] font-semibold text-[11px] cursor-pointer flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Credentials
                  </button>

                  <div className="text-[11px] text-[#66758C]">
                    {otpTimer > 0 ? (
                      <span>Resend in <strong className="font-mono text-[#102544]">{otpTimer}s</strong></span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setOtpTimer(45)}
                        className="text-[#2457A7] font-bold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Resend Code
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-[#008C88] hover:bg-[#007A76] text-white text-xs font-bold tracking-wide uppercase shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-98"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Verifying Simulated OTP...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify &amp; Enter Dashboard</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Back to Home Link */}
            <div className="pt-4 border-t border-[#E3E8F0] text-center">
              <button
                type="button"
                onClick={onBackToHome}
                className="text-xs font-semibold text-[#2457A7] hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <span>&larr; Back to National Bank SafeVault Home</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1730]/75 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-bank-dropdown border border-[#E3E8F0] max-w-md w-full p-6 space-y-4 text-xs text-[#17263C]">
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
