import { type FC } from "react";
import { DashboardPageHeader } from "../components/dashboard-shared";
import { demoEmployees } from "../data/dashboard-demo";

const DistributionPage: FC = () => {
  return (
    <>
      <DashboardPageHeader
        title="Tip Distribution"
        description="Transparent payout configuration and automated share allocation."
        actions={
          <button
            type="button"
            className="rounded-xl bg-electric-lime px-4 py-2 text-chip font-semibold text-ink-charcoal shadow-sm transition hover:bg-brand-700"
          >
            Execute Weekly Payout
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
          <h2 className="text-sm font-bold text-ink-charcoal">
            Distribution Policy
          </h2>
          <p className="text-xs text-zinc-400">
            Configure how incoming tips are split between the direct server and
            support pool.
          </p>

          <div className="space-y-3 pt-2">
            <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-3.5">
              <div className="mb-1 flex justify-between text-xs font-bold text-ink-charcoal">
                <span>Employee Share (Direct)</span>
                <span className="text-brand-700">100%</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                The tipped employee receives 100% of the customer&apos;s
                contribution.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-3.5">
              <div className="mb-1 flex justify-between text-xs font-bold text-ink-charcoal">
                <span>Business Share (House)</span>
                <span className="text-zinc-500">0%</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                0% house retention. 100% transparent to your employees and
                customers.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink-charcoal">
              Pending Shift Payouts
            </h2>
            <span className="text-xs font-bold text-brand-700">
              $3,420.50 Ready
            </span>
          </div>

          <div className="divide-y divide-zinc-100 text-xs">
            {demoEmployees.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center justify-between pt-2 first:pt-0"
              >
                <div>
                  <span className="font-bold text-ink-charcoal">
                    {employee.name}
                  </span>
                  <span className="block text-[10px] text-zinc-400">
                    Direct deposit: •••• {employee.depositLast4}
                  </span>
                </div>
                <span className="font-bold text-brand-700">
                  {employee.tips7d}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DistributionPage;
