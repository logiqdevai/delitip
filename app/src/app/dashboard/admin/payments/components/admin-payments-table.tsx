"use client";

import { type FC, useState } from "react";
import { useRouter } from "next/navigation";
import { Banknote, Info, Receipt, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ConfirmationDialog,
  useConfirmationDialog,
} from "@/components/ui/confirmation-dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { TipStatusFilterOptions } from "@/config/constants/dropdowns/tips/tip-status-filter.options";
import { getTipStatusLabel } from "@/config/constants/dropdowns/tips/tip-status-form.options";
import { useAdminTips } from "@/features/tips/hooks/use-tips";
import { useRunManualPayouts } from "@/features/payouts/hooks/use-payouts";
import type { Tip, TipStatus } from "@/features/tips/interfaces/tips.interfaces";
import { AdminStoreFilter } from "@/app/dashboard/admin/payments/components/admin-store-filter";
import { AdminPaymentFeesCell } from "@/app/dashboard/admin/payments/components/admin-payment-fees-cell";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import { Routes } from "@/routes/routes";

const ColumnHeaderWithTooltip: FC<{ label: string; explanation: string }> = ({
  label,
  explanation,
}) => (
  <span className="inline-flex items-center gap-1">
    {label}
    <Tooltip>
      <TooltipTrigger className="text-zinc-300 hover:text-zinc-500">
        <Info className="size-3" />
      </TooltipTrigger>
      <TooltipContent>{explanation}</TooltipContent>
    </Tooltip>
  </span>
);

const statusChipClass: Record<TipStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  CREATED: "bg-amber-50 text-amber-700",
  PROCESSING: "bg-sky-50 text-sky-700",
  COMPLETED: "bg-brand-50 text-brand-700",
  FAILED: "bg-red-50 text-red-700",
  CANCELLED: "bg-zinc-100 text-zinc-600",
  REFUNDED: "bg-zinc-100 text-zinc-600",
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const PAGE_LIMIT = 20;

// Only a settled payment with Viva's real fee confirmed can be paid out — the
// server enforces the same rule; the selection summary previews what it'll skip.
const isCompleted = (tip: Tip) => tip.status === "COMPLETED";
const isPayable = (tip: Tip) =>
  isCompleted(tip) && tip.payment_transaction?.processor_fee_confirmed === true;

const summarizeSelection = (selected: Tip[]) => {
  const payable = selected.filter(isPayable);
  const totals = new Map<string, number>();
  for (const tip of payable) {
    const net = tip.payment_transaction?.net_distributable_amount ?? 0;
    totals.set(tip.currency, (totals.get(tip.currency) ?? 0) + net);
  }
  return {
    payableCount: payable.length,
    notCompletedCount: selected.filter((tip) => !isCompleted(tip)).length,
    feeUnconfirmedCount: selected.filter(
      (tip) => isCompleted(tip) && !isPayable(tip),
    ).length,
    totalLabel:
      totals.size === 0
        ? formatMoney(0, "EUR")
        : Array.from(totals, ([currency, amount]) =>
            formatMoney(amount, currency as Tip["currency"]),
          ).join(" + "),
  };
};

