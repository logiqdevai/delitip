"use client";

import { type FC } from "react";
import { Landmark, Pencil, Star, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DistributionPayoutModes,
  type DistributionRule,
} from "@/features/distribution/interfaces/distribution.interfaces";
import { DistributionPayoutModeShortOptions } from "@/config/constants/dropdowns/distribution/distribution-payout-mode-form.options";
import { useDropdownLabel } from "@/hooks/use-dropdown-options";
import { formatRecipientSummary } from "@/features/distribution/utils/distribution-summary.utils";
import { cn } from "@/lib/utils";

interface DistributionRuleCardProps {
  rule: DistributionRule;
  isDefault: boolean;
  onEdit: (rule: DistributionRule) => void;
  onSetDefault: (rule: DistributionRule) => void;
  onDelete: (rule: DistributionRule) => void;
  isSettingDefault?: boolean;
}

export const DistributionRuleCard: FC<DistributionRuleCardProps> = ({
  rule,
  isDefault,
  onEdit,
  onSetDefault,
  onDelete,
  isSettingDefault = false,
}) => {
  const t = useTranslations("dashboard.team.distribution.card");
  const tSummary = useTranslations("dashboard.team.distribution.summary");
  const dropdownLabel = useDropdownLabel();
  return (
    <div
      className={cn(
        "space-y-3 rounded-2xl border bg-white px-4 py-5 shadow-xs",
        isDefault ? "border-brand-200 ring-1 ring-brand-100" : "border-zinc-200/80",
      )}
    >
      <div className="min-w-0">
        <h3 className="truncate text-sm font-bold text-ink-charcoal">
          {rule.name}
        </h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 empty:hidden">
          {isDefault ? (
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">
              {t("storeDefault")}
            </span>
          ) : null}
          {rule.payout_mode === DistributionPayoutModes.VIA_STORE ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-caption font-bold text-amber-800">
              <Landmark className="size-3" strokeWidth={2.5} />
              {dropdownLabel(DistributionPayoutModeShortOptions, rule.payout_mode)}
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-base leading-relaxed text-zinc-500">
          {formatRecipientSummary(rule.recipients, tSummary)}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1 sm:flex-none"
          onClick={() => onEdit(rule)}
        >
          <Pencil data-icon="inline-start" className="size-3.5" />
          {t("edit")}
        </Button>
        {!isDefault ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="max-sm:order-last max-sm:w-full sm:flex-none"
            disabled={isSettingDefault}
            onClick={() => onSetDefault(rule)}
          >
            <Star data-icon="inline-start" className="size-3.5" />
            {t("setDefault")}
          </Button>
        ) : null}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={t("delete")}
          title={t("delete")}
          className="ml-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onDelete(rule)}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
};
