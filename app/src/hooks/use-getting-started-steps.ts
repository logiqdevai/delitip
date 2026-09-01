"use client";

import {
  Banknote,
  Building2,
  DollarSign,
  Palette,
  QrCode as QrCodeIcon,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import type { Store } from "@/features/stores/interfaces/stores.interfaces";
import { useEmployees } from "@/features/employees/hooks/use-employees";
import { useQrCodes } from "@/features/qr-codes/hooks/use-qr-codes";
import { useStorePayoutAccount } from "@/features/payout-accounts/hooks/use-payout-accounts";
import { getPayoutAccountStatusLabel } from "@/config/constants/dropdowns/payments/payout-account-status-form.options";
import { Routes } from "@/routes/routes";

export interface GettingStartedStep {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  completed: boolean;
  statusLabel?: string;
}

export interface GettingStartedState {
  store: Store | null;
  steps: GettingStartedStep[];
  completedCount: number;
  total: number;
  isPending: boolean;
  isReady: boolean;
}

export const useGettingStartedSteps = (): GettingStartedState => {
  const { store, storeId, isPending: workspacePending, isReady } =
    useWorkspace();
  const employeesQuery = useEmployees(storeId ?? "");
  const qrCodesQuery = useQrCodes(storeId ?? "");
  const payoutAccountQuery = useStorePayoutAccount(storeId ?? "");

  const isPending =
    workspacePending ||
    (!!storeId &&
      (employeesQuery.isPending ||
        qrCodesQuery.isPending ||
        payoutAccountQuery.isPending));

  if (!isReady || !store || !storeId) {
    return {
      store: null,
      steps: [],
      completedCount: 0,
      total: 0,
      isPending,
      isReady,
    };
  }

  const account = payoutAccountQuery.data;
  const employeeCount = employeesQuery.data?.pagination.total ?? 0;
  const qrCodeCount = qrCodesQuery.data?.pagination.total ?? 0;

  const steps: GettingStartedStep[] = [
    {
      id: "profile",
      title: "Business profile",
      description:
        "Add your business name and address so customers know who they're tipping.",
      href: Routes.dashboard.settings.profile,
      icon: Building2,
      completed: Boolean(
        store.name && store.address_line && store.city && store.country,
      ),
    },
    {
      id: "branding",
      title: "Branding",
      description:
        "Upload a logo so your tipping page and QR codes match your business.",
      href: Routes.dashboard.settings.branding,
      icon: Palette,
      completed: Boolean(store.logo_document_id),
    },
    {
      id: "tipping",
      title: "Tipping configuration",
      description: "Set suggested tip amounts customers can choose from.",
      href: Routes.dashboard.settings.tipping,
      icon: DollarSign,
      completed: store.suggested_tip_amounts.length > 0,
    },
    {
      id: "employees",
      title: "Add employees",
      description:
        "Add your staff so tips can be attributed and distributed to them.",
      href: Routes.dashboard.employees,
      icon: Users,
      completed: employeeCount > 0,
    },
    {
      id: "qr-codes",
      title: "Create QR codes",
      description: "Generate scannable QR codes customers use to leave a tip.",
      href: Routes.dashboard.access,
      icon: QrCodeIcon,
      completed: qrCodeCount > 0,
    },
    {
      id: "payout-account",
      title: "Connect payout account",
      description:
        "Link your business IBAN so your share of tips can be paid out.",
      href: Routes.dashboard.payments,
      icon: Banknote,
      completed: account?.status === "ACTIVE",
      statusLabel:
        account && account.status !== "ACTIVE"
          ? getPayoutAccountStatusLabel(account.status)
          : undefined,
    },
    {
      id: "reviews",
      title: "Reviews & feedback",
      description:
        "Set a redirect link so happy customers can leave a public review.",
      href: Routes.dashboard.settings.reviewsFeedback,
      icon: Star,
      completed: Boolean(store.public_review_redirect_url),
    },
  ];

  const completedCount = steps.filter((step) => step.completed).length;

  return {
    store,
    steps,
    completedCount,
    total: steps.length,
    isPending,
    isReady,
  };
};
