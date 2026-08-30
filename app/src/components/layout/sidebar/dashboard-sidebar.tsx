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
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  QrCode,
  Settings,
  Star,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { AccountSwitcher } from "@/components/auth/account-switcher";
import { BrandMark } from "@/components/brand/brand-mark";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
    label: "Tips",
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
    label: "Reviews",
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
    href: Routes.dashboard.analytics.overview,
    label: "Analytics",
    icon: BarChart3,
    match: (path: string) => path.startsWith(Routes.dashboard.analytics.root),
  },
  {
    href: Routes.dashboard.access,
    label: "QR Codes",
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
  const { state, isMobile, toggleSidebar, setOpenMobile } = useSidebar();
  const collapsed = !isMobile && state === "collapsed";
  const { store, storeId, storeList, role, isPending, isError, switchStore } =
    useWorkspace();
  const employeesQuery = useEmployees(storeId ?? "");
  const unreadAlertsQuery = useUnreadAlertsCount(storeId ?? "");
  const isAccountant = role === "ACCOUNTANT";
  const visibleNavItems = navItems.filter(
    (item) => !("hideForAccountant" in item && item.hideForAccountant && isAccountant),
  );
  const settingsActive = pathname.startsWith(Routes.dashboard.settings.root);

  const staffCount = employeesQuery.data?.pagination.total;
  const metaParts = [
    store ? getStoreIndustryLabel(store.industry) : null,
    store?.city?.trim() || null,
  ].filter(Boolean);

  const closeMobileNav = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <>
      <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 md:hidden">
        <Link href={Routes.dashboard.root} className="flex items-center gap-2.5">
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
        </Link>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleSidebar}
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" />
        </Button>
      </div>

      <Sidebar collapsible="icon" className="border-zinc-200 bg-white">
        <SidebarHeader className="gap-4 border-b border-zinc-100 p-4">
          <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:flex-col">
            <Link
              href={Routes.dashboard.root}
              className="flex min-w-0 items-center gap-2.5"
            >
              <BrandMark size="sm" className="size-7 shrink-0 rounded-lg text-xs" />
              <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                <div className="truncate text-sm leading-none font-bold tracking-tight text-ink-charcoal">
                  delitip
                  <span className="text-electric-lime">.com</span>
                </div>
                <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
                  Business Portal
                </span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleSidebar}
              aria-label={
                isMobile
                  ? "Close navigation menu"
                  : collapsed
                    ? "Expand sidebar"
                    : "Collapse sidebar"
              }
              className="shrink-0"
            >
              {isMobile ? (
                <X className="size-4" />
              ) : collapsed ? (
                <PanelLeftOpen className="size-4" />
              ) : (
                <PanelLeftClose className="size-4" />
              )}
            </Button>
          </div>

          <div className="space-y-3 group-data-[collapsible=icon]:hidden">
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
                      <Select
                        items={storeList.map((item) => ({
                          label: item.name,
                          value: item.id,
                        }))}
                        value={storeId ?? undefined}
                        onValueChange={(value) => {
                          if (value) switchStore(value);
                        }}
                      >
                        <SelectTrigger
                          aria-label="Switch store"
                          className="h-auto w-full min-w-0 justify-start gap-1 border-none bg-transparent p-0 text-xs font-bold text-ink-charcoal shadow-none focus-visible:ring-0"
                        >
                          <SelectValue className="truncate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {storeList.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
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
          </div>

          {store ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <div className="hidden size-8 shrink-0 items-center justify-center self-center rounded-lg bg-ink-charcoal text-xs font-bold text-paper-offwhite group-data-[collapsible=icon]:flex" />
                }
              >
                {storeInitial(store.name)}
              </TooltipTrigger>
              <TooltipContent side="right">{store.name}</TooltipContent>
            </Tooltip>
          ) : null}
        </SidebarHeader>

        <SidebarContent className="px-2 py-3">
          <SidebarGroup className="p-0">
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
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
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        isActive={active}
                        tooltip={item.label}
                        render={<Link href={item.href} onClick={closeMobileNav} />}
                        className={cn(
                          "h-auto gap-3 rounded-xl px-3 py-2 text-chip group-data-[collapsible=icon]:mx-auto",
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
                        <span>{item.label}</span>
                        {badge ? (
                          <span className="ml-auto rounded-full bg-neutral-fill px-1.5 py-0.5 text-caption font-semibold text-zinc-600 group-data-[collapsible=icon]:hidden">
                            {badge}
                          </span>
                        ) : null}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-zinc-100 p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={settingsActive}
                tooltip="Settings"
                render={
                  <Link href={Routes.dashboard.settings.profile} onClick={closeMobileNav} />
                }
                className={cn(
                  "h-auto gap-3 rounded-xl px-3 py-2 text-chip group-data-[collapsible=icon]:mx-auto",
                  settingsActive
                    ? "bg-brand-50 font-semibold text-brand-800"
                    : "font-medium text-zinc-600 hover:bg-neutral-fill hover:text-ink-charcoal",
                )}
              >
                <Settings
                  className={cn(
                    "size-4",
                    settingsActive ? "text-electric-lime" : "text-zinc-400",
                  )}
                  strokeWidth={2}
                />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};
