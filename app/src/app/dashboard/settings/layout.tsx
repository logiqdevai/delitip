import { type FC, type ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SettingsPageHeader } from "./components/settings-page-header";
import { SettingsSidebar } from "./components/settings-sidebar";

interface SettingsLayoutProps {
  children: ReactNode;
}

const SettingsLayout: FC<SettingsLayoutProps> = ({ children }) => {
  return (
    <div className="space-y-6">
      <SettingsPageHeader />
      <SidebarProvider className="min-h-0 w-full flex-col gap-4 md:flex-row md:items-start md:gap-6">
        <SettingsSidebar />
        <div className="min-w-0 flex-1 space-y-6">{children}</div>
      </SidebarProvider>
    </div>
  );
};

export default SettingsLayout;
