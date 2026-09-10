"use client";

import { type FC } from "react";
import { Star } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { getPayoutStatusLabel } from "@/config/constants/dropdowns/tips/payout-status-form.options";
import { getRefundStatusLabel } from "@/config/constants/dropdowns/refunds/refund-status-form.options";
import { getTipStatusLabel } from "@/config/constants/dropdowns/tips/tip-status-form.options";
import { useReview } from "@/features/reviews/hooks/use-reviews";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { useTip } from "@/features/tips/hooks/use-tips";
import type { Tip } from "@/features/tips/interfaces/tips.interfaces";
import { formatMoney } from "@/lib/money";
import { resolvePrimaryText } from "@/lib/translated-text";
import { cn } from "@/lib/utils";

interface ReviewDetailSheetProps {
  reviewId: string | null;
  onOpenChange: (open: boolean) => void;
}

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const SummaryRow: FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex items-center justify-between border-b border-zinc-100 py-2 text-xs last:border-0">
    <span className="text-zinc-500">{label}</span>
    <span className="max-w-[60%] truncate text-right font-semibold text-ink-charcoal">
      {value}
    </span>
  </div>
);

const LinkedTipSection: FC<{ tipId: string }> = ({ tipId }) => {
  const tipQuery = useTip(tipId);

  if (tipQuery.isPending) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    );
  }

  if (tipQuery.isError || !tipQuery.data) {
    return (
      <p className="text-xs text-red-600">
        {tipQuery.error?.message ?? "Could not load the linked tip."}
      </p>
    );
  }

  return <TipDetails tip={tipQuery.data} />;
};

