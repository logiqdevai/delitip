import { trackEvent } from "@/lib/analytics/analytics";
import { AnalyticsEvents } from "@/config/constants/analytics-events";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createQrCode,
  deleteQrCode,
  getPublicQrCode,
  getQrCode,
  getQrCodeStats,
  listQrCodes,
  updateQrCode,
} from "@/features/qr-codes/services/qr-codes.services";
import type {
  CreateQrCodePayload,
  QrCodesQuery,
  UpdateQrCodePayload,
} from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import { useTranslations } from "next-intl";
import { toast } from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/api-error";

export const qrCodesQueryKeys = {
  root: ["qr-codes"] as const,
  list: (storeId: string, query?: QrCodesQuery) =>
    ["qr-codes", storeId, query] as const,
  detail: (id: string) => ["qr-code", id] as const,
  stats: (id: string) => ["qr-code-stats", id] as const,
  public: (code: string, lang?: string) => ["public-qr", code, lang] as const,
};

export const useQrCodes = (storeId: string, query?: QrCodesQuery) => {
  return useQuery({
    queryKey: qrCodesQueryKeys.list(storeId, query),
    queryFn: () => listQrCodes(storeId, query),
    enabled: !!storeId,
  });
};

export const useQrCode = (id: string) => {
  return useQuery({
    queryKey: qrCodesQueryKeys.detail(id),
    queryFn: () => getQrCode(id),
    enabled: !!id,
  });
};

export const useQrCodeStats = (id: string) => {
  return useQuery({
    queryKey: qrCodesQueryKeys.stats(id),
    queryFn: () => getQrCodeStats(id),
    enabled: !!id,
  });
};

export const usePublicQrCode = (code: string, lang?: string) => {
  return useQuery({
    queryKey: qrCodesQueryKeys.public(code, lang),
    queryFn: () => getPublicQrCode(code, lang),
    enabled: !!code,
  });
};

export const useCreateQrCode = (storeId: string) => {
  const t = useTranslations("dashboard.access.toasts.qrCodes");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateQrCodePayload) =>
      createQrCode(storeId, payload),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.qrCodeCreated, { store_id: storeId });
      void queryClient.invalidateQueries({ queryKey: qrCodesQueryKeys.root });
      toast.add({
        title: t("created"),
        description: t("createdDescription"),
        type: "success",
      });
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

export const useUpdateQrCode = () => {
  const t = useTranslations("dashboard.access.toasts.qrCodes");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateQrCodePayload;
    }) => updateQrCode(id, payload),
    onSuccess: (_data, variables) => {
      trackEvent(AnalyticsEvents.qrCodeUpdated);
      void queryClient.invalidateQueries({ queryKey: qrCodesQueryKeys.root });
      void queryClient.invalidateQueries({
        queryKey: qrCodesQueryKeys.detail(variables.id),
      });
      toast.add({
        title: t("updated"),
        description: t("updatedDescription"),
        type: "success",
      });
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

export const useDeleteQrCode = () => {
  const t = useTranslations("dashboard.access.toasts.qrCodes");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteQrCode(id),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.qrCodeDeleted);
      void queryClient.invalidateQueries({ queryKey: qrCodesQueryKeys.root });
      toast.add({
        title: t("deleted"),
        type: "success",
      });
    },
    onError: (error: Error) => {
      toast.add({
        title: t("deleteFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};
