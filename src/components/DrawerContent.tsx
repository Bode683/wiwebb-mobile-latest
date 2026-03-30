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
import { useTheme, typography, spacing, borderRadius } from '../theme';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { authReset } from '../features/auth/slice/authSlice';
import { AppIcon } from './AppIcon';
import { mobileNavConfig, type MobileNavItem } from '../features/navigation/nav-config';

// ─── Logo assets ──────────────────────────────────────────────────────────────
import LogoOrange from '../assets/brand-logo/wiweeb-orange.svg';
import LogoWhite from '../assets/brand-logo/wiweeb-white.svg';

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
}

function CollapsibleSection({ item, activePath }: CollapsibleSectionProps) {
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
      {/* Section header */}
      <Pressable
        onPress={toggle}
        android_ripple={{ color: 'rgba(245,158,11,0.10)' }}
        style={({ pressed }) => [
          styles.sectionHeader,
          parentActive && { backgroundColor: theme.sidebarAccent },
          Platform.OS === 'ios' && pressed && { opacity: 0.7 },
        ]}
      >
        <View style={styles.sectionHeaderLeft}>
          <AppIcon
            type={item.type} name={item.name}
            symbol={item.symbol}
            size={17}
            color={parentActive ? theme.sidebarPrimary : theme.onSurfaceVariant}
          />
          <Text
            style={[
              typography.variants.labelLarge,
              {
                color: parentActive ? theme.sidebarAccentForeground : theme.sidebarForeground,
                marginLeft: spacing.sm,
              },
            ]}
          >
            {t(item.labelKey)}
          </Text>
        </View>
        <Animated.View style={chevronStyle}>
          <AppIcon
            type="Feather"
            name="chevron-right"
            size={15}
            color={theme.onSurfaceVariant}
          />
        </Animated.View>
      </Pressable>

      {/* Sub-items */}
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
                color={active ? theme.sidebarPrimary : theme.onSurfaceVariant}
              />
              <Text
                style={[
                  typography.variants.bodyMedium,
                  {
                    color: active ? theme.sidebarAccentForeground : theme.onSurfaceVariant,
                    marginLeft: spacing.sm,
                    flex: 1,
                  },
                ]}
              >
                {t(child.labelKey)}
              </Text>
              {active && (
                <View style={[styles.activeIndicator, { backgroundColor: theme.sidebarPrimary }]} />
              )}
            </Pressable>
          );
        })}
      </Animated.View>
    </View>
  );
}

// ─── Direct nav item (no children) ───────────────────────────────────────────

interface NavItemProps {
  item: MobileNavItem;
  activePath: string;
}

function NavItem({ item, activePath }: NavItemProps) {
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
    <Pressable
      onPress={navigateTo}
      android_ripple={{ color: 'rgba(245,158,11,0.10)' }}
      style={({ pressed }) => [
        styles.navItem,
        active && { backgroundColor: theme.sidebarAccent },
        Platform.OS === 'ios' && pressed && { opacity: 0.7 },
      ]}
    >
      <AppIcon
        type={item.type} name={item.name}
        symbol={item.symbol}
        size={17}
        color={active ? theme.sidebarPrimary : theme.onSurfaceVariant}
      />
      <Text
        style={[
          typography.variants.labelLarge,
          {
            color: active ? theme.sidebarAccentForeground : theme.sidebarForeground,
            marginLeft: spacing.sm,
            flex: 1,
          },
        ]}
      >
        {t(item.labelKey)}
      </Text>
      {active && (
        <View style={[styles.activeIndicator, { backgroundColor: theme.sidebarPrimary }]} />
      )}
    </Pressable>
  );
}

// ─── Main DrawerContent ───────────────────────────────────────────────────────

export default function DrawerContent(props: DrawerContentComponentProps) {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation('common');
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const LogoSvg = isDark ? LogoWhite : LogoOrange;

  // User avatar initials
  const initials = user
    ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() || user.username?.[0]?.toUpperCase() || 'U'
    : 'U';

  const handleSignOut = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    dispatch(authReset());
    router.replace('/(auth)/welcome');
  };

  const Divider = () => (
    <View style={[styles.divider, { backgroundColor: theme.sidebarBorder }]} />
  );

  return (
    <DrawerContentScrollView
      {...props}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.container, { backgroundColor: theme.sidebar }]}
    >
      {/* ── Brand header ──────────────────────────────────────────────────── */}
      <View style={styles.brand}>
        <View style={styles.logoWrap}>
          <LogoSvg height={28} width={undefined} />
        </View>
      </View>

      <Divider />

      {/* ── Navigation items ──────────────────────────────────────────────── */}
      <View style={styles.navSection}>
        {mobileNavConfig.map((item) =>
          item.children ? (
            <CollapsibleSection key={item.labelKey} item={item} activePath={pathname} />
          ) : (
            <NavItem key={item.labelKey} item={item} activePath={pathname} />
          ),
        )}
      </View>

      <Divider />

      {/* ── User footer ───────────────────────────────────────────────────── */}
      <View style={styles.footer}>
        {/* Avatar + name/email */}
        <View style={styles.userRow}>
          <View style={[styles.avatar, { backgroundColor: theme.primaryContainer }]}>
            <Text style={[typography.variants.labelMedium, { color: theme.primary }]}>
              {initials}
            </Text>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text
              style={[typography.variants.labelMedium, { color: theme.sidebarForeground }]}
              numberOfLines={1}
            >
              {user ? `${user.first_name} ${user.last_name}`.trim() || user.username : '—'}
            </Text>
            {user?.email ? (
              <Text
                style={[typography.variants.labelSmall, { color: theme.onSurfaceVariant }]}
                numberOfLines={1}
              >
                {user.email}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Sign out */}
        <Pressable
          onPress={handleSignOut}
          android_ripple={{ color: 'rgba(239,68,68,0.10)' }}
          style={({ pressed }) => [
            styles.signOutBtn,
            { borderColor: theme.outline },
            Platform.OS === 'ios' && pressed && { opacity: 0.7 },
          ]}
        >
          <AppIcon type="Feather" name="log-out" size={16} color={theme.error} />
          <Text style={[typography.variants.labelMedium, { color: theme.error, marginLeft: spacing.sm }]}>
            {t('user.signOut')}
          </Text>
        </Pressable>
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
  brand: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md + 4,
  },
  logoWrap: {
    // SVG height is fixed at 28; width is proportional
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
  },
  navSection: {
    paddingVertical: spacing.xs,
  },
  // Direct nav item
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm + 1,
    borderRadius: borderRadius.md,
    minHeight: 44,
  },
  // Collapsible section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm + 1,
    borderRadius: borderRadius.md,
    minHeight: 44,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  // Sub-item
  subItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.sm,
    marginLeft: spacing.md + 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    minHeight: 40,
  },
  // Active left-edge indicator
  activeIndicator: {
    width: 3,
    height: 16,
    borderRadius: 2,
    marginLeft: spacing.xs,
  },
  // Footer
  footer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 44,
  },
});
