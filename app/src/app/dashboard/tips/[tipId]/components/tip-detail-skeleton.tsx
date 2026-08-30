import { type FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const TipDetailSkeleton: FC = () => {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <Skeleton className="h-3.5 w-24" />

      <div className="flex items-center justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-3 w-40" />
        </div>
        <Skeleton className="h-7 w-20 rounded-full" />
      </div>

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
        <Skeleton className="mb-3 h-4 w-20" />
        <div className="divide-y divide-zinc-100">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={`summary-${index}`}
              className="flex items-center justify-between py-2.5"
            >
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3.5 w-24" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
        <Skeleton className="mb-4 h-4 w-24" />
        <div className="divide-y divide-zinc-100">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`distribution-${index}`}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
