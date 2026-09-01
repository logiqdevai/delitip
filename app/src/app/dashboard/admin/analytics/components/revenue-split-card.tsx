"use client";

import { type FC } from "react";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

const SEGMENTS = [
  { key: "platform", label: "Platform", color: "#6366F1" },
  { key: "employee", label: "Employees", color: "#F59E0B" },
  { key: "store", label: "Stores", color: "#0284C7" },
] as const;

interface RevenueSplitCardProps {
  platform: number;
  employee: number;
  store: number;
  currency: Currency;
}

export const RevenueSplitCard: FC<RevenueSplitCardProps> = ({
  platform,
  employee,
  store,
  currency,
}) => {
  const values = { platform, employee, store };
  const total = platform + employee + store;

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
      <h2 className="text-sm font-bold text-ink-charcoal">Revenue split</h2>
      <p className="mt-0.5 text-xs text-zinc-500">
        Where completed tip revenue ends up, in this range.
      </p>

      {total <= 0 ? (
        <p className="py-10 text-center text-xs text-zinc-400">
          No distributed revenue in this range.
        </p>
      ) : (
        <>
          <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-neutral-fill">
            {SEGMENTS.map((segment, index) => {
              const value = values[segment.key];
              if (value <= 0) return null;
              const width = (value / total) * 100;
              return (
                <div
                  key={segment.key}
                  className={cn("h-full", index > 0 && "ml-0.5")}
                  style={{ width: `${width}%`, backgroundColor: segment.color }}
                />
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {SEGMENTS.map((segment) => {
              const value = values[segment.key];
              const share = total > 0 ? Math.round((value / total) * 100) : 0;
              return (
                <div key={segment.key} className="flex items-center gap-2">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className="text-xs font-medium text-zinc-600">
                    {segment.label}
                  </span>
                  <span className="text-xs font-bold text-ink-charcoal">
                    {formatMoney(value, currency)}
                  </span>
                  <span className="text-[11px] text-zinc-400">({share}%)</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
