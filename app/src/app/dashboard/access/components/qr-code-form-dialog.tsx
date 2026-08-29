"use client";

import { type FC, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { QrCodeSelectionModeFormOptions } from "@/config/constants/dropdowns/qr-codes/qr-code-selection-mode-form.options";
import { useDistributionRules } from "@/features/distribution/hooks/use-distribution";
import { useEmployees } from "@/features/employees/hooks/use-employees";
import {
  useCreateQrCode,
  useUpdateQrCode,
} from "@/features/qr-codes/hooks/use-qr-codes";
import {
  getQrCodeEmployeeIds,
  getQrCodeSpotIds,
  QrCodeSelectionModes,
  type QrCode,
} from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import { useSpots } from "@/features/spots/hooks/use-spots";
import {
  qrCodeFormSchema,
  type QrCodeFormData,
} from "@/features/qr-codes/validation-schemas/qr-codes.schema";
import {
  getAbsoluteTipUrl,
  getTipPath,
} from "@/features/qr-codes/utils/qr-tip-url.utils";

interface QrCodeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: string;
  storeSlug: string;
  qr?: QrCode | null;
}

export const QrCodeFormDialog: FC<QrCodeFormDialogProps> = ({
  open,
  onOpenChange,
  storeId,
  storeSlug,
  qr,
}) => {
  const isEdit = !!qr;
  const createQr = useCreateQrCode(storeId);
  const updateQr = useUpdateQrCode();
  const employeesQuery = useEmployees(storeId, { limit: 100, is_active: true });
  const rulesQuery = useDistributionRules(storeId);
  const spotsQuery = useSpots(storeId, { limit: 100, is_active: true });
  const isPending = createQr.isPending || updateQr.isPending;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QrCodeFormData>({
    resolver: zodResolver(qrCodeFormSchema),
    defaultValues: {
      label: "",
      selection_mode: QrCodeSelectionModes.CHOOSE_ONE,
      employee_ids: [],
      spot_ids: [],
      distribution_rule_id: "",
      is_active: true,
    },
  });

  useEffect(() => {
    if (!open) return;
    if (qr) {
      reset({
        label: qr.label,
        selection_mode: qr.selection_mode,
        employee_ids: getQrCodeEmployeeIds(qr),
        spot_ids: getQrCodeSpotIds(qr),
        distribution_rule_id: qr.distribution_rule_id ?? "",
        is_active: qr.is_active,
      });
      return;
    }
    reset({
      label: "",
      selection_mode: QrCodeSelectionModes.CHOOSE_ONE,
      employee_ids: [],
      spot_ids: [],
      distribution_rule_id: "",
      is_active: true,
    });
  }, [open, qr, reset]);

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      label: values.label,
      selection_mode: values.selection_mode,
      employee_ids: values.employee_ids,
      spot_ids: values.spot_ids,
      distribution_rule_id: values.distribution_rule_id || undefined,
      ...(isEdit ? { is_active: values.is_active } : {}),
    };

    try {
      if (isEdit && qr) {
        await updateQr.mutateAsync({
          id: qr.id,
          payload: {
            ...payload,
            distribution_rule_id: values.distribution_rule_id || null,
          },
        });
      } else {
        await createQr.mutateAsync(payload);
      }
      onOpenChange(false);
    } catch {}
  });

  const employees = employeesQuery.data?.data ?? [];
  const rules = rulesQuery.data ?? [];
  const spots = spotsQuery.data?.data ?? [];
  const tipPreview = qr
    ? getTipPath(storeSlug, qr.code)
    : `/${storeSlug}/q/…`;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isPending) return;
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg" showCloseButton={!isPending}>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit QR code" : "Create QR code"}</DialogTitle>
          <DialogDescription>
            Assign staff and a selection mode. Customers never see the
            distribution rule.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="qr-label">Label</Label>
            <Input
              id="qr-label"
              placeholder="e.g. Table 08, Bar, Counter"
              aria-invalid={!!errors.label}
              {...register("label")}
            />
            {errors.label ? (
              <p className="text-xs text-red-600">{errors.label.message}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="qr-mode">Selection mode</Label>
            <NativeSelect
              id="qr-mode"
              className="w-full"
              {...register("selection_mode")}
            >
              {QrCodeSelectionModeFormOptions.map((option) => (
                <NativeSelectOption key={option.id} value={option.id}>
                  {option.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <p className="text-[11px] text-zinc-400">
              Only applies when 2+ employees are assigned.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Employees</Label>
            <div className="max-h-40 space-y-2 overflow-y-auto rounded-xl border border-zinc-200 p-3">
              {employees.length === 0 ? (
                <p className="text-xs text-zinc-500">
                  No active employees yet. Add staff first, or leave empty for
                  store-only tips.
                </p>
              ) : (
                <Controller
                  control={control}
                  name="employee_ids"
                  render={({ field }) => (
                    <>
                      {employees.map((employee) => {
                        const checked = field.value.includes(employee.id);
                        return (
                          <label
                            key={employee.id}
                            className="flex cursor-pointer items-center gap-2 text-sm"
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(next) => {
                                const isOn = next === true;
                                field.onChange(
                                  isOn
                                    ? [...field.value, employee.id]
                                    : field.value.filter(
                                        (id) => id !== employee.id,
                                      ),
                                );
                              }}
                            />
                            <span className="min-w-0 truncate">
                              {employee.full_name}
                              {employee.position ? (
                                <span className="text-zinc-400">
                                  {" "}
                                  · {employee.position}
                                </span>
                              ) : null}
                            </span>
                          </label>
                        );
                      })}
                    </>
                  )}
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              Spots <span className="font-normal text-zinc-400">(optional)</span>
            </Label>
            <div className="max-h-32 space-y-2 overflow-y-auto rounded-xl border border-zinc-200 p-3">
              {spots.length === 0 ? (
                <p className="text-xs text-zinc-500">
                  No spots yet. Create one from the Spots list on this page.
                </p>
              ) : (
                <Controller
                  control={control}
                  name="spot_ids"
                  render={({ field }) => (
                    <>
                      {spots.map((spot) => {
                        const checked = field.value.includes(spot.id);
                        return (
                          <label
                            key={spot.id}
                            className="flex cursor-pointer items-center gap-2 text-sm"
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(next) => {
                                const isOn = next === true;
                                field.onChange(
                                  isOn
                                    ? [...field.value, spot.id]
                                    : field.value.filter((id) => id !== spot.id),
                                );
                              }}
                            />
                            <span className="min-w-0 truncate">{spot.name}</span>
                          </label>
                        );
                      })}
                    </>
                  )}
                />
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="qr-rule">
              Distribution rule{" "}
              <span className="font-normal text-zinc-400">(optional)</span>
            </Label>
            <NativeSelect
              id="qr-rule"
              className="w-full"
              {...register("distribution_rule_id")}
            >
              <NativeSelectOption value="">
                Store default
              </NativeSelectOption>
              {rules.map((rule) => (
                <NativeSelectOption key={rule.id} value={rule.id}>
                  {rule.name}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          {isEdit ? (
            <label className="flex items-center gap-2 text-sm">
              <Controller
                control={control}
                name="is_active"
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(next) => field.onChange(next === true)}
                  />
                )}
              />
              Active (scannable)
            </label>
          ) : null}

          {isEdit && qr ? (
            <div className="rounded-xl bg-zinc-50 p-3 text-left text-xs text-zinc-500">
              <div className="font-semibold text-ink-charcoal">Tip URL</div>
              <p className="mt-1 break-all">{getAbsoluteTipUrl(storeSlug, qr.code)}</p>
              <p className="mt-1 text-[11px] text-zinc-400">Path: {tipPreview}</p>
            </div>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <ActionButtonWithPending type="submit" isPending={isPending}>
              {isEdit ? "Save changes" : "Create QR"}
            </ActionButtonWithPending>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
