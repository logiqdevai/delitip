export const FeedbackQuestionTypes = {
  RATING: "RATING",
  TEXT: "TEXT",
} as const;
export type FeedbackQuestionType =
  (typeof FeedbackQuestionTypes)[keyof typeof FeedbackQuestionTypes];

export interface FeedbackQuestion {
  id: string;
  store_id: string;
  /** Json translation map — create/update accept a plain string, reads return this map. */
  question: Record<string, string>;
  type: FeedbackQuestionType;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateFeedbackQuestionPayload {
  question: string;
  type?: FeedbackQuestionType;
  sort_order?: number;
}

export interface UpdateFeedbackQuestionPayload {
  question?: string;
  type?: FeedbackQuestionType;
  sort_order?: number;
  is_active?: boolean;
}
