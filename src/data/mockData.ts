import {
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

export const mockBranches: Branch[] = [
  {
    id: 'br-del-01',
    name: 'Main Branch - Connaught Place',
    code: 'ANB000101',
    city: 'New Delhi',
    regionId: 'reg-north',
    regionName: 'Northern Circle',
    address: '12-A Parliament Street, Connaught Place, New Delhi 110001',
    custodianName: 'Priya Nair (Senior Manager - Vault Operations)',
    contactNumber: '+91 11 2334 8890',
    operatingHours: 'Mon - Fri: 10:00 AM - 04:30 PM | 1st & 3rd Sat: 10:00 AM - 02:00 PM',
    totalLockers: 450,
    availableLockers: 14,
  },
  {
    id: 'br-blr-01',
    name: 'Indiranagar Branch',
    code: 'ANB000204',
    city: 'Bengaluru',
    regionId: 'reg-south',
    regionName: 'Southern Circle',
    address: '100ft Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038',
    custodianName: 'Karthik Raman (Vault Officer)',
    contactNumber: '+91 80 4112 9901',
    operatingHours: 'Mon - Fri: 10:00 AM - 04:00 PM | 1st & 3rd Sat: 10:00 AM - 01:30 PM',
    totalLockers: 320,
    availableLockers: 8,
  },
  {
    id: 'br-mum-01',
    name: 'Nariman Point Branch',
    code: 'ANB000309',
    city: 'Mumbai',
    regionId: 'reg-west',
    regionName: 'Western Circle',
    address: 'Free Press House, 4th Floor, Free Press Journal Marg, Nariman Point, Mumbai 400021',
    custodianName: 'Deepak Merchant (Branch Operations Head)',
    contactNumber: '+91 22 6639 1200',
    operatingHours: 'Mon - Fri: 09:30 AM - 04:30 PM | 1st & 3rd Sat: 10:00 AM - 02:00 PM',
    totalLockers: 600,
    availableLockers: 22,
  },
  {
    id: 'br-kol-01',
    name: 'Salt Lake Sector V Branch',
    code: 'ANB000412',
    city: 'Kolkata',
    regionId: 'reg-east',
    regionName: 'Eastern Circle',
    address: 'Block EP & GP, Sector V, Bidhannagar, Kolkata 700091',
    custodianName: 'Anirban Mukherjee (Custodian Officer)',
    contactNumber: '+91 33 2357 4410',
    operatingHours: 'Mon - Fri: 10:00 AM - 04:00 PM | 1st & 3rd Sat: 10:00 AM - 01:30 PM',
    totalLockers: 280,
    availableLockers: 5,
  },
  {
    id: 'br-hyd-01',
    name: 'Jubilee Hills Branch',
    code: 'ANB000520',
    city: 'Hyderabad',
    regionId: 'reg-south',
    regionName: 'Southern Circle',
    address: 'Road No. 36, Jubilee Hills, Hyderabad 500033',
    custodianName: 'Sunita Reddy (Chief Manager)',
    contactNumber: '+91 40 2355 6780',
    operatingHours: 'Mon - Fri: 10:00 AM - 04:30 PM | 1st & 3rd Sat: 10:00 AM - 02:00 PM',
    totalLockers: 350,
    availableLockers: 12,
  }
];

export const mockLockers: LockerItem[] = [
  {
    id: 'lck-125',
    lockerNumber: 'A-125',
    branchId: 'br-del-01',
    branchName: 'Main Branch - Connaught Place',
    size: 'Medium',
    dimensions: '175 x 250 x 492 mm',
    annualRent: 4500,
    securityDeposit: 15000,
    status: 'Occupied',
    floor: 'Strongroom Floor - Sub Level 1',
    tier: 'Eye Level',
    customerId: 'cust-rahul-01',
    allotmentDate: '15 Jan 2024',
    nextRenewalDate: '15 Jan 2027',
    lastAccessDate: '12 Oct 2026',
    operatingMode: 'Single',
    outstandingRent: 0,
    keyNumber: 'K-8820A',
  },
  {
    id: 'lck-042',
    lockerNumber: 'B-042',
    branchId: 'br-blr-01',
    branchName: 'Indiranagar Branch',
    size: 'Large',
    dimensions: '250 x 375 x 492 mm',
    annualRent: 7800,
    securityDeposit: 25000,
    status: 'Occupied',
    floor: 'Secure Vault Wing - Ground Floor',
    tier: 'Lower Tier',
    customerId: 'cust-rahul-01',
    allotmentDate: '28 Nov 2023',
    nextRenewalDate: '28 Nov 2026',
    lastAccessDate: '04 Sep 2026',
    operatingMode: 'Either or Survivor',
    outstandingRent: 9204, // 7800 + 18% GST (1404)
    keyNumber: 'K-4491B',
  },
  {
    id: 'lck-del-088',
    lockerNumber: 'A-088',
    branchId: 'br-del-01',
    branchName: 'Main Branch - Connaught Place',
    size: 'Small',
    dimensions: '125 x 175 x 492 mm',
    annualRent: 2500,
    securityDeposit: 9000,
    status: 'Vacant',
    floor: 'Strongroom Floor - Sub Level 1',
    tier: 'Upper Tier',
    keyNumber: 'K-1022X',
  },
  {
    id: 'lck-del-190',
    lockerNumber: 'A-190',
    branchId: 'br-del-01',
    branchName: 'Main Branch - Connaught Place',
    size: 'Extra Large',
    dimensions: '385 x 450 x 492 mm',
    annualRent: 12500,
    securityDeposit: 40000,
    status: 'Vacant',
    floor: 'Strongroom Floor - Sub Level 1',
    tier: 'Lower Tier',
    keyNumber: 'K-9904Z',
  },
  {
    id: 'lck-del-210',
    lockerNumber: 'A-210',
    branchId: 'br-del-01',
    branchName: 'Main Branch - Connaught Place',
    size: 'Medium',
    dimensions: '175 x 250 x 492 mm',
    annualRent: 4500,
    securityDeposit: 15000,
    status: 'Reserved',
    floor: 'Strongroom Floor - Sub Level 1',
    tier: 'Eye Level',
  },
  {
    id: 'lck-del-304',
    lockerNumber: 'A-304',
    branchId: 'br-del-01',
    branchName: 'Main Branch - Connaught Place',
    size: 'Large',
    dimensions: '250 x 375 x 492 mm',
    annualRent: 7800,
    securityDeposit: 25000,
    status: 'Under Maintenance',
    floor: 'Strongroom Floor - Sub Level 1',
    tier: 'Upper Tier',
    keyNumber: 'K-3301L',
  },
  {
    id: 'lck-mum-015',
    lockerNumber: 'M-015',
    branchId: 'br-mum-01',
    branchName: 'Nariman Point Branch',
    size: 'Small',
    dimensions: '125 x 175 x 492 mm',
    annualRent: 3000,
    securityDeposit: 10000,
    status: 'Vacant',
    floor: 'Vault Mezzanine',
    tier: 'Eye Level',
    keyNumber: 'K-6610M',
  },
  {
    id: 'lck-mum-080',
    lockerNumber: 'M-080',
    branchId: 'br-mum-01',
    branchName: 'Nariman Point Branch',
    size: 'Extra Large',
    dimensions: '385 x 450 x 492 mm',
    annualRent: 14000,
    securityDeposit: 45000,
    status: 'Vacant',
    floor: 'Vault Ground Level',
    tier: 'Lower Tier',
    keyNumber: 'K-8819N',
  },
  {
    id: 'lck-blr-112',
    lockerNumber: 'B-112',
    branchId: 'br-blr-01',
    branchName: 'Indiranagar Branch',
    size: 'Medium',
    dimensions: '175 x 250 x 492 mm',
    annualRent: 4800,
    securityDeposit: 16000,
    status: 'Vacant',
    floor: 'Vault Wing B',
    tier: 'Eye Level',
    keyNumber: 'K-5520P',
  }
];

export const mockHolders: Record<string, Holder[]> = {
  'lck-125': [
    {
      id: 'hld-01',
      name: 'Rahul Sharma',
      relationship: 'Primary Account Holder',
      cifNumber: 'CIF-9028192831',
      panNumber: 'ABCPS1234F',
      phone: '+91 98101 23456',
      email: 'rahul.sharma@enterprise-corp.in',
      address: 'Flat 402, Oakwood Enclave, Barakhamba Road, New Delhi 110001',
      isPrimary: true,
      kycStatus: 'Verified',
    }
  ],
  'lck-042': [
    {
      id: 'hld-01',
      name: 'Rahul Sharma',
      relationship: 'Primary Account Holder',
      cifNumber: 'CIF-9028192831',
      panNumber: 'ABCPS1234F',
      phone: '+91 98101 23456',
      email: 'rahul.sharma@enterprise-corp.in',
      address: 'Flat 402, Oakwood Enclave, Barakhamba Road, New Delhi 110001',
      isPrimary: true,
      kycStatus: 'Verified',
    },
    {
      id: 'hld-02',
      name: 'Ananya Sharma',
      relationship: 'Joint Holder (Spouse)',
      cifNumber: 'CIF-9028192832',
      panNumber: 'BCDPS5678K',
      phone: '+91 98101 65432',
      email: 'ananya.sharma@outlook.com',
      address: 'Flat 402, Oakwood Enclave, Barakhamba Road, New Delhi 110001',
      isPrimary: false,
      kycStatus: 'Verified',
    }
  ]
};

export const mockNominees: Record<string, Nominee[]> = {
  'lck-125': [
    {
      id: 'nom-01',
      lockerId: 'lck-125',
      name: 'Rohan Sharma',
      relationship: 'Son',
      dateOfBirth: '14 Aug 2004',
      isMinor: false,
      phone: '+91 98711 00223',
      address: 'Flat 402, Oakwood Enclave, Barakhamba Road, New Delhi 110001',
      status: 'Registered',
      formDa1Reference: 'DA1-2024-DEL-9844',
      registeredOn: '18 Jan 2024',
    }
  ],
  'lck-042': [
    {
      id: 'nom-02',
      lockerId: 'lck-042',
      name: 'Rohan Sharma',
      relationship: 'Son',
      dateOfBirth: '14 Aug 2004',
      isMinor: false,
      phone: '+91 98711 00223',
      address: 'Flat 402, Oakwood Enclave, Barakhamba Road, New Delhi 110001',
      status: 'Registered',
      formDa1Reference: 'DA1-2023-BLR-1102',
      registeredOn: '02 Dec 2023',
    }
  ]
};

export const mockAppointments: Appointment[] = [
  {
    id: 'apt-01',
    tokenNumber: 'VLT-DEL-2610-04',
    customerId: 'cust-rahul-01',
    customerName: 'Rahul Sharma',
    lockerId: 'lck-125',
    lockerNumber: 'A-125',
    branchId: 'br-del-01',
    branchName: 'Main Branch - Connaught Place',
    date: '2026-10-24',
    timeSlot: '11:30 AM - 12:00 PM',
    purpose: 'Routine Vault Access',
    accompanyingPersons: 0,
    status: 'Confirmed',
    qrCodeToken: 'ANB-QR-DEL-A125-9921',
    specialInstructions: 'Primary key requested. Photographic ID verification mandatory at strongroom entry gate.',
  },
  {
    id: 'apt-02',
    tokenNumber: 'VLT-BLR-2609-19',
    customerId: 'cust-rahul-01',
    customerName: 'Rahul Sharma',
    lockerId: 'lck-042',
    lockerNumber: 'B-042',
    branchId: 'br-blr-01',
    branchName: 'Indiranagar Branch',
    date: '2026-09-04',
    timeSlot: '02:00 PM - 02:30 PM',
    purpose: 'Operate with Joint Holder',
    accompanyingPersons: 1,
    status: 'Completed',
    qrCodeToken: 'ANB-QR-BLR-B042-4412',
    checkInTime: '02:04 PM',
    completedTime: '02:22 PM',
    escortOfficer: 'Karthik Raman (Vault Custodian)',
  }
];

export const mockAccessLogs: AccessLog[] = [
  {
    id: 'acc-01',
    lockerId: 'lck-125',
    lockerNumber: 'A-125',
    branchName: 'Main Branch - Connaught Place',
    date: '12 Oct 2026',
    timeIn: '11:42 AM',
    timeOut: '11:58 AM',
    operatedBy: 'Rahul Sharma',
    operatorType: 'Primary Holder',
    verificationMethod: 'Biometric + Signature',
    vaultOfficer: 'Priya Nair (Senior Manager)',
    remarks: 'Routine safe custody inspection. Single entry recorded in physical ledger folio #144.',
  },
  {
    id: 'acc-02',
    lockerId: 'lck-042',
    lockerNumber: 'B-042',
    branchName: 'Indiranagar Branch',
    date: '04 Sep 2026',
    timeIn: '02:05 PM',
    timeOut: '02:22 PM',
    operatedBy: 'Rahul Sharma & Ananya Sharma',
    operatorType: 'Joint Holder',
    verificationMethod: 'Digital Token + Key',
    vaultOfficer: 'Karthik Raman (Vault Officer)',
    remarks: 'Joint operation under Either or Survivor mandate.',
  },
  {
    id: 'acc-03',
    lockerId: 'lck-125',
    lockerNumber: 'A-125',
    branchName: 'Main Branch - Connaught Place',
    date: '18 Jul 2026',
    timeIn: '03:15 PM',
    timeOut: '03:28 PM',
    operatedBy: 'Rahul Sharma',
    operatorType: 'Primary Holder',
    verificationMethod: 'Biometric + Signature',
    vaultOfficer: 'Rameshwar Dayal (Asst Manager)',
    remarks: 'Routine deposit operation.',
  },
  {
    id: 'acc-04',
    lockerId: 'lck-125',
    lockerNumber: 'A-125',
    branchName: 'Main Branch - Connaught Place',
    date: '15 Jan 2026',
    timeIn: '10:45 AM',
    timeOut: '11:05 AM',
    operatedBy: 'Rahul Sharma',
    operatorType: 'Primary Holder',
    verificationMethod: 'Dual Physical Key',
    vaultOfficer: 'Priya Nair (Senior Manager)',
    remarks: 'Annual renewal physical verification and key audit.',
  }
];

export const mockPayments: PaymentRecord[] = [
  {
    id: 'pay-01',
    transactionRef: 'TXN-ANB-9901827361',
    lockerId: 'lck-125',
    lockerNumber: 'A-125',
    period: 'FY 2026 - 2027',
    amount: 4500,
    taxGst: 810,
    totalAmount: 5310,
    paymentDate: '10 Jan 2026',
    paymentMethod: 'Auto-Debit (CBS)',
    status: 'Success',
    receiptNumber: 'RCP-2026-DEL-10928',
  },
  {
    id: 'pay-02',
    transactionRef: 'TXN-ANB-8839210944',
    lockerId: 'lck-042',
    lockerNumber: 'B-042',
    period: 'FY 2025 - 2026',
    amount: 7800,
    taxGst: 1404,
    totalAmount: 9204,
    paymentDate: '26 Nov 2025',
    paymentMethod: 'Net Banking',
    status: 'Success',
    receiptNumber: 'RCP-2025-BLR-04882',
  },
  {
    id: 'pay-03',
    transactionRef: 'TXN-ANB-7718290332',
    lockerId: 'lck-125',
    lockerNumber: 'A-125',
    period: 'FY 2025 - 2026',
    amount: 4500,
    taxGst: 810,
    totalAmount: 5310,
    paymentDate: '12 Jan 2025',
    paymentMethod: 'Auto-Debit (CBS)',
    status: 'Success',
    receiptNumber: 'RCP-2025-DEL-08711',
  }
];

export const mockApplications: LockerApplication[] = [
  {
    id: 'app-901',
    applicationNumber: 'APP-2026-DEL-4019',
    customerName: 'Vikramaditya Sen',
    cifNumber: 'CIF-7782190344',
    phone: '+91 99031 88921',
    email: 'v.sen@technologies.in',
    branchId: 'br-del-01',
    branchName: 'Main Branch - Connaught Place',
    sizeRequested: 'Medium',
    operatingMode: 'Single',
    appliedDate: '2026-10-18',
    annualIncomeBracket: '₹25 Lakhs - ₹50 Lakhs',
    status: 'KYC Verified',
    panNumber: 'BNVPS8819L',
    nomineeName: 'Shalini Sen (Spouse)',
    linkedAccountNumber: '5010088921091',
    notes: 'Awaiting locker assignment by Branch Operations Manager.',
  },
  {
    id: 'app-902',
    applicationNumber: 'APP-2026-MUM-7721',
    customerName: 'Meenakshi Iyer',
    cifNumber: 'CIF-6651928371',
    phone: '+91 98200 44109',
    email: 'm.iyer@consulting.org',
    branchId: 'br-mum-01',
    branchName: 'Nariman Point Branch',
    sizeRequested: 'Extra Large',
    operatingMode: 'Either or Survivor',
    appliedDate: '2026-10-14',
    annualIncomeBracket: '₹50 Lakhs+',
    status: 'Submitted',
    panNumber: 'AZCPI4491M',
    nomineeName: 'Arjun Iyer (Son)',
    linkedAccountNumber: '5010034189021',
    notes: 'Priority High Net Worth application. Documents uploaded.',
  },
  {
    id: 'app-903',
    applicationNumber: 'APP-2026-BLR-3108',
    customerName: 'Aditya Prasad',
    cifNumber: 'CIF-5519283002',
    phone: '+91 97412 88201',
    email: 'aditya.p@aerospace.co',
    branchId: 'br-blr-01',
    branchName: 'Indiranagar Branch',
    sizeRequested: 'Large',
    operatingMode: 'Single',
    appliedDate: '2026-10-09',
    annualIncomeBracket: '₹15 Lakhs - ₹25 Lakhs',
    status: 'Approved - Allotted',
    allottedLockerId: 'lck-blr-112',
    allottedLockerNumber: 'B-112',
    panNumber: 'CDKPP1092F',
    linkedAccountNumber: '5010077819203',
    notes: 'Approved by Branch Manager. Agreement execution appointment scheduled.',
  }
];

export const mockServiceRequests: ServiceRequest[] = [
  {
    id: 'sr-01',
    ticketNumber: 'SR-2026-DEL-1049',
    customerId: 'cust-rahul-01',
    customerName: 'Rahul Sharma',
    lockerId: 'lck-125',
    lockerNumber: 'A-125',
    branchName: 'Main Branch - Connaught Place',
    requestType: 'Size Upgrade / Downgrade',
    description: 'Requesting upgrade from Medium to Large size locker due to increased family safe-custody requirements.',
    status: 'Under Scrutiny',
    estimatedCost: 3300,
    createdDate: '16 Oct 2026',
    lastUpdated: '18 Oct 2026',
    assignedOfficer: 'Priya Nair (Senior Manager)',
    adminRemarks: 'Large locker B-304 under maintenance. Evaluating allotment of newly vacated A-190.',
    timeline: [
      {
        status: 'Request Submitted',
        timestamp: '16 Oct 2026, 02:30 PM',
        actor: 'Customer (Rahul Sharma)',
        note: 'Customer requested size upgrade via online portal.',
      },
      {
        status: 'Assigned to Custodian',
        timestamp: '17 Oct 2026, 10:15 AM',
        actor: 'CBS System Dispatcher',
        note: 'Ticket routed to Main Branch locker operations queue.',
      },
      {
        status: 'Under Scrutiny',
        timestamp: '18 Oct 2026, 04:20 PM',
        actor: 'Priya Nair (Custodian)',
        note: 'Inventory matrix cross-checked. Awaiting confirmation of pending vacating notice.',
      }
    ]
  },
  {
    id: 'sr-02',
    ticketNumber: 'SR-2026-BLR-0891',
    customerId: 'cust-rahul-01',
    customerName: 'Rahul Sharma',
    lockerId: 'lck-042',
    lockerNumber: 'B-042',
    branchName: 'Indiranagar Branch',
    requestType: 'Locker Damage / Maintenance',
    description: 'Minor stiffness in customer key turn observed during last September visit.',
    status: 'Resolved / Closed',
    createdDate: '06 Sep 2026',
    lastUpdated: '09 Sep 2026',
    assignedOfficer: 'Karthik Raman (Vault Officer)',
    adminRemarks: 'Godrej vault engineer lubricated secondary lever. Verified with customer test turn.',
    timeline: [
      {
        status: 'Request Submitted',
        timestamp: '06 Sep 2026, 11:00 AM',
        actor: 'Customer (Rahul Sharma)',
        note: 'Stiff lock report submitted.',
      },
      {
        status: 'Vault Inspection',
        timestamp: '07 Sep 2026, 03:00 PM',
        actor: 'Karthik Raman',
        note: 'Lock examined alongside authorized security engineer.',
      },
      {
        status: 'Resolved / Closed',
        timestamp: '09 Sep 2026, 04:30 PM',
        actor: 'Karthik Raman',
        note: 'Mechanism smoothly functioning. Service certificate signed.',
      }
    ]
  }
];

export const mockClaims: ClaimRequest[] = [
  {
    id: 'clm-01',
    claimNumber: 'CLM-2026-DEL-0412',
    lockerId: 'lck-del-210',
    lockerNumber: 'A-210',
    deceasedHolderName: 'Late Harish Chander Sharma',
    dateOfDeath: '15 Aug 2026',
    claimantName: 'Sunil Chander Sharma',
    claimantRelationship: 'Registered Nominee',
    claimantContact: '+91 98112 33445',
    claimantAddress: 'C-24 Defence Colony, New Delhi 110024',
    status: 'Branch Committee Scrutiny',
    submittedDate: '28 Aug 2026',
    inventoryDate: '2026-10-27',
    documentsUploaded: [
      { name: 'Original Death Certificate (MCD Reg #88192)', type: 'PDF Document', status: 'Verified' },
      { name: 'Form DA-1 Nomination Acknowledgement Copy', type: 'PDF Document', status: 'Verified' },
      { name: 'Claimant PAN Card & Aadhaar KYC', type: 'PDF Document', status: 'Verified' },
      { name: 'Indemnity Bond with Two Independent Sureties', type: 'Scanned Document', status: 'Pending Review' }
    ],
    officerRemarks: 'Nomination Form DA-1 matches CBS specimen register. Committee meeting scheduled for inventory recording.',
    makerNotes: 'Verified with Municipal Death Registry portal. Discrepancy nil.',
  }
];

export const mockComplaints: Complaint[] = [
  {
    id: 'cmp-01',
    complaintNumber: 'CMP-2026-DEL-0098',
    customerName: 'Rahul Sharma',
    lockerNumber: 'B-042',
    category: 'Locker Rental Billing',
    severity: 'Medium',
    subject: 'Duplicate SMS alert regarding overdue rent despite auto-debit registration',
    details: 'Received reminder notice for Indiranagar locker B-042 though e-mandate was active on my account.',
    status: 'Assigned',
    createdDate: '19 Oct 2026',
    slaTargetHours: 48,
    assignedTo: 'Finance Operations Desk (Bengaluru Hub)',
    resolutionNote: 'Checking NACH CBS clearing batch logs.',
  }
];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-01',
    title: 'Upcoming Strongroom Visit Confirmed',
    message: 'Your appointment VLT-DEL-2610-04 for Locker A-125 is confirmed for 24 Oct 2026 at 11:30 AM. Digital token generated.',
    timestamp: '2 hours ago',
    category: 'Appointment',
    read: false,
  },
  {
    id: 'notif-02',
    title: 'Locker Rent Renewal Due Notice',
    message: 'Annual rent ₹7,800 + 18% GST (Total ₹9,204) for Locker B-042 (Indiranagar Branch) is due for renewal before 28 Nov 2026.',
    timestamp: '1 day ago',
    category: 'Billing',
    read: false,
  },
  {
    id: 'notif-03',
    title: 'Vault Access Recorded & Logged',
    message: 'Locker A-125 was accessed on 12 Oct 2026 at 11:42 AM by Primary Holder Rahul Sharma with biometric authentication.',
    timestamp: '10 days ago',
    category: 'Security',
    read: true,
  },
  {
    id: 'notif-04',
    title: 'RBI Model Locker Agreement Re-Execution',
    message: 'Your locker agreement has been successfully stamped and digitally validated as per latest RBI Safe Custody directions.',
    timestamp: '2 weeks ago',
    category: 'Agreement',
    read: true,
  }
];

