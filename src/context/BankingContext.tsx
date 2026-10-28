import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Branch,
  LockerItem,
  Holder,
  Nominee,
  Appointment,
  AccessLog,
  PaymentRecord,
  LockerApplication,
  ServiceRequest,
  ClaimRequest,
  Complaint,
  NotificationItem,
  StoredDocument,
  AuditLogItem,
  OperatingMode,
  LockerSize,
  AuthorizedOperator,
  WaitingListEntry,
  KycRefreshRecord,
  ContactUpdateRequest,
  StaffUser,
  RegionMaster,
  LockerTariffMaster,
  ApprovalSlaConfig,
  NotificationTemplate,
  AccessDispute,
  WorkflowScenario
} from '../types';
import {
  AppModule,
  AppOperation,
  checkPermission as serviceCheckPermission,
  validateMakerChecker as serviceValidateMakerChecker
} from '../services/permissionService';
import {
  mockBranches,
  mockLockers,
  mockHolders,
  mockNominees,
  mockAppointments,
  mockAccessLogs,
  mockPayments,
  mockApplications,
  mockServiceRequests,
  mockClaims,
  mockComplaints,
  mockNotifications,
  mockDocuments,
  mockAuditLogs,
  mockAuthorizedOperators,
  mockWaitingList,
  mockKycRecords,
  mockContactUpdates,
  mockStaffUsers,
  mockRegions,
  mockTariffMasters,
  mockSlaConfigs,
  mockNotificationTemplates,
  mockAccessDisputes,
  mockScenarios
} from '../data/mockData';

export type AppRoute = '/' | '/login' | '/dashboard';

interface BankingContextType {
  // Public & Authenticated Routing
  currentRoute: AppRoute;
  navigate: (route: AppRoute) => void;
  isAuthenticated: boolean;
  login: (role?: UserRole) => void;
  logout: () => void;

  // Current user & portal role
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentUser: StaffUser;
  switchUserRole: (role: UserRole) => void;
  customerView: string;
  setCustomerView: (view: string) => void;
  adminView: string;
  setAdminView: (view: string) => void;

  // Selected entities for cross-page navigation
  selectedLockerId: string;
  setSelectedLockerId: (id: string) => void;

  // Core Data
  branches: Branch[];
  lockers: LockerItem[];
  holders: Record<string, Holder[]>;
  nominees: Record<string, Nominee[]>;
  appointments: Appointment[];
  accessLogs: AccessLog[];
  payments: PaymentRecord[];
  applications: LockerApplication[];
  serviceRequests: ServiceRequest[];
  claims: ClaimRequest[];
  complaints: Complaint[];
  notifications: NotificationItem[];
  documents: StoredDocument[];
  auditLogs: AuditLogItem[];
  authorizedOperators: Record<string, AuthorizedOperator[]>;
  waitingList: WaitingListEntry[];
  kycRecords: KycRefreshRecord[];
  contactUpdates: ContactUpdateRequest[];
  accessDisputes: AccessDispute[];

  // Administration Masters Data
  staffUsers: StaffUser[];
  regions: RegionMaster[];
  tariffMasters: LockerTariffMaster[];
  slaConfigs: ApprovalSlaConfig[];
  notificationTemplates: NotificationTemplate[];
  scenarios: WorkflowScenario[];

  // Session Security Simulation
  isSessionExpired: boolean;
  triggerSessionTimeout: () => void;
  reauthenticateSession: () => void;

  // Customer actions
  applyForLocker: (app: Omit<LockerApplication, 'id' | 'applicationNumber' | 'appliedDate' | 'status'>) => string;
  joinWaitingList: (branchId: string, sizeRequested: LockerSize) => string;
  bookAppointment: (apt: Omit<Appointment, 'id' | 'tokenNumber' | 'status' | 'qrCodeToken'>) => string;
  cancelAppointment: (aptId: string) => void;
  rescheduleAppointment: (aptId: string, newDate: string, newSlot: string) => void;
  payLockerRent: (lockerId: string, method: PaymentRecord['paymentMethod']) => void;
  addNominee: (lockerId: string, nomineeData: Omit<Nominee, 'id' | 'lockerId' | 'status' | 'formDa1Reference' | 'registeredOn'>) => void;
  cancelNominee: (nomineeId: string, lockerId: string) => void;
  addAuthorizedOperator: (lockerId: string, operatorData: Omit<AuthorizedOperator, 'id' | 'lockerId' | 'status'>) => void;
  revokeAuthorizedOperator: (lockerId: string, operatorId: string) => void;
  createServiceRequest: (sr: Omit<ServiceRequest, 'id' | 'ticketNumber' | 'createdDate' | 'lastUpdated' | 'timeline' | 'status'>) => string;
  submitClaim: (claim: Omit<ClaimRequest, 'id' | 'claimNumber' | 'submittedDate' | 'status'>) => string;
  raiseComplaint: (comp: Omit<Complaint, 'id' | 'complaintNumber' | 'createdDate' | 'status' | 'assignedTo'>) => string;
  restrictLockerAccess: (lockerId: string, reason: string) => void;
  unrestrictLockerAccess: (lockerId: string) => void;
  renewAgreement: (lockerId: string) => void;
  submitKycRefresh: (lockerId: string, aadhaarNo: string, panNo: string) => void;
  submitContactUpdate: (newMobile: string, newEmail: string, newAddress: string, reason: string) => void;
  requestOfficialDocument: (category: StoredDocument['category'], lockerNumber: string) => void;
  initiateClosure: (lockerId: string, reason: string) => string;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  logAccessDispute: (accessLogId: string, reason: string) => string;

  // Permission & Maker-Checker Policy Engine
  checkPermission: (module: AppModule, operation: AppOperation) => { allowed: boolean; reason?: string };
  validateMakerChecker: (makerActorNameOrId?: string) => { allowed: boolean; reason?: string };

  // Admin Maker-Checker Actions
  adminMakerVerifyApplication: (appId: string, notes: string) => void;
  adminCheckerApproveApplication: (appId: string, specificLockerNumber?: string) => { success: boolean; error?: string };
  adminApproveApplication: (appId: string, specificLockerNumber?: string) => void;
  adminRejectApplication: (appId: string, reason: string) => void;
  adminAllocateWaitlist: (waitlistId: string, lockerId: string) => void;
  adminCheckInAppointment: (aptId: string) => void;
  adminCompleteAppointment: (aptId: string, remarks: string) => void;
  adminMakerVerifyNominee: (nomineeId: string, lockerId: string, notes: string) => void;
  adminCheckerApproveNominee: (nomineeId: string, lockerId: string) => { success: boolean; error?: string };
  adminApproveNominee: (nomineeId: string, lockerId: string) => void;
  adminRejectNominee: (nomineeId: string, lockerId: string) => void;
  adminApproveAuthorizedOperator: (operatorId: string, lockerId: string) => void;
  adminApproveKycRefresh: (recordId: string) => void;
  adminApproveContactUpdate: (updateId: string) => void;
  adminMakerReviewServiceRequest: (srId: string, notes: string, estimatedCost?: number) => void;
  adminCheckerApproveServiceRequest: (srId: string, remarks: string) => { success: boolean; error?: string };
  adminUpdateServiceRequest: (srId: string, status: ServiceRequest['status'], remarks: string, cost?: number) => void;
  adminUpdateClaimStage: (claimId: string, stage: ClaimRequest['status'], remarks: string) => void;
  adminResolveComplaint: (compId: string, resolutionNote: string) => void;
  adminFinalizeClosure: (lockerId: string, srId: string) => void;
  adminUpdateLockerStatus: (lockerId: string, status: LockerItem['status']) => void;
  resolveAccessDispute: (disputeId: string, remarks: string, cctvStatus: AccessDispute['cctvFootageStatus'], status: AccessDispute['status']) => void;

  // Head Office & Admin Configuration Actions
  updateTariff: (id: string, annualRent: number, securityDeposit: number) => void;
  updateSla: (id: string, slaHours: number) => void;
  createStaffUser: (user: Omit<StaffUser, 'id'>) => void;
  toggleUserStatus: (id: string) => void;
  createBranchMaster: (branch: Omit<Branch, 'id'>) => void;
  updateNotificationTemplate: (id: string, body: string) => void;

  // Workflow Scenarios & Quality Gate
  executeScenarioStep: (scenarioId: string, stepNumber: number) => void;
  runFullScenario: (scenarioId: string) => void;
  executeAllScenarios: () => void;
  resetScenarios: () => void;
  isQaSuiteOpen: boolean;
  setIsQaSuiteOpen: (open: boolean) => void;

  // Global reset for testing
  resetDemoData: () => void;
}

const BankingContext = createContext<BankingContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'national_bank_safevault_v1';

