import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { StatusBadge } from '../common/StatusBadge';
import { StaffUser, LockerTariffMaster, ApprovalSlaConfig, Branch } from '../../types';
import {
  Users,
  Shield,
  MapPin,
  Tag,
  Clock,
  Bell,
  FileSpreadsheet,
  Download,
  Plus,
  Edit2,
  Check,
  X,
  AlertTriangle,
  Building,
  KeyRound,
  ShieldCheck,
  Eye
} from 'lucide-react';

export const AdministrationHub: React.FC<{
  initialTab?: 'users' | 'roles' | 'branches' | 'tariffs' | 'sla' | 'templates' | 'reports';
}> = ({ initialTab }) => {
  const {
    staffUsers,
    currentUser,
    userRole,
    regions,
    branches,
    tariffMasters,
    slaConfigs,
    notificationTemplates,
    lockers,
    payments,
    accessLogs,
    auditLogs,
    updateTariff,
    updateSla,
    createStaffUser,
    toggleUserStatus,
    createBranchMaster,
    updateNotificationTemplate
  } = useBanking();

  const [activeTab, setActiveTab] = useState<
    'users' | 'roles' | 'branches' | 'tariffs' | 'sla' | 'templates' | 'reports'
  >(initialTab || 'users');

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Tariffs editing state
  const [editingTariffId, setEditingTariffId] = useState<string | null>(null);
  const [editRent, setEditRent] = useState<number>(0);
  const [editDeposit, setEditDeposit] = useState<number>(0);

  // SLA editing state
  const [editingSlaId, setEditingSlaId] = useState<string | null>(null);
  const [editSlaHours, setEditSlaHours] = useState<number>(0);

  // New Staff Modal
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<StaffUser['role']>('branch_maker');
  const [newUserBranch, setNewUserBranch] = useState(branches[0]?.name || 'Connaught Place Main Branch');
  const [newUserDesignation, setNewUserDesignation] = useState('Assistant Manager - Vaults');

  // Template Editing State
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [editTemplateBody, setEditTemplateBody] = useState<string>('');

  const handleStartEditTariff = (t: LockerTariffMaster) => {
    setEditingTariffId(t.id);
    setEditRent(t.annualRent);
    setEditDeposit(t.securityDeposit);
  };

  const handleSaveTariff = (id: string) => {
    updateTariff(id, editRent, editDeposit);
    setEditingTariffId(null);
  };

  const handleStartEditSla = (s: ApprovalSlaConfig) => {
    setEditingSlaId(s.id);
    setEditSlaHours(s.slaHours);
  };

  const handleSaveSla = (id: string) => {
    updateSla(id, editSlaHours);
    setEditingSlaId(null);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;
    const branchObj = branches.find(b => b.name === newUserBranch);
    createStaffUser({
      employeeCode: `EMP-ANB-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      designation: newUserDesignation,
      branchId: branchObj?.id || 'br-1',
      branchName: newUserBranch,
      status: 'Active',
      lastLogin: 'Never',
    });
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
  };

  const downloadReportCsv = (reportName: string, dataRows: string[][], headers: string[]) => {
    const csvContent = 'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...dataRows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${reportName}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isReadOnly = userRole === 'auditor';

  return (
    <div className="space-y-6">
      
      {/* Enterprise Page Header */}
      <div className="bg-white rounded-xl border border-[#E3E8F0] shadow-bank-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#102544]/5 text-[#102544] border border-[#102544]/15">
              Head Office Operations & Central Policy Desk
            </span>
            <span className="text-xs text-[#66758C]">Central Master Governance • FY 2026-27</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#17263C]">
            System Administration & Governance Hub
          </h1>
          <p className="text-xs text-[#66758C] mt-1">
            Maintain staff credentials, maker-checker authorization segregation, regional circle masters, tariffs & statutory SLAs.
          </p>
        </div>

        {isReadOnly ? (
          <div className="px-3.5 py-2 bg-[#B7791F]/10 border border-[#B7791F]/20 rounded-lg text-[#B7791F] flex items-center gap-2 text-xs">
            <ShieldCheck className="w-4 h-4 text-[#B7791F]" />
            <span className="font-semibold">Auditor Mode Active: Master parameters in read-only inspection mode.</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F5F7FA] border border-[#E3E8F0] text-xs font-mono text-[#102544]">
            <Building className="w-4 h-4 text-[#2457A7]" />
            <span>Master Governance Active</span>
          </div>
        )}
      </div>

      {/* Sub navigation tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        {[
          { id: 'users', label: 'Staff Users & Access', icon: Users, count: staffUsers.length },
          { id: 'roles', label: 'Maker-Checker Matrix', icon: Shield },
          { id: 'branches', label: 'Regions & Branch Vaults', icon: MapPin, count: branches.length },
          { id: 'tariffs', label: 'Locker Tariffs & Deposits', icon: Tag, count: tariffMasters.length },
          { id: 'sla', label: 'Statutory SLA Matrix', icon: Clock, count: slaConfigs.length },
          { id: 'templates', label: 'Notification Templates', icon: Bell, count: notificationTemplates.length },
          { id: 'reports', label: 'Reports & Regulatory MIS', icon: FileSpreadsheet },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shadow-xs ${
                isActive
                  ? 'bg-[#102544] text-white shadow-bank-card'
                  : 'bg-white text-[#66758C] border border-[#E3E8F0] hover:bg-[#F5F7FA] hover:text-[#17263C]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono tabular-nums ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#F5F7FA] text-[#66758C] border border-[#E3E8F0]'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Staff Users */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#17263C]">Staff Directory & Role Bindings</h3>
              <p className="text-xs text-[#66758C] mt-0.5">Authorized bank personnel assigned to strongroom custodianship, verification, and maker-checker approvals</p>
            </div>
            {!isReadOnly && (
              <button
                onClick={() => setShowAddUserModal(true)}
                className="px-3.5 py-2 bg-[#102544] hover:bg-[#0B1730] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-bank-card transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Staff User
              </button>
            )}
          </div>

          <div className="bg-white border border-[#E3E8F0] rounded-xl overflow-hidden shadow-bank-card">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F5F7FA] border-b border-[#E3E8F0] text-[#66758C] uppercase font-semibold text-[11px] tracking-wider">
                  <th className="py-3 px-4">Employee ID</th>
                  <th className="py-3 px-4">Staff Name & Designation</th>
                  <th className="py-3 px-4">Assigned Portal Role</th>
                  <th className="py-3 px-4">Branch SOL / Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last CBS Sign-in</th>
                  {!isReadOnly && <th className="py-3 px-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E8F0]">
                {staffUsers.map(user => (
                  <tr key={user.id} className="hover:bg-[#F5F7FA] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#17263C]">{user.employeeCode}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#17263C]">{user.name}</div>
                      <div className="text-[11px] text-[#66758C]">{user.email} • {user.designation}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                        user.role === 'customer'
                          ? 'bg-[#008C88]/10 text-[#008C88] border border-[#008C88]/20'
                          : user.role === 'branch_maker'
                          ? 'bg-[#2457A7]/10 text-[#2457A7] border border-[#2457A7]/20'
                          : user.role === 'branch_checker'
                          ? 'bg-[#102544]/10 text-[#102544] border border-[#102544]/20'
                          : user.role === 'branch_manager'
                          ? 'bg-[#16845B]/10 text-[#16845B] border border-[#16845B]/20'
                          : user.role === 'ho_admin'
                          ? 'bg-[#0B1730] text-white border border-[#102544]'
                          : 'bg-[#B7791F]/10 text-[#B7791F] border border-[#B7791F]/20'
                      }`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#17263C]">{user.branchName}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                        user.status === 'Active'
                          ? 'bg-[#16845B]/10 text-[#16845B] border border-[#16845B]/20'
                          : 'bg-[#C83E44]/10 text-[#C83E44] border border-[#C83E44]/20'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#66758C] text-[11px]">{user.lastLogin}</td>
                    {!isReadOnly && (
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className="px-2.5 py-1 text-xs font-semibold border border-[#E3E8F0] hover:bg-[#F5F7FA] rounded-md text-[#17263C] transition-colors"
                        >
                          {user.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Maker-Checker Roles Matrix */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#17263C]">Four-Eyes Maker-Checker Separation Matrix</h3>
            <p className="text-xs text-[#66758C] mt-0.5">Strict institutional segregation of duties preventing single-officer fraud or unauthorized unit allotment</p>
          </div>

          <div className="bg-white border border-[#E3E8F0] rounded-xl overflow-hidden shadow-bank-card">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F5F7FA] border-b border-[#E3E8F0] text-[#66758C] uppercase font-semibold text-[11px] tracking-wider">
                  <th className="py-3 px-4">Workflow Operation</th>
                  <th className="py-3 px-4 text-center">Customer</th>
                  <th className="py-3 px-4 text-center">Branch Maker</th>
                  <th className="py-3 px-4 text-center">Branch Checker</th>
                  <th className="py-3 px-4 text-center">Branch Manager</th>
                  <th className="py-3 px-4 text-center">Auditor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E8F0]">
                {[
                  { op: 'Submit Locker Application', cust: 'Yes', maker: 'No', checker: 'No', mgr: 'No', aud: 'View' },
                  { op: 'Scrutinize KYC & Specimen Signature', cust: 'No', maker: 'Verify (Maker)', checker: 'Review', mgr: 'Review', aud: 'View' },
                  { op: 'Authorize Unit Allotment & Order Key Handover', cust: 'No', maker: 'No', checker: 'Authorize (Checker)', mgr: 'Authorize', aud: 'View' },
                  { op: 'Verify Form DA-1 Nomination', cust: 'Initiate', maker: 'Verify (Maker)', checker: 'Endorse (Checker)', mgr: 'Endorse', aud: 'View' },
                  { op: 'Check-In Visitor at Strongroom Turnstile', cust: 'Token Present', maker: 'Scan & Escort', checker: 'Escort', mgr: 'Audit', aud: 'View' },
                  { op: 'Requisition Locksmith for Break-Open / Lost Key', cust: 'Report Loss', maker: 'Requisition & Quote', checker: 'Sanction Order', mgr: 'Sanction Order', aud: 'View' },
                  { op: 'Execute Vault Break-Open with 2 Independent Witnesses', cust: 'Present / Consent', maker: 'Witness', checker: 'Witness & Seal', mgr: 'Supervise', aud: 'View' },
                  { op: 'Authorize Surrender & Security Deposit Credit', cust: 'Request Closure', maker: 'Verify Keys', checker: 'Authorize Refund', mgr: 'Authorize Refund', aud: 'View' },
                  { op: 'Update Master Tariffs & Branch Parameters', cust: 'No', maker: 'No', checker: 'No', mgr: 'No (HO Only)', aud: 'View' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#F5F7FA] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#17263C]">{row.op}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-[11px]">
                      <span className={`px-2 py-0.5 rounded font-bold ${row.cust === 'Yes' || row.cust === 'Initiate' ? 'bg-[#008C88]/10 text-[#008C88] border border-[#008C88]/20' : 'text-[#66758C]'}`}>
                        {row.cust}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-[11px]">
                      <span className={`px-2 py-0.5 rounded font-bold ${row.maker.includes('Maker') || row.maker.includes('Requisition') ? 'bg-[#2457A7]/10 text-[#2457A7] border border-[#2457A7]/20' : 'text-[#66758C]'}`}>
                        {row.maker}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-[11px]">
                      <span className={`px-2 py-0.5 rounded font-bold ${row.checker.includes('Checker') || row.checker.includes('Authorize') ? 'bg-[#102544]/10 text-[#102544] border border-[#102544]/20' : 'text-[#66758C]'}`}>
                        {row.checker}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-[11px]">
                      <span className={`px-2 py-0.5 rounded font-bold ${row.mgr.includes('Authorize') || row.mgr.includes('Sanction') ? 'bg-[#16845B]/10 text-[#16845B] border border-[#16845B]/20' : 'text-[#66758C]'}`}>
                        {row.mgr}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-[11px]">
                      <span className="px-2 py-0.5 rounded font-bold bg-[#B7791F]/10 text-[#B7791F] border border-[#B7791F]/20">
                        {row.aud}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Regions & Branch Vaults */}
      {activeTab === 'branches' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#17263C]">Regional Circles & Strongroom Branches</h3>
            <p className="text-xs text-[#66758C] mt-0.5">Hierarchy of administrative zones and physical vault locations across circles</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {regions.map(r => (
              <div key={r.id} className="p-4 bg-white border border-[#E3E8F0] rounded-xl shadow-bank-card space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#66758C] text-[10px]">{r.code}</span>
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-[#2457A7]/10 text-[#2457A7] border border-[#2457A7]/20">
                    {r.totalBranches} Branches
                  </span>
                </div>
                <h4 className="font-bold text-[#17263C] text-sm">{r.name}</h4>
                <div className="text-xs text-[#66758C] space-y-1 pt-2 border-t border-[#E3E8F0]">
                  <div>Regional Head: <strong className="text-[#17263C]">{r.regionalManager}</strong></div>
                  <div>Zonal Office: {r.headOfficeCity}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[#E3E8F0] rounded-xl overflow-hidden shadow-bank-card mt-4">
            <div className="p-4 bg-slate-50/50 border-b border-[#E3E8F0] font-bold text-xs text-[#17263C] flex items-center justify-between">
              <span>Active Strongroom Locations ({branches.length})</span>
              <span className="text-[11px] font-mono text-[#66758C]">Total Capacity: {branches.reduce((a, b) => a + b.totalLockers, 0)} Units</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F5F7FA] text-[#66758C] font-semibold text-[11px] uppercase tracking-wider border-b border-[#E3E8F0]">
                    <th className="py-3 px-4">SOL ID</th>
                    <th className="py-3 px-4">Branch Name</th>
                    <th className="py-3 px-4">Regional Circle</th>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4 font-mono">Locker Capacity</th>
                    <th className="py-3 px-4 font-mono">Available Units</th>
                    <th className="py-3 px-4 font-mono">Operating Hours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E8F0]">
                  {branches.map(b => (
                    <tr key={b.id} className="hover:bg-[#F5F7FA] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#17263C]">{b.solId || b.code || b.id}</td>
                      <td className="py-3.5 px-4 font-bold text-[#17263C]">{b.name}</td>
                      <td className="py-3.5 px-4 font-mono text-[#66758C]">{b.regionName || 'North Circle'}</td>
                      <td className="py-3.5 px-4 font-medium text-[#17263C]">{b.city}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#17263C] tabular-nums">{b.totalLockers}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#16845B] tabular-nums">{b.availableLockers}</td>
                      <td className="py-3.5 px-4 font-mono text-[#66758C] text-[11px]">{b.operatingHours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Tariffs & Deposits */}
      {activeTab === 'tariffs' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#17263C]">Locker Tariff Schedule & Security Deposit Master</h3>
            <p className="text-xs text-[#66758C] mt-0.5">RBI compliant rent structure with linked 3-year rent deposit and statutory 18% GST</p>
          </div>

          <div className="bg-white border border-[#E3E8F0] rounded-xl overflow-hidden shadow-bank-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F5F7FA] border-b border-[#E3E8F0] text-[#66758C] uppercase font-semibold text-[11px] tracking-wider">
                    <th className="py-3 px-4">Size Tier</th>
                    <th className="py-3 px-4">Dimensions (H × W × D)</th>
                    <th className="py-3 px-4">Annual Rent (excl. GST)</th>
                    <th className="py-3 px-4">GST (18%)</th>
                    <th className="py-3 px-4">Total Annual Payable</th>
                    <th className="py-3 px-4">Security Deposit (Linked FD)</th>
                    {!isReadOnly && <th className="py-3 px-4 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E8F0]">
                  {tariffMasters.map(t => {
                    const isEditing = editingTariffId === t.id;
                    const gst = Math.round((isEditing ? editRent : t.annualRent) * 0.18);
                    const total = (isEditing ? editRent : t.annualRent) + gst;

                    return (
                      <tr key={t.id} className="hover:bg-[#F5F7FA] transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-[#17263C] block">{t.size}</span>
                          <span className="text-[10px] text-[#66758C]">Class {t.size[0]}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[#66758C]">{t.dimensions}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#17263C] tabular-nums">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editRent}
                              onChange={e => setEditRent(Number(e.target.value))}
                              className="w-24 p-1.5 border border-[#E3E8F0] bg-[#F5F7FA] rounded font-mono font-bold text-xs"
                            />
                          ) : (
                            `₹${t.annualRent.toLocaleString('en-IN')}`
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[#66758C] tabular-nums">
                          ₹{gst.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#16845B] tabular-nums">
                          ₹{total.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#17263C] tabular-nums">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editDeposit}
                              onChange={e => setEditDeposit(Number(e.target.value))}
                              className="w-28 p-1.5 border border-[#E3E8F0] bg-[#F5F7FA] rounded font-mono font-bold text-xs"
                            />
                          ) : (
                            `₹${t.securityDeposit.toLocaleString('en-IN')}`
                          )}
                        </td>
                        {!isReadOnly && (
                          <td className="py-3.5 px-4 text-right">
                            {isEditing ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleSaveTariff(t.id)}
                                  className="p-1.5 bg-[#16845B] text-white rounded hover:bg-[#126b4a] shadow-xs"
                                  title="Save"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingTariffId(null)}
                                  className="p-1.5 bg-[#F5F7FA] text-[#66758C] border border-[#E3E8F0] rounded hover:bg-slate-200"
                                  title="Cancel"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleStartEditTariff(t)}
                                className="px-3 py-1.5 border border-[#E3E8F0] bg-white hover:bg-[#F5F7FA] rounded-md text-[#2457A7] font-semibold text-xs flex items-center gap-1 ml-auto transition-colors"
                              >
                                <Edit2 className="w-3 h-3" />
                                Edit
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: SLA Matrix */}
      {activeTab === 'sla' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#17263C]">Customer Charter & Statutory SLA Matrix</h3>
            <p className="text-xs text-[#66758C] mt-0.5">Enforced turnaround hours for customer requests and branch operations escalations</p>
          </div>

          <div className="bg-white border border-[#E3E8F0] rounded-xl overflow-hidden shadow-bank-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F5F7FA] border-b border-[#E3E8F0] text-[#66758C] uppercase font-semibold text-[11px] tracking-wider">
                    <th className="py-3 px-4">Service Operation</th>
                    <th className="py-3 px-4">Target SLA</th>
                    <th className="py-3 px-4">Escalation Threshold</th>
                    <th className="py-3 px-4">Designated Ombudsman / Role</th>
                    {!isReadOnly && <th className="py-3 px-4 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E8F0]">
                  {slaConfigs.map(s => {
                    const isEditing = editingSlaId === s.id;
                    return (
                      <tr key={s.id} className="hover:bg-[#F5F7FA] transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#17263C]">{s.requestType}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#2457A7]">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editSlaHours}
                              onChange={e => setEditSlaHours(Number(e.target.value))}
                              className="w-20 p-1.5 border border-[#E3E8F0] bg-[#F5F7FA] rounded font-mono font-bold text-xs"
                            />
                          ) : (
                            `${s.slaHours} Hours`
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[#B7791F] font-semibold">
                          {s.escalationHours} Hours
                        </td>
                        <td className="py-3.5 px-4 text-[#17263C] font-medium">{s.escalationRole}</td>
                        {!isReadOnly && (
                          <td className="py-3.5 px-4 text-right">
                            {isEditing ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleSaveSla(s.id)}
                                  className="p-1.5 bg-[#16845B] text-white rounded hover:bg-[#126b4a] shadow-xs"
                                  title="Save"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingSlaId(null)}
                                  className="p-1.5 bg-[#F5F7FA] text-[#66758C] border border-[#E3E8F0] rounded hover:bg-slate-200"
                                  title="Cancel"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleStartEditSla(s)}
                                className="px-3 py-1.5 border border-[#E3E8F0] bg-white hover:bg-[#F5F7FA] rounded-md text-[#2457A7] font-semibold text-xs flex items-center gap-1 ml-auto transition-colors"
                              >
                                <Edit2 className="w-3 h-3" />
                                Edit SLA
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Notification Templates */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#17263C]">Regulatory Communication Templates</h3>
            <p className="text-xs text-[#66758C] mt-0.5">Standardized SMS, WhatsApp, and Email copies with dynamic CBS token parameters</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notificationTemplates.map(t => {
              const isEditing = editingTemplateId === t.id;
              return (
                <div key={t.id} className="p-5 bg-white border border-[#E3E8F0] rounded-xl shadow-bank-card space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#66758C] text-[10px]">{t.code}</span>
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-[#102544]/5 text-[#102544] border border-[#102544]/15">
                      {t.channel}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#17263C] text-xs">{t.title}</h4>
                    <span className="text-[11px] text-[#66758C] block font-mono mt-0.5">Subject: {t.subject}</span>
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        rows={4}
                        value={editTemplateBody}
                        onChange={e => setEditTemplateBody(e.target.value)}
                        className="w-full p-2.5 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg font-mono text-xs text-[#17263C] focus:outline-none focus:ring-2 focus:ring-[#2457A7]/20 focus:border-[#2457A7]"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingTemplateId(null)}
                          className="px-3 py-1.5 border border-[#E3E8F0] text-[#66758C] rounded-lg hover:bg-slate-100 text-xs font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            updateNotificationTemplate(t.id, editTemplateBody);
                            setEditingTemplateId(null);
                          }}
                          className="px-3.5 py-1.5 bg-[#102544] text-white rounded-lg text-xs font-semibold hover:bg-[#0B1730]"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg font-mono text-xs text-[#17263C] whitespace-pre-wrap leading-relaxed">
                      {t.body}
                    </div>
                  )}

                  {!isReadOnly && !isEditing && (
                    <button
                      onClick={() => {
                        setEditingTemplateId(t.id);
                        setEditTemplateBody(t.body || t.templateBody || '');
                      }}
                      className="text-[#2457A7] hover:text-[#102544] font-semibold text-xs flex items-center gap-1 transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit Message Text
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 7: Reports & Regulatory MIS */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#17263C]">Regulatory MIS & Strongroom Audit Exports</h3>
            <p className="text-xs text-[#66758C] mt-0.5">Live operational summaries ready for Head Office compliance submission and RBI audit</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Report 1: Locker Inventory & Occupancy */}
            <div className="p-5 bg-white border border-[#E3E8F0] rounded-xl shadow-bank-card space-y-3 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] text-[#66758C] block uppercase tracking-wider">REPORT ID: MIS-LKR-01</span>
                <h4 className="font-bold text-[#17263C] text-sm mt-1">Locker Occupancy & Utilization Register</h4>
                <p className="text-xs text-[#66758C] mt-1 leading-relaxed">
                  Branch-wise breakdown of total lockers, occupied compartments, vacant inventory, and overdue rentals.
                </p>
              </div>
              <button
                onClick={() => {
                  const headers = ['Locker Number', 'Branch', 'Size', 'Status', 'Operating Mode', 'Annual Rent', 'Next Renewal', 'Outstanding'];
                  const rows: string[][] = lockers.map(l => [
                    l.lockerNumber,
                    l.branchName,
                    l.size,
                    l.status,
                    l.operatingMode || 'Single',
                    String(l.annualRent),
                    l.nextRenewalDate || 'N/A',
                    String(l.outstandingRent || 0)
                  ]);
                  downloadReportCsv('Locker_Occupancy_Report', rows, headers);
                }}
                className="w-full py-2.5 bg-[#102544] hover:bg-[#0B1730] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 shadow-bank-card transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV Register
              </button>
            </div>

            {/* Report 2: Rent Collections & Taxes */}
            <div className="p-5 bg-white border border-[#E3E8F0] rounded-xl shadow-bank-card space-y-3 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] text-[#66758C] block uppercase tracking-wider">REPORT ID: MIS-REV-02</span>
                <h4 className="font-bold text-[#17263C] text-sm mt-1">Rental Realization & Tax Statement</h4>
                <p className="text-xs text-[#66758C] mt-1 leading-relaxed">
                  Transaction details, payment gateway references, CGST/SGST collected, and digital receipt references.
                </p>
              </div>
              <button
                onClick={() => {
                  const headers = ['Transaction Ref', 'Receipt Number', 'Locker Number', 'Period', 'Payment Date', 'Base Rent', 'GST', 'Total Paid', 'Method'];
                  const rows: string[][] = payments.map(p => [
                    p.transactionRef,
                    p.receiptNumber,
                    p.lockerNumber,
                    p.period,
                    p.paymentDate,
                    String(p.amount),
                    String(p.taxGst || 0),
                    String(p.totalAmount),
                    p.paymentMethod
                  ]);
                  downloadReportCsv('Rental_Realization_Tax_Report', rows, headers);
                }}
                className="w-full py-2.5 bg-[#102544] hover:bg-[#0B1730] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 shadow-bank-card transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Export Tax Ledger
              </button>
            </div>

            {/* Report 3: Vault Access & CCTV Audit */}
            <div className="p-5 bg-white border border-[#E3E8F0] rounded-xl shadow-bank-card space-y-3 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] text-[#66758C] block uppercase tracking-wider">REPORT ID: MIS-SEC-03</span>
                <h4 className="font-bold text-[#17263C] text-sm mt-1">Biometric Turnstile Access Folio</h4>
                <p className="text-xs text-[#66758C] mt-1 leading-relaxed">
                  Strongroom physical entry log, customer & custodian verification method, dual-key operation timestamp.
                </p>
              </div>
              <button
                onClick={() => {
                  const headers = ['Locker Number', 'Branch', 'Date', 'Time In', 'Time Out', 'Operated By', 'Operator Type', 'Verification Method', 'Vault Custodian', 'Remarks'];
                  const rows: string[][] = accessLogs.map(a => [
                    a.lockerNumber,
                    a.branchName,
                    a.date,
                    a.timeIn,
                    a.timeOut,
                    a.operatedBy,
                    a.operatorType,
                    a.verificationMethod,
                    a.vaultOfficer,
                    a.remarks || ''
                  ]);
                  downloadReportCsv('Biometric_Access_Audit_Folio', rows, headers);
                }}
                className="w-full py-2.5 bg-[#102544] hover:bg-[#0B1730] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 shadow-bank-card transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Export Access Audit Folio
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1730]/75 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-bank-dropdown border border-[#E3E8F0] max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-3">
              <div>
                <h3 className="font-bold text-[#102544] text-sm">Provision Staff User</h3>
                <p className="text-xs text-[#66758C] mt-0.5">Authorize new officer with role-based strongroom permissions</p>
              </div>
              <button onClick={() => setShowAddUserModal(false)} className="text-[#66758C] hover:text-[#17263C] p-1 rounded-md hover:bg-[#F5F7FA]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#17263C] mb-1">Staff Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  placeholder="e.g. Meenakshi Sundaram"
                  className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2.5 text-xs font-medium text-[#17263C] focus:outline-none focus:ring-2 focus:ring-[#2457A7]/20 focus:border-[#2457A7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17263C] mb-1">Bank Official Email</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={e => setNewUserEmail(e.target.value)}
                  placeholder="e.g. meenakshi.s@apexbank.in"
                  className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2.5 text-xs font-mono text-[#17263C] focus:outline-none focus:ring-2 focus:ring-[#2457A7]/20 focus:border-[#2457A7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17263C] mb-1">Designation</label>
                <input
                  type="text"
                  required
                  value={newUserDesignation}
                  onChange={e => setNewUserDesignation(e.target.value)}
                  className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2.5 text-xs text-[#17263C] font-medium focus:outline-none focus:ring-2 focus:ring-[#2457A7]/20 focus:border-[#2457A7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#17263C] mb-1">Portal Role</label>
                  <select
                    value={newUserRole}
                    onChange={e => setNewUserRole(e.target.value as any)}
                    className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2.5 text-xs font-medium text-[#17263C] focus:outline-none focus:ring-2 focus:ring-[#2457A7]/20 focus:border-[#2457A7]"
                  >
                    <option value="branch_maker">Branch Maker</option>
                    <option value="branch_checker">Branch Checker</option>
                    <option value="branch_manager">Branch Manager</option>
                    <option value="ho_admin">HO Admin</option>
                    <option value="auditor">Auditor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17263C] mb-1">Branch SOL</label>
                  <select
                    value={newUserBranch}
                    onChange={e => setNewUserBranch(e.target.value)}
                    className="w-full bg-[#F5F7FA] border border-[#E3E8F0] rounded-lg p-2.5 text-xs font-medium text-[#17263C] focus:outline-none focus:ring-2 focus:ring-[#2457A7]/20 focus:border-[#2457A7]"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E3E8F0]">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-3.5 py-2 border border-[#E3E8F0] text-[#66758C] hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#102544] hover:bg-[#0B1730] text-white text-xs font-semibold rounded-lg shadow-bank-card transition-colors"
                >
                  Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
