import {
  FeedbackQuestionTypes,
  type FeedbackQuestionType,
} from "@/features/feedback-questions/interfaces/feedback-questions.interfaces";

export const FeedbackQuestionTypeFormOptions: {
  id: FeedbackQuestionType;
  label: string;
}[] = [
  { id: FeedbackQuestionTypes.RATING, label: "Rating" },
  { id: FeedbackQuestionTypes.TEXT, label: "Text" },
];
