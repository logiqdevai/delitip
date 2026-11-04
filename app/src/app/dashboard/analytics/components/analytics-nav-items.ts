import {
  BarChart3,
  HandCoins,
  Lightbulb,
  Store,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Routes } from "@/routes/routes";

export interface AnalyticsNavItem {
  href: string;
  key: "overview" | "tips" | "employees" | "stores" | "insights";
  icon: LucideIcon;
  requiresMultipleStores?: boolean;
}

export const analyticsNavItems: AnalyticsNavItem[] = [
  {
    href: Routes.dashboard.analytics.overview,
    key: "overview",
    icon: BarChart3,
  },
  {
    href: Routes.dashboard.analytics.tips,
    key: "tips",
    icon: HandCoins,
  },
  {
    href: Routes.dashboard.analytics.employees,
    key: "employees",
    icon: Users,
  },
  {
    href: Routes.dashboard.analytics.stores,
    key: "stores",
    icon: Store,
    requiresMultipleStores: true,
  },
  {
    href: Routes.dashboard.analytics.insights,
    key: "insights",
    icon: Lightbulb,
  },
];
