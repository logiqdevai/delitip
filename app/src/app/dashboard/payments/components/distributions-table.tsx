"use client";

import { type FC, useState } from "react";
import { SlidersHorizontal, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { EmployeeSelect } from "@/components/ui/employee-select";
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
import { TablePagination } from "@/app/dashboard/payments/components/table-pagination";
import { PayOutNowDialog } from "@/app/dashboard/payments/components/pay-out-now-dialog";
import { useEmployees } from "@/features/employees/hooks/use-employees";
import { useStoreDistributions } from "@/features/payouts/hooks/use-payouts";
import type {
  Distribution,
  DistributionsQuery,
} from "@/features/payouts/interfaces/payouts.interfaces";
import type {
  DistributionRecipientType,
  PayoutStatus,
} from "@/features/tips/interfaces/tips.interfaces";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import { PayoutStatusFilterOptions } from "@/config/constants/dropdowns/payouts/payout-status-filter.options";
import { getPayoutStatusLabel } from "@/config/constants/dropdowns/payouts/payout-status-form.options";
import { DistributionRecipientTypeFilterOptions } from "@/config/constants/dropdowns/payouts/distribution-recipient-type-filter.options";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

const statusChipClass: Record<PayoutStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  PROCESSING: "bg-sky-50 text-sky-700",
  PAID: "bg-brand-50 text-brand-700",
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

// Distinguishes a knowable ETA (still inside the hold window — clears at a
// fixed, predictable time) from an unpredictable one (waiting on Viva's own
// fee-confirmation webhook, which has no schedule we can promise).
const eligibilityLabel = (distribution: Distribution) => {
  if (distribution.eligible_now) return "Eligible now";
  if (distribution.hold_reason === "HOLD_WINDOW" && distribution.eligible_at) {
    return `Eligible ${formatDateTime(distribution.eligible_at)}`;
  }
  if (distribution.hold_reason === "FEE_NOT_CONFIRMED") {
    return "Awaiting payment confirmation";
  }
  return "Held";
};

export const DistributionsTable: FC<{
  storeId: string;
  currency: Currency;
}> = ({ storeId, currency }) => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<PayoutStatus | "all">("PENDING");
  const [recipientType, setRecipientType] = useState<
    DistributionRecipientType | "all"
  >("all");
  const [employeeId, setEmployeeId] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const employeesQuery = useEmployees(storeId, { limit: 100 });

  const query: DistributionsQuery = {
    page,
    limit: 20,
    ...(status !== "all" ? { payout_status: status } : {}),
    ...(recipientType !== "all" ? { recipient_type: recipientType } : {}),
    ...(employeeId !== "all" ? { employee_id: employeeId } : {}),
    ...(dateFrom ? { date_from: dateFrom } : {}),
    ...(dateTo ? { date_to: dateTo } : {}),
  };

  const distributionsQuery = useStoreDistributions(storeId, query);
  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false);

  const employees = employeesQuery.data?.data ?? [];
  const distributions = distributionsQuery.data?.data ?? [];
  const pagination = distributionsQuery.data?.pagination;
  const summary = distributionsQuery.data?.summary;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <p className="text-xs text-zinc-400">Pending total</p>
              <p className="text-lg font-bold text-ink-charcoal">
                {formatMoney(summary?.pending_total_amount ?? 0, currency)}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-400">Eligible now</p>
              <p className="text-lg font-bold text-brand-700">
                {formatMoney(summary?.eligible_total_amount ?? 0, currency)}
              </p>
            </div>
          </div>
          <Button
            type="button"
            onClick={() => setPayoutDialogOpen(true)}
            disabled={!summary || summary.eligible_total_amount === 0}
            className="rounded-xl bg-electric-lime text-ink-charcoal hover:bg-brand-700"
          >
            Pay out now
          </Button>
        </div>
        {summary ? (
          <p className="text-caption text-zinc-500">
            Payouts are held for {summary.hold_window_hours}h after a tip is
            paid, then released once Viva confirms the processing fee.
            {summary.next_eligible_at
              ? ` Next batch eligible ${formatDateTime(summary.next_eligible_at)}.`
              : ""}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-2.5">
        <div className="flex items-center gap-1.5 pl-1 text-xs font-semibold text-zinc-500">
          <SlidersHorizontal className="size-3.5" />
          Filters
        </div>
        <Select
          items={PayoutStatusFilterOptions.map((option) => ({
            label: option.label,
            value: option.id,
          }))}
          value={status}
          onValueChange={(value) => {
            if (value) {
              setStatus(value as PayoutStatus | "all");
              setPage(1);
            }
          }}
        >
          <SelectTrigger className="min-w-36 rounded-xl border-zinc-200 bg-white px-3.5 font-medium text-ink-charcoal shadow-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="w-auto min-w-40">
            <SelectGroup>
              {PayoutStatusFilterOptions.map((option) => (
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
              setPage(1);
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
        <EmployeeSelect
          employees={employees}
          value={employeeId}
          onValueChange={(value) => {
            setEmployeeId(value);
            setPage(1);
          }}
          includeAll
          triggerClassName="min-w-36 rounded-xl border-zinc-200 bg-white px-3.5 font-medium text-ink-charcoal shadow-xs"
          contentClassName="min-w-44"
          aria-label="Filter by employee"
        />
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

      {distributionsQuery.isPending ? (
        <TableSkeleton columns={4} />
      ) : distributionsQuery.isError ? (
        <Empty className="border border-dashed border-zinc-200 bg-white py-16">
          <EmptyHeader>
            <EmptyTitle>Could not load distributions</EmptyTitle>
            <EmptyDescription>
              {distributionsQuery.error.message}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              variant="outline"
              onClick={() => void distributionsQuery.refetch()}
            >
              Try again
            </Button>
          </EmptyContent>
        </Empty>
      ) : distributions.length === 0 ? (
        <Empty className="border border-dashed border-zinc-200 bg-white py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Wallet />
            </EmptyMedia>
            <EmptyTitle>No distributions here</EmptyTitle>
            <EmptyDescription>
              Nothing matches these filters right now.
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
                  <TableHead className="px-4">Recipient</TableHead>
                  <TableHead className="px-4">Status</TableHead>
                  <TableHead className="px-4 text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {distributions.map((distribution) => (
                  <TableRow key={distribution.id}>
                    <TableCell className="px-4 py-3.5 text-zinc-500">
                      {formatDateTime(distribution.tip.paid_at)}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-semibold text-ink-charcoal">
                      {distribution.recipient_type === "EMPLOYEE"
                        ? (distribution.employee?.full_name ?? "Employee")
                        : "Store"}
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-caption font-bold",
                          statusChipClass[distribution.payout_status],
                        )}
                      >
                        {getPayoutStatusLabel(distribution.payout_status)}
                      </span>
                      {distribution.payout_status === "PENDING" ? (
                        <span
                          className={cn(
                            "ml-2 text-[10px] font-semibold",
                            distribution.eligible_now
                              ? "text-brand-700"
                              : "text-zinc-400",
                          )}
                        >
                          {eligibilityLabel(distribution)}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-right font-bold text-ink-charcoal">
                      {formatMoney(distribution.amount, currency)}
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

      <PayOutNowDialog
        open={payoutDialogOpen}
        onOpenChange={setPayoutDialogOpen}
        storeId={storeId}
        currency={currency}
      />
    </div>
  );
};
