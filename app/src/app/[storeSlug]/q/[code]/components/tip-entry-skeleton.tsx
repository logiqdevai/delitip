import { type FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const TipEntrySkeleton: FC = () => {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-paper-offwhite">
      <div className="flex items-center justify-between border-b border-zinc-100 bg-white px-5 py-4">
        <div className="flex items-center gap-2.5">
          <Skeleton className="size-9 rounded-xl" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      <div className="flex flex-1 flex-col gap-6 px-5 py-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <Skeleton className="size-20 rounded-full" />
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-4 w-48" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
};
