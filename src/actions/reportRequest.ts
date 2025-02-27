import api, { handleApiResponse } from "@/app/api/axios";
import type {
  PaginationParams,
  GetReportRequestListResponse,
  CreateNewReportRequestData,
  UpdateReportRequestData,
  GetAllReportRequestRecordCards,
} from "@/types/api";
import type { ReportRequest } from "@/types/reportRequest";
import { REPORT_REQUESTS } from "@/app/api/endpoints";

export const getReportRequestList = async ({
  pageSize = 1000,
  page = 1,
  ...params
}: PaginationParams = {}): Promise<GetReportRequestListResponse> => {
  return handleApiResponse(
    api.get(REPORT_REQUESTS, {
      params: {
        pageSize,
        page,
        ...params,
      },
    })
  );
};

export const getAllReportRequestRecordCards = async (
  pageSize = 500,
  additionalParams: Record<string, unknown> = {}
): Promise<GetAllReportRequestRecordCards> => {
  const data: ReportRequest[] = [];
  let page = 1;
  let count = 0;

  while (true) {
    const response = await getReportRequestList({
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

export async function getReportRequestById(id: string): Promise<ReportRequest> {
  return handleApiResponse(api.get<ReportRequest>(`${REPORT_REQUESTS}${id}`));
}

export async function createNewReportRequest(
  data: CreateNewReportRequestData
): Promise<ReportRequest> {
  return handleApiResponse(api.post<ReportRequest>(REPORT_REQUESTS, data));
}

export async function updateReportRequest(
  data: UpdateReportRequestData
): Promise<ReportRequest> {
  return handleApiResponse(api.post<ReportRequest>(REPORT_REQUESTS, data));
}

// TODO: AWAITING API
// deleteReportRequestByID()
// pollReportRequest()
// getReportRequestResults()
