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
import type { TrendsPeriod } from "@/features/analytics/interfaces/analytics.interfaces";

const PERIOD_OPTIONS: { id: TrendsPeriod; label: string }[] = [
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "90d", label: "Last 90 days" },
];

export const TrendPeriodSelect: FC<{
  value: TrendsPeriod;
  onChange: (value: TrendsPeriod) => void;
}> = ({ value, onChange }) => (
  <Select
    items={PERIOD_OPTIONS.map((option) => ({
      label: option.label,
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
            {option.label}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);
