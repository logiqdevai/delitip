"use client";

import { type FC } from "react";
import { usePathname } from "next/navigation";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { settingsNavItems } from "./settings-nav-items";

export const SettingsPageHeader: FC = () => {
  const pathname = usePathname();
  const activeItem = settingsNavItems.find((item) => item.href === pathname);

  return (
    <DashboardPageHeader
      title={activeItem?.label ?? "Settings"}
      description={
        activeItem?.description ??
        "Manage business profile, bank account connections, and preferences."
      }
    />
  );
};
