export type UserRole = 
  | 'customer' 
  | 'branch_maker' 
  | 'branch_checker' 
  | 'branch_manager' 
  | 'ho_admin' 
  | 'auditor'
  | 'admin'; // Backward compatibility

export type LockerSize = 'Small' | 'Medium' | 'Large' | 'Extra Large';

export type LockerStatus = 'Occupied' | 'Vacant' | 'Reserved' | 'Blocked' | 'Under Maintenance';

export type OperatingMode = 'Single' | 'Either or Survivor' | 'Jointly' | 'Former or Survivor';

export interface Branch {
  id: string;
  name: string;
  code: string;
  solId?: string;
  city: string;
  regionId: string;
  regionName: string;
  address: string;
  custodianName: string;
  contactNumber: string;
  operatingHours: string;
  totalLockers: number;
  availableLockers: number;
}

export interface LockerItem {
  id: string;
  lockerNumber: string;
  branchId: string;
  branchName: string;
  size: LockerSize;
  dimensions: string; // e.g. "125 x 175 x 492 mm"
  annualRent: number;
  securityDeposit: number;
  status: LockerStatus;
  floor: string;
  tier: string; // "Eye Level", "Upper Tier", "Lower Tier"
  customerId?: string;
  allotmentDate?: string;
  nextRenewalDate?: string;
  lastAccessDate?: string;
  operatingMode?: OperatingMode;
  outstandingRent?: number;
  keyNumber?: string;
}

export interface Holder {
  id: string;
  name: string;
  relationship: string;
  cifNumber: string;
  panNumber: string;
  phone: string;
  email: string;
  address: string;
  isPrimary: boolean;
  kycStatus: 'Verified' | 'Pending' | 'Needs Update';
  photoUrl?: string;
}

export interface Nominee {
  id: string;
  lockerId: string;
  name: string;
  relationship: string;
  dateOfBirth?: string;
  dob?: string;
  isMinor: boolean;
  guardianName?: string;
  guardianRelationship?: string;
  guardianAddress?: string;
  phone: string;
  email?: string;
  address: string;
  status: 'Registered' | 'Pending Verification' | 'Maker Reviewed' | 'Under Verification' | 'Pending Approval' | 'Modification Requested' | 'Cancelled';
  formDa1Reference: string;
  registeredOn: string;
  makerReviewedBy?: string;
  checkerApprovedBy?: string;
  makerVerification?: {
    verifiedBy: string;
    verifiedDate: string;
    notes?: string;
  };
  checkerApproval?: {
    approvedBy: string;
    approvalDate: string;
  };
}

export interface Appointment {
  id: string;
  tokenNumber: string;
  customerId?: string;
  customerName: string;
  lockerId: string;
  lockerNumber: string;
  branchId?: string;
  branchName: string;
  date: string;
  timeSlot: string;
  purpose: 'Routine Vault Access' | 'Operate with Joint Holder' | 'Nominee Verification' | 'Locker Surrender' | 'Inventory Inspection' | 'Deposit / Inspect Valuables';
  accompanyingPersons?: number;
  attendees?: string;
  status: 'Confirmed' | 'Checked In' | 'Completed' | 'Cancelled' | 'Rescheduled';
  qrCodeToken: string;
  checkInTime?: string;
  completedTime?: string;
  escortOfficer?: string;
  specialInstructions?: string;
}

export interface AccessLog {
  id: string;
  lockerId: string;
  lockerNumber: string;
  branchName: string;
  date: string;
  timeIn: string;
  timeOut: string;
  operatedBy: string;
  operatorType: 'Primary Holder' | 'Joint Holder' | 'Authorized Representative' | 'Bank Officer (Inspection)';
  verificationMethod: 'Biometric + Signature' | 'Digital Token + Key' | 'Dual Physical Key';
  vaultOfficer: string;
  remarks?: string;
  isSuspicious?: boolean;
  disputeTicketId?: string;
}

