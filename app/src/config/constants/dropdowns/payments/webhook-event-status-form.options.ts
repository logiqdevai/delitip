import {
  WebhookEventStatuses,
  type WebhookEventStatus,
} from "@/features/webhook-events/interfaces/webhook-events.interfaces";

export const WebhookEventStatusFormOptions: {
  id: WebhookEventStatus;
  label: string;
}[] = [
  { id: WebhookEventStatuses.PROCESSED, label: "Processed" },
  { id: WebhookEventStatuses.FAILED, label: "Failed" },
  { id: WebhookEventStatuses.PENDING, label: "Pending" },
];

export function getWebhookEventStatusLabel(
  status: WebhookEventStatus | string,
): string {
  return (
    WebhookEventStatusFormOptions.find((option) => option.id === status)
      ?.label ?? status
  );
}
