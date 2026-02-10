import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { useRouter, usePathname } from 'expo-router';

// ─── Accordion section with nested sub-items ─────────────────────────────────

type SubItem = { label: string; path: string };

type AccordionSectionProps = {
  label: string;
  items: SubItem[];
  activePath: string;
};

const AccordionSection = ({ label, items, activePath }: AccordionSectionProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isActive = items.some(item => activePath.startsWith(item.path));

  return (
    <View>
      <TouchableOpacity
        style={[styles.accordionHeader, isActive && styles.accordionHeaderActive]}
        onPress={() => setOpen(prev => !prev)}
        activeOpacity={0.7}
      >
        <Text style={[styles.accordionLabel, isActive && styles.accordionLabelActive]}>
          {label}
        </Text>
        <Text style={styles.accordionChevron}>{open ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.subItemContainer}>
          {items.map(item => {
            const active = activePath.startsWith(item.path);
            return (
              <TouchableOpacity
                key={item.path}
                style={[styles.subItem, active && styles.subItemActive]}
                onPress={() => router.push(item.path as any)}
                activeOpacity={0.7}
              >
                <Text style={[styles.subItemLabel, active && styles.subItemLabelActive]}>
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

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      {/* App header */}
      <View style={styles.header}>
        <Text style={styles.appName}>wiwebb</Text>
      </View>

      <View style={styles.divider} />

      {/* Home — navigates into the tabs group */}
      <DrawerItem
        label="Home"
        focused={pathname.includes('/(tabs)') || pathname === '/'}
        onPress={() => router.push('/(tabs)/home')}
        style={styles.drawerItem}
        labelStyle={styles.drawerLabel}
      />

      {/* Explore */}
      <DrawerItem
        label="Explore"
        focused={pathname.startsWith('/explore')}
        onPress={() => router.push('/explore')}
        style={styles.drawerItem}
        labelStyle={styles.drawerLabel}
      />

      <View style={styles.divider} />

      {/* Settings — accordion with sub-items */}
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

// ─── Styles ───────────────────────────────────────────────────────────────────

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
    backgroundColor: '#e5e5e5',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  drawerItem: {
    borderRadius: 8,
    marginHorizontal: 8,
  },
  drawerLabel: {
    fontSize: 15,
  },
  // Accordion
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  accordionHeaderActive: {
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  accordionLabel: {
    fontSize: 15,
    color: '#333',
  },
  accordionLabelActive: {
    fontWeight: '600',
  },
  accordionChevron: {
    fontSize: 11,
    color: '#888',
  },
  subItemContainer: {
    marginLeft: 16,
  },
  subItem: {
    marginHorizontal: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  subItemActive: {
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  subItemLabel: {
    fontSize: 14,
    color: '#555',
  },
  subItemLabelActive: {
    fontWeight: '600',
    color: '#000',
  },
});
