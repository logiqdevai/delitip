"use client";

import { type FC, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";

export interface ConfirmationDialogState {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  openDialog: () => void;
  closeDialog: () => void;
}

export function useConfirmationDialog(
  initialOpen = false,
): ConfirmationDialogState {
  const [open, setOpen] = useState(initialOpen);

  return {
    open,
    onOpenChange: setOpen,
    openDialog: () => setOpen(true),
    closeDialog: () => setOpen(false),
  };
}

interface ConfirmationDialogProps {
  state: ConfirmationDialogState;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  isPending?: boolean;
  variant?: "destructive" | "default";
}

export const ConfirmationDialog: FC<ConfirmationDialogProps> = ({
  state,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  isPending = false,
  variant = "destructive",
}) => {
  const [error, setError] = useState<string | null>(null);

  // A failed confirm keeps the dialog open and reports the reason inline: a
  // toast would render behind the dialog overlay where nobody can read it.
  const handleConfirm = async () => {
    setError(null);
    try {
      await onConfirm();
      state.closeDialog();
    } catch (cause) {
      setError(
        cause instanceof Error && cause.message
          ? cause.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <AlertDialog
      open={state.open}
      onOpenChange={(next) => {
        if (isPending) return;
        if (!next) setError(null);
        state.onOpenChange(next);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>
        {error ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            variant={variant === "destructive" ? "destructive" : "default"}
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault();
              void handleConfirm();
            }}
          >
            {isPending ? <Spinner data-icon="inline-start" /> : null}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
