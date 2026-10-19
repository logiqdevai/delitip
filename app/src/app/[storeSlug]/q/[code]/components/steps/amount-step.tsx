"use client";

import { type FC, useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { NumberPicker } from "@/components/ui/number-picker";
import type { QrCodeSelectionMode } from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import { formatMoney, getCurrencySymbol } from "@/lib/money";
import { cn } from "@/lib/utils";

interface AmountStepProps {
  currency: Currency;
  suggestedAmounts: number[];
  allowCustomAmount: boolean;
  showRecipientSubtitle?: boolean;
  /** Set when the guest picks the recipient on the next step. */
  chooseMode?: QrCodeSelectionMode;
  recipientLabel: string;
  onContinue: (amountMinorUnits: number) => void;
}

export const AmountStep: FC<AmountStepProps> = ({
  currency,
  suggestedAmounts,
  allowCustomAmount,
  showRecipientSubtitle,
  chooseMode,
  recipientLabel,
  onContinue,
}) => {
  const t = useTranslations("amountStep");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(
    suggestedAmounts[0] ?? null,
  );
  const [customAmount, setCustomAmount] = useState(0);

  const customMinorUnits =
    customAmount > 0 ? Math.round(customAmount * 100) : null;

  const amount = customMinorUnits ?? selectedPreset ?? 0;
  const canContinue = amount > 0;

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 pt-2 pb-8">
      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-zinc-100">
        <div className="text-center">
          <h2 className="font-serif text-xl font-bold text-ink-charcoal">
            {t("heading")}
          </h2>
          {chooseMode === "CHOOSE_ONE" || chooseMode === "CHOOSE_MANY" ? (
            <p className="mx-auto mt-1 max-w-[280px] text-xs text-zinc-500">
              {chooseMode === "CHOOSE_MANY"
                ? t("subtitleChooseMany")
                : t("subtitleChooseOne")}
            </p>
          ) : showRecipientSubtitle ? (
            <p className="mx-auto mt-1 max-w-[280px] truncate text-xs text-zinc-500">
              {t("subtitleFor", { recipient: recipientLabel })}
            </p>
          ) : null}
        </div>

        {suggestedAmounts.length > 0 ? (
          <div
            className={cn(
              "mt-5 grid gap-2",
              suggestedAmounts.length === 1 && "grid-cols-1",
              suggestedAmounts.length === 2 && "grid-cols-2",
              suggestedAmounts.length === 3 && "grid-cols-3",
              suggestedAmounts.length >= 4 &&
                "grid-cols-2 min-[380px]:grid-cols-4",
            )}
          >
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
                    "rounded-2xl border px-2 py-4 text-center text-sm font-bold transition",
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
          <>
            {suggestedAmounts.length > 0 ? (
              <div className="mt-5 flex items-center gap-3 text-[11px] font-medium tracking-widest text-zinc-400 uppercase">
                <span className="h-px flex-1 bg-zinc-200" />
                {t("orDivider")}
                <span className="h-px flex-1 bg-zinc-200" />
              </div>
            ) : null}
            <div className="mt-5 space-y-3">
              <p className="text-center font-serif text-base font-bold text-ink-charcoal">
                {t("customAmountLabel")}
              </p>
              <NumberPicker
                value={customAmount}
                onChange={setCustomAmount}
                min={0}
                max={1000}
                step={1}
                suffix={getCurrencySymbol(currency)}
                aria-label={t("customAmountAriaLabel")}
                className="w-full"
              />
            </div>
          </>
        ) : null}

        <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-[11px] text-zinc-600">
          <ShieldCheck
            className="size-4 shrink-0 text-(--tip-primary)"
            strokeWidth={2}
          />
          <span>{chooseMode === "CHOOSE_ONE" || chooseMode === "CHOOSE_MANY"
              ? t("trustNoteChoose")
              : t("trustNote", { recipient: recipientLabel })}</span>
        </div>
      </div>

      <button
        type="button"
        disabled={!canContinue}
        onClick={() => onContinue(amount)}
        className="mt-auto flex w-full items-center justify-center gap-2 rounded-full bg-(--tip-primary) py-4 text-sm font-semibold text-(--tip-primary-foreground) shadow-lg shadow-(--tip-primary)/30 transition hover:bg-(--tip-secondary) disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span>
          {canContinue
            ? t("continueCta", { amount: formatMoney(amount, currency) })
            : t("chooseAmountCta")}
        </span>
        <ArrowRight className="size-4" strokeWidth={2} />
      </button>
    </div>
  );
};
