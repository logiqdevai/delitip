import {
  SessionMoods,
  type SessionMood,
} from "@/interfaces/changelog.interfaces";

export const SessionMoodFormOptions: { id: SessionMood; labelKey: string }[] = [
  { id: SessionMoods.HAPPY, labelKey: "dashboard.enums.sessionMood.HAPPY" },
  { id: SessionMoods.FOCUSED, labelKey: "dashboard.enums.sessionMood.FOCUSED" },
  { id: SessionMoods.RUSHED, labelKey: "dashboard.enums.sessionMood.RUSHED" },
  {
    id: SessionMoods.EXPLANATORY,
    labelKey: "dashboard.enums.sessionMood.EXPLANATORY",
  },
  {
    id: SessionMoods.EXPLORATORY,
    labelKey: "dashboard.enums.sessionMood.EXPLORATORY",
  },
  {
    id: SessionMoods.FRUSTRATED,
    labelKey: "dashboard.enums.sessionMood.FRUSTRATED",
  },
  { id: SessionMoods.BLUNT, labelKey: "dashboard.enums.sessionMood.BLUNT" },
];
