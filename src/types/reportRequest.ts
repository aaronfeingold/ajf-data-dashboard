// SQL Query Rule structure
interface ReportQueryRule {
  id: string;
  field: string;
  type: string;
  input: string;
  operator: string;
  value: number | number[] | string | string[];
}
interface ReportQueryConfig {
  condition: "AND" | "OR";
  rules: ReportQueryRule[];
  valid: boolean;
  parcelNumber: string;
  maxNumberOfPeers: string;
  maxDistanceKm: string;
}

enum ReportRequestStatus {
  PENDING = "pending",
  COMPLETED = "complete",
  FAILED = "failed",
}
// Individual report request item
interface ReportRequest {
  id: number;
  sourceParcelNumber: number;
  sql: string | null; // This is a stringified ReportQueryConfig if any
  status: ReportRequestStatus;
  maxNumberOfPeers: number;
  maxDistanceKm: number;
  created: string;
  updated: string;
}

// Utility type for working with parsed SQL
type ReportRequestWithParsedConfig = Omit<ReportRequest, "sql"> & {
  sql: ReportQueryConfig;
};

export type {
  ReportRequest,
  ReportQueryConfig,
  ReportQueryRule,
  ReportRequestWithParsedConfig,
};

export { ReportRequestStatus };
