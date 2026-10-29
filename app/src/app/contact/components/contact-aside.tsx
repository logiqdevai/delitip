import { type FC } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { BookOpen, Mail, MapPin } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { Routes } from "@/routes/routes";
import { SiteConfig } from "@/config/site";

export const ContactAside: FC = async () => {
  const t = await getTranslations("contact.aside");

  const channels = [
    {
      icon: Mail,
      title: t("email"),
      detail: SiteConfig.contactEmail,
      href: SiteConfig.contactEmailHref,
    },
    {
      icon: MapPin,
      title: t("address"),
      detail: t("addressValue"),
      href: null,
    },
    {
      icon: BookOpen,
      title: t("helpCenter"),
      detail: t("helpCenterBody"),
      href: Routes.help.root,
    },
  ] as const;

  return (
    <aside className="relative h-full overflow-hidden rounded-[28px] border border-zinc-800 bg-ink-charcoal px-4 py-6 text-paper-offwhite shadow-2xl sm:p-8">
      <div className="relative z-10 space-y-8">
        <div className="space-y-4">
          <BrandMark size="lg" />
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
              {t("title")}
            </h2>
            <p className="text-xs leading-relaxed text-zinc-400 sm:text-sm lg:text-[17px]">
              {t("description")}
            </p>
          </div>
        </div>

        <ul className="space-y-3">
          {channels.map((channel) => {
            const Icon = channel.icon;
            const body = (
              <div className="flex gap-3 rounded-2xl border border-zinc-800 bg-ink-charcoal/80 px-4 py-3.5 transition hover:border-zinc-700">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-900/50 text-electric-lime">
                  <Icon className="size-4" strokeWidth={2} />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <span className="block text-xs font-bold text-paper-offwhite">
                    {channel.title}
                  </span>
                  <span className="block text-xs leading-relaxed text-zinc-400 lg:text-[17px]">
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
      </div>
    </aside>
  );
};
