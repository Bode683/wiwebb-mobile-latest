import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import reduxStorage from './storage';
import messageReducer from './slices/message';
import usersReducer from './slices/users';
import { colorsApi } from './slices/colors';
import { baseApi } from './api/baseApi';
import authReducer from '../features/auth/slice/authSlice';
import onboardingReducer from '../features/onboarding/slice/onboardingSlice';
import organizationReducer from '../features/organizations/slice/organizationSlice';
import paymentMethodsReducer from './slices/paymentMethods';

const rootReducer = combineReducers({
  message: messageReducer,
  users: usersReducer,
  auth: authReducer,
  onboarding: onboardingReducer,
  organization: organizationReducer,
  paymentMethods: paymentMethodsReducer,
  [colorsApi.reducerPath]: colorsApi.reducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage: reduxStorage,
  // Auth is NOT persisted — token lives in SecureStore, user re-fetched via getMe.
  // colorsApi and baseApi manage their own cache lifecycle.
  whitelist: ['message', 'onboarding', 'organization', 'paymentMethods'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Required: redux-persist dispatches non-serializable actions internally
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(colorsApi.middleware)
      .concat(baseApi.middleware),
});

export const persistor = persistStore(store);

// Enables refetchOnFocus and refetchOnReconnect for RTK Query
setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
