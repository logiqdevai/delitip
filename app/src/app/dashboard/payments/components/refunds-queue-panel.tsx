"use client";

import { type FC, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ConfirmationDialog,
  useConfirmationDialog,
} from "@/components/ui/confirmation-dialog";
import { useRefunds, useUpdateRefund } from "@/features/refunds/hooks/use-refunds";
import type {
  Refund,
  RefundStatus,
} from "@/features/refunds/interfaces/refunds.interfaces";
import { getRefundStatusLabel } from "@/config/constants/dropdowns/refunds/refund-status-form.options";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

const statusChipClass: Record<RefundStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  APPROVED: "bg-brand-50 text-brand-700",
  REJECTED: "bg-red-50 text-red-700",
  COMPLETED: "bg-zinc-100 text-zinc-600",
};

export const RefundsQueuePanel: FC<{
  storeId: string;
  currency: Currency;
}> = ({ storeId, currency }) => {
  const [status, setStatus] = useState<RefundStatus | "all">("PENDING");
  const refundsQuery = useRefunds(storeId, {
    limit: 50,
    ...(status !== "all" ? { status } : {}),
  });
  const updateRefund = useUpdateRefund();
  const rejectConfirm = useConfirmationDialog();
  const [pendingReject, setPendingReject] = useState<Refund | null>(null);

  const refunds = refundsQuery.data?.data ?? [];

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-ink-charcoal">Refunds queue</h2>
        <Select
          items={[
            { label: "Pending", value: "PENDING" },
            { label: "Approved", value: "APPROVED" },
            { label: "Rejected", value: "REJECTED" },
            { label: "Completed", value: "COMPLETED" },
            { label: "All", value: "all" },
          ]}
          value={status}
          onValueChange={(value) => {
            if (value) setStatus(value as RefundStatus | "all");
          }}
        >
          <SelectTrigger className="min-w-32 rounded-xl border-zinc-200 bg-white px-3.5 font-medium text-ink-charcoal shadow-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="w-auto min-w-36">
            <SelectGroup>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {refundsQuery.isPending ? (
        <Skeleton className="mt-3 h-24 w-full rounded-xl" />
      ) : refundsQuery.isError ? (
        <p className="mt-3 text-xs text-red-600">{refundsQuery.error.message}</p>
      ) : refunds.length === 0 ? (
        <p className="mt-3 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 py-6 text-center text-xs text-zinc-500">
          No refund requests here.
        </p>
      ) : (
        <div className="mt-3 divide-y divide-zinc-100">
          {refunds.map((refund) => (
            <div
              key={refund.id}
              className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
            >
              <div>
                <div className="font-semibold text-ink-charcoal">
                  {formatMoney(refund.amount, currency)}
                </div>
                <div className="text-xs text-zinc-500">
                  {refund.reason || "No reason given"}
                </div>
                <div className="text-[10px] text-zinc-400">
                  {format(new Date(refund.created_at), "MMM d, yyyy")}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-bold",
                    statusChipClass[refund.status],
                  )}
                >
                  {getRefundStatusLabel(refund.status)}
                </span>
                {refund.status === "PENDING" ? (
                  <>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() =>
                        updateRefund.mutate({
                          id: refund.id,
                          payload: { status: "APPROVED" },
                        })
                      }
                      disabled={updateRefund.isPending}
                    >
                      Approve
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setPendingReject(refund);
                        rejectConfirm.openDialog();
                      }}
                      disabled={updateRefund.isPending}
                    >
                      Reject
                    </Button>
                  </>
                ) : null}
                {refund.status === "APPROVED" ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() =>
                      updateRefund.mutate({
                        id: refund.id,
                        payload: { status: "COMPLETED" },
                      })
                    }
                    disabled={updateRefund.isPending}
                  >
                    Mark completed
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmationDialog
        state={{
          ...rejectConfirm,
          onOpenChange: (open) => {
            rejectConfirm.onOpenChange(open);
            if (!open) setPendingReject(null);
          },
        }}
        title="Reject this refund request?"
        description={
          pendingReject
            ? `${formatMoney(pendingReject.amount, currency)} will not be refunded. This can't be undone.`
            : "This refund request will be rejected."
        }
        confirmLabel="Reject"
        isPending={updateRefund.isPending}
        onConfirm={async () => {
          if (!pendingReject) return;
          await updateRefund.mutateAsync({
            id: pendingReject.id,
            payload: { status: "REJECTED" },
          });
          setPendingReject(null);
        }}
      />
    </div>
  );
};
