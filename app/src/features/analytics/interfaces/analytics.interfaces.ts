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

export type AdminOverviewPeriod = "today" | "7d" | "30d" | "90d";
export type AdminTrendsMetric =
  | "users"
  | "tips_revenue"
  | "platform_revenue"
  | "employee_revenue"
  | "store_revenue";

export interface AdminOverviewQuery {
  period?: AdminOverviewPeriod;
}

export interface AdminCurrencyBreakdown {
  currency: string;
  tips_gross_revenue: number;
  completed_tips_count: number;
  average_tip_amount: number;
  platform_net_revenue: number;
  platform_fee_percentage: number;
  employee_net_revenue: number;
  store_net_revenue: number;
  processing_fees_total: number;
  payment_fee_percentage: number;
  total_fee_total: number;
  total_fee_percentage: number;
  net_distributable_total: number;
  payouts_completed_total: number;
}

export interface AdminOverview {
  period: AdminOverviewPeriod;
  primary_currency: string;
  totals: AdminCurrencyBreakdown;
  by_currency: AdminCurrencyBreakdown[];
  total_users: number;
  new_users_in_period: number;
  total_stores: number;
  total_organizations: number;
  pending_payout_accounts: number;
}

export interface AdminTrendsQuery {
  metric?: AdminTrendsMetric;
  period?: TrendsPeriod;
  group_by?: TrendsGroupBy;
  currency?: string;
}

export interface AdminTrends {
  metric: AdminTrendsMetric;
  currency: string | null;
  data: TrendPoint[];
}
