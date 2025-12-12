import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import blockersReducer from './slices/blockersSlice';
import aiReportsReducer from './slices/aiReportsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blockers: blockersReducer,
    aiReports: aiReportsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

