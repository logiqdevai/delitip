"use client";

import { type FC, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getErrorMessage } from "@/lib/api-error";

export type ReviewAction = "approve" | "reject";

// One dialog for both decisions: approving sends money, so it gets the same
// explicit confirmation as rejecting, plus an optional note. Rejecting
// requires a note — it is the only thing the store will see.
export const ReviewPayoutRequestDialog: FC<{
  action: ReviewAction | null;
  onClose: () => void;
  amountLabel: string;
  storeName: string;
  isPending: boolean;
  onConfirm: (action: ReviewAction, note: string) => Promise<void>;
}> = ({ action, onClose, amountLabel, storeName, isPending, onConfirm }) => {
  const t = useTranslations("dashboard.admin.reviewDialog");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const open = action !== null;

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setNote("");
      setError(null);
    }
  }

  const isReject = action === "reject";
  const noteMissing = isReject && note.trim().length < 3;

  const handleConfirm = async () => {
    if (!action) return;
    setError(null);
    try {
      await onConfirm(action, note.trim());
      onClose();
    } catch (cause) {
      setError(getErrorMessage(cause, t("genericError")));
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isPending) return;
        if (!next) onClose();
      }}
    >
      <DialogContent showCloseButton={!isPending} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isReject ? t("rejectTitle") : t("approveTitle")}
          </DialogTitle>
          <DialogDescription>
            {isReject
              ? t("rejectDescription", { store: storeName })
              : t("approveDescription", { amount: amountLabel, store: storeName })}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="review-note">
            {isReject ? t("rejectLabel") : t("approveLabel")}
            {isReject ? null : (
              <span className="ml-1 font-normal text-zinc-400">{t("optional")}</span>
            )}
          </Label>
          <Textarea
            id="review-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            maxLength={1000}
            placeholder={
              isReject
                ? t("rejectPlaceholder")
                : t("approvePlaceholder")
            }
          />
        </div>

        {error ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <DialogFooter>
          <Button type="button" variant="outline" disabled={isPending} onClick={onClose}>
            {t("cancel")}
          </Button>
          <ActionButtonWithPending
            type="button"
            variant={isReject ? "destructive" : "default"}
            isPending={isPending}
            disabled={noteMissing}
            onClick={() => void handleConfirm()}
            className={
              isReject ? undefined : "bg-electric-lime text-ink-charcoal"
            }
          >
            {isReject ? t("rejectButton") : t("approveButton")}
          </ActionButtonWithPending>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
