"use client";

import { trackEvent } from "@/lib/analytics/analytics";
import { AnalyticsEvents } from "@/config/constants/analytics-events";
import { type FC, useEffect, useRef, useState } from "react";
import { AlertTriangle, Loader2, RefreshCw, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePublicTipStatus } from "@/features/tips/hooks/use-tips";
import { useCreatePublicReview } from "@/features/reviews/hooks/use-reviews";
import type { CreatePublicReviewResponse } from "@/features/reviews/interfaces/reviews.interfaces";
import { TipStatuses } from "@/features/tips/interfaces/tips.interfaces";
import { readPendingTip, clearPendingTip } from "@/app/[storeSlug]/q/[code]/lib/pending-tip";
import type { StoreIndustry } from "@/features/stores/interfaces/stores.interfaces";
import { VivaBadge } from "@/components/payments/viva-badge";
import { DoneStep } from "@/app/[storeSlug]/q/[code]/components/steps/done-step";

const POLL_TIMEOUT_MS = 12000;

// Past this many names, say "the team" instead (same rule as the tip flow).
const MAX_NAMED_RECIPIENTS = 3;

interface CheckoutStatusStepProps {
  tipId: string;
  storeName: string;
  industry?: StoreIndustry;
  onRestart: () => void;
}

// Orchestrates the post-checkout outcome once the customer returns from
// Viva (or refreshes a page they'd already reached "done" on): polls the
// tip's status and branches into processing / success / failure / timeout
// UI, rather than assuming success the way the old synchronous flow did.
export const CheckoutStatusStep: FC<CheckoutStatusStepProps> = ({
  tipId,
  storeName,
  industry,
  onRestart,
}) => {
  const t = useTranslations("checkoutStatusStep");
  const tFlow = useTranslations("tipFlow");
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
    if (!statusQuery.data) return;
    const { status: finalStatus, amount, currency } = statusQuery.data;
    const completed = finalStatus === TipStatuses.COMPLETED;
    if (!completed && finalStatus !== TipStatuses.FAILED && finalStatus !== TipStatuses.CANCELLED) {
      return;
    }
    // The page can be reloaded or revisited via the ?tip= link; count each tip once.
    const dedupeKey = `delitip-analytics-tip-${tipId}`;
    try {
      if (window.sessionStorage.getItem(dedupeKey)) return;
      window.sessionStorage.setItem(dedupeKey, "1");
    } catch {}
    trackEvent(
      completed ? AnalyticsEvents.tipCompleted : AnalyticsEvents.tipFailed,
      {
        transaction_id: tipId,
        value: amount / 100,
        currency,
        status: finalStatus,
      },
    );
  }, [statusQuery.data, tipId]);

  useEffect(() => {
    if (isTerminal) clearPendingTip();
  }, [isTerminal]);

  if (status === TipStatuses.COMPLETED) {
    const data = statusQuery.data!;
    let review: CreatePublicReviewResponse | null = null;
    if (createReview.isSuccess) review = createReview.data;

    // sessionStorage is gone after a reload or on another device, so rebuild the
    // recipients from the tip's distribution instead of falling back to the store.
    const distributionNames = [
      ...new Set(
        (data.distribution_summary ?? [])
          .map((line) => line.employee?.full_name)
          .filter((name): name is string => !!name),
      ),
    ];
    const recipientFromDistribution =
      distributionNames.length === 0
        ? null
        : distributionNames.length > MAX_NAMED_RECIPIENTS
          ? tFlow("teamFallback")
          : distributionNames.join(" & ");

    return (
      <DoneStep
        review={review}
        tipId={tipId}
        amount={data.amount}
        currency={data.currency}
        storeName={storeName}
        industry={industry}
        recipientLabel={
          pending?.recipientLabel ??
          recipientFromDistribution ??
          data.employee?.full_name ??
          storeName
        }
        thankYouMessage={data.thank_you_message}
        onRestart={onRestart}
      />
    );
  }

  if (status === TipStatuses.FAILED || status === TipStatuses.CANCELLED) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-8 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-red-50 text-red-500">
          <XCircle className="size-8" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-ink-charcoal">
            {status === TipStatuses.CANCELLED
              ? t("cancelledTitle")
              : t("failedTitle")}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            {status === TipStatuses.CANCELLED
              ? t("cancelledDescription")
              : t("failedDescription")}
          </p>
        </div>
        <button
          type="button"
          onClick={onRestart}
          className="mt-4 rounded-2xl bg-(--tip-primary) px-6 py-3 text-sm font-semibold text-(--tip-primary-foreground) shadow-lg shadow-(--tip-primary)/30 transition hover:bg-(--tip-secondary)"
        >
          {t("tryAgain")}
        </button>
        <VivaBadge className="mt-2" />
      </div>
    );
  }

  if (timedOut) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-8 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-amber-50 text-amber-500">
          <AlertTriangle className="size-8" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-ink-charcoal">
            {t("timeoutTitle")}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            {t("timeoutDescription")}
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
          <span>{t("refresh")}</span>
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="text-sm font-semibold text-zinc-500 underline-offset-4 transition hover:text-ink-charcoal hover:underline"
        >
          {t("startOver")}
        </button>
        <VivaBadge className="mt-2" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-8 text-center">
      <Loader2 className="size-10 animate-spin text-zinc-400" strokeWidth={2} />
      <div>
        <h1 className="text-lg font-bold text-ink-charcoal">
          {t("confirmingTitle")}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">{t("confirmingDescription")}</p>
      </div>
      <VivaBadge className="mt-2" />
    </div>
  );
};
