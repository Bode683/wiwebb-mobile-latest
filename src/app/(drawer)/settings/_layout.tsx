import React from 'react';
import { Stack } from 'expo-router';
import { DrawerToggleButton } from '@react-navigation/drawer';

// Ensures the stack always initialises at index when navigating
// to this drawer section, regardless of prior navigation history.
export const unstable_settings = {
  initialRouteName: 'index',
};

/**
 * Settings stack layout.
 * index.jsx is the landing screen (Account); profile.jsx is a child screen
 * pushed onto the stack — it does not appear as a drawer item.
 * The DrawerToggleButton in the index header lets users open the drawer
 * from within the settings section.
 */
export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Settings',
          headerLeft: () => <DrawerToggleButton />,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Stack>
  );
}
