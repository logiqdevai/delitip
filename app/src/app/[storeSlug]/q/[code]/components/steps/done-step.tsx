"use client";

import { type FC } from "react";
import { ExternalLink, Heart } from "lucide-react";
import type { CreatePublicReviewResponse } from "@/features/reviews/interfaces/reviews.interfaces";

interface DoneStepProps {
  review: CreatePublicReviewResponse | null;
  onRestart: () => void;
}

export const DoneStep: FC<DoneStepProps> = ({ review, onRestart }) => {
  return (
    <div className="auth-fade-enter flex flex-1 flex-col gap-5 px-5 py-8 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand-100 text-brand-700 shadow-inner">
        <Heart className="size-8" strokeWidth={2.5} />
      </div>

      <div>
        <h1 className="text-xl font-bold text-ink-charcoal">
          {review ? "Thanks for the feedback!" : "All set!"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          {review
            ? review.message
            : "Your tip is on its way. You can close this page."}
        </p>
      </div>

      {review?.redirect.should_redirect && review.redirect.url ? (
        <a
          href={review.redirect.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-ink-charcoal py-3.5 text-sm font-semibold text-paper-offwhite shadow transition hover:bg-zinc-800"
        >
          <span>Share it publicly</span>
          <ExternalLink className="size-4" strokeWidth={2} />
        </a>
      ) : null}

      <button
        type="button"
        onClick={onRestart}
        className="mx-auto block pt-2 text-xs font-semibold text-brand-700 hover:underline"
      >
        Leave another tip
      </button>
    </div>
  );
};