export interface AccessDispute {
  id: string;
  disputeNumber: string;
  accessLogId: string;
  lockerId?: string;
  lockerNumber: string;
  branchName?: string;
  reportedBy?: string;
  reportedDate: string;
  accessDate?: string;
  accessTime?: string;
  customerRemarks?: string;
  customerReason?: string;
  assignedInvestigator?: string;
  investigationOfficer?: string;
  securityRemarks?: string;
  resolutionRemarks?: string;
  cctvFootageStatus: 'Under Retrieval' | 'Reviewed - Verified Hirer' | 'Flagged Discrepancy' | 'Reviewing Turnstile Vault 4K Stream';
  status: 'Under Investigation' | 'Under Security Review' | 'Resolved - False Alarm' | 'Resolved - Security Freeze Lifted' | 'Resolved - Legitimate Access Confirmed' | 'Escalated to Vigilance' | 'Escalated to Fraud Management';
  resolvedDate?: string;
}

export interface PaymentRecord {
  id: string;
  transactionRef: string;
  lockerId: string;
  lockerNumber: string;
  period: string; // e.g. "FY 2026 - 2027"
  amount: number;
  taxGst: number;
  totalAmount: number;
  paymentDate: string;
  paymentMethod: 'Auto-Debit (CBS)' | 'Net Banking' | 'UPI' | 'Branch Counter Cash/Cheque' | 'Internet Banking';
  status: 'Success' | 'Pending' | 'Failed';
  receiptNumber: string;
  invoiceUrl?: string;
}

export interface LockerApplication {
  id: string;
  applicationNumber: string;
  customerId?: string;
  customerName: string;
  cifNumber: string;
  phone: string;
  email: string;
  branchId: string;
  branchName: string;
  sizeRequested: LockerSize;
  operatingMode: OperatingMode;
  appliedDate: string;
  annualIncomeBracket?: string;
  status: 'Submitted' | 'Maker Verified' | 'KYC Verified' | 'Approved - Allotted' | 'Waitlisted' | 'Rejected';
  allottedLockerId?: string;
  allottedLockerNumber?: string;
  waitlistNumber?: number;
  notes?: string;
  panNumber?: string;
  nomineeName?: string;
  linkedAccountNumber?: string;
  linkedSavingsAccount?: string;
  fixedDepositReceiptNumber?: string;
  makerVerifiedBy?: string;
  makerVerificationDate?: string;
  checkerApprovedBy?: string;
  checkerApprovalDate?: string;
  makerVerification?: {
    verifiedBy: string;
    verifiedDate: string;
    notes?: string;
  };
  checkerApproval?: {
    approvedBy: string;
    approvalDate: string;
  };
}

export interface ServiceRequest {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  lockerId: string;
  lockerNumber: string;
  branchName: string;
  requestType: 
    | 'Lost Key & Break-Open' 
    | 'Lost Key Replacement'
    | 'Lock Replacement' 
    | 'Size Upgrade / Downgrade' 
    | 'Branch Relocation' 
    | 'Surrender Locker' 
    | 'Exceptional Access' 
    | 'Locker Damage / Maintenance';
  description: string;
  status: 'Open' | 'Under Scrutiny' | 'Maker Reviewed' | 'Approved by Manager' | 'In Progress' | 'Resolved / Closed' | 'Rejected';
  estimatedCost?: number;
  createdDate: string;
  lastUpdated: string;
  assignedOfficer?: string;
  adminRemarks?: string;
  makerReviewedBy?: string;
  checkerApprovedBy?: string;
  makerReview?: {
    reviewedBy: string;
    reviewedDate: string;
    notes?: string;
  };
  checkerApproval?: {
    approvedBy: string;
    approvalDate: string;
  };
  timeline: {
    status: string;
    timestamp: string;
    actor: string;
    note: string;
  }[];
}

