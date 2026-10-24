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
// server enforces the same rule; this just keeps unpayable rows unselectable.
const isPayable = (tip: Tip) =>
  tip.status === "COMPLETED" &&
  tip.payment_transaction?.processor_fee_confirmed === true;

export const AdminPaymentsTable: FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TipStatus | "all">("all");
  const [storeId, setStoreId] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
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

  const payableOnPage = tips.filter(isPayable);
  const allOnPageSelected =
    payableOnPage.length > 0 &&
    payableOnPage.every((tip) => selectedIds.has(tip.id));
  const someOnPageSelected =
    !allOnPageSelected && payableOnPage.some((tip) => selectedIds.has(tip.id));

  const toggleOne = (tipId: string, checked: boolean) =>
    setSelectedIds((current) => {
      const next = new Set(current);
      if (checked) next.add(tipId);
      else next.delete(tipId);
      return next;
    });

  const toggleAllOnPage = (checked: boolean) =>
    setSelectedIds((current) => {
      const next = new Set(current);
      for (const tip of payableOnPage) {
        if (checked) next.add(tip.id);
        else next.delete(tip.id);
      }
      return next;
    });

  const confirmPayout = async () => {
    await manualPayout.mutateAsync({ tip_ids: Array.from(selectedIds) });
    setSelectedIds(new Set());
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
            placeholder="Customer, store, or payment ID"
            aria-label="Search payments"
            className="w-48 rounded-xl border-zinc-200 bg-white pl-8 font-medium text-ink-charcoal shadow-xs"
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
          {selectedIds.size > 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-200 bg-brand-50/60 px-4 py-2.5">
              <p className="text-sm font-semibold text-brand-700">
                {selectedIds.size} payment{selectedIds.size === 1 ? "" : "s"}{" "}
                selected
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedIds(new Set())}
                >
                  Clear
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={manualPayout.isPending}
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
                      aria-label="Select all payable payments on this page"
                      checked={allOnPageSelected}
                      indeterminate={someOnPageSelected}
                      disabled={payableOnPage.length === 0}
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
                        checked={selectedIds.has(tip.id)}
                        disabled={!isPayable(tip)}
                        onCheckedChange={(checked) => toggleOne(tip.id, checked)}
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
        title={`Pay out ${selectedIds.size} payment${selectedIds.size === 1 ? "" : "s"} now?`}
        description="This sends real money to the recipients' bank accounts immediately, skipping the usual hold window. Payments whose fee isn't confirmed, or that are already paid out, are skipped. This cannot be undone."
        confirmLabel="Pay out now"
        variant="default"
        isPending={manualPayout.isPending}
        onConfirm={confirmPayout}
      />
    </div>
  );
};
