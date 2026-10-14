import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
  AppConfig,
  UpdateAppConfigPayload,
} from "@/features/app-config/interfaces/app-config.interfaces";

export const getAppConfig = async (): Promise<AppConfig> => {
  const response = await axiosInstance.get<AppConfig>(
    ApiRoutes.admin.appConfig,
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