export interface ClaimRequest {
  id: string;
  claimNumber: string;
  lockerId?: string;
  lockerNumber: string;
  branchName?: string;
  deceasedHolderName?: string;
  deceasedCustomerName?: string;
  deceasedCif?: string;
  deathCertificateNumber?: string;
  claimCategory?: string;
  dateOfDeath: string;
  claimantName: string;
  claimantRelationship: 'Registered Nominee' | 'Survivor' | 'Legal Heir / Succession Certificate Holder' | 'Daughter / Registered Nominee';
  claimantContact?: string;
  claimantPhone?: string;
  claimantEmail?: string;
  claimantAddress: string;
  status: 'Claim Registered' | 'Documents Under Verification' | 'Branch Committee Scrutiny' | 'Inventory Scheduled' | 'Release Authorized' | 'Settled & Closed';
  submittedDate: string;
  inventoryDate?: string;
  documentsUploaded?: {
    name: string;
    type: string;
    status: 'Verified' | 'Pending Review' | 'Deficient';
  }[];
  uploadedDocuments?: {
    docName: string;
    docType: string;
    uploadDate: string;
    verified: boolean;
  }[];
  officerRemarks?: string;
  makerNotes?: string;
  checkerApproval?: {
    approvedBy: string;
    approvalDate: string;
  };
}

export interface Complaint {
  id: string;
  complaintNumber: string;
  customerId?: string;
  customerName: string;
  cifNumber?: string;
  phone?: string;
  email?: string;
  lockerNumber?: string;
  category: 'Locker Rental Billing' | 'Vault Access Delay' | 'Key / Lock Mechanism' | 'Nominee Processing' | 'Staff Assistance' | 'Strongroom Maintenance';
  severity?: 'Low' | 'Medium' | 'High' | 'Critical';
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  subject: string;
  description?: string;
  details?: string;
  status: 'Open' | 'Assigned' | 'Escalated' | 'Resolved';
  createdDate: string;
  slaTargetHours: number;
  assignedTo: string;
  resolutionNote?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'Billing' | 'Security' | 'Appointment' | 'Agreement' | 'Service Request';
  read: boolean;
  actionUrl?: string;
}

export interface AuthorizedOperator {
  id: string;
  lockerId: string;
  name: string;
  relationship: string;
  mandateType: 'Power of Attorney (PoA)' | 'Authorized Representative' | 'Legal Guardian';
  poaRegistrationRef?: string;
  idProofType: 'Aadhaar' | 'Passport' | 'PAN';
  idProofNumber: string;
  phone: string;
  validFrom: string;
  validTill: string;
  status: 'Active' | 'Pending Verification' | 'Revoked';
}

export interface WaitingListEntry {
  id: string;
  waitlistCode: string;
  customerName: string;
  cifNumber: string;
  phone: string;
  email: string;
  branchId: string;
  branchName: string;
  sizeRequested: LockerSize;
  joinedDate: string;
  status: 'Waiting' | 'Locker Allocated' | 'Offer Sent' | 'Withdrawn';
  priorityScore: number;
}

export interface KycRefreshRecord {
  id: string;
  lockerId: string;
  customerId: string;
  customerName: string;
  riskCategory: 'Low Risk (Periodic 10yr)' | 'Medium Risk (Periodic 8yr)' | 'High Risk (Periodic 2yr)';
  lastKycDate: string;
  dueDate: string;
  status: 'Up to Date' | 'Refresh Due' | 'Under Scrutiny' | 'Verified';
  submittedAadhaar?: string;
  submittedPan?: string;
  submittedAddressProof?: string;
}

export interface ContactUpdateRequest {
  id: string;
  cifNumber: string;
  customerName: string;
  newMobile: string;
  newEmail: string;
  newAddress: string;
  reason: string;
  status: 'Pending Verification' | 'Approved' | 'Rejected';
  submittedDate: string;
}

