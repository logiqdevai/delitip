"use client";

import { type FC } from "react";
import { ListChecks } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { GettingStartedStepCard } from "@/app/dashboard/getting-started/components/getting-started-step-card";
import { GettingStartedSkeleton } from "@/app/dashboard/getting-started/components/getting-started-skeleton";
import { useGettingStartedSteps } from "@/hooks/use-getting-started-steps";

export const GettingStartedPageContent: FC = () => {
  const t = useTranslations("dashboard.shell.gettingStarted");
  const { store, steps, completedCount, total, isPending, isReady } =
    useGettingStartedSteps();

  if (isPending) {
    return <GettingStartedSkeleton />;
  }

  if (!isReady || !store) {
    return (
      <Empty className="border border-dashed border-zinc-200 bg-white py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ListChecks />
          </EmptyMedia>
          <EmptyTitle>{t("noStoreTitle")}</EmptyTitle>
          <EmptyDescription>
            {t("noStoreDescription")}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const progressPct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <>
      <DashboardPageHeader
        title={t("title")}
        description={t("progress", {
          completed: completedCount,
          total,
          store: store.name,
        })}
      />

      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-fill">
        <div
          className="h-full rounded-full bg-electric-lime transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex flex-col gap-3">
        {steps.map((step) => (
          <GettingStartedStepCard key={step.id} step={step} />
        ))}
      </div>
    </>
  );
};
