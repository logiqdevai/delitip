"use client";

import { type FC, type ReactNode, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, ChevronUp, Plus, Split, Trash2 } from "lucide-react";
import { DistributionRuleFormDialog } from "@/app/dashboard/distribution/components/distribution-rule-form-dialog";
import { Button } from "@/components/ui/button";
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
import { useDistributionRules } from "@/features/distribution/hooks/use-distribution";
import { formatRecipientSummary } from "@/features/distribution/utils/distribution-summary.utils";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import { getCurrencySymbol } from "@/lib/money";

const MAX_PRESETS = 6;

interface TipPresetsFieldProps {
  /** Amounts in major units, as typed (e.g. "5", "7.5"). */
  amounts: string[];
  onChange: (amounts: string[]) => void;
  currency: Currency;
  error?: string;
}

export const TipPresetsField: FC<TipPresetsFieldProps> = ({
  amounts,
  onChange,
  currency,
  error,
}) => {
  const t = useTranslations("dashboard.settings.tipping");
  const tUi = useTranslations("dashboard.shell.ui");
  const nudge = (index: number, direction: 1 | -1) => {
    const current = Number.parseFloat(amounts[index] ?? "");
    const next = Math.max(1, (Number.isFinite(current) ? current : 0) + direction);
    const copy = [...amounts];
    copy[index] = String(next);
    onChange(copy);
  };
  const locale = useLocale();
  const symbol = getCurrencySymbol(currency, locale);
  const canAddPreset = amounts.length < MAX_PRESETS;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Label className="text-xs font-semibold text-zinc-700">
          {t("suggestedAmounts")}
        </Label>
        <span className="text-base tabular-nums text-zinc-400">
          {amounts.length}/{MAX_PRESETS} · {currency}
        </span>
      </div>

      {amounts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/70 px-4 py-8 text-center">
          <p className="text-xs font-medium text-zinc-600">
            {t("emptyTitle")}
          </p>
          <p className="mt-1 text-base text-zinc-400">
            {t("emptyDescription")}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => onChange([""])}
          >
            <Plus data-icon="inline-start" />
            {t("addPreset")}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 @md:grid-cols-3">
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
                aria-label={t("amountAria", { number: index + 1 })}
                onChange={(event) => {
                  const next = [...amounts];
                  next[index] = event.target.value;
                  onChange(next);
                }}
                className="h-8 border-0 bg-transparent px-0 text-sm font-bold shadow-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <div className="flex shrink-0 flex-col">
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={tUi("increase")}
                  onClick={() => nudge(index, 1)}
                  className="flex h-3.5 w-5 items-center justify-center rounded-t-md text-zinc-400 transition hover:bg-electric-lime/40 hover:text-ink-charcoal"
                >
                  <ChevronUp className="size-3" strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={tUi("decrease")}
                  onClick={() => nudge(index, -1)}
                  className="flex h-3.5 w-5 items-center justify-center rounded-b-md text-zinc-400 transition hover:bg-electric-lime/40 hover:text-ink-charcoal"
                >
                  <ChevronDown className="size-3" strokeWidth={2.5} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => onChange(amounts.filter((_, i) => i !== index))}
                aria-label={t("removeAria", { number: index + 1 })}
                className="flex size-6 shrink-0 items-center justify-center rounded-full text-zinc-400 transition hover:bg-signal-red/10 hover:text-signal-red"
              >
                <Trash2 className="size-3" strokeWidth={2} />
              </button>
            </div>
          ))}

          {canAddPreset ? (
            <button
              type="button"
              onClick={() => onChange([...amounts, ""])}
              className="flex min-h-[48px] items-center justify-center gap-1.5 rounded-2xl border border-dashed border-zinc-300 bg-white text-xs font-semibold text-zinc-500 transition hover:border-electric-lime hover:bg-brand-50/50 hover:text-brand-800"
            >
              <Plus className="size-3.5" strokeWidth={2} />
              {t("addShort")}
            </button>
          ) : null}
        </div>
      )}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
};

interface AllowCustomTipFieldProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const AllowCustomTipField: FC<AllowCustomTipFieldProps> = ({
  checked,
  onCheckedChange,
}) => {
  const t = useTranslations("dashboard.settings.tipping");

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-100 bg-zinc-50/60 px-4 py-3.5">
      <div className="min-w-0">
        <Label htmlFor="allow-custom" className="text-xs font-semibold">
          {t("allowCustom")}
        </Label>
        <p className="mt-0.5 text-base text-zinc-500">
          {t("allowCustomHelp")}
        </p>
      </div>
      <Switch
        id="allow-custom"
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
};

interface DefaultDistributionRuleFieldProps {
  storeId: string;
  /** Selected rule id, or "" when none is set. */
  value: string;
  onChange: (ruleId: string) => void;
  disabled?: boolean;
  /** Rendered next to the label, e.g. a "Manage all" link. */
  action?: ReactNode;
}

export const DefaultDistributionRuleField: FC<
  DefaultDistributionRuleFieldProps
> = ({ storeId, value, onChange, disabled = false, action }) => {
  const t = useTranslations("dashboard.settings.tipping");
  const rulesQuery = useDistributionRules(storeId);
  const [ruleFormOpen, setRuleFormOpen] = useState(false);

  const rules = rulesQuery.data ?? [];
  const selectedRule = rules.find((rule) => rule.id === value);

  return (
    <div className="space-y-4 rounded-2xl border border-zinc-200/80 px-4 py-3.5 sm:space-y-2">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-neutral-fill text-zinc-400">
          <Split className="size-4" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <Label
            htmlFor="default-distribution-rule"
            className="text-xs font-semibold text-ink-charcoal"
          >
            {t("defaultRule")}
          </Label>
          <p className="mt-0.5 text-base text-zinc-500">
            {t("defaultRuleHelp")}
          </p>
        </div>
        {action}
      </div>

      {rulesQuery.isPending ? (
        <Skeleton className="h-9 w-full rounded-lg" />
      ) : (
        <Select
          items={rules.map((rule) => ({ label: rule.name, value: rule.id }))}
          value={value}
          onValueChange={(next) => onChange(next ?? "")}
          disabled={disabled || rules.length === 0}
        >
          <SelectTrigger id="default-distribution-rule" className="w-full">
            <SelectValue
              placeholder={
                rules.length === 0 ? t("noRules") : t("selectRule")
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

      {selectedRule ? (
        <p className="truncate text-base text-zinc-500">
          {formatRecipientSummary(selectedRule.recipients)}
        </p>
      ) : null}

      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => setRuleFormOpen(true)}
      >
        <Plus data-icon="inline-start" />
        {t("createRule")}
      </Button>

      <DistributionRuleFormDialog
        open={ruleFormOpen}
        onOpenChange={setRuleFormOpen}
        storeId={storeId}
        onCreated={(rule) => onChange(rule.id)}
      />
    </div>
  );
};
