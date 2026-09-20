export const SettlementStatuses = {
  NOT_REQUIRED: "NOT_REQUIRED",
  OWED: "OWED",
  SETTLED: "SETTLED",
  CANCELLED: "CANCELLED",
} as const;
export type SettlementStatus =
  (typeof SettlementStatuses)[keyof typeof SettlementStatuses];

export const SettlementAdjustmentStatuses = {
  PROPOSED: "PROPOSED",
  APPLIED: "APPLIED",
  DISMISSED: "DISMISSED",
} as const;
export type SettlementAdjustmentStatus =
  (typeof SettlementAdjustmentStatuses)[keyof typeof SettlementAdjustmentStatuses];

// What a business owes one employee for tips it collected on their behalf.
// `received_by_store_amount` is the part that has actually reached the
// business's bank — the rest it would be paying out of its own pocket.
export interface EmployeeBalance {
  employee_id: string;
  name: string;
  currency: string;
  earned_amount: number;
  received_by_store_amount: number;
  settled_amount: number;
  outstanding_amount: number;
  pending_adjustments_amount: number;
  owed_shares_count: number;
}

export interface EmployeeBalancesResponse {
  currency: string | null;
  data: EmployeeBalance[];
}

export interface OwedDistribution {
  id: string;
  amount: number;
  percentage: number | string;
  currency: string;
  created_at: string;
  received_by_store: boolean;
  tip: {
    id: string;
    amount: number;
    currency: string;
    created_at: string;
    paid_at: string | null;
  };
}

export interface SettlementAdjustment {
  id: string;
  store_id: string;
  employee_id: string | null;
  amount: number;
  reason: string;
  refund_id: string | null;
  status: SettlementAdjustmentStatus;
  settlement_id: string | null;
  created_at: string;
}

export interface Settlement {
  id: string;
  store_id: string;
  employee_id: string | null;
  employee_name_snapshot: string;
  amount: number;
  currency: string;
  settled_at: string;
  note: string | null;
  reference: string | null;
  recorded_by_user_id: string | null;
  confirmed_by_employee_at: string | null;
  reversed_at: string | null;
  reversed_by_user_id: string | null;
  created_at: string;
  distributions?: { id: string; amount: number }[];
  adjustments?: SettlementAdjustment[];
}

export interface EmployeeSettlementBalance {
  currency: string;
  outstanding_amount: number;
  settled_amount: number;
  earned_amount: number;
  settlements_count: number;
}

export interface CreateSettlementPayload {
  employee_id: string;
  distribution_ids: string[];
  adjustment_ids?: string[];
  settled_at?: string;
  note?: string;
  reference?: string;
}

export interface SettlementBalancesQuery {
  date_from?: string;
  date_to?: string;
  include_settled?: boolean;
}

export interface OwedDistributionsQuery {
  employee_id: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}

export interface SettlementsQuery {
  employee_id?: string;
  date_from?: string;
  date_to?: string;
  unconfirmed_only?: boolean;
  page?: number;
  limit?: number;
}

export interface SettlementsExportQuery {
  employee_id?: string;
  date_from?: string;
  date_to?: string;
}
