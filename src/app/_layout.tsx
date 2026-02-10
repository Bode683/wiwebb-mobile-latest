import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store';
import '../i18n'; // Initialize i18n before app renders

/**
 * RootLayout component that defines the main layout of the application.
 * It includes the StatusBar and the Stack navigator for handling different screens.
 */
const RootLayout = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      {/* StatusBar configuration */}
      <StatusBar style="auto" />

      {/* Stack navigator configuration */}
      <Stack
        screenOptions={{
          headerShown: false, // Hide headers for all screens by default
        }}
      >
        {/* Auth Stack */}
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false, // Hide header for auth screens
            //gestureEnabled: false // Uncomment to disable swipe gestures for auth screens
          }}
        />

        {/* Drawer — wraps all main app screens */}
        <Stack.Screen
          name="(drawer)"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      </Stack>
      </PersistGate>
    </Provider>
  );
};

export default RootLayout;
