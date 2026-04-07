"use client";
import { useState } from "react";
import AddToCart from "@/components/shared/AddToCart";
import DiscussionSection from "@/components/shared/DiscussionSection";
import Image from "next/image";

export default function PersonalHistoryStatementPage() {
  return (
    <div className="w-full bg-black text-white min-h-screen relative overflow-hidden">

      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#d4af37]/5 blur-[200px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#d4af37]/3 blur-[200px] rounded-full pointer-events-none"></div>

      {/* HERO SECTION */}
      <section className="py-20 px-6 md:px-16 relative z-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div className="space-y-8">
            <span className="text-[#d4af37] uppercase tracking-[0.4em] font-black text-[10px]">
              Our Services
            </span>

            <h1 className="text-4xl md:text-5xl font-black uppercase leading-tight tracking-tight">
              Personal{" "}
              <span className="italic text-[#d4af37]">History</span>{" "}
              Statement
            </h1>

            <p className="text-white/40 text-lg leading-relaxed font-normal italic">
              The{" "}
              <span className="text-white/70 font-black not-italic">Personal History Statement</span>{" "}
              (also known as a{" "}
              <span className="text-white/70 font-black not-italic">Diversity Statement</span>)
              reflects your ability to connect the barriers you have overcome
              in the past to your current interest in the program.
            </p>

            <DiscussionSection serviceId="personal-history-statement" />
          </div>

          {/* RIGHT - Video */}
          <div className="flex justify-center">
            <div className="rounded-2xl overflow-hidden border border-[#d4af37]/20 shadow-2xl shadow-[#d4af37]/10 w-full max-w-md">
            <Image
  src="/PersonalHistory.jpg"
  alt="Personal History"
  width={800}
  height={500}
/>
            </div>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="w-full h-[1px] bg-white/5 max-w-7xl mx-auto px-16"></div>

      {/* ABOUT + SIDEBAR */}
      <section className="py-20 px-6 md:px-16 relative z-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">

          {/* LEFT CONTENT */}
          <div className="md:col-span-2 space-y-10">

            {/* Section Label */}
            <div className="space-y-3">
              <span className="text-[#d4af37] uppercase tracking-[0.4em] font-black text-[10px]">
                About Service
              </span>
              <div className="w-12 h-[2px] bg-[#d4af37]/40"></div>
            </div>

            <div className="space-y-6 text-white/40 leading-relaxed text-base font-normal italic">
              <p>
                While a lot of universities are not interested in knowing about
                your past, a few prestigious institutions like{" "}
                <span className="text-white/70 font-black not-italic">
                  The University of California
                </span>{" "}
                specifically require a Personal History Statement. Our main aim
                is to help you stand out by crafting a story that is unique to
                you and your profile.
              </p>

              <p>
                It is important to focus on the{" "}
                <span className="text-white/70 font-black not-italic">
                  social, economic, familial, financial and cultural barriers
                </span>{" "}
                that you faced during your life. We help highlight your ability
                to overcome challenges and turn them into strengths.
              </p>

              {/* Highlight Card */}
              <div className="border border-[#d4af37]/20 rounded-2xl p-8 bg-white/[0.02] not-italic space-y-2">
                <p className="text-white/60 leading-relaxed">
                  "This draft, when done right, has proved to be one of the
                  biggest game-changers, both in fetching admits and securing
                  significant funding."
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="border border-[#d4af37]/30 rounded-2xl p-8 bg-[#d4af37]/5 text-center space-y-4">
              <p className="font-black text-[#d4af37] uppercase tracking-widest text-sm">
                The Global Counselling Centre Promise
              </p>
              <p className="text-white/40 italic text-sm leading-relaxed">
                "We craft a Personal History Statement that is uniquely yours —
                turning your challenges into your greatest strength."
              </p>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            <div className="border border-[#d4af37]/20 rounded-2xl p-6 bg-white/[0.02] sticky top-8">
              <p className="text-[#d4af37] uppercase tracking-[0.3em] font-black text-[10px] mb-4">
                Get Started
              </p>
              <AddToCart serviceId="history-draft" />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}