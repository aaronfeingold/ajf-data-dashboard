"use client";

import { useAppSelector } from "@/store/hooks";
import { logger, validatePropertyData } from "@/utils/logger";

export const useSummaryData = () => {
  return useAppSelector((state) => {
    logger.debug("useSummaryData", "Selector called", {
      status: state.property.status,
      dataLength: state.property.data?.data?.length,
    });

    if (!validatePropertyData(state.property.data)) {
      logger.warn("useSummaryData", "Invalid data structure");
      return null;
    }

    if (state.property.status !== "succeeded") {
      logger.debug("useSummaryData", "Data not ready - status not succeeded");
      return null;
    }
    return {
      data: state.property.data.data,
      totalParcels: state.property.data.count,
      avgLandValue:
        state.property.data.data.reduce(
          (acc, item) => acc + parseInt(item.mostRecentValuation),
          0
        ) / state.property.data.count,
      avgTotalSf:
        state.property.data.data.reduce((acc, item) => acc + item.totalSf, 0) /
        state.property.data.count,
    };
  });
};

export const usePropertyClassData = () => {
  return useAppSelector((state) => {
    logger.debug("useSummaryData", "Selector called", {
      status: state.property.status,
      dataLength: state.property.data?.data?.length,
    });

    if (!validatePropertyData(state.property.data)) {
      logger.warn("useSummaryData", "Invalid data structure");
      return null;
    }

    if (state.property.status !== "succeeded") {
      logger.debug("useSummaryData", "Data not ready - status not succeeded");
      return null;
    }
    const classCounts = state.property.data.data.reduce((acc, item) => {
      acc[item.propertyClassCode] = (acc[item.propertyClassCode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      data: Object.entries(classCounts).map(([code, count]) => ({
        code,
        count,
        percentage: (count / state.property.data.count) * 100,
      })),
    };
  });
};

export const useGeolocationData = () => {
  return useAppSelector((state) => {
    logger.debug("useSummaryData", "Selector called", {
      status: state.property.status,
      dataLength: state.property.data?.data?.length,
    });

    if (!validatePropertyData(state.property.data)) {
      logger.warn("useSummaryData", "Invalid data structure");
      return null;
    }

    if (state.property.status !== "succeeded") {
      logger.debug("useSummaryData", "Data not ready - status not succeeded");
      return null;
    }
    return {
      locations: state.property.data.data.map((item) => ({
        city: item.propertyCity,
        coords: [0, 0],
      })),
    };
  });
};

export const useTrendsData = () => {
  return useAppSelector((state) => {
    logger.debug("useSummaryData", "Selector called", {
      status: state.property.status,
      dataLength: state.property.data?.data?.length,
    });

    if (!validatePropertyData(state.property.data)) {
      logger.warn("useSummaryData", "Invalid data structure");
      return null;
    }

    if (state.property.status !== "succeeded") {
      logger.debug("useSummaryData", "Data not ready - status not succeeded");
      return null;
    }
    const monthlyAverages = state.property.data.data.reduce((acc, item) => {
      const date = new Date(item.mostRecentPtaboaDate ?? "");
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

      if (!acc[monthYear]) {
        acc[monthYear] = { total: 0, count: 0 };
      }

      acc[monthYear].total += parseInt(item.mostRecentValuation);
      acc[monthYear].count += 1;

      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    return {
      trends: Object.entries(monthlyAverages).map(([date, data]) => ({
        date,
        avgValue: data.total / data.count,
      })),
    };
  });
};

// TODO: Deprecate if unused...seems useful though...
export const useTableData = () => {
  return useAppSelector((state) => ({
    data: state.property.data,
    isLoading: state.property.status === "loading",
    error: state.property.error,
  }));
};
