import { isAxiosError } from "axios";
import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { PaginatedResponse } from "@/interfaces/pagination.interfaces";
import type {
  CreatePublicTipPayload,
  CreatePublicTipResponse,
  EmployeeTipDistribution,
  Tip,
  TipsQuery,
} from "@/features/tips/interfaces/tips.interfaces";

const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
    if (Array.isArray(message) && typeof message[0] === "string") {
      return message[0];
    }
  }
  return fallback;
};

export const listStoreTips = async (
  storeId: string,
  query?: TipsQuery,
): Promise<PaginatedResponse<Tip>> => {
  try {
    const response = await axiosInstance.get<PaginatedResponse<Tip>>(
      ApiRoutes.stores.tips(storeId),
      { params: query },
    );
    return response.data;
  } catch {
    throw new Error("Failed to load tips. Please try again.");
  }
};

export const getTip = async (id: string): Promise<Tip> => {
  try {
    const response = await axiosInstance.get<Tip>(ApiRoutes.tips.byId(id));
    return response.data;
  } catch {
    throw new Error("Failed to load tip. Please try again.");
  }
};

export const listEmployeeTips = async (
  employeeId: string,
  query?: TipsQuery,
): Promise<PaginatedResponse<EmployeeTipDistribution>> => {
  try {
    const response = await axiosInstance.get<
      PaginatedResponse<EmployeeTipDistribution>
    >(ApiRoutes.employees.tips(employeeId), { params: query });
    return response.data;
  } catch {
    throw new Error("Failed to load employee tips. Please try again.");
  }
};

export const createPublicTip = async (
  payload: CreatePublicTipPayload,
): Promise<CreatePublicTipResponse> => {
  try {
    const response = await axiosInstance.post<CreatePublicTipResponse>(
      ApiRoutes.public.tips,
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to submit tip. Please try again."),
    );
  }
};
