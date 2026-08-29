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
