"use client";

import { type FC, useState } from "react";
import { format } from "date-fns";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import {
  useAlerts,
  useMarkAlertRead,
  useMarkAllAlertsRead,
} from "@/features/alerts/hooks/use-alerts";
import type { AlertType } from "@/features/alerts/interfaces/alerts.interfaces";
import { AlertTypeFormOptions, getAlertTypeLabel } from "@/config/constants/dropdowns/alerts/alert-type-form.options";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { cn } from "@/lib/utils";

export const AlertsPageContent: FC = () => {
  const { storeId, isPending: workspacePending, isReady } = useWorkspace();
  const [type, setType] = useState<AlertType | "all">("all");
  const [readFilter, setReadFilter] = useState<"all" | "unread" | "read">(
    "all",
  );

  const alertsQuery = useAlerts(storeId ?? "", {
    limit: 50,
    ...(type !== "all" ? { type } : {}),
    ...(readFilter !== "all" ? { is_read: readFilter === "read" } : {}),
  });
  const markRead = useMarkAlertRead(storeId ?? "");
  const markAllRead = useMarkAllAlertsRead(storeId ?? "");

  if (workspacePending) {
    return <TableSkeleton columns={3} />;
  }

  if (!isReady || !storeId) {
    return (
      <Empty className="border border-dashed border-zinc-200 bg-white py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Bell />
          </EmptyMedia>
          <EmptyTitle>No store selected</EmptyTitle>
          <EmptyDescription>
            Finish business setup before viewing alerts.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const alerts = alertsQuery.data?.data ?? [];
  const hasUnread = alerts.some((alert) => !alert.is_read);

  return (
    <>
      <DashboardPageHeader
        title="Alerts"
        description="Automatic notices about performance changes and customer feedback."
        actions={
          <Button
            type="button"
            variant="outline"
            disabled={!hasUnread || markAllRead.isPending}
            onClick={() => markAllRead.mutate()}
            className="h-9 rounded-xl px-3.5 text-chip font-semibold"
          >
            <CheckCheck data-icon="inline-start" className="size-3.5" />
            Mark all read
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-2.5">
        <Select
          items={[
            { label: "All", value: "all" },
            { label: "Unread", value: "unread" },
            { label: "Read", value: "read" },
          ]}
          value={readFilter}
          onValueChange={(value) => {
            if (value) setReadFilter(value as "all" | "unread" | "read");
          }}
        >
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          items={[
            { label: "All types", value: "all" },
            ...AlertTypeFormOptions.map((option) => ({
              label: option.label,
              value: option.id,
            })),
          ]}
          value={type}
          onValueChange={(value) => {
            if (value) setType(value as AlertType | "all");
          }}
        >
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All types</SelectItem>
              {AlertTypeFormOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {alertsQuery.isPending ? (
        <TableSkeleton columns={3} />
      ) : alertsQuery.isError ? (
        <Empty className="border border-dashed border-zinc-200 bg-white py-16">
          <EmptyHeader>
            <EmptyTitle>Could not load alerts</EmptyTitle>
            <EmptyDescription>{alertsQuery.error.message}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              variant="outline"
              onClick={() => void alertsQuery.refetch()}
            >
              Try again
            </Button>
          </EmptyContent>
        </Empty>
      ) : alerts.length === 0 ? (
        <Empty className="border border-dashed border-zinc-200 bg-white py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Bell />
            </EmptyMedia>
            <EmptyTitle>No alerts</EmptyTitle>
            <EmptyDescription>
              You&apos;ll see performance and feedback notices here as they
              happen.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={cn(
                "flex items-start justify-between gap-4 rounded-2xl border p-4 shadow-xs",
                alert.is_read
                  ? "border-zinc-200/80 bg-white"
                  : "border-brand-200 bg-brand-50/40",
              )}
            >
              <div className="flex items-start gap-3">
                {!alert.is_read ? (
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-electric-lime" />
                ) : (
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-transparent" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-ink-charcoal">
                      {alert.title}
                    </span>
                    <span className="rounded-full bg-neutral-fill px-2 py-0.5 text-[10px] font-medium text-zinc-500">
                      {getAlertTypeLabel(alert.type)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-600">
                    {alert.message}
                  </p>
                  <p className="mt-1 text-[10px] text-zinc-400">
                    {format(new Date(alert.created_at), "MMM d, yyyy HH:mm")}
                  </p>
                </div>
              </div>
              {!alert.is_read ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => markRead.mutate(alert.id)}
                  disabled={markRead.isPending}
                >
                  Mark read
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
