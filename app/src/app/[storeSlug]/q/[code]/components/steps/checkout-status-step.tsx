"use client";

import { type FC, useEffect, useRef, useState } from "react";
import { AlertTriangle, Loader2, RefreshCw, XCircle } from "lucide-react";
import { usePublicTipStatus } from "@/features/tips/hooks/use-tips";
import { useCreatePublicReview } from "@/features/reviews/hooks/use-reviews";
import type { CreatePublicReviewResponse } from "@/features/reviews/interfaces/reviews.interfaces";
import { TipStatuses } from "@/features/tips/interfaces/tips.interfaces";
import { readPendingTip, clearPendingTip } from "@/app/[storeSlug]/q/[code]/lib/pending-tip";
import { DoneStep } from "@/app/[storeSlug]/q/[code]/components/steps/done-step";

const POLL_TIMEOUT_MS = 12000;

interface CheckoutStatusStepProps {
  tipId: string;
  storeName: string;
  onRestart: () => void;
}

// Orchestrates the post-checkout outcome once the customer returns from
// Viva (or refreshes a page they'd already reached "done" on): polls the
// tip's status and branches into processing / success / failure / timeout
// UI, rather than assuming success the way the old synchronous flow did.
export const CheckoutStatusStep: FC<CheckoutStatusStepProps> = ({
  tipId,
  storeName,
  onRestart,
}) => {
  const statusQuery = usePublicTipStatus(tipId);
  const createReview = useCreatePublicReview();
  const reviewSubmitted = useRef(false);
  const [pending] = useState(() => readPendingTip(tipId));
  const [pollStartedAt, setPollStartedAt] = useState(() => Date.now());
  const [timedOut, setTimedOut] = useState(false);

  const status = statusQuery.data?.status;
  const isTerminal =
    status === TipStatuses.COMPLETED ||
    status === TipStatuses.FAILED ||
    status === TipStatuses.CANCELLED;

  useEffect(() => {
    if (isTerminal || timedOut) return;
    const remaining = POLL_TIMEOUT_MS - (Date.now() - pollStartedAt);
    const timer = setTimeout(() => setTimedOut(true), Math.max(remaining, 0));
    return () => clearTimeout(timer);
  }, [isTerminal, timedOut, pollStartedAt]);

  useEffect(() => {
    if (
      status !== TipStatuses.COMPLETED ||
      reviewSubmitted.current ||
      !pending ||
      pending.reviewDraft.rating < 1
    ) {
      return;
    }
    reviewSubmitted.current = true;

    createReview.mutate({
      store_id: pending.storeId,
      tip_id: tipId,
      employee_id:
        pending.selectedEmployeeIds.length === 1
          ? pending.selectedEmployeeIds[0]
          : undefined,
      rating: pending.reviewDraft.rating,
      comment: pending.reviewDraft.comment.trim() || undefined,
      category_ratings: Object.entries(pending.reviewDraft.categoryRatings)
        .filter(([, rating]) => rating > 0)
        .map(([review_category_id, rating]) => ({
          review_category_id,
          rating,
        })),
      feedback_responses: Object.entries(pending.reviewDraft.feedbackResponses)
        .filter(
          ([, response]) =>
            !!response.ratingValue || !!response.textValue?.trim(),
        )
        .map(([feedback_question_id, response]) => ({
          feedback_question_id,
          rating_value: response.ratingValue,
          text_value: response.textValue?.trim() || undefined,
        })),
    });
  }, [status, pending, tipId, createReview]);

  useEffect(() => {
    if (isTerminal) clearPendingTip();
  }, [isTerminal]);

  if (status === TipStatuses.COMPLETED) {
    const data = statusQuery.data!;
    let review: CreatePublicReviewResponse | null = null;
    if (createReview.isSuccess) review = createReview.data;

    return (
      <DoneStep
        review={review}
        tipId={tipId}
        amount={data.amount}
        currency={data.currency}
        storeName={storeName}
        recipientLabel={
          pending?.recipientLabel ?? data.employee?.full_name ?? storeName
        }
        thankYouMessage={data.thank_you_message}
        onRestart={onRestart}
      />
    );
  }

  if (status === TipStatuses.FAILED || status === TipStatuses.CANCELLED) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 py-8 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-red-50 text-red-500">
          <XCircle className="size-8" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-ink-charcoal">
            {status === TipStatuses.CANCELLED
              ? "Payment cancelled"
              : "Payment failed"}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            {status === TipStatuses.CANCELLED
              ? "You cancelled the checkout before it completed. No charge was made."
              : "Your card wasn't charged. Please try again."}
          </p>
        </div>
        <button
          type="button"
          onClick={onRestart}
          className="mt-4 rounded-2xl bg-(--tip-primary) px-6 py-3 text-sm font-semibold text-(--tip-primary-foreground) shadow-lg shadow-(--tip-primary)/30 transition hover:bg-(--tip-secondary)"
        >
          Try again
        </button>
      </div>
    );
  }

  if (timedOut) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 py-8 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-amber-50 text-amber-500">
          <AlertTriangle className="size-8" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-ink-charcoal">
            Still processing
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Your payment is taking longer than expected to confirm. It may
            still complete — check back shortly.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            // Also reset the poll window's start time — otherwise the
            // 12s-timeout effect below immediately fires again from the
            // original (already-elapsed) baseline, making Refresh look
            // like it does nothing.
            setPollStartedAt(Date.now());
            setTimedOut(false);
            void statusQuery.refetch();
          }}
          className="mt-4 flex items-center gap-2 rounded-2xl bg-(--tip-primary) px-6 py-3 text-sm font-semibold text-(--tip-primary-foreground) shadow-lg shadow-(--tip-primary)/30 transition hover:bg-(--tip-secondary)"
        >
          <RefreshCw className="size-4" strokeWidth={2} />
          <span>Refresh</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 py-8 text-center">
      <Loader2 className="size-10 animate-spin text-zinc-400" strokeWidth={2} />
      <div>
        <h1 className="text-lg font-bold text-ink-charcoal">
          Confirming your payment…
        </h1>
        <p className="mt-2 text-sm text-zinc-500">This only takes a moment.</p>
      </div>
    </div>
  );
};
