import { trackEvent } from "@/lib/analytics/analytics";
import { AnalyticsEvents } from "@/config/constants/analytics-events";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSpot,
  deleteSpot,
  listSpots,
  updateSpot,
} from "@/features/spots/services/spots.services";
import type {
  CreateSpotPayload,
  SpotsQuery,
  UpdateSpotPayload,
} from "@/features/spots/interfaces/spots.interfaces";
import { useTranslations } from "next-intl";
import { toast } from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/api-error";

export const spotsQueryKeys = {
  root: ["spots"] as const,
  list: (storeId: string, query?: SpotsQuery) =>
    ["spots", storeId, query] as const,
};

export const useSpots = (storeId: string, query?: SpotsQuery) => {
  return useQuery({
    queryKey: spotsQueryKeys.list(storeId, query),
    queryFn: () => listSpots(storeId, query),
    enabled: !!storeId,
  });
};

export const useCreateSpot = (storeId: string) => {
  const t = useTranslations("dashboard.access.toasts.spots");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSpotPayload) => createSpot(storeId, payload),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.spotCreated, { store_id: storeId });
      void queryClient.invalidateQueries({ queryKey: spotsQueryKeys.root });
      toast.add({ title: t("created"), type: "success" });
    },
    onError: (error: Error) => {
      toast.add({
        title: t("createFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};

export const useUpdateSpot = () => {
  const t = useTranslations("dashboard.access.toasts.spots");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSpotPayload }) =>
      updateSpot(id, payload),
    onSuccess: (_data, variables) => {
      trackEvent(AnalyticsEvents.spotUpdated);
      void queryClient.invalidateQueries({ queryKey: spotsQueryKeys.root });
      if (
        variables.payload.is_active !== undefined &&
        variables.payload.name === undefined
      ) {
        toast.add({
          title: variables.payload.is_active
            ? t("activated")
            : t("deactivated"),
          type: "success",
        });
        return;
      }
      if (variables.payload.name !== undefined) {
        toast.add({ title: t("renamed"), type: "success" });
        return;
      }
      toast.add({ title: t("updated"), type: "success" });
    },
    onError: (error: Error) => {
      toast.add({
        title: t("updateFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};

export const useDeleteSpot = () => {
  const t = useTranslations("dashboard.access.toasts.spots");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSpot(id),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.spotDeleted);
      void queryClient.invalidateQueries({ queryKey: spotsQueryKeys.root });
      toast.add({ title: t("removed"), type: "success" });
    },
    onError: (error: Error) => {
      toast.add({
        title: t("removeFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};
