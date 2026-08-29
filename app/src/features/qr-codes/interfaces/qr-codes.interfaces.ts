export const QrCodeSelectionModes = {
  CHOOSE_ONE: "CHOOSE_ONE",
  CHOOSE_MANY: "CHOOSE_MANY",
  TEAM: "TEAM",
} as const;
export type QrCodeSelectionMode =
  (typeof QrCodeSelectionModes)[keyof typeof QrCodeSelectionModes];

export interface QrCodeEmployeeRef {
  id: string;
  full_name: string;
  position?: string | null;
}

export interface QrCodeSpotRef {
  id: string;
  name: string;
}

export interface QrCodeDistributionRuleRef {
  id: string;
  name: string;
}

export interface QrCodeEmployeeJoin {
  employee: QrCodeEmployeeRef;
}

export interface QrCodeSpotJoin {
  spot: QrCodeSpotRef;
}

export interface QrCode {
  id: string;
  store_id: string;
  code: string;
  label: string;
  selection_mode: QrCodeSelectionMode;
  is_active: boolean;
  distribution_rule_id?: string | null;
  created_at: string;
  updated_at: string;
  employees?: QrCodeEmployeeJoin[];
  spots?: QrCodeSpotJoin[];
  distribution_rule?: QrCodeDistributionRuleRef | null;
  employee_ids?: string[];
  spot_ids?: string[];
}

export interface CreateQrCodePayload {
  label: string;
  selection_mode?: QrCodeSelectionMode;
  distribution_rule_id?: string;
  employee_ids?: string[];
  spot_ids?: string[];
}

export interface UpdateQrCodePayload {
  label?: string;
  selection_mode?: QrCodeSelectionMode;
  is_active?: boolean;
  distribution_rule_id?: string | null;
  employee_ids?: string[];
  spot_ids?: string[];
}

export interface QrCodesQuery {
  page?: number;
  limit?: number;
  is_active?: boolean;
}

export interface PublicQrCodeStore {
  id: string;
  name: string;
  slug: string;
  currency: string;
  suggested_tip_amounts: number[];
  allow_custom_tip_amount: boolean;
  primary_color?: string | null;
  secondary_color?: string | null;
  logo_url?: string | null;
}

export interface PublicQrCodeEmployee {
  id: string;
  full_name: string;
  position?: string | null;
  photo_url?: string | null;
}

export interface PublicQrCode {
  qr_code: {
    id: string;
    label: string;
    selection_mode: QrCodeSelectionMode;
  };
  store: PublicQrCodeStore;
  spots: { id: string; name: string }[];
  employees: PublicQrCodeEmployee[];
}

export function getQrCodeEmployeeIds(qr: QrCode): string[] {
  if (qr.employee_ids?.length) return qr.employee_ids;
  return (qr.employees ?? []).map((join) => join.employee.id);
}

export function getQrCodeEmployeeCount(qr: QrCode): number {
  return getQrCodeEmployeeIds(qr).length;
}

export function getQrCodeSpotIds(qr: QrCode): string[] {
  if (qr.spot_ids?.length) return qr.spot_ids;
  return (qr.spots ?? []).map((join) => join.spot.id);
}
