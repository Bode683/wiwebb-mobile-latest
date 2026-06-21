import {
  deriveRole,
  can,
  canAccessOrg,
  memberOrgIds,
  defaultActiveOrgId,
  orgRoleToBooleans,
  orgRoleOf,
} from '../rbac';
import type { User } from '../../../types/api';

const ORG_A = 'org-a';
const ORG_B = 'org-b';

function mk(partial: Partial<User>): User {
  return {
    id: 'u', username: 'u', first_name: '', last_name: '', email: '',
    bio: '', url: '', company: '', location: '', phone_number: null,
    birth_date: null, notes: '', is_active: true, is_staff: false,
    is_superuser: false, last_login: null, date_joined: '',
    groups: [], user_permissions: [], organization_users: [],
    ...partial,
  };
}

const superadmin = mk({ is_superuser: true, is_staff: true,
  organization_users: [{ organization: ORG_A, is_admin: true, is_owner: true }] });
const delegate = mk({ is_staff: true,
  organization_users: [
    { organization: ORG_A, is_admin: true, is_owner: false },
    { organization: ORG_B, is_admin: true, is_owner: false },
  ] });
const admin = mk({
  organization_users: [{ organization: ORG_A, is_admin: true, is_owner: false }] });
const viewer = mk({
  organization_users: [{ organization: ORG_B, is_admin: false, is_owner: false }] });

describe('deriveRole', () => {
  it('maps boolean combos to display roles', () => {
    expect(deriveRole(superadmin)).toBe('super_admin');
    expect(deriveRole(delegate)).toBe('super_admin_delegate');
    expect(deriveRole(admin)).toBe('admin');
    expect(deriveRole(viewer)).toBe('viewer');
    expect(deriveRole(null)).toBe('viewer');
  });
});

describe('can (role axis)', () => {
  it('viewer can do nothing', () => {
    expect(can(viewer, 'manage_sites')).toBe(false);
    expect(can(viewer, 'adopt_device')).toBe(false);
  });
  it('admin manages assets but not roles or org', () => {
    expect(can(admin, 'manage_sites')).toBe(true);
    expect(can(admin, 'manage_devices')).toBe(true);
    expect(can(admin, 'manage_roles')).toBe(false);
    expect(can(admin, 'manage_org')).toBe(false);
  });
  it('delegate can manage roles but not the org itself', () => {
    expect(can(delegate, 'manage_roles')).toBe(true);
    expect(can(delegate, 'manage_org')).toBe(false);
  });
  it('super admin can do everything', () => {
    expect(can(superadmin, 'manage_org')).toBe(true);
    expect(can(superadmin, 'manage_roles')).toBe(true);
  });
});

describe('tenant axis', () => {
  it('memberOrgIds lists memberships', () => {
    expect(memberOrgIds(delegate)).toEqual([ORG_A, ORG_B]);
    expect(memberOrgIds(viewer)).toEqual([ORG_B]);
  });
  it('canAccessOrg enforces membership', () => {
    expect(canAccessOrg(admin, ORG_A)).toBe(true);
    expect(canAccessOrg(admin, ORG_B)).toBe(false); // not a member
    expect(canAccessOrg(admin, null)).toBe(false);
  });
  it('superuser bypasses tenant scoping', () => {
    expect(canAccessOrg(superadmin, ORG_B)).toBe(true); // not even a member
  });
  it('defaultActiveOrgId picks first membership', () => {
    expect(defaultActiveOrgId(delegate)).toBe(ORG_A);
    expect(defaultActiveOrgId(mk({}))).toBe(null);
  });
});

describe('role ⇄ boolean combo (invite / edit)', () => {
  it('orgRoleToBooleans maps admin/viewer to org membership', () => {
    expect(orgRoleToBooleans('admin', ORG_A)).toEqual({
      is_staff: false,
      is_superuser: false,
      organization_users: [{ organization: ORG_A, is_admin: true }],
    });
    expect(orgRoleToBooleans('viewer', ORG_A).organization_users[0].is_admin).toBe(false);
  });
  it('orgRoleOf derives the per-org role', () => {
    expect(orgRoleOf(admin, ORG_A)).toBe('admin');
    expect(orgRoleOf(viewer, ORG_B)).toBe('viewer');
    expect(orgRoleOf(admin, ORG_B)).toBe('viewer'); // no membership → viewer
  });
});
