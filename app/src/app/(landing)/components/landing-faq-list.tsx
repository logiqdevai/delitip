"use client";

import { useState, type FC } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

type Props = {
  items: FaqItem[];
};

export const LandingFaqList: FC<Props> = ({ items }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ul className="mt-12 space-y-1">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <li
            key={item.id}
            className={cn(
              "rounded-[2rem] transition-colors duration-500 ease-in-out motion-reduce:transition-none",
              isOpen ? "bg-white/60" : "bg-transparent",
            )}
          >
            <button
              type="button"
              id={`faq-trigger-${item.id}`}
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${item.id}`}
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full cursor-pointer items-center justify-between gap-6 px-6 py-6 text-left sm:px-10"
            >
              <span className="max-w-2xl text-lg font-medium text-ink-charcoal sm:text-xl">
                {item.question}
              </span>
              <span
                aria-hidden
                className={cn(
                  "relative flex size-8 shrink-0 items-center justify-center rounded-full transition-colors duration-500 motion-reduce:transition-none",
                  isOpen
                    ? "bg-ink-charcoal text-electric-lime"
                    : "bg-white/70 text-ink-charcoal",
                )}
              >
                <Plus
                  className={cn(
                    "absolute size-4 transition-[opacity,transform] duration-500 motion-reduce:transition-none",
                    isOpen ? "scale-50 rotate-90 opacity-0" : "opacity-100",
                  )}
                />
                <Minus
                  className={cn(
                    "absolute size-4 transition-[opacity,transform] duration-500 motion-reduce:transition-none",
                    isOpen ? "opacity-100" : "scale-50 -rotate-90 opacity-0",
                  )}
                />
              </span>
            </button>
            <div
              id={`faq-panel-${item.id}`}
              role="region"
              aria-labelledby={`faq-trigger-${item.id}`}
              inert={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl px-6 pb-7 text-base leading-relaxed text-ink-charcoal/60 sm:px-10">
                  {item.answer}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
