"use client";

import { type FC, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useTranslations } from "next-intl";
import { QrCode, HandCoins, MessageSquareHeart, type LucideIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "scan", Icon: QrCode, tone: "bg-brand-100", shift: 108 },
  { key: "tip", Icon: HandCoins, tone: "bg-[#ECECEB]", shift: 0 },
  { key: "feedback", Icon: MessageSquareHeart, tone: "bg-brand-100", shift: -108 },
] as const satisfies readonly {
  key: string;
  Icon: LucideIcon;
  tone: string;
  shift: number;
}[];

const SPRING = { stiffness: 120, damping: 24, mass: 0.4 };
const COLLAPSED_SCALE = 0.88;
const COLLAPSED_LIFT_PX = 56;

interface StepCardProps {
  stepKey: (typeof STEPS)[number]["key"];
  Icon: LucideIcon;
  tone: string;
  shift: number;
  progress: MotionValue<number>;
  isStacked: boolean;
  isMotionEnabled: boolean;
}

const StepCard: FC<StepCardProps> = ({
  stepKey,
  Icon,
  tone,
  shift,
  progress,
  isStacked,
  isMotionEnabled,
}) => {
  const t = useTranslations("landing.howItWorks.steps");
  const x = useTransform(progress, [0, 1], [`${isStacked ? 0 : shift}%`, "0%"]);
  const y = useTransform(progress, [0, 1], [COLLAPSED_LIFT_PX, 0]);
  const scale = useTransform(progress, [0, 1], [COLLAPSED_SCALE, 1]);

  return (
    <motion.div
      style={isMotionEnabled ? { x, y, scale } : undefined}
      className={cn(
        "relative flex flex-col rounded-3xl p-8",
        tone,
        shift === 0 && "z-10"
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-ink-charcoal text-electric-lime">
        <Icon className="size-5" strokeWidth={1.75} />
      </span>
      <h3 className="mt-10 text-2xl font-bold text-ink-charcoal">
        {t(`${stepKey}.title`)}
      </h3>
      <p className="mt-3 text-sm text-zinc-600 lg:text-[18px]">
        {t(`${stepKey}.body`)}
      </p>
      <p className="mt-auto pt-6 text-sm font-semibold text-brand-800">
        ✦ {t(`${stepKey}.note`)}
      </p>
    </motion.div>
  );
};

export const LandingHowItWorksCards: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.95", "start 0.4"],
  });
  const progress = useSpring(scrollYProgress, SPRING);

  return (
    <div
      ref={containerRef}
      className="mt-14 grid gap-4 md:grid-cols-3 md:gap-5"
    >
      {STEPS.map((step) => (
        <StepCard
          key={step.key}
          stepKey={step.key}
          Icon={step.Icon}
          tone={step.tone}
          shift={step.shift}
          progress={progress}
          isStacked={isMobile}
          isMotionEnabled={!prefersReducedMotion}
        />
      ))}
    </div>
  );
};
