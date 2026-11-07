import en from "./en.json";
import el from "./el.json";
import es from "./es.json";
import fr from "./fr.json";
import de from "./de.json";
import it from "./it.json";
import pt from "./pt.json";
import tr from "./tr.json";
import ru from "./ru.json";
import zh from "./zh.json";
import type { TipLocale } from "@/app/[storeSlug]/q/[code]/lib/locale-store";
import { withSharedUiMessages } from "./shared-ui";

export type TipPageMessages = typeof en;

const BASE_MESSAGES: Record<TipLocale, TipPageMessages> = {
  en,
  el,
  es,
  fr,
  de,
  it,
  pt,
  tr,
  ru,
  zh,
};

export const MESSAGES_BY_LOCALE = Object.fromEntries(
  (Object.keys(BASE_MESSAGES) as TipLocale[]).map((locale) => [
    locale,
    withSharedUiMessages(locale, BASE_MESSAGES[locale]),
  ]),
) as {
  [L in TipLocale]: TipPageMessages &
    ReturnType<typeof withSharedUiMessages>;
};
