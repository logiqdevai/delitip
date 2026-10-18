"use client";

import { type FC } from "react";
import Link from "next/link";
import { Controller } from "react-hook-form";
import { SectionCard } from "@/app/dashboard/access/qr/components/sections/section-card";
import { useQrEditor } from "@/app/dashboard/access/qr/hooks/use-qr-editor";
import {
  AllowCustomTipField,
  DefaultDistributionRuleField,
  TipPresetsField,
} from "@/app/dashboard/settings/tipping/components/tipping-fields";
import { buttonVariants } from "@/components/ui/button";
import { QrEditorSections } from "@/config/constants/dropdowns/qr-codes/qr-editor-section.options";
import { cn } from "@/lib/utils";
import { Routes } from "@/routes/routes";

export const TippingSection: FC = () => {
  const { form, store } = useQrEditor();
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <SectionCard section={QrEditorSections.TIPPING}>
      <Controller
        control={control}
        name="store.suggested_tip_amounts"
        render={({ field }) => (
          <TipPresetsField
            amounts={field.value}
            onChange={field.onChange}
            currency={store.currency}
            error={errors.store?.suggested_tip_amounts?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="store.allow_custom_tip_amount"
        render={({ field }) => (
          <AllowCustomTipField
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="store.default_distribution_rule_id"
        render={({ field }) => (
          <DefaultDistributionRuleField
            storeId={store.id}
            value={field.value}
            onChange={field.onChange}
            action={
              // New tab, so unsaved edits on this page aren't lost.
              <Link
                href={Routes.dashboard.accessDistribution}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "default" }),
                  "w-full justify-center text-brand-700 md:h-auto md:w-auto md:bg-transparent md:px-0 md:py-0 md:text-[15px] md:font-semibold md:shadow-none md:hover:bg-transparent md:hover:underline",
                )}
              >
                Manage all →
              </Link>
            }
          />
        )}
      />
    </SectionCard>
  );
};
