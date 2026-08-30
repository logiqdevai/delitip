import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFeedbackQuestion,
  deleteFeedbackQuestion,
  listFeedbackQuestions,
  updateFeedbackQuestion,
} from "@/features/feedback-questions/services/feedback-questions.services";
import type {
  CreateFeedbackQuestionPayload,
  FeedbackQuestion,
  UpdateFeedbackQuestionPayload,
} from "@/features/feedback-questions/interfaces/feedback-questions.interfaces";
import { toast } from "@/components/ui/toast";

export const feedbackQuestionsQueryKeys = {
  list: (storeId: string) => ["feedback-questions", storeId] as const,
};

export const useFeedbackQuestions = (storeId: string) => {
  return useQuery({
    queryKey: feedbackQuestionsQueryKeys.list(storeId),
    queryFn: () => listFeedbackQuestions(storeId),
    enabled: !!storeId,
  });
};

export const useCreateFeedbackQuestion = (storeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFeedbackQuestionPayload) =>
      createFeedbackQuestion(storeId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: feedbackQuestionsQueryKeys.list(storeId),
      });
    },
    onError: (error: Error) => {
      toast.add({ title: "Could not add question", description: error.message, type: "error" });
    },
  });
};

export const useUpdateFeedbackQuestion = (storeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateFeedbackQuestionPayload }) =>
      updateFeedbackQuestion(storeId, id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: feedbackQuestionsQueryKeys.list(storeId),
      });
    },
    onError: (error: Error) => {
      toast.add({ title: "Could not update question", description: error.message, type: "error" });
    },
  });
};

export const useDeleteFeedbackQuestion = (storeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFeedbackQuestion(storeId, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: feedbackQuestionsQueryKeys.list(storeId),
      });
    },
    onError: (error: Error) => {
      toast.add({ title: "Could not delete question", description: error.message, type: "error" });
    },
  });
};

export const useReorderFeedbackQuestions = (storeId: string) => {
  const queryClient = useQueryClient();
  const queryKey = feedbackQuestionsQueryKeys.list(storeId);

  return useMutation({
    mutationFn: async (orderedIds: string[]) => {
      await Promise.all(
        orderedIds.map((id, sort_order) =>
          updateFeedbackQuestion(storeId, id, { sort_order }),
        ),
      );
    },
    onMutate: async (orderedIds) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<FeedbackQuestion[]>(queryKey);
      if (previous) {
        const byId = new Map(previous.map((item) => [item.id, item]));
        queryClient.setQueryData(
          queryKey,
          orderedIds.flatMap((id, sort_order) => {
            const item = byId.get(id);
            return item ? [{ ...item, sort_order }] : [];
          }),
        );
      }
      return { previous };
    },
    onError: (error: Error, _orderedIds, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
      toast.add({
        title: "Could not reorder questions",
        description: error.message,
        type: "error",
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });
};
