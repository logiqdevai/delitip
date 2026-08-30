import { type FC } from "react";
import Image from "next/image";

export const AuthBrandPanel: FC = () => {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden bg-ink-charcoal p-8 text-white sm:p-10 lg:col-span-5">
      <div className="pointer-events-none absolute -right-20 -bottom-20 size-80 rounded-full bg-electric-lime/20 blur-3xl" />

      <div className="relative z-10 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-ink-charcoal px-3 py-1 text-xs font-semibold text-electric-lime">
          <span className="size-2 animate-pulse rounded-full bg-electric-lime" />
          Reward great service.
        </div>
        <h2 className="text-2xl leading-tight font-extrabold tracking-tight text-white sm:text-3xl">
          The modern way to appreciate and manage service staff.
        </h2>
        <p className="text-xs leading-relaxed text-zinc-400">
          Empower your team with instant direct digital tips, transparent
          payouts, and real-time customer feedback without POS headaches.
        </p>
      </div>

      <div className="relative z-10 my-8 space-y-3">
        <div className="space-y-3 rounded-2xl border border-zinc-800 bg-ink-charcoal/90 p-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                alt="Maria S., Head Server"
                width={32}
                height={32}
                className="size-8 shrink-0 rounded-full object-cover ring-2 ring-electric-lime/40"
              />
              <div>
                <div className="text-xs font-bold text-white">Maria S.</div>
                <div className="text-xs text-zinc-400">
                  Head Server • Table 14
                </div>
              </div>
            </div>
            <span className="rounded-lg border border-brand-800/60 bg-ink-charcoal/80 px-2.5 py-1 text-xs font-extrabold text-electric-lime">
              +$8.00 Tip
            </span>
          </div>

          <p className="text-xs text-zinc-300 italic">
            &ldquo;Maria made our evening anniversary unforgettable. Incredible
            service!&rdquo;
          </p>

          <div className="flex items-center justify-between border-t border-zinc-800/80 pt-1 text-xs text-zinc-500">
            <span className="font-bold text-rating-amber">★★★★★ 5.0</span>
            <span>100% Direct to Employee</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-4 border-t border-zinc-800/80 pt-6">
        <div>
          <div className="text-xl font-extrabold text-white">+28%</div>
          <div className="mt-0.5 text-xs font-medium text-zinc-400">
            Average tip volume increase
          </div>
        </div>
        <div>
          <div className="text-xl font-extrabold text-electric-lime">100%</div>
          <div className="mt-0.5 text-xs font-medium text-zinc-400">
            Transparent tip distribution
          </div>
        </div>
      </div>
    </div>
  );
};
