import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { PaginatedResponse } from "@/interfaces/pagination.interfaces";
import type {
  CreatePublicTipPayload,
  Tip,
  TipsQuery,
} from "@/features/tips/interfaces/tips.interfaces";

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
): Promise<PaginatedResponse<Tip>> => {
  try {
    const response = await axiosInstance.get<PaginatedResponse<Tip>>(
      ApiRoutes.employees.tips(employeeId),
      { params: query },
    );
    return response.data;
  } catch {
    throw new Error("Failed to load employee tips. Please try again.");
  }
};

export const createPublicTip = async (
  payload: CreatePublicTipPayload,
): Promise<Tip> => {
  try {
    const response = await axiosInstance.post<Tip>(
      ApiRoutes.public.tips,
      payload,
    );
    return response.data;
  } catch {
    throw new Error("Failed to submit tip. Please try again.");
  }
};
