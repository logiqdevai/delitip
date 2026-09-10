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
  label: string;
  description: string;
  icon: LucideIcon;
  requiresMultipleStores?: boolean;
}

export const analyticsNavItems: AnalyticsNavItem[] = [
  {
    href: Routes.dashboard.analytics.overview,
    label: "Overview",
    description:
      "Tip totals, volume, and experience score for the selected period.",
    icon: BarChart3,
  },
  {
    href: Routes.dashboard.analytics.tips,
    label: "Tips",
    description: "Break down tip volume by day, week, month, employee, or store.",
    icon: HandCoins,
  },
  {
    href: Routes.dashboard.analytics.employees,
    label: "Employees",
    description: "Informational performance stats for your team - not a ranking.",
    icon: Users,
  },
  {
    href: Routes.dashboard.analytics.stores,
    label: "Stores",
    description: "Compare tip performance across locations in your business.",
    icon: Store,
    requiresMultipleStores: true,
  },
  {
    href: Routes.dashboard.analytics.insights,
    label: "Insights",
    description:
      "Rule-based summaries of recent feedback computed from your data.",
    icon: Lightbulb,
  },
];
