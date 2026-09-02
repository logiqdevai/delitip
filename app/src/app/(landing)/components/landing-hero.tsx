import { type FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, LayoutDashboard, MessageSquare, Zap } from "lucide-react";
import { Routes } from "@/routes/routes";
import { BrandMark } from "@/components/brand/brand-mark";

const trustBadges = [
  "No app for customers",
  "Apple Pay & Google Pay",
  "Tips go to your team",
] as const;

const recentTips = [
  { name: "Alex R. · Support", amount: "+$8.00", rating: "★ 5.0" },
  { name: "Jordan M. · Support", amount: "+$5.00", rating: "★ 5.0" },
] as const;

export const LandingHero: FC = () => {
  return (
    <section className="hero-glow relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="mx-auto max-w-4xl text-3xl leading-[1.12] font-extrabold tracking-tight text-ink-charcoal sm:text-5xl lg:text-6xl">
          Tip and feedback for the people who{" "}
          <span className="text-electric-lime">help your customers</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed font-normal text-zinc-600 sm:text-base">
          Customers scan a QR code, tip the team member who helped them, and
          leave feedback — no app required. You see who was recognized and what
          customers said.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={Routes.landing.getStarted}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-ink-charcoal px-6 py-3.5 text-xs font-bold text-paper-offwhite shadow-xl transition hover:bg-zinc-800 sm:w-auto sm:text-sm"
          >
            <span>Create your business account</span>
            <ArrowRight
              className="size-4 text-electric-lime"
              strokeWidth={2}
            />
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-zinc-400">
          {trustBadges.map((badge) => (
            <span key={badge} className="flex items-center gap-1.5">
              <Check
                className="size-4 text-electric-lime"
                strokeWidth={2}
              />
              {badge}
            </span>
          ))}
        </div>

        <div
          id="demo"
          className="mx-auto mt-14 max-w-5xl rounded-3xl border border-zinc-800 bg-ink-charcoal p-3 shadow-2xl sm:rounded-[36px] sm:p-4"
        >
          <div className="grid grid-cols-1 items-center gap-6 rounded-2xl bg-ink-charcoal p-4 text-left sm:rounded-[28px] sm:p-8 lg:grid-cols-12">
            <div className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl lg:col-span-5">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <BrandMark
                    size="sm"
                    className="size-6 rounded-lg text-xs"
                  />
                  <span className="text-xs font-bold text-ink-charcoal">
                    delitip
                    <span className="text-electric-lime">.com</span>
                  </span>
                </div>
                <span className="rounded-full bg-neutral-fill px-2 py-0.5 text-xs font-bold text-zinc-400">
                  Support desk
                </span>
              </div>

              <div className="pt-1 text-center">
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
                  alt="Alex, customer support at Northline"
                  width={56}
                  height={56}
                  className="mx-auto size-14 rounded-full object-cover ring-2 ring-brand-100"
                />
                <h3 className="mt-2 text-sm font-bold text-ink-charcoal">
                  Alex R.
                </h3>
                <p className="text-xs font-medium text-zinc-400">
                  Northline · Customer Support
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-zinc-200 p-2 text-center">
                  <div className="text-xs font-bold text-ink-charcoal">
                    $3.00
                  </div>
                </div>
                <div className="rounded-xl border-2 border-electric-lime bg-brand-50/70 p-2 text-center">
                  <div className="text-xs font-bold text-brand-700">$5.00</div>
                  <div className="text-xs font-bold text-electric-lime">
                    Popular
                  </div>
                </div>
                <div className="rounded-xl border border-zinc-200 p-2 text-center">
                  <div className="text-xs font-bold text-ink-charcoal">
                    $8.00
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-800">
                    <Zap className="size-3" strokeWidth={2} />
                    Clear help
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-800">
                    <MessageSquare className="size-3" strokeWidth={2} />
                    Patient
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1.5 rounded-xl bg-ink-charcoal py-2.5 text-center text-xs font-bold text-paper-offwhite shadow">
                  <span>Pay with Apple Pay</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-zinc-800/80 bg-ink-charcoal/40 p-4 sm:border-transparent sm:bg-transparent sm:p-0 lg:col-span-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold tracking-widest text-electric-lime uppercase">
                      Business dashboard
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-800/60 bg-brand-900/30 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-electric-lime uppercase sm:hidden">
                      Live
                    </span>
                  </div>
                  <h3 className="max-w-xs text-xl leading-snug font-bold text-paper-offwhite sm:max-w-none sm:text-xl">
                    Tips and feedback in one place
                  </h3>
                </div>
                <span className="hidden shrink-0 rounded-lg border border-brand-800/60 bg-ink-charcoal/80 px-2.5 py-1 text-xs font-bold text-electric-lime sm:inline-flex">
                  Live
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
                <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-ink-charcoal/80 px-4 py-3 sm:block sm:p-3">
                  <span className="text-xs font-medium text-zinc-400">
                    Tips (7 days)
                  </span>
                  <span className="text-base font-extrabold text-paper-offwhite sm:mt-1 sm:block sm:text-lg">
                    $1,240.00
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-ink-charcoal/80 px-4 py-3 sm:block sm:p-3">
                  <span className="text-xs font-medium text-zinc-400">
                    Feedback score
                  </span>
                  <span className="text-base font-extrabold text-rating-amber sm:mt-1 sm:block sm:text-lg">
                    ★ 4.9 / 5
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-ink-charcoal/80 px-4 py-3 sm:block sm:p-3">
                  <span className="text-xs font-medium text-zinc-400">
                    To your team
                  </span>
                  <span className="text-base font-extrabold text-electric-lime sm:mt-1 sm:block sm:text-lg">
                    100% direct
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-0.5 text-xs font-bold tracking-wider text-zinc-400 uppercase sm:px-0">
                  <span>Recent tips & feedback</span>
                  <span className="hidden sm:inline">Amount</span>
                </div>

                <div className="flex flex-col gap-2 sm:gap-0 sm:space-y-2 sm:rounded-2xl sm:border sm:border-zinc-800 sm:bg-ink-charcoal/90 sm:p-3.5">
                  {recentTips.map((tip) => (
                    <div
                      key={tip.name}
                      className="flex items-center justify-between rounded-xl border border-zinc-800 bg-ink-charcoal/80 px-4 py-3 text-paper-offwhite sm:rounded-none sm:border-0 sm:border-t sm:border-zinc-800/80 sm:bg-transparent sm:px-0 sm:py-1.5 sm:first:border-t-0"
                    >
                      <span className="flex min-w-0 items-center gap-2 font-bold">
                        <span className="size-2 shrink-0 rounded-full bg-electric-lime" />
                        <span className="truncate">{tip.name}</span>
                      </span>
                      <span className="flex shrink-0 items-center gap-2 pl-3 font-bold text-electric-lime">
                        <span>{tip.amount}</span>
                        <span className="text-rating-amber">{tip.rating}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs leading-relaxed font-medium text-zinc-400">
                See who customers thank — and what they said — without chasing
                reviews elsewhere.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
