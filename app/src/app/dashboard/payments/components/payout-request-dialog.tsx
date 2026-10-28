"use client";

import { type FC, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Copy,
  FileText,
  ReceiptText,
  Sparkles,
  TriangleAlert,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FilePicker } from "@/components/ui/file-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import {
  useCreatePayoutRequest,
  usePayoutRequestPreview,
} from "@/features/payout-requests/hooks/use-payout-requests";
import {
  INVOICE_ACCEPTED_MIME_TYPES,
  INVOICE_MAX_SIZE_BYTES,
  type PayoutRequestPreview,
} from "@/features/payout-requests/interfaces/payout-requests.interfaces";
import { useUploadDocument } from "@/features/documents/hooks/use-documents";
import { DocumentTypes } from "@/features/documents/interfaces/documents.interfaces";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

type Step = "overview" | "invoice" | "done";

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

const Figure: FC<{ label: string; value: string; emphasis?: boolean }> = ({
  label,
  value,
  emphasis,
}) => (
  <div>
    <p className="text-xs text-zinc-400">{label}</p>
    <p
      className={cn(
        "font-bold",
        emphasis ? "text-2xl text-ink-charcoal" : "text-sm text-ink-charcoal",
      )}
    >
      {value}
    </p>
  </div>
);

const CopyRow: FC<{ label: string; value: string | null }> = ({
  label,
  value,
}) => {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-3 border-b border-zinc-100 py-2 text-sm last:border-0">
      <div className="min-w-0">
        <p className="text-xs text-zinc-400">{label}</p>
        <p className="truncate font-semibold text-ink-charcoal">{value}</p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label={`Copy ${label}`}
        className="size-8 shrink-0 rounded-full px-0 text-zinc-500 hover:text-ink-charcoal"
        onClick={() => {
          void navigator.clipboard?.writeText(value).then(() =>
            toast.add({ title: `${label} copied`, type: "success" }),
          );
        }}
      >
        <Copy className="size-3.5" />
      </Button>
    </div>
  );
};

const OverviewStep: FC<{ preview: PayoutRequestPreview; currency: Currency }> = ({
  preview,
  currency,
}) => (
  <div className="space-y-4">
    <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-4">
      <Figure
        label="You will be paid"
        value={formatMoney(preview.amount, currency)}
        emphasis
      />
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Figure
          label="Your share"
          value={formatMoney(preview.own_share_amount, currency)}
        />
        <Figure
          label="Held for staff"
          value={formatMoney(preview.held_for_staff_amount, currency)}
        />
      </div>
    </div>

    <div className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200/80 bg-white px-4">
      <div className="flex items-center justify-between py-2.5 text-sm">
        <span className="text-zinc-500">Tips covered</span>
        <span className="font-semibold text-ink-charcoal">
          {preview.distribution_count} · {formatDate(preview.period_from)} →{" "}
          {formatDate(preview.period_to)}
        </span>
      </div>
      <div className="flex items-center justify-between py-2.5 text-sm">
        <span className="text-zinc-500">Already paid to date</span>
        <span className="font-semibold text-ink-charcoal">
          {formatMoney(preview.already_paid_total_amount, currency)}
          {preview.last_paid_out_at ? (
            <span className="ml-1 text-xs font-medium text-zinc-400">
              · last {formatDate(preview.last_paid_out_at)}
            </span>
          ) : null}
        </span>
      </div>
    </div>

    <p className="text-caption leading-snug text-zinc-500">
      Only tips paid more than {preview.hold_window_hours}h ago and confirmed
      by Viva are included. Newer tips roll into your next request.
      {preview.held_for_staff_amount > 0
        ? " The staff portion is money you'll be holding for your team — track it under Staff balances."
        : ""}
    </p>

    {preview.payout_account_status !== "ACTIVE" ? (
      <div className="flex gap-2.5 rounded-xl bg-amber-50/60 px-3.5 py-3 text-caption leading-snug text-amber-900">
        <TriangleAlert className="mt-0.5 size-3.5 shrink-0" strokeWidth={2} />
        <span>
          Your store payout account is not active yet. You can still submit the
          request, but the transfer can only be sent once it is linked and
          verified.
        </span>
      </div>
    ) : null}
  </div>
);

