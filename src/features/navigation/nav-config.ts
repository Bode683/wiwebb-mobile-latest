import type { ComponentProps } from 'react';
import { Feather } from '@expo/vector-icons';

type FeatherName = ComponentProps<typeof Feather>['name'];

export interface MobileNavItem {
  /** i18n key in the 'common' namespace */
  labelKey: string;
  /** Feather icon name (Android + fallback) */
  feather: FeatherName;
  /** SF Symbol name (iOS) */
  symbol: string;
  /** Route href — undefined for parent-only group items */
  href?: string;
  /** Sub-items — present on collapsible sections */
  children?: MobileNavItem[];
}

/**
 * Mobile navigation config — mirrors the web nav-config.ts but uses
 * Feather (Android) and SF Symbol (iOS) names instead of Lucide icons.
 *
 * labelKey maps to common.json nav.* translation keys.
 */
export const mobileNavConfig: MobileNavItem[] = [
  {
    labelKey: 'nav.dashboard',
    feather: 'grid',
    symbol: 'square.grid.2x2',
    href: '/dashboard',
  },
  {
    labelKey: 'nav.users_organizations',
    feather: 'users',
    symbol: 'person.2',
    children: [
      { labelKey: 'nav.users',              feather: 'user',       symbol: 'person',                  href: '/users' },
      { labelKey: 'nav.organizations',      feather: 'briefcase',  symbol: 'building.2',              href: '/organizations' },
      { labelKey: 'nav.groups_permissions', feather: 'shield',     symbol: 'checkmark.shield',        href: '/groups' },
      { labelKey: 'nav.organization_users', feather: 'user-check', symbol: 'person.badge.checkmark',  href: '/organization-users' },
    ],
  },
  {
    labelKey: 'nav.subscriptions',
    feather: 'credit-card',
    symbol: 'creditcard',
    children: [
      { labelKey: 'nav.plans',    feather: 'layers',       symbol: 'square.3.layers.3d',  href: '/subscriptions/plans' },
      { labelKey: 'nav.orders',   feather: 'shopping-bag', symbol: 'bag',                 href: '/subscriptions/orders' },
      { labelKey: 'nav.payments', feather: 'dollar-sign',  symbol: 'banknote',            href: '/subscriptions/payments' },
    ],
  },
  {
    labelKey: 'nav.cas_certificates',
    feather: 'key',
    symbol: 'key',
    children: [
      { labelKey: 'nav.certificate_authorities', feather: 'award',  symbol: 'seal',          href: '/cas/authorities' },
      { labelKey: 'nav.certificates',            feather: 'shield', symbol: 'checkmark.seal', href: '/cas/certificates' },
    ],
  },
  {
    labelKey: 'nav.radius',
    feather: 'wifi',
    symbol: 'wifi',
    children: [
      { labelKey: 'nav.accounting_sessions',  feather: 'file-text', symbol: 'receipt',             href: '/radius/accounting-sessions' },
      { labelKey: 'nav.radius_groups',        feather: 'users',     symbol: 'person.2',            href: '/radius/groups' },
      { labelKey: 'nav.batch_user_creation',  feather: 'user-plus', symbol: 'person.badge.plus',   href: '/radius/batch-user-creation' },
      { labelKey: 'nav.post_auth_log',        feather: 'list',      symbol: 'scroll',              href: '/radius/post-auth-log' },
    ],
  },
  {
    labelKey: 'nav.monitoring',
    feather: 'activity',
    symbol: 'waveform.path.ecg',
    children: [
      { labelKey: 'nav.wifi_sessions', feather: 'wifi', symbol: 'wifi', href: '/monitoring/wifi-sessions' },
    ],
  },
  {
    labelKey: 'nav.ipam',
    feather: 'share-2',
    symbol: 'network',
    children: [
      { labelKey: 'nav.ip_addresses', feather: 'globe',   symbol: 'globe',   href: '/ipam/ip-addresses' },
      { labelKey: 'nav.subnets',      feather: 'share-2', symbol: 'network', href: '/ipam/subnets' },
    ],
  },
  {
    labelKey: 'nav.configurations',
    feather: 'settings',
    symbol: 'gearshape',
    children: [
      { labelKey: 'nav.templates',   feather: 'code',  symbol: 'doc.badge.gearshape', href: '/configurations/templates' },
      { labelKey: 'nav.vpn_servers', feather: 'lock',  symbol: 'lock.shield',          href: '/configurations/vpn-servers' },
    ],
  },
  {
    labelKey: 'nav.geographic_info',
    feather: 'map-pin',
    symbol: 'mappin.and.ellipse',
    children: [
      { labelKey: 'nav.locations', feather: 'map-pin', symbol: 'mappin', href: '/geographic-info/locations' },
    ],
  },
  {
    labelKey: 'nav.devices',
    feather: 'hard-drive',
    symbol: 'internaldrive',
    href: '/devices',
  },
  {
    labelKey: 'nav.system_info',
    feather: 'info',
    symbol: 'info.circle',
    href: '/system-info',
  },
  // ── Utility ──────────────────────────────────────────────────────────────────
  {
    labelKey: 'nav.settings',
    feather: 'sliders',
    symbol: 'slider.horizontal.3',
    children: [
      { labelKey: 'nav.account', feather: 'user',    symbol: 'person.crop.circle', href: '/settings' },
      { labelKey: 'nav.profile', feather: 'edit-2',  symbol: 'pencil',             href: '/settings/profile' },
    ],
  },
  {
    labelKey: 'nav.help',
    feather: 'help-circle',
    symbol: 'questionmark.circle',
    children: [
      { labelKey: 'nav.contact_support', feather: 'headphones', symbol: 'headphones', href: '/help/contact-support' },
      { labelKey: 'nav.documentation',   feather: 'book-open',  symbol: 'book.open',  href: '/help/documentation' },
    ],
  },
];
