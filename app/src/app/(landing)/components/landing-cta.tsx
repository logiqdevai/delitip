"use client";

import { type FC, type FormEvent, useState } from "react";
import { BrandMark } from "@/components/brand/brand-mark";

export const LandingCta: FC = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <section id="get-started" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative space-y-6 overflow-hidden rounded-[36px] border border-zinc-800 bg-ink-charcoal p-8 text-center text-white shadow-2xl sm:p-14">
          <BrandMark
            size="lg"
            className="mx-auto shadow-lg shadow-electric-lime/30"
          />

          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            Start tipping and feedback for your support team
          </h2>

          <p className="mx-auto max-w-lg text-xs text-zinc-400 sm:text-sm">
            Create your account, add your team, and set up QR codes. Customers
            tip and leave feedback in seconds.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Business email"
              aria-label="Business email"
              className="w-full rounded-xl border border-zinc-700 bg-ink-charcoal px-4 py-3 text-xs text-white focus:ring-2 focus:ring-electric-lime focus:outline-none sm:w-72"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-electric-lime px-6 py-3 text-xs font-bold text-ink-charcoal shadow-lg shadow-electric-lime/30 transition hover:bg-brand-400 sm:w-auto"
            >
              Create your business account
            </button>
          </form>

          <p className="text-xs text-zinc-500">
            No credit card required · Instant QR codes
          </p>
        </div>
      </div>
    </section>
  );
};
