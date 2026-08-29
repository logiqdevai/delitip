import { type FC } from "react";
import { Download } from "lucide-react";
import { DashboardPageHeader } from "../components/dashboard-shared";
import { demoTips } from "../data/dashboard-demo";

const TipsPage: FC = () => {
  return (
    <>
      <DashboardPageHeader
        title="Tips Ledger"
        description="Real-time transactional ledger of all tips paid by customers."
        actions={
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-ink-charcoal px-3.5 py-2 text-chip font-semibold text-white transition hover:bg-zinc-800"
          >
            <Download className="size-3.5" strokeWidth={2} />
            Export CSV
          </button>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-chip">
            <thead className="border-b border-zinc-100 bg-zinc-50 text-caption font-semibold tracking-wider text-zinc-400 uppercase">
              <tr>
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Location / Table</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Tip Amount</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-medium text-zinc-700">
              {demoTips.map((tip) => (
                <tr key={tip.id}>
                  <td className="px-4 py-3.5 font-mono font-bold text-ink-charcoal">
                    {tip.id}
                  </td>
                  <td className="px-4 py-3.5 text-zinc-400">{tip.when}</td>
                  <td className="px-4 py-3.5 font-semibold text-ink-charcoal">
                    {tip.employee}
                  </td>
                  <td className="px-4 py-3.5">{tip.location}</td>
                  <td className="px-4 py-3.5">
                    <span className="rounded-full bg-neutral-fill px-2 py-0.5 text-caption text-zinc-700">
                      {tip.method}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-brand-700">
                    {tip.amount}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="rounded-full bg-brand-50 px-2 py-0.5 text-caption font-bold text-brand-700">
                      Settled
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TipsPage;
