"use client";

import { type FC } from "react";
import { Pencil, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DistributionRule } from "@/features/distribution/interfaces/distribution.interfaces";
import { formatRecipientSummary } from "@/features/distribution/utils/distribution-summary.utils";
import { cn } from "@/lib/utils";

interface DistributionRuleCardProps {
  rule: DistributionRule;
  isDefault: boolean;
  onEdit: (rule: DistributionRule) => void;
  onSetDefault: (rule: DistributionRule) => void;
  isSettingDefault?: boolean;
}

export const DistributionRuleCard: FC<DistributionRuleCardProps> = ({
  rule,
  isDefault,
  onEdit,
  onSetDefault,
  isSettingDefault = false,
}) => {
  return (
    <div
      className={cn(
        "space-y-3 rounded-2xl border bg-white p-5 shadow-xs",
        isDefault ? "border-brand-200 ring-1 ring-brand-100" : "border-zinc-200/80",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-ink-charcoal">
            {rule.name}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-zinc-500">
            {formatRecipientSummary(rule.recipients)}
          </p>
        </div>
        {isDefault ? (
          <span className="shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-caption font-bold text-brand-700">
            Store default
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onEdit(rule)}
        >
          <Pencil data-icon="inline-start" className="size-3.5" />
          Edit
        </Button>
        {!isDefault ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isSettingDefault}
            onClick={() => onSetDefault(rule)}
          >
            <Star data-icon="inline-start" className="size-3.5" />
            Set as default
          </Button>
        ) : null}
      </div>
    </div>
  );
};
