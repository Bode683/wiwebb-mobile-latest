import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '../theme';

// ─── Accordion section with nested sub-items ─────────────────────────────────

type SubItem = { label: string; path: string };

type AccordionSectionProps = {
  label: string;
  items: SubItem[];
  activePath: string;
};

const AccordionSection = ({ label, items, activePath }: AccordionSectionProps) => {
  const router = useRouter();
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);

  const isActive = items.some(item => activePath.startsWith(item.path));

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.accordionHeader,
          isActive && { backgroundColor: theme.sidebarAccent },
        ]}
        onPress={() => setOpen(prev => !prev)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.accordionLabel,
            { color: theme.sidebarForeground },
            isActive && { color: theme.sidebarAccentForeground, fontWeight: '600' },
          ]}
        >
          {label}
        </Text>
        <Text style={[styles.accordionChevron, { color: theme.onSurfaceVariant }]}>
          {open ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.subItemContainer}>
          {items.map(item => {
            const active = activePath.startsWith(item.path);
            return (
              <TouchableOpacity
                key={item.path}
                style={[
                  styles.subItem,
                  active && { backgroundColor: theme.sidebarAccent },
                ]}
                onPress={() => router.push(item.path as any)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.subItemLabel,
                    { color: theme.onSurfaceVariant },
                    active && { color: theme.sidebarAccentForeground, fontWeight: '600' },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

// ─── Main DrawerContent ───────────────────────────────────────────────────────

export default function DrawerContent(props: DrawerContentComponentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={[styles.container, { backgroundColor: theme.sidebar }]}
    >
      {/* App name */}
      <View style={styles.header}>
        <Text style={[styles.appName, { color: theme.sidebarPrimary }]}>Wiweeb</Text>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.sidebarBorder }]} />

      {/* Home */}
      <DrawerItem
        label="Home"
        focused={pathname.includes('/(tabs)') || pathname === '/'}
        onPress={() => router.push('/(tabs)/home')}
        style={styles.drawerItem}
        labelStyle={styles.drawerLabel}
        activeTintColor={theme.sidebarPrimary}
        inactiveTintColor={theme.sidebarForeground}
        activeBackgroundColor={theme.sidebarAccent}
      />

      {/* Explore */}
      <DrawerItem
        label="Explore"
        focused={pathname.startsWith('/explore')}
        onPress={() => router.push('/explore')}
        style={styles.drawerItem}
        labelStyle={styles.drawerLabel}
        activeTintColor={theme.sidebarPrimary}
        inactiveTintColor={theme.sidebarForeground}
        activeBackgroundColor={theme.sidebarAccent}
      />

      <View style={[styles.divider, { backgroundColor: theme.sidebarBorder }]} />

      {/* Settings — accordion */}
      <AccordionSection
        label="Settings"
        activePath={pathname}
        items={[
          { label: 'Account', path: '/settings' },
          { label: 'Profile', path: '/settings/profile' },
        ]}
      />
    </DrawerContentScrollView>
  );
}

// ─── Styles (layout only — colours come from theme at runtime) ────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  drawerItem: {
    borderRadius: 6,
    marginHorizontal: 8,
  },
  drawerLabel: {
    fontSize: 15,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 6,
  },
  accordionLabel: {
    fontSize: 15,
  },
  accordionChevron: {
    fontSize: 11,
  },
  subItemContainer: {
    marginLeft: 16,
  },
  subItem: {
    marginHorizontal: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
  },
  subItemLabel: {
    fontSize: 14,
  },
});
