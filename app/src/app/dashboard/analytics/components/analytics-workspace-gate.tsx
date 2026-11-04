"use client";

import { type FC, type ReactNode } from "react";
import { BarChart3 } from "lucide-react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("dashboard.analytics");
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
          <EmptyTitle>{t("gate.noStoreTitle")}</EmptyTitle>
          <EmptyDescription>{t("gate.noStoreDescription")}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <PlanGate
      organizationId={organizationId}
      requiredPlan="PROFESSIONAL"
      featureName={t("title")}
    >
      {children}
    </PlanGate>
  );
};
