"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { signIn } from "next-auth/react";
import { RootState } from "@/store/store";
import type { AuthState } from "@/types/store";

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
      try {
        await fetch("/api/auth/clearCookies", {
          method: "POST",
          credentials: "include",
        });
      } catch (cookieError) {
        console.warn("Error clearing cookies:", cookieError);
      }
      return true;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error : "Login failed");
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
      })
      .addCase(signOutUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.status = "succeeded";
          state.user = initialState.user;
          state.error = null;
        }
      })
      .addCase(signOutUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as Error;
      });
  },
});

export const selectIsAuthenticated = (state: RootState) =>
  !!state.auth.user.isAuthenticated;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;

export const { setUser, clearUser, updateSessionStatus } = authSlice.actions;

export default authSlice.reducer;
