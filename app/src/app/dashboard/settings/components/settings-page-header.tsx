"use client";

import { type FC } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { useSettingsNavItems } from "./settings-nav-items";

export const SettingsPageHeader: FC = () => {
  const pathname = usePathname();
  const t = useTranslations("dashboard.settings.nav");
  const settingsNavItems = useSettingsNavItems();
  const activeItem = settingsNavItems.find((item) => item.href === pathname);

  return (
    <DashboardPageHeader
      title={activeItem?.label ?? t("defaultTitle")}
      description={
        activeItem?.description ?? t("defaultDescription")
      }
    />
  );
};
