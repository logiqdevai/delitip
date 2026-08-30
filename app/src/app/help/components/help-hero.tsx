import { type FC } from "react";
import { HelpSearch } from "./help-search";
import type { HelpSearchEntry } from "@/interfaces/help-center.interfaces";

interface HelpHeroProps {
  searchIndex: HelpSearchEntry[];
}

export const HelpHero: FC<HelpHeroProps> = ({ searchIndex }) => {
  return (
    <section className="hero-glow relative overflow-hidden pt-14 pb-12 md:pt-20 md:pb-16">
      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-chip font-bold tracking-wider text-zinc-500 uppercase">
          Help Center
        </p>
        <h1 className="mt-3 text-3xl leading-[1.12] font-extrabold tracking-tight text-ink-charcoal sm:text-5xl">
          How can we help?
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
          Everything you need to know about running your store, your team,
          and your tip page on delitip.com.
        </p>
        <div className="mt-8">
          <HelpSearch searchIndex={searchIndex} />
        </div>
      </div>
    </section>
  );
};
