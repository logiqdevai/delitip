// Viva EventTypeId values, as listed in the Viva merchant portal's webhook
// settings. Ids are strings because they are Select values / query params.
export const WebhookEventTypeFormOptions: { id: string; label: string }[] = [
  { id: "1796", label: "Transaction Payment Created" },
  { id: "1797", label: "Transaction Reversal Created" },
  { id: "1798", label: "Transaction Failed" },
  { id: "1799", label: "Transaction Price Calculated" },
  { id: "1800", label: "Transaction Payment Method Session Created" },
  { id: "1802", label: "Transaction POS ECR Session Completed" },
  { id: "1803", label: "Transaction POS ECR Session Failed" },
  { id: "768", label: "Command Bank Transfer Created" },
  { id: "769", label: "Command Bank Transfer Executed" },
  { id: "4865", label: "Order Updated" },
  { id: "5632", label: "Obligation Created" },
  { id: "5633", label: "Obligation Captured" },
  { id: "5634", label: "Obligation Cancelled" },
  { id: "2054", label: "Account Transaction Created" },
  { id: "8193", label: "Account Connected" },
  { id: "8448", label: "Transfer Created" },
];

export function getWebhookEventTypeLabel(
  eventTypeId: number | string | null | undefined,
): string {
  if (eventTypeId == null) return "";
  return (
    WebhookEventTypeFormOptions.find(
      (option) => option.id === String(eventTypeId),
    )?.label ?? `Event ${eventTypeId}`
  );
}
