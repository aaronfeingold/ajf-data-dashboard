"use client";

import { Report, PropertyComparison } from "../types/report";

export interface ParsedReport {
  comparableProperties: PropertyComparison[];
  latestComparable: PropertyComparison;
}

export const parsePropertyComparison = (report: Report): ParsedReport => {
  try {
    // Parse the JSON string from the result
    if (!report.result) {
      throw new Error("Report result is undefined");
    }
    const comparableProperties: PropertyComparison[] = JSON.parse(
      report.result
    );

    // Get the most recent comparable (first in the array based on your data structure)
    const latestComparable = comparableProperties[0];

    return {
      comparableProperties,
      latestComparable,
    };
  } catch (error) {
    console.error("Error parsing report result:", error);
    throw new Error("Failed to parse report result");
  }
};
