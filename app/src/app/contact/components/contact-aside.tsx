import { type FC } from "react";
import Link from "next/link";
import { BookOpen, Clock3, Mail } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { Routes } from "@/routes/routes";

const channels = [
  {
    icon: Mail,
    title: "Email",
    detail: "info@delitip.com",
    href: "mailto:info@delitip.com",
  },
  {
    icon: BookOpen,
    title: "Help Center",
    detail:
      "Browse guides for your store, team, and tip page on delitip.com.",
    href: Routes.help.root,
  },
  {
    icon: Clock3,
    title: "Response time",
    detail: "We reply within one business day.",
    href: null,
  },
] as const;

export const ContactAside: FC = () => {
  return (
    <aside className="relative overflow-hidden rounded-[28px] border border-zinc-800 bg-ink-charcoal p-6 text-paper-offwhite shadow-2xl sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-10 size-56 rounded-full bg-electric-lime/20 blur-3xl"
      />

      <div className="relative z-10 space-y-8">
        <div className="space-y-4">
          <BrandMark
            size="lg"
            className="shadow-lg shadow-electric-lime/30"
          />
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
              We&apos;re here to help
            </h2>
            <p className="text-xs leading-relaxed text-zinc-400 sm:text-sm">
              From your first tip to feedback across locations,
              ask us anything. Printed QR cards available.
            </p>
          </div>
        </div>

        <ul className="space-y-3">
          {channels.map((channel) => {
            const Icon = channel.icon;
            const body = (
              <div className="flex gap-3 rounded-2xl border border-zinc-800 bg-ink-charcoal/80 p-3.5 transition hover:border-zinc-700">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-900/50 text-electric-lime">
                  <Icon className="size-4" strokeWidth={2} />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <span className="block text-xs font-bold text-paper-offwhite">
                    {channel.title}
                  </span>
                  <span className="block text-xs leading-relaxed text-zinc-400">
                    {channel.detail}
                  </span>
                </div>
              </div>
            );

            if (channel.href) {
              return (
                <li key={channel.title}>
                  <Link href={channel.href} className="block">
                    {body}
                  </Link>
                </li>
              );
            }

            return <li key={channel.title}>{body}</li>;
          })}
        </ul>

        <p className="text-xs font-medium text-zinc-500">
          Tip. Feedback. Recognize.
        </p>
      </div>
    </aside>
  );
};
