import { type FC } from "react";
import { Zap } from "lucide-react";
import { DashboardPageHeader } from "../components/dashboard-shared";
import { demoReviews } from "../data/dashboard-demo";

const ReviewsPage: FC = () => {
  return (
    <>
      <DashboardPageHeader
        title="Reviews & Feedback"
        description="Direct customer sentiment, compliments, and ratings tied to employees."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs">
          <span className="text-xs font-semibold text-zinc-400">
            Average Rating
          </span>
          <div className="mt-1 text-2xl font-extrabold text-rating-amber">
            ★ 4.93
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">
            Based on 328 ratings
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs">
          <span className="text-xs font-semibold text-zinc-400">
            Top Customer Tag
          </span>
          <div className="mt-1 flex items-center gap-1.5 text-2xl font-extrabold text-brand-700">
            <Zap className="size-6" strokeWidth={2} />
            Super Fast
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">Awarded 184 times</p>
        </div>
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs">
          <span className="text-xs font-semibold text-zinc-400">
            Customer Sentiment
          </span>
          <div className="mt-1 text-2xl font-extrabold text-ink-charcoal">
            98.6% Positive
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">Only 2 neutral reviews</p>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
        <h2 className="text-sm font-bold text-ink-charcoal">
          Recent Customer Notes
        </h2>
        <div className="space-y-3">
          {demoReviews.map((review) => (
            <div
              key={`${review.employee}-${review.when}`}
              className="flex items-start justify-between gap-4 rounded-xl border border-zinc-100 bg-zinc-50 p-4"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-ink-charcoal">
                    {review.employee}
                  </span>
                  <span className="text-xs text-rating-amber">★★★★★</span>
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
                    {review.tag}
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-600">
                  &ldquo;{review.note}&rdquo;
                </p>
              </div>
              <span className="shrink-0 text-[10px] text-zinc-400">
                {review.when}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ReviewsPage;
