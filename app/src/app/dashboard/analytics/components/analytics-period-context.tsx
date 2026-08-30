"use client";

import {
  createContext,
  useContext,
  useState,
  type FC,
  type ReactNode,
} from "react";
import type { DashboardPeriod } from "@/features/analytics/interfaces/analytics.interfaces";

interface AnalyticsPeriodContextValue {
  period: DashboardPeriod;
  setPeriod: (period: DashboardPeriod) => void;
}

const AnalyticsPeriodContext =
  createContext<AnalyticsPeriodContextValue | null>(null);

export const AnalyticsPeriodProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [period, setPeriod] = useState<DashboardPeriod>("7d");

  return (
    <AnalyticsPeriodContext.Provider value={{ period, setPeriod }}>
      {children}
    </AnalyticsPeriodContext.Provider>
  );
};

export const useAnalyticsPeriod = (): AnalyticsPeriodContextValue => {
  const value = useContext(AnalyticsPeriodContext);
  if (!value) {
    throw new Error(
      "useAnalyticsPeriod must be used within AnalyticsPeriodProvider",
    );
  }
  return value;
};
