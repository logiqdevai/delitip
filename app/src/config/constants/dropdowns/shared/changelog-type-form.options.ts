import {
  ChangelogTypes,
  type ChangelogType,
} from "@/interfaces/changelog.interfaces";

export const ChangelogTypeFormOptions: {
  id: ChangelogType;
  label: string;
}[] = [
  { id: ChangelogTypes.FEATURE, label: "New feature" },
  { id: ChangelogTypes.IMPROVEMENT, label: "Improvement" },
  { id: ChangelogTypes.FIX, label: "Bug fix" },
  { id: ChangelogTypes.CHORE, label: "Maintenance" },
];

export function getChangelogTypeLabel(
  type: ChangelogType | string | null | undefined,
): string {
  if (!type) return "Maintenance";
  return (
    ChangelogTypeFormOptions.find((option) => option.id === type)?.label ?? type
  );
}
