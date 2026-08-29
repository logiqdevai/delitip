import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
  CreateReviewCategoryPayload,
  ReviewCategory,
  UpdateReviewCategoryPayload,
} from "@/features/review-categories/interfaces/review-categories.interfaces";

export const listReviewCategories = async (
  storeId: string,
): Promise<ReviewCategory[]> => {
  try {
    const response = await axiosInstance.get<ReviewCategory[]>(
      ApiRoutes.stores.reviewCategories(storeId),
    );
    return response.data;
  } catch {
    throw new Error("Failed to load review categories. Please try again.");
  }
};

export const createReviewCategory = async (
  storeId: string,
  payload: CreateReviewCategoryPayload,
): Promise<ReviewCategory> => {
  try {
    const response = await axiosInstance.post<ReviewCategory>(
      ApiRoutes.stores.reviewCategories(storeId),
      payload,
    );
    return response.data;
  } catch {
    throw new Error("Failed to create review category. Please try again.");
  }
};

export const updateReviewCategory = async (
  storeId: string,
  id: string,
  payload: UpdateReviewCategoryPayload,
): Promise<ReviewCategory> => {
  try {
    const response = await axiosInstance.patch<ReviewCategory>(
      ApiRoutes.stores.reviewCategory(storeId, id),
      payload,
    );
    return response.data;
  } catch {
    throw new Error("Failed to update review category. Please try again.");
  }
};

export const deleteReviewCategory = async (
  storeId: string,
  id: string,
): Promise<void> => {
  try {
    await axiosInstance.delete(ApiRoutes.stores.reviewCategory(storeId, id));
  } catch {
    throw new Error("Failed to delete review category. Please try again.");
  }
};
