export const DistributionRecipientTypes = {
  STORE: "STORE",
  EMPLOYEE: "EMPLOYEE",
} as const;
export type DistributionRecipientType =
  (typeof DistributionRecipientTypes)[keyof typeof DistributionRecipientTypes];

// Where a rule's money actually goes. DIRECT pays each recipient their own
// share to their own payout account; VIA_STORE sends the whole tip to the
// business, which then hands each employee their share itself. The
// percentages below mean the same thing either way — under VIA_STORE they
// decide what the business owes each employee rather than what we pay out.
export const DistributionPayoutModes = {
  DIRECT: "DIRECT",
  VIA_STORE: "VIA_STORE",
} as const;
export type DistributionPayoutMode =
  (typeof DistributionPayoutModes)[keyof typeof DistributionPayoutModes];

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
  payout_mode: DistributionPayoutMode;
  created_at: string;
  updated_at: string;
  recipients: DistributionRuleRecipient[];
  // Only present on the response to an update that changed payout_mode.
  rerouted_distributions_count?: number;
}

export interface DistributionRulePayoutModeImpact {
  current_payout_mode: DistributionPayoutMode;
  affected_distributions_count: number;
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
  payout_mode?: DistributionPayoutMode;
}

export interface UpdateDistributionRulePayload {
  name?: string;
  recipients?: DistributionRecipientInput[];
  payout_mode?: DistributionPayoutMode;
}

export interface SetDefaultDistributionRulePayload {
  distribution_rule_id: string;
}

export function recipientPercentage(value: number | string): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
