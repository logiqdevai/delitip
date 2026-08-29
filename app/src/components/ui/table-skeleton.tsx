import { type FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export const TableSkeleton: FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
}) => {
  return (
    <div className="flex w-full flex-col gap-3" aria-busy="true" aria-live="polite">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="ml-auto h-8 w-28" />
      </div>
      <div className="overflow-hidden rounded-xl border">
        <div
          className="grid gap-3 border-b bg-muted/40 px-4 py-3"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={`head-${index}`} className="h-4 w-24" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="grid gap-3 border-b px-4 py-3 last:border-b-0"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={`cell-${rowIndex}-${colIndex}`}
                className="h-4 w-full max-w-[10rem]"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
