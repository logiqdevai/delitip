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
    <ul
      className="divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs"
      aria-busy="true"
      aria-live="polite"
    >
      {Array.from({ length: count }).map((_, index) => (
        <li
          key={`employee-skeleton-${index}`}
          className="flex items-center justify-between gap-4 px-4 py-3.5"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
              <Skeleton className="h-3 w-48 max-w-full" />
            </div>
          </div>
          <div className="flex shrink-0 gap-1">
            <Skeleton className="size-8 rounded-lg" />
            <Skeleton className="size-8 rounded-lg" />
            <Skeleton className="size-8 rounded-lg" />
          </div>
        </li>
      ))}
    </ul>
  );
};
