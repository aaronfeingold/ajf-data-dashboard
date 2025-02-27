"use server";

import axios, { AxiosResponse, AxiosError } from "axios";

interface ApiError {
  detail: string;
}

function isApiError(error: unknown): error is AxiosError<ApiError> {
  return axios.isAxiosError(error);
}

const api = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function handleApiResponse<T>(
  apiCall: Promise<AxiosResponse<T>>
): Promise<T> {
  try {
    const { data } = await apiCall;
    return data;
  } catch (error) {
    if (isApiError(error)) {
      throw new Error(error.message || "API request failed");
    }
    throw error;
  }
}

export default api;
