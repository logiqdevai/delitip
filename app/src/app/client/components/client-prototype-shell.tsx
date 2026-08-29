"use client";

import { type FC, type ReactNode, useState } from "react";
import { LayoutGrid, Smartphone } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { cn } from "@/lib/utils";

export const ClientViews = {
  CUSTOMER: "customer",
  BUSINESS: "business",
} as const;

export type ClientView = (typeof ClientViews)[keyof typeof ClientViews];

interface ClientPrototypeShellProps {
  customerView: ReactNode;
  businessView: ReactNode;
}

export const ClientPrototypeShell: FC<ClientPrototypeShellProps> = ({
  customerView,
  businessView,
}) => {
  const [activeView, setActiveView] = useState<ClientView>(
    ClientViews.CUSTOMER
  );

  return (
    <div className="flex min-h-screen flex-col bg-paper-offwhite text-ink-charcoal antialiased">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-800 bg-ink-charcoal px-4 py-3 text-paper-offwhite">
        <div className="flex items-center gap-3">
          <BrandMark size="sm" className="size-7 rounded-lg text-sm" />
          <span className="text-base font-bold tracking-tight text-paper-offwhite">
            delitip
            <span className="font-medium text-electric-lime">.com</span>
          </span>
          <span className="hidden rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400 sm:inline-block">
            Prototype Experience
          </span>
        </div>

        <div className="flex items-center rounded-xl border border-zinc-700/60 bg-zinc-800 p-1">
          <button
            type="button"
            onClick={() => setActiveView(ClientViews.CUSTOMER)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200",
              activeView === ClientViews.CUSTOMER
                ? "bg-electric-lime text-ink-charcoal shadow-sm"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <Smartphone className="size-3.5" strokeWidth={2} />
            <span className="hidden sm:inline">Customer Mobile Flow</span>
            <span className="sm:hidden">Customer</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView(ClientViews.BUSINESS)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200",
              activeView === ClientViews.BUSINESS
                ? "bg-electric-lime text-ink-charcoal shadow-sm"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <LayoutGrid className="size-3.5" strokeWidth={2} />
            <span className="hidden sm:inline">Business Dashboard</span>
            <span className="sm:hidden">Business</span>
          </button>
        </div>
      </header>

      {activeView === ClientViews.CUSTOMER ? customerView : businessView}
    </div>
  );
};
