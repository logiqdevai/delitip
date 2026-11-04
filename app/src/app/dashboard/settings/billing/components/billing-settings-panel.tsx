"use client";

import { type FC } from "react";
import { useFormatter, useTranslations } from "next-intl";
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
import { useDropdownOptions } from "@/hooks/use-dropdown-options";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { cn } from "@/lib/utils";

export const BillingSettingsPanel: FC = () => {
  const t = useTranslations("dashboard.settings.billing");
  const format = useFormatter();
  const planOptions = useDropdownOptions(SubscriptionPlanFormOptions);
  const { organizationId, role } = useWorkspace();
  const subscriptionQuery = useSubscription(organizationId ?? "");
  const changePlan = useChangeSubscriptionPlan(organizationId ?? "");
  const cancelSubscription = useCancelSubscription(organizationId ?? "");
  const cancelConfirm = useConfirmationDialog();

  if (!organizationId) return null;

  if (role !== "OWNER") {
    return (
      <div className="max-w-2xl space-y-4 rounded-2xl border border-zinc-200/80 bg-white px-4 py-6 shadow-xs">
        <div className="flex items-center gap-2">
          <CreditCard className="size-4 text-zinc-400" strokeWidth={2} />
          <h2 className="text-sm font-bold text-ink-charcoal">{t("title")}</h2>
        </div>
        <p className="text-xs text-zinc-500">
          {t("ownerOnly")}
        </p>
      </div>
    );
  }

  const subscription = subscriptionQuery.data;

  return (
    <div className="max-w-2xl space-y-4 rounded-2xl border border-zinc-200/80 bg-white px-4 py-6 shadow-xs">
      <div className="flex items-center gap-2">
        <CreditCard className="size-4 text-zinc-400" strokeWidth={2} />
        <h2 className="text-sm font-bold text-ink-charcoal">{t("title")}</h2>
      </div>
      <p className="text-xs text-zinc-500">
        {t("noProvider")}
      </p>

      {subscriptionQuery.isPending ? (
        <Skeleton className="h-24 w-full rounded-xl" />
      ) : !subscription ? (
        <p className="text-xs text-zinc-500">{t("noSubscription")}</p>
      ) : (
        <>
          <div className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 p-4 text-sm">
            <div>
              <div className="font-semibold text-ink-charcoal">
                {planOptions.find((o) => o.id === subscription.plan)?.label}
              </div>
              {subscription.current_period_end ? (
                <div className="text-xs text-zinc-400">
                  {t("renews", {
                    date: format.dateTime(new Date(subscription.current_period_end), {
                      dateStyle: "medium",
                    }),
                  })}
                </div>
              ) : null}
            </div>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide",
                subscription.status === "ACTIVE"
                  ? "bg-brand-50 text-brand-700"
                  : subscription.status === "CANCELED"
                    ? "bg-zinc-100 text-zinc-600"
                    : "bg-amber-50 text-amber-700",
              )}
            >
              {t(`status.${subscription.status}`)}
            </span>
          </div>

          <div className="flex items-stretch gap-2">
            <Select
              items={planOptions.map((option) => ({
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
              <SelectTrigger
                size="sm"
                className="h-11 min-h-11 flex-1 sm:h-(--control-height-sm) sm:min-h-(--control-height-sm) sm:flex-none sm:w-fit"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {planOptions.map((option) => (
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
                className="h-11 min-h-11 flex-1 sm:h-(--control-height-sm) sm:min-h-(--control-height-sm) sm:flex-none"
                onClick={() => cancelConfirm.openDialog()}
              >
                {t("cancelButton")}
              </Button>
            ) : null}
          </div>
        </>
      )}

      <ConfirmationDialog
        state={cancelConfirm}
        title={t("cancelDialog.title")}
        description={t("cancelDialog.description")}
        confirmLabel={t("cancelDialog.confirm")}
        isPending={cancelSubscription.isPending}
        onConfirm={async () => {
          await cancelSubscription.mutateAsync();
        }}
      />
    </div>
  );
};
