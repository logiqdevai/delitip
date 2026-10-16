"use client";

import { type FC, useState } from "react";
import { FileText, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  ConfirmationDialog,
  useConfirmationDialog,
} from "@/components/ui/confirmation-dialog";
import {
  useCancelPayoutRequest,
  useOpenStorePayoutRequestInvoice,
  useStorePayoutRequests,
} from "@/features/payout-requests/hooks/use-payout-requests";
import {
  PayoutRequestStatuses,
  type PayoutRequest,
  type PayoutRequestStatus,
} from "@/features/payout-requests/interfaces/payout-requests.interfaces";
import { getPayoutRequestStatusLabel } from "@/config/constants/dropdowns/payouts/payout-request-status-form.options";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

const statusChipClass: Record<PayoutRequestStatus, string> = {
  PENDING_REVIEW: "bg-amber-50 text-amber-700",
  APPROVED: "bg-sky-50 text-sky-700",
  REJECTED: "bg-red-50 text-red-700",
  CANCELLED: "bg-zinc-100 text-zinc-600",
};

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString(undefined, { dateStyle: "medium" });
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

// An approved request whose payout completed is simply "Paid" to the store;
// the request status itself never changes (the webhook owns the payout).
const resolveStatus = (request: PayoutRequest) => {
  if (
    request.status === PayoutRequestStatuses.APPROVED &&
    request.payout?.status === "COMPLETED"
  ) {
    return { label: "Paid", className: "bg-brand-50 text-brand-700" };
  }
  return {
    label: getPayoutRequestStatusLabel(request.status),
    className: statusChipClass[request.status],
  };
};

export const PayoutRequestsTable: FC<{
  storeId: string;
  canCancel: boolean;
}> = ({ storeId, canCancel }) => {
  const requestsQuery = useStorePayoutRequests(storeId, { limit: 20 });
  const cancelRequest = useCancelPayoutRequest(storeId);
  const openInvoice = useOpenStorePayoutRequestInvoice(storeId);
  const cancelConfirm = useConfirmationDialog();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const requests = requestsQuery.data?.data ?? [];

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-sm font-bold text-ink-charcoal">Payout requests</h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          Invoices you submitted to be paid your tips, and how each was
          reviewed.
        </p>
      </div>

      {requestsQuery.isPending ? (
        <TableSkeleton columns={5} />
      ) : requestsQuery.isError ? (
        <Empty className="border border-dashed border-zinc-200 bg-white py-12">
          <EmptyHeader>
            <EmptyTitle>Could not load payout requests</EmptyTitle>
            <EmptyDescription>{requestsQuery.error.message}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : requests.length === 0 ? (
        <Empty className="border border-dashed border-zinc-200 bg-white py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ReceiptText />
            </EmptyMedia>
            <EmptyTitle>No payout requests yet</EmptyTitle>
            <EmptyDescription>
              Press Request payout on the Payments tab once you have eligible
              tips.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4">Submitted</TableHead>
                <TableHead className="px-4">Amount</TableHead>
                <TableHead className="px-4">Tips covered</TableHead>
                <TableHead className="px-4">Status</TableHead>
                <TableHead className="px-4 text-right">Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => {
                const status = resolveStatus(request);
                const note = request.admin_note ?? request.failure_reason;
                return (
                  <TableRow key={request.id}>
                    <TableCell className="px-4 py-3.5 text-zinc-500">
                      {formatDateTime(request.created_at)}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-bold text-ink-charcoal">
                      {formatMoney(request.amount, request.currency)}
                      {request.held_for_staff_amount > 0 ? (
                        <span className="mt-0.5 block text-[11px] font-medium text-zinc-500">
                          {formatMoney(request.held_for_staff_amount, request.currency)}{" "}
                          held for staff
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-zinc-500">
                      {request.distribution_count} · {formatDate(request.period_from)}{" "}
                      → {formatDate(request.period_to)}
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-caption font-bold",
                          status.className,
                        )}
                      >
                        {status.label}
                      </span>
                      {note ? (
                        <p className="mt-1 max-w-xs text-[11px] leading-snug text-zinc-500">
                          {note}
                        </p>
                      ) : null}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 rounded-full px-3 text-xs font-semibold"
                          disabled={openInvoice.isPending}
                          onClick={() => openInvoice.mutate(request.id)}
                        >
                          <FileText data-icon="inline-start" className="size-3.5" />
                          View
                        </Button>
                        {canCancel &&
                        request.status === PayoutRequestStatuses.PENDING_REVIEW ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 rounded-full px-3 text-xs font-semibold text-zinc-600 hover:text-red-700"
                            onClick={() => {
                              setCancellingId(request.id);
                              cancelConfirm.openDialog();
                            }}
                          >
                            Cancel
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <ConfirmationDialog
        state={cancelConfirm}
        title="Cancel this payout request?"
        description="Your tips are released immediately and you can submit a new request with a new invoice."
        confirmLabel="Cancel request"
        cancelLabel="Keep it"
        isPending={cancelRequest.isPending}
        onConfirm={async () => {
          if (!cancellingId) return;
          await cancelRequest.mutateAsync(cancellingId);
          setCancellingId(null);
        }}
      />
    </div>
  );
};
