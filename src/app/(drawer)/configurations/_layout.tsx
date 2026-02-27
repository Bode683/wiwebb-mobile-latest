import React from 'react';
import { Stack } from 'expo-router';
import { DrawerToggleButton } from '@react-navigation/drawer';

export const unstable_settings = { initialRouteName: 'templates' };

export default function ConfigurationsLayout() {
  return (
    <Stack screenOptions={{ headerLeft: () => <DrawerToggleButton /> }}>
      <Stack.Screen name="templates" />
      <Stack.Screen name="vpn-servers" />
    </Stack>
  );
}
