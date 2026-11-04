import { tr } from "@/lib/i18n-runtime";
import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
  CreateFeedbackQuestionPayload,
  FeedbackQuestion,
  UpdateFeedbackQuestionPayload,
} from "@/features/feedback-questions/interfaces/feedback-questions.interfaces";
import { getErrorMessage } from "@/lib/api-error";

export const listFeedbackQuestions = async (
  storeId: string,
): Promise<FeedbackQuestion[]> => {
  try {
    const response = await axiosInstance.get<FeedbackQuestion[]>(
      ApiRoutes.stores.feedbackQuestions(storeId),
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, tr("errors.services.loadFeedbackQuestions")));
  }
};

export const createFeedbackQuestion = async (
  storeId: string,
  payload: CreateFeedbackQuestionPayload,
): Promise<FeedbackQuestion> => {
  try {
    const response = await axiosInstance.post<FeedbackQuestion>(
      ApiRoutes.stores.feedbackQuestions(storeId),
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, tr("errors.services.createFeedbackQuestion")));
  }
};

export const updateFeedbackQuestion = async (
  storeId: string,
  id: string,
  payload: UpdateFeedbackQuestionPayload,
): Promise<FeedbackQuestion> => {
  try {
    const response = await axiosInstance.patch<FeedbackQuestion>(
      ApiRoutes.stores.feedbackQuestion(storeId, id),
      payload,
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, tr("errors.services.updateFeedbackQuestion")));
  }
};

export const deleteFeedbackQuestion = async (
  storeId: string,
  id: string,
): Promise<void> => {
  try {
    await axiosInstance.delete(ApiRoutes.stores.feedbackQuestion(storeId, id));
  } catch (error) {
    throw new Error(getErrorMessage(error, tr("errors.services.deleteFeedbackQuestion")));
  }
};
