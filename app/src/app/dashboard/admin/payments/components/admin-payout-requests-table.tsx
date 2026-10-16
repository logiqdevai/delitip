"use client";

import { type FC, useState } from "react";
import { useRouter } from "next/navigation";
import { ReceiptText, Search, SlidersHorizontal } from "lucide-react";
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
import { PayoutRequestStatusFilterOptions } from "@/config/constants/dropdowns/payouts/payout-request-status-filter.options";
import { InvoiceCheckVerdictFilterOptions } from "@/config/constants/dropdowns/payouts/invoice-check-verdict-filter.options";
import { useAdminPayoutRequests } from "@/features/payout-requests/hooks/use-payout-requests";
import type {
  InvoiceCheckVerdict,
  PayoutRequestStatus,
} from "@/features/payout-requests/interfaces/payout-requests.interfaces";
import { AdminStoreFilter } from "@/app/dashboard/admin/payments/components/admin-store-filter";
import {
  InvoiceCheckChip,
  PayoutRequestStatusChip,
} from "@/app/dashboard/admin/payments/components/payout-request-chips";
import { formatMoney } from "@/lib/money";
import { Routes } from "@/routes/routes";

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

const PAGE_LIMIT = 20;

export const AdminPayoutRequestsTable: FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  // Default to the queue that needs a human — everything else is history.
  const [status, setStatus] = useState<PayoutRequestStatus | "all">("PENDING_REVIEW");
  const [verdict, setVerdict] = useState<InvoiceCheckVerdict | "all">("all");
  const [storeId, setStoreId] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  const query = {
    page,
    limit: PAGE_LIMIT,
    ...(search ? { search } : {}),
    ...(status !== "all" ? { status } : {}),
    ...(verdict !== "all" ? { verdict } : {}),
    ...(storeId ? { store_id: storeId } : {}),
    ...(dateFrom ? { date_from: dateFrom } : {}),
    ...(dateTo ? { date_to: dateTo } : {}),
  };

  const requestsQuery = useAdminPayoutRequests(query);
  const requests = requestsQuery.data?.data ?? [];
  const pagination = requestsQuery.data?.pagination;

  const resetPage = () => setPage(1);
  const hasFilters =
    search || status !== "all" || verdict !== "all" || storeId || dateFrom || dateTo;

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
            placeholder="Store, invoice no., or request ID"
            aria-label="Search payout requests"
            className="w-52 rounded-xl border-zinc-200 bg-white pl-8 font-medium text-ink-charcoal shadow-xs"
          />
        </div>
        <Select
          items={PayoutRequestStatusFilterOptions.map((option) => ({
            label: option.label,
            value: option.id,
          }))}
          value={status}
          onValueChange={(value) => {
            if (value) {
              setStatus(value as PayoutRequestStatus | "all");
              resetPage();
            }
          }}
        >
          <SelectTrigger className="min-w-36 rounded-xl border-zinc-200 bg-white px-3.5 font-medium text-ink-charcoal shadow-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="w-auto min-w-40">
            <SelectGroup>
              {PayoutRequestStatusFilterOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          items={InvoiceCheckVerdictFilterOptions.map((option) => ({
            label: option.label,
            value: option.id,
          }))}
          value={verdict}
          onValueChange={(value) => {
            if (value) {
              setVerdict(value as InvoiceCheckVerdict | "all");
              resetPage();
            }
          }}
        >
          <SelectTrigger className="min-w-36 rounded-xl border-zinc-200 bg-white px-3.5 font-medium text-ink-charcoal shadow-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="w-auto min-w-40">
            <SelectGroup>
              {InvoiceCheckVerdictFilterOptions.map((option) => (
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

      {requestsQuery.isPending ? (
        <TableSkeleton columns={6} />
      ) : requestsQuery.isError ? (
        <Empty className="border border-dashed border-zinc-200 bg-white px-4 py-16">
          <EmptyHeader>
            <EmptyTitle>Could not load payout requests</EmptyTitle>
            <EmptyDescription>{requestsQuery.error.message}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              variant="outline"
              onClick={() => void requestsQuery.refetch()}
            >
              Try again
            </Button>
          </EmptyContent>
        </Empty>
      ) : requests.length === 0 ? (
        <Empty className="border border-dashed border-zinc-200 bg-white px-4 py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ReceiptText />
            </EmptyMedia>
            <EmptyTitle>
              {status === "PENDING_REVIEW" && !search && !storeId
                ? "Nothing to review"
                : "No payout requests found"}
            </EmptyTitle>
            <EmptyDescription>
              {hasFilters
                ? "No payout requests match your filters."
                : "Stores haven't submitted any payout requests yet."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">Submitted</TableHead>
                  <TableHead className="px-4">Store</TableHead>
                  <TableHead className="px-4">Amount</TableHead>
                  <TableHead className="px-4">Tips covered</TableHead>
                  <TableHead className="px-4">Invoice check</TableHead>
                  <TableHead className="px-4 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow
                    key={request.id}
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(
                        Routes.dashboard.admin.payoutRequestDetail(request.id),
                      )
                    }
                  >
                    <TableCell className="px-4 py-3.5 text-zinc-500">
                      {formatDateTime(request.created_at)}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-semibold text-ink-charcoal">
                      {request.store.name}
                      {request.invoice_number ? (
                        <span className="mt-0.5 block text-[11px] font-medium text-zinc-500">
                          Invoice {request.invoice_number}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-bold text-brand-700">
                      {formatMoney(request.amount, request.currency)}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-zinc-500">
                      {request.distribution_count} · {formatDate(request.period_from)} →{" "}
                      {formatDate(request.period_to)}
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      <InvoiceCheckChip
                        status={request.check_status}
                        verdict={request.check_verdict}
                      />
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-right">
                      <PayoutRequestStatusChip
                        status={request.status}
                        payoutStatus={request.payout?.status ?? null}
                        failureReason={request.failure_reason}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {pagination ? (
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-zinc-500">
                {pagination.total} request{pagination.total === 1 ? "" : "s"} total
                - page {pagination.page} of {Math.max(pagination.total_pages, 1)}
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
