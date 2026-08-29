export interface ReviewCategory {
  id: string;
  store_id: string;
  /** Json translation map (`{ EN: "...", ... }`) — create/update accept a plain string, reads return this map. */
  name: Record<string, string>;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewCategoryPayload {
  name: string;
  sort_order?: number;
}

export interface UpdateReviewCategoryPayload {
  name?: string;
  sort_order?: number;
  is_active?: boolean;
}
