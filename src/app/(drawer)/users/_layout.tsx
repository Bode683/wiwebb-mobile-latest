import React from 'react';
import { Stack } from 'expo-router';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { useTranslation } from 'react-i18next';

export const unstable_settings = { initialRouteName: 'index' };

export default function SectionLayout() {
  const { t } = useTranslation('users');
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: t('list.title'),
          headerLeft: () => <DrawerToggleButton />,
        }}
      />
      <Stack.Screen name="invite" options={{ title: t('invite.title') }} />
      <Stack.Screen name="[id]" options={{ title: t('detail.title') }} />
    </Stack>
  );
}
