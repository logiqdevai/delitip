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
import type { TrendsGroupBy } from "@/features/analytics/interfaces/analytics.interfaces";

const GROUP_BY_OPTIONS: { id: TrendsGroupBy; label: string }[] = [
  { id: "day", label: "By day" },
  { id: "week", label: "By week" },
  { id: "month", label: "By month" },
];

export const TrendGroupBySelect: FC<{
  value: TrendsGroupBy;
  onChange: (value: TrendsGroupBy) => void;
}> = ({ value, onChange }) => (
  <Select
    items={GROUP_BY_OPTIONS.map((option) => ({
      label: option.label,
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
            {option.label}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);
