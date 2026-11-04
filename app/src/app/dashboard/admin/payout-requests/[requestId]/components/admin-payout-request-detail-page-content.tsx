"use client";

import { type FC, useState } from "react";
import Link from "next/link";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  RefreshCw,
  TriangleAlert,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DetailSkeleton } from "@/components/ui/detail-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { PayoutAccountStatusFormOptions } from "@/config/constants/dropdowns/payments/payout-account-status-form.options";
import { PayoutExecutionStatusFormOptions } from "@/config/constants/dropdowns/payments/payout-execution-status-form.options";
import { PayoutStatusFormOptions } from "@/config/constants/dropdowns/tips/payout-status-form.options";
import { InvoiceCheckIssueDescriptionOptions } from "@/config/constants/dropdowns/payouts/invoice-check-issue-description.options";
import { useDropdownDescription, useDropdownLabel } from "@/hooks/use-dropdown-options";
import {
  useAdminPayoutRequest,
  useAdminPayoutRequestInvoiceUrl,
  useApprovePayoutRequest,
  useRecheckPayoutRequest,
  useRejectPayoutRequest,
} from "@/features/payout-requests/hooks/use-payout-requests";
import {
  HardInvoiceCheckIssues,
  InvoiceCheckIssues,
  InvoiceCheckStatuses,
  PayoutRequestStatuses,
  type AdminPayoutRequestDetail,
  type InvoiceCheckIssue,
  type InvoiceExtraction,
} from "@/features/payout-requests/interfaces/payout-requests.interfaces";
import {
  InvoiceCheckChip,
  PayoutRequestStatusChip,
} from "@/app/dashboard/admin/payments/components/payout-request-chips";
import {
  ReviewPayoutRequestDialog,
  type ReviewAction,
} from "./review-payout-request-dialog";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import { Routes } from "@/routes/routes";
import { getErrorMessage } from "@/lib/api-error";

const personName = (
  user: { first_name: string | null; last_name: string | null; email: string } | null,
) => (user ? [user.first_name, user.last_name].filter(Boolean).join(" ") || user.email : "-");

const useFormatters = () => {
  const format = useFormatter();
  const locale = useLocale();
  return {
    formatDate: (value?: string | null) =>
      value ? format.dateTime(new Date(value), { dateStyle: "medium" }) : "-",
    formatDateTime: (value?: string | null) =>
      value
        ? format.dateTime(new Date(value), { dateStyle: "medium", timeStyle: "short" })
        : "-",
    money: (amount: number, currency: string) =>
      formatMoney(amount, currency as never, locale),
  };
};

const SummaryRow: FC<{ label: string; value: string; muted?: boolean }> = ({
  label,
  value,
  muted,
}) => (
  <div className="flex items-start justify-between gap-4 border-b border-zinc-100 py-2.5 text-sm last:border-0">
    <span className="shrink-0 text-zinc-500">{label}</span>
    <span className={cn("text-right font-semibold", muted ? "text-zinc-400" : "text-ink-charcoal")}>
      {value}
    </span>
  </div>
);

const Card: FC<{ title: string; children: React.ReactNode; action?: React.ReactNode }> = ({
  title,
  children,
  action,
}) => (
  <section className="rounded-2xl border border-zinc-200/80 bg-white px-4 py-5 shadow-xs">
    <div className="mb-2 flex items-center justify-between gap-3">
      <h2 className="text-sm font-bold text-ink-charcoal">{title}</h2>
      {action}
    </div>
    {children}
  </section>
);

const isExtraction = (value: AdminPayoutRequestDetail["check_extracted"]): value is InvoiceExtraction =>
  !!value && typeof value === "object" && "is_invoice" in value;

