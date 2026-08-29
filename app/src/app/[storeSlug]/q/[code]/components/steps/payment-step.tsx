"use client";

import { type FC, useState } from "react";
import { AlertTriangle, Loader2, ShieldCheck } from "lucide-react";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import { useCreatePublicTip } from "@/features/tips/hooks/use-tips";
import type { CreatePublicTipResponse } from "@/features/tips/interfaces/tips.interfaces";
import type { QrCodeSelectionMode } from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import { formatMoney } from "@/lib/money";

interface PaymentStepProps {
  qrCodeId: string;
  amount: number;
  currency: Currency;
  storeName: string;
  recipientLabel: string;
  selectionMode: QrCodeSelectionMode;
  selectedEmployeeIds: string[];
  onBack: () => void;
  onSuccess: (result: CreatePublicTipResponse) => void;
}

export const PaymentStep: FC<PaymentStepProps> = ({
  qrCodeId,
  amount,
  currency,
  storeName,
  recipientLabel,
  selectionMode,
  selectedEmployeeIds,
  onBack,
  onSuccess,
}) => {
  const [customerEmail, setCustomerEmail] = useState("");
  const createTip = useCreatePublicTip();

  const pay = () => {
    createTip.mutate(
      {
        qr_code_id: qrCodeId,
        amount,
        ...(selectionMode === "CHOOSE_MANY"
          ? { employee_ids: selectedEmployeeIds }
          : {}),
        ...(selectionMode === "CHOOSE_ONE" && selectedEmployeeIds[0]
          ? { employee_id: selectedEmployeeIds[0] }
          : {}),
        ...(customerEmail.trim() ? { customer_email: customerEmail.trim() } : {}),
      },
      { onSuccess },
    );
  };

  return (
    <div className="auth-fade-enter flex flex-1 flex-col gap-6 px-5 py-8">
      <div className="text-center">
        <h1 className="text-lg font-bold text-ink-charcoal">Confirm & pay</h1>
        <p className="mt-1 text-xs text-zinc-500">for {recipientLabel}</p>
      </div>

      <div className="space-y-2 rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
        <div className="flex justify-between text-xs text-zinc-600">
          <span>Amount</span>
          <span className="font-bold text-ink-charcoal">
            {formatMoney(amount, currency)}
          </span>
        </div>
        <div className="flex justify-between text-xs text-zinc-600">
          <span>Goes to</span>
          <span className="font-medium text-ink-charcoal">
            {recipientLabel}
          </span>
        </div>
        <div className="flex justify-between text-xs text-zinc-600">
          <span>Business</span>
          <span className="font-medium text-ink-charcoal">{storeName}</span>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold tracking-wide text-zinc-500 uppercase">
          Email receipt (optional)
        </label>
        <input
          type="email"
          value={customerEmail}
          onChange={(event) => setCustomerEmail(event.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-electric-lime focus:outline-none"
        />
      </div>

      <div className="flex items-start gap-2.5 rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-[11px] leading-relaxed text-zinc-600">
        <ShieldCheck
          className="mt-0.5 size-4 shrink-0 text-electric-lime"
          strokeWidth={2}
        />
        <span>
          You&apos;re paying {formatMoney(amount, currency)} to{" "}
          {recipientLabel} via delitip. We record this amount and the
          recipient; if you share your email, we use it only to send your
          receipt and to link this tip to an account if you create one later.
          If you leave a review next, high ratings may be shared publicly and
          lower ratings stay private feedback to the business. This
          device&apos;s language sets the page language and text may be
          machine-translated.
        </span>
      </div>

      {createTip.isError ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 p-3 text-xs text-red-700">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
          <span>
            {createTip.error instanceof Error
              ? createTip.error.message
              : "Payment failed. Please try again."}
          </span>
        </div>
      ) : null}

      <div className="mt-auto space-y-2">
        <button
          type="button"
          onClick={pay}
          disabled={createTip.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-electric-lime py-3.5 text-sm font-semibold text-ink-charcoal shadow-lg shadow-electric-lime/30 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {createTip.isPending ? (
            <Loader2 className="size-4 animate-spin" strokeWidth={2} />
          ) : null}
          <span>
            {createTip.isError
              ? "Retry payment"
              : `Pay ${formatMoney(amount, currency)}`}
          </span>
        </button>
        <button
          type="button"
          onClick={onBack}
          disabled={createTip.isPending}
          className="w-full rounded-2xl py-2 text-xs font-semibold text-zinc-500 transition hover:text-zinc-700 disabled:opacity-60"
        >
          Back
        </button>
      </div>
    </div>
  );
};
