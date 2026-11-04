import type { ChangelogType } from "@/interfaces/changelog.interfaces";
import { ChangelogTypeFormOptions } from "@/config/constants/dropdowns/shared/changelog-type-form.options";
import type { DropdownOptionSource } from "@/hooks/use-dropdown-options";

export const ChangelogTypeFilterOptions: DropdownOptionSource<ChangelogType>[] =
  [
    { id: "all", labelKey: "dashboard.enums.changelogType.all" },
    ...ChangelogTypeFormOptions,
  ];
