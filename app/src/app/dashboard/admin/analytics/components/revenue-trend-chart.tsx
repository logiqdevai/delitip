"use client";

import { type FC, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendGroupBySelect } from "@/app/dashboard/admin/analytics/components/trend-group-by-select";
import { TrendPeriodSelect } from "@/app/dashboard/admin/analytics/components/trend-period-select";
import { formatBucketLabel } from "@/app/dashboard/admin/analytics/utils/format-bucket-label";
import { useAdminTrends } from "@/features/analytics/hooks/use-analytics";
import type {
  AdminTrendsMetric,
  TrendsGroupBy,
  TrendsPeriod,
} from "@/features/analytics/interfaces/analytics.interfaces";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import { formatMoney } from "@/lib/money";

const METRIC_META: Record<AdminTrendsMetric, { label: string; color: string }> = {
  tips_revenue: { label: "Gross tips revenue", color: "#9FBF3E" },
  platform_revenue: { label: "Platform net revenue", color: "#6366F1" },
  employee_revenue: { label: "Employee net revenue", color: "#F59E0B" },
  store_revenue: { label: "Store net revenue", color: "#0284C7" },
  users: { label: "Users", color: "#9FBF3E" },
};

const REVENUE_METRIC_OPTIONS: AdminTrendsMetric[] = [
  "tips_revenue",
  "platform_revenue",
  "employee_revenue",
  "store_revenue",
];

const GRADIENT_ID = "admin-revenue-trend-fill";

export const RevenueTrendChart: FC = () => {
  const [metric, setMetric] = useState<AdminTrendsMetric>("tips_revenue");
  const [period, setPeriod] = useState<TrendsPeriod>("30d");
  const [groupBy, setGroupBy] = useState<TrendsGroupBy>("day");

  const trendsQuery = useAdminTrends({ metric, period, group_by: groupBy });
  const data = trendsQuery.data?.data ?? [];
  const currency = (trendsQuery.data?.currency ?? "EUR") as Currency;
  const meta = METRIC_META[metric];
  const total = data.reduce((sum, point) => sum + point.value, 0);

  const chartConfig: ChartConfig = {
    value: { label: meta.label, color: meta.color },
  };

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-ink-charcoal">Revenue</h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            {formatMoney(total, currency)} · {meta.label.toLowerCase()} in this
            range.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            items={REVENUE_METRIC_OPTIONS.map((id) => ({
              label: METRIC_META[id].label,
              value: id,
            }))}
            value={metric}
            onValueChange={(next) => {
              if (next) setMetric(next as AdminTrendsMetric);
            }}
          >
            <SelectTrigger className="min-w-44 rounded-xl border-zinc-200 bg-white px-3.5 font-medium text-ink-charcoal shadow-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="w-auto min-w-48">
              <SelectGroup>
                {REVENUE_METRIC_OPTIONS.map((id) => (
                  <SelectItem key={id} value={id}>
                    {METRIC_META[id].label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
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
            No revenue recorded in this range.
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
            <AreaChart data={data} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={meta.color} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={meta.color} stopOpacity={0.02} />
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
                width={56}
                tickFormatter={(value: number) => formatMoney(value, currency)}
                className="text-[11px]"
              />
              <ChartTooltip
                cursor={{ stroke: "var(--color-neutral-line)" }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => formatBucketLabel(String(value), groupBy)}
                    formatter={(value) => (
                      <div className="flex flex-1 items-center justify-between gap-3 leading-none">
                        <span className="text-muted-foreground">{meta.label}</span>
                        <span className="font-mono font-medium text-foreground tabular-nums">
                          {formatMoney(Number(value), currency)}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Area
                dataKey="value"
                type="monotone"
                stroke={meta.color}
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
