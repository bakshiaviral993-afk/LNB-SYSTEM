import React, { useState } from 'react';
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
  ChevronDown,
  Building2,
  Lock,
  LineChart,
  Hammer,
  Clock,
  Layers,
  FileSpreadsheet,
  BadgeCheck,
  DollarSign,
  UserCheck
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

  // Track collapsed groups in the enterprise sidebar
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
    'ADMINISTRATION': false,
    'REPORTS & AUDIT': false
  });

  const toggleGroup = (grp: string) => {
    setCollapsedGroups(prev => ({ ...prev, [grp]: !prev[grp] }));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const pendingApps = applications.filter(
    a => a.status === 'Submitted' || a.status === 'KYC Verified' || a.status === 'Maker Verified'
  ).length;
  const pendingVisits = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Checked In').length;
  const openServiceReqs = serviceRequests.filter(s => s.status !== 'Resolved / Closed').length;
  const overdueLockers = lockers.filter(l => (l.outstandingRent || 0) > 0).length;

  // Customer Self-Service Navigation Groups
  const customerNavGroups = [
    {
      group: 'Account & Portfolio',
      items: [
        { id: 'dashboard', label: 'Portfolio Overview', icon: LayoutDashboard, badge: undefined, badgeColor: undefined },
        { id: 'find', label: 'Find & Apply Locker', icon: Search, badge: undefined, badgeColor: undefined },
        { id: 'visit', label: 'Schedule Visit', icon: Calendar, badge: pendingVisits > 0 ? `${pendingVisits}` : undefined, badgeColor: 'bg-[#008C88] text-white' },
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

  // Benchmark: SysArc SAFE Hierarchical Enterprise Navigation (6 Functional Groups)
  const enterpriseStaffNavGroups = [
    {
      group: 'DASHBOARD',
      items: [
        { id: 'executive-dashboard', label: 'Executive Dashboard', icon: LineChart },
        { id: 'admin-dashboard', label: 'Branch Operations Dashboard', icon: LayoutDashboard },
        { id: 'customer-dashboard', label: 'Customer Dashboard', icon: Users },
      ]
    },
    {
      group: 'LOCKER OPERATIONS',
      items: [
        { id: 'inventory', label: 'Locker Inventory', icon: Grid },
        { id: 'availability', label: 'Locker Availability', icon: Layers },
        { id: 'applications', label: 'Locker Applications', icon: FileCheck, badge: pendingApps > 0 ? `${pendingApps}` : undefined, badgeColor: 'bg-[#B7791F] text-white' },
        { id: 'waiting-list', label: 'Waiting List Register', icon: Clock },
        { id: 'allotment', label: 'Locker Allotment (M/C)', icon: BadgeCheck },
        { id: 'visits', label: 'Locker Access & Turnstile', icon: CalendarCheck, badge: pendingVisits > 0 ? `${pendingVisits}` : undefined, badgeColor: 'bg-[#008C88] text-white' },
        { id: 'surrender-ops', label: 'Locker Surrender', icon: LogOut },
        { id: 'break-open', label: 'Break-Open Management', icon: Hammer, badge: 'RBI', badgeColor: 'bg-[#C83E44] text-white' },
      ]
    },
    {
      group: 'FINANCIAL MANAGEMENT',
      items: [
        { id: 'billing', label: 'Rent Management', icon: CreditCard },
        { id: 'rent-collection', label: 'Rent Collection', icon: DollarSign },
        { id: 'arrears', label: 'Outstanding Dues (Arrears)', icon: AlertCircle, badge: overdueLockers > 0 ? `${overdueLockers}` : undefined, badgeColor: 'bg-[#C83E44] text-white' },
        { id: 'deposits', label: 'Security Deposits & Liens', icon: Lock },
        { id: 'payment-recon', label: 'Payment Reconciliation', icon: FileSpreadsheet },
      ]
    },
    {
      group: 'CUSTOMER MANAGEMENT',
      items: [
        { id: 'customer-mgmt', label: 'Customer Portfolio', icon: Users },
        { id: 'holders', label: 'Holders and Nominees', icon: UserCheck },
        { id: 'mandates', label: 'Operating Mandates', icon: KeyRound },
        { id: 'agreements', label: 'Agreements and KYC', icon: FileText },
        { id: 'requests', label: 'Service Requests', icon: Wrench, badge: openServiceReqs > 0 ? `${openServiceReqs}` : undefined, badgeColor: 'bg-[#008C88] text-white' },
        { id: 'claims', label: 'Claims and Complaints', icon: UserX },
      ]
    },
    {
      group: 'ADMINISTRATION',
      items: [
        { id: 'branch-master', label: 'Branch Master', icon: Building2 },
        { id: 'locker-master', label: 'Locker Master', icon: Grid },
        { id: 'rent-master', label: 'Rent and Charges Master', icon: DollarSign },
        { id: 'user-mgmt', label: 'User Management', icon: Users },
        { id: 'permissions', label: 'Role × Module Permissions', icon: ShieldCheck },
        { id: 'approval-matrix', label: 'Approval Matrix', icon: BadgeCheck },
        { id: 'sla-config', label: 'SLA Configuration', icon: Sliders },
      ]
    },
    {
      group: 'REPORTS & AUDIT',
      items: [
        { id: 'rep-availability', label: 'Locker Availability Report', icon: FileSpreadsheet },
        { id: 'rep-occupancy', label: 'Occupancy MIS', icon: LineChart },
        { id: 'rep-arrears', label: 'Collection and Arrears', icon: CreditCard },
        { id: 'rep-access', label: 'Access History Folio', icon: History },
        { id: 'rep-tat', label: 'Service Request TAT', icon: Clock },
        { id: 'audit', label: 'Regulatory Audit Trail', icon: ShieldCheck },
        { id: 'reports-mis', label: 'MIS Reporting Center', icon: FileSpreadsheet },
      ]
    }
  ];

  const currentGroups = userRole === 'customer' ? customerNavGroups : enterpriseStaffNavGroups;

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
              className="hidden lg:flex p-1.5 text-[#66758C] hover:text-[#17263C] hover:bg-[#F5F7FA] rounded-lg transition-colors cursor-pointer"
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
              {userRole === 'customer' ? 'CST' : 'OPS'}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="w-2 h-2 rounded-full bg-[#16845B]" />
                <span className="text-[11px] font-bold text-[#17263C] uppercase tracking-wider truncate">
                  {userRole === 'customer' ? 'Customer Portal' : 'Safe Operations'}
                </span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#102544] text-white font-bold shrink-0">
                {currentUser.role.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Navigation Groups List */}
        <div className="flex-1 overflow-y-auto px-2 py-2.5 space-y-3.5 scrollbar-thin">
          {currentGroups.map((grp, gIdx) => {
            const isGroupCollapsed = !!collapsedGroups[grp.group];
            return (
              <div key={gIdx} className="space-y-0.5">
                {!isCollapsed && (
                  <div
                    onClick={() => toggleGroup(grp.group)}
                    className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#66758C] flex items-center justify-between cursor-pointer hover:text-[#102544] transition-colors select-none"
                  >
                    <span>{grp.group}</span>
                    {userRole !== 'customer' && (
                      <ChevronDown
                        className={`w-3 h-3 text-[#66758C] transition-transform ${
                          isGroupCollapsed ? '-rotate-90' : 'rotate-0'
                        }`}
                      />
                    )}
                  </div>
                )}

                {(!isGroupCollapsed || isCollapsed) && (
                  <div className="space-y-0.5">
                    {grp.items.map(item => {
                      const active = isCurrentActive(item.id);
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectNav(item.id)}
                          title={isCollapsed ? item.label : undefined}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative group cursor-pointer ${
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
                            {!isCollapsed && <span className="truncate text-[11.5px]">{item.label}</span>}
                          </div>

                          {!isCollapsed && item.badge && (
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9.5px] font-bold font-mono shrink-0 ${
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
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Area with User Persona Lockup & Collapse Trigger */}
        <div className="p-3 border-t border-[#E3E8F0] bg-white shrink-0">
          {isCollapsed ? (
            <button
              onClick={() => setIsCollapsed(false)}
              className="w-full py-2 flex items-center justify-center text-[#66758C] hover:text-[#17263C] hover:bg-[#F5F7FA] rounded-lg transition-colors cursor-pointer"
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

              <div className="flex items-center justify-between text-[11px] text-[#66758C] pt-0.5 px-1">
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
