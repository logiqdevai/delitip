"use client";

import { type FC, useState } from "react";
import { CheckCircle2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { IbanPayoutAccountDialog } from "@/components/payments/iban-payout-account-dialog";
import {
  useCreateStorePayoutAccount,
  useStorePayoutAccount,
} from "@/features/payout-accounts/hooks/use-payout-accounts";
import { getPayoutAccountStatusLabel } from "@/config/constants/dropdowns/payments/payout-account-status-form.options";
import { cn } from "@/lib/utils";

export const PayoutAccountCard: FC<{ storeId: string }> = ({ storeId }) => {
  const accountQuery = useStorePayoutAccount(storeId);
  const createAccount = useCreateStorePayoutAccount(storeId);
  const [dialogOpen, setDialogOpen] = useState(false);

  const account = accountQuery.data;

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-center gap-2">
        <Wallet className="size-4 text-zinc-400" strokeWidth={2} />
        <h2 className="text-sm font-bold text-ink-charcoal">
          Store payout account
        </h2>
      </div>

      {accountQuery.isPending ? (
        <Skeleton className="mt-3 h-16 w-full rounded-xl" />
      ) : !account ? (
        <div className="mt-3 space-y-3">
          <p className="text-xs text-zinc-500">
            Link your Store&apos;s business IBAN so it can receive its share
            of tips via bank transfer.
          </p>
          <Button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="rounded-xl bg-electric-lime text-ink-charcoal hover:bg-brand-700"
          >
            Link payout account
          </Button>
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <CheckCircle2
              className={cn(
                "size-4",
                account.status === "ACTIVE" ? "text-brand-700" : "text-zinc-300",
              )}
            />
            <span>
              {account.provider} · IBAN ····{account.iban_last4 ?? "----"}
            </span>
          </div>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-caption font-bold",
              account.status === "ACTIVE"
                ? "bg-brand-50 text-brand-700"
                : "bg-amber-50 text-amber-700",
            )}
          >
            {getPayoutAccountStatusLabel(account.status)}
          </span>
        </div>
      )}

      <IbanPayoutAccountDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Link store payout account"
        description="Your Store's business IBAN — used to send your share of tips via bank transfer."
        mutation={createAccount}
      />
    </div>
  );
};
