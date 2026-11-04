import type { useFormatter } from "next-intl";
import type { TrendsGroupBy } from "@/features/analytics/interfaces/analytics.interfaces";

/** Formats a `{bucket}` key from the trends endpoints ("YYYY-MM-DD" for day/week, "YYYY-MM" for month) into a short display label. */
export function formatBucketLabel(
  bucket: string,
  groupBy: TrendsGroupBy,
  format: ReturnType<typeof useFormatter>,
): string {
  if (groupBy === "month") {
    const [year, month] = bucket.split("-").map(Number);
    return format.dateTime(new Date(Date.UTC(year, month - 1, 1)), {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  }

  return format.dateTime(new Date(`${bucket}T00:00:00Z`), {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
