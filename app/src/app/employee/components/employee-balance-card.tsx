"use client";

import { type FC } from "react";
import { CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmployeeCashOut } from "./employee-cash-out-provider";

export const EmployeeBalanceCard: FC = () => {
  const { formattedBalance, isBalancePending } = useEmployeeCashOut();

  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-ink-charcoal to-ink-charcoal p-6 text-white shadow-lg">
      <div
        aria-hidden
        className="absolute -right-12 -bottom-12 size-36 rounded-full bg-electric-lime/20 blur-2xl"
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between text-xs font-medium text-zinc-400">
          <span>Pending Balance</span>
        </div>
        <div className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
          {isBalancePending ? (
            <Skeleton className="h-9 w-32 bg-white/10" />
          ) : (
            formattedBalance
          )}
        </div>
        <p className="mt-1 text-[11px] text-zinc-400">
          From unpaid tip distributions
        </p>
      </div>
    </div>
  );
};

export const EmployeeDepositNotice: FC = () => {
  return (
    <div className="flex items-center gap-1.5 rounded-2xl border border-brand-200/60 bg-brand-50/70 p-3.5 text-sm font-bold leading-snug text-brand-900">
      <CheckCircle2 className="size-4 shrink-0 text-brand-700" strokeWidth={2} />
      <span>Payouts follow your Store&apos;s schedule</span>
    </div>
  );
};
