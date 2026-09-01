// Shared between review-step.tsx (writes it right before the full-page
// redirect to Viva checkout) and tip-flow.tsx's recovery path (reads it
// once the customer lands back on this route with ?tip=<id>). sessionStorage
// survives the round trip to Viva's hosted checkout page and back since
// it's scoped per browser tab/origin, not per navigation.
export const PENDING_TIP_STORAGE_KEY = "delitip:pending-tip";

export interface ReviewDraft {
  rating: number;
  comment: string;
  categoryRatings: Record<string, number>;
  feedbackResponses: Record<
    string,
    { ratingValue?: number; textValue?: string }
  >;
}

export const emptyReviewDraft: ReviewDraft = {
  rating: 0,
  comment: "",
  categoryRatings: {},
  feedbackResponses: {},
};

export interface PendingTip {
  tipId: string;
  storeId: string;
  storeSlug: string;
  code: string;
  recipientLabel: string;
  selectedEmployeeIds: string[];
  reviewDraft: ReviewDraft;
}

export function savePendingTip(pending: PendingTip): void {
  try {
    sessionStorage.setItem(PENDING_TIP_STORAGE_KEY, JSON.stringify(pending));
  } catch {
    // sessionStorage can throw in private-browsing/blocked-storage contexts —
    // the recovery path degrades gracefully to status-only info without it.
  }
}

export function readPendingTip(tipId: string): PendingTip | null {
  const pending = readAnyPendingTip();
  return pending?.tipId === tipId ? pending : null;
}

// Used by the checkout-return route, which doesn't know the tipId from the
// URL alone (Viva's return redirect carries its own order/transaction
// params, not ours) — it trusts whatever this browser tab most recently
// stashed instead.
export function readAnyPendingTip(): PendingTip | null {
  try {
    const raw = sessionStorage.getItem(PENDING_TIP_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PendingTip;
  } catch {
    return null;
  }
}

export function clearPendingTip(): void {
  try {
    sessionStorage.removeItem(PENDING_TIP_STORAGE_KEY);
  } catch {
    // ignore
  }
}
