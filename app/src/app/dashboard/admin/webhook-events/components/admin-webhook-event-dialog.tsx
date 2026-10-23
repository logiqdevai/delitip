"use client";

import { type FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getWebhookEventTypeLabel } from "@/config/constants/dropdowns/payments/webhook-event-type-form.options";
import type { WebhookEvent } from "@/features/webhook-events/interfaces/webhook-events.interfaces";

interface AdminWebhookEventDialogProps {
  event: WebhookEvent | null;
  onClose: () => void;
}

const formatDateTime = (value?: string | null) =>
  value
    ? new Date(value).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "medium",
      })
    : "-";

export const AdminWebhookEventDialog: FC<AdminWebhookEventDialogProps> = ({
  event,
  onClose,
}) => {
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
                {getWebhookEventTypeLabel(event.event_type_id)}
              </DialogTitle>
              <DialogDescription>
                Event {event.event_type_id} - received{" "}
                {formatDateTime(event.created_at)}
              </DialogDescription>
            </DialogHeader>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-xs">
              <dt className="text-zinc-500">Message ID</dt>
              <dd className="font-mono break-all text-ink-charcoal">
                {event.message_id}
              </dd>
              <dt className="text-zinc-500">Processed at</dt>
              <dd className="text-ink-charcoal">
                {formatDateTime(event.processed_at)}
              </dd>
              {event.processing_error ? (
                <>
                  <dt className="text-zinc-500">Error</dt>
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
