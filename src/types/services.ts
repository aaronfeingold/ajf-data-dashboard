import { DBSchema } from "idb";
import { GetAllPropertyRecordCards } from "@/types";

export interface PropertyDBSchema extends DBSchema {
  propertyStore: {
    key: string;
    value: {
      data: GetAllPropertyRecordCards;
      timestamp: number;
    };
  };
}
