"use client";

import React, { useEffect, useState } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import ReportRequestsListWidget from "./ReportRequestsListWidget";
import NewReportRequestWidget from "./NewReportRequestWidget";
import { useAppDispatch } from "@/store/hooks";
import { fetchReports } from "@/store/reportSlice";
import { fetchReportRequests } from "@/store/reportRequestSlice";
import GridLayout from "react-grid-layout";
// TODO: USE THE RESPONSE GRID INSTEAD
import { WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

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
  createNewReportRequest: 16,
  reportRequestList: 20,
};

// Minimum header height when collapsed
const COLLAPSED_HEIGHT = 2;

const initialLayout: LayoutItem[] = [
  {
    i: "createNewReportRequest",
    x: 0,
    y: 0,
    w: 12,
    h: defaultHeights.createNewReportRequest,
    minH: 6,
    minW: 6,
  },
  {
    i: "reportRequestList",
    x: 0,
    y: 16,
    w: 12,
    h: defaultHeights.reportRequestList,
    minH: 8,
    minW: 6,
    maxH: 16,
  },
];

export default function ReportsDashboardPage() {
  const dispatch = useAppDispatch();
  const [isEditMode, setIsEditMode] = useState(false);
  const [layout, setLayout] = useState<LayoutItem[]>(initialLayout);
  const [visibleSections, setVisibleSections] = useState({
    createNewReportRequest: true,
    reportRequestList: true,
  });

  useEffect(() => {
    dispatch(fetchReports());
    dispatch(fetchReportRequests());
  }, [dispatch]);

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

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Reports Dashboard
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
        <div key="reportRequestList" className={containerStyles}>
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
              Check Report Request Status
            </h2>
            <button
              onClick={() => toggleSection("reportRequestList")}
              className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
            >
              {visibleSections.reportRequestList ? "Hide" : "Show"}
            </button>
          </div>
          {visibleSections.reportRequestList && (
            <div className="p-4 h-full overflow-auto">
              <ReportRequestsListWidget />
            </div>
          )}
        </div>

        <div key="createNewReportRequest" className={containerStyles}>
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
              Create New Report Request
            </h2>
            <button
              onClick={() => toggleSection("createNewReportRequest")}
              className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
            >
              {visibleSections.createNewReportRequest ? "Hide" : "Show"}
            </button>
          </div>
          {visibleSections.createNewReportRequest && (
            <div className="p-4 h-full overflow-auto">
              <NewReportRequestWidget />
            </div>
          )}
        </div>
      </ReactGridLayout>
    </div>
  );
}
