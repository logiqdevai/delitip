"use client";

import { type FC, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Check,
  Copy,
  Pencil,
  Percent,
  Plus,
  QrCode as QrCodeIcon,
  User,
  Users,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { toast } from "@/components/ui/toast";
import { QrCodeSelectionModeFormOptions } from "@/config/constants/dropdowns/qr-codes/qr-code-selection-mode-form.options";
import { useDropdownLabel } from "@/hooks/use-dropdown-options";
import { useQrCodes } from "@/features/qr-codes/hooks/use-qr-codes";
import {
  getQrCodeEmployeeCount,
  QrCodeSelectionModes,
  type QrCode,
  type QrCodeSelectionMode,
} from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import { getAbsoluteTipUrl } from "@/features/qr-codes/utils/qr-tip-url.utils";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { Routes } from "@/routes/routes";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/lib/api-error";

const selectionModeIcons: Record<QrCodeSelectionMode, typeof User> = {
  [QrCodeSelectionModes.CHOOSE_ONE]: User,
  [QrCodeSelectionModes.CHOOSE_MANY]: Users,
  [QrCodeSelectionModes.TEAM]: UsersRound,
};

interface EmployeeQrCodesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: {
    id: string;
    full_name: string;
    position?: string | null;
  };
}

export const QrRow: FC<{ qr: QrCode; storeSlug: string; onEdit: (qr: QrCode) => void }> = ({
  qr,
  storeSlug,
  onEdit,
}) => {
  const t = useTranslations("dashboard.team.employees.qr");
  const dropdownLabel = useDropdownLabel();
  const [copied, setCopied] = useState(false);
  const tipUrl = getAbsoluteTipUrl(storeSlug, qr.code);
  const employeeCount = getQrCodeEmployeeCount(qr);
  const ModeIcon = selectionModeIcons[qr.selection_mode];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tipUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.add({
        title: t("copyFailedTitle"),
        description: t("copyFailedDescription"),
        type: "error",
      });
    }
  };

  return (
    <li className="min-w-0 overflow-hidden rounded-xl border border-zinc-200/80 bg-white">
      <div className="flex items-start gap-3 px-4 py-3.5 sm:gap-4 sm:p-4">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-sm font-bold text-ink-charcoal">
              {qr.label}
            </span>
            <span
              className={cn(
                "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
                qr.is_active
                  ? "bg-brand-50 text-brand-700"
                  : "bg-neutral-fill font-medium text-zinc-500",
              )}
            >
              {qr.is_active ? t("active") : t("inactive")}
            </span>
          </div>
          <div className="space-y-1">
            <p className="flex items-start gap-1.5 text-xs text-zinc-500">
              <ModeIcon
                className="mt-0.5 size-3.5 shrink-0 text-zinc-400"
                strokeWidth={2}
              />
              <span className="min-w-0 break-words">
                {dropdownLabel(QrCodeSelectionModeFormOptions, qr.selection_mode)}
              </span>
            </p>
            <p className="flex items-start gap-1.5 text-xs text-zinc-500">
              <Users
                className="mt-0.5 size-3.5 shrink-0 text-zinc-400"
                strokeWidth={2}
              />
              <span className="min-w-0 break-words">
                {t("employeesAssigned", { count: employeeCount })}
              </span>
            </p>
            <p className="flex items-start gap-1.5 text-xs text-zinc-500">
              <Percent
                className="mt-0.5 size-3.5 shrink-0 text-zinc-400"
                strokeWidth={2}
              />
              <span className="min-w-0 break-words">
                {qr.distribution_rule
                  ? t("splitByRule", { name: qr.distribution_rule.name })
                  : t("defaultSplit")}
              </span>
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-zinc-500 hover:text-ink-charcoal"
            onClick={() => void handleCopy()}
            aria-label={copied ? t("copiedUrl") : t("copyUrl")}
          >
            {copied ? (
              <Check className="size-3.5 text-brand-700" strokeWidth={2} />
            ) : (
              <Copy className="size-3.5" strokeWidth={2} />
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-zinc-500 hover:text-ink-charcoal"
            onClick={() => onEdit(qr)}
            aria-label={t("editQr", { name: qr.label })}
          >
            <Pencil className="size-3.5" strokeWidth={2} />
          </Button>
        </div>
      </div>
      <div className="border-t border-zinc-100 bg-zinc-50/80 px-3.5 py-2.5 sm:px-4">
        <a
          href={tipUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block truncate font-mono text-base leading-relaxed text-zinc-400 underline-offset-2 hover:text-brand-700 hover:underline"
          title={tipUrl}
        >
          {tipUrl}
        </a>
      </div>
    </li>
  );
};

export const EmployeeQrCodesDialog: FC<EmployeeQrCodesDialogProps> = ({
  open,
  onOpenChange,
  employee,
}) => {
  const t = useTranslations("dashboard.team.employees.qr");
  const { storeId, store } = useWorkspace();
  const router = useRouter();

  const qrCodesQuery = useQrCodes(open ? (storeId ?? "") : "", {
    employee_ids: [employee.id],
    limit: 100,
  });

  const qrCodes = qrCodesQuery.data?.data ?? [];

  const openCreate = () => {
    router.push(Routes.dashboard.accessQrNewForEmployee(employee.id));
  };

  const openEdit = (qr: QrCode) => {
    router.push(Routes.dashboard.accessQrEdit(qr.id));
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="min-w-0 grid-cols-[minmax(0,1fr)] gap-5 overflow-x-hidden px-4 py-5 sm:max-w-xl sm:gap-6 sm:p-6">
          <DialogHeader className="min-w-0">
            <DialogTitle className="pr-2 text-balance break-words">
              {t("dialogTitle", { name: employee.full_name })}
            </DialogTitle>
            <DialogDescription className="text-pretty break-words">
              {t("dialogDescription")}
            </DialogDescription>
          </DialogHeader>

          {qrCodesQuery.isPending ? (
            <div className="min-w-0 space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : qrCodesQuery.isError ? (
            <Empty className="min-w-0 border border-dashed border-zinc-200 bg-zinc-50 py-8">
              <EmptyHeader>
                <EmptyTitle>{t("loadErrorTitle")}</EmptyTitle>
                <EmptyDescription>{getErrorMessage(qrCodesQuery.error)}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : qrCodes.length === 0 ? (
            <Empty className="min-w-0 border border-dashed border-zinc-200 bg-zinc-50 py-8">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <QrCodeIcon />
                </EmptyMedia>
                <EmptyTitle>{t("emptyTitle")}</EmptyTitle>
                <EmptyDescription>
                  {t("emptyDescription")}
                </EmptyDescription>
              </EmptyHeader>
              {storeId && store ? (
                <EmptyContent>
                  <Button type="button" variant="outline" size="default" onClick={openCreate}>
                    <Plus data-icon="inline-start" className="size-3.5" />
                    {t("create")}
                  </Button>
                </EmptyContent>
              ) : null}
            </Empty>
          ) : (
            <div className="min-w-0 space-y-4">
              <ul className="max-h-[min(24rem,55vh)] min-w-0 space-y-3 overflow-y-auto overflow-x-hidden">
                {qrCodes.map((qr) => (
                  <QrRow
                    key={qr.id}
                    qr={qr}
                    storeSlug={store?.slug ?? ""}
                    onEdit={openEdit}
                  />
                ))}
              </ul>
              {storeId && store ? (
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  className="w-full max-w-full"
                  onClick={openCreate}
                >
                  <Plus data-icon="inline-start" className="size-3.5" />
                  <span className="truncate">{t("createAnother")}</span>
                </Button>
              ) : null}
            </div>
          )}
        </DialogContent>
      </Dialog>

    </>
  );
};
