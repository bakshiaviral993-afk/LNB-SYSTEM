import React, { useState, useEffect, useRef } from 'react';
import { useBanking } from '../../context/BankingContext';
import { UserRole } from '../../types';
import { QualityGateModal } from './QualityGateModal';
import {
  Bell,
  RotateCcw,
  User,
  Shield,
  ArrowRightLeft,
  X,
  BookOpen,
  Check,
  ChevronRight,
  ChevronDown,
  Clock,
  Play,
  Menu,
  Search,
  Key,
  FileText,
  Calendar,
  Layers,
  Sparkles,
  LogOut,
  Home
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  isSidebarCollapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileMenu,
  isSidebarCollapsed
}) => {
  const {
    userRole,
    currentUser,
    switchUserRole,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    resetDemoData,
    customerView,
    setCustomerView,
    adminView,
    setAdminView,
    scenarios,
    triggerSessionTimeout,
    lockers,
    applications,
    appointments,
    serviceRequests,
    logout,
    navigate,
    setIsQaSuiteOpen
  } = useBanking();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showPdfCatalogueModal, setShowPdfCatalogueModal] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showQualityGate, setShowQualityGate] = useState(false);

  // Global Quick Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;
  const passedScenarios = scenarios.filter(s => s.status === 'passed').length;

  const rolesConfig: { role: UserRole; title: string; person: string; badge: string; color: string }[] = [
    { role: 'customer', title: 'Customer Self-Service', person: 'Rahul Sharma (CIF-9028192831)', badge: 'CUSTOMER', color: 'bg-[#2457A7]/15 text-[#2457A7] border-[#2457A7]/30' },
    { role: 'branch_maker', title: 'Branch Operations Maker', person: 'Anil Kumar (Operations Officer)', badge: 'MAKER', color: 'bg-[#008C88]/15 text-[#008C88] border-[#008C88]/30' },
    { role: 'branch_checker', title: 'Branch Operations Checker', person: 'Priya Nair (Senior Manager)', badge: 'CHECKER', color: 'bg-[#102544]/15 text-[#102544] border-[#102544]/30' },
    { role: 'branch_manager', title: 'Branch Manager', person: 'Vikramaditya Sen (AVP & Branch Head)', badge: 'BRANCH MGR', color: 'bg-[#16845B]/15 text-[#16845B] border-[#16845B]/30' },
    { role: 'locker_custodian', title: 'Locker Custodian', person: 'Meenakshi Sundaram (Senior Custodian)', badge: 'CUSTODIAN', color: 'bg-[#7C3AED]/15 text-[#7C3AED] border-[#7C3AED]/30' },
    { role: 'regional_manager', title: 'Regional Operations Manager', person: 'Devendra Joshi (DGM North Region)', badge: 'REGIONAL MGR', color: 'bg-[#0284C7]/15 text-[#0284C7] border-[#0284C7]/30' },
    { role: 'ho_admin', title: 'Head Office Administrator', person: 'Sunita Rao (Chief Operations Officer)', badge: 'HO ADMIN', color: 'bg-[#102544] text-white border-[#102544]' },
    { role: 'super_admin', title: 'Super Administrator', person: 'Rajiv Malhotra (Head of Technology)', badge: 'SUPER ADMIN', color: 'bg-[#C83E44]/15 text-[#C83E44] border-[#C83E44]/30' },
    { role: 'customer_service', title: 'Customer Service Executive', person: 'Neha Verma (Relationship Officer)', badge: 'CSE OFFICER', color: 'bg-[#D97706]/15 text-[#D97706] border-[#D97706]/30' },
    { role: 'auditor', title: 'Audit & Compliance Officer', person: 'Rameshwar Patil (Inspection Auditor)', badge: 'AUDITOR', color: 'bg-[#B7791F]/15 text-[#B7791F] border-[#B7791F]/30' },
  ];

  const currentRoleConfig = rolesConfig.find(r => r.role === userRole) || rolesConfig[0];

  // Shortcut key ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter search results
  const filteredLockers = searchQuery.trim()
    ? lockers.filter(l => l.lockerNumber.toLowerCase().includes(searchQuery.toLowerCase()) || l.branchName.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];
  const filteredApps = searchQuery.trim()
    ? applications.filter(a => a.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || a.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];
  const filteredVisits = searchQuery.trim()
    ? appointments.filter(v => v.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase()) || v.lockerNumber.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];
  const filteredTickets = searchQuery.trim()
    ? serviceRequests.filter(s => s.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) || s.requestType.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const hasSearchResults = filteredLockers.length > 0 || filteredApps.length > 0 || filteredVisits.length > 0 || filteredTickets.length > 0;

  // 12 Functional Service Catalogue modules matching Bank_Locker_Customer_App_Services_63aa5c36.pdf
  const pdfCatalogueModules = [
    { code: 'A', title: 'Locker Discovery & Application', desc: 'Real-time branch inventory grid, transparent rent calculator (GST + deposit), application form, waiting list, key handover visit.', view: 'find', role: 'customer' as const },
    { code: 'B', title: 'My Lockers Dashboard', desc: 'Portfolio summary, annual rent, next renewal date, last access, operating mandate (Single/Joint/Either-or-Survivor), quick actions.', view: 'dashboard', role: 'customer' as const },
    { code: 'C', title: 'Locker Access & Visit Management', desc: '30-minute vault slot reservation, digital check-in QR token, access history folio, report unrecognized access & emergency lock freeze.', view: 'visit', role: 'customer' as const },
    { code: 'D', title: 'Locker Rent & Payment Management', desc: 'Annual rent breakdown, online settlement with OTP, auto-debit (NACH) configuration, payment history, and linked FD details.', view: 'rent', role: 'customer' as const },
    { code: 'E', title: 'Holder, Authorization & Nomination', desc: 'Primary/joint holders, Power of Attorney authorized operators, Form DA-1 nominee registration, Form DA-2 cancellation, contact updates.', view: 'holders', role: 'customer' as const },
    { code: 'F', title: 'Agreement & Renewal Management', desc: 'RBI Model Agreement (stamped ₹500), Aadhaar e-Sign consent, statutory 100x rent liability clause, and periodic KYC refresh flow.', view: 'agreements', role: 'customer' as const },
    { code: 'G', title: 'Locker Service Requests', desc: 'Lost key & break-open, lock replacement, size upgrade, branch relocation, surrender, and exceptional access with timeline tracker.', view: 'requests', role: 'customer' as const },
    { code: 'H', title: 'Notifications & Alerts Center', desc: 'Dedicated notification hub with category filtering (Billing, Security, Appointment, Agreement, Service Request) and mobile SMS dispatch.', view: 'notifications', role: 'customer' as const },
    { code: 'I', title: 'Nominee & Deceased-Holder Claims', desc: 'Statutory 15-day claim settlement workflow, death certificate scrutiny, legal heir verification, and inventory inspection booking.', view: 'claims', role: 'customer' as const },
    { code: 'J', title: 'Complaints & Customer Support', desc: 'Banking Ombudsman grievance logging, SLA clock, 4-tier escalation matrix, customer rights charter, and branch custodian contacts.', view: 'support', role: 'customer' as const },
    { code: 'K', title: 'Documents Vault & Certificates', desc: 'Tamper-evident legal deed repository, executed agreements, tax receipts, and on-demand official Safe Custody certificate generator.', view: 'vault', role: 'customer' as const },
    { code: 'L', title: 'Locker Surrender & Closure', desc: 'Surrender notice, dues check, scheduled physical key return appointment, zero-contents clearance, and security deposit release.', view: 'closure', role: 'customer' as const },
  ];

  const getBreadcrumbTitle = () => {
    if (userRole === 'customer') {
      const titles: Record<string, string> = {
        dashboard: 'Portfolio Overview',
        find: 'Find & Apply Locker',
        visit: 'Schedule Visit',
        rent: 'Rent & Payments',
        holders: 'Nominees & Form DA-1',
        agreements: 'Agreements & KYC',
        requests: 'Service Requests',
        access: 'Access History Folio',
        notifications: 'Notifications Hub',
        claims: 'Deceased Claims',
        vault: 'Document Vault',
        support: 'Support & Ombudsman',
        closure: 'Locker Surrender'
      };
      return titles[customerView] || 'Overview';
    } else {
      const titles: Record<string, string> = {
        'executive-dashboard': 'Executive Dashboard & Analytics',
        'admin-dashboard': 'Branch Operations Overview',
        'customer-dashboard': 'Customer Self-Service (Staff Oversight)',
        inventory: 'Vault Inventory & Compartment Grid',
        availability: 'Locker Availability Matrix',
        applications: 'Applications (Maker-Checker)',
        'waiting-list': 'Waiting List Register',
        allotment: 'Locker Allotment Console',
        visits: 'Visit Queue & Turnstile Gate',
        'surrender-ops': 'Locker Surrender Operations',
        'break-open': 'Statutory Break-Open Protocol',
        billing: 'Rent Ledger & Invoices',
        'rent-collection': 'Rent Collection Console',
        arrears: 'Overdue Arrears Ageing Register',
        deposits: 'Security Deposits & Liens',
        'payment-recon': 'CBS Payment Reconciliation',
        'customer-mgmt': 'Customer Portfolio & 360° Master',
        holders: 'Nominee Scrutiny (Form DA-1)',
        mandates: 'Operating Mandates Administration',
        agreements: 'Agreement & Legal Administration',
        requests: 'Service Requests Desk',
        claims: 'Deceased Claims Desk',
        support: 'Ombudsman & Grievances',
        audit: 'Audit Trail & Controls',
        administration: 'Administration Hub',
        'branch-master': 'Branch Master Management',
        'locker-master': 'Locker Master & Tariffs',
        'rent-master': 'Rental Tariff Master',
        'user-mgmt': 'Staff User Management',
        permissions: 'Role × Module Permissions Matrix',
        'approval-matrix': 'Approval Matrix & SLA',
        'sla-config': 'SLA Configuration',
        'reports-mis': 'Enterprise MIS Reporting Center',
        'rep-availability': 'Locker Availability Register',
        'rep-occupancy': 'Capacity Occupancy MIS',
        'rep-arrears': 'Collection & Arrears Ageing',
        'rep-access': 'Turnstile Access History Folio',
        'rep-tat': 'Service Request TAT & SLA Compliance'
      };
      return titles[adminView] || 'Operations';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E3E8F0] shadow-bank-card">
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
        
        {/* Left Section: Mobile Menu Trigger + Breadcrumb Context */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 text-[#66758C] hover:text-[#17263C] hover:bg-[#F5F7FA] rounded-lg transition-colors"
            title="Toggle sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs min-w-0">
            <span className="text-[#66758C] hidden sm:inline whitespace-nowrap font-medium">SafeVault</span>
            <span className="text-[#CBD5E1] hidden sm:inline">/</span>
            <span className="text-[#66758C] hidden md:inline truncate font-medium">
              {userRole === 'customer' ? 'Customer Self-Service' : 'Branch Strongroom Operations'}
            </span>
            <span className="text-[#CBD5E1] hidden md:inline">/</span>
            <h1 className="font-bold text-[#102544] text-xs sm:text-sm truncate">
              {getBreadcrumbTitle()}
            </h1>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-2 relative">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#66758C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search lockers, tokens, applicants (Press ⌘K)..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full pl-9 pr-14 py-1.5 text-xs bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg text-[#17263C] placeholder-[#66758C] focus:outline-none focus:border-[#2457A7] focus:bg-white transition-all font-medium"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-[#66758C] bg-white border border-[#E3E8F0] rounded shadow-2xs">
              ⌘K
            </kbd>
          </div>

          {/* Search Results Dropdown */}
          {isSearchOpen && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E3E8F0] rounded-xl shadow-bank-dropdown z-50 max-h-96 overflow-y-auto p-2 text-xs">
              <div className="flex items-center justify-between p-2 border-b border-[#E3E8F0] text-[11px] text-[#66758C]">
                <span>Search results for "{searchQuery}"</span>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 hover:text-[#17263C]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {!hasSearchResults ? (
                <div className="p-4 text-center text-[#66758C]">
                  No matching lockers, applications, or requests found.
                </div>
              ) : (
                <div className="divide-y divide-[#E3E8F0]">
                  {filteredLockers.length > 0 && (
                    <div className="py-2">
                      <div className="px-2 text-[10px] font-bold text-[#66758C] uppercase tracking-wider mb-1">
                        Lockers ({filteredLockers.length})
                      </div>
                      {filteredLockers.map(l => (
                        <div
                          key={l.id}
                          onClick={() => {
                            if (userRole === 'customer') {
                              setCustomerView('dashboard');
                            } else {
                              setAdminView('inventory');
                            }
                            setIsSearchOpen(false);
                          }}
                          className="p-2 hover:bg-[#F5F7FA] rounded-lg cursor-pointer flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Key className="w-3.5 h-3.5 text-[#2457A7]" />
                            <span className="font-mono font-bold text-[#102544]">Locker {l.lockerNumber}</span>
                            <span className="text-[#66758C]">· {l.branchName}</span>
                          </div>
                          <span className="font-mono text-[#16845B] font-bold">₹{l.annualRent}/yr</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {filteredApps.length > 0 && (
                    <div className="py-2">
                      <div className="px-2 text-[10px] font-bold text-[#66758C] uppercase tracking-wider mb-1">
                        Applications ({filteredApps.length})
                      </div>
                      {filteredApps.map(a => (
                        <div
                          key={a.id}
                          onClick={() => {
                            if (userRole !== 'customer') {
                              setAdminView('applications');
                            }
                            setIsSearchOpen(false);
                          }}
                          className="p-2 hover:bg-[#F5F7FA] rounded-lg cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <div className="font-bold text-[#17263C]">{a.customerName}</div>
                            <div className="text-[11px] text-[#66758C] font-mono">App: {a.applicationNumber} · Size: {a.sizeRequested}</div>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-[#B7791F]/10 text-[#B7791F] text-[10px] font-medium">
                            {a.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {filteredTickets.length > 0 && (
                    <div className="py-2">
                      <div className="px-2 text-[10px] font-bold text-[#66758C] uppercase tracking-wider mb-1">
                        Service Requests ({filteredTickets.length})
                      </div>
                      {filteredTickets.map(t => (
                        <div
                          key={t.id}
                          onClick={() => {
                            if (userRole === 'customer') {
                              setCustomerView('requests');
                            } else {
                              setAdminView('requests');
                            }
                            setIsSearchOpen(false);
                          }}
                          className="p-2 hover:bg-[#F5F7FA] rounded-lg cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <div className="font-bold text-[#17263C]">{t.requestType}</div>
                            <div className="text-[11px] text-[#66758C] font-mono">{t.ticketNumber} · Locker {t.lockerNumber}</div>
                          </div>
                          <span className="text-[10px] font-mono text-[#008C88]">{t.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Section: Quality Gate, Service Catalogue, Persona Switcher, Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Quality Gate 12-Scenario Suite Launcher */}
          <button
            onClick={() => setIsQaSuiteOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#16845B]/10 hover:bg-[#16845B]/15 text-[#16845B] border border-[#16845B]/30 rounded-lg transition-colors font-bold text-xs"
            title="Inspect 12 E2E Banking Scenarios & Dual-Control Quality Gates"
          >
            <Play className="w-3.5 h-3.5 text-[#16845B] fill-[#16845B]" />
            <span className="hidden sm:inline">Quality Gate</span>
            <span className="font-mono text-[11px]">({passedScenarios}/{scenarios.length})</span>
          </button>

          {/* RBI Service Catalogue Modal */}
          <button
            onClick={() => setShowPdfCatalogueModal(true)}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F5F7FA] hover:bg-[#E3E8F0]/70 text-[#102544] border border-[#E3E8F0] rounded-lg transition-colors font-semibold text-xs"
            title="Review RBI Functional Service Catalogue Modules A through L"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#2457A7]" />
            <span>Service Catalogue</span>
          </button>

          {/* 10-Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-[#102544] text-white hover:bg-[#0B1730] rounded-lg text-xs font-bold transition-all shadow-xs"
              title="Switch demo persona (Customer, Maker, Checker, Custodian, Manager, Regional Mgr, HO Admin, Super Admin, CSE, Auditor)"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-[#008C88] shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-[8px] font-mono text-[#008C88] font-bold uppercase leading-none">
                  POC ROLE
                </span>
                <span className="text-[11px] font-semibold leading-tight mt-0.5 whitespace-nowrap">
                  {currentRoleConfig.badge}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-[#E3E8F0] ml-0.5" />
            </button>

            {/* Persona Selection Menu */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E3E8F0] rounded-xl shadow-bank-dropdown z-50 overflow-hidden text-xs animate-in fade-in zoom-in-95">
                <div className="p-3 bg-[#F5F7FA] border-b border-[#E3E8F0] flex items-center justify-between">
                  <span className="font-bold text-[#102544] text-xs">Switch POC Persona</span>
                  <span className="text-[10px] text-[#66758C] font-mono">10 Bank Roles</span>
                </div>
                <div className="p-1 divide-y divide-[#E3E8F0] max-h-80 overflow-y-auto">
                  {rolesConfig.map(rc => (
                    <button
                      key={rc.role}
                      onClick={() => {
                        switchUserRole(rc.role);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg flex items-start justify-between gap-2 transition-colors ${
                        userRole === rc.role ? 'bg-[#F5F7FA] font-bold' : 'hover:bg-[#F5F7FA]/60'
                      }`}
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.2 rounded font-mono text-[9px] font-bold border ${rc.color}`}>
                            {rc.badge}
                          </span>
                          <span className="text-[#17263C] font-semibold truncate">{rc.title}</span>
                        </div>
                        <div className="text-[11px] text-[#66758C] truncate">{rc.person}</div>
                      </div>
                      {userRole === rc.role && <Check className="w-4 h-4 text-[#16845B] shrink-0 mt-1" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reset Demo Data */}
          <button
            onClick={() => {
              if (confirm('Reset POC database back to fresh default state?')) {
                resetDemoData();
              }
            }}
            className="p-2 text-[#66758C] hover:text-[#17263C] hover:bg-[#F5F7FA] rounded-lg transition-colors"
            title="Reset POC state to initial defaults"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 text-[#66758C] hover:text-[#17263C] hover:bg-[#F5F7FA] rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C83E44] rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* Notification Drawer */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E3E8F0] rounded-xl shadow-bank-dropdown z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-3 border-b border-[#E3E8F0] flex items-center justify-between bg-[#F5F7FA]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#102544]">Notifications & Security Alerts</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-semibold text-[#C83E44] bg-[#C83E44]/10 border border-[#C83E44]/20 px-1.5 py-0.2 rounded font-mono">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-[#2457A7] hover:underline font-medium"
                    >
                      Mark all read
                    </button>
                    <button
                      onClick={() => setShowNotifMenu(false)}
                      className="text-[#66758C] hover:text-[#17263C] p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-[#E3E8F0] text-xs">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-[#66758C]">
                      No notifications logged.
                    </div>
                  ) : (
                    notifications.map((n, idx) => (
                      <div
                        key={`${n.id}-${idx}`}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3.5 transition-colors cursor-pointer hover:bg-[#F5F7FA] flex items-start gap-3 ${
                          !n.read ? 'bg-[#2457A7]/5' : ''
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-[#2457A7]" style={{ opacity: n.read ? 0.2 : 1 }} />
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <p className={`font-semibold text-[#17263C] ${!n.read ? 'font-bold' : ''}`}>
                            {n.title}
                          </p>
                          <p className="text-[#66758C] text-[11px] leading-relaxed">
                            {n.message}
                          </p>
                          <span className="text-[10px] text-[#66758C]/70 font-mono block pt-0.5">
                            {n.timestamp}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {userRole === 'customer' && (
                  <div className="p-2.5 border-t border-[#E3E8F0] bg-[#F5F7FA] text-center">
                    <button
                      onClick={() => {
                        setCustomerView('notifications');
                        setShowNotifMenu(false);
                      }}
                      className="text-xs font-semibold text-[#2457A7] hover:underline"
                    >
                      Open Full Notifications Hub →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile Lockup with Session Timeout Simulator */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-[#E3E8F0] text-left hover:opacity-85 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg bg-[#102544] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-[#102544] leading-tight truncate max-w-[120px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-[#66758C] font-mono leading-none mt-0.5 truncate max-w-[120px]">
                  {currentUser.designation}
                </span>
              </div>
            </button>

            {/* Profile Drawer */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-[#E3E8F0] rounded-xl shadow-bank-dropdown z-50 p-4 space-y-3 text-xs animate-in fade-in zoom-in-95">
                <div className="border-b border-[#E3E8F0] pb-2">
                  <div className="font-bold text-[#102544] text-sm">{currentUser.name}</div>
                  <div className="text-[11px] text-[#66758C]">{currentUser.email}</div>
                  <div className="font-mono text-[10px] text-[#66758C] mt-1">
                    Employee: {currentUser.employeeCode} · {currentUser.branchName}
                  </div>
                </div>

                <div className="p-2.5 bg-[#F5F7FA] rounded-lg space-y-1 text-[11px] border border-[#E3E8F0]">
                  <div className="flex justify-between">
                    <span className="text-[#66758C]">Security Status:</span>
                    <strong className="text-[#16845B]">2FA Verified (NSDL)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#66758C]">Active Role:</span>
                    <strong className="font-mono text-[#102544]">{currentUser.role.toUpperCase()}</strong>
                  </div>
                </div>

                {/* Session Inactivity Timeout Simulator Button */}
                <button
                  onClick={() => {
                    triggerSessionTimeout();
                    setShowProfileMenu(false);
                  }}
                  className="w-full py-2 bg-[#B7791F]/10 hover:bg-[#B7791F]/15 text-[#B7791F] border border-[#B7791F]/30 font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 text-[#B7791F]" />
                  Simulate Session Inactivity Timeout
                </button>

                <div className="pt-2 border-t border-[#E3E8F0] space-y-1.5">
                  {/* Public Welcome Page Navigation */}
                  <button
                    onClick={() => {
                      navigate('/');
                      setShowProfileMenu(false);
                    }}
                    className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-[#17263C] border border-[#E3E8F0] font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Home className="w-3.5 h-3.5 text-[#008C88]" />
                    View Public Welcome Page
                  </button>

                  {/* Secure Logout Button */}
                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full py-2 bg-[#C83E44]/10 hover:bg-[#C83E44]/15 text-[#C83E44] border border-[#C83E44]/30 font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out &amp; Lock Portal
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Quality Gate Modal */}
      <QualityGateModal
        isOpen={showQualityGate}
        onClose={() => setShowQualityGate(false)}
      />

      {/* Service Catalogue Coverage Modal */}
      {showPdfCatalogueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1730]/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-bank-dropdown border border-[#E3E8F0] max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-[#E3E8F0] flex items-center justify-between bg-[#F5F7FA]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#102544] text-white flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-[#008C88]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#102544] text-sm">
                    RBI Safe Custody Functional Service Catalogue (Sections A to L)
                  </h3>
                  <span className="text-[11px] text-[#66758C]">
                    Compliant with Bank_Locker_Customer_App_Services_63aa5c36.pdf and RBI Guidelines
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowPdfCatalogueModal(false)}
                className="text-[#66758C] hover:text-[#17263C] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3 divide-y divide-[#E3E8F0] text-xs">
              {pdfCatalogueModules.map(mod => (
                <div key={mod.code} className="pt-3 first:pt-0 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-md bg-[#16845B]/15 text-[#16845B] font-bold font-mono flex items-center justify-center text-xs shrink-0 mt-0.5">
                      {mod.code}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#102544]">{mod.title}</span>
                        <span className="text-[10px] font-bold text-[#16845B] bg-[#16845B]/10 border border-[#16845B]/20 px-1.5 py-0.2 rounded flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" />
                          <span>100% Implemented</span>
                        </span>
                      </div>
                      <p className="text-[#66758C] text-[11px] mt-0.5 leading-relaxed">{mod.desc}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      switchUserRole(mod.role);
                      setCustomerView(mod.view);
                      setShowPdfCatalogueModal(false);
                    }}
                    className="px-2.5 py-1 bg-[#F5F7FA] hover:bg-[#E3E8F0] text-[#102544] font-semibold rounded text-[11px] whitespace-nowrap flex items-center gap-1 shrink-0 transition-colors"
                  >
                    <span>Launch</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 bg-[#F5F7FA] border-t border-[#E3E8F0] flex items-center justify-between text-xs text-[#66758C]">
              <span className="font-medium">
                All 12 customer modules and 10 branch admin modules share unified live state.
              </span>
              <button
                onClick={() => setShowPdfCatalogueModal(false)}
                className="px-4 py-1.5 bg-[#102544] text-white font-semibold rounded-lg hover:bg-[#0B1730] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
