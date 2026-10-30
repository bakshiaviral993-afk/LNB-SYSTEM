import React, { useState, useEffect } from 'react';
import { useBanking } from '../../context/BankingContext';
import { AllServicesDrawer } from './AllServicesDrawer';
import { TraceabilityMatrixModal } from '../common/TraceabilityMatrixModal';
import { CustomerProfileView } from './CustomerProfileView';
import { LockerWaitlist } from './LockerWaitlist';

// Customer View Components
import { CustomerDashboard } from './CustomerDashboard';
import { FindLocker } from './FindLocker';
import { BookVisit } from './BookVisit';
import { RentPayments } from './RentPayments';
import { HoldersNominees } from './HoldersNominees';
import { Agreements } from './Agreements';
import { ServiceRequests } from './ServiceRequests';
import { AccessHistory } from './AccessHistory';
import { NotificationsCenter } from './NotificationsCenter';
import { ClaimsCenter } from './ClaimsCenter';
import { DocumentVault } from './DocumentVault';
import { SupportCenter } from './SupportCenter';
import { LockerClosure } from './LockerClosure';
import { DigitalCheckinPassPage } from './DigitalCheckinPassPage';

import { useTheme } from '../../context/ThemeContext';

import {
  Home,
  Search,
  Calendar,
  CreditCard,
  Grid,
  Bell,
  Wifi,
  Battery,
  ChevronLeft,
  Moon,
  Sun,
  Laptop,
  ShieldCheck,
  Sparkles,
  Maximize2,
  Minimize2
} from 'lucide-react';

