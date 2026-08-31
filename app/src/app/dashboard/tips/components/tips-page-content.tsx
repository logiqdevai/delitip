"use client";

import { type FC, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Receipt, SlidersHorizontal } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { useStoreTips } from "@/features/tips/hooks/use-tips";
import type {
  TipStatus,
  TipsQuery,
} from "@/features/tips/interfaces/tips.interfaces";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { TipStatusFilterOptions } from "@/config/constants/dropdowns/tips/tip-status-filter.options";
import { getTipStatusLabel } from "@/config/constants/dropdowns/tips/tip-status-form.options";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import { Routes } from "@/routes/routes";

const statusChipClass: Record<TipStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  COMPLETED: "bg-brand-50 text-brand-700",
  FAILED: "bg-red-50 text-red-700",
  REFUNDED: "bg-zinc-100 text-zinc-600",
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export const TipsPageContent: FC = () => {
  const router = useRouter();
  const { storeId, isPending: workspacePending, isReady } = useWorkspace();
  const [status, setStatus] = useState<TipStatus | "all">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const query: TipsQuery = {
    limit: 50,
    ...(status !== "all" ? { status } : {}),
    ...(dateFrom ? { date_from: dateFrom } : {}),
    ...(dateTo ? { date_to: dateTo } : {}),
  };

  const tipsQuery = useStoreTips(storeId ?? "", query);

  if (workspacePending) {
    return <TableSkeleton columns={6} />;
  }

  if (!isReady || !storeId) {
    return (
      <Empty className="border border-dashed border-zinc-200 bg-white py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Receipt />
          </EmptyMedia>
          <EmptyTitle>No store selected</EmptyTitle>
          <EmptyDescription>
            Finish business setup before viewing tips.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const tips = tipsQuery.data?.data ?? [];

  return (
    <>
      <DashboardPageHeader
        title="Tips"
        description="Real-time transactional ledger of all tips paid by customers."
        actions={
          <Button
            type="button"
            variant="outline"
            disabled
            title="Export will be available once the API supports it"
            className="h-9 rounded-xl px-3.5 text-chip font-semibold"
          >
            Export CSV
          </Button>
        }
      />

      <div className="flex flex-col gap-2.5 rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-2.5 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex items-center gap-1.5 pl-1 text-xs font-semibold text-zinc-500">
          <SlidersHorizontal className="size-3.5" />
          Filters
        </div>
        <Select
          items={TipStatusFilterOptions.map((option) => ({
            label: option.label,
            value: option.id,
          }))}
          value={status}
          onValueChange={(value) => {
            if (value) setStatus(value as TipStatus | "all");
          }}
        >
          <SelectTrigger className="w-full rounded-xl border-zinc-200 bg-white px-3.5 font-medium text-ink-charcoal shadow-xs sm:w-auto sm:min-w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              {TipStatusFilterOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <DatePicker
          value={dateFrom}
          onChange={setDateFrom}
          placeholder="From date"
          aria-label="From date"
          className="w-full rounded-xl border-zinc-200 bg-white font-medium text-ink-charcoal shadow-xs sm:w-auto"
        />
        <span className="hidden text-xs text-zinc-400 sm:inline">to</span>
        <DatePicker
          value={dateTo}
          onChange={setDateTo}
          placeholder="To date"
          aria-label="To date"
          className="w-full rounded-xl border-zinc-200 bg-white font-medium text-ink-charcoal shadow-xs sm:w-auto"
        />
      </div>

      {tipsQuery.isPending ? (
        <TableSkeleton columns={6} />
      ) : tipsQuery.isError ? (
        <Empty className="border border-dashed border-zinc-200 bg-white py-16">
          <EmptyHeader>
            <EmptyTitle>Could not load tips</EmptyTitle>
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
        <Empty className="border border-dashed border-zinc-200 bg-white py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Receipt />
            </EmptyMedia>
            <EmptyTitle>No tips yet</EmptyTitle>
            <EmptyDescription>
              Once customers tip through one of your QR codes, transactions
              will show up here.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link
              href={Routes.dashboard.access}
              className={cn(
                buttonVariants({ variant: "default" }),
                "rounded-xl bg-electric-lime text-ink-charcoal hover:bg-brand-700",
              )}
            >
              View QR codes
            </Link>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4">When</TableHead>
                <TableHead className="px-4">Employee</TableHead>
                <TableHead className="px-4">QR</TableHead>
                <TableHead className="px-4">Amount</TableHead>
                <TableHead className="px-4">Provider</TableHead>
                <TableHead className="px-4 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tips.map((tip) => (
                <TableRow
                  key={tip.id}
                  className="cursor-pointer"
                  onClick={() => router.push(Routes.dashboard.tipDetail(tip.id))}
                >
                  <TableCell className="px-4 py-3.5 text-zinc-500">
                    {formatDateTime(tip.paid_at ?? tip.created_at)}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 font-semibold text-ink-charcoal">
                    {tip.employee?.full_name ?? "Store"}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 text-zinc-500">
                    {tip.qr_code?.label ?? "—"}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 font-bold text-brand-700">
                    {formatMoney(tip.amount, tip.currency)}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 text-zinc-500">
                    {tip.payment_provider ?? "—"}
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
      )}
    </>
  );
};
