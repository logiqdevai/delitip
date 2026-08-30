import { type FC } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftRight,
  BarChart3,
  Download,
  LayoutGrid,
  Plus,
  QrCode,
  Settings,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { Routes } from "@/routes/routes";
import { cn } from "@/lib/utils";
import {
  RecognitionBadge,
  StatusPill,
} from "@/app/dashboard/components/dashboard-shared";
import {
  demoBusiness,
  demoEmployees,
} from "@/app/dashboard/data/dashboard-demo";
import {
  clientBusinessMetrics,
  clientLiveReviews,
} from "../data/client-demo";

const navItems: {
  label: string;
  icon: typeof LayoutGrid;
  active?: boolean;
  badge?: string;
}[] = [
  { label: "Overview", icon: LayoutGrid, active: true },
  { label: "Employees", icon: Users, badge: "8" },
  { label: "Tips", icon: Wallet },
  { label: "Reviews & Feedback", icon: Star },
  { label: "Tip Distribution", icon: ArrowLeftRight },
  { label: "Analytics", icon: BarChart3 },
  { label: "Customer Access (QR)", icon: QrCode },
];

export const ClientBusinessView: FC = () => {
  return (
    <main className="flex flex-1 overflow-hidden bg-zinc-50">
      <aside className="hidden w-64 flex-col justify-between border-r border-zinc-200 bg-white p-4 md:flex">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 px-2">
            <BrandMark size="sm" className="size-8 rounded-lg text-base" />
            <div>
              <div className="text-sm leading-none font-bold tracking-tight text-ink-charcoal">
                delitip
                <span className="text-electric-lime">.com</span>
              </div>
              <span className="text-[10px] font-semibold tracking-widest text-zinc-400 uppercase">
                Business OS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl border border-zinc-200/80 bg-zinc-50 p-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-ink-charcoal text-xs font-bold text-paper-offwhite">
              {demoBusiness.initial}
            </div>
            <div className="truncate">
              <div className="truncate text-xs font-bold text-ink-charcoal">
                {demoBusiness.name}
              </div>
              <div className="text-[10px] text-zinc-500">
                Downtown Branch
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  href={Routes.dashboard.root}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-xs transition",
                    item.active
                      ? "bg-brand-50 font-semibold text-brand-800"
                      : "font-medium text-zinc-600 hover:bg-neutral-fill hover:text-ink-charcoal"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4",
                      item.active ? "text-electric-lime" : "text-zinc-400"
                    )}
                    strokeWidth={2}
                  />
                  {item.label}
                  {item.badge ? (
                    <span className="ml-auto rounded-full bg-neutral-fill px-1.5 py-0.5 text-[10px] text-zinc-600">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-1 border-t border-zinc-100 pt-3">
          <Link
            href={Routes.dashboard.settings.root}
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-zinc-600 transition hover:bg-neutral-fill hover:text-ink-charcoal"
          >
            <Settings className="size-4 text-zinc-400" strokeWidth={2} />
            Settings
          </Link>
        </div>
      </aside>

      <div className="flex-1 space-y-6 overflow-y-auto p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-xl font-bold text-ink-charcoal">Overview</h1>
            <p className="mt-0.5 text-xs text-zinc-500">
              Understand and manage great service across your team
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              href={Routes.dashboard.employees}
              className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50"
            >
              <Plus className="size-3.5" strokeWidth={2} />
              Add Employee
            </Link>
            <Link
              href={Routes.dashboard.distribution}
              className="flex items-center gap-2 rounded-xl bg-electric-lime px-3.5 py-2 text-xs font-semibold text-ink-charcoal shadow-sm transition hover:bg-brand-700"
            >
              <Download className="size-3.5" strokeWidth={2} />
              Export Tip Report
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {clientBusinessMetrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium text-zinc-500">
                  {metric.label}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    "deltaClass" in metric && metric.deltaClass
                      ? metric.deltaClass
                      : "bg-brand-50 text-brand-700"
                  )}
                >
                  {metric.delta}
                </span>
              </div>
              <div
                className={cn(
                  "mt-2 text-2xl font-extrabold text-ink-charcoal",
                  "valueClass" in metric && metric.valueClass
                )}
              >
                {metric.value}
              </div>
              <div className="mt-1 text-[11px] text-zinc-400">{metric.note}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-ink-charcoal">
                  Employee Performance & Tips
                </h2>
                <p className="text-xs text-zinc-400">
                  Live breakdown of individual tip earnings and customer ratings
                </p>
              </div>
              <Link
                href={Routes.dashboard.employees}
                className="text-xs font-semibold text-brand-700 hover:underline"
              >
                Manage Team
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-y border-zinc-100 bg-zinc-50 text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">
                  <tr>
                    <th className="px-3 py-2.5">Employee</th>
                    <th className="px-3 py-2.5">Tips (7d)</th>
                    <th className="px-3 py-2.5">Review Score</th>
                    <th className="px-3 py-2.5">Top Compliment</th>
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
                            width={32}
                            height={32}
                            className="size-8 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-bold text-ink-charcoal">
                              {employee.name}
                            </div>
                            <div className="text-[10px] text-zinc-400">
                              {employee.role}
                            </div>
                          </div>
                        </div>
                      </td>
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

          <div className="space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-ink-charcoal">
                Live Customer Reviews
              </h2>
              <span className="size-2 animate-pulse rounded-full bg-electric-lime" />
            </div>

            <div className="space-y-3">
              {clientLiveReviews.map((review) => (
                <div
                  key={`${review.employee}-${review.when}`}
                  className="space-y-1.5 rounded-xl border border-zinc-100 bg-zinc-50 p-3"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-ink-charcoal">
                      Customer for {review.employee}
                    </span>
                    <span className="font-bold text-rating-amber">★★★★★</span>
                  </div>
                  <p className="text-xs text-zinc-600">
                    &ldquo;{review.note}&rdquo;
                  </p>
                  <div className="flex justify-between pt-1 text-[10px] text-zinc-400">
                    <span>Tip: {review.tip}</span>
                    <span>{review.when}</span>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href={Routes.dashboard.reviews}
              className="block w-full rounded-xl bg-neutral-fill py-2 text-center text-xs font-semibold text-zinc-700 transition hover:bg-zinc-200"
            >
              View All Reviews
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};
