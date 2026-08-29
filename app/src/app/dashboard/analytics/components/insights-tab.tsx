"use client";

import { type FC } from "react";
import { format } from "date-fns";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import {
  useGenerateInsight,
  useInsights,
} from "@/features/analytics/hooks/use-analytics";
import { cn } from "@/lib/utils";

export const InsightsTab: FC<{ storeId: string }> = ({ storeId }) => {
  const insightsQuery = useInsights(storeId);
  const generateInsight = useGenerateInsight(storeId);

  const insights = insightsQuery.data?.data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-zinc-500">
          Rule-based summaries of the last period&apos;s feedback — no AI/LLM
          call, purely computed from your data.
        </p>
        <Button
          type="button"
          onClick={() => generateInsight.mutate({})}
          disabled={generateInsight.isPending}
          className="rounded-xl bg-electric-lime px-3.5 text-chip font-semibold text-ink-charcoal hover:bg-brand-700"
        >
          <Sparkles data-icon="inline-start" className="size-3.5" />
          {generateInsight.isPending ? "Generating…" : "Generate insight"}
        </Button>
      </div>

      {insightsQuery.isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : insightsQuery.isError ? (
        <p className="text-xs text-red-600">{insightsQuery.error.message}</p>
      ) : insights.length === 0 ? (
        <Empty className="border border-dashed border-zinc-200 bg-white py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Sparkles />
            </EmptyMedia>
            <EmptyTitle>No summaries yet</EmptyTitle>
            <EmptyDescription>
              Generate your first insight to see a summary of recent
              customer feedback.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-3">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="space-y-2 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs"
            >
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>
                  {format(new Date(insight.period_start), "MMM d")} –{" "}
                  {format(new Date(insight.period_end), "MMM d, yyyy")}
                </span>
                {insight.satisfaction_change_percent !== null ? (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold",
                      insight.satisfaction_change_percent >= 0
                        ? "bg-brand-50 text-brand-700"
                        : "bg-red-50 text-red-700",
                    )}
                  >
                    {insight.satisfaction_change_percent >= 0 ? "+" : ""}
                    {insight.satisfaction_change_percent}%
                  </span>
                ) : null}
              </div>
              <p className="text-sm text-zinc-700">{insight.summary}</p>
              {insight.top_praise || insight.top_complaint ? (
                <div className="flex flex-wrap gap-2 text-[11px]">
                  {insight.top_praise ? (
                    <span className="rounded-full bg-brand-50 px-2 py-0.5 font-medium text-brand-700">
                      👍 {insight.top_praise}
                    </span>
                  ) : null}
                  {insight.top_complaint ? (
                    <span className="rounded-full bg-red-50 px-2 py-0.5 font-medium text-red-700">
                      👎 {insight.top_complaint}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