export const mockDocuments: StoredDocument[] = [
  {
    id: 'doc-01',
    title: 'Model Locker Agreement (Form L-1)',
    category: 'Locker Agreement',
    issueDate: '15 Jan 2024',
    fileSize: '1.8 MB',
    documentRef: 'ANB/LKR-AGR/DEL/2024/0918',
    signedStatus: 'Digitally e-Signed',
  },
  {
    id: 'doc-02',
    title: 'Locker Allotment Letter & Key Handover Memo',
    category: 'Allotment Letter',
    issueDate: '15 Jan 2024',
    fileSize: '840 KB',
    documentRef: 'ANB/ALLOT/A125/2024',
    signedStatus: 'Physical Stamped Copy',
  },
  {
    id: 'doc-03',
    title: 'Nomination Registration Acknowledgement (Form DA-1)',
    category: 'Nomination Form DA-1',
    issueDate: '18 Jan 2024',
    fileSize: '620 KB',
    documentRef: 'DA1-2024-DEL-9844',
    signedStatus: 'Digitally e-Signed',
  },
  {
    id: 'doc-04',
    title: 'Annual Locker Rental Tax Invoice & Receipt - FY 2026',
    category: 'Payment Receipt',
    issueDate: '10 Jan 2026',
    fileSize: '410 KB',
    documentRef: 'RCP-2026-DEL-10928',
    signedStatus: 'System Generated',
  },
  {
    id: 'doc-05',
    title: 'Model Locker Agreement - Indiranagar B-042',
    category: 'Locker Agreement',
    issueDate: '28 Nov 2023',
    fileSize: '2.1 MB',
    documentRef: 'ANB/LKR-AGR/BLR/2023/4412',
    signedStatus: 'Digitally e-Signed',
  }
];

