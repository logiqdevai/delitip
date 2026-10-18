"use client";

import { type FC, useEffect, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import { User, Users, UsersRound } from "lucide-react";
import { InFlowSelect } from "@/app/dashboard/access/components/in-flow-select";
import { SpotFormDialog } from "@/app/dashboard/access/components/spot-form-dialog";
import { SectionCard } from "@/app/dashboard/access/qr/components/sections/section-card";
import { useQrEditor } from "@/app/dashboard/access/qr/hooks/use-qr-editor";
import { DistributionRuleFormDialog } from "@/app/dashboard/distribution/components/distribution-rule-form-dialog";
import { EmployeeFormDialog } from "@/app/dashboard/employees/components/employee-form-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EmployeeAvatar } from "@/components/ui/employee-avatar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { getQrCodeSelectionModeDescription } from "@/config/constants/dropdowns/qr-codes/qr-code-selection-mode-description.options";
import { QrCodeSelectionModeFormOptions } from "@/config/constants/dropdowns/qr-codes/qr-code-selection-mode-form.options";
import { QrEditorSections } from "@/config/constants/dropdowns/qr-codes/qr-editor-section.options";
import { useDistributionRules } from "@/features/distribution/hooks/use-distribution";
import { useEmployees } from "@/features/employees/hooks/use-employees";
import {
  QrCodeSelectionModes,
  type QrCodeSelectionMode,
} from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import { useSpots } from "@/features/spots/hooks/use-spots";
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

export const RecipientsSection: FC = () => {
  const { form, store } = useQrEditor();
  const { control, setValue } = form;
  const storeId = store.id;

  const [ruleFormOpen, setRuleFormOpen] = useState(false);
  const [employeeFormOpen, setEmployeeFormOpen] = useState(false);
  const [spotFormOpen, setSpotFormOpen] = useState(false);

  const employeesQuery = useEmployees(storeId, { limit: 100, is_active: true });
  const rulesQuery = useDistributionRules(storeId);
  const spotsQuery = useSpots(storeId, { limit: 100, is_active: true });

  const selectedEmployeeIds = useWatch({ control, name: "qr.employee_ids" });
  const selectionMode = useWatch({ control, name: "qr.selection_mode" });
  const selectedEmployeeCount = selectedEmployeeIds.length;
  const multiEmployeeModesEnabled = selectedEmployeeCount >= 2;

  // Multi-recipient modes need 2+ people; fall back to "choose one" otherwise.
  useEffect(() => {
    if (multiEmployeeModesEnabled) return;
    if (!MULTI_EMPLOYEE_SELECTION_MODES.has(selectionMode)) return;
    setValue("qr.selection_mode", QrCodeSelectionModes.CHOOSE_ONE, {
      shouldDirty: true,
    });
  }, [multiEmployeeModesEnabled, selectionMode, setValue]);

  const employees = employeesQuery.data?.data ?? [];
  const rules = rulesQuery.data ?? [];
  const spots = spotsQuery.data?.data ?? [];

  return (
    <SectionCard section={QrEditorSections.RECIPIENTS}>
      <div className="space-y-2">
        <Label>Employees</Label>
        <div className="flex max-h-56 min-w-0 flex-col gap-1 overflow-y-auto overflow-x-hidden rounded-xl border border-zinc-200 p-2">
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
              name="qr.employee_ids"
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
                          onCheckedChange={(next) =>
                            field.onChange(
                              next === true
                                ? [...field.value, employee.id]
                                : field.value.filter((id) => id !== employee.id),
                            )
                          }
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
          className="h-auto px-0 text-xs font-semibold text-brand-700 decoration-brand-700/40 hover:decoration-brand-700"
          onClick={() => setEmployeeFormOpen(true)}
        >
          Create employee
        </Button>
      </div>

      <div className="space-y-2">
        <Label id="qr-mode-label">Selection mode</Label>
        <Controller
          name="qr.selection_mode"
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
                const disabled =
                  MULTI_EMPLOYEE_SELECTION_MODES.has(option.id) &&
                  !multiEmployeeModesEnabled;
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
        <div className="flex max-h-40 min-w-0 flex-col gap-1 overflow-y-auto overflow-x-hidden rounded-xl border border-zinc-200 p-2">
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
              name="qr.spot_ids"
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
                          onCheckedChange={(next) =>
                            field.onChange(
                              next === true
                                ? [...field.value, spot.id]
                                : field.value.filter((id) => id !== spot.id),
                            )
                          }
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
          className="h-auto px-0 text-xs font-semibold text-brand-700 decoration-brand-700/40 hover:decoration-brand-700"
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
          name="qr.distribution_rule_id"
          control={control}
          render={({ field }) => (
            <InFlowSelect
              id="qr-rule"
              value={field.value ?? ""}
              onValueChange={field.onChange}
              options={[
                { value: "", label: "Store default" },
                ...rules.map((rule) => ({ value: rule.id, label: rule.name })),
              ]}
            />
          )}
        />
        <p className="text-[11px] text-zinc-400">
          Store default follows the rule set on the Tipping step. If none is
          set, tips are recorded without a split.
        </p>
        <Button
          type="button"
          variant="link"
          className="h-auto px-0 text-xs font-semibold text-brand-700 decoration-brand-700/40 hover:decoration-brand-700"
          onClick={() => setRuleFormOpen(true)}
        >
          Create distribution rule
        </Button>
      </div>

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
    </SectionCard>
  );
};
