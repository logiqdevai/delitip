export const ReviewTagSentiments = {
  POSITIVE: "POSITIVE",
  NEUTRAL: "NEUTRAL",
  NEGATIVE: "NEGATIVE",
} as const;
export type ReviewTagSentiment =
  (typeof ReviewTagSentiments)[keyof typeof ReviewTagSentiments];

export interface ReviewTag {
  id: string;
  store_id: string;
  name: string;
  sentiment?: ReviewTagSentiment | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewTagPayload {
  name: string;
  sentiment?: ReviewTagSentiment;
}

export interface UpdateReviewTagPayload {
  name?: string;
  sentiment?: ReviewTagSentiment;
  is_active?: boolean;
}
