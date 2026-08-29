import type { RefundStatus } from "@/features/tips/interfaces/tips.interfaces";
import type { Tip } from "@/features/tips/interfaces/tips.interfaces";

export type { RefundStatus };

export interface RefundUserRef {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
}

export interface Refund {
  id: string;
  tip_id: string;
  amount: number;
  reason?: string | null;
  status: RefundStatus;
  requested_by_user_id?: string | null;
  processed_by_user_id?: string | null;
  created_at: string;
  updated_at: string;
  tip?: Tip;
  requested_by?: RefundUserRef | null;
  processed_by?: RefundUserRef | null;
}

export interface RefundsQuery {
  page?: number;
  limit?: number;
  status?: RefundStatus;
}

export interface CreateRefundPayload {
  tip_id: string;
  amount?: number;
  reason?: string;
}

export interface UpdateRefundPayload {
  status: RefundStatus;
}

export interface CreatePublicRefundRequestPayload {
  amount?: number;
  reason?: string;
  customer_email?: string;
}
