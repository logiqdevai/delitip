export interface Spot {
  id: string;
  store_id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSpotPayload {
  name: string;
}

export interface UpdateSpotPayload {
  name?: string;
  is_active?: boolean;
}

export interface SpotsQuery {
  page?: number;
  limit?: number;
  is_active?: boolean;
}
