"use client";

import { type FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface QrCodeCardsSkeletonProps {
  count?: number;
}

export const QrCodeCardsSkeleton: FC<QrCodeCardsSkeletonProps> = ({
  count = 3,
}) => {
  return (
    <div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
      aria-busy="true"
      aria-live="polite"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`qr-skeleton-${index}`}
          className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <Skeleton className="mx-auto h-4 w-28" />
          <Skeleton className="mx-auto size-36 rounded-2xl" />
          <Skeleton className="mx-auto h-3 w-40" />
          <Skeleton className="h-8 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
};
