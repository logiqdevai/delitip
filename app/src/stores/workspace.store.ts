import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const STORE_KEY = "workspace";

interface WorkspaceStore {
  organizationId: string | null;
  storeId: string | null;
  setWorkspace: (payload: {
    organizationId: string;
    storeId: string;
  }) => void;
  switchOrganization: (organizationId: string) => void;
  clearWorkspace: () => void;
}

export const useWorkspaceStore = create<WorkspaceStore>()(
  devtools(
    persist(
      (set) => ({
        organizationId: null,
        storeId: null,
        setWorkspace: ({ organizationId, storeId }) =>
          set({ organizationId, storeId }),
        switchOrganization: (organizationId) =>
          set({ organizationId, storeId: null }),
        clearWorkspace: () => set({ organizationId: null, storeId: null }),
      }),
      {
        name: STORE_KEY,
        partialize: (state) => ({
          organizationId: state.organizationId,
          storeId: state.storeId,
        }),
      },
    ),
    { name: STORE_KEY },
  ),
);

export const getWorkspaceStoreState = () => useWorkspaceStore.getState();
