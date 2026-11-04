import type { DropdownOptionSource } from "@/hooks/use-dropdown-options";

// Viva EventTypeId values, as listed in the Viva merchant portal's webhook
// settings. Ids are strings because they are Select values / query params.
// For ids that are not listed, use the "dashboard.enums.webhookEventType.unknown"
// message ("Event {id}") as the fallback.
export const WebhookEventTypeFormOptions: DropdownOptionSource[] = [
  { id: "1796", labelKey: "dashboard.enums.webhookEventType.1796" },
  { id: "1797", labelKey: "dashboard.enums.webhookEventType.1797" },
  { id: "1798", labelKey: "dashboard.enums.webhookEventType.1798" },
  { id: "1799", labelKey: "dashboard.enums.webhookEventType.1799" },
  { id: "1800", labelKey: "dashboard.enums.webhookEventType.1800" },
  { id: "1802", labelKey: "dashboard.enums.webhookEventType.1802" },
  { id: "1803", labelKey: "dashboard.enums.webhookEventType.1803" },
  { id: "768", labelKey: "dashboard.enums.webhookEventType.768" },
  { id: "769", labelKey: "dashboard.enums.webhookEventType.769" },
  { id: "4865", labelKey: "dashboard.enums.webhookEventType.4865" },
  { id: "5632", labelKey: "dashboard.enums.webhookEventType.5632" },
  { id: "5633", labelKey: "dashboard.enums.webhookEventType.5633" },
  { id: "5634", labelKey: "dashboard.enums.webhookEventType.5634" },
  { id: "2054", labelKey: "dashboard.enums.webhookEventType.2054" },
  { id: "8193", labelKey: "dashboard.enums.webhookEventType.8193" },
  { id: "8448", labelKey: "dashboard.enums.webhookEventType.8448" },
];
