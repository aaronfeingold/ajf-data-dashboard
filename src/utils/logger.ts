"use client";

import type { GetAllPropertyRecordCards } from "@/types/api";

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  timestamp: number;
  level: LogLevel;
  context: string;
  message: string;
  data?: unknown;
}

class DebugLogger {
  private static instance: DebugLogger;
  private logs: LogEntry[] = [];
  private isEnabled: boolean;

  private constructor() {
    this.isEnabled =
      process.env.NODE_ENV !== "production" ||
      !!process.env.NEXT_PUBLIC_ENABLE_LOGGING;
  }

  static getInstance(): DebugLogger {
    if (!DebugLogger.instance) {
      DebugLogger.instance = new DebugLogger();
    }
    return DebugLogger.instance;
  }

  private log(
    level: LogLevel,
    context: string,
    message: string,
    data?: unknown
  ) {
    if (!this.isEnabled) return;

    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      context,
      message,
      data,
    };

    this.logs.push(entry);

    const logFn = console[level] || console.log;
    logFn(`[${context}] ${message}`, data ? data : "");
  }

  info(context: string, message: string, data?: unknown) {
    this.log("info", context, message, data);
  }

  warn(context: string, message: string, data?: unknown) {
    this.log("warn", context, message, data);
  }

  error(context: string, message: string, data?: unknown) {
    this.log("error", context, message, data);
  }

  debug(context: string, message: string, data?: unknown) {
    this.log("debug", context, message, data);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = DebugLogger.getInstance();

export const useDebugRender = (componentName: string) => {
  logger.debug("Component", `${componentName} rendered`);
};

// Utility to check data validity
export const validatePropertyData = (data: GetAllPropertyRecordCards) => {
  if (!data) {
    logger.warn("DataValidation", "Property data is null or undefined");
    return false;
  }

  if (!Array.isArray(data.data)) {
    logger.warn("DataValidation", "Property data.data is not an array");
    return false;
  }

  return true;
};
