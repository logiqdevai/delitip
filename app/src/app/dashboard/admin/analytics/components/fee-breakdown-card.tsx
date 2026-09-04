"use client";

import { type FC } from "react";
import { Info } from "lucide-react";
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

const percent = formatPercent;

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
  const money = (value: number) => formatMoney(value, currency);

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
      <h2 className="text-sm font-bold text-ink-charcoal">Fee breakdown</h2>
      <p className="mt-0.5 text-xs text-zinc-500">
        How each completed tip splits between the platform, the payment
        processor, and what stores actually get to distribute.
      </p>

      <div className="mt-3 grid grid-cols-1 gap-x-8 divide-y divide-zinc-100 sm:grid-cols-2 sm:divide-y-0">
        <div className="divide-y divide-zinc-100 sm:pr-4">
          <Row
            label="Total tip"
            explanation="The full amount customers paid across completed tips in this range, before any fees are deducted."
            value={money(tipsGrossRevenue)}
          />
          <Row
            label="Platform fee"
            explanation="delitip's commission, taken as a percentage of each tip at checkout."
            value={money(platformFee)}
          />
          <Row
            label="Platform fee %"
            explanation="Platform fee as a share of total tip revenue in this range (weighted by tip size, not averaged per tip)."
            value={percent(platformFeePercentage)}
          />
          <Row
            label="Payment fee"
            explanation="The card/payment processor's transaction fee, estimated at checkout and reconciled once the processor confirms it."
            value={money(paymentFee)}
          />
        </div>
        <div className="divide-y divide-zinc-100 sm:pl-4">
          <Row
            label="Payment fee %"
            explanation="Payment processor fee as a share of total tip revenue in this range (weighted by tip size, not averaged per tip)."
            value={percent(paymentFeePercentage)}
          />
          <Row
            label="Total fee"
            explanation="Platform fee + payment fee combined — everything taken out of tips before stores and employees get paid."
            value={money(totalFee)}
          />
          <Row
            label="Total fee %"
            explanation="Combined fee as a share of total tip revenue in this range (weighted by tip size, not averaged per tip)."
            value={percent(totalFeePercentage)}
          />
          <Row
            label="Store amount net"
            explanation="What's left after platform and payment fees are deducted — the pool each store then splits with its employees per its distribution rule."
            value={money(netDistributable)}
            emphasis
          />
        </div>
      </div>
    </div>
  );
};
