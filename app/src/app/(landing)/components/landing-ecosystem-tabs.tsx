"use client";

import { useState, type FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type EcosystemTab = {
  id: string;
  tabLabel: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  points: { strong: string; rest: string }[];
};

type Props = {
  tabs: EcosystemTab[];
};

const visuals = [
  "/landing/for-business-owners-managers.jpg",
  "/landing/for-frontline-staff.jpg",
];

export const LandingEcosystemTabs: FC<Props> = ({ tabs }) => {
  const [active, setActive] = useState(0);

  return (
    <div className="mt-14">
      <div
        role="tablist"
        className="relative grid rounded-3xl border border-electric-lime/20 bg-ink-foreground/5 p-2 backdrop-blur"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
      >
        <span
          aria-hidden
          className="absolute inset-y-2 left-2 rounded-2xl bg-electric-lime transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
          style={{
            width: `calc((100% - 1rem) / ${tabs.length})`,
            transform: `translateX(${active * 100}%)`,
          }}
        />
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            id={`ecosystem-tab-${tab.id}`}
            role="tab"
            type="button"
            aria-selected={active === i}
            aria-controls={`ecosystem-panel-${tab.id}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") setActive((active + 1) % tabs.length);
              if (e.key === "ArrowLeft")
                setActive((active - 1 + tabs.length) % tabs.length);
            }}
            className={cn(
              "relative z-10 cursor-pointer rounded-2xl px-3 py-4 text-sm font-semibold tracking-wide transition-colors duration-300 sm:text-base",
              active === i
                ? "text-ink-charcoal"
                : "text-ink-foreground/60 hover:text-ink-foreground",
            )}
          >
            {tab.tabLabel}
          </button>
        ))}
      </div>

      <div className="mt-4 grid overflow-hidden rounded-3xl border border-electric-lime/20 bg-ink-foreground/5 p-3 backdrop-blur">
        {tabs.map((tab, i) => {
          const isActive = active === i;
          return (
            <div
              key={tab.id}
              id={`ecosystem-panel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`ecosystem-tab-${tab.id}`}
              inert={!isActive}
              className={cn(
                "col-start-1 row-start-1 grid gap-6 transition-opacity duration-500 ease-in-out motion-reduce:transition-none md:grid-cols-2",
                isActive ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <div className="flex flex-col justify-center p-5 sm:p-8">
                <h3 className="text-2xl font-bold sm:text-3xl">{tab.title}</h3>
                <p className="mt-3 text-ink-foreground/60">{tab.description}</p>
                <ul className="mt-6 space-y-4">
                  {tab.points.map((point) => (
                    <li key={point.strong} className="flex gap-3">
                      <span className="text-electric-lime">✦</span>
                      <span>
                        <strong>{point.strong}</strong>{" "}
                        <span className="text-ink-foreground/70">
                          {point.rest}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={tab.href}
                  className="mt-8 inline-flex w-fit items-center rounded-full bg-electric-lime px-6 py-3 text-sm font-semibold text-ink-charcoal transition-transform hover:scale-[1.03]"
                >
                  {tab.cta}
                </Link>
              </div>

              <div
                aria-hidden
                className="relative min-h-64 overflow-hidden rounded-2xl bg-ink-charcoal md:min-h-96"
              >
                <Image
                  src={visuals[i % visuals.length]}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className={cn(
                    "absolute inset-0 object-cover transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none",
                    isActive ? "scale-100" : "scale-110",
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
