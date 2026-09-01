"use client";

import { type FC, useState } from "react";
import { RefreshCcw, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  ConfirmationDialog,
  useConfirmationDialog,
} from "@/components/ui/confirmation-dialog";
import { TablePagination } from "@/app/dashboard/payments/components/table-pagination";
import { useRefunds, useUpdateRefund } from "@/features/refunds/hooks/use-refunds";
import type {
  Refund,
  RefundStatus,
  RefundsQuery,
} from "@/features/refunds/interfaces/refunds.interfaces";
import { RefundStatusFilterOptions } from "@/config/constants/dropdowns/refunds/refund-status-filter.options";
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

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, { dateStyle: "medium" });
};

const userLabel = (
  user?: { first_name?: string | null; last_name?: string | null; email?: string | null } | null,
) => {
  if (!user) return "—";
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return name || user.email || "—";
};

export const RefundsTable: FC<{
  storeId: string;
  currency: Currency;
}> = ({ storeId, currency }) => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<RefundStatus | "all">("PENDING");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const query: RefundsQuery = {
    page,
    limit: 20,
    ...(status !== "all" ? { status } : {}),
    ...(dateFrom ? { date_from: dateFrom } : {}),
    ...(dateTo ? { date_to: dateTo } : {}),
  };

  const refundsQuery = useRefunds(storeId, query);
  const updateRefund = useUpdateRefund();
  const rejectConfirm = useConfirmationDialog();
  const [pendingReject, setPendingReject] = useState<Refund | null>(null);

  const refunds = refundsQuery.data?.data ?? [];
  const pagination = refundsQuery.data?.pagination;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-2.5">
        <div className="flex items-center gap-1.5 pl-1 text-xs font-semibold text-zinc-500">
          <SlidersHorizontal className="size-3.5" />
          Filters
        </div>
        <Select
          items={RefundStatusFilterOptions.map((option) => ({
            label: option.label,
            value: option.id,
          }))}
          value={status}
          onValueChange={(value) => {
            if (value) {
              setStatus(value as RefundStatus | "all");
              setPage(1);
            }
          }}
        >
          <SelectTrigger className="min-w-36 rounded-xl border-zinc-200 bg-white px-3.5 font-medium text-ink-charcoal shadow-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="w-auto min-w-40">
            <SelectGroup>
              {RefundStatusFilterOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <DatePicker
          value={dateFrom}
          onChange={(value) => {
            setDateFrom(value);
            setPage(1);
          }}
          placeholder="From date"
          aria-label="From date"
          className="rounded-xl border-zinc-200 bg-white font-medium text-ink-charcoal shadow-xs"
        />
        <span className="text-xs text-zinc-400">to</span>
        <DatePicker
          value={dateTo}
          onChange={(value) => {
            setDateTo(value);
            setPage(1);
          }}
          placeholder="To date"
          aria-label="To date"
          className="rounded-xl border-zinc-200 bg-white font-medium text-ink-charcoal shadow-xs"
        />
      </div>

      {refundsQuery.isPending ? (
        <TableSkeleton columns={6} />
      ) : refundsQuery.isError ? (
        <Empty className="border border-dashed border-zinc-200 bg-white py-16">
          <EmptyHeader>
            <EmptyTitle>Could not load refunds</EmptyTitle>
            <EmptyDescription>{refundsQuery.error.message}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              variant="outline"
              onClick={() => void refundsQuery.refetch()}
            >
              Try again
            </Button>
          </EmptyContent>
        </Empty>
      ) : refunds.length === 0 ? (
        <Empty className="border border-dashed border-zinc-200 bg-white py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <RefreshCcw />
            </EmptyMedia>
            <EmptyTitle>No refund requests here</EmptyTitle>
            <EmptyDescription>
              Nothing matches these filters right now.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-zinc-200/80 bg-white shadow-xs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">When</TableHead>
                  <TableHead className="px-4">Amount</TableHead>
                  <TableHead className="px-4">Reason</TableHead>
                  <TableHead className="px-4">Status</TableHead>
                  <TableHead className="px-4">Requested by</TableHead>
                  <TableHead className="px-4">Processed by</TableHead>
                  <TableHead className="px-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {refunds.map((refund) => (
                  <TableRow key={refund.id}>
                    <TableCell className="px-4 py-3.5 whitespace-nowrap text-zinc-500">
                      {formatDate(refund.created_at)}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-bold text-ink-charcoal">
                      {formatMoney(refund.amount, currency)}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-zinc-500">
                      {refund.reason || "No reason given"}
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold",
                            statusChipClass[refund.status],
                          )}
                        >
                          {getRefundStatusLabel(refund.status)}
                        </span>
                        {refund.requires_manual_reconciliation ? (
                          <span
                            className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700"
                            title="Some of this tip's distributions were already paid out — IBAN transfers can't be clawed back automatically."
                          >
                            Needs reconciliation
                          </span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3.5 whitespace-nowrap text-zinc-500">
                      {userLabel(refund.requested_by)}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 whitespace-nowrap text-zinc-500">
                      {userLabel(refund.processed_by)}
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-2">
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            page={pagination?.page ?? 1}
            totalPages={pagination?.total_pages ?? 1}
            onPageChange={setPage}
          />
        </>
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