export const mockAuthorizedOperators: Record<string, AuthorizedOperator[]> = {
  'lck-042': [
    {
      id: 'op-01',
      lockerId: 'lck-042',
      name: 'Suresh Kumar Sharma',
      relationship: 'Father / General Power of Attorney Holder',
      mandateType: 'Power of Attorney (PoA)',
      poaRegistrationRef: 'POA/DEL-SUB/2023/8819',
      idProofType: 'Aadhaar',
      idProofNumber: 'XXXX-XXXX-4819',
      phone: '+91 98110 99882',
      validFrom: '01 Jan 2024',
      validTill: '31 Dec 2028',
      status: 'Active',
    }
  ],
  'lck-125': []
};

export const mockWaitingList: WaitingListEntry[] = [
  {
    id: 'wl-01',
    waitlistCode: 'WL-DEL-MED-04',
    customerName: 'Gaurav Khandelwal',
    cifNumber: 'CIF-8819203912',
    phone: '+91 98100 77211',
    email: 'g.khandelwal@logistics.in',
    branchId: 'br-del-01',
    branchName: 'Main Branch - Connaught Place',
    sizeRequested: 'Medium',
    joinedDate: '2026-09-15',
    status: 'Waiting',
    priorityScore: 92,
  },
  {
    id: 'wl-02',
    waitlistCode: 'WL-MUM-XL-01',
    customerName: 'Pooja Chhabra',
    cifNumber: 'CIF-9901827361',
    phone: '+91 98201 11204',
    email: 'pooja.c@investments.co',
    branchId: 'br-mum-01',
    branchName: 'Nariman Point Branch',
    sizeRequested: 'Extra Large',
    joinedDate: '2026-10-02',
    status: 'Waiting',
    priorityScore: 88,
  }
];

