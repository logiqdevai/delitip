"use client";

import { type FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ConfirmationDialog,
  useConfirmationDialog,
} from "@/components/ui/confirmation-dialog";
import { useStoreTips } from "@/features/tips/hooks/use-tips";
import { useRunStorePayouts } from "@/features/payouts/hooks/use-payouts";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import { formatMoney } from "@/lib/money";

// Mirrors the backend's default PAYOUT_HOLD_WINDOW_HOURS — for display only;
// the server is the source of truth for actual payout eligibility.
const PAYOUT_HOLD_WINDOW_HOURS = 48;

export const PendingDistributionsPanel: FC<{
  storeId: string;
  currency: Currency;
}> = ({ storeId, currency }) => {
  const tipsQuery = useStoreTips(storeId, {
    status: "COMPLETED",
    limit: 200,
  });
  const runPayouts = useRunStorePayouts(storeId);
  const confirmDialog = useConfirmationDialog();

  const tips = tipsQuery.data?.data ?? [];
  const [holdCutoff] = useState(
    () => Date.now() - PAYOUT_HOLD_WINDOW_HOURS * 60 * 60 * 1000,
  );
  const pending = tips.flatMap((tip) =>
    (tip.distributions ?? [])
      .filter((distribution) => distribution.payout_status === "PENDING")
      .map((distribution) => ({
        ...distribution,
        recipientLabel:
          distribution.recipient_type === "EMPLOYEE"
            ? (distribution.employee?.full_name ?? "Employee")
            : "Store",
        eligibleNow: tip.paid_at
          ? new Date(tip.paid_at).getTime() <= holdCutoff
          : false,
      })),
  );
  const pendingTotal = pending.reduce((sum, d) => sum + d.amount, 0);
  const eligibleTotal = pending
    .filter((d) => d.eligibleNow)
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-ink-charcoal">
          Pending distributions
        </h2>
        {!tipsQuery.isPending ? (
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-caption font-bold text-amber-700">
            {formatMoney(pendingTotal, currency)}
          </span>
        ) : null}
      </div>
      <p className="mt-0.5 text-xs text-zinc-400">
        Recent completed tips (up to 200) awaiting payout — not yet marked
        paid.
      </p>

      {tipsQuery.isPending ? (
        <Skeleton className="mt-3 h-24 w-full rounded-xl" />
      ) : tipsQuery.isError ? (
        <p className="mt-3 text-xs text-red-600">{tipsQuery.error.message}</p>
      ) : pending.length === 0 ? (
        <p className="mt-3 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 py-6 text-center text-xs text-zinc-500">
          Nothing pending right now.
        </p>
      ) : (
        <>
          <div className="mt-3 divide-y divide-zinc-100">
            {pending.slice(0, 20).map((distribution) => (
              <div
                key={distribution.id}
                className="flex items-center justify-between py-2 text-sm"
              >
                <div>
                  <span className="text-zinc-600">
                    {distribution.recipientLabel}
                  </span>
                  <span
                    className={`ml-2 text-[10px] font-semibold ${
                      distribution.eligibleNow
                        ? "text-brand-700"
                        : "text-zinc-400"
                    }`}
                  >
                    {distribution.eligibleNow ? "Eligible now" : "Held"}
                  </span>
                </div>
                <span className="font-semibold text-ink-charcoal">
                  {formatMoney(distribution.amount, currency)}
                </span>
              </div>
            ))}
            {pending.length > 20 ? (
              <p className="pt-2 text-[11px] text-zinc-400">
                +{pending.length - 20} more
              </p>
            ) : null}
          </div>

          <Button
            type="button"
            onClick={confirmDialog.openDialog}
            disabled={eligibleTotal === 0}
            className="mt-4 w-full rounded-xl bg-electric-lime text-ink-charcoal hover:bg-brand-700"
          >
            Pay out now
          </Button>
        </>
      )}

      <ConfirmationDialog
        state={confirmDialog}
        variant="default"
        title="Pay out eligible distributions?"
        description={`This sends ${formatMoney(eligibleTotal, currency)} to your Store and any employees with a linked, active payout account. Held distributions and recipients without an active account are skipped.`}
        confirmLabel="Pay out now"
        isPending={runPayouts.isPending}
        onConfirm={async () => {
          await runPayouts.mutateAsync({});
        }}
      />
    </div>
  );
};
