"use client";

import { type FC, useMemo } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Coins,
  Heart,
  Loader2,
  Lock,
  MessageCircle,
  Sparkles,
  Star,
  ShieldCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { FeedbackQuestionTypes } from "@/features/feedback-questions/interfaces/feedback-questions.interfaces";
import type { PublicReviewConfig } from "@/features/reviews/interfaces/reviews.interfaces";
import { useCreatePublicTip } from "@/features/tips/hooks/use-tips";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import type { QrCodeSelectionMode } from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import { VivaBadge } from "@/components/payments/viva-badge";
import { Routes } from "@/routes/routes";
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

/** Who the tip goes to, which decides how the review copy is worded. */
export type RecipientKind = "store" | "people" | "team";

interface ReviewStepProps {
  qrCodeId: string;
  storeId: string;
  storeSlug: string;
  code: string;
  amount: number;
  currency: Currency;
  recipientLabel: string;
  recipientKind: RecipientKind;
  selectionMode: QrCodeSelectionMode;
  selectedEmployeeIds: string[];
  config?: PublicReviewConfig;
  draft: ReviewDraft;
  onChange: (draft: ReviewDraft) => void;
  onBack: () => void;
  /** Dashboard preview: replaces the real checkout so no tip is created. */
  onPreviewPay?: () => void;
}

