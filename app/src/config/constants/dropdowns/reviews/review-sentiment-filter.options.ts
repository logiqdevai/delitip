import type { ReviewSentiment } from "@/features/reviews/interfaces/reviews.interfaces";
import { ReviewSentimentFormOptions } from "@/config/constants/dropdowns/reviews/review-sentiment-form.options";
import type { DropdownOptionSource } from "@/hooks/use-dropdown-options";

export const ReviewSentimentFilterOptions: DropdownOptionSource<ReviewSentiment>[] =
  [
    { id: "all", labelKey: "dashboard.enums.reviewSentiment.all" },
    ...ReviewSentimentFormOptions,
  ];
