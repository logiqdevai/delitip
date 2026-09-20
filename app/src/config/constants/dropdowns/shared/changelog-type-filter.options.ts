import { ChangelogTypeFormOptions } from "@/config/constants/dropdowns/shared/changelog-type-form.options";
import type { ChangelogType } from "@/interfaces/changelog.interfaces";

export const ChangelogTypeFilterOptions: {
  id: ChangelogType | "all";
  label: string;
}[] = [
  { id: "all", label: "All changes" },
  ...ChangelogTypeFormOptions,
];
