import {
  InvoiceCheckStatuses,
  InvoiceCheckVerdicts,
  type InvoiceCheckStatus,
  type InvoiceCheckVerdict,
} from "@/features/payout-requests/interfaces/payout-requests.interfaces";

export const InvoiceCheckVerdictFormOptions: {
  id: InvoiceCheckVerdict;
  labelKey: string;
}[] = [
  {
    id: InvoiceCheckVerdicts.MATCH,
    labelKey: "dashboard.enums.invoiceCheckVerdict.MATCH",
  },
  {
    id: InvoiceCheckVerdicts.MISMATCH,
    labelKey: "dashboard.enums.invoiceCheckVerdict.MISMATCH",
  },
  {
    id: InvoiceCheckVerdicts.UNREADABLE,
    labelKey: "dashboard.enums.invoiceCheckVerdict.UNREADABLE",
  },
];

// What to show while there is no verdict yet (or never will be). The chip shows
// the verdict when status is COMPLETED and a verdict exists, otherwise the status.
export const InvoiceCheckStatusOptions: {
  id: InvoiceCheckStatus;
  labelKey: string;
}[] = [
  {
    id: InvoiceCheckStatuses.PENDING,
    labelKey: "dashboard.enums.invoiceCheckStatus.PENDING",
  },
  {
    id: InvoiceCheckStatuses.COMPLETED,
    labelKey: "dashboard.enums.invoiceCheckStatus.COMPLETED",
  },
  {
    id: InvoiceCheckStatuses.FAILED,
    labelKey: "dashboard.enums.invoiceCheckStatus.FAILED",
  },
  {
    id: InvoiceCheckStatuses.SKIPPED,
    labelKey: "dashboard.enums.invoiceCheckStatus.SKIPPED",
  },
];
