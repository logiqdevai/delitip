import {
  ReviewSentiments,
  type ReviewSentiment,
} from "@/features/reviews/interfaces/reviews.interfaces";

export const ReviewSentimentFormOptions: {
  id: ReviewSentiment;
  label: string;
}[] = [
  { id: ReviewSentiments.POSITIVE, label: "Positive" },
  { id: ReviewSentiments.NEUTRAL, label: "Neutral" },
  { id: ReviewSentiments.NEGATIVE, label: "Negative" },
];

export function getReviewSentimentLabel(
  sentiment: ReviewSentiment | string,
): string {
  return (
    ReviewSentimentFormOptions.find((option) => option.id === sentiment)
      ?.label ?? sentiment
  );
}
