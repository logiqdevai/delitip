import { type FC } from "react";
import { BrandMark } from "@/components/brand/brand-mark";
import { DashboardPageHeader } from "../components/dashboard-shared";

const qrCells = [
  true,
  true,
  true,
  false,
  true,
  true,
  false,
  true,
  false,
  true,
  false,
  true,
  true,
  true,
  false,
  true,
  false,
  true,
  true,
  true,
  true,
  true,
  true,
  false,
  true,
] as const;

const AccessPage: FC = () => {
  return (
    <>
      <DashboardPageHeader
        title="Customer Access & QR Kits"
        description="Generate and download branded print collateral for tables and counters."
        actions={
          <button
            type="button"
            className="rounded-xl bg-electric-lime px-3.5 py-2 text-chip font-semibold text-ink-charcoal shadow-sm transition hover:bg-brand-700"
          >
            Print All Table QR Codes
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        <div className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 text-center shadow-sm">
          <BrandMark size="md" className="mx-auto" />
          <div>
            <h3 className="text-sm font-bold text-ink-charcoal">
              Table 08 Stand
            </h3>
            <p className="text-xs text-zinc-400">delitip.com/artisan/t08</p>
          </div>

          <div className="mx-auto flex size-36 items-center justify-center rounded-2xl bg-ink-charcoal p-2.5 shadow-inner">
            <div className="flex size-full flex-col items-center justify-center rounded-xl bg-white p-2">
              <div className="grid size-full grid-cols-5 gap-1 opacity-80">
                {qrCells.map((filled, index) => (
                  <div
                    key={index}
                    className={
                      filled ? "rounded-xs bg-black" : "bg-transparent"
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="inline-block rounded-full bg-brand-50 px-3 py-1 text-chip font-semibold text-brand-700">
            Reward great service.
          </div>
          <button
            type="button"
            className="w-full rounded-xl bg-neutral-fill py-2 text-chip font-semibold text-zinc-700 transition hover:bg-zinc-200"
          >
            Download PDF Display Card
          </button>
        </div>
      </div>
    </>
  );
};

export default AccessPage;
