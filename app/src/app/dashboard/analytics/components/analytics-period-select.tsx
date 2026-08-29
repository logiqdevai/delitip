"use client";

import { type FC } from "react";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import type { DashboardPeriod } from "@/features/analytics/interfaces/analytics.interfaces";

const PERIOD_OPTIONS: { id: DashboardPeriod; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
];

export const AnalyticsPeriodSelect: FC<{
  value: DashboardPeriod;
  onChange: (value: DashboardPeriod) => void;
}> = ({ value, onChange }) => (
  <NativeSelect
    value={value}
    onChange={(event) => onChange(event.target.value as DashboardPeriod)}
    size="sm"
  >
    {PERIOD_OPTIONS.map((option) => (
      <NativeSelectOption key={option.id} value={option.id}>
        {option.label}
      </NativeSelectOption>
    ))}
  </NativeSelect>
);
