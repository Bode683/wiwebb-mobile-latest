import React from 'react';
import { Stack } from 'expo-router';
import { DrawerToggleButton } from '@react-navigation/drawer';

// Ensures the stack always initialises at index when navigating
// to this drawer section, regardless of prior navigation history.
export const unstable_settings = {
  initialRouteName: 'index',
};

/**
 * Explore stack layout.
 * The DrawerToggleButton in the header lets users open the drawer
 * from within the explore section.
 */
export default function ExploreLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Explore',
          headerLeft: () => <DrawerToggleButton />,
        }}
      />
    </Stack>
  );
}
