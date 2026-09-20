import { isAxiosError } from "axios";
import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { PaginatedResponse } from "@/interfaces/pagination.interfaces";
import type {
  CreateSettlementPayload,
  EmployeeBalancesResponse,
  EmployeeSettlementBalance,
  OwedDistribution,
  OwedDistributionsQuery,
  Settlement,
  SettlementAdjustment,
  SettlementBalancesQuery,
  SettlementsExportQuery,
  SettlementsQuery,
} from "@/features/settlements/interfaces/settlements.interfaces";

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

export const getStoreSettlementBalances = async (
  storeId: string,
  query?: SettlementBalancesQuery,
): Promise<EmployeeBalancesResponse> => {
  try {
    const response = await axiosInstance.get<EmployeeBalancesResponse>(
      ApiRoutes.stores.settlementBalances(storeId),
      { params: query },
    );
    return response.data;
  } catch {
    throw new Error("Failed to load staff balances. Please try again.");
  }
};

export const listOwedDistributions = async (
  storeId: string,
  query: OwedDistributionsQuery,
): Promise<PaginatedResponse<OwedDistribution> & { total_owed_amount: number }> => {
  try {
    const response = await axiosInstance.get<
      PaginatedResponse<OwedDistribution> & { total_owed_amount: number }
    >(ApiRoutes.stores.settlementOwedDistributions(storeId), { params: query });
    return response.data;
  } catch {
    throw new Error("Failed to load what's owed. Please try again.");
  }
};

export const listProposedAdjustments = async (
  storeId: string,
  employeeId: string,
): Promise<SettlementAdjustment[]> => {
  try {
    const response = await axiosInstance.get<SettlementAdjustment[]>(
      ApiRoutes.stores.settlementAdjustments(storeId),
      { params: { employee_id: employeeId } },
    );
    return response.data;
  } catch {
    throw new Error("Failed to load deductions. Please try again.");
  }
};

export const listStoreSettlements = async (
  storeId: string,
  query?: SettlementsQuery,
): Promise<PaginatedResponse<Settlement>> => {
  try {
    const response = await axiosInstance.get<PaginatedResponse<Settlement>>(
      ApiRoutes.stores.settlements(storeId),
      { params: query },
    );
    return response.data;
  } catch {
    throw new Error("Failed to load handovers. Please try again.");
  }
};

export const listEmployeeSettlements = async (
  employeeId: string,
  query?: SettlementsQuery,
): Promise<PaginatedResponse<Settlement>> => {
  try {
    const response = await axiosInstance.get<PaginatedResponse<Settlement>>(
      ApiRoutes.employees.settlements(employeeId),
      { params: query },
    );
    return response.data;
  } catch {
    throw new Error("Failed to load your payments. Please try again.");
  }
};

export const getEmployeeSettlementBalance = async (
  employeeId: string,
): Promise<EmployeeSettlementBalance> => {
  try {
    const response = await axiosInstance.get<EmployeeSettlementBalance>(
      ApiRoutes.employees.settlementBalance(employeeId),
    );
    return response.data;
  } catch {
    throw new Error("Failed to load your balance. Please try again.");
  }
};

export const createSettlement = async (
  storeId: string,
  payload: CreateSettlementPayload,
): Promise<Settlement> => {
  try {
    const response = await axiosInstance.post<Settlement>(
      ApiRoutes.stores.settlements(storeId),
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to record the payment. Please try again."),
    );
  }
};

export const reverseSettlement = async (id: string): Promise<Settlement> => {
  try {
    const response = await axiosInstance.post<Settlement>(
      ApiRoutes.settlements.reverse(id),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to reverse the payment. Please try again."),
    );
  }
};

export const confirmSettlement = async (id: string): Promise<Settlement> => {
  try {
    const response = await axiosInstance.post<Settlement>(
      ApiRoutes.settlements.confirm(id),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to confirm. Please try again."),
    );
  }
};

export const exportStoreSettlementsCsv = async (
  storeId: string,
  query?: SettlementsExportQuery,
): Promise<void> => {
  try {
    const response = await axiosInstance.get(
      ApiRoutes.stores.settlementsExport(storeId),
      { params: query, responseType: "blob" },
    );

    const disposition = response.headers["content-disposition"] as
      | string
      | undefined;
    const filenameMatch = disposition?.match(/filename="?([^"]+)"?/i);
    const filename =
      filenameMatch?.[1] ??
      `staff-balances-${new Date().toISOString().slice(0, 10)}.csv`;

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
    // The error body arrives as a Blob on a blob request, so the server's own
    // message has to be read back out of it.
    let message = getApiErrorMessage(
      error,
      "Failed to export staff balances. Please try again.",
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
      } catch {}
    }
    throw new Error(message);
  }
};
