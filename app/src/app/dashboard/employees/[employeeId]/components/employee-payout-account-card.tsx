"use client";

import { type FC, useState } from "react";
import { CheckCircle2, UserX, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { IbanPayoutAccountDialog } from "@/components/payments/iban-payout-account-dialog";
import {
  useCreateEmployeePayoutAccount,
  useEmployeePayoutAccount,
  useRefreshEmployeePayoutAccountStatus,
} from "@/features/payout-accounts/hooks/use-payout-accounts";
import { getPayoutAccountStatusLabel } from "@/config/constants/dropdowns/payments/payout-account-status-form.options";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { cn } from "@/lib/utils";

export const EmployeePayoutAccountCard: FC<{
  employeeId: string;
  hasLinkedUser: boolean;
}> = ({ employeeId, hasLinkedUser }) => {
  const { role } = useWorkspace();
  const isOwner = role === "OWNER";

  const accountQuery = useEmployeePayoutAccount(employeeId, hasLinkedUser);
  const createAccount = useCreateEmployeePayoutAccount(employeeId);
  const refreshStatus = useRefreshEmployeePayoutAccountStatus(employeeId);
  const [dialogOpen, setDialogOpen] = useState(false);

  const account = accountQuery.data;

  if (!isOwner) return null;

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-center gap-2">
        <Wallet className="size-4 text-zinc-400" strokeWidth={2} />
        <h2 className="text-sm font-bold text-ink-charcoal">
          Payout account
        </h2>
      </div>

      {!hasLinkedUser ? (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-500">
          <UserX className="mt-0.5 size-3.5 shrink-0" strokeWidth={2} />
          <span>
            This employee needs to sign in at least once before a payout
            account can be added for them.
          </span>
        </div>
      ) : accountQuery.isPending ? (
        <Skeleton className="mt-3 h-16 w-full rounded-xl" />
      ) : !account ? (
        <div className="mt-3 space-y-3">
          <p className="text-xs text-zinc-500">
            Link this employee&apos;s personal IBAN on their behalf so they
            can receive their share of tips via bank transfer.
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
          <div className="flex items-center gap-2">
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
            {account.status === "PENDING" ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => refreshStatus.mutate()}
                disabled={refreshStatus.isPending}
                className="h-7 rounded-lg px-2.5 text-caption"
              >
                {refreshStatus.isPending ? "Checking…" : "Check status"}
              </Button>
            ) : null}
          </div>
        </div>
      )}

      <IbanPayoutAccountDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Link employee payout account"
        description="This employee's personal IBAN - used to send their share of tips via bank transfer."
        mutation={createAccount}
      />
    </div>
  );
};
