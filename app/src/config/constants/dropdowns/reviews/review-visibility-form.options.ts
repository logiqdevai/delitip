import {
  ReviewVisibilities,
  type ReviewVisibility,
} from "@/features/reviews/interfaces/reviews.interfaces";

export const ReviewVisibilityFormOptions: {
  id: ReviewVisibility;
  label: string;
}[] = [
  { id: ReviewVisibilities.PRIVATE, label: "Private" },
  { id: ReviewVisibilities.PUBLIC, label: "Public" },
];

export function getReviewVisibilityLabel(
  visibility: ReviewVisibility | string,
): string {
  return (
    ReviewVisibilityFormOptions.find((option) => option.id === visibility)
      ?.label ?? visibility
  );
}
