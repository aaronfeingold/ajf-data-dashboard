"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { UserState } from "@/types/store";
import { updatePassword } from "@/actions/user";
import type { AuthState } from "@/types/store";
import { getAllUserRecordCards, getUserById } from "@/actions/user";
import { GetAllUserRecordCards, PaginationParams } from "@/types/api";
import { User } from "@/types/user";

const initialState: UserState = {
  users: {
    count: 0,
    data: [],
    lastFetched: 0,
  },
  profile: {
    username: "jsmith",
    email: "john.smith@indyTaxLaw.com",
    groups: ["admin"],
    url: "",
  },
  status: "idle",
  error: null,
  passwordResetStatus: "idle",
};

// TODO: DEPRECATE IF UNUSED
export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as {
      auth: { user: { access: string | null } };
      user: { username: string };
    };

    try {
      const token = state.auth.user.access;
      if (!token) {
        throw new Error("No authentication token available");
      }
      return await updatePassword(token, state.user.username);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to reset password"
      );
    }
  }
);

export const fetchUsers = createAsyncThunk<
  GetAllUserRecordCards,
  PaginationParams
>(
  "user/getUsers",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getAllUserRecordCards(params.pageSize, params);
      return response as GetAllUserRecordCards;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error : "Failed to fetch user data"
      );
    }
  },
  {
    // This condition prevents the thunk from running if we're not authenticated
    condition: (_, { getState }) => {
      const state = getState() as { auth: AuthState };
      return !!state.auth.user.isAuthenticated;
    },
  }
);

export const fetchUser = createAsyncThunk<User, number>(
  "user/getUser",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getUserById(id);
      return response as User;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error : "Failed to fetch property data"
      );
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as { auth: AuthState };
      return !!state.auth.user.isAuthenticated;
    },
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearPasswordResetStatus: (state) => {
      state.passwordResetStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetPassword.pending, (state) => {
        state.passwordResetStatus = "loading";
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.passwordResetStatus = "succeeded";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.passwordResetStatus = "failed";
        state.error = action.payload as Error;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as Error;
      });
    // TODO: GET USER BY ID RESPONSE
  },
});

export const { clearPasswordResetStatus } = userSlice.actions;

// Selectors
export const selectUserProfile = (state: { user: UserState }) =>
  state.user.profile;
export const selectPasswordResetStatus = (state: { user: UserState }) =>
  state.user.passwordResetStatus;
export const selectUserError = (state: { user: UserState }) => state.user.error;

export default userSlice.reducer;
