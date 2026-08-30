"use client";

import { type FC } from "react";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ConfirmationDialog,
  useConfirmationDialog,
} from "@/components/ui/confirmation-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCancelSubscription,
  useChangeSubscriptionPlan,
  useSubscription,
} from "@/features/subscriptions/hooks/use-subscriptions";
import { SubscriptionPlanFormOptions } from "@/config/constants/dropdowns/subscriptions/subscription-plan-form.options";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { cn } from "@/lib/utils";

export const BillingSettingsPanel: FC = () => {
  const { organizationId, role } = useWorkspace();
  const subscriptionQuery = useSubscription(organizationId ?? "");
  const changePlan = useChangeSubscriptionPlan(organizationId ?? "");
  const cancelSubscription = useCancelSubscription(organizationId ?? "");
  const cancelConfirm = useConfirmationDialog();

  if (role !== "OWNER") return null;
  if (!organizationId) return null;

  const subscription = subscriptionQuery.data;

  return (
    <div className="max-w-2xl space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs">
      <div className="flex items-center gap-2">
        <CreditCard className="size-4 text-zinc-400" strokeWidth={2} />
        <h2 className="text-sm font-bold text-ink-charcoal">Billing</h2>
      </div>
      <p className="text-xs text-zinc-500">
        No real billing provider is connected yet — plan changes take effect
        immediately and for free.
      </p>

      {subscriptionQuery.isPending ? (
        <Skeleton className="h-24 w-full rounded-xl" />
      ) : !subscription ? (
        <p className="text-xs text-zinc-500">No subscription found.</p>
      ) : (
        <>
          <div className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-sm">
            <div>
              <div className="font-semibold text-ink-charcoal">
                {SubscriptionPlanFormOptions.find((o) => o.id === subscription.plan)?.label}
              </div>
              {subscription.current_period_end ? (
                <div className="text-xs text-zinc-400">
                  Renews {new Date(subscription.current_period_end).toLocaleDateString()}
                </div>
              ) : null}
            </div>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-caption font-bold",
                subscription.status === "ACTIVE"
                  ? "bg-brand-50 text-brand-700"
                  : subscription.status === "CANCELED"
                    ? "bg-zinc-100 text-zinc-600"
                    : "bg-amber-50 text-amber-700",
              )}
            >
              {subscription.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Select
              items={SubscriptionPlanFormOptions.map((option) => ({
                label: option.label,
                value: option.id,
              }))}
              value={subscription.plan}
              onValueChange={(value) => {
                if (value) {
                  changePlan.mutate({
                    plan: value as typeof subscription.plan,
                  });
                }
              }}
              disabled={changePlan.isPending}
            >
              <SelectTrigger size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {SubscriptionPlanFormOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {subscription.status !== "CANCELED" ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => cancelConfirm.openDialog()}
              >
                Cancel subscription
              </Button>
            ) : null}
          </div>
        </>
      )}

      <ConfirmationDialog
        state={cancelConfirm}
        title="Cancel subscription?"
        description="Your organization will lose access to plan-gated features at the end of the current period."
        confirmLabel="Cancel subscription"
        isPending={cancelSubscription.isPending}
        onConfirm={async () => {
          await cancelSubscription.mutateAsync();
        }}
      />
    </div>
  );
};
