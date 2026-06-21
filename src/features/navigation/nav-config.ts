import type { IconLibrary } from '../../components/AppIcon';
import type { Action } from '../auth/rbac';

export interface MobileNavItem {
  /** i18n key in the 'common' namespace */
  labelKey: string;
  /** Icon library (e.g. 'Feather', 'MaterialIcons') */
  type: IconLibrary;
  /** Icon name within the selected library */
  name: string;
  /** SF Symbol name (iOS) */
  symbol: string;
  /** Route href — undefined for parent-only group items */
  href?: string;
  /** Sub-items — present on collapsible sections */
  children?: MobileNavItem[];
  /**
   * Role-axis gate: if set, the item is hidden unless the user `can` perform
   * this action. Parent groups are hidden when all children are gated out.
   */
  requires?: Action;
}

/**
 * Mobile navigation config — mirrors the web nav-config.ts but uses
 * AppIcon-compatible type/name/symbol fields instead of raw icon imports.
 *
 * labelKey maps to common.json nav.* translation keys.
 */
export const mobileNavConfig: MobileNavItem[] = [
  {
    labelKey: 'nav.dashboard',
    type: 'Feather',
    name: 'grid',
    symbol: 'square.grid.2x2',
    href: '/dashboard',
  },
  {
    labelKey: 'nav.users_organizations',
    type: 'Feather',
    name: 'users',
    symbol: 'person.2',
    children: [
      { labelKey: 'nav.users',              type: 'Feather', name: 'user',       symbol: 'person',                  href: '/users',              requires: 'manage_users' },
      { labelKey: 'nav.organizations',      type: 'Feather', name: 'briefcase',  symbol: 'building.2',              href: '/organizations' },
      { labelKey: 'nav.groups_permissions', type: 'Feather', name: 'shield',     symbol: 'checkmark.shield',        href: '/groups',             requires: 'manage_roles' },
      { labelKey: 'nav.organization_users', type: 'Feather', name: 'user-check', symbol: 'person.badge.checkmark',  href: '/organization-users', requires: 'manage_users' },
    ],
  },
  {
    labelKey: 'nav.subscriptions',
    type: 'Feather',
    name: 'credit-card',
    symbol: 'creditcard',
    children: [
      { labelKey: 'nav.plans',            type: 'Feather', name: 'layers',       symbol: 'square.3.layers.3d',  href: '/subscriptions/plans',             requires: 'manage_plans' },
      { labelKey: 'nav.paymentProviders', type: 'Feather', name: 'credit-card',  symbol: 'creditcard',          href: '/subscriptions/payment-providers', requires: 'manage_payment_methods' },
      { labelKey: 'nav.orders',           type: 'Feather', name: 'shopping-bag', symbol: 'bag',                 href: '/subscriptions/orders' },
      { labelKey: 'nav.payments',         type: 'Feather', name: 'dollar-sign',  symbol: 'banknote',            href: '/subscriptions/payments' },
    ],
  },
  {
    labelKey: 'nav.cas_certificates',
    type: 'Feather',
    name: 'key',
    symbol: 'key',
    children: [
      { labelKey: 'nav.certificate_authorities', type: 'Feather', name: 'award',  symbol: 'seal',           href: '/cas/authorities' },
      { labelKey: 'nav.certificates',            type: 'Feather', name: 'shield', symbol: 'checkmark.seal', href: '/cas/certificates' },
    ],
  },
  {
    labelKey: 'nav.radius',
    type: 'Feather',
    name: 'wifi',
    symbol: 'wifi',
    children: [
      { labelKey: 'nav.accounting_sessions',  type: 'Feather', name: 'file-text', symbol: 'receipt',             href: '/radius/accounting-sessions' },
      { labelKey: 'nav.radius_groups',        type: 'Feather', name: 'users',     symbol: 'person.2',            href: '/radius/groups' },
      { labelKey: 'nav.batch_user_creation',  type: 'Feather', name: 'user-plus', symbol: 'person.badge.plus',   href: '/radius/batch-user-creation' },
      { labelKey: 'nav.post_auth_log',        type: 'Feather', name: 'list',      symbol: 'scroll',              href: '/radius/post-auth-log' },
    ],
  },
  {
    labelKey: 'nav.monitoring',
    type: 'Feather',
    name: 'activity',
    symbol: 'waveform.path.ecg',
    children: [
      { labelKey: 'nav.wifi_sessions', type: 'Feather', name: 'wifi', symbol: 'wifi', href: '/monitoring/wifi-sessions' },
    ],
  },
  {
    labelKey: 'nav.ipam',
    type: 'Feather',
    name: 'share-2',
    symbol: 'network',
    children: [
      { labelKey: 'nav.ip_addresses', type: 'Feather', name: 'globe',   symbol: 'globe',   href: '/ipam/ip-addresses' },
      { labelKey: 'nav.subnets',      type: 'Feather', name: 'share-2', symbol: 'network', href: '/ipam/subnets' },
    ],
  },
  {
    labelKey: 'nav.configurations',
    type: 'Feather',
    name: 'settings',
    symbol: 'gearshape',
    children: [
      { labelKey: 'nav.templates',   type: 'Feather', name: 'code', symbol: 'doc.badge.gearshape', href: '/configurations/templates' },
      { labelKey: 'nav.vpn_servers', type: 'Feather', name: 'lock', symbol: 'lock.shield',          href: '/configurations/vpn-servers' },
    ],
  },
  {
    labelKey: 'nav.geographic_info',
    type: 'Feather',
    name: 'map-pin',
    symbol: 'mappin.and.ellipse',
    children: [
      { labelKey: 'nav.locations', type: 'Feather', name: 'map-pin', symbol: 'mappin', href: '/geographic-info/locations' },
    ],
  },
  {
    labelKey: 'nav.devices',
    type: 'Feather',
    name: 'hard-drive',
    symbol: 'internaldrive',
    href: '/devices',
  },
  {
    labelKey: 'nav.system_info',
    type: 'Feather',
    name: 'info',
    symbol: 'info.circle',
    href: '/system-info',
  },
];

/**
 * Filter the nav tree by the role axis. An item with `requires` is dropped
 * unless `can(action)` is true; parent groups are dropped when every child
 * is filtered out.
 */
export function filterNavByPermission(
  items: MobileNavItem[],
  can: (action: Action) => boolean,
): MobileNavItem[] {
  return items.reduce<MobileNavItem[]>((acc, item) => {
    if (item.requires && !can(item.requires)) return acc;
    if (item.children) {
      const children = filterNavByPermission(item.children, can);
      if (children.length === 0) return acc;
      acc.push({ ...item, children });
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
}
