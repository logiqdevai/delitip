"use client";

import { type FC, type ReactNode } from "react";
import { BarChart3 } from "lucide-react";
import { DetailSkeleton } from "@/components/ui/detail-skeleton";
import { PlanGate } from "@/components/billing/plan-gate";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";

interface AnalyticsWorkspaceGateProps {
  children: ReactNode;
}

export const AnalyticsWorkspaceGate: FC<AnalyticsWorkspaceGateProps> = ({
  children,
}) => {
  const {
    store,
    storeId,
    organizationId,
    isPending: workspacePending,
    isReady,
  } = useWorkspace();

  if (workspacePending) {
    return <DetailSkeleton fieldCount={4} />;
  }

  if (!isReady || !storeId || !organizationId || !store) {
    return (
      <Empty className="border border-dashed border-zinc-200 bg-white py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BarChart3 />
          </EmptyMedia>
          <EmptyTitle>No store selected</EmptyTitle>
          <EmptyDescription>
            Finish business setup before viewing analytics.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <PlanGate
      organizationId={organizationId}
      requiredPlan="PROFESSIONAL"
      featureName="Analytics & Insights"
    >
      {children}
    </PlanGate>
  );
};
