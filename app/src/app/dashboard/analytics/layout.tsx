"use client";

import { type FC, type ReactNode } from "react";
import { AnalyticsPageHeader } from "./components/analytics-page-header";
import { AnalyticsPeriodProvider } from "./components/analytics-period-context";
import { AnalyticsSidebar } from "./components/analytics-sidebar";
import { AnalyticsWorkspaceGate } from "./components/analytics-workspace-gate";

interface AnalyticsLayoutProps {
  children: ReactNode;
}

const AnalyticsLayout: FC<AnalyticsLayoutProps> = ({ children }) => {
  return (
    <AnalyticsPeriodProvider>
      <div className="flex flex-col gap-6">
        <AnalyticsPageHeader />
        <div className="flex w-full min-h-0 flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
          <AnalyticsSidebar />
          <div className="min-w-0 flex-1">
            <AnalyticsWorkspaceGate>{children}</AnalyticsWorkspaceGate>
          </div>
        </div>
      </div>
    </AnalyticsPeriodProvider>
  );
};

export default AnalyticsLayout;
