"use client";

import { type FC } from "react";
import { Banknote } from "lucide-react";
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
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { useStorePayouts } from "@/features/payouts/hooks/use-payouts";
import type { PayoutExecutionStatus } from "@/features/payouts/interfaces/payouts.interfaces";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { getPayoutExecutionStatusLabel } from "@/config/constants/dropdowns/payments/payout-execution-status-form.options";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

const statusChipClass: Record<PayoutExecutionStatus, string> = {
  PROCESSING: "bg-sky-50 text-sky-700",
  COMPLETED: "bg-brand-50 text-brand-700",
  FAILED: "bg-red-50 text-red-700",
  CANCELLED: "bg-zinc-100 text-zinc-600",
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export const PayoutsPageContent: FC = () => {
  const { storeId, isPending: workspacePending, isReady } = useWorkspace();
  const payoutsQuery = useStorePayouts(storeId ?? "", { limit: 50 });

  if (workspacePending) {
    return <TableSkeleton columns={5} />;
  }

  if (!isReady || !storeId) {
    return (
      <Empty className="border border-dashed border-zinc-200 bg-white py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Banknote />
          </EmptyMedia>
          <EmptyTitle>No store selected</EmptyTitle>
          <EmptyDescription>
            Finish business setup before viewing payouts.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const payouts = payoutsQuery.data?.data ?? [];

  return (
    <>
      <DashboardPageHeader
        title="Payouts"
        description="History of bank transfers executed for your Store and its employees. Trigger a new payout from the Payments page."
      />

      {payoutsQuery.isPending ? (
        <TableSkeleton columns={5} />
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
            <EmptyTitle>No payouts yet</EmptyTitle>
            <EmptyDescription>
              Once you run a payout from the Payments page, executed bank
              transfers will show up here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4">When</TableHead>
                <TableHead className="px-4">Recipient</TableHead>
                <TableHead className="px-4">Amount</TableHead>
                <TableHead className="px-4">Reference</TableHead>
                <TableHead className="px-4 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell className="px-4 py-3.5 text-zinc-500">
                    {formatDateTime(payout.executed_at ?? payout.created_at)}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 font-semibold text-ink-charcoal">
                    {payout.recipient_type === "EMPLOYEE"
                      ? (payout.employee?.full_name ?? "Employee")
                      : "Store"}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 font-bold text-brand-700">
                    {formatMoney(payout.amount, payout.currency)}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 font-mono text-xs text-zinc-500">
                    {payout.provider_transfer_id ?? "—"}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 text-right">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-caption font-bold",
                        statusChipClass[payout.status],
                      )}
                      title={payout.failure_reason ?? undefined}
                    >
                      {getPayoutExecutionStatusLabel(payout.status)}
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
