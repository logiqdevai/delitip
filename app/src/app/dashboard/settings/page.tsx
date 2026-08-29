"use client";

import { type FC, type FormEvent, useState } from "react";
import { DashboardPageHeader } from "../components/dashboard-shared";

const fieldClassName =
  "w-full rounded-xl border border-zinc-200 bg-zinc-50/40 p-2.5 text-xs font-medium text-ink-charcoal focus:ring-2 focus:ring-electric-lime focus:outline-none";

const SettingsPage: FC = () => {
  const [businessName, setBusinessName] = useState("Artisan Café & Bar");
  const [tagline, setTagline] = useState("Reward great service.");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <>
      <DashboardPageHeader
        title="Settings"
        description="Manage business profile, bank account connections, and preferences."
      />

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs"
      >
        <div>
          <label
            htmlFor="business-name"
            className="mb-1 block text-xs font-semibold text-zinc-700"
          >
            Business Name
          </label>
          <input
            id="business-name"
            type="text"
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
            className={fieldClassName}
          />
        </div>
        <div>
          <label
            htmlFor="brand-tagline"
            className="mb-1 block text-xs font-semibold text-zinc-700"
          >
            Brand Tagline
          </label>
          <input
            id="brand-tagline"
            type="text"
            value={tagline}
            onChange={(event) => setTagline(event.target.value)}
            className={fieldClassName}
          />
        </div>
        <div className="pt-2">
          <button
            type="submit"
            className="rounded-xl bg-electric-lime px-4 py-2 text-chip font-semibold text-ink-charcoal transition hover:bg-brand-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </>
  );
};

export default SettingsPage;
