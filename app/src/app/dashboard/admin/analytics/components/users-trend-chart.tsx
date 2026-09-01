"use client";

import { type FC, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendGroupBySelect } from "@/app/dashboard/admin/analytics/components/trend-group-by-select";
import { TrendPeriodSelect } from "@/app/dashboard/admin/analytics/components/trend-period-select";
import { formatBucketLabel } from "@/app/dashboard/admin/analytics/utils/format-bucket-label";
import { useAdminTrends } from "@/features/analytics/hooks/use-analytics";
import type {
  TrendsGroupBy,
  TrendsPeriod,
} from "@/features/analytics/interfaces/analytics.interfaces";

const USERS_COLOR = "#9FBF3E";
const GRADIENT_ID = "admin-users-trend-fill";

const chartConfig: ChartConfig = {
  value: { label: "New users", color: USERS_COLOR },
};

export const UsersTrendChart: FC = () => {
  const [period, setPeriod] = useState<TrendsPeriod>("30d");
  const [groupBy, setGroupBy] = useState<TrendsGroupBy>("day");

  const trendsQuery = useAdminTrends({
    metric: "users",
    period,
    group_by: groupBy,
  });
  const data = trendsQuery.data?.data ?? [];
  const total = data.reduce((sum, point) => sum + point.value, 0);

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-ink-charcoal">
            Users created
          </h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            {total.toLocaleString()} new user{total === 1 ? "" : "s"} in this
            range.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TrendPeriodSelect value={period} onChange={setPeriod} />
          <TrendGroupBySelect value={groupBy} onChange={setGroupBy} />
        </div>
      </div>

      <div className="mt-4">
        {trendsQuery.isPending ? (
          <Skeleton className="h-64 w-full rounded-xl" />
        ) : trendsQuery.isError ? (
          <p className="py-16 text-center text-xs text-red-600">
            {trendsQuery.error.message}
          </p>
        ) : data.length === 0 ? (
          <p className="py-16 text-center text-xs text-zinc-400">
            No users created in this range.
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
            <AreaChart data={data} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={USERS_COLOR} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={USERS_COLOR} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="var(--color-neutral-line)"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="bucket"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
                tickFormatter={(value: string) => formatBucketLabel(value, groupBy)}
                className="text-[11px]"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={32}
                allowDecimals={false}
                tickFormatter={(value: number) =>
                  new Intl.NumberFormat(undefined, { notation: "compact" }).format(value)
                }
                className="text-[11px]"
              />
              <ChartTooltip
                cursor={{ stroke: "var(--color-neutral-line)" }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => formatBucketLabel(String(value), groupBy)}
                  />
                }
              />
              <Area
                dataKey="value"
                type="monotone"
                stroke={USERS_COLOR}
                strokeWidth={2}
                fill={`url(#${GRADIENT_ID})`}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff" }}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </div>
    </div>
  );
};
