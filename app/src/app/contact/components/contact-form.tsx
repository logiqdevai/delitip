"use client";

import { type FC, type FormEvent, useState } from "react";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const topics = [
  { id: "sales", label: "Sales & demos" },
  { id: "support", label: "Account support" },
  { id: "billing", label: "Billing" },
  { id: "partnerships", label: "Partnerships" },
] as const;

type TopicId = (typeof topics)[number]["id"];

type FormStatus = "idle" | "pending" | "success";

const fieldClassName =
  "w-full rounded-xl border border-zinc-200 bg-zinc-50/40 px-3.5 py-2.5 text-xs text-ink-charcoal placeholder:text-zinc-400 focus:ring-2 focus:ring-electric-lime focus:outline-none";

export const ContactForm: FC = () => {
  const [topic, setTopic] = useState<TopicId>("sales");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("pending");
    window.setTimeout(() => setStatus("success"), 900);
  };

  if (status === "success") {
    return (
      <div className="auth-fade-enter flex flex-col items-start gap-4 rounded-3xl border border-zinc-200/80 bg-white p-6 sm:p-8">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-800">
          <Check className="size-5" strokeWidth={2} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold tracking-tight text-ink-charcoal">
            Message received
          </h2>
          <p className="max-w-md text-xs leading-relaxed text-zinc-500 sm:text-sm">
            Thanks{name ? `, ${name.split(" ")[0]}` : ""}. We&apos;ll reply to{" "}
            <span className="font-semibold text-ink-charcoal">{email}</span>{" "}
            within one business day.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setMessage("");
          }}
          className="rounded-xl bg-neutral-fill px-4 py-2.5 text-xs font-bold text-ink-charcoal transition hover:bg-zinc-200"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="auth-fade-enter space-y-5 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xs sm:p-8"
    >
      <div className="space-y-2">
        <span className="block text-xs font-semibold text-zinc-700">
          What do you need help with?
        </span>
        <div className="flex flex-wrap gap-2">
          {topics.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTopic(item.id)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-bold transition",
                topic === item.id
                  ? "bg-electric-lime text-ink-charcoal shadow-lg shadow-electric-lime/25"
                  : "bg-neutral-fill text-zinc-600 hover:bg-zinc-200"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-1.5 block text-xs font-semibold text-zinc-700"
          >
            Full name
          </label>
          <input
            id="contact-name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Alex Rivera"
            className={fieldClassName}
          />
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="mb-1.5 block text-xs font-semibold text-zinc-700"
          >
            Work email
          </label>
          <input
            id="contact-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="alex@northline.com"
            className={fieldClassName}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-company"
          className="mb-1.5 block text-xs font-semibold text-zinc-700"
        >
          Business{" "}
          <span className="font-medium text-zinc-400">(optional)</span>
        </label>
        <input
          id="contact-company"
          type="text"
          autoComplete="organization"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          placeholder="Northline Support"
          className={fieldClassName}
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-1.5 block text-xs font-semibold text-zinc-700"
        >
          How can we help?
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Tell us about your team or what you need help with."
          className={cn(fieldClassName, "min-h-28 resize-y")}
        />
      </div>

      <button
        type="submit"
        disabled={status === "pending"}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-electric-lime py-3 text-xs font-bold text-ink-charcoal shadow-lg shadow-electric-lime/30 transition hover:bg-brand-700 disabled:opacity-70"
      >
        {status === "pending" ? (
          <>
            <LoaderCircle className="size-4 animate-spin" strokeWidth={2} />
            <span>Sending…</span>
          </>
        ) : (
          <>
            <span>Send message</span>
            <ArrowRight className="size-3.5" strokeWidth={2} />
          </>
        )}
      </button>
    </form>
  );
};
