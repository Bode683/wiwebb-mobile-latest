import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { useRouter, usePathname } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, spacing } from '../theme';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { authReset } from '../features/auth/slice/authSlice';
import { selectActiveOrganizationId } from '../features/organizations/slice/organizationSlice';
import { useGetOrganizationsQuery } from '../features/organizations/api/organizationApi';
import { AppIcon } from './AppIcon';
import { mobileNavConfig, type MobileNavItem } from '../features/navigation/nav-config';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isItemActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === '/dashboard' || pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

function isParentActive(pathname: string, item: MobileNavItem): boolean {
  if (item.href) return isItemActive(pathname, item.href);
  return item.children?.some((c) => c.href ? isItemActive(pathname, c.href) : false) ?? false;
}

// ─── Animated collapsible section ────────────────────────────────────────────

interface CollapsibleSectionProps {
  item: MobileNavItem;
  activePath: string;
  showSeparator: boolean;
}

function CollapsibleSection({ item, activePath, showSeparator }: CollapsibleSectionProps) {
  const { theme } = useTheme();
  const { t } = useTranslation('common');
  const router = useRouter();
  const parentActive = isParentActive(activePath, item);

  const [open, setOpen] = useState(parentActive);
  const contentHeight = useSharedValue(parentActive ? 600 : 0);
  const chevronAngle = useSharedValue(parentActive ? 90 : 0);

  const contentStyle = useAnimatedStyle(() => ({
    maxHeight: contentHeight.value,
    overflow: 'hidden',
    opacity: withTiming(contentHeight.value > 10 ? 1 : 0, { duration: 150 }),
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronAngle.value}deg` }],
  }));

  const toggle = () => {
    const next = !open;
    setOpen(next);
    contentHeight.value = withTiming(next ? 600 : 0, { duration: 220 });
    chevronAngle.value = withTiming(next ? 90 : 0, { duration: 220 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const navigateTo = (href: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(href as any);
  };

  return (
    <View>
      <Pressable
        onPress={toggle}
        android_ripple={{ color: 'rgba(245,158,11,0.10)' }}
        style={({ pressed }) => [
          styles.navItem,
          parentActive && { backgroundColor: theme.sidebarAccent },
          Platform.OS === 'ios' && pressed && { opacity: 0.7 },
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: theme.secondary }]}>
          <AppIcon
            type={item.type} name={item.name}
            symbol={item.symbol}
            size={16}
            color={parentActive ? theme.primary : theme.onSurfaceVariant}
          />
        </View>
        <Text style={[styles.navLabel, { color: theme.sidebarForeground }]}>
          {t(item.labelKey)}
        </Text>
        <Animated.View style={chevronStyle}>
          <AppIcon
            type="Feather"
            name="chevron-right"
            size={16}
            color={theme.onSurfaceVariant}
          />
        </Animated.View>
      </Pressable>

      <Animated.View style={contentStyle}>
        {item.children?.map((child) => {
          if (!child.href) return null;
          const active = isItemActive(activePath, child.href);
          return (
            <Pressable
              key={child.labelKey}
              onPress={() => navigateTo(child.href!)}
              android_ripple={{ color: 'rgba(245,158,11,0.10)' }}
              style={({ pressed }) => [
                styles.subItem,
                active && { backgroundColor: theme.sidebarAccent },
                Platform.OS === 'ios' && pressed && { opacity: 0.7 },
              ]}
            >
              <AppIcon
                type={child.type} name={child.name}
                symbol={child.symbol}
                size={14}
                color={active ? theme.primary : theme.onSurfaceVariant}
              />
              <Text
                style={[
                  styles.subLabel,
                  { color: active ? theme.sidebarAccentForeground : theme.onSurfaceVariant },
                ]}
              >
                {t(child.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </Animated.View>

      {showSeparator && (
        <View style={[styles.separator, { backgroundColor: theme.sidebarBorder }]} />
      )}
    </View>
  );
}

// ─── Direct nav item (no children) ───────────────────────────────────────────

interface NavItemProps {
  item: MobileNavItem;
  activePath: string;
  showSeparator: boolean;
}

function NavItem({ item, activePath, showSeparator }: NavItemProps) {
  const { theme } = useTheme();
  const { t } = useTranslation('common');
  const router = useRouter();
  const active = item.href ? isItemActive(activePath, item.href) : false;

  const navigateTo = () => {
    if (!item.href) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(item.href as any);
  };

  return (
    <View>
      <Pressable
        onPress={navigateTo}
        android_ripple={{ color: 'rgba(245,158,11,0.10)' }}
        style={({ pressed }) => [
          styles.navItem,
          active && { backgroundColor: theme.sidebarAccent },
          Platform.OS === 'ios' && pressed && { opacity: 0.7 },
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: theme.secondary }]}>
          <AppIcon
            type={item.type} name={item.name}
            symbol={item.symbol}
            size={16}
            color={active ? theme.primary : theme.onSurfaceVariant}
          />
        </View>
        <Text style={[styles.navLabel, { color: theme.sidebarForeground }]}>
          {t(item.labelKey)}
        </Text>
      </Pressable>

      {showSeparator && (
        <View style={[styles.separator, { backgroundColor: theme.sidebarBorder }]} />
      )}
    </View>
  );
}

// ─── Main DrawerContent ───────────────────────────────────────────────────────

export default function DrawerContent(props: DrawerContentComponentProps) {
  const { theme } = useTheme();
  const { t } = useTranslation('common');
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';
  const activeOrgId = useAppSelector(selectActiveOrganizationId);
  const { data: orgsData } = useGetOrganizationsQuery();
  const activeOrg = orgsData?.results.find((o) => o.id === activeOrgId);
  const orgName = activeOrg?.name ?? 'Wiweeb Network';

  const handleSignOut = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    dispatch(authReset());
    router.replace('/(auth)/welcome');
  };

  const handleOrgSelect = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(modals)/orgSelect' as any);
  };

  const lastIndex = mobileNavConfig.length - 1;

  return (
    <DrawerContentScrollView
      {...props}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: theme.sidebar }}
      contentContainerStyle={[styles.container, { backgroundColor: theme.sidebar }]}
    >
      {/* ── Status bar spacer + network selector ─────────────────────────── */}
      <View style={{ paddingTop: insets.top, paddingHorizontal: spacing.md, paddingBottom: spacing.sm }}>
        <Pressable
          onPress={handleOrgSelect}
          android_ripple={{ color: 'rgba(245,158,11,0.10)' }}
          style={({ pressed }) => [
            styles.selectorCard,
            { backgroundColor: theme.surface, borderColor: theme.outline },
            Platform.OS === 'ios' && pressed && { opacity: 0.8 },
          ]}
        >
          <View style={[styles.orgIcon, { backgroundColor: theme.primary }]}>
            <AppIcon type="Ionicons" name="business" size={14} color="#FFFFFF" />
          </View>
          <Text style={[styles.networkName, { color: theme.sidebarForeground }]} numberOfLines={1}>
            {orgName}
          </Text>
          <AppIcon type="MaterialIcons" name="unfold-more" size={18} color={theme.onSurfaceVariant} />
        </Pressable>
      </View>

      {/* ── Navigation items ──────────────────────────────────────────────── */}
      <View style={[styles.navSection, { backgroundColor: theme.surface }]}>
        {mobileNavConfig.map((item, index) =>
          item.children ? (
            <CollapsibleSection
              key={item.labelKey}
              item={item}
              activePath={pathname}
              showSeparator={index < lastIndex}
            />
          ) : (
            <NavItem
              key={item.labelKey}
              item={item}
              activePath={pathname}
              showSeparator={index < lastIndex}
            />
          ),
        )}
      </View>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <View style={[styles.footer, { backgroundColor: theme.sidebar }]}>
        <Pressable
          onPress={handleSignOut}
          android_ripple={{ color: 'rgba(239,68,68,0.10)' }}
          style={({ pressed }) => [
            styles.signOutBtn,
            { borderColor: theme.error },
            Platform.OS === 'ios' && pressed && { opacity: 0.7 },
          ]}
        >
          <AppIcon type="Feather" name="log-out" size={16} color={theme.error} />
          <Text style={[styles.signOutText, { color: theme.error }]}>
            {t('user.signOut')}
          </Text>
        </Pressable>
        <Text style={[styles.versionText, { color: theme.onSurfaceVariant }]}>
          v{appVersion}
        </Text>
      </View>
    </DrawerContentScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 0,
  },
  // Selector card
  selectorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.sm,
  },
  orgIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  networkName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  // Nav items
  navSection: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    marginLeft: spacing.sm,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
  // Sub-items
  subItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.md + 40,
    paddingRight: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 40,
    gap: spacing.sm,
  },
  subLabel: {
    flex: 1,
    fontSize: 13,
  },
  // Footer
  footer: {
    paddingHorizontal: spacing.md,
    paddingTop: 12,
    paddingBottom: spacing.md,
    gap: 12,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing.sm,
  },
  signOutText: {
    fontSize: 12,
    fontWeight: '500',
  },
  versionText: {
    fontSize: 11,
    textAlign: 'center',
  },
});
