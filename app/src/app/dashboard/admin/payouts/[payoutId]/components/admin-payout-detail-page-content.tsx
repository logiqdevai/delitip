"use client";

import { type FC } from "react";
import Link from "next/link";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { DetailSkeleton } from "@/components/ui/detail-skeleton";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { DistributionRecipientTypeFormOptions } from "@/config/constants/dropdowns/distribution/distribution-recipient-type-form.options";
import { PayoutAccountStatusFormOptions } from "@/config/constants/dropdowns/payments/payout-account-status-form.options";
import { PayoutExecutionStatusFormOptions } from "@/config/constants/dropdowns/payments/payout-execution-status-form.options";
import { PayoutStatusFormOptions } from "@/config/constants/dropdowns/tips/payout-status-form.options";
import { useDropdownLabel } from "@/hooks/use-dropdown-options";
import { useAdminPayout } from "@/features/payouts/hooks/use-payouts";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import { Routes } from "@/routes/routes";
import { getErrorMessage } from "@/lib/api-error";

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
  const t = useTranslations("dashboard.admin.payoutDetail");
  const tc = useTranslations("dashboard.admin.common");
  const locale = useLocale();
  const format = useFormatter();
  const formatDateTime = (value?: string | null) =>
    value
      ? format.dateTime(new Date(value), { dateStyle: "medium", timeStyle: "short" })
      : "-";
  const label = useDropdownLabel();
  const money = (amount: number, currency: Parameters<typeof formatMoney>[1]) =>
    formatMoney(amount, currency, locale);
  const payoutQuery = useAdminPayout(payoutId);

  if (payoutQuery.isPending) {
    return <DetailSkeleton fieldCount={6} />;
  }

  if (payoutQuery.isError || !payoutQuery.data) {
    return (
      <Empty className="border border-dashed border-zinc-200 bg-white px-4 py-16">
        <EmptyHeader>
          <EmptyTitle>{t("loadError")}</EmptyTitle>
          <EmptyDescription>
            {getErrorMessage(payoutQuery.error, t("notFound"))}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link
            href={Routes.dashboard.admin.payments}
            className="text-xs font-semibold text-brand-700 hover:underline"
          >
            {tc("backToFinance")}
          </Link>
        </EmptyContent>
      </Empty>
    );
  }

  const payout = payoutQuery.data;
  const recipientLabel =
    payout.recipient_type === "EMPLOYEE"
      ? (payout.employee?.full_name ?? t("employeeFallback"))
      : t("houseLabel");

  return (
    <div className="space-y-6">
      <Link
        href={Routes.dashboard.admin.payments}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-ink-charcoal"
      >
        <ArrowLeft className="size-3.5" strokeWidth={2} />
        {tc("backToFinance")}
      </Link>

      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink-charcoal">
            {money(payout.amount, payout.currency)}
          </h1>
          <p className="mt-0.5 text-xs text-zinc-500">
            {payout.store?.name ?? tc("unknownStore")} · {recipientLabel}
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
          {label(PayoutExecutionStatusFormOptions, payout.status)}
        </span>
      </div>

      <div className="rounded-2xl border border-zinc-200/80 bg-white px-4 py-5 shadow-xs">
        <h2 className="mb-2 text-sm font-bold text-ink-charcoal">{tc("summary")}</h2>
        <SummaryRow label={tc("store")} value={payout.store?.name ?? "-"} />
        <SummaryRow
          label={t("recipientType")}
          value={label(DistributionRecipientTypeFormOptions, payout.recipient_type)}
        />
        <SummaryRow label={t("recipient")} value={recipientLabel} />
        <SummaryRow
          label={tc("amount")}
          value={money(payout.amount, payout.currency)}
        />
        <SummaryRow
          label={tc("status")}
          value={label(PayoutExecutionStatusFormOptions, payout.status)}
        />
        <SummaryRow label={tc("provider")} value={payout.provider} />
        <SummaryRow
          label={t("providerTransferId")}
          value={payout.provider_transfer_id ?? "-"}
        />
        {payout.failure_reason ? (
          <SummaryRow label={t("failureReason")} value={payout.failure_reason} />
        ) : null}
        <SummaryRow
          label={t("executedAt")}
          value={formatDateTime(payout.executed_at)}
        />
        <SummaryRow
          label={t("createdAt")}
          value={formatDateTime(payout.created_at)}
        />
      </div>

      <div className="rounded-2xl border border-zinc-200/80 bg-white px-4 py-5 shadow-xs">
        <h2 className="mb-2 text-sm font-bold text-ink-charcoal">
          {t("payoutAccount")}
        </h2>
        <SummaryRow
          label={tc("status")}
          value={label(PayoutAccountStatusFormOptions, payout.payout_account.status)}
        />
        <SummaryRow
          label={t("method")}
          value={payout.payout_account.payout_method}
        />
        <SummaryRow
          label={t("beneficiary")}
          value={payout.payout_account.beneficiary_name ?? "-"}
        />
        <SummaryRow
          label={t("iban")}
          value={
            payout.payout_account.iban_last4
              ? `•••• ${payout.payout_account.iban_last4}`
              : "-"
          }
        />
      </div>

      <div className="rounded-2xl border border-zinc-200/80 bg-white px-4 py-5 shadow-xs">
        <h2 className="mb-3 text-sm font-bold text-ink-charcoal">
          {t("distributionsIncluded")}
        </h2>
        {payout.distributions.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-6 text-center text-xs text-zinc-500">
            {t("noDistributions")}
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
                    {tc("tipLabel", {
                      amount: money(distribution.tip.amount, distribution.tip.currency),
                    })}
                  </div>
                  <div className="text-xs text-zinc-400">
                    {distribution.percentage}% ·{" "}
                    {label(PayoutStatusFormOptions, distribution.payout_status)} ·{" "}
                    {formatDateTime(distribution.tip.paid_at)}
                  </div>
                </div>
                <div className="font-bold text-ink-charcoal">
                  {money(distribution.amount, payout.currency)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
