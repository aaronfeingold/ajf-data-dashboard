"use client";

import {
  Dispatch,
  createSlice,
  createAsyncThunk,
  AnyAction,
} from "@reduxjs/toolkit";
import type { AppDispatch } from "@/store/store";
import type { ReportRequest } from "@/types/reportRequest";
import type { ReportRequestState } from "@/types/store";
import { getAllReportRequestRecordCards } from "@/actions/reportRequest";
import { GetAllReportRequestRecordCards } from "@/types/api";

// Constants for polling configuration
const POLLING_INTERVAL = process.env.NODE_ENV === "development" ? 5000 : 30000; // 5s in dev, 30s in prod
const MAX_POLLING_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
const STALE_REPORT_THRESHOLD = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds

type StateShape = {
  reports: ReportRequestState;
};

type MiddlewareStore = {
  getState: () => StateShape;
  dispatch: Dispatch;
};

const initialState: ReportRequestState = {
  data: {
    data: [],
    count: 0,
  },
  status: "idle",
  error: null,
  polling: {
    activePollingId: null,
    pollingStartTime: null,
    pollingIntervalId: null,
  },
};

// Thunk for fetching reports requests
// TODO: BUILD OUT THE THUNK
export const fetchReportRequests = createAsyncThunk(
  "reportRequests/fetchReportRequests",
  async (): Promise<GetAllReportRequestRecordCards> => {
    return await getAllReportRequestRecordCards();
  }
);

// Thunk for fetching a single report by ID
// TODO MAKE THE API FN
export const fetchReportRequestById = createAsyncThunk(
  "reports/fetchReportById",
  async (reportId: number) => {
    console.log(`Fetching report with ID: ${reportId}`);
    return {} as ReportRequest;
  }
);

// Thunk for submitting a new report
// TODO MAKE THE API FN
export const submitNewReportRequest = createAsyncThunk(
  "reportRequest/submitNewReportRequest",
  async (
    reportRequest: Omit<ReportRequest, "id" | "status" | "created" | "updated">
  ) => {
    console.log("Submitting new report:", reportRequest);
    return {} as ReportRequest;
  }
);

// Thunk for starting report polling
export const startReportPolling = createAsyncThunk(
  "reports/startPolling",
  async (reportId: number, { dispatch }) => {
    const report = await dispatch(fetchReportRequestById(reportId)).unwrap();

    // Check if report is too old
    const reportDate = new Date(report.created).getTime();
    const now = Date.now();
    if (now - reportDate > STALE_REPORT_THRESHOLD) {
      throw new Error("Report is too old to poll");
    }

    return report;
  }
);

const reportRequestSlice = createSlice({
  name: "reportRequest",
  initialState,
  reducers: {
    stopPolling: (state) => {
      if (state.polling.pollingIntervalId) {
        window.clearInterval(state.polling.pollingIntervalId);
      }
      state.polling = {
        activePollingId: null,
        pollingStartTime: null,
        pollingIntervalId: null,
      };
    },
    updateReportRequest: (state, action) => {
      const index = state.data.data.findIndex(
        (report) => report.id === action.payload.id
      );
      if (index !== -1) {
        state.data.data[index] = action.payload;
      }
    },
    setPollingInterval: (state, action) => {
      state.polling.pollingIntervalId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportRequests.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReportRequests.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchReportRequests.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error as Error;
      })
      .addCase(submitNewReportRequest.fulfilled, (state, action) => {
        state.data.data.unshift(action.payload);
      })
      .addCase(startReportPolling.fulfilled, (state, action) => {
        state.polling.activePollingId = action.payload.id;
        state.polling.pollingStartTime = Date.now();
      })
      .addCase(startReportPolling.rejected, (state) => {
        state.polling = {
          activePollingId: null,
          pollingStartTime: null,
          pollingIntervalId: null,
        };
      });
  },
});

export const { stopPolling, updateReportRequest, setPollingInterval } =
  reportRequestSlice.actions;

// Polling middleware
export const createReportRequestPollingMiddleware =
  (store: MiddlewareStore) => (next: Dispatch) => (action: AnyAction) => {
    const result = next(action);

    if (startReportPolling.fulfilled.match(action)) {
      const state = store.getState().reports;

      // Clear any existing interval
      if (state.polling.pollingIntervalId) {
        window.clearInterval(state.polling.pollingIntervalId);
      }

      // Start new polling interval
      const intervalId = window.setInterval(async () => {
        const currentState = store.getState().reports;
        const { activePollingId, pollingStartTime } = currentState.polling;

        // Check if we should stop polling
        if (!activePollingId || !pollingStartTime) {
          store.dispatch(stopPolling());
          return;
        }

        // Check if we've exceeded max polling duration
        if (Date.now() - pollingStartTime > MAX_POLLING_DURATION) {
          store.dispatch(stopPolling());
          return;
        }

        try {
          const updatedReport = await (store.dispatch as AppDispatch)(
            fetchReportRequestById(activePollingId)
          ).unwrap();
          store.dispatch(updateReportRequest(updatedReport));

          if (updatedReport.status !== "pending") {
            store.dispatch(stopPolling());

            if (process.env.NODE_ENV === "development") {
              // Notification dispatch would go here
            }
          }
        } catch (error) {
          console.error("Error polling report:", error);
          store.dispatch(stopPolling());
        }
      }, POLLING_INTERVAL);

      store.dispatch(setPollingInterval(intervalId));
    }

    return result;
  };

export default reportRequestSlice.reducer;
