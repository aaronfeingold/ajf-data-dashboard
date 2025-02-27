import type { Report } from "@/types/report";
import type { PropertyRecordCard } from "@/types/property";
import type { ReportRequest } from "@/types/reportRequest";
import type { User } from "@/types/user";
import type { Conversation, ConversationMessage } from "@/types/chat";

interface PaginationParams {
  pageSize?: number;
  page?: number;
  offset?: number;
  [key: string]: unknown;
}

interface BaseListResponse {
  count: number;
  next: string | null;
  previous: string | null;
}

interface BaseGetAllCards {
  count: number;
  lastFetched?: number;
}

/**
 * Auth
 */

interface LoginResponse {
  access: string;
  refresh: string;
}

/**
 * Property
 */

interface GetPropertyRecordCardsListResponse extends BaseListResponse {
  results: PropertyRecordCard[];
}

interface GetAllPropertyRecordCards extends BaseGetAllCards {
  data: PropertyRecordCard[];
}

/**
 * Users
 */

interface GetUsersResponse extends BaseListResponse {
  results: User[];
}

interface GetAllUserRecordCards extends BaseGetAllCards {
  data: User[];
}

/**
 * Reports
 */

interface GetReportRecordsListResponse extends BaseListResponse {
  results: Report[];
}
interface GetAllReportRecordCards extends BaseGetAllCards {
  data: Report[];
}

/**
 * Report Requests
 */

interface GetReportRequestListResponse extends BaseListResponse {
  results: ReportRequest[];
}

interface GetAllReportRequestRecordCards extends BaseGetAllCards {
  data: ReportRequest[];
}

interface CreateNewReportRequestData {
  source_parcel_number: number;
  sql: string;
  max_number_of_peers: number;
  max_distance_km: number;
}
interface UpdateReportRequestData extends CreateNewReportRequestData {
  id: number;
}

/**
 * Conversations and Conversation Messages
 */

interface GetAllConversationCards extends BaseGetAllCards {
  data: Conversation[];
}
interface GetAllConversationMessageCards extends BaseGetAllCards {
  data: ConversationMessage[];
}

export type {
  LoginResponse,
  PaginationParams,
  BaseListResponse,
  CreateNewReportRequestData,
  UpdateReportRequestData,
  GetPropertyRecordCardsListResponse,
  GetAllPropertyRecordCards,
  GetUsersResponse,
  GetAllUserRecordCards,
  GetAllReportRequestRecordCards,
  GetReportRecordsListResponse,
  GetAllReportRecordCards,
  GetReportRequestListResponse,
  GetAllConversationCards,
  GetAllConversationMessageCards,
};
