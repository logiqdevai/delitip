"use client";

import { type FC } from "react";
import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { GettingStartedStep } from "@/hooks/use-getting-started-steps";

export const GettingStartedStepCard: FC<{ step: GettingStartedStep }> = ({
  step,
}) => {
  const Icon = step.icon;

  return (
    <Link
      href={step.href}
      className="flex flex-col gap-4 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs transition hover:border-zinc-300 md:flex-row md:items-center"
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-xl",
          step.completed
            ? "bg-brand-50 text-brand-700"
            : "bg-neutral-fill text-zinc-400",
        )}
      >
        <Icon className="size-4" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-bold text-ink-charcoal">{step.title}</h3>
        <p className="mt-0.5 text-xs text-zinc-500">{step.description}</p>
      </div>
      <span
        className={cn(
          buttonVariants({ variant: "secondary", size: "default" }),
          "w-full justify-center gap-1.5 md:h-auto md:w-auto md:justify-start md:bg-transparent md:px-2.5 md:py-1 md:shadow-none",
          step.completed
            ? "bg-brand-50 text-brand-700 md:bg-brand-50"
            : "text-zinc-500",
        )}
      >
        {step.completed ? (
          <CheckCircle2 className="size-3.5" strokeWidth={2} />
        ) : (
          <Circle className="size-3.5" strokeWidth={2} />
        )}
        {step.completed ? "Done" : (step.statusLabel ?? "Not started")}
      </span>
    </Link>
  );
};
