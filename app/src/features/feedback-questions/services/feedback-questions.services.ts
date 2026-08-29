import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
  CreateFeedbackQuestionPayload,
  FeedbackQuestion,
  UpdateFeedbackQuestionPayload,
} from "@/features/feedback-questions/interfaces/feedback-questions.interfaces";

export const listFeedbackQuestions = async (
  storeId: string,
): Promise<FeedbackQuestion[]> => {
  try {
    const response = await axiosInstance.get<FeedbackQuestion[]>(
      ApiRoutes.stores.feedbackQuestions(storeId),
    );
    return response.data;
  } catch {
    throw new Error("Failed to load feedback questions. Please try again.");
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
  } catch {
    throw new Error("Failed to create feedback question. Please try again.");
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
  } catch {
    throw new Error("Failed to update feedback question. Please try again.");
  }
};

export const deleteFeedbackQuestion = async (
  storeId: string,
  id: string,
): Promise<void> => {
  try {
    await axiosInstance.delete(ApiRoutes.stores.feedbackQuestion(storeId, id));
  } catch {
    throw new Error("Failed to delete feedback question. Please try again.");
  }
};
