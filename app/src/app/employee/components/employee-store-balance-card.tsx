"use client";

import { type FC } from "react";
import { format } from "date-fns";
import { Check, HandCoins } from "lucide-react";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useConfirmSettlement,
  useEmployeeSettlementBalance,
  useEmployeeSettlements,
} from "@/features/settlements/hooks/use-settlements";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

interface EmployeeStoreBalanceCardProps {
  employeeId: string;
  currency: Currency;
}

/**
 * Tips your business collected on your behalf and pays you itself. Separate
 * from the bank-payout balance because it is a different promise: that money
 * is already in the business's account, and what is owed to you is a record
 * rather than a transfer waiting to happen. Hidden entirely when a business
 * doesn't work this way.
 */
export const EmployeeStoreBalanceCard: FC<EmployeeStoreBalanceCardProps> = ({
  employeeId,
  currency,
}) => {
  const balanceQuery = useEmployeeSettlementBalance(employeeId);
  const settlementsQuery = useEmployeeSettlements(employeeId, { limit: 20 });
  const confirmSettlement = useConfirmSettlement();

  const balance = balanceQuery.data;
  const settlements = settlementsQuery.data?.data ?? [];

  if (balanceQuery.isPending) {
    return <Skeleton className="h-64 rounded-3xl" />;
  }

  // Nothing earned this way and nothing ever handed over — this business pays
  // straight to the bank, so the card would only be noise.
  if (!balance || (balance.earned_amount === 0 && settlements.length === 0)) {
    return null;
  }

  return (
    <div className="space-y-4 rounded-3xl border border-zinc-200/80 bg-white px-4 py-5 shadow-xs sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-ink-charcoal">
            Paid to you by your Store
          </h2>
          <p className="text-xs text-zinc-400">
            Tips that go to your Store first, which then pays you directly
          </p>
        </div>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
          <HandCoins className="size-4" />
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-zinc-50 px-3 py-3">
          <p className="text-[11px] font-semibold text-zinc-500">Still owed</p>
          <p className="mt-1 text-2xl font-extrabold tabular-nums text-ink-charcoal">
            {formatMoney(balance.outstanding_amount, currency)}
          </p>
        </div>
        <div className="rounded-2xl bg-zinc-50 px-3 py-3">
          <p className="text-[11px] font-semibold text-zinc-500">
            Already received
          </p>
          <p className="mt-1 text-2xl font-extrabold tabular-nums text-ink-charcoal">
            {formatMoney(balance.settled_amount, currency)}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-zinc-500">Payments</p>
        {settlementsQuery.isPending ? (
          <Skeleton className="h-20 w-full rounded-xl" />
        ) : settlements.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-6 text-center text-xs text-zinc-500">
            Nothing handed over yet.
          </p>
        ) : (
          <div className="divide-y divide-zinc-100">
            {settlements.map((settlement) => (
              <div
                key={settlement.id}
                className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 py-2.5 text-xs"
              >
                <div className="min-w-0">
                  <span className="block text-zinc-500">
                    {format(new Date(settlement.settled_at), "MMM d, yyyy")}
                  </span>
                  {settlement.note || settlement.reference ? (
                    <span className="mt-0.5 block truncate text-[11px] text-zinc-400">
                      {settlement.note ?? settlement.reference}
                    </span>
                  ) : null}
                </div>
                <span
                  className={cn(
                    "font-bold tabular-nums",
                    settlement.reversed_at
                      ? "text-zinc-400 line-through"
                      : "text-ink-charcoal",
                  )}
                >
                  {formatMoney(settlement.amount, settlement.currency as Currency)}
                </span>
                {settlement.reversed_at ? (
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-600">
                    Reversed
                  </span>
                ) : settlement.confirmed_by_employee_at ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700">
                    <Check className="size-3" />
                    Confirmed
                  </span>
                ) : (
                  <ActionButtonWithPending
                    type="button"
                    size="sm"
                    variant="outline"
                    isPending={
                      confirmSettlement.isPending &&
                      confirmSettlement.variables === settlement.id
                    }
                    onClick={() => confirmSettlement.mutate(settlement.id)}
                  >
                    I received this
                  </ActionButtonWithPending>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
