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
  { label: "Customer support", Icon: Headphones },
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
    <section className="border-y border-zinc-100 bg-paper-offwhite py-10">
      <div className="mx-auto max-w-7xl space-y-4 px-4 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
          For teams that help customers every day
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-extrabold text-zinc-400 sm:gap-14 sm:text-sm">
          {industries.map(({ label, Icon }) => (
            <span key={label} className="flex items-center gap-2">
              <Icon className="size-4 shrink-0" strokeWidth={2} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
