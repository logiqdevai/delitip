"use client";

import { type FC, useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus, Trash2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useDistributionRules } from "@/features/distribution/hooks/use-distribution";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import { useUpdateStore } from "@/features/stores/hooks/use-stores";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { Routes } from "@/routes/routes";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";

const MAX_PRESETS = 6;

function currencySymbol(currency: Currency): string {
  return (
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
    })
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value ?? currency
  );
}

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
    return <Skeleton className="h-80 max-w-2xl rounded-2xl" />;
  }

  if (!store) return null;

  const defaultRule = rulesQuery.data?.find(
    (rule) => rule.id === store.default_distribution_rule_id,
  );
  const symbol = currencySymbol(store.currency);
  const canAddPreset = amounts.length < MAX_PRESETS;

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
    <div className="max-w-2xl space-y-5 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs sm:p-6">
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

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <Label className="text-xs font-semibold text-zinc-700">
            Suggested amounts
          </Label>
          <span className="text-[11px] tabular-nums text-zinc-400">
            {amounts.length}/{MAX_PRESETS} · {store.currency}
          </span>
        </div>

        {amounts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/70 px-4 py-8 text-center">
            <p className="text-xs font-medium text-zinc-600">No presets yet</p>
            <p className="mt-1 text-[11px] text-zinc-400">
              Add at least one amount guests can tap.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => updateAmounts([""])}
            >
              <Plus data-icon="inline-start" className="size-3.5" />
              Add preset
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {amounts.map((amount, index) => (
              <div
                key={index}
                className="group flex items-center gap-1 rounded-2xl border border-zinc-200 bg-zinc-50/80 py-2 pr-1.5 pl-3 transition focus-within:border-electric-lime focus-within:bg-brand-50/40 focus-within:ring-2 focus-within:ring-electric-lime/40"
              >
                <span className="text-sm font-bold text-zinc-400">{symbol}</span>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  aria-label={`Suggested tip amount ${index + 1}`}
                  onChange={(event) => {
                    const next = [...amounts];
                    next[index] = event.target.value;
                    updateAmounts(next);
                  }}
                  className="h-8 border-0 bg-transparent px-0 text-sm font-bold shadow-none focus-visible:ring-0"
                />
                <button
                  type="button"
                  onClick={() =>
                    updateAmounts(amounts.filter((_, i) => i !== index))
                  }
                  aria-label={`Remove amount ${index + 1}`}
                  className="flex size-6 shrink-0 items-center justify-center rounded-full text-zinc-400 transition hover:bg-signal-red/10 hover:text-signal-red"
                >
                  <Trash2 className="size-3" strokeWidth={2} />
                </button>
              </div>
            ))}

            {canAddPreset ? (
              <button
                type="button"
                onClick={() => updateAmounts([...amounts, ""])}
                className="flex min-h-[48px] items-center justify-center gap-1.5 rounded-2xl border border-dashed border-zinc-300 bg-white text-xs font-semibold text-zinc-500 transition hover:border-electric-lime hover:bg-brand-50/50 hover:text-brand-800"
              >
                <Plus className="size-3.5" strokeWidth={2} />
                Add
              </button>
            ) : null}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-100 bg-zinc-50/60 px-4 py-3.5">
        <div className="min-w-0">
          <Label htmlFor="allow-custom" className="text-xs font-semibold">
            Allow custom amount
          </Label>
          <p className="mt-0.5 text-[11px] text-zinc-500">
            Guests can type any tip instead of only presets.
          </p>
        </div>
        <Switch
          id="allow-custom"
          checked={allowCustom}
          onCheckedChange={updateAllowCustom}
        />
      </div>

      <Link
        href={Routes.dashboard.distribution}
        className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-200/80 px-4 py-3.5 transition hover:border-brand-200 hover:bg-brand-50/40"
      >
        <div className="min-w-0">
          <p className="text-xs font-semibold text-ink-charcoal">
            Default distribution rule
          </p>
          <p className="mt-0.5 truncate text-[11px] text-zinc-500">
            {rulesQuery.isPending
              ? "Loading…"
              : (defaultRule?.name ?? "Store default not set")}
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-brand-700">
          Manage
          <ArrowRight className="size-3.5" strokeWidth={2} />
        </span>
      </Link>

      <div className="flex items-center gap-3 border-t border-zinc-100 pt-4">
        <Button
          type="button"
          onClick={handleSave}
          disabled={updateStore.isPending || !hasChanges}
          className="rounded-xl bg-electric-lime px-4 text-chip font-semibold text-ink-charcoal shadow-lg shadow-lime/30 hover:bg-brand-700 disabled:opacity-40"
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
  );
};
