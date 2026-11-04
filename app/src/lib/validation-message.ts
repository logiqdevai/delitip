/**
 * Zod schemas are module-level constants, so they cannot translate. Instead a
 * schema message is a message KEY (optionally with parameters) that
 * `@/lib/i18n-zod-resolver` translates when the form reports its errors.
 *
 *   vmsg("maxChars", { max: 200 })  ->  "errors.validation.maxChars|max=200"
 */
export const VALIDATION_KEY_PREFIX = "errors.validation.";

export const vmsg = (
  name: string,
  params?: Record<string, string | number>,
): string => {
  const encoded = params
    ? Object.entries(params)
        .map(([key, value]) => `|${key}=${encodeURIComponent(String(value))}`)
        .join("")
    : "";
  return `${VALIDATION_KEY_PREFIX}${name}${encoded}`;
};

export const parseValidationMessage = (
  message: string,
): { key: string; params: Record<string, string | number> } | null => {
  if (!message.startsWith("errors.")) return null;
  const [key, ...pairs] = message.split("|");
  const params: Record<string, string | number> = {};
  for (const pair of pairs) {
    const index = pair.indexOf("=");
    if (index < 0) continue;
    const raw = decodeURIComponent(pair.slice(index + 1));
    const asNumber = Number(raw);
    params[pair.slice(0, index)] =
      raw !== "" && Number.isFinite(asNumber) ? asNumber : raw;
  }
  return { key, params };
};
