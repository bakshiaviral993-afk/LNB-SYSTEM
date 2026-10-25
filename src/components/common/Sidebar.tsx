import React from 'react';
import { useBanking } from '../../context/BankingContext';
import {
  Shield,
  LayoutDashboard,
  Search,
  Calendar,
  CreditCard,
  Users,
  FileCheck2,
  KeyRound,
  History,
  FolderLock,
  Bell,
  UserX,
  LifeBuoy,
  LogOut,
  Grid,
  CalendarCheck,
  FileCheck,
  FileText,
  Wrench,
  AlertCircle,
  ShieldCheck,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Building2,
  Lock
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen
}) => {
  const {
    userRole,
    currentUser,
    customerView,
    setCustomerView,
    adminView,
    setAdminView,
    notifications,
    applications,
    appointments,
    serviceRequests,
    lockers,
    logout
  } = useBanking();

  const unreadCount = notifications.filter(n => !n.read).length;
  const pendingApps = applications.filter(a => a.status === 'Submitted' || a.status === 'KYC Verified' || a.status === 'Maker Verified').length;
  const pendingVisits = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Checked In').length;
  const openServiceReqs = serviceRequests.filter(s => s.status !== 'Resolved / Closed').length;
  const overdueLockers = lockers.filter(l => l.customerId === 'cust-rahul-01' && (l.outstandingRent || 0) > 0).length;

  // Customer Navigation Groups
  const customerNavGroups = [
    {
      group: 'Account & Portfolio',
      items: [
        { id: 'dashboard', label: 'Portfolio Overview', icon: LayoutDashboard },
        { id: 'find', label: 'Find & Apply Locker', icon: Search },
        { id: 'visit', label: 'Schedule Visit', icon: Calendar, badge: pendingVisits > 0 ? `${pendingVisits} active` : undefined, badgeColor: 'bg-[#102544] text-white' },
      ]
    },
    {
      group: 'Financial & Legal',
      items: [
        { id: 'rent', label: 'Rent & Invoices', icon: CreditCard, badge: overdueLockers > 0 ? 'Dues' : undefined, badgeColor: 'bg-[#C83E44] text-white' },
        { id: 'holders', label: 'Nominees (Form DA-1)', icon: Users },
        { id: 'agreements', label: 'Agreements & KYC', icon: FileCheck2 },
      ]
    },
    {
      group: 'Operations & Records',
      items: [
        { id: 'requests', label: 'Service Requests', icon: KeyRound, badge: openServiceReqs > 0 ? `${openServiceReqs}` : undefined, badgeColor: 'bg-[#008C88] text-white' },
        { id: 'access', label: 'Access History Folio', icon: History },
        { id: 'vault', label: 'Document Vault', icon: FolderLock },
        { id: 'notifications', label: 'Notifications Hub', icon: Bell, badge: unreadCount > 0 ? `${unreadCount}` : undefined, badgeColor: 'bg-[#C83E44] text-white' },
      ]
    },
    {
      group: 'Lifecycle & Support',
      items: [
        { id: 'claims', label: 'Deceased Claims', icon: UserX },
        { id: 'support', label: 'Support & Ombudsman', icon: LifeBuoy },
        { id: 'closure', label: 'Locker Surrender', icon: LogOut },
      ]
    }
  ];

  // Bank Staff / Administration Navigation Groups
  const adminNavGroups = [
    {
      group: 'Strongroom & Operations',
      items: [
        { id: 'admin-dashboard', label: 'Operations Overview', icon: LayoutDashboard },
        { id: 'inventory', label: 'Vault Inventory & Grid', icon: Grid },
        { id: 'visits', label: 'Visit Queue & Turnstile', icon: CalendarCheck, badge: pendingVisits > 0 ? `${pendingVisits}` : undefined, badgeColor: 'bg-[#008C88] text-white' },
      ]
    },
    {
      group: 'Allotments & Approvals',
      items: [
        { id: 'applications', label: 'Applications (M/C)', icon: FileCheck, badge: pendingApps > 0 ? `${pendingApps}` : undefined, badgeColor: 'bg-[#B7791F] text-white' },
        { id: 'holders', label: 'Nominee Scrutiny', icon: Users },
        { id: 'agreements', label: 'Agreement Administration', icon: FileText },
      ]
    },
    {
      group: 'Servicing & Claims',
      items: [
        { id: 'billing', label: 'Billing & Auto-Debit', icon: CreditCard },
        { id: 'requests', label: 'Service Requests Desk', icon: Wrench, badge: openServiceReqs > 0 ? `${openServiceReqs}` : undefined, badgeColor: 'bg-[#008C88] text-white' },
        { id: 'claims', label: 'Deceased Claims Desk', icon: UserX },
        { id: 'support', label: 'Ombudsman & Grievance', icon: AlertCircle },
      ]
    },
    {
      group: 'Governance & Controls',
      items: [
        { id: 'audit', label: 'Audit Trail & Controls', icon: ShieldCheck },
        { id: 'administration', label: 'Administration Hub', icon: Sliders },
      ]
    }
  ];

  const currentGroups = userRole === 'customer' ? customerNavGroups : adminNavGroups;

  const handleSelectNav = (id: string) => {
    if (userRole === 'customer') {
      setCustomerView(id);
    } else {
      setAdminView(id);
    }
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  const isCurrentActive = (id: string) => {
    return userRole === 'customer' ? customerView === id : adminView === id;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-[#0B1730]/60 backdrop-blur-xs lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white border-r border-[#E3E8F0] transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Lockup */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#E3E8F0] shrink-0 bg-white">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#102544] flex items-center justify-center text-white shrink-0 shadow-xs">
              <Shield className="w-5 h-5 text-[#008C88]" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-sm tracking-tight text-[#102544] leading-tight truncate">
                  National Bank
                </span>
                <span className="text-[10px] font-semibold text-[#66758C] tracking-wider uppercase leading-none mt-0.5">
                  SafeVault Core
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="hidden lg:flex p-1.5 text-[#66758C] hover:text-[#17263C] hover:bg-[#F5F7FA] rounded-lg transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Role Badge Indicator */}
        <div className={`px-3 py-2 bg-[#F5F7FA] border-b border-[#E3E8F0] shrink-0 ${isCollapsed ? 'text-center' : ''}`}>
          {isCollapsed ? (
            <div
              className="w-8 h-8 mx-auto rounded-lg bg-[#102544]/10 text-[#102544] flex items-center justify-center text-[10px] font-bold font-mono"
              title={`Role: ${userRole.toUpperCase()}`}
            >
              {userRole === 'customer' ? 'CST' : 'STF'}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="w-2 h-2 rounded-full bg-[#16845B]" />
                <span className="text-[11px] font-bold text-[#17263C] uppercase tracking-wider truncate">
                  {userRole === 'customer' ? 'Customer Self-Service' : 'Branch Operations'}
                </span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#102544] text-white font-bold shrink-0">
                {currentUser.role.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Navigation Groups List */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {currentGroups.map((grp, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#66758C]">
                  {grp.group}
                </div>
              )}
              {grp.items.map(item => {
                const active = isCurrentActive(item.id);
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectNav(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all relative group ${
                      active
                        ? 'bg-[#102544] text-white shadow-xs'
                        : 'text-[#66758C] hover:text-[#17263C] hover:bg-[#F5F7FA]'
                    } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <IconComponent
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          active ? 'text-[#008C88]' : 'text-[#66758C] group-hover:text-[#17263C]'
                        }`}
                      />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono shrink-0 ${
                          item.badgeColor || 'bg-[#102544] text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {isCollapsed && item.badge && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C83E44] ring-2 ring-white" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Area with User Persona Lockup & Collapse Trigger */}
        <div className="p-3 border-t border-[#E3E8F0] bg-white shrink-0">
          {isCollapsed ? (
            <button
              onClick={() => setIsCollapsed(false)}
              className="w-full py-2 flex items-center justify-center text-[#66758C] hover:text-[#17263C] hover:bg-[#F5F7FA] rounded-lg transition-colors"
              title="Expand sidebar"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-[#F5F7FA] border border-[#E3E8F0] flex items-center justify-between">
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-[#17263C] truncate">{currentUser.name}</div>
                  <div className="text-[10px] text-[#66758C] font-mono truncate">{currentUser.branchName}</div>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 text-[#66758C] hover:text-[#C83E44] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Sign Out & Lock Portal"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#66758C] pt-1 px-1">
                <span className="font-mono text-[10px]">National Bank SafeVault</span>
                <span className="text-[10px] text-emerald-700 font-semibold">2FA Active</span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
