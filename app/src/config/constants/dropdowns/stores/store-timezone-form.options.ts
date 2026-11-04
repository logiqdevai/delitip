import type { DropdownOptionSource } from "@/hooks/use-dropdown-options";

// ids are IANA zone names (stored/sent to the API). Message keys replace "/"
// with "_": Europe/Athens -> dashboard.enums.storeTimezone.Europe_Athens.
// For a zone that is not listed (e.g. the browser's own), use
// useStoreTimezoneOptions(preferred) from "@/hooks/use-store-timezone-options".
export const StoreTimezoneFormOptions: DropdownOptionSource[] = [
  { id: "UTC", labelKey: "dashboard.enums.storeTimezone.UTC" },
  {
    id: "Europe/London",
    labelKey: "dashboard.enums.storeTimezone.Europe_London",
  },
  {
    id: "Europe/Dublin",
    labelKey: "dashboard.enums.storeTimezone.Europe_Dublin",
  },
  {
    id: "Europe/Paris",
    labelKey: "dashboard.enums.storeTimezone.Europe_Paris",
  },
  {
    id: "Europe/Berlin",
    labelKey: "dashboard.enums.storeTimezone.Europe_Berlin",
  },
  {
    id: "Europe/Amsterdam",
    labelKey: "dashboard.enums.storeTimezone.Europe_Amsterdam",
  },
  { id: "Europe/Rome", labelKey: "dashboard.enums.storeTimezone.Europe_Rome" },
  {
    id: "Europe/Madrid",
    labelKey: "dashboard.enums.storeTimezone.Europe_Madrid",
  },
  {
    id: "Europe/Athens",
    labelKey: "dashboard.enums.storeTimezone.Europe_Athens",
  },
  {
    id: "Europe/Istanbul",
    labelKey: "dashboard.enums.storeTimezone.Europe_Istanbul",
  },
  {
    id: "Europe/Moscow",
    labelKey: "dashboard.enums.storeTimezone.Europe_Moscow",
  },
  {
    id: "America/New_York",
    labelKey: "dashboard.enums.storeTimezone.America_New_York",
  },
  {
    id: "America/Chicago",
    labelKey: "dashboard.enums.storeTimezone.America_Chicago",
  },
  {
    id: "America/Denver",
    labelKey: "dashboard.enums.storeTimezone.America_Denver",
  },
  {
    id: "America/Los_Angeles",
    labelKey: "dashboard.enums.storeTimezone.America_Los_Angeles",
  },
  {
    id: "America/Toronto",
    labelKey: "dashboard.enums.storeTimezone.America_Toronto",
  },
  { id: "Asia/Dubai", labelKey: "dashboard.enums.storeTimezone.Asia_Dubai" },
  {
    id: "Asia/Singapore",
    labelKey: "dashboard.enums.storeTimezone.Asia_Singapore",
  },
  { id: "Asia/Tokyo", labelKey: "dashboard.enums.storeTimezone.Asia_Tokyo" },
  {
    id: "Asia/Shanghai",
    labelKey: "dashboard.enums.storeTimezone.Asia_Shanghai",
  },
  {
    id: "Australia/Sydney",
    labelKey: "dashboard.enums.storeTimezone.Australia_Sydney",
  },
];

export function getBrowserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}
