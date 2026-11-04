import { trackEvent } from "@/lib/analytics/analytics";
import { AnalyticsEvents } from "@/config/constants/analytics-events";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "@/components/ui/toast";
import {
  getQrTemplateCustomization,
  resetQrTemplateCustomization,
  saveQrTemplateCustomization,
} from "@/features/qr-templates/services/qr-template-customizations.services";
import type { UpsertQrTemplateCustomizationPayload } from "@/features/qr-templates/interfaces/qr-template-customization.interfaces";
import type { QrTemplateId } from "@/features/qr-templates/interfaces/qr-templates.interfaces";
import { getErrorMessage } from "@/lib/api-error";

export const qrTemplateCustomizationQueryKeys = {
  detail: (storeId: string, templateId: QrTemplateId) =>
    ["qr-template-customization", storeId, templateId] as const,
};

export const useQrTemplateCustomization = (
  storeId: string,
  templateId: QrTemplateId,
  enabled = true,
) => {
  return useQuery({
    queryKey: qrTemplateCustomizationQueryKeys.detail(storeId, templateId),
    queryFn: () => getQrTemplateCustomization(storeId, templateId),
    enabled: !!storeId && enabled,
  });
};

export const useSaveQrTemplateCustomization = (
  storeId: string,
  templateId: QrTemplateId,
) => {
  const t = useTranslations("dashboard.access.templateEditor");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpsertQrTemplateCustomizationPayload) =>
      saveQrTemplateCustomization(storeId, templateId, payload),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.qrTemplateSaved, { store_id: storeId, template_id: templateId });
      void queryClient.invalidateQueries({
        queryKey: qrTemplateCustomizationQueryKeys.detail(storeId, templateId),
      });
      toast.add({ title: t("saved"), type: "success" });
    },
    onError: (error: Error) => {
      toast.add({
        title: t("saveFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};

export const useResetQrTemplateCustomization = (
  storeId: string,
  templateId: QrTemplateId,
) => {
  const t = useTranslations("dashboard.access.templateEditor");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => resetQrTemplateCustomization(storeId, templateId),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.qrTemplateReset, { store_id: storeId, template_id: templateId });
      void queryClient.invalidateQueries({
        queryKey: qrTemplateCustomizationQueryKeys.detail(storeId, templateId),
      });
      toast.add({ title: t("resetDone"), type: "success" });
    },
    onError: (error: Error) => {
      toast.add({
        title: t("resetFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};
