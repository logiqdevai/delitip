import {
  BarChart3,
  Calculator,
  History,
  Settings2,
  ShieldCheck,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { Routes } from "@/routes/routes";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  match: (path: string) => boolean;
}

export const adminNavItems: AdminNavItem[] = [
  {
    href: Routes.dashboard.admin.analytics,
    label: "Analytics",
    icon: BarChart3,
    match: (path) => path.startsWith(Routes.dashboard.admin.analytics),
  },
  {
    href: Routes.dashboard.admin.users,
    label: "All Users",
    icon: ShieldCheck,
    match: (path) => path.startsWith(Routes.dashboard.admin.users),
  },
  {
    href: Routes.dashboard.admin.payments,
    label: "Payments & Payouts",
    icon: WalletCards,
    match: (path) =>
      path.startsWith(Routes.dashboard.admin.payments) ||
      path.startsWith("/dashboard/admin/payouts") ||
      path.startsWith(Routes.dashboard.admin.payoutRequests),
  },
  {
    href: Routes.dashboard.admin.vatSimulator,
    label: "VAT Simulator",
    icon: Calculator,
    match: (path) => path.startsWith(Routes.dashboard.admin.vatSimulator),
  },
  {
    href: Routes.dashboard.admin.appConfig,
    label: "App Config",
    icon: Settings2,
    match: (path) => path.startsWith(Routes.dashboard.admin.appConfig),
  },
  {
    href: Routes.dashboard.admin.changelog,
    label: "Changelog",
    icon: History,
    match: (path) => path.startsWith(Routes.dashboard.admin.changelog),
  },
];
