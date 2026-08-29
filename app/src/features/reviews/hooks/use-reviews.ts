import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPublicReview,
  deleteReview,
  getPublicReviewConfig,
  getReview,
  listEmployeeReviews,
  listStoreReviews,
  updateReview,
} from "@/features/reviews/services/reviews.services";
import type {
  CreatePublicReviewPayload,
  ReviewsQuery,
  UpdateReviewPayload,
} from "@/features/reviews/interfaces/reviews.interfaces";

export const reviewsQueryKeys = {
  root: ["reviews"] as const,
  storeList: (storeId: string, query?: ReviewsQuery) =>
    ["reviews", "store", storeId, query] as const,
  employeeList: (employeeId: string, query?: ReviewsQuery) =>
    ["reviews", "employee", employeeId, query] as const,
  detail: (id: string) => ["review", id] as const,
  publicConfig: (slug: string) => ["public-review-config", slug] as const,
};

export const useStoreReviews = (storeId: string, query?: ReviewsQuery) => {
  return useQuery({
    queryKey: reviewsQueryKeys.storeList(storeId, query),
    queryFn: () => listStoreReviews(storeId, query),
    enabled: !!storeId,
  });
};

export const useEmployeeReviews = (
  employeeId: string,
  query?: ReviewsQuery,
) => {
  return useQuery({
    queryKey: reviewsQueryKeys.employeeList(employeeId, query),
    queryFn: () => listEmployeeReviews(employeeId, query),
    enabled: !!employeeId,
  });
};

export const useReview = (id: string) => {
  return useQuery({
    queryKey: reviewsQueryKeys.detail(id),
    queryFn: () => getReview(id),
    enabled: !!id,
  });
};

export const usePublicReviewConfig = (slug: string) => {
  return useQuery({
    queryKey: reviewsQueryKeys.publicConfig(slug),
    queryFn: () => getPublicReviewConfig(slug),
    enabled: !!slug,
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateReviewPayload;
    }) => updateReview(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: reviewsQueryKeys.root });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteReview(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: reviewsQueryKeys.root });
    },
  });
};

export const useCreatePublicReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePublicReviewPayload) =>
      createPublicReview(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: reviewsQueryKeys.root });
    },
  });
};
