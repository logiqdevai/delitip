import { Languages, type Language } from "@/features/stores/interfaces/stores.interfaces";

// The tip page's static UI copy has been translated into these languages
// (see ./messages). Arabic is intentionally excluded — it would require
// right-to-left layout support that hasn't been built for this route — so
// even a store configured with Arabic as a supported/primary language never
// sees it offered by the tip page's language selector.
export const TIP_PAGE_UI_LANGUAGES: Language[] = [
  Languages.EN,
  Languages.EL,
  Languages.ES,
  Languages.FR,
  Languages.DE,
  Languages.IT,
  Languages.PT,
  Languages.TR,
  Languages.RU,
  Languages.ZH,
];
