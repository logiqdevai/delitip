"use client";

import { type FC, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";

interface DashboardOverviewHeaderProps {
  actions?: ReactNode;
}

export const DashboardOverviewHeader: FC<DashboardOverviewHeaderProps> = ({
  actions,
}) => {
  const t = useTranslations("dashboard.shell.overview");
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
      title={t("title")}
      description={
        store
          ? t("descriptionStore", { store: store.name })
          : t("descriptionDefault")
      }
      actions={actions}
    />
  );
};