export const mockKycRecords: KycRefreshRecord[] = [
  {
    id: 'kyc-01',
    lockerId: 'lck-125',
    customerId: 'cust-rahul-01',
    customerName: 'Rahul Sharma',
    riskCategory: 'Low Risk (Periodic 10yr)',
    lastKycDate: '15 Jan 2024',
    dueDate: '15 Jan 2034',
    status: 'Up to Date',
  },
  {
    id: 'kyc-02',
    lockerId: 'lck-042',
    customerId: 'cust-rahul-01',
    customerName: 'Rahul Sharma',
    riskCategory: 'Medium Risk (Periodic 8yr)',
    lastKycDate: '28 Nov 2020',
    dueDate: '28 Nov 2026',
    status: 'Refresh Due',
  }
];

export const mockContactUpdates: ContactUpdateRequest[] = [
  {
    id: 'cu-01',
    cifNumber: 'CIF-9028192831',
    customerName: 'Rahul Sharma',
    newMobile: '+91 98101 23456',
    newEmail: 'rahul.sharma@enterprise-corp.in',
    newAddress: 'Flat 402, Oakwood Enclave, Barakhamba Road, New Delhi 110001',
    reason: 'Periodic communication address confirmation',
    status: 'Approved',
    submittedDate: '10 Jan 2026',
  }
];

