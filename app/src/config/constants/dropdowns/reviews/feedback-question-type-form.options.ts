import {
  FeedbackQuestionTypes,
  type FeedbackQuestionType,
} from "@/features/feedback-questions/interfaces/feedback-questions.interfaces";

export const FeedbackQuestionTypeFormOptions: {
  id: FeedbackQuestionType;
  labelKey: string;
}[] = [
  {
    id: FeedbackQuestionTypes.RATING,
    labelKey: "dashboard.enums.feedbackQuestionType.RATING",
  },
  {
    id: FeedbackQuestionTypes.TEXT,
    labelKey: "dashboard.enums.feedbackQuestionType.TEXT",
  },
];
