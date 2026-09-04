import { isAxiosError } from "axios";
import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { PaginatedResponse } from "@/interfaces/pagination.interfaces";
import type {
  AdminPayoutsQuery,
  DistributionsQuery,
  DistributionsResponse,
  Payout,
  PayoutDetail,
  PayoutPreview,
  PayoutsQuery,
  RunPayoutPayload,
  RunPayoutResponse,
} from "@/features/payouts/interfaces/payouts.interfaces";

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

export const listStorePayouts = async (
  storeId: string,
  query?: PayoutsQuery,
): Promise<PaginatedResponse<Payout>> => {
  try {
    const response = await axiosInstance.get<PaginatedResponse<Payout>>(
      ApiRoutes.stores.payouts(storeId),
      { params: query },
    );
    return response.data;
  } catch {
    throw new Error("Failed to load payouts. Please try again.");
  }
};

export const listEmployeePayouts = async (
  employeeId: string,
  query?: PayoutsQuery,
): Promise<PaginatedResponse<Payout>> => {
  try {
    const response = await axiosInstance.get<PaginatedResponse<Payout>>(
      ApiRoutes.employees.payouts(employeeId),
      { params: query },
    );
    return response.data;
  } catch {
    throw new Error("Failed to load payouts. Please try again.");
  }
};

export const listStoreDistributions = async (
  storeId: string,
  query?: DistributionsQuery,
): Promise<DistributionsResponse> => {
  try {
    const response = await axiosInstance.get<DistributionsResponse>(
      ApiRoutes.stores.distributions(storeId),
      { params: query },
    );
    return response.data;
  } catch {
    throw new Error("Failed to load distributions. Please try again.");
  }
};

export const listAdminPayouts = async (
  query?: AdminPayoutsQuery,
): Promise<PaginatedResponse<Payout>> => {
  try {
    const response = await axiosInstance.get<PaginatedResponse<Payout>>(
      ApiRoutes.admin.payouts.prefix,
      { params: query },
    );
    return response.data;
  } catch {
    throw new Error("Failed to load payouts. Please try again.");
  }
};

export const getAdminPayout = async (id: string): Promise<PayoutDetail> => {
  try {
    const response = await axiosInstance.get<PayoutDetail>(
      ApiRoutes.admin.payouts.byId(id),
    );
    return response.data;
  } catch {
    throw new Error("Failed to load payout. Please try again.");
  }
};

export const previewStorePayouts = async (
  storeId: string,
): Promise<PayoutPreview> => {
  try {
    const response = await axiosInstance.get<PayoutPreview>(
      ApiRoutes.stores.payoutsPreview(storeId),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to load payout preview. Please try again."),
    );
  }
};

export const runStorePayouts = async (
  storeId: string,
  payload: RunPayoutPayload,
): Promise<RunPayoutResponse> => {
  try {
    const response = await axiosInstance.post<RunPayoutResponse>(
      ApiRoutes.stores.payoutsRun(storeId),
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to run payouts. Please try again."),
    );
  }
};
