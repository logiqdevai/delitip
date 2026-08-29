export const SubscriptionPlans = {
  STARTER: "STARTER",
  PROFESSIONAL: "PROFESSIONAL",
  ENTERPRISE: "ENTERPRISE",
} as const;
export type SubscriptionPlan =
  (typeof SubscriptionPlans)[keyof typeof SubscriptionPlans];

export const SubscriptionStatuses = {
  TRIALING: "TRIALING",
  ACTIVE: "ACTIVE",
  PAST_DUE: "PAST_DUE",
  CANCELED: "CANCELED",
} as const;
export type SubscriptionStatus =
  (typeof SubscriptionStatuses)[keyof typeof SubscriptionStatuses];

export interface Subscription {
  id: string;
  organization_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  billing_provider_customer_id?: string | null;
  billing_provider_subscription_id?: string | null;
  current_period_start?: string | null;
  current_period_end?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateSubscriptionPayload {
  plan: SubscriptionPlan;
}
