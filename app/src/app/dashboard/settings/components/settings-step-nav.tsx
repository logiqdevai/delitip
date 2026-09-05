"use client";

import { type FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { settingsNavItems } from "./settings-nav-items";

interface SettingsStepNavProps {
  className?: string;
}

// Previous/Next links to the neighboring settings step, meant to sit next to
// a section's Save button so people can move through settings in sequence.
export const SettingsStepNav: FC<SettingsStepNavProps> = ({ className }) => {
  const pathname = usePathname();
  const steps = settingsNavItems.filter((item) => !item.hidden);
  const currentIndex = steps.findIndex((item) => item.href === pathname);

  if (currentIndex === -1) return null;

  const previous = steps[currentIndex - 1];
  const next = steps[currentIndex + 1];

  if (!previous && !next) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {previous ? (
        <Link
          href={previous.href}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
        >
          <ArrowLeft className="size-3.5" strokeWidth={2} />
          Previous
        </Link>
      ) : null}
      {next ? (
        <Link
          href={next.href}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
        >
          Next
          <ArrowRight className="size-3.5" strokeWidth={2} />
        </Link>
      ) : null}
    </div>
  );
};
