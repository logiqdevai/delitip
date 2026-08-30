export const ReviewSentiments = {
  POSITIVE: "POSITIVE",
  NEUTRAL: "NEUTRAL",
  NEGATIVE: "NEGATIVE",
} as const;
export type ReviewSentiment =
  (typeof ReviewSentiments)[keyof typeof ReviewSentiments];

export interface ReviewEmployeeRef {
  id: string;
  full_name: string;
}

export interface ReviewTagRef {
  id: string;
  name: string;
  sentiment?: ReviewSentiment | null;
}

export interface ReviewTagAssignment {
  review_tag: ReviewTagRef;
}

export interface ReviewCategoryRating {
  review_category_id: string;
  rating: number;
  review_category?: { id: string; name: string } | null;
}

export interface ReviewFeedbackResponse {
  feedback_question_id: string;
  rating_value?: number | null;
  text_value?: string | null;
  feedback_question?: { id: string; question: string } | null;
}

export interface Review {
  id: string;
  store_id: string;
  tip_id?: string | null;
  employee_id?: string | null;
  customer_user_id?: string | null;
  customer_email?: string | null;
  customer_name?: string | null;
  rating: number;
  comment?: string | null;
  sentiment?: ReviewSentiment | null;
  redirected_to_public_platform: boolean;
  created_at: string;
  updated_at: string;
  employee?: ReviewEmployeeRef | null;
  tags?: ReviewTagAssignment[];
  category_ratings?: ReviewCategoryRating[];
  feedback_responses?: ReviewFeedbackResponse[];
}

export interface ReviewsQuery {
  page?: number;
  limit?: number;
  employee_id?: string;
  min_rating?: number;
  search?: string;
}

export interface UpdateReviewPayload {
  tag_ids?: string[];
}

export interface CreatePublicReviewPayload {
  store_id: string;
  tip_id?: string;
  employee_id?: string;
  rating: number;
  comment?: string;
  customer_email?: string;
  customer_name?: string;
  category_ratings?: { review_category_id: string; rating: number }[];
  feedback_responses?: {
    feedback_question_id: string;
    rating_value?: number;
    text_value?: string;
  }[];
}

export interface CreatePublicReviewResponse {
  review: Review;
  redirect: { should_redirect: boolean; url: string | null };
  message: string;
}

export interface PublicReviewConfig {
  review_categories: { id: string; name: string; sort_order: number }[];
  feedback_questions: {
    id: string;
    question: string;
    type: string;
    sort_order: number;
  }[];
  public_review_rating_threshold: number | null;
}