export const AdminPaymentsTable: FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TipStatus | "all">("all");
  const [storeId, setStoreId] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Map<string, Tip>>(new Map());
  const payoutConfirm = useConfirmationDialog();
  const manualPayout = useRunManualPayouts();

  const query = {
    page,
    limit: PAGE_LIMIT,
    ...(search ? { search } : {}),
    ...(status !== "all" ? { status } : {}),
    ...(storeId ? { store_id: storeId } : {}),
    ...(dateFrom ? { date_from: dateFrom } : {}),
    ...(dateTo ? { date_to: dateTo } : {}),
  };

  const tipsQuery = useAdminTips(query);
  const tips = tipsQuery.data?.data ?? [];
  const pagination = tipsQuery.data?.pagination;

  const resetPage = () => setPage(1);

  const allOnPageSelected =
    tips.length > 0 && tips.every((tip) => selected.has(tip.id));
  const someOnPageSelected =
    !allOnPageSelected && tips.some((tip) => selected.has(tip.id));

  const toggleOne = (tip: Tip, checked: boolean) =>
    setSelected((current) => {
      const next = new Map(current);
      if (checked) next.set(tip.id, tip);
      else next.delete(tip.id);
      return next;
    });

  const toggleAllOnPage = (checked: boolean) =>
    setSelected((current) => {
      const next = new Map(current);
      for (const tip of tips) {
        if (checked) next.set(tip.id, tip);
        else next.delete(tip.id);
      }
      return next;
    });

  const selectionSummary = summarizeSelection(Array.from(selected.values()));
  const skippedCount =
    selectionSummary.notCompletedCount + selectionSummary.feeUnconfirmedCount;

  const confirmPayout = async () => {
    await manualPayout.mutateAsync({ tip_ids: Array.from(selected.keys()) });
    setSelected(new Map());
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-zinc-200/80 bg-zinc-50/60 px-4 py-2.5">
        <div className="flex items-center gap-1.5 pl-1 text-xs font-semibold text-zinc-500">
          <SlidersHorizontal className="size-3.5" />
          Filters
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-zinc-400" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              resetPage();
            }}
            placeholder="Customer, store, owner contact, or any ID"
            aria-label="Search payments"
            className="w-64 rounded-xl border-zinc-200 bg-white pl-8 font-medium text-ink-charcoal shadow-xs"
          />
        </div>
        <Select
          items={TipStatusFilterOptions.map((option) => ({
            label: option.label,
            value: option.id,
          }))}
          value={status}
          onValueChange={(value) => {
            if (value) {
              setStatus(value as TipStatus | "all");
              resetPage();
            }
          }}
        >
          <SelectTrigger className="min-w-36 rounded-xl border-zinc-200 bg-white px-3.5 font-medium text-ink-charcoal shadow-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="w-auto min-w-40">
            <SelectGroup>
              {TipStatusFilterOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <AdminStoreFilter
          value={storeId}
          onValueChange={(value) => {
            setStoreId(value);
            resetPage();
          }}
        />
        <DatePicker
          value={dateFrom}
          onChange={(value) => {
            setDateFrom(value);
            resetPage();
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
            resetPage();
          }}
          placeholder="To date"
          aria-label="To date"
          className="rounded-xl border-zinc-200 bg-white font-medium text-ink-charcoal shadow-xs"
        />
      </div>

      {tipsQuery.isPending ? (
        <TableSkeleton columns={9} />
      ) : tipsQuery.isError ? (
        <Empty className="border border-dashed border-zinc-200 bg-white px-4 py-16">
          <EmptyHeader>
            <EmptyTitle>Could not load payments</EmptyTitle>
            <EmptyDescription>{tipsQuery.error.message}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              variant="outline"
              onClick={() => void tipsQuery.refetch()}
            >
              Try again
            </Button>
          </EmptyContent>
        </Empty>
      ) : tips.length === 0 ? (
        <Empty className="border border-dashed border-zinc-200 bg-white px-4 py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Receipt />
            </EmptyMedia>
            <EmptyTitle>No payments found</EmptyTitle>
            <EmptyDescription>
              {search || status !== "all" || storeId || dateFrom || dateTo
                ? "No payments match your filters."
                : "No one has paid a tip yet."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          {selected.size > 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-200 bg-brand-50/60 px-4 py-2.5">
              <div className="space-y-0.5 text-sm">
                <p className="font-semibold text-brand-700">
                  {selected.size} payment{selected.size === 1 ? "" : "s"}{" "}
                  selected - {selectionSummary.payableCount} payable, total{" "}
                  {selectionSummary.totalLabel}
                </p>
                {skippedCount > 0 ? (
                  <p className="text-xs text-amber-700">
                    {skippedCount} will be skipped
                    {selectionSummary.notCompletedCount > 0
                      ? ` - ${selectionSummary.notCompletedCount} not completed`
                      : ""}
                    {selectionSummary.feeUnconfirmedCount > 0
                      ? `${selectionSummary.notCompletedCount > 0 ? "," : " -"} ${selectionSummary.feeUnconfirmedCount} fee not confirmed`
                      : ""}
                  </p>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelected(new Map())}
                >
                  Clear
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={
                    manualPayout.isPending || selectionSummary.payableCount === 0
                  }
                  onClick={payoutConfirm.openDialog}
                >
                  <Banknote data-icon="inline-start" className="size-3.5" />
                  Pay out selected
                </Button>
              </div>
            </div>
          ) : null}
          <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10 px-4">
                    <Checkbox
                      aria-label="Select all payments on this page"
                      checked={allOnPageSelected}
                      indeterminate={someOnPageSelected}
                      onCheckedChange={(checked) => toggleAllOnPage(checked)}
                    />
                  </TableHead>
                  <TableHead className="px-4">When</TableHead>
                  <TableHead className="px-4">Store</TableHead>
                  <TableHead className="px-4">Customer</TableHead>
                  <TableHead className="px-4">Employee</TableHead>
                  <TableHead className="px-4">
                    <ColumnHeaderWithTooltip
                      label="Tip amount"
                      explanation="The full amount the customer paid, before any fees are deducted."
                    />
                  </TableHead>
                  <TableHead className="px-4">
                    <ColumnHeaderWithTooltip
                      label="Fees"
                      explanation="Platform commission and payment processor fee taken out of this tip, each shown with its share of the tip amount, plus the combined total."
                    />
                  </TableHead>
                  <TableHead className="px-4">
                    <ColumnHeaderWithTooltip
                      label="Net"
                      explanation="What's left after platform and payment fees are deducted - the pool the store then splits with its employees."
                    />
                  </TableHead>
                  <TableHead className="px-4 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tips.map((tip) => (
                  <TableRow
                    key={tip.id}
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(Routes.dashboard.admin.paymentDetail(tip.id))
                    }
                  >
                    <TableCell
                      className="w-10 px-4 py-3.5"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Checkbox
                        aria-label="Select payment for payout"
                        checked={selected.has(tip.id)}
                        onCheckedChange={(checked) => toggleOne(tip, checked)}
                      />
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-zinc-500">
                      {formatDateTime(tip.paid_at ?? tip.created_at)}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-semibold text-ink-charcoal">
                      {tip.store?.name ?? "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-zinc-500">
                      {tip.customer_name ?? tip.customer_email ?? "Anonymous"}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-zinc-500">
                      {tip.employee?.full_name ?? "Store"}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-bold text-brand-700">
                      {formatMoney(tip.amount, tip.currency)}
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      <AdminPaymentFeesCell
                        paymentTransaction={tip.payment_transaction}
                        currency={tip.currency}
                      />
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-semibold text-ink-charcoal">
                      {tip.payment_transaction?.net_distributable_amount != null
                        ? formatMoney(tip.payment_transaction.net_distributable_amount, tip.currency)
                        : "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-right">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-caption font-bold",
                          statusChipClass[tip.status],
                        )}
                      >
                        {getTipStatusLabel(tip.status)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {pagination ? (
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-zinc-500">
                {pagination.total} payment{pagination.total === 1 ? "" : "s"}{" "}
                total - page {pagination.page} of{" "}
                {Math.max(pagination.total_pages, 1)}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!pagination.has_prev}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!pagination.has_next}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : null}
        </>
      )}
      <ConfirmationDialog
        state={payoutConfirm}
        title={`Pay out ${selectionSummary.payableCount} payment${selectionSummary.payableCount === 1 ? "" : "s"} (${selectionSummary.totalLabel}) now?`}
        description={`This sends real money to the recipients' bank accounts immediately, skipping the usual hold window.${skippedCount > 0 ? ` ${skippedCount} of the ${selected.size} selected will be skipped (${selectionSummary.notCompletedCount} not completed, ${selectionSummary.feeUnconfirmedCount} fee not confirmed).` : ""} Payments already paid out are skipped too. This cannot be undone.`}
        confirmLabel="Pay out now"
        variant="default"
        isPending={manualPayout.isPending}
        onConfirm={confirmPayout}
      />
    </div>
  );
};
