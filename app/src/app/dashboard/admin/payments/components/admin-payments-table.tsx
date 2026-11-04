"use client";

import { type FC, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormatter, useLocale, useTranslations } from "next-intl";
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
import { TipStatusFormOptions } from "@/config/constants/dropdowns/tips/tip-status-form.options";
import { useDropdownLabel, useDropdownOptions } from "@/hooks/use-dropdown-options";
import { useAdminTips } from "@/features/tips/hooks/use-tips";
import { useRunManualPayouts } from "@/features/payouts/hooks/use-payouts";
import type { Tip, TipStatus } from "@/features/tips/interfaces/tips.interfaces";
import { AdminStoreFilter } from "@/app/dashboard/admin/payments/components/admin-store-filter";
import { AdminPaymentFeesCell } from "@/app/dashboard/admin/payments/components/admin-payment-fees-cell";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import { Routes } from "@/routes/routes";
import { getErrorMessage } from "@/lib/api-error";

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

const PAGE_LIMIT = 20;

// Only a settled payment with Viva's real fee confirmed can be paid out — the
// server enforces the same rule; the selection summary previews what it'll skip.
const isCompleted = (tip: Tip) => tip.status === "COMPLETED";
const isPayable = (tip: Tip) =>
  isCompleted(tip) && tip.payment_transaction?.processor_fee_confirmed === true;

const summarizeSelection = (
  selected: Tip[],
  money: (amount: number, currency: Tip["currency"]) => string,
) => {
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
        ? money(0, "EUR")
        : Array.from(totals, ([currency, amount]) =>
            money(amount, currency as Tip["currency"]),
          ).join(" + "),
  };
};

