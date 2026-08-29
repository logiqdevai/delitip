export const EmployeeStatuses = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type EmployeeStatus =
  (typeof EmployeeStatuses)[keyof typeof EmployeeStatuses];

export const EmployeeStatusFormOptions: {
  id: EmployeeStatus;
  label: string;
}[] = [
  { id: EmployeeStatuses.ACTIVE, label: "Active" },
  { id: EmployeeStatuses.INACTIVE, label: "Inactive" },
];

export function getEmployeeStatusLabel(isActive: boolean): string {
  return isActive ? "Active" : "Inactive";
}
