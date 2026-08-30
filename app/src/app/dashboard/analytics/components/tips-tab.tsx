"use client";

import { type FC, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStoreTipsAnalytics } from "@/features/analytics/hooks/use-analytics";
import type { StoreTipsGroupBy } from "@/features/analytics/interfaces/analytics.interfaces";
import { useEmployees } from "@/features/employees/hooks/use-employees";
import { useQrCodes } from "@/features/qr-codes/hooks/use-qr-codes";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import { formatMoney } from "@/lib/money";

const GROUP_BY_OPTIONS: { id: StoreTipsGroupBy; label: string }[] = [
  { id: "day", label: "By day" },
  { id: "week", label: "By week" },
  { id: "month", label: "By month" },
  { id: "employee", label: "By employee" },
  { id: "store", label: "By store" },
];

const inputClassName =
  "h-7 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export const TipsTab: FC<{ storeId: string; currency: Currency }> = ({
  storeId,
  currency,
}) => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [employeeId, setEmployeeId] = useState("all");
  const [qrCodeId, setQrCodeId] = useState("all");
  const [groupBy, setGroupBy] = useState<StoreTipsGroupBy>("day");

  const employeesQuery = useEmployees(storeId, { limit: 100 });
  const qrCodesQuery = useQrCodes(storeId, { limit: 100 });

  const analyticsQuery = useStoreTipsAnalytics(storeId, {
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    employee_id: employeeId !== "all" ? employeeId : undefined,
    qr_code_id: qrCodeId !== "all" ? qrCodeId : undefined,
    group_by: groupBy,
  });

  const employees = employeesQuery.data?.data ?? [];
  const qrCodes = qrCodesQuery.data?.data ?? [];
  const data = analyticsQuery.data;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="date"
          value={dateFrom}
          onChange={(event) => setDateFrom(event.target.value)}
          className={inputClassName}
          aria-label="From date"
        />
        <span className="text-xs text-zinc-400">to</span>
        <input
          type="date"
          value={dateTo}
          onChange={(event) => setDateTo(event.target.value)}
          className={inputClassName}
          aria-label="To date"
        />
        <Select
          items={[
            { label: "All employees", value: "all" },
            ...employees.map((employee) => ({
              label: employee.full_name,
              value: employee.id,
            })),
          ]}
          value={employeeId}
          onValueChange={(value) => {
            if (value) setEmployeeId(value);
          }}
        >
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All employees</SelectItem>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.full_name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          items={[
            { label: "All QR codes", value: "all" },
            ...qrCodes.map((qr) => ({ label: qr.label, value: qr.id })),
          ]}
          value={qrCodeId}
          onValueChange={(value) => {
            if (value) setQrCodeId(value);
          }}
        >
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All QR codes</SelectItem>
              {qrCodes.map((qr) => (
                <SelectItem key={qr.id} value={qr.id}>
                  {qr.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          items={GROUP_BY_OPTIONS.map((option) => ({
            label: option.label,
            value: option.id,
          }))}
          value={groupBy}
          onValueChange={(value) => {
            if (value) setGroupBy(value as StoreTipsGroupBy);
          }}
        >
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {GROUP_BY_OPTIONS.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {analyticsQuery.isPending ? (
        <Skeleton className="h-64 w-full rounded-2xl" />
      ) : analyticsQuery.isError ? (
        <p className="text-xs text-red-600">{analyticsQuery.error.message}</p>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs">
              <span className="text-xs font-semibold text-zinc-500">
                Total
              </span>
              <div className="mt-1 text-xl font-extrabold text-ink-charcoal">
                {formatMoney(data.total_amount, currency)}
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs">
              <span className="text-xs font-semibold text-zinc-500">
                Count
              </span>
              <div className="mt-1 text-xl font-extrabold text-ink-charcoal">
                {data.count}
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs">
              <span className="text-xs font-semibold text-zinc-500">
                Average
              </span>
              <div className="mt-1 text-xl font-extrabold text-ink-charcoal">
                {formatMoney(data.average_amount, currency)}
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50 text-caption font-semibold tracking-wider text-zinc-400 uppercase">
                <tr>
                  <th className="px-4 py-2.5">
                    {groupBy === "employee" || groupBy === "store"
                      ? "Name"
                      : "Period"}
                  </th>
                  <th className="px-4 py-2.5">Amount</th>
                  <th className="px-4 py-2.5">Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {data.breakdown.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-6 text-center text-xs text-zinc-400"
                    >
                      No tips match these filters.
                    </td>
                  </tr>
                ) : (
                  data.breakdown.map((row) => (
                    <tr key={"bucket" in row ? row.bucket : row.key}>
                      <td className="px-4 py-2.5 font-semibold text-ink-charcoal">
                        {"bucket" in row ? row.bucket : row.label}
                      </td>
                      <td className="px-4 py-2.5 font-bold text-brand-700">
                        {formatMoney(row.amount, currency)}
                      </td>
                      <td className="px-4 py-2.5 text-zinc-500">
                        {row.count}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  );
};
