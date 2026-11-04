"use client";

import { type FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { QrCode, Star, UserRound, Wallet } from "lucide-react";
import { Routes } from "@/routes/routes";
import { cn } from "@/lib/utils";

const tabs = [
  {
    href: Routes.employee.root,
    labelKey: "earnings",
    icon: Wallet,
    match: (path: string) => path === Routes.employee.root,
  },
  {
    href: Routes.employee.reviews,
    labelKey: "reviews",
    icon: Star,
    match: (path: string) => path.startsWith(Routes.employee.reviews),
  },
  {
    href: Routes.employee.qr,
    labelKey: "qr",
    icon: QrCode,
    match: (path: string) => path.startsWith(Routes.employee.qr),
  },
  {
    href: Routes.employee.profile,
    labelKey: "profile",
    icon: UserRound,
    match: (path: string) => path.startsWith(Routes.employee.profile),
  },
] as const;

export const EmployeeBottomNav: FC = () => {
  const pathname = usePathname();
  const t = useTranslations("employee");

  return (
    <nav
      aria-label={t("shell.navAria")}
      className="z-40 shrink-0 border-t border-zinc-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid grid-cols-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.match(pathname);

          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 px-2 py-2.5 text-[11px] transition-colors",
                  active
                    ? "font-semibold text-brand-800"
                    : "font-medium text-zinc-500",
                )}
              >
                <Icon
                  className={cn("size-5", active && "text-brand-700")}
                  strokeWidth={active ? 2.5 : 2}
                />
                {t(`nav.${tab.labelKey}`)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
