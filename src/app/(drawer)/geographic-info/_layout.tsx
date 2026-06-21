import React from 'react';
import { Stack } from 'expo-router';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { useTranslation } from 'react-i18next';

export const unstable_settings = { initialRouteName: 'locations' };

export default function GeographicInfoLayout() {
  const { t } = useTranslation('sites');
  return (
    <Stack>
      <Stack.Screen
        name="locations"
        options={{
          title: t('list.title'),
          headerLeft: () => <DrawerToggleButton />,
        }}
      />
      <Stack.Screen name="site-form" options={{ title: t('form.addTitle') }} />
      <Stack.Screen name="[id]" options={{ title: t('detail.title') }} />
    </Stack>
  );
}
