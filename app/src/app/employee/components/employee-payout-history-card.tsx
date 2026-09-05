"use client";

import { type FC } from "react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmployeePayouts } from "@/features/payouts/hooks/use-payouts";
import type { PayoutExecutionStatus } from "@/features/payouts/interfaces/payouts.interfaces";
import { getPayoutExecutionStatusLabel } from "@/config/constants/dropdowns/payments/payout-execution-status-form.options";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

const statusChipClass: Record<PayoutExecutionStatus, string> = {
  PROCESSING: "bg-sky-50 text-sky-700",
  COMPLETED: "bg-brand-50 text-brand-700",
  FAILED: "bg-red-50 text-red-700",
  CANCELLED: "bg-zinc-100 text-zinc-600",
};

export const EmployeePayoutHistoryCard: FC<{ employeeId: string }> = ({
  employeeId,
}) => {
  const payoutsQuery = useEmployeePayouts(employeeId, { limit: 20 });
  const payouts = payoutsQuery.data?.data ?? [];

  return (
    <div className="space-y-4 rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-xs sm:p-6">
      <div>
        <h2 className="text-sm font-bold text-ink-charcoal">Payout history</h2>
        <p className="text-xs text-zinc-400">
          Bank transfers your Store has sent you
        </p>
      </div>

      {payoutsQuery.isPending ? (
        <Skeleton className="h-24 w-full rounded-xl" />
      ) : payouts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-6 text-center text-xs text-zinc-500 sm:px-6">
          No payouts yet - your pending balance is paid out on your Store
          owner&apos;s schedule.
        </p>
      ) : (
        <div className="divide-y divide-zinc-100">
          {payouts.map((payout) => (
            <div
              key={payout.id}
              className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 py-2.5 text-xs sm:flex-nowrap"
            >
              <span className="text-zinc-500">
                {format(
                  new Date(payout.executed_at ?? payout.created_at),
                  "MMM d, yyyy",
                )}
              </span>
              <span className="font-bold text-ink-charcoal tabular-nums">
                {formatMoney(payout.amount, payout.currency)}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-bold",
                  statusChipClass[payout.status],
                )}
              >
                {getPayoutExecutionStatusLabel(payout.status)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
