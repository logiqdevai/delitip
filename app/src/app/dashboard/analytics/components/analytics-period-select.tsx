"use client";

import { type FC } from "react";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DashboardPeriod } from "@/features/analytics/interfaces/analytics.interfaces";

const PERIOD_IDS: DashboardPeriod[] = ["today", "7d", "30d"];

export const AnalyticsPeriodSelect: FC<{
  value: DashboardPeriod;
  onChange: (value: DashboardPeriod) => void;
}> = ({ value, onChange }) => {
  const t = useTranslations("dashboard.analytics.period");
  const periodOptions = PERIOD_IDS.map((id) => ({ id, label: t(id) }));

  return (
  <Select
    items={periodOptions.map((option) => ({
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
        {periodOptions.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {option.label}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
  );
};
