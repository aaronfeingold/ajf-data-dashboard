"use client";

import { createSelector } from "@reduxjs/toolkit";
import type { AdvancedSearchForm } from "@/types/search";
import type { GetAllPropertyRecordCards } from "@/types/api";
import { selectAllProperties } from "@/store/propertySlice";

// Helper function to check if a value is within a range
const isInRange = (value: number, min: number, max: number): boolean => {
  const minNum = min ? min : -Infinity;
  const maxNum = max ? max : Infinity;
  return value >= minNum && value <= maxNum;
};

// Create a selector for advanced search
export const selectAdvancedSearchResults = createSelector(
  [
    selectAllProperties,
    (_, searchCriteria: AdvancedSearchForm) => searchCriteria,
  ],
  (selection, criteria): GetAllPropertyRecordCards => {
    let count = 0;
    return {
      count: count,
      data: selection.data.filter((property) => {
        // Include all simple search criteria
        if (
          criteria.parcelNumber &&
          property.parcelNumber !== criteria.parcelNumber
        ) {
          return false;
        }

        if (
          criteria.propertyClassCode &&
          property.propertyClassCode !== criteria.propertyClassCode
        ) {
          return false;
        }

        if (
          !isInRange(
            parseInt(property.pricePerSf),
            criteria.pricePerSfMin ?? -Infinity,
            criteria.pricePerSfMax ?? Infinity
          )
        ) {
          return false;
        }

        if (
          !isInRange(
            property.totalSf,
            criteria.totalSfMin ?? -Infinity,
            criteria.totalSfMax ?? Infinity
          )
        ) {
          return false;
        }

        // Advanced search specific criteria
        if (
          !isInRange(
            property.acreage,
            criteria.acreageMin ?? -Infinity,
            criteria.acreageMax ?? Infinity
          )
        ) {
          return false;
        }

        if (
          !isInRange(
            parseInt(property.mostRecentValuation),
            criteria.valuationMin ?? -Infinity,
            criteria.valuationMax ?? Infinity
          )
        ) {
          return false;
        }

        if (criteria.excludePtaboa && property.mostRecentPtaboaDate) {
          return false;
        }
        count += 1;

        return true;
      }),
    };
  }
);
