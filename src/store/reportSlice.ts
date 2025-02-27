"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { ReportState } from "@/types/store";
import type { GetAllReportRecordCards } from "@/types/api";
import { getAllReportRecordCards } from "@/actions/report";

const initialState: ReportState = {
  data: {
    count: 0,
    data: [],
  },
  status: "idle",
  error: null,
};

// Thunk for fetching reports
// TODO: BUILD OUT THE THUNK
export const fetchReports = createAsyncThunk(
  "report/fetchReport",
  async (): Promise<GetAllReportRecordCards> => {
    return await getAllReportRecordCards();
  }
);

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error as Error;
      });
  },
});

export default reportSlice.reducer;
