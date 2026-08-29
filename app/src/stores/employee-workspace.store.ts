import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const STORE_KEY = "employee-workspace";

interface EmployeeWorkspaceStore {
  employeeAccountId: string | null;
  setEmployeeAccountId: (employeeAccountId: string) => void;
}

export const useEmployeeWorkspaceStore = create<EmployeeWorkspaceStore>()(
  devtools(
    persist(
      (set) => ({
        employeeAccountId: null,
        setEmployeeAccountId: (employeeAccountId) => set({ employeeAccountId }),
      }),
      {
        name: STORE_KEY,
        partialize: (state) => ({ employeeAccountId: state.employeeAccountId }),
      },
    ),
    { name: STORE_KEY },
  ),
);
