import { type FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Routes } from "@/routes/routes";
import {
  DashboardPageHeader,
  StatusPill,
} from "../components/dashboard-shared";
import { demoEmployees } from "../data/dashboard-demo";

const EmployeesPage: FC = () => {
  return (
    <>
      <DashboardPageHeader
        title="Employees"
        description="Manage team members, assigned QR codes, and performance metrics."
        actions={
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-electric-lime px-3.5 py-2 text-chip font-semibold text-ink-charcoal shadow-sm transition hover:bg-brand-700"
          >
            <Plus className="size-3.5" strokeWidth={2} />
            Add New Employee
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {demoEmployees.map((employee) => (
          <div
            key={employee.id}
            className="space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <Image
                src={employee.photo}
                alt={employee.name}
                width={48}
                height={48}
                className="size-12 rounded-full object-cover"
              />
              <div>
                <h3 className="text-sm font-bold text-ink-charcoal">
                  {employee.name}
                </h3>
                <p className="text-xs text-zinc-400">
                  {employee.role} • {employee.employment}
                </p>
                <span className="mt-1 inline-block">
                  <StatusPill onShift={employee.onShift} />
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-zinc-100 pt-2 text-xs">
              <div>
                <span className="block text-[10px] text-zinc-400">
                  Total Tips
                </span>
                <span className="font-bold text-ink-charcoal">
                  {employee.tips7d}
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-zinc-400">
                  Review Rating
                </span>
                <span className="font-bold text-rating-amber">
                  ★ {employee.rating}
                </span>
              </div>
            </div>

            <Link
              href={Routes.dashboard.access}
              className="block w-full rounded-xl bg-neutral-fill py-1.5 text-center text-chip font-semibold text-zinc-700 transition hover:bg-zinc-200"
            >
              View QR Code
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default EmployeesPage;
