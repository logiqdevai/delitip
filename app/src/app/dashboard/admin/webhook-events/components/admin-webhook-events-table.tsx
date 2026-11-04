"use client";

import { type FC, useState } from "react";
import { Search, SlidersHorizontal, Webhook, X } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
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
import { WebhookEventStatusFilterOptions } from "@/config/constants/dropdowns/payments/webhook-event-status-filter.options";
import { WebhookEventStatusFormOptions } from "@/config/constants/dropdowns/payments/webhook-event-status-form.options";
import { useDropdownLabel, useDropdownOptions } from "@/hooks/use-dropdown-options";
import { WebhookEventTypeFilterOptions } from "@/config/constants/dropdowns/payments/webhook-event-type-filter.options";
import { WebhookEventTypeFormOptions } from "@/config/constants/dropdowns/payments/webhook-event-type-form.options";
import { useAdminWebhookEvents } from "@/features/webhook-events/hooks/use-webhook-events";
import {
  WebhookEventStatuses,
  type WebhookEvent,
  type WebhookEventStatus,
} from "@/features/webhook-events/interfaces/webhook-events.interfaces";
import { cn } from "@/lib/utils";
import { AdminWebhookEventDialog } from "./admin-webhook-event-dialog";
import { getErrorMessage } from "@/lib/api-error";

const statusChipClass: Record<WebhookEventStatus, string> = {
  PROCESSED: "bg-brand-50 text-brand-700",
  FAILED: "bg-red-50 text-red-700",
  PENDING: "bg-amber-50 text-amber-700",
};

const getEventStatus = (event: WebhookEvent): WebhookEventStatus => {
  if (event.processing_error) return WebhookEventStatuses.FAILED;
  if (event.processed_at) return WebhookEventStatuses.PROCESSED;
  return WebhookEventStatuses.PENDING;
};

const PAGE_LIMIT = 25;

