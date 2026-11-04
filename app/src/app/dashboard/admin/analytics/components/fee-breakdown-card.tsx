"use client";

import { type FC } from "react";
import { Info } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import { formatMoney, formatPercent } from "@/lib/money";
import { cn } from "@/lib/utils";

interface FeeRow {
  label: string;
  explanation: string;
  value: string;
  emphasis?: boolean;
}

interface FeeBreakdownCardProps {
  currency: Currency;
  tipsGrossRevenue: number;
  platformFee: number;
  platformFeePercentage: number;
  paymentFee: number;
  paymentFeePercentage: number;
  totalFee: number;
  totalFeePercentage: number;
  netDistributable: number;
}

const LabelWithTooltip: FC<{ label: string; explanation: string }> = ({
  label,
  explanation,
}) => (
  <span className="inline-flex items-center gap-1">
    {label}
    <Tooltip>
      <TooltipTrigger className="text-zinc-300 hover:text-zinc-500">
        <Info className="size-3" />
      </TooltipTrigger>
      <TooltipContent>{explanation}</TooltipContent>
    </Tooltip>
  </span>
);

const Row: FC<FeeRow> = ({ label, explanation, value, emphasis }) => (
  <div className="flex items-center justify-between gap-3 py-2">
    <span className="text-xs font-medium text-zinc-500">
      <LabelWithTooltip label={label} explanation={explanation} />
    </span>
    <span
      className={cn(
        "text-sm font-bold text-ink-charcoal",
        emphasis && "text-brand-700",
      )}
    >
      {value}
    </span>
  </div>
);

export const FeeBreakdownCard: FC<FeeBreakdownCardProps> = ({
  currency,
  tipsGrossRevenue,
  platformFee,
  platformFeePercentage,
  paymentFee,
  paymentFeePercentage,
  totalFee,
  totalFeePercentage,
  netDistributable,
}) => {
  const t = useTranslations("dashboard.adminSystem.analytics.feeBreakdown");
  const locale = useLocale();
  const money = (value: number) => formatMoney(value, currency, locale);
  const percent = (value: number) => formatPercent(value, locale);

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white px-4 py-5 shadow-xs">
      <h2 className="text-sm font-bold text-ink-charcoal">{t("title")}</h2>
      <p className="mt-0.5 text-xs text-zinc-500">{t("description")}</p>

      <div className="mt-3 grid grid-cols-1 gap-x-8 divide-y divide-zinc-100 sm:grid-cols-2 sm:divide-y-0">
        <div className="divide-y divide-zinc-100 sm:pr-4">
          <Row
            label={t("rows.totalTip.label")}
            explanation={t("rows.totalTip.explanation")}
            value={money(tipsGrossRevenue)}
          />
          <Row
            label={t("rows.platformFee.label")}
            explanation={t("rows.platformFee.explanation")}
            value={money(platformFee)}
          />
          <Row
            label={t("rows.platformFeePercent.label")}
            explanation={t("rows.platformFeePercent.explanation")}
            value={percent(platformFeePercentage)}
          />
          <Row
            label={t("rows.paymentFee.label")}
            explanation={t("rows.paymentFee.explanation")}
            value={money(paymentFee)}
          />
        </div>
        <div className="divide-y divide-zinc-100 sm:pl-4">
          <Row
            label={t("rows.paymentFeePercent.label")}
            explanation={t("rows.paymentFeePercent.explanation")}
            value={percent(paymentFeePercentage)}
          />
          <Row
            label={t("rows.totalFee.label")}
            explanation={t("rows.totalFee.explanation")}
            value={money(totalFee)}
          />
          <Row
            label={t("rows.totalFeePercent.label")}
            explanation={t("rows.totalFeePercent.explanation")}
            value={percent(totalFeePercentage)}
          />
          <Row
            label={t("rows.storeAmountNet.label")}
            explanation={t("rows.storeAmountNet.explanation")}
            value={money(netDistributable)}
            emphasis
          />
        </div>
      </div>
    </div>
  );
};
