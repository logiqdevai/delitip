"use client";

import { type FC, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { QrCode, Scale } from "lucide-react";
import { DetailSkeleton } from "@/components/ui/detail-skeleton";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { QrCodeCardsSkeleton } from "@/app/dashboard/access/components/qr-code-cards-skeleton";
import { QrCodesPanel } from "@/app/dashboard/access/components/qr-codes-panel";
import { DistributionRulesPanel } from "@/app/dashboard/distribution/components/distribution-rules-panel";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { ACCESS_TAB_PARAM, AccessTabs, type AccessTab } from "@/routes/routes";

const isAccessTab = (value: unknown): value is AccessTab =>
  value === AccessTabs.qrCodes || value === AccessTabs.distribution;

const AccessPageInner: FC = () => {
  const { storeId, store, isPending: workspacePending, isReady } =
    useWorkspace();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get(ACCESS_TAB_PARAM);
  const activeTab = isAccessTab(tabParam) ? tabParam : AccessTabs.qrCodes;

  const handleTabChange = (value: unknown) => {
    if (!isAccessTab(value)) return;
    const params = new URLSearchParams(searchParams);
    if (value === AccessTabs.qrCodes) {
      params.delete(ACCESS_TAB_PARAM);
    } else {
      params.set(ACCESS_TAB_PARAM, value);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  if (workspacePending) {
    return (
      <div className="space-y-6">
        <DetailSkeleton fieldCount={2} />
        <QrCodeCardsSkeleton />
      </div>
    );
  }

  if (!isReady || !storeId || !store) {
    return (
      <Empty className="border border-dashed border-zinc-200 bg-white py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <QrCode />
          </EmptyMedia>
          <EmptyTitle>No store selected</EmptyTitle>
          <EmptyDescription>
            Finish business setup before creating customer QR codes.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <>
      <DashboardPageHeader
        title="QR Codes"
        description={`Customer access and tip splitting for ${store.name}.`}
      />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList variant="line">
          <TabsTrigger value={AccessTabs.qrCodes}>
            <QrCode data-icon="inline-start" />
            QR codes
          </TabsTrigger>
          <TabsTrigger value={AccessTabs.distribution}>
            <Scale data-icon="inline-start" />
            Tip distribution
          </TabsTrigger>
        </TabsList>

        <TabsContent value={AccessTabs.qrCodes} className="mt-6">
          <QrCodesPanel storeId={storeId} store={store} />
        </TabsContent>
        <TabsContent value={AccessTabs.distribution} className="mt-6">
          <DistributionRulesPanel storeId={storeId} store={store} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export const AccessPageContent: FC = () => {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <DetailSkeleton fieldCount={2} />
          <QrCodeCardsSkeleton />
        </div>
      }
    >
      <AccessPageInner />
    </Suspense>
  );
};
