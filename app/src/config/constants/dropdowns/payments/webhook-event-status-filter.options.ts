import type { WebhookEventStatus } from "@/features/webhook-events/interfaces/webhook-events.interfaces";
import { WebhookEventStatusFormOptions } from "@/config/constants/dropdowns/payments/webhook-event-status-form.options";

export const WebhookEventStatusFilterOptions: {
  id: WebhookEventStatus | "all";
  label: string;
}[] = [{ id: "all", label: "All statuses" }, ...WebhookEventStatusFormOptions];
