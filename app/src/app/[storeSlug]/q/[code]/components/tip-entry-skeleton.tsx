import { type FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const TipEntrySkeleton: FC = () => {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-paper-offwhite">
      <Skeleton className="h-32 w-full rounded-none sm:h-40" />

      <div className="-mt-10 flex flex-col items-center gap-3 px-6 pb-6 text-center">
        <Skeleton className="size-20 rounded-2xl ring-4 ring-white" />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-4 w-56" />
      </div>

      <div className="flex flex-1 flex-col gap-6 px-5 py-8">
        <div className="flex flex-col items-center gap-1">
          <Skeleton className="h-5 w-32" />
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <Skeleton className="h-14 rounded-2xl" />
          <Skeleton className="h-14 rounded-2xl" />
          <Skeleton className="h-14 rounded-2xl" />
        </div>
      </div>
    </div>
  );
};
