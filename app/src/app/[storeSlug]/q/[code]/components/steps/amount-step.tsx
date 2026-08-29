"use client";

import { type FC, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

interface AmountStepProps {
  currency: Currency;
  suggestedAmounts: number[];
  allowCustomAmount: boolean;
  recipientLabel: string;
  onContinue: (amountMinorUnits: number) => void;
}

export const AmountStep: FC<AmountStepProps> = ({
  currency,
  suggestedAmounts,
  allowCustomAmount,
  recipientLabel,
  onContinue,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<number | null>(
    suggestedAmounts[0] ?? null,
  );
  const [customAmount, setCustomAmount] = useState("");

  const customMinorUnits = (() => {
    const parsed = Number.parseFloat(customAmount.replace(",", "."));
    if (customAmount.trim() && Number.isFinite(parsed) && parsed > 0) {
      return Math.round(parsed * 100);
    }
    return null;
  })();

  const amount = customMinorUnits ?? selectedPreset ?? 0;
  const canContinue = amount > 0;

  return (
    <div className="auth-fade-enter flex flex-1 flex-col gap-6 px-5 py-8">
      <div className="text-center">
        <h1 className="text-lg font-bold text-ink-charcoal">
          Choose your tip
        </h1>
        <p className="mt-1 text-xs text-zinc-500">for {recipientLabel}</p>
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
                  setCustomAmount("");
                }}
                className={cn(
                  "rounded-2xl border p-3 text-center text-sm font-bold transition",
                  active
                    ? "border-2 border-electric-lime bg-brand-50/60 text-brand-700"
                    : "border-zinc-200 bg-white text-ink-charcoal hover:border-electric-lime hover:bg-brand-50/50",
                )}
              >
                {formatMoney(preset, currency)}
              </button>
            );
          })}
        </div>
      ) : null}

      {allowCustomAmount ? (
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wide text-zinc-500 uppercase">
            Custom amount
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={customAmount}
            onChange={(event) => setCustomAmount(event.target.value)}
            placeholder="Enter an amount"
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-electric-lime focus:outline-none"
          />
        </div>
      ) : null}

      <button
        type="button"
        disabled={!canContinue}
        onClick={() => onContinue(amount)}
        className="mt-auto flex w-full items-center justify-center gap-2 rounded-2xl bg-electric-lime py-3.5 text-sm font-semibold text-ink-charcoal shadow-lg shadow-electric-lime/30 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span>
          {canContinue
            ? `Continue with ${formatMoney(amount, currency)}`
            : "Choose an amount"}
        </span>
        <ArrowRight className="size-4" strokeWidth={2} />
      </button>
    </div>
  );
};