const InvoiceStep: FC<{
  preview: PayoutRequestPreview;
  currency: Currency;
  file: File | null;
  onFileChange: (file: File | null) => void;
  invoiceNumber: string;
  onInvoiceNumberChange: (value: string) => void;
  note: string;
  onNoteChange: (value: string) => void;
  isUploading: boolean;
}> = ({
  preview,
  currency,
  file,
  onFileChange,
  invoiceNumber,
  onInvoiceNumberChange,
  note,
  onNoteChange,
  isUploading,
}) => {
  const hasInvoiceDetails =
    preview.invoice_to.legal_name ||
    preview.invoice_to.vat_number ||
    preview.invoice_to.address;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-zinc-200/80 bg-white px-4 py-3">
        <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-zinc-500">
          <ReceiptText className="size-3.5" strokeWidth={2} />
          Issue an invoice to
        </div>
        {hasInvoiceDetails ? (
          <>
            <CopyRow label="Legal name" value={preview.invoice_to.legal_name} />
            <CopyRow label="VAT number" value={preview.invoice_to.vat_number} />
            <CopyRow label="Tax office" value={preview.invoice_to.tax_office} />
            <CopyRow label="Address" value={preview.invoice_to.address} />
          </>
        ) : (
          <p className="py-2 text-sm text-zinc-500">
            Invoice details will be shared with you by Delitip.
          </p>
        )}
        <CopyRow
          label="Invoice amount (before VAT)"
          value={formatMoney(preview.amount, currency)}
        />
        <p className="pt-2 text-caption leading-snug text-zinc-500">
          The amount before VAT on the invoice must be exactly{" "}
          <strong className="text-ink-charcoal">
            {formatMoney(preview.amount, currency)}
          </strong>
          . Add your VAT on top, as you normally would.
        </p>
      </div>

      {preview.instructions ? (
        <div className="rounded-xl bg-brand-50/60 px-3.5 py-3 text-caption leading-snug text-brand-900">
          {preview.instructions}
        </div>
      ) : null}

      <FilePicker
        label="Invoice file"
        value={file}
        onChange={onFileChange}
        accept={INVOICE_ACCEPTED_MIME_TYPES}
        maxSizeBytes={INVOICE_MAX_SIZE_BYTES}
        isPending={isUploading}
      />

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="payout-request-invoice-number">
            Invoice number{" "}
            <span className="font-normal text-zinc-400">(optional)</span>
          </Label>
          <Input
            id="payout-request-invoice-number"
            value={invoiceNumber}
            onChange={(event) => onInvoiceNumberChange(event.target.value)}
            placeholder="e.g. A-0042"
            maxLength={80}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="payout-request-note">
            Note for Delitip{" "}
            <span className="font-normal text-zinc-400">(optional)</span>
          </Label>
          <Textarea
            id="payout-request-note"
            value={note}
            onChange={(event) => onNoteChange(event.target.value)}
            rows={2}
            maxLength={1000}
            placeholder="Anything the reviewer should know"
          />
        </div>
      </div>
    </div>
  );
};

const DoneStep: FC<{ amount: number; currency: Currency }> = ({
  amount,
  currency,
}) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50/40 px-4 py-3">
      <CheckCircle2 className="size-5 shrink-0 text-brand-700" strokeWidth={2} />
      <div>
        <p className="text-sm font-semibold text-ink-charcoal">
          Request for {formatMoney(amount, currency)} submitted
        </p>
        <p className="text-caption text-zinc-500">
          Submitted {formatDateTime(new Date().toISOString())}
        </p>
      </div>
    </div>
    <ol className="space-y-2.5 text-sm">
      {[
        {
          icon: Sparkles,
          title: "We read your invoice",
          body: "An automatic check compares it with the amount above in about a minute.",
        },
        {
          icon: FileText,
          title: "Delitip reviews it",
          body: "An admin approves it or sends it back with a note if something is off.",
        },
        {
          icon: Wallet,
          title: "The transfer is sent",
          body: "On approval the bank transfer starts; you'll get an alert and an email.",
        },
      ].map(({ icon: Icon, title, body }) => (
        <li key={title} className="flex gap-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
            <Icon className="size-3.5" strokeWidth={2} />
          </span>
          <div>
            <p className="font-semibold text-ink-charcoal">{title}</p>
            <p className="text-caption text-zinc-500">{body}</p>
          </div>
        </li>
      ))}
    </ol>
  </div>
);

