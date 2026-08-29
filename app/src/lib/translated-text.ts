export function resolvePrimaryText(
  value: Record<string, string> | null | undefined,
  primaryLanguage?: string,
): string {
  if (!value) return "";
  if (primaryLanguage && value[primaryLanguage]) return value[primaryLanguage];
  return Object.values(value)[0] ?? "";
}
