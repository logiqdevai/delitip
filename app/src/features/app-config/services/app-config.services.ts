import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
  AppConfig,
  PayoutPolicy,
  PlatformVatRate,
  UpdateAppConfigPayload,
} from "@/features/app-config/interfaces/app-config.interfaces";

export const getAppConfig = async (): Promise<AppConfig> => {
  const response = await axiosInstance.get<AppConfig>(
    ApiRoutes.admin.appConfig,
  );
  return response.data;
};

export const getPlatformVatRate = async (): Promise<PlatformVatRate> => {
  const response = await axiosInstance.get<PlatformVatRate>(
    ApiRoutes.appConfig.vatRate,
  );
  return response.data;
};

export const getPayoutPolicy = async (): Promise<PayoutPolicy> => {
  const response = await axiosInstance.get<PayoutPolicy>(
    ApiRoutes.appConfig.payoutPolicy,
  );
  return response.data;
};

export const updateAppConfig = async (
  payload: UpdateAppConfigPayload,
): Promise<AppConfig> => {
  const response = await axiosInstance.patch<AppConfig>(
    ApiRoutes.admin.appConfig,
    payload,
  );
  return response.data;
};
