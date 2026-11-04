import {
  SubscriptionPlans,
  type SubscriptionPlan,
} from "@/features/subscriptions/interfaces/subscriptions.interfaces";

export const SubscriptionPlanFormOptions: {
  id: SubscriptionPlan;
  labelKey: string;
}[] = [
  {
    id: SubscriptionPlans.STARTER,
    labelKey: "dashboard.enums.subscriptionPlan.STARTER",
  },
  {
    id: SubscriptionPlans.PROFESSIONAL,
    labelKey: "dashboard.enums.subscriptionPlan.PROFESSIONAL",
  },
  {
    id: SubscriptionPlans.ENTERPRISE,
    labelKey: "dashboard.enums.subscriptionPlan.ENTERPRISE",
  },
];
