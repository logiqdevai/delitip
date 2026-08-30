"use client";

import { type FC, useState } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useDistributionRules } from "@/features/distribution/hooks/use-distribution";
import { useUpdateStore } from "@/features/stores/hooks/use-stores";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { formatMoney } from "@/lib/money";
import { Routes } from "@/routes/routes";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";

export const TippingConfigSettingsForm: FC = () => {
  const { store, isPending } = useWorkspace();
  const updateStore = useUpdateStore();
  const rulesQuery = useDistributionRules(store?.id ?? "");

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
    return <Skeleton className="h-72 max-w-2xl rounded-2xl" />;
  }

  if (!store) return null;

  const defaultRule = rulesQuery.data?.find(
    (rule) => rule.id === store.default_distribution_rule_id,
  );

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
    <div className="max-w-2xl space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs">
      <div>
        <h2 className="text-sm font-bold text-ink-charcoal">
          Tipping configuration
        </h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          Presets shown on the tip flow, and whether guests can enter a
          custom amount.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Suggested amounts ({store.currency})</Label>
        <div className="space-y-2">
          {amounts.map((amount, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(event) => {
                  const next = [...amounts];
                  next[index] = event.target.value;
                  updateAmounts(next);
                }}
                className="max-w-[140px]"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => updateAmounts(amounts.filter((_, i) => i !== index))}
                aria-label="Remove amount"
              >
                <Minus className="size-3.5" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => updateAmounts([...amounts, ""])}
          >
            <Plus data-icon="inline-start" className="size-3.5" />
            Add preset
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
        <div>
          <Label htmlFor="allow-custom">Allow custom amount</Label>
          <p className="text-[11px] text-zinc-400">
            Let guests type in their own tip amount.
          </p>
        </div>
        <Switch id="allow-custom" checked={allowCustom} onCheckedChange={updateAllowCustom} />
      </div>

      <div className="flex items-center justify-between border-t border-zinc-100 pt-4 text-xs">
        <span className="text-zinc-500">Default distribution rule</span>
        <div className="flex items-center gap-2">
          {rulesQuery.isPending ? (
            <Skeleton className="h-4 w-28" />
          ) : (
            <span className="font-semibold text-ink-charcoal">
              {defaultRule?.name ?? "Store default not set"}
            </span>
          )}
          <Link
            href={Routes.dashboard.distribution}
            className="font-semibold text-brand-700 hover:underline"
          >
            Manage →
          </Link>
        </div>
      </div>

      {amounts.length > 0 ? (
        <p className="text-[11px] text-zinc-400">
          Preview: {amounts
            .map((amount) => Number.parseFloat(amount))
            .filter((value) => Number.isFinite(value) && value > 0)
            .map((value) => formatMoney(Math.round(value * 100), store.currency))
            .join(" · ")}
        </p>
      ) : null}

      <div className="pt-2">
        <Button
          type="button"
          onClick={handleSave}
          disabled={updateStore.isPending}
          className="rounded-xl bg-electric-lime px-4 text-chip font-semibold text-ink-charcoal hover:bg-brand-700"
        >
          {updateStore.isPending ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};
