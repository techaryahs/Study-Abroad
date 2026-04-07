"use client";
import Link from "next/link";
import { useState } from "react";
import AddToCart from "@/components/shared/AddToCart";
import DiscussionSection from "@/components/shared/DiscussionSection";
import Image from "next/image";

export default function LORDraftingPage() {
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
            {/* Badge */}
            <span className="text-[#d4af37] uppercase tracking-[0.4em] font-black text-[10px]">
              Our Services
            </span>

            <h1 className="text-4xl md:text-5xl font-black uppercase leading-tight tracking-tight">
              Letter of{" "}
              <span className="italic text-[#d4af37]">Recommendation</span>{" "}
              Drafting
            </h1>

            <p className="text-white/40 text-lg leading-relaxed font-normal italic">
              Little known is the art of writing exactly what the admissions committee wants to see in an applicant. This can be more impacting than your SOP if done right.
            </p>

            <DiscussionSection serviceId="letter-of-recommendation-drafting" />
          </div>

          {/* RIGHT - Video */}
          <div className="flex justify-center">
            <div className="rounded-2xl overflow-hidden border border-[#d4af37]/20 shadow-2xl shadow-[#d4af37]/10 w-full max-w-md">
                <Image
                src="/lor img.jpg"
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
                Letters of Recommendation (LORs) are the documents that undeniably hold the most importance in your application. However, it is not that simple. These can either be the least influential documents or the only documents you need to secure that admit. If done right, they are the most important tool in your arsenal. Yes, even more critical than your SOP.
              </p>
              <p>
                Now, the reason that these are undermined is that most LORs I see are crafted to fall in the former category: the least influential documents in your application, which means you have wasted the only chance you had at winning the committee's support.
              </p>

              {/* Highlight Card */}
              <div className="border border-[#d4af37]/20 rounded-2xl p-8 bg-white/[0.02] space-y-4 not-italic">
                <p className="text-white/60 leading-relaxed">
                  Think about it. You are on the admissions committee. Would you put your faith in a random applicant or rather believe a professor or someone you know/follow from the same profession. It is that simple.
                </p>
                <p className="text-white/60 leading-relaxed">
                  Most LORs are general and centered around the same generic statement — and that simply does not work anymore.
                </p>
              </div>

              <p>
                What a load of crap! No one cares. That cannot be the reason I would possibly give you an admit. You wouldn't give yourself an admit based on that either. Yet, most LORs I see are generic and based on the same idea.
              </p>
              <p>
                This service will also include recommendations on who you should take your letters from, given that you are only allowed to choose a limited number of recommenders. All of this will vary based on your profile, degree, and your network.
              </p>
            </div>

            {/* CTA Text */}
            <div className="border border-[#d4af37]/30 rounded-2xl p-8 bg-[#d4af37]/5 text-center space-y-4">
              <p className="font-black text-[#d4af37] uppercase tracking-widest text-sm">
                The Global Counselling Centre Promise
              </p>
              <p className="text-white/40 italic text-sm leading-relaxed">
                "Looking to really stand out? We have the secrets to creating STRONG LORs that cater to the international recommender standards. Book your drafts now!"
              </p>
              <Link
                href="/contact"
                className="inline-block mt-2 px-8 py-3 bg-[#d4af37] text-black text-[10px] font-black uppercase tracking-widest rounded-lg hover:brightness-110 transition-all active:scale-95"
              >
                Book Now
              </Link>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            <div className="border border-[#d4af37]/20 rounded-2xl p-6 bg-white/[0.02]">
              <p className="text-[#d4af37] uppercase tracking-[0.3em] font-black text-[10px] mb-4">
                Get Started
              </p>
              <AddToCart serviceId="lor-drafting" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}