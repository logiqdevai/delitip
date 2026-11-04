import { trackEvent } from "@/lib/analytics/analytics";
import { AnalyticsEvents } from "@/config/constants/analytics-events";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  createReviewTag,
  deleteReviewTag,
  listReviewTags,
  updateReviewTag,
} from "@/features/review-tags/services/review-tags.services";
import type {
  CreateReviewTagPayload,
  UpdateReviewTagPayload,
} from "@/features/review-tags/interfaces/review-tags.interfaces";
import { toast } from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/api-error";

export const reviewTagsQueryKeys = {
  list: (storeId: string) => ["review-tags", storeId] as const,
};

export const useReviewTags = (storeId: string) => {
  return useQuery({
    queryKey: reviewTagsQueryKeys.list(storeId),
    queryFn: () => listReviewTags(storeId),
    enabled: !!storeId,
  });
};

export const useCreateReviewTag = (storeId: string) => {
  const t = useTranslations("dashboard.settings.toasts.reviewTags");
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewTagPayload) =>
      createReviewTag(storeId, payload),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.reviewConfigChanged, { entity: "review_tag", action: "created", store_id: storeId });
      void queryClient.invalidateQueries({
        queryKey: reviewTagsQueryKeys.list(storeId),
      });
    },
    onError: (error: Error) => {
      toast.add({ title: t("addFailed"), description: getErrorMessage(error), type: "error" });
    },
  });
};

export const useUpdateReviewTag = (storeId: string) => {
  const t = useTranslations("dashboard.settings.toasts.reviewTags");
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateReviewTagPayload }) =>
      updateReviewTag(storeId, id, payload),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.reviewConfigChanged, { entity: "review_tag", action: "updated", store_id: storeId });
      void queryClient.invalidateQueries({
        queryKey: reviewTagsQueryKeys.list(storeId),
      });
    },
    onError: (error: Error) => {
      toast.add({ title: t("updateFailed"), description: getErrorMessage(error), type: "error" });
    },
  });
};

export const useDeleteReviewTag = (storeId: string) => {
  const t = useTranslations("dashboard.settings.toasts.reviewTags");
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteReviewTag(storeId, id),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.reviewConfigChanged, { entity: "review_tag", action: "deleted", store_id: storeId });
      void queryClient.invalidateQueries({
        queryKey: reviewTagsQueryKeys.list(storeId),
      });
    },
    onError: (error: Error) => {
      toast.add({ title: t("deleteFailed"), description: getErrorMessage(error), type: "error" });
    },
  });
};
