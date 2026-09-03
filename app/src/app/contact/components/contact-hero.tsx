import { type FC } from "react";
import { ContactAside } from "./contact-aside";
import { ContactForm } from "./contact-form";

export const ContactHero: FC = () => {
  return (
    <section className="hero-glow relative overflow-hidden pt-14 pb-20 md:pt-20 md:pb-28">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-4 text-center lg:mx-0 lg:max-w-xl lg:text-left">
          <h1 className="text-3xl leading-[1.12] font-extrabold tracking-tight text-ink-charcoal sm:text-5xl">
            Talk to us about{" "}
            <span className="text-electric-lime">tips and feedback</span>
          </h1>
          <p className="text-sm leading-relaxed text-zinc-600 sm:text-base">
            Questions about setting up your team, customer support tipping, or
            your account? Send a note and we&apos;ll reply within one business
            day.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:mt-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <div className="lg:col-span-5">
            <ContactAside />
          </div>
        </div>
      </div>
    </section>
  );
};
