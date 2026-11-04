import type { SessionMood } from "@/interfaces/changelog.interfaces";
import { SessionMoodFormOptions } from "@/config/constants/dropdowns/shared/session-mood-form.options";
import type { DropdownOptionSource } from "@/hooks/use-dropdown-options";

export const SessionMoodFilterOptions: DropdownOptionSource<SessionMood>[] = [
  { id: "all", labelKey: "dashboard.enums.sessionMood.all" },
  ...SessionMoodFormOptions,
];
