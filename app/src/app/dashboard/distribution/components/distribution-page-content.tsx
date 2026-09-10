"use client";

import { type FC, useState } from "react";
import { Plus, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DetailSkeleton } from "@/components/ui/detail-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ConfirmationDialog,
  useConfirmationDialog,
} from "@/components/ui/confirmation-dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { DistributionRuleCard } from "@/app/dashboard/distribution/components/distribution-rule-card";
import { DistributionRuleFormDialog } from "@/app/dashboard/distribution/components/distribution-rule-form-dialog";
import { DistributionRulesSkeleton } from "@/app/dashboard/distribution/components/distribution-rules-skeleton";
import {
  useDeleteDistributionRule,
  useDistributionRules,
  useSetDefaultDistributionRule,
} from "@/features/distribution/hooks/use-distribution";
import type { DistributionRule } from "@/features/distribution/interfaces/distribution.interfaces";
import { formatRecipientSummary } from "@/features/distribution/utils/distribution-summary.utils";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";

export const DistributionPageContent: FC = () => {
  const { storeId, store, isPending: workspacePending, isReady } =
    useWorkspace();
  const rulesQuery = useDistributionRules(storeId ?? "");
  const setDefault = useSetDefaultDistributionRule(storeId ?? "");
  const deleteRule = useDeleteDistributionRule();
  const deleteConfirm = useConfirmationDialog();

  const [formOpen, setFormOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<DistributionRule | null>(null);
  const [pendingDelete, setPendingDelete] = useState<DistributionRule | null>(
    null,
  );

  const openCreate = () => {
    setEditingRule(null);
    setFormOpen(true);
  };

  const openEdit = (rule: DistributionRule) => {
    setEditingRule(rule);
    setFormOpen(true);
  };

  const handleSetDefault = (rule: DistributionRule) => {
    void setDefault.mutateAsync({ distribution_rule_id: rule.id });
  };

  const handleDelete = (rule: DistributionRule) => {
    setPendingDelete(rule);
    deleteConfirm.openDialog();
  };

  if (workspacePending) {
    return (
      <div className="space-y-6">
        <DetailSkeleton fieldCount={2} />
        <DistributionRulesSkeleton />
      </div>
    );
  }

  if (!isReady || !storeId) {
    return (
      <Empty className="border border-dashed border-zinc-200 bg-white py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Scale />
          </EmptyMedia>
          <EmptyTitle>No store selected</EmptyTitle>
          <EmptyDescription>
            Finish business setup before configuring tip distribution.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const rules = rulesQuery.data ?? [];
  const defaultRuleId = store?.default_distribution_rule_id ?? null;
  const defaultRule = rules.find((rule) => rule.id === defaultRuleId) ?? null;

  return (
    <>
      <DashboardPageHeader
        title="Tip Distribution"
        description={
          store
            ? `How tips split for ${store.name}. Changes apply to future tips only.`
            : "Transparent payout configuration and automated share allocation."
        }
        actions={
          <Button
            type="button"
            className="h-(--control-height-default) max-sm:h-11 rounded-xl bg-electric-lime px-3.5 text-chip font-semibold text-ink-charcoal shadow-sm hover:bg-brand-700"
            onClick={openCreate}
          >
            <Plus data-icon="inline-start" className="size-3.5" />
            Create rule
          </Button>
        }
      />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-1">
          <div className="flex h-5 items-center">
            <h2 className="text-sm font-bold text-ink-charcoal">Store default</h2>
          </div>
          <div className="space-y-2 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
            {rulesQuery.isPending ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-full" />
              </div>
            ) : defaultRule ? (
              <>
                <p className="text-sm font-bold text-ink-charcoal">
                  {defaultRule.name}
                </p>
                <p className="text-xs leading-relaxed text-zinc-500">
                  {formatRecipientSummary(defaultRule.recipients)}
                </p>
                <p className="text-[11px] text-zinc-400">
                  Used when a QR code does not override the rule.
                </p>
              </>
            ) : (
              <p className="text-xs text-zinc-500">
                No default rule yet. Create a rule and set it as the store
                default.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="flex h-5 items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-ink-charcoal">Rules library</h2>
            <span className="text-xs text-zinc-400">
              {rules.length} {rules.length === 1 ? "rule" : "rules"}
            </span>
          </div>

          {rulesQuery.isPending ? (
            <DistributionRulesSkeleton />
          ) : rulesQuery.isError ? (
            <Empty className="border border-dashed border-zinc-200 bg-white py-12">
              <EmptyHeader>
                <EmptyTitle>Could not load rules</EmptyTitle>
                <EmptyDescription>
                  {rulesQuery.error.message}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void rulesQuery.refetch()}
                >
                  Try again
                </Button>
              </EmptyContent>
            </Empty>
          ) : rules.length === 0 ? (
            <Empty className="border border-dashed border-zinc-200 bg-white py-12">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Scale />
                </EmptyMedia>
                <EmptyTitle>No distribution rules yet</EmptyTitle>
                <EmptyDescription>
                  Create a standard rule such as 100% to the tipped employee,
                  then set it as the store default.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  type="button"
                  className="rounded-xl bg-electric-lime text-ink-charcoal hover:bg-brand-700"
                  onClick={openCreate}
                >
                  <Plus data-icon="inline-start" className="size-3.5" />
                  Create rule
                </Button>
              </EmptyContent>
            </Empty>
          ) : (
            <div className="space-y-3">
              {rules.map((rule) => (
                <DistributionRuleCard
                  key={rule.id}
                  rule={rule}
                  isDefault={rule.id === defaultRuleId}
                  onEdit={openEdit}
                  onSetDefault={handleSetDefault}
                  onDelete={handleDelete}
                  isSettingDefault={setDefault.isPending}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <DistributionRuleFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        storeId={storeId}
        rule={editingRule}
      />

      <ConfirmationDialog
        state={{
          ...deleteConfirm,
          onOpenChange: (open) => {
            deleteConfirm.onOpenChange(open);
            if (!open) setPendingDelete(null);
          },
        }}
        title="Delete distribution rule?"
        description={
          pendingDelete
            ? `"${pendingDelete.name}" will be permanently removed. Rules already used for past tips, set as the store default, or assigned to a QR code can't be deleted.`
            : "This rule will be permanently removed."
        }
        confirmLabel="Delete"
        isPending={deleteRule.isPending}
        onConfirm={async () => {
          if (!pendingDelete) return;
          await deleteRule.mutateAsync(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </>
  );
};
