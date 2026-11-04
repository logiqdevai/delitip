"use client";

import { type FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  PanelLeftClose,
  PanelLeftOpen,
  QrCode,
  Star,
  Wallet,
  X,
} from "lucide-react";
import { AccountSwitcher } from "@/components/auth/account-switcher";
import { BrandMark } from "@/components/brand/brand-mark";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
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
import { EmployeeUserMenu } from "./employee-user-menu";

const navItems = [
  {
    href: Routes.employee.root,
    labelKey: "earningsAndTips",
    icon: Wallet,
    match: (path: string) => path === Routes.employee.root,
  },
  {
    href: Routes.employee.reviews,
    labelKey: "reviewsAndBadges",
    icon: Star,
    match: (path: string) => path.startsWith(Routes.employee.reviews),
  },
  {
    href: Routes.employee.qr,
    labelKey: "qrAndLink",
    icon: QrCode,
    match: (path: string) => path.startsWith(Routes.employee.qr),
  },
] as const;

export const EmployeeSidebar: FC = () => {
  const pathname = usePathname();
  const t = useTranslations("employee");
  const { state, isMobile, toggleSidebar, setOpenMobile } = useSidebar();
  const collapsed = !isMobile && state === "collapsed";

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
              {t("shell.portalName")}
            </span>
          </div>
        </Link>
        <LanguageSwitcher tone="light" />
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
                  {t("shell.portalName")}
                </span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleSidebar}
              aria-label={
                isMobile
                  ? t("nav.closeMenu")
                  : collapsed
                    ? t("nav.expandSidebar")
                    : t("nav.collapseSidebar")
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

          <div className="group-data-[collapsible=icon]:hidden">
            <AccountSwitcher
              size="default"
              className="w-full max-w-none sm:max-w-none"
            />
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
                        tooltip={t(`nav.${item.labelKey}`)}
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
                              : item.href === Routes.employee.reviews
                                ? "text-rating-amber"
                                : "text-zinc-400",
                          )}
                          strokeWidth={2}
                          fill={
                            item.href === Routes.employee.reviews && !active
                              ? "currentColor"
                              : "none"
                          }
                        />
                        <span>{t(`nav.${item.labelKey}`)}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-zinc-100 p-2">
          <div className="px-1 pb-1 group-data-[collapsible=icon]:hidden">
            <LanguageSwitcher tone="light" />
          </div>
          <EmployeeUserMenu onNavigate={closeMobileNav} />
        </SidebarFooter>
      </Sidebar>
    </>
  );
};
