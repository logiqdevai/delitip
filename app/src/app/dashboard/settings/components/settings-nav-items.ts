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
import { useTranslations } from "next-intl";
import { Routes } from "@/routes/routes";

export interface SettingsNavItem {
  href: string;
  labelKey: string;
  descriptionKey: string;
  icon: LucideIcon;
  requiresPlatformAdmin?: boolean;
  hidden?: boolean;
}

export const settingsNavItems: SettingsNavItem[] = [
  {
    href: Routes.dashboard.settings.profile,
    labelKey: "dashboard.settings.nav.profile.label",
    descriptionKey: "dashboard.settings.nav.profile.description",
    icon: Building2,
  },
  {
    href: Routes.dashboard.settings.stores,
    labelKey: "dashboard.settings.nav.stores.label",
    descriptionKey: "dashboard.settings.nav.stores.description",
    icon: Store,
  },
  {
    href: Routes.dashboard.settings.branding,
    labelKey: "dashboard.settings.nav.branding.label",
    descriptionKey: "dashboard.settings.nav.branding.description",
    icon: Palette,
  },
  {
    href: Routes.dashboard.settings.tipping,
    labelKey: "dashboard.settings.nav.tipping.label",
    descriptionKey: "dashboard.settings.nav.tipping.description",
    icon: Wallet,
  },
  {
    href: Routes.dashboard.settings.localization,
    labelKey: "dashboard.settings.nav.localization.label",
    descriptionKey: "dashboard.settings.nav.localization.description",
    icon: Globe,
  },
  {
    href: Routes.dashboard.settings.reviewsFeedback,
    labelKey: "dashboard.settings.nav.reviews.label",
    descriptionKey: "dashboard.settings.nav.reviews.description",
    icon: MessageSquare,
  },
  {
    href: Routes.dashboard.settings.alerts,
    labelKey: "dashboard.settings.nav.alerts.label",
    descriptionKey: "dashboard.settings.nav.alerts.description",
    icon: Bell,
    hidden: true,
  },
  {
    href: Routes.dashboard.settings.members,
    labelKey: "dashboard.settings.nav.members.label",
    descriptionKey: "dashboard.settings.nav.members.description",
    icon: Users2,
    requiresPlatformAdmin: true,
    hidden: true,
  },
  {
    href: Routes.dashboard.settings.billing,
    labelKey: "dashboard.settings.nav.billing.label",
    descriptionKey: "dashboard.settings.nav.billing.description",
    icon: CreditCard,
    hidden: true,
  },
  {
    href: Routes.dashboard.settings.taxDetails,
    labelKey: "dashboard.settings.nav.taxDetails.label",
    descriptionKey: "dashboard.settings.nav.taxDetails.description",
    icon: FileText,
    requiresPlatformAdmin: true,
  },
];

export interface TranslatedSettingsNavItem extends SettingsNavItem {
  label: string;
  description: string;
}

export const useSettingsNavItems = (): TranslatedSettingsNavItem[] => {
  const t = useTranslations();
  return settingsNavItems.map((item) => ({
    ...item,
    label: t(item.labelKey),
    description: t(item.descriptionKey),
  }));
};
