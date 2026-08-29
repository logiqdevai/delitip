import {
  SubscriptionPlans,
  type SubscriptionPlan,
} from "@/features/subscriptions/interfaces/subscriptions.interfaces";

export const SubscriptionPlanFormOptions: { id: SubscriptionPlan; label: string }[] = [
  { id: SubscriptionPlans.STARTER, label: "Starter" },
  { id: SubscriptionPlans.PROFESSIONAL, label: "Professional" },
  { id: SubscriptionPlans.ENTERPRISE, label: "Enterprise" },
];

export function getSubscriptionPlanLabel(plan: SubscriptionPlan | string): string {
  return (
    SubscriptionPlanFormOptions.find((option) => option.id === plan)?.label ??
    plan
  );
}
