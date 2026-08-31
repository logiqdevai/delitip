"use client";

import { type FC, type FormEvent, useState } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  CreatePayoutAccountPayload,
  PayoutAccount,
} from "@/features/payout-accounts/interfaces/payout-accounts.interfaces";
import { formatIbanInput, isValidIban } from "@/lib/iban";

interface IbanPayoutAccountDialogProps {
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

export const IbanPayoutAccountDialog: FC<IbanPayoutAccountDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  mutation,
}) => {
  const [iban, setIban] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [touched, setTouched] = useState(false);

  const ibanValid = isValidIban(iban);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    if (!ibanValid || !beneficiaryName.trim()) return;

    mutation.mutate(
      { iban: iban.replace(/\s+/g, ""), beneficiary_name: beneficiaryName.trim() },
      {
        onSuccess: () => {
          onOpenChange(false);
          setIban("");
          setBeneficiaryName("");
          setTouched(false);
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

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="payout-account-iban">IBAN</Label>
            <Input
              id="payout-account-iban"
              placeholder="GR16 0110 1250 0000 0001 2300 695"
              value={iban}
              onChange={(event) => setIban(formatIbanInput(event.target.value))}
              onBlur={() => setTouched(true)}
              autoComplete="off"
              spellCheck={false}
            />
            {touched && iban && !ibanValid ? (
              <p className="flex items-center gap-1.5 text-caption text-red-600">
                <AlertTriangle className="size-3.5 shrink-0" strokeWidth={2} />
                <span>That doesn&apos;t look like a valid IBAN.</span>
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="payout-account-beneficiary-name">
              Beneficiary name
            </Label>
            <Input
              id="payout-account-beneficiary-name"
              placeholder="Legal name on the bank account"
              value={beneficiaryName}
              onChange={(event) => setBeneficiaryName(event.target.value)}
              onBlur={() => setTouched(true)}
            />
            {touched && !beneficiaryName.trim() ? (
              <p className="text-caption text-red-600">
                Beneficiary name is required.
              </p>
            ) : null}
          </div>

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
              type="submit"
              isPending={mutation.isPending}
              disabled={!ibanValid || !beneficiaryName.trim()}
            >
              Link account
            </ActionButtonWithPending>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
