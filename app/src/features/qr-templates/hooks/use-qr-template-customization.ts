import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import {
  getQrTemplateCustomization,
  resetQrTemplateCustomization,
  saveQrTemplateCustomization,
} from "@/features/qr-templates/services/qr-template-customizations.services";
import type { UpsertQrTemplateCustomizationPayload } from "@/features/qr-templates/interfaces/qr-template-customization.interfaces";
import type { QrTemplateId } from "@/features/qr-templates/interfaces/qr-templates.interfaces";

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpsertQrTemplateCustomizationPayload) =>
      saveQrTemplateCustomization(storeId, templateId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: qrTemplateCustomizationQueryKeys.detail(storeId, templateId),
      });
      toast.add({ title: "Design saved", type: "success" });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not save design",
        description: error.message,
        type: "error",
      });
    },
  });
};

export const useResetQrTemplateCustomization = (
  storeId: string,
  templateId: QrTemplateId,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => resetQrTemplateCustomization(storeId, templateId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: qrTemplateCustomizationQueryKeys.detail(storeId, templateId),
      });
      toast.add({ title: "Design reset to default", type: "success" });
    },
    onError: (error: Error) => {
      toast.add({
        title: "Could not reset design",
        description: error.message,
        type: "error",
      });
    },
  });
};
