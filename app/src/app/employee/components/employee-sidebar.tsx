"use client";

import { type FC, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  QrCode,
  Star,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { AccountSwitcher } from "@/components/auth/account-switcher";
import { BrandMark } from "@/components/brand/brand-mark";
import { Button } from "@/components/ui/button";
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
import { Routes } from "@/routes/routes";
import { cn } from "@/lib/utils";
import { useEmployeeCashOut } from "./employee-cash-out-provider";
import { EmployeeUserMenu } from "./employee-user-menu";

const navItems = [
  {
    href: Routes.employee.root,
    label: "Earnings & Tips",
    icon: Wallet,
    match: (path: string) => path === Routes.employee.root,
  },
  {
    href: Routes.employee.reviews,
    label: "Reviews & Badges",
    icon: Star,
    match: (path: string) => path.startsWith(Routes.employee.reviews),
  },
  {
    href: Routes.employee.qr,
    label: "My QR & Link",
    icon: QrCode,
    match: (path: string) => path.startsWith(Routes.employee.qr),
  },
] as const;

export const EmployeeSidebar: FC = () => {
  const pathname = usePathname();
  const { state, isMobile, toggleSidebar, setOpenMobile } = useSidebar();
  const collapsed = !isMobile && state === "collapsed";
  const { openCashOut } = useEmployeeCashOut();
  const [onShift, setOnShift] = useState(true);

  const closeMobileNav = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <>
      <div className="sticky top-0 z-40 flex shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 md:hidden">
        <Link
          href={Routes.employee.root}
          className="flex min-w-0 items-center gap-2.5"
        >
          <BrandMark size="sm" className="size-7 rounded-lg text-xs" />
          <div className="min-w-0">
            <div className="truncate text-sm leading-none font-bold tracking-tight text-ink-charcoal">
              delitip
            </div>
            <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
              Employee Portal
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
              href={Routes.employee.root}
              className="flex min-w-0 items-center gap-2.5"
            >
              <BrandMark
                size="sm"
                className="size-7 shrink-0 rounded-lg text-xs group-data-[collapsible=icon]:size-8"
              />
              <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                <div className="truncate text-sm leading-none font-bold tracking-tight text-ink-charcoal">
                  delitip
                </div>
                <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
                  Employee Portal
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
                <PanelLeftOpen className="size-5" />
              ) : (
                <PanelLeftClose className="size-4" />
              )}
            </Button>
          </div>

          <div className="space-y-3 group-data-[collapsible=icon]:hidden">
            <AccountSwitcher className="w-full max-w-none sm:max-w-none" />

            <button
              type="button"
              onClick={() => setOnShift((current) => !current)}
              aria-label={onShift ? "On shift" : "Off shift"}
              className={cn(
                "flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-chip font-bold transition",
                onShift
                  ? "border-brand-200 bg-brand-50 text-brand-800 hover:bg-brand-100"
                  : "border-zinc-200 bg-neutral-fill font-medium text-zinc-500 hover:bg-zinc-200",
              )}
            >
              <span
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  onShift ? "animate-pulse bg-electric-lime" : "bg-zinc-400",
                )}
              />
              <span>{onShift ? "On Shift" : "Off Shift"}</span>
            </button>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2 py-3">
          <SidebarGroup className="p-0">
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = item.match(pathname);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        isActive={active}
                        tooltip={item.label}
                        render={
                          <Link href={item.href} onClick={closeMobileNav} />
                        }
                        className={cn(
                          "h-auto gap-3 rounded-xl px-3 py-2 text-chip group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:p-2.5!",
                          active
                            ? "bg-brand-50 font-semibold text-brand-800"
                            : "font-medium text-zinc-600 hover:bg-neutral-fill hover:text-ink-charcoal",
                        )}
                      >
                        <Icon
                          className={cn(
                            "size-4 group-data-[collapsible=icon]:size-5",
                            active
                              ? "text-electric-lime"
                              : item.label === "Reviews & Badges"
                                ? "text-rating-amber"
                                : "text-zinc-400",
                          )}
                          strokeWidth={2}
                          fill={
                            item.label === "Reviews & Badges" && !active
                              ? "currentColor"
                              : "none"
                          }
                        />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <div className="mt-3 px-1 group-data-[collapsible=icon]:hidden">
            <button
              type="button"
              onClick={() => {
                closeMobileNav();
                openCashOut();
              }}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-electric-lime px-3.5 py-2.5 text-chip font-bold text-ink-charcoal shadow-sm transition hover:bg-brand-700"
            >
              <Zap className="size-3.5" strokeWidth={2} />
              Instant Cash Out
            </button>
          </div>
        </SidebarContent>

        <SidebarFooter className="border-t border-zinc-100 p-2">
          <EmployeeUserMenu onNavigate={closeMobileNav} />
        </SidebarFooter>
      </Sidebar>
    </>
  );
};
