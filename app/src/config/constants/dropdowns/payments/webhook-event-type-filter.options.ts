import { WebhookEventTypeFormOptions } from "@/config/constants/dropdowns/payments/webhook-event-type-form.options";

export const WebhookEventTypeFilterOptions: { id: string; label: string }[] = [
  { id: "all", label: "All event types" },
  ...WebhookEventTypeFormOptions,
];
