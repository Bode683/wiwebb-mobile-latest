import React from 'react';
import { Stack } from 'expo-router';
import { DrawerToggleButton } from '@react-navigation/drawer';

export const unstable_settings = { initialRouteName: 'authorities' };

export default function CasLayout() {
  return (
    <Stack screenOptions={{ headerLeft: () => <DrawerToggleButton /> }}>
      <Stack.Screen name="authorities" />
      <Stack.Screen name="certificates" />
    </Stack>
  );
}
