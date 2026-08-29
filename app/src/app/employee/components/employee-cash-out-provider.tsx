"use client";

import {
  createContext,
  type FC,
  type ReactNode,
  useContext,
  useMemo,
} from "react";
import {
  ConfirmationDialog,
  useConfirmationDialog,
} from "@/components/ui/confirmation-dialog";
import { useCurrentEmployee } from "@/features/employees/hooks/use-employees";
import { useEmployeeTips } from "@/features/tips/hooks/use-tips";
import {
  useCreateMyPayoutAccount,
  useMyPayoutAccount,
} from "@/features/payout-accounts/hooks/use-payout-accounts";
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
  const dialog = useConfirmationDialog();

  const currency = store?.currency ?? "EUR";
  const balanceMinor = (tipsQuery.data?.data ?? [])
    .filter((distribution) => distribution.payout_status === "PENDING")
    .reduce((sum, distribution) => sum + distribution.amount, 0);
  const formattedBalance = formatMoney(balanceMinor, currency);

  const isPayoutActive = payoutAccountQuery.data?.status === "ACTIVE";

  const value = useMemo(
    () => ({
      balanceMinor,
      formattedBalance,
      isBalancePending: tipsQuery.isPending,
      openCashOut: dialog.openDialog,
    }),
    [balanceMinor, formattedBalance, tipsQuery.isPending, dialog.openDialog],
  );

  return (
    <EmployeeCashOutContext.Provider value={value}>
      {children}
      <ConfirmationDialog
        state={dialog}
        variant="default"
        title={
          isPayoutActive ? "Cash-out balance" : "Connect a payout account"
        }
        description={
          isPayoutActive
            ? `You have ${formattedBalance} pending from unpaid tip distributions. Instant transfer isn't live yet — payouts follow your Store's schedule.`
            : `Connect a payout account to track and eventually cash out your pending balance (${formattedBalance} right now). This is a sandbox connection — no real bank linking happens yet.`
        }
        confirmLabel={isPayoutActive ? "Got it" : "Connect payout account"}
        cancelLabel={isPayoutActive ? "Close" : "Not now"}
        isPending={createPayoutAccount.isPending}
        onConfirm={async () => {
          if (isPayoutActive) return;
          await createPayoutAccount.mutateAsync({});
        }}
      />
    </EmployeeCashOutContext.Provider>
  );
};
