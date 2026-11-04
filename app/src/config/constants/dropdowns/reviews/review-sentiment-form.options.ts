import {
  ReviewSentiments,
  type ReviewSentiment,
} from "@/features/reviews/interfaces/reviews.interfaces";

export const ReviewSentimentFormOptions: {
  id: ReviewSentiment;
  labelKey: string;
}[] = [
  {
    id: ReviewSentiments.POSITIVE,
    labelKey: "dashboard.enums.reviewSentiment.POSITIVE",
  },
  {
    id: ReviewSentiments.NEUTRAL,
    labelKey: "dashboard.enums.reviewSentiment.NEUTRAL",
  },
  {
    id: ReviewSentiments.NEGATIVE,
    labelKey: "dashboard.enums.reviewSentiment.NEGATIVE",
  },
];
