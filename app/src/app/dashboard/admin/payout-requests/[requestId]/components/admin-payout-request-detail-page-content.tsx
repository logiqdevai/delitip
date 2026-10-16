"use client";

import { type FC, useState } from "react";
import Link from "next/link";
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
import { getPayoutAccountStatusLabel } from "@/config/constants/dropdowns/payments/payout-account-status-form.options";
import { getPayoutExecutionStatusLabel } from "@/config/constants/dropdowns/payments/payout-execution-status-form.options";
import { getPayoutStatusLabel } from "@/config/constants/dropdowns/tips/payout-status-form.options";
import { getInvoiceCheckIssueDescription } from "@/config/constants/dropdowns/payouts/invoice-check-issue-description.options";
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

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString(undefined, { dateStyle: "medium" });
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const personName = (
  user: { first_name: string | null; last_name: string | null; email: string } | null,
) => (user ? [user.first_name, user.last_name].filter(Boolean).join(" ") || user.email : "-");

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

const majorToLabel = (value: number | null | undefined, currency: string) =>
  value === null || value === undefined ? "—" : formatMoney(Math.round(value * 100), currency as never);

// Expected vs. on-invoice, one line per thing the automatic check compares.
const ChecksTable: FC<{ request: AdminPayoutRequestDetail }> = ({ request }) => {
  const extracted = isExtraction(request.check_extracted) ? request.check_extracted : null;
  const issues = new Set<InvoiceCheckIssue>(request.check_issues ?? []);
  const has = (...codes: InvoiceCheckIssue[]) => codes.some((code) => issues.has(code));

  const rows: { label: string; expected: string; found: string; ok: boolean | null }[] = [
    {
      label: "Total (incl. VAT)",
      expected: formatMoney(request.amount, request.currency),
      found: extracted ? majorToLabel(extracted.total_amount, request.currency) : "—",
      ok: extracted ? !has(InvoiceCheckIssues.TOTAL_MISMATCH, InvoiceCheckIssues.TOTAL_MISSING) : null,
    },
    {
      label: "Currency",
      expected: request.currency,
      found: extracted?.currency ?? "—",
      ok: extracted ? !has(InvoiceCheckIssues.CURRENCY_MISMATCH) : null,
    },
    {
      label: "Issuer VAT (store)",
      expected: request.store.organization.vat_number ?? "not on file",
      found: extracted?.issuer_vat_number ?? "—",
      ok: extracted
        ? !has(InvoiceCheckIssues.ISSUER_VAT_MISMATCH, InvoiceCheckIssues.ISSUER_VAT_MISSING, InvoiceCheckIssues.ORG_VAT_MISSING)
        : null,
    },
    {
      label: "Recipient VAT (platform)",
      expected: "configured in App Config",
      found: extracted?.recipient_vat_number ?? "—",
      ok: extracted ? !has(InvoiceCheckIssues.RECIPIENT_VAT_MISMATCH) : null,
    },
    {
      label: "Invoice number",
      expected: request.invoice_number ?? "not typed",
      found: extracted?.invoice_number ?? "—",
      ok: extracted ? !has(InvoiceCheckIssues.INVOICE_NUMBER_MISMATCH) : null,
    },
    {
      label: "Invoice date",
      expected: `after ${formatDate(request.period_to)}`,
      found: extracted?.invoice_date ?? "—",
      ok: extracted ? !has(InvoiceCheckIssues.DATE_SUSPICIOUS) : null,
    },
    {
      label: "Net + VAT",
      expected: "= total",
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
            <th className="px-3 py-2">Check</th>
            <th className="px-3 py-2">Expected</th>
            <th className="px-3 py-2">On invoice</th>
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
  const urlQuery = useAdminPayoutRequestInvoiceUrl(requestId);

  if (urlQuery.isPending) return <Skeleton className="h-[520px] w-full rounded-xl" />;
  if (urlQuery.isError || !urlQuery.data) {
    return (
      <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-10 text-center text-xs text-zinc-500">
        {urlQuery.error?.message ?? "Could not load the invoice."}
      </p>
    );
  }

  const { url } = urlQuery.data;
  return (
    <div className="space-y-2">
      <div className="overflow-hidden rounded-xl border border-zinc-200/80 bg-zinc-50">
        {mimetype === "application/pdf" ? (
          <iframe src={url} title="Invoice" className="h-[520px] w-full" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="Invoice" className="max-h-[520px] w-full object-contain" />
        )}
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:underline"
      >
        <ExternalLink className="size-3.5" strokeWidth={2} />
        Open in a new tab
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

  if (requestQuery.isPending) {
    return <DetailSkeleton fieldCount={8} />;
  }

  if (requestQuery.isError || !requestQuery.data) {
    return (
      <Empty className="border border-dashed border-zinc-200 bg-white px-4 py-16">
        <EmptyHeader>
          <EmptyTitle>Could not load this payout request</EmptyTitle>
          <EmptyDescription>
            {requestQuery.error?.message ?? "The request may not exist."}
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
      ? "Some locked tips changed since submission — reject so the store can re-request the corrected amount."
      : !accountActive
        ? "The store's payout account is not active, so a transfer can't be sent yet."
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
        Back to Payments & Payouts
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink-charcoal">
            {formatMoney(request.amount, request.currency)}
          </h1>
          <p className="mt-0.5 text-xs text-zinc-500">
            {request.store.name} · requested {formatDateTime(request.created_at)} by{" "}
            {personName(request.requested_by)}
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
            <strong>The last transfer attempt failed:</strong> {request.failure_reason}. The tips
            are still locked to this request — fix the cause and approve again.
          </span>
        </div>
      ) : null}

      {request.integrity.is_stale ? (
        <div className="flex gap-2.5 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-sm text-amber-900">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
          <span>
            <strong>{request.integrity.stale_count}</strong> of the{" "}
            {request.integrity.locked_count} locked tips changed since submission (likely a refund).
            The live amount is now {formatMoney(request.integrity.live_amount, request.currency)}, not{" "}
            {formatMoney(request.amount, request.currency)}, so this invoice can&apos;t be paid as
            is.
          </span>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Invoice">
          <InvoicePreview requestId={request.id} mimetype={request.invoice_document.mimetype} />
          <div className="mt-3">
            <SummaryRow label="File" value={request.invoice_document.filename.split("/").pop() ?? "-"} />
            <SummaryRow label="Invoice number (typed)" value={request.invoice_number ?? "-"} />
            {request.store_note ? <SummaryRow label="Note from store" value={request.store_note} /> : null}
          </div>
        </Card>

        <div className="space-y-6">
          <Card
            title="Automatic invoice check"
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
                Re-run check
              </Button>
            }
          >
            {request.check_status === InvoiceCheckStatuses.PENDING ? (
              <p className="text-xs text-zinc-500">
                The invoice is being read. This usually takes under a minute — refresh to see the result.
              </p>
            ) : request.check_status === InvoiceCheckStatuses.SKIPPED ? (
              <p className="text-xs text-zinc-500">
                Automatic checks are turned off in App Config (or no OpenAI key is configured). Review
                the invoice manually.
              </p>
            ) : request.check_status === InvoiceCheckStatuses.FAILED ? (
              <p className="text-xs text-red-700">
                The check could not run{extractionError ? `: ${extractionError}` : "."} Review the
                invoice manually or re-run it.
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
                        {getInvoiceCheckIssueDescription(issue)}
                      </li>
                    ))}
                    {softIssues.map((issue) => (
                      <li key={issue} className="flex gap-2 text-xs text-amber-800">
                        <TriangleAlert className="mt-0.5 size-3.5 shrink-0" strokeWidth={2} />
                        {getInvoiceCheckIssueDescription(issue)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-brand-700">
                    <Check className="size-3.5" strokeWidth={2.5} />
                    Everything on the invoice matches this request.
                  </p>
                )}
                {extractedNotes ? (
                  <p className="mt-2 text-xs text-zinc-500">Reader&apos;s note: {extractedNotes}</p>
                ) : null}
              </>
            ) : null}

            {request.checked_at ? (
              <p className="mt-3 text-[11px] text-zinc-400">
                {request.check_model ?? "model"} · {formatDateTime(request.checked_at)}
                {request.check_cost_usd !== null
                  ? ` · $${Number(request.check_cost_usd).toFixed(4)}`
                  : ""}
              </p>
            ) : null}
          </Card>

          <Card title="Request">
            <SummaryRow label="Store's own share" value={formatMoney(request.own_share_amount, request.currency)} />
            <SummaryRow label="Held for staff" value={formatMoney(request.held_for_staff_amount, request.currency)} />
            <SummaryRow
              label="Tips covered"
              value={`${request.distribution_count} · ${formatDate(request.period_from)} → ${formatDate(request.period_to)}`}
            />
            <SummaryRow label="Hold cutoff at submission" value={formatDateTime(request.hold_cutoff_at)} />
            <SummaryRow
              label="Store payout account"
              value={
                request.store.payout_account
                  ? `${getPayoutAccountStatusLabel(request.store.payout_account.status)}${request.store.payout_account.iban_last4 ? ` · •••• ${request.store.payout_account.iban_last4}` : ""}`
                  : "Not linked"
              }
            />
            {request.reviewed_at ? (
              <>
                <SummaryRow
                  label="Reviewed"
                  value={`${formatDateTime(request.reviewed_at)} by ${personName(request.reviewed_by)}`}
                />
                {request.admin_note ? <SummaryRow label="Admin note" value={request.admin_note} /> : null}
              </>
            ) : null}
            {request.payout ? (
              <div className="flex items-center justify-between border-b border-zinc-100 py-2.5 text-sm last:border-0">
                <span className="text-zinc-500">Payout</span>
                <Link
                  href={Routes.dashboard.admin.payoutDetail(request.payout.id)}
                  className="font-semibold text-brand-700 hover:underline"
                >
                  {getPayoutExecutionStatusLabel(request.payout.status)}
                  {request.payout.executed_at ? ` · ${formatDateTime(request.payout.executed_at)}` : ""}
                </Link>
              </div>
            ) : null}
          </Card>

          <Card title="Issuer on file (Tax Details)">
            <SummaryRow label="Legal name" value={organization.legal_name ?? organization.name} />
            <SummaryRow label="VAT number" value={organization.vat_number ?? "not set"} muted={!organization.vat_number} />
            <SummaryRow label="Tax office" value={organization.doy ?? "-"} muted={!organization.doy} />
            <SummaryRow
              label="Address"
              value={
                [organization.address_line, organization.postal_code, organization.city, organization.country]
                  .filter(Boolean)
                  .join(", ") || "-"
              }
            />
          </Card>
        </div>
      </div>

      <Card title={`Locked tips (${request.distributions.length})`}>
        {request.distributions.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-6 text-center text-xs text-zinc-500">
            No distributions are locked to this request.
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
                      Tip {formatMoney(distribution.tip.amount, distribution.tip.currency)}
                      {distribution.recipient_type === "EMPLOYEE" ? (
                        <span className="ml-1.5 text-xs font-medium text-zinc-400">pooled staff share</span>
                      ) : null}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {getPayoutStatusLabel(distribution.payout_status)} · paid{" "}
                      {formatDateTime(distribution.tip.paid_at)}
                      {stale ? " · changed since submission" : ""}
                    </div>
                  </div>
                  <div className={cn("font-bold text-ink-charcoal", stale && "line-through")}>
                    {formatMoney(distribution.amount, request.currency)}
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
            {approveBlockedReason ??
              "Approving starts the Viva bank transfer immediately and notifies the store."}
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="destructive"
              disabled={approve.isPending || reject.isPending}
              onClick={() => setReviewAction("reject")}
              className="rounded-xl"
            >
              Reject
            </Button>
            <Button
              type="button"
              disabled={!!approveBlockedReason || approve.isPending || reject.isPending}
              onClick={() => setReviewAction("approve")}
              className="rounded-xl bg-electric-lime text-ink-charcoal hover:bg-brand-700"
            >
              Approve & pay
            </Button>
          </div>
        </div>
      ) : null}

      <ReviewPayoutRequestDialog
        action={reviewAction}
        onClose={() => setReviewAction(null)}
        amountLabel={formatMoney(request.amount, request.currency)}
        storeName={request.store.name}
        isPending={approve.isPending || reject.isPending}
        onConfirm={handleReview}
      />
    </div>
  );
};
