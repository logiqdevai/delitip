"use client";

import { type FC } from "react";
import { format } from "date-fns";
import { MessageSquareText, Star, ThumbsUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import {
  useCurrentEmployee,
  useEmployeeDashboard,
} from "@/features/employees/hooks/use-employees";
import { useEmployeeReviews } from "@/features/reviews/hooks/use-reviews";

const StatCard: FC<{
  icon: FC<{ className?: string; strokeWidth?: number }>;
  value: string;
  label: string;
}> = ({ icon: Icon, value, label }) => (
  <div className="space-y-1 rounded-2xl border border-zinc-200/80 bg-white p-4 text-center shadow-xs">
    <Icon className="mx-auto size-8 text-brand-700" strokeWidth={2} />
    <div className="text-base font-extrabold text-ink-charcoal">{value}</div>
    <div className="text-[11px] font-semibold text-zinc-500">{label}</div>
  </div>
);

const ReviewsPage: FC = () => {
  const { employeeId, isPending: identityPending } = useCurrentEmployee();
  const dashboardQuery = useEmployeeDashboard(employeeId ?? "");
  const reviewsQuery = useEmployeeReviews(employeeId ?? "", { limit: 20 });

  if (identityPending || dashboardQuery.isPending || reviewsQuery.isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    );
  }

  if (dashboardQuery.isError || reviewsQuery.isError) {
    return (
      <Empty className="border border-dashed border-zinc-200 bg-white py-16">
        <EmptyHeader>
          <EmptyTitle>Could not load your reviews</EmptyTitle>
          <EmptyDescription>
            {dashboardQuery.error?.message ?? reviewsQuery.error?.message}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const dashboard = dashboardQuery.data;
  const reviews = reviewsQuery.data?.data ?? [];

  return (
    <div className="auth-fade-enter space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink-charcoal">
          Customer Compliments & Reviews
        </h1>
        <p className="mt-0.5 text-xs text-zinc-500">
          Real feedback left by guests after tipping you on delitip.com.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          icon={Star}
          value={dashboard?.average_rating ? dashboard.average_rating.toFixed(2) : "—"}
          label="Average Rating"
        />
        <StatCard
          icon={MessageSquareText}
          value={String(dashboard?.reviews_count ?? 0)}
          label="Total Reviews"
        />
        <StatCard
          icon={ThumbsUp}
          value={`${dashboard?.customer_recognition_count ?? 0}x`}
          label="Recognitions"
        />
      </div>

      <div className="space-y-4 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs">
        <h2 className="text-sm font-bold text-ink-charcoal">
          Customer Love Notes
        </h2>
        {reviews.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 py-8 text-center text-xs text-zinc-500">
            No reviews yet — they&apos;ll show up here once customers rate you
            after tipping.
          </p>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="space-y-1.5 rounded-2xl border border-zinc-100 bg-zinc-50 p-4"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={cn(
                          "size-3.5",
                          index < review.rating
                            ? "fill-rating-amber text-rating-amber"
                            : "text-zinc-200",
                        )}
                      />
                    ))}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {format(new Date(review.created_at), "MMM d, yyyy")}
                  </span>
                </div>
                {review.comment ? (
                  <p className="text-xs text-zinc-700">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                ) : (
                  <p className="text-xs text-zinc-400 italic">No comment left</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
