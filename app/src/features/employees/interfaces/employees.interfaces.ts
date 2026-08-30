export interface EmployeeDocumentRef {
  id: string;
  url: string;
}

export interface Employee {
  id: string;
  store_id: string;
  user_id?: string | null;
  // Resolved display name (store's primary language). The raw multilingual
  // map lives in full_name_translations, used only by the edit form.
  full_name: string;
  full_name_translations: Record<string, string>;
  email: string;
  photo_document_id?: string | null;
  photo_document?: EmployeeDocumentRef | null;
  position?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateEmployeePayload {
  full_name: string;
  email: string;
  position?: string;
  photo_document_id?: string;
}

export interface UpdateEmployeePayload {
  /** Map of lowercase language code -> full name text. Must include the store's primary language. */
  full_name_translations?: Record<string, string>;
  email?: string;
  position?: string;
  photo_document_id?: string | null;
  is_active?: boolean;
}

export interface EmployeesQuery {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
}

export interface EmployeeDashboardDistributionRuleBreakdown {
  rule_name: string;
  total_amount: number;
}

export interface EmployeeDashboardFeedbackItem {
  comment: string | null;
  rating: number;
  created_at: string;
}

export interface EmployeeDashboard {
  tips_this_month: {
    total_amount: number;
    by_distribution_rule: EmployeeDashboardDistributionRuleBreakdown[];
  };
  average_rating: number | null;
  reviews_count: number;
  customer_recognition_count: number;
  recent_feedback: EmployeeDashboardFeedbackItem[];
}
