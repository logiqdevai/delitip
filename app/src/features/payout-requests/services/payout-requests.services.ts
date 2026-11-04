import { tr } from "@/lib/i18n-runtime";
import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
  AdminPayoutRequestDetail,
  AdminPayoutRequestsQuery,
  AdminPayoutRequestsResponse,
  CreatePayoutRequestPayload,
  InvoiceUrlResponse,
  PayoutRequest,
  PayoutRequestPreview,
  PayoutRequestsQuery,
  PayoutRequestsResponse,
  ReviewPayoutRequestPayload,
} from "@/features/payout-requests/interfaces/payout-requests.interfaces";
import { getErrorMessage as getApiErrorMessage } from "@/lib/api-error";

// The API explains *why* a request can't be submitted or approved (already
// open, tips refunded, no payout account…) — surface that instead of a
// generic message so the person can act on it.
export const getPayoutRequestPreview = async (
  storeId: string,
): Promise<PayoutRequestPreview> => {
  try {
    const response = await axiosInstance.get<PayoutRequestPreview>(
      ApiRoutes.stores.payoutRequestsPreview(storeId),
    );
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, tr("errors.services.loadThePayoutPreview")));
  }
};

export const createPayoutRequest = async (
  storeId: string,
  payload: CreatePayoutRequestPayload,
): Promise<PayoutRequest> => {
  try {
    const response = await axiosInstance.post<PayoutRequest>(
      ApiRoutes.stores.payoutRequests(storeId),
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, tr("errors.services.submitThePayoutRequest")));
  }
};

export const listStorePayoutRequests = async (
  storeId: string,
  query?: PayoutRequestsQuery,
): Promise<PayoutRequestsResponse> => {
  try {
    const response = await axiosInstance.get<PayoutRequestsResponse>(
      ApiRoutes.stores.payoutRequests(storeId),
      { params: query },
    );
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, tr("errors.services.loadPayoutRequests")));
  }
};

export const getStorePayoutRequestInvoiceUrl = async (
  storeId: string,
  id: string,
): Promise<InvoiceUrlResponse> => {
  try {
    const response = await axiosInstance.get<InvoiceUrlResponse>(
      ApiRoutes.stores.payoutRequestInvoiceUrl(storeId, id),
    );
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, tr("errors.services.openTheInvoice")));
  }
};

export const cancelPayoutRequest = async (
  storeId: string,
  id: string,
): Promise<PayoutRequest> => {
  try {
    const response = await axiosInstance.post<PayoutRequest>(
      ApiRoutes.stores.payoutRequestCancel(storeId, id),
    );
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, tr("errors.services.cancelThePayoutRequest")));
  }
};

export const listAdminPayoutRequests = async (
  query?: AdminPayoutRequestsQuery,
): Promise<AdminPayoutRequestsResponse> => {
  try {
    const response = await axiosInstance.get<AdminPayoutRequestsResponse>(
      ApiRoutes.admin.payoutRequests.prefix,
      { params: query },
    );
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, tr("errors.services.loadPayoutRequests")));
  }
};

export const getAdminPendingPayoutRequestCount = async (): Promise<number> => {
  try {
    const response = await axiosInstance.get<{ count: number }>(
      ApiRoutes.admin.payoutRequests.pendingCount,
    );
    return response.data.count;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, tr("errors.services.loadPendingRequestCount")));
  }
};

export const getAdminPayoutRequest = async (
  id: string,
): Promise<AdminPayoutRequestDetail> => {
  try {
    const response = await axiosInstance.get<AdminPayoutRequestDetail>(
      ApiRoutes.admin.payoutRequests.byId(id),
    );
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, tr("errors.services.loadThisPayoutRequest")));
  }
};

export const getAdminPayoutRequestInvoiceUrl = async (
  id: string,
): Promise<InvoiceUrlResponse> => {
  try {
    const response = await axiosInstance.get<InvoiceUrlResponse>(
      ApiRoutes.admin.payoutRequests.invoiceUrl(id),
    );
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, tr("errors.services.openTheInvoice")));
  }
};

export const approvePayoutRequest = async (
  id: string,
  payload: ReviewPayoutRequestPayload,
): Promise<AdminPayoutRequestDetail> => {
  try {
    const response = await axiosInstance.post<AdminPayoutRequestDetail>(
      ApiRoutes.admin.payoutRequests.approve(id),
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, tr("errors.services.approveThePayoutRequest")));
  }
};

export const rejectPayoutRequest = async (
  id: string,
  payload: { admin_note: string },
): Promise<AdminPayoutRequestDetail> => {
  try {
    const response = await axiosInstance.post<AdminPayoutRequestDetail>(
      ApiRoutes.admin.payoutRequests.reject(id),
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, tr("errors.services.rejectThePayoutRequest")));
  }
};

export const recheckPayoutRequest = async (
  id: string,
): Promise<AdminPayoutRequestDetail> => {
  try {
    const response = await axiosInstance.post<AdminPayoutRequestDetail>(
      ApiRoutes.admin.payoutRequests.recheck(id),
    );
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, tr("errors.services.reRunTheInvoiceCheck")));
  }
};
