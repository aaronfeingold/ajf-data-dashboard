"use client";

import { Middleware, MiddlewareAPI, Dispatch, Action } from "@reduxjs/toolkit";
import { logger } from "@/utils/logger";
import type { RootState } from "@/store/store";
import { LoggerMiddlewareConfig } from "@/types/";


const defaultConfig: LoggerMiddlewareConfig = {
  logLevel: {
    development: ["info", "warn", "error", "debug"],
    production: ["error", "warn"],
  },
  ignoredActions: [
    "persist/PERSIST",
    "persist/REHYDRATE",
    "persist/FLUSH",
    "persist/PURGE",
    "persist/PAUSE",
    "persist/REGISTER",
  ],
  maxPayloadSize: 10000,
  logStateDiff: true,
};

export const createLoggerMiddleware = (
  config: Partial<LoggerMiddlewareConfig> = {}
): Middleware => {
  const finalConfig = { ...defaultConfig, ...config };
  const isDev = process.env.NODE_ENV !== "production";

  const shouldLogAction = (actionType: string): boolean => {
    return !finalConfig.ignoredActions?.includes(actionType);
  };

  const truncatePayload = (payload: unknown): unknown => {
    if (!payload) return payload;
    const stringified = JSON.stringify(payload);
    if (stringified.length <= (finalConfig.maxPayloadSize || 0)) return payload;
    return {
      _truncated: true,
      preview: stringified.slice(0, finalConfig.maxPayloadSize) + "...",
      originalSize: stringified.length,
    };
  };

  // Function to compute state differences
  const getStateDiff = (prevState: RootState, nextState: RootState) => {
    const diff: Record<string, { before: unknown; after: unknown }> = {};

    Object.keys(nextState).forEach((key) => {
      if (
        prevState[key as keyof RootState] !== nextState[key as keyof RootState]
      ) {
        diff[key] = {
          before: prevState[key as keyof RootState],
          after: nextState[key as keyof RootState],
        };
      }
    });

    return Object.keys(diff).length ? diff : null;
  };

  return ((api: MiddlewareAPI) =>
    (next: Dispatch) =>
    <A extends Action>(action: A) => {
      if (!shouldLogAction(action.type)) {
        return next(action);
      }

      const startTime = performance.now();
      const prevState = api.getState();

      try {
        // Log action dispatch
        if (isDev) {
          logger.info(
            "Redux",
            `Action Dispatched: ${action.type}`,
            truncatePayload("payload" in action ? action.payload : undefined)
          );
        }

        // Call next middleware/reducer
        const result = next(action);

        const endTime = performance.now();
        const duration = endTime - startTime;
        const nextState = api.getState();

        // Log results based on environment
        if (isDev) {
          if (finalConfig.logStateDiff) {
            const diff = getStateDiff(prevState, nextState);
            if (diff) {
              logger.debug("Redux", `State changes for ${action.type}`, diff);
            }
          }

          logger.info("Redux", `Action ${action.type} completed`, {
            duration: `${duration.toFixed(2)}ms`,
            timestamp: new Date().toISOString(),
          });
        } else if (duration > 1000) {
          // In production, only log slow actions
          logger.warn("Redux", `Slow action detected: ${action.type}`, {
            duration: `${duration.toFixed(2)}ms`,
          });
        }

        return result;
      } catch (error) {
        // Always log errors in both dev and prod
        logger.error("Redux", `Error in action ${action.type}`, {
          error,
          state: prevState,
          action: truncatePayload(action),
        });
        throw error;
      }
    }) as Middleware;
};
