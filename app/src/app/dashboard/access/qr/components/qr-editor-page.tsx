"use client";

import { type FC, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ExternalLink, QrCode } from "lucide-react";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { QrEditorProvider } from "@/app/dashboard/access/qr/components/qr-editor-provider";
import { QrEditorSidebar } from "@/app/dashboard/access/qr/components/qr-editor-sidebar";
import { QrTipPreview } from "@/app/dashboard/access/qr/components/qr-tip-preview";
import { AppearanceSection } from "@/app/dashboard/access/qr/components/sections/appearance-section";
import { DetailsSection } from "@/app/dashboard/access/qr/components/sections/details-section";
import { PrintSection } from "@/app/dashboard/access/qr/components/sections/print-section";
import { RecipientsSection } from "@/app/dashboard/access/qr/components/sections/recipients-section";
import { ReviewsSection } from "@/app/dashboard/access/qr/components/sections/reviews-section";
import { TippingSection } from "@/app/dashboard/access/qr/components/sections/tipping-section";
import { useQrEditor } from "@/app/dashboard/access/qr/hooks/use-qr-editor";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { Button, buttonVariants } from "@/components/ui/button";
import { DetailSkeleton } from "@/components/ui/detail-skeleton";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getQrEditorSectionOption,
  QrEditorSections,
  type QrEditorSection,
} from "@/config/constants/dropdowns/qr-codes/qr-editor-section.options";
import { useQrCode } from "@/features/qr-codes/hooks/use-qr-codes";
import { useStore } from "@/features/stores/hooks/use-stores";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { cn } from "@/lib/utils";
import {
  QR_EDITOR_EMPLOYEE_PARAM,
  QR_EDITOR_SECTION_PARAM,
  Routes,
} from "@/routes/routes";

interface QrEditorPageProps {
  /** Omit to create a new QR code. */
  qrId?: string;
}

const SECTION_COMPONENTS: Record<QrEditorSection, FC> = {
  [QrEditorSections.DETAILS]: DetailsSection,
  [QrEditorSections.RECIPIENTS]: RecipientsSection,
  [QrEditorSections.APPEARANCE]: AppearanceSection,
  [QrEditorSections.TIPPING]: TippingSection,
  [QrEditorSections.REVIEWS]: ReviewsSection,
  [QrEditorSections.PRINT]: PrintSection,
};

const EditorSkeleton: FC = () => (
  <div className="space-y-6">
    <DetailSkeleton fieldCount={2} />
    <div className="flex flex-col gap-6 lg:flex-row">
      <Skeleton className="h-64 w-full rounded-2xl lg:w-48" />
      <Skeleton className="h-96 w-full rounded-2xl" />
      <Skeleton className="h-[640px] w-full rounded-[2rem] lg:w-[360px]" />
    </div>
  </div>
);

const QrEditorLayout: FC = () => {
  const { form, store, isEdit, isDirty, isSaving, save, discard, qr } =
    useQrEditor();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sectionParam = searchParams.get(QR_EDITOR_SECTION_PARAM);
  const active = getQrEditorSectionOption(sectionParam).id;
  const ActiveSection = SECTION_COMPONENTS[active];

  const handleSelect = (section: QrEditorSection) => {
    const params = new URLSearchParams(searchParams);
    if (section === QrEditorSections.DETAILS) {
      params.delete(QR_EDITOR_SECTION_PARAM);
    } else {
      params.set(QR_EDITOR_SECTION_PARAM, section);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const hasErrors = Object.keys(form.formState.errors).length > 0;

  return (
    <div className="space-y-6">
      <Link
        href={Routes.dashboard.access}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 transition hover:text-ink-charcoal"
      >
        <ArrowLeft className="size-3.5" strokeWidth={2} />
        All QR codes
      </Link>

      <div className="sticky top-0 z-20 -mx-4 -mt-2 bg-zinc-50 px-4 py-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <DashboardPageHeader
          title={
            qr ? (
              <span className="inline-flex items-center gap-2">
                {qr.label}
                <Link
                  href={Routes.tip(store.slug, qr.code)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open tip page in a new tab"
                  title="Open tip page"
                  className="flex size-7 items-center justify-center rounded-full text-zinc-400 transition hover:bg-brand-50 hover:text-brand-700 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <ExternalLink className="size-4" strokeWidth={2} />
                </Link>
              </span>
            ) : (
              "New QR code"
            )
          }
          description="Everything about this QR code and its tip page, with a live preview."
          actions={
            <>
              {isDirty ? (
                <span className="text-[11px] font-medium text-zinc-400">
                  Unsaved changes
                </span>
              ) : null}
              <Button
                type="button"
                variant="outline"
                disabled={!isDirty || isSaving}
                onClick={discard}
              >
                Discard
              </Button>
              <ActionButtonWithPending
                type="button"
                isPending={isSaving}
                disabled={(isEdit && !isDirty) || hasErrors}
                onClick={() => void save()}
              >
                {isEdit ? "Save changes" : "Create QR code"}
              </ActionButtonWithPending>
            </>
          }
        />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <QrEditorSidebar active={active} onSelect={handleSelect} />

        <div className="min-w-0 flex-1 xl:max-w-xl">
          <ActiveSection />
        </div>

        <aside
          aria-label="Tip page preview"
          className={cn(
            "w-full shrink-0 lg:sticky lg:top-6 lg:w-[360px]",
          )}
        >
          <QrTipPreview />
        </aside>
      </div>
    </div>
  );
};

const QrEditorLoader: FC<QrEditorPageProps> = ({ qrId }) => {
  const { store: workspaceStore, isPending, isReady } = useWorkspace();
  const storeQuery = useStore(workspaceStore?.id ?? "");
  const qrQuery = useQrCode(qrId ?? "");
  const store = storeQuery.data ?? workspaceStore;
  const employeeParam = useSearchParams().get(QR_EDITOR_EMPLOYEE_PARAM);

  if (isPending || (qrId && qrQuery.isPending)) {
    return <EditorSkeleton />;
  }

  if (!isReady || !store) {
    return (
      <Empty className="border border-dashed border-zinc-200 bg-white py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <QrCode />
          </EmptyMedia>
          <EmptyTitle>No store selected</EmptyTitle>
          <EmptyDescription>
            Finish business setup before creating customer QR codes.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (qrId && (qrQuery.isError || !qrQuery.data)) {
    return (
      <Empty className="border border-dashed border-zinc-200 bg-white py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <QrCode />
          </EmptyMedia>
          <EmptyTitle>QR code not found</EmptyTitle>
          <EmptyDescription>
            It may have been deleted, or it belongs to another store.
          </EmptyDescription>
        </EmptyHeader>
        <Link
          href={Routes.dashboard.access}
          className={buttonVariants({ variant: "outline" })}
        >
          Back to QR codes
        </Link>
      </Empty>
    );
  }

  return (
    <QrEditorProvider
      // Remount with fresh form defaults when switching QR codes or stores.
      key={`${store.id}:${qrId ?? "new"}`}
      store={store}
      qr={qrId ? (qrQuery.data ?? null) : null}
      defaultEmployeeIds={!qrId && employeeParam ? [employeeParam] : undefined}
    >
      <QrEditorLayout />
    </QrEditorProvider>
  );
};

export const QrEditorPage: FC<QrEditorPageProps> = (props) => {
  return (
    <Suspense fallback={<EditorSkeleton />}>
      <QrEditorLoader {...props} />
    </Suspense>
  );
};
