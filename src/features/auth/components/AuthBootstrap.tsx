import React, { useEffect, useRef, ReactNode, useState } from 'react';
import { useSegments, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useAuth } from '../hooks/useAuth';
import { useAppSelector } from '../../../store/hooks';
import { selectOnboardingCompleted } from '../../onboarding/slice/onboardingSlice';
import { AnimatedSplash } from './AnimatedSplash';

SplashScreen.preventAutoHideAsync();

export function AuthBootstrap({ children }: { children: ReactNode }) {
  const { status, isAuthenticated, user, bootstrap } = useAuth();
  const onboardingCompleted = useAppSelector(selectOnboardingCompleted);
  const segments = useSegments();
  const router = useRouter();
  const hasBootstrapped = useRef(false);

  const [splashVisible, setSplashVisible] = useState(true);
  const [splashMounted, setSplashMounted] = useState(true);

  // Run bootstrap once on mount
  useEffect(() => {
    if (!hasBootstrapped.current) {
      hasBootstrapped.current = true;
      bootstrap();
    }
  }, [bootstrap]);

  // Hide the system splash immediately — AnimatedSplash takes over
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  // Handle routing decisions once auth status is resolved
  useEffect(() => {
    if (status !== 'ready') return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';

    if (!isAuthenticated) {
      if (!inAuthGroup) {
        router.replace('/(auth)/welcome' as any);
      }
    } else {
      const ownsOrg = user?.organization_users?.is_admin === true;
      const needsOnboarding = !onboardingCompleted && !ownsOrg;

      if (needsOnboarding) {
        if (!inOnboardingGroup) {
          router.replace('/(onboarding)' as any);
        }
      } else {
        if (inAuthGroup || inOnboardingGroup) {
          router.replace('/(drawer)/(tabs)/home' as any);
        }
      }
    }

    // Dismiss animated splash once routing is determined
    setSplashVisible(false);
  }, [status, isAuthenticated, onboardingCompleted, user, segments, router]);

  return (
    <>
      {children}
      {splashMounted && (
        <AnimatedSplash
          visible={splashVisible}
          onHidden={() => setSplashMounted(false)}
        />
      )}
    </>
  );
}
