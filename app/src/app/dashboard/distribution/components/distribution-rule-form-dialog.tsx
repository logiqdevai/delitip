"use client";

import { type FC, useEffect } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
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
  type DistributionRule,
} from "@/features/distribution/interfaces/distribution.interfaces";
import {
  distributionRuleFormSchema,
  type DistributionRuleFormData,
} from "@/features/distribution/validation-schemas/distribution.schema";
import { useEmployees } from "@/features/employees/hooks/use-employees";

interface DistributionRuleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: string;
  rule?: DistributionRule | null;
}

const emptyRecipient = (): DistributionRuleFormData["recipients"][number] => ({
  recipient_type: DistributionRecipientTypes.EMPLOYEE,
  employee_id: "",
  percentage: 100,
});

export const DistributionRuleFormDialog: FC<DistributionRuleFormDialogProps> = ({
  open,
  onOpenChange,
  storeId,
  rule,
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
        await createRule.mutateAsync(payload);
      }
      onOpenChange(false);
    } catch {}
  });

  const employees = employeesQuery.data?.data ?? [];

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isPending) return;
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-lg" showCloseButton={!isPending}>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit distribution rule" : "Create distribution rule"}
          </DialogTitle>
          <DialogDescription>
            Percentages must total 100%. The first recipient absorbs rounding
            remainders.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
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
            <div className="flex items-center justify-between gap-2">
              <Label>Recipients</Label>
              <span
                className={
                  Math.abs(percentageSum - 100) <= 0.01
                    ? "text-xs font-semibold text-brand-700"
                    : "text-xs font-semibold text-red-600"
                }
              >
                {percentageSum.toFixed(0)}% / 100%
              </span>
            </div>

            {fields.map((field, index) => {
              const type = recipients[index]?.recipient_type;
              const recipientError = errors.recipients?.[index];

              return (
                <div
                  key={field.id}
                  className="space-y-2 rounded-xl border border-zinc-200 bg-zinc-50/80 p-3"
                >
                  <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
                    <div className="space-y-1">
                      <Label
                        htmlFor={`recipient-type-${index}`}
                        className="text-xs"
                      >
                        Type
                      </Label>
                      <Controller
                        name={`recipients.${index}.recipient_type`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            items={DistributionRecipientTypeFormOptions.map(
                              (option) => ({
                                label: option.label,
                                value: option.id,
                              }),
                            )}
                            value={field.value}
                            onValueChange={(value) => {
                              if (!value) return;
                              field.onChange(value);
                              if (value === DistributionRecipientTypes.STORE) {
                                setValue(
                                  `recipients.${index}.employee_id`,
                                  "",
                                );
                              }
                            }}
                          >
                            <SelectTrigger
                              id={`recipient-type-${index}`}
                              className="w-full"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {DistributionRecipientTypeFormOptions.map(
                                  (option) => (
                                    <SelectItem
                                      key={option.id}
                                      value={option.id}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ),
                                )}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label
                        htmlFor={`recipient-pct-${index}`}
                        className="text-xs"
                      >
                        %
                      </Label>
                      <Input
                        id={`recipient-pct-${index}`}
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        className="w-20"
                        aria-invalid={!!recipientError?.percentage}
                        {...register(`recipients.${index}.percentage`)}
                      />
                    </div>

                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        disabled={fields.length <= 1 || isPending}
                        onClick={() => remove(index)}
                        aria-label="Remove recipient"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>

                  {type === DistributionRecipientTypes.EMPLOYEE ? (
                    <div className="space-y-1">
                      <Label
                        htmlFor={`recipient-employee-${index}`}
                        className="text-xs"
                      >
                        Employee
                      </Label>
                      <Controller
                        name={`recipients.${index}.employee_id`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            items={[
                              { label: "Select employee", value: "" },
                              ...employees.map((employee) => ({
                                label: employee.full_name,
                                value: employee.id,
                              })),
                            ]}
                            value={field.value}
                            onValueChange={(value) =>
                              field.onChange(value ?? "")
                            }
                          >
                            <SelectTrigger
                              id={`recipient-employee-${index}`}
                              className="w-full"
                              aria-invalid={!!recipientError?.employee_id}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="">Select employee</SelectItem>
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
                      {recipientError?.employee_id ? (
                        <p className="text-xs text-red-600">
                          {recipientError.employee_id.message}
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  {recipientError?.percentage ? (
                    <p className="text-xs text-red-600">
                      {recipientError.percentage.message}
                    </p>
                  ) : null}
                </div>
              );
            })}

            {typeof errors.recipients?.message === "string" ? (
              <p className="text-xs text-red-600">{errors.recipients.message}</p>
            ) : null}
            {typeof errors.recipients?.root?.message === "string" ? (
              <p className="text-xs text-red-600">
                {errors.recipients.root.message}
              </p>
            ) : null}

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() =>
                append({
                  recipient_type: DistributionRecipientTypes.STORE,
                  employee_id: "",
                  percentage: 0,
                })
              }
            >
              <Plus data-icon="inline-start" className="size-3.5" />
              Add recipient
            </Button>
          </div>

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
              {isEdit ? "Save changes" : "Create rule"}
            </ActionButtonWithPending>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
