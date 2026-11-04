
export const EmployeeStatuses = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type EmployeeStatus =
  (typeof EmployeeStatuses)[keyof typeof EmployeeStatuses];

export const EmployeeStatusFormOptions: {
  id: EmployeeStatus;
  labelKey: string;
}[] = [
  {
    id: EmployeeStatuses.ACTIVE,
    labelKey: "dashboard.enums.employeeStatus.active",
  },
  {
    id: EmployeeStatuses.INACTIVE,
    labelKey: "dashboard.enums.employeeStatus.inactive",
  },
];

export function getEmployeeStatus(isActive: boolean): EmployeeStatus {
  return isActive ? EmployeeStatuses.ACTIVE : EmployeeStatuses.INACTIVE;
}
