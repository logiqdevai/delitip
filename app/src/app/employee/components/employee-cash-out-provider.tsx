"use client";

import {
  createContext,
  type FC,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  ConfirmationDialog,
  useConfirmationDialog,
} from "@/components/ui/confirmation-dialog";
import { IbanPayoutAccountDialog } from "@/components/payments/iban-payout-account-dialog";
import { useCurrentEmployee } from "@/features/employees/hooks/use-employees";
import { useEmployeeTips } from "@/features/tips/hooks/use-tips";
import {
  useCreateMyPayoutAccount,
  useMyPayoutAccount,
} from "@/features/payout-accounts/hooks/use-payout-accounts";
import { getPayoutAccountStatusLabel } from "@/config/constants/dropdowns/payments/payout-account-status-form.options";
import { formatMoney } from "@/lib/money";

const BALANCE_QUERY = { limit: 200 };

interface EmployeeCashOutContextValue {
  balanceMinor: number;
  formattedBalance: string;
  isBalancePending: boolean;
  openCashOut: () => void;
}

const EmployeeCashOutContext =
  createContext<EmployeeCashOutContextValue | null>(null);

export const useEmployeeCashOut = () => {
  const context = useContext(EmployeeCashOutContext);
  if (!context) {
    throw new Error(
      "useEmployeeCashOut must be used within EmployeeCashOutProvider",
    );
  }
  return context;
};

interface EmployeeCashOutProviderProps {
  children: ReactNode;
}

export const EmployeeCashOutProvider: FC<EmployeeCashOutProviderProps> = ({
  children,
}) => {
  const { employeeId, store } = useCurrentEmployee();
  const tipsQuery = useEmployeeTips(employeeId ?? "", BALANCE_QUERY);
  const payoutAccountQuery = useMyPayoutAccount(!!employeeId);
  const createPayoutAccount = useCreateMyPayoutAccount();
  const infoDialog = useConfirmationDialog();
  const [formOpen, setFormOpen] = useState(false);

  const currency = store?.currency ?? "EUR";
  const balanceMinor = (tipsQuery.data?.data ?? [])
    .filter((distribution) => distribution.payout_status === "PENDING")
    .reduce((sum, distribution) => sum + distribution.amount, 0);
  const formattedBalance = formatMoney(balanceMinor, currency);

  const account = payoutAccountQuery.data;
  const isPayoutActive = account?.status === "ACTIVE";

  const value = useMemo(
    () => ({
      balanceMinor,
      formattedBalance,
      isBalancePending: tipsQuery.isPending,
      openCashOut: () => {
        if (!account) {
          setFormOpen(true);
        } else {
          infoDialog.openDialog();
        }
      },
    }),
    [balanceMinor, formattedBalance, tipsQuery.isPending, account, infoDialog],
  );

  return (
    <EmployeeCashOutContext.Provider value={value}>
      {children}

      <ConfirmationDialog
        state={infoDialog}
        variant="default"
        title={isPayoutActive ? "Cash-out balance" : "Payout account status"}
        description={
          isPayoutActive
            ? `You have ${formattedBalance} pending from unpaid tip distributions. Your Store's owner releases payouts — you'll see them appear here once paid.`
            : `Your personal IBAN is linked but ${account ? getPayoutAccountStatusLabel(account.status).toLowerCase() : "pending"}. You'll be able to receive payouts once it's active.`
        }
        confirmLabel="Got it"
        cancelLabel="Close"
        onConfirm={async () => {}}
      />

      <IbanPayoutAccountDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title="Link your personal payout account"
        description="This is your own personal IBAN, separate from the Store's business account — used to send you your share of tips."
        mutation={createPayoutAccount}
      />
    </EmployeeCashOutContext.Provider>
  );
};
