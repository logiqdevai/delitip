"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Routes } from "@/routes/routes";
import { useRefreshStorePayoutAccountStatus } from "@/features/payout-accounts/hooks/use-payout-accounts";

// Where Viva (or a future connected-accounts provider) redirects the store
// owner back to after completing hosted onboarding — mirrors app/checkout/return's
// shape: its only job is to trigger one status check, then bounce back into
// the dashboard page that already owns rendering the account's real state.
function OnboardingReturnInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeId = searchParams.get("storeId");
  const refreshStatus = useRefreshStorePayoutAccountStatus(storeId ?? "");
  const triggered = useRef(false);

  useEffect(() => {
    if (!storeId) {
      router.replace(Routes.dashboard.payments);
      return;
    }
    if (triggered.current) return;
    triggered.current = true;

    refreshStatus.mutate(undefined, {
      onSettled: () => router.replace(Routes.dashboard.payments),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-paper-offwhite p-6 text-center">
      <Loader2 className="size-8 animate-spin text-zinc-400" strokeWidth={2} />
      <p className="text-sm text-zinc-500">Finishing setup…</p>
    </main>
  );
}

export default function OnboardingReturnPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-paper-offwhite p-6">
          <Loader2 className="size-8 animate-spin text-zinc-400" strokeWidth={2} />
        </main>
      }
    >
      <OnboardingReturnInner />
    </Suspense>
  );
}
