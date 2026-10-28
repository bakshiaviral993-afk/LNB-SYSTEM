import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Shield,
  Lock,
  ArrowRight,
  ShieldCheck,
  Building2,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Grid,
  MapPin,
  TrendingUp,
  BarChart3,
  BarChart2,
  Fingerprint,
  Bell,
  FileText,
  Users,
  CreditCard,
  FileCheck2,
  Sparkles,
  Layers,
  Clock,
  Eye,
  KeyRound,
  DollarSign,
  ChevronDown,
  Info
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
  const [activeBranch, setActiveBranch] = useState('Main Branch - Connaught Place');
  const [selectedLockerInfo, setSelectedLockerInfo] = useState<string | null>(null);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Interactive demo locker matrix data matching reference image exactly
  // Row A: A-101 to A-108
  // Row B: B-101 to B-108
  // Row C: C-101 to C-108
  // Row D: D-101 to D-108
  const demoLockerGrid = [
    { row: 'A', items: [
      { id: 'A-101', status: 'available' },
      { id: 'A-102', status: 'occupied' },
      { id: 'A-103', status: 'occupied' },
      { id: 'A-104', status: 'reserved' },
      { id: 'A-105', status: 'occupied' },
      { id: 'A-106', status: 'maintenance' },
      { id: 'A-107', status: 'occupied' },
      { id: 'A-108', status: 'available' }
    ]},
    { row: 'B', items: [
      { id: 'B-101', status: 'available' },
      { id: 'B-102', status: 'occupied' },
      { id: 'B-103', status: 'blocked' },
      { id: 'B-104', status: 'occupied' },
      { id: 'B-105', status: 'available' },
      { id: 'B-106', status: 'occupied' },
      { id: 'B-107', status: 'occupied' },
      { id: 'B-108', status: 'occupied' }
    ]},
    { row: 'C', items: [
      { id: 'C-101', status: 'maintenance' },
      { id: 'C-102', status: 'occupied' },
      { id: 'C-103', status: 'occupied' },
      { id: 'C-104', status: 'occupied' },
      { id: 'C-105', status: 'occupied' },
      { id: 'C-106', status: 'reserved' },
      { id: 'C-107', status: 'occupied' },
      { id: 'C-108', status: 'maintenance' }
    ]},
    { row: 'D', items: [
      { id: 'D-101', status: 'occupied' },
      { id: 'D-102', status: 'available' },
      { id: 'D-103', status: 'occupied' },
      { id: 'D-104', status: 'occupied' },
      { id: 'D-105', status: 'occupied' },
      { id: 'D-106', status: 'occupied' },
      { id: 'D-107', status: 'blocked' },
      { id: 'D-108', status: 'occupied' }
    ]}
  ];

  const getLockerStyle = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-300';
      case 'occupied':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300';
      case 'reserved':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-300';
      case 'blocked':
        return 'bg-rose-200 text-rose-800 hover:bg-rose-300 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-[#0F172A] py-6 px-4 sm:px-6 lg:px-8 selection:bg-blue-100">
      <div className="max-w-[1440px] mx-auto space-y-6">

        {/* 1. TOP NAVIGATION HEADER */}
        <header className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs px-6 py-3.5 flex items-center justify-between transition-all">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1E40AF] to-[#0284C7] flex items-center justify-center text-white shadow-xs font-black text-xl tracking-tighter">
              N
            </div>
            <div>
              <div className="font-extrabold text-base sm:text-lg text-[#0F172A] tracking-tight leading-none">
                National Bank
              </div>
              <div className="text-[11px] font-semibold text-[#008C88] tracking-wide leading-none mt-1">
                SafeVault Locker Management System
              </div>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#475569]">
            <button
              onClick={() => scrollToSection('hero-section')}
              className="text-[#2563EB] font-bold border-b-2 border-[#2563EB] pb-0.5 cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('capabilities-section')}
              className="hover:text-[#2563EB] transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('security-section')}
              className="hover:text-[#2563EB] transition-colors cursor-pointer"
            >
              Security
            </button>
            <button
              onClick={() => scrollToSection('visibility-section')}
              className="hover:text-[#2563EB] transition-colors cursor-pointer"
            >
              Reports
            </button>
            <button
              onClick={() => scrollToSection('contact-footer')}
              className="hover:text-[#2563EB] transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Secure Login Button */}
          <button
            onClick={onGetStarted}
            className="px-5 py-2.5 bg-[#0B1730] hover:bg-[#1E3A8A] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 group cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-[#008C88] group-hover:scale-110 transition-transform" />
            <span>Secure Login</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </header>

        {/* 2. HERO BANNER SECTION (Split Dark Navy + Realistic Vault Visual) */}
        <section
          id="hero-section"
          className="rounded-3xl border border-[#0F2557]/40 shadow-xl overflow-hidden bg-gradient-to-r from-[#071329] via-[#0B1E40] to-[#0D244D] text-white relative"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
            {/* Left Content Area (7 Cols) */}
            <div className="lg:col-span-6 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-8 z-10">
              <div className="space-y-4">
                {/* Tagline */}
                <div className="text-[11px] font-bold tracking-widest text-[#38BDF8] uppercase flex items-center gap-2">
                  <span>SECURE</span>
                  <span className="text-white/40">|</span>
                  <span>EFFICIENT</span>
                  <span className="text-white/40">|</span>
                  <span>TRUSTED</span>
                </div>

                {/* Big Headline */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.12]">
                  Smarter Locker Management <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] via-[#60A5FA] to-[#93C5FD]">
                    for Modern Banking.
                  </span>
                </h1>

                {/* Description */}
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg">
                  Manage locker inventory, allotment, visits, rent payments, access records, service requests, reports and audit trails from one secure platform.
                </p>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <button
                    onClick={onGetStarted}
                    className="px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 text-xs sm:text-sm cursor-pointer"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => scrollToSection('capabilities-section')}
                    className="px-5 py-3 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold rounded-xl transition-all flex items-center gap-2 text-xs sm:text-sm cursor-pointer"
                  >
                    <Grid className="w-4 h-4 text-[#38BDF8]" />
                    <span>Explore Features</span>
                  </button>
                </div>
              </div>

              {/* Three Value Pillars */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#38BDF8] shrink-0" />
                  <span className="font-semibold text-white/90 text-[11.5px]">Enhance Operational Efficiency</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-[#38BDF8] shrink-0" />
                  <span className="font-semibold text-white/90 text-[11.5px]">Deliver Better Customer Experiences</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="w-4 h-4 text-[#38BDF8] shrink-0" />
                  <span className="font-semibold text-white/90 text-[11.5px]">Complete Visibility & Control</span>
                </div>
              </div>
            </div>

            {/* Right Visual Area: Realistic Bank Vault Corridor with Floating Glass Metrics (6 Cols) */}
            <div className="lg:col-span-6 relative overflow-hidden min-h-[380px] lg:min-h-full flex items-center justify-center p-6 bg-radial from-[#1E3A8A]/30 to-transparent">
              {/* Background Vault Image Asset */}
              <img
                src="/assets/vault_hero_corridor.png"
                alt="National Bank SafeVault Luxury Strongroom Corridor"
                className="absolute inset-0 w-full h-full object-cover object-center scale-105 filter brightness-95 contrast-105"
              />

              {/* Subtle Gradient Overlay for Cinematic Depth */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#071329]/80 via-transparent to-[#071329]/40 pointer-events-none" />

              {/* Backlit "YOUR VALUABLES OUR PRIORITY" Plaque Glow Overlay */}
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center">
                <div className="text-[10px] uppercase font-extrabold tracking-widest text-amber-200/90 drop-shadow-md">
                  YOUR VALUABLES
                </div>
                <div className="text-[10px] uppercase font-extrabold tracking-widest text-amber-200/90 drop-shadow-md mt-0.5">
                  OUR PRIORITY
                </div>
              </div>

              {/* Floating Metric 1: 1,250 Lockers Managed (Top-Left) */}
              <div className="absolute top-8 left-6 sm:left-12 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-white/60 flex items-center gap-3 animate-in fade-in duration-700">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold">
                  <Grid className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-lg text-[#0F172A] font-mono leading-none">
                    1,250
                  </div>
                  <div className="text-[11px] font-semibold text-[#64748B] mt-1 leading-none">
                    Lockers Managed
                  </div>
                </div>
              </div>

              {/* Floating Metric 2: 98.6% Occupancy (Center-Left) */}
              <div className="absolute top-36 left-10 sm:left-16 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-white/60 flex items-center gap-3 animate-in fade-in duration-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#16845B] flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-lg text-[#0F172A] font-mono leading-none">
                    98.6%
                  </div>
                  <div className="text-[11px] font-semibold text-[#64748B] mt-1 leading-none">
                    Occupancy
                  </div>
                </div>
              </div>

              {/* Floating Metric 3: Real-time Access Logs (Top-Right) */}
              <div className="absolute top-16 right-6 sm:right-12 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-white/60 flex items-center gap-3 animate-in fade-in duration-900">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-extrabold text-sm text-[#0F172A] leading-none">
                    Real-time
                  </div>
                  <div className="text-[10px] font-semibold text-[#64748B] mt-1 leading-none">
                    Access Logs
                  </div>
                </div>
              </div>

              {/* Floating Metric 4: Role-Based Controls (Bottom-Right) */}
              <div className="absolute bottom-10 right-8 sm:right-14 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-white/60 flex items-center gap-3 animate-in fade-in duration-1000">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-extrabold text-sm text-[#0F172A] leading-none">
                    Role-Based
                  </div>
                  <div className="text-[10px] font-semibold text-[#64748B] mt-1 leading-none">
                    Controls
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. CORE CAPABILITIES (Horizontal 6-Card Suite) */}
        <section
          id="capabilities-section"
          className="bg-white rounded-2xl p-7 lg:p-9 border border-[#E2E8F0] shadow-xs space-y-6"
        >
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#F1F5F9]">
            <div>
              <div className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                CORE CAPABILITIES
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight mt-1">
                Everything You Need for Complete Locker Operations
              </h2>
            </div>
            <div className="flex items-center gap-6">
              <p className="text-xs text-[#64748B] max-w-sm hidden sm:block">
                A comprehensive, secure and scalable locker management platform designed for modern banks.
              </p>
              <button
                onClick={onGetStarted}
                className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <span>View All Features</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 6 Capabilities Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Card 1: Locker Inventory */}
            <div
              onClick={onGetStarted}
              className="p-4 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#2563EB] hover:shadow-md transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold">
                  <Grid className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                  Locker Inventory
                </h3>
                <p className="text-[11px] text-[#64748B] leading-relaxed">
                  Maintain complete inventory across branches, with flexible configuration and real-time status tracking.
                </p>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#F1F5F9] group-hover:bg-[#2563EB] group-hover:text-white text-[#64748B] flex items-center justify-center self-end transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 2: Applications & Allotment */}
            <div
              onClick={onGetStarted}
              className="p-4 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#16845B] hover:shadow-md transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#16845B] flex items-center justify-center font-bold">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-[#0F172A] group-hover:text-[#16845B] transition-colors">
                  Applications & Allotment
                </h3>
                <p className="text-[11px] text-[#64748B] leading-relaxed">
                  Manage customer applications, KYC, approvals and locker allotment with full audit trail.
                </p>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#F1F5F9] group-hover:bg-[#16845B] group-hover:text-white text-[#64748B] flex items-center justify-center self-end transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 3: Visit Management */}
            <div
              onClick={onGetStarted}
              className="p-4 rounded-xl border border-[#E2E8F0] bg-white hover:border-purple-600 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-[#0F172A] group-hover:text-purple-700 transition-colors">
                  Visit Management
                </h3>
                <p className="text-[11px] text-[#64748B] leading-relaxed">
                  Schedule and track locker visits with secure access control and digital records.
                </p>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#F1F5F9] group-hover:bg-purple-600 group-hover:text-white text-[#64748B] flex items-center justify-center self-end transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 4: Rent & Payments */}
            <div
              onClick={onGetStarted}
              className="p-4 rounded-xl border border-[#E2E8F0] bg-white hover:border-amber-600 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-[#0F172A] group-hover:text-amber-700 transition-colors">
                  Rent & Payments
                </h3>
                <p className="text-[11px] text-[#64748B] leading-relaxed">
                  Automate rent calculation, payment tracking, reminders and receipts.
                </p>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#F1F5F9] group-hover:bg-amber-600 group-hover:text-white text-[#64748B] flex items-center justify-center self-end transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 5: Access & Audit Trail */}
            <div
              onClick={onGetStarted}
              className="p-4 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#008C88] hover:shadow-md transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-[#008C88] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-[#0F172A] group-hover:text-[#008C88] transition-colors">
                  Access & Audit Trail
                </h3>
                <p className="text-[11px] text-[#64748B] leading-relaxed">
                  Capture every access with detailed audit logs, maker-checker controls and tamper-proof records.
                </p>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#F1F5F9] group-hover:bg-[#008C88] group-hover:text-white text-[#64748B] flex items-center justify-center self-end transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 6: Reports & Notifications */}
            <div
              onClick={onGetStarted}
              className="p-4 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#2563EB] hover:shadow-md transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                  Reports & Notifications
                </h3>
                <p className="text-[11px] text-[#64748B] leading-relaxed">
                  Get real-time MIS, compliance reports and automated notifications.
                </p>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#F1F5F9] group-hover:bg-[#2563EB] group-hover:text-white text-[#64748B] flex items-center justify-center self-end transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </section>

        {/* 4. OPERATIONAL VISIBILITY (Real-Time Interactive Locker Grid + Branch Overview) */}
        <section
          id="visibility-section"
          className="bg-white rounded-2xl p-7 lg:p-9 border border-[#E2E8F0] shadow-xs"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Content Column (3 Cols) */}
            <div className="lg:col-span-3 space-y-4">
              <div className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                OPERATIONAL VISIBILITY
              </div>
              <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
                Real-Time Locker Inventory at Your Fingertips
              </h2>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Get a bird's-eye view of locker availability, occupancy and status across branches with an interactive layout and powerful insights.
              </p>

              <button
                onClick={onGetStarted}
                className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer mt-2"
              >
                <span>See It In Action</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Center: Live Interactive Bank Locker Matrix (6 Cols) */}
            <div className="lg:col-span-6 bg-[#F8FAFC] rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] space-y-4">
              {/* Branch Selector & Legend */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
                {/* Branch Dropdown */}
                <div className="relative">
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#CBD5E1] text-xs font-semibold text-[#0F172A] shadow-2xs">
                    <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>{activeBranch}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                  </div>
                </div>

                {/* Status Legend */}
                <div className="flex items-center gap-3 text-[11px] font-medium text-[#475569]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Available
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    Occupied
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    Reserved
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    Blocked
                  </span>
                </div>
              </div>

              {/* 4 Rows x 8 Columns Grid */}
              <div className="space-y-2">
                {demoLockerGrid.map(row => (
                  <div key={row.row} className="flex items-center gap-2">
                    <span className="w-4 font-bold text-xs text-[#64748B]">{row.row}</span>
                    <div className="grid grid-cols-8 gap-2 flex-1">
                      {row.items.map(lkr => (
                        <button
                          key={lkr.id}
                          onClick={() => setSelectedLockerInfo(`Compartment ${lkr.id}: Status is ${lkr.status.toUpperCase()} in ${activeBranch}.`)}
                          className={`py-2 px-1 rounded-lg text-[11px] font-mono font-bold border transition-all text-center cursor-pointer ${getLockerStyle(
                            lkr.status
                          )}`}
                          title={`Locker #${lkr.id} - ${lkr.status.toUpperCase()}`}
                        >
                          {lkr.id}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {selectedLockerInfo && (
                <div className="p-2.5 bg-white border border-[#CBD5E1] rounded-lg text-xs text-[#0F172A] flex items-center justify-between animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>{selectedLockerInfo}</span>
                  </div>
                  <button
                    onClick={() => setSelectedLockerInfo(null)}
                    className="text-slate-400 hover:text-slate-600 font-bold"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Right: Branch Overview Card (3 Cols) */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-2 font-bold text-xs text-[#0F172A]">
                  <Building2 className="w-4 h-4 text-[#2563EB]" />
                  <span>Branch Overview</span>
                </div>
                <div className="text-[11px] font-semibold text-[#64748B] flex items-center gap-1 bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2E8F0]">
                  <span>This Month</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
              </div>

              {/* 4 Stats Cards in 2x2 Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Total Lockers */}
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1">
                  <div className="w-6 h-6 rounded-md bg-blue-100 text-[#2563EB] flex items-center justify-center">
                    <Grid className="w-3.5 h-3.5" />
                  </div>
                  <div className="font-mono font-extrabold text-base text-[#0F172A]">1,250</div>
                  <div className="text-[10px] text-[#64748B]">Total Lockers</div>
                </div>

                {/* Occupied */}
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1">
                  <div className="w-6 h-6 rounded-md bg-emerald-100 text-[#16845B] flex items-center justify-center">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono font-extrabold text-base text-[#0F172A]">1,233</span>
                    <span className="text-[10px] font-bold text-emerald-700">98.6%</span>
                  </div>
                  <div className="text-[10px] text-[#64748B]">Occupied</div>
                </div>

                {/* Available */}
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1">
                  <div className="w-6 h-6 rounded-md bg-blue-100 text-[#2563EB] flex items-center justify-center">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono font-extrabold text-base text-[#0F172A]">17</span>
                    <span className="text-[10px] font-bold text-emerald-700">1.4%</span>
                  </div>
                  <div className="text-[10px] text-[#64748B]">Available</div>
                </div>

                {/* Rent Collected */}
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1">
                  <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center">
                    <DollarSign className="w-3.5 h-3.5" />
                  </div>
                  <div className="font-mono font-extrabold text-base text-[#0F172A]">₹17.8 L</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">vs. prev month ↑ 12%</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. BUILT FOR TRUST & SECURITY (Bottom Row Strip) */}
        <section
          id="security-section"
          className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6"
        >
          {/* Section Left Title */}
          <div className="shrink-0 space-y-0.5">
            <div className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
              BUILT FOR TRUST & SECURITY
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A]">
              Advanced Security for Your Valuables
            </h3>
          </div>

          {/* 5 Security Feature Items */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 flex-1 text-xs">
            {/* Feature 1 */}
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <Fingerprint className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-[#0F172A]">Biometric-ready</div>
                <div className="text-[10.5px] text-[#64748B] leading-tight mt-0.5">
                  Seamless integration with biometric systems
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-[#0F172A]">Audit Trail</div>
                <div className="text-[10.5px] text-[#64748B] leading-tight mt-0.5">
                  Complete and tamper proof access records
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-[#0F172A]">Branch Controls</div>
                <div className="text-[10.5px] text-[#64748B] leading-tight mt-0.5">
                  Maker-checker role-based permissions
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-[#0F172A]">Instant Alerts</div>
                <div className="text-[10.5px] text-[#64748B] leading-tight mt-0.5">
                  Real-time notifications for every access
                </div>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <BarChart2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-[#0F172A]">Custom Reports</div>
                <div className="text-[10.5px] text-[#64748B] leading-tight mt-0.5">
                  Flexible MIS and operational reports exports
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. QUICK DEMO ACCESS PANEL (Bank Leadership Evaluation Floating Bar) */}
        <div
          id="contact-footer"
          className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
        >
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <span className="font-bold text-[#0F172A]">Executive Evaluation Mode:</span>
              <span className="text-[#64748B] ml-1.5">
                Instant one-click demo login across all roles
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onQuickDemoLogin ? onQuickDemoLogin('customer') : onGetStarted()}
              className="px-3 py-1.5 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] font-bold text-[11px] transition-colors cursor-pointer"
            >
              Customer Portal
            </button>
            <button
              onClick={() => onQuickDemoLogin ? onQuickDemoLogin('branch_maker') : onGetStarted()}
              className="px-3 py-1.5 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] font-bold text-[11px] transition-colors cursor-pointer"
            >
              Branch Maker
            </button>
            <button
              onClick={() => onQuickDemoLogin ? onQuickDemoLogin('branch_checker') : onGetStarted()}
              className="px-3 py-1.5 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] font-bold text-[11px] transition-colors cursor-pointer"
            >
              Branch Checker
            </button>
            <button
              onClick={() => onQuickDemoLogin ? onQuickDemoLogin('branch_manager') : onGetStarted()}
              className="px-3 py-1.5 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] font-bold text-[11px] transition-colors cursor-pointer"
            >
              Branch Manager
            </button>
            <button
              onClick={onGetStarted}
              className="px-4 py-1.5 rounded-lg bg-[#0B1730] hover:bg-[#1E3A8A] text-white font-bold text-[11px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Launch SafeVault</span>
              <ArrowRight className="w-3 h-3 text-[#008C88]" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
