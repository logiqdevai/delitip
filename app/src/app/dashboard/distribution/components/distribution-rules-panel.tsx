"use client";

import { type FC, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, Plus, Scale } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
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
import type { Store } from "@/features/stores/interfaces/stores.interfaces";
import { cn } from "@/lib/utils";
import { Routes } from "@/routes/routes";
import { getErrorMessage } from "@/lib/api-error";

interface DistributionRulesPanelProps {
  storeId: string;
  store: Store;
}

export const DistributionRulesPanel: FC<DistributionRulesPanelProps> = ({
  storeId,
  store,
}) => {
  const t = useTranslations("dashboard.team.distribution.panel");
  const tSummary = useTranslations("dashboard.team.distribution.summary");
  const rulesQuery = useDistributionRules(storeId);
  const setDefault = useSetDefaultDistributionRule(storeId);
  const deleteRule = useDeleteDistributionRule({ showErrorToast: false });
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

  const rules = rulesQuery.data ?? [];
  const defaultRuleId = store.default_distribution_rule_id ?? null;
  const defaultRule = rules.find((rule) => rule.id === defaultRuleId) ?? null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-sm font-bold text-ink-charcoal">
            {t("title")}
          </h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            {t("description", { store: store.name })}
          </p>
        </div>
        <Button
          type="button"
          className="h-(--control-height-default) max-sm:h-11 rounded-xl bg-electric-lime px-3.5 text-base font-semibold text-ink-charcoal shadow-sm"
          onClick={openCreate}
        >
          <Plus data-icon="inline-start" className="size-3.5" />
          {t("createRule")}
        </Button>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-1">
          <div className="flex h-5 items-center">
            <h3 className="text-sm font-bold text-ink-charcoal">
              {t("storeDefault")}
            </h3>
          </div>
          <div className="space-y-2 rounded-2xl border border-zinc-200/80 bg-white px-4 py-5 shadow-xs">
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
                  {formatRecipientSummary(defaultRule.recipients, tSummary)}
                </p>
                <p className="text-base text-zinc-400">
                  {t("defaultHint")}
                </p>
              </>
            ) : (
              <p className="text-xs text-zinc-500">
                {t("noDefault")}
              </p>
            )}
            {rulesQuery.isPending ? null : (
              <Link
                href={Routes.dashboard.settings.tipping}
                className={cn(
                  buttonVariants({ variant: "outline", size: "default" }),
                  "mt-3 w-full justify-center gap-1.5 rounded-xl text-base font-semibold",
                )}
              >
                {defaultRule ? t("changeDefault") : t("setDefault")}
                <ArrowRight className="size-3.5" strokeWidth={2} />
              </Link>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="flex h-5 items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-ink-charcoal">
              {t("library")}
            </h3>
            <span className="text-xs text-zinc-400">
              {t("ruleCount", { count: rules.length })}
            </span>
          </div>

          {rulesQuery.isPending ? (
            <DistributionRulesSkeleton />
          ) : rulesQuery.isError ? (
            <Empty className="border border-dashed border-zinc-200 bg-white py-12">
              <EmptyHeader>
                <EmptyTitle>{t("loadErrorTitle")}</EmptyTitle>
                <EmptyDescription>{getErrorMessage(rulesQuery.error)}</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void rulesQuery.refetch()}
                >
                  {t("tryAgain")}
                </Button>
              </EmptyContent>
            </Empty>
          ) : rules.length === 0 ? (
            <Empty className="border border-dashed border-zinc-200 bg-white py-12">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Scale />
                </EmptyMedia>
                <EmptyTitle>{t("emptyTitle")}</EmptyTitle>
                <EmptyDescription>
                  {t("emptyDescription")}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  type="button"
                  className="rounded-xl bg-electric-lime text-ink-charcoal"
                  onClick={openCreate}
                >
                  <Plus data-icon="inline-start" className="size-3.5" />
                  {t("createRule")}
                </Button>
              </EmptyContent>
            </Empty>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
        title={t("deleteTitle")}
        description={
          pendingDelete
            ? t("deleteDescription", { name: pendingDelete.name })
            : t("deleteDescriptionFallback")
        }
        confirmLabel={t("deleteConfirm")}
        isPending={deleteRule.isPending}
        onConfirm={async () => {
          if (!pendingDelete) return;
          await deleteRule.mutateAsync(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
};
