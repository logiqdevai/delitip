"use client";

import { type FC } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  CreatePayoutAccountPayload,
  PayoutAccount,
} from "@/features/payout-accounts/interfaces/payout-accounts.interfaces";

interface ConnectedAccountPayoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  mutation: UseMutationResult<
    PayoutAccount,
    Error,
    CreatePayoutAccountPayload
  >;
}

export const ConnectedAccountPayoutDialog: FC<
  ConnectedAccountPayoutDialogProps
> = ({ open, onOpenChange, title, description, mutation }) => {
  const handleConnect = () => {
    mutation.mutate(
      { payout_method: "CONNECTED_ACCOUNT" },
      {
        onSuccess: (account) => {
          if (account.onboarding_url) {
            window.location.href = account.onboarding_url;
          } else {
            onOpenChange(false);
          }
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (mutation.isPending) return;
        onOpenChange(next);
      }}
    >
      <DialogContent showCloseButton={!mutation.isPending}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {mutation.isError ? (
          <div className="flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 p-2.5 text-caption text-red-700">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0" strokeWidth={2} />
            <span>{mutation.error.message}</span>
          </div>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={mutation.isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <ActionButtonWithPending
            type="button"
            isPending={mutation.isPending}
            onClick={handleConnect}
          >
            <ExternalLink className="size-3.5" strokeWidth={2} />
            Continue to Viva
          </ActionButtonWithPending>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
