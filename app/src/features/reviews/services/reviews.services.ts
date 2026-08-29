import { isAxiosError } from "axios";
import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { PaginatedResponse } from "@/interfaces/pagination.interfaces";
import type {
  CreatePublicReviewPayload,
  CreatePublicReviewResponse,
  PublicReviewConfig,
  Review,
  ReviewsQuery,
  UpdateReviewPayload,
} from "@/features/reviews/interfaces/reviews.interfaces";

const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
    if (Array.isArray(message) && typeof message[0] === "string") {
      return message[0];
    }
  }
  return fallback;
};

export const listStoreReviews = async (
  storeId: string,
  query?: ReviewsQuery,
): Promise<PaginatedResponse<Review>> => {
  try {
    const response = await axiosInstance.get<PaginatedResponse<Review>>(
      ApiRoutes.stores.reviews(storeId),
      { params: query },
    );
    return response.data;
  } catch {
    throw new Error("Failed to load reviews. Please try again.");
  }
};

export const getReview = async (id: string): Promise<Review> => {
  try {
    const response = await axiosInstance.get<Review>(
      ApiRoutes.reviews.byId(id),
    );
    return response.data;
  } catch {
    throw new Error("Failed to load review. Please try again.");
  }
};

export const updateReview = async (
  id: string,
  payload: UpdateReviewPayload,
): Promise<Review> => {
  try {
    const response = await axiosInstance.patch<Review>(
      ApiRoutes.reviews.byId(id),
      payload,
    );
    return response.data;
  } catch {
    throw new Error("Failed to update review. Please try again.");
  }
};

export const deleteReview = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(ApiRoutes.reviews.byId(id));
  } catch {
    throw new Error("Failed to delete review. Please try again.");
  }
};

export const listEmployeeReviews = async (
  employeeId: string,
  query?: ReviewsQuery,
): Promise<PaginatedResponse<Review>> => {
  try {
    const response = await axiosInstance.get<PaginatedResponse<Review>>(
      ApiRoutes.employees.reviews(employeeId),
      { params: query },
    );
    return response.data;
  } catch {
    throw new Error("Failed to load employee reviews. Please try again.");
  }
};

export const getPublicReviewConfig = async (
  slug: string,
  lang?: string,
): Promise<PublicReviewConfig> => {
  try {
    const response = await axiosInstance.get<PublicReviewConfig>(
      ApiRoutes.public.storeReviewConfig(slug),
      { params: lang ? { lang } : undefined },
    );
    return response.data;
  } catch {
    throw new Error("Failed to load review config. Please try again.");
  }
};

export const createPublicReview = async (
  payload: CreatePublicReviewPayload,
): Promise<CreatePublicReviewResponse> => {
  try {
    const response = await axiosInstance.post<CreatePublicReviewResponse>(
      ApiRoutes.public.reviews,
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Failed to submit review. Please try again."),
    );
  }
};
