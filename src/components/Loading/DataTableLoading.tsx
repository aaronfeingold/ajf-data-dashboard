"use client";

import React from 'react';

const DataTableLoading = () => (
  <div className="flex flex-col items-center justify-center h-64 w-full">
    <div className="relative w-32 h-32">
      {/* Animated loading ring */}
      <div className="absolute inset-0 border-8 border-gray-200 dark:border-gray-700 rounded-full" />
      <div className="absolute inset-0 border-8 border-t-blue-500 rounded-full animate-spin" />

      {/* Temporary animated paper icon in the center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          className="w-12 h-12 text-blue-500 animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
    </div>
    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 animate-pulse">
      Loading your data...
    </p>
  </div>
);


export default DataTableLoading;
