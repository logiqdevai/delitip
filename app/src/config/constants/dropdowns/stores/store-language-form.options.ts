import {
  Languages,
  type Language,
} from "@/features/stores/interfaces/stores.interfaces";

export const StoreLanguageFormOptions: {
  id: Language;
  label: string;
  flagCountryCode: string;
}[] = [
  { id: Languages.EN, label: "English", flagCountryCode: "GB" },
  { id: Languages.EL, label: "Greek", flagCountryCode: "GR" },
  { id: Languages.ES, label: "Spanish", flagCountryCode: "ES" },
  { id: Languages.FR, label: "French", flagCountryCode: "FR" },
  { id: Languages.DE, label: "German", flagCountryCode: "DE" },
  { id: Languages.IT, label: "Italian", flagCountryCode: "IT" },
  { id: Languages.PT, label: "Portuguese", flagCountryCode: "PT" },
  { id: Languages.TR, label: "Turkish", flagCountryCode: "TR" },
  { id: Languages.RU, label: "Russian", flagCountryCode: "RU" },
  { id: Languages.AR, label: "Arabic", flagCountryCode: "SA" },
  { id: Languages.ZH, label: "Chinese", flagCountryCode: "CN" },
];

export function getStoreLanguageLabel(language: Language | string): string {
  return (
    StoreLanguageFormOptions.find((option) => option.id === language)?.label ??
    language
  );
}
