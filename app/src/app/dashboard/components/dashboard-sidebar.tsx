"use client";

import { type FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  BarChart3,
  Bell,
  CreditCard,
  LayoutGrid,
  QrCode,
  Settings,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { AccountSwitcher } from "@/components/auth/account-switcher";
import { BrandMark } from "@/components/brand/brand-mark";
import { Skeleton } from "@/components/ui/skeleton";
import { getStoreIndustryLabel } from "@/config/constants/dropdowns/stores/store-industry-form.options";
import { useUnreadAlertsCount } from "@/features/alerts/hooks/use-alerts";
import { useEmployees } from "@/features/employees/hooks/use-employees";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { Routes } from "@/routes/routes";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: Routes.dashboard.root,
    label: "Overview",
    icon: LayoutGrid,
    match: (path: string) => path === Routes.dashboard.root,
  },
  {
    href: Routes.dashboard.employees,
    label: "Employees",
    icon: Users,
    showStaffBadge: true,
    hideForAccountant: true,
    match: (path: string) => path.startsWith(Routes.dashboard.employees),
  },
  {
    href: Routes.dashboard.tips,
    label: "Tips Ledger",
    icon: Wallet,
    match: (path: string) => path.startsWith(Routes.dashboard.tips),
  },
  {
    href: Routes.dashboard.payments,
    label: "Payments",
    icon: CreditCard,
    match: (path: string) => path.startsWith(Routes.dashboard.payments),
  },
  {
    href: Routes.dashboard.reviews,
    label: "Reviews & Feedback",
    icon: Star,
    match: (path: string) => path.startsWith(Routes.dashboard.reviews),
  },
  {
    href: Routes.dashboard.distribution,
    label: "Tip Distribution",
    icon: ArrowLeftRight,
    hideForAccountant: true,
    match: (path: string) => path.startsWith(Routes.dashboard.distribution),
  },
  {
    href: Routes.dashboard.analytics,
    label: "Analytics",
    icon: BarChart3,
    match: (path: string) => path.startsWith(Routes.dashboard.analytics),
  },
  {
    href: Routes.dashboard.access,
    label: "Customer Access (QR)",
    icon: QrCode,
    hideForAccountant: true,
    match: (path: string) => path.startsWith(Routes.dashboard.access),
  },
  {
    href: Routes.dashboard.alerts,
    label: "Alerts",
    icon: Bell,
    showUnreadBadge: true,
    match: (path: string) => path.startsWith(Routes.dashboard.alerts),
  },
] as const;

const storeInitial = (name: string) => {
  const trimmed = name.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
};

export const DashboardSidebar: FC = () => {
  const pathname = usePathname();
  const { store, storeId, storeList, role, isPending, isError, switchStore } =
    useWorkspace();
  const employeesQuery = useEmployees(storeId ?? "");
  const unreadAlertsQuery = useUnreadAlertsCount(storeId ?? "");
  const isAccountant = role === "ACCOUNTANT";
  const visibleNavItems = navItems.filter(
    (item) => !("hideForAccountant" in item && item.hideForAccountant && isAccountant),
  );

  const staffCount = employeesQuery.data?.pagination.total;
  const metaParts = [
    store ? getStoreIndustryLabel(store.industry) : null,
    store?.city?.trim() || null,
  ].filter(Boolean);

  return (
    <aside className="flex w-full shrink-0 flex-col justify-between border-b border-zinc-200 bg-white p-4 md:w-64 md:border-r md:border-b-0">
      <div className="space-y-5">
        <div className="flex items-center gap-2.5 px-2">
          <BrandMark size="sm" className="size-7 rounded-lg text-xs" />
          <div>
            <div className="text-sm leading-none font-bold tracking-tight text-ink-charcoal">
              delitip
              <span className="text-electric-lime">.com</span>
            </div>
            <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
              Business Portal
            </span>
          </div>
        </div>

        <AccountSwitcher />

        <div className="flex items-center justify-between rounded-xl border border-zinc-200/80 bg-zinc-50 p-2.5">
          {isPending ? (
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <Skeleton className="size-7 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-2.5 w-20" />
              </div>
            </div>
          ) : isError || !store ? (
            <div className="min-w-0 px-0.5">
              <div className="truncate text-xs font-bold text-ink-charcoal">
                No store selected
              </div>
              <div className="text-[10px] font-medium text-zinc-400">
                Finish business setup to continue
              </div>
            </div>
          ) : (
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-ink-charcoal text-xs font-bold text-paper-offwhite">
                {storeInitial(store.name)}
              </div>
              <div className="min-w-0 flex-1 truncate">
                {storeList.length > 1 ? (
                  <select
                    value={storeId ?? ""}
                    onChange={(event) => switchStore(event.target.value)}
                    className="w-full truncate bg-transparent text-xs font-bold text-ink-charcoal outline-none"
                    aria-label="Switch store"
                  >
                    {storeList.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="truncate text-xs font-bold text-ink-charcoal">
                    {store.name}
                  </div>
                )}
                <div className="truncate text-[10px] font-medium text-zinc-400">
                  {metaParts.length > 0 ? metaParts.join(" • ") : store.currency}
                  {typeof staffCount === "number"
                    ? ` • ${staffCount} Staff`
                    : null}
                </div>
              </div>
            </div>
          )}
        </div>

        <nav className="flex gap-1 overflow-x-auto md:flex-col md:space-y-1 md:overflow-visible">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const active = item.match(pathname);
            const badge =
              "showStaffBadge" in item &&
              item.showStaffBadge &&
              typeof staffCount === "number"
                ? String(staffCount)
                : "showUnreadBadge" in item &&
                    item.showUnreadBadge &&
                    unreadAlertsQuery.data
                  ? String(unreadAlertsQuery.data)
                  : undefined;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-3 rounded-xl px-3 py-2 text-chip transition",
                  active
                    ? "bg-brand-50 font-semibold text-brand-800"
                    : "font-medium text-zinc-600 hover:bg-neutral-fill hover:text-ink-charcoal",
                )}
              >
                <Icon
                  className={cn(
                    "size-4",
                    active ? "text-electric-lime" : "text-zinc-400",
                  )}
                  strokeWidth={2}
                />
                <span className="whitespace-nowrap">{item.label}</span>
                {badge ? (
                  <span className="ml-auto rounded-full bg-neutral-fill px-1.5 py-0.5 text-caption font-semibold text-zinc-600">
                    {badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-4 border-t border-zinc-100 pt-3 md:mt-0">
        <Link
          href={Routes.dashboard.settings}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2 text-chip transition",
            pathname.startsWith(Routes.dashboard.settings)
              ? "bg-brand-50 font-semibold text-brand-800"
              : "font-medium text-zinc-600 hover:bg-neutral-fill hover:text-ink-charcoal",
          )}
        >
          <Settings
            className={cn(
              "size-4",
              pathname.startsWith(Routes.dashboard.settings)
                ? "text-electric-lime"
                : "text-zinc-400",
            )}
            strokeWidth={2}
          />
          Settings
        </Link>
      </div>
    </aside>
  );
};
