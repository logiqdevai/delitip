"use client";

import { type FC } from "react";
import Link from "next/link";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { ArrowLeft, Receipt } from "lucide-react";
import { DetailSkeleton } from "@/components/ui/detail-skeleton";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { RefundStatusFormOptions } from "@/config/constants/dropdowns/refunds/refund-status-form.options";
import { TipStatusFormOptions } from "@/config/constants/dropdowns/tips/tip-status-form.options";
import { PayoutStatusFormOptions } from "@/config/constants/dropdowns/tips/payout-status-form.options";
import { useDropdownLabel } from "@/hooks/use-dropdown-options";
import { useTip } from "@/features/tips/hooks/use-tips";
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

export const AdminPaymentDetailPageContent: FC<{ paymentId: string }> = ({
  paymentId,
}) => {
  const t = useTranslations("dashboard.admin.paymentDetail");
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
  const tipQuery = useTip(paymentId);

  if (tipQuery.isPending) {
    return <DetailSkeleton fieldCount={6} />;
  }

  if (tipQuery.isError || !tipQuery.data) {
    return (
      <Empty className="border border-dashed border-zinc-200 bg-white px-4 py-16">
        <EmptyHeader>
          <EmptyTitle>{t("loadError")}</EmptyTitle>
          <EmptyDescription>
            {getErrorMessage(tipQuery.error, t("notFound"))}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link
            href={Routes.dashboard.admin.payments}
            className="text-xs font-semibold text-brand-700 hover:underline"
          >
            {tc("backToPayments")}
          </Link>
        </EmptyContent>
      </Empty>
    );
  }

  const tip = tipQuery.data;

  return (
    <div className="space-y-6">
      <Link
        href={Routes.dashboard.admin.payments}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-ink-charcoal"
      >
        <ArrowLeft className="size-3.5" strokeWidth={2} />
        {tc("backToPayments")}
      </Link>

      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink-charcoal">
            {money(tip.amount, tip.currency)}
          </h1>
          <p className="mt-0.5 text-xs text-zinc-500">
            {tip.store?.name ?? tc("unknownStore")} ·{" "}
            {tip.employee?.full_name ?? t("storeLabel")}
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
          {label(TipStatusFormOptions, tip.status)}
        </span>
      </div>

      <div className="rounded-2xl border border-zinc-200/80 bg-white px-4 py-5 shadow-xs">
        <h2 className="mb-2 text-sm font-bold text-ink-charcoal">{tc("summary")}</h2>
        <SummaryRow label={tc("store")} value={tip.store?.name ?? "-"} />
        <SummaryRow
          label={tc("amount")}
          value={money(tip.amount, tip.currency)}
        />
        <SummaryRow label={tc("status")} value={label(TipStatusFormOptions, tip.status)} />
        <SummaryRow label={t("paidAt")} value={formatDateTime(tip.paid_at)} />
        <SummaryRow label={t("createdAt")} value={formatDateTime(tip.created_at)} />
        <SummaryRow label={t("qrCode")} value={tip.qr_code?.label ?? "-"} />
        <SummaryRow
          label={t("distributionRule")}
          value={tip.distribution_rule?.name ?? t("storeDefault")}
        />
        <SummaryRow
          label={t("paymentProvider")}
          value={tip.payment_provider ?? "-"}
        />
        <SummaryRow
          label={t("paymentReference")}
          value={tip.payment_reference ?? "-"}
        />
        <SummaryRow
          label={t("customer")}
          value={tip.customer_name ?? tip.customer_email ?? tc("anonymous")}
        />
      </div>

      {tip.payment_transaction ? (
        <div className="rounded-2xl border border-zinc-200/80 bg-white px-4 py-5 shadow-xs">
          <h2 className="mb-2 text-sm font-bold text-ink-charcoal">
            {t("financialBreakdown")}
          </h2>
          <SummaryRow
            label={tc("tipAmount")}
            value={money(tip.payment_transaction.tip_amount, tip.currency)}
          />
          {tip.payment_transaction.vat_amount ? (
            <SummaryRow
              label={t("vat")}
              value={`${money(tip.payment_transaction.vat_amount, tip.currency)} (${tip.payment_transaction.vat_rate_percentage}%)`}
            />
          ) : null}
          <SummaryRow
            label={t("grossAmount")}
            value={money(tip.payment_transaction.gross_amount, tip.currency)}
          />
          <SummaryRow
            label={t("processorFee")}
            value={`${
              tip.payment_transaction.processor_fee_confirmed
                ? money(
                    tip.payment_transaction.processor_fee_confirmed_amount ?? 0,
                    tip.currency,
                  )
                : tip.payment_transaction.processor_fee_estimated != null
                  ? t("estimated", {
                      amount: money(tip.payment_transaction.processor_fee_estimated, tip.currency),
                    })
                  : t("notConfirmed")
            }${
              tip.payment_transaction.processor_fee_percentage_used != null
                ? ` (${tip.payment_transaction.processor_fee_percentage_used}%)`
                : ""
            }`}
          />
          <SummaryRow
            label={t("platformCommission")}
            value={`${money(tip.payment_transaction.commission_amount, tip.currency)} (${tip.payment_transaction.commission_percentage_used}%)`}
          />
          <SummaryRow
            label={t("netDistributable")}
            value={
              tip.payment_transaction.net_distributable_amount != null
                ? money(tip.payment_transaction.net_distributable_amount, tip.currency)
                : "-"
            }
          />
        </div>
      ) : null}

      <div className="rounded-2xl border border-zinc-200/80 bg-white px-4 py-5 shadow-xs">
        <h2 className="mb-3 text-sm font-bold text-ink-charcoal">
          {t("distribution")}
        </h2>
        {!tip.distributions || tip.distributions.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-6 text-center text-xs text-zinc-500">
            {t("noDistribution")}
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
                      ? (distribution.employee?.full_name ?? t("employeeFallback"))
                      : t("storeLabel")}
                  </div>
                  <div className="text-xs text-zinc-400">
                    {distribution.percentage}% ·{" "}
                    {label(PayoutStatusFormOptions, distribution.payout_status)}
                  </div>
                </div>
                <div className="font-bold text-ink-charcoal">
                  {money(distribution.amount, tip.currency)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {tip.review ? (
        <div className="rounded-2xl border border-zinc-200/80 bg-white px-4 py-5 shadow-xs">
          <h2 className="mb-2 text-sm font-bold text-ink-charcoal">{t("review")}</h2>
          <p className="text-sm text-zinc-600">
            {t("reviewLine", {
              rating: tip.review.rating,
              comment: tip.review.comment || t("noComment"),
            })}
          </p>
        </div>
      ) : null}

      {tip.refunds && tip.refunds.length > 0 ? (
        <div className="rounded-2xl border border-zinc-200/80 bg-white px-4 py-5 shadow-xs">
          <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-ink-charcoal">
            <Receipt className="size-4" strokeWidth={2} />
            {t("refunds")}
          </h2>
          <div className="divide-y divide-zinc-100">
            {tip.refunds.map((refund) => (
              <div
                key={refund.id}
                className="flex items-center justify-between py-2 text-sm"
              >
                <span className="text-zinc-500">
                  {refund.reason || t("noReason")}
                </span>
                <span className="font-semibold text-ink-charcoal">
                  {money(refund.amount, tip.currency)} (
                  {label(RefundStatusFormOptions, refund.status)})
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