export interface StoredDocument {
  id: string;
  title: string;
  category: 'Locker Agreement' | 'Allotment Letter' | 'Payment Receipt' | 'Nomination Form DA-1' | 'Service Acknowledgement' | 'Surrender Clearance' | 'Safe Custody Certificate';
  issueDate: string;
  fileSize: string;
  documentRef: string;
  signedStatus: 'Digitally e-Signed' | 'Physical Stamped Copy' | 'System Generated' | 'Dual-Authorized Stamped Memo' | 'Digitally e-Signed & Stamped';
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  userRole: 
    | 'Customer' 
    | 'Branch Maker' 
    | 'Branch Checker' 
    | 'Branch Manager' 
    | 'Head Office Admin' 
    | 'Auditor' 
    | 'System CBS' 
    | 'Branch Operations Manager' 
    | 'Locker Custodian' 
    | 'Head Office Operations Head'
    | 'Branch Maker (Clerk/Officer)'
    | 'Branch Checker (Manager)';
  action: string;
  entityType: 'Locker' | 'Appointment' | 'Payment' | 'Nominee' | 'ServiceRequest' | 'Claim' | 'Agreement' | 'Waitlist' | 'KYC' | 'SystemConfig' | 'AuditLog';
  entityId: string;
  branchName: string;
  ipAddress: string;
  status: 'Success' | 'Flagged' | 'Rejected';
  details: string;
}

// Administration Models
export interface StaffUser {
  id: string;
  name: string;
  role: UserRole;
  roleTitle?: string;
  designation?: string;
  branchId: string;
  branchName: string;
  email: string;
  employeeId?: string;
  employeeCode?: string;
  status: 'Active' | 'Inactive' | 'On Leave' | 'Suspended';
  department?: string;
  lastLogin: string;
  permissions?: string[];
}

export interface RegionMaster {
  id: string;
  name: string;
  code: string;
  statesCovered?: string;
  regionalHead?: string;
  regionalManager?: string;
  contactEmail?: string;
  headOfficeCity?: string;
  branchCount?: number;
  totalBranches?: number;
  totalVaultLockers?: number;
}

export interface LockerTariffMaster {
  id: string;
  size: LockerSize;
  dimensions: string;
  annualRent: number;
  securityDeposit: number;
  breakOpenCharge?: number;
  gstRate?: number; // e.g. 18
  minAdvanceYears?: number;
  gracePeriodDays?: number;
}

export interface ApprovalSlaConfig {
  id: string;
  module?: string;
  requestType?: string;
  description?: string;
  slaHours: number;
  escalationHours?: number;
  escalationRole?: string;
  makerRequired?: boolean;
  checkerRequired?: boolean;
  escalationLevel?: 'Branch Manager' | 'Regional Head' | 'Head Office';
}

export interface NotificationTemplate {
  id: string;
  code: string;
  title: string;
  category?: 'Billing' | 'Security' | 'Appointment' | 'Agreement' | 'Service Request';
  channel: string;
  subject?: string;
  triggerEvent?: string;
  templateBody?: string;
  body?: string;
}

export interface ScenarioStep {
  stepNumber: number;
  title: string;
  roleRequired?: UserRole;
  actorDescription?: string;
  actionDescription?: string;
  actor?: string;
  description?: string;
  isCompleted?: boolean;
  completedAt?: string;
  notes?: string;
  status?: 'completed' | 'in_progress' | 'pending';
}

export interface WorkflowScenario {
  id: string;
  scenarioCode?: string;
  scenarioNumber?: number;
  title: string;
  category?: 'Customer' | 'Branch Operations' | 'Administration';
  customerAction?: string;
  bankAction?: string;
  description: string;
  lastTestedDate?: string;
  steps: ScenarioStep[];
  status: 'passed' | 'in_progress' | 'pending' | 'Implemented & Verified' | 'Ready to Test';
}
