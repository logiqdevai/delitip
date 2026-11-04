"use client";

import { type FC, useState } from "react";
import { CheckCircle2, UserX, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { IbanPayoutAccountDialog } from "@/components/payments/iban-payout-account-dialog";
import {
  useCreateEmployeePayoutAccount,
  useEmployeePayoutAccount,
  useRefreshEmployeePayoutAccountStatus,
} from "@/features/payout-accounts/hooks/use-payout-accounts";
import { PayoutAccountStatusFormOptions } from "@/config/constants/dropdowns/payments/payout-account-status-form.options";
import { useDropdownLabel } from "@/hooks/use-dropdown-options";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { cn } from "@/lib/utils";

export const EmployeePayoutAccountCard: FC<{
  employeeId: string;
  hasLinkedUser: boolean;
}> = ({ employeeId, hasLinkedUser }) => {
  const t = useTranslations("dashboard.team.employees.payoutAccount");
  const dropdownLabel = useDropdownLabel();
  const { role } = useWorkspace();
  const isOwner = role === "OWNER";

  const accountQuery = useEmployeePayoutAccount(employeeId, hasLinkedUser);
  const createAccount = useCreateEmployeePayoutAccount(employeeId);
  const refreshStatus = useRefreshEmployeePayoutAccountStatus(employeeId);
  const [dialogOpen, setDialogOpen] = useState(false);

  const account = accountQuery.data;

  if (!isOwner) return null;

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white px-4 py-5 shadow-xs">
      <div className="flex items-center gap-2">
        <Wallet className="size-4 text-zinc-400" strokeWidth={2} />
        <h2 className="text-sm font-bold text-ink-charcoal">
          {t("title")}
        </h2>
      </div>

      {!hasLinkedUser ? (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-3 text-xs text-zinc-500">
          <UserX className="mt-0.5 size-3.5 shrink-0" strokeWidth={2} />
          <span>
            {t("needsSignIn")}
          </span>
        </div>
      ) : accountQuery.isPending ? (
        <Skeleton className="mt-3 h-16 w-full rounded-xl" />
      ) : !account ? (
        <div className="mt-3 space-y-3">
          <p className="text-xs text-zinc-500">
            {t("linkDescription")}
          </p>
          <Button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="rounded-xl bg-electric-lime text-ink-charcoal"
          >
            {t("link")}
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
              {t("ibanLine", { provider: account.provider, last4: account.iban_last4 ?? "----" })}
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
              {dropdownLabel(PayoutAccountStatusFormOptions, account.status)}
            </span>
            {account.status === "PENDING" ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => refreshStatus.mutate()}
                disabled={refreshStatus.isPending}
                className="h-7 rounded-lg px-2.5 text-base"
              >
                {refreshStatus.isPending ? t("checking") : t("checkStatus")}
              </Button>
            ) : null}
          </div>
        </div>
      )}

      <IbanPayoutAccountDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={t("dialogTitle")}
        description={t("dialogDescription")}
        mutation={createAccount}
      />
    </div>
  );
};
