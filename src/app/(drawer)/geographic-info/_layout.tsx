import React from 'react';
import { Stack } from 'expo-router';
import { DrawerToggleButton } from '@react-navigation/drawer';

export const unstable_settings = { initialRouteName: 'locations' };

export default function GeographicInfoLayout() {
  return (
    <Stack screenOptions={{ headerLeft: () => <DrawerToggleButton /> }}>
      <Stack.Screen name="locations" />
    </Stack>
  );
}
