export const DistributionRecipientTypes = {
  STORE: "STORE",
  EMPLOYEE: "EMPLOYEE",
} as const;
export type DistributionRecipientType =
  (typeof DistributionRecipientTypes)[keyof typeof DistributionRecipientTypes];

export interface DistributionRuleRecipientEmployee {
  id: string;
  full_name: string;
}

export interface DistributionRuleRecipient {
  id: string;
  distribution_rule_id: string;
  recipient_type: DistributionRecipientType;
  employee_id?: string | null;
  percentage: number | string;
  sort_order: number;
  created_at: string;
  employee?: DistributionRuleRecipientEmployee | null;
}

export interface DistributionRule {
  id: string;
  store_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  recipients: DistributionRuleRecipient[];
}

export interface DistributionRecipientInput {
  recipient_type: DistributionRecipientType;
  employee_id?: string;
  percentage: number;
  sort_order?: number;
}

export interface CreateDistributionRulePayload {
  name: string;
  recipients: DistributionRecipientInput[];
}

export interface UpdateDistributionRulePayload {
  name?: string;
  recipients?: DistributionRecipientInput[];
}

export interface SetDefaultDistributionRulePayload {
  distribution_rule_id: string;
}

export function recipientPercentage(value: number | string): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
