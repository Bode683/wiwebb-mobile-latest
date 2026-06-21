/**
 * RBAC core — two orthogonal axes:
 *   1. Role  (what actions)     → deriveRole / can
 *   2. Tenant (which tenants)   → memberOrgIds / canAccessOrg
 *
 * Role is derived from the OpenWISP boolean combination so the UI stays
 * clean and the mapping is the only thing that changes for a real backend.
 */
import type { User, OrganizationUser } from '../../types/api';

export type Role = 'super_admin' | 'super_admin_delegate' | 'admin' | 'viewer';

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super Admin',
  super_admin_delegate: 'Super Admin Delegate',
  admin: 'Admin',
  viewer: 'Viewer',
};

/** Rank for "at least this role" comparisons (higher = more privileged). */
const ROLE_RANK: Record<Role, number> = {
  viewer: 0,
  admin: 1,
  super_admin_delegate: 2,
  super_admin: 3,
};

function orgUsers(user: User | null | undefined): OrganizationUser[] {
  return user?.organization_users ?? [];
}

/** True if the user is an admin of at least one organization. */
export function isAnyOrgAdmin(user: User | null | undefined): boolean {
  return orgUsers(user).some((o) => o.is_admin);
}

/**
 * Map the OpenWISP boolean combo → display role.
 *   super_admin           : is_superuser
 *   super_admin_delegate  : is_staff (not superuser)
 *   admin                 : org admin of ≥1 org
 *   viewer                : everything else
 */
export function deriveRole(user: User | null | undefined): Role {
  if (!user) return 'viewer';
  if (user.is_superuser) return 'super_admin';
  if (user.is_staff) return 'super_admin_delegate';
  if (isAnyOrgAdmin(user)) return 'admin';
  return 'viewer';
}

export function hasAtLeastRole(user: User | null | undefined, role: Role): boolean {
  return ROLE_RANK[deriveRole(user)] >= ROLE_RANK[role];
}

// ── Actions → minimum role ────────────────────────────────────────────
export type Action =
  | 'manage_users' // invite / edit users
  | 'manage_roles' // change someone's role
  | 'manage_sites'
  | 'manage_devices'
  | 'adopt_device'
  | 'manage_plans'
  | 'manage_payment_methods'
  | 'manage_org'; // create/edit/delete the organization itself

const ACTION_MIN_ROLE: Record<Action, Role> = {
  manage_users: 'admin',
  manage_roles: 'super_admin_delegate',
  manage_sites: 'admin',
  manage_devices: 'admin',
  adopt_device: 'admin',
  manage_plans: 'admin',
  manage_payment_methods: 'admin',
  manage_org: 'super_admin',
};

/** Role axis: may this user perform this action at all? */
export function can(user: User | null | undefined, action: Action): boolean {
  return hasAtLeastRole(user, ACTION_MIN_ROLE[action]);
}

// ── Tenant axis ───────────────────────────────────────────────────────

/** Org UUIDs the user belongs to. */
export function memberOrgIds(user: User | null | undefined): string[] {
  return orgUsers(user).map((o) => o.organization);
}

/**
 * May this user access assets of the given org?
 * Superusers bypass tenant scoping; everyone else must be a member.
 */
export function canAccessOrg(
  user: User | null | undefined,
  orgId: string | null | undefined,
): boolean {
  if (!orgId) return false;
  if (user?.is_superuser) return true;
  return memberOrgIds(user).includes(orgId);
}

/** Sensible default active org for a freshly-logged-in user (first membership). */
export function defaultActiveOrgId(user: User | null | undefined): string | null {
  return memberOrgIds(user)[0] ?? null;
}

// ── Role ⇄ boolean combo (for inviting / editing users) ───────────────

/**
 * Roles that can be assigned to a user *within a single organization* via the
 * admin UI. We expose Admin and Viewer here (the org-scoped roles). Super
 * Admin / Delegate are platform-level booleans set outside this flow.
 */
export type AssignableRole = 'admin' | 'viewer';

export const ASSIGNABLE_ROLE_LABELS: Record<AssignableRole, string> = {
  admin: 'Admin',
  viewer: 'Viewer',
};

/** Map a display role for a given org → the OpenWISP boolean combo to POST. */
export function orgRoleToBooleans(
  role: AssignableRole,
  orgId: string,
): { is_staff: boolean; is_superuser: boolean; organization_users: OrganizationUser[] } {
  return {
    is_staff: false,
    is_superuser: false,
    organization_users: [{ organization: orgId, is_admin: role === 'admin' }],
  };
}

/** Derive the assignable (org-scoped) role of a user within a given org. */
export function orgRoleOf(
  user: User | null | undefined,
  orgId: string,
): AssignableRole {
  const ou = orgUsers(user).find((o) => o.organization === orgId);
  return ou?.is_admin ? 'admin' : 'viewer';
}
