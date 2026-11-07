"use client";

import { type FC, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { MessageSquareText, SlidersHorizontal, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { EmployeeSelect } from "@/components/ui/employee-select";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { ReviewDetailSheet } from "@/app/dashboard/reviews/components/review-detail-sheet";
import { useStoreReviews } from "@/features/reviews/hooks/use-reviews";
import type { ReviewsQuery } from "@/features/reviews/interfaces/reviews.interfaces";
import { useEmployees } from "@/features/employees/hooks/use-employees";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/lib/api-error";

const RATING_OPTIONS = [5, 4, 3, 2, 1] as const;

const StarRating: FC<{ rating: number }> = ({ rating }) => (
  <span className="inline-flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={cn(
          "size-3.5",
          index < rating
            ? "fill-rating-amber text-rating-amber"
            : "text-zinc-200",
        )}
        strokeWidth={2}
      />
    ))}
  </span>
);

export const ReviewsPageContent: FC = () => {
  const t = useTranslations("dashboard.engagement");
  const format = useFormatter();
  const { storeId, isPending: workspacePending, isReady } = useWorkspace();
  const [minRating, setMinRating] = useState<number | "all">("all");
  const [employeeId, setEmployeeId] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(
    null,
  );

  const employeesQuery = useEmployees(storeId ?? "", { limit: 100 });

  const query: ReviewsQuery = {
    limit: 50,
    ...(minRating !== "all" ? { min_rating: minRating } : {}),
    ...(employeeId !== "all" ? { employee_id: employeeId } : {}),
    ...(dateFrom ? { date_from: dateFrom } : {}),
    ...(dateTo ? { date_to: dateTo } : {}),
  };

  const reviewsQuery = useStoreReviews(storeId ?? "", query);

  if (workspacePending) {
    return <TableSkeleton columns={4} />;
  }

  if (!isReady || !storeId) {
    return (
      <Empty className="border border-dashed border-zinc-200 bg-white py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MessageSquareText />
          </EmptyMedia>
          <EmptyTitle>{t("common.noStoreTitle")}</EmptyTitle>
          <EmptyDescription>{t("reviews.noStoreDescription")}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const reviews = reviewsQuery.data?.data ?? [];
  const employees = employeesQuery.data?.data ?? [];

  return (
    <>
      <DashboardPageHeader
        title={t("reviews.title")}
        description={t("reviews.description")}
      />

      <div className="flex flex-col gap-2.5 rounded-2xl border border-zinc-200/80 bg-zinc-50/60 px-4 py-2.5 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex items-center gap-1.5 pl-1 text-xs font-semibold text-zinc-500">
          <SlidersHorizontal className="size-3.5" />
          {t("common.filters")}
        </div>
        <Select
          items={[
            { label: t("reviews.anyRating"), value: "all" },
            ...RATING_OPTIONS.map((rating) => ({
              label: t("reviews.ratingPlus", { rating }),
              value: String(rating),
            })),
          ]}
          value={String(minRating)}
          onValueChange={(value) => {
            if (value) {
              setMinRating(value === "all" ? "all" : Number(value));
            }
          }}
        >
          <SelectTrigger className="w-full rounded-xl border-zinc-200 bg-white px-3.5 font-medium text-ink-charcoal shadow-xs sm:w-auto sm:min-w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectItem value="all">{t("reviews.anyRating")}</SelectItem>
              {RATING_OPTIONS.map((rating) => (
                <SelectItem key={rating} value={String(rating)}>
                  {t("reviews.ratingPlus", { rating })}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <EmployeeSelect
          employees={employees}
          value={employeeId}
          onValueChange={setEmployeeId}
          includeAll
          triggerClassName="w-full rounded-xl border-zinc-200 bg-white px-3.5 font-medium text-ink-charcoal shadow-xs sm:w-auto sm:min-w-36"
          aria-label={t("reviews.filterEmployee")}
        />

        <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:items-center">
          <DatePicker
            value={dateFrom}
            onChange={setDateFrom}
            placeholder={t("reviews.fromDate")}
            aria-label={t("reviews.fromDate")}
            className="w-full rounded-xl border-zinc-200 bg-white font-medium text-ink-charcoal shadow-xs sm:w-auto"
          />
          <span className="hidden text-xs text-zinc-400 sm:inline">{t("reviews.to")}</span>
          <DatePicker
            value={dateTo}
            onChange={setDateTo}
            placeholder={t("reviews.toDate")}
            aria-label={t("reviews.toDate")}
            className="w-full rounded-xl border-zinc-200 bg-white font-medium text-ink-charcoal shadow-xs sm:w-auto"
          />
        </div>
      </div>

      {reviewsQuery.isPending ? (
        <TableSkeleton columns={4} />
      ) : reviewsQuery.isError ? (
        <Empty className="border border-dashed border-zinc-200 bg-white py-16">
          <EmptyHeader>
            <EmptyTitle>{t("reviews.loadErrorTitle")}</EmptyTitle>
            <EmptyDescription>{getErrorMessage(reviewsQuery.error)}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              variant="outline"
              onClick={() => void reviewsQuery.refetch()}
            >
              {t("common.tryAgain")}
            </Button>
          </EmptyContent>
        </Empty>
      ) : reviews.length === 0 ? (
        <Empty className="border border-dashed border-zinc-200 bg-white py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MessageSquareText />
            </EmptyMedia>
            <EmptyTitle>{t("reviews.emptyTitle")}</EmptyTitle>
            <EmptyDescription>{t("reviews.emptyDescription")}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-4 rounded-2xl border border-zinc-200/80 bg-white px-4 py-5 shadow-xs">
          <h2 className="text-sm font-bold text-ink-charcoal">
            {t("reviews.customerNotes")}
          </h2>
          <div className="space-y-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedReviewId(review.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    setSelectedReviewId(review.id);
                  }
                }}
                className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-zinc-100 bg-zinc-50 p-4 transition hover:border-zinc-200 hover:bg-white"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-ink-charcoal">
                      {review.employee?.full_name ?? t("common.store")}
                    </span>
                    <StarRating rating={review.rating} />
                    {review.tags?.map((assignment) => (
                      <span
                        key={assignment.review_tag.id}
                        className="rounded-full bg-neutral-fill px-2 py-0.5 text-[10px] font-medium text-zinc-600"
                      >
                        {assignment.review_tag.name}
                      </span>
                    ))}
                  </div>
                  {review.comment ? (
                    <p className="mt-1 text-xs text-zinc-600">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  ) : null}
                </div>
                <span className="shrink-0 text-base text-zinc-400">
                  {format.dateTime(new Date(review.created_at), {
                    dateStyle: "medium",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <ReviewDetailSheet
        reviewId={selectedReviewId}
        onOpenChange={(open) => {
          if (!open) setSelectedReviewId(null);
        }}
      />
    </>
  );
};
