import { type FC } from "react";
import {
  Dumbbell,
  Headphones,
  Hotel,
  Scissors,
  Sparkles,
  Store,
  Truck,
  UtensilsCrossed,
  Wine,
} from "lucide-react";

const industries = [
  { label: "Retail & checkout", Icon: Store },
  { label: "Hotels & hospitality", Icon: Hotel },
  { label: "Salons & clinics", Icon: Scissors },
  { label: "Restaurants & cafés", Icon: UtensilsCrossed },
  { label: "Bars & lounges", Icon: Wine },
  { label: "Spas & wellness", Icon: Sparkles },
  { label: "Fitness & training", Icon: Dumbbell },
  { label: "Food trucks", Icon: Truck },
] as const;

export const LandingIndustries: FC = () => {
  return (
    <section className="border-y border-zinc-100 bg-paper-offwhite py-10 sm:py-14">
      <div className="mx-auto max-w-7xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
          For teams that help customers every day
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-8">
          {industries.map(({ label, Icon }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2.5 rounded-2xl border border-zinc-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Icon className="size-5" strokeWidth={2} />
              </span>
              <span className="text-xs leading-snug font-bold text-ink-charcoal">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
