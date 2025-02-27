"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchPropertyData,
  loadPropertyDataFromCache,
  clearPropertyData,
} from "@/store/propertySlice";
import type { RootState } from "@/store/store";
import type { GetAllPropertyRecordCards } from "@/types/api";
import { logger } from "@/utils/logger";
import { indexedDBService } from "@/services/indexedDbService";

interface PropertyContextValue {
  isLoading: boolean;
  error: Error | null;
  data: GetAllPropertyRecordCards | null;
  clearData: () => Promise<void>;
}

const PropertyDataContext = createContext<PropertyContextValue>({
  isLoading: false,
  error: null,
  data: null,
  clearData: async () => {},
});

export const PropertyDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const { status, data } = useAppSelector((state: RootState) => state.property);
  const [error, setError] = useState<Error | null>(null);
  const fetchCounter = useRef(0);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;
    if (status === "loading" || (data && data.data.length > 0)) {
      return;
    }

    if (fetchCounter.current > 0) {
      logger.debug(
        "PropertyDataProvider",
        "Skipping data fetch - already fetched"
      );
      return;
    }

    fetchCounter.current++;
    logger.debug("PropertyDataProvider", "Starting data load process", {
      status,
    });

    const loadData = async () => {
      logger.debug("PropertyDataProvider", "Initializing data");
      try {
        // try to load from cache (indexedDB) into redux, though it might be empty
        await dispatch(loadPropertyDataFromCache()).unwrap();
        // so now loaded into redux, confirm that the cache was fresh
        const { data, isFresh } = await indexedDBService.getPropertyData();
        // if no then fetch fresh data
        if (!data || !isFresh) {
          if (status === "idle") {
            logger.info("PropertyDataProvider", "Fetching fresh data");
            await dispatch(fetchPropertyData({})).unwrap();
          }
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch property data")
        );
        console.error("Failed to fetch property data:", err);
      }
    };

    loadData();

    // Don't reset fetchCounter on unmount to prevent refetching
  }, [dispatch, status, data]);

  const clearData = async () => {
    try {
      await dispatch(clearPropertyData()).unwrap();
      // Note: We're not clearing IndexedDB data on logout to allow quick recovery
      logger.info("PropertyDataProvider", "Property data cleared from Redux");
    } catch (err) {
      logger.error("PropertyDataProvider", "Error clearing property data", err);
      throw err;
    }
  };

  const contextValue: PropertyContextValue = {
    isLoading: status === "loading",
    error,
    data,
    clearData,
  };

  return (
    <PropertyDataContext.Provider value={contextValue}>
      {children}
    </PropertyDataContext.Provider>
  );
};

export const usePropertyData = () => {
  const context = useContext(PropertyDataContext);
  if (context === undefined) {
    throw new Error(
      "usePropertyData must be used within a PropertyDataProvider"
    );
  }
  return context;
};
