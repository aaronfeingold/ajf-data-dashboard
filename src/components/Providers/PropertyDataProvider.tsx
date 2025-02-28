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
  selectPropertyStatus,
  selectAllProperties,
} from "@/store/propertySlice";
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
  const status = useAppSelector(selectPropertyStatus);
  const data = useAppSelector(selectAllProperties);
  const [error, setError] = useState<Error | null>(null);
  const fetchCounter = useRef(0);
  const isInitialized = useRef(false);
  const [initializationComplete, setInitializationComplete] = useState(false);
  const [transitionComplete, setTransitionComplete] = useState(false);

  // For a better UX with min/max transition times
  useEffect(() => {
    // Minimum transition time of 1 second
    const minTransitionTime = setTimeout(() => {
      logger.debug("PropertyDataProvider", "Minimum transition time reached");
    }, 1000);

    // Maximum transition time of 3 seconds
    const maxTransitionTime = setTimeout(() => {
      logger.debug(
        "PropertyDataProvider",
        "Maximum transition time reached, forcing completion"
      );
      setTransitionComplete(true);
      setInitializationComplete(true);
    }, 3000);

    return () => {
      clearTimeout(minTransitionTime);
      clearTimeout(maxTransitionTime);
    };
  }, []);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    if (status === "succeeded" && data && data.data.length > 0) {
      logger.debug(
        "PropertyDataProvider",
        "Data already loaded, skipping fetch"
      );
      setInitializationComplete(true);
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

        // Mark initialization as complete regardless of outcome
        setInitializationComplete(true);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch property data")
        );
        console.error("Failed to fetch property data:", err);
        // Still mark initialization as complete even with an error
        setInitializationComplete(true);
      }
    };

    loadData();

    // Don't reset fetchCounter on unmount to prevent refetching
  }, [dispatch, status, data]);

  // Monitor status changes to ensure we transition out of loading
  useEffect(() => {
    if (status === "succeeded") {
      setInitializationComplete(true);
    }
  }, [status]);

  // Keep track of how long we've been loading
  useEffect(() => {
    if (!transitionComplete) {
      const timeoutId = setTimeout(() => {
        setTransitionComplete(true);
      }, 1500); // Minimum 1.5s transition time

      return () => clearTimeout(timeoutId);
    }
  }, [transitionComplete]);

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

  // Calculate isLoading based on transition time and initialization
  // This ensures we have a nice minimum transition time for UX purposes
  // but we don't wait forever for data if it takes too long
  const isLoading = !transitionComplete;

  const contextValue: PropertyContextValue = {
    isLoading,
    error,
    data,
    clearData,
  };

  logger.debug("PropertyDataProvider", "Render state", {
    isLoading,
    status,
    hasData: data?.data.length > 0,
    initComplete: initializationComplete,
    transitionComplete,
  });

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
