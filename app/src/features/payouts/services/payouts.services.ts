import { tr } from "@/lib/i18n-runtime";
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
  ManualPayoutPayload,
  ManualPayoutResponse,
  RunPayoutPayload,
  RunPayoutResponse,
} from "@/features/payouts/interfaces/payouts.interfaces";
import { getErrorMessage as getApiErrorMessage } from "@/lib/api-error";

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
  } catch (error) {
    throw new Error(getApiErrorMessage(error, tr("errors.services.loadPayouts")));
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
  } catch (error) {
    throw new Error(getApiErrorMessage(error, tr("errors.services.loadPayouts")));
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
  } catch (error) {
    throw new Error(getApiErrorMessage(error, tr("errors.services.loadDistributions")));
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
  } catch (error) {
    throw new Error(getApiErrorMessage(error, tr("errors.services.loadPayouts")));
  }
};

export const getAdminPayout = async (id: string): Promise<PayoutDetail> => {
  try {
    const response = await axiosInstance.get<PayoutDetail>(
      ApiRoutes.admin.payouts.byId(id),
    );
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, tr("errors.services.loadPayout")));
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
      getApiErrorMessage(error, tr("errors.services.loadPayoutPreview")),
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
      getApiErrorMessage(error, tr("errors.services.runPayouts")),
    );
  }
};

export const runManualPayouts = async (
  payload: ManualPayoutPayload,
): Promise<ManualPayoutResponse> => {
  try {
    const response = await axiosInstance.post<ManualPayoutResponse>(
      ApiRoutes.admin.payouts.manual,
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, tr("errors.services.runTheManualPayout")),
    );
  }
};
