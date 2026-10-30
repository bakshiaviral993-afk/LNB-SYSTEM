/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * National Bank SafeVault — Integration-Ready Service Layer
 * Simulates integration with the Bank's Core Banking System (CBS),
 * Locker Management System (LMS), Payment Gateway (PG),
 * Identity Provider (IAM), and Document Management System (DMS).
 */

import {
  Branch,
  LockerItem,
  Appointment,
  PaymentRecord,
  LockerApplication,
  ServiceRequest,
  ClaimRequest,
  Complaint,
  WaitingListEntry,
  StoredDocument,
  AccessLog
} from '../types';

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
  message: string;
  transactionId: string;
  timestamp: string;
  mockAdapter: 'CBS-API-v2' | 'LMS-CORE-v4' | 'PAYMENT-GATEWAY' | 'BIOMETRIC-TURNSTILE' | 'DMS-STORAGE';
}

export interface BankCustomerProfile {
  cifNumber: string;
  customerName: string;
  segment: 'HNI Premier Wealth' | 'Retail Wealth' | 'Standard Retail';
  isHni: boolean;
  primaryBranchCode: string;
  panNumber: string;
  maskedAadhaar: string;
  mobile: string;
  email: string;
  linkedAccounts: {
    accountNumber: string;
    accountType: string;
    balance: number;
    autoDebitEligible: boolean;
  }[];
  activeLockersCount: number;
  kycComplianceStatus: 'Fully Compliant' | 'Refresh Due' | 'Non-Compliant';
}

// Authenticated Customer Profile (Simulating National Bank CBS Record)
export const mockBankCustomerProfile: BankCustomerProfile = {
  cifNumber: 'CIF-9028192831',
  customerName: 'Rahul Sharma',
  segment: 'HNI Premier Wealth',
  isHni: true,
  primaryBranchCode: 'ANB000101',
  panNumber: 'ABCPS1234F',
  maskedAadhaar: 'XXXX-XXXX-8921',
  mobile: '+91 98101 23456',
  email: 'rahul.sharma@enterprise-corp.in',
  linkedAccounts: [
    {
      accountNumber: '5010049281720',
      accountType: 'Premier Wealth Savings (Auto-Debit Linked)',
      balance: 1485000,
      autoDebitEligible: true
    },
    {
      accountNumber: '5020081920194',
      accountType: 'Classic Current Account',
      balance: 520000,
      autoDebitEligible: true
    }
  ],
  activeLockersCount: 3,
  kycComplianceStatus: 'Fully Compliant'
};

/**
 * Bank API Client Adapter
 */
