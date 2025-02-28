"use client";

import React, { useState, Suspense, useEffect } from "react";
import SummaryWidget from "@/components/Dashboard/widgets/SummaryWidget";
import PropertyClassPieChart from "@/components/Dashboard/widgets/PropertyClassPieChart";
import GeolocationWidget from "@/components/Dashboard/widgets/GeolocationWidget";
import DataTableWidget from "@/components/Dashboard/widgets/DataTableWidget";
import TrendsWidget from "@/components/Dashboard/widgets/TrendsWidget";
import ContentLoading from "@/components/Loading/ContentLoading";
import { usePropertyData } from "@/components/Providers/PropertyDataProvider";
import { useAppSelector } from "@/store/hooks";
import { selectPropertyStatus } from "@/store/propertySlice";
import PageLoading from "@/components/Loading/PageLoading";
import GridLayout from "react-grid-layout";
import { WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { logger } from "@/utils/logger";

const ReactGridLayout = WidthProvider(GridLayout);

interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minH?: number;
  minW?: number;
  maxH?: number;
}

// Store original heights for restoration
const defaultHeights = {
  overview: 12,
  dataTable: 12,
  trends: 10,
};

// Minimum header height when collapsed
const COLLAPSED_HEIGHT = 2;

const initialLayout: LayoutItem[] = [
  {
    i: "overview",
    x: 0,
    y: 0,
    w: 12,
    h: defaultHeights.overview,
    minH: 6, // Ensure minimum height is sufficient
    minW: 6,
    maxH: 16, // Allow more height if needed
  },
  {
    i: "dataTable",
    x: 0,
    y: 8,
    w: 12,
    h: defaultHeights.dataTable,
    minH: 6,
    minW: 6,
  },
  {
    i: "trends",
    x: 0,
    y: 20,
    w: 12,
    h: defaultHeights.trends,
    minH: 6,
    minW: 6,
  },
];

// Widget wrapper component with Suspense
const WidgetWrapper = ({
  children,
  title,
  loadingMessage = "Loading widget...",
}: {
  children: React.ReactNode;
  title: string;
  loadingMessage?: string;
}) => (
  <Suspense
    fallback={
      <ContentLoading
        message={loadingMessage}
        size="small"
        containerClassName="h-full"
        title={title}
      />
    }
  >
    {children}
  </Suspense>
);

