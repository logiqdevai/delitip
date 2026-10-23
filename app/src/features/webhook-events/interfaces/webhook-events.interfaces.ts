export const WebhookEventStatuses = {
  PROCESSED: "PROCESSED",
  FAILED: "FAILED",
  PENDING: "PENDING",
} as const;
export type WebhookEventStatus =
  (typeof WebhookEventStatuses)[keyof typeof WebhookEventStatuses];

export interface WebhookEvent {
  id: string;
  provider: string;
  message_id: string;
  event_type_id: number;
  payload: Record<string, unknown>;
  processed_at: string | null;
  processing_error: string | null;
  created_at: string;
}

export interface AdminWebhookEventsQuery {
  page?: number;
  limit?: number;
  event_type_id?: string;
  status?: WebhookEventStatus;
  search?: string;
  date_from?: string;
  date_to?: string;
}
