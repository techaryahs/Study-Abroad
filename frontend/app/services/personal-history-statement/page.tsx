"use client";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";
import AddToCart from "@/components/shared/AddToCart";
import DiscussionSection from "@/components/shared/DiscussionSection";

export default function PersonalHistoryStatementPage() {

  return (
    <div className="w-full bg-white text-gray-800">
      {/* HERO SECTION */}
      <section className="bg-[#fcfcfc] py-16 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          {/* LEFT CONTENT */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6 uppercase">
              Personal History Statement
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              The <span className="font-semibold text-black">Personal History Statement</span> (also known as a <span className="font-semibold text-black">Diversity Statement</span>) reflects your ability to connect the barriers you have overcome in the past to your current interest in the program.
            </p>

            <DiscussionSection serviceId="personal-history-statement" />
          </div>

          {/* RIGHT VIDEO */}
          <div className="flex justify-center relative">
            <div className="absolute inset-0 bg-yellow-500/5 blur-3xl rounded-full -z-10"></div>
            <video
              className="rounded-2xl w-full max-w-md shadow-2xl border-4 border-white"
              controls
              autoPlay
              loop
              muted
            >
              <source src="/PersonalHistory.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* ABOUT + SIDEBAR */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 py-20">
        <div className="grid md:grid-cols-3 gap-16">
          {/* LEFT CONTENT */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-black mb-4 inline-block relative">
                About This Service
                <span className="absolute -bottom-1 left-0 w-1/2 h-1 bg-yellow-500 rounded-full"></span>
              </h2>
            </div>

            <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
              <p>
                While a lot of universities are not interested in knowing about your past, a few prestigious institutions like <span className="font-semibold text-black">The University of California</span> specifically require a Personal History Statement. Our main aim is to help you stand out by crafting a story that is unique to you and your profile.
              </p>

              <p>
                It is important to focus on the <span className="font-semibold text-black italic">social, economic, familial, financial and cultural barriers</span> that you faced during your life. We help highlight your ability to overcome challenges and turn them into strengths.
              </p>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl">
                <p className="font-bold text-gray-900 leading-snug">
                  "This draft, when done right, has proved to be one of the biggest game-changers, both in fetching admits and securing significant funding."
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-8">
            <div className="w-full sticky top-8">
              <AddToCart serviceId="history-draft" />
              
              {/* <div className="mt-8 bg-black rounded-2xl p-8 shadow-xl border border-white/5">
                <DiscussionSection serviceId="personal-history-statement" />
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}