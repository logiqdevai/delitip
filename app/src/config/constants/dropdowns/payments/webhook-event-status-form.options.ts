import {
  WebhookEventStatuses,
  type WebhookEventStatus,
} from "@/features/webhook-events/interfaces/webhook-events.interfaces";

export const WebhookEventStatusFormOptions: {
  id: WebhookEventStatus;
  labelKey: string;
}[] = [
  {
    id: WebhookEventStatuses.PROCESSED,
    labelKey: "dashboard.enums.webhookEventStatus.PROCESSED",
  },
  {
    id: WebhookEventStatuses.FAILED,
    labelKey: "dashboard.enums.webhookEventStatus.FAILED",
  },
  {
    id: WebhookEventStatuses.PENDING,
    labelKey: "dashboard.enums.webhookEventStatus.PENDING",
  },
];
