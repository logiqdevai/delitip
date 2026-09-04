import { type Metadata } from "next";
import { type FC } from "react";
import { LandingHeader } from "../(landing)/components/landing-header";
import { LandingFooter } from "../(landing)/components/landing-footer";
import { ContactHero } from "./components/contact-hero";

export const metadata: Metadata = {
  title: "Contact — delitip",
  description:
    "Contact delitip about tipping and feedback for customer support teams. We reply within one business day.",
};

const ContactPage: FC = () => {
  return (
    <div className="bg-paper-offwhite text-ink-charcoal antialiased">
      <LandingHeader />
      <main>
        <ContactHero />
      </main>
      <LandingFooter />
    </div>
  );
};

export default ContactPage;
