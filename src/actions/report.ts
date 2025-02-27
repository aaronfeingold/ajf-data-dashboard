import api, { handleApiResponse } from "@/app/api/axios";
import {
  PaginationParams,
  GetReportRecordsListResponse,
  GetAllReportRecordCards,
} from "@/types/api";
import type { Report } from "@/types/report";
import { REPORTS } from "@/app/api/endpoints";

export const getReportList = async ({
  pageSize = 1000,
  page = 1,
  ...params
}: PaginationParams = {}): Promise<GetReportRecordsListResponse> => {
  return handleApiResponse(
    api.get(REPORTS, {
      params: {
        pageSize,
        page,
        ...params,
      },
    })
  );
};

export const getAllReportRecordCards = async (
  pageSize = 500,
  additionalParams: Record<string, unknown> = {}
): Promise<GetAllReportRecordCards> => {
  const data: Report[] = [];
  let page = 1;
  let count = 0;

  while (true) {
    const response = await getReportList({
      pageSize,
      page,
      ...additionalParams,
    });
    if (!count) count = response.count;
    data.push(...response.results);

    if (!response.next) break;
    page++;
  }

  return {
    count,
    data,
    lastFetched: Date.now(),
  };
};

export async function getReportById(id: string): Promise<Report> {
  return handleApiResponse(api.get<Report>(`${REPORTS}${id}`));
}
// TODO: AWAITING API
// deleteReportByID()