export const AdminWebhookEventsTable: FC = () => {
  const t = useTranslations("dashboard.admin.webhookEvents");
  const tc = useTranslations("dashboard.admin.common");
  const format = useFormatter();
  const formatDateTime = (value?: string | null) =>
    value
      ? format.dateTime(new Date(value), { dateStyle: "medium", timeStyle: "medium" })
      : "-";
  const label = useDropdownLabel();
  const eventTypeOptions = useDropdownOptions(WebhookEventTypeFilterOptions);
  const statusOptions = useDropdownOptions(WebhookEventStatusFilterOptions);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<WebhookEventStatus | "all">("all");
  const [eventType, setEventType] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<WebhookEvent | null>(null);

  const hasFilters =
    Boolean(search) ||
    status !== "all" ||
    eventType !== "all" ||
    Boolean(dateFrom) ||
    Boolean(dateTo);

  const eventsQuery = useAdminWebhookEvents({
    page,
    limit: PAGE_LIMIT,
    ...(search ? { search } : {}),
    ...(status !== "all" ? { status } : {}),
    ...(eventType !== "all" ? { event_type_id: eventType } : {}),
    ...(dateFrom ? { date_from: dateFrom } : {}),
    ...(dateTo ? { date_to: dateTo } : {}),
  });
  const events = eventsQuery.data?.data ?? [];
  const pagination = eventsQuery.data?.pagination;

  const resetPage = () => setPage(1);

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setEventType("all");
    setDateFrom("");
    setDateTo("");
    resetPage();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-zinc-200/80 bg-zinc-50/60 px-4 py-2.5">
        <div className="flex items-center gap-1.5 pl-1 text-xs font-semibold text-zinc-500">
          <SlidersHorizontal className="size-3.5" />
          {tc("filters")}
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-zinc-400" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              resetPage();
            }}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchAria")}
            className="w-72 rounded-xl border-zinc-200 bg-white pl-8 font-medium text-ink-charcoal shadow-xs"
          />
        </div>
        <Select
          items={eventTypeOptions.map((option) => ({
            label: option.label,
            value: option.id,
          }))}
          value={eventType}
          onValueChange={(value) => {
            if (value) {
              setEventType(value);
              resetPage();
            }
          }}
        >
          <SelectTrigger
            aria-label={t("eventTypeAria")}
            className="min-w-40 rounded-xl border-zinc-200 bg-white px-3.5 font-medium text-ink-charcoal shadow-xs"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="w-auto min-w-48">
            <SelectGroup>
              {eventTypeOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          items={statusOptions.map((option) => ({
            label: option.label,
            value: option.id,
          }))}
          value={status}
          onValueChange={(value) => {
            if (value) {
              setStatus(value as WebhookEventStatus | "all");
              resetPage();
            }
          }}
        >
          <SelectTrigger
            aria-label={t("statusAria")}
            className="min-w-36 rounded-xl border-zinc-200 bg-white px-3.5 font-medium text-ink-charcoal shadow-xs"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="w-auto min-w-40">
            <SelectGroup>
              {statusOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <DatePicker
          value={dateFrom}
          onChange={(value) => {
            setDateFrom(value);
            resetPage();
          }}
          placeholder={tc("fromDate")}
          aria-label={tc("fromDate")}
          className="rounded-xl border-zinc-200 bg-white font-medium text-ink-charcoal shadow-xs"
        />
        <span className="text-xs text-zinc-400">{tc("dateRangeTo")}</span>
        <DatePicker
          value={dateTo}
          onChange={(value) => {
            setDateTo(value);
            resetPage();
          }}
          placeholder={tc("toDate")}
          aria-label={tc("toDate")}
          className="rounded-xl border-zinc-200 bg-white font-medium text-ink-charcoal shadow-xs"
        />
        {hasFilters ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="rounded-xl text-base font-semibold text-zinc-500"
          >
            <X data-icon="inline-start" className="size-3.5" />
            {t("clearFilters")}
          </Button>
        ) : null}
      </div>

      {eventsQuery.isPending ? (
        <TableSkeleton columns={5} />
      ) : eventsQuery.isError ? (
        <Empty className="border border-dashed border-zinc-200 bg-white px-4 py-16">
          <EmptyHeader>
            <EmptyTitle>{t("loadError")}</EmptyTitle>
            <EmptyDescription>{getErrorMessage(eventsQuery.error)}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              variant="outline"
              onClick={() => void eventsQuery.refetch()}
            >
              {tc("tryAgain")}
            </Button>
          </EmptyContent>
        </Empty>
      ) : events.length === 0 ? (
        <Empty className="border border-dashed border-zinc-200 bg-white px-4 py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Webhook />
            </EmptyMedia>
            <EmptyTitle>{t("emptyTitle")}</EmptyTitle>
            <EmptyDescription>
              {hasFilters
                ? t("emptyFiltered")
                : t("emptyNone")}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">{t("columns.received")}</TableHead>
                  <TableHead className="px-4">{t("columns.event")}</TableHead>
                  <TableHead className="px-4">{t("columns.messageId")}</TableHead>
                  <TableHead className="px-4">{t("columns.error")}</TableHead>
                  <TableHead className="px-4 text-right">{t("columns.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => {
                  const eventStatus = getEventStatus(event);
                  return (
                    <TableRow
                      key={event.id}
                      className="cursor-pointer"
                      onClick={() => setSelected(event)}
                    >
                      <TableCell className="px-4 py-3.5 whitespace-nowrap text-zinc-500">
                        {formatDateTime(event.created_at)}
                      </TableCell>
                      <TableCell className="px-4 py-3.5 font-semibold text-ink-charcoal">
                        {label(WebhookEventTypeFormOptions, String(event.event_type_id))}
                        <span className="ml-1.5 text-xs font-normal text-zinc-400">
                          {event.event_type_id}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3.5 font-mono text-xs text-zinc-500">
                        {event.message_id}
                      </TableCell>
                      <TableCell className="max-w-72 truncate px-4 py-3.5 text-red-700">
                        {event.processing_error ?? ""}
                      </TableCell>
                      <TableCell className="px-4 py-3.5 text-right">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-caption font-bold",
                            statusChipClass[eventStatus],
                          )}
                        >
                          {label(WebhookEventStatusFormOptions, eventStatus)}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {pagination ? (
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-zinc-500">
                {t("pagination", {
                  total: pagination.total,
                  page: pagination.page,
                  pages: Math.max(pagination.total_pages, 1),
                })}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!pagination.has_prev}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  {tc("previous")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!pagination.has_next}
                  onClick={() => setPage((current) => current + 1)}
                >
                  {tc("next")}
                </Button>
              </div>
            </div>
          ) : null}
        </>
      )}

      <AdminWebhookEventDialog
        event={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
};
