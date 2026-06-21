import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  authLoading,
  authReady,
  authError,
  authReset,
  selectAuth,
} from '../slice/authSlice';
import {
  setActiveOrganization,
  selectActiveOrganizationId,
} from '../../organizations/slice/organizationSlice';
import { getAccessToken, clearTokens } from '../utils/tokenStorage';
import { MOCK_AUTH_ENABLED, mockLogin, mockLogout } from '../utils/mockAuth';
import { useLazyGetMeQuery } from '../api/authApi';
import { defaultActiveOrgId } from '../rbac';
import type { User } from '../../../types/api';

export function useAuth() {
  const dispatch = useAppDispatch();
  const authState = useAppSelector(selectAuth);
  const activeOrgId = useAppSelector(selectActiveOrganizationId);
  const [triggerGetMe] = useLazyGetMeQuery();

  // Ensure the active org is one the user actually belongs to.
  const ensureActiveOrg = useCallback(
    (user: User) => {
      const memberIds = user.organization_users?.map((o) => o.organization) ?? [];
      const valid =
        activeOrgId && (user.is_superuser || memberIds.includes(activeOrgId));
      if (!valid) {
        dispatch(setActiveOrganization(defaultActiveOrgId(user)));
      }
    },
    [dispatch, activeOrgId],
  );

  const login = useCallback(
    async (identifier: string, password: string) => {
      dispatch(authLoading());
      try {
        if (MOCK_AUTH_ENABLED) {
          await mockLogin(identifier, password);
        } else {
          // Real OAuth flow will go here (expo-auth-session + Keycloak)
          throw new Error('Real auth not implemented yet');
        }
        // Profile always comes from the backend (getMe dispatches setUser).
        const user = await triggerGetMe().unwrap();
        ensureActiveOrg(user);
        dispatch(authReady(true));
      } catch (err) {
        dispatch(authError());
        throw err;
      }
    },
    [dispatch, triggerGetMe, ensureActiveOrg],
  );

  const logout = useCallback(async () => {
    if (MOCK_AUTH_ENABLED) {
      await mockLogout();
    } else {
      await clearTokens();
    }
    dispatch(authReset());
  }, [dispatch]);

  const bootstrap = useCallback(async () => {
    dispatch(authLoading());
    try {
      const token = await getAccessToken();
      if (!token) {
        dispatch(authReady(false));
        return;
      }
      // Re-hydrate identity from the backend (works for mock + real).
      const user = await triggerGetMe().unwrap();
      ensureActiveOrg(user);
      dispatch(authReady(true));
    } catch {
      await clearTokens();
      dispatch(authReady(false));
    }
  }, [dispatch, triggerGetMe, ensureActiveOrg]);

  return {
    ...authState,
    login,
    logout,
    bootstrap,
  };
}
