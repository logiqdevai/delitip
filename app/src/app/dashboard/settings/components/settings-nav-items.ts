import {
  Bell,
  Building2,
  CreditCard,
  FileText,
  Globe,
  MessageSquare,
  Palette,
  Store,
  Users2,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Routes } from "@/routes/routes";

export interface SettingsNavItem {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  requiresPlatformAdmin?: boolean;
  hidden?: boolean;
}

export const settingsNavItems: SettingsNavItem[] = [
  {
    href: Routes.dashboard.settings.profile,
    label: "Business Profile",
    description: "Core details customers and your team see across delitip.",
    icon: Building2,
  },
  {
    href: Routes.dashboard.settings.stores,
    label: "Stores",
    description: "All the venues in your business.",
    icon: Store,
  },
  {
    href: Routes.dashboard.settings.branding,
    label: "Branding",
    description: "What customers see on your public tip page.",
    icon: Palette,
  },
  {
    href: Routes.dashboard.settings.tipping,
    label: "Tipping",
    description:
      "Presets shown on the tip flow, and whether guests can enter a custom amount.",
    icon: Wallet,
  },
  {
    href: Routes.dashboard.settings.localization,
    label: "Localization",
    description:
      "The primary language is what you type your branding text in.",
    icon: Globe,
  },
  {
    href: Routes.dashboard.settings.reviewsFeedback,
    label: "Reviews",
    description:
      "What customers see on the review step after tipping, and where high ratings are sent.",
    icon: MessageSquare,
  },
  {
    href: Routes.dashboard.settings.alerts,
    label: "Alert Preferences",
    description:
      "Choose which automatic alerts your team receives in the Alerts inbox.",
    icon: Bell,
    hidden: true,
  },
  {
    href: Routes.dashboard.settings.members,
    label: "Members & Access",
    description: "Invite teammates and manage their role-based access.",
    icon: Users2,
    requiresPlatformAdmin: true,
    hidden: true,
  },
  {
    href: Routes.dashboard.settings.billing,
    label: "Billing",
    description: "Manage your subscription plan.",
    icon: CreditCard,
    hidden: true,
  },
  {
    href: Routes.dashboard.settings.taxDetails,
    label: "Tax Details",
    description: "Billing identity and address used to issue invoices.",
    icon: FileText,
    requiresPlatformAdmin: true,
  },
];
