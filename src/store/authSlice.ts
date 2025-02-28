"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { signIn } from "next-auth/react";
import { RootState } from "@/store/store";
import type { AuthState } from "@/types/store";
import { logger } from "@/utils/logger";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    credentials: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const result = await signIn("credentials", {
        username: credentials.username,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        return rejectWithValue(result.error);
      }

      return {
        username: credentials.username,
        isAuthenticated: true,
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error : "Login failed");
    }
  }
);

export const signOutUser = createAsyncThunk(
  "auth/signOutUser",
  async (_, { rejectWithValue }): Promise<boolean | unknown> => {
    try {
      logger.info("AuthSlice", "Clearing auth cookies");
      try {
        await fetch("/api/auth/clearCookies", {
          method: "POST",
          credentials: "include",
        });
        logger.debug("AuthSlice", "Auth cookies cleared successfully");
      } catch (cookieError) {
        logger.warn("AuthSlice", "Error clearing cookies:", cookieError);
        // Continue with logout even if cookie clearing fails
      }

      // Always return true to indicate success
      // This ensures the process continues even if there are minor issues
      return true;
    } catch (error) {
      logger.error("AuthSlice", "Logout failed:", error);
      return rejectWithValue(error instanceof Error ? error : "Logout failed");
    }
  }
);

const initialState: AuthState = {
  user: {
    username: null,
    isAuthenticated: false,
  },
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(
      state,
      action: PayloadAction<{
        username: string;
        isAuthenticated: boolean;
      }>
    ) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = initialState.user;
      state.status = "idle";
      state.error = null;
    },
    // Immediately clear auth state (for emergency logout)
    forceLogout(state) {
      state.user = initialState.user;
      state.status = "idle";
      state.error = null;
      logger.info("AuthSlice", "Force logout executed");
    },
    updateSessionStatus: (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      state,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      action: PayloadAction<{
        status: "authenticated" | "unauthenticated" | "loading";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        userData: any;
      }>
    ) => {
      // This action just triggers the middleware, doesn't need to modify state directly
    },
  },
  extraReducers: (builder) => {
    builder
      /* Login reducers */
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as Error;
      })
      .addCase(signOutUser.pending, (state) => {
        state.status = "loading";
        logger.debug("AuthSlice", "Logout started");
      })
      .addCase(signOutUser.fulfilled, (state) => {
        logger.debug("AuthSlice", "Logout succeeded, clearing auth state");
        // Immediately clear state regardless of payload
        state.status = "idle";
        state.user = initialState.user;
        state.error = null;
      })
      .addCase(signOutUser.rejected, (state, action) => {
        logger.warn(
          "AuthSlice",
          "Logout failed but clearing auth state anyway"
        );
        // Still clear state even if there's an error
        state.status = "idle";
        state.user = initialState.user;
        state.error = action.payload as Error;
      });
  },
});

export const selectIsAuthenticated = (state: RootState) =>
  !!state.auth.user.isAuthenticated;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;

export const { setUser, clearUser, updateSessionStatus, forceLogout } =
  authSlice.actions;

export default authSlice.reducer;
