import { isAxiosError } from "axios";
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

// The API explains *why* a request can't be submitted or approved (already
// open, tips refunded, no payout account…) — surface that instead of a
// generic message so the person can act on it.
const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.length > 0) return message;
    if (Array.isArray(message) && typeof message[0] === "string") return message[0];
  }
  return fallback;
};

export const getPayoutRequestPreview = async (
  storeId: string,
): Promise<PayoutRequestPreview> => {
  try {
    const response = await axiosInstance.get<PayoutRequestPreview>(
      ApiRoutes.stores.payoutRequestsPreview(storeId),
    );
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to load the payout preview. Please try again."));
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
    throw new Error(getApiErrorMessage(error, "Failed to submit the payout request. Please try again."));
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
  } catch {
    throw new Error("Failed to load payout requests. Please try again.");
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
  } catch {
    throw new Error("Failed to open the invoice. Please try again.");
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
    throw new Error(getApiErrorMessage(error, "Failed to cancel the payout request. Please try again."));
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
  } catch {
    throw new Error("Failed to load payout requests. Please try again.");
  }
};

export const getAdminPendingPayoutRequestCount = async (): Promise<number> => {
  try {
    const response = await axiosInstance.get<{ count: number }>(
      ApiRoutes.admin.payoutRequests.pendingCount,
    );
    return response.data.count;
  } catch {
    throw new Error("Failed to load the pending request count.");
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
  } catch {
    throw new Error("Failed to load this payout request. Please try again.");
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
  } catch {
    throw new Error("Failed to open the invoice. Please try again.");
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
    throw new Error(getApiErrorMessage(error, "Failed to approve the payout request. Please try again."));
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
    throw new Error(getApiErrorMessage(error, "Failed to reject the payout request. Please try again."));
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
    throw new Error(getApiErrorMessage(error, "Failed to re-run the invoice check. Please try again."));
  }
};
