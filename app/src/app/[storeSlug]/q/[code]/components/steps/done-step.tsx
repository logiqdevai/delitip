"use client";

import { type FC, useState } from "react";
import { AlertTriangle, Check, CheckCircle2, ExternalLink } from "lucide-react";
import { useCreatePublicRefundRequest } from "@/features/refunds/hooks/use-refunds";
import type { CreatePublicReviewResponse } from "@/features/reviews/interfaces/reviews.interfaces";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import { formatMoney } from "@/lib/money";

interface DoneStepProps {
  review: CreatePublicReviewResponse | null;
  tipId: string;
  amount?: number;
  currency?: Currency;
  storeName?: string;
  recipientLabel?: string;
  thankYouMessage?: string;
  onRestart: () => void;
}

const RefundRequest: FC<{
  tipId: string;
  amount?: number;
  currency?: Currency;
}> = ({ tipId, amount, currency }) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const requestRefund = useCreatePublicRefundRequest();
  const amountLabel =
    amount !== undefined && currency ? formatMoney(amount, currency) : null;

  if (requestRefund.isSuccess) {
    return (
      <div className="flex items-start gap-2.5 rounded-xl border border-(--tip-primary)/30 bg-(--tip-primary)/10 p-3 text-left text-xs text-ink-charcoal">
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-(--tip-secondary)" strokeWidth={2} />
        <span>
          Refund requested{amountLabel ? ` for ${amountLabel}` : ""}. The
          business will review it.
        </span>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mx-auto block text-[11px] font-medium text-zinc-400 hover:text-zinc-600 hover:underline"
      >
        Something wrong with this tip? Request a refund
      </button>
    );
  }

  return (
    <div className="space-y-2.5 rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-left">
      <p className="text-xs font-semibold text-ink-charcoal">
        Request a refund{amountLabel ? ` of ${amountLabel}` : ""}
      </p>
      <textarea
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder="What went wrong? (optional)"
        rows={2}
        className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs focus:border-(--tip-primary) focus:ring-2 focus:ring-(--tip-primary) focus:outline-none"
      />

      {requestRefund.isError ? (
        <div className="flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 p-2.5 text-[11px] text-red-700">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" strokeWidth={2} />
          <span>
            {requestRefund.error instanceof Error
              ? requestRefund.error.message
              : "Could not submit your request. Please try again."}
          </span>
        </div>
      ) : null}

      <div className="flex gap-2">
        <button
          type="button"
          disabled={requestRefund.isPending}
          onClick={() =>
            requestRefund.mutate({
              tipId,
              payload: { reason: reason.trim() || undefined },
            })
          }
          className="flex-1 rounded-xl bg-ink-charcoal py-2 text-xs font-semibold text-paper-offwhite transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {requestRefund.isPending ? "Submitting…" : "Submit request"}
        </button>
        <button
          type="button"
          disabled={requestRefund.isPending}
          onClick={() => setOpen(false)}
          className="rounded-xl px-3 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export const DoneStep: FC<DoneStepProps> = ({
  review,
  tipId,
  amount,
  currency,
  storeName,
  recipientLabel,
  thankYouMessage,
  onRestart,
}) => {
  const receiptCode = `#${tipId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
  const hasTipDetails = amount !== undefined && currency !== undefined;
  const description =
    thankYouMessage?.trim() ||
    (hasTipDetails
      ? `Your ${formatMoney(amount, currency)} tip${review ? " and compliments" : ""} were sent to ${recipientLabel}.`
      : "Your tip has already been sent.");

  return (
    <div className="auth-fade-enter flex flex-1 flex-col gap-5 px-5 py-8 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-(--tip-primary)/15 text-(--tip-secondary) shadow-inner">
        <Check className="size-8" strokeWidth={2.5} />
      </div>

      <div>
        <h1 className="text-xl font-bold text-ink-charcoal">Thank you!</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          {description}
        </p>
      </div>

      <div className="space-y-2 rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-left">
        <div className="flex items-center justify-between gap-3 text-xs text-zinc-600">
          <span className="shrink-0">Receipt ID</span>
          <span className="min-w-0 truncate font-mono text-ink-charcoal">
            {receiptCode}
          </span>
        </div>
        {storeName ? (
          <div className="flex items-center justify-between gap-3 text-xs text-zinc-600">
            <span className="shrink-0">Business</span>
            <span className="min-w-0 truncate font-medium text-ink-charcoal">
              {storeName}
            </span>
          </div>
        ) : null}
        {recipientLabel ? (
          <div className="flex items-center justify-between gap-3 text-xs text-zinc-600">
            <span className="shrink-0">Recipient</span>
            <span className="min-w-0 truncate font-medium text-ink-charcoal">
              {recipientLabel}
            </span>
          </div>
        ) : null}
      </div>

      {review?.redirect.should_redirect && review.redirect.url ? (
        <a
          href={review.redirect.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-(--tip-primary) py-3.5 text-sm font-semibold text-(--tip-primary-foreground) shadow-lg shadow-(--tip-primary)/30 transition hover:bg-(--tip-secondary)"
        >
          <span>Share it publicly</span>
          <ExternalLink className="size-4" strokeWidth={2} />
        </a>
      ) : null}

      <button
        type="button"
        onClick={onRestart}
        className="mx-auto block pt-2 text-xs font-semibold text-(--tip-secondary) hover:underline"
      >
        Make another tip
      </button>

      <div className="mt-auto pt-6">
        <RefundRequest tipId={tipId} amount={amount} currency={currency} />
      </div>
    </div>
  );
};
