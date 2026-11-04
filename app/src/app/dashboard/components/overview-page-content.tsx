"use client";

import { type FC } from "react";
import Link from "next/link";
import { format, parseISO, startOfDay, subDays } from "date-fns";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { Download, ListChecks, Plus, Star } from "lucide-react";
import { Routes } from "@/routes/routes";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/money";
import { buttonVariants } from "@/components/ui/button";
import { DashboardOverviewHeader } from "@/app/dashboard/components/dashboard-overview-header";
import { EmployeeAvatar } from "@/components/ui/employee-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { useStoreReviews } from "@/features/reviews/hooks/use-reviews";
import { useEmployees } from "@/features/employees/hooks/use-employees";
import { useGettingStartedSteps } from "@/hooks/use-getting-started-steps";
import {
  useDashboardOverview,
  useDashboardTrends,
} from "@/features/analytics/hooks/use-analytics";
import { getErrorMessage } from "@/lib/api-error";

const TREND_DAYS = 7;

const MetricCard: FC<{
  label: string;
  value: string;
  total?: string;
  hint?: string;
}> = ({ label, value, total, hint }) => {
  const t = useTranslations("dashboard.shell.overview");

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs">
      <span className="text-xs font-semibold text-zinc-500">{label}</span>
      <div className="mt-2 text-2xl font-extrabold text-ink-charcoal">
        {value}
      </div>
      {total ? (
        <div className="mt-1 text-base text-zinc-500">
          {t.rich("total", {
            value: total,
            b: (chunks) => (
              <span className="font-semibold text-zinc-700">{chunks}</span>
            ),
          })}
        </div>
      ) : null}
      {hint ? (
        <div className="mt-1 text-base text-zinc-400">{hint}</div>
      ) : null}
    </div>
  );
};

