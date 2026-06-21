import React from 'react';
import { Stack } from 'expo-router';
import { DrawerToggleButton } from '@react-navigation/drawer';

export const unstable_settings = { initialRouteName: 'plans' };

export default function SubscriptionsLayout() {
  return (
    <Stack screenOptions={{ headerLeft: () => <DrawerToggleButton /> }}>
      <Stack.Screen name="plans" options={{ title: 'Plans' }} />
      <Stack.Screen name="plan-form" options={{ title: 'Plan' }} />
      <Stack.Screen name="payment-providers" options={{ title: 'Payment Providers' }} />
      <Stack.Screen name="provider-form" options={{ title: 'Configure Provider' }} />
      <Stack.Screen name="orders" options={{ title: 'Orders' }} />
      <Stack.Screen name="order-detail" options={{ title: 'Order' }} />
      <Stack.Screen name="payments" options={{ title: 'Payments' }} />
    </Stack>
  );
}
