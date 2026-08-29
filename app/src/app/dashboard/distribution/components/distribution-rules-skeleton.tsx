"use client";

import { type FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface DistributionRulesSkeletonProps {
  count?: number;
}

export const DistributionRulesSkeleton: FC<DistributionRulesSkeletonProps> = ({
  count = 3,
}) => {
  return (
    <div className="space-y-3" aria-busy="true" aria-live="polite">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`rule-skeleton-${index}`}
          className="space-y-3 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs"
        >
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-3 w-full max-w-md" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};
