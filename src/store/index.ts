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

const rootReducer = combineReducers({
  message: messageReducer,
  users: usersReducer,
  [colorsApi.reducerPath]: colorsApi.reducer,
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage: reduxStorage,
  // Only persist message slice. Users are re-fetched on mount;
  // RTK Query manages its own cache lifecycle.
  whitelist: ['message'],
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
    }).concat(colorsApi.middleware),
});

export const persistor = persistStore(store);

// Enables refetchOnFocus and refetchOnReconnect for RTK Query
setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
