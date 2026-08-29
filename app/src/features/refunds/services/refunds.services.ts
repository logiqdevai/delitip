import { isAxiosError } from "axios";
import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { PaginatedResponse } from "@/interfaces/pagination.interfaces";
import type {
  CreatePublicRefundRequestPayload,
  CreateRefundPayload,
  Refund,
  RefundsQuery,
  UpdateRefundPayload,
} from "@/features/refunds/interfaces/refunds.interfaces";

const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.length > 0) return message;
    if (Array.isArray(message) && typeof message[0] === "string") return message[0];
  }
  return fallback;
};

export const listRefunds = async (
  storeId: string,
  query?: RefundsQuery,
): Promise<PaginatedResponse<Refund>> => {
  try {
    const response = await axiosInstance.get<PaginatedResponse<Refund>>(
      ApiRoutes.stores.refunds(storeId),
      { params: query },
    );
    return response.data;
  } catch {
    throw new Error("Failed to load refunds. Please try again.");
  }
};

export const getRefund = async (id: string): Promise<Refund> => {
  try {
    const response = await axiosInstance.get<Refund>(ApiRoutes.refunds.byId(id));
    return response.data;
  } catch {
    throw new Error("Failed to load refund. Please try again.");
  }
};

export const createRefund = async (
  payload: CreateRefundPayload,
): Promise<Refund> => {
  try {
    const response = await axiosInstance.post<Refund>(
      ApiRoutes.refunds.prefix,
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to request refund. Please try again."),
    );
  }
};

export const createPublicRefundRequest = async (
  tipId: string,
  payload: CreatePublicRefundRequestPayload,
): Promise<Refund> => {
  try {
    const response = await axiosInstance.post<Refund>(
      ApiRoutes.public.tipRefundRequest(tipId),
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to request a refund. Please try again."),
    );
  }
};

export const updateRefund = async (
  id: string,
  payload: UpdateRefundPayload,
): Promise<Refund> => {
  try {
    const response = await axiosInstance.patch<Refund>(
      ApiRoutes.refunds.byId(id),
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to update refund. Please try again."),
    );
  }
};
