"use client";

import { type FC, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  ConfirmationDialog,
  useConfirmationDialog,
} from "@/components/ui/confirmation-dialog";
import { PayOutNowDialog } from "@/app/dashboard/payments/components/pay-out-now-dialog";
import { PayoutRequestDialog } from "@/app/dashboard/payments/components/payout-request-dialog";
import { useStoreDistributions } from "@/features/payouts/hooks/use-payouts";
import { usePayoutPolicy } from "@/features/app-config/hooks/use-app-config";
import {
  useCancelPayoutRequest,
  usePayoutRequestPreview,
} from "@/features/payout-requests/hooks/use-payout-requests";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import { formatMoney } from "@/lib/money";

const formatDateTime = (value: string | null | undefined, locale: string) => {
  if (!value) return "-";
  return new Date(value).toLocaleString(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatDate = (value: string | null | undefined, locale: string) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString(locale, { dateStyle: "medium" });
};

interface PayoutSummaryCardProps {
  storeId: string;
  currency: Currency;
}

// What is waiting to be paid out, and the action to pay it. The totals are
// store-wide (independent of the tips table filters below).
export const PayoutSummaryCard: FC<PayoutSummaryCardProps> = ({
  storeId,
  currency,
}) => {
  const t = useTranslations("dashboard.money.payoutSummaryCard");
  const locale = useLocale();
  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);

  const summaryQuery = useStoreDistributions(storeId, {
    page: 1,
    limit: 1,
    payout_status: "PENDING",
  });
  const summary = summaryQuery.data?.summary;

  // When invoice-gated payouts are on, the store's own money leaves through
  // a reviewed payout request; "Pay out now" only reaches DIRECT employees.
  const policyQuery = usePayoutPolicy();
  const invoiceRequired = policyQuery.data?.payout_invoice_required ?? false;
  // Tips only go to stores for now, so direct staff payouts stay hidden.
  const storeOnly = policyQuery.data?.tip_payouts_store_only ?? true;
  const requestPreviewQuery = usePayoutRequestPreview(storeId, invoiceRequired);
  const openRequest = requestPreviewQuery.data?.open_request ?? null;
  const requestableAmount = requestPreviewQuery.data?.amount ?? 0;
  const cancelRequest = useCancelPayoutRequest(storeId);
  const cancelConfirm = useConfirmationDialog();

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="text-xs text-zinc-400">{t("pendingPayout")}</p>
            <p className="text-lg font-bold text-ink-charcoal">
              {formatMoney(summary?.pending_total_amount ?? 0, currency, locale)}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-400">{t("eligibleNow")}</p>
            <p className="text-lg font-bold text-brand-700">
              {formatMoney(summary?.eligible_total_amount ?? 0, currency, locale)}
            </p>
          </div>
          {summary && summary.requested_total_amount > 0 ? (
            <div>
              <p className="text-xs text-zinc-400">{t("underReview")}</p>
              <p className="text-lg font-bold text-amber-700">
                {formatMoney(summary.requested_total_amount, currency, locale)}
              </p>
            </div>
          ) : null}
        </div>
        {invoiceRequired ? (
          <div className="flex flex-wrap items-center gap-2">
            {!storeOnly ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setPayoutDialogOpen(true)}
                disabled={!summary || summary.eligible_total_amount === 0}
                className="rounded-xl"
              >
                {t("payOutStaff")}
              </Button>
            ) : null}
            <Button
              type="button"
              onClick={() => setRequestDialogOpen(true)}
              disabled={
                requestPreviewQuery.isPending ||
                !!openRequest ||
                requestableAmount === 0
              }
              className="rounded-xl bg-electric-lime text-ink-charcoal"
            >
              {t("requestPayout")}
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            onClick={() => setPayoutDialogOpen(true)}
            disabled={!summary || summary.eligible_total_amount === 0}
            className="rounded-xl bg-electric-lime text-ink-charcoal"
          >
            {t("payOutNow")}
          </Button>
        )}
      </div>
      {summary ? (
        <p className="text-base text-zinc-500">
          {t("holdNote", {
            hours: summary.hold_window_hours,
            hasNext: summary.next_eligible_at ? "true" : "false",
            date: formatDateTime(summary.next_eligible_at, locale),
            invoiceRequired: invoiceRequired ? "true" : "false",
          })}
        </p>
      ) : null}
      {openRequest ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-amber-50/60 px-3.5 py-3 text-base leading-snug text-amber-900">
          <span>
            {t.rich(
              openRequest.failure_reason ? "openRequestFailed" : "openRequest",
              {
                amount: formatMoney(openRequest.amount, currency, locale),
                date: formatDate(openRequest.created_at, locale),
                b: (chunks) => <strong>{chunks}</strong>,
              },
            )}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 rounded-full px-2.5 text-xs font-semibold text-amber-900 hover:bg-amber-100"
            onClick={cancelConfirm.openDialog}
          >
            {t("cancelRequest")}
          </Button>
        </div>
      ) : null}

      <PayOutNowDialog
        open={payoutDialogOpen}
        onOpenChange={setPayoutDialogOpen}
        storeId={storeId}
        currency={currency}
      />
      <PayoutRequestDialog
        open={requestDialogOpen}
        onOpenChange={setRequestDialogOpen}
        storeId={storeId}
        currency={currency}
      />
      <ConfirmationDialog
        state={cancelConfirm}
        title={t("cancelTitle")}
        description={t("cancelDescription")}
        confirmLabel={t("cancelRequest")}
        cancelLabel={t("keepIt")}
        isPending={cancelRequest.isPending}
        onConfirm={async () => {
          if (!openRequest) return;
          await cancelRequest.mutateAsync(openRequest.id);
        }}
      />
    </div>
  );
};
