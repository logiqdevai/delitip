import {
  ChangelogTypes,
  type ChangelogType,
} from "@/interfaces/changelog.interfaces";

export const ChangelogTypeFormOptions: {
  id: ChangelogType;
  labelKey: string;
}[] = [
  {
    id: ChangelogTypes.FEATURE,
    labelKey: "dashboard.enums.changelogType.FEATURE",
  },
  {
    id: ChangelogTypes.IMPROVEMENT,
    labelKey: "dashboard.enums.changelogType.IMPROVEMENT",
  },
  { id: ChangelogTypes.FIX, labelKey: "dashboard.enums.changelogType.FIX" },
  { id: ChangelogTypes.CHORE, labelKey: "dashboard.enums.changelogType.CHORE" },
];
