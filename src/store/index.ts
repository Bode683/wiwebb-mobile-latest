import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import messageReducer from './slices/message';
import usersReducer from './slices/users';
import { colorsApi } from './slices/colors';

export const store = configureStore({
  reducer: {
    message: messageReducer,
    users: usersReducer,
    [colorsApi.reducerPath]: colorsApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(colorsApi.middleware),
});

// Enables refetchOnFocus and refetchOnReconnect for RTK Query
setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