export const bankIntegrationApi = {
  /**
   * Fetch authenticated customer profile from CBS
   */
  async getCustomerProfile(cif: string): Promise<ApiResponse<BankCustomerProfile>> {
    await simulateNetworkDelay(120);
    return {
      success: true,
      statusCode: 200,
      data: mockBankCustomerProfile,
      message: 'Customer CIF verified via CBS Enterprise Directory',
      transactionId: `TXN-CBS-${Date.now()}`,
      timestamp: new Date().toISOString(),
      mockAdapter: 'CBS-API-v2'
    };
  },

  /**
   * Check branch slot availability based on duration and HNI priority
   */
  async checkSlotAvailability(
    branchId: string,
    date: string,
    durationMinutes: 10 | 15 | 30,
    isHni: boolean
  ): Promise<ApiResponse<{ availableSlots: string[]; bookedCount: number; peakHour: boolean }>> {
    await simulateNetworkDelay(100);

    // Dynamic slot generator avoiding overlaps
    const baseSlotsByDuration: Record<number, string[]> = {
      10: [
        '10:00 AM - 10:10 AM', '10:15 AM - 10:25 AM', '10:30 AM - 10:40 AM',
        '11:00 AM - 11:10 AM', '11:15 AM - 11:25 AM', '11:30 AM - 11:40 AM',
        '02:00 PM - 02:10 PM', '02:15 PM - 02:25 PM', '02:30 PM - 02:40 PM',
        '03:00 PM - 03:10 PM', '03:15 PM - 03:25 PM', '03:30 PM - 03:40 PM',
        '04:00 PM - 04:10 PM'
      ],
      15: [
        '10:00 AM - 10:15 AM', '10:20 AM - 10:35 AM', '10:45 AM - 11:00 AM',
        '11:15 AM - 11:30 AM', '11:35 AM - 11:50 AM', '02:00 PM - 02:15 PM',
        '02:20 PM - 02:35 PM', '02:45 PM - 03:00 PM', '03:15 PM - 03:30 PM',
        '03:45 PM - 04:00 PM'
      ],
      30: [
        '10:00 AM - 10:30 AM', '10:35 AM - 11:05 AM', '11:15 AM - 11:45 AM',
        '02:00 PM - 02:30 PM', '02:35 PM - 03:05 PM', '03:15 PM - 03:45 PM'
      ]
    };

    let slots = [...(baseSlotsByDuration[durationMinutes] || baseSlotsByDuration[15])];

    // HNI priority gets dedicated VIP slots
    if (isHni) {
      slots.unshift(
        durationMinutes === 10
          ? '09:45 AM - 09:55 AM (HNI Express)'
          : durationMinutes === 15
          ? '09:40 AM - 09:55 AM (HNI Express)'
          : '09:30 AM - 10:00 AM (HNI Executive Access)'
      );
    }

    return {
      success: true,
      statusCode: 200,
      data: {
        availableSlots: slots,
        bookedCount: 4,
        peakHour: false
      },
      message: 'Real-time strongroom capacity reconciled',
      transactionId: `TXN-LMS-${Date.now()}`,
      timestamp: new Date().toISOString(),
      mockAdapter: 'LMS-CORE-v4'
    };
  },

  /**
   * Reschedule appointment via LMS API
   */
  async rescheduleAppointment(
    appointmentId: string,
    newDate: string,
    newSlot: string,
    reason: string,
    fee: number
  ): Promise<ApiResponse<{ confirmationToken: string; updatedStatus: string }>> {
    await simulateNetworkDelay(180);
    return {
      success: true,
      statusCode: 200,
      data: {
        confirmationToken: `RES-ANB-${Date.now().toString().slice(-6)}`,
        updatedStatus: 'Rescheduled'
      },
      message: `Appointment successfully rescheduled to ${newDate} at ${newSlot}. Fee of ₹${fee} processed.`,
      transactionId: `TXN-RES-${Date.now()}`,
      timestamp: new Date().toISOString(),
      mockAdapter: 'LMS-CORE-v4'
    };
  },

  /**
   * Cancel appointment and release slot capacity
   */
  async cancelAppointment(
    appointmentId: string,
    reason: string,
    fee: number
  ): Promise<ApiResponse<{ cancellationReference: string; capacityReleased: boolean }>> {
    await simulateNetworkDelay(150);
    return {
      success: true,
      statusCode: 200,
      data: {
        cancellationReference: `CNL-ANB-${Date.now().toString().slice(-6)}`,
        capacityReleased: true
      },
      message: `Appointment cancelled. Reason logged: "${reason}". Slot returned to public availability pool.`,
      transactionId: `TXN-CNL-${Date.now()}`,
      timestamp: new Date().toISOString(),
      mockAdapter: 'LMS-CORE-v4'
    };
  },

  /**
   * Process Online Rent Payment via Payment Gateway
   */
  async processRentPayment(
    lockerId: string,
    amount: number,
    method: string
  ): Promise<ApiResponse<{ receiptNumber: string; utr: string; taxInvoiceId: string }>> {
    await simulateNetworkDelay(250);
    const receiptNumber = `RCP-2026-PAY-${Math.floor(100000 + Math.random() * 900000)}`;
    const utr = `UTR-ANB${Date.now()}`;
    return {
      success: true,
      statusCode: 200,
      data: {
        receiptNumber,
        utr,
        taxInvoiceId: `INV-GST-2026-${Math.floor(1000 + Math.random() * 9000)}`
      },
      message: `Payment of ₹${amount.toLocaleString('en-IN')} captured successfully via ${method}.`,
      transactionId: utr,
      timestamp: new Date().toISOString(),
      mockAdapter: 'PAYMENT-GATEWAY'
    };
  },

  /**
   * Dispute an unauthorized or unrecognized locker turnstile access
   */
  async disputeAccessLog(
    accessLogId: string,
    lockerNumber: string,
    reason: string
  ): Promise<ApiResponse<{ disputeTicketId: string; securityHoldApplied: boolean }>> {
    await simulateNetworkDelay(150);
    const ticket = `SEC-DISP-${Date.now().toString().slice(-5)}`;
    return {
      success: true,
      statusCode: 201,
      data: {
        disputeTicketId: ticket,
        securityHoldApplied: true
      },
      message: `Emergency Security Hold placed on Locker #${lockerNumber}. Vigilance & CCTV audit ticket ${ticket} initiated.`,
      transactionId: ticket,
      timestamp: new Date().toISOString(),
      mockAdapter: 'BIOMETRIC-TURNSTILE'
    };
  }
};

function simulateNetworkDelay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
