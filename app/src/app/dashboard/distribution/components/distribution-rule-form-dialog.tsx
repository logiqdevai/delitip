"use client";

import { type FC, useEffect } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Plus, Trash2, User } from "lucide-react";
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
import { NumberPicker } from "@/components/ui/number-picker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DistributionRecipientTypeFormOptions } from "@/config/constants/dropdowns/distribution/distribution-recipient-type-form.options";
import {
  useCreateDistributionRule,
  useUpdateDistributionRule,
} from "@/features/distribution/hooks/use-distribution";
import {
  DistributionRecipientTypes,
  recipientPercentage,
  type DistributionRecipientType,
  type DistributionRule,
} from "@/features/distribution/interfaces/distribution.interfaces";
import {
  distributionRuleFormSchema,
  type DistributionRuleFormData,
} from "@/features/distribution/validation-schemas/distribution.schema";
import { useEmployees } from "@/features/employees/hooks/use-employees";
import { cn } from "@/lib/utils";

interface DistributionRuleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: string;
  rule?: DistributionRule | null;
  onCreated?: (rule: DistributionRule) => void;
}

const emptyRecipient = (): DistributionRuleFormData["recipients"][number] => ({
  recipient_type: DistributionRecipientTypes.EMPLOYEE,
  employee_id: "",
  percentage: 100,
});

const SEGMENT_COLORS = [
  "bg-electric-lime",
  "bg-brand-300",
  "bg-brand-700",
  "bg-ink-charcoal",
] as const;

