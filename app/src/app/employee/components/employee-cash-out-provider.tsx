"use client";

import {
  createContext,
  type FC,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { demoEmployee } from "../data/employee-demo";

interface EmployeeCashOutContextValue {
  balance: number;
  formattedBalance: string;
  requestCashOut: () => void;
}

const EmployeeCashOutContext =
  createContext<EmployeeCashOutContextValue | null>(null);

export const useEmployeeCashOut = () => {
  const context = useContext(EmployeeCashOutContext);
  if (!context) {
    throw new Error(
      "useEmployeeCashOut must be used within EmployeeCashOutProvider"
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
  const [balance, setBalance] = useState<number>(
    demoEmployee.availableBalance
  );

  const formattedBalance = useMemo(
    () =>
      balance.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      }),
    [balance]
  );

  const requestCashOut = useCallback(() => {
    if (balance <= 0) {
      window.alert("You have no pending balance ready for transfer right now.");
      return;
    }

    const confirmed = window.confirm(
      `Transfer ${formattedBalance} instantly to your linked Debit Card (•••• ${demoEmployee.depositLast4})?`
    );

    if (!confirmed) {
      return;
    }

    setBalance(0);
    window.alert(
      `Success! ${formattedBalance} has been sent to your bank account via instant transfer.`
    );
  }, [balance, formattedBalance]);

  const value = useMemo(
    () => ({
      balance,
      formattedBalance,
      requestCashOut,
    }),
    [balance, formattedBalance, requestCashOut]
  );

  return (
    <EmployeeCashOutContext.Provider value={value}>
      {children}
    </EmployeeCashOutContext.Provider>
  );
};
