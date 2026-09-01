import { type FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const GettingStartedSkeleton: FC = () => (
  <div className="flex flex-col gap-6" aria-busy="true" aria-live="polite">
    <div className="space-y-2">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-80 max-w-full" />
    </div>
    <Skeleton className="h-2 w-full rounded-full" />
    <div className="space-y-3">
      {Array.from({ length: 7 }).map((_, index) => (
        <Skeleton key={index} className="h-[76px] w-full rounded-2xl" />
      ))}
    </div>
  </div>
);