export const PayoutRequestDialog: FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: string;
  currency: Currency;
}> = ({ open, onOpenChange, storeId, currency }) => {
  const [step, setStep] = useState<Step>("overview");
  const [file, setFile] = useState<File | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [note, setNote] = useState("");
  const [submittedAmount, setSubmittedAmount] = useState(0);

  const previewQuery = usePayoutRequestPreview(storeId, open);
  const uploadDocument = useUploadDocument();
  const createRequest = useCreatePayoutRequest(storeId);
  const isSubmitting = uploadDocument.isPending || createRequest.isPending;

  // Reset during render when the dialog opens so a fresh open never shows
  // the previous run's step or file.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setStep("overview");
      setFile(null);
      setInvoiceNumber("");
      setNote("");
    }
  }

  const preview = previewQuery.data;
  const resolvedCurrency = (preview?.currency ?? currency) as Currency;

  const handleSubmit = async () => {
    if (!file || !preview) return;
    try {
      const document = await uploadDocument.mutateAsync({
        file,
        type: DocumentTypes.INVOICE,
      });
      await createRequest.mutateAsync({
        invoice_document_id: document.id,
        ...(invoiceNumber.trim() ? { invoice_number: invoiceNumber.trim() } : {}),
        ...(note.trim() ? { store_note: note.trim() } : {}),
      });
      setSubmittedAmount(preview.amount);
      setStep("done");
    } catch {
      // Toasted by the mutation hooks; stay on the form so nothing is lost.
    }
  };

  const title =
    step === "overview"
      ? "Request a payout"
      : step === "invoice"
        ? "Upload your invoice"
        : "Payout request submitted";
  const description =
    step === "overview"
      ? "Here's what you'll be paid and the tips it covers. Next you'll issue an invoice for exactly this amount."
      : step === "invoice"
        ? "Issue the invoice to the details below, then upload it as a PDF or photo."
        : "We'll take it from here.";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isSubmitting) return;
        onOpenChange(next);
      }}
    >
      <DialogContent
        showCloseButton={!isSubmitting}
        className="max-h-[calc(100dvh-2rem)] grid-rows-[auto_minmax(0,1fr)_auto] sm:max-w-lg"
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="-mx-6 min-h-0 overflow-y-auto px-6">
        {step !== "done" && previewQuery.isPending ? (
          <div className="space-y-2">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>
        ) : step !== "done" && (previewQuery.isError || !preview) ? (
          <p className="text-caption text-red-600">
            {previewQuery.error?.message ?? "Could not load the payout preview."}
          </p>
        ) : step === "overview" && preview ? (
          preview.open_request ? (
            <div className="flex gap-2.5 rounded-xl bg-amber-50/60 px-3.5 py-3 text-caption leading-snug text-amber-900">
              <Building2 className="mt-0.5 size-3.5 shrink-0" strokeWidth={2} />
              <span>
                You already have a request for{" "}
                {formatMoney(preview.open_request.amount, resolvedCurrency)}{" "}
                awaiting review. Cancel it from the Payouts tab if you need to
                start over.
              </span>
            </div>
          ) : preview.amount === 0 ? (
            <p className="text-caption text-zinc-500">
              Nothing is payable to your store right now.
            </p>
          ) : (
            <OverviewStep preview={preview} currency={resolvedCurrency} />
          )
        ) : step === "invoice" && preview ? (
          <InvoiceStep
            preview={preview}
            currency={resolvedCurrency}
            file={file}
            onFileChange={setFile}
            invoiceNumber={invoiceNumber}
            onInvoiceNumberChange={setInvoiceNumber}
            note={note}
            onNoteChange={setNote}
            isUploading={uploadDocument.isPending}
          />
        ) : step === "done" ? (
          <DoneStep amount={submittedAmount} currency={resolvedCurrency} />
        ) : null}
        </div>

        <DialogFooter>
          {step === "overview" ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={!preview || preview.amount === 0 || !!preview.open_request}
                onClick={() => setStep("invoice")}
                className="bg-electric-lime text-ink-charcoal"
              >
                Continue to invoice
              </Button>
            </>
          ) : step === "invoice" ? (
            <>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => setStep("overview")}
              >
                Back
              </Button>
              <ActionButtonWithPending
                type="button"
                isPending={isSubmitting}
                disabled={!file}
                onClick={() => void handleSubmit()}
                className="bg-electric-lime text-ink-charcoal"
              >
                Submit request
              </ActionButtonWithPending>
            </>
          ) : (
            <Button type="button" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
