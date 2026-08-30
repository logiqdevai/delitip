import { type FC } from "react";
import type { PublicStore } from "@/features/stores/interfaces/stores.interfaces";
import { cn } from "@/lib/utils";

interface StoreHeroProps {
  store: PublicStore;
  logoUrl?: string | null;
  accent?: string;
  welcome: string;
}

export const StoreHero: FC<StoreHeroProps> = ({
  store,
  logoUrl,
  accent,
  welcome,
}) => {
  const bannerStyle = store.cover_url
    ? { backgroundImage: `url(${store.cover_url})` }
    : accent
      ? { backgroundImage: `linear-gradient(135deg, ${accent}, ${accent}66)` }
      : undefined;

  return (
    <section className="flex flex-col items-center pb-6 text-center">
      <div
        className={cn(
          "h-32 w-full shrink-0 bg-cover bg-center sm:h-40",
          !bannerStyle && "bg-gradient-to-br from-ink-charcoal to-zinc-700",
        )}
        style={bannerStyle}
      />

      <div className="-mt-10 flex w-full flex-col items-center px-6">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt=""
            className="size-20 shrink-0 rounded-2xl object-cover shadow-lg ring-4 ring-brand-50"
          />
        ) : (
          <div
            className={cn(
              "flex size-20 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-ink-charcoal shadow-lg ring-4 ring-brand-50",
              !accent && "bg-electric-lime",
            )}
            style={accent ? { backgroundColor: accent } : undefined}
          >
            {store.name.charAt(0).toUpperCase()}
          </div>
        )}

        <h1 className="mt-3 line-clamp-2 max-w-[280px] text-lg font-bold break-words tracking-tight text-ink-charcoal">
          {store.name}
        </h1>

        <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-600">
          {welcome}
        </p>
      </div>
    </section>
  );
};
