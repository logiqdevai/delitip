import {
  Languages,
  type Language,
} from "@/features/stores/interfaces/stores.interfaces";

// labelKey -> language name in the UI language; nativeLabel stays in the
// language's own script (shown next to it, never translated).
export const StoreLanguageFormOptions: {
  id: Language;
  labelKey: string;
  nativeLabel: string;
  flagCountryCode: string;
}[] = [
  {
    id: Languages.EN,
    labelKey: "dashboard.enums.storeLanguage.EN",
    nativeLabel: "English",
    flagCountryCode: "GB",
  },
  {
    id: Languages.EL,
    labelKey: "dashboard.enums.storeLanguage.EL",
    nativeLabel: "Ελληνικά",
    flagCountryCode: "GR",
  },
  {
    id: Languages.ES,
    labelKey: "dashboard.enums.storeLanguage.ES",
    nativeLabel: "Español",
    flagCountryCode: "ES",
  },
  {
    id: Languages.FR,
    labelKey: "dashboard.enums.storeLanguage.FR",
    nativeLabel: "Français",
    flagCountryCode: "FR",
  },
  {
    id: Languages.DE,
    labelKey: "dashboard.enums.storeLanguage.DE",
    nativeLabel: "Deutsch",
    flagCountryCode: "DE",
  },
  {
    id: Languages.IT,
    labelKey: "dashboard.enums.storeLanguage.IT",
    nativeLabel: "Italiano",
    flagCountryCode: "IT",
  },
  {
    id: Languages.PT,
    labelKey: "dashboard.enums.storeLanguage.PT",
    nativeLabel: "Português",
    flagCountryCode: "PT",
  },
  {
    id: Languages.TR,
    labelKey: "dashboard.enums.storeLanguage.TR",
    nativeLabel: "Türkçe",
    flagCountryCode: "TR",
  },
  {
    id: Languages.RU,
    labelKey: "dashboard.enums.storeLanguage.RU",
    nativeLabel: "Русский",
    flagCountryCode: "RU",
  },
  {
    id: Languages.AR,
    labelKey: "dashboard.enums.storeLanguage.AR",
    nativeLabel: "العربية",
    flagCountryCode: "SA",
  },
  {
    id: Languages.ZH,
    labelKey: "dashboard.enums.storeLanguage.ZH",
    nativeLabel: "中文",
    flagCountryCode: "CN",
  },
];