// Expected vs. on-invoice, one line per thing the automatic check compares.
const ChecksTable: FC<{ request: AdminPayoutRequestDetail }> = ({ request }) => {
  const t = useTranslations("dashboard.admin.payoutRequestDetail.check");
  const { formatDate, money } = useFormatters();
  const majorToLabel = (value: number | null | undefined, currency: string) =>
    value === null || value === undefined ? "—" : money(Math.round(value * 100), currency);
  const extracted = isExtraction(request.check_extracted) ? request.check_extracted : null;
  const issues = new Set<InvoiceCheckIssue>(request.check_issues ?? []);
  const has = (...codes: InvoiceCheckIssue[]) => codes.some((code) => issues.has(code));

  const rows: { label: string; expected: string; found: string; ok: boolean | null }[] = [
    {
      label: t("rows.amountBeforeVat"),
      expected: money(request.amount, request.currency),
      found: extracted ? majorToLabel(extracted.net_amount ?? (extracted.total_amount !== null && extracted.vat_amount !== null ? extracted.total_amount - extracted.vat_amount : null), request.currency) : "—",
      ok: extracted ? !has(InvoiceCheckIssues.NET_MISMATCH, InvoiceCheckIssues.NET_MISSING) : null,
    },
    {
      label: t("rows.currency"),
      expected: request.currency,
      found: extracted?.currency ?? "—",
      ok: extracted ? !has(InvoiceCheckIssues.CURRENCY_MISMATCH) : null,
    },
    {
      label: t("rows.issuerVat"),
      expected: request.store.organization.vat_number ?? t("expected.notOnFile"),
      found: extracted?.issuer_vat_number ?? "—",
      ok: extracted
        ? !has(InvoiceCheckIssues.ISSUER_VAT_MISMATCH, InvoiceCheckIssues.ISSUER_VAT_MISSING, InvoiceCheckIssues.ORG_VAT_MISSING)
        : null,
    },
    {
      label: t("rows.recipientVat"),
      expected: t("expected.configuredInAppConfig"),
      found: extracted?.recipient_vat_number ?? "—",
      ok: extracted ? !has(InvoiceCheckIssues.RECIPIENT_VAT_MISMATCH) : null,
    },
    {
      label: t("rows.invoiceNumber"),
      expected: request.invoice_number ?? t("expected.notTyped"),
      found: extracted?.invoice_number ?? "—",
      ok: extracted ? !has(InvoiceCheckIssues.INVOICE_NUMBER_MISMATCH) : null,
    },
    {
      label: t("rows.invoiceDate"),
      expected: t("expected.afterDate", { date: formatDate(request.period_to) }),
      found: extracted?.invoice_date ?? "—",
      ok: extracted ? !has(InvoiceCheckIssues.DATE_SUSPICIOUS) : null,
    },
    {
      label: t("rows.netPlusVat"),
      expected: t("expected.equalsTotal"),
      found: extracted
        ? `${majorToLabel(extracted.net_amount, request.currency)} + ${majorToLabel(extracted.vat_amount, request.currency)}${extracted.vat_rate_percentage !== null ? ` (${extracted.vat_rate_percentage}%)` : ""}`
        : "—",
      ok: extracted ? !has(InvoiceCheckIssues.NET_PLUS_VAT_MISMATCH) : null,
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200/80">
      <table className="w-full text-sm">
        <thead className="bg-zinc-50/80 text-left text-xs font-semibold text-zinc-500">
          <tr>
            <th className="px-3 py-2">{t("columns.check")}</th>
            <th className="px-3 py-2">{t("columns.expected")}</th>
            <th className="px-3 py-2">{t("columns.onInvoice")}</th>
            <th className="w-10 px-3 py-2" />
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {rows.map((row) => (
            <tr key={row.label}>
              <td className="px-3 py-2 text-zinc-500">{row.label}</td>
              <td className="px-3 py-2 font-medium text-ink-charcoal">{row.expected}</td>
              <td className="px-3 py-2 font-medium text-ink-charcoal">{row.found}</td>
              <td className="px-3 py-2 text-right">
                {row.ok === null ? null : row.ok ? (
                  <Check className="ml-auto size-4 text-brand-700" strokeWidth={2.5} />
                ) : (
                  <X className="ml-auto size-4 text-red-600" strokeWidth={2.5} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const InvoicePreview: FC<{ requestId: string; mimetype: string }> = ({ requestId, mimetype }) => {
  const t = useTranslations("dashboard.admin.payoutRequestDetail.invoice");
  const urlQuery = useAdminPayoutRequestInvoiceUrl(requestId);

  if (urlQuery.isPending) return <Skeleton className="h-[520px] w-full rounded-xl" />;
  if (urlQuery.isError || !urlQuery.data) {
    return (
      <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-10 text-center text-xs text-zinc-500">
        {getErrorMessage(urlQuery.error, t("loadError"))}
      </p>
    );
  }

  const { url } = urlQuery.data;
  return (
    <div className="space-y-2">
      <div className="overflow-hidden rounded-xl border border-zinc-200/80 bg-zinc-50">
        {mimetype === "application/pdf" ? (
          <iframe src={url} title={t("title")} className="h-[520px] w-full" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={t("title")} className="max-h-[520px] w-full object-contain" />
        )}
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:underline"
      >
        <ExternalLink className="size-3.5" strokeWidth={2} />
        {t("openInNewTab")}
      </a>
    </div>
  );
};

export const AdminPayoutRequestDetailPageContent: FC<{ requestId: string }> = ({ requestId }) => {
  const requestQuery = useAdminPayoutRequest(requestId);
  const approve = useApprovePayoutRequest(requestId);
  const reject = useRejectPayoutRequest(requestId);
  const recheck = useRecheckPayoutRequest(requestId);
  const [reviewAction, setReviewAction] = useState<ReviewAction | null>(null);
  const t = useTranslations("dashboard.admin.payoutRequestDetail");
  const tc = useTranslations("dashboard.admin.common");
  const { formatDate, formatDateTime, money } = useFormatters();
  const label = useDropdownLabel();
  const describe = useDropdownDescription();

  if (requestQuery.isPending) {
    return <DetailSkeleton fieldCount={8} />;
  }

  if (requestQuery.isError || !requestQuery.data) {
    return (
      <Empty className="border border-dashed border-zinc-200 bg-white px-4 py-16">
        <EmptyHeader>
          <EmptyTitle>{t("loadError")}</EmptyTitle>
          <EmptyDescription>
            {getErrorMessage(requestQuery.error, t("notFound"))}
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

  const request = requestQuery.data;
  const organization = request.store.organization;
  const isPendingReview = request.status === PayoutRequestStatuses.PENDING_REVIEW;
  const accountActive = request.store.payout_account?.status === "ACTIVE";
  const issues = request.check_issues ?? [];
  const hardIssues = issues.filter((issue) => HardInvoiceCheckIssues.has(issue));
  const softIssues = issues.filter((issue) => !HardInvoiceCheckIssues.has(issue));
  const extractionError =
    request.check_extracted && "error" in request.check_extracted ? request.check_extracted.error : null;
  const extractedNotes = isExtraction(request.check_extracted) ? request.check_extracted.notes : null;

  const approveBlockedReason = !isPendingReview
    ? null
    : request.integrity.is_stale
      ? t("actions.blockedStale")
      : !accountActive
        ? t("actions.blockedInactive")
        : null;

  const handleReview = async (action: ReviewAction, note: string) => {
    if (action === "approve") {
      await approve.mutateAsync(note ? { admin_note: note } : {});
    } else {
      await reject.mutateAsync({ admin_note: note });
    }
  };

  return (
    <div className="space-y-6">
      <Link
        href={Routes.dashboard.admin.payments}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-ink-charcoal"
      >
        <ArrowLeft className="size-3.5" strokeWidth={2} />
        {tc("backToFinance")}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink-charcoal">
            {money(request.amount, request.currency)}
          </h1>
          <p className="mt-0.5 text-xs text-zinc-500">
            {t("subtitle", {
              store: request.store.name,
              date: formatDateTime(request.created_at),
              person: personName(request.requested_by),
            })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <InvoiceCheckChip status={request.check_status} verdict={request.check_verdict} size="md" />
          <PayoutRequestStatusChip
            status={request.status}
            payoutStatus={request.payout?.status ?? null}
            failureReason={request.failure_reason}
            size="md"
          />
        </div>
      </div>

      {request.failure_reason && isPendingReview ? (
        <div className="flex gap-2.5 rounded-xl border border-red-200 bg-red-50/60 px-4 py-3 text-sm text-red-900">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
          <span>
            {t.rich("transferFailed", {
              b: (chunks) => <strong>{chunks}</strong>,
              reason: request.failure_reason,
            })}
          </span>
        </div>
      ) : null}

      {request.integrity.is_stale ? (
        <div className="flex gap-2.5 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-sm text-amber-900">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
          <span>
            {t.rich("stale", {
              b: (chunks) => <strong>{chunks}</strong>,
              stale: request.integrity.stale_count,
              locked: request.integrity.locked_count,
              live: money(request.integrity.live_amount, request.currency),
              amount: money(request.amount, request.currency),
            })}
          </span>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title={t("cards.invoice")}>
          <InvoicePreview requestId={request.id} mimetype={request.invoice_document.mimetype} />
          <div className="mt-3">
            <SummaryRow label={t("invoice.file")} value={request.invoice_document.filename.split("/").pop() ?? "-"} />
            <SummaryRow label={t("invoice.invoiceNumberTyped")} value={request.invoice_number ?? "-"} />
            {request.store_note ? <SummaryRow label={t("invoice.noteFromStore")} value={request.store_note} /> : null}
          </div>
        </Card>

        <div className="space-y-6">
          <Card
            title={t("cards.autoCheck")}
            action={
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={recheck.isPending}
                onClick={() => recheck.mutate()}
                className="h-8 rounded-full px-3 text-xs font-semibold"
              >
                <RefreshCw
                  data-icon="inline-start"
                  className={cn("size-3.5", recheck.isPending && "animate-spin")}
                />
                {t("check.rerun")}
              </Button>
            }
          >
            {request.check_status === InvoiceCheckStatuses.PENDING ? (
              <p className="text-xs text-zinc-500">
                {t("check.pending")}
              </p>
            ) : request.check_status === InvoiceCheckStatuses.SKIPPED ? (
              <p className="text-xs text-zinc-500">
                {t("check.skipped")}
              </p>
            ) : request.check_status === InvoiceCheckStatuses.FAILED ? (
              <p className="text-xs text-red-700">
                {extractionError
                  ? t("check.failedWithError", { error: extractionError })
                  : t("check.failed")}
              </p>
            ) : null}

            {request.check_status === InvoiceCheckStatuses.COMPLETED ? (
              <>
                <ChecksTable request={request} />
                {hardIssues.length > 0 || softIssues.length > 0 ? (
                  <ul className="mt-3 space-y-1.5">
                    {hardIssues.map((issue) => (
                      <li key={issue} className="flex gap-2 text-xs text-red-700">
                        <X className="mt-0.5 size-3.5 shrink-0" strokeWidth={2.5} />
                        {describe(InvoiceCheckIssueDescriptionOptions, issue)}
                      </li>
                    ))}
                    {softIssues.map((issue) => (
                      <li key={issue} className="flex gap-2 text-xs text-amber-800">
                        <TriangleAlert className="mt-0.5 size-3.5 shrink-0" strokeWidth={2} />
                        {describe(InvoiceCheckIssueDescriptionOptions, issue)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-brand-700">
                    <Check className="size-3.5" strokeWidth={2.5} />
                    {t("check.allMatch")}
                  </p>
                )}
                {extractedNotes ? (
                  <p className="mt-2 text-xs text-zinc-500">{t("check.readerNote", { note: extractedNotes })}</p>
                ) : null}
              </>
            ) : null}

            {request.checked_at ? (
              <p className="mt-3 text-base text-zinc-400">
                {request.check_model ?? t("check.modelFallback")} · {formatDateTime(request.checked_at)}
                {request.check_cost_usd !== null
                  ? ` · $${Number(request.check_cost_usd).toFixed(4)}`
                  : ""}
              </p>
            ) : null}
          </Card>

          <Card title={t("cards.request")}>
            <SummaryRow label={t("request.ownShare")} value={money(request.own_share_amount, request.currency)} />
            <SummaryRow label={t("request.heldForStaff")} value={money(request.held_for_staff_amount, request.currency)} />
            <SummaryRow
              label={t("request.tipsCovered")}
              value={`${request.distribution_count} · ${formatDate(request.period_from)} → ${formatDate(request.period_to)}`}
            />
            <SummaryRow label={t("request.holdCutoff")} value={formatDateTime(request.hold_cutoff_at)} />
            <SummaryRow
              label={t("request.storePayoutAccount")}
              value={
                request.store.payout_account
                  ? `${label(PayoutAccountStatusFormOptions, request.store.payout_account.status)}${request.store.payout_account.iban_last4 ? ` · •••• ${request.store.payout_account.iban_last4}` : ""}`
                  : t("request.notLinked")
              }
            />
            {request.reviewed_at ? (
              <>
                <SummaryRow
                  label={t("request.reviewed")}
                  value={t("request.reviewedBy", {
                    date: formatDateTime(request.reviewed_at),
                    person: personName(request.reviewed_by),
                  })}
                />
                {request.admin_note ? <SummaryRow label={t("request.adminNote")} value={request.admin_note} /> : null}
              </>
            ) : null}
            {request.payout ? (
              <div className="flex items-center justify-between border-b border-zinc-100 py-2.5 text-sm last:border-0">
                <span className="text-zinc-500">{t("request.payout")}</span>
                <Link
                  href={Routes.dashboard.admin.payoutDetail(request.payout.id)}
                  className="font-semibold text-brand-700 hover:underline"
                >
                  {label(PayoutExecutionStatusFormOptions, request.payout.status)}
                  {request.payout.executed_at ? ` · ${formatDateTime(request.payout.executed_at)}` : ""}
                </Link>
              </div>
            ) : null}
          </Card>

          <Card title={t("cards.issuer")}>
            <SummaryRow label={t("issuer.legalName")} value={organization.legal_name ?? organization.name} />
            <SummaryRow label={t("issuer.vatNumber")} value={organization.vat_number ?? t("issuer.notSet")} muted={!organization.vat_number} />
            <SummaryRow label={t("issuer.taxOffice")} value={organization.doy ?? "-"} muted={!organization.doy} />
            <SummaryRow
              label={t("issuer.address")}
              value={
                [organization.address_line, organization.postal_code, organization.city, organization.country]
                  .filter(Boolean)
                  .join(", ") || "-"
              }
            />
          </Card>
        </div>
      </div>

      <Card title={t("cards.lockedTips", { count: request.distributions.length })}>
        {request.distributions.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-6 text-center text-xs text-zinc-500">
            {t("locked.none")}
          </p>
        ) : (
          <div className="divide-y divide-zinc-100">
            {request.distributions.map((distribution) => {
              const stale =
                isPendingReview &&
                (distribution.payout_status !== "PENDING" || distribution.payout_id !== null);
              return (
                <div
                  key={distribution.id}
                  className={cn("flex items-center justify-between gap-3 py-3 text-sm", stale && "opacity-60")}
                >
                  <div>
                    <div className="font-semibold text-ink-charcoal">
                      {tc("tipLabel", {
                        amount: money(distribution.tip.amount, distribution.tip.currency),
                      })}
                      {distribution.recipient_type === "EMPLOYEE" ? (
                        <span className="ml-1.5 text-xs font-medium text-zinc-400">
                          {t("locked.pooledStaffShare")}
                        </span>
                      ) : null}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {t(stale ? "locked.metaStale" : "locked.meta", {
                        status: label(PayoutStatusFormOptions, distribution.payout_status),
                        date: formatDateTime(distribution.tip.paid_at),
                      })}
                    </div>
                  </div>
                  <div className={cn("font-bold text-ink-charcoal", stale && "line-through")}>
                    {money(distribution.amount, request.currency)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {isPendingReview ? (
        <div className="sticky bottom-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200/80 bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
          <p className="text-xs text-zinc-500">
            {approveBlockedReason ?? t("actions.hint")}
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="destructive"
              disabled={approve.isPending || reject.isPending}
              onClick={() => setReviewAction("reject")}
              className="rounded-xl"
            >
              {t("actions.reject")}
            </Button>
            <Button
              type="button"
              disabled={!!approveBlockedReason || approve.isPending || reject.isPending}
              onClick={() => setReviewAction("approve")}
              className="rounded-xl bg-electric-lime text-ink-charcoal"
            >
              {t("actions.approve")}
            </Button>
          </div>
        </div>
      ) : null}

      <ReviewPayoutRequestDialog
        action={reviewAction}
        onClose={() => setReviewAction(null)}
        amountLabel={money(request.amount, request.currency)}
        storeName={request.store.name}
        isPending={approve.isPending || reject.isPending}
        onConfirm={handleReview}
      />
    </div>
  );
};
