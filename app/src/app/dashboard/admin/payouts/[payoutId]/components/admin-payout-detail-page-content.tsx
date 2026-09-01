"use client";

import { type FC } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DetailSkeleton } from "@/components/ui/detail-skeleton";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { getDistributionRecipientTypeLabel } from "@/config/constants/dropdowns/distribution/distribution-recipient-type-form.options";
import { getPayoutAccountStatusLabel } from "@/config/constants/dropdowns/payments/payout-account-status-form.options";
import { getPayoutExecutionStatusLabel } from "@/config/constants/dropdowns/payments/payout-execution-status-form.options";
import { getPayoutStatusLabel } from "@/config/constants/dropdowns/tips/payout-status-form.options";
import { useAdminPayout } from "@/features/payouts/hooks/use-payouts";
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

export const AdminPayoutDetailPageContent: FC<{ payoutId: string }> = ({
  payoutId,
}) => {
  const payoutQuery = useAdminPayout(payoutId);

  if (payoutQuery.isPending) {
    return <DetailSkeleton fieldCount={6} />;
  }

  if (payoutQuery.isError || !payoutQuery.data) {
    return (
      <Empty className="border border-dashed border-zinc-200 bg-white py-16">
        <EmptyHeader>
          <EmptyTitle>Could not load this payout</EmptyTitle>
          <EmptyDescription>
            {payoutQuery.error?.message ?? "The payout may not exist."}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link
            href={Routes.dashboard.admin.payments}
            className="text-xs font-semibold text-brand-700 hover:underline"
          >
            Back to Payments & Payouts
          </Link>
        </EmptyContent>
      </Empty>
    );
  }

  const payout = payoutQuery.data;
  const recipientLabel =
    payout.recipient_type === "EMPLOYEE"
      ? (payout.employee?.full_name ?? "Employee")
      : "Business (house)";

  return (
    <div className="space-y-6">
      <Link
        href={Routes.dashboard.admin.payments}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-ink-charcoal"
      >
        <ArrowLeft className="size-3.5" strokeWidth={2} />
        Back to Payments & Payouts
      </Link>

      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink-charcoal">
            {formatMoney(payout.amount, payout.currency)}
          </h1>
          <p className="mt-0.5 text-xs text-zinc-500">
            {payout.store?.name ?? "Unknown store"} · {recipientLabel}
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-caption font-bold",
            payout.status === "COMPLETED"
              ? "bg-brand-50 text-brand-700"
              : payout.status === "FAILED"
                ? "bg-red-50 text-red-700"
                : payout.status === "CANCELLED"
                  ? "bg-zinc-100 text-zinc-600"
                  : "bg-amber-50 text-amber-700",
          )}
        >
          {getPayoutExecutionStatusLabel(payout.status)}
        </span>
      </div>

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
        <h2 className="mb-2 text-sm font-bold text-ink-charcoal">Summary</h2>
        <SummaryRow label="Store" value={payout.store?.name ?? "—"} />
        <SummaryRow
          label="Recipient type"
          value={getDistributionRecipientTypeLabel(payout.recipient_type)}
        />
        <SummaryRow label="Recipient" value={recipientLabel} />
        <SummaryRow
          label="Amount"
          value={formatMoney(payout.amount, payout.currency)}
        />
        <SummaryRow
          label="Status"
          value={getPayoutExecutionStatusLabel(payout.status)}
        />
        <SummaryRow label="Provider" value={payout.provider} />
        <SummaryRow
          label="Provider transfer id"
          value={payout.provider_transfer_id ?? "—"}
        />
        {payout.failure_reason ? (
          <SummaryRow label="Failure reason" value={payout.failure_reason} />
        ) : null}
        <SummaryRow
          label="Executed at"
          value={formatDateTime(payout.executed_at)}
        />
        <SummaryRow
          label="Created at"
          value={formatDateTime(payout.created_at)}
        />
      </div>

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
        <h2 className="mb-2 text-sm font-bold text-ink-charcoal">
          Payout account
        </h2>
        <SummaryRow
          label="Status"
          value={getPayoutAccountStatusLabel(payout.payout_account.status)}
        />
        <SummaryRow
          label="Method"
          value={payout.payout_account.payout_method}
        />
        <SummaryRow
          label="Beneficiary"
          value={payout.payout_account.beneficiary_name ?? "—"}
        />
        <SummaryRow
          label="IBAN"
          value={
            payout.payout_account.iban_last4
              ? `•••• ${payout.payout_account.iban_last4}`
              : "—"
          }
        />
      </div>

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
        <h2 className="mb-3 text-sm font-bold text-ink-charcoal">
          Distributions included
        </h2>
        {payout.distributions.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 py-6 text-center text-xs text-zinc-500">
            No distributions recorded for this payout.
          </p>
        ) : (
          <div className="divide-y divide-zinc-100">
            {payout.distributions.map((distribution) => (
              <div
                key={distribution.id}
                className="flex items-center justify-between gap-3 py-3 text-sm"
              >
                <div>
                  <div className="font-semibold text-ink-charcoal">
                    Tip {formatMoney(distribution.tip.amount, distribution.tip.currency)}
                  </div>
                  <div className="text-xs text-zinc-400">
                    {distribution.percentage}% ·{" "}
                    {getPayoutStatusLabel(distribution.payout_status)} ·{" "}
                    {formatDateTime(distribution.tip.paid_at)}
                  </div>
                </div>
                <div className="font-bold text-ink-charcoal">
                  {formatMoney(distribution.amount, payout.currency)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
