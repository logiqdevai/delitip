"use client";

import { type FC } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  <Select
    items={PERIOD_OPTIONS.map((option) => ({
      label: option.label,
      value: option.id,
    }))}
    value={value}
    onValueChange={(next) => {
      if (next) onChange(next as DashboardPeriod);
    }}
  >
    <SelectTrigger size="sm" className="w-full sm:w-fit">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        {PERIOD_OPTIONS.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {option.label}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);
