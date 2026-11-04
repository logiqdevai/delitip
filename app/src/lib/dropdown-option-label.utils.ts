/**
 * @deprecated Option files now hold message keys (`labelKey`), not text, so this
 * helper can no longer resolve labels. Use `useDropdownLabel()` from
 * `@/hooks/use-dropdown-options` instead.
 */
export function getDropdownOptionLabel<T extends string>(
  options: readonly { id: T | "all"; label: string }[],
  id: T | string | null | undefined,
  fallback = "",
): string {
  if (id == null || id === "") return fallback;
  const label = options.find((option) => option.id === id)?.label;
  if (label) return label;
  return fallback || String(id);
}
