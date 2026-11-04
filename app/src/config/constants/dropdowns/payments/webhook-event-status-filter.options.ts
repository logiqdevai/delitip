import type { WebhookEventStatus } from "@/features/webhook-events/interfaces/webhook-events.interfaces";
import { WebhookEventStatusFormOptions } from "@/config/constants/dropdowns/payments/webhook-event-status-form.options";
import type { DropdownOptionSource } from "@/hooks/use-dropdown-options";

export const WebhookEventStatusFilterOptions: DropdownOptionSource<WebhookEventStatus>[] =
  [
    { id: "all", labelKey: "dashboard.enums.webhookEventStatus.all" },
    ...WebhookEventStatusFormOptions,
  ];
