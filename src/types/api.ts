// ── Auth types ────────────────────────────────────────────────────────

export interface OrganizationUser {
  is_admin: boolean;
  organization: string; // UUID
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
  organization_users: OrganizationUser | null;
  email_verified?: boolean;
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
