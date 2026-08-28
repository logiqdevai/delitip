"use client";

import { type FC, type FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, LoaderCircle } from "lucide-react";
import {
  BusinessTypeFormOptions,
  BusinessTypes,
  type BusinessType,
} from "@/config/constants/dropdowns/businesses/business-type-form.options";
import {
  TeamSizeFormOptions,
  TeamSizes,
  type TeamSize,
} from "@/config/constants/dropdowns/businesses/team-size-form.options";
import { Routes } from "@/routes/routes";
import {
  AuthPasswordField,
  authFieldClassName,
} from "./auth-password-field";

export const AuthSignUpForm: FC = () => {
  const [venueName, setVenueName] = useState("");
  const [businessType, setBusinessType] = useState<BusinessType>(
    BusinessTypes.RESTAURANT
  );
  const [teamSize, setTeamSize] = useState<TeamSize>(TeamSizes.MEDIUM);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    window.setTimeout(() => setIsPending(false), 1000);
  };

  return (
    <div className="auth-fade-enter space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-charcoal">
          Register your business
        </h1>
        <p className="mt-1 text-xs text-zinc-500">
          Start collecting tips and employee feedback in under 2 minutes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="sign-up-venue"
            className="mb-1.5 block text-xs font-semibold text-zinc-700"
          >
            Business / Venue Name
          </label>
          <input
            id="sign-up-venue"
            type="text"
            required
            value={venueName}
            onChange={(event) => setVenueName(event.target.value)}
            placeholder="e.g. Artisan Café & Bar"
            className={authFieldClassName}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="sign-up-type"
              className="mb-1.5 block text-xs font-semibold text-zinc-700"
            >
              Business Type
            </label>
            <select
              id="sign-up-type"
              value={businessType}
              onChange={(event) =>
                setBusinessType(event.target.value as BusinessType)
              }
              className={authFieldClassName}
            >
              {BusinessTypeFormOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="sign-up-team"
              className="mb-1.5 block text-xs font-semibold text-zinc-700"
            >
              Estimated Team Size
            </label>
            <select
              id="sign-up-team"
              value={teamSize}
              onChange={(event) =>
                setTeamSize(event.target.value as TeamSize)
              }
              className={authFieldClassName}
            >
              {TeamSizeFormOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label
              htmlFor="sign-up-name"
              className="mb-1.5 block text-xs font-semibold text-zinc-700"
            >
              Your Full Name
            </label>
            <input
              id="sign-up-name"
              type="text"
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="John Miller"
              className={authFieldClassName}
            />
          </div>
          <div>
            <label
              htmlFor="sign-up-email"
              className="mb-1.5 block text-xs font-semibold text-zinc-700"
            >
              Work Email
            </label>
            <input
              id="sign-up-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="john@artisancafe.com"
              className={authFieldClassName}
            />
          </div>
        </div>

        <AuthPasswordField
          id="sign-up-password"
          label="Create Password"
          placeholder="At least 8 characters"
          value={password}
          onChange={setPassword}
        />

        <p className="text-xs leading-relaxed text-zinc-400">
          By registering, you agree to delitip.com’s{" "}
          <Link
            href={Routes.legal.terms}
            className="font-medium text-zinc-700 underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href={Routes.legal.privacy}
            className="font-medium text-zinc-700 underline"
          >
            Privacy Policy
          </Link>
          .
        </p>

        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-electric-lime py-3 text-xs font-semibold text-ink-charcoal shadow-lg shadow-electric-lime/30 transition hover:bg-brand-700 disabled:opacity-70"
        >
          {isPending ? (
            <>
              <LoaderCircle className="size-4 animate-spin" strokeWidth={2} />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Create Business Account</span>
              <ArrowRight className="size-3.5" strokeWidth={2} />
            </>
          )}
        </button>
      </form>

      <div className="pt-2 text-center">
        <p className="text-xs text-zinc-500">
          Already registered?{" "}
          <Link
            href={Routes.auth.sign_in}
            className="font-bold text-brand-700 hover:underline"
          >
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
};
