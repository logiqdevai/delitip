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
import type { AdminOverviewPeriod } from "@/features/analytics/interfaces/analytics.interfaces";

const PERIOD_OPTIONS: { id: AdminOverviewPeriod; labelKey: string }[] = [
  { id: "today", labelKey: "today" },
  { id: "7d", labelKey: "last7Days" },
  { id: "30d", labelKey: "last30Days" },
  { id: "90d", labelKey: "last90Days" },
];

export const AdminAnalyticsPeriodSelect: FC<{
  value: AdminOverviewPeriod;
  onChange: (value: AdminOverviewPeriod) => void;
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
      if (next) onChange(next as AdminOverviewPeriod);
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