export const mockAuditLogs: AuditLogItem[] = [
  {
    id: 'aud-01',
    timestamp: '2026-10-22 09:15:32 IST',
    user: 'Priya Nair (Branch Custodian)',
    userRole: 'Locker Custodian',
    action: 'Dual Physical Key Vault Log Verification',
    entityType: 'Locker',
    entityId: 'A-125',
    branchName: 'Main Branch - Connaught Place',
    ipAddress: '10.14.88.22 (Branch Intranet)',
    status: 'Success',
    details: 'Master custodian key register reconciled against physical safe register.',
  },
  {
    id: 'aud-02',
    timestamp: '2026-10-21 14:40:11 IST',
    user: 'Rahul Sharma (Customer Portal)',
    userRole: 'Customer',
    action: 'Appointment Booking Confirmed',
    entityType: 'Appointment',
    entityId: 'VLT-DEL-2610-04',
    branchName: 'Main Branch - Connaught Place',
    ipAddress: '122.161.49.80 (2FA Authenticated)',
    status: 'Success',
    details: 'Appointment booked for 24 Oct 2026 at 11:30 AM with OTP validation.',
  },
  {
    id: 'aud-03',
    timestamp: '2026-10-18 16:20:45 IST',
    user: 'Deepak Merchant (Operations Head)',
    userRole: 'Branch Operations Manager',
    action: 'Application KYC Scrutiny Approved',
    entityType: 'Locker',
    entityId: 'APP-2026-DEL-4019',
    branchName: 'Main Branch - Connaught Place',
    ipAddress: '10.14.88.10 (Maker-Checker Portal)',
    status: 'Success',
    details: 'PAN verified with NSDL database. CIBIL score 812 satisfied bank risk threshold.',
  },
  {
    id: 'aud-04',
    timestamp: '2026-10-12 11:42:00 IST',
    user: 'Priya Nair (Branch Custodian)',
    userRole: 'Locker Custodian',
    action: 'Vault Door Access Granted',
    entityType: 'Locker',
    entityId: 'A-125',
    branchName: 'Main Branch - Connaught Place',
    ipAddress: '10.14.88.22 (Strongroom Terminal)',
    status: 'Success',
    details: 'Biometric match 98.4%. Customer accompanied to Safe A-125.',
  }
];


export const rentPricingMatrix = {
  'Small': {
    annualRent: 2500,
    deposit: 9000,
    dimensions: '125 x 175 x 492 mm',
    desc: 'Ideal for jewelry boxes, stamp collections, passbooks, and certificates.',
  },
  'Medium': {
    annualRent: 4500,
    deposit: 15000,
    dimensions: '175 x 250 x 492 mm',
    desc: 'Most popular. Accommodates medium jewelry trays, legal deeds, and valuables.',
  },
  'Large': {
    annualRent: 7800,
    deposit: 25000,
    dimensions: '250 x 375 x 492 mm',
    desc: 'Spacious compartment for large family heirlooms, folders, bullion bars.',
  },
  'Extra Large': {
    annualRent: 12500,
    deposit: 40000,
    dimensions: '385 x 450 x 492 mm',
    desc: 'High-capacity secure vault unit for commercial deeds, bullion, and trusts.',
  }
};

export const mockStaffUsers: StaffUser[] = [
  {
    id: 'user-maker',
    name: 'Anil Kumar',
    role: 'branch_maker',
    roleTitle: 'Operations Officer (Maker)',
    branchId: 'br-del-01',
    branchName: 'Main Branch - Connaught Place',
    email: 'anil.kumar@apexnationalbank.in',
    employeeId: 'EMP-M-1049',
    status: 'Active',
    department: 'Strongroom & Lockers Operations',
    lastLogin: 'Today, 09:15 AM',
    permissions: ['VIEW_LOCKERS', 'VERIFY_KYC', 'MAKER_APPLICATION', 'MAKER_NOMINEE', 'MAKER_SERVICE_REQUEST', 'CHECKIN_VISITOR']
  },
  {
    id: 'user-checker',
    name: 'Priya Nair',
    role: 'branch_checker',
    roleTitle: 'Senior Operations Manager (Checker)',
    branchId: 'br-del-01',
    branchName: 'Main Branch - Connaught Place',
    email: 'priya.nair@apexnationalbank.in',
    employeeId: 'EMP-C-2018',
    status: 'Active',
    department: 'Branch Vault Custody Division',
    lastLogin: 'Today, 08:45 AM',
    permissions: ['VIEW_LOCKERS', 'CHECKER_APPROVE', 'ALLOT_COMPARTMENT', 'APPROVE_NOMINEE', 'DUAL_KEY_SIGN', 'COMPLETE_VISIT']
  },
  {
    id: 'user-bm',
    name: 'Vikramaditya Sen',
    role: 'branch_manager',
    roleTitle: 'AVP & Branch Operations Head',
    branchId: 'br-del-01',
    branchName: 'Main Branch - Connaught Place',
    email: 'vikram.sen@apexnationalbank.in',
    employeeId: 'EMP-BM-5012',
    status: 'Active',
    department: 'Branch Management & Credit Board',
    lastLogin: 'Today, 09:30 AM',
    permissions: ['ALL_BRANCH_OPERATIONS', 'AUTHORIZE_BREAK_OPEN', 'RESOLVE_DISPUTES', 'SURRENDER_SIGN_OFF', 'OVERRIDE_BLOCK']
  },
  {
    id: 'user-ho',
    name: 'Sunita Rao',
    role: 'ho_admin',
    roleTitle: 'Chief Operations Officer (Head Office)',
    branchId: 'br-del-01',
    branchName: 'Corporate Headquarters - New Delhi',
    email: 'sunita.rao@apexnationalbank.in',
    employeeId: 'EMP-HO-0042',
    status: 'Active',
    department: 'Central Banking Operations & Systems',
    lastLogin: 'Today, 08:00 AM',
    permissions: ['SUPER_ADMIN', 'MANAGE_TARIFFS', 'MANAGE_BRANCHES', 'CONFIGURE_SLAS', 'USER_DIRECTORY_ADMIN', 'TEMPLATE_MANAGEMENT']
  },
  {
    id: 'user-auditor',
    name: 'Rameshwar Patil',
    role: 'auditor',
    roleTitle: 'Concurrent Internal Auditor',
    branchId: 'br-del-01',
    branchName: 'Inspection & Internal Audit Directorate',
    email: 'rameshwar.patil@apexnationalbank.in',
    employeeId: 'EMP-AUD-7711',
    status: 'Active',
    department: 'Audit, Vigilance & Regulatory Compliance',
    lastLogin: 'Today, 10:05 AM',
    permissions: ['AUDIT_READ_ONLY', 'EXPORT_LOGS', 'INSPECT_DISCREPANCIES', 'COMPLIANCE_VERIFY', 'RUN_AUDIT_REPORT']
  },
  {
    id: 'user-cust',
    name: 'Rahul Sharma',
    role: 'customer',
    roleTitle: 'Premier Safe Custody Hirer',
    branchId: 'br-del-01',
    branchName: 'Main Branch - Connaught Place',
    email: 'rahul.sharma@enterprise-corp.in',
    employeeId: 'CIF-9028192831',
    status: 'Active',
    department: 'Retail Banking - Premier Segment',
    lastLogin: 'Today, 10:12 AM',
    permissions: ['CUSTOMER_SELF_SERVICE', 'VIEW_MY_LOCKERS', 'BOOK_VISIT', 'PAY_RENT', 'NOMINEE_REQUEST']
  }
];

