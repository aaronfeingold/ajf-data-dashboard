import api, { handleApiResponse } from "@/app/api/axios";
import { PROPERTY_RECORD_CARDS } from "@/app/api/endpoints";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { handleRouteError } from "@/app/api/util";
import type { GetPropertyRecordCardsListResponse } from "@/types/api";
import { camelizeKeys } from "humps";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const pageSize = url.searchParams.get("pageSize");
  const page = url.searchParams.get("page");

  const cookieStore = await cookies();
  const authToken = cookieStore.get("authToken")?.value;

  if (!authToken) {
    throw new Error("Authentication token is missing");
  }

  try {
    const response = await handleApiResponse(
      api.get<GetPropertyRecordCardsListResponse>(PROPERTY_RECORD_CARDS, {
        params: {
          page_size: pageSize,
          page,
        },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
    );

    return NextResponse.json(camelizeKeys(response));
  } catch (error) {
    return handleRouteError(error);
  }
}
