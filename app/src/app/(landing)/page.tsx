import { type FC } from "react";
import { type Metadata } from "next";
import { environments } from "@/config/environments";
import { SplashLoader } from "@/components/brand/splash-loader";
import { LandingHeader } from "./components/landing-header";
import { LandingHero } from "./components/landing-hero";
import { LandingAbout } from "./components/landing-about";
import { LandingHowItWorks } from "./components/landing-how-it-works";
import { LandingEcosystem } from "./components/landing-ecosystem";
import { LandingCalculator } from "./components/landing-calculator";
import { LandingCta } from "./components/landing-cta";
import { LandingFaq } from "./components/landing-faq";
import { LandingFooter } from "./components/landing-footer";

export const metadata: Metadata = {
  alternates: {
    canonical: environments.siteUrl,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${environments.siteUrl}/#organization`,
      name: "delitip",
      url: environments.siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${environments.siteUrl}/icon`,
        width: 192,
        height: 192,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${environments.siteUrl}/#website`,
      name: "delitip",
      url: environments.siteUrl,
      publisher: { "@id": `${environments.siteUrl}/#organization` },
    },
  ],
};

const LandingPage: FC = () => {
  return (
    <div className="bg-paper-offwhite text-ink-charcoal antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\u003c"),
        }}
      />
      <SplashLoader />
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingAbout />
        <LandingHowItWorks />
        <LandingEcosystem />
        <LandingCalculator />
        <LandingFaq />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
