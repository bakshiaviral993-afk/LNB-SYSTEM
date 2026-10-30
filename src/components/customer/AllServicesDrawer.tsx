import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useTheme } from '../../context/ThemeContext';
import {
  X,
  Search,
  Sun,
  Moon,
  Laptop,
  Key,
  Calendar,
  CreditCard,
  UserCheck,
  FileText,
  Wrench,
  Bell,
  HeartHandshake,
  Headphones,
  FolderArchive,
  LogOut,
  ChevronRight,
  Shield,
  Clock,
  Sparkles,
  FileSpreadsheet,
  CheckCircle2,
  Lock,
  Layers
} from 'lucide-react';

interface AllServicesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTraceabilityMatrix?: () => void;
}

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  viewTarget: string;
  sectionCode: string;
}

interface ServiceCategory {
  categoryName: string;
  sectionCode: string;
  icon: React.ElementType;
  color: string;
  services: ServiceItem[];
}

export const AllServicesDrawer: React.FC<AllServicesDrawerProps> = ({
  isOpen,
  onClose,
  onOpenTraceabilityMatrix
}) => {
  const { setCustomerView, lowBalanceDemoMode, toggleLowBalanceDemoMode } = useBanking();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  // Lock body scroll cleanly while drawer is open, restoring on unmount/close
  useScrollLock(isOpen);

  if (!isOpen) return null;

  const CATEGORIES: ServiceCategory[] = [
    {
      categoryName: 'A. Locker Discovery & Booking',
      sectionCode: 'Section A',
      icon: Search,
      color: 'text-[#97144D] bg-[#97144D]/10',
      services: [
        { id: 'srv-find', name: 'Find a Locker & Availability', description: 'Browse vacant lockers across 28 branches in 7 cities with GPS locator', viewTarget: 'find', sectionCode: 'A.1' },
        { id: 'srv-sizes', name: 'Compare Locker Sizes', description: 'Compare Small, Medium, Large & Extra Large dimensions', viewTarget: 'find', sectionCode: 'A.2' },
        { id: 'srv-calc', name: 'Rent, Tax & Deposit Calculator', description: 'Estimate annual rent, 18% GST, stamp duty and FD lien', viewTarget: 'find', sectionCode: 'A.3' },
        { id: 'srv-apply', name: 'Apply for Safe Deposit Locker', description: 'Submit Form L-101 locker allotment application', viewTarget: 'find', sectionCode: 'A.4' },
        { id: 'srv-waitlist', name: 'Locker Waitlist & Queue Status', description: 'Track waitlist token, queue position and notifications', viewTarget: 'waitlist', sectionCode: 'A.5' }
      ]
    },
    {
      categoryName: 'B. My Lockers & Security',
      sectionCode: 'Section B',
      icon: Key,
      color: 'text-[#C9A24B] bg-[#C9A24B]/15',
      services: [
        { id: 'srv-lockers', name: 'My Locker Portfolio', description: 'View allotted compartments, branch, size and renewal date', viewTarget: 'dashboard', sectionCode: 'B.1' },
        { id: 'srv-freeze', name: 'Security Freeze / Access Hold', description: 'Place emergency 2FA access lock on your compartment', viewTarget: 'dashboard', sectionCode: 'B.2' }
      ]
    },
    {
      categoryName: 'C. Strongroom Visits & Pass',
      sectionCode: 'Section C',
      icon: Calendar,
      color: 'text-[#97144D] bg-[#97144D]/10',
      services: [
        { id: 'srv-book', name: 'Book a Safe Vault Visit', description: '10/15/30 min slots with 15-day rolling horizon & HNI priority', viewTarget: 'visit', sectionCode: 'C.1' },
        { id: 'srv-qr', name: 'Turnstile Digital QR Pass', description: 'Contactless check-in token for branch strongroom gates', viewTarget: 'pass', sectionCode: 'C.2' },
        { id: 'srv-access-hist', name: 'Access History & Turnstile Logs', description: 'Recorded dates, times, operators, and verification method', viewTarget: 'access', sectionCode: 'C.3' }
      ]
    },
    {
      categoryName: 'D. Rent & Payment Management',
      sectionCode: 'Section D',
      icon: CreditCard,
      color: 'text-[#1E8E5A] bg-emerald-500/10',
      services: [
        { id: 'srv-rent-pay', name: 'Pay Annual Rent & Arrears', description: 'UPI, Net Banking, Debit Card, or linked CBS savings debit', viewTarget: 'rent', sectionCode: 'D.1' },
        { id: 'srv-mandate', name: 'e-Mandate / Standing Instruction', description: 'Set up automated annual deduction with safety ceiling', viewTarget: 'rent', sectionCode: 'D.2' },
        { id: 'srv-deposit', name: 'Security Deposit & Term Deposits', description: 'Track 3-year rent FD collateral, lien marking and interest', viewTarget: 'rent', sectionCode: 'D.3' }
      ]
    },
    {
      categoryName: 'E. Holders & Nominees (Form DA-1)',
      sectionCode: 'Section E',
      icon: UserCheck,
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20',
      services: [
        { id: 'srv-joint', name: 'Joint Hirers & Mandates', description: 'Either or Survivor, Jointly, Former or Survivor operating rules', viewTarget: 'holders', sectionCode: 'E.1' },
        { id: 'srv-nominee', name: 'Nomination Registration (DA-1)', description: 'View, add or modify statutory locker nominees', viewTarget: 'holders', sectionCode: 'E.2' },
        { id: 'srv-operators', name: 'Authorized Operators & PoA', description: 'Power of Attorney delegates and temporary representatives', viewTarget: 'holders', sectionCode: 'E.3' }
      ]
    },
    {
      categoryName: 'F. Agreements & Periodic KYC',
      sectionCode: 'Section F',
      icon: FileText,
      color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/20',
      services: [
        { id: 'srv-model-agr', name: 'Model Locker Agreement (Form L-1)', description: 'View and verify RBI compliant stamped locker agreement', viewTarget: 'agreements', sectionCode: 'F.1' },
        { id: 'srv-kyc-refresh', name: 'Periodic KYC Re-verification', description: '10-yr / 8-yr / 2-yr risk-categorized customer re-KYC upload', viewTarget: 'agreements', sectionCode: 'F.2' }
      ]
    },
    {
      categoryName: 'G. Locker Maintenance & Service Requests',
      sectionCode: 'Section G',
      icon: Wrench,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20',
      services: [
        { id: 'srv-lost-key', name: 'Lost Key & Break-Open Request', description: 'Dual-custodian break-open protocol with customer presence', viewTarget: 'requests', sectionCode: 'G.1' },
        { id: 'srv-upgrade', name: 'Size Upgrade / Downgrade', description: 'Request bigger or smaller compartment at your branch', viewTarget: 'requests', sectionCode: 'G.2' }
      ]
    },
    {
      categoryName: 'H. Alerts & Security Notifications',
      sectionCode: 'Section H',
      icon: Bell,
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/20',
      services: [
        { id: 'srv-alerts', name: 'Turnstile & Entry Notifications', description: 'Real-time SMS & email confirmation on vault check-in', viewTarget: 'notifications', sectionCode: 'H.1' }
      ]
    },
    {
      categoryName: 'I. Claims & Deceased Settlement',
      sectionCode: 'Section I',
      icon: HeartHandshake,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/20',
      services: [
        { id: 'srv-claims', name: 'Nominee / Legal Heir Claim Desk', description: 'Settlement within 15 days under RBI master direction', viewTarget: 'claims', sectionCode: 'I.1' }
      ]
    },
    {
      categoryName: 'J. Customer Support & Grievance',
      sectionCode: 'Section J',
      icon: Headphones,
      color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/20',
      services: [
        { id: 'srv-support', name: 'Helpdesk & Branch Custodian Contact', description: 'Branch custodian direct line and ticketing desk', viewTarget: 'support', sectionCode: 'J.1' }
      ]
    },
    {
      categoryName: 'K. Document Vault & e-Locker',
      sectionCode: 'Section K',
      icon: FolderArchive,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/20',
      services: [
        { id: 'srv-vault', name: 'Digital Document Repository', description: 'Allotment letters, receipts, e-signed agreements & DA-1 copies', viewTarget: 'vault', sectionCode: 'K.1' }
      ]
    },
    {
      categoryName: 'L. Locker Surrender & Settlement',
      sectionCode: 'Section L',
      icon: LogOut,
      color: 'text-rose-700 bg-rose-50 dark:bg-rose-950/20',
      services: [
        { id: 'srv-closure', name: 'Voluntary Locker Surrender', description: 'Digital surrender initiation, refund calculation & key handover visit', viewTarget: 'closure', sectionCode: 'L.1' }
      ]
    }
  ];

  // Filter services by search query
  const filteredCategories = CATEGORIES.map(cat => ({
    ...cat,
    services: cat.services.filter(s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sectionCode.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.services.length > 0);

  const handleSelectService = (viewTarget: string) => {
    setCustomerView(viewTarget);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1A0C18] text-[#1F1420] dark:text-[#F3ECF0] w-full max-w-[430px] rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden border border-[#E8DFE5] dark:border-[#381B30] animate-in slide-in-from-bottom duration-250">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#6B0E37] to-[#97144D] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center font-bold text-white shadow-inner">
              <Layers className="w-5 h-5 text-[#C9A24B]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-extrabold text-base tracking-tight text-white">All SafeVault Services</h2>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#C9A24B] text-[#1F1420]">
                  Sections A–L
                </span>
              </div>
              <p className="text-xs text-white/80">Complete Customer Functional Catalogue</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 bg-[#FAF6F8] dark:bg-[#20101D] border-b border-[#E8DFE5] dark:border-[#381B30] shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-[#6B5B68] dark:text-[#A898A4] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search services, e.g. visit, surrender, KYC, rent..."
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#2A1527] border border-[#E8DFE5] dark:border-[#381B30] rounded-xl text-xs text-[#1F1420] dark:text-white placeholder:text-[#6B5B68] dark:placeholder:text-[#A898A4] focus:outline-none focus:ring-2 focus:ring-[#97144D]"
            />
          </div>
        </div>

        {/* Scrollable Categories List */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
          {filteredCategories.map(cat => {
            const Icon = cat.icon;
            return (
              <div key={cat.sectionCode} className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded-lg ${cat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-extrabold text-xs text-[#1F1420] dark:text-white">
                      {cat.categoryName}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#6B5B68] dark:text-[#A898A4]">
                    {cat.services.length} items
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {cat.services.map(srv => (
                    <div
                      key={srv.id}
                      onClick={() => handleSelectService(srv.viewTarget)}
                      className="p-3 rounded-2xl border border-[#E8DFE5] dark:border-[#381B30] bg-[#FAF6F8] dark:bg-[#20101D] hover:bg-white dark:hover:bg-[#2A1527] hover:border-[#97144D] cursor-pointer transition-all flex items-center justify-between group active-press"
                    >
                      <div className="space-y-0.5 pr-2">
                        <div className="font-bold text-xs text-[#1F1420] dark:text-white group-hover:text-[#97144D] dark:group-hover:text-[#E895B8] flex items-center gap-1.5">
                          <span>{srv.name}</span>
                        </div>
                        <p className="text-[11px] text-[#6B5B68] dark:text-[#A898A4] leading-snug">
                          {srv.description}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#97144D] shrink-0 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Settings & Appearance: Theme Selector */}
        <div className="p-3.5 bg-white dark:bg-[#1A0C18] border-t border-[#E8DFE5] dark:border-[#381B30] shrink-0 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#1F1420] dark:text-[#F3ECF0]">
            <span>Appearance / Theme</span>
            <span className="font-mono text-[10px] text-[#6B5B68] dark:text-[#A898A4] capitalize">
              {theme} mode active
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`h-9 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-[#97144D] text-white border-[#6B0E37] shadow-xs'
                  : 'bg-[#FAF6F8] dark:bg-[#20101D] text-[#6B5B68] dark:text-[#A898A4] border-[#E8DFE5] dark:border-[#381B30]'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`h-9 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#97144D] text-white border-[#6B0E37] shadow-xs'
                  : 'bg-[#FAF6F8] dark:bg-[#20101D] text-[#6B5B68] dark:text-[#A898A4] border-[#E8DFE5] dark:border-[#381B30]'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('system')}
              className={`h-9 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                theme === 'system'
                  ? 'bg-[#97144D] text-white border-[#6B0E37] shadow-xs'
                  : 'bg-[#FAF6F8] dark:bg-[#20101D] text-[#6B5B68] dark:text-[#A898A4] border-[#E8DFE5] dark:border-[#381B30]'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>System</span>
            </button>
          </div>

          {/* Demo Settings: Low Balance Scenario Toggle */}
          <div className="pt-2 border-t border-[#E8DFE5] dark:border-[#381B30] flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-[#1F1420] dark:text-[#F3ECF0] block">
                Demo: Low Balance Scenario
              </span>
              <span className="text-[10px] text-[#6B5B68] dark:text-[#A898A4]">
                Simulates balance of ₹3,200 &lt; ₹5,310 rent due
              </span>
            </div>
            <button
              type="button"
              onClick={toggleLowBalanceDemoMode}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                lowBalanceDemoMode
                  ? 'bg-amber-400 text-amber-950 font-black shadow-xs'
                  : 'bg-[#FAF6F8] dark:bg-[#20101D] text-[#6B5B68] dark:text-[#A898A4] border border-[#E8DFE5] dark:border-[#381B30]'
              }`}
            >
              {lowBalanceDemoMode ? 'Active (₹3.2K)' : 'Off (₹2.84L)'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#FAF6F8] dark:bg-[#20101D] border-t border-[#E8DFE5] dark:border-[#381B30] flex items-center justify-between text-xs text-[#6B5B68] dark:text-[#A898A4] shrink-0">
          <span>SafeVault · Axis-inspired POC</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#97144D] text-white font-bold rounded-xl hover:bg-[#6B0E37] transition-colors active-press cursor-pointer"
          >
            Close Menu
          </button>
        </div>

      </div>
    </div>
  );
};
