import { type Metadata } from "next";
import { type FC } from "react";
import { LandingHeader } from "../(landing)/components/landing-header";
import { LandingFooter } from "../(landing)/components/landing-footer";
import { getTranslations } from "next-intl/server";
import { ContactHero } from "./components/contact-hero";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact");

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

const ContactPage: FC = () => {
  return (
    <div className="bg-paper-offwhite text-ink-charcoal antialiased">
      <LandingHeader alwaysScrolled />
      <main className="pt-16">
        <ContactHero />
      </main>
      <LandingFooter />
    </div>
  );
};

export default ContactPage;
