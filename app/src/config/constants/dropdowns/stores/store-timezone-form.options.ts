export const StoreTimezoneFormOptions: { id: string; label: string }[] = [
  { id: "UTC", label: "UTC" },
  { id: "Europe/London", label: "Europe / London" },
  { id: "Europe/Dublin", label: "Europe / Dublin" },
  { id: "Europe/Paris", label: "Europe / Paris" },
  { id: "Europe/Berlin", label: "Europe / Berlin" },
  { id: "Europe/Amsterdam", label: "Europe / Amsterdam" },
  { id: "Europe/Rome", label: "Europe / Rome" },
  { id: "Europe/Madrid", label: "Europe / Madrid" },
  { id: "Europe/Athens", label: "Europe / Athens" },
  { id: "Europe/Istanbul", label: "Europe / Istanbul" },
  { id: "Europe/Moscow", label: "Europe / Moscow" },
  { id: "America/New_York", label: "America / New York" },
  { id: "America/Chicago", label: "America / Chicago" },
  { id: "America/Denver", label: "America / Denver" },
  { id: "America/Los_Angeles", label: "America / Los Angeles" },
  { id: "America/Toronto", label: "America / Toronto" },
  { id: "Asia/Dubai", label: "Asia / Dubai" },
  { id: "Asia/Singapore", label: "Asia / Singapore" },
  { id: "Asia/Tokyo", label: "Asia / Tokyo" },
  { id: "Asia/Shanghai", label: "Asia / Shanghai" },
  { id: "Australia/Sydney", label: "Australia / Sydney" },
];

export function getBrowserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

export function getStoreTimezoneOptions(
  preferred?: string | null,
): { id: string; label: string }[] {
  const options = [...StoreTimezoneFormOptions];
  const extra = preferred?.trim();
  if (extra && !options.some((option) => option.id === extra)) {
    options.unshift({ id: extra, label: extra.replaceAll("_", " ") });
  }
  return options;
}

export function getStoreTimezoneLabel(timezone: string): string {
  return (
    StoreTimezoneFormOptions.find((option) => option.id === timezone)?.label ??
    timezone
  );
}