const StarPicker: FC<{
  value: number;
  onChange: (value: number) => void;
  size?: "xs" | "sm" | "default";
  align?: "center" | "start" | "end";
}> = ({ value, onChange, size = "default", align = "center" }) => {
  const t = useTranslations("reviewStep");
  return (
    <div
      className={cn(
        size === "xs" ? "gap-1" : "gap-2",
        align === "center"
          ? "justify-center"
          : align === "end"
            ? "justify-end"
            : "justify-start",
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
            aria-label={t("starAriaLabel", { count: starValue })}
          >
            <Star
              className={cn(
                size === "xs" ? "size-5" : size === "sm" ? "size-6" : "size-9",
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
  recipientKind,
  selectionMode,
  selectedEmployeeIds,
  config,
  draft,
  onChange,
  onBack,
  onPreviewPay,
}) => {
  const t = useTranslations("reviewStep");
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
    if (onPreviewPay) {
      onPreviewPay();
      return;
    }
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

  const ratingRow = (
    key: string,
    label: string,
    value: number,
    onRate: (rating: number) => void,
  ) => (
    <div
      key={key}
      className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-zinc-100"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-(--tip-primary)/10 text-(--tip-secondary)">
        <Sparkles className="size-4" strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1 text-sm font-semibold text-ink-charcoal">
        {label}
      </span>
      <StarPicker size="xs" align="end" value={value} onChange={onRate} />
    </div>
  );

  const commentBoxClass =
    "w-full resize-none rounded-xl border border-zinc-200 bg-white p-3 text-xs focus:ring-2 focus:ring-(--tip-primary) focus:outline-none";

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 pt-14 pb-6">
      <div className="text-center">
        <h2 className="font-serif text-2xl font-bold text-ink-charcoal">
          {t("heading")}
        </h2>
        <p className="mx-auto mt-1 max-w-xs text-balance text-xs text-zinc-500">
          {recipientKind === "team"
            ? t("subtitleTeam")
            : recipientKind === "store"
              ? t("subtitleStore", { recipient: recipientLabel })
              : t("subtitlePeople", { recipient: recipientLabel })}
        </p>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-zinc-100">
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-(--tip-primary)/10 text-(--tip-secondary)">
            <Heart className="size-5" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <p className="font-serif text-base font-bold text-ink-charcoal">
              {t("overallTitle")}
            </p>
            <p className="text-xs text-zinc-500">{t("overallSubtitle")}</p>
          </div>
        </div>
        <div className="mt-4">
          <StarPicker
            value={draft.rating}
            onChange={(rating) => onChange({ ...draft, rating })}
          />
          <p className="mt-2 text-center text-[11px] text-zinc-400">
            {t("tapToRate")}
          </p>
        </div>
      </div>

      {hasRated ? (
        <div className="space-y-4">
          {categories.length > 0 ? (
            <div className="space-y-2">
              {categories.map((category) =>
                ratingRow(
                  category.id,
                  category.name,
                  draft.categoryRatings[category.id] ?? 0,
                  (rating) =>
                    onChange({
                      ...draft,
                      categoryRatings: {
                        ...draft.categoryRatings,
                        [category.id]: rating,
                      },
                    }),
                ),
              )}
            </div>
          ) : null}

          {questions.map((question) =>
            question.type === FeedbackQuestionTypes.RATING ? (
              ratingRow(
                question.id,
                question.question,
                draft.feedbackResponses[question.id]?.ratingValue ?? 0,
                (ratingValue) =>
                  onChange({
                    ...draft,
                    feedbackResponses: {
                      ...draft.feedbackResponses,
                      [question.id]: { ratingValue },
                    },
                  }),
              )
            ) : (
              <div key={question.id} className="space-y-1.5">
                <p className="text-xs font-medium text-zinc-600">
                  {question.question}
                </p>
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
                  className={commentBoxClass}
                />
              </div>
            ),
          )}

          <div className="space-y-2">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink-charcoal">
              <MessageCircle
                className="size-4 text-(--tip-secondary)"
                strokeWidth={2}
              />
              {t("tellUsMore")}
            </p>
            <textarea
              rows={3}
              value={draft.comment}
              onChange={(event) =>
                onChange({ ...draft, comment: event.target.value })
              }
              placeholder={
                recipientKind === "team"
                  ? t("commentPlaceholderTeam")
                  : t("commentPlaceholder", { recipient: recipientLabel })
              }
              className={commentBoxClass}
            />
          </div>
        </div>
      ) : null}

      <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-zinc-100">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-(--tip-primary)/10 text-(--tip-secondary)">
          <Coins className="size-6" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <p className="text-xs text-zinc-500">{t("yourTip")}</p>
          <p className="font-serif text-2xl font-bold text-ink-charcoal">
            {formatMoney(amount, currency)}
          </p>
          <p className="text-xs text-zinc-500">
            {recipientKind === "team"
              ? t("tipThanksTeam")
              : recipientKind === "store"
                ? t("tipThanksStore", { recipient: recipientLabel })
                : t("tipThanksPeople", { recipient: recipientLabel })}
          </p>
        </div>
      </div>

      {createTip.isError ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs text-red-700">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
          <span>
            {createTip.error instanceof Error
              ? createTip.error.message
              : t("genericError")}
          </span>
        </div>
      ) : null}

      <div className="mt-auto space-y-2">
        <button
          type="button"
          onClick={pay}
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-(--tip-primary) py-4 text-sm font-semibold text-(--tip-primary-foreground) transition hover:bg-(--tip-secondary) disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? (
            <Loader2 className="size-4 animate-spin" strokeWidth={2} />
          ) : (
            <Lock className="size-4" strokeWidth={2} />
          )}
          <span>
            {createTip.isError
              ? t("retryCta")
              : t("payCta", { amount: formatMoney(amount, currency) })}
          </span>
        </button>
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="flex w-full items-center justify-center gap-1.5 rounded-2xl py-2 text-xs font-semibold text-zinc-500 transition hover:text-zinc-700 disabled:opacity-60"
        >
          <ArrowLeft className="size-3.5" strokeWidth={2} />
          <span>{t("back")}</span>
        </button>
        <p className="flex items-start justify-center gap-1.5 text-center text-[11px] leading-relaxed text-zinc-400">
          <ShieldCheck
            className="mt-0.5 size-3.5 shrink-0 text-(--tip-primary)"
            strokeWidth={2}
          />
          <span>
            {t.rich("legalNotice", {
              terms: (chunks) => (
                <a
                  href={Routes.legal.terms}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                >
                  {chunks}
                </a>
              ),
              privacy: (chunks) => (
                <a
                  href={Routes.legal.privacy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                >
                  {chunks}
                </a>
              ),
            })}
          </span>
        </p>
        <VivaBadge label={t("securedBy")} className="pt-1" />
      </div>
    </div>
  );
};
