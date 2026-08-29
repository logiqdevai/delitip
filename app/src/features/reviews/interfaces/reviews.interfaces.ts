export const ReviewVisibilities = {
  PRIVATE: "PRIVATE",
  PUBLIC: "PUBLIC",
} as const;
export type ReviewVisibility =
  (typeof ReviewVisibilities)[keyof typeof ReviewVisibilities];

export const ReviewSentiments = {
  POSITIVE: "POSITIVE",
  NEUTRAL: "NEUTRAL",
  NEGATIVE: "NEGATIVE",
} as const;
export type ReviewSentiment =
  (typeof ReviewSentiments)[keyof typeof ReviewSentiments];

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
  visibility: ReviewVisibility;
  sentiment?: ReviewSentiment | null;
  redirected_to_public_platform: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReviewsQuery {
  page?: number;
  limit?: number;
  employee_id?: string;
  rating?: number;
  visibility?: ReviewVisibility;
  sentiment?: ReviewSentiment;
  date_from?: string;
  date_to?: string;
}

export interface UpdateReviewPayload {
  visibility?: ReviewVisibility;
  comment?: string;
}

export interface CreatePublicReviewPayload {
  store_slug: string;
  tip_id?: string;
  employee_id?: string;
  rating: number;
  comment?: string;
  customer_email?: string;
  customer_name?: string;
  category_ratings?: { category_id: string; rating: number }[];
  feedback_responses?: { question_id: string; answer: string }[];
  tag_ids?: string[];
}

export interface PublicReviewConfig {
  rating_threshold: number;
  redirect_url?: string | null;
  categories: { id: string; name: string }[];
  tags: { id: string; name: string }[];
  feedback_questions: {
    id: string;
    question: string;
    type: string;
  }[];
}
