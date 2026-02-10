import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DrawerToggleButton } from '@react-navigation/drawer';
import DrawerContent from '../../components/DrawerContent';

/**
 * DrawerLayout defines the main app navigation.
 * GestureHandlerRootView is required for reliable swipe-to-open on all platforms.
 * Custom drawerContent handles item rendering, accordion sub-sections,
 * and active state highlighting.
 * Screens not meant to appear as top-level drawer items are hidden via
 * drawerItemStyle: { display: 'none' }.
 */
export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={props => <DrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerType: 'slide',
          swipeEdgeWidth: 50,
          drawerHideStatusBarOnOpen: true,
        }}
      >
        {/* ── Visible drawer destinations (managed by custom DrawerContent) ── */}
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: 'Home',
            title: 'Home',
            // Drawer header shown at the top — contains the DrawerToggleButton
            headerShown: true,
            headerLeft: () => <DrawerToggleButton />,
            // Hide from default drawer list; DrawerContent renders it manually
            drawerItemStyle: { display: 'none' },
          }}
        />

        <Drawer.Screen
          name="explore"
          options={{
            drawerLabel: 'Explore',
            title: 'Explore',
            headerShown: false,
            drawerItemStyle: { display: 'none' },
          }}
        />

        {/* ── Settings section — sub-items navigated via accordion ── */}
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: 'Settings',
            title: 'Settings',
            headerShown: false,
            drawerItemStyle: { display: 'none' },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
