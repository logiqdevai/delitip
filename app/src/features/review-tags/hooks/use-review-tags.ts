import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewTagPayload) =>
      createReviewTag(storeId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: reviewTagsQueryKeys.list(storeId),
      });
    },
    onError: (error: Error) => {
      toast.add({ title: "Could not add tag", description: error.message, type: "error" });
    },
  });
};

export const useUpdateReviewTag = (storeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateReviewTagPayload }) =>
      updateReviewTag(storeId, id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: reviewTagsQueryKeys.list(storeId),
      });
    },
    onError: (error: Error) => {
      toast.add({ title: "Could not update tag", description: error.message, type: "error" });
    },
  });
};

export const useDeleteReviewTag = (storeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteReviewTag(storeId, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: reviewTagsQueryKeys.list(storeId),
      });
    },
    onError: (error: Error) => {
      toast.add({ title: "Could not delete tag", description: error.message, type: "error" });
    },
  });
};
