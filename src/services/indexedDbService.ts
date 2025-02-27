"use client";

import { openDB, IDBPDatabase } from "idb";
import { logger } from "@/utils/logger";
import type { GetAllPropertyRecordCards, PropertyDBSchema } from "@/types";
import {
  DB_NAME,
  DB_VERSION,
  STORE_NAME,
  DATA_KEY,
  SIX_MONTHS_MS,
} from "@/lib/constants";

class IndexedDBService {
  private dbPromise: Promise<IDBPDatabase<PropertyDBSchema>> | null = null;

  // Initialize the database
  private async getDB(): Promise<IDBPDatabase<PropertyDBSchema>> {
    if (!this.dbPromise) {
      this.dbPromise = openDB<PropertyDBSchema>(DB_NAME, DB_VERSION, {
        upgrade(db) {
          // Create the object store if it doesn't exist
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
            logger.info("IndexedDBService", "Created property store");
          }
        },
        blocked() {
          logger.warn("IndexedDBService", "Database opening blocked");
        },
        blocking() {
          logger.warn(
            "IndexedDBService",
            "Database blocking other connections"
          );
        },
        terminated() {
          logger.warn("IndexedDBService", "Database connection terminated");
        },
      });
    }
    return this.dbPromise;
  }

  // Save property data to IndexedDB
  async savePropertyData(data: GetAllPropertyRecordCards): Promise<void> {
    try {
      const db = await this.getDB();
      await db.put(
        STORE_NAME,
        {
          data,
          timestamp: Date.now(),
        },
        DATA_KEY
      );
      logger.info("IndexedDBService", "Property data saved to IndexedDB");
    } catch (error) {
      logger.error("IndexedDBService", "Error saving property data", error);
      throw error;
    }
  }

  // Get property data from IndexedDB
  async getPropertyData(): Promise<{
    data: GetAllPropertyRecordCards | null;
    isFresh: boolean;
  }> {
    try {
      const db = await this.getDB();
      const result = await db.get(STORE_NAME, DATA_KEY);

      if (!result) {
        logger.info("IndexedDBService", "No property data found in IndexedDB");
        return { data: null, isFresh: false };
      }

      const now = Date.now();
      const isFresh = now - result.timestamp < SIX_MONTHS_MS;

      logger.info(
        "IndexedDBService",
        `Retrieved property data (${isFresh ? "fresh" : "stale"})`
      );

      return {
        data: result.data,
        isFresh,
      };
    } catch (error) {
      logger.error("IndexedDBService", "Error retrieving property data", error);
      return { data: null, isFresh: false };
    }
  }

  // Clear property data on logout
  async clearPropertyData(): Promise<void> {
    try {
      const db = await this.getDB();
      await db.delete(STORE_NAME, DATA_KEY);
      logger.info("IndexedDBService", "Property data cleared from IndexedDB");
    } catch (error) {
      logger.error("IndexedDBService", "Error clearing property data", error);
      throw error;
    }
  }
}

export const indexedDBService = new IndexedDBService();
