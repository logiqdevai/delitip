"use client";

import { type FC, type ReactNode, useState } from "react";
import {
  Check,
  ChevronDown,
  Coins,
  Copy,
  Download,
  ExternalLink,
  LayoutTemplate,
  MoreHorizontal,
  Pencil,
  Printer,
  QrCode as QrCodeIcon,
  Smartphone,
  Star,
  Trash2,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { QrCodeSelectionModeFormOptions } from "@/config/constants/dropdowns/qr-codes/qr-code-selection-mode-form.options";
import { useDropdownLabel } from "@/hooks/use-dropdown-options";
import { useQrCodeActions } from "@/app/dashboard/access/hooks/use-qr-code-actions";
import { TemplateEditorDialog } from "@/app/dashboard/access/components/qr-templates/template-editor/template-editor-dialog";
import { QR_TEMPLATES } from "@/features/qr-templates/config/qr-templates.config";
import { useQrCodeStats } from "@/features/qr-codes/hooks/use-qr-codes";
import type { QrCode } from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import { getQrCodeEmployeeCount } from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import { getAbsoluteTipUrl } from "@/features/qr-codes/utils/qr-tip-url.utils";
import type { Store } from "@/features/stores/interfaces/stores.interfaces";
import { formatMoney } from "@/lib/money";
import { QrImage } from "@/components/ui/qr-image";
import { cn } from "@/lib/utils";

interface QrCodeCardProps {
  qr: QrCode;
  store: Store;
  onEdit: (qr: QrCode) => void;
  onDelete: (qr: QrCode) => void;
}

const StatRow: FC<{
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}> = ({ icon: Icon, label, children }) => (
  <div className="flex items-start gap-3">
    <Icon
      className="mt-0.5 size-4 shrink-0 text-zinc-400"
      strokeWidth={1.75}
    />
    <div className="min-w-0">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-0.5 truncate text-sm font-semibold text-ink-charcoal">
        {children}
      </p>
    </div>
  </div>
);

const StatRowSkeleton: FC = () => (
  <div className="flex items-start gap-3">
    <Skeleton className="mt-0.5 size-4 rounded" />
    <div className="space-y-1.5">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);

export const QrCodeCard: FC<QrCodeCardProps> = ({
  qr,
  store,
  onEdit,
  onDelete,
}) => {
  const t = useTranslations("dashboard.access.qrCard");
  const locale = useLocale();
  const dropdownLabel = useDropdownLabel();
  const [templateOpen, setTemplateOpen] = useState(false);
  const statsQuery = useQrCodeStats(qr.id);
  const stats = statsQuery.data;
  const tipUrl = getAbsoluteTipUrl(store.slug, qr.code);
  const employeeCount = getQrCodeEmployeeCount(qr);
  const {
    busy,
    copied,
    copy: handleCopy,
    download: handleDownload,
    print: handlePrint,
  } = useQrCodeActions({
    tipUrl,
    label: qr.label,
    filename: `${qr.label || qr.code}-qr`,
  });

  return (
    <div
      className={cn(
        "@container flex flex-col gap-5 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm @md:p-5",
        !qr.is_active && "opacity-75",
      )}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-900">
          <QrCodeIcon className="size-5" strokeWidth={2} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-sm font-bold text-ink-charcoal">
              {qr.label}
            </h3>
            <button
              type="button"
              onClick={() => onEdit(qr)}
              aria-label={t("editAria", { label: qr.label })}
              title={t("editTitle")}
              className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-zinc-400 outline-none transition hover:bg-zinc-100 hover:text-ink-charcoal focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Pencil className="size-3.5" strokeWidth={2} />
            </button>
          </div>
          <div className="mt-0.5 flex items-center gap-1">
            <a
              href={tipUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-0 truncate text-xs text-zinc-400 underline-offset-2 hover:text-brand-700 hover:underline"
            >
              {tipUrl}
            </a>
            <button
              type="button"
              onClick={() => void handleCopy()}
              aria-label={copied ? t("copiedAria") : t("copyAria")}
              className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-zinc-400 outline-none transition hover:bg-zinc-100 hover:text-ink-charcoal focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {copied ? (
                <Check className="size-3.5 text-brand-700" strokeWidth={2} />
              ) : (
                <Copy className="size-3.5" strokeWidth={2} />
              )}
            </button>
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
              "mt-2 w-fit @sm:hidden",
              qr.is_active
                ? "bg-brand-50 text-brand-700"
                : "bg-neutral-fill text-zinc-500",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "size-1.5 rounded-full",
                qr.is_active ? "bg-brand-700" : "bg-zinc-400",
              )}
            />
            {qr.is_active ? t("active") : t("inactive")}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
              "@max-sm:hidden",
              qr.is_active
                ? "bg-brand-50 text-brand-700"
                : "bg-neutral-fill text-zinc-500",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "size-1.5 rounded-full",
                qr.is_active ? "bg-brand-700" : "bg-zinc-400",
              )}
            />
            {qr.is_active ? t("active") : t("inactive")}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-sm" }),
                "text-zinc-500 hover:text-ink-charcoal",
              )}
              aria-label={t("actionsAria", { label: qr.label })}
            >
              <MoreHorizontal className="size-4" strokeWidth={2} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-48">
              <DropdownMenuItem onClick={() => onEdit(qr)}>
                <Pencil />
                {t("edit")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => void handleCopy()}>
                <Copy />
                {t("copyLink")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  window.open(tipUrl, "_blank", "noopener,noreferrer")
                }
              >
                <ExternalLink />
                {t("openTipPage")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(qr)}
              >
                <Trash2 />
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 @md:flex-row @md:items-center @md:gap-8 @md:px-2">
        <div className="relative shrink-0 pb-3">
          <button
            type="button"
            onClick={() => onEdit(qr)}
            aria-label={t("editQrAria", { label: qr.label })}
            title={t("editTitle")}
            className="flex size-44 cursor-pointer items-center justify-center rounded-3xl border border-zinc-200 bg-white p-3 shadow-md outline-none transition duration-200 ease-out hover:scale-105 hover:shadow-lg focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-100 motion-reduce:transition-none motion-reduce:hover:scale-100"
          >
            <QrImage
              value={tipUrl}
              alt={t("qrAlt", { label: qr.label })}
              className="size-full object-contain"
            />
          </button>
          <span className="pointer-events-none absolute bottom-0 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-[11px] font-semibold whitespace-nowrap text-brand-900 shadow-xs">
            <Smartphone className="size-3" strokeWidth={2} />
            {t("scanToTip")}
          </span>
        </div>

        <div className="grid w-full min-w-0 flex-1 grid-cols-1 gap-x-4 gap-y-4 @sm:grid-cols-2 @md:grid-cols-1">
          <StatRow icon={Users} label={t("appliesTo")}>
            {dropdownLabel(QrCodeSelectionModeFormOptions, qr.selection_mode)}
          </StatRow>
          <StatRow icon={UsersRound} label={t("teamMembers")}>
            {t("employeesCount", { count: employeeCount })}
          </StatRow>
          {stats ? (
            <>
              <StatRow icon={Coins} label={t("tips")}>
                {t("tipsCount", { count: stats.tips_count })}
                <span aria-hidden className="mx-1.5 text-zinc-300">
                  ·
                </span>
                {formatMoney(stats.tips_total_amount, store.currency, locale)}
              </StatRow>
              <StatRow icon={Star} label={t("reviews")}>
                {t("reviewsCount", { count: stats.reviews_count })}
              </StatRow>
            </>
          ) : (
            <>
              <StatRowSkeleton />
              <StatRowSkeleton />
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-[1.5fr_1fr] gap-2">
        <div className="flex transition-[translate] duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transition-none">
          <Button
            type="button"
            className="h-11 flex-1 hover:translate-y-0 rounded-l-xl rounded-r-none bg-electric-lime text-sm font-semibold text-ink-charcoal shadow-sm"
            disabled={busy !== null}
            onClick={() => void handleDownload()}
          >
            <Download data-icon="inline-start" className="size-4" />
            {busy === "download" ? t("preparing") : t("download")}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: "default" }),
                "h-11 hover:translate-y-0 rounded-l-none rounded-r-xl border-l border-ink-charcoal/10 bg-electric-lime px-3 text-ink-charcoal shadow-sm",
              )}
              aria-label={t("moreDownload")}
            >
              <ChevronDown className="size-4" strokeWidth={2} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-44">
              <DropdownMenuItem
                disabled={busy !== null}
                onClick={() => void handleDownload()}
              >
                <Download />
                {t("downloadPng")}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={busy !== null}
                onClick={() => void handlePrint()}
              >
                <Printer />
                {t("print")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => void handleCopy()}>
                <Copy />
                {t("copyLink")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-xl border border-zinc-200 bg-white text-sm font-semibold text-ink-charcoal hover:bg-zinc-50"
          onClick={() => setTemplateOpen(true)}
        >
          <LayoutTemplate data-icon="inline-start" className="size-4" />
          {t("template")}
        </Button>
      </div>

      <TemplateEditorDialog
        open={templateOpen}
        onOpenChange={setTemplateOpen}
        store={store}
        qrLabel={qr.label}
        tipUrl={tipUrl}
        initialTemplateId={QR_TEMPLATES[0].id}
      />
    </div>
  );
};
