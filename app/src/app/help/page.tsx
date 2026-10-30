import { type Metadata } from "next";
import { type FC } from "react";
import { HelpHero } from "./components/help-hero";
import { HelpCategoryGrid } from "./components/help-category-grid";
import { HelpCategories } from "@/config/help-center/help-categories";
import { getHelpSearchIndex } from "@/lib/help-center.utils";
import { environments } from "@/config/environments";
import { Routes } from "@/routes/routes";

export const metadata: Metadata = {
  title: "Help Center - delitip",
  description:
    "Browse guides for every delitip feature - QR codes, tip distribution, payouts, reviews, analytics, and more.",
  alternates: {
    canonical: `${environments.siteUrl}${Routes.help.root}`,
  },
};

const HelpPage: FC = () => {
  const searchIndex = getHelpSearchIndex();

  return (
    <>
      <HelpHero searchIndex={searchIndex} />
      <section className="pb-20 md:pb-28">
        <HelpCategoryGrid categories={HelpCategories} />
      </section>
    </>
  );
};

export default HelpPage;
