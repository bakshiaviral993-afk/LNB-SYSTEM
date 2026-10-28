/**
 * National Bank - SafeVault Locker Management System
 * Role-Based Access Control (RBAC) & Four-Eyes Maker-Checker Policy Engine
 * Compliant with RBI Master Directions on Safe Custody & Information Security
 */

import { UserRole, StaffUser } from '../types';

export type AppModule = 
  | 'dashboard'
  | 'find_locker'
  | 'applications'
  | 'inventory'
  | 'visits'
  | 'billing'
  | 'holders_nominees'
  | 'agreements'
  | 'requests'
  | 'claims'
  | 'complaints'
  | 'vault'
  | 'audit'
  | 'administration'
  | 'reports';

export type AppOperation = 
  | 'view'
  | 'create'
  | 'edit'
  | 'submit'
  | 'verify_maker'
  | 'approve_checker'
  | 'reject'
  | 'download'
  | 'export'
  | 'freeze_locker'
  | 'delete';

export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
  policyCode?: string;
}

// Complete Role x Module x Operation Matrix
export const ROLE_PERMISSIONS_MATRIX: Record<UserRole, Record<AppModule, AppOperation[]>> = {
  customer: {
    dashboard: ['view', 'download'],
    find_locker: ['view', 'create', 'submit'],
    applications: ['view', 'create', 'submit'],
    inventory: ['view'],
    visits: ['view', 'create', 'submit', 'download'],
    billing: ['view', 'submit', 'download'],
    holders_nominees: ['view', 'create', 'submit'],
    agreements: ['view', 'submit', 'download'],
    requests: ['view', 'create', 'submit', 'download'],
    claims: ['view', 'create', 'submit', 'download'],
    complaints: ['view', 'create', 'submit'],
    vault: ['view', 'download'],
    audit: ['view'], // Own audit log
    administration: [],
    reports: ['view'],
  },
  branch_maker: {
    dashboard: ['view'],
    find_locker: ['view'],
    applications: ['view', 'edit', 'verify_maker', 'reject', 'download'],
    inventory: ['view', 'edit', 'download'],
    visits: ['view', 'create', 'edit', 'verify_maker', 'download'],
    billing: ['view', 'create', 'download'],
    holders_nominees: ['view', 'edit', 'verify_maker', 'download'],
    agreements: ['view', 'download'],
    requests: ['view', 'edit', 'verify_maker', 'download'],
    claims: ['view', 'edit', 'verify_maker', 'download'],
    complaints: ['view', 'edit', 'verify_maker'],
    vault: ['view', 'download'],
    audit: ['view'],
    administration: ['view'],
    reports: ['view', 'export'],
  },
  branch_checker: {
    dashboard: ['view'],
    find_locker: ['view'],
    applications: ['view', 'approve_checker', 'reject', 'download'],
    inventory: ['view', 'edit', 'download'],
    visits: ['view', 'approve_checker', 'download'],
    billing: ['view', 'approve_checker', 'download'],
    holders_nominees: ['view', 'approve_checker', 'reject', 'download'],
    agreements: ['view', 'approve_checker', 'download'],
    requests: ['view', 'approve_checker', 'reject', 'download'],
    claims: ['view', 'approve_checker', 'reject', 'download'],
    complaints: ['view', 'approve_checker'],
    vault: ['view', 'download'],
    audit: ['view'],
    administration: ['view'],
    reports: ['view', 'export'],
  },
  branch_manager: {
    dashboard: ['view', 'export'],
    find_locker: ['view'],
    applications: ['view', 'approve_checker', 'reject', 'download', 'export'],
    inventory: ['view', 'edit', 'create', 'download', 'export'],
    visits: ['view', 'approve_checker', 'download', 'export'],
    billing: ['view', 'approve_checker', 'download', 'export'],
    holders_nominees: ['view', 'approve_checker', 'reject', 'download', 'export'],
    agreements: ['view', 'approve_checker', 'download', 'export'],
    requests: ['view', 'approve_checker', 'reject', 'download', 'export'],
    claims: ['view', 'approve_checker', 'reject', 'download', 'export'],
    complaints: ['view', 'approve_checker', 'reject', 'edit'],
    vault: ['view', 'download', 'export'],
    audit: ['view', 'export'],
    administration: ['view', 'edit', 'download'],
    reports: ['view', 'export'],
  },
  locker_custodian: {
    dashboard: ['view'],
    find_locker: ['view'],
    applications: ['view'],
    inventory: ['view', 'edit', 'download'],
    visits: ['view', 'create', 'edit', 'verify_maker', 'approve_checker', 'download'],
    billing: ['view'],
    holders_nominees: ['view'],
    agreements: ['view', 'download'],
    requests: ['view', 'verify_maker', 'download'],
    claims: ['view', 'verify_maker'],
    complaints: ['view'],
    vault: ['view', 'download'],
    audit: ['view'],
    administration: ['view'],
    reports: ['view'],
  },
  customer_service: {
    dashboard: ['view'],
    find_locker: ['view'],
    applications: ['view'],
    inventory: ['view'],
    visits: ['view', 'create'],
    billing: ['view', 'download'],
    holders_nominees: ['view'],
    agreements: ['view'],
    requests: ['view', 'create'],
    claims: ['view', 'create'],
    complaints: ['view', 'create', 'edit'],
    vault: ['view'],
    audit: ['view'],
    administration: [],
    reports: ['view'],
  },
  regional_manager: {
    dashboard: ['view', 'export'],
    find_locker: ['view'],
    applications: ['view', 'download', 'export'],
    inventory: ['view', 'download', 'export'],
    visits: ['view', 'download'],
    billing: ['view', 'download', 'export'],
    holders_nominees: ['view', 'download'],
    agreements: ['view', 'download'],
    requests: ['view', 'download'],
    claims: ['view', 'download'],
    complaints: ['view', 'edit'],
    vault: ['view', 'download'],
    audit: ['view', 'export'],
    administration: ['view', 'edit', 'download'],
    reports: ['view', 'export'],
  },
  ho_admin: {
    dashboard: ['view', 'export'],
    find_locker: ['view'],
    applications: ['view', 'download', 'export'],
    inventory: ['view', 'create', 'edit', 'download', 'export'],
    visits: ['view', 'download', 'export'],
    billing: ['view', 'download', 'export'],
    holders_nominees: ['view', 'download', 'export'],
    agreements: ['view', 'download', 'export'],
    requests: ['view', 'download', 'export'],
    claims: ['view', 'download', 'export'],
    complaints: ['view', 'edit', 'download'],
    vault: ['view', 'download', 'export'],
    audit: ['view', 'export'],
    administration: ['view', 'create', 'edit', 'download', 'export'],
    reports: ['view', 'export'],
  },
  super_admin: {
    dashboard: ['view', 'export'],
    find_locker: ['view'],
    applications: ['view', 'approve_checker', 'reject', 'download', 'export'],
    inventory: ['view', 'create', 'edit', 'delete', 'download', 'export'],
    visits: ['view', 'approve_checker', 'download', 'export'],
    billing: ['view', 'approve_checker', 'download', 'export'],
    holders_nominees: ['view', 'approve_checker', 'reject', 'download', 'export'],
    agreements: ['view', 'approve_checker', 'download', 'export'],
    requests: ['view', 'approve_checker', 'reject', 'download', 'export'],
    claims: ['view', 'approve_checker', 'reject', 'download', 'export'],
    complaints: ['view', 'approve_checker', 'edit', 'delete', 'download', 'export'],
    vault: ['view', 'download', 'export', 'create'],
    audit: ['view', 'export'],
    administration: ['view', 'create', 'edit', 'delete', 'download', 'export'],
    reports: ['view', 'export'],
  },
  auditor: {
    dashboard: ['view'],
    find_locker: ['view'],
    applications: ['view', 'download'],
    inventory: ['view', 'download'],
    visits: ['view', 'download'],
    billing: ['view', 'download'],
    holders_nominees: ['view', 'download'],
    agreements: ['view', 'download'],
    requests: ['view', 'download'],
    claims: ['view', 'download'],
    complaints: ['view'],
    vault: ['view', 'download'],
    audit: ['view', 'export'],
    administration: ['view'],
    reports: ['view', 'export'],
  },
  admin: {
    dashboard: ['view', 'export'],
    find_locker: ['view'],
    applications: ['view', 'approve_checker', 'reject', 'download', 'export'],
    inventory: ['view', 'create', 'edit', 'download', 'export'],
    visits: ['view', 'approve_checker', 'download', 'export'],
    billing: ['view', 'approve_checker', 'download', 'export'],
    holders_nominees: ['view', 'approve_checker', 'reject', 'download', 'export'],
    agreements: ['view', 'approve_checker', 'download', 'export'],
    requests: ['view', 'approve_checker', 'reject', 'download', 'export'],
    claims: ['view', 'approve_checker', 'reject', 'download', 'export'],
    complaints: ['view', 'approve_checker', 'download'],
    vault: ['view', 'download', 'export'],
    audit: ['view', 'export'],
    administration: ['view', 'create', 'edit', 'download', 'export'],
    reports: ['view', 'export'],
  }
};

