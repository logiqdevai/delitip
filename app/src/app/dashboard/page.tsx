import { type FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, Plus } from "lucide-react";
import { Routes } from "@/routes/routes";
import { cn } from "@/lib/utils";
import {
  DashboardPageHeader,
  RecognitionBadge,
  StatusPill,
} from "./components/dashboard-shared";
import {
  demoEmployees,
  demoFeedback,
  demoTipDays,
} from "./data/dashboard-demo";

const OverviewPage: FC = () => {
  return (
    <>
      <DashboardPageHeader
        title="Overview"
        description="Understand and manage great service across your business."
        actions={
          <>
            <Link
              href={Routes.dashboard.employees}
              className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-chip font-semibold text-zinc-700 shadow-xs transition hover:bg-zinc-50"
            >
              <Plus className="size-3.5" strokeWidth={2} />
              Add Employee
            </Link>
            <Link
              href={Routes.dashboard.distribution}
              className="flex items-center gap-2 rounded-xl bg-electric-lime px-3.5 py-2 text-chip font-semibold text-ink-charcoal shadow-sm transition hover:bg-brand-700"
            >
              <Download className="size-3.5" strokeWidth={2} />
              Run Tip Distribution
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-zinc-500">
              Total Tips (7d)
            </span>
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-caption font-bold text-brand-700">
              +18.4%
            </span>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-ink-charcoal">
            $3,420.50
          </div>
          <div className="mt-1 text-[11px] text-zinc-400">
            428 Customer tips processed
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-zinc-500">
              Average Tip
            </span>
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-caption font-bold text-brand-700">
              19.2%
            </span>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-ink-charcoal">
            $4.95
          </div>
          <div className="mt-1 text-[11px] text-zinc-400">
            Avg customer reward amount
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-zinc-500">
              Customer Reviews
            </span>
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-caption font-bold text-amber-700">
              ★ 4.93 / 5
            </span>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-ink-charcoal">
            98.6%
          </div>
          <div className="mt-1 text-[11px] text-zinc-400">
            312 positive ratings this week
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-zinc-500">
              Tip Distribution Model
            </span>
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-caption font-bold text-brand-800">
              Fair & Direct
            </span>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-brand-700">100%</div>
          <div className="mt-1 text-[11px] text-zinc-400">
            Employee Share: 100% • House: 0%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-ink-charcoal">
                Tips & Customer Flow (Past 7 Days)
              </h2>
              <p className="text-xs text-zinc-400">
                Daily tip amounts generated via table QR codes
              </p>
            </div>
            <span className="rounded-lg bg-brand-50 px-2.5 py-1 text-chip font-bold text-brand-700">
              Avg $488/day
            </span>
          </div>

          <div className="grid h-44 grid-cols-7 items-end gap-3 border-b border-zinc-100 pt-4 pb-2">
            {demoTipDays.map((day) => (
              <div
                key={day.day}
                className="flex h-full flex-col items-center justify-end gap-1.5"
              >
                <span
                  className={cn(
                    "text-[10px] font-semibold text-zinc-400",
                    day.peak === "top" && "font-bold text-brand-700"
                  )}
                >
                  {day.amount}
                </span>
                <div
                  className={cn(
                    "w-full rounded-t-lg transition",
                    day.peak === "top"
                      ? "bg-electric-lime shadow-sm"
                      : day.peak === "high"
                        ? "bg-brand-200 hover:bg-electric-lime"
                        : "bg-zinc-100 hover:bg-electric-lime"
                  )}
                  style={{ height: day.height }}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium text-zinc-500",
                    day.peak === "top" && "font-bold text-brand-800",
                    day.peak === "high" && "font-bold text-ink-charcoal"
                  )}
                >
                  {day.day}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-electric-lime" />
              Peak: Saturday Dinner Service
            </span>
            <Link
              href={Routes.dashboard.analytics}
              className="font-semibold text-brand-700 hover:underline"
            >
              View In-depth Analytics →
            </Link>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink-charcoal">
              Live Customer Feedback
            </h2>
            <span className="size-2 animate-pulse rounded-full bg-electric-lime" />
          </div>

          <div className="space-y-3">
            {demoFeedback.map((item) => (
              <div
                key={`${item.employee}-${item.when}`}
                className="space-y-1.5 rounded-xl border border-zinc-100 bg-zinc-50 p-3"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-ink-charcoal">
                    Customer for {item.employee}
                  </span>
                  <span className="font-bold text-rating-amber">★★★★★</span>
                </div>
                <p className="text-xs text-zinc-600">&ldquo;{item.note}&rdquo;</p>
                <div className="flex justify-between pt-1 text-[10px] text-zinc-400">
                  <span className="font-medium text-brand-700">{item.tip}</span>
                  <span>{item.when}</span>
                </div>
              </div>
            ))}
          </div>

          <Link
            href={Routes.dashboard.reviews}
            className="block w-full rounded-xl bg-neutral-fill py-2 text-center text-chip font-semibold text-zinc-700 transition hover:bg-zinc-200"
          >
            See All Reviews
          </Link>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-ink-charcoal">
              Top Performing Employees
            </h2>
            <p className="text-xs text-zinc-400">
              Directly rewarded based on customer appreciation
            </p>
          </div>
          <Link
            href={Routes.dashboard.employees}
            className="text-xs font-semibold text-brand-700 hover:underline"
          >
            View All 8 Staff
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-chip">
            <thead className="border-y border-zinc-100 bg-zinc-50 text-caption font-semibold tracking-wider text-zinc-400 uppercase">
              <tr>
                <th className="px-3 py-2.5">Employee</th>
                <th className="px-3 py-2.5">Role</th>
                <th className="px-3 py-2.5">Tips (7d)</th>
                <th className="px-3 py-2.5">Rating</th>
                <th className="px-3 py-2.5">Top Badge</th>
                <th className="px-3 py-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
              {demoEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <Image
                        src={employee.photo}
                        alt={employee.name}
                        width={28}
                        height={28}
                        className="size-7 rounded-full object-cover"
                      />
                      <span className="font-bold text-ink-charcoal">
                        {employee.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-zinc-500">{employee.role}</td>
                  <td className="px-3 py-3 font-bold text-ink-charcoal">
                    {employee.tips7d}
                  </td>
                  <td className="px-3 py-3 font-semibold text-rating-amber">
                    ★ {employee.rating}{" "}
                    <span className="text-[10px] font-normal text-zinc-400">
                      ({employee.reviewCount})
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <RecognitionBadge badge={employee.badge} />
                  </td>
                  <td className="px-3 py-3 text-right">
                    <StatusPill onShift={employee.onShift} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default OverviewPage;
