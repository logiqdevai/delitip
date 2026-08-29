import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { PaginatedResponse } from "@/interfaces/pagination.interfaces";
import type {
  Alert,
  AlertPreference,
  AlertsQuery,
} from "@/features/alerts/interfaces/alerts.interfaces";

export const listAlerts = async (
  storeId: string,
  query?: AlertsQuery,
): Promise<PaginatedResponse<Alert>> => {
  try {
    const response = await axiosInstance.get<PaginatedResponse<Alert>>(
      ApiRoutes.stores.alerts(storeId),
      { params: query },
    );
    return response.data;
  } catch {
    throw new Error("Failed to load alerts. Please try again.");
  }
};

export const markAlertRead = async (id: string): Promise<Alert> => {
  try {
    const response = await axiosInstance.patch<Alert>(
      ApiRoutes.alerts.markRead(id),
    );
    return response.data;
  } catch {
    throw new Error("Failed to mark alert as read. Please try again.");
  }
};

export const markAllAlertsRead = async (
  storeId: string,
): Promise<{ success: boolean; updated_count: number }> => {
  try {
    const response = await axiosInstance.patch<{
      success: boolean;
      updated_count: number;
    }>(ApiRoutes.stores.alertsReadAll(storeId));
    return response.data;
  } catch {
    throw new Error("Failed to mark alerts as read. Please try again.");
  }
};

export const listAlertPreferences = async (
  storeId: string,
): Promise<AlertPreference[]> => {
  try {
    const response = await axiosInstance.get<AlertPreference[]>(
      ApiRoutes.stores.alertPreferences(storeId),
    );
    return response.data;
  } catch {
    throw new Error("Failed to load alert preferences. Please try again.");
  }
};

export const updateAlertPreference = async (
  storeId: string,
  alertType: string,
  isEnabled: boolean,
): Promise<AlertPreference> => {
  try {
    const response = await axiosInstance.patch<AlertPreference>(
      ApiRoutes.stores.alertPreference(storeId, alertType),
      { is_enabled: isEnabled },
    );
    return response.data;
  } catch {
    throw new Error("Failed to update alert preference. Please try again.");
  }
};
