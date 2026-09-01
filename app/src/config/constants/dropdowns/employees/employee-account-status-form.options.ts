export const EmployeeAccountStatuses = {
  ACTIVE: "active",
  INVITE_PENDING: "invite_pending",
} as const;

export type EmployeeAccountStatus =
  (typeof EmployeeAccountStatuses)[keyof typeof EmployeeAccountStatuses];

export const EmployeeAccountStatusFormOptions: {
  id: EmployeeAccountStatus;
  label: string;
}[] = [
  { id: EmployeeAccountStatuses.ACTIVE, label: "Active account" },
  { id: EmployeeAccountStatuses.INVITE_PENDING, label: "Invite pending" },
];

export function getEmployeeAccountStatus(
  registeredAt: string | null | undefined,
): EmployeeAccountStatus {
  return registeredAt
    ? EmployeeAccountStatuses.ACTIVE
    : EmployeeAccountStatuses.INVITE_PENDING;
}

export function getEmployeeAccountStatusLabel(
  registeredAt: string | null | undefined,
): string {
  const status = getEmployeeAccountStatus(registeredAt);
  return (
    EmployeeAccountStatusFormOptions.find((option) => option.id === status)
      ?.label ?? status
  );
}
