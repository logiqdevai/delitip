"use client";

import { type FC, useState } from "react";
import { useRouter } from "next/navigation";
import { Banknote, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { DistributionRecipientTypeFilterOptions } from "@/config/constants/dropdowns/distribution/distribution-recipient-type-filter.options";
import { PayoutExecutionStatusFilterOptions } from "@/config/constants/dropdowns/payments/payout-execution-status-filter.options";
import { getPayoutExecutionStatusLabel } from "@/config/constants/dropdowns/payments/payout-execution-status-form.options";
import { useAdminPayouts } from "@/features/payouts/hooks/use-payouts";
import type { PayoutExecutionStatus } from "@/features/payouts/interfaces/payouts.interfaces";
import type { DistributionRecipientType } from "@/features/tips/interfaces/tips.interfaces";
import { AdminStoreFilter } from "@/app/dashboard/admin/payments/components/admin-store-filter";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import { Routes } from "@/routes/routes";

const statusChipClass: Record<PayoutExecutionStatus, string> = {
  PROCESSING: "bg-sky-50 text-sky-700",
  COMPLETED: "bg-brand-50 text-brand-700",
  FAILED: "bg-red-50 text-red-700",
  CANCELLED: "bg-zinc-100 text-zinc-600",
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const PAGE_LIMIT = 20;

export const AdminPayoutsTable: FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PayoutExecutionStatus | "all">("all");
  const [recipientType, setRecipientType] = useState<
    DistributionRecipientType | "all"
  >("all");
  const [storeId, setStoreId] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  const query = {
    page,
    limit: PAGE_LIMIT,
    ...(search ? { search } : {}),
    ...(status !== "all" ? { status } : {}),
    ...(recipientType !== "all" ? { recipient_type: recipientType } : {}),
    ...(storeId ? { store_id: storeId } : {}),
    ...(dateFrom ? { date_from: dateFrom } : {}),
    ...(dateTo ? { date_to: dateTo } : {}),
  };

  const payoutsQuery = useAdminPayouts(query);
  const payouts = payoutsQuery.data?.data ?? [];
  const pagination = payoutsQuery.data?.pagination;

  const resetPage = () => setPage(1);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-2.5">
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
            placeholder="Store, employee, or payout ID"
            aria-label="Search payouts"
            className="w-48 rounded-xl border-zinc-200 bg-white pl-8 font-medium text-ink-charcoal shadow-xs"
          />
        </div>
        <Select
          items={PayoutExecutionStatusFilterOptions.map((option) => ({
            label: option.label,
            value: option.id,
          }))}
          value={status}
          onValueChange={(value) => {
            if (value) {
              setStatus(value as PayoutExecutionStatus | "all");
              resetPage();
            }
          }}
        >
          <SelectTrigger className="min-w-36 rounded-xl border-zinc-200 bg-white px-3.5 font-medium text-ink-charcoal shadow-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="w-auto min-w-40">
            <SelectGroup>
              {PayoutExecutionStatusFilterOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          items={DistributionRecipientTypeFilterOptions.map((option) => ({
            label: option.label,
            value: option.id,
          }))}
          value={recipientType}
          onValueChange={(value) => {
            if (value) {
              setRecipientType(value as DistributionRecipientType | "all");
              resetPage();
            }
          }}
        >
          <SelectTrigger className="min-w-36 rounded-xl border-zinc-200 bg-white px-3.5 font-medium text-ink-charcoal shadow-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="w-auto min-w-40">
            <SelectGroup>
              {DistributionRecipientTypeFilterOptions.map((option) => (
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

      {payoutsQuery.isPending ? (
        <TableSkeleton columns={6} />
      ) : payoutsQuery.isError ? (
        <Empty className="border border-dashed border-zinc-200 bg-white py-16">
          <EmptyHeader>
            <EmptyTitle>Could not load payouts</EmptyTitle>
            <EmptyDescription>{payoutsQuery.error.message}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              variant="outline"
              onClick={() => void payoutsQuery.refetch()}
            >
              Try again
            </Button>
          </EmptyContent>
        </Empty>
      ) : payouts.length === 0 ? (
        <Empty className="border border-dashed border-zinc-200 bg-white py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Banknote />
            </EmptyMedia>
            <EmptyTitle>No payouts found</EmptyTitle>
            <EmptyDescription>
              {search ||
              status !== "all" ||
              recipientType !== "all" ||
              storeId ||
              dateFrom ||
              dateTo
                ? "No payouts match your filters."
                : "No payouts have run yet."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">When</TableHead>
                  <TableHead className="px-4">Store</TableHead>
                  <TableHead className="px-4">Recipient</TableHead>
                  <TableHead className="px-4">Amount</TableHead>
                  <TableHead className="px-4">Provider</TableHead>
                  <TableHead className="px-4 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payouts.map((payout) => (
                  <TableRow
                    key={payout.id}
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(Routes.dashboard.admin.payoutDetail(payout.id))
                    }
                  >
                    <TableCell className="px-4 py-3.5 text-zinc-500">
                      {formatDateTime(payout.executed_at ?? payout.created_at)}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-semibold text-ink-charcoal">
                      {payout.store?.name ?? "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-zinc-500">
                      {payout.recipient_type === "EMPLOYEE"
                        ? (payout.employee?.full_name ?? "Employee")
                        : "Business (house)"}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-bold text-brand-700">
                      {formatMoney(payout.amount, payout.currency)}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-zinc-500">
                      {payout.provider}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-right">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-caption font-bold",
                          statusChipClass[payout.status],
                        )}
                      >
                        {getPayoutExecutionStatusLabel(payout.status)}
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
                {pagination.total} payout{pagination.total === 1 ? "" : "s"}{" "}
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
    </div>
  );
};