export const DistributionRuleFormDialog: FC<DistributionRuleFormDialogProps> = ({
  open,
  onOpenChange,
  storeId,
  rule,
  onCreated,
}) => {
  const isEdit = !!rule;
  const createRule = useCreateDistributionRule(storeId);
  const updateRule = useUpdateDistributionRule();
  const employeesQuery = useEmployees(storeId, { limit: 100, is_active: true });
  const isPending = createRule.isPending || updateRule.isPending;

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DistributionRuleFormData>({
    resolver: zodResolver(distributionRuleFormSchema),
    defaultValues: {
      name: "",
      recipients: [emptyRecipient()],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "recipients",
  });

  const recipients = useWatch({ control, name: "recipients" }) ?? [];
  const percentageSum = recipients.reduce(
    (total, recipient) => total + (Number(recipient?.percentage) || 0),
    0,
  );
  const isBalanced = Math.abs(percentageSum - 100) <= 0.01;
  const employees = employeesQuery.data?.data ?? [];
  const employeeNameById = new Map(
    employees.map((employee) => [employee.id, employee.full_name]),
  );

  useEffect(() => {
    if (!open) return;

    if (rule) {
      reset({
        name: rule.name,
        recipients: rule.recipients
          .toSorted((a, b) => a.sort_order - b.sort_order)
          .map((recipient) => ({
            recipient_type: recipient.recipient_type,
            employee_id: recipient.employee_id ?? "",
            percentage: recipientPercentage(recipient.percentage),
          })),
      });
      return;
    }

    reset({
      name: "",
      recipients: [emptyRecipient()],
    });
  }, [open, reset, rule]);

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      name: values.name,
      recipients: values.recipients.map((recipient, index) => ({
        recipient_type: recipient.recipient_type,
        employee_id:
          recipient.recipient_type === DistributionRecipientTypes.EMPLOYEE
            ? recipient.employee_id
            : undefined,
        percentage: recipient.percentage,
        sort_order: index,
      })),
    };

    try {
      if (isEdit && rule) {
        await updateRule.mutateAsync({ id: rule.id, payload });
      } else {
        const created = await createRule.mutateAsync(payload);
        onCreated?.(created);
      }
      onOpenChange(false);
    } catch {}
  });

  const setRecipientType = (
    index: number,
    value: DistributionRecipientType,
  ) => {
    setValue(`recipients.${index}.recipient_type`, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
    if (value === DistributionRecipientTypes.STORE) {
      setValue(`recipients.${index}.employee_id`, "", {
        shouldValidate: true,
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isPending) return;
        onOpenChange(next);
      }}
    >
      <DialogContent className="gap-0 p-0 sm:max-w-xl" showCloseButton={!isPending}>
        <DialogHeader className="border-b border-zinc-100 px-5 py-4 sm:px-6">
          <DialogTitle>
            {isEdit ? "Edit distribution rule" : "Create distribution rule"}
          </DialogTitle>
          <DialogDescription>
            Define how each tip splits. Percentages must total 100%; the first
            recipient absorbs rounding remainders.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5 px-5 py-5 sm:px-6" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="rule-name">Rule name</Label>
            <Input
              id="rule-name"
              placeholder="e.g. 100% to tipped employee"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name ? (
              <p className="text-xs text-red-600">{errors.name.message}</p>
            ) : null}
          </div>

          <div className="space-y-3">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-ink-charcoal">Split</p>
                <p className="mt-0.5 text-[11px] text-zinc-500">
                  {fields.length}{" "}
                  {fields.length === 1 ? "recipient" : "recipients"}
                </p>
              </div>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-bold tabular-nums",
                  isBalanced
                    ? "bg-brand-50 text-brand-800"
                    : "bg-signal-red/10 text-signal-red",
                )}
              >
                {percentageSum.toFixed(0)}% / 100%
              </span>
            </div>

            <div className="overflow-hidden rounded-xl bg-zinc-100">
              <div className="flex h-3 w-full">
                {recipients.map((recipient, index) => {
                  const pct = Number(recipient?.percentage) || 0;
                  if (pct <= 0) return null;
                  const isStore =
                    recipient.recipient_type ===
                    DistributionRecipientTypes.STORE;
                  return (
                    <div
                      key={fields[index]?.id ?? index}
                      title={`${pct}%`}
                      className={cn(
                        "h-full min-w-1 transition-[flex-grow]",
                        isStore
                          ? "bg-zinc-400"
                          : SEGMENT_COLORS[index % SEGMENT_COLORS.length],
                      )}
                      style={{ flexGrow: pct }}
                    />
                  );
                })}
                {!isBalanced && percentageSum < 100 ? (
                  <div
                    className="h-full bg-transparent"
                    style={{ flexGrow: 100 - percentageSum }}
                  />
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              {fields.map((field, index) => {
                const type = recipients[index]?.recipient_type;
                const recipientError = errors.recipients?.[index];
                const pct = Number(recipients[index]?.percentage) || 0;
                const isStore = type === DistributionRecipientTypes.STORE;
                const label = isStore
                  ? "Business"
                  : (employeeNameById.get(
                      recipients[index]?.employee_id ?? "",
                    ) ?? "Employee");

                return (
                  <div
                    key={field.id}
                    className="space-y-2.5 rounded-2xl border border-zinc-200/80 bg-white p-3 shadow-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold tabular-nums",
                          isStore
                            ? "bg-zinc-100 text-zinc-600"
                            : "bg-brand-50 text-brand-800",
                        )}
                        aria-hidden
                      >
                        {index + 1}
                      </div>

                      <div
                        className="inline-flex w-fit shrink-0 rounded-lg bg-zinc-100 p-1"
                        role="group"
                        aria-label={`Recipient ${index + 1} type`}
                      >
                        {DistributionRecipientTypeFormOptions.map((option) => {
                          const selected = type === option.id;
                          const Icon =
                            option.id === DistributionRecipientTypes.STORE
                              ? Building2
                              : User;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              disabled={isPending}
                              onClick={() =>
                                setRecipientType(index, option.id)
                              }
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap transition",
                                selected
                                  ? "bg-white text-ink-charcoal"
                                  : "text-zinc-500 hover:text-ink-charcoal",
                              )}
                            >
                              <Icon className="size-3.5" strokeWidth={2} />
                              {option.id === DistributionRecipientTypes.STORE
                                ? "Business"
                                : "Employee"}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pl-[2.375rem] sm:flex-row sm:items-center">
                      <div className="min-w-0 flex-1">
                        {isStore ? (
                          <p className="text-[11px] leading-5 text-zinc-500 sm:py-2">
                            {pct}% stays with the business house account.
                          </p>
                        ) : (
                          <Controller
                            name={`recipients.${index}.employee_id`}
                            control={control}
                            render={({ field: employeeField }) => (
                              <Select
                                items={[
                                  {
                                    label: "Select employee",
                                    value: "",
                                  },
                                  ...employees.map((employee) => ({
                                    label: employee.full_name,
                                    value: employee.id,
                                  })),
                                ]}
                                value={employeeField.value}
                                onValueChange={(value) =>
                                  employeeField.onChange(value ?? "")
                                }
                              >
                                <SelectTrigger
                                  id={`recipient-employee-${index}`}
                                  className="w-full"
                                  aria-label={`Employee for recipient ${index + 1}`}
                                  aria-invalid={
                                    !!recipientError?.employee_id
                                  }
                                >
                                  <SelectValue placeholder="Select employee" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem value="">
                                      Select employee
                                    </SelectItem>
                                    {employees.map((employee) => (
                                      <SelectItem
                                        key={employee.id}
                                        value={employee.id}
                                      >
                                        {employee.full_name}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        )}
                      </div>

                      <div className="flex shrink-0 items-center gap-1 self-end sm:self-auto">
                        <Controller
                          name={`recipients.${index}.percentage`}
                          control={control}
                          render={({ field: percentageField }) => (
                            <NumberPicker
                              id={`recipient-pct-${index}`}
                              value={Number(percentageField.value) || 0}
                              onChange={percentageField.onChange}
                              min={0}
                              max={100}
                              step={1}
                              suffix="%"
                              disabled={isPending}
                              invalid={!!recipientError?.percentage}
                              aria-label={`${label} percentage`}
                            />
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          disabled={fields.length <= 1 || isPending}
                          onClick={() => remove(index)}
                          aria-label={`Remove ${label}`}
                          className="size-(--control-height-default) shrink-0 text-zinc-400 hover:bg-signal-red/10 hover:text-signal-red"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>

                    {recipientError?.employee_id ? (
                      <p className="pl-[2.375rem] text-xs text-red-600">
                        {recipientError.employee_id.message}
                      </p>
                    ) : null}
                    {recipientError?.percentage ? (
                      <p className="pl-[2.375rem] text-xs text-red-600">
                        {recipientError.percentage.message}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {typeof errors.recipients?.message === "string" ? (
              <p className="text-xs text-red-600">{errors.recipients.message}</p>
            ) : null}
            {typeof errors.recipients?.root?.message === "string" ? (
              <p className="text-xs text-red-600">
                {errors.recipients.root.message}
              </p>
            ) : null}

            <button
              type="button"
              disabled={isPending}
              onClick={() =>
                append({
                  recipient_type: DistributionRecipientTypes.STORE,
                  employee_id: "",
                  percentage: 0,
                })
              }
              className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/60 py-3 text-xs font-semibold text-zinc-500 transition hover:border-electric-lime hover:bg-brand-50/50 hover:text-brand-800 disabled:opacity-50"
            >
              <Plus className="size-3.5" strokeWidth={2} />
              Add recipient
            </button>
          </div>

          <DialogFooter className="gap-2 border-t border-zinc-100 pt-4 sm:justify-between">
            <p className="hidden text-[11px] text-zinc-400 sm:block">
              Applies to future tips only.
            </p>
            <div className="flex w-full gap-2 sm:w-auto">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                className="flex-1 sm:flex-none"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <ActionButtonWithPending
                type="submit"
                isPending={isPending}
                className="flex-1 sm:flex-none"
              >
                {isEdit ? "Save changes" : "Create rule"}
              </ActionButtonWithPending>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
