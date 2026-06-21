import React, { useEffect, useRef, ReactNode } from 'react';
import { useSegments, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useAuth } from '../hooks/useAuth';
import { useAppSelector } from '../../../store/hooks';
import { selectOnboardingCompleted } from '../../onboarding/slice/onboardingSlice';
import { memberOrgIds } from '../rbac';

SplashScreen.preventAutoHideAsync();

export function AuthBootstrap({ children }: { children: ReactNode }) {
  const { status, isAuthenticated, user, bootstrap } = useAuth();
  const onboardingCompleted = useAppSelector(selectOnboardingCompleted);
  const segments = useSegments();
  const router = useRouter();
  const hasBootstrapped = useRef(false);

  // Run bootstrap once on mount
  useEffect(() => {
    if (!hasBootstrapped.current) {
      hasBootstrapped.current = true;
      bootstrap();
    }
  }, [bootstrap]);

  // Handle routing decisions once auth status is resolved
  useEffect(() => {
    if (status !== 'ready') return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';
    // Public routes (e.g. accept-invite) are reachable without auth and must
    // never trigger a redirect.
    const inPublicGroup = segments[0] === '(public)';

    if (inPublicGroup) {
      SplashScreen.hideAsync();
      return;
    }

    if (!isAuthenticated) {
      if (!inAuthGroup) {
        router.replace('/(auth)/welcome' as any);
      }
    } else {
      // Multi-tenant: a user who belongs to no org is sent to onboarding to
      // create their first tenant; membership comes from the backend.
      const belongsToAnyOrg = memberOrgIds(user).length > 0;
      const needsOnboarding = !onboardingCompleted && !belongsToAnyOrg;

      if (needsOnboarding) {
        if (!inOnboardingGroup) {
          router.replace('/(onboarding)' as any);
        }
      } else {
        if (inAuthGroup || inOnboardingGroup) {
          router.replace('/(drawer)/(tabs)/dashboard' as any);
        }
      }
    }

    SplashScreen.hideAsync();
  }, [status, isAuthenticated, onboardingCompleted, user, segments, router]);

  return <>{children}</>;
}