export const mockRegions: RegionMaster[] = [
  {
    id: 'reg-north',
    name: 'Northern Circle',
    code: 'NCR-DEL',
    statesCovered: 'Delhi NCT, Haryana, Punjab, UP (West), Rajasthan',
    regionalHead: 'R. K. Malhotra (Chief General Manager)',
    contactEmail: 'cgm.north@apexnationalbank.in',
    branchCount: 42,
    totalVaultLockers: 14850
  },
  {
    id: 'reg-south',
    name: 'Southern Circle',
    code: 'BLR-HYD',
    statesCovered: 'Karnataka, Telangana, Andhra Pradesh, Tamil Nadu, Kerala',
    regionalHead: 'V. S. Raghavan (Chief General Manager)',
    contactEmail: 'cgm.south@apexnationalbank.in',
    branchCount: 38,
    totalVaultLockers: 12400
  },
  {
    id: 'reg-west',
    name: 'Western Circle',
    code: 'MUM-PUN',
    statesCovered: 'Maharashtra, Gujarat, Goa, Madhya Pradesh',
    regionalHead: 'Meera Chawla (Chief General Manager)',
    contactEmail: 'cgm.west@apexnationalbank.in',
    branchCount: 54,
    totalVaultLockers: 18900
  },
  {
    id: 'reg-east',
    name: 'Eastern Circle',
    code: 'KOL-BHU',
    statesCovered: 'West Bengal, Odisha, Bihar, Jharkhand, Assam & North East',
    regionalHead: 'Subir Sen (General Manager)',
    contactEmail: 'gm.east@apexnationalbank.in',
    branchCount: 26,
    totalVaultLockers: 8600
  }
];

export const mockTariffMasters: LockerTariffMaster[] = [
  {
    id: 'tar-s',
    size: 'Small',
    dimensions: '125 x 175 x 492 mm',
    annualRent: 2500,
    securityDeposit: 9000,
    breakOpenCharge: 3500,
    gstRate: 18,
    minAdvanceYears: 1,
    gracePeriodDays: 30
  },
  {
    id: 'tar-m',
    size: 'Medium',
    dimensions: '175 x 250 x 492 mm',
    annualRent: 4500,
    securityDeposit: 15000,
    breakOpenCharge: 4500,
    gstRate: 18,
    minAdvanceYears: 1,
    gracePeriodDays: 30
  },
  {
    id: 'tar-l',
    size: 'Large',
    dimensions: '250 x 375 x 492 mm',
    annualRent: 7800,
    securityDeposit: 25000,
    breakOpenCharge: 6000,
    gstRate: 18,
    minAdvanceYears: 1,
    gracePeriodDays: 30
  },
  {
    id: 'tar-xl',
    size: 'Extra Large',
    dimensions: '385 x 450 x 492 mm',
    annualRent: 12500,
    securityDeposit: 40000,
    breakOpenCharge: 8500,
    gstRate: 18,
    minAdvanceYears: 1,
    gracePeriodDays: 30
  }
];

export const mockSlaConfigs: ApprovalSlaConfig[] = [
  {
    id: 'sla-01',
    module: 'New Locker Allotment',
    description: 'Scrutiny of KYC, CIBIL score, PAN verification and compartment allocation',
    slaHours: 24,
    makerRequired: true,
    checkerRequired: true,
    escalationLevel: 'Branch Manager'
  },
  {
    id: 'sla-02',
    module: 'Nominee Registration (Form DA-1)',
    description: 'Verification of nominee identity card, witness attestation, CBS signature comparison',
    slaHours: 48,
    makerRequired: true,
    checkerRequired: true,
    escalationLevel: 'Branch Manager'
  },
  {
    id: 'sla-03',
    module: 'Lost Key & Break-Open Operation',
    description: 'Statutory 30-day notice period, vendor locksmith requisition, two independent witnesses',
    slaHours: 72,
    makerRequired: true,
    checkerRequired: true,
    escalationLevel: 'Regional Head'
  },
  {
    id: 'sla-04',
    module: 'Locker Surrender & Closure',
    description: 'Clearance of rental arrears, physical return of 2 keys, empty chamber certificate, deposit release',
    slaHours: 24,
    makerRequired: true,
    checkerRequired: true,
    escalationLevel: 'Branch Manager'
  },
  {
    id: 'sla-05',
    module: 'Deceased Hirer Claim Settlement',
    description: 'Statutory RBI 15-day settlement deadline for Form DA-1 / Legal Heir survivor claims',
    slaHours: 360,
    makerRequired: true,
    checkerRequired: true,
    escalationLevel: 'Head Office'
  },
  {
    id: 'sla-06',
    module: 'Banking Ombudsman Customer Complaint',
    description: 'Initial customer acknowledgement within 4h, root cause investigation and formal resolution',
    slaHours: 24,
    makerRequired: false,
    checkerRequired: true,
    escalationLevel: 'Head Office'
  }
];

export const mockNotificationTemplates: NotificationTemplate[] = [
  {
    id: 'tpl-01',
    code: 'NOTIF_ACCESS_LOGGED',
    title: 'Physical Vault Access Logged',
    category: 'Security',
    channel: 'SMS + Push + Mobile App',
    triggerEvent: 'Dual-key physical door operation completed by custodian',
    templateBody: 'National Bank: Safe Deposit Locker {lockerNumber} was accessed on {date} at {time} at {branchName}. If not operated by you, report immediately on 1800-425-9922.'
  },
  {
    id: 'tpl-02',
    code: 'NOTIF_RENT_DUE_REMINDER',
    title: 'Annual Locker Rental Renewal Notice',
    category: 'Billing',
    channel: 'Email + SMS',
    triggerEvent: '30 days prior to annual renewal anniversary',
    templateBody: 'Dear {customerName}, annual rental renewal of Rs. {rentAmount} for Locker {lockerNumber} is due on {dueDate}. Please maintain sufficient balance for auto-debit.'
  },
  {
    id: 'tpl-03',
    code: 'NOTIF_ALLOTMENT_SANCTIONED',
    title: 'Locker Allotment Sanction Letter',
    category: 'Service Request',
    channel: 'SMS + Push + Mobile App',
    triggerEvent: 'Checker approval and allocation of safe deposit compartment',
    templateBody: 'Congratulations! Safe Deposit Locker {lockerNumber} ({size}) allotted at {branchName}. Please schedule key handover visit and sign Model Agreement.'
  },
  {
    id: 'tpl-04',
    code: 'NOTIF_DA1_NOMINEE_REGISTERED',
    title: 'Form DA-1 Nomination Registration Acknowledged',
    category: 'Agreement',
    channel: 'SMS + Push + Mobile App',
    triggerEvent: 'Branch Operations Checker approves nomination mandate',
    templateBody: 'Nominee {nomineeName} successfully registered under Form DA-1 (Ref: {da1Ref}) for Locker {lockerNumber}. Stamped acknowledgement available in Document Vault.'
  },
  {
    id: 'tpl-05',
    code: 'NOTIF_DECEASED_CLAIM_STAGE',
    title: 'Deceased Hirer Claim Progress Update',
    category: 'Service Request',
    channel: 'Email + SMS',
    triggerEvent: 'Claim stage progressed by Branch Custody Committee',
    templateBody: 'Claim {claimNumber} for Locker {lockerNumber} has moved to stage: {stageName}. Scheduled inventory inspection date: {inventoryDate}.'
  }
];

