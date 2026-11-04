"use client";

import { type FC, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FileText, ReceiptText } from "lucide-react";
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
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  ConfirmationDialog,
  useConfirmationDialog,
} from "@/components/ui/confirmation-dialog";
import {
  useCancelPayoutRequest,
  useOpenStorePayoutRequestInvoice,
  useStorePayoutRequests,
} from "@/features/payout-requests/hooks/use-payout-requests";
import {
  PayoutRequestStatuses,
  type PayoutRequest,
  type PayoutRequestStatus,
} from "@/features/payout-requests/interfaces/payout-requests.interfaces";
import { PayoutRequestStatusFormOptions } from "@/config/constants/dropdowns/payouts/payout-request-status-form.options";
import { useDropdownLabel } from "@/hooks/use-dropdown-options";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import { getErrorMessage, getTransferFailedMessage } from "@/lib/api-error";

const statusChipClass: Record<PayoutRequestStatus, string> = {
  PENDING_REVIEW: "bg-amber-50 text-amber-700",
  APPROVED: "bg-sky-50 text-sky-700",
  REJECTED: "bg-red-50 text-red-700",
  CANCELLED: "bg-zinc-100 text-zinc-600",
};

const formatDate = (value: string | null | undefined, locale: string) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString(locale, { dateStyle: "medium" });
};

const formatDateTime = (value: string | null | undefined, locale: string) => {
  if (!value) return "-";
  return new Date(value).toLocaleString(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

// An approved request whose payout completed is simply "Paid" to the store;
// the request status itself never changes (the webhook owns the payout).
const resolveStatus = (
  request: PayoutRequest,
  paidLabel: string,
  statusLabel: (status: PayoutRequestStatus) => string,
) => {
  if (
    request.status === PayoutRequestStatuses.APPROVED &&
    request.payout?.status === "COMPLETED"
  ) {
    return { label: paidLabel, className: "bg-brand-50 text-brand-700" };
  }
  return {
    label: statusLabel(request.status),
    className: statusChipClass[request.status],
  };
};

export const PayoutRequestsTable: FC<{
  storeId: string;
  canCancel: boolean;
}> = ({ storeId, canCancel }) => {
  const t = useTranslations("dashboard.money.payoutRequestsTable");
  const locale = useLocale();
  const dropdownLabel = useDropdownLabel();
  const requestsQuery = useStorePayoutRequests(storeId, { limit: 20 });
  const cancelRequest = useCancelPayoutRequest(storeId);
  const openInvoice = useOpenStorePayoutRequestInvoice(storeId);
  const cancelConfirm = useConfirmationDialog();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const requests = requestsQuery.data?.data ?? [];

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-sm font-bold text-ink-charcoal">{t("title")}</h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          {t("subtitle")}
        </p>
      </div>

      {requestsQuery.isPending ? (
        <TableSkeleton columns={5} />
      ) : requestsQuery.isError ? (
        <Empty className="border border-dashed border-zinc-200 bg-white py-12">
          <EmptyHeader>
            <EmptyTitle>{t("loadFailed")}</EmptyTitle>
            <EmptyDescription>{getErrorMessage(requestsQuery.error)}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : requests.length === 0 ? (
        <Empty className="border border-dashed border-zinc-200 bg-white py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ReceiptText />
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
                <TableHead className="px-4">{t("columns.submitted")}</TableHead>
                <TableHead className="px-4">{t("columns.amount")}</TableHead>
                <TableHead className="px-4">{t("columns.tipsCovered")}</TableHead>
                <TableHead className="px-4">{t("columns.status")}</TableHead>
                <TableHead className="px-4 text-right">{t("columns.invoice")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => {
                const status = resolveStatus(request, t("paid"), (value) =>
                  dropdownLabel(PayoutRequestStatusFormOptions, value),
                );
                const note =
                  request.admin_note ??
                  (request.failure_reason ? getTransferFailedMessage() : null);
                return (
                  <TableRow key={request.id}>
                    <TableCell className="px-4 py-3.5 text-zinc-500">
                      {formatDateTime(request.created_at, locale)}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-bold text-ink-charcoal">
                      {formatMoney(request.amount, request.currency, locale)}
                      {request.held_for_staff_amount > 0 ? (
                        <span className="mt-0.5 block text-base font-medium text-zinc-500">
                          {t("heldForStaff", {
                            amount: formatMoney(
                              request.held_for_staff_amount,
                              request.currency,
                              locale,
                            ),
                          })}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-zinc-500">
                      {request.distribution_count} · {formatDate(request.period_from, locale)}{" "}
                      → {formatDate(request.period_to, locale)}
                    </TableCell>
                    <TableCell className="px-4 py-3.5">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-caption font-bold",
                          status.className,
                        )}
                      >
                        {status.label}
                      </span>
                      {note ? (
                        <p className="mt-1 max-w-xs text-base leading-snug text-zinc-500">
                          {note}
                        </p>
                      ) : null}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 rounded-full px-3 text-xs font-semibold"
                          disabled={openInvoice.isPending}
                          onClick={() => openInvoice.mutate(request.id)}
                        >
                          <FileText data-icon="inline-start" className="size-3.5" />
                          {t("view")}
                        </Button>
                        {canCancel &&
                        request.status === PayoutRequestStatuses.PENDING_REVIEW ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 rounded-full px-3 text-xs font-semibold text-zinc-600 hover:text-red-700"
                            onClick={() => {
                              setCancellingId(request.id);
                              cancelConfirm.openDialog();
                            }}
                          >
                            {t("cancel")}
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <ConfirmationDialog
        state={cancelConfirm}
        title={t("cancelTitle")}
        description={t("cancelDescription")}
        confirmLabel={t("cancelConfirm")}
        cancelLabel={t("keepIt")}
        isPending={cancelRequest.isPending}
        onConfirm={async () => {
          if (!cancellingId) return;
          await cancelRequest.mutateAsync(cancellingId);
          setCancellingId(null);
        }}
      />
    </div>
  );
};
