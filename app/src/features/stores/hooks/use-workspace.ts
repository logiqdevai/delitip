"use client";

import { useEffect } from "react";
import { useStores } from "@/features/stores/hooks/use-stores";
import type { Store } from "@/features/stores/interfaces/stores.interfaces";
import type {
  Organization,
  OrganizationRole,
} from "@/features/organizations/interfaces/organizations.interfaces";
import { useMyAccounts } from "@/features/users/hooks/use-users";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { useAuthStore } from "@/stores/auth.store";
import { useWorkspaceStore } from "@/stores/workspace.store";

export type WorkspaceState = {
  organization: Organization | null;
  store: Store | null;
  organizationId: string | null;
  storeId: string | null;
  storeList: Store[];
  role: OrganizationRole | null;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  isReady: boolean;
  switchStore: (storeId: string) => void;
};

export const useWorkspace = (): WorkspaceState => {
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);
  const persistedOrganizationId = useWorkspaceStore(
    (state) => state.organizationId,
  );
  const persistedStoreId = useWorkspaceStore((state) => state.storeId);
  const setWorkspace = useWorkspaceStore((state) => state.setWorkspace);

  const accountsQuery = useMyAccounts(hydrated && !!accessToken);
  const memberships = accountsQuery.data?.organization_memberships ?? [];

  const selectedMembership =
    memberships.find(
      (membership) => membership.organization_id === persistedOrganizationId,
    ) ?? memberships[0];

  const organization = selectedMembership?.organization ?? null;
  const organizationId = organization?.id ?? null;
  const scopedStore = selectedMembership?.store ?? null;
  const needsStoreList = !!organizationId && !scopedStore;

  const storesQuery = useStores(needsStoreList ? organizationId : "");

  const storeList: Store[] = scopedStore
    ? [scopedStore]
    : (storesQuery.data ?? []);

  const store =
    storeList.find((item) => item.id === persistedStoreId) ??
    storeList[0] ??
    null;

  useEffect(() => {
    if (!organizationId || !store?.id) {
      return;
    }
    if (
      organizationId === persistedOrganizationId &&
      store.id === persistedStoreId
    ) {
      return;
    }
    setWorkspace({
      organizationId,
      storeId: store.id,
    });
  }, [
    organizationId,
    persistedOrganizationId,
    persistedStoreId,
    setWorkspace,
    store?.id,
  ]);

  const isPending =
    !hydrated ||
    (!!accessToken && accountsQuery.isPending) ||
    (needsStoreList && storesQuery.isPending);

  const isError = accountsQuery.isError || (needsStoreList && storesQuery.isError);
  const error =
    accountsQuery.error ??
    (needsStoreList ? storesQuery.error : null) ??
    null;

  const isReady = !!organization && !!store;

  const switchStore = (nextStoreId: string) => {
    if (!organizationId) return;
    if (!storeList.some((item) => item.id === nextStoreId)) return;
    setWorkspace({ organizationId, storeId: nextStoreId });
  };

  return {
    organization,
    store,
    organizationId,
    storeId: store?.id ?? null,
    storeList,
    role: selectedMembership?.role ?? null,
    isPending,
    isError,
    error,
    isReady,
    switchStore,
  };
};

export const useCurrentStoreId = (): string | null => {
  const { storeId, isReady } = useWorkspace();
  return isReady ? storeId : null;
};