export const mockAccessDisputes: AccessDispute[] = [
  {
    id: 'disp-01',
    disputeNumber: 'DISP-2026-DEL-0419',
    accessLogId: 'acc-03',
    lockerNumber: 'A-125',
    reportedDate: '2026-10-22',
    customerRemarks: 'Hirer noticed access logged on 14 Oct 2026 at 11:24 AM while customer claims to have been in Mumbai for business conference.',
    investigationOfficer: 'Rameshwar Patil (Senior Auditor & Security Cell)',
    securityRemarks: 'CCTV footage reel #CP-VLT-0414 retrieved. Verified that authorized joint hirer Pooja Sharma presented biometric & secondary key. Confirmed authorized operation.',
    cctvFootageStatus: 'Reviewed - Verified Hirer',
    status: 'Resolved - False Alarm',
    resolvedDate: '2026-10-23'
  }
];

export const mockScenarios: WorkflowScenario[] = [
  {
    id: 'scen-01',
    scenarioCode: 'SCENARIO-1',
    title: 'New Locker Application & Allotment',
    category: 'Customer',
    description: 'Customer searches availability, compares transparent prices, submits KYC application -> Branch Maker verifies -> Branch Checker approves -> Unit allotted -> Agreement available in vault.',
    status: 'Implemented & Verified',
    steps: [
      { stepNumber: 1, title: 'Locker Discovery', roleRequired: 'customer', actorDescription: 'Rahul Sharma', actionDescription: 'Search branch Strongroom inventory and review pricing matrix', isCompleted: true },
      { stepNumber: 2, title: 'Submit Application', roleRequired: 'customer', actorDescription: 'Rahul Sharma', actionDescription: 'Fill CIF, PAN, linked account and submit digital allotment form', isCompleted: true },
      { stepNumber: 3, title: 'Maker Verification', roleRequired: 'branch_maker', actorDescription: 'Anil Kumar (Maker)', actionDescription: 'Verify KYC documentation, CIBIL eligibility, and recommend approval', isCompleted: true },
      { stepNumber: 4, title: 'Checker Approval', roleRequired: 'branch_checker', actorDescription: 'Priya Nair (Checker)', actionDescription: 'Authorize allotment, assign physical compartment and generate order', isCompleted: true },
      { stepNumber: 5, title: 'Agreement & Vault Sync', roleRequired: 'customer', actorDescription: 'Rahul Sharma', actionDescription: 'Model Agreement available in Document Vault and active on dashboard', isCompleted: true },
    ]
  },
  {
    id: 'scen-02',
    scenarioCode: 'SCENARIO-2',
    title: 'Waiting List Registration & Auto-Allocation',
    category: 'Customer',
    description: 'Customer discovers high-demand size unavailable, registers on waiting list with priority score -> Branch inventory updates -> Checker allocates vacant compartment to top waitlist entry.',
    status: 'Implemented & Verified',
    steps: [
      { stepNumber: 1, title: 'Discover Unavailable Size', roleRequired: 'customer', actorDescription: 'Customer', actionDescription: 'Search shows 0 vacant units for Extra Large size at Connaught Place', isCompleted: true },
      { stepNumber: 2, title: 'Join Waiting List', roleRequired: 'customer', actorDescription: 'Customer', actionDescription: 'Register priority entry with contact and linked account details', isCompleted: true },
      { stepNumber: 3, title: 'Branch Inventory Scrutiny', roleRequired: 'branch_maker', actorDescription: 'Branch Maker', actionDescription: 'Review waitlist queue sorted by priority score and date of joining', isCompleted: true },
      { stepNumber: 4, title: 'Locker Allocation', roleRequired: 'branch_checker', actorDescription: 'Branch Checker', actionDescription: 'Allocate newly vacant compartment and send formal allotment notification', isCompleted: true },
    ]
  },
  {
    id: 'scen-03',
    scenarioCode: 'SCENARIO-3',
    title: 'Vault Visit Booking & Dual-Key Check-In',
    category: 'Branch Operations',
    description: 'Customer reserves 30-min private booth access, receives QR token -> Branch turnstile verifies gate token -> Custodian executes dual-key physical turn -> Biometric access log written.',
    status: 'Implemented & Verified',
    steps: [
      { stepNumber: 1, title: 'Book 30-Min Slot', roleRequired: 'customer', actorDescription: 'Rahul Sharma', actionDescription: 'Select date and time slot with purpose and accompanying persons', isCompleted: true },
      { stepNumber: 2, title: 'Token & QR Generation', roleRequired: 'customer', actorDescription: 'Customer App', actionDescription: 'Generate secure digital check-in token and QR gate pass', isCompleted: true },
      { stepNumber: 3, title: 'Turnstile Check-In', roleRequired: 'branch_maker', actorDescription: 'Vault Custodian', actionDescription: 'Scan visitor QR pass and verify photo identification at gate', isCompleted: true },
      { stepNumber: 4, title: 'Dual-Key Turn & Exit', roleRequired: 'branch_checker', actorDescription: 'Senior Custodian', actionDescription: 'Engage Master Key #1 with Hirer Key #2 and record departure log', isCompleted: true },
    ]
  },
  {
    id: 'scen-04',
    scenarioCode: 'SCENARIO-4',
    title: 'Locker Rent Settlement & NACH Auto-Debit',
    category: 'Customer',
    description: 'Customer inspects annual rental dues, completes instant online payment via 2FA OTP -> Stamped GST tax invoice generated in vault -> CBS ledger and next renewal horizon updated.',
    status: 'Implemented & Verified',
    steps: [
      { stepNumber: 1, title: 'Inspect Dues', roleRequired: 'customer', actorDescription: 'Rahul Sharma', actionDescription: 'View base annual rent, 18% GST and linked FD security deposit', isCompleted: true },
      { stepNumber: 2, title: 'Step-Up OTP Payment', roleRequired: 'customer', actorDescription: 'Rahul Sharma', actionDescription: 'Authenticate payment via simulated CBS 2FA OTP modal', isCompleted: true },
      { stepNumber: 3, title: 'Tax Invoice Download', roleRequired: 'customer', actorDescription: 'Customer App', actionDescription: 'Instantly download official stamped tax receipt with transaction ref', isCompleted: true },
      { stepNumber: 4, title: 'Ledger Reconciliation', roleRequired: 'branch_checker', actorDescription: 'CBS Auto-Debit', actionDescription: 'Reconcile outstanding balance to zero and advance renewal date by 1 year', isCompleted: true },
    ]
  },
  {
    id: 'scen-05',
    scenarioCode: 'SCENARIO-5',
    title: 'Nominee Addition & Form DA-1 Verification',
    category: 'Branch Operations',
    description: 'Customer submits Form DA-1 nomination -> Maker scrutinizes identity proofs and witness declaration -> Checker registers official endorsement -> Certificate published to vault.',
    status: 'Implemented & Verified',
    steps: [
      { stepNumber: 1, title: 'Submit Form DA-1', roleRequired: 'customer', actorDescription: 'Rahul Sharma', actionDescription: 'Enter nominee relationship, minor guardian details and contact info', isCompleted: true },
      { stepNumber: 2, title: 'Maker Document Scrutiny', roleRequired: 'branch_maker', actorDescription: 'Anil Kumar (Maker)', actionDescription: 'Cross-check nominee details against CBS signature card', isCompleted: true },
      { stepNumber: 3, title: 'Checker Final Approval', roleRequired: 'branch_checker', actorDescription: 'Priya Nair (Checker)', actionDescription: 'Approve nomination and issue formal bank endorsement number', isCompleted: true },
      { stepNumber: 4, title: 'Vault Certificate Sync', roleRequired: 'customer', actorDescription: 'Document Vault', actionDescription: 'Official Form DA-1 endorsement document indexed in customer vault', isCompleted: true },
    ]
  },
  {
    id: 'scen-06',
    scenarioCode: 'SCENARIO-6',
    title: 'Lost Key Reporting & Break-Open Protocol',
    category: 'Branch Operations',
    description: 'Hirer reports lost key -> Branch manager assigns technical desk -> Requisition vendor locksmith -> Calculate break-open charges -> Schedule drill operation with two witnesses.',
    status: 'Implemented & Verified',
    steps: [
      { stepNumber: 1, title: 'Report Lost Key', roleRequired: 'customer', actorDescription: 'Rahul Sharma', actionDescription: 'Raise emergency Lost Key & Break-Open ticket with lost affidavit details', isCompleted: true },
      { stepNumber: 2, title: 'Technical Assessment', roleRequired: 'branch_maker', actorDescription: 'Anil Kumar (Maker)', actionDescription: 'Calculate vendor locksmith tariff (Rs. 4,500) and draft statutory notice', isCompleted: true },
      { stepNumber: 3, title: 'Manager Authorization', roleRequired: 'branch_manager', actorDescription: 'Vikramaditya Sen (BM)', actionDescription: 'Sign off break-open warrant and appoint two independent branch witnesses', isCompleted: true },
      { stepNumber: 4, title: 'Lock Replacement', roleRequired: 'branch_checker', actorDescription: 'Priya Nair (Checker)', actionDescription: 'Execute physical drill in presence of hirer and hand over brand new key set', isCompleted: true },
    ]
  },
  {
    id: 'scen-07',
    scenarioCode: 'SCENARIO-7',
    title: 'Locker Surrender & Security Deposit Settlement',
    category: 'Branch Operations',
    description: 'Hirer requests surrender -> Branch verifies zero outstanding dues -> Scheduled key return appointment -> Zero-contents certificate -> Release fixed deposit security lien.',
    status: 'Implemented & Verified',
    steps: [
      { stepNumber: 1, title: 'Initiate Surrender', roleRequired: 'customer', actorDescription: 'Rahul Sharma', actionDescription: 'Submit surrender notice and select savings account for deposit refund', isCompleted: true },
      { stepNumber: 2, title: 'Dues & Keys Verification', roleRequired: 'branch_maker', actorDescription: 'Anil Kumar (Maker)', actionDescription: 'Verify zero outstanding arrears and receive 2 original keys at counter', isCompleted: true },
      { stepNumber: 3, title: 'Physical Chamber Clearance', roleRequired: 'branch_checker', actorDescription: 'Priya Nair (Checker)', actionDescription: 'Inspect compartment with hirer, certify zero contents and sign clearance', isCompleted: true },
      { stepNumber: 4, title: 'Deposit Release & Reset', roleRequired: 'branch_manager', actorDescription: 'Branch Manager', actionDescription: 'Release Rs. 15,000 FD lien, mark locker Vacant, and generate settlement deed', isCompleted: true },
    ]
  },
  {
    id: 'scen-08',
    scenarioCode: 'SCENARIO-8',
    title: 'Customer Grievance & Banking Ombudsman SLA',
    category: 'Customer',
    description: 'Customer lodges service grievance -> Assigned to Branch Quality Cell -> 24-hour SLA countdown -> Investigation remarks -> Resolution notice dispatched to customer.',
    status: 'Implemented & Verified',
    steps: [
      { stepNumber: 1, title: 'Lodge Complaint', roleRequired: 'customer', actorDescription: 'Rahul Sharma', actionDescription: 'File formal grievance under RBI Customer Protection Framework', isCompleted: true },
      { stepNumber: 2, title: 'Ombudsman Desk Triage', roleRequired: 'branch_maker', actorDescription: 'Quality Desk', actionDescription: 'Acknowledge complaint within 4 hours and assign investigating officer', isCompleted: true },
      { stepNumber: 3, title: 'Investigation & Resolution', roleRequired: 'branch_manager', actorDescription: 'Branch Operations Head', actionDescription: 'Enter root-cause analysis, issue corrective credit/waiver and mark resolved', isCompleted: true },
      { stepNumber: 4, title: 'Resolution Notice', roleRequired: 'customer', actorDescription: 'Customer App', actionDescription: 'Track resolution note and customer satisfaction confirmation', isCompleted: true },
    ]
  },
  {
    id: 'scen-09',
    scenarioCode: 'SCENARIO-9',
    title: 'Deceased-Holder Claim Settlement (15-Day SLA)',
    category: 'Branch Operations',
    description: 'Nominee reports death of primary hirer -> Uploads Death Certificate & KYC -> Branch Legal Scrutiny -> Schedule physical inventory -> Release safe custody articles to nominee.',
    status: 'Implemented & Verified',
    steps: [
      { stepNumber: 1, title: 'Register Claim', roleRequired: 'customer', actorDescription: 'Nominee / Claimant', actionDescription: 'Enter deceased hirer details and upload death certificate', isCompleted: true },
      { stepNumber: 2, title: 'Legal Scrutiny', roleRequired: 'branch_maker', actorDescription: 'Legal Committee', actionDescription: 'Verify Form DA-1 registration reference and succession rights', isCompleted: true },
      { stepNumber: 3, title: 'Inventory Schedule', roleRequired: 'branch_checker', actorDescription: 'Senior Custodian', actionDescription: 'Schedule physical inventory in presence of two independent witnesses', isCompleted: true },
      { stepNumber: 4, title: 'Release Authorization', roleRequired: 'branch_manager', actorDescription: 'Branch Operations Head', actionDescription: 'Authorize delivery of contents to nominee within statutory 15-day limit', isCompleted: true },
    ]
  },
  {
    id: 'scen-10',
    scenarioCode: 'SCENARIO-10',
    title: 'Unrecognized Vault Access Dispute & CCTV Audit',
    category: 'Branch Operations',
    description: 'Customer flags unfamiliar access log -> Emergency freeze applied immediately -> Security cell retrieves turnstile biometric footage -> Formal findings communicated to customer.',
    status: 'Implemented & Verified',
    steps: [
      { stepNumber: 1, title: 'Flag Access Dispute', roleRequired: 'customer', actorDescription: 'Rahul Sharma', actionDescription: 'Click "Report Unrecognized Access" on access log and apply security freeze', isCompleted: true },
      { stepNumber: 2, title: 'Security Incident Created', roleRequired: 'customer', actorDescription: 'Customer App', actionDescription: 'Generate dispute ticket DISP-2026-DEL-XXXX with urgent priority', isCompleted: true },
      { stepNumber: 3, title: 'CCTV & Biometric Audit', roleRequired: 'auditor', actorDescription: 'Internal Auditor & Security Cell', actionDescription: 'Retrieve 4K vault camera feed, verify turnstile credentials, record findings', isCompleted: true },
      { stepNumber: 4, title: 'Dispute Closure & Unfreeze', roleRequired: 'branch_manager', actorDescription: 'Branch Manager', actionDescription: 'Resolve dispute ticket, notify customer, and lift security freeze upon re-auth', isCompleted: true },
    ]
  }
];

