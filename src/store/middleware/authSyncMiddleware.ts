"use client";

import { createListenerMiddleware } from "@reduxjs/toolkit";
import { clearUser, setUser, updateSessionStatus } from "@/store/authSlice";
import { logger } from "@/utils/logger";

export const authSyncMiddleware = createListenerMiddleware();

authSyncMiddleware.startListening({
  actionCreator: updateSessionStatus,
  effect: (action, listenerApi) => {
    const { status, userData } = action.payload;
    const state = listenerApi.getState() as {
      auth: { user: { authenticated: boolean } };
    };

    logger.debug("Auth middleware processing session update:", status);

    if (status === "authenticated" && !state.auth.user.authenticated) {
      listenerApi.dispatch(
        setUser({
          username: userData?.name || "User",
          isAuthenticated: true,
        })
      );
    }

    if (status === "unauthenticated" && state.auth.user.authenticated) {
      listenerApi.dispatch(clearUser());
    }
  },
});
