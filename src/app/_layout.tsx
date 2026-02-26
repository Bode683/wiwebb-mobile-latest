import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store';
import { ThemeProvider } from '../theme';
import { AuthBootstrap } from '../features/auth/components/AuthBootstrap';
import '../i18n'; // Initialize i18n before app renders

const RootLayout = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider>
      <AuthBootstrap>
      <StatusBar style="auto" />

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="(onboarding)"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="(drawer)"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      </Stack>
      </AuthBootstrap>
      </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default RootLayout;
