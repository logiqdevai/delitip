"use client";

import { type FC } from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useReview } from "@/features/reviews/hooks/use-reviews";
import { getReviewVisibilityLabel } from "@/config/constants/dropdowns/reviews/review-visibility-form.options";
import { cn } from "@/lib/utils";
import { Routes } from "@/routes/routes";

interface ReviewDetailSheetProps {
  reviewId: string | null;
  onOpenChange: (open: boolean) => void;
}

export const ReviewDetailSheet: FC<ReviewDetailSheetProps> = ({
  reviewId,
  onOpenChange,
}) => {
  const reviewQuery = useReview(reviewId ?? "");

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
                  <div className="flex items-center justify-between">
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
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                        review.visibility === "PUBLIC"
                          ? "bg-brand-50 text-brand-700"
                          : "bg-zinc-100 text-zinc-600",
                      )}
                    >
                      {getReviewVisibilityLabel(review.visibility)}
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
                              {rating.review_category?.name ?? "Category"}
                            </span>
                            <span className="font-semibold text-ink-charcoal">
                              ★ {rating.rating}
                            </span>
                          </div>
                        ))}
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
                    <Link
                      href={Routes.dashboard.tipDetail(review.tip_id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:underline"
                    >
                      View linked tip
                      <ArrowRight className="size-3.5" strokeWidth={2} />
                    </Link>
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
