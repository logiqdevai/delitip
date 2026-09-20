import { SessionMoodFormOptions } from "@/config/constants/dropdowns/shared/session-mood-form.options";
import type { SessionMood } from "@/interfaces/changelog.interfaces";

export const SessionMoodFilterOptions: {
  id: SessionMood | "all";
  label: string;
}[] = [
  { id: "all", label: "All sessions" },
  ...SessionMoodFormOptions,
];
