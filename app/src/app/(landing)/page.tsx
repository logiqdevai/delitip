import { type FC } from "react";
import { SplashLoader } from "@/components/brand/splash-loader";
import { LandingHeader } from "./components/landing-header";
import { LandingHero } from "./components/landing-hero";
import { LandingHowItWorks } from "./components/landing-how-it-works";
import { LandingEcosystem } from "./components/landing-ecosystem";
import { LandingCalculator } from "./components/landing-calculator";
import { LandingCta } from "./components/landing-cta";
import { LandingFaq } from "./components/landing-faq";
import { LandingFooter } from "./components/landing-footer";

const LandingPage: FC = () => {
  return (
    <div className="bg-paper-offwhite text-ink-charcoal antialiased">
      <SplashLoader />
      <LandingHeader />
      <main>
        <LandingHero />
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
