import { tr } from "@/lib/i18n-runtime";
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
import { getErrorMessage as getApiErrorMessage } from "@/lib/api-error";

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
  } catch (error) {
    throw new Error(getApiErrorMessage(error, tr("errors.services.loadRefunds")));
  }
};

export const getRefund = async (id: string): Promise<Refund> => {
  try {
    const response = await axiosInstance.get<Refund>(ApiRoutes.refunds.byId(id));
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, tr("errors.services.loadRefund")));
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
      getApiErrorMessage(error, tr("errors.services.requestRefund")),
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
      getApiErrorMessage(error, tr("errors.services.requestARefund")),
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
      getApiErrorMessage(error, tr("errors.services.updateRefund")),
    );
  }
};
