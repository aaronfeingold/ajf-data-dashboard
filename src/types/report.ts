// Individual property comparison in the result array
interface PropertyComparison {
  id: number;
  parcelNumber: number;
  propertyClassCode: number;
  propertyCity: string;
  ownerName: string;
  totalSf: number;
  mostRecentSaleDate: string;
  mostRecentSaleAmount: string;
  distance: string;
  totalValue2024: number;
  totalValue2023: string;
  valuePerSquareFoot: number;
  yoyChange: string;
  lastPtaboaDetermination: string | null;
  propertyStreetAddress: string;
}

// Individual report item
interface Report {
  id: number;
  reportRequest: number; // This is a foreign key to the ReportRequest, which can be modified
  // this is probably actually stored on the associated ReportRequest
  sourceParcelNumber: number;
  created: string;
  updated: string;
  // this might be coming back as an stringified array of PropertyComparison[]
  // if it comes back at all. if null, no results yet
  result?: string; // FiFo: The most recent version of the report is first in array
}

// Utility type for working with parsed results
type ReportWithParsedResults = Omit<Report, "result"> & {
  result: PropertyComparison[];
};

export type { Report, PropertyComparison, ReportWithParsedResults };
