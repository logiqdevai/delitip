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
import type { TrendsPeriod } from "@/features/analytics/interfaces/analytics.interfaces";

const PERIOD_OPTIONS: { id: TrendsPeriod; labelKey: string }[] = [
  { id: "7d", labelKey: "last7Days" },
  { id: "30d", labelKey: "last30Days" },
  { id: "90d", labelKey: "last90Days" },
];

export const TrendPeriodSelect: FC<{
  value: TrendsPeriod;
  onChange: (value: TrendsPeriod) => void;
}> = ({ value, onChange }) => {
  const t = useTranslations("dashboard.adminSystem.analytics.periods");
  return (
  <Select
    items={PERIOD_OPTIONS.map((option) => ({
      label: t(option.labelKey),
      value: option.id,
    }))}
    value={value}
    onValueChange={(next) => {
      if (next) onChange(next as TrendsPeriod);
    }}
  >
    <SelectTrigger className="min-w-36 rounded-xl border-zinc-200 bg-white px-3.5 font-medium text-ink-charcoal shadow-xs">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        {PERIOD_OPTIONS.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {t(option.labelKey)}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
  );
};
