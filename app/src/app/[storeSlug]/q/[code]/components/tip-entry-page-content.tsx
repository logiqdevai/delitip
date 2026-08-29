"use client";

import { type FC } from "react";
import { MapPin, QrCode, Users } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { TipEntrySkeleton } from "@/app/[storeSlug]/q/[code]/components/tip-entry-skeleton";
import { usePublicQrCode } from "@/features/qr-codes/hooks/use-qr-codes";
import type { PublicQrCodeEmployee } from "@/features/qr-codes/interfaces/qr-codes.interfaces";
import { usePublicStore } from "@/features/stores/hooks/use-stores";
import { cn } from "@/lib/utils";

interface TipEntryPageContentProps {
  storeSlug: string;
  code: string;
}

const employeeInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
};

const formatStoreAddress = (parts: {
  address_line?: string | null;
  city?: string | null;
  country?: string | null;
}) => {
  return [parts.address_line, parts.city, parts.country]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(", ");
};

const EmployeeRow: FC<{ employee: PublicQrCodeEmployee }> = ({ employee }) => {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-zinc-200/80 bg-white px-4 py-3 shadow-xs">
      {employee.photo_url ? (
        <img
          src={employee.photo_url}
          alt=""
          className="size-12 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-ink-charcoal text-sm font-bold text-paper-offwhite">
          {employeeInitials(employee.full_name)}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-ink-charcoal">
          {employee.full_name}
        </p>
        <p className="truncate text-xs text-zinc-500">
          {employee.position?.trim() || "Team member"}
        </p>
      </div>
    </div>
  );
};

export const TipEntryPageContent: FC<TipEntryPageContentProps> = ({
  storeSlug,
  code,
}) => {
  const qrQuery = usePublicQrCode(code);
  const storeQuery = usePublicStore(storeSlug);

  const isPending = qrQuery.isPending || storeQuery.isPending;
  const loadFailed = qrQuery.isError || storeQuery.isError;

  const qr = qrQuery.data;
  const store = storeQuery.data;

  const slugMismatch =
    !!qr &&
    !!store &&
    (qr.store.slug !== storeSlug || qr.store.id !== store.id);

  if (isPending) {
    return <TipEntrySkeleton />;
  }

  if (loadFailed || !qr || !store || slugMismatch) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-paper-offwhite p-6">
        <Empty className="max-w-sm border border-dashed border-zinc-200 bg-white py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <QrCode />
            </EmptyMedia>
            <EmptyTitle>This tip link is unavailable</EmptyTitle>
            <EmptyDescription>
              The QR code may be inactive, the store may be closed, or the link
              is incorrect. Ask your host for a new code.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </main>
    );
  }

  const accent = store.primary_color?.trim() || qr.store.primary_color?.trim();
  const logoUrl = store.logo_url ?? qr.store.logo_url;
  const address = formatStoreAddress(store);
  const welcome =
    store.welcome_message?.trim() ||
    `Welcome to ${store.name}. Leave a tip for great service.`;
  const employees = qr.employees;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-paper-offwhite">
      <header className="flex items-center justify-between border-b border-zinc-100 bg-white px-5 py-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <BrandMark size="sm" className="size-8 shrink-0 rounded-lg text-xs" />
          <span className="truncate text-sm font-bold tracking-tight text-ink-charcoal">
            delitip
            <span className="text-zinc-400">.com</span>
          </span>
        </div>
        {qr.spots[0] ? (
          <span className="shrink-0 rounded-full bg-neutral-fill px-2.5 py-1 text-[11px] font-medium text-zinc-500">
            {qr.spots[0].name}
          </span>
        ) : null}
      </header>

      <div className="flex flex-1 flex-col gap-8 px-5 py-8">
        <section className="flex flex-col items-center text-center">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt=""
              className="size-20 rounded-2xl object-cover shadow-sm ring-4 ring-white"
              style={
                accent
                  ? { boxShadow: `0 0 0 4px ${accent}33` }
                  : undefined
              }
            />
          ) : (
            <div
              className={cn(
                "flex size-20 items-center justify-center rounded-2xl text-2xl font-bold text-ink-charcoal shadow-sm",
                !accent && "bg-electric-lime",
              )}
              style={accent ? { backgroundColor: accent } : undefined}
            >
              {store.name.charAt(0).toUpperCase()}
            </div>
          )}

          <h1 className="mt-4 text-xl font-bold tracking-tight text-ink-charcoal">
            {store.name}
          </h1>

          {address ? (
            <p className="mt-1.5 flex items-start justify-center gap-1 text-xs text-zinc-500">
              <MapPin className="mt-0.5 size-3.5 shrink-0" />
              <span>{address}</span>
            </p>
          ) : null}

          <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-600">
            {welcome}
          </p>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
            <Users className="size-3.5" />
            {employees.length === 0
              ? "Tip the store"
              : employees.length === 1
                ? "Your host"
                : "The team"}
          </div>

          {employees.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-white px-4 py-6 text-center text-sm text-zinc-500">
              Your tip goes to {store.name}.
            </div>
          ) : (
            <ul className="space-y-2">
              {employees.map((employee) => (
                <li key={employee.id}>
                  <EmployeeRow employee={employee} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <footer className="border-t border-zinc-100 px-5 py-4 text-center text-[11px] text-zinc-400">
        Powered by delitip
      </footer>
    </main>
  );
};
