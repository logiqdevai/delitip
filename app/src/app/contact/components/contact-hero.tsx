import { type FC } from "react";
import { ContactAside } from "./contact-aside";
import { ContactForm } from "./contact-form";

export const ContactHero: FC = () => {
  return (
    <section className="hero-glow relative overflow-hidden pt-14 pb-20 md:pt-20 md:pb-28">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-4 text-center lg:mx-0 lg:max-w-xl lg:text-left">
          <h1 className="text-3xl leading-[1.12] font-extrabold tracking-tight text-ink-charcoal sm:text-5xl">
            Contact <span className="text-electric-lime">Us</span>
          </h1>
          <p className="text-sm leading-relaxed text-zinc-600 sm:text-base">
            Have questions about setting up your team, accepting tips via QR
            code, or managing your account? Send us a message and we&apos;ll
            get back to you as soon as possible.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 items-stretch gap-8 lg:mt-14 lg:grid-cols-12 lg:gap-10">
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
