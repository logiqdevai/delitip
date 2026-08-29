import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
  CreateReviewTagPayload,
  ReviewTag,
  UpdateReviewTagPayload,
} from "@/features/review-tags/interfaces/review-tags.interfaces";

export const listReviewTags = async (storeId: string): Promise<ReviewTag[]> => {
  try {
    const response = await axiosInstance.get<ReviewTag[]>(
      ApiRoutes.stores.reviewTags(storeId),
    );
    return response.data;
  } catch {
    throw new Error("Failed to load review tags. Please try again.");
  }
};

export const createReviewTag = async (
  storeId: string,
  payload: CreateReviewTagPayload,
): Promise<ReviewTag> => {
  try {
    const response = await axiosInstance.post<ReviewTag>(
      ApiRoutes.stores.reviewTags(storeId),
      payload,
    );
    return response.data;
  } catch {
    throw new Error("Failed to create review tag. Please try again.");
  }
};

export const updateReviewTag = async (
  storeId: string,
  id: string,
  payload: UpdateReviewTagPayload,
): Promise<ReviewTag> => {
  try {
    const response = await axiosInstance.patch<ReviewTag>(
      ApiRoutes.stores.reviewTag(storeId, id),
      payload,
    );
    return response.data;
  } catch {
    throw new Error("Failed to update review tag. Please try again.");
  }
};

export const deleteReviewTag = async (
  storeId: string,
  id: string,
): Promise<void> => {
  try {
    await axiosInstance.delete(ApiRoutes.stores.reviewTag(storeId, id));
  } catch {
    throw new Error("Failed to delete review tag. Please try again.");
  }
};
