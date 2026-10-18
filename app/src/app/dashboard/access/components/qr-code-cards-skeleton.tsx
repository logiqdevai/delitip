"use client";

import { type FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface QrCodeCardsSkeletonProps {
  count?: number;
}

export const QrCodeCardsSkeleton: FC<QrCodeCardsSkeletonProps> = ({
  count = 2,
}) => {
  return (
    <div
      className="grid grid-cols-1 gap-6 xl:grid-cols-2"
      aria-busy="true"
      aria-live="polite"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`qr-skeleton-${index}`}
          className="space-y-5 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="size-11 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-52 max-w-full" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <div className="flex items-center gap-8 px-2">
            <Skeleton className="size-44 shrink-0 rounded-3xl" />
            <div className="hidden flex-1 space-y-4 sm:block">
              {Array.from({ length: 4 }).map((_, row) => (
                <div key={row} className="space-y-1.5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Skeleton className="h-11 rounded-xl" />
            <Skeleton className="h-11 rounded-xl" />
            <Skeleton className="h-11 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};
