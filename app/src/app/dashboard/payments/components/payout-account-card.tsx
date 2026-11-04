"use client";

import { type FC, useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, ShieldCheck, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { IbanPayoutAccountDialog } from "@/components/payments/iban-payout-account-dialog";
import { ConnectedAccountPayoutDialog } from "@/components/payments/connected-account-payout-dialog";
import {
  useCreateStorePayoutAccount,
  useRefreshStorePayoutAccountStatus,
  useStorePayoutAccount,
} from "@/features/payout-accounts/hooks/use-payout-accounts";
import { PayoutAccountStatusFormOptions } from "@/config/constants/dropdowns/payments/payout-account-status-form.options";
import { useDropdownLabel } from "@/hooks/use-dropdown-options";
import { usePayoutPolicy } from "@/features/app-config/hooks/use-app-config";
import { cn } from "@/lib/utils";

export const PayoutAccountCard: FC<{ storeId: string }> = ({ storeId }) => {
  const t = useTranslations("dashboard.money.payoutAccountCard");
  const dropdownLabel = useDropdownLabel();
  const accountQuery = useStorePayoutAccount(storeId);
  const createAccount = useCreateStorePayoutAccount(storeId);
  const refreshStatus = useRefreshStorePayoutAccountStatus(storeId);
  const connectedAccountsEnabled =
    usePayoutPolicy().data?.connected_account_payouts_enabled ?? false;
  const [ibanDialogOpen, setIbanDialogOpen] = useState(false);
  const [connectedAccountDialogOpen, setConnectedAccountDialogOpen] = useState(false);

  const account = accountQuery.data;
  const isConnectedAccount = account?.payout_method === "CONNECTED_ACCOUNT";

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white px-4 py-5 shadow-xs">
      <div className="flex items-center gap-2">
        <Wallet className="size-4 text-zinc-400" strokeWidth={2} />
        <h2 className="text-sm font-bold text-ink-charcoal">
          {t("title")}
        </h2>
      </div>

      {accountQuery.isPending ? (
        <Skeleton className="mt-3 h-16 w-full rounded-xl" />
      ) : !account ? (
        <div className="mt-3 space-y-3">
          <p className="text-xs text-zinc-500">
            {t(connectedAccountsEnabled ? "connectHintViva" : "connectHint")}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => setIbanDialogOpen(true)}
              className="rounded-xl bg-electric-lime text-ink-charcoal"
            >
              {t("linkAccount")}
            </Button>
            {connectedAccountsEnabled ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setConnectedAccountDialogOpen(true)}
                className="rounded-xl"
              >
                {t("connectViva")}
              </Button>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            {isConnectedAccount ? (
              <ShieldCheck
                className={cn(
                  "size-4",
                  account.status === "ACTIVE" ? "text-brand-700" : "text-zinc-300",
                )}
              />
            ) : (
              <CheckCircle2
                className={cn(
                  "size-4",
                  account.status === "ACTIVE" ? "text-brand-700" : "text-zinc-300",
                )}
              />
            )}
            <span>
              {isConnectedAccount
                ? t("connectedAccount", { provider: account.provider })
                : t("ibanAccount", {
                    provider: account.provider,
                    last4: account.iban_last4 ?? "----",
                  })}
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
            {account.status === "PENDING" && isConnectedAccount && account.onboarding_url ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  window.location.href = account.onboarding_url!;
                }}
                className="h-7 rounded-lg px-2.5 text-base"
              >
                {t("finishOnboarding")}
              </Button>
            ) : null}
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
        open={ibanDialogOpen}
        onOpenChange={setIbanDialogOpen}
        title={t("ibanDialogTitle")}
        description={t("ibanDialogDescription")}
        mutation={createAccount}
      />

      <ConnectedAccountPayoutDialog
        open={connectedAccountDialogOpen}
        onOpenChange={setConnectedAccountDialogOpen}
        title={t("vivaDialogTitle")}
        description={t("vivaDialogDescription")}
        mutation={createAccount}
      />
    </div>
  );
};
