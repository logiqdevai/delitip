"use client";

import { type FC, useState } from "react";
import Link from "next/link";
import { Wallet } from "lucide-react";
import { SettingsStepNav } from "../../components/settings-step-nav";
import {
  AllowCustomTipField,
  DefaultDistributionRuleField,
  TipPresetsField,
} from "./tipping-fields";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSetDefaultDistributionRule } from "@/features/distribution/hooks/use-distribution";
import { useUpdateStore } from "@/features/stores/hooks/use-stores";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { Routes } from "@/routes/routes";
import { cn } from "@/lib/utils";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";

export const TippingConfigSettingsForm: FC = () => {
  const { store, isPending } = useWorkspace();
  const updateStore = useUpdateStore();
  const setDefault = useSetDefaultDistributionRule(store?.id ?? "");

  const [loadedStoreId, setLoadedStoreId] = useState<string | null>(null);
  const [amounts, setAmounts] = useState<string[]>([]);
  const [allowCustom, setAllowCustom] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  if (store && store.id !== loadedStoreId) {
    setLoadedStoreId(store.id);
    setAmounts(store.suggested_tip_amounts.map((amount) => String(amount / 100)));
    setAllowCustom(store.allow_custom_tip_amount);
    setHasChanges(false);
  }

  useUnsavedChangesWarning(hasChanges);

  if (isPending) {
    return <Skeleton className="h-80 max-w-2xl rounded-2xl" />;
  }

  if (!store) return null;

  const handleDefaultRuleChange = (ruleId: string | null) => {
    if (!ruleId || ruleId === store.default_distribution_rule_id) return;
    void setDefault.mutateAsync({ distribution_rule_id: ruleId });
  };

  const updateAmounts = (next: string[]) => {
    setAmounts(next);
    setHasChanges(true);
  };

  const updateAllowCustom = (next: boolean) => {
    setAllowCustom(next);
    setHasChanges(true);
  };

  const handleSave = () => {
    const suggested_tip_amounts = amounts
      .map((value) => Math.round(Number.parseFloat(value) * 100))
      .filter((value) => Number.isFinite(value) && value > 0);

    updateStore.mutate(
      {
        id: store.id,
        payload: {
          suggested_tip_amounts,
          allow_custom_tip_amount: allowCustom,
        },
      },
      { onSuccess: () => setHasChanges(false) },
    );
  };

  return (
    <div className="max-w-2xl space-y-5 rounded-2xl border border-zinc-200/80 bg-white px-4 py-5 shadow-xs sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-800">
          <Wallet className="size-4" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-ink-charcoal">Tip presets</h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            Guests see these as quick-pick amounts on the tip step.
          </p>
        </div>
      </div>

      <TipPresetsField
        amounts={amounts}
        onChange={updateAmounts}
        currency={store.currency}
      />

      <AllowCustomTipField
        checked={allowCustom}
        onCheckedChange={updateAllowCustom}
      />

      <DefaultDistributionRuleField
        storeId={store.id}
        value={store.default_distribution_rule_id ?? ""}
        onChange={handleDefaultRuleChange}
        disabled={setDefault.isPending}
        action={
          <Link
            href={Routes.dashboard.accessDistribution}
            className={cn(
              buttonVariants({ variant: "secondary", size: "default" }),
              "w-full justify-center text-brand-700 md:h-auto md:w-auto md:bg-transparent md:px-0 md:py-0 md:text-[15px] md:font-semibold md:shadow-none md:hover:bg-transparent md:hover:underline",
            )}
          >
            Manage all →
          </Link>
        }
      />

      <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 border-t border-zinc-100 pt-4">
        <SettingsStepNav />
        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={handleSave}
            disabled={updateStore.isPending || !hasChanges}
            className="rounded-xl bg-electric-lime px-4 text-chip font-semibold text-ink-charcoal shadow-lg shadow-lime/30 disabled:opacity-40"
          >
            {updateStore.isPending ? "Saving…" : "Save Changes"}
          </Button>
          {hasChanges ? (
            <span className="text-[11px] font-medium text-zinc-400">
              Unsaved changes
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};
