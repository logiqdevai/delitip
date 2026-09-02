"use client";

import { type FC, useState } from "react";
import { Building2, CheckCircle2, User, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useRunStorePayouts,
  useStorePayoutsPreview,
} from "@/features/payouts/hooks/use-payouts";
import type {
  PayoutPreviewRecipient,
  PayoutSkipReason,
  RunPayoutResponse,
} from "@/features/payouts/interfaces/payouts.interfaces";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

const SKIP_REASON_LABELS: Record<PayoutSkipReason, string> = {
  NO_PAYOUT_ACCOUNT: "No payout account linked",
  ACCOUNT_NOT_ACTIVE: "Payout account not active yet",
  NO_LINKED_USER: "No linked login for this employee",
  TRANSFER_FAILED: "Bank transfer failed",
};

type RecipientOutcome =
  | { kind: "will_skip"; reason?: PayoutSkipReason }
  | { kind: "sent" }
  | { kind: "failed"; reason?: string | null };

const recipientKey = (r: { recipient_type: string; employee_id?: string | null }) =>
  r.recipient_type === "STORE" ? "STORE" : `EMPLOYEE:${r.employee_id}`;

const resolveOutcome = (
  recipient: PayoutPreviewRecipient,
  result: RunPayoutResponse | null,
): RecipientOutcome => {
  if (!recipient.will_be_paid) {
    return { kind: "will_skip", reason: recipient.skip_reason };
  }
  if (!result) {
    // Not run yet — preview phase treats "will be paid" as the default look.
    return { kind: "sent" };
  }
  const key = recipientKey(recipient);
  const payout = result.payouts.find((p) => recipientKey(p) === key);
  if (payout?.status === "FAILED") {
    return { kind: "failed", reason: payout.failure_reason };
  }
  if (payout) {
    return { kind: "sent" };
  }
  // Lost a claim race to another concurrent run — rare, but don't claim success.
  return { kind: "failed", reason: "Could not be claimed for this run" };
};

const RecipientRow: FC<{
  recipient: PayoutPreviewRecipient;
  outcome?: RecipientOutcome;
}> = ({ recipient, outcome }) => {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
          {recipient.recipient_type === "STORE" ? (
            <Building2 className="size-3.5" strokeWidth={2} />
          ) : (
            <User className="size-3.5" strokeWidth={2} />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink-charcoal">
            {recipient.name}
          </p>
          {outcome?.kind === "will_skip" ? (
            <p className="text-caption text-zinc-400">
              {outcome.reason ? SKIP_REASON_LABELS[outcome.reason] : "Held"}
            </p>
          ) : outcome?.kind === "failed" ? (
            <p className="text-caption text-red-600">
              {outcome.reason ?? "Transfer failed"}
            </p>
          ) : null}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span
          className={cn(
            "font-bold",
            outcome?.kind === "will_skip"
              ? "text-zinc-400 line-through"
              : "text-ink-charcoal",
          )}
        >
          {formatMoney(recipient.amount, recipient.currency)}
        </span>
        {outcome?.kind === "sent" ? (
          <CheckCircle2 className="size-4 text-brand-600" strokeWidth={2} />
        ) : outcome?.kind === "failed" ? (
          <XCircle className="size-4 text-red-500" strokeWidth={2} />
        ) : null}
      </div>
    </div>
  );
};

export const PayOutNowDialog: FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: string;
  currency: Currency;
}> = ({ open, onOpenChange, storeId, currency }) => {
  const [result, setResult] = useState<RunPayoutResponse | null>(null);
  const previewQuery = useStorePayoutsPreview(storeId, open);
  const runPayouts = useRunStorePayouts(storeId);

  // Reset during render (not an effect) when `open` flips true, so a fresh
  // open never shows a stale result from the previous run.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setResult(null);
  }

  const preview = previewQuery.data;
  const payableRecipients = preview?.recipients.filter((r) => r.will_be_paid) ?? [];
  const heldRecipients = preview?.recipients.filter((r) => !r.will_be_paid) ?? [];

  const handleConfirm = async () => {
    try {
      const response = await runPayouts.mutateAsync({});
      setResult(response);
    } catch {
      // Toasted by useRunStorePayouts's onError — stay on the preview so the
      // owner can retry without losing the breakdown they were looking at.
    }
  };

  const sentCount =
    result?.payouts.filter((p) => p.status !== "FAILED").length ?? 0;
  const failedCount =
    (result?.payouts.filter((p) => p.status === "FAILED").length ?? 0) +
    Math.max(
      payableRecipients.length - (result?.payouts.length ?? 0),
      0,
    );

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (runPayouts.isPending) return;
        onOpenChange(next);
      }}
    >
      <DialogContent
        showCloseButton={!runPayouts.isPending}
        className="sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle>
            {result ? "Payout results" : "Pay out eligible distributions?"}
          </DialogTitle>
          <DialogDescription>
            {result
              ? [
                  `${sentCount} sent`,
                  failedCount > 0 ? `${failedCount} failed` : null,
                  heldRecipients.length > 0
                    ? `${heldRecipients.length} held`
                    : null,
                ]
                  .filter(Boolean)
                  .join(", ") + "."
              : "This sends money to your Store and any employees with a linked, active payout account. Held distributions and recipients without an active account are skipped."}
          </DialogDescription>
        </DialogHeader>

        {previewQuery.isPending ? (
          <div className="space-y-2">
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        ) : previewQuery.isError ? (
          <p className="text-caption text-red-600">
            {previewQuery.error.message}
          </p>
        ) : preview && preview.recipients.length > 0 ? (
          <div className="divide-y divide-zinc-100 overflow-hidden rounded-xl border border-zinc-200/80">
            {payableRecipients.map((recipient) => (
              <RecipientRow
                key={recipientKey(recipient)}
                recipient={recipient}
                outcome={result ? resolveOutcome(recipient, result) : undefined}
              />
            ))}
            {heldRecipients.map((recipient) => (
              <RecipientRow
                key={recipientKey(recipient)}
                recipient={recipient}
                outcome={resolveOutcome(recipient, result)}
              />
            ))}
            <div className="flex items-center justify-between bg-zinc-50/60 px-4 py-2.5">
              <span className="text-sm font-semibold text-zinc-500">
                {result ? "Total sent" : "Total"}
              </span>
              <span className="font-bold text-ink-charcoal">
                {formatMoney(
                  result
                    ? (result.payouts
                        .filter((p) => p.status !== "FAILED")
                        .reduce((sum, p) => sum + p.amount, 0) ?? 0)
                    : (preview.total_amount ?? 0),
                  currency,
                )}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-caption text-zinc-500">
            Nothing is eligible for payout right now.
          </p>
        )}

        <DialogFooter>
          {result ? (
            <Button type="button" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                disabled={runPayouts.isPending}
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <ActionButtonWithPending
                type="button"
                isPending={runPayouts.isPending}
                disabled={payableRecipients.length === 0}
                onClick={() => void handleConfirm()}
                className="bg-electric-lime text-ink-charcoal hover:bg-brand-700"
              >
                Pay out now
              </ActionButtonWithPending>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
