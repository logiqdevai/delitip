"use client";

import { type FC, type ReactNode } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubscription } from "@/features/subscriptions/hooks/use-subscriptions";
import type { SubscriptionPlan } from "@/features/subscriptions/interfaces/subscriptions.interfaces";
import { getSubscriptionPlanLabel } from "@/config/constants/dropdowns/subscriptions/subscription-plan-form.options";
import { hasPlanAccess } from "@/lib/plan-gate";
import { Routes } from "@/routes/routes";

interface PlanGateProps {
  organizationId: string;
  requiredPlan: SubscriptionPlan;
  featureName: string;
  children: ReactNode;
}

export const PlanGate: FC<PlanGateProps> = ({
  organizationId,
  requiredPlan,
  featureName,
  children,
}) => {
  const subscriptionQuery = useSubscription(organizationId);

  if (subscriptionQuery.isPending) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (hasPlanAccess(subscriptionQuery.data?.plan, requiredPlan)) {
    return <>{children}</>;
  }

  return (
    <Empty className="border border-dashed border-zinc-200 bg-white py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Lock />
        </EmptyMedia>
        <EmptyTitle>{featureName} needs the {getSubscriptionPlanLabel(requiredPlan)} plan</EmptyTitle>
        <EmptyDescription>
          {`You're currently on the ${subscriptionQuery.data ? getSubscriptionPlanLabel(subscriptionQuery.data.plan) : "Starter"} plan. Upgrade in Settings → Billing to unlock this.`}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link
          href={Routes.dashboard.settings.billing}
          className="text-xs font-semibold text-brand-700 hover:underline"
        >
          Go to Billing →
        </Link>
      </EmptyContent>
    </Empty>
  );
};
