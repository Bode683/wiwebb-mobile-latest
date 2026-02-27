import React from 'react';
import { Stack } from 'expo-router';
import { DrawerToggleButton } from '@react-navigation/drawer';

export const unstable_settings = { initialRouteName: 'accounting-sessions' };

export default function RadiusLayout() {
  return (
    <Stack screenOptions={{ headerLeft: () => <DrawerToggleButton /> }}>
      <Stack.Screen name="accounting-sessions" />
      <Stack.Screen name="groups" />
      <Stack.Screen name="batch-user-creation" />
      <Stack.Screen name="post-auth-log" />
    </Stack>
  );
}
