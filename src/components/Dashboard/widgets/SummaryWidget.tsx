"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import { usePropertyData } from "@/components/Providers/PropertyDataProvider";
import { logger, validatePropertyData } from "@/utils/logger";

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon?: React.ReactNode;
}

interface StatCardConfig {
  title: string;
  value: () => string;
  change?: number;
}

// Function to create stat card configurations
const createStatCardConfigs = (summary: {
  totalParcels: number;
  avgLandValue: number;
  avgImprovementValue: number;
  avgTotalValue: number;
  avgSquareFeet: number;
  avgPricePerSF: number;
}): StatCardConfig[] => [
  {
    title: "Total Parcels",
    value: () => summary.totalParcels.toString(),
    change: 2.5,
  },
  {
    title: "Avg Land Value",
    value: () =>
      `$${summary.avgLandValue.toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })}`,
    change: -1.2,
  },
  {
    title: "Avg Improvement Value",
    value: () =>
      `$${summary.avgImprovementValue.toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })}`,
    change: 3.8,
  },
  {
    title: "Avg Total Value",
    value: () =>
      `$${summary.avgTotalValue.toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })}`,
    change: 1.5,
  },
  {
    title: "Avg Square Feet",
    value: () =>
      `${summary.avgSquareFeet.toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })} SF`,
  },
  {
    title: "Avg $ per SF",
    value: () =>
      `$${summary.avgPricePerSF.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })}`,
  },
];

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <h4 className="text-2xl font-semibold mt-1">{value}</h4>
      </div>
      {icon && <div className="text-gray-400">{icon}</div>}
    </div>
    {typeof change !== "undefined" && (
      <div className="mt-2 flex items-center">
        {change >= 0 ? (
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
        )}
        <span
          className={`text-sm ${
            change >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {Math.abs(change)}% from last month
        </span>
      </div>
    )}
  </div>
);

interface SummaryStats {
  totalParcels: number;
  avgLandValue: number;
  avgImprovementValue: number;
  avgTotalValue: number;
  avgSquareFeet: number;
  avgPricePerSF: number;
}

// Custom hook for summary calculations
const useSummaryStats = (): SummaryStats | null => {
  return useAppSelector((state: RootState) => {
    const { data } = state.property.data;
    const status = state.property.status;

    logger.debug("useSummaryData", "Selector called", {
      status: status,
      dataLength: state.property.data?.data?.length,
    });

    if (!validatePropertyData(state.property.data)) {
      logger.warn("useSummaryData", "Invalid data structure");
      return null;
    }

    if (status !== "succeeded") {
      logger.debug("useSummaryData", "Data not ready - status not succeeded");
      return null;
    }

    const totalParcels = data.length;
    const avgLandValue =
      data.reduce(
        (acc, cur) => acc + parseInt(cur.mostRecentValuation) * 0.3,
        0
      ) / totalParcels;
    const avgImprovementValue =
      data.reduce(
        (acc, cur) => acc + parseInt(cur.mostRecentValuation) * 0.4,
        0
      ) / totalParcels;
    const avgTotalValue =
      data.reduce((acc, cur) => acc + parseInt(cur.mostRecentValuation), 0) /
      totalParcels;
    const avgSquareFeet =
      data.reduce((acc, cur) => acc + cur.totalSf, 0) / totalParcels;
    const avgPricePerSF =
      data.reduce((acc, cur) => acc + parseInt(cur.pricePerSf), 0) /
      totalParcels;

    return {
      totalParcels,
      avgLandValue,
      avgImprovementValue,
      avgTotalValue,
      avgSquareFeet,
      avgPricePerSF,
    };
  });
};

export default function SummaryWidget() {
  const { isLoading } = usePropertyData();

  const summary = useSummaryStats();

  if (isLoading || !summary) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  const statCardConfigs = createStatCardConfigs(summary);

  return (
    <div className="h-full overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white/50 dark:bg-gray-800/50">
      <div className="border-b border-gray-700 pb-4 mb-4">
        <h2 className="text-lg font-semibold text-white">Summary Statistics</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {statCardConfigs.map((config) => (
          <StatCard
            key={config.title}
            title={config.title}
            value={config.value()}
            change={config.change}
          />
        ))}
      </div>
    </div>
  );
}