export const OverviewPageContent: FC = () => {
  const t = useTranslations("dashboard.shell.overview");
  const locale = useLocale();
  const intlFormat = useFormatter();
  const {
    storeId,
    store,
    organizationId,
    isPending: workspacePending,
    isReady,
  } = useWorkspace();

  const overviewQuery = useDashboardOverview(organizationId ?? "", {
    store_id: storeId ?? undefined,
    period: "today",
  });
  const totalsQuery = useDashboardOverview(organizationId ?? "", {
    store_id: storeId ?? undefined,
    period: "all",
  });
  const trendsQuery = useDashboardTrends(organizationId ?? "", {
    store_id: storeId ?? undefined,
    metric: "tips",
    period: "7d",
    group_by: "day",
  });
  const recentReviewsQuery = useStoreReviews(storeId ?? "", { limit: 50 });
  const employeesQuery = useEmployees(storeId ?? "", {
    limit: 100,
    is_active: true,
  });
  const gettingStarted = useGettingStartedSteps();

  if (workspacePending) {
    return (
      <div className="space-y-6">
        <DashboardOverviewHeader />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!isReady || !storeId || !store) {
    return <DashboardOverviewHeader />;
  }

  const reviews = recentReviewsQuery.data?.data ?? [];
  const employees = employeesQuery.data?.data ?? [];
  const overview = overviewQuery.data;
  const totals = totalsQuery.data;

  const trendByBucket = new Map(
    (trendsQuery.data ?? []).map((point) => [point.bucket, point.value]),
  );
  const trendPoints = Array.from({ length: TREND_DAYS }).map((_, index) => {
    const bucket = format(
      startOfDay(subDays(new Date(), TREND_DAYS - 1 - index)),
      "yyyy-MM-dd",
    );
    return { bucket, value: trendByBucket.get(bucket) ?? 0 };
  });
  const trendMax = Math.max(1, ...trendPoints.map((point) => point.value));
  const isLoading = overviewQuery.isPending;

  return (
    <>
      <DashboardOverviewHeader
        actions={
          <>
            <Link
              href={Routes.dashboard.employees}
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "w-full justify-center gap-2 sm:w-auto",
              )}
            >
              <Plus className="size-3.5" strokeWidth={2} />
              {t("addEmployee")}
            </Link>
            <Link
              href={Routes.dashboard.accessDistribution}
              className={cn(
                buttonVariants({ variant: "default", size: "default" }),
                "w-full justify-center gap-2 sm:w-auto",
              )}
            >
              <Download className="size-3.5" strokeWidth={2} />
              {t("manageDistribution")}
            </Link>
          </>
        }
      />

      {!gettingStarted.isPending &&
      gettingStarted.total > 0 &&
      gettingStarted.completedCount < gettingStarted.total ? (
        <Link
          href={Routes.dashboard.gettingStarted}
          className="flex flex-col gap-4 rounded-2xl border border-brand-200/80 bg-brand-50 px-4 py-5 shadow-xs transition hover:border-brand-300 md:flex-row md:items-center md:justify-between md:gap-3 md:p-4"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700">
            <ListChecks className="size-4" strokeWidth={2} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-ink-charcoal">
              {t("setupTitle")}
            </p>
            <p className="mt-0.5 text-xs text-zinc-500">
              {t("setupProgress", {
                completed: gettingStarted.completedCount,
                total: gettingStarted.total,
              })}
            </p>
          </div>
          <span
            className={cn(
              buttonVariants({ variant: "outline", size: "default" }),
              "w-full justify-center border-white bg-white text-brand-700 hover:bg-white/90 md:h-auto md:w-auto md:border-transparent md:bg-transparent md:px-0 md:py-0 md:text-xs md:font-semibold md:shadow-none md:hover:bg-transparent md:hover:underline",
            )}
          >
            {t("viewChecklist")}
          </span>
        </Link>
      ) : null}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : overviewQuery.isError ? (
        <div className="rounded-2xl border border-dashed border-red-200 bg-red-50 p-4 text-xs text-red-700">
          {t("metricsError")} {getErrorMessage(overviewQuery.error)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label={t("tipsToday")}
            value={formatMoney(
              overview?.tips_total_amount ?? 0,
              store.currency,
              locale,
            )}
            total={
              totals
                ? formatMoney(totals.tips_total_amount, store.currency, locale)
                : undefined
            }
            hint={t("recognizedHint", {
              count: overview?.employees_recognized ?? 0,
            })}
          />
          <MetricCard
            label={t("transactionsToday")}
            value={String(overview?.transactions_count ?? 0)}
            total={
              totals ? String(totals.transactions_count) : undefined
            }
            hint={t("transactionsHint")}
          />
          <MetricCard
            label={t("reviewsToday")}
            value={String(overview?.reviews_count ?? 0)}
            total={totals ? String(totals.reviews_count) : undefined}
            hint={t("reviewsHint")}
          />
          <MetricCard
            label={t("avgRatingToday")}
            value={overview?.average_rating ? `★ ${overview.average_rating.toFixed(2)}` : "-"}
            total={
              totals?.average_rating
                ? `★ ${totals.average_rating.toFixed(2)}`
                : totals
                  ? "-"
                  : undefined
            }
            hint={
              overview?.average_rating ? t("ratingHint") : t("noRatingHint")
            }
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 rounded-2xl border border-zinc-200/80 bg-white px-4 py-5 shadow-xs lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-ink-charcoal">
                {t("tipsTrendTitle", { days: TREND_DAYS })}
              </h2>
              <p className="text-xs text-zinc-400">
                {t("tipsTrendSubtitle")}
              </p>
            </div>
            <Link
              href={Routes.dashboard.analytics.overview}
              className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold whitespace-nowrap text-brand-700 hover:underline"
            >
              {t("viewAnalytics")}
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {trendsQuery.isPending ? (
            <Skeleton className="h-44 w-full rounded-xl" />
          ) : trendsQuery.isError ? (
            <p className="text-xs text-red-600">{getErrorMessage(trendsQuery.error)}</p>
          ) : (
            <div className="grid h-44 grid-cols-7 items-end gap-3 border-b border-zinc-100 pt-4 pb-2">
              {trendPoints.map((point) => {
                const isPeak = point.value === trendMax && point.value > 0;
                const heightPct = Math.max(
                  4,
                  Math.round((point.value / trendMax) * 100),
                );
                return (
                  <div
                    key={point.bucket}
                    className="flex h-full flex-col items-center justify-end gap-1.5"
                  >
                    <span
                      className={cn(
                        "text-base font-semibold text-zinc-400",
                        isPeak && "font-bold text-brand-700",
                      )}
                    >
                      {point.value > 0
                        ? formatMoney(point.value, store.currency, locale)
                        : "-"}
                    </span>
                    <div
                      className={cn(
                        "w-full rounded-t-lg transition",
                        isPeak
                          ? "bg-electric-lime shadow-sm"
                          : point.value > 0
                            ? "bg-brand-200 hover:bg-electric-lime"
                            : "bg-zinc-100",
                      )}
                      style={{ height: `${heightPct}%` }}
                    />
                    <span
                      className={cn(
                        "text-base font-medium text-zinc-500",
                        isPeak && "font-bold text-brand-800",
                      )}
                    >
                      {intlFormat.dateTime(parseISO(point.bucket), {
                        weekday: "short",
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-2xl border border-zinc-200/80 bg-white px-4 py-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink-charcoal">
              {t("liveFeedback")}
            </h2>
            <span className="size-2 animate-pulse rounded-full bg-electric-lime" />
          </div>

          {recentReviewsQuery.isPending ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, index) => (
                <Skeleton key={index} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-4 text-center text-xs text-zinc-500">
              {t("noFeedback")}
            </p>
          ) : (
            <div className="space-y-3">
              {reviews.slice(0, 3).map((review) => (
                <div
                  key={review.id}
                  className="space-y-1.5 rounded-xl border border-zinc-100 bg-zinc-50 p-3"
                >
                  <div className="flex items-center justify-between text-base">
                    <span className="font-bold text-ink-charcoal">
                      {review.employee?.full_name ?? t("storeFallback")}
                    </span>
                    <span className="flex items-center gap-0.5 font-bold text-rating-amber">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="size-3 fill-rating-amber" />
                      ))}
                    </span>
                  </div>
                  {review.comment ? (
                    <p className="text-xs text-zinc-600">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  ) : null}
                  <div className="flex justify-between pt-1 text-base text-zinc-400">
                    <span>
                      {intlFormat.dateTime(new Date(review.created_at), {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link
            href={Routes.dashboard.reviews}
            className={cn(
              buttonVariants({ variant: "secondary", size: "default" }),
              "w-full justify-center",
            )}
          >
            {t("seeAllReviews")}
          </Link>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-zinc-200/80 bg-white px-4 py-5 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-ink-charcoal">{t("team")}</h2>
            <p className="text-xs text-zinc-400">
              {t("teamSubtitle")}
            </p>
          </div>
          <Link
            href={Routes.dashboard.employees}
            className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold whitespace-nowrap text-brand-700 hover:underline"
          >
            {t("viewAllStaff")}
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {employeesQuery.isPending ? (
          <Skeleton className="h-24 w-full rounded-xl" />
        ) : employees.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-4 text-center text-xs text-zinc-500">
            {t("noEmployees")}
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {employees.map((employee) => (
              <li
                key={employee.id}
                className="flex items-center gap-2 rounded-full border border-zinc-100 bg-zinc-50 py-1.5 pr-3 pl-1.5"
              >
                <EmployeeAvatar
                  name={employee.full_name}
                  photoUrl={employee.photo_document?.url}
                  size="xs"
                />
                <span className="text-xs font-semibold text-ink-charcoal">
                  {employee.full_name}
                </span>
                {employee.position ? (
                  <span className="text-base text-zinc-400">
                    {employee.position}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};
