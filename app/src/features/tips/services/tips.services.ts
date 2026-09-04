import { isAxiosError } from "axios";
import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { PaginatedResponse } from "@/interfaces/pagination.interfaces";
import type {
  AdminTipsQuery,
  CreatePublicTipPayload,
  CreatePublicTipResponse,
  EmployeeTipDistribution,
  PublicTipOrderCodeLookup,
  PublicTipStatus,
  Tip,
  TipsExportQuery,
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

export const exportStoreTipsCsv = async (
  storeId: string,
  query?: TipsExportQuery,
): Promise<void> => {
  try {
    const response = await axiosInstance.get(ApiRoutes.stores.tipsExport(storeId), {
      params: query,
      responseType: "blob",
    });

    const disposition = response.headers["content-disposition"] as
      | string
      | undefined;
    const filenameMatch = disposition?.match(/filename="?([^"]+)"?/i);
    const filename =
      filenameMatch?.[1] ??
      `tips-${new Date().toISOString().slice(0, 10)}.csv`;

    const blob =
      response.data instanceof Blob
        ? response.data
        : new Blob([response.data], { type: "text/csv;charset=utf-8" });

    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    let message = getApiErrorMessage(
      error,
      "Failed to export tips. Please try again.",
    );
    if (isAxiosError(error) && error.response?.data instanceof Blob) {
      try {
        const text = await error.response.data.text();
        const parsed = JSON.parse(text) as { message?: string | string[] };
        if (typeof parsed.message === "string" && parsed.message.length > 0) {
          message = parsed.message;
        } else if (
          Array.isArray(parsed.message) &&
          typeof parsed.message[0] === "string"
        ) {
          message = parsed.message[0];
        }
      } catch {
        // keep fallback message
      }
    }
    throw new Error(message);
  }
};

export const listAdminTips = async (
  query?: AdminTipsQuery,
): Promise<PaginatedResponse<Tip>> => {
  try {
    const response = await axiosInstance.get<PaginatedResponse<Tip>>(
      ApiRoutes.admin.payments.prefix,
      { params: query },
    );
    return response.data;
  } catch {
    throw new Error("Failed to load payments. Please try again.");
  }
};

export const reconcilePayments = async (): Promise<{ corrected: number }> => {
  try {
    const response = await axiosInstance.post<{ corrected: number }>(
      ApiRoutes.admin.payments.reconcile,
    );
    return response.data;
  } catch {
    throw new Error("Failed to reconcile payments. Please try again.");
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

export const getPublicTipStatus = async (
  id: string,
): Promise<PublicTipStatus> => {
  const response = await axiosInstance.get<PublicTipStatus>(
    ApiRoutes.public.tipStatus(id),
  );
  return response.data;
};

export const getPublicTipByOrderCode = async (
  orderCode: string,
): Promise<PublicTipOrderCodeLookup | null> => {
  try {
    const response = await axiosInstance.get<PublicTipOrderCodeLookup>(
      ApiRoutes.public.tipByOrderCode(orderCode),
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw new Error("Failed to resolve this checkout. Please try again.");
  }
};
