import { tr } from "@/lib/i18n-runtime";
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
import { getErrorMessage as getApiErrorMessage } from "@/lib/api-error";

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
  } catch (error) {
    throw new Error(getApiErrorMessage(error, tr("errors.services.loadReviews")));
  }
};

export const getReview = async (id: string): Promise<Review> => {
  try {
    const response = await axiosInstance.get<Review>(
      ApiRoutes.reviews.byId(id),
    );
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, tr("errors.services.loadReview")));
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
  } catch (error) {
    throw new Error(getApiErrorMessage(error, tr("errors.services.updateReview")));
  }
};

export const deleteReview = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(ApiRoutes.reviews.byId(id));
  } catch (error) {
    throw new Error(getApiErrorMessage(error, tr("errors.services.deleteReview")));
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
  } catch (error) {
    throw new Error(getApiErrorMessage(error, tr("errors.services.loadEmployeeReviews")));
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
  } catch (error) {
    throw new Error(getApiErrorMessage(error, tr("errors.services.loadReviewConfig")));
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
      getApiErrorMessage(error, tr("errors.services.submitReview")),
    );
  }
};
