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

// ── Device types (controller/device) ─────────────────────────────────

export type DeviceStatus = 'pending' | 'managed';

export interface Device {
  id: string;
  name: string;
  mac_address: string;
  model: string;
  os: string;
  status: DeviceStatus;
  organization: string; // UUID
  location: string | null; // site UUID
  created: string;
  modified: string;
}

export interface PaginatedDeviceList {
  results: Device[];
  count: number;
  next: string | null;
  previous: string | null;
}

// ── Plan types (subscriptions/plans) ─────────────────────────────────

export type PlanFamily = 'FPU' | 'PPU';
export type PlanDuration = 'daily' | 'weekly' | 'monthly';

export interface Plan {
  id: string;
  name: string;
  family: PlanFamily;
  duration: PlanDuration | null; // null for PPU
  speed_cap: number; // Mbps
  device_limit: number;
  price: number;
  currency: string;
  is_active: boolean;
  organization: string; // UUID
  created: string;
  modified: string;
}

export interface PaginatedPlanList {
  results: Plan[];
  count: number;
  next: string | null;
  previous: string | null;
}

// ── Payment provider types (subscriptions/payment-providers) ─────────

export type ProviderKey = 'mtn-momo' | 'orange-money' | 'card';

export interface PaymentProvider {
  id: string;
  provider: ProviderKey;
  display_name: string;
  enabled: boolean;
  config: Record<string, string>;
  organization: string; // UUID
  created: string;
  modified: string;
}

export interface PaginatedPaymentProviderList {
  results: PaymentProvider[];
  count: number;
  next: string | null;
  previous: string | null;
}

// ── Order types (subscriptions/orders) ───────────────────────────────

export type OrderStatus = 'pending' | 'completed' | 'failed';
export type PaymentStatus = 'pending' | 'success' | 'failed';

export interface EmbeddedPayment {
  id: string;
  provider: string; // PaymentProvider UUID
  provider_name: string;
  transaction_id: string | null;
  status: PaymentStatus;
  paid_at: string | null;
}

export interface Order {
  id: string;
  reference: string;
  plan: string; // Plan UUID
  plan_name: string;
  user_email: string;
  amount: number;
  currency: string;
  status: OrderStatus;
  payment: EmbeddedPayment;
  organization: string; // UUID
  created: string;
  modified: string;
}

export interface PaginatedOrderList {
  results: Order[];
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
