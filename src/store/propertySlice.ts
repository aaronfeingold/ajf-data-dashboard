"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PropertyState } from "@/types/store";
import { logger } from "@/utils/logger";
import { indexedDBService } from "@/services/indexedDbService";
import {
  GetAllPropertyRecordCards,
  GetPropertyRecordCardsListResponse,
} from "@/types/api";

export const fetchPropertyData = createAsyncThunk(
  "property/fetchData",
  async (
    params: { pageSize?: number } = {},
    { rejectWithValue }
  ): Promise<GetAllPropertyRecordCards | unknown> => {
    const { pageSize = 300 } = params;
    logger.debug("PropertySlice", "Checking IndexedDB for property data");
    const { data: cachedData, isFresh } =
      await indexedDBService.getPropertyData();

    // If we already have data, don't fetch again, since data rarely changes
    if (cachedData && isFresh) {
      logger.info("PropertySlice", "Using cached property data from IndexedDB");
      return cachedData;
    }

    logger.info("PropertySlice", "Fetching fresh property data from API");

    try {
      const data = [];
      let page = 1;
      let count = 0;

      while (true) {
        const response = await fetch(
          `/api/property?pageSize=${pageSize}&page=${page}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to generate analysis");
        }
        const chunk: GetPropertyRecordCardsListResponse = await response.json();
        // after first iteration, count will be set
        if (!count) count = chunk.count;
        data.push(...chunk.results);

        if (!chunk.next) break;
        page++;
      }

      await indexedDBService.savePropertyData({ data, count });

      return {
        count,
        data,
        lastFetched: Date.now(),
      } as GetAllPropertyRecordCards;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error : "Failed to fetch property data"
      );
    }
  }
);

export const loadPropertyDataFromCache = createAsyncThunk(
  "property/loadPropertyDataFromCache",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await indexedDBService.getPropertyData();
      return data;
    } catch (error) {
      logger.error(
        "PropertySlice",
        "Error loading property data from cache",
        error
      );
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const clearPropertyData = createAsyncThunk(
  "property/clearPropertyData",
  async (_, { rejectWithValue }) => {
    try {
      return true;
    } catch (error) {
      logger.error("PropertySlice", "Error clearing property data", error);
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

const initialState: PropertyState = {
  data: {
    count: 0,
    data: [],
  },
  status: "idle",
  error: null,
  lastFetched: null,
};

const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.status = "loading";
    },
    setPropertyData: (state, action) => {
      state.data = action.payload;
      state.status = "succeeded";
    },
    invalidateData: (state) => {
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPropertyData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPropertyData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload as GetAllPropertyRecordCards;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchPropertyData.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as Error) || "Failed to fetch data";
      })
      .addCase(loadPropertyDataFromCache.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadPropertyDataFromCache.fulfilled, (state, action) => {
        if (action.payload) {
          state.status = "succeeded";
          state.data = action.payload;
          state.error = null;
        } else {
          state.status = "idle";
        }
      })
      .addCase(loadPropertyDataFromCache.rejected, (state, action) => {
        state.status = "idle";
        state.error = (action.payload as Error) || "Unknown error";
      })
      .addCase(clearPropertyData.fulfilled, () => {
        return initialState;
      });
  },
});

export const { setLoading, setPropertyData, invalidateData } =
  propertySlice.actions;
export default propertySlice.reducer;

// Selectors
export const selectAllProperties = (state: { property: PropertyState }) =>
  state.property.data;
export const selectPropertyStatus = (state: { property: PropertyState }) =>
  state.property.status;
export const selectPropertyError = (state: { property: PropertyState }) =>
  state.property.error;
