import { type FC } from "react";
import { LandingHeader } from "./components/landing-header";
import { LandingHero } from "./components/landing-hero";
import { LandingIndustries } from "./components/landing-industries";
import { LandingHowItWorks } from "./components/landing-how-it-works";
import { LandingEcosystem } from "./components/landing-ecosystem";
import { LandingCalculator } from "./components/landing-calculator";
import { LandingPricing } from "./components/landing-pricing";
import { LandingCta } from "./components/landing-cta";
import { LandingFooter } from "./components/landing-footer";

const LandingPage: FC = () => {
  return (
    <div className="bg-paper-offwhite text-ink-charcoal antialiased">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingIndustries />
        <LandingHowItWorks />
        <LandingEcosystem />
        <LandingCalculator />
        <LandingPricing />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
