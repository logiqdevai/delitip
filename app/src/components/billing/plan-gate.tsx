"use client";

import { type FC, type ReactNode } from "react";
import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubscription } from "@/features/subscriptions/hooks/use-subscriptions";
import type { SubscriptionPlan } from "@/features/subscriptions/interfaces/subscriptions.interfaces";
import { SubscriptionPlanFormOptions } from "@/config/constants/dropdowns/subscriptions/subscription-plan-form.options";
import { useDropdownLabel } from "@/hooks/use-dropdown-options";
import { hasPlanAccess } from "@/lib/plan-gate";
import { Routes } from "@/routes/routes";

const BILLING_HREF = Routes.dashboard.settings.billing;

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
  const t = useTranslations("dashboard.shell.planGate");
  const planLabel = useDropdownLabel();
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
        <EmptyTitle>
          {t("title", {
            feature: featureName,
            plan: planLabel(SubscriptionPlanFormOptions, requiredPlan),
          })}
        </EmptyTitle>
        <EmptyDescription>
          {t("description", {
            currentPlan: planLabel(
              SubscriptionPlanFormOptions,
              subscriptionQuery.data?.plan ?? "STARTER",
            ),
          })}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <a
          href={BILLING_HREF}
          onClick={(event) => {
            event.preventDefault();
            window.location.assign(BILLING_HREF);
          }}
          className="text-xs font-semibold text-brand-700 hover:underline"
        >
          {t("cta")}
        </a>
      </EmptyContent>
    </Empty>
  );
};
