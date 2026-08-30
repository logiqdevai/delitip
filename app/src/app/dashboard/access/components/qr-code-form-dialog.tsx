"use client";

import { type FC, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Copy, User, Users, UsersRound } from "lucide-react";
import { SpotFormDialog } from "@/app/dashboard/access/components/spot-form-dialog";
import { DistributionRuleFormDialog } from "@/app/dashboard/distribution/components/distribution-rule-form-dialog";
import { EmployeeFormDialog } from "@/app/dashboard/employees/components/employee-form-dialog";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EmployeeAvatar } from "@/components/ui/employee-avatar";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { getQrCodeSelectionModeDescription } from "@/config/constants/dropdowns/qr-codes/qr-code-selection-mode-description.options";
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
  type QrCodeSelectionMode,
} from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import type { Employee } from "@/features/employees/interfaces/employees.interfaces";
import { useSpots } from "@/features/spots/hooks/use-spots";
import {
  qrCodeFormSchema,
  type QrCodeFormData,
} from "@/features/qr-codes/validation-schemas/qr-codes.schema";
import {
  getAbsoluteTipUrl,
  getTipPath,
} from "@/features/qr-codes/utils/qr-tip-url.utils";
import { cn } from "@/lib/utils";

const selectionModeIcons: Record<QrCodeSelectionMode, typeof User> = {
  [QrCodeSelectionModes.CHOOSE_ONE]: User,
  [QrCodeSelectionModes.CHOOSE_MANY]: Users,
  [QrCodeSelectionModes.TEAM]: UsersRound,
};

type QrEmployeeOption = Pick<Employee, "id" | "full_name" | "position">;

interface QrCodeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: string;
  storeSlug: string;
  qr?: QrCode | null;
  defaultEmployeeIds?: string[];
  presetEmployees?: QrEmployeeOption[];
}

