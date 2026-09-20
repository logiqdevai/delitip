import {
  SessionMoods,
  type SessionMood,
} from "@/interfaces/changelog.interfaces";

export const SessionMoodFormOptions: {
  id: SessionMood;
  label: string;
}[] = [
  { id: SessionMoods.HAPPY, label: "Happy" },
  { id: SessionMoods.FOCUSED, label: "Focused" },
  { id: SessionMoods.RUSHED, label: "Rushed" },
  { id: SessionMoods.EXPLANATORY, label: "Explanatory" },
  { id: SessionMoods.EXPLORATORY, label: "Exploratory" },
  { id: SessionMoods.FRUSTRATED, label: "Frustrated" },
  { id: SessionMoods.BLUNT, label: "Blunt" },
];

export function getSessionMoodLabel(
  mood: SessionMood | string | null | undefined,
): string {
  if (!mood) return "";
  return (
    SessionMoodFormOptions.find((option) => option.id === mood)?.label ?? mood
  );
}
