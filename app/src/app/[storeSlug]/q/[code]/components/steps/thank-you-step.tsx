"use client";

import { type FC } from "react";
import { Check } from "lucide-react";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import { formatMoney } from "@/lib/money";

interface ThankYouStepProps {
  amount: number;
  currency: Currency;
  recipientLabel: string;
  message: string;
  onLeaveReview: () => void;
  onDone: () => void;
}

export const ThankYouStep: FC<ThankYouStepProps> = ({
  amount,
  currency,
  recipientLabel,
  message,
  onLeaveReview,
  onDone,
}) => {
  return (
    <div className="auth-fade-enter flex flex-1 flex-col gap-6 px-5 py-8 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand-100 text-brand-700 shadow-inner">
        <Check className="size-8" strokeWidth={2.5} />
      </div>

      <div>
        <h1 className="text-xl font-bold text-ink-charcoal">Thank you!</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          {message}
        </p>
      </div>

      <div className="space-y-2 rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-left">
        <div className="flex justify-between text-xs text-zinc-600">
          <span>Amount</span>
          <span className="font-bold text-ink-charcoal">
            {formatMoney(amount, currency)}
          </span>
        </div>
        <div className="flex justify-between text-xs text-zinc-600">
          <span>Recipient</span>
          <span className="font-medium text-ink-charcoal">
            {recipientLabel}
          </span>
        </div>
      </div>

      <div className="mt-auto space-y-2">
        <button
          type="button"
          onClick={onLeaveReview}
          className="w-full rounded-2xl bg-ink-charcoal py-3.5 text-sm font-semibold text-paper-offwhite shadow transition hover:bg-zinc-800"
        >
          Leave a quick review
        </button>
        <button
          type="button"
          onClick={onDone}
          className="w-full rounded-2xl py-2.5 text-xs font-semibold text-zinc-500 transition hover:text-zinc-700"
        >
          No thanks, I&apos;m done
        </button>
      </div>
    </div>
  );
};
