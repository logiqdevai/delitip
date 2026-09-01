"use client";

import { type FC, useMemo } from "react";
import { AlertTriangle, Loader2, Star } from "lucide-react";
import { FeedbackQuestionTypes } from "@/features/feedback-questions/interfaces/feedback-questions.interfaces";
import type { PublicReviewConfig } from "@/features/reviews/interfaces/reviews.interfaces";
import { useCreatePublicTip } from "@/features/tips/hooks/use-tips";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import type { QrCodeSelectionMode } from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import {
  savePendingTip,
  type ReviewDraft,
} from "@/app/[storeSlug]/q/[code]/lib/pending-tip";

export {
  emptyReviewDraft,
  type ReviewDraft,
} from "@/app/[storeSlug]/q/[code]/lib/pending-tip";

interface ReviewStepProps {
  qrCodeId: string;
  storeId: string;
  storeSlug: string;
  code: string;
  amount: number;
  currency: Currency;
  recipientLabel: string;
  selectionMode: QrCodeSelectionMode;
  selectedEmployeeIds: string[];
  config?: PublicReviewConfig;
  draft: ReviewDraft;
  onChange: (draft: ReviewDraft) => void;
  onBack: () => void;
}

const StarPicker: FC<{
  value: number;
  onChange: (value: number) => void;
  size?: "sm" | "default";
  align?: "center" | "start";
}> = ({ value, onChange, size = "default", align = "center" }) => {
  return (
    <div
      className={cn(
        "flex gap-2",
        align === "center" ? "justify-center" : "justify-start",
      )}
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1;
        const filled = starValue <= value;
        return (
          <button
            key={starValue}
            type="button"
            onClick={() => onChange(starValue === value ? 0 : starValue)}
            className="transition hover:scale-110"
            aria-label={`Rate ${starValue} stars`}
          >
            <Star
              className={cn(
                size === "sm" ? "size-6" : "size-8",
                filled
                  ? "fill-rating-amber text-rating-amber"
                  : "text-zinc-300",
              )}
              strokeWidth={2}
            />
          </button>
        );
      })}
    </div>
  );
};

export const ReviewStep: FC<ReviewStepProps> = ({
  qrCodeId,
  storeId,
  storeSlug,
  code,
  amount,
  currency,
  recipientLabel,
  selectionMode,
  selectedEmployeeIds,
  config,
  draft,
  onChange,
  onBack,
}) => {
  const categories = [...(config?.review_categories ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  const questions = [...(config?.feedback_questions ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  const hasRated = draft.rating > 0;

  // Generated once per checkout attempt (not per render) so a retry after a
  // network error reuses the same key instead of opening a second Viva order.
  const clientRequestId = useMemo(() => crypto.randomUUID(), []);
  const createTip = useCreatePublicTip();
  const submitting = createTip.isPending;

  const pay = () => {
    createTip.mutate(
      {
        qr_code_id: qrCodeId,
        amount,
        client_request_id: clientRequestId,
        ...(selectionMode === "CHOOSE_MANY"
          ? { employee_ids: selectedEmployeeIds }
          : {}),
        ...(selectionMode === "CHOOSE_ONE" && selectedEmployeeIds[0]
          ? { employee_id: selectedEmployeeIds[0] }
          : {}),
      },
      {
        onSuccess: ({ tip_id, checkout_url }) => {
          savePendingTip({
            tipId: tip_id,
            storeId,
            storeSlug,
            code,
            recipientLabel,
            selectedEmployeeIds,
            reviewDraft: draft,
          });
          // Full-page redirect, never an iframe — Viva's own docs warn this
          // breaks Apple Pay/Klarna/BLIK/EPS/P24/PayU/IRIS.
          window.location.href = checkout_url;
        },
      },
    );
  };

  return (
    <div className="auth-fade-enter flex flex-1 flex-col gap-6 px-5 py-8">
      <div className="text-center">
        <h1 className="text-lg font-bold text-ink-charcoal">
          How was your experience?
        </h1>
        <p className="mx-auto mt-1 max-w-[280px] truncate text-xs text-zinc-500">
          Rate {recipientLabel} (optional)
        </p>
      </div>

      <StarPicker
        value={draft.rating}
        onChange={(rating) => onChange({ ...draft, rating })}
      />

      {hasRated ? (
        <div className="space-y-5">
          {categories.length > 0 ? (
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="space-y-1.5 rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2.5"
                >
                  <span className="block text-xs font-medium text-zinc-600">
                    {category.name}
                  </span>
                  <StarPicker
                    size="sm"
                    align="start"
                    value={draft.categoryRatings[category.id] ?? 0}
                    onChange={(rating) =>
                      onChange({
                        ...draft,
                        categoryRatings: {
                          ...draft.categoryRatings,
                          [category.id]: rating,
                        },
                      })
                    }
                  />
                </div>
              ))}
            </div>
          ) : null}

          {questions.map((question) => (
            <div key={question.id} className="space-y-1.5">
              <p className="text-xs font-medium text-zinc-600">
                {question.question}
              </p>
              {question.type === FeedbackQuestionTypes.RATING ? (
                <StarPicker
                  size="sm"
                  align="start"
                  value={draft.feedbackResponses[question.id]?.ratingValue ?? 0}
                  onChange={(ratingValue) =>
                    onChange({
                      ...draft,
                      feedbackResponses: {
                        ...draft.feedbackResponses,
                        [question.id]: { ratingValue },
                      },
                    })
                  }
                />
              ) : (
                <textarea
                  rows={2}
                  value={draft.feedbackResponses[question.id]?.textValue ?? ""}
                  onChange={(event) =>
                    onChange({
                      ...draft,
                      feedbackResponses: {
                        ...draft.feedbackResponses,
                        [question.id]: { textValue: event.target.value },
                      },
                    })
                  }
                  placeholder={question.question}
                  className="w-full resize-none rounded-xl border border-zinc-200 p-3 text-xs focus:ring-2 focus:ring-(--tip-primary) focus:outline-none"
                />
              )}
            </div>
          ))}

          <textarea
            rows={2}
            value={draft.comment}
            onChange={(event) =>
              onChange({ ...draft, comment: event.target.value })
            }
            placeholder={`Write a short message for ${recipientLabel} (optional)...`}
            className="w-full resize-none rounded-xl border border-zinc-200 p-3 text-xs focus:ring-2 focus:ring-(--tip-primary) focus:outline-none"
          />
        </div>
      ) : null}

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
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-(--tip-primary) py-3.5 text-sm font-semibold text-(--tip-primary-foreground) shadow-lg shadow-(--tip-primary)/30 transition hover:bg-(--tip-secondary) disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? (
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
          disabled={submitting}
          className="w-full rounded-2xl py-2 text-xs font-semibold text-zinc-500 transition hover:text-zinc-700 disabled:opacity-60"
        >
          Back
        </button>
      </div>
    </div>
  );
};