export const AdminPaymentsTable: FC = () => {
  const router = useRouter();
  const t = useTranslations("dashboard.admin.payments");
  const tc = useTranslations("dashboard.admin.common");
  const locale = useLocale();
  const format = useFormatter();
  const statusOptions = useDropdownOptions(TipStatusFilterOptions);
  const statusLabel = useDropdownLabel();
  const money = (amount: number, currency: Tip["currency"]) =>
    formatMoney(amount, currency, locale);
  const formatDateTime = (value?: string | null) =>
    value
      ? format.dateTime(new Date(value), { dateStyle: "medium", timeStyle: "short" })
      : "-";
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

  const selectionSummary = summarizeSelection(Array.from(selected.values()), money);
  const skippedCount =
    selectionSummary.notCompletedCount + selectionSummary.feeUnconfirmedCount;

  const skippedValues = {
    skipped: skippedCount,
    notCompleted: selectionSummary.notCompletedCount,
    feeUnconfirmed: selectionSummary.feeUnconfirmedCount,
  };
  const skippedMessage =
    selectionSummary.notCompletedCount > 0 && selectionSummary.feeUnconfirmedCount > 0
      ? t("skippedBoth", skippedValues)
      : selectionSummary.notCompletedCount > 0
        ? t("skippedNotCompleted", skippedValues)
        : selectionSummary.feeUnconfirmedCount > 0
          ? t("skippedFee", skippedValues)
          : t("skippedOnly", skippedValues);

  const confirmPayout = async () => {
    await manualPayout.mutateAsync({ tip_ids: Array.from(selected.keys()) });
    setSelected(new Map());
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-zinc-200/80 bg-zinc-50/60 px-4 py-2.5">
        <div className="flex items-center gap-1.5 pl-1 text-xs font-semibold text-zinc-500">
          <SlidersHorizontal className="size-3.5" />
          {tc("filters")}
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-zinc-400" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              resetPage();
            }}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchAria")}
            className="w-64 rounded-xl border-zinc-200 bg-white pl-8 font-medium text-ink-charcoal shadow-xs"
          />
        </div>
        <Select
          items={statusOptions.map((option) => ({
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
              {statusOptions.map((option) => (
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
          placeholder={tc("fromDate")}
          aria-label={tc("fromDate")}
          className="rounded-xl border-zinc-200 bg-white font-medium text-ink-charcoal shadow-xs"
        />
        <span className="text-xs text-zinc-400">{tc("dateRangeTo")}</span>
        <DatePicker
          value={dateTo}
          onChange={(value) => {
            setDateTo(value);
            resetPage();
          }}
          placeholder={tc("toDate")}
          aria-label={tc("toDate")}
          className="rounded-xl border-zinc-200 bg-white font-medium text-ink-charcoal shadow-xs"
        />
      </div>

      {tipsQuery.isPending ? (
        <TableSkeleton columns={9} />
      ) : tipsQuery.isError ? (
        <Empty className="border border-dashed border-zinc-200 bg-white px-4 py-16">
          <EmptyHeader>
            <EmptyTitle>{t("loadError")}</EmptyTitle>
            <EmptyDescription>{getErrorMessage(tipsQuery.error)}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              variant="outline"
              onClick={() => void tipsQuery.refetch()}
            >
              {tc("tryAgain")}
            </Button>
          </EmptyContent>
        </Empty>
      ) : tips.length === 0 ? (
        <Empty className="border border-dashed border-zinc-200 bg-white px-4 py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Receipt />
            </EmptyMedia>
            <EmptyTitle>{t("emptyTitle")}</EmptyTitle>
            <EmptyDescription>
              {search || status !== "all" || storeId || dateFrom || dateTo
                ? t("emptyFiltered")
                : t("emptyNone")}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          {selected.size > 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-200 bg-brand-50/60 px-4 py-2.5">
              <div className="space-y-0.5 text-sm">
                <p className="font-semibold text-brand-700">
                  {t("selectedSummary", {
                    count: selected.size,
                    payable: selectionSummary.payableCount,
                    total: selectionSummary.totalLabel,
                  })}
                </p>
                {skippedCount > 0 ? (
                  <p className="text-xs text-amber-700">
                    {skippedMessage}
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
                  {t("clear")}
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
                  {t("payOutSelected")}
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
                      aria-label={t("selectAllAria")}
                      checked={allOnPageSelected}
                      indeterminate={someOnPageSelected}
                      onCheckedChange={(checked) => toggleAllOnPage(checked)}
                    />
                  </TableHead>
                  <TableHead className="px-4">{t("columns.when")}</TableHead>
                  <TableHead className="px-4">{t("columns.store")}</TableHead>
                  <TableHead className="px-4">{t("columns.customer")}</TableHead>
                  <TableHead className="px-4">{t("columns.employee")}</TableHead>
                  <TableHead className="px-4">
                    <ColumnHeaderWithTooltip
                      label={t("columns.tipAmount")}
                      explanation={t("help.tipAmount")}
                    />
                  </TableHead>
                  <TableHead className="px-4">
                    <ColumnHeaderWithTooltip
                      label={t("columns.fees")}
                      explanation={t("help.fees")}
                    />
                  </TableHead>
                  <TableHead className="px-4">
                    <ColumnHeaderWithTooltip
                      label={t("columns.net")}
                      explanation={t("help.net")}
                    />
                  </TableHead>
                  <TableHead className="px-4 text-right">{t("columns.status")}</TableHead>
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
                        aria-label={t("selectOneAria")}
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
                      {tip.customer_name ?? tip.customer_email ?? tc("anonymous")}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-zinc-500">
                      {tip.employee?.full_name ?? t("storeFallback")}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-bold text-brand-700">
                      {money(tip.amount, tip.currency)}
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      <AdminPaymentFeesCell
                        paymentTransaction={tip.payment_transaction}
                        currency={tip.currency}
                      />
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-semibold text-ink-charcoal">
                      {tip.payment_transaction?.net_distributable_amount != null
                        ? money(tip.payment_transaction.net_distributable_amount, tip.currency)
                        : "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-right">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-caption font-bold",
                          statusChipClass[tip.status],
                        )}
                      >
                        {statusLabel(TipStatusFormOptions, tip.status)}
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
                {t("pagination", {
                  total: pagination.total,
                  page: pagination.page,
                  pages: Math.max(pagination.total_pages, 1),
                })}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!pagination.has_prev}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  {tc("previous")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!pagination.has_next}
                  onClick={() => setPage((current) => current + 1)}
                >
                  {tc("next")}
                </Button>
              </div>
            </div>
          ) : null}
        </>
      )}
      <ConfirmationDialog
        state={payoutConfirm}
        title={t("confirmTitle", {
          count: selectionSummary.payableCount,
          total: selectionSummary.totalLabel,
        })}
        description={
          skippedCount > 0
            ? t("confirmDescriptionSkipped", {
                ...skippedValues,
                selected: selected.size,
              })
            : t("confirmDescription")
        }
        confirmLabel={t("confirmLabel")}
        variant="default"
        isPending={manualPayout.isPending}
        onConfirm={confirmPayout}
      />
    </div>
  );
};
