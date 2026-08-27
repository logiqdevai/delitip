export const TeamSizes = {
  SMALL: "SMALL",
  MEDIUM: "MEDIUM",
  LARGE: "LARGE",
  ENTERPRISE: "ENTERPRISE",
} as const;

export type TeamSize = (typeof TeamSizes)[keyof typeof TeamSizes];

export const TeamSizeFormOptions: { id: TeamSize; label: string }[] = [
  { id: TeamSizes.SMALL, label: "1 - 5 employees" },
  { id: TeamSizes.MEDIUM, label: "6 - 20 employees" },
  { id: TeamSizes.LARGE, label: "21 - 50 employees" },
  { id: TeamSizes.ENTERPRISE, label: "50+ employees" },
];

export function getTeamSizeLabel(size: TeamSize | string): string {
  return (
    TeamSizeFormOptions.find((option) => option.id === size)?.label ?? size
  );
}
