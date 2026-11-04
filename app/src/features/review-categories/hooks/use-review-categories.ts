import { trackEvent } from "@/lib/analytics/analytics";
import { AnalyticsEvents } from "@/config/constants/analytics-events";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  createReviewCategory,
  deleteReviewCategory,
  listReviewCategories,
  updateReviewCategory,
} from "@/features/review-categories/services/review-categories.services";
import type {
  CreateReviewCategoryPayload,
  ReviewCategory,
  UpdateReviewCategoryPayload,
} from "@/features/review-categories/interfaces/review-categories.interfaces";
import { toast } from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/api-error";

export const reviewCategoriesQueryKeys = {
  list: (storeId: string) => ["review-categories", storeId] as const,
};

export const useReviewCategories = (storeId: string) => {
  return useQuery({
    queryKey: reviewCategoriesQueryKeys.list(storeId),
    queryFn: () => listReviewCategories(storeId),
    enabled: !!storeId,
  });
};

export const useCreateReviewCategory = (storeId: string) => {
  const t = useTranslations("dashboard.settings.toasts.reviewCategories");
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewCategoryPayload) =>
      createReviewCategory(storeId, payload),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.reviewConfigChanged, { entity: "review_category", action: "created", store_id: storeId });
      void queryClient.invalidateQueries({
        queryKey: reviewCategoriesQueryKeys.list(storeId),
      });
    },
    onError: (error: Error) => {
      toast.add({ title: t("addFailed"), description: getErrorMessage(error), type: "error" });
    },
  });
};

export const useUpdateReviewCategory = (storeId: string) => {
  const t = useTranslations("dashboard.settings.toasts.reviewCategories");
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateReviewCategoryPayload }) =>
      updateReviewCategory(storeId, id, payload),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.reviewConfigChanged, { entity: "review_category", action: "updated", store_id: storeId });
      void queryClient.invalidateQueries({
        queryKey: reviewCategoriesQueryKeys.list(storeId),
      });
    },
    onError: (error: Error) => {
      toast.add({ title: t("updateFailed"), description: getErrorMessage(error), type: "error" });
    },
  });
};

export const useDeleteReviewCategory = (storeId: string) => {
  const t = useTranslations("dashboard.settings.toasts.reviewCategories");
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteReviewCategory(storeId, id),
    onSuccess: () => {
      trackEvent(AnalyticsEvents.reviewConfigChanged, { entity: "review_category", action: "deleted", store_id: storeId });
      void queryClient.invalidateQueries({
        queryKey: reviewCategoriesQueryKeys.list(storeId),
      });
    },
    onError: (error: Error) => {
      toast.add({ title: t("deleteFailed"), description: getErrorMessage(error), type: "error" });
    },
  });
};

export const useReorderReviewCategories = (storeId: string) => {
  const t = useTranslations("dashboard.settings.toasts.reviewCategories");
  const queryClient = useQueryClient();
  const queryKey = reviewCategoriesQueryKeys.list(storeId);

  return useMutation({
    mutationFn: async (orderedIds: string[]) => {
      await Promise.all(
        orderedIds.map((id, sort_order) =>
          updateReviewCategory(storeId, id, { sort_order }),
        ),
      );
    },
    onMutate: async (orderedIds) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ReviewCategory[]>(queryKey);
      if (previous) {
        const byId = new Map(previous.map((item) => [item.id, item]));
        queryClient.setQueryData(
          queryKey,
          orderedIds.flatMap((id, sort_order) => {
            const item = byId.get(id);
            return item ? [{ ...item, sort_order }] : [];
          }),
        );
      }
      return { previous };
    },
    onError: (error: Error, _orderedIds, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
      toast.add({
        title: t("reorderFailed"),
        description: getErrorMessage(error),
        type: "error",
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });
};
