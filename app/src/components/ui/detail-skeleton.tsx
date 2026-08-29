import { type FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface DetailSkeletonProps {
  fieldCount?: number;
  showSubTable?: boolean;
}

export const DetailSkeleton: FC<DetailSkeletonProps> = ({
  fieldCount = 6,
  showSubTable = false,
}) => {
  return (
    <div className="flex w-full flex-col gap-6" aria-busy="true" aria-live="polite">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: fieldCount }).map((_, index) => (
          <div key={`field-${index}`} className="flex flex-col gap-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </div>
      {showSubTable ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-36" />
          <div className="flex flex-col gap-2 rounded-xl border p-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={`sub-${index}`} className="h-4 w-full" />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
