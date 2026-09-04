"use client";

import { type FC, useState } from "react";
import Link from "next/link";
import { Plus, Split, Trash2, Wallet } from "lucide-react";
import { DistributionRuleFormDialog } from "@/app/dashboard/distribution/components/distribution-rule-form-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  useDistributionRules,
  useSetDefaultDistributionRule,
} from "@/features/distribution/hooks/use-distribution";
import { formatRecipientSummary } from "@/features/distribution/utils/distribution-summary.utils";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import { useUpdateStore } from "@/features/stores/hooks/use-stores";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { Routes } from "@/routes/routes";
import { cn } from "@/lib/utils";
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
  const setDefault = useSetDefaultDistributionRule(store?.id ?? "");

  const [loadedStoreId, setLoadedStoreId] = useState<string | null>(null);
  const [amounts, setAmounts] = useState<string[]>([]);
  const [allowCustom, setAllowCustom] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [ruleFormOpen, setRuleFormOpen] = useState(false);

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

  const rules = rulesQuery.data ?? [];
  const defaultRule = rules.find(
    (rule) => rule.id === store.default_distribution_rule_id,
  );
  const symbol = currencySymbol(store.currency);
  const canAddPreset = amounts.length < MAX_PRESETS;

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

      <div className="space-y-4 rounded-2xl border border-zinc-200/80 px-4 py-3.5 sm:space-y-2">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-neutral-fill text-zinc-400">
            <Split className="size-4" strokeWidth={2} />
          </span>
          <div className="min-w-0 flex-1">
            <Label htmlFor="default-distribution-rule" className="text-xs font-semibold text-ink-charcoal">
              Default distribution rule
            </Label>
            <p className="mt-0.5 text-[11px] text-zinc-500">
              Used when a QR code does not override the split.
            </p>
          </div>
          <Link
            href={Routes.dashboard.distribution}
            className={cn(
              buttonVariants({ variant: "secondary", size: "default" }),
              "w-full justify-center text-brand-700 md:h-auto md:w-auto md:bg-transparent md:px-0 md:py-0 md:text-[11px] md:font-semibold md:shadow-none md:hover:bg-transparent md:hover:underline",
            )}
          >
            Manage all →
          </Link>
        </div>

        {rulesQuery.isPending ? (
          <Skeleton className="h-9 w-full rounded-lg" />
        ) : (
          <Select
            items={rules.map((rule) => ({
              label: rule.name,
              value: rule.id,
            }))}
            value={store.default_distribution_rule_id ?? ""}
            onValueChange={handleDefaultRuleChange}
            disabled={setDefault.isPending || rules.length === 0}
          >
            <SelectTrigger id="default-distribution-rule" className="w-full">
              <SelectValue
                placeholder={
                  rules.length === 0
                    ? "No rules yet — create one"
                    : "Select a default rule"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {rules.map((rule) => (
                  <SelectItem key={rule.id} value={rule.id}>
                    {rule.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}

        {defaultRule ? (
          <p className="truncate text-[11px] text-zinc-500">
            {formatRecipientSummary(defaultRule.recipients)}
          </p>
        ) : null}

        <Button
          type="button"
          variant="link"
          className="h-auto px-0 text-xs font-semibold text-brand-700"
          onClick={() => setRuleFormOpen(true)}
        >
          <Plus data-icon="inline-start" className="size-3.5" />
          Create distribution rule
        </Button>
      </div>

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

      <DistributionRuleFormDialog
        open={ruleFormOpen}
        onOpenChange={setRuleFormOpen}
        storeId={store.id}
        onCreated={(rule) => {
          void setDefault.mutateAsync({ distribution_rule_id: rule.id });
        }}
      />
    </div>
  );
};
