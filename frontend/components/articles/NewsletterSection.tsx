"use client";

import { FormEvent, useState } from "react";
import { Mail } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="rounded-[32px] bg-[#2D2926] px-6 py-12 text-center shadow-[0_24px_70px_rgba(45,41,38,0.16)] sm:px-10 md:py-16">
      <div className="mx-auto max-w-3xl">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C5A059]/30 bg-white/[0.03] px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.28em] text-[#C5A059]">
          <Mail size={14} />
          Newsletter
        </span>
        <h2 className="fd text-4xl font-bold leading-tight text-white sm:text-5xl">
          Stay <span className="gold-shimmer">Updated</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-relaxed text-white/70 sm:text-base">
          Receive the latest study abroad news, admission updates,
          scholarships, and expert guidance directly in your inbox.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 rounded-[24px] border border-[#C5A059]/20 bg-white/[0.04] p-2 sm:flex-row"
        >
          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setSubmitted(false);
            }}
            placeholder="Enter your email address"
            className="min-h-12 flex-1 rounded-2xl border border-transparent bg-white px-5 text-sm font-bold text-[#2D2926] outline-none transition-all placeholder:text-[#A8A29E] focus:border-[#C5A059]"
            aria-label="Email address"
          />
          <button
            type="submit"
            className="min-h-12 rounded-2xl bg-[#C5A059] px-7 text-[11px] font-black uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-white hover:text-[#2D2926]"
          >
            Subscribe
          </button>
        </form>

        {submitted && (
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[#C5A059]">
            Thank you. You are on the update list.
          </p>
        )}
      </div>
    </section>
  );
}
