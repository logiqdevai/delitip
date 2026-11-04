
export const EmployeeAccountStatuses = {
  ACTIVE: "active",
  INVITE_PENDING: "invite_pending",
} as const;

export type EmployeeAccountStatus =
  (typeof EmployeeAccountStatuses)[keyof typeof EmployeeAccountStatuses];

export const EmployeeAccountStatusFormOptions: {
  id: EmployeeAccountStatus;
  labelKey: string;
}[] = [
  {
    id: EmployeeAccountStatuses.ACTIVE,
    labelKey: "dashboard.enums.employeeAccountStatus.active",
  },
  {
    id: EmployeeAccountStatuses.INVITE_PENDING,
    labelKey: "dashboard.enums.employeeAccountStatus.invite_pending",
  },
];

export function getEmployeeAccountStatus(
  registeredAt: string | null | undefined,
): EmployeeAccountStatus {
  return registeredAt
    ? EmployeeAccountStatuses.ACTIVE
    : EmployeeAccountStatuses.INVITE_PENDING;
}
