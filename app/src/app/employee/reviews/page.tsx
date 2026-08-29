import { type FC } from "react";
import { Eye, Sparkles, Wine, Zap } from "lucide-react";
import {
  demoBadgeCounts,
  demoEmployeeReviews,
} from "../data/employee-demo";

const badgeIcons = {
  "super-fast": Zap,
  "friendly-vibe": Sparkles,
  "great-recommendation": Wine,
  "super-attentive": Eye,
} as const;

const ReviewsPage: FC = () => {
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

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {demoBadgeCounts.map((badge) => {
          const Icon = badgeIcons[badge.id];

          return (
            <div
              key={badge.id}
              className="space-y-1 rounded-2xl border border-zinc-200/80 bg-white p-4 text-center shadow-xs"
            >
              <Icon
                className="mx-auto size-8 text-brand-700"
                strokeWidth={2}
              />
              <div className="text-base font-extrabold text-ink-charcoal">
                {badge.count}
              </div>
              <div className="text-[11px] font-semibold text-zinc-500">
                {badge.label}
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-4 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs">
        <h2 className="text-sm font-bold text-ink-charcoal">
          Customer Love Notes
        </h2>
        <div className="space-y-3">
          {demoEmployeeReviews.map((review) => (
            <div
              key={`${review.table}-${review.when}`}
              className="space-y-1.5 rounded-2xl border border-zinc-100 bg-zinc-50 p-4"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-ink-charcoal">
                  {review.table} • Tipped {review.tip}
                </span>
                <span className="font-bold text-rating-amber">★★★★★</span>
              </div>
              <p className="text-xs text-zinc-700">
                &ldquo;{review.note}&rdquo;
              </p>
              <div className="text-[10px] text-zinc-400">{review.when}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
