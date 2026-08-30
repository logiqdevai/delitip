"use client";

import { type FC } from "react";
import { SectionSidebar } from "@/components/layout/section-sidebar";
import { settingsNavItems } from "./settings-nav-items";

export const SettingsSidebar: FC = () => {
  return <SectionSidebar items={settingsNavItems} />;
};
