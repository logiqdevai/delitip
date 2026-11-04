import { trackEvent } from "@/lib/analytics/analytics";
import { AnalyticsEvents } from "@/config/constants/analytics-events";
import { useMutation } from "@tanstack/react-query";
import {
  deleteDocument,
  uploadDocument,
} from "@/features/documents/services/documents.services";
import type { DocumentType } from "@/features/documents/interfaces/documents.interfaces";
import { useTranslations } from "next-intl";
import { toast } from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/api-error";

export const useUploadDocument = () => {
  const t = useTranslations("dashboard.access.toasts.documents");
  return useMutation({
    mutationFn: ({ file, type }: { file: File; type?: DocumentType }) =>
      uploadDocument(file, type),
    onSuccess: (_data, variables) => {
      trackEvent(AnalyticsEvents.documentUploaded, { type: variables.type });
    },
    onError: (error: Error) => {
      toast.add({
        title: t("uploadFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
  });
};

export const useDeleteDocument = () => {
  const t = useTranslations("dashboard.access.toasts.documents");
  return useMutation({
    mutationFn: (id: string) => deleteDocument(id),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.documentDeleted);
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
