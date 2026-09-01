"use client";

import { type FC } from "react";
import { ListChecks } from "lucide-react";
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
          <EmptyTitle>No store selected</EmptyTitle>
          <EmptyDescription>
            Finish business setup before viewing your checklist.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const progressPct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <>
      <DashboardPageHeader
        title="Getting Started"
        description={`${completedCount} of ${total} steps done for ${store.name}.`}
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
