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
          className="flex items-start gap-2 px-4 py-3 sm:items-center sm:gap-4 sm:py-3.5"
        >
          <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                <Skeleton className="h-4 w-28" />
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-5 w-14 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              </div>
              <Skeleton className="mt-0.5 h-3 w-48 max-w-full" />
            </div>
          </div>
          <Skeleton className="size-8 shrink-0 rounded-lg" />
        </li>
      ))}
    </ul>
  );
};
