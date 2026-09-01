import type { TrendsGroupBy } from "@/features/analytics/interfaces/analytics.interfaces";

/** Formats a `{bucket}` key from the trends endpoints ("YYYY-MM-DD" for day/week, "YYYY-MM" for month) into a short display label. */
export function formatBucketLabel(bucket: string, groupBy: TrendsGroupBy): string {
  if (groupBy === "month") {
    const [year, month] = bucket.split("-").map(Number);
    return new Date(year, month - 1, 1).toLocaleDateString(undefined, {
      month: "short",
      year: "numeric",
    });
  }

  return new Date(`${bucket}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
