import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReviewCategory,
  deleteReviewCategory,
  listReviewCategories,
  updateReviewCategory,
} from "@/features/review-categories/services/review-categories.services";
import type {
  CreateReviewCategoryPayload,
  UpdateReviewCategoryPayload,
} from "@/features/review-categories/interfaces/review-categories.interfaces";
import { toast } from "@/components/ui/toast";

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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewCategoryPayload) =>
      createReviewCategory(storeId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: reviewCategoriesQueryKeys.list(storeId),
      });
    },
    onError: (error: Error) => {
      toast.add({ title: "Could not add category", description: error.message, type: "error" });
    },
  });
};

export const useUpdateReviewCategory = (storeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateReviewCategoryPayload }) =>
      updateReviewCategory(storeId, id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: reviewCategoriesQueryKeys.list(storeId),
      });
    },
    onError: (error: Error) => {
      toast.add({ title: "Could not update category", description: error.message, type: "error" });
    },
  });
};

export const useDeleteReviewCategory = (storeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteReviewCategory(storeId, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: reviewCategoriesQueryKeys.list(storeId),
      });
    },
    onError: (error: Error) => {
      toast.add({ title: "Could not delete category", description: error.message, type: "error" });
    },
  });
};
