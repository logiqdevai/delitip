"use client";

import { type FC } from "react";
import { useFormatter, useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WebhookEventTypeFormOptions } from "@/config/constants/dropdowns/payments/webhook-event-type-form.options";
import { useDropdownLabel } from "@/hooks/use-dropdown-options";
import type { WebhookEvent } from "@/features/webhook-events/interfaces/webhook-events.interfaces";

interface AdminWebhookEventDialogProps {
  event: WebhookEvent | null;
  onClose: () => void;
}

export const AdminWebhookEventDialog: FC<AdminWebhookEventDialogProps> = ({
  event,
  onClose,
}) => {
  const t = useTranslations("dashboard.admin.webhookEvents.dialog");
  const format = useFormatter();
  const formatDateTime = (value?: string | null) =>
    value
      ? format.dateTime(new Date(value), { dateStyle: "medium", timeStyle: "medium" })
      : "-";
  const label = useDropdownLabel();
  return (
    <Dialog
      open={event !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        {event ? (
          <>
            <DialogHeader>
              <DialogTitle>
                {label(WebhookEventTypeFormOptions, String(event.event_type_id))}
              </DialogTitle>
              <DialogDescription>
                {t("description", {
                  type: event.event_type_id,
                  date: formatDateTime(event.created_at),
                })}
              </DialogDescription>
            </DialogHeader>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-xs">
              <dt className="text-zinc-500">{t("messageId")}</dt>
              <dd className="font-mono break-all text-ink-charcoal">
                {event.message_id}
              </dd>
              <dt className="text-zinc-500">{t("processedAt")}</dt>
              <dd className="text-ink-charcoal">
                {formatDateTime(event.processed_at)}
              </dd>
              {event.processing_error ? (
                <>
                  <dt className="text-zinc-500">{t("error")}</dt>
                  <dd className="break-words text-red-700">
                    {event.processing_error}
                  </dd>
                </>
              ) : null}
            </dl>
            <pre className="max-h-96 overflow-auto rounded-xl bg-zinc-50 p-3 font-mono text-xs text-ink-charcoal">
              {JSON.stringify(event.payload, null, 2)}
            </pre>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
