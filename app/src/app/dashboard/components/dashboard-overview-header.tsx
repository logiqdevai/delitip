"use client";

import { type FC, type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";

interface DashboardOverviewHeaderProps {
  actions?: ReactNode;
}

export const DashboardOverviewHeader: FC<DashboardOverviewHeaderProps> = ({
  actions,
}) => {
  const { store, isPending } = useWorkspace();

  if (isPending) {
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        {actions ? <div className="flex gap-2">{actions}</div> : null}
      </div>
    );
  }

  return (
    <DashboardPageHeader
      title="Overview"
      description={
        store
          ? `Tips, reviews, and staff for ${store.name}.`
          : "Understand and manage great service across your business."
      }
      actions={actions}
    />
  );
};