/**
 * Checks whether a given role has permission to execute an operation on a module
 */
export const checkPermission = (
  role: UserRole,
  module: AppModule,
  operation: AppOperation
): PermissionCheckResult => {
  const allowedOperations = ROLE_PERMISSIONS_MATRIX[role]?.[module] || [];
  if (allowedOperations.includes(operation)) {
    return { allowed: true };
  }
  return {
    allowed: false,
    policyCode: 'AUTH-403-RBAC-DENIED',
    reason: `Access Denied: Role '${formatRoleTitle(role)}' does not have permission to execute '${operation}' on '${module}'.`
  };
};

/**
 * Validates Maker-Checker Dual-Control (Four-Eyes Principle)
 * Rule: The user who performed maker verification CANNOT approve the transaction as checker.
 */
export const validateMakerChecker = (
  currentUser: StaffUser,
  makerActorNameOrId?: string
): PermissionCheckResult => {
  // Check 1: Maker role cannot approve
  if (currentUser.role === 'branch_maker') {
    return {
      allowed: false,
      policyCode: 'FOUR-EYES-ROLE-MISMATCH',
      reason: `Maker Segregation: User '${currentUser.name}' has Branch Maker role. An authorized Branch Checker or Branch Manager must approve.`
    };
  }

  // Check 2: Auditor or Customer cannot approve
  if (currentUser.role === 'auditor' || currentUser.role === 'customer') {
    return {
      allowed: false,
      policyCode: 'FOUR-EYES-UNAUTHORIZED-ROLE',
      reason: `Access Denied: Role '${currentUser.role}' does not possess checker approval authority.`
    };
  }

  // Check 3: Maker self-approval violation
  if (makerActorNameOrId) {
    const makerLower = makerActorNameOrId.toLowerCase();
    const currentNameLower = currentUser.name.toLowerCase();
    const currentCode = (currentUser.employeeCode || currentUser.employeeId || '').toLowerCase();
    const currentId = currentUser.id.toLowerCase();

    const isSelfApproval = 
      makerLower.includes(currentNameLower) ||
      (currentCode && makerLower.includes(currentCode)) ||
      makerLower.includes(currentId);

    if (isSelfApproval) {
      return {
        allowed: false,
        policyCode: 'FOUR-EYES-SELF-APPROVAL-VIOLATION',
        reason: `Four-Eyes Principle Violation: Maker '${currentUser.name}' cannot approve their own submission. An independent Branch Checker or Manager must authorize this transaction.`
      };
    }
  }

  return { allowed: true };
};

export const formatRoleTitle = (role: UserRole): string => {
  switch (role) {
    case 'customer': return 'Customer';
    case 'branch_maker': return 'Branch Operations Maker';
    case 'branch_checker': return 'Branch Operations Checker';
    case 'branch_manager': return 'Branch Manager';
    case 'locker_custodian': return 'Locker Custodian';
    case 'customer_service': return 'Customer Service Executive';
    case 'regional_manager': return 'Regional Manager';
    case 'ho_admin': return 'Head Office Administrator';
    case 'super_admin': return 'Super Administrator';
    case 'auditor': return 'Audit / Compliance Officer';
    case 'admin': return 'Administrator';
    default: return role;
  }
};
