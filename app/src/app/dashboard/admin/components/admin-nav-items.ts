import {
  BarChart3,
  Calculator,
  History,
  Settings2,
  ShieldCheck,
  WalletCards,
  Webhook,
  type LucideIcon,
} from "lucide-react";
import { Routes } from "@/routes/routes";

export interface AdminNavItem {
  href: string;
  /** Message key under `dashboard.adminSystem.shell.nav`. */
  labelKey: string;
  icon: LucideIcon;
  match: (path: string) => boolean;
}

export const adminNavItems: AdminNavItem[] = [
  {
    href: Routes.dashboard.admin.analytics,
    labelKey: "dashboard.adminSystem.shell.nav.analytics",
    icon: BarChart3,
    match: (path) => path.startsWith(Routes.dashboard.admin.analytics),
  },
  {
    href: Routes.dashboard.admin.users,
    labelKey: "dashboard.adminSystem.shell.nav.allUsers",
    icon: ShieldCheck,
    match: (path) => path.startsWith(Routes.dashboard.admin.users),
  },
  {
    href: Routes.dashboard.admin.payments,
    labelKey: "dashboard.adminSystem.shell.nav.paymentsPayouts",
    icon: WalletCards,
    match: (path) =>
      path.startsWith(Routes.dashboard.admin.payments) ||
      path.startsWith("/dashboard/admin/payouts") ||
      path.startsWith(Routes.dashboard.admin.payoutRequests),
  },
  {
    href: Routes.dashboard.admin.webhookEvents,
    labelKey: "dashboard.adminSystem.shell.nav.webhookEvents",
    icon: Webhook,
    match: (path) => path.startsWith(Routes.dashboard.admin.webhookEvents),
  },
  {
    href: Routes.dashboard.admin.vatSimulator,
    labelKey: "dashboard.adminSystem.shell.nav.vatSimulator",
    icon: Calculator,
    match: (path) => path.startsWith(Routes.dashboard.admin.vatSimulator),
  },
  {
    href: Routes.dashboard.admin.appConfig,
    labelKey: "dashboard.adminSystem.shell.nav.appConfig",
    icon: Settings2,
    match: (path) => path.startsWith(Routes.dashboard.admin.appConfig),
  },
  {
    href: Routes.dashboard.admin.changelog,
    labelKey: "dashboard.adminSystem.shell.nav.changelog",
    icon: History,
    match: (path) => path.startsWith(Routes.dashboard.admin.changelog),
  },
];
