"use client";

import { type FC } from "react";
import {
  InvoiceCheckStatuses,
  PayoutRequestStatuses,
  type InvoiceCheckStatus,
  type InvoiceCheckVerdict,
  type PayoutRequestStatus,
} from "@/features/payout-requests/interfaces/payout-requests.interfaces";
import type { PayoutExecutionStatus } from "@/features/payouts/interfaces/payouts.interfaces";
import { getPayoutRequestStatusLabel } from "@/config/constants/dropdowns/payouts/payout-request-status-form.options";
import { getInvoiceCheckLabel } from "@/config/constants/dropdowns/payouts/invoice-check-verdict-form.options";
import { cn } from "@/lib/utils";

// Chip colour maps stay with the component; the text comes from dropdowns.
const statusChipClass: Record<PayoutRequestStatus, string> = {
  PENDING_REVIEW: "bg-amber-50 text-amber-700",
  APPROVED: "bg-sky-50 text-sky-700",
  REJECTED: "bg-red-50 text-red-700",
  CANCELLED: "bg-zinc-100 text-zinc-600",
};

const verdictChipClass: Record<InvoiceCheckVerdict, string> = {
  MATCH: "bg-brand-50 text-brand-700",
  MISMATCH: "bg-red-50 text-red-700",
  UNREADABLE: "bg-zinc-100 text-zinc-600",
};

const checkStatusChipClass: Record<InvoiceCheckStatus, string> = {
  PENDING: "bg-sky-50 text-sky-700",
  COMPLETED: "bg-zinc-100 text-zinc-600",
  FAILED: "bg-amber-50 text-amber-700",
  SKIPPED: "bg-zinc-100 text-zinc-600",
};

export const PayoutRequestStatusChip: FC<{
  status: PayoutRequestStatus;
  payoutStatus: PayoutExecutionStatus | null;
  failureReason?: string | null;
  size?: "sm" | "md";
}> = ({ status, payoutStatus, failureReason, size = "sm" }) => {
  // APPROVED + payout COMPLETED reads as "Paid"; a PENDING_REVIEW request
  // with a failure_reason had a transfer bounce and needs a retry.
  const paid =
    status === PayoutRequestStatuses.APPROVED && payoutStatus === "COMPLETED";
  const retry = status === PayoutRequestStatuses.PENDING_REVIEW && !!failureReason;

  return (
    <span
      title={failureReason ?? undefined}
      className={cn(
        "rounded-full font-bold",
        size === "sm" ? "px-2 py-0.5 text-caption" : "px-3 py-1 text-caption",
        paid
          ? "bg-brand-50 text-brand-700"
          : retry
            ? "bg-red-50 text-red-700"
            : statusChipClass[status],
      )}
    >
      {paid ? "Paid" : retry ? "Transfer failed" : getPayoutRequestStatusLabel(status)}
    </span>
  );
};

export const InvoiceCheckChip: FC<{
  status: InvoiceCheckStatus;
  verdict: InvoiceCheckVerdict | null;
  size?: "sm" | "md";
}> = ({ status, verdict, size = "sm" }) => {
  const className =
    status === InvoiceCheckStatuses.COMPLETED && verdict
      ? verdictChipClass[verdict]
      : checkStatusChipClass[status];

  return (
    <span
      className={cn(
        "rounded-full font-bold",
        size === "sm" ? "px-2 py-0.5 text-caption" : "px-3 py-1 text-caption",
        className,
      )}
    >
      {getInvoiceCheckLabel(status, verdict)}
    </span>
  );
};
