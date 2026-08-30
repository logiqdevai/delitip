import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { AuthUser } from "@/features/auth/interfaces/auth.interfaces";
import { getEmployeeWorkspaceStoreState } from "@/stores/employee-workspace.store";
import { getWorkspaceStoreState } from "@/stores/workspace.store";

const STORE_KEY = "auth";

interface AuthStore {
  accessToken: string | null;
  user: AuthUser | null;
  setSession: (session: { accessToken: string; user: AuthUser }) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        accessToken: null,
        user: null,
        setSession: ({ accessToken, user }) => set({ accessToken, user }),
        clearSession: () => {
          getWorkspaceStoreState().clearWorkspace();
          getEmployeeWorkspaceStoreState().clearEmployeeWorkspace();
          set({ accessToken: null, user: null });
        },
      }),
      {
        name: STORE_KEY,
        partialize: (state) => ({
          accessToken: state.accessToken,
          user: state.user,
        }),
      },
    ),
    { name: STORE_KEY },
  ),
);

export const getAuthStoreState = () => useAuthStore.getState();
