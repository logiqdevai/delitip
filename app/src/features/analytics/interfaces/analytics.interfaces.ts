export type DashboardPeriod = "today" | "7d" | "30d";
export type TrendsPeriod = "7d" | "30d" | "90d";
export type TrendsMetric = "tips" | "reviews" | "rating";
export type TrendsGroupBy = "day" | "week" | "month";
export type StoreTipsGroupBy = "day" | "week" | "month" | "employee" | "store";

export interface DashboardQuery {
  store_id?: string;
  period?: DashboardPeriod;
}

export interface DashboardOverview {
  tips_total_amount: number;
  transactions_count: number;
  reviews_count: number;
  average_rating: number;
  employees_recognized: number;
}

export interface TrendsQuery {
  store_id?: string;
  metric?: TrendsMetric;
  period?: TrendsPeriod;
  group_by?: TrendsGroupBy;
}

export interface TrendPoint {
  bucket: string;
  value: number;
}

export interface PeriodQuery {
  period?: DashboardPeriod;
}

export interface EmployeePerformance {
  employee_id: string;
  employee_name: string;
  store_id: string;
  tips_total: number;
  average_rating: number;
  reviews_count: number;
}

export interface StorePerformance {
  store_id: string;
  store_name: string;
  tips_total: number;
  average_rating: number;
}

export interface ExperienceScore {
  score: number;
  breakdown: {
    rating_component: number;
    tip_activity_component: number;
    positive_review_ratio_component: number;
  };
  explanation: string;
}

export interface StoreTipsAnalyticsQuery {
  date_from?: string;
  date_to?: string;
  employee_id?: string;
  qr_code_id?: string;
  group_by?: StoreTipsGroupBy;
}

export interface StoreTipsBucketBreakdown {
  bucket: string;
  amount: number;
  count: number;
}

export interface StoreTipsKeyedBreakdown {
  key: string;
  label: string;
  amount: number;
  count: number;
}

export interface StoreTipsAnalytics {
  total_amount: number;
  count: number;
  average_amount: number;
  breakdown: (StoreTipsBucketBreakdown | StoreTipsKeyedBreakdown)[];
}

export interface InsightSummary {
  id: string;
  store_id: string;
  period_start: string;
  period_end: string;
  summary: string;
  satisfaction_change_percent: number | null;
  top_praise: string | null;
  top_complaint: string | null;
  created_at: string;
}

export interface GenerateInsightPayload {
  period_start?: string;
  period_end?: string;
}
