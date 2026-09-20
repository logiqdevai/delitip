"use client";

import { type FC, useState } from "react";
import { Download, FileText, HandCoins, SlidersHorizontal, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Switch } from "@/components/ui/switch";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  ConfirmationDialog,
  useConfirmationDialog,
} from "@/components/ui/confirmation-dialog";
import { RecordSettlementDialog } from "@/app/dashboard/payments/components/record-settlement-dialog";
import {
  useExportStoreSettlementsCsv,
  useReverseSettlement,
  useStoreSettlementBalances,
  useStoreSettlements,
} from "@/features/settlements/hooks/use-settlements";
import { downloadSettlementStatementPdf } from "@/features/settlements/utils/settlement-statement-export.utils";
import type {
  EmployeeBalance,
  Settlement,
} from "@/features/settlements/interfaces/settlements.interfaces";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

interface StaffBalancesTableProps {
  storeId: string;
  storeName: string;
  currency: Currency;
}

const formatDateTime = (value?: string | null) =>
  value
    ? new Date(value).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

export const StaffBalancesTable: FC<StaffBalancesTableProps> = ({
  storeId,
  storeName,
  currency,
}) => {
  const [dateFrom, setDateFrom] = useState<string | undefined>(undefined);
  const [dateTo, setDateTo] = useState<string | undefined>(undefined);
  const [includeSettled, setIncludeSettled] = useState(false);
  const [recordingFor, setRecordingFor] = useState<EmployeeBalance | null>(null);

  const balancesQuery = useStoreSettlementBalances(storeId, {
    date_from: dateFrom,
    date_to: dateTo,
    include_settled: includeSettled || undefined,
  });
  const settlementsQuery = useStoreSettlements(storeId, { page: 1, limit: 20 });
  const exportCsv = useExportStoreSettlementsCsv(storeId);
  const reverseSettlement = useReverseSettlement({ showErrorToast: false });
  const reverseDialog = useConfirmationDialog();
  const [reversing, setReversing] = useState<Settlement | null>(null);

  const balances = balancesQuery.data?.data ?? [];
  const settlements = settlementsQuery.data?.data ?? [];
  const totalOutstanding = balances.reduce(
    (total, balance) => total + balance.outstanding_amount,
    0,
  );

  const handleStatement = (balance: EmployeeBalance) => {
    downloadSettlementStatementPdf({
      businessName: storeName,
      balance,
      settlements: settlements.filter(
        (settlement) => settlement.employee_id === balance.employee_id,
      ),
      currency,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200/80 bg-white px-4 py-3 shadow-xs">
        <div>
          <p className="text-[11px] font-semibold text-zinc-500">
            Owed to staff
          </p>
          <p className="text-lg font-bold tabular-nums text-ink-charcoal">
            {formatMoney(totalOutstanding, currency)}
          </p>
          <p className="mt-0.5 text-[11px] text-zinc-500">
            Tips collected into your account under a &ldquo;paid by the
            business&rdquo; rule, that you still need to hand over.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={exportCsv.isPending}
          onClick={() =>
            exportCsv.mutate({ date_from: dateFrom, date_to: dateTo })
          }
        >
          <Download data-icon="inline-start" className="size-3.5" />
          Export CSV
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-zinc-200/80 bg-zinc-50/60 px-4 py-2.5">
        <div className="flex items-center gap-1.5 pl-1 text-xs font-semibold text-zinc-500">
          <SlidersHorizontal className="size-3.5" />
          Filters
        </div>
        <DatePicker
          value={dateFrom}
          onChange={setDateFrom}
          placeholder="From date"
          aria-label="From date"
          className="rounded-xl border-zinc-200 bg-white font-medium text-ink-charcoal shadow-xs"
        />
        <span className="text-xs text-zinc-400">to</span>
        <DatePicker
          value={dateTo}
          onChange={setDateTo}
          placeholder="To date"
          aria-label="To date"
          className="rounded-xl border-zinc-200 bg-white font-medium text-ink-charcoal shadow-xs"
        />
        <label className="ml-auto flex items-center gap-2 text-xs font-medium text-zinc-600">
          <Switch checked={includeSettled} onCheckedChange={setIncludeSettled} />
          Show people who are square
        </label>
      </div>

      {balancesQuery.isPending ? (
        <TableSkeleton columns={5} />
      ) : balancesQuery.isError ? (
        <Empty className="border border-dashed border-zinc-200 bg-white py-16">
          <EmptyHeader>
            <EmptyTitle>Could not load staff balances</EmptyTitle>
            <EmptyDescription>{balancesQuery.error.message}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              variant="outline"
              onClick={() => void balancesQuery.refetch()}
            >
              Try again
            </Button>
          </EmptyContent>
        </Empty>
      ) : balances.length === 0 ? (
        <Empty className="border border-dashed border-zinc-200 bg-white py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HandCoins />
            </EmptyMedia>
            <EmptyTitle>Nothing owed to staff</EmptyTitle>
            <EmptyDescription>
              Balances appear here once tips come in under a distribution rule
              set to &ldquo;send everything to the business&rdquo;.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead className="text-right">Earned</TableHead>
                <TableHead className="text-right">Handed over</TableHead>
                <TableHead className="text-right">Still owed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {balances.map((balance) => (
                <TableRow key={balance.employee_id}>
                  <TableCell>
                    <span className="block text-xs font-semibold text-ink-charcoal">
                      {balance.name}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-zinc-500">
                      {balance.owed_shares_count} unpaid{" "}
                      {balance.owed_shares_count === 1 ? "tip" : "tips"}
                      {balance.pending_adjustments_amount !== 0
                        ? ` · ${formatMoney(balance.pending_adjustments_amount, currency)} deduction pending`
                        : ""}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-xs tabular-nums text-zinc-600">
                    {formatMoney(balance.earned_amount, currency)}
                  </TableCell>
                  <TableCell className="text-right text-xs tabular-nums text-zinc-600">
                    {formatMoney(balance.settled_amount, currency)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right text-xs font-bold tabular-nums",
                      balance.outstanding_amount > 0
                        ? "text-ink-charcoal"
                        : "text-zinc-400",
                    )}
                  >
                    {formatMoney(balance.outstanding_amount, currency)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatement(balance)}
                      >
                        <FileText data-icon="inline-start" className="size-3.5" />
                        Statement
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={balance.outstanding_amount <= 0}
                        onClick={() => setRecordingFor(balance)}
                      >
                        Record payment
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm font-bold text-ink-charcoal">Payments recorded</p>
        {settlementsQuery.isPending ? (
          <TableSkeleton columns={4} />
        ) : settlements.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-200 bg-white px-4 py-8 text-center text-xs text-zinc-500">
            Nothing recorded yet.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Confirmed</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settlements.map((settlement) => (
                  <TableRow key={settlement.id}>
                    <TableCell className="text-xs text-zinc-600">
                      {formatDateTime(settlement.settled_at)}
                      {settlement.reference ? (
                        <span className="mt-0.5 block text-[11px] text-zinc-400">
                          {settlement.reference}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-ink-charcoal">
                      {settlement.employee_name_snapshot}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-caption font-bold",
                          settlement.reversed_at
                            ? "bg-zinc-100 text-zinc-600"
                            : settlement.confirmed_by_employee_at
                              ? "bg-brand-50 text-brand-700"
                              : "bg-amber-50 text-amber-700",
                        )}
                      >
                        {settlement.reversed_at
                          ? "Reversed"
                          : settlement.confirmed_by_employee_at
                            ? "Confirmed"
                            : "Awaiting employee"}
                      </span>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right text-xs font-bold tabular-nums",
                        settlement.reversed_at
                          ? "text-zinc-400 line-through"
                          : "text-ink-charcoal",
                      )}
                    >
                      {formatMoney(settlement.amount, currency)}
                    </TableCell>
                    <TableCell className="text-right">
                      {settlement.reversed_at ? null : (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setReversing(settlement);
                            reverseDialog.openDialog();
                          }}
                        >
                          <Undo2 data-icon="inline-start" className="size-3.5" />
                          Reverse
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <RecordSettlementDialog
        open={!!recordingFor}
        onOpenChange={(next) => {
          if (!next) setRecordingFor(null);
        }}
        storeId={storeId}
        currency={currency}
        balance={recordingFor}
      />

      <ConfirmationDialog
        state={reverseDialog}
        title="Reverse this payment?"
        description={
          reversing
            ? `${formatMoney(reversing.amount, currency)} to ${reversing.employee_name_snapshot} goes back to being owed. The record stays, marked as reversed.`
            : ""
        }
        confirmLabel="Reverse"
        isPending={reverseSettlement.isPending}
        onConfirm={async () => {
          if (!reversing) return;
          await reverseSettlement.mutateAsync(reversing.id);
          setReversing(null);
        }}
      />
    </div>
  );
};
