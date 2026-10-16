import {
  InvoiceCheckStatuses,
  InvoiceCheckVerdicts,
  type InvoiceCheckStatus,
  type InvoiceCheckVerdict,
} from "@/features/payout-requests/interfaces/payout-requests.interfaces";

export const InvoiceCheckVerdictFormOptions: {
  id: InvoiceCheckVerdict;
  label: string;
}[] = [
  { id: InvoiceCheckVerdicts.MATCH, label: "Looks correct" },
  { id: InvoiceCheckVerdicts.MISMATCH, label: "Mismatch found" },
  { id: InvoiceCheckVerdicts.UNREADABLE, label: "Could not read" },
];

export function getInvoiceCheckVerdictLabel(
  verdict: InvoiceCheckVerdict | string,
): string {
  return (
    InvoiceCheckVerdictFormOptions.find((option) => option.id === verdict)
      ?.label ?? verdict
  );
}

// What to show while there is no verdict yet (or never will be).
export const InvoiceCheckStatusLabels: Record<InvoiceCheckStatus, string> = {
  [InvoiceCheckStatuses.PENDING]: "Checking…",
  [InvoiceCheckStatuses.COMPLETED]: "Checked",
  [InvoiceCheckStatuses.FAILED]: "Check failed",
  [InvoiceCheckStatuses.SKIPPED]: "Not checked",
};

// One label for the chip: the verdict when the check finished, otherwise the
// state of the check itself.
export function getInvoiceCheckLabel(
  status: InvoiceCheckStatus,
  verdict: InvoiceCheckVerdict | null,
): string {
  if (status === InvoiceCheckStatuses.COMPLETED && verdict) {
    return getInvoiceCheckVerdictLabel(verdict);
  }
  return InvoiceCheckStatusLabels[status] ?? status;
}
