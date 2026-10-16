"use client";

import { type FC, useMemo, useState } from "react";
import { AlertTriangle, Clock } from "lucide-react";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateSettlement,
  useOwedDistributions,
  useProposedAdjustments,
} from "@/features/settlements/hooks/use-settlements";
import type { EmployeeBalance } from "@/features/settlements/interfaces/settlements.interfaces";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

interface RecordSettlementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: string;
  currency: Currency;
  balance: EmployeeBalance | null;
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, { dateStyle: "medium" });

export const RecordSettlementDialog: FC<RecordSettlementDialogProps> = ({
  open,
  onOpenChange,
  storeId,
  currency,
  balance,
}) => {
  const employeeId = balance?.employee_id ?? "";
  const createSettlement = useCreateSettlement(storeId);

  const owedQuery = useOwedDistributions(
    storeId,
    { employee_id: employeeId, page: 1, limit: 100 },
    { enabled: open && !!employeeId },
  );
  const adjustmentsQuery = useProposedAdjustments(storeId, employeeId, {
    enabled: open && !!employeeId,
  });

  const shares = useMemo(() => owedQuery.data?.data ?? [], [owedQuery.data]);
  const adjustments = useMemo(
    () => adjustmentsQuery.data ?? [],
    [adjustmentsQuery.data],
  );

  const [selectedShareIds, setSelectedShareIds] = useState<string[]>([]);
  const [selectedAdjustmentIds, setSelectedAdjustmentIds] = useState<string[]>([]);
  const [settledAt, setSettledAt] = useState<string | undefined>(undefined);
  const [note, setNote] = useState("");
  const [reference, setReference] = useState("");
  const [hydratedFor, setHydratedFor] = useState<string | null>(null);

  // Hydrated during render rather than in an effect, the same way the rest of
  // the dashboard seeds a form from loaded data — an effect here would render
  // the dialog once with nothing selected before correcting itself.
  //
  // Everything owed starts selected because settling up is the common case; the
  // picker is there for when a business needs to split a week.
  const hydrationKey = open ? `${employeeId}:${shares.length}:${adjustments.length}` : null;
  if (hydrationKey !== hydratedFor) {
    setHydratedFor(hydrationKey);
    if (hydrationKey) {
      setSelectedShareIds(shares.map((share) => share.id));
      setSelectedAdjustmentIds(adjustments.map((adjustment) => adjustment.id));
    } else {
      setSettledAt(undefined);
      setNote("");
      setReference("");
    }
  }

  const selectedShares = shares.filter((share) =>
    selectedShareIds.includes(share.id),
  );
  const selectedAdjustments = adjustments.filter((adjustment) =>
    selectedAdjustmentIds.includes(adjustment.id),
  );

  const sharesTotal = selectedShares.reduce((total, share) => total + share.amount, 0);
  const adjustmentsTotal = selectedAdjustments.reduce(
    (total, adjustment) => total + adjustment.amount,
    0,
  );
  const total = sharesTotal + adjustmentsTotal;
  const notYetReceived = selectedShares
    .filter((share) => !share.received_by_store)
    .reduce((sum, share) => sum + share.amount, 0);

  const isLoading = owedQuery.isPending || adjustmentsQuery.isPending;
  const canSubmit = selectedShares.length > 0 && total >= 0 && !createSettlement.isPending;

  const toggleShare = (id: string) => {
    setSelectedShareIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  };

  const toggleAdjustment = (id: string) => {
    setSelectedAdjustmentIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  };

  const allSelected = shares.length > 0 && selectedShareIds.length === shares.length;

  const handleSubmit = async () => {
    if (!balance) return;
    try {
      await createSettlement.mutateAsync({
        employee_id: balance.employee_id,
        distribution_ids: selectedShareIds,
        adjustment_ids: selectedAdjustmentIds.length ? selectedAdjustmentIds : undefined,
        settled_at: settledAt ? new Date(settledAt).toISOString() : undefined,
        note: note.trim() || undefined,
        reference: reference.trim() || undefined,
      });
      onOpenChange(false);
    } catch {}
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (createSettlement.isPending) return;
        onOpenChange(next);
      }}
    >
      <DialogContent
        className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
        showCloseButton={!createSettlement.isPending}
      >
        <DialogHeader className="shrink-0 border-b border-zinc-100 px-4 py-4 sm:px-6">
          <DialogTitle>Record a payment to {balance?.name ?? "employee"}</DialogTitle>
          <DialogDescription>
            Pick the tips this payment covers. The amount comes from the tips
            themselves, so every cent traces back to one.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-11 animate-pulse rounded-lg bg-zinc-100" />
              ))}
            </div>
          ) : shares.length === 0 ? (
            <p className="rounded-xl border border-dashed border-zinc-200 px-4 py-8 text-center text-sm text-zinc-500">
              Nothing is owed to {balance?.name ?? "this employee"} right now.
            </p>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Tips this covers</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setSelectedShareIds(allSelected ? [] : shares.map((share) => share.id))
                  }
                >
                  {allSelected ? "Clear all" : "Select all"}
                </Button>
              </div>

              <div className="max-h-64 overflow-y-auto rounded-xl border border-zinc-200/80">
                {shares.map((share) => {
                  const selected = selectedShareIds.includes(share.id);
                  return (
                    <label
                      key={share.id}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 border-b border-zinc-100 px-3 py-2.5 last:border-b-0",
                        selected ? "bg-brand-50/40" : "bg-white hover:bg-zinc-50",
                      )}
                    >
                      <Checkbox
                        checked={selected}
                        onCheckedChange={() => toggleShare(share.id)}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-semibold text-ink-charcoal">
                          {formatDate(share.created_at)}
                        </span>
                        <span className="mt-0.5 flex items-center gap-1 text-[11px] text-zinc-500">
                          {share.received_by_store ? (
                            "In your account"
                          ) : (
                            <>
                              <Clock className="size-3" />
                              Not paid out to you yet
                            </>
                          )}
                        </span>
                      </span>
                      <span className="shrink-0 text-xs font-bold tabular-nums text-ink-charcoal">
                        {formatMoney(share.amount, currency)}
                      </span>
                    </label>
                  );
                })}
              </div>

              {notYetReceived > 0 ? (
                <p className="flex items-start gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-[11px] leading-snug text-amber-900">
                  <AlertTriangle className="mt-px size-3.5 shrink-0" />
                  <span>
                    {formatMoney(notYetReceived, currency)} of this hasn&apos;t reached
                    your account yet. You can still pay it now — you&apos;d be
                    fronting it until our transfer lands.
                  </span>
                </p>
              ) : null}
            </div>
          )}

          {adjustments.length > 0 ? (
            <div className="space-y-2">
              <Label>Deductions</Label>
              <div className="overflow-hidden rounded-xl border border-zinc-200/80">
                {adjustments.map((adjustment) => {
                  const selected = selectedAdjustmentIds.includes(adjustment.id);
                  return (
                    <label
                      key={adjustment.id}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 border-b border-zinc-100 px-3 py-2.5 last:border-b-0",
                        selected ? "bg-red-50/40" : "bg-white hover:bg-zinc-50",
                      )}
                    >
                      <Checkbox
                        checked={selected}
                        onCheckedChange={() => toggleAdjustment(adjustment.id)}
                      />
                      <span className="min-w-0 flex-1 text-[11px] leading-snug text-zinc-600">
                        {adjustment.reason}
                      </span>
                      <span className="shrink-0 text-xs font-bold tabular-nums text-red-600">
                        {formatMoney(adjustment.amount, currency)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="settlement-date">Date paid</Label>
              <DatePicker
                value={settledAt}
                onChange={setSettledAt}
                placeholder="Today"
                aria-label="Date paid"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="settlement-reference">Reference (optional)</Label>
              <Input
                id="settlement-reference"
                placeholder="e.g. payroll week 38"
                value={reference}
                onChange={(event) => setReference(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="settlement-note">Note (optional)</Label>
            <Textarea
              id="settlement-note"
              rows={2}
              placeholder="Anything you want on the record"
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="m-0 shrink-0 flex-col gap-3 border-t border-zinc-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="text-left">
            <p className="text-[11px] font-semibold text-zinc-500">Total to hand over</p>
            <p className="text-lg font-bold tabular-nums text-ink-charcoal">
              {formatMoney(Math.max(total, 0), currency)}
            </p>
            {adjustmentsTotal !== 0 ? (
              <p className="text-[11px] text-zinc-500">
                {formatMoney(sharesTotal, currency)} in tips
                {" − "}
                {formatMoney(Math.abs(adjustmentsTotal), currency)} deducted
              </p>
            ) : null}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={createSettlement.isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <ActionButtonWithPending
              type="button"
              isPending={createSettlement.isPending}
              disabled={!canSubmit}
              onClick={() => void handleSubmit()}
            >
              Record payment
            </ActionButtonWithPending>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
