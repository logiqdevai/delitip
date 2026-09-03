"use client";

import { type FC, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RequestRefundDialog } from "@/app/dashboard/tips/[tipId]/components/request-refund-dialog";
import { TipDetailSkeleton } from "@/app/dashboard/tips/[tipId]/components/tip-detail-skeleton";
import { getRefundStatusLabel } from "@/config/constants/dropdowns/refunds/refund-status-form.options";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { useTip } from "@/features/tips/hooks/use-tips";
import { getTipStatusLabel } from "@/config/constants/dropdowns/tips/tip-status-form.options";
import { getPayoutStatusLabel } from "@/config/constants/dropdowns/tips/payout-status-form.options";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import { Routes } from "@/routes/routes";

const formatDateTime = (value?: string | null) => {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const SummaryRow: FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex items-center justify-between border-b border-zinc-100 py-2.5 text-sm last:border-0">
    <span className="text-zinc-500">{label}</span>
    <span className="font-semibold text-ink-charcoal">{value}</span>
  </div>
);

export const TipDetailPageContent: FC<{ tipId: string }> = ({ tipId }) => {
  const tipQuery = useTip(tipId);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);

  if (tipQuery.isPending) {
    return <TipDetailSkeleton />;
  }

  if (tipQuery.isError || !tipQuery.data) {
    return (
      <Empty className="border border-dashed border-zinc-200 bg-white py-16">
        <EmptyHeader>
          <EmptyTitle>Could not load this tip</EmptyTitle>
          <EmptyDescription>
            {tipQuery.error?.message ?? "The tip may not exist."}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link
            href={Routes.dashboard.tips}
            className="text-xs font-semibold text-brand-700 hover:underline"
          >
            Back to Tips
          </Link>
        </EmptyContent>
      </Empty>
    );
  }

  const tip = tipQuery.data;
  const hasActiveRefund = (tip.refunds ?? []).some(
    (refund) => refund.status === "PENDING" || refund.status === "APPROVED",
  );
  const canRequestRefund = tip.status === "COMPLETED" && !hasActiveRefund;

  return (
    <div className="space-y-6">
      <Link
        href={Routes.dashboard.tips}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-ink-charcoal"
      >
        <ArrowLeft className="size-3.5" strokeWidth={2} />
        Back to Tips
      </Link>

      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink-charcoal">
            {formatMoney(tip.amount, tip.currency)}
          </h1>
          <p className="mt-0.5 text-xs text-zinc-500">
            {tip.employee?.full_name ?? "Store"} · {tip.qr_code?.label ?? "—"}
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-caption font-bold",
            tip.status === "COMPLETED"
              ? "bg-brand-50 text-brand-700"
              : tip.status === "FAILED"
                ? "bg-red-50 text-red-700"
                : tip.status === "REFUNDED" || tip.status === "CANCELLED"
                  ? "bg-zinc-100 text-zinc-600"
                  : "bg-amber-50 text-amber-700",
          )}
        >
          {getTipStatusLabel(tip.status)}
        </span>
      </div>

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
        <h2 className="mb-2 text-sm font-bold text-ink-charcoal">Summary</h2>
        <SummaryRow
          label="Amount"
          value={formatMoney(tip.amount, tip.currency)}
        />
        <SummaryRow label="Status" value={getTipStatusLabel(tip.status)} />
        <SummaryRow label="Paid at" value={formatDateTime(tip.paid_at)} />
        <SummaryRow label="Created at" value={formatDateTime(tip.created_at)} />
        <SummaryRow
          label="QR code"
          value={tip.qr_code?.label ?? "—"}
        />
        <SummaryRow
          label="Distribution rule"
          value={tip.distribution_rule?.name ?? "Store default"}
        />
        <SummaryRow
          label="Payment provider"
          value={tip.payment_provider ?? "—"}
        />
        <SummaryRow
          label="Payment reference"
          value={tip.payment_reference ?? "—"}
        />
        <SummaryRow
          label="Customer"
          value={tip.customer_name ?? tip.customer_email ?? "—"}
        />
      </div>

      {tip.payment_transaction ? (
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
          <h2 className="mb-2 text-sm font-bold text-ink-charcoal">
            Financial breakdown
          </h2>
          <SummaryRow
            label="Tip amount"
            value={formatMoney(tip.payment_transaction.tip_amount, tip.currency)}
          />
          {tip.payment_transaction.vat_amount ? (
            <SummaryRow
              label="VAT"
              value={`${formatMoney(tip.payment_transaction.vat_amount, tip.currency)} (${tip.payment_transaction.vat_rate_percentage}%)`}
            />
          ) : null}
          <SummaryRow
            label="Gross amount (charged)"
            value={formatMoney(tip.payment_transaction.gross_amount, tip.currency)}
          />
          <SummaryRow
            label="Processor fee"
            value={
              tip.payment_transaction.processor_fee_confirmed
                ? formatMoney(
                    tip.payment_transaction.processor_fee_confirmed_amount ?? 0,
                    tip.currency,
                  )
                : tip.payment_transaction.processor_fee_estimated != null
                  ? `~${formatMoney(tip.payment_transaction.processor_fee_estimated, tip.currency)} (estimated)`
                  : "Not yet confirmed"
            }
          />
          <SummaryRow
            label="Platform commission"
            value={`${formatMoney(tip.payment_transaction.commission_amount, tip.currency)} (${tip.payment_transaction.commission_percentage_used}%)`}
          />
          <SummaryRow
            label="Net distributable"
            value={
              tip.payment_transaction.net_distributable_amount != null
                ? formatMoney(tip.payment_transaction.net_distributable_amount, tip.currency)
                : "—"
            }
          />
        </div>
      ) : null}

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
        <h2 className="mb-3 text-sm font-bold text-ink-charcoal">
          Distribution
        </h2>
        {!tip.distributions || tip.distributions.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 py-6 text-center text-xs text-zinc-500">
            No distribution recorded for this tip.
          </p>
        ) : (
          <div className="divide-y divide-zinc-100">
            {tip.distributions.map((distribution) => (
              <div
                key={distribution.id}
                className="flex items-center justify-between gap-3 py-3 text-sm"
              >
                <div>
                  <div className="font-semibold text-ink-charcoal">
                    {distribution.recipient_type === "EMPLOYEE"
                      ? (distribution.employee?.full_name ?? "Employee")
                      : "Store"}
                  </div>
                  <div className="text-xs text-zinc-400">
                    {distribution.percentage}% ·{" "}
                    {getPayoutStatusLabel(distribution.payout_status)}
                  </div>
                </div>
                <div className="font-bold text-ink-charcoal">
                  {formatMoney(distribution.amount, tip.currency)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {tip.review ? (
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
          <h2 className="mb-2 text-sm font-bold text-ink-charcoal">Review</h2>
          <p className="text-sm text-zinc-600">
            ★ {tip.review.rating} — {tip.review.comment || "No comment left"}
          </p>
        </div>
      ) : null}

      {(tip.refunds && tip.refunds.length > 0) || canRequestRefund ? (
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-sm font-bold text-ink-charcoal">
              <Receipt className="size-4" strokeWidth={2} />
              Refunds
            </h2>
            {canRequestRefund ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRefundDialogOpen(true)}
              >
                Request refund
              </Button>
            ) : null}
          </div>
          {tip.refunds && tip.refunds.length > 0 ? (
            <div className="divide-y divide-zinc-100">
              {tip.refunds.map((refund) => (
                <div
                  key={refund.id}
                  className="flex items-center justify-between py-2 text-sm"
                >
                  <span className="text-zinc-500">
                    {refund.reason || "No reason given"}
                  </span>
                  <span className="font-semibold text-ink-charcoal">
                    {formatMoney(refund.amount, tip.currency)} (
                    {getRefundStatusLabel(refund.status)})
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <RequestRefundDialog
        open={refundDialogOpen}
        onOpenChange={setRefundDialogOpen}
        tipId={tip.id}
        tipAmount={tip.amount}
        currency={tip.currency}
      />
    </div>
  );
};
