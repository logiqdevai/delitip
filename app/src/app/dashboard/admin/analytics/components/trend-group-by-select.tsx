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
import type { TrendsGroupBy } from "@/features/analytics/interfaces/analytics.interfaces";

const GROUP_BY_OPTIONS: { id: TrendsGroupBy }[] = [
  { id: "day" },
  { id: "week" },
  { id: "month" },
];

export const TrendGroupBySelect: FC<{
  value: TrendsGroupBy;
  onChange: (value: TrendsGroupBy) => void;
}> = ({ value, onChange }) => {
  const t = useTranslations("dashboard.adminSystem.analytics.groupBy");
  return (
  <Select
    items={GROUP_BY_OPTIONS.map((option) => ({
      label: t(option.id),
      value: option.id,
    }))}
    value={value}
    onValueChange={(next) => {
      if (next) onChange(next as TrendsGroupBy);
    }}
  >
    <SelectTrigger className="min-w-28 rounded-xl border-zinc-200 bg-white px-3.5 font-medium text-ink-charcoal shadow-xs">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        {GROUP_BY_OPTIONS.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {t(option.id)}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
  );
};
