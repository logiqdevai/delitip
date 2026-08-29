import { type FC } from "react";
import { Sparkles, Wine, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  EmployeeBalanceCard,
  EmployeeDepositNotice,
} from "./components/employee-balance-card";
import {
  demoDailyEarnings,
  demoEmployee,
  demoShiftTips,
} from "./data/employee-demo";

const EarningsPage: FC = () => {
  return (
    <div className="auth-fade-enter space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <EmployeeBalanceCard />

        <div className="flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
              <span>This Week&apos;s Tips (7d)</span>
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-caption font-bold text-brand-700">
                {demoEmployee.weeklyTipsDelta}
              </span>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-ink-charcoal">
              {demoEmployee.weeklyTips}
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">
              {demoEmployee.weeklyTipCount} total customer rewards received
            </p>
          </div>
          <div className="flex items-center justify-between border-t border-zinc-100 pt-4 text-xs">
            <span className="text-zinc-500">Average tip per table</span>
            <span className="font-bold text-ink-charcoal">
              {demoEmployee.avgTipPerTable}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
              <span>Customer Satisfaction</span>
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-caption font-bold text-amber-700">
                Top 5% Server
              </span>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-3xl font-extrabold text-rating-amber">
              ★ {demoEmployee.rating}{" "}
              <span className="text-xs font-normal text-zinc-400">/ 5.0</span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">
              {demoEmployee.ratingCount} verified ratings this week
            </p>
          </div>
          <div className="flex items-center justify-between border-t border-zinc-100 pt-4 text-xs">
            <span className="text-zinc-500">Top customer praise</span>
            <span className="inline-flex items-center gap-1 font-bold text-brand-700">
              <Zap className="size-3.5" strokeWidth={2} />
              {demoEmployee.topPraise.label} ({demoEmployee.topPraise.count}x)
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-xs sm:p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-ink-charcoal">
                Today&apos;s Shift Tips
              </h2>
              <p className="text-xs text-zinc-400">
                Tips directly rewarded to your QR / Table code
              </p>
            </div>
            <span className="rounded-lg bg-brand-50 px-2.5 py-1 text-chip font-bold text-brand-700">
              {demoEmployee.tipsToday} tips today
            </span>
          </div>

          <div className="divide-y divide-zinc-100">
            {demoShiftTips.map((tip) => (
              <div
                key={`${tip.table}-${tip.when}`}
                className="flex items-center justify-between gap-3 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-caption font-bold whitespace-nowrap tabular-nums text-brand-700">
                    {tip.shortAmount}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-ink-charcoal">
                      {tip.table} • Customer
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      {tip.when} • {tip.method}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-extrabold text-ink-charcoal">
                    {tip.amount}
                  </div>
                  <div className="text-[10px] font-bold text-rating-amber">
                    ★★★★★ &ldquo;{tip.note}&rdquo;
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-xs sm:p-6">
          <div>
            <h2 className="text-sm font-bold text-ink-charcoal">
              My Daily Earnings (7d)
            </h2>
            <p className="text-xs text-zinc-400">
              Daily breakdown for your shifts
            </p>
          </div>

          <div className="grid h-36 grid-cols-7 items-end gap-2 border-b border-zinc-100 pb-2">
            {demoDailyEarnings.map((day, index) => (
              <div
                key={`${day.day}-${index}`}
                className="flex h-full flex-col items-center justify-end gap-1"
              >
                <span
                  className={cn(
                    "text-[9px] font-semibold text-zinc-400",
                    day.peak === "top" && "font-bold text-brand-700"
                  )}
                >
                  {day.amount}
                </span>
                <div
                  className={cn(
                    "w-full rounded-t-md",
                    day.peak === "top"
                      ? "bg-electric-lime"
                      : day.peak === "high"
                        ? "bg-brand-200"
                        : day.peak === "off"
                          ? "bg-zinc-50"
                          : "bg-zinc-100"
                  )}
                  style={{ height: day.height }}
                />
                <span
                  className={cn(
                    "text-[9px] font-bold text-zinc-400",
                    day.peak === "top" && "text-brand-800",
                    day.peak === "high" && "text-ink-charcoal",
                    day.peak === "off" && "text-zinc-300"
                  )}
                >
                  {day.day}
                </span>
              </div>
            ))}
          </div>

          <EmployeeDepositNotice />
        </div>
      </div>
    </div>
  );
};

export default EarningsPage;
