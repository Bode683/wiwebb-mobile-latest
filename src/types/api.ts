// ── Auth types ────────────────────────────────────────────────────────

export interface OrganizationUser {
  is_admin: boolean;
  organization: string; // UUID
  is_owner?: boolean;
}

export interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  bio: string;
  url: string;
  company: string;
  location: string;
  phone_number: string | null;
  birth_date: string | null;
  notes: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  last_login: string | null;
  date_joined: string;
  groups: number[];
  user_permissions: string[];
  /**
   * Tenant memberships. Multi-tenant: a user may belong to several
   * organizations and manage only those. Real OpenWISP returns a list.
   */
  organization_users: OrganizationUser[];
  email_verified?: boolean;
  /** Invite lifecycle: "active" once accepted, "pending" while invited. */
  status?: 'active' | 'pending';
  /** Opaque token used by the public accept-invite route. */
  invite_token?: string | null;
}

// ── Site types (controller/location) ─────────────────────────────────

export type LocationType = 'outdoor' | 'indoor';

export interface Site {
  id: string;
  name: string;
  slug: string;
  address: string;
  location_type: LocationType;
  is_mobile: boolean;
  geometry: unknown | null;
  organization: string; // UUID
  created: string;
  modified: string;
}

export interface PaginatedSiteList {
  results: Site[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface PaginatedUserList {
  results: User[];
  count: number;
  next: string | null;
  previous: string | null;
}

// ── Organization types ───────────────────────────────────────────────

export interface Organization {
  id: string;
  name: string;
  is_active: boolean;
  slug: string;
  description: string;
  email: string;
  url: string;
  owner: { organization_user: string | null };
  created: string;
  modified: string;
}

export interface PaginatedOrganizationList {
  results: Organization[];
  count: number;
  next: string | null;
  previous: string | null;
}
