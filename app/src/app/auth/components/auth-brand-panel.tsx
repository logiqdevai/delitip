"use client";

import { type FC, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { BrandMark } from "@/components/brand/brand-mark";
import { Routes } from "@/routes/routes";
import { cn } from "@/lib/utils";

const TIPS = [
  {
    name: "Maria S.",
    role: "Server",
    tip: "+€8",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80",
  },
  {
    name: "Giorgos K.",
    role: "Bartender",
    tip: "+€12",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80",
  },
  {
    name: "Katerina L.",
    role: "Barista",
    tip: "+€6.50",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=80",
  },
] as const;

const SLIDE_MS = 5000;
const ease = [0.22, 1, 0.36, 1] as const;

export const AuthBrandPanel: FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = TIPS[activeIndex] ?? TIPS[0];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % TIPS.length);
    }, SLIDE_MS);

    return () => window.clearInterval(timer);
  }, [activeIndex]);

  return (
    <div className="relative min-w-0 overflow-hidden bg-ink-charcoal px-6 pb-12 pt-8 text-white sm:px-8 lg:col-start-1 lg:flex lg:min-h-[36rem] lg:flex-col lg:justify-between lg:px-9 lg:py-10 xl:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_40%_0%,rgba(200,241,105,0.2),transparent_50%)]" />

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
          className="mb-8 flex justify-center lg:mb-0 lg:justify-start"
        >
          <Link
            href={Routes.home}
            className="inline-flex items-center gap-2.5 lg:hidden"
          >
            <BrandMark size="sm" className="size-8 rounded-full" />
            <span className="text-sm font-bold tracking-tight">delitip</span>
          </Link>
          <p className="hidden text-[0.65rem] font-semibold tracking-[0.2em] text-zinc-500 uppercase lg:block">
            delitip.com
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.08 }}
          className="mt-0 hidden lg:mt-14 lg:block"
        >
          <h2 className="max-w-[12ch] text-[1.85rem] leading-[1.1] font-extrabold tracking-[-0.035em] xl:text-[2.05rem]">
            Service that
            <span className="text-electric-lime"> deserves</span> a tip.
          </h2>
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto mt-2 w-full max-w-sm lg:mx-0 lg:mt-auto lg:max-w-none">
        <div className="relative h-[4.25rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4, ease }}
              className="absolute inset-x-0 top-0 flex items-center gap-3"
            >
              <Image
                src={active.avatar}
                alt={active.name}
                width={40}
                height={40}
                className="size-10 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold">{active.name}</div>
                <div className="truncate text-[0.7rem] text-zinc-500">
                  {active.role}
                </div>
              </div>
              <span className="shrink-0 text-sm font-extrabold text-electric-lime">
                {active.tip}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-5 flex items-center gap-1.5">
          {TIPS.map((item, index) => (
            <button
              key={item.name}
              type="button"
              aria-label={`Show tip from ${item.name}`}
              aria-current={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "h-1 rounded-full transition-all duration-500",
                index === activeIndex
                  ? "w-5 bg-electric-lime"
                  : "w-1 bg-white/25 hover:bg-white/45"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
