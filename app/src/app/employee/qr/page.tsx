"use client";

import { type CSSProperties, type FC, useState } from "react";
import { QrCode } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { EmployeeAvatar } from "@/components/ui/employee-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  useCurrentEmployee,
  useEmployeeQrCode,
} from "@/features/employees/hooks/use-employees";
import type {
  EmployeePersonalQrCode,
  EmployeeQrCodeSummary,
} from "@/features/employees/interfaces/employees.interfaces";
import {
  getAbsoluteTipUrl,
  getQrCodeImageUrl,
} from "@/features/qr-codes/utils/qr-tip-url.utils";
import { cn } from "@/lib/utils";

interface QrCodeTileProps {
  qrCode: EmployeeQrCodeSummary;
  employee: EmployeePersonalQrCode["employee"];
  storeName: string;
  storeSlug: string;
  copied: boolean;
  onCopy: () => void;
  style?: CSSProperties;
}

const QrCodeTile: FC<QrCodeTileProps> = ({
  qrCode,
  employee,
  storeName,
  storeSlug,
  copied,
  onCopy,
  style,
}) => {
  const tipUrl = getAbsoluteTipUrl(storeSlug, qrCode.code);

  return (
    <div
      className="auth-fade-enter flex flex-col gap-4 rounded-3xl border border-zinc-200/80 bg-white p-6 text-center shadow-xs"
      style={style}
    >
      <div className="flex items-center justify-between gap-2 border-b border-zinc-100 pb-3">
        <div className="flex min-w-0 items-center gap-2">
          <BrandMark size="sm" className="size-6 shrink-0 rounded-lg text-xs" />
          <span className="truncate text-xs font-bold text-ink-charcoal">
            {qrCode.label}
          </span>
        </div>
        <span className="shrink-0 text-[14px] font-semibold text-zinc-400">
          {storeName}
        </span>
      </div>

      <div className="flex items-center justify-center gap-2.5">
        <EmployeeAvatar
          name={employee.full_name}
          photoUrl={employee.photo_url}
          size="sm"
          className="ring-2 ring-brand-50"
        />
        <div className="min-w-0 text-left leading-tight">
          <p className="truncate text-xs font-bold text-ink-charcoal">
            {employee.full_name}
          </p>
          {employee.position ? (
            <p className="truncate text-[10px] text-zinc-400">
              {employee.position}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mx-auto flex size-40 items-center justify-center rounded-2xl bg-ink-charcoal p-2.5 shadow-inner">
        <img
          src={getQrCodeImageUrl(tipUrl, 240)}
          alt={`QR code for ${qrCode.label}`}
          className="size-full rounded-xl bg-white object-contain p-1"
        />
      </div>

      <div className="mx-auto max-w-full truncate rounded-full bg-brand-50 px-3 py-1.5 text-chip font-semibold text-brand-700">
        {tipUrl}
      </div>

      <button
        type="button"
        onClick={onCopy}
        className="w-full rounded-xl bg-neutral-fill py-2.5 text-chip font-semibold text-zinc-800 transition hover:bg-zinc-200"
      >
        {copied ? "Copied to Clipboard!" : "Copy Tip Link"}
      </button>
    </div>
  );
};

const QrCodesSkeleton: FC = () => (
  <div
    className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
    aria-busy="true"
    aria-live="polite"
  >
    {Array.from({ length: 2 }).map((_, index) => (
      <div
        key={index}
        className="space-y-4 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs"
      >
        <Skeleton className="mx-auto h-4 w-28" />
        <Skeleton className="mx-auto h-8 w-32 rounded-full" />
        <Skeleton className="mx-auto size-40 rounded-2xl" />
        <Skeleton className="mx-auto h-6 w-40 rounded-full" />
        <Skeleton className="h-9 w-full rounded-xl" />
      </div>
    ))}
  </div>
);

const QrPage: FC = () => {
  const { employeeId, isPending: identityPending } = useCurrentEmployee();
  const qrCodeQuery = useEmployeeQrCode(employeeId ?? "");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const heading = (
    <div>
      <h1 className="text-xl font-bold text-ink-charcoal">
        Your Personal Tip QR
      </h1>
      <p className="mt-0.5 text-xs text-zinc-500">
        Show one of these to guests, or save it to your Apple / Google Wallet.
      </p>
    </div>
  );

  if (identityPending || qrCodeQuery.isPending) {
    return (
      <div className="space-y-6">
        {heading}
        <QrCodesSkeleton />
      </div>
    );
  }

  if (qrCodeQuery.isError) {
    return (
      <div className="space-y-6">
        {heading}
        <Empty className="border border-dashed border-zinc-200 bg-white py-16">
          <EmptyHeader>
            <EmptyTitle>Could not load your QR codes</EmptyTitle>
            <EmptyDescription>{qrCodeQuery.error.message}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  const data = qrCodeQuery.data!;
  const qrCodes = data.qr_codes;

  const handleCopy = async (qrCode: EmployeeQrCodeSummary) => {
    try {
      await navigator.clipboard.writeText(
        getAbsoluteTipUrl(data.store.slug, qrCode.code),
      );
      setCopiedId(qrCode.id);
      window.setTimeout(
        () =>
          setCopiedId((current) => (current === qrCode.id ? null : current)),
        2000,
      );
    } catch {
      setCopiedId(null);
    }
  };

  return (
    <div className="auth-fade-enter space-y-6">
      {heading}

      {qrCodes.length === 0 ? (
        <Empty className="border border-dashed border-zinc-200 bg-white py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <QrCode />
            </EmptyMedia>
            <EmptyTitle>No personal QR code yet</EmptyTitle>
            <EmptyDescription>
              Ask your manager to create a QR with you assigned in Customer
              Access &amp; QR Kits to get your own, working link.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div
          className={cn(
            qrCodes.length > 1
              ? "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
              : "mx-auto max-w-sm",
          )}
        >
          {qrCodes.map((qrCode, index) => (
            <QrCodeTile
              key={qrCode.id}
              qrCode={qrCode}
              employee={data.employee}
              storeName={data.store.name}
              storeSlug={data.store.slug}
              copied={copiedId === qrCode.id}
              onCopy={() => void handleCopy(qrCode)}
              style={{
                animationDelay: `${index * 60}ms`,
                animationFillMode: "both",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QrPage;
