
export const TeamSizes = {
  SMALL: "SMALL",
  MEDIUM: "MEDIUM",
  LARGE: "LARGE",
  ENTERPRISE: "ENTERPRISE",
} as const;

export type TeamSize = (typeof TeamSizes)[keyof typeof TeamSizes];

export const TeamSizeFormOptions: { id: TeamSize; labelKey: string }[] = [
  { id: TeamSizes.SMALL, labelKey: "dashboard.enums.teamSize.SMALL" },
  { id: TeamSizes.MEDIUM, labelKey: "dashboard.enums.teamSize.MEDIUM" },
  { id: TeamSizes.LARGE, labelKey: "dashboard.enums.teamSize.LARGE" },
  { id: TeamSizes.ENTERPRISE, labelKey: "dashboard.enums.teamSize.ENTERPRISE" },
];
