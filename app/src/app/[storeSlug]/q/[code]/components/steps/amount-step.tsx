"use client";

import { type FC, useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { NumberPicker } from "@/components/ui/number-picker";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import { formatMoney, getCurrencySymbol } from "@/lib/money";
import { cn } from "@/lib/utils";

interface AmountStepProps {
  currency: Currency;
  suggestedAmounts: number[];
  allowCustomAmount: boolean;
  subtitle?: string;
  recipientLabel: string;
  onContinue: (amountMinorUnits: number) => void;
}

export const AmountStep: FC<AmountStepProps> = ({
  currency,
  suggestedAmounts,
  allowCustomAmount,
  subtitle,
  recipientLabel,
  onContinue,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<number | null>(
    suggestedAmounts[0] ?? null,
  );
  const [customAmount, setCustomAmount] = useState(0);

  const customMinorUnits = customAmount > 0 ? Math.round(customAmount * 100) : null;

  const amount = customMinorUnits ?? selectedPreset ?? 0;
  const canContinue = amount > 0;

  return (
    <div className="flex flex-1 flex-col gap-6 px-5 py-8">
      <div className="text-center">
        <h1 className="text-lg font-bold text-muted-foreground uppercase">
          Choose your tip
        </h1>
        {subtitle ? (
          <p className="mx-auto mt-1 max-w-[280px] truncate text-xs text-zinc-500">
            {subtitle}
          </p>
        ) : null}
      </div>

      {suggestedAmounts.length > 0 ? (
        <div className="grid grid-cols-3 gap-2.5">
          {suggestedAmounts.map((preset) => {
            const active = !customMinorUnits && selectedPreset === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setSelectedPreset(preset);
                  setCustomAmount(0);
                }}
                className={cn(
                  "rounded-2xl border p-3 text-center text-sm font-bold transition",
                  active
                    ? "border-2 border-(--tip-primary) bg-(--tip-primary)/10 text-(--tip-secondary)"
                    : "border-zinc-200 bg-white text-ink-charcoal hover:border-(--tip-primary) hover:bg-(--tip-primary)/10",
                )}
              >
                {formatMoney(preset, currency)}
              </button>
            );
          })}
        </div>
      ) : null}

      {allowCustomAmount ? (
        <div className="space-y-2">
          <p className="text-center text-xs font-semibold tracking-wide text-zinc-500 uppercase">
            Custom amount
          </p>
          <NumberPicker
            value={customAmount}
            onChange={setCustomAmount}
            min={0}
            max={1000}
            step={1}
            suffix={getCurrencySymbol(currency)}
            aria-label="Custom tip amount"
            className="w-full"
          />
        </div>
      ) : null}

      <div className="flex items-center gap-2.5 rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-[11px] text-zinc-600">
        <ShieldCheck
          className="size-4 shrink-0 text-(--tip-primary)"
          strokeWidth={2}
        />
        <span>
          100% transparent. Tips are sent securely and directly to{" "}
          {recipientLabel}.
        </span>
      </div>

      <button
        type="button"
        disabled={!canContinue}
        onClick={() => onContinue(amount)}
        className="mt-auto flex w-full items-center justify-center gap-2 rounded-2xl bg-(--tip-primary) py-3.5 text-sm font-semibold text-(--tip-primary-foreground) shadow-lg shadow-(--tip-primary)/30 transition hover:bg-(--tip-secondary) disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span>
          {canContinue
            ? `Continue to pay ${formatMoney(amount, currency)}`
            : "Choose an amount"}
        </span>
        <ArrowRight className="size-4" strokeWidth={2} />
      </button>
    </div>
  );
};
