"use client";

import { type FC } from "react";
import { Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Check, Copy, Download, Printer } from "lucide-react";
import { useQrCodeActions } from "@/app/dashboard/access/hooks/use-qr-code-actions";
import { SectionCard } from "@/app/dashboard/access/qr/components/sections/section-card";
import { useQrEditor } from "@/app/dashboard/access/qr/hooks/use-qr-editor";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrImage } from "@/components/ui/qr-image";
import { QrEditorSections } from "@/config/constants/dropdowns/qr-codes/qr-editor-section.options";
import type { QrCode } from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import {
  getAbsoluteTipUrl,
  getTipPath,
} from "@/features/qr-codes/utils/qr-tip-url.utils";
import type { Store } from "@/features/stores/interfaces/stores.interfaces";

const TipLinkPanel: FC<{ store: Store; qr: QrCode; label: string }> = ({
  store,
  qr,
  label,
}) => {
  const t = useTranslations("dashboard.access.qrEditor.details");
  const tipUrl = getAbsoluteTipUrl(store.slug, qr.code);
  const { busy, copied, copy, download, print } = useQrCodeActions({
    tipUrl,
    label: qr.label,
    filename: `${qr.label || qr.code}-qr`,
  });

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-zinc-50 px-4 py-3 text-left text-xs text-zinc-500">
        <div className="font-semibold text-ink-charcoal">{t("tipUrl")}</div>
        <div className="mt-1 flex items-start gap-1">
          <p className="min-w-0 flex-1 break-all">{tipUrl}</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="size-7 shrink-0 px-0 text-zinc-400 hover:text-ink-charcoal"
            onClick={() => void copy()}
            aria-label={copied ? t("copiedAria") : t("copyAria")}
          >
            {copied ? (
              <Check className="size-3.5 text-brand-700" strokeWidth={2} />
            ) : (
              <Copy className="size-3.5" strokeWidth={2} />
            )}
          </Button>
        </div>
        <p className="mt-1 text-base text-zinc-400">
          {t("path", { path: getTipPath(store.slug, qr.code) })}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex size-36 shrink-0 items-center justify-center rounded-2xl bg-ink-charcoal p-2.5 shadow-inner">
          <QrImage
            value={tipUrl}
            alt={t("qrAlt", { label: label || qr.label })}
            className="size-full rounded-xl bg-white object-contain p-1"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy !== null}
            onClick={() => void download()}
          >
            <Download data-icon="inline-start" className="size-3.5" />
            {busy === "download" ? t("preparing") : t("downloadPng")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy !== null}
            onClick={() => void print()}
          >
            <Printer data-icon="inline-start" className="size-3.5" />
            {t("print")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export const DetailsSection: FC = () => {
  const t = useTranslations("dashboard.access.qrEditor.details");
  const { form, store, qr, isEdit } = useQrEditor();
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;

  const label = watch("qr.label");

  return (
    <SectionCard section={QrEditorSections.DETAILS}>
      <div className="space-y-1.5">
        <Label htmlFor="qr-label">{t("label")}</Label>
        <Input
          id="qr-label"
          placeholder={t("labelPlaceholder")}
          aria-invalid={!!errors.qr?.label}
          {...register("qr.label")}
        />
        {errors.qr?.label ? (
          <p className="text-xs text-red-600">{errors.qr.label.message}</p>
        ) : (
          <p className="text-base text-zinc-400">
            {t("labelHint")}
          </p>
        )}
      </div>

      {isEdit ? (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-100 bg-zinc-50/60 px-4 py-3.5">
          <div className="min-w-0">
            <Label htmlFor="qr-active" className="text-xs font-semibold">
              {t("activeLabel")}
            </Label>
            <p className="mt-0.5 text-base text-zinc-500">
              {t("activeHint")}
            </p>
          </div>
          <Controller
            control={control}
            name="qr.is_active"
            render={({ field }) => (
              <Switch
                id="qr-active"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
      ) : null}

      {qr ? (
        <TipLinkPanel store={store} qr={qr} label={label} />
      ) : (
        <p className="rounded-xl bg-zinc-50 px-4 py-3 text-xs text-zinc-500">
          {t("afterSave")}
        </p>
      )}
    </SectionCard>
  );
};
