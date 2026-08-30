"use client";

import { type FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useCreateSpot } from "@/features/spots/hooks/use-spots";
import {
  spotFormSchema,
  type SpotFormData,
} from "@/features/spots/validation-schemas/spots.schema";

interface SpotFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: string;
}

export const SpotFormDialog: FC<SpotFormDialogProps> = ({
  open,
  onOpenChange,
  storeId,
}) => {
  const createSpot = useCreateSpot(storeId);
  const isPending = createSpot.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SpotFormData>({
    resolver: zodResolver(spotFormSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({ name: "" });
  }, [open, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createSpot.mutateAsync({ name: values.name });
      onOpenChange(false);
    } catch {}
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isPending) return;
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md" showCloseButton={!isPending}>
        <DialogHeader>
          <DialogTitle>Create spot</DialogTitle>
          <DialogDescription>
            Add a table, room, or counter you can attach to QR codes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="spot-name">Name</Label>
            <Input
              id="spot-name"
              placeholder="e.g. Table 12"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name ? (
              <p className="text-xs text-red-600">{errors.name.message}</p>
            ) : null}
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <ActionButtonWithPending type="submit" isPending={isPending}>
              Create spot
            </ActionButtonWithPending>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
