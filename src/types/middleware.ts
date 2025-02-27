// Configuration options for the middleware
export interface LoggerMiddlewareConfig {
  // Log levels for different environments
  logLevel: {
    development: ("info" | "warn" | "error" | "debug")[];
    production: ("error" | "warn")[];
  };
  // Actions to ignore (optional)
  ignoredActions?: string[];
  // Maximum payload size to log (in chars, to prevent huge logs)
  maxPayloadSize?: number;
  // Whether to log the state diff
  logStateDiff?: boolean;
}
