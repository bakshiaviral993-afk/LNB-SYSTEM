import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Shield,
  Lock,
  KeyRound,
  Search,
  Calendar,
  CreditCard,
  Users,
  FileCheck2,
  History,
  ArrowRight,
  ShieldCheck,
  Building2,
  ChevronRight,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  Layers,
  Clock,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { UserRole } from '../../types';

interface WelcomePageProps {
  onGetStarted: () => void;
  onExploreFeatures?: () => void;
  onQuickDemoLogin?: (role: UserRole) => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onGetStarted,
  onQuickDemoLogin
}) => {
  const shouldReduceMotion = useReducedMotion();

  const scrollToFeatures = () => {
    document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSecurity = () => {
    document.getElementById('security-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Motion variants
  const fadeInVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: (custom: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: shouldReduceMotion ? 0 : custom * 0.1,
        ease: 'easeOut' as const
      }
    })
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#17263C] flex flex-col font-sans selection:bg-[#102544] selection:text-white">
      {/* Top Banking Compliance Bar */}
      <div className="bg-[#0B1730] text-slate-300 text-[11px] py-2 px-4 sm:px-8 border-b border-[#102544]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[#008C88] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              RBI Regulated Scheduled Commercial Bank
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-slate-300">
              Model Locker Agreement (Form L-1) &amp; Safe Custody Compliance
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-[#008C88]" />
              Custodian Support: 1800-425-9922 (Toll-Free)
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline font-mono text-[10px]">256-Bit SSL Encrypted</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="bg-white border-b border-[#E3E8F0] sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Product Name */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex items-center gap-3.5 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-12 h-12 rounded-xl bg-[#102544] flex items-center justify-center text-white shadow-bank-card ring-1 ring-[#008C88]/30 relative overflow-hidden">
              <Shield className="w-6 h-6 text-[#008C88] relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0B1730] to-[#2457A7] opacity-60" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight text-[#102544] leading-tight">
                  National Bank
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#008C88]/10 text-[#008C88] border border-[#008C88]/20 tracking-wider">
                  SAFEVAULT
                </span>
              </div>
              <p className="text-xs text-[#66758C] font-medium leading-none mt-1">
                Your Valuables. Our Priority.
              </p>
            </div>
          </motion.div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#66758C]">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-[#102544] transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={scrollToFeatures}
              className="hover:text-[#102544] transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={scrollToSecurity}
              className="hover:text-[#102544] transition-colors cursor-pointer"
            >
              Security
            </button>
            <button
              onClick={scrollToContact}
              className="hover:text-[#102544] transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Action CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex items-center gap-3"
          >
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#102544] hover:bg-[#0B1730] text-white text-xs font-bold shadow-bank-card hover:shadow-bank-dropdown transition-all transform active:scale-98 cursor-pointer group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 text-[#008C88] group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </header>

      {/* Two-Column Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#F5F7FA] to-white border-b border-[#E3E8F0] pt-12 pb-16 lg:pt-16 lg:pb-24">
        {/* Subtle Ambient Lighting Effects */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-10 right-1/4 w-[450px] h-[450px] bg-[#2457A7]/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 left-1/4 w-[450px] h-[450px] bg-[#008C88]/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="lg:col-span-7 space-y-6 text-left"
            >
              {/* Product Badge */}
              <motion.div
                variants={fadeInVariants}
                custom={0}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#102544]/5 border border-[#102544]/15 text-[#102544] text-xs font-semibold"
              >
                <span className="w-2 h-2 rounded-full bg-[#008C88] animate-pulse" />
                <span>National Bank · SafeVault Locker System</span>
              </motion.div>

              {/* Headline */}
              <motion.div variants={fadeInVariants} custom={1} className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#102544] tracking-tight leading-[1.15]">
                  A Smarter, Safer Way to <br />
                  <span className="text-[#2457A7]">Manage Your Lockers.</span>
                </h1>
                <p className="text-base sm:text-lg text-[#66758C] font-medium leading-relaxed max-w-2xl">
                  Discover, reserve, and manage bank safe deposit lockers completely digitally.
                  From real-time vacancy mapping and instant visit appointment scheduling to paperless Form DA-1 nominations and automated rent payments — backed by RBI-mandated 100x statutory liability protection.
                </p>
              </motion.div>

              {/* Tagline Callout */}
              <motion.div
                variants={fadeInVariants}
                custom={2}
                className="flex items-center gap-3 text-xs font-semibold text-[#008C88] bg-[#008C88]/8 px-4 py-2.5 rounded-xl border border-[#008C88]/20 max-w-fit"
              >
                <Sparkles className="w-4 h-4 text-[#008C88]" />
                <span>&ldquo;Your Valuables. Our Priority.&rdquo;</span>
                <span className="text-slate-400">·</span>
                <span className="text-[#102544]">Dual-Key Physical &amp; Digital Custody</span>
              </motion.div>

              {/* Primary & Secondary Buttons */}
              <motion.div
                variants={fadeInVariants}
                custom={3}
                className="pt-2 flex flex-wrap items-center gap-4"
              >
                <button
                  onClick={onGetStarted}
                  className="px-6 py-3.5 rounded-xl bg-[#102544] hover:bg-[#0B1730] text-white text-sm font-bold shadow-bank-hero hover:shadow-bank-dropdown transition-all flex items-center gap-3 cursor-pointer group active:scale-98"
                >
                  <KeyRound className="w-4 h-4 text-[#008C88]" />
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1.5 transition-transform" />
                </button>

                <button
                  onClick={scrollToFeatures}
                  className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#17263C] border border-[#E3E8F0] text-sm font-bold shadow-xs hover:border-[#CBD5E1] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Features</span>
                  <ChevronRight className="w-4 h-4 text-[#66758C]" />
                </button>
              </motion.div>

              {/* Demo Persona Switcher (Clearly marked Demo Only) */}
              {onQuickDemoLogin && (
                <motion.div
                  variants={fadeInVariants}
                  custom={4}
                  className="pt-4 border-t border-[#E3E8F0] space-y-2"
                >
                  <div className="flex items-center gap-2 text-[11px] font-bold text-[#66758C] uppercase tracking-wider">
                    <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 text-[10px]">
                      DEMO ONLY
                    </span>
                    <span>Quick Evaluation Persona Jump:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => onQuickDemoLogin('customer')}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#2457A7]/10 text-[#2457A7] border border-[#E3E8F0] hover:border-[#2457A7]/30 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <Users className="w-3.5 h-3.5" />
                      Rahul Sharma (Customer)
                    </button>
                    <button
                      onClick={() => onQuickDemoLogin('branch_maker')}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#008C88]/10 text-[#008C88] border border-[#E3E8F0] hover:border-[#008C88]/30 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      Anil Kumar (Branch Staff / Maker)
                    </button>
                    <button
                      onClick={() => onQuickDemoLogin('branch_checker')}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#102544]/10 text-[#102544] border border-[#E3E8F0] hover:border-[#102544]/30 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      Priya Nair (Branch Manager / Checker)
                    </button>
                    <button
                      onClick={() => onQuickDemoLogin('ho_admin')}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-[#102544] border border-[#E3E8F0] text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      Sunita Rao (Administrator)
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Right Column: Premium Banking Vault 3D-Inspired Safe Deposit Locker Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="bg-[#102544] rounded-3xl p-6 sm:p-8 text-white shadow-bank-hero border border-[#2457A7]/40 relative overflow-hidden space-y-6">
                {/* Vault Lighting Accent */}
                <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#008C88]/25 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-[#2457A7]/25 rounded-full blur-3xl pointer-events-none" />

                {/* Top Vault Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#008C88] border border-white/10 shadow-xs">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white leading-tight">
                        SafeVault Strongroom Hub
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Tier-4 Physical &amp; Digital Vault
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#16845B]/20 text-emerald-300 border border-[#16845B]/40 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    ARMED &amp; MONITORED
                  </span>
                </div>

                {/* 3D-Inspired Safe Deposit Locker Graphic */}
                <div className="relative z-10 bg-[#0B1730] rounded-2xl p-5 border border-[#2457A7]/30 shadow-inner space-y-4">
                  {/* Visual Locker Grid */}
                  <div className="grid grid-cols-4 gap-2.5">
                    {[
                      { num: 'A-101', status: 'Allocated', color: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' },
                      { num: 'A-102', status: 'Allocated', color: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' },
                      { num: 'A-103', status: 'Vacant', color: 'bg-teal-500/20 border-teal-500/40 text-teal-300' },
                      { num: 'A-104', status: 'Allocated', color: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' },
                      { num: 'B-201', status: 'Vacant', color: 'bg-teal-500/20 border-teal-500/40 text-teal-300' },
                      { num: 'B-202', status: 'Allocated', color: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' },
                      { num: 'B-203', status: 'Under Maint.', color: 'bg-amber-500/20 border-amber-500/40 text-amber-300' },
                      { num: 'B-204', status: 'Active (You)', color: 'bg-[#2457A7]/50 border-sky-400 text-sky-200 ring-2 ring-sky-400/50' }
                    ].map(box => (
                      <div
                        key={box.num}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-transform hover:scale-105 ${box.color}`}
                      >
                        <div className="w-3 h-3 rounded-full border border-current flex items-center justify-center mb-1">
                          <div className="w-1 h-1 rounded-full bg-current" />
                        </div>
                        <span className="font-mono text-[10px] font-bold">{box.num}</span>
                        <span className="text-[8px] opacity-80 truncate">{box.status}</span>
                      </div>
                    ))}
                  </div>

                  {/* Dual Key Mechanism Illustration Strip */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-[#008C88]" />
                      Dual Tumbler: Hirer Key + Master Key
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">Section 45ZC</span>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3 text-xs relative z-10">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Statutory Cover</span>
                    <span className="font-bold text-white text-sm block">100x Annual Rent</span>
                    <span className="text-[10px] text-[#008C88]">RBI Safe Custody Rule</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Surveillance</span>
                    <span className="font-bold text-white text-sm block">180-Day Retention</span>
                    <span className="text-[10px] text-[#008C88]">Tamper-Proof CCTV</span>
                  </div>
                </div>

                {/* Action in Card */}
                <button
                  onClick={onGetStarted}
                  className="w-full py-3 rounded-xl bg-[#008C88] hover:bg-[#007A76] text-white font-bold text-xs tracking-wide uppercase transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer relative z-10"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Enter SafeVault Portal</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section id="features-section" className="py-16 sm:py-20 bg-white border-b border-[#E3E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#008C88] tracking-widest uppercase">
              Comprehensive Vault Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102544]">
              Six Pillars of Institutional Safe Custody
            </h2>
            <p className="text-sm text-[#66758C] leading-relaxed">
              Every workflow in National Bank SafeVault adheres strictly to the Reserve Bank of India Revised Safe Deposit Locker Directions (2021/2023).
            </p>
          </div>

          {/* 6 Feature Highlights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Find & Apply */}
            <div className="p-6 rounded-2xl border border-[#E3E8F0] bg-[#F5F7FA] hover:bg-white hover:border-[#2457A7]/40 hover:shadow-bank-card transition-all space-y-4 text-left group">
              <div className="w-12 h-12 rounded-xl bg-[#102544] text-[#008C88] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-[#102544]">
                  Find &amp; Apply for a Locker
                </h3>
                <p className="text-xs text-[#66758C] leading-relaxed">
                  Real-time branch vacancy grid across Small, Medium, Large, and Extra Large compartments. Transparent FIFO waitlist registration with automated SMS alerts.
                </p>
              </div>
              <div className="pt-2 border-t border-[#E3E8F0] flex items-center gap-1.5 text-[11px] font-semibold text-[#2457A7]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#008C88]" />
                <span>Zero Waitlist Opacity &middot; Instant Allotment</span>
              </div>
            </div>

            {/* Feature 2: Schedule Vault Visits */}
            <div className="p-6 rounded-2xl border border-[#E3E8F0] bg-[#F5F7FA] hover:bg-white hover:border-[#2457A7]/40 hover:shadow-bank-card transition-all space-y-4 text-left group">
              <div className="w-12 h-12 rounded-xl bg-[#102544] text-[#008C88] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-[#102544]">
                  Schedule Vault Visits
                </h3>
                <p className="text-xs text-[#66758C] leading-relaxed">
                  Book secure visit appointments with 30-minute time slots. Receive an encrypted QR Vault Pass token for rapid biometric check-in at the branch strongroom.
                </p>
              </div>
              <div className="pt-2 border-t border-[#E3E8F0] flex items-center gap-1.5 text-[11px] font-semibold text-[#2457A7]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#008C88]" />
                <span>QR Token Pass &middot; Zero Branch Queues</span>
              </div>
            </div>

            {/* Feature 3: Manage Rent & Payments */}
            <div className="p-6 rounded-2xl border border-[#E3E8F0] bg-[#F5F7FA] hover:bg-white hover:border-[#2457A7]/40 hover:shadow-bank-card transition-all space-y-4 text-left group">
              <div className="w-12 h-12 rounded-xl bg-[#102544] text-[#008C88] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-[#102544]">
                  Manage Rent &amp; Payments
                </h3>
                <p className="text-xs text-[#66758C] leading-relaxed">
                  Automated annual rent debits from your savings account. Transparent break-open caution deposit escrow, advance discounts, and downloadable GST tax invoices.
                </p>
              </div>
              <div className="pt-2 border-t border-[#E3E8F0] flex items-center gap-1.5 text-[11px] font-semibold text-[#2457A7]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#008C88]" />
                <span>Auto-Debit &middot; Instant Tax Receipts</span>
              </div>
            </div>

            {/* Feature 4: Agreements & Nominees */}
            <div className="p-6 rounded-2xl border border-[#E3E8F0] bg-[#F5F7FA] hover:bg-white hover:border-[#2457A7]/40 hover:shadow-bank-card transition-all space-y-4 text-left group">
              <div className="w-12 h-12 rounded-xl bg-[#102544] text-[#008C88] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-[#102544]">
                  Agreements &amp; Nominees
                </h3>
                <p className="text-xs text-[#66758C] leading-relaxed">
                  Digitally execute the revised Model Locker Agreement (Form L-1). Register and manage Form DA-1 nominees with legal survivor protection under Section 45ZA.
                </p>
              </div>
              <div className="pt-2 border-t border-[#E3E8F0] flex items-center gap-1.5 text-[11px] font-semibold text-[#2457A7]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#008C88]" />
                <span>Form DA-1 &middot; Legal Heir Protection</span>
              </div>
            </div>

            {/* Feature 5: Access History & Security */}
            <div className="p-6 rounded-2xl border border-[#E3E8F0] bg-[#F5F7FA] hover:bg-white hover:border-[#2457A7]/40 hover:shadow-bank-card transition-all space-y-4 text-left group">
              <div className="w-12 h-12 rounded-xl bg-[#102544] text-[#008C88] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <History className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-[#102544]">
                  Access History &amp; Security
                </h3>
                <p className="text-xs text-[#66758C] leading-relaxed">
                  Real-time SMS and email dispatch the millisecond your locker door is opened. Timestamped audit log with 180-day CCTV footage retention and one-click dispute desk.
                </p>
              </div>
              <div className="pt-2 border-t border-[#E3E8F0] flex items-center gap-1.5 text-[11px] font-semibold text-[#2457A7]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#008C88]" />
                <span>Real-Time SMS Alerts &middot; Dispute Desk</span>
              </div>
            </div>

            {/* Feature 6: Digital Service Requests */}
            <div className="p-6 rounded-2xl border border-[#E3E8F0] bg-[#F5F7FA] hover:bg-white hover:border-[#2457A7]/40 hover:shadow-bank-card transition-all space-y-4 text-left group">
              <div className="w-12 h-12 rounded-xl bg-[#102544] text-[#008C88] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-[#102544]">
                  Digital Service Requests
                </h3>
                <p className="text-xs text-[#66758C] leading-relaxed">
                  Online ticket lodging for key replacement, lock overhaul, mandate changes, and locker surrender. Track maker-checker progress with live SLA timers.
                </p>
              </div>
              <div className="pt-2 border-t border-[#E3E8F0] flex items-center gap-1.5 text-[11px] font-semibold text-[#2457A7]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#008C88]" />
                <span>Maker-Checker Tracking &middot; Instant Resolution</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Accreditation Section */}
      <section id="security-section" className="py-16 bg-[#102544] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#008C88] tracking-widest uppercase">
              Institutional Trust &amp; Governance
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Bank-Grade Security Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              National Bank deploys multi-layered defense protocols for physical and digital vault assets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-2xl font-extrabold text-[#008C88]">100x</div>
              <div className="text-sm font-bold text-white">Statutory Liability Protection</div>
              <p className="text-xs text-slate-400">
                Full compliance with RBI directive covering bank negligence, fire, burglary, or building collapse.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-2xl font-extrabold text-[#008C88]">2-Factor</div>
              <div className="text-sm font-bold text-white">Dual-Key Protocol</div>
              <p className="text-xs text-slate-400">
                Hirer key + Custodian master key mechanical handshake, backed by biometric QR check-in.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-2xl font-extrabold text-[#008C88]">180 Days</div>
              <div className="text-sm font-bold text-white">CCTV Audit Preservation</div>
              <p className="text-xs text-slate-400">
                HD surveillance retained in tamper-evident storage for dispute resolution and statutory audit.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="text-2xl font-extrabold text-[#008C88]">ISO 27001</div>
              <div className="text-sm font-bold text-white">Information Security</div>
              <p className="text-xs text-slate-400">
                End-to-end 256-bit encryption for electronic stamp agreements, nominee records, and token data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Professional Footer */}
      <footer id="contact-section" className="bg-white border-t border-[#E3E8F0] py-8 text-xs text-[#66758C] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#102544] flex items-center justify-center text-white font-bold">
                <Shield className="w-4 h-4 text-[#008C88]" />
              </div>
              <div>
                <span className="font-extrabold text-[#102544]">National Bank</span>
                <span className="text-[11px] text-[#66758C] ml-2">SafeVault Locker Management System</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-[11px]">
              <span>Custodian Helpline: 1800-425-9922</span>
              <span>&middot;</span>
              <span>safevault@nationalbank.co.in</span>
              <span>&middot;</span>
              <span>Model Agreement Form L-1 Verified</span>
            </div>
          </div>

          <div className="border-t border-[#E3E8F0] pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <p>&copy; 2026 National Bank. All rights reserved. Scheduled Commercial Bank regulated by RBI.</p>
            <div className="flex items-center gap-4">
              <span className="hover:underline cursor-pointer">Security Policy</span>
              <span>&middot;</span>
              <span className="hover:underline cursor-pointer">RBI Circular Guidelines</span>
              <span>&middot;</span>
              <span className="hover:underline cursor-pointer">Locker Operating Mandates</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
