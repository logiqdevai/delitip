import { type FC, type ReactNode } from "react";
import { SettingsPageHeader } from "./components/settings-page-header";
import { SettingsSidebar } from "./components/settings-sidebar";

interface SettingsLayoutProps {
  children: ReactNode;
}

const SettingsLayout: FC<SettingsLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col gap-6">
      <SettingsPageHeader />
      <div className="flex w-full min-h-0 flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
        <SettingsSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
};

export default SettingsLayout;
