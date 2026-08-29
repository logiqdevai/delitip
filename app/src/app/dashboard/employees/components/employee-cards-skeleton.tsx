"use client";

import { type FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface EmployeeCardsSkeletonProps {
  count?: number;
}

export const EmployeeCardsSkeleton: FC<EmployeeCardsSkeletonProps> = ({
  count = 6,
}) => {
  return (
    <div
      className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
      aria-busy="true"
      aria-live="polite"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`employee-skeleton-${index}`}
          className="space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="size-12 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
          <div className="space-y-2 border-t border-zinc-100 pt-3">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-8 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
};