export const QrCodeFormDialog: FC<QrCodeFormDialogProps> = ({
  open,
  onOpenChange,
  storeId,
  storeSlug,
  qr,
  defaultEmployeeIds = [],
  presetEmployees = [],
}) => {
  const isEdit = !!qr;
  const [ruleFormOpen, setRuleFormOpen] = useState(false);
  const [employeeFormOpen, setEmployeeFormOpen] = useState(false);
  const [spotFormOpen, setSpotFormOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const createQr = useCreateQrCode(storeId);
  const updateQr = useUpdateQrCode();
  const employeesQuery = useEmployees(storeId, { limit: 100, is_active: true });
  const rulesQuery = useDistributionRules(storeId);
  const spotsQuery = useSpots(storeId, { limit: 100, is_active: true });
  const isPending = createQr.isPending || updateQr.isPending;
  const defaultEmployeeIdsKey = defaultEmployeeIds.join(",");

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
      employee_ids: defaultEmployeeIds,
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
      employee_ids: defaultEmployeeIds,
      spot_ids: [],
      distribution_rule_id: "",
      is_active: true,
    });
  }, [open, qr, defaultEmployeeIdsKey, reset]);

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

  const employees = (() => {
    const byId = new Map<string, QrEmployeeOption>();
    for (const employee of employeesQuery.data?.data ?? []) {
      byId.set(employee.id, employee);
    }
    for (const employee of presetEmployees) {
      if (!byId.has(employee.id)) {
        byId.set(employee.id, employee);
      }
    }
    const list = Array.from(byId.values());
    if (defaultEmployeeIds.length === 0) return list;
    const selected = new Set(defaultEmployeeIds);
    return list.toSorted((a, b) => {
      const aSelected = selected.has(a.id) ? 0 : 1;
      const bSelected = selected.has(b.id) ? 0 : 1;
      return aSelected - bSelected;
    });
  })();
  const rules = rulesQuery.data ?? [];
  const spots = spotsQuery.data?.data ?? [];
  const tipUrl = qr ? getAbsoluteTipUrl(storeSlug, qr.code) : null;
  const tipPreview = qr
    ? getTipPath(storeSlug, qr.code)
    : `/${storeSlug}/q/…`;

  const handleCopyTipUrl = async () => {
    if (!tipUrl) return;
    try {
      await navigator.clipboard.writeText(tipUrl);
      setCopied(true);
      toast.add({
        title: "Link copied",
        description: "Tip URL copied to clipboard.",
        type: "success",
      });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.add({
        title: "Could not copy",
        description: "Please copy the link manually.",
        type: "error",
      });
    }
  };

  return (
    <>
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

          <div className="space-y-2">
            <Label id="qr-mode-label">Selection mode</Label>
            <Controller
              name="selection_mode"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  aria-labelledby="qr-mode-label"
                  value={field.value}
                  onValueChange={field.onChange}
                  className="gap-2"
                >
                  {QrCodeSelectionModeFormOptions.map((option) => {
                    const selected = field.value === option.id;
                    const Icon = selectionModeIcons[option.id];
                    return (
                      <label
                        key={option.id}
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 transition-colors",
                          selected
                            ? "border-brand-200 bg-brand-50 ring-1 ring-brand-100"
                            : "border-zinc-200 hover:bg-zinc-50",
                        )}
                      >
                        <RadioGroupItem
                          value={option.id}
                          className="mt-0.5"
                        />
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-ink-charcoal shadow-xs ring-1 ring-zinc-200/80">
                          <Icon className="size-4" strokeWidth={2} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-ink-charcoal">
                            {option.label}
                          </span>
                          <span className="mt-0.5 block text-xs leading-relaxed text-zinc-500">
                            {getQrCodeSelectionModeDescription(option.id)}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </RadioGroup>
              )}
            />
            <p className="text-[11px] text-zinc-400">
              Only applies when 2+ employees are assigned to this QR.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Employees</Label>
            <div className="max-h-40 space-y-2 overflow-y-auto rounded-xl border border-zinc-200 p-3">
              {employeesQuery.isPending ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-4 w-40" />
                  ))}
                </div>
              ) : employees.length === 0 ? (
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
                            <EmployeeAvatar
                              name={employee.full_name}
                              photoUrl={employee.photo_document?.url}
                              size="xs"
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
            <p className="text-[11px] text-zinc-400">
              Assigned staff appear on this QR for customers. Leave empty for
              store-only tips.
            </p>
            <Button
              type="button"
              variant="link"
              className="h-auto px-0 text-xs font-semibold text-brand-700"
              onClick={() => setEmployeeFormOpen(true)}
            >
              Create employee
            </Button>
          </div>

          <div className="space-y-2">
            <Label>
              Spots <span className="font-normal text-zinc-400">(optional)</span>
            </Label>
            <div className="max-h-32 space-y-2 overflow-y-auto rounded-xl border border-zinc-200 p-3">
              {spotsQuery.isPending ? (
                <div className="space-y-2">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <Skeleton key={index} className="h-4 w-32" />
                  ))}
                </div>
              ) : spots.length === 0 ? (
                <p className="text-xs text-zinc-500">
                  No spots yet. Create one below, or leave empty.
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
            <p className="text-[11px] text-zinc-400">
              Optional location tags like tables or counters for this QR.
            </p>
            <Button
              type="button"
              variant="link"
              className="h-auto px-0 text-xs font-semibold text-brand-700"
              onClick={() => setSpotFormOpen(true)}
            >
              Create spot
            </Button>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="qr-rule">
              Distribution rule{" "}
              <span className="font-normal text-zinc-400">(optional)</span>
            </Label>
            <Controller
              name="distribution_rule_id"
              control={control}
              render={({ field }) => (
                <Select
                  items={[
                    { label: "Store default", value: "" },
                    ...rules.map((rule) => ({
                      label: rule.name,
                      value: rule.id,
                    })),
                  ]}
                  value={field.value}
                  onValueChange={(value) => field.onChange(value ?? "")}
                >
                  <SelectTrigger id="qr-rule" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="">Store default</SelectItem>
                      {rules.map((rule) => (
                        <SelectItem key={rule.id} value={rule.id}>
                          {rule.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            <p className="text-[11px] text-zinc-400">
              Store default follows the rule set on Distribution. If none is
              set, tips are recorded without a split.
            </p>
            <Button
              type="button"
              variant="link"
              className="h-auto px-0 text-xs font-semibold text-brand-700"
              onClick={() => setRuleFormOpen(true)}
            >
              Create distribution rule
            </Button>
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

          {isEdit && qr && tipUrl ? (
            <div className="rounded-xl bg-zinc-50 p-3 text-left text-xs text-zinc-500">
              <div className="font-semibold text-ink-charcoal">Tip URL</div>
              <div className="mt-1 flex items-start gap-1">
                <p className="min-w-0 flex-1 break-all">{tipUrl}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="size-7 shrink-0 px-0 text-zinc-400 hover:text-ink-charcoal"
                  onClick={() => void handleCopyTipUrl()}
                  aria-label={copied ? "Copied tip URL" : "Copy tip URL"}
                >
                  {copied ? (
                    <Check className="size-3.5 text-brand-700" strokeWidth={2} />
                  ) : (
                    <Copy className="size-3.5" strokeWidth={2} />
                  )}
                </Button>
              </div>
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

    <DistributionRuleFormDialog
      open={ruleFormOpen}
      onOpenChange={setRuleFormOpen}
      storeId={storeId}
    />
    <EmployeeFormDialog
      open={employeeFormOpen}
      onOpenChange={setEmployeeFormOpen}
      storeId={storeId}
    />
    <SpotFormDialog
      open={spotFormOpen}
      onOpenChange={setSpotFormOpen}
      storeId={storeId}
    />
    </>
  );
};