export default function DashboardPage() {
  const { isLoading } = usePropertyData();
  const status = useAppSelector(selectPropertyStatus);
  const [isEditMode, setIsEditMode] = useState(false);
  const [layout, setLayout] = useState<LayoutItem[]>(initialLayout);
  const [visibleSections, setVisibleSections] = useState({
    overview: true,
    trends: true,
    dataTable: true,
  });
  const [showDashboard, setShowDashboard] = useState(false);

  // Handle initial transition
  useEffect(() => {
    logger.debug("Dashboard", "Initial dashboard load, tracking transition", {
      isLoading,
      status,
    });

    // Always show dashboard after a maximum of 3 seconds, regardless of loading state
    const maxTransitionTime = setTimeout(() => {
      setShowDashboard(true);
    }, 3000);

    // If loading completes earlier, show dashboard
    if (!isLoading) {
      setShowDashboard(true);
      clearTimeout(maxTransitionTime);
    }

    return () => clearTimeout(maxTransitionTime);
  }, [isLoading, status]);

  const toggleSection = (section: keyof typeof visibleSections) => {
    setVisibleSections((prev) => {
      const newState = { ...prev, [section]: !prev[section] };

      // Update layout with new heights
      const newLayout = layout.map((item) => {
        if (item.i === section) {
          return {
            ...item,
            h: newState[section] ? defaultHeights[section] : COLLAPSED_HEIGHT,
            minH: newState[section] ? item.minH : COLLAPSED_HEIGHT,
          };
        }
        return item;
      });

      setLayout(newLayout);
      return newState;
    });
  };

  const onLayoutChange = (newLayout: LayoutItem[]) => {
    if (isEditMode) {
      // Update default heights if in edit mode
      newLayout.forEach((item) => {
        if (visibleSections[item.i as keyof typeof visibleSections]) {
          defaultHeights[item.i as keyof typeof defaultHeights] = item.h;
        }
      });
      setLayout(newLayout);
    }
  };

  // Common container styles
  const containerStyles = `
    bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden
    ${
      isEditMode
        ? "border-2 border-dashed border-blue-300 hover:border-blue-500 transition-colors duration-200"
        : ""
    }
  `;

  // Common header styles including drag handle indicator
  const headerStyles = `
    flex justify-between items-center p-4
    ${isEditMode ? "cursor-move bg-gray-50 dark:bg-gray-700 rounded" : ""}
  `;

  if (!showDashboard) {
    return <PageLoading message="Loading dashboard..." />;
  }

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className={`
            px-4 py-2 rounded-lg font-medium
            ${
              isEditMode
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
            }
            transition-colors duration-200
          `}
        >
          {isEditMode ? "Save Layout" : "Edit Layout"}
        </button>
      </div>

      <ReactGridLayout
        className="layout"
        layout={layout}
        onLayoutChange={onLayoutChange}
        cols={12}
        rowHeight={50}
        width={1200}
        isDraggable={isEditMode}
        isResizable={isEditMode}
        draggableHandle=".drag-handle"
        resizeHandles={["se", "sw", "ne", "nw", "e", "w", "s", "n"]}
        margin={[16, 16]}
      >
        {/* Overview Container */}
        <div key="overview" className={containerStyles}>
          <div className={`${headerStyles} drag-handle`}>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              {isEditMode && (
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
              Overview
            </h2>
            <button
              onClick={() => toggleSection("overview")}
              className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
            >
              {visibleSections.overview ? "Hide" : "Show"}
            </button>
          </div>
          {visibleSections.overview && (
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                <WidgetWrapper
                  title="Summary"
                  loadingMessage="Loading summary data..."
                >
                  <SummaryWidget />
                </WidgetWrapper>
                <WidgetWrapper
                  title="Property Classes"
                  loadingMessage="Loading property classes..."
                >
                  <PropertyClassPieChart />
                </WidgetWrapper>
                <WidgetWrapper
                  title="Geolocation"
                  loadingMessage="Loading geolocation data..."
                >
                  <GeolocationWidget />
                </WidgetWrapper>
              </div>
            </div>
          )}
        </div>

        {/* Trends Container */}
        <div key="trends" className={containerStyles}>
          <div className={`${headerStyles} drag-handle`}>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              {isEditMode && (
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
              Trends
            </h2>
            <button
              onClick={() => toggleSection("trends")}
              className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
            >
              {visibleSections.trends ? "Hide" : "Show"}
            </button>
          </div>
          {visibleSections.trends && (
            <div className="p-4 h-full overflow-auto">
              <WidgetWrapper
                title="Trends"
                loadingMessage="Loading trends data..."
              >
                <TrendsWidget />
              </WidgetWrapper>
            </div>
          )}
        </div>

        {/* Data Table Container */}
        <div key="dataTable" className={containerStyles}>
          <div className={`${headerStyles} drag-handle`}>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              {isEditMode && (
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
              Data Table
            </h2>
            <button
              onClick={() => toggleSection("dataTable")}
              className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
            >
              {visibleSections.dataTable ? "Hide" : "Show"}
            </button>
          </div>
          {visibleSections.dataTable && (
            <div className="flex-1 h-[calc(100%-4rem)] overflow-hidden">
              <WidgetWrapper
                title="Data Table"
                loadingMessage="Loading property data..."
              >
                <DataTableWidget />
              </WidgetWrapper>
            </div>
          )}
        </div>
      </ReactGridLayout>
    </div>
  );
}
