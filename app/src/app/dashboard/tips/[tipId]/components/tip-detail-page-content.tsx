"use client";

import { type FC, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RequestRefundDialog } from "@/app/dashboard/tips/[tipId]/components/request-refund-dialog";
import { TipDetailSkeleton } from "@/app/dashboard/tips/[tipId]/components/tip-detail-skeleton";
import { RefundStatusFormOptions } from "@/config/constants/dropdowns/refunds/refund-status-form.options";
import { useDropdownLabel } from "@/hooks/use-dropdown-options";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { useTip } from "@/features/tips/hooks/use-tips";
import { TipStatusFormOptions } from "@/config/constants/dropdowns/tips/tip-status-form.options";
import { PayoutStatusFormOptions } from "@/config/constants/dropdowns/tips/payout-status-form.options";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import { Routes } from "@/routes/routes";
import { getErrorMessage } from "@/lib/api-error";

const formatDateTime = (value: string | null | undefined, locale: string) => {
  if (!value) return "-";
  return new Date(value).toLocaleString(locale, {
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

const REFUND_REQUESTS_ENABLED = false;

export const TipDetailPageContent: FC<{ tipId: string }> = ({ tipId }) => {
  const t = useTranslations("dashboard.money.tipDetail");
  const locale = useLocale();
  const dropdownLabel = useDropdownLabel();
  const tipQuery = useTip(tipId);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);

  if (tipQuery.isPending) {
    return <TipDetailSkeleton />;
  }

  if (tipQuery.isError || !tipQuery.data) {
    return (
      <Empty className="border border-dashed border-zinc-200 bg-white py-16">
        <EmptyHeader>
          <EmptyTitle>{t("loadFailedTitle")}</EmptyTitle>
          <EmptyDescription>
            {getErrorMessage(tipQuery.error, t("loadFailedFallback"))}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link
            href={Routes.dashboard.tips}
            className="text-xs font-semibold text-brand-700 hover:underline"
          >
            {t("backToTips")}
          </Link>
        </EmptyContent>
      </Empty>
    );
  }

  const tip = tipQuery.data;
  const hasActiveRefund = (tip.refunds ?? []).some(
    (refund) => refund.status === "PENDING" || refund.status === "APPROVED",
  );
  // Refund requests are hidden for now; existing refunds are still listed.
  const canRequestRefund = REFUND_REQUESTS_ENABLED && tip.status === "COMPLETED" && !hasActiveRefund;

  return (
    <div className="space-y-6">
      <Link
        href={Routes.dashboard.tips}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-ink-charcoal"
      >
        <ArrowLeft className="size-3.5" strokeWidth={2} />
        {t("backToTips")}
      </Link>

      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink-charcoal">
            {formatMoney(tip.amount, tip.currency, locale)}
          </h1>
          <p className="mt-0.5 text-xs text-zinc-500">
            {tip.employee?.full_name ?? t("store")} · {tip.qr_code?.label ?? "-"}
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
          {dropdownLabel(TipStatusFormOptions, tip.status)}
        </span>
      </div>

      <div className="rounded-2xl border border-zinc-200/80 bg-white px-4 py-5 shadow-xs">
        <h2 className="mb-2 text-sm font-bold text-ink-charcoal">{t("summary.title")}</h2>
        <SummaryRow
          label={t("summary.amount")}
          value={formatMoney(tip.amount, tip.currency, locale)}
        />
        <SummaryRow
          label={t("summary.status")}
          value={dropdownLabel(TipStatusFormOptions, tip.status)}
        />
        <SummaryRow label={t("summary.paidAt")} value={formatDateTime(tip.paid_at, locale)} />
        <SummaryRow
          label={t("summary.createdAt")}
          value={formatDateTime(tip.created_at, locale)}
        />
        <SummaryRow
          label={t("summary.qrCode")}
          value={tip.qr_code?.label ?? "-"}
        />
        <SummaryRow
          label={t("summary.distributionRule")}
          value={tip.distribution_rule?.name ?? t("summary.storeDefault")}
        />
        <SummaryRow
          label={t("summary.paymentProvider")}
          value={tip.payment_provider ?? "-"}
        />
        <SummaryRow
          label={t("summary.paymentReference")}
          value={tip.payment_reference ?? "-"}
        />
        <SummaryRow
          label={t("summary.customer")}
          value={tip.customer_name ?? tip.customer_email ?? "-"}
        />
      </div>

      {tip.payment_transaction ? (
        <div className="rounded-2xl border border-zinc-200/80 bg-white px-4 py-5 shadow-xs">
          <h2 className="mb-2 text-sm font-bold text-ink-charcoal">
            {t("financial.title")}
          </h2>
          <SummaryRow
            label={t("financial.tipAmount")}
            value={formatMoney(tip.payment_transaction.tip_amount, tip.currency, locale)}
          />
          {tip.payment_transaction.vat_amount ? (
            <SummaryRow
              label={t("financial.vat")}
              value={`${formatMoney(tip.payment_transaction.vat_amount, tip.currency, locale)} (${tip.payment_transaction.vat_rate_percentage}%)`}
            />
          ) : null}
          <SummaryRow
            label={t("financial.gross")}
            value={formatMoney(tip.payment_transaction.gross_amount, tip.currency, locale)}
          />
          <SummaryRow
            label={t("financial.processorFee")}
            value={`${
              tip.payment_transaction.processor_fee_confirmed
                ? formatMoney(
                    tip.payment_transaction.processor_fee_confirmed_amount ?? 0,
                    tip.currency,
                    locale,
                  )
                : tip.payment_transaction.processor_fee_estimated != null
                  ? t("financial.estimated", {
                      amount: formatMoney(
                        tip.payment_transaction.processor_fee_estimated,
                        tip.currency,
                        locale,
                      ),
                    })
                  : t("financial.notConfirmed")
            }${
              tip.payment_transaction.processor_fee_percentage_used != null
                ? ` (${tip.payment_transaction.processor_fee_percentage_used}%)`
                : ""
            }`}
          />
          <SummaryRow
            label={t("financial.commission")}
            value={`${formatMoney(tip.payment_transaction.commission_amount, tip.currency, locale)} (${tip.payment_transaction.commission_percentage_used}%)`}
          />
          <SummaryRow
            label={t("financial.net")}
            value={
              tip.payment_transaction.net_distributable_amount != null
                ? formatMoney(tip.payment_transaction.net_distributable_amount, tip.currency, locale)
                : "-"
            }
          />
        </div>
      ) : null}

      <div className="rounded-2xl border border-zinc-200/80 bg-white px-4 py-5 shadow-xs">
        <h2 className="mb-3 text-sm font-bold text-ink-charcoal">
          {t("distribution.title")}
        </h2>
        {!tip.distributions || tip.distributions.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 py-6 text-center text-xs text-zinc-500">
            {t("distribution.empty")}
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
                      ? (distribution.employee?.full_name ?? t("employee"))
                      : t("store")}
                  </div>
                  <div className="text-xs text-zinc-400">
                    {distribution.percentage}% ·{" "}
                    {dropdownLabel(PayoutStatusFormOptions, distribution.payout_status)}
                  </div>
                </div>
                <div className="font-bold text-ink-charcoal">
                  {formatMoney(distribution.amount, tip.currency, locale)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {tip.review ? (
        <div className="rounded-2xl border border-zinc-200/80 bg-white px-4 py-5 shadow-xs">
          <h2 className="mb-2 text-sm font-bold text-ink-charcoal">{t("review.title")}</h2>
          <p className="text-sm text-zinc-600">
            ★ {tip.review.rating} - {tip.review.comment || t("review.noComment")}
          </p>
        </div>
      ) : null}

      {(tip.refunds && tip.refunds.length > 0) || canRequestRefund ? (
        <div className="rounded-2xl border border-zinc-200/80 bg-white px-4 py-5 shadow-xs">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-sm font-bold text-ink-charcoal">
              <Receipt className="size-4" strokeWidth={2} />
              {t("refunds.title")}
            </h2>
            {canRequestRefund ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRefundDialogOpen(true)}
              >
                {t("refunds.request")}
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
                    {refund.reason || t("refunds.noReason")}
                  </span>
                  <span className="font-semibold text-ink-charcoal">
                    {formatMoney(refund.amount, tip.currency, locale)} (
                    {dropdownLabel(RefundStatusFormOptions, refund.status)})
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
