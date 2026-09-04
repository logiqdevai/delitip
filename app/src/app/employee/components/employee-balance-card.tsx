"use client";

import { type FC } from "react";
import { CheckCircle2, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmployeeCashOut } from "./employee-cash-out-provider";

export const EmployeeBalanceCard: FC = () => {
  const { formattedBalance, isBalancePending, openCashOut } =
    useEmployeeCashOut();

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
      <div className="relative z-10 pt-5">
        <button
          type="button"
          onClick={openCashOut}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-electric-lime py-2.5 text-chip font-bold text-ink-charcoal shadow-sm transition hover:bg-brand-400"
        >
          <Zap className="size-3.5" strokeWidth={2} />
          <span>Cash Out</span>
        </button>
      </div>
    </div>
  );
};

export const EmployeeDepositNotice: FC = () => {
  return (
    <div className="space-y-1.5 rounded-2xl border border-brand-200/60 bg-brand-50/70 p-3.5 text-sm text-brand-900">
      <div className="flex items-center gap-1.5 font-bold leading-snug">
        <CheckCircle2 className="size-4 shrink-0 text-brand-700" strokeWidth={2} />
        <span>Payouts follow your Store&apos;s schedule</span>
      </div>
      <p className="leading-relaxed text-brand-800/80">
        Cash-out isn&apos;t instant — your Store&apos;s owner releases
        payouts via bank transfer on their own schedule.
      </p>
    </div>
  );
};
