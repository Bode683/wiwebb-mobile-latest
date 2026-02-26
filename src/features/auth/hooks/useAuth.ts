import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  authLoading,
  authReady,
  authError,
  authReset,
  setUser,
  selectAuth,
} from '../slice/authSlice';
import { getAccessToken, clearTokens } from '../utils/tokenStorage';
import { MOCK_AUTH_ENABLED, mockLogin, mockLogout, MOCK_USER } from '../utils/mockAuth';
import { useLazyGetMeQuery } from '../api/authApi';

export function useAuth() {
  const dispatch = useAppDispatch();
  const authState = useAppSelector(selectAuth);
  const [triggerGetMe] = useLazyGetMeQuery();

  const login = useCallback(
    async (email: string, password: string) => {
      dispatch(authLoading());
      try {
        if (MOCK_AUTH_ENABLED) {
          const user = await mockLogin(email, password);
          dispatch(setUser(user));
          dispatch(authReady(true));
        } else {
          // Real OAuth flow will go here (expo-auth-session + Keycloak)
          throw new Error('Real auth not implemented yet');
        }
      } catch (err) {
        dispatch(authError());
        throw err;
      }
    },
    [dispatch],
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

      if (MOCK_AUTH_ENABLED) {
        // In dev, if we have a token, assume authenticated with mock user
        dispatch(setUser(MOCK_USER));
        dispatch(authReady(true));
      } else {
        // Validate token by calling /auth/me/
        const result = await triggerGetMe().unwrap();
        dispatch(setUser(result));
        dispatch(authReady(true));
      }
    } catch {
      await clearTokens();
      dispatch(authReady(false));
    }
  }, [dispatch, triggerGetMe]);

  return {
    ...authState,
    login,
    logout,
    bootstrap,
  };
}
