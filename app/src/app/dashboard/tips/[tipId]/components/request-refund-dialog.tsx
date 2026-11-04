"use client";

import { type FC, type FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
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
import { Textarea } from "@/components/ui/textarea";
import { useCreateRefund } from "@/features/refunds/hooks/use-refunds";
import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import { formatMoney } from "@/lib/money";

interface RequestRefundDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipId: string;
  tipAmount: number;
  currency: Currency;
}

export const RequestRefundDialog: FC<RequestRefundDialogProps> = ({
  open,
  onOpenChange,
  tipId,
  tipAmount,
  currency,
}) => {
  const t = useTranslations("dashboard.money.requestRefund");
  const locale = useLocale();
  const createRefund = useCreateRefund();
  const [amount, setAmount] = useState(String(tipAmount / 100));
  const [reason, setReason] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = Math.round(Number.parseFloat(amount) * 100);
    if (!Number.isFinite(parsed) || parsed <= 0 || parsed > tipAmount) return;

    createRefund.mutate(
      {
        tip_id: tipId,
        amount: parsed,
        reason: reason.trim() || undefined,
      },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (createRefund.isPending) return;
        onOpenChange(next);
      }}
    >
      <DialogContent showCloseButton={!createRefund.isPending}>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {t("description", { amount: formatMoney(tipAmount, currency, locale) })}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="refund-amount">{t("amount")}</Label>
            <Input
              id="refund-amount"
              type="number"
              min="0.01"
              step="0.01"
              max={tipAmount / 100}
              placeholder="0.00"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="refund-reason">
              {t("reason")}{" "}
              <span className="font-normal text-zinc-400">{t("optional")}</span>
            </Label>
            <Textarea
              id="refund-reason"
              rows={3}
              placeholder={t("reasonPlaceholder")}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={createRefund.isPending}
              onClick={() => onOpenChange(false)}
            >
              {t("cancel")}
            </Button>
            <ActionButtonWithPending
              type="submit"
              isPending={createRefund.isPending}
            >
              {t("submit")}
            </ActionButtonWithPending>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
