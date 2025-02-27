"use client";

import { configureStore, Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "@/store/authSlice";
import propertyReducer from "@/store/propertySlice";
import reportReducer from "@/store/reportSlice";
import reportRequestReducer, {
  createReportRequestPollingMiddleware,
} from "@/store/reportRequestSlice";
import chatReducer from "@/store/chatSlice";
import userReducer from "@/store/userSlice";
import type { AuthState } from "@/types/store";

import { createLoggerMiddleware } from "@/store/middleware/reduxLoggerMiddleware";
import { authSyncMiddleware } from "./middleware/authSyncMiddleware";

/**
 * PERSISTED REDUCER CONFIGS
 *
 * Auth:
 *   - Persist configuration using local storage
 */
const authPersistConfig = {
  key: "auth",
  version: 1,
  storage,
  whitelist: ["user"],
};


/**
 * Persisted reducers: auth and property, localStorage and indexedDb respectively
 */

const persistedAuthReducer = persistReducer<AuthState>(
  authPersistConfig,
  authReducer
);

/*
 * MIDDLEWARE
 *
 * Handle polling for report request by id till it's completed
 * when complete, a new notification is sent to the user
 */
const pollingMiddleware: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    // TODO: Type assertion to ensure return type matches
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return createReportRequestPollingMiddleware(api)(next as any)(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      action as any
    ) as ReturnType<typeof next>;
  };

// Create the store
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    property: propertyReducer,
    report: reportReducer,
    reportRequest: reportRequestReducer,
    chat: chatReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .prepend(authSyncMiddleware.middleware)
      .concat(pollingMiddleware)
      .concat(
        createLoggerMiddleware({
          // Optional custom configuration
          logLevel: {
            development: ["info", "warn", "error", "debug"],
            production: ["error", "warn"],
          },
          maxPayloadSize: 5000, // Adjust based on your needs
          logStateDiff: true,
        })
      ),
});

// Log the state on every change
// TODO: Disable this in production
store.subscribe(() => {
  console.log("Redux Store State:", store.getState());
});

// Only create persistor on the client
export const persistor = persistStore(store);

// Helper function to monitor storage usage
// export const monitorStorageUsage = async () => {
//   const usage = await getStorageSize();
//   console.log("Storage usage:", usage);
//   return usage;
// };

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
