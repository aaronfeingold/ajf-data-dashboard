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
      auth: { user: { isAuthenticated: boolean; username: string | null } };
    };

    logger.debug(
      "Auth middleware processing session update:",
      status,
      `currentIsAuthenticated: ${state.auth.user.isAuthenticated}`
    );

    if (status === "authenticated" && !state.auth.user.isAuthenticated) {
      // Set authenticated user
      listenerApi.dispatch(
        setUser({
          username: userData?.name || "User",
          isAuthenticated: true,
        })
      );

      logger.info(
        "Auth middleware: User authenticated",
        userData?.name || "User"
      );

      // Force a reload to ensure sidebar and other components reflect the new state
      if (typeof window !== "undefined") {
        setTimeout(() => {
          // Add a tiny delay before reloading to ensure Redux state is saved
          logger.debug(
            "Auth middleware: Triggering reload for authentication refresh",
            `username: ${userData?.name || "User"}`
          );
          // Uncomment this if you want to force a reload on auth change
          // window.location.reload();
        }, 100);
      }
    }

    if (status === "unauthenticated" && state.auth.user.isAuthenticated) {
      // Clear user data on unauthenticated
      listenerApi.dispatch(clearUser());
      logger.info(
        "Auth middleware: User unauthenticated",
        `userData: ${userData?.name || null}`
      );
    }
  },
});
