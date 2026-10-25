/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BankingProvider, useBanking } from './context/BankingContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { WelcomePage } from './components/auth/WelcomePage';
import { LoginPage } from './components/auth/LoginPage';

// Customer Modules
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { FindLocker } from './components/customer/FindLocker';
import { BookVisit } from './components/customer/BookVisit';
import { RentPayments } from './components/customer/RentPayments';
import { HoldersNominees } from './components/customer/HoldersNominees';
import { Agreements } from './components/customer/Agreements';
import { ServiceRequests } from './components/customer/ServiceRequests';
import { AccessHistory } from './components/customer/AccessHistory';
import { NotificationsCenter } from './components/customer/NotificationsCenter';
import { ClaimsCenter } from './components/customer/ClaimsCenter';
import { DocumentVault } from './components/customer/DocumentVault';
import { SupportCenter } from './components/customer/SupportCenter';
import { LockerClosure } from './components/customer/LockerClosure';

// Admin / Branch Operations Modules
import { AdminDashboard } from './components/admin/AdminDashboard';
import { InventoryManagement } from './components/admin/InventoryManagement';
import { ApplicationManagement } from './components/admin/ApplicationManagement';
import { VisitManagement } from './components/admin/VisitManagement';
import { BillingManagement } from './components/admin/BillingManagement';
import { NomineeHolderProcessing } from './components/admin/NomineeHolderProcessing';
import { ServiceRequestAdmin } from './components/admin/ServiceRequestAdmin';
import { ClaimsAdmin } from './components/admin/ClaimsAdmin';
import { ComplaintDesk } from './components/admin/ComplaintDesk';
import { AuditSecurityControls } from './components/admin/AuditSecurityControls';
import { AdministrationHub } from './components/admin/AdministrationHub';

import { Lock, KeyRound } from 'lucide-react';

const SessionTimeoutModal: React.FC = () => {
  const { isSessionExpired, reauthenticateSession, currentUser } = useBanking();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isSessionExpired) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length >= 4) {
      reauthenticateSession();
      setPin('');
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1730]/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-bank-dropdown border border-[#E3E8F0] max-w-sm w-full p-6 space-y-4 text-xs animate-in zoom-in-95 duration-150">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#B7791F]/15 text-[#B7791F] flex items-center justify-center mx-auto shadow-xs border border-[#B7791F]/30">
            <Lock className="w-6 h-6 text-[#B7791F]" />
          </div>
          <h3 className="text-base font-bold text-[#102544]">
            Session Security Timeout
          </h3>
          <p className="text-[#66758C] text-[11px] leading-relaxed">
            Your banking session with National Bank has expired due to 15-minute inactivity policy. Please re-authenticate.
          </p>
        </div>

        <div className="p-3 bg-[#F5F7FA] rounded-xl border border-[#E3E8F0] text-[11px] space-y-1">
          <div className="flex justify-between">
            <span className="text-[#66758C]">Authenticated User:</span>
            <span className="font-bold text-[#102544]">{currentUser.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#66758C]">Assigned Branch:</span>
            <span className="font-mono text-[#17263C]">{currentUser.branchName}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block font-medium text-[#17263C] mb-1">
              Enter 4 to 6-digit MPIN or Security Passcode:
            </label>
            <input
              type="password"
              autoFocus
              maxLength={6}
              value={pin}
              onChange={e => {
                setPin(e.target.value.replace(/\D/g, ''));
                setError(false);
              }}
              placeholder="••••"
              className="w-full text-center tracking-widest text-lg font-mono font-bold bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2 text-[#102544] focus:outline-none focus:border-[#2457A7] focus:bg-white"
            />
            {error && (
              <span className="text-[#C83E44] text-[10px] mt-1 block">
                Please enter your 4-digit PIN (default demo: 1234)
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#102544] hover:bg-[#0B1730] text-white font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4 text-[#008C88]" />
            Re-Authenticate & Resume Session
          </button>
        </form>
      </div>
    </div>
  );
};

const MainModuleRouter: React.FC = () => {
  const { userRole, customerView, adminView } = useBanking();

  return (
    <div className="w-full">
      {userRole === 'customer' ? (
        <>
          {customerView === 'dashboard' && <CustomerDashboard />}
          {customerView === 'find' && <FindLocker />}
          {customerView === 'visit' && <BookVisit />}
          {customerView === 'rent' && <RentPayments />}
          {customerView === 'holders' && <HoldersNominees />}
          {customerView === 'agreements' && <Agreements />}
          {customerView === 'requests' && <ServiceRequests />}
          {customerView === 'access' && <AccessHistory />}
          {customerView === 'notifications' && <NotificationsCenter />}
          {customerView === 'claims' && <ClaimsCenter />}
          {customerView === 'vault' && <DocumentVault />}
          {customerView === 'support' && <SupportCenter />}
          {customerView === 'closure' && <LockerClosure />}
        </>
      ) : (
        <>
          {adminView === 'admin-dashboard' && <AdminDashboard />}
          {adminView === 'inventory' && <InventoryManagement />}
          {adminView === 'applications' && <ApplicationManagement />}
          {adminView === 'visits' && <VisitManagement />}
          {adminView === 'billing' && <BillingManagement />}
          {adminView === 'holders' && <NomineeHolderProcessing />}
          {adminView === 'agreements' && <Agreements />}
          {adminView === 'requests' && <ServiceRequestAdmin />}
          {adminView === 'claims' && <ClaimsAdmin />}
          {adminView === 'support' && <ComplaintDesk />}
          {adminView === 'audit' && <AuditSecurityControls />}
          {adminView === 'administration' && <AdministrationHub />}
        </>
      )}
    </div>
  );
};

const EnterpriseAppLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#17263C] flex font-sans selection:bg-[#102544] selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Header */}
        <Header
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Dynamic Main Workspace Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          <MainModuleRouter />
        </main>

        {/* Inactivity Security Session Modal */}
        <SessionTimeoutModal />

        {/* Quiet Enterprise Banking Footer */}
        <footer className="border-t border-[#E3E8F0] bg-white py-5 text-xs text-[#66758C] mt-auto">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-extrabold text-[#102544]">National Bank</span>
              <span>·</span>
              <span>SafeVault Safe Custody Architecture</span>
              <span>·</span>
              <span className="font-mono text-[11px]">Scheduled Commercial Bank · RBI Master Circular Compliant</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-[#66758C]">
              <span>Custodian Helpline: 1800-425-9922</span>
              <span>·</span>
              <span>Model Agreement Form L-1 Verified</span>
              <span>·</span>
              <span>256-Bit SSL Encrypted</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

const RootAppRouter: React.FC = () => {
  const { currentRoute, navigate, login, isAuthenticated } = useBanking();

  // Route 1: / (Public Welcome / Introductory Page)
  if (currentRoute === '/') {
    return (
      <WelcomePage
        onGetStarted={() => navigate('/login')}
        onQuickDemoLogin={(role) => login(role)}
      />
    );
  }

  // Route 2: /login (Separate Secure Login Page)
  if (currentRoute === '/login') {
    return (
      <LoginPage
        onLoginSuccess={(role) => login(role)}
        onBackToHome={() => navigate('/')}
      />
    );
  }

  // Route 3: /dashboard (Authenticated, Role-Based Application Entry)
  // Protected Route: unauthenticated users cannot access dashboard
  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={(role) => login(role)}
        onBackToHome={() => navigate('/')}
      />
    );
  }

  return <EnterpriseAppLayout />;
};

export default function App() {
  return (
    <BankingProvider>
      <RootAppRouter />
    </BankingProvider>
  );
}
