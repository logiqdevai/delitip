import { isAxiosError } from "axios";
import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
  CreatePayoutAccountPayload,
  PayoutAccount,
} from "@/features/payout-accounts/interfaces/payout-accounts.interfaces";
import { getErrorMessage as getApiErrorMessage } from "@/lib/api-error";

export const getMyPayoutAccount = async (): Promise<PayoutAccount | null> => {
  try {
    const response = await axiosInstance.get<PayoutAccount>(
      ApiRoutes.users.mePayoutAccount,
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw new Error(getApiErrorMessage(error, "We couldn't load payout account. Please try again."));
  }
};

export const createMyPayoutAccount = async (
  payload: CreatePayoutAccountPayload,
): Promise<PayoutAccount> => {
  try {
    const response = await axiosInstance.post<PayoutAccount>(
      ApiRoutes.users.mePayoutAccount,
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "We couldn't link payout account. Please try again."),
    );
  }
};

export const getStorePayoutAccount = async (
  storeId: string,
): Promise<PayoutAccount | null> => {
  try {
    const response = await axiosInstance.get<PayoutAccount>(
      ApiRoutes.stores.payoutAccount(storeId),
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw new Error(getApiErrorMessage(error, "We couldn't load payout account. Please try again."));
  }
};

export const createStorePayoutAccount = async (
  storeId: string,
  payload: CreatePayoutAccountPayload,
): Promise<PayoutAccount> => {
  try {
    const response = await axiosInstance.post<PayoutAccount>(
      ApiRoutes.stores.payoutAccount(storeId),
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "We couldn't link payout account. Please try again."),
    );
  }
};

export const refreshMyPayoutAccountStatus = async (): Promise<PayoutAccount> => {
  try {
    const response = await axiosInstance.post<PayoutAccount>(
      ApiRoutes.users.mePayoutAccountRefreshStatus,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "We couldn't check payout account status. Please try again."),
    );
  }
};

export const refreshStorePayoutAccountStatus = async (
  storeId: string,
): Promise<PayoutAccount> => {
  try {
    const response = await axiosInstance.post<PayoutAccount>(
      ApiRoutes.stores.payoutAccountRefreshStatus(storeId),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "We couldn't check payout account status. Please try again."),
    );
  }
};

export const reconcilePayoutAccounts = async (): Promise<{
  checked: number;
  promoted: number;
}> => {
  try {
    const response = await axiosInstance.post<{
      checked: number;
      promoted: number;
    }>(ApiRoutes.admin.payoutAccounts.reconcile);
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "We couldn't reconcile payout accounts. Please try again."));
  }
};

export const getEmployeePayoutAccount = async (
  employeeId: string,
): Promise<PayoutAccount | null> => {
  try {
    const response = await axiosInstance.get<PayoutAccount>(
      ApiRoutes.employees.payoutAccount(employeeId),
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw new Error(getApiErrorMessage(error, "We couldn't load payout account. Please try again."));
  }
};

export const createEmployeePayoutAccount = async (
  employeeId: string,
  payload: CreatePayoutAccountPayload,
): Promise<PayoutAccount> => {
  try {
    const response = await axiosInstance.post<PayoutAccount>(
      ApiRoutes.employees.payoutAccount(employeeId),
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "We couldn't link payout account. Please try again."),
    );
  }
};

export const refreshEmployeePayoutAccountStatus = async (
  employeeId: string,
): Promise<PayoutAccount> => {
  try {
    const response = await axiosInstance.post<PayoutAccount>(
      ApiRoutes.employees.payoutAccountRefreshStatus(employeeId),
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "We couldn't check payout account status. Please try again."),
    );
  }
};
