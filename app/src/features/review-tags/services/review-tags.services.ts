import { tr } from "@/lib/i18n-runtime";
import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
  CreateReviewTagPayload,
  ReviewTag,
  UpdateReviewTagPayload,
} from "@/features/review-tags/interfaces/review-tags.interfaces";
import { getErrorMessage } from "@/lib/api-error";

export const listReviewTags = async (storeId: string): Promise<ReviewTag[]> => {
  try {
    const response = await axiosInstance.get<ReviewTag[]>(
      ApiRoutes.stores.reviewTags(storeId),
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, tr("errors.services.loadReviewTags")));
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
  } catch (error) {
    throw new Error(getErrorMessage(error, tr("errors.services.createReviewTag")));
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
  } catch (error) {
    throw new Error(getErrorMessage(error, tr("errors.services.updateReviewTag")));
  }
};

export const deleteReviewTag = async (
  storeId: string,
  id: string,
): Promise<void> => {
  try {
    await axiosInstance.delete(ApiRoutes.stores.reviewTag(storeId, id));
  } catch (error) {
    throw new Error(getErrorMessage(error, tr("errors.services.deleteReviewTag")));
  }
};