const TipDetails: FC<{ tip: Tip }> = ({ tip }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-zinc-500">Linked tip</div>
          <div className="mt-0.5 text-base font-bold text-ink-charcoal">
            {formatMoney(tip.amount, tip.currency)}
          </div>
          <div className="mt-0.5 text-[11px] text-zinc-500">
            {tip.employee?.full_name ?? "Store"} · {tip.qr_code?.label ?? "-"}
          </div>
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-[10px] font-bold",
            tip.status === "COMPLETED"
              ? "bg-brand-50 text-brand-700"
              : tip.status === "FAILED"
                ? "bg-red-50 text-red-700"
                : tip.status === "REFUNDED"
                  ? "bg-zinc-100 text-zinc-600"
                  : "bg-amber-50 text-amber-700",
          )}
        >
          {getTipStatusLabel(tip.status)}
        </span>
      </div>

      <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 px-3">
        <SummaryRow
          label="Amount"
          value={formatMoney(tip.amount, tip.currency)}
        />
        <SummaryRow label="Status" value={getTipStatusLabel(tip.status)} />
        <SummaryRow label="Paid at" value={formatDateTime(tip.paid_at)} />
        <SummaryRow label="Created at" value={formatDateTime(tip.created_at)} />
        <SummaryRow label="QR code" value={tip.qr_code?.label ?? "-"} />
        <SummaryRow
          label="Distribution rule"
          value={tip.distribution_rule?.name ?? "Store default"}
        />
        <SummaryRow
          label="Payment provider"
          value={tip.payment_provider ?? "-"}
        />
        <SummaryRow
          label="Payment reference"
          value={tip.payment_reference ?? "-"}
        />
        <SummaryRow
          label="Customer"
          value={tip.customer_name ?? tip.customer_email ?? "-"}
        />
      </div>

      <div>
        <div className="mb-2 text-xs font-semibold text-zinc-500">
          Distribution
        </div>
        {!tip.distributions || tip.distributions.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 py-4 text-center text-[11px] text-zinc-500">
            No distribution recorded for this tip.
          </p>
        ) : (
          <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-100 bg-zinc-50/80 px-3">
            {tip.distributions.map((distribution) => (
              <div
                key={distribution.id}
                className="flex items-center justify-between gap-3 py-2.5 text-xs"
              >
                <div>
                  <div className="font-semibold text-ink-charcoal">
                    {distribution.recipient_type === "EMPLOYEE"
                      ? (distribution.employee?.full_name ?? "Employee")
                      : "Store"}
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    {distribution.percentage}% ·{" "}
                    {getPayoutStatusLabel(distribution.payout_status)}
                  </div>
                </div>
                <div className="font-bold text-ink-charcoal">
                  {formatMoney(distribution.amount, tip.currency)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {tip.refunds && tip.refunds.length > 0 ? (
        <div>
          <div className="mb-2 text-xs font-semibold text-zinc-500">
            Refunds
          </div>
          <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-100 bg-zinc-50/80 px-3">
            {tip.refunds.map((refund) => (
              <div
                key={refund.id}
                className="flex items-center justify-between gap-3 py-2.5 text-xs"
              >
                <span className="text-zinc-500">
                  {refund.reason || "No reason given"}
                </span>
                <span className="font-semibold text-ink-charcoal">
                  {formatMoney(refund.amount, tip.currency)} (
                  {getRefundStatusLabel(refund.status)})
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export const ReviewDetailSheet: FC<ReviewDetailSheetProps> = ({
  reviewId,
  onOpenChange,
}) => {
  const { store } = useWorkspace();
  const reviewQuery = useReview(reviewId ?? "");
  const primaryLanguage = store?.primary_language?.toLowerCase();

  return (
    <Sheet open={!!reviewId} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Review</SheetTitle>
          <SheetDescription>
            Full feedback left after a customer tip.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 overflow-y-auto px-4 pb-6">
          {reviewQuery.isPending ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-4 w-48" />
            </div>
          ) : reviewQuery.isError || !reviewQuery.data ? (
            <p className="text-sm text-red-600">
              {reviewQuery.error?.message ?? "Could not load this review."}
            </p>
          ) : (
            (() => {
              const review = reviewQuery.data;
              return (
                <>
                  <div className="flex items-center">
                    <span className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={cn(
                            "size-4",
                            index < review.rating
                              ? "fill-rating-amber text-rating-amber"
                              : "text-zinc-200",
                          )}
                        />
                      ))}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="text-xs font-semibold text-zinc-500">
                      Employee
                    </div>
                    <div className="font-semibold text-ink-charcoal">
                      {review.employee?.full_name ?? "Store"}
                    </div>
                  </div>

                  {review.comment ? (
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-zinc-500">
                        Comment
                      </div>
                      <p className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm text-zinc-700">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                    </div>
                  ) : null}

                  {review.category_ratings?.length ? (
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-zinc-500">
                        Category ratings
                      </div>
                      <div className="space-y-1">
                        {review.category_ratings.map((rating, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between text-xs"
                          >
                            <span className="text-zinc-500">
                              {resolvePrimaryText(
                                rating.review_category?.name,
                                primaryLanguage,
                              ) || "Category"}
                            </span>
                            <span className="font-semibold text-ink-charcoal">
                              ★ {rating.rating}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {review.feedback_responses?.length ? (
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-zinc-500">
                        Feedback questions
                      </div>
                      <div className="space-y-2">
                        {review.feedback_responses.map((response) => {
                          const question =
                            resolvePrimaryText(
                              response.feedback_question?.question,
                              primaryLanguage,
                            ) || "Question";
                          const answer =
                            response.rating_value != null
                              ? `★ ${response.rating_value}`
                              : (response.text_value?.trim() || "-");

                          return (
                            <div
                              key={response.feedback_question_id}
                              className="rounded-xl border border-zinc-100 bg-zinc-50 p-3"
                            >
                              <div className="text-xs text-zinc-500">
                                {question}
                              </div>
                              <div className="mt-1 text-sm font-semibold text-ink-charcoal">
                                {answer}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {review.tags?.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {review.tags.map((assignment) => (
                        <span
                          key={assignment.review_tag.id}
                          className="rounded-full bg-neutral-fill px-2 py-0.5 text-[10px] font-medium text-zinc-600"
                        >
                          {assignment.review_tag.name}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="text-xs text-zinc-400">
                    {new Date(review.created_at).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>

                  {review.tip_id ? (
                    <>
                      <div className="border-t border-zinc-100 pt-4" />
                      <LinkedTipSection tipId={review.tip_id} />
                    </>
                  ) : null}
                </>
              );
            })()
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
