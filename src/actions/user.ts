import { USERS } from "@/app/api/endpoints";
import {
  PaginationParams,
  GetUsersResponse,
  GetAllUserRecordCards,
} from "@/types/api";
import type { User } from "@/types/user";
import api, { handleApiResponse } from "@/app/api/axios";

// TODO DEPRECATE IF UNUSED
export const updatePassword = async (
  token: string,
  username: string
): Promise<string> => {
  return handleApiResponse(
    api.patch(USERS, {
      token,
      username,
    })
  );
};

export const getUserRecordCards = async ({
  page_size = 1000,
  page = 1,
  ...params
}: PaginationParams = {}): Promise<GetUsersResponse> => {
  return handleApiResponse(
    api.get(USERS, {
      params: {
        page_size,
        page,
        ...params,
      },
    })
  );
};

export const getAllUserRecordCards = async (
  page_size = 100,
  additionalParams: Record<string, unknown> = {}
): Promise<GetAllUserRecordCards> => {
  const data: User[] = [];
  let page = 1;
  let count = 0;

  while (true) {
    const response = await getUserRecordCards({
      page_size,
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

export const getUserById = async (id: number): Promise<User> => {
  return handleApiResponse(api.get(`${USERS}${id}`));
};

// TODO: AWAIT API IMPLEMENTATION
// createUser(data)
// updateUser(id, data)
// deleteUser(username)
