import { type FC } from "react";
import { DashboardPageHeader } from "../components/dashboard-shared";

const AnalyticsPage: FC = () => {
  return (
    <>
      <DashboardPageHeader
        title="Analytics & Insights"
        description="Detailed intelligence on tipping patterns and high-performance shifts."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-zinc-400">
            Peak Tipping Hour
          </span>
          <div className="mt-1 text-xl font-extrabold text-ink-charcoal">
            8:30 PM - 10:00 PM
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">
            Average tip: $6.20 during dinner
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-zinc-400">
            Top Payment Method
          </span>
          <div className="mt-1 text-xl font-extrabold text-ink-charcoal">
            Apple Pay (74%)
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">
            Fastest checkout velocity
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-zinc-400">
            QR Scan-to-Tip Conversion
          </span>
          <div className="mt-1 text-xl font-extrabold text-brand-700">82.4%</div>
          <p className="mt-1 text-[11px] text-zinc-500">
            High customer engagement
          </p>
        </div>
      </div>
    </>
  );
};

export default AnalyticsPage;
