import { getReadableTextColor } from "@/lib/color";
import { tr } from "@/lib/i18n-runtime";
import type { Store } from "@/features/stores/interfaces/stores.interfaces";

export function resolveHeadline(store: Store): string {
  const DEFAULT_HEADLINE = tr(
    "dashboard.access.templateEditor.content.defaultHeadline",
  );
  const messages = store.welcome_message;
  if (!messages) return DEFAULT_HEADLINE;
  const primary = messages[store.primary_language.toLowerCase()]?.trim();
  if (primary) return primary;
  const first = Object.values(messages).find((value) => value?.trim());
  return first?.trim() || DEFAULT_HEADLINE;
}

export interface CardPalette {
  primary: string;
  secondary: string;
  onPrimary: string;
  onSecondary: string;
}

export function getCardPalette(store: Store): CardPalette {
  const primary = store.primary_color?.trim() || "#84cc16";
  const secondary = store.secondary_color?.trim() || "#18181b";
  return {
    primary,
    secondary,
    onPrimary: getReadableTextColor(primary),
    onSecondary: getReadableTextColor(secondary),
  };
}
