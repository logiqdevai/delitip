import { trackEvent } from "@/lib/analytics/analytics";
import { AnalyticsEvents } from "@/config/constants/analytics-events";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  listAlertPreferences,
  listAlerts,
  markAlertRead,
  markAllAlertsRead,
  updateAlertPreference,
} from "@/features/alerts/services/alerts.services";
import type { AlertsQuery } from "@/features/alerts/interfaces/alerts.interfaces";
import { toast } from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/api-error";

export const alertsQueryKeys = {
  list: (storeId: string, query?: AlertsQuery) =>
    ["alerts", storeId, query] as const,
  unreadCount: (storeId: string) => ["alerts", storeId, "unread-count"] as const,
  preferences: (storeId: string) => ["alert-preferences", storeId] as const,
};

export const useAlerts = (storeId: string, query?: AlertsQuery) => {
  return useQuery({
    queryKey: alertsQueryKeys.list(storeId, query),
    queryFn: () => listAlerts(storeId, query),
    enabled: !!storeId,
  });
};

export const useUnreadAlertsCount = (storeId: string) => {
  return useQuery({
    queryKey: alertsQueryKeys.unreadCount(storeId),
    queryFn: () => listAlerts(storeId, { is_read: false, limit: 1 }),
    enabled: !!storeId,
    select: (data) => data.pagination.total,
  });
};

export const useMarkAlertRead = (storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markAlertRead(id),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.alertRead, { store_id: storeId });
      void queryClient.invalidateQueries({ queryKey: ["alerts", storeId] });
    },
  });
};

export const useMarkAllAlertsRead = (storeId: string) => {
  const t = useTranslations("dashboard.engagement.alerts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllAlertsRead(storeId),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.alertsAllRead, { store_id: storeId });
      void queryClient.invalidateQueries({ queryKey: ["alerts", storeId] });
      toast.add({ title: t("allReadToast"), type: "success" });
    },
    onError: (error: Error) => {
      toast.add({
        title: t("markAllReadErrorToast"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};

export const useAlertPreferences = (storeId: string) => {
  return useQuery({
    queryKey: alertsQueryKeys.preferences(storeId),
    queryFn: () => listAlertPreferences(storeId),
    enabled: !!storeId,
  });
};

export const useUpdateAlertPreference = (storeId: string) => {
  const t = useTranslations("dashboard.engagement.alerts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      alertType,
      isEnabled,
    }: {
      alertType: string;
      isEnabled: boolean;
    }) => updateAlertPreference(storeId, alertType, isEnabled),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.alertPreferenceUpdated, { store_id: storeId });
      void queryClient.invalidateQueries({
        queryKey: alertsQueryKeys.preferences(storeId),
      });
      toast.add({ title: t("preferenceSavedToast"), type: "success" });
    },
    onError: (error: Error) => {
      toast.add({
        title: t("preferenceErrorToast"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};
