"use client";

import { type FC, useState } from "react";
import { AlertTriangle, Star } from "lucide-react";
import { useCreatePublicReview } from "@/features/reviews/hooks/use-reviews";
import type { CreatePublicReviewResponse } from "@/features/reviews/interfaces/reviews.interfaces";
import { cn } from "@/lib/utils";

interface ReviewStepProps {
  storeId: string;
  tipId: string;
  employeeId?: string;
  recipientLabel: string;
  onSkip: () => void;
  onSubmitted: (result: CreatePublicReviewResponse) => void;
}

export const ReviewStep: FC<ReviewStepProps> = ({
  storeId,
  tipId,
  employeeId,
  recipientLabel,
  onSkip,
  onSubmitted,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const createReview = useCreatePublicReview();

  const submit = () => {
    if (rating < 1) return;
    createReview.mutate(
      {
        store_id: storeId,
        tip_id: tipId,
        employee_id: employeeId,
        rating,
        comment: comment.trim() || undefined,
      },
      { onSuccess: onSubmitted },
    );
  };

  return (
    <div className="auth-fade-enter flex flex-1 flex-col gap-5 px-5 py-8">
      <div className="text-center">
        <h1 className="text-lg font-bold text-ink-charcoal">
          How was your experience?
        </h1>
        <p className="mt-1 text-xs text-zinc-500">
          Rate {recipientLabel} — great ratings may be shared publicly, low
          ratings stay private feedback to the business.
        </p>
      </div>

      <div className="flex justify-center gap-2">
        {Array.from({ length: 5 }).map((_, index) => {
          const value = index + 1;
          const filled = value <= rating;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="transition hover:scale-110"
              aria-label={`Rate ${value} stars`}
            >
              <Star
                className={cn(
                  "size-9",
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

      <textarea
        rows={3}
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder={`Write a short message for ${recipientLabel} (optional)...`}
        className="w-full resize-none rounded-xl border border-zinc-200 p-3 text-xs focus:ring-2 focus:ring-electric-lime focus:outline-none"
      />

      {createReview.isError ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 p-3 text-xs text-red-700">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
          <span>
            {createReview.error instanceof Error
              ? createReview.error.message
              : "Could not submit your review. Please try again."}
          </span>
        </div>
      ) : null}

      <div className="mt-auto space-y-2">
        <button
          type="button"
          onClick={submit}
          disabled={rating < 1 || createReview.isPending}
          className="w-full rounded-2xl bg-electric-lime py-3.5 text-sm font-semibold text-ink-charcoal shadow-lg shadow-electric-lime/30 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {createReview.isPending ? "Submitting…" : "Submit review"}
        </button>
        <button
          type="button"
          onClick={onSkip}
          disabled={createReview.isPending}
          className="w-full rounded-2xl py-2.5 text-xs font-semibold text-zinc-500 transition hover:text-zinc-700 disabled:opacity-60"
        >
          Skip
        </button>
      </div>
    </div>
  );
};
