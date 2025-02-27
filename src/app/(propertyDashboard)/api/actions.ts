import type { PropertyRecordCard } from "@/types/property";
import api, { handleApiResponse } from "@/app/api/axios";
import { PROPERTY_RECORD_CARDS } from "@/app/api/endpoints";


export const getPropertyRecordCardById = async (
  id: number
): Promise<PropertyRecordCard> => {
  return handleApiResponse(api.get(`${PROPERTY_RECORD_CARDS}${id}`));
};
