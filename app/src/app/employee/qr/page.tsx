"use client";

import { type FC, useState } from "react";
import Image from "next/image";
import { BrandMark } from "@/components/brand/brand-mark";
import { demoEmployee, qrCells } from "../data/employee-demo";

const QrPage: FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`https://${demoEmployee.tipLink}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="auth-fade-enter mx-auto max-w-md space-y-6 text-center">
      <div>
        <h1 className="text-xl font-bold text-ink-charcoal">
          Your Personal Tip QR
        </h1>
        <p className="mt-1 text-xs text-zinc-500">
          Show this QR code to guests or save it to your Apple / Google Wallet.
        </p>
      </div>

      <div className="space-y-5 rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2">
            <BrandMark size="sm" className="size-6 rounded-lg text-xs" />
            <span className="text-xs font-bold text-ink-charcoal">
              delitip
              <span className="text-electric-lime">.com</span>
            </span>
          </div>
          <span className="text-[10px] font-semibold text-zinc-400">
            {demoEmployee.business}
          </span>
        </div>

        <div>
          <Image
            src={demoEmployee.photo}
            alt={demoEmployee.name}
            width={64}
            height={64}
            className="mx-auto size-16 rounded-full object-cover shadow-sm ring-4 ring-brand-50"
          />
          <h3 className="mt-2 text-base font-bold text-ink-charcoal">
            {demoEmployee.name}
          </h3>
          <p className="text-xs text-zinc-400">{demoEmployee.role}</p>
        </div>

        <div className="mx-auto flex size-44 items-center justify-center rounded-2xl bg-ink-charcoal p-3 shadow-inner">
          <div className="flex size-full flex-col items-center justify-center rounded-xl bg-white p-2">
            <div className="grid size-full grid-cols-5 gap-1 opacity-85">
              {qrCells.map((filled, index) => (
                <div
                  key={index}
                  className={filled ? "rounded-xs bg-black" : "bg-transparent"}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="inline-block rounded-full bg-brand-50 px-3 py-1.5 text-chip font-semibold text-brand-700">
          {demoEmployee.tipLink}
        </div>

        <div className="space-y-2 pt-2">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink-charcoal py-2.5 text-chip font-semibold text-paper-offwhite transition hover:bg-zinc-800"
          >
            <svg
              className="size-4 fill-current"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.65-.79 1.09-1.89.97-2.99-1 .04-2.15.65-2.82 1.44-.58.68-1.1 1.77-.96 2.86 1.11.09 2.19-.55 2.81-1.31z" />
            </svg>
            <span>Add to Apple Wallet</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="w-full rounded-xl bg-neutral-fill py-2.5 text-chip font-semibold text-zinc-800 transition hover:bg-zinc-200"
          >
            {copied ? "Copied to Clipboard!" : "Copy Personal Tip Link"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrPage;
