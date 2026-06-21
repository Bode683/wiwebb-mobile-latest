import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User, OrganizationUser } from '../../../types/api';
import type { RootState } from '../../../store';

type AuthStatus = 'idle' | 'loading' | 'ready' | 'error';

interface AuthState {
  isAuthenticated: boolean;
  status: AuthStatus;
  user: User | null;
  profileLoaded: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  status: 'idle',
  user: null,
  profileLoaded: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authLoading(state) {
      state.status = 'loading';
    },
    authReady(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
      state.status = 'ready';
    },
    authError(state) {
      state.status = 'error';
      state.isAuthenticated = false;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.profileLoaded = true;
    },
    clearUser(state) {
      state.user = null;
      state.profileLoaded = false;
    },
    /** Append a tenant membership locally (e.g. after creating an org in onboarding). */
    addOrganizationMembership(state, action: PayloadAction<OrganizationUser>) {
      if (!state.user) return;
      const exists = state.user.organization_users?.some(
        (o) => o.organization === action.payload.organization,
      );
      if (!exists) {
        state.user.organization_users = [
          ...(state.user.organization_users ?? []),
          action.payload,
        ];
      }
    },
    authReset() {
      return initialState;
    },
  },
});

export const {
  authLoading,
  authReady,
  authError,
  setUser,
  clearUser,
  addOrganizationMembership,
  authReset,
} = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthStatus = (state: RootState) => state.auth.status;

export default authSlice.reducer;
