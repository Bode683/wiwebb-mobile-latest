import React, { useEffect, useRef, ReactNode, useState, useCallback } from 'react';
import { useSegments, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useAuth } from '../hooks/useAuth';
import { useAppSelector } from '../../../store/hooks';
import { selectOnboardingCompleted } from '../../onboarding/slice/onboardingSlice';
import { AnimatedSplash } from './AnimatedSplash';

SplashScreen.preventAutoHideAsync();

// Minimum time the branded splash is visible — ensures the entrance animation
// always plays fully even when auth resolves instantly (e.g. mock auth in dev).
const SPLASH_MIN_MS = 2200;

export function AuthBootstrap({ children }: { children: ReactNode }) {
  const { status, isAuthenticated, user, bootstrap } = useAuth();
  const onboardingCompleted = useAppSelector(selectOnboardingCompleted);
  const segments = useSegments();
  const router = useRouter();
  const hasBootstrapped = useRef(false);

  // Two independent gates: auth resolved + minimum time elapsed
  const [authReady, setAuthReady] = useState(false);
  const [minTimePassed, setMinTimePassed] = useState(false);

  const [splashVisible, setSplashVisible] = useState(true);
  const [splashMounted, setSplashMounted] = useState(true);

  // Run bootstrap once on mount
  useEffect(() => {
    if (!hasBootstrapped.current) {
      hasBootstrapped.current = true;
      bootstrap();
    }
  }, [bootstrap]);

  // Minimum display timer — starts on mount
  useEffect(() => {
    const t = setTimeout(() => setMinTimePassed(true), SPLASH_MIN_MS);
    return () => clearTimeout(t);
  }, []);

  // Only dismiss the splash when BOTH gates are open
  useEffect(() => {
    if (authReady && minTimePassed) {
      setSplashVisible(false);
    }
  }, [authReady, minTimePassed]);

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

    setAuthReady(true);
  }, [status, isAuthenticated, onboardingCompleted, user, segments, router]);

  // AnimatedSplash calls this once its background has laid out and is painted.
  // We hide the system splash here rather than in a bare useEffect so there is
  // no frame where the underlying app content is exposed between the two.
  const handleSplashReady = useCallback(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <>
      {children}
      {splashMounted && (
        <AnimatedSplash
          visible={splashVisible}
          onReady={handleSplashReady}
          onHidden={() => setSplashMounted(false)}
        />
      )}
    </>
  );
}
