"use client";

import { type FC, useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Copy, User, Users, UsersRound } from "lucide-react";
import { InFlowSelect } from "@/app/dashboard/access/components/in-flow-select";
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

const MULTI_EMPLOYEE_SELECTION_MODES = new Set<QrCodeSelectionMode>([
  QrCodeSelectionModes.CHOOSE_MANY,
  QrCodeSelectionModes.TEAM,
]);

type QrEmployeeOption = Pick<
  Employee,
  "id" | "full_name" | "position" | "photo_document"
>;

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
    setValue,
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

  const selectedEmployeeIds = useWatch({ control, name: "employee_ids" }) ?? [];
  const selectionMode = useWatch({ control, name: "selection_mode" });
  const selectedEmployeeCount = selectedEmployeeIds.length;
  const multiEmployeeModesEnabled = selectedEmployeeCount >= 2;

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

  useEffect(() => {
    if (!open) return;
    if (multiEmployeeModesEnabled) return;
    if (
      !selectionMode ||
      !MULTI_EMPLOYEE_SELECTION_MODES.has(selectionMode)
    ) {
      return;
    }
    setValue("selection_mode", QrCodeSelectionModes.CHOOSE_ONE);
  }, [open, multiEmployeeModesEnabled, selectionMode, setValue]);

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
      <DialogContent
        className="flex max-h-[90vh] min-w-0 flex-col gap-4 overflow-x-hidden sm:max-w-lg"
        showCloseButton={!isPending}
      >
        <DialogHeader className="shrink-0">
          <DialogTitle>{isEdit ? "Edit QR code" : "Create QR code"}</DialogTitle>
          <DialogDescription>
            Select employees first, then choose how customers pick who to tip.
            Customers never see the distribution rule.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={onSubmit}
          className="flex min-h-0 flex-1 flex-col gap-4"
          noValidate
        >
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain pr-0.5">
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
            <Label>Employees</Label>
            <div className="flex max-h-44 min-w-0 flex-col gap-1 overflow-y-auto overflow-x-hidden rounded-xl border border-zinc-200 p-2">
              {employeesQuery.isPending ? (
                <div className="flex flex-col gap-2 p-1">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-9 w-full" />
                  ))}
                </div>
              ) : employees.length === 0 ? (
                <p className="px-1.5 py-2 text-xs text-zinc-500">
                  No active employees yet. Add staff first, or leave empty for
                  store-only tips.
                </p>
              ) : (
                <Controller
                  control={control}
                  name="employee_ids"
                  render={({ field }) => (
                    <div className="flex min-w-0 flex-col">
                      {employees.map((employee) => {
                        const checked = field.value.includes(employee.id);
                        return (
                          <label
                            key={employee.id}
                            className={cn(
                              "flex min-w-0 cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors",
                              checked ? "bg-brand-50/80" : "hover:bg-zinc-50",
                            )}
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
                            <span className="flex min-w-0 flex-1 flex-col leading-tight">
                              <span className="truncate font-medium text-ink-charcoal">
                                {employee.full_name}
                              </span>
                              {employee.position ? (
                                <span className="truncate text-xs text-zinc-400">
                                  {employee.position}
                                </span>
                              ) : null}
                            </span>
                          </label>
                        );
                      })}
                    </div>
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
                    const requiresMultiple =
                      MULTI_EMPLOYEE_SELECTION_MODES.has(option.id);
                    const disabled =
                      requiresMultiple && !multiEmployeeModesEnabled;
                    return (
                      <label
                        key={option.id}
                        className={cn(
                          "flex items-start gap-3 rounded-xl border px-3 py-3 transition-colors",
                          disabled
                            ? "cursor-not-allowed border-zinc-100 bg-zinc-50/80 opacity-60"
                            : "cursor-pointer",
                          !disabled && selected
                            ? "border-brand-200 bg-brand-50 ring-1 ring-brand-100"
                            : null,
                          !disabled && !selected
                            ? "border-zinc-200 hover:bg-zinc-50"
                            : null,
                        )}
                      >
                        <RadioGroupItem
                          value={option.id}
                          disabled={disabled}
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
                            {disabled
                              ? selectedEmployeeCount === 1
                                ? "Needs 2+ employees. With one person assigned, tips go to them directly."
                                : "Select 2 or more employees above to enable this mode."
                              : getQrCodeSelectionModeDescription(option.id)}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </RadioGroup>
              )}
            />
            <p className="text-[11px] text-zinc-400">
              {multiEmployeeModesEnabled
                ? "Customers follow this mode when scanning the QR."
                : selectedEmployeeCount === 1
                  ? "With one employee selected, only Choose one is available."
                  : "Select 2 or more employees to unlock Choose many and Entire team."}
            </p>
          </div>

          <div className="space-y-2">
            <Label>
              Spots <span className="font-normal text-zinc-400">(optional)</span>
            </Label>
            <div className="flex max-h-36 min-w-0 flex-col gap-1 overflow-y-auto overflow-x-hidden rounded-xl border border-zinc-200 p-2">
              {spotsQuery.isPending ? (
                <div className="flex flex-col gap-2 p-1">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <Skeleton key={index} className="h-9 w-full" />
                  ))}
                </div>
              ) : spots.length === 0 ? (
                <p className="px-1.5 py-2 text-xs text-zinc-500">
                  No spots yet. Create one below, or leave empty.
                </p>
              ) : (
                <Controller
                  control={control}
                  name="spot_ids"
                  render={({ field }) => (
                    <div className="flex min-w-0 flex-col">
                      {spots.map((spot) => {
                        const checked = field.value.includes(spot.id);
                        return (
                          <label
                            key={spot.id}
                            className={cn(
                              "flex min-w-0 cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors",
                              checked ? "bg-brand-50/80" : "hover:bg-zinc-50",
                            )}
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
                            <span className="min-w-0 flex-1 truncate font-medium text-ink-charcoal">
                              {spot.name}
                            </span>
                          </label>
                        );
                      })}
                    </div>
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
                <InFlowSelect
                  key={open ? "qr-rule-open" : "qr-rule-closed"}
                  id="qr-rule"
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  options={[
                    { value: "", label: "Store default" },
                    ...rules.map((rule) => ({
                      value: rule.id,
                      label: rule.name,
                    })),
                  ]}
                />
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
          </div>

          <DialogFooter className="shrink-0">
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
