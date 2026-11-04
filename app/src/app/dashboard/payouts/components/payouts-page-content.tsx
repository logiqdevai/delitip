"use client";

import { type FC } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useStorePayouts } from "@/features/payouts/hooks/use-payouts";
import type { PayoutExecutionStatus } from "@/features/payouts/interfaces/payouts.interfaces";
import { usePayoutPolicy } from "@/features/app-config/hooks/use-app-config";
import { useStorePayoutRequests } from "@/features/payout-requests/hooks/use-payout-requests";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { PayoutRequestsTable } from "@/app/dashboard/payouts/components/payout-requests-table";
import { PayoutExecutionStatusFormOptions } from "@/config/constants/dropdowns/payments/payout-execution-status-form.options";
import { useDropdownLabel } from "@/hooks/use-dropdown-options";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import { getErrorMessage, getTransferFailedMessage } from "@/lib/api-error";

const statusChipClass: Record<PayoutExecutionStatus, string> = {
  PROCESSING: "bg-sky-50 text-sky-700",
  COMPLETED: "bg-brand-50 text-brand-700",
  FAILED: "bg-red-50 text-red-700",
  CANCELLED: "bg-zinc-100 text-zinc-600",
};

const formatDateTime = (value: string | null | undefined, locale: string) => {
  if (!value) return "-";
  return new Date(value).toLocaleString(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

interface PayoutsPageContentProps {
  storeId: string;
}

// Rendered as the Payouts tab of the Tips page, which owns the page header
// and the "no store selected" guard.
export const PayoutsPageContent: FC<PayoutsPageContentProps> = ({ storeId }) => {
  const t = useTranslations("dashboard.money.payoutsPage");
  const locale = useLocale();
  const dropdownLabel = useDropdownLabel();
  const payoutsQuery = useStorePayouts(storeId, { limit: 50 });
  const policyQuery = usePayoutPolicy();
  const requestsQuery = useStorePayoutRequests(storeId, { limit: 1 });
  const { role } = useWorkspace();

  const payouts = payoutsQuery.data?.data ?? [];
  // Show the requests section whenever invoices are required, or when the
  // store has history from a time they were — never an empty section
  // for stores that have only ever used Pay out now.
  const showRequests =
    (policyQuery.data?.payout_invoice_required ?? false) ||
    (requestsQuery.data?.pagination.total ?? 0) > 0;

  return (
    <div className="space-y-6">
      {showRequests ? (
        <PayoutRequestsTable storeId={storeId} canCancel={role === "OWNER"} />
      ) : null}

      <div>
        <h2 className="text-sm font-bold text-ink-charcoal">{t("historyTitle")}</h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          {t("historySubtitle")}
        </p>
      </div>

      {payoutsQuery.isPending ? (
        <TableSkeleton columns={5} />
      ) : payoutsQuery.isError ? (
        <Empty className="border border-dashed border-zinc-200 bg-white py-16">
          <EmptyHeader>
            <EmptyTitle>{t("loadFailed")}</EmptyTitle>
            <EmptyDescription>{getErrorMessage(payoutsQuery.error)}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              variant="outline"
              onClick={() => void payoutsQuery.refetch()}
            >
              {t("tryAgain")}
            </Button>
          </EmptyContent>
        </Empty>
      ) : payouts.length === 0 ? (
        <Empty className="border border-dashed border-zinc-200 bg-white py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Banknote />
            </EmptyMedia>
            <EmptyTitle>{t("emptyTitle")}</EmptyTitle>
            <EmptyDescription>
              {t("emptyDescription")}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4">{t("columns.when")}</TableHead>
                <TableHead className="px-4">{t("columns.recipient")}</TableHead>
                <TableHead className="px-4">{t("columns.amount")}</TableHead>
                <TableHead className="px-4">{t("columns.reference")}</TableHead>
                <TableHead className="px-4 text-right">{t("columns.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell className="px-4 py-3.5 text-zinc-500">
                    {formatDateTime(payout.executed_at ?? payout.created_at, locale)}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 font-semibold text-ink-charcoal">
                    {payout.recipient_type === "EMPLOYEE"
                      ? (payout.employee?.full_name ?? t("employee"))
                      : t("store")}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 font-bold text-brand-700">
                    {formatMoney(payout.amount, payout.currency, locale)}
                    {payout.held_for_staff_amount ? (
                      <span className="mt-0.5 block text-base font-medium text-zinc-500">
                        {t("split", {
                          own: formatMoney(
                            payout.own_share_amount ?? 0,
                            payout.currency,
                            locale,
                          ),
                          held: formatMoney(
                            payout.held_for_staff_amount,
                            payout.currency,
                            locale,
                          ),
                        })}
                      </span>
                    ) : null}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 font-mono text-xs text-zinc-500">
                    {payout.provider_transfer_id ?? "-"}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 text-right">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-caption font-bold",
                        statusChipClass[payout.status],
                      )}
                      title={payout.failure_reason ? getTransferFailedMessage() : undefined}
                    >
                      {dropdownLabel(PayoutExecutionStatusFormOptions, payout.status)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
