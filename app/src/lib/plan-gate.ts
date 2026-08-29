import type { SubscriptionPlan } from "@/features/subscriptions/interfaces/subscriptions.interfaces";

const PLAN_RANK: Record<SubscriptionPlan, number> = {
  STARTER: 0,
  PROFESSIONAL: 1,
  ENTERPRISE: 2,
};

export function hasPlanAccess(
  currentPlan: SubscriptionPlan | undefined,
  requiredPlan: SubscriptionPlan,
): boolean {
  if (!currentPlan) return false;
  return PLAN_RANK[currentPlan] >= PLAN_RANK[requiredPlan];
}
