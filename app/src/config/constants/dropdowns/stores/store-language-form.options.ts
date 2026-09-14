import {
  Languages,
  type Language,
} from "@/features/stores/interfaces/stores.interfaces";

export const StoreLanguageFormOptions: {
  id: Language;
  label: string;
  nativeLabel: string;
  flagCountryCode: string;
}[] = [
  { id: Languages.EN, label: "English", nativeLabel: "English", flagCountryCode: "GB" },
  { id: Languages.EL, label: "Greek", nativeLabel: "Ελληνικά", flagCountryCode: "GR" },
  { id: Languages.ES, label: "Spanish", nativeLabel: "Español", flagCountryCode: "ES" },
  { id: Languages.FR, label: "French", nativeLabel: "Français", flagCountryCode: "FR" },
  { id: Languages.DE, label: "German", nativeLabel: "Deutsch", flagCountryCode: "DE" },
  { id: Languages.IT, label: "Italian", nativeLabel: "Italiano", flagCountryCode: "IT" },
  { id: Languages.PT, label: "Portuguese", nativeLabel: "Português", flagCountryCode: "PT" },
  { id: Languages.TR, label: "Turkish", nativeLabel: "Türkçe", flagCountryCode: "TR" },
  { id: Languages.RU, label: "Russian", nativeLabel: "Русский", flagCountryCode: "RU" },
  { id: Languages.AR, label: "Arabic", nativeLabel: "العربية", flagCountryCode: "SA" },
  { id: Languages.ZH, label: "Chinese", nativeLabel: "中文", flagCountryCode: "CN" },
];

export function getStoreLanguageLabel(language: Language | string): string {
  return (
    StoreLanguageFormOptions.find((option) => option.id === language)?.label ??
    language
  );
}
