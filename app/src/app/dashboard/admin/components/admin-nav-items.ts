import {
  BarChart3,
  Calculator,
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
      path.startsWith("/dashboard/admin/payouts"),
  },
  {
    href: Routes.dashboard.admin.vatSimulator,
    label: "VAT Simulator",
    icon: Calculator,
    match: (path) => path.startsWith(Routes.dashboard.admin.vatSimulator),
  },
];
