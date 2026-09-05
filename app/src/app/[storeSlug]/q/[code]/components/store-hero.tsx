import { type FC } from "react";
import type { PublicStore } from "@/features/stores/interfaces/stores.interfaces";
import { cn } from "@/lib/utils";

interface StoreHeroProps {
  store: PublicStore;
  logoUrl?: string | null;
  welcome: string;
}

export const StoreHero: FC<StoreHeroProps> = ({ store, logoUrl, welcome }) => {
  const hasBanner = Boolean(store.cover_url);

  return (
    <section className="flex flex-col items-center pb-2 text-center">
      {hasBanner && (
        <div
          className="h-32 w-full shrink-0 bg-cover bg-center sm:h-40"
          style={{ backgroundImage: `url(${store.cover_url})` }}
        />
      )}

      <div
        className={cn(
          "flex w-full flex-col items-center px-6",
          hasBanner ? "-mt-10" : "pt-6",
        )}
      >
        {logoUrl && (
          <img
            src={logoUrl}
            alt=""
            className="size-20 shrink-0 rounded-2xl object-cover shadow-lg ring-4 ring-brand-50"
          />
        )}

        <h1
          className={cn(
            "line-clamp-2 max-w-[280px] text-lg font-bold break-words tracking-tight text-ink-charcoal",
            logoUrl && "mt-3",
          )}
        >
          {store.name}
        </h1>

        <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-600">
          {welcome}
        </p>
      </div>
    </section>
  );
};
