import React from 'react';
import { Stack } from 'expo-router';
import { DrawerToggleButton } from '@react-navigation/drawer';

export const unstable_settings = { initialRouteName: 'plans' };

export default function SubscriptionsLayout() {
  return (
    <Stack screenOptions={{ headerLeft: () => <DrawerToggleButton /> }}>
      <Stack.Screen name="plans" />
      <Stack.Screen name="orders" />
      <Stack.Screen name="payments" />
    </Stack>
  );
}
