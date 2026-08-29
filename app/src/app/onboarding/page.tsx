"use client";

import { type FC, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DetailSkeleton } from "@/components/ui/detail-skeleton";
import { OnboardingBusinessForm } from "@/app/onboarding/components/onboarding-business-form";
import { OnboardingShell } from "@/app/onboarding/components/onboarding-shell";
import { getBrowserTimezone } from "@/config/constants/dropdowns/stores/store-timezone-form.options";
import { useMyOrganizations } from "@/features/organizations/hooks/use-organizations";
import {
  Currencies,
  StoreIndustries,
  type Store,
} from "@/features/stores/interfaces/stores.interfaces";
import type { BusinessSetupFormData } from "@/features/stores/validation-schemas/stores.schema";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { Routes } from "@/routes/routes";
import { useAuthStore } from "@/stores/auth.store";

const buildDefaults = (store?: Store | null): BusinessSetupFormData => {
  const browserTimezone = getBrowserTimezone();
  return {
    name: store?.name ?? "",
    industry: store?.industry ?? StoreIndustries.RESTAURANT,
    timezone:
      store?.timezone && store.timezone !== "UTC"
        ? store.timezone
        : browserTimezone,
    currency: store?.currency ?? Currencies.EUR,
    address_line: store?.address_line ?? "",
  };
};

const OnboardingPage: FC = () => {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);
  const organizationsQuery = useMyOrganizations(hydrated && !!accessToken);

  const membership = organizationsQuery.data?.[0];
  const organization = membership?.organization;
  const existingStore = organization?.stores?.[0] ?? null;

  const defaults = useMemo(
    () => buildDefaults(existingStore),
    [existingStore],
  );

  const context = {
    organizationId: organization?.id,
    storeId: existingStore?.id,
  };

  const canSkip = !!existingStore;
  const goDashboard = () => {
    router.push(Routes.dashboard.root);
  };

  return (
    <OnboardingShell>
      {organizationsQuery.isPending ? (
        <DetailSkeleton fieldCount={5} />
      ) : organizationsQuery.isError ? (
        <div className="space-y-3">
          <h1 className="text-2xl font-bold tracking-tight text-ink-charcoal">
            Could not load your business
          </h1>
          <p className="text-sm text-zinc-500">
            {organizationsQuery.error.message}
          </p>
        </div>
      ) : (
        <OnboardingBusinessForm
          key={`${context.organizationId ?? "new"}-${context.storeId ?? "none"}`}
          defaultValues={defaults}
          context={context}
          canSkip={canSkip}
          onCompleted={goDashboard}
          onSkip={goDashboard}
        />
      )}
    </OnboardingShell>
  );
};

export default OnboardingPage;
