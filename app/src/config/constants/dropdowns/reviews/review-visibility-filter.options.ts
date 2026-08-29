import type { ReviewVisibility } from "@/features/reviews/interfaces/reviews.interfaces";
import { ReviewVisibilityFormOptions } from "@/config/constants/dropdowns/reviews/review-visibility-form.options";

export const ReviewVisibilityFilterOptions: {
  id: ReviewVisibility | "all";
  label: string;
}[] = [{ id: "all", label: "All visibility" }, ...ReviewVisibilityFormOptions];
