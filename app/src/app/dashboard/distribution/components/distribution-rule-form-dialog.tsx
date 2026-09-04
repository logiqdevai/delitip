"use client";

import { type FC, useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Plus, Trash2, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
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
import { EmployeeSelect } from "@/components/ui/employee-select";
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

const RECIPIENT_MOTION_EASE = [0.22, 1, 0.36, 1] as const;

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

  const [highlightedRecipientId, setHighlightedRecipientId] = useState<
    string | null
  >(null);
  const shouldHighlightNextRecipientRef = useRef(false);

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
    if (!open) {
      setHighlightedRecipientId(null);
      shouldHighlightNextRecipientRef.current = false;
      return;
    }

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

  useEffect(() => {
    if (!shouldHighlightNextRecipientRef.current) return;

    const addedRecipient = fields.at(-1);
    if (!addedRecipient) return;

    shouldHighlightNextRecipientRef.current = false;
    setHighlightedRecipientId(addedRecipient.id);

    requestAnimationFrame(() => {
      document
        .getElementById(`recipient-card-${addedRecipient.id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    const timer = window.setTimeout(() => {
      setHighlightedRecipientId((current) =>
        current === addedRecipient.id ? null : current,
      );
    }, 1400);

    return () => window.clearTimeout(timer);
  }, [fields]);

  const handleAddRecipient = () => {
    shouldHighlightNextRecipientRef.current = true;
    append({
      recipient_type: DistributionRecipientTypes.STORE,
      employee_id: "",
      percentage: 0,
    });
  };

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
      <DialogContent
        className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl"
        showCloseButton={!isPending}
      >
        <DialogHeader className="shrink-0 border-b border-zinc-100 px-5 py-4 sm:px-6">
          <DialogTitle>
            {isEdit ? "Edit distribution rule" : "Create distribution rule"}
          </DialogTitle>
          <DialogDescription>
            Define how each tip splits. Percentages must total 100%; the first
            recipient absorbs rounding remainders.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={onSubmit}
          className="flex min-h-0 flex-1 flex-col"
          noValidate
        >
          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
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
              <AnimatePresence initial={false} mode="popLayout">
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
                const isHighlighted = highlightedRecipientId === field.id;

                return (
                  <motion.div
                    key={field.id}
                    id={`recipient-card-${field.id}`}
                    layout
                    initial={{ opacity: 0, y: -14, scale: 0.97 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      boxShadow: isHighlighted
                        ? "0 0 0 2px rgba(200, 241, 105, 0.55), 0 8px 24px -12px rgba(24, 24, 27, 0.18)"
                        : "0 0 0 0px rgba(200, 241, 105, 0), 0 1px 2px 0 rgba(24, 24, 27, 0.05)",
                    }}
                    exit={{
                      opacity: 0,
                      y: -10,
                      scale: 0.97,
                      transition: { duration: 0.18, ease: RECIPIENT_MOTION_EASE },
                    }}
                    transition={{
                      layout: { duration: 0.28, ease: RECIPIENT_MOTION_EASE },
                      opacity: { duration: 0.26, ease: RECIPIENT_MOTION_EASE },
                      y: { duration: 0.32, ease: RECIPIENT_MOTION_EASE },
                      scale: { duration: 0.28, ease: RECIPIENT_MOTION_EASE },
                      boxShadow: { duration: 0.45, ease: RECIPIENT_MOTION_EASE },
                    }}
                    className="space-y-3 rounded-2xl border border-zinc-200/80 bg-white p-3.5 shadow-xs"
                  >
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{
                          backgroundColor: isStore
                            ? "rgb(244 244 245)"
                            : "rgb(240 249 255)",
                          color: isStore
                            ? "rgb(82 82 91)"
                            : "rgb(30 64 175)",
                        }}
                        transition={{
                          duration: 0.24,
                          ease: RECIPIENT_MOTION_EASE,
                        }}
                        className="flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold tabular-nums"
                        aria-hidden
                      >
                        {index + 1}
                      </motion.div>

                      <div
                        className="relative flex min-w-0 flex-1 rounded-lg bg-zinc-100 p-1"
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
                                "relative flex min-w-0 flex-1 items-center justify-center gap-1 rounded-md px-1.5 py-1.5 text-xs font-semibold transition-colors",
                                selected
                                  ? "text-ink-charcoal"
                                  : "text-zinc-500 hover:text-ink-charcoal",
                              )}
                            >
                              {selected ? (
                                <motion.span
                                  layoutId={`recipient-type-pill-${field.id}`}
                                  className="absolute inset-0 rounded-md bg-white shadow-sm"
                                  transition={{
                                    type: "spring",
                                    stiffness: 460,
                                    damping: 34,
                                    mass: 0.75,
                                  }}
                                />
                              ) : null}
                              <span className="relative z-10 inline-flex min-w-0 items-center justify-center gap-1">
                                <motion.span
                                  animate={{
                                    scale: selected ? 1.05 : 1,
                                    opacity: selected ? 1 : 0.72,
                                  }}
                                  transition={{
                                    duration: 0.2,
                                    ease: RECIPIENT_MOTION_EASE,
                                  }}
                                  className="inline-flex shrink-0"
                                >
                                  <Icon className="size-3.5" strokeWidth={2} />
                                </motion.span>
                                <span className="truncate">
                                  {option.id === DistributionRecipientTypes.STORE
                                    ? "Business"
                                    : "Employee"}
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <AnimatePresence mode="wait" initial={false}>
                          {isStore ? (
                            <motion.p
                              key={`${field.id}-store`}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{
                                duration: 0.22,
                                ease: RECIPIENT_MOTION_EASE,
                              }}
                              className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-3 py-2.5 text-[11px] leading-5 text-zinc-500"
                            >
                              {pct}% stays with the business house account.
                            </motion.p>
                          ) : (
                            <motion.div
                              key={`${field.id}-employee`}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{
                                duration: 0.22,
                                ease: RECIPIENT_MOTION_EASE,
                              }}
                            >
                              <Controller
                                name={`recipients.${index}.employee_id`}
                                control={control}
                                render={({ field: employeeField }) => (
                                  <EmployeeSelect
                                    id={`recipient-employee-${index}`}
                                    employees={employees}
                                    value={employeeField.value ?? ""}
                                    onValueChange={employeeField.onChange}
                                    emptyValue=""
                                    emptyLabel="Select employee"
                                    placeholder="Select employee"
                                    showPosition
                                    invalid={!!recipientError?.employee_id}
                                    aria-label={`Employee for recipient ${index + 1}`}
                                    className="w-full"
                                  />
                                )}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="flex items-center justify-between gap-2 sm:justify-start">
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
                          className="size-8 shrink-0 text-zinc-500 hover:bg-signal-red/10 hover:text-signal-red"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>

                    {recipientError?.employee_id ? (
                      <p className="text-xs text-red-600">
                        {recipientError.employee_id.message}
                      </p>
                    ) : null}
                    {recipientError?.percentage ? (
                      <p className="text-xs text-red-600">
                        {recipientError.percentage.message}
                      </p>
                    ) : null}
                  </motion.div>
                );
              })}
              </AnimatePresence>
            </div>

            {typeof errors.recipients?.message === "string" ? (
              <p className="text-xs text-red-600">{errors.recipients.message}</p>
            ) : null}
            {typeof errors.recipients?.root?.message === "string" ? (
              <p className="text-xs text-red-600">
                {errors.recipients.root.message}
              </p>
            ) : null}

            <motion.button
              type="button"
              disabled={isPending}
              onClick={handleAddRecipient}
              whileTap={{ scale: 0.985 }}
              transition={{ duration: 0.14, ease: RECIPIENT_MOTION_EASE }}
              className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/60 py-3 text-xs font-semibold text-zinc-500 transition-colors hover:border-electric-lime hover:bg-brand-50/50 hover:text-brand-800 disabled:opacity-50"
            >
              <Plus className="size-3.5" strokeWidth={2} />
              Add recipient
            </motion.button>
          </div>
          </div>

          <DialogFooter className="mx-0 mb-0 shrink-0 gap-2 border-t border-zinc-100 px-5 py-4 sm:justify-between sm:px-6">
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