export const BankingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Public & Authenticated Routing State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/login') return '/login';
      if (path === '/dashboard') return '/login'; // Unauthenticated users cannot access /dashboard
      return '/';
    }
    return '/';
  });

  const [userRole, setUserRole] = useState<UserRole>('customer');
  const [customerView, setCustomerView] = useState<string>('dashboard');
  const [adminView, setAdminView] = useState<string>('admin-dashboard');
  const [selectedLockerId, setSelectedLockerId] = useState<string>('lck-125');

  // Master State with lazy localStorage init
  const [branches, setBranches] = useState<Branch[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_branches`);
    return saved ? JSON.parse(saved) : mockBranches;
  });

  const [lockers, setLockers] = useState<LockerItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_lockers`);
    return saved ? JSON.parse(saved) : mockLockers;
  });

  const [holders, setHolders] = useState<Record<string, Holder[]>>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_holders`);
    return saved ? JSON.parse(saved) : mockHolders;
  });

  const [nominees, setNominees] = useState<Record<string, Nominee[]>>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_nominees`);
    return saved ? JSON.parse(saved) : mockNominees;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_appointments`);
    return saved ? JSON.parse(saved) : mockAppointments;
  });

  const [accessLogs, setAccessLogs] = useState<AccessLog[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_accessLogs`);
    return saved ? JSON.parse(saved) : mockAccessLogs;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_payments`);
    return saved ? JSON.parse(saved) : mockPayments;
  });

  const [applications, setApplications] = useState<LockerApplication[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_applications`);
    return saved ? JSON.parse(saved) : mockApplications;
  });

  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_serviceRequests`);
    return saved ? JSON.parse(saved) : mockServiceRequests;
  });

  const [claims, setClaims] = useState<ClaimRequest[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_claims`);
    return saved ? JSON.parse(saved) : mockClaims;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_complaints`);
    return saved ? JSON.parse(saved) : mockComplaints;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_notifications`);
    return saved ? JSON.parse(saved) : mockNotifications;
  });

  const [documents, setDocuments] = useState<StoredDocument[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_documents`);
    return saved ? JSON.parse(saved) : mockDocuments;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_auditLogs`);
    return saved ? JSON.parse(saved) : mockAuditLogs;
  });

  const [authorizedOperators, setAuthorizedOperators] = useState<Record<string, AuthorizedOperator[]>>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_authorizedOperators`);
    return saved ? JSON.parse(saved) : mockAuthorizedOperators;
  });

  const [waitingList, setWaitingList] = useState<WaitingListEntry[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_waitingList`);
    return saved ? JSON.parse(saved) : mockWaitingList;
  });

  const [kycRecords, setKycRecords] = useState<KycRefreshRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_kycRecords`);
    return saved ? JSON.parse(saved) : mockKycRecords;
  });

  const [contactUpdates, setContactUpdates] = useState<ContactUpdateRequest[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_contactUpdates`);
    return saved ? JSON.parse(saved) : mockContactUpdates;
  });

  const [staffUsers, setStaffUsers] = useState<StaffUser[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_staffUsers`);
    return saved ? JSON.parse(saved) : mockStaffUsers;
  });

  const [currentUser, setCurrentUser] = useState<StaffUser>(() => {
    return mockStaffUsers.find(u => u.role === 'customer') || mockStaffUsers[0];
  });

  const [regions, setRegions] = useState<RegionMaster[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_regions`);
    return saved ? JSON.parse(saved) : mockRegions;
  });

  const [tariffMasters, setTariffMasters] = useState<LockerTariffMaster[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_tariffs`);
    return saved ? JSON.parse(saved) : mockTariffMasters;
  });

  const [slaConfigs, setSlaConfigs] = useState<ApprovalSlaConfig[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_slaConfigs`);
    return saved ? JSON.parse(saved) : mockSlaConfigs;
  });

  const [notificationTemplates, setNotificationTemplates] = useState<NotificationTemplate[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_notifTemplates`);
    return saved ? JSON.parse(saved) : mockNotificationTemplates;
  });

  const [accessDisputes, setAccessDisputes] = useState<AccessDispute[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_disputes`);
    return saved ? JSON.parse(saved) : mockAccessDisputes;
  });

  const [scenarios, setScenarios] = useState<WorkflowScenario[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_scenarios`);
    return saved ? JSON.parse(saved) : mockScenarios;
  });

  const [isSessionExpired, setIsSessionExpired] = useState<boolean>(false);
  const [isQaSuiteOpen, setIsQaSuiteOpen] = useState<boolean>(false);

  const checkPermission = (module: AppModule, operation: AppOperation) => {
    return serviceCheckPermission(userRole, module, operation);
  };

  const validateMakerChecker = (makerActorNameOrId?: string) => {
    return serviceValidateMakerChecker(currentUser, makerActorNameOrId);
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_lockers`, JSON.stringify(lockers));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_branches`, JSON.stringify(branches));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_holders`, JSON.stringify(holders));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_nominees`, JSON.stringify(nominees));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_appointments`, JSON.stringify(appointments));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_accessLogs`, JSON.stringify(accessLogs));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_payments`, JSON.stringify(payments));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_applications`, JSON.stringify(applications));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_serviceRequests`, JSON.stringify(serviceRequests));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_claims`, JSON.stringify(claims));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_complaints`, JSON.stringify(complaints));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_notifications`, JSON.stringify(notifications));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_documents`, JSON.stringify(documents));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_auditLogs`, JSON.stringify(auditLogs));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_authorizedOperators`, JSON.stringify(authorizedOperators));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_waitingList`, JSON.stringify(waitingList));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_kycRecords`, JSON.stringify(kycRecords));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_contactUpdates`, JSON.stringify(contactUpdates));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_staffUsers`, JSON.stringify(staffUsers));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_regions`, JSON.stringify(regions));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_tariffs`, JSON.stringify(tariffMasters));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_slaConfigs`, JSON.stringify(slaConfigs));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_notifTemplates`, JSON.stringify(notificationTemplates));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_disputes`, JSON.stringify(accessDisputes));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_scenarios`, JSON.stringify(scenarios));
    } catch {
      // ignore storage quota issues
    }
  }, [
    lockers,
    branches,
    holders,
    nominees,
    appointments,
    accessLogs,
    payments,
    applications,
    serviceRequests,
    claims,
    complaints,
    notifications,
    documents,
    auditLogs,
    authorizedOperators,
    waitingList,
    kycRecords,
    contactUpdates,
    staffUsers,
    regions,
    tariffMasters,
    slaConfigs,
    notificationTemplates,
    accessDisputes,
    scenarios
  ]);

  // Helper to append audit log
  const addAudit = (
    user: string,
    userRole: AuditLogItem['userRole'],
    action: string,
    entityType: AuditLogItem['entityType'],
    entityId: string,
    branchName: string,
    details: string
  ) => {
    const newLog: AuditLogItem = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST',
      user,
      userRole,
      action,
      entityType,
      entityId,
      branchName,
      ipAddress: userRole === 'Customer' ? '122.161.49.80 (2FA Verified)' : '10.14.88.22 (Branch Intranet)',
      status: 'Success',
      details,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Helper to add notification
  const addNotification = (title: string, message: string, category: NotificationItem['category']) => {
    const item: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      category,
      read: false,
    };
    setNotifications(prev => [item, ...prev]);
  };

  // Customer actions
  const applyForLocker = (appData: Omit<LockerApplication, 'id' | 'applicationNumber' | 'appliedDate' | 'status'>) => {
    const appId = `app-${Date.now()}`;
    const appNum = `APP-2026-${appData.branchName.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp: LockerApplication = {
      ...appData,
      id: appId,
      applicationNumber: appNum,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Submitted',
    };
    setApplications(prev => [newApp, ...prev]);
    addAudit('Rahul Sharma', 'Customer', 'Locker Application Submitted', 'Locker', appNum, appData.branchName, `Applied for ${appData.sizeRequested} locker under ${appData.operatingMode} mode.`);
    addNotification('Application Submitted', `Application ${appNum} submitted successfully for ${appData.sizeRequested} locker at ${appData.branchName}.`, 'Service Request');
    return appNum;
  };

  const joinWaitingList = (branchId: string, sizeRequested: LockerSize) => {
    const branch = branches.find(b => b.id === branchId) || branches[0];
    const wlCode = `WL-${branch.name.substring(0, 3).toUpperCase()}-${sizeRequested.substring(0, 2).toUpperCase()}-${Math.floor(10 + Math.random() * 89)}`;
    const newEntry: WaitingListEntry = {
      id: `wl-${Date.now()}`,
      waitlistCode: wlCode,
      customerName: 'Rahul Sharma',
      cifNumber: 'CIF-9028192831',
      phone: '+91 98101 23456',
      email: 'rahul.sharma@enterprise-corp.in',
      branchId: branch.id,
      branchName: branch.name,
      sizeRequested,
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'Waiting',
      priorityScore: 95,
    };
    setWaitingList(prev => [newEntry, ...prev]);
    addAudit('Rahul Sharma', 'Customer', 'Joined Branch Locker Waiting List', 'Waitlist', wlCode, branch.name, `Position registered for ${sizeRequested} compartment.`);
    addNotification('Waiting List Registered', `Position registered under code ${wlCode} for ${sizeRequested} locker at ${branch.name}. You will be notified when a unit is vacated.`, 'Service Request');
    return wlCode;
  };

  const bookAppointment = (aptData: Omit<Appointment, 'id' | 'tokenNumber' | 'status' | 'qrCodeToken'>) => {
    const aptId = `apt-${Date.now()}`;
    const token = `VLT-${aptData.branchName.substring(0, 3).toUpperCase()}-2610-${Math.floor(10 + Math.random() * 89)}`;
    const qrToken = `ANB-QR-${aptData.lockerNumber}-${Date.now().toString().slice(-4)}`;
    const newApt: Appointment = {
      ...aptData,
      id: aptId,
      tokenNumber: token,
      status: 'Confirmed',
      qrCodeToken: qrToken,
    };
    setAppointments(prev => [newApt, ...prev]);
    addAudit(aptData.customerName, 'Customer', 'Vault Visit Booked', 'Appointment', token, aptData.branchName, `Slot reserved for ${aptData.date} at ${aptData.timeSlot} (${aptData.purpose}).`);
    addNotification('Appointment Confirmed', `Token ${token} issued for Locker ${aptData.lockerNumber} on ${aptData.date} (${aptData.timeSlot}).`, 'Appointment');
    return token;
  };

  const cancelAppointment = (aptId: string) => {
    setAppointments(prev => prev.map(a => a.id === aptId ? { ...a, status: 'Cancelled' } : a));
    const apt = appointments.find(a => a.id === aptId);
    if (apt) {
      addAudit('Rahul Sharma', 'Customer', 'Appointment Cancelled', 'Appointment', apt.tokenNumber, apt.branchName, `Customer cancelled slot for ${apt.date}.`);
      addNotification('Appointment Cancelled', `Your visit appointment ${apt.tokenNumber} has been cancelled.`, 'Appointment');
    }
  };

  const rescheduleAppointment = (aptId: string, newDate: string, newSlot: string) => {
    setAppointments(prev => prev.map(a => a.id === aptId ? { ...a, date: newDate, timeSlot: newSlot, status: 'Rescheduled' } : a));
    const apt = appointments.find(a => a.id === aptId);
    if (apt) {
      addAudit('Rahul Sharma', 'Customer', 'Appointment Rescheduled', 'Appointment', apt.tokenNumber, apt.branchName, `Slot updated to ${newDate} (${newSlot}).`);
      addNotification('Appointment Rescheduled', `Your appointment ${apt.tokenNumber} is rescheduled to ${newDate} at ${newSlot}.`, 'Appointment');
    }
  };

  const payLockerRent = (lockerId: string, method: PaymentRecord['paymentMethod']) => {
    const targetLocker = lockers.find(l => l.id === lockerId);
    if (!targetLocker) return;

    const rentAmount = targetLocker.annualRent;
    const gst = Math.round(rentAmount * 0.18);
    const total = rentAmount + gst;
    const txnRef = `TXN-ANB-${Date.now()}`;
    const rcpNum = `RCP-2026-${targetLocker.branchName.substring(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      transactionRef: txnRef,
      lockerId,
      lockerNumber: targetLocker.lockerNumber,
      period: 'FY 2026 - 2027',
      amount: rentAmount,
      taxGst: gst,
      totalAmount: total,
      paymentDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      paymentMethod: method,
      status: 'Success',
      receiptNumber: rcpNum,
    };

    setPayments(prev => [newPayment, ...prev]);

    // Update locker outstanding and renewal date
    setLockers(prev => prev.map(l => {
      if (l.id === lockerId) {
        return {
          ...l,
          outstandingRent: 0,
          nextRenewalDate: '28 Nov 2027',
        };
      }
      return l;
    }));

    // Add receipt to document vault
    const doc: StoredDocument = {
      id: `doc-${Date.now()}`,
      title: `Annual Locker Rental Receipt & Tax Invoice - Locker ${targetLocker.lockerNumber}`,
      category: 'Payment Receipt',
      issueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      fileSize: '460 KB',
      documentRef: rcpNum,
      signedStatus: 'System Generated',
    };
    setDocuments(prev => [doc, ...prev]);

    addAudit('Rahul Sharma', 'Customer', 'Locker Rent Paid', 'Payment', rcpNum, targetLocker.branchName, `Paid ₹${total} via ${method}. Receipt generated.`);
    addNotification('Payment Successful', `Rent of ₹${total} for Locker ${targetLocker.lockerNumber} received. Receipt ${rcpNum} is available in Document Vault.`, 'Billing');
  };

  const addNominee = (lockerId: string, nomineeData: Omit<Nominee, 'id' | 'lockerId' | 'status' | 'formDa1Reference' | 'registeredOn'>) => {
    const targetLocker = lockers.find(l => l.id === lockerId);
    const formRef = `DA1-2026-${targetLocker?.branchName.substring(0, 3).toUpperCase() || 'DEL'}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newNominee: Nominee = {
      ...nomineeData,
      id: `nom-${Date.now()}`,
      lockerId,
      status: 'Pending Approval',
      formDa1Reference: formRef,
      registeredOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    setNominees(prev => ({
      ...prev,
      [lockerId]: [...(prev[lockerId] || []), newNominee],
    }));

    addAudit('Rahul Sharma', 'Customer', 'Nomination Submitted (Form DA-1)', 'Nominee', formRef, targetLocker?.branchName || 'Branch', `Nomination registered for ${nomineeData.name} (${nomineeData.relationship}). Awaiting bank branch verification.`);
    addNotification('Nomination Request Submitted', `Form DA-1 for ${nomineeData.name} submitted under Ref ${formRef}. Pending branch custodian verification.`, 'Service Request');
  };

  const cancelNominee = (nomineeId: string, lockerId: string) => {
    const targetLocker = lockers.find(l => l.id === lockerId);
    const nom = (nominees[lockerId] || []).find(n => n.id === nomineeId);
    const formDa2Ref = `DA2-2026-${targetLocker?.branchName.substring(0, 3).toUpperCase() || 'DEL'}-${Math.floor(1000 + Math.random() * 9000)}`;

    setNominees(prev => {
      const list = prev[lockerId] || [];
      return {
        ...prev,
        [lockerId]: list.map(n => n.id === nomineeId ? { ...n, status: 'Cancelled' } : n)
      };
    });

    // Generate Form DA-2 cancellation certificate in vault
    const doc: StoredDocument = {
      id: `doc-${Date.now()}`,
      title: `Form DA-2 Cancellation of Nomination Certificate - ${nom?.name}`,
      category: 'Nomination Form DA-1',
      issueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      fileSize: '480 KB',
      documentRef: formDa2Ref,
      signedStatus: 'Digitally e-Signed',
    };
    setDocuments(prev => [doc, ...prev]);

    addAudit('Rahul Sharma', 'Customer', 'Nomination Cancelled (Form DA-2)', 'Nominee', formDa2Ref, targetLocker?.branchName || 'Branch', `Nomination for ${nom?.name} revoked under Section 45ZB.`);
    addNotification('Nomination Cancelled', `Nomination for ${nom?.name} cancelled under Form DA-2 (${formDa2Ref}).`, 'Service Request');
  };

  const addAuthorizedOperator = (lockerId: string, opData: Omit<AuthorizedOperator, 'id' | 'lockerId' | 'status'>) => {
    const newOp: AuthorizedOperator = {
      ...opData,
      id: `op-${Date.now()}`,
      lockerId,
      status: 'Pending Verification',
    };
    setAuthorizedOperators(prev => ({
      ...prev,
      [lockerId]: [...(prev[lockerId] || []), newOp],
    }));
    const target = lockers.find(l => l.id === lockerId);
    addAudit('Rahul Sharma', 'Customer', 'Authorized Operator Added', 'Locker', target?.lockerNumber || lockerId, target?.branchName || 'Branch', `Registered operator ${opData.name} under ${opData.mandateType}.`);
    addNotification('Operator Mandate Registered', `Authorization request for ${opData.name} submitted for Locker ${target?.lockerNumber}. Awaiting branch verification.`, 'Service Request');
  };

  const revokeAuthorizedOperator = (lockerId: string, operatorId: string) => {
    setAuthorizedOperators(prev => {
      const list = prev[lockerId] || [];
      return {
        ...prev,
        [lockerId]: list.map(o => o.id === operatorId ? { ...o, status: 'Revoked' } : o)
      };
    });
    const target = lockers.find(l => l.id === lockerId);
    addAudit('Rahul Sharma', 'Customer', 'Authorized Operator Revoked', 'Locker', target?.lockerNumber || lockerId, target?.branchName || 'Branch', `Revoked operator authorization.`);
    addNotification('Operator Revoked', `Operator authority revoked successfully for Locker ${target?.lockerNumber}.`, 'Security');
  };

  const submitKycRefresh = (lockerId: string, aadhaarNo: string, panNo: string) => {
    setKycRecords(prev => prev.map(k => k.lockerId === lockerId ? {
      ...k,
      status: 'Under Scrutiny',
      submittedAadhaar: aadhaarNo,
      submittedPan: panNo,
      submittedAddressProof: 'Aadhaar Verified Offline e-KYC XML',
    } : k));
    const target = lockers.find(l => l.id === lockerId);
    addAudit('Rahul Sharma', 'Customer', 'Periodic KYC Refresh Submitted', 'KYC', target?.lockerNumber || lockerId, target?.branchName || 'Branch', `Submitted digital e-KYC documents for periodic refresh.`);
    addNotification('KYC Documents Submitted', `Periodic KYC documents received for Locker ${target?.lockerNumber}. Branch AML/Compliance cell is verifying.`, 'Agreement');
  };

  const submitContactUpdate = (newMobile: string, newEmail: string, newAddress: string, reason: string) => {
    const updateReq: ContactUpdateRequest = {
      id: `cu-${Date.now()}`,
      cifNumber: 'CIF-9028192831',
      customerName: 'Rahul Sharma',
      newMobile,
      newEmail,
      newAddress,
      reason,
      status: 'Pending Verification',
      submittedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setContactUpdates(prev => [updateReq, ...prev]);
    addAudit('Rahul Sharma', 'Customer', 'Contact Update Requested', 'Locker', 'CIF-9028192831', 'Main Branch', `Requested contact update: Mobile ${newMobile}.`);
    addNotification('Contact Update Initiated', `Contact details update request logged. Pending branch operations manager confirmation.`, 'Service Request');
  };

  const requestOfficialDocument = (category: StoredDocument['category'], lockerNumber: string) => {
    const ref = `ANB/CERT/${lockerNumber}/${Math.floor(1000 + Math.random() * 9000)}`;
    const docTitle =
      category === 'Safe Custody Certificate'
        ? `Official Safe Custody & Non-Encumbrance Certificate - Locker ${lockerNumber}`
        : `Official Bank Certified Document Extract - Locker ${lockerNumber}`;

    const newDoc: StoredDocument = {
      id: `doc-${Date.now()}`,
      title: docTitle,
      category,
      issueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      fileSize: '540 KB',
      documentRef: ref,
      signedStatus: 'Digitally e-Signed',
    };
    setDocuments(prev => [newDoc, ...prev]);
    addAudit('Rahul Sharma', 'Customer', 'Official Document Generated', 'Agreement', ref, 'Main Branch', `Generated certified ${category} for Locker ${lockerNumber}.`);
    addNotification('Certified Document Generated', `${docTitle} is now available in your Document Vault.`, 'Service Request');
  };

  const createServiceRequest = (sr: Omit<ServiceRequest, 'id' | 'ticketNumber' | 'createdDate' | 'lastUpdated' | 'timeline' | 'status'>) => {
    const ticket = `SR-2026-${sr.branchName.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const newSr: ServiceRequest = {
      ...sr,
      id: `sr-${Date.now()}`,
      ticketNumber: ticket,
      status: 'Open',
      createdDate: nowStr,
      lastUpdated: nowStr,
      timeline: [
        {
          status: 'Request Logged',
          timestamp: `${nowStr}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          actor: 'Customer Portal',
          note: sr.description,
        }
      ]
    };
    setServiceRequests(prev => [newSr, ...prev]);
    addAudit(sr.customerName, 'Customer', 'Service Request Logged', 'ServiceRequest', ticket, sr.branchName, `Logged request: ${sr.requestType}`);
    addNotification('Service Request Raised', `Ticket ${ticket} created for ${sr.requestType} (Locker ${sr.lockerNumber}).`, 'Service Request');
    return ticket;
  };

  const submitClaim = (claim: Omit<ClaimRequest, 'id' | 'claimNumber' | 'submittedDate' | 'status'>) => {
    const clmNum = `CLM-2026-DEL-${Math.floor(1000 + Math.random() * 9000)}`;
    const newClaim: ClaimRequest = {
      ...claim,
      id: `clm-${Date.now()}`,
      claimNumber: clmNum,
      submittedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Claim Registered',
    };
    setClaims(prev => [newClaim, ...prev]);
    addAudit(claim.claimantName, 'Customer', 'Deceased Holder Claim Registered', 'Claim', clmNum, 'Main Branch', `Claim filed for Locker ${claim.lockerNumber} by ${claim.claimantName} (${claim.claimantRelationship}).`);
    addNotification('Deceased Claim Registered', `Claim ${clmNum} registered. Branch legal & custody committee will verify the uploaded certificates.`, 'Service Request');
    return clmNum;
  };

  const raiseComplaint = (comp: Omit<Complaint, 'id' | 'complaintNumber' | 'createdDate' | 'status' | 'assignedTo'>) => {
    const compNum = `CMP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newComp: Complaint = {
      ...comp,
      id: `cmp-${Date.now()}`,
      complaintNumber: compNum,
      createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Open',
      assignedTo: 'Branch Quality & Ombudsman Cell',
    };
    setComplaints(prev => [newComp, ...prev]);
    addAudit(comp.customerName, 'Customer', 'Complaint Lodged', 'ServiceRequest', compNum, 'Branch', `Category: ${comp.category}. SLA: ${comp.slaTargetHours}h.`);
    addNotification('Complaint Lodged', `Complaint ${compNum} recorded with SLA target ${comp.slaTargetHours} hours.`, 'Service Request');
    return compNum;
  };

  const restrictLockerAccess = (lockerId: string, reason: string) => {
    setLockers(prev => prev.map(l => l.id === lockerId ? { ...l, status: 'Blocked' } : l));
    const target = lockers.find(l => l.id === lockerId);
    addAudit('Rahul Sharma', 'Customer', 'Locker Access Restricted / Frozen', 'Locker', target?.lockerNumber || lockerId, target?.branchName || 'Branch', `Temporary lock initiated by customer. Reason: ${reason}`);
    addNotification('Access Restricted', `Locker ${target?.lockerNumber} has been temporarily blocked for security. Contact branch custodian to lift.`, 'Security');
  };

  const unrestrictLockerAccess = (lockerId: string) => {
    setLockers(prev => prev.map(l => l.id === lockerId ? { ...l, status: 'Occupied' } : l));
    const target = lockers.find(l => l.id === lockerId);
    addAudit('Rahul Sharma', 'Customer', 'Locker Access Restriction Lifted', 'Locker', target?.lockerNumber || lockerId, target?.branchName || 'Branch', 'Customer verified via 2FA and unblocked locker.');
    addNotification('Access Restored', `Security freeze on Locker ${target?.lockerNumber} lifted successfully.`, 'Security');
  };

  const renewAgreement = (lockerId: string) => {
    const target = lockers.find(l => l.id === lockerId);
    const docRef = `ANB/LKR-AGR/RENEW/${Date.now().toString().slice(-4)}`;
    const doc: StoredDocument = {
      id: `doc-${Date.now()}`,
      title: `Executed Stamped Model Locker Agreement - Locker ${target?.lockerNumber}`,
      category: 'Locker Agreement',
      issueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      fileSize: '2.4 MB',
      documentRef: docRef,
      signedStatus: 'Digitally e-Signed',
    };
    setDocuments(prev => [doc, ...prev]);
    addAudit('Rahul Sharma', 'Customer', 'Locker Agreement Re-Executed', 'Agreement', docRef, target?.branchName || 'Branch', 'Digitally consented via Aadhaar e-Sign simulation as per RBI guidelines.');
    addNotification('Agreement Re-Executed', `Locker ${target?.lockerNumber} agreement digitally renewed & stored under ${docRef}.`, 'Agreement');
  };

  const initiateClosure = (lockerId: string, reason: string) => {
    const target = lockers.find(l => l.id === lockerId);
    const ticket = createServiceRequest({
      customerId: 'cust-rahul-01',
      customerName: 'Rahul Sharma',
      lockerId,
      lockerNumber: target?.lockerNumber || '',
      branchName: target?.branchName || '',
      requestType: 'Surrender Locker',
      description: `Customer initiated locker surrender. Reason: ${reason}. Security deposit refund requested.`,
    });
    return ticket;
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Browser History & Route Handling
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname as AppRoute;
      if (path === '/dashboard' && !isAuthenticated) {
        setCurrentRoute('/login');
      } else if (path === '/login' || path === '/dashboard' || path === '/') {
        setCurrentRoute(path);
      } else {
        setCurrentRoute('/');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated]);

  const navigate = (route: AppRoute) => {
    if (route === '/dashboard' && !isAuthenticated) {
      setCurrentRoute('/login');
      if (typeof window !== 'undefined') window.history.pushState({}, '', '/login');
      return;
    }
    setCurrentRoute(route);
    if (typeof window !== 'undefined') window.history.pushState({}, '', route);
  };

  const login = (role?: UserRole) => {
    setIsAuthenticated(true);
    const targetRole = role || userRole;
    setUserRole(targetRole);
    const found = staffUsers.find(u => u.role === targetRole) || mockStaffUsers.find(u => u.role === targetRole) || mockStaffUsers[0];
    setCurrentUser(found);

    // Redirect to the correct role-based portal
    if (targetRole === 'customer') {
      setCustomerView('dashboard');
    } else if (targetRole === 'branch_maker') {
      setAdminView('admin-dashboard');
    } else if (targetRole === 'branch_checker' || targetRole === 'branch_manager') {
      setAdminView('admin-dashboard');
    } else if (targetRole === 'ho_admin') {
      setAdminView('administration');
    } else if (targetRole === 'auditor') {
      setAdminView('audit');
    }

    addAudit(found.name, targetRole === 'customer' ? 'Customer' : 'Branch Manager', 'User Authentication Successful', 'Locker', found.employeeCode || 'AUTH-200', found.branchName, `Authenticated successfully into ${targetRole} portal.`);
    setCurrentRoute('/dashboard');
    if (typeof window !== 'undefined') window.history.pushState({}, '', '/dashboard');
  };

  const logout = () => {
    setIsAuthenticated(false);
    addAudit(currentUser.name, userRole === 'customer' ? 'Customer' : 'Branch Manager', 'User Session Terminated (Logout)', 'Locker', 'AUTH-LOGOUT', currentUser.branchName, 'Session closed by user.');
    setCurrentRoute('/login');
    if (typeof window !== 'undefined') window.history.pushState({}, '', '/login');
  };

  const switchUserRole = (role: UserRole) => {
    setUserRole(role);
    const found = staffUsers.find(u => u.role === role) || mockStaffUsers.find(u => u.role === role) || mockStaffUsers[0];
    setCurrentUser(found);
    if (role === 'customer') {
      setCustomerView('dashboard');
    } else {
      setAdminView('admin-dashboard');
    }
    addAudit(found.name, role === 'customer' ? 'Customer' : 'Branch Manager', 'Session Persona Switched', 'Locker', found.employeeCode || found.employeeId || 'STAFF', found.branchName, `Active session switched to ${found.designation || found.roleTitle || role} (${role}).`);
  };

  const triggerSessionTimeout = () => {
    setIsSessionExpired(true);
    addAudit(currentUser.name, userRole === 'customer' ? 'Customer' : 'Branch Manager', 'Session Inactivity Expired', 'Locker', 'SEC-TIMEOUT-401', 'CBS Gateway', 'Session terminated due to inactivity. Re-authentication challenged.');
  };

  const reauthenticateSession = () => {
    setIsSessionExpired(false);
    addAudit(currentUser.name, userRole === 'customer' ? 'Customer' : 'Branch Manager', '2FA Re-Authentication Successful', 'Locker', 'SEC-AUTH-200', 'CBS Gateway', 'Biometric / MPIN challenge verified. Active session token re-issued.');
    addNotification('Session Re-established', 'Your secure banking session has been authenticated and extended.', 'Security');
  };

  const logAccessDispute = (accessLogId: string, reason: string) => {
    const log = accessLogs.find(a => a.id === accessLogId);
    const disputeId = `disp-${Date.now()}`;
    const disputeNumber = `DISP-2026-VLT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDispute: AccessDispute = {
      id: disputeId,
      disputeNumber,
      accessLogId,
      lockerId: log?.lockerId || 'lck-125',
      lockerNumber: log?.lockerNumber || 'A-108',
      branchName: log?.branchName || 'Connaught Place Main Branch',
      reportedBy: 'Rahul Sharma (Primary Holder)',
      reportedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      accessDate: log?.date || new Date().toLocaleDateString('en-GB'),
      accessTime: log?.timeIn || '10:00 AM',
      customerReason: reason,
      customerRemarks: reason,
      status: 'Under Security Review',
      cctvFootageStatus: 'Reviewing Turnstile Vault 4K Stream',
      assignedInvestigator: 'Vigilance & Vault Security Wing',
    };
    setAccessDisputes(prev => [newDispute, ...prev]);
    if (log?.lockerId) {
      restrictLockerAccess(log.lockerId, `Security dispute raised (${disputeNumber})`);
    }
    addAudit('Rahul Sharma', 'Customer', 'Access Dispute Lodged', 'AuditLog', disputeNumber, log?.branchName || 'Branch', `Dispute logged on entry ${accessLogId}: ${reason}`);
    addNotification('Security Dispute Registered', `Dispute case ${disputeNumber} opened. Locker frozen pending CCTV and biometric audit.`, 'Security');
    return disputeNumber;
  };

  const resolveAccessDispute = (disputeId: string, remarks: string, cctvStatus: AccessDispute['cctvFootageStatus'], status: AccessDispute['status']) => {
    setAccessDisputes(prev => prev.map(d => d.id === disputeId ? {
      ...d,
      status,
      cctvFootageStatus: cctvStatus,
      resolutionRemarks: remarks,
      resolvedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    } : d));
    const disp = accessDisputes.find(d => d.id === disputeId);
    if (disp) {
      if (status === 'Resolved - Legitimate Access Confirmed' && disp.lockerId) {
        unrestrictLockerAccess(disp.lockerId);
      }
      addAudit(currentUser.name, 'Branch Manager', `Access Dispute Resolved: ${status}`, 'AuditLog', disp.disputeNumber, disp.branchName || 'Branch', remarks);
      addNotification('Dispute Investigation Concluded', `Case ${disp.disputeNumber} resolution: ${remarks}`, 'Security');
    }
  };

  // Admin Maker-Checker Actions
  const adminMakerVerifyApplication = (appId: string, notes: string) => {
    setApplications(prev => prev.map(a => {
      if (a.id === appId) {
        return {
          ...a,
          status: 'Maker Verified',
          makerVerification: {
            verifiedBy: `${currentUser.name} (${currentUser.designation})`,
            verifiedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            notes: notes || 'KYC documents, CBS signature card, and linked FD criteria verified by Branch Maker.',
          },
        };
      }
      return a;
    }));
    const app = applications.find(a => a.id === appId);
    addAudit(currentUser.name, 'Branch Maker (Clerk/Officer)', 'Maker Scrutiny Verified', 'Locker', app?.applicationNumber || appId, app?.branchName || 'Branch', `Maker verified application. Ready for Checker allotment authorization.`);
    addNotification('Application Scrutiny Completed', `Application ${app?.applicationNumber} verified by Maker. Escalated to Checker for allotment sign-off.`, 'Service Request');
  };

  const adminCheckerApproveApplication = (appId: string, specificLockerNumber?: string): { success: boolean; error?: string } => {
    const app = applications.find(a => a.id === appId);
    if (!app) return { success: false, error: 'Application not found' };

    // Enforce Four-Eyes Maker-Checker Segregation
    const validation = validateMakerChecker(app.makerVerification?.verifiedBy);
    if (!validation.allowed) {
      addAudit(currentUser.name, 'Branch Checker (Manager)', 'Four-Eyes Self-Approval Blocked', 'Locker', app.applicationNumber, app.branchName, validation.reason!);
      addNotification('Four-Eyes Principle Violation', validation.reason!, 'Security');
      return { success: false, error: validation.reason };
    }

    const vacantLocker = lockers.find(l => l.branchId === app.branchId && l.size === app.sizeRequested && l.status === 'Vacant') || lockers.find(l => l.status === 'Vacant');
    const allottedLockerNum = specificLockerNumber || vacantLocker?.lockerNumber || `A-${Math.floor(200 + Math.random() * 100)}`;
    const allottedId = vacantLocker?.id || `lck-${Date.now()}`;

    setApplications(prev => prev.map(a => {
      if (a.id === appId) {
        return {
          ...a,
          status: 'Approved - Allotted',
          allottedLockerId: allottedId,
          allottedLockerNumber: allottedLockerNum,
          checkerApproval: {
            approvedBy: `${currentUser.name} (${currentUser.designation})`,
            approvalDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          },
          notes: 'Checker allotment approval certified. Key handover memo issued.',
        };
      }
      return a;
    }));

    if (vacantLocker) {
      setLockers(prev => prev.map(l => {
        if (l.id === vacantLocker.id) {
          return {
            ...l,
            status: 'Occupied',
            customerId: 'cust-rahul-01',
            allotmentDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            nextRenewalDate: '22 Oct 2027',
            operatingMode: app.operatingMode,
            outstandingRent: 0,
          };
        }
        return l;
      }));
    }

    const doc: StoredDocument = {
      id: `doc-${Date.now()}`,
      title: `Allotment Memo & Key Handover Order - ${allottedLockerNum}`,
      category: 'Allotment Letter',
      issueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      fileSize: '780 KB',
      documentRef: `ANB/ALLOT/${allottedLockerNum}/2026`,
      signedStatus: 'Dual-Authorized Stamped Memo',
    };
    setDocuments(prev => [doc, ...prev]);

    addAudit(currentUser.name, 'Branch Checker (Manager)', 'Checker Allotment Authorized', 'Locker', app.applicationNumber, app.branchName, `Locker ${allottedLockerNum} allotted. Key handover memo generated.`);
    addNotification('Application Approved & Locker Allotted', `Application ${app.applicationNumber} approved by Senior Checker. Locker ${allottedLockerNum} allotted at ${app.branchName}.`, 'Service Request');
    return { success: true };
  };

  const adminMakerVerifyNominee = (nomineeId: string, lockerId: string, notes: string) => {
    setNominees(prev => {
      const list = prev[lockerId] || [];
      return {
        ...prev,
        [lockerId]: list.map(n => n.id === nomineeId ? {
          ...n,
          status: 'Under Verification',
          makerVerification: {
            verifiedBy: `${currentUser.name} (${currentUser.designation})`,
            verifiedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            notes: notes || 'Form DA-1 witness signatures and identity proof verified.',
          }
        } : n)
      };
    });
    const targetLocker = lockers.find(l => l.id === lockerId);
    const nom = (nominees[lockerId] || []).find(n => n.id === nomineeId);
    addAudit(currentUser.name, 'Branch Maker (Clerk/Officer)', 'Nominee Form DA-1 Maker Verified', 'Nominee', nom?.formDa1Reference || nomineeId, targetLocker?.branchName || 'Branch', notes || 'Identity and witness validated.');
    addNotification('Nominee Scrutiny Complete', `Nominee ${nom?.name} Form DA-1 verified by Maker. Awaiting Checker endorsement.`, 'Service Request');
  };

  const adminCheckerApproveNominee = (nomineeId: string, lockerId: string): { success: boolean; error?: string } => {
    const targetLocker = lockers.find(l => l.id === lockerId);
    const nom = (nominees[lockerId] || []).find(n => n.id === nomineeId);
    if (!nom) return { success: false, error: 'Nominee not found' };

    const validation = validateMakerChecker(nom.makerVerification?.verifiedBy);
    if (!validation.allowed) {
      addAudit(currentUser.name, 'Branch Checker (Manager)', 'Four-Eyes Self-Approval Blocked', 'Nominee', nom.formDa1Reference || nomineeId, targetLocker?.branchName || 'Branch', validation.reason!);
      addNotification('Four-Eyes Principle Violation', validation.reason!, 'Security');
      return { success: false, error: validation.reason };
    }

    setNominees(prev => {
      const list = prev[lockerId] || [];
      return {
        ...prev,
        [lockerId]: list.map(n => n.id === nomineeId ? {
          ...n,
          status: 'Registered',
          checkerApproval: {
            approvedBy: `${currentUser.name} (${currentUser.designation})`,
            approvalDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          }
        } : n)
      };
    });
    
    const doc: StoredDocument = {
      id: `doc-${Date.now()}`,
      title: `Form DA-1 Official Bank Endorsement - ${nom.name}`,
      category: 'Nomination Form DA-1',
      issueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      fileSize: '510 KB',
      documentRef: nom.formDa1Reference,
      signedStatus: 'Digitally e-Signed & Stamped',
    };
    setDocuments(prev => [doc, ...prev]);
    addAudit(currentUser.name, 'Branch Checker (Manager)', 'Nomination Checker Authorized', 'Nominee', nom.formDa1Reference, targetLocker?.branchName || 'Branch', 'Form DA-1 endorsed by Branch Checker.');
    addNotification('Nomination Approved', `Nominee ${nom.name} registered under Form DA-1 (${nom.formDa1Reference}) for Locker ${targetLocker?.lockerNumber}.`, 'Service Request');
    return { success: true };
  };

  const adminMakerReviewServiceRequest = (srId: string, notes: string, estimatedCost?: number) => {
    const timeNow = `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setServiceRequests(prev => prev.map(sr => {
      if (sr.id === srId) {
        return {
          ...sr,
          status: 'In Progress',
          estimatedCost: estimatedCost !== undefined ? estimatedCost : sr.estimatedCost,
          makerReview: {
            reviewedBy: `${currentUser.name} (${currentUser.designation})`,
            reviewedDate: timeNow.split(',')[0],
            notes: notes || 'Maker verified incident details and requisitioned vendor/locksmith.',
          },
          timeline: [
            ...sr.timeline,
            {
              status: 'In Progress',
              timestamp: timeNow,
              actor: `${currentUser.name} (${currentUser.designation})`,
              note: notes || 'Maker verification and cost estimation recorded.',
            }
          ]
        };
      }
      return sr;
    }));
    const sr = serviceRequests.find(s => s.id === srId);
    if (sr) {
      addAudit(currentUser.name, 'Branch Maker (Clerk/Officer)', `Service Request Maker Review: ${sr.ticketNumber}`, 'ServiceRequest', sr.ticketNumber, sr.branchName, notes);
      addNotification('Service Request In Progress', `Ticket ${sr.ticketNumber} reviewed by Maker. Estimated cost: ₹${estimatedCost || sr.estimatedCost}. Escalated for Checker authorization.`, 'Service Request');
    }
  };

  const adminCheckerApproveServiceRequest = (srId: string, remarks: string): { success: boolean; error?: string } => {
    const sr = serviceRequests.find(s => s.id === srId);
    if (!sr) return { success: false, error: 'Service request not found' };

    const validation = validateMakerChecker(sr.makerReview?.reviewedBy);
    if (!validation.allowed) {
      addAudit(currentUser.name, 'Branch Checker (Manager)', 'Four-Eyes Self-Approval Blocked', 'ServiceRequest', sr.ticketNumber, sr.branchName, validation.reason!);
      addNotification('Four-Eyes Principle Violation', validation.reason!, 'Security');
      return { success: false, error: validation.reason };
    }

    const timeNow = `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setServiceRequests(prev => prev.map(s => {
      if (s.id === srId) {
        return {
          ...s,
          status: 'Resolved / Closed',
          adminRemarks: remarks,
          checkerApproval: {
            approvedBy: `${currentUser.name} (${currentUser.designation})`,
            approvalDate: timeNow.split(',')[0],
          },
          timeline: [
            ...s.timeline,
            {
              status: 'Resolved / Closed',
              timestamp: timeNow,
              actor: `${currentUser.name} (${currentUser.designation})`,
              note: remarks,
            }
          ]
        };
      }
      return s;
    }));
    addAudit(currentUser.name, 'Branch Checker (Manager)', `Service Request Checker Approved: ${sr.ticketNumber}`, 'ServiceRequest', sr.ticketNumber, sr.branchName, remarks);
    addNotification('Service Request Resolved', `Ticket ${sr.ticketNumber} approved and closed by Checker: ${remarks}`, 'Service Request');
    return { success: true };
  };

  // Workflow Scenarios & Quality Gate
  const executeScenarioStep = (scenarioId: string, stepNumber: number) => {
    setScenarios(prev => prev.map(sc => {
      if (sc.id === scenarioId || sc.testId === scenarioId || sc.scenarioCode === scenarioId) {
        const updatedSteps = sc.steps.map(st => st.stepNumber === stepNumber ? { ...st, status: 'completed' as const, isCompleted: true } : st);
        const allDone = updatedSteps.every(st => st.status === 'completed' || st.isCompleted);
        return {
          ...sc,
          steps: updatedSteps,
          status: allDone ? 'passed' as const : 'in_progress' as const,
          lastTestedDate: new Date().toLocaleDateString('en-GB')
        };
      }
      return sc;
    }));
  };

  const runFullScenario = (scenarioId: string) => {
    const scKey = scenarioId.toLowerCase();

    // TEST 1 / scen-01 / sc-1: Customer Application -> Maker -> Checker -> Allotment -> Dashboard
    if (scKey.includes('1') || scKey === 'test-01' || scKey === 'scen-01' || scKey === 'sc-1') {
      const newAppId = `app-${Date.now()}`;
      const newAppNum = `APP-2026-CP-${Math.floor(1000 + Math.random() * 9000)}`;
      const appObj: LockerApplication = {
        id: newAppId,
        applicationNumber: newAppNum,
        customerId: 'cust-rahul-01',
        customerName: 'Rahul Sharma',
        cifNumber: 'CIF-9028192831',
        phone: '+91 98101 23456',
        email: 'rahul.sharma@enterprise-corp.in',
        branchId: 'br-del-01',
        branchName: 'Main Branch - Connaught Place',
        sizeRequested: 'Medium',
        operatingMode: 'Either or Survivor',
        appliedDate: new Date().toISOString().split('T')[0],
        status: 'Approved - Allotted',
        allottedLockerId: 'lck-126',
        allottedLockerNumber: 'B-204',
        linkedSavingsAccount: '00121020003891 (Balance: ₹4,85,000)',
        fixedDepositReceiptNumber: 'FDR-2026-9921',
        nomineeName: 'Pooja Sharma (Wife)',
        notes: 'Quality Gate Test 1: Maker scrutiny verified, Checker allotment approved.',
        makerVerification: {
          verifiedBy: 'Anil Kumar (Operations Officer)',
          verifiedDate: new Date().toLocaleDateString('en-GB'),
          notes: 'Verified KYC, linked FD of ₹45,000, and signature card.'
        },
        checkerApproval: {
          approvedBy: 'Priya Nair (Senior Operations Manager)',
          approvalDate: new Date().toLocaleDateString('en-GB'),
        }
      };
      setApplications(prev => [appObj, ...prev]);
      setLockers(prev => prev.map(l => l.id === 'lck-126' ? {
        ...l,
        status: 'Occupied',
        customerId: 'cust-rahul-01',
        allotmentDate: new Date().toLocaleDateString('en-GB'),
        nextRenewalDate: '23 Oct 2027',
        operatingMode: 'Either or Survivor',
        outstandingRent: 0,
      } : l));
      setDocuments(prev => [{
        id: `doc-${Date.now()}`,
        title: `Allotment Memo & Key Handover Order - B-204`,
        category: 'Allotment Letter',
        issueDate: new Date().toLocaleDateString('en-GB'),
        fileSize: '780 KB',
        documentRef: `ANB/ALLOT/B-204/2026`,
        signedStatus: 'Dual-Authorized Stamped Memo',
      }, ...prev]);
      addAudit('System Test Harness', 'Branch Checker', 'TEST 1: Application Lifecycle Allotment Executed', 'Locker', 'B-204', 'Main Branch', 'Allotted locker B-204 to Rahul Sharma. Stamped memo indexed.');
    }
    // TEST 2 / scen-02 / sc-2: Zero Inventory -> Waitlist -> Allotment
    else if (scKey.includes('2') || scKey === 'test-02' || scKey === 'scen-02' || scKey === 'sc-2') {
      joinWaitingList('br-del-01', 'Extra Large');
      const vacantUnit = lockers.find(l => l.size === 'Extra Large' && l.status === 'Vacant') || lockers.find(l => l.size === 'Extra Large');
      if (vacantUnit) {
        setLockers(prev => prev.map(l => l.id === vacantUnit.id ? { ...l, status: 'Occupied', customerId: 'cust-waitlisted' } : l));
        setWaitingList(prev => prev.map((w, idx) => idx === 0 ? { ...w, status: 'Locker Allocated' } : w));
      }
      addAudit('System Test Harness', 'Branch Checker', 'TEST 2: Waitlist Auto-Allocation Executed', 'Waitlist', 'WL-CP-XL', 'Main Branch', 'Allocated newly vacated Extra Large locker to top priority applicant.');
    }
    // TEST 3 / scen-03 / sc-3: Visit booking -> Check-in -> Dual key access
    else if (scKey.includes('3') || scKey === 'test-03' || scKey === 'scen-03' || scKey === 'sc-3') {
      const token = bookAppointment({
        lockerId: 'lck-125',
        lockerNumber: 'A-108',
        branchId: 'br-del-01',
        branchName: 'Main Branch - Connaught Place',
        customerName: 'Rahul Sharma',
        date: new Date().toISOString().split('T')[0],
        timeSlot: '02:00 PM - 02:30 PM',
        purpose: 'Deposit / Inspect Valuables',
        attendees: 'Single Operator',
      });
      const apt = appointments[0] || { id: 'apt-temp', tokenNumber: token, lockerId: 'lck-125', lockerNumber: 'A-108', branchName: 'Main Branch' };
      adminCheckInAppointment(apt.id);
      adminCompleteAppointment(apt.id, 'Dual-key lock operation certified and biometric folio written.');
      addAudit('System Test Harness', 'Locker Custodian', 'TEST 3: Vault Visit & Access Completed', 'Appointment', token, 'Main Branch', 'Turnstile checked in, dual keys engaged, access log written.');
    }
    // TEST 4 / scen-04 / sc-4: Rent invoice -> Payment -> Receipt -> Reconciliation
    else if (scKey.includes('4') || scKey === 'test-04' || scKey === 'scen-04' || scKey === 'sc-4') {
      payLockerRent('lck-124', 'Internet Banking');
      addAudit('System Test Harness', 'Customer', 'TEST 4: Rent Settlement & Receipt Executed', 'Payment', 'TXN-ANB-TEST', 'Main Branch', 'Rent cleared, receipt generated, outstanding zeroed.');
    }
    // TEST 5 / scen-05 / sc-5: Nominee Form DA-1 -> Verification -> Endorsement
    else if (scKey.includes('5') || scKey === 'test-05' || scKey === 'scen-05' || scKey === 'sc-5') {
      addNominee('lck-125', {
        name: 'Aarav Sharma',
        relationship: 'Son',
        dob: '14 May 2010',
        isMinor: true,
        guardianName: 'Pooja Sharma',
        address: 'Tower 4, Apt 1102, DLF Cyber City, Gurugram 122002',
        phone: '+91 98101 23456',
        email: 'rahul.sharma@enterprise-corp.in',
      });
      const nomList = nominees['lck-125'] || [];
      const targetNom = nomList[nomList.length - 1];
      if (targetNom) {
        adminMakerVerifyNominee(targetNom.id, 'lck-125', 'Verified minor birth certificate and parent guardian KYC.');
        // Endorse with Checker
        adminCheckerApproveNominee(targetNom.id, 'lck-125');
      }
      addAudit('System Test Harness', 'Branch Checker', 'TEST 5: Form DA-1 Verified & Endorsed', 'Nominee', 'DA1-A125-SYNC', 'Main Branch', 'Nominee Aarav Sharma registered under Section 45ZA.');
    }
    // TEST 6 / scen-06 / sc-6: Lost key -> Technical estimation -> Break open warrant
    else if (scKey.includes('6') || scKey === 'test-06' || scKey === 'scen-06' || scKey === 'sc-6') {
      const ticket = createServiceRequest({
        customerId: 'cust-rahul-01',
        customerName: 'Rahul Sharma',
        lockerId: 'lck-125',
        lockerNumber: 'A-108',
        branchName: 'Main Branch - Connaught Place',
        requestType: 'Lost Key Replacement',
        description: 'Customer reported primary key misplaced. Lock replacement and drill required.',
      });
      const sr = serviceRequests[0];
      if (sr) {
        adminMakerReviewServiceRequest(sr.id, 'Locksmith tariff assessed at ₹4,500. Dual witness panel designated.', 4500);
        adminCheckerApproveServiceRequest(sr.id, 'Break-open authorized. New lock installed with 2 brand-new sealed keys.');
      }
      addAudit('System Test Harness', 'Branch Manager', 'TEST 6: Lost Key Break-Open Protocol Executed', 'ServiceRequest', ticket, 'Main Branch', 'Drill warrant authorized, fee assessed, ticket closed.');
    }
    // TEST 7 / scen-07 / sc-7: Surrender -> Clearance -> Vacancy Release
    else if (scKey.includes('7') || scKey === 'test-07' || scKey === 'scen-07' || scKey === 'sc-7') {
      const targetLocker = lockers.find(l => l.id === 'lck-125') || lockers[0];
      if (targetLocker) {
        const ticket = initiateClosure(targetLocker.id, 'Customer relocating overseas. Security deposit refund requested.');
        adminFinalizeClosure(targetLocker.id, ticket);
        addAudit('System Test Harness', 'Branch Manager', 'TEST 7: Locker Surrender & Deposit Released', 'Locker', targetLocker.lockerNumber, targetLocker.branchName, 'Unit cleared, deposit refunded, status set to Vacant.');
      }
    }
    // TEST 8 / scen-08 / sc-8: Complaint -> Triage -> Resolution -> Notice
    else if (scKey.includes('8') || scKey === 'test-08' || scKey === 'scen-08' || scKey === 'sc-8') {
      const compNum = raiseComplaint({
        customerId: 'cust-rahul-01',
        customerName: 'Rahul Sharma',
        cifNumber: 'CIF-9028192831',
        phone: '+91 98101 23456',
        email: 'rahul.sharma@enterprise-corp.in',
        category: 'Strongroom Maintenance',
        subject: 'Digital Turnstile QR Scanner reading latency in basement vault',
        description: 'Vault access gate took multiple attempts to read digital token QR.',
        priority: 'High',
        slaTargetHours: 24,
      });
      const comp = complaints[0];
      if (comp) {
        adminResolveComplaint(comp.id, 'Vault turnstile optical scanner recalibrated and firmware patch applied. Latency resolved.');
      }
      addAudit('System Test Harness', 'Customer', 'TEST 8: Grievance Resolved Under SLA', 'ServiceRequest', compNum, 'Main Branch', 'Complaint investigated by Quality Cell, corrective maintenance completed.');
    }
    // TEST 9 / scen-09 / sc-9: Deceased Claim -> Verification -> Inventory -> Release
    else if (scKey.includes('9') || scKey === 'test-09' || scKey === 'scen-09' || scKey === 'sc-9') {
      const clmNum = submitClaim({
        claimantName: 'Sunita Mehra (Legal Heir & Nominee)',
        claimantRelationship: 'Daughter / Registered Nominee',
        claimantPhone: '+91 98711 55660',
        claimantEmail: 'sunita.mehra@outlook.com',
        claimantAddress: '42 Jor Bagh, New Delhi 110003',
        deceasedCustomerName: 'Col. Rajesh Mehra (Late)',
        deceasedCif: 'CIF-817290192',
        lockerNumber: 'C-088',
        branchName: 'Main Branch - Connaught Place',
        deathCertificateNumber: 'MCD-ND-2026-908129',
        dateOfDeath: '15 Jan 2026',
        claimCategory: 'With Registered Nomination (Form DA-1)',
        uploadedDocuments: [
          { docName: 'Certified Death Certificate', docType: 'Death Certificate', uploadDate: '2026-02-01', verified: true },
          { docName: 'Claimant Aadhaar & PAN Card', docType: 'KYC Document', uploadDate: '2026-02-01', verified: true },
        ],
      });
      const clm = claims[0];
      if (clm) {
        adminUpdateClaimStage(clm.id, 'Inventory Scheduled', 'Death Certificate verified. Physical inventory scheduled for 10 Nov 2026.');
        adminUpdateClaimStage(clm.id, 'Release Authorized', 'Inventory certified in presence of 2 independent witnesses. Release authorized under Section 45ZA.');
      }
      addAudit('System Test Harness', 'Branch Manager', 'TEST 9: Deceased Claim Released Under Statutory SLA', 'Claim', clmNum, 'Main Branch', 'Death Certificate verified, inventory completed, safe articles release signed off.');
    }
    // TEST 10: Maker Self-Approval Prevention
    else if (scKey.includes('10') || scKey === 'test-10') {
      // Simulate Maker attempting to approve own submission
      const makerUser = staffUsers.find(u => u.role === 'branch_maker') || mockStaffUsers[0];
      const validation = serviceValidateMakerChecker(makerUser, makerUser.name);
      if (!validation.allowed) {
        addAudit(makerUser.name, 'Branch Maker (Clerk/Officer)', 'TEST 10: Four-Eyes Self-Approval Blocked', 'Locker', 'APP-2026-CP-1029', 'Main Branch', `Security Kernel Intercepted: ${validation.reason}`);
        addNotification('Four-Eyes Enforcement Verified', 'Maker self-approval attempt was successfully intercepted and denied.', 'Security');
      }
    }
    // TEST 11: Unauthorized Role Access Gate
    else if (scKey.includes('11') || scKey === 'test-11') {
      // Test customer trying to execute admin approval
      const permResult = serviceCheckPermission('customer', 'applications', 'approve_checker');
      if (!permResult.allowed) {
        addAudit('Rahul Sharma', 'Customer', 'TEST 11: Unauthorized Operation Blocked', 'Locker', 'AUTH-RBAC-GATEWAY', 'Main Branch', `Security Kernel Intercepted: ${permResult.reason}`);
        addNotification('RBAC Access Gate Verified', 'Unauthorized operation by restricted role was successfully denied.', 'Security');
      }
    }
    // TEST 12: Dashboard KPI Drill-Down Reconciliation
    else if (scKey.includes('12') || scKey === 'test-12') {
      const occCount = lockers.filter(l => l.status === 'Occupied').length;
      const vacCount = lockers.filter(l => l.status === 'Vacant').length;
      const pendingCount = applications.filter(a => a.status === 'Submitted' || a.status === 'Maker Verified' || a.status === 'KYC Verified').length;
      const overdueCount = lockers.filter(l => (l.outstandingRent || 0) > 0).length;
      addAudit('Inspection Directorate', 'Auditor', 'TEST 12: Dashboard KPI Reconciliation Audit', 'AuditLog', 'REC-KPI-2026', 'Corporate HQ', `Reconciled: ${occCount} Occupied, ${vacCount} Vacant, ${pendingCount} Pending Apps, ${overdueCount} Overdue accounts match database 100%.`);
      addNotification('KPI Reconciliation Verified', 'All dashboard metrics reconcile 1:1 with operational records.', 'Security');
    }

    setScenarios(prev => prev.map(sc => {
      if (sc.id === scenarioId || sc.testId === scenarioId || sc.scenarioCode === scenarioId || scKey.includes(sc.id.toLowerCase())) {
        return {
          ...sc,
          status: 'passed' as const,
          lastTestedDate: 'Today',
          steps: sc.steps.map(st => ({ ...st, status: 'completed' as const, isCompleted: true }))
        };
      }
      return sc;
    }));
    addNotification('Quality Gate Test Passed', `Scenario "${scenarios.find(s => s.id === scenarioId || s.testId === scenarioId)?.title || scenarioId}" executed and verified.`, 'Security');
  };

  const executeAllScenarios = () => {
    // Run all 12 tests sequentially
    for (let i = 1; i <= 12; i++) {
      const testId = `test-${i < 10 ? '0' + i : i}`;
      runFullScenario(testId);
    }
    setScenarios(prev => prev.map(sc => ({
      ...sc,
      status: 'passed' as const,
      lastTestedDate: 'Today',
      steps: sc.steps.map(st => ({ ...st, status: 'completed' as const, isCompleted: true }))
    })));
    addAudit(currentUser.name, 'Auditor', 'Complete Quality Gate Suite Passed (12/12)', 'AuditLog', 'AUD-TEST-GATE-PASS', 'Corporate Headquarters', 'Executed all 12 statutory end-to-end banking scenarios with 100% compliance.');
    addNotification('Quality Gate 100% Passed', 'All 12 banking POC test scenarios have successfully executed and passed.', 'Security');
  };

  const resetScenarios = () => {
    setScenarios(mockScenarios);
    resetDemoData();
  };

  // Admin Actions
  const adminApproveApplication = (appId: string, specificLockerNumber?: string) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;

    // Pick a vacant locker or assign provided
    const vacantLocker = lockers.find(l => l.branchId === app.branchId && l.size === app.sizeRequested && l.status === 'Vacant') || lockers.find(l => l.status === 'Vacant');
    const allottedLockerNum = specificLockerNumber || vacantLocker?.lockerNumber || `A-${Math.floor(200 + Math.random() * 100)}`;
    const allottedId = vacantLocker?.id || `lck-${Date.now()}`;

    setApplications(prev => prev.map(a => {
      if (a.id === appId) {
        return {
          ...a,
          status: 'Approved - Allotted',
          allottedLockerId: allottedId,
          allottedLockerNumber: allottedLockerNum,
          notes: 'Application approved by Branch Operations Manager. KYC and linked deposit verified.',
        };
      }
      return a;
    }));

    if (vacantLocker) {
      setLockers(prev => prev.map(l => {
        if (l.id === vacantLocker.id) {
          return {
            ...l,
            status: 'Occupied',
            customerId: 'cust-rahul-01',
            allotmentDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            nextRenewalDate: '22 Oct 2027',
            operatingMode: app.operatingMode,
            outstandingRent: 0,
          };
        }
        return l;
      }));
    }

    // Add allotment letter document
    const doc: StoredDocument = {
      id: `doc-${Date.now()}`,
      title: `Allotment Memo & Key Handover Order - ${allottedLockerNum}`,
      category: 'Allotment Letter',
      issueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      fileSize: '780 KB',
      documentRef: `ANB/ALLOT/${allottedLockerNum}/2026`,
      signedStatus: 'System Generated',
    };
    setDocuments(prev => [doc, ...prev]);

    addAudit('Priya Nair (Senior Manager)', 'Branch Operations Manager', 'Locker Application Approved', 'Locker', app.applicationNumber, app.branchName, `Approved application for ${app.customerName}. Allotted Locker ${allottedLockerNum}.`);
    addNotification('Application Approved & Locker Allotted', `Congratulations! Application ${app.applicationNumber} approved. Locker ${allottedLockerNum} has been allotted at ${app.branchName}.`, 'Service Request');
  };

  const adminRejectApplication = (appId: string, reason: string) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'Rejected', notes: reason } : a));
    const app = applications.find(a => a.id === appId);
    if (app) {
      addAudit('Priya Nair (Senior Manager)', 'Branch Operations Manager', 'Locker Application Rejected', 'Locker', app.applicationNumber, app.branchName, `Reason: ${reason}`);
      addNotification('Application Status Updated', `Application ${app.applicationNumber} could not be approved: ${reason}`, 'Service Request');
    }
  };

  const adminAllocateWaitlist = (waitlistId: string, lockerId: string) => {
    const entry = waitingList.find(w => w.id === waitlistId);
    const targetLocker = lockers.find(l => l.id === lockerId);
    if (!entry || !targetLocker) return;

    setWaitingList(prev => prev.map(w => w.id === waitlistId ? { ...w, status: 'Locker Allocated' } : w));
    setLockers(prev => prev.map(l => l.id === lockerId ? {
      ...l,
      status: 'Occupied',
      customerId: 'cust-waitlisted',
      allotmentDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      nextRenewalDate: '22 Oct 2027',
      outstandingRent: 0,
    } : l));

    addAudit('Priya Nair (Senior Manager)', 'Branch Operations Manager', 'Locker Allocated to Waitlist', 'Waitlist', entry.waitlistCode, targetLocker.branchName, `Allotted Locker ${targetLocker.lockerNumber} to waitlist applicant ${entry.customerName}.`);
    addNotification('Waitlist Allocation', `Locker ${targetLocker.lockerNumber} allocated to waitlisted customer ${entry.customerName}.`, 'Service Request');
  };

  const adminCheckInAppointment = (aptId: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAppointments(prev => prev.map(a => a.id === aptId ? { ...a, status: 'Checked In', checkInTime: timeNow, escortOfficer: 'Priya Nair (Senior Manager)' } : a));
    const apt = appointments.find(a => a.id === aptId);
    if (apt) {
      addAudit('Priya Nair (Custodian)', 'Locker Custodian', 'Visitor Strongroom Check-In', 'Appointment', apt.tokenNumber, apt.branchName, `Visitor checked in. Photo ID and token ${apt.tokenNumber} verified at gate.`);
    }
  };

  const adminCompleteAppointment = (aptId: string, remarks: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAppointments(prev => prev.map(a => a.id === aptId ? { ...a, status: 'Completed', completedTime: timeNow } : a));
    const apt = appointments.find(a => a.id === aptId);

    if (apt) {
      const newAccessLog: AccessLog = {
        id: `acc-${Date.now()}`,
        lockerId: apt.lockerId,
        lockerNumber: apt.lockerNumber,
        branchName: apt.branchName,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        timeIn: apt.checkInTime || '11:30 AM',
        timeOut: timeNow,
        operatedBy: apt.customerName,
        operatorType: 'Primary Holder',
        verificationMethod: 'Biometric + Signature',
        vaultOfficer: 'Priya Nair (Vault Custodian)',
        remarks: remarks || 'Operation completed satisfactorily. Master key and customer key locked safely.',
      };
      setAccessLogs(prev => [newAccessLog, ...prev]);

      setLockers(prev => prev.map(l => l.id === apt.lockerId ? { ...l, lastAccessDate: newAccessLog.date } : l));

      addAudit('Priya Nair (Custodian)', 'Locker Custodian', 'Vault Operation Completed', 'Locker', apt.lockerNumber, apt.branchName, `Dual-key operation verified and locked. Access log folio recorded.`);
      addNotification('Vault Access Recorded', `Locker ${apt.lockerNumber} safe operation completed and logged on ${newAccessLog.date} at ${timeNow}.`, 'Security');
    }
  };

  const adminApproveNominee = (nomineeId: string, lockerId: string) => {
    setNominees(prev => {
      const list = prev[lockerId] || [];
      return {
        ...prev,
        [lockerId]: list.map(n => n.id === nomineeId ? { ...n, status: 'Registered' } : n),
      };
    });

    const targetLocker = lockers.find(l => l.id === lockerId);
    const nom = (nominees[lockerId] || []).find(n => n.id === nomineeId);

    if (nom) {
      const doc: StoredDocument = {
        id: `doc-${Date.now()}`,
        title: `Form DA-1 Official Bank Endorsement - ${nom.name}`,
        category: 'Nomination Form DA-1',
        issueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        fileSize: '510 KB',
        documentRef: nom.formDa1Reference,
        signedStatus: 'Digitally e-Signed',
      };
      setDocuments(prev => [doc, ...prev]);
      addAudit('Priya Nair (Senior Manager)', 'Branch Operations Manager', 'Nomination Approved', 'Nominee', nom.formDa1Reference, targetLocker?.branchName || 'Branch', `Form DA-1 verified with CBS signature card.`);
      addNotification('Nomination Approved', `Nominee ${nom.name} registered under Form DA-1 (${nom.formDa1Reference}) for Locker ${targetLocker?.lockerNumber}.`, 'Service Request');
    }
  };

  const adminRejectNominee = (nomineeId: string, lockerId: string) => {
    setNominees(prev => {
      const list = prev[lockerId] || [];
      return {
        ...prev,
        [lockerId]: list.map(n => n.id === nomineeId ? { ...n, status: 'Cancelled' } : n),
      };
    });
  };

  const adminApproveAuthorizedOperator = (operatorId: string, lockerId: string) => {
    setAuthorizedOperators(prev => {
      const list = prev[lockerId] || [];
      return {
        ...prev,
        [lockerId]: list.map(o => o.id === operatorId ? { ...o, status: 'Active' } : o)
      };
    });
    const target = lockers.find(l => l.id === lockerId);
    const op = (authorizedOperators[lockerId] || []).find(o => o.id === operatorId);
    addAudit('Priya Nair (Senior Manager)', 'Branch Operations Manager', 'Authorized Operator Verified & Approved', 'Locker', target?.lockerNumber || lockerId, target?.branchName || 'Branch', `Power of attorney mandate registered for ${op?.name}.`);
    addNotification('Operator Approved', `Authorized operator ${op?.name} has been verified and registered for Locker ${target?.lockerNumber}.`, 'Service Request');
  };

  const adminApproveKycRefresh = (recordId: string) => {
    setKycRecords(prev => prev.map(k => k.id === recordId ? {
      ...k,
      status: 'Verified',
      lastKycDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      dueDate: '22 Oct 2034',
    } : k));
    const rec = kycRecords.find(k => k.id === recordId);
    addAudit('Priya Nair (Senior Manager)', 'Branch Operations Manager', 'Periodic KYC Scrutiny Approved', 'KYC', rec?.lockerId || 'Locker', 'Main Branch', `Aadhaar and PAN compliance certified.`);
    addNotification('KYC Verified', `Periodic KYC verification completed. Next review scheduled for Oct 2034.`, 'Agreement');
  };

  const adminApproveContactUpdate = (updateId: string) => {
    setContactUpdates(prev => prev.map(c => c.id === updateId ? { ...c, status: 'Approved' } : c));
    const req = contactUpdates.find(c => c.id === updateId);
    if (req) {
      setHolders(prev => {
        const updated: Record<string, Holder[]> = {};
        Object.entries(prev).forEach(([lId, hList]) => {
          updated[lId] = hList.map(h => h.isPrimary ? {
            ...h,
            phone: req.newMobile,
            email: req.newEmail,
            address: req.newAddress
          } : h);
        });
        return updated;
      });
      addAudit('Priya Nair (Senior Manager)', 'Branch Operations Manager', 'Customer Contact Updates Approved', 'Locker', req.cifNumber, 'Main Branch', `Updated address and communication channels on CBS.`);
      addNotification('Contact Details Updated', `Your registered mobile, email, and address have been successfully updated in CBS.`, 'Service Request');
    }
  };

  const adminUpdateServiceRequest = (srId: string, status: ServiceRequest['status'], remarks: string, cost?: number) => {
    const timeNow = `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setServiceRequests(prev => prev.map(sr => {
      if (sr.id === srId) {
        return {
          ...sr,
          status,
          adminRemarks: remarks,
          estimatedCost: cost !== undefined ? cost : sr.estimatedCost,
          lastUpdated: timeNow.split(',')[0],
          timeline: [
            ...sr.timeline,
            {
              status,
              timestamp: timeNow,
              actor: `${currentUser.name} (${currentUser.designation})`,
              note: remarks,
            }
          ]
        };
      }
      return sr;
    }));

    const sr = serviceRequests.find(s => s.id === srId);
    if (sr) {
      addAudit(currentUser.name, 'Branch Operations Manager', `Service Request Status: ${status}`, 'ServiceRequest', sr.ticketNumber, sr.branchName, remarks);
      addNotification('Service Request Update', `Ticket ${sr.ticketNumber} updated to "${status}": ${remarks}`, 'Service Request');
    }
  };

  const adminUpdateClaimStage = (claimId: string, stage: ClaimRequest['status'], remarks: string) => {
    setClaims(prev => prev.map(c => {
      if (c.id === claimId) {
        return {
          ...c,
          status: stage,
          officerRemarks: remarks,
          checkerApproval: stage === 'Release Authorized' || stage === 'Settled & Closed' ? {
            approvedBy: `${currentUser.name} (${currentUser.designation})`,
            approvalDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          } : c.checkerApproval,
        };
      }
      return c;
    }));

    const clm = claims.find(c => c.id === claimId);
    if (clm) {
      addAudit(currentUser.name, 'Branch Operations Manager', `Claim Stage Updated: ${stage}`, 'Claim', clm.claimNumber, 'Main Branch', remarks);
      addNotification('Locker Claim Stage Updated', `Claim ${clm.claimNumber} progressed to "${stage}".`, 'Service Request');
    }
  };

  const adminResolveComplaint = (compId: string, resolutionNote: string) => {
    setComplaints(prev => prev.map(c => c.id === compId ? { ...c, status: 'Resolved', resolutionNote } : c));
    const comp = complaints.find(c => c.id === compId);
    if (comp) {
      addAudit(currentUser.name, 'Branch Operations Manager', 'Complaint Resolved', 'ServiceRequest', comp.complaintNumber, 'Branch', resolutionNote);
      addNotification('Complaint Resolved', `Complaint ${comp.complaintNumber} has been resolved: ${resolutionNote}`, 'Service Request');
    }
  };

  const adminFinalizeClosure = (lockerId: string, srId: string) => {
    const target = lockers.find(l => l.id === lockerId);
    if (!target) return;

    setLockers(prev => prev.map(l => l.id === lockerId ? {
      ...l,
      status: 'Vacant',
      customerId: undefined,
      outstandingRent: 0,
      allotmentDate: undefined,
    } : l));

    adminUpdateServiceRequest(srId, 'Resolved / Closed', 'Locker keys surrendered, physical inventory certified empty, security deposit refund credited to savings account.');

    const doc: StoredDocument = {
      id: `doc-${Date.now()}`,
      title: `Locker Surrender & Security Deposit Settlement Certificate - ${target.lockerNumber}`,
      category: 'Surrender Clearance',
      issueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      fileSize: '640 KB',
      documentRef: `ANB/SURR/${target.lockerNumber}/2026`,
      signedStatus: 'Physical Stamped Copy',
    };
    setDocuments(prev => [doc, ...prev]);

    addAudit(currentUser.name, 'Branch Operations Manager', 'Locker Surrender Finalized', 'Locker', target.lockerNumber, target.branchName, `Deposit ₹${target.securityDeposit} release authorized.`);
    addNotification('Locker Surrender Completed', `Locker ${target.lockerNumber} successfully closed. Deposit refund of ₹${target.securityDeposit} processed.`, 'Security');
  };

  const adminUpdateLockerStatus = (lockerId: string, status: LockerItem['status']) => {
    setLockers(prev => prev.map(l => l.id === lockerId ? { ...l, status } : l));
  };

  // Administration Hub Actions
  const updateTariff = (id: string, annualRent: number, securityDeposit: number) => {
    setTariffMasters(prev => prev.map(t => t.id === id ? { ...t, annualRent, securityDeposit } : t));
    addAudit(currentUser.name, 'Super Administrator', 'Tariff Master Updated', 'Tariff', id, 'Corporate HQ', `Updated tariff for tier ${id}: Rent ₹${annualRent}, Deposit ₹${securityDeposit}.`);
  };

  const updateSla = (id: string, slaHours: number) => {
    setSlaConfigs(prev => prev.map(s => s.id === id ? { ...s, slaHours } : s));
    addAudit(currentUser.name, 'Head Office Administrator', 'SLA Config Updated', 'SLA', id, 'Corporate HQ', `Updated SLA to ${slaHours} hours.`);
  };

  const createStaffUser = (user: Omit<StaffUser, 'id'>) => {
    const newUser: StaffUser = {
      ...user,
      id: `usr-${Date.now()}`,
    };
    setStaffUsers(prev => [newUser, ...prev]);
    addAudit(currentUser.name, 'Super Administrator', 'Staff User Created', 'StaffUser', newUser.employeeCode || newUser.id, newUser.branchName || 'Corporate HQ', `Provisioned user account for ${newUser.name} with role ${newUser.role}.`);
  };

  const toggleUserStatus = (id: string) => {
    setStaffUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
    const u = staffUsers.find(user => user.id === id);
    if (u) {
      addAudit(currentUser.name, 'Super Administrator', 'Staff Account Status Toggled', 'StaffUser', u.employeeCode || u.id, u.branchName || 'Corporate HQ', `Account status modified.`);
    }
  };

  const createBranchMaster = (branch: Omit<Branch, 'id'>) => {
    const newBranch: Branch = {
      ...branch,
      id: `br-${Date.now()}`,
    };
    setBranches(prev => [...prev, newBranch]);
    addAudit(currentUser.name, 'Head Office Administrator', 'New Branch Master Provisioned', 'Branch', newBranch.code, newBranch.city, `Created strongroom branch ${newBranch.name}.`);
  };

  const updateNotificationTemplate = (id: string, body: string) => {
    setNotificationTemplates(prev => prev.map(t => t.id === id ? { ...t, body } : t));
    addAudit(currentUser.name, 'Head Office Administrator', 'Notification Template Updated', 'Template', id, 'Corporate HQ', `Updated template body for ${id}.`);
  };

  const resetDemoData = () => {
    setBranches(mockBranches);
    setLockers(mockLockers);
    setHolders(mockHolders);
    setNominees(mockNominees);
    setAppointments(mockAppointments);
    setAccessLogs(mockAccessLogs);
    setPayments(mockPayments);
    setApplications(mockApplications);
    setServiceRequests(mockServiceRequests);
    setClaims(mockClaims);
    setComplaints(mockComplaints);
    setNotifications(mockNotifications);
    setDocuments(mockDocuments);
    setAuditLogs(mockAuditLogs);
    setAuthorizedOperators(mockAuthorizedOperators);
    setWaitingList(mockWaitingList);
    setKycRecords(mockKycRecords);
    setContactUpdates(mockContactUpdates);
    setStaffUsers(mockStaffUsers);
    setRegions(mockRegions);
    setTariffMasters(mockTariffMasters);
    setSlaConfigs(mockSlaConfigs);
    setNotificationTemplates(mockNotificationTemplates);
    setAccessDisputes(mockAccessDisputes);
    setScenarios(mockScenarios);
    setIsSessionExpired(false);
    localStorage.clear();
    addNotification('Demo State Reset', 'The POC mock database has been re-initialized to initial demo state.', 'Security');
  };

  return (
    <BankingContext.Provider
      value={{
        currentRoute,
        navigate,
        isAuthenticated,
        login,
        logout,
        userRole,
        setUserRole,
        currentUser,
        switchUserRole,
        customerView,
        setCustomerView,
        adminView,
        setAdminView,
        selectedLockerId,
        setSelectedLockerId,
        branches,
        lockers,
        holders,
        nominees,
        appointments,
        accessLogs,
        payments,
        applications,
        serviceRequests,
        claims,
        complaints,
        notifications,
        documents,
        auditLogs,
        authorizedOperators,
        waitingList,
        kycRecords,
        contactUpdates,
        accessDisputes,
        staffUsers,
        regions,
        tariffMasters,
        slaConfigs,
        notificationTemplates,
        scenarios,
        isSessionExpired,
        triggerSessionTimeout,
        reauthenticateSession,
        applyForLocker,
        joinWaitingList,
        bookAppointment,
        cancelAppointment,
        rescheduleAppointment,
        payLockerRent,
        addNominee,
        cancelNominee,
        addAuthorizedOperator,
        revokeAuthorizedOperator,
        createServiceRequest,
        submitClaim,
        raiseComplaint,
        restrictLockerAccess,
        unrestrictLockerAccess,
        renewAgreement,
        submitKycRefresh,
        submitContactUpdate,
        requestOfficialDocument,
        initiateClosure,
        markNotificationRead,
        markAllNotificationsRead,
        logAccessDispute,
        resolveAccessDispute,
        adminMakerVerifyApplication,
        adminCheckerApproveApplication,
        adminApproveApplication,
        adminRejectApplication,
        adminAllocateWaitlist,
        adminCheckInAppointment,
        adminCompleteAppointment,
        adminMakerVerifyNominee,
        adminCheckerApproveNominee,
        adminApproveNominee,
        adminRejectNominee,
        adminApproveAuthorizedOperator,
        adminApproveKycRefresh,
        adminApproveContactUpdate,
        adminMakerReviewServiceRequest,
        adminCheckerApproveServiceRequest,
        adminUpdateServiceRequest,
        adminUpdateClaimStage,
        adminResolveComplaint,
        adminFinalizeClosure,
        adminUpdateLockerStatus,
        updateTariff,
        updateSla,
        createStaffUser,
        toggleUserStatus,
        createBranchMaster,
        updateNotificationTemplate,
        checkPermission,
        validateMakerChecker,
        executeScenarioStep,
        runFullScenario,
        executeAllScenarios,
        resetScenarios,
        isQaSuiteOpen,
        setIsQaSuiteOpen,
        resetDemoData,
      }}
    >
      {children}
    </BankingContext.Provider>
  );
};

export const useBanking = () => {
  const context = useContext(BankingContext);
  if (!context) {
    throw new Error('useBanking must be used within a BankingProvider');
  }
  return context;
};