export const CustomerMobileShell: React.FC = () => {
  const {
    customerView,
    setCustomerView,
    notifications,
    currentUser
  } = useBanking();

  const { theme, resolvedTheme, toggleTheme, setTheme } = useTheme();

  const [allServicesOpen, setAllServicesOpen] = useState(false);
  const [traceabilityOpen, setTraceabilityOpen] = useState(false);
  const [isChassisMode, setIsChassisMode] = useState(true);

  // Unread notification count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Active bottom navigation tab detection
  const getActiveTab = (): 'home' | 'find' | 'visit' | 'rent' | 'more' => {
    switch (customerView) {
      case 'dashboard':
      case 'lockers':
        return 'home';
      case 'find':
      case 'waitlist':
        return 'find';
      case 'visit':
      case 'access':
      case 'pass':
        return 'visit';
      case 'rent':
        return 'rent';
      default:
        return 'more';
    }
  };

  const activeTab = getActiveTab();

  // Scroll to top on customer view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [customerView]);

  return (
    <div className="min-h-screen bg-[#F0EBF1] dark:bg-[#0F0811] flex items-center justify-center p-0 sm:p-4 selection:bg-[#97144D] selection:text-white transition-colors">
      
      {/* Mobile Device Frame Container (Max 430px, centered on desktop) */}
      <div
        className={`w-full max-w-[430px] bg-[#FAF6F8] dark:bg-[#1A0C18] text-[#1F1420] dark:text-[#F3ECF0] flex flex-col relative overflow-hidden transition-all duration-200 ${
          isChassisMode
            ? 'min-h-dvh sm:min-h-[880px] sm:max-h-[920px] sm:rounded-[44px] sm:shadow-2xl sm:border-[8px] sm:border-[#2B1B27] ring-1 ring-black/10'
            : 'min-h-dvh shadow-lg'
        }`}
      >

        {/* Native Mobile Status Bar (Visible only on desktop frame mode per spec) */}
        <div className="hidden sm:flex bg-[#6B0E37] text-white px-5 pt-2.5 pb-1 items-center justify-between text-[11px] font-medium tracking-tight select-none shrink-0 z-30">
          <span className="font-mono font-bold tracking-tight">9:41</span>
          
          {/* Dynamic Island Pill */}
          <div className="w-24 h-4 bg-black/40 rounded-full mx-auto flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-emerald-400/80 mr-1" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[10px]">
            <Wifi className="w-3.5 h-3.5" />
            <span>5G</span>
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Premium Mobile App Header */}
        <header className="bg-gradient-to-r from-[#6B0E37] via-[#851144] to-[#97144D] text-white px-3.5 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-md shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            {customerView !== 'dashboard' ? (
              <button
                onClick={() => setCustomerView('dashboard')}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
                title="Back to Dashboard"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            ) : (
              /* Generic Burgundy Monogram Placeholder: SV */
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#97144D] to-[#4A0A26] border border-[#C9A24B]/60 flex items-center justify-center text-white font-black text-sm tracking-tighter shadow-md shrink-0">
                <span className="text-[#FFDF85]">SV</span>
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm tracking-tight text-white truncate">SafeVault</span>
                {/* Small POC Demo Ribbon */}
                <span className="bg-[#C9A24B] text-[#1F1420] text-[9px] font-black uppercase px-1.5 py-0.5 rounded tracking-wider shadow-xs shrink-0">
                  POC Demo
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-white/85 truncate">
                <span className="truncate">Rahul Sharma</span>
                <span className="text-[#FFDF85] font-semibold">· Premier Wealth (KYC Verified)</span>
              </div>
            </div>
          </div>

          {/* Action Icons: 3-way Theme Toggle (Light/Dark/System), Notifications, Frame Toggle */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center justify-center"
              title={`Theme: ${theme.toUpperCase()} (Click to change)`}
              aria-label={`Toggle theme: currently ${theme}`}
            >
              {theme === 'light' ? (
                <Sun className="w-4 h-4 text-[#FFDF85]" />
              ) : theme === 'dark' ? (
                <Moon className="w-4 h-4 text-[#FFDF85]" />
              ) : (
                <Laptop className="w-4 h-4 text-[#FFDF85]" />
              )}
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setCustomerView('notifications')}
              className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C62828] text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#6B0E37]">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Desktop Chassis View Toggle */}
            <button
              onClick={() => setIsChassisMode(!isChassisMode)}
              className="hidden sm:flex p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
              title={isChassisMode ? 'Expand Viewport' : 'Center in Phone Frame'}
            >
              {isChassisMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </header>

        {/* Main Content Viewport (Unconstrained scrolling with safe bottom padding) */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-4 pb-24 scrollbar-thin">
          {/* PRIMARY FLOWS */}
          {customerView === 'dashboard' && <CustomerDashboard onOpenAllServices={() => setAllServicesOpen(true)} />}
          {customerView === 'lockers' && <CustomerDashboard onOpenAllServices={() => setAllServicesOpen(true)} />}
          {customerView === 'find' && <FindLocker />}
          {customerView === 'visit' && <BookVisit />}
          {customerView === 'rent' && <RentPayments />}

          {/* DEDICATED QR TURNSTILE PASS ROUTE (NEVER MODAL OVERLAY, NEVER SCROLL LOCKED) */}
          {customerView === 'pass' && (
            <DigitalCheckinPassPage
              onBack={() => setCustomerView('visit')}
              onReschedule={() => setCustomerView('visit')}
            />
          )}

          {/* EXTENDED SECTIONS A–L */}
          {customerView === 'waitlist' && <LockerWaitlist />}
          {customerView === 'holders' && <HoldersNominees />}
          {customerView === 'agreements' && <Agreements />}
          {customerView === 'requests' && <ServiceRequests />}
          {customerView === 'access' && <AccessHistory />}
          {customerView === 'notifications' && <NotificationsCenter />}
          {customerView === 'claims' && <ClaimsCenter />}
          {customerView === 'vault' && <DocumentVault />}
          {customerView === 'support' && <SupportCenter />}
          {customerView === 'closure' && <LockerClosure />}
          {customerView === 'profile' && (
            <CustomerProfileView
              onOpenTraceabilityMatrix={() => setTraceabilityOpen(true)}
              onOpenAllServices={() => setAllServicesOpen(true)}
            />
          )}
        </main>

        {/* PERSISTENT 5-TAB BOTTOM NAVIGATION BAR */}
        {/* [Home] | [Find Locker] | [Book Visit] | [Payments] | [More] */}
        <nav className="fixed sm:absolute bottom-0 inset-x-0 bg-white/95 dark:bg-[#1A0C18]/95 backdrop-blur-md border-t border-[#E8DFE5] dark:border-[#381B30] px-2 py-1.5 flex items-center justify-around z-40 shadow-lg">
          
          {/* 1. HOME */}
          <button
            onClick={() => setCustomerView('dashboard')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all min-h-[46px] active-press cursor-pointer ${
              activeTab === 'home'
                ? 'text-[#97144D] dark:text-[#E895B8] font-bold'
                : 'text-[#6B5B68] dark:text-[#A898A4] hover:text-[#1F1420] dark:hover:text-white'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${
              activeTab === 'home'
                ? 'bg-[#97144D]/10 dark:bg-[#97144D]/20 text-[#97144D] dark:text-[#E895B8]'
                : ''
            }`}>
              <Home className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-bold">Home</span>
          </button>

          {/* 2. FIND LOCKER */}
          <button
            onClick={() => setCustomerView('find')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all min-h-[46px] active-press cursor-pointer ${
              activeTab === 'find'
                ? 'text-[#97144D] dark:text-[#E895B8] font-bold'
                : 'text-[#6B5B68] dark:text-[#A898A4] hover:text-[#1F1420] dark:hover:text-white'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${
              activeTab === 'find'
                ? 'bg-[#97144D]/10 dark:bg-[#97144D]/20 text-[#97144D] dark:text-[#E895B8]'
                : ''
            }`}>
              <Search className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-bold">Find Locker</span>
          </button>

          {/* 3. BOOK VISIT */}
          <button
            onClick={() => setCustomerView('visit')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all min-h-[46px] active-press cursor-pointer ${
              activeTab === 'visit'
                ? 'text-[#97144D] dark:text-[#E895B8] font-bold'
                : 'text-[#6B5B68] dark:text-[#A898A4] hover:text-[#1F1420] dark:hover:text-white'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${
              activeTab === 'visit'
                ? 'bg-[#97144D]/10 dark:bg-[#97144D]/20 text-[#97144D] dark:text-[#E895B8]'
                : ''
            }`}>
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-bold">Book Visit</span>
          </button>

          {/* 4. PAYMENTS */}
          <button
            onClick={() => setCustomerView('rent')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all min-h-[46px] active-press cursor-pointer ${
              activeTab === 'rent'
                ? 'text-[#97144D] dark:text-[#E895B8] font-bold'
                : 'text-[#6B5B68] dark:text-[#A898A4] hover:text-[#1F1420] dark:hover:text-white'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${
              activeTab === 'rent'
                ? 'bg-[#97144D]/10 dark:bg-[#97144D]/20 text-[#97144D] dark:text-[#E895B8]'
                : ''
            }`}>
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-bold">Payments</span>
          </button>

          {/* 5. MORE (OPENS ALL SERVICES GRID DRAWER) */}
          <button
            onClick={() => setAllServicesOpen(true)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all min-h-[46px] active-press cursor-pointer ${
              activeTab === 'more'
                ? 'text-[#97144D] dark:text-[#E895B8] font-bold'
                : 'text-[#6B5B68] dark:text-[#A898A4] hover:text-[#1F1420] dark:hover:text-white'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${
              allServicesOpen
                ? 'bg-[#97144D]/10 dark:bg-[#97144D]/20 text-[#97144D] dark:text-[#E895B8]'
                : ''
            }`}>
              <Grid className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-bold">More</span>
          </button>

        </nav>

        {/* All Services Drawer Grid Sheet (Sections A–L) */}
        <AllServicesDrawer
          isOpen={allServicesOpen}
          onClose={() => setAllServicesOpen(false)}
          onOpenTraceabilityMatrix={() => setTraceabilityOpen(true)}
        />

        {/* Requirements Traceability Matrix Modal */}
        <TraceabilityMatrixModal
          isOpen={traceabilityOpen}
          onClose={() => setTraceabilityOpen(false)}
        />

      </div>
    </div>
  );
};
