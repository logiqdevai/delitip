"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, QrCode } from "lucide-react";
import { Routes } from "@/routes/routes";
import { readAnyPendingTip } from "@/app/[storeSlug]/q/[code]/lib/pending-tip";

// The fixed URL Viva's payment Source is configured to redirect back to
// after checkout (Success and Failure both land here — Viva's Smart
// Checkout uses one Source-level URL, not a per-order one). Its only job is
// to bounce back into the store's own tip flow with the recovered ?tip=<id>
// query param — that flow (tip-flow.tsx's "done" step) already polls the
// tip's real status and renders processing/success/failure UI from there.
export default function CheckoutReturnPage() {
  const router = useRouter();
  const [pending] = useState(() => readAnyPendingTip());

  useEffect(() => {
    if (!pending) return;
    router.replace(
      `${Routes.tip(pending.storeSlug, pending.code)}?tip=${pending.tipId}`,
    );
  }, [pending, router]);

  if (!pending) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-paper-offwhite p-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
          <QrCode className="size-8" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-ink-charcoal">
            We couldn&apos;t find your checkout
          </h1>
          <p className="mx-auto mt-2 max-w-xs text-sm text-zinc-500">
            If your payment went through, check your email or ask the
            business for a receipt. Otherwise, scan the QR code again to
            leave a tip.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-paper-offwhite p-6">
      <Loader2 className="size-8 animate-spin text-zinc-400" strokeWidth={2} />
    </main>
  );
}
