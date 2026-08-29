import type { ReviewSentiment } from "@/features/reviews/interfaces/reviews.interfaces";
import { ReviewSentimentFormOptions } from "@/config/constants/dropdowns/reviews/review-sentiment-form.options";

export const ReviewSentimentFilterOptions: {
  id: ReviewSentiment | "all";
  label: string;
}[] = [{ id: "all", label: "All sentiments" }, ...ReviewSentimentFormOptions];
