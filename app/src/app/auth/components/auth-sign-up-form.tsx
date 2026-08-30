"use client";

import { type FC, useState } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import {
  BusinessTypeFormOptions,
  BusinessTypes,
} from "@/config/constants/dropdowns/businesses/business-type-form.options";
import {
  TeamSizeFormOptions,
  TeamSizes,
} from "@/config/constants/dropdowns/businesses/team-size-form.options";
import {
  businessSignUpSchema,
  type BusinessSignUpFormData,
} from "@/features/auth/validation-schemas/auth.schema";
import { useRegisterBusiness } from "@/features/auth/hooks/use-auth";
import { Routes } from "@/routes/routes";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authFieldClassName } from "./auth-password-field";
import { cn } from "@/lib/utils";

export const AuthSignUpForm: FC = () => {
  const registerBusiness = useRegisterBusiness();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BusinessSignUpFormData>({
    resolver: zodResolver(businessSignUpSchema),
    defaultValues: {
      venueName: "",
      businessType: BusinessTypes.RESTAURANT,
      teamSize: TeamSizes.MEDIUM,
      fullName: "",
      email: "",
      password: "",
    },
  });

  const isPending = registerBusiness.isPending;

  const onSubmit = handleSubmit((values) => {
    registerBusiness.mutate(values);
  });

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

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
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
            autoComplete="organization"
            placeholder="e.g. Artisan Café & Bar"
            className={authFieldClassName}
            aria-invalid={!!errors.venueName}
            {...register("venueName")}
          />
          {errors.venueName ? (
            <p className="mt-1 text-xs text-red-600">{errors.venueName.message}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="sign-up-type"
              className="mb-1.5 block text-xs font-semibold text-zinc-700"
            >
              Business Type
            </label>
            <Controller
              name="businessType"
              control={control}
              render={({ field }) => (
                <Select
                  items={BusinessTypeFormOptions.map((option) => ({
                    label: option.label,
                    value: option.id,
                  }))}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="sign-up-type"
                    className={cn(authFieldClassName, "w-full")}
                    aria-invalid={!!errors.businessType}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {BusinessTypeFormOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.businessType ? (
              <p className="mt-1 text-xs text-red-600">
                {errors.businessType.message}
              </p>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="sign-up-team"
              className="mb-1.5 block text-xs font-semibold text-zinc-700"
            >
              Estimated Team Size
            </label>
            <Controller
              name="teamSize"
              control={control}
              render={({ field }) => (
                <Select
                  items={TeamSizeFormOptions.map((option) => ({
                    label: option.label,
                    value: option.id,
                  }))}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="sign-up-team"
                    className={cn(authFieldClassName, "w-full")}
                    aria-invalid={!!errors.teamSize}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {TeamSizeFormOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.teamSize ? (
              <p className="mt-1 text-xs text-red-600">{errors.teamSize.message}</p>
            ) : null}
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
              autoComplete="name"
              placeholder="John Miller"
              className={authFieldClassName}
              aria-invalid={!!errors.fullName}
              {...register("fullName")}
            />
            {errors.fullName ? (
              <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>
            ) : null}
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
              autoComplete="email"
              placeholder="john@artisancafe.com"
              className={authFieldClassName}
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email ? (
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
            ) : null}
          </div>
        </div>

        <div>
          <label
            htmlFor="sign-up-password"
            className="mb-1.5 block text-xs font-semibold text-zinc-700"
          >
            Create Password
          </label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <div className="relative">
                <input
                  id="sign-up-password"
                  type={passwordVisible ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  className={cn(authFieldClassName, "pr-10")}
                  aria-invalid={!!errors.password}
                  {...field}
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible((current) => !current)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  aria-label={
                    passwordVisible ? "Hide password" : "Show password"
                  }
                >
                  {passwordVisible ? (
                    <EyeOff className="size-4" strokeWidth={2} />
                  ) : (
                    <Eye className="size-4" strokeWidth={2} />
                  )}
                </button>
              </div>
            )}
          />
          {errors.password ? (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          ) : null}
        </div>

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
              <span>Creating account...</span>
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
