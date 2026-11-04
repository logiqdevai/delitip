import type { DropdownOptionSource } from "@/hooks/use-dropdown-options";
import { WebhookEventTypeFormOptions } from "@/config/constants/dropdowns/payments/webhook-event-type-form.options";

export const WebhookEventTypeFilterOptions: DropdownOptionSource[] = [
  { id: "all", labelKey: "dashboard.enums.webhookEventType.all" },
  ...WebhookEventTypeFormOptions,
];
