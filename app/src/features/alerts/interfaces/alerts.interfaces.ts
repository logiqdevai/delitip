export const AlertTypes = {
  POSITIVE_COMPLIMENTS: "POSITIVE_COMPLIMENTS",
  NEGATIVE_SATISFACTION_DROP: "NEGATIVE_SATISFACTION_DROP",
  LOW_RATING_REVIEW: "LOW_RATING_REVIEW",
  PERFORMANCE_CHANGE: "PERFORMANCE_CHANGE",
} as const;
export type AlertType = (typeof AlertTypes)[keyof typeof AlertTypes];

export interface Alert {
  id: string;
  store_id: string;
  type: AlertType;
  title: string;
  message: string;
  employee_id?: string | null;
  is_read: boolean;
  created_at: string;
}

export interface AlertsQuery {
  page?: number;
  limit?: number;
  is_read?: boolean;
  type?: AlertType;
  employee_id?: string;
}

export interface AlertPreference {
  alert_type: AlertType;
  is_enabled: boolean;
}
