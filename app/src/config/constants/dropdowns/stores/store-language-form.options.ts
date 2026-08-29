import {
  Languages,
  type Language,
} from "@/features/stores/interfaces/stores.interfaces";

export const StoreLanguageFormOptions: { id: Language; label: string }[] = [
  { id: Languages.EN, label: "English" },
  { id: Languages.EL, label: "Greek" },
  { id: Languages.ES, label: "Spanish" },
  { id: Languages.FR, label: "French" },
  { id: Languages.DE, label: "German" },
  { id: Languages.IT, label: "Italian" },
  { id: Languages.PT, label: "Portuguese" },
  { id: Languages.TR, label: "Turkish" },
  { id: Languages.RU, label: "Russian" },
  { id: Languages.AR, label: "Arabic" },
  { id: Languages.ZH, label: "Chinese" },
];

export function getStoreLanguageLabel(language: Language | string): string {
  return (
    StoreLanguageFormOptions.find((option) => option.id === language)?.label ??
    language
  );
}
