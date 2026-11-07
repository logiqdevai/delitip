"use client";

import { type FC, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Banknote, HandCoins, Receipt } from "lucide-react";
import { TabsMenu } from "@/components/ui/tabs-menu";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { TipsLedgerPanel } from "@/app/dashboard/tips/components/tips-ledger-panel";
import { PayoutSummaryCard } from "@/app/dashboard/tips/components/payout-summary-card";
import { PayoutAccountCard } from "@/app/dashboard/payments/components/payout-account-card";
import { StaffBalancesTable } from "@/app/dashboard/payments/components/staff-balances-table";
import { PayoutsPageContent } from "@/app/dashboard/payouts/components/payouts-page-content";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { DASHBOARD_TAB_PARAM, TipsTabs, type TipsTab } from "@/routes/routes";

const isTipsTab = (value: unknown): value is TipsTab =>
  value === TipsTabs.ledger ||
  value === TipsTabs.staffBalances ||
  value === TipsTabs.payouts;

const TAB_ITEMS = [
  { value: TipsTabs.ledger, labelKey: "tabs.tips", Icon: Receipt },
  { value: TipsTabs.staffBalances, labelKey: "tabs.staffBalances", Icon: HandCoins },
  { value: TipsTabs.payouts, labelKey: "tabs.payouts", Icon: Banknote },
] as const;

const TipsPageInner: FC = () => {
  const t = useTranslations("dashboard.money.tipsPage");
  const { storeId, store, isPending: workspacePending, isReady } =
    useWorkspace();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get(DASHBOARD_TAB_PARAM);
  const activeTab = isTipsTab(tabParam) ? tabParam : TipsTabs.ledger;

  const handleTabChange = (value: unknown) => {
    if (!isTipsTab(value)) return;
    const params = new URLSearchParams(searchParams);
    if (value === TipsTabs.ledger) {
      params.delete(DASHBOARD_TAB_PARAM);
    } else {
      params.set(DASHBOARD_TAB_PARAM, value);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  if (workspacePending) {
    return <TableSkeleton columns={5} />;
  }

  if (!isReady || !storeId || !store) {
    return (
      <Empty className="border border-dashed border-zinc-200 bg-white py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Receipt />
          </EmptyMedia>
          <EmptyTitle>{t("noStoreTitle")}</EmptyTitle>
          <EmptyDescription>
            {t("noStoreDescription")}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <>
      <DashboardPageHeader
        title={t("title")}
        description={t("description", { store: store.name })}
      />

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="mt-6"
      >
        <TabsMenu
          aria-label={t("title")}
          items={TAB_ITEMS.map(({ value, labelKey, Icon }) => ({
            value,
            label: t(labelKey),
            icon: Icon,
          }))}
          value={activeTab}
          onValueChange={handleTabChange}
        />

        <TabsList className="max-md:hidden">
          <TabsTrigger value={TipsTabs.ledger}>
            <Receipt />
            {t("tabs.tips")}
          </TabsTrigger>
          <TabsTrigger value={TipsTabs.staffBalances}>
            <HandCoins />
            {t("tabs.staffBalances")}
          </TabsTrigger>
          <TabsTrigger value={TipsTabs.payouts}>
            <Banknote />
            {t("tabs.payouts")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={TipsTabs.ledger} className="mt-6">
          <div className="space-y-6">
            <PayoutAccountCard storeId={storeId} />
            <PayoutSummaryCard storeId={storeId} currency={store.currency} />
            <TipsLedgerPanel storeId={storeId} />
          </div>
        </TabsContent>
        <TabsContent value={TipsTabs.staffBalances} className="mt-6">
          <StaffBalancesTable
            storeId={storeId}
            storeName={store.name}
            currency={store.currency}
          />
        </TabsContent>
        <TabsContent value={TipsTabs.payouts} className="mt-6">
          <PayoutsPageContent storeId={storeId} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export const TipsPageContent: FC = () => {
  return (
    <Suspense fallback={<TableSkeleton columns={5} />}>
      <TipsPageInner />
    </Suspense>
  );
};
