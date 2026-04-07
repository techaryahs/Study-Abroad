"use client";
import Image from "next/image";
import { useState } from "react";
import AddToCart from "@/components/shared/AddToCart";
import DiscussionSection from "@/components/shared/DiscussionSection";
import { FaArrowLeft, FaStar } from "react-icons/fa";

export default function ResumeDraftingPage() {
  return (
    <div className="w-full bg-[#0a0a0a] text-white font-sans">

      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center px-6 md:px-20 py-20 overflow-hidden border-b border-white/10">

        {/* Subtle radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-[#c9a84c]/10 blur-[140px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#c9a84c]/8 blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center">

          {/* LEFT CONTENT */}
          <div className="space-y-8">
            {/* Premium badge */}
            <div className="inline-flex items-center gap-2 border border-[#c9a84c]/50 rounded-full px-4 py-1.5 bg-[#c9a84c]/10">
              <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse" />
              <span className="text-[#c9a84c] text-xs font-semibold uppercase tracking-[0.2em]">
                Premium Service
              </span>
            </div>

            {/* Back link */}
            <a
              href="/services"
              className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm tracking-widest uppercase w-fit"
            >
              <FaArrowLeft size={10} />
              Back to Services
            </a>

            {/* Heading */}
            <div>
              <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tight text-white uppercase">
                Resume
              </h1>
              <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tight text-[#c9a84c] uppercase">
                Drafting
              </h1>
            </div>

            <p className="text-white/60 text-lg leading-relaxed italic max-w-lg">
              Learn the secret to a perfect resume that will truly set you apart
              from any other applicant. Our expert drafts are optimized for
              international standards.
            </p>

            {/* Rating row */}
            <div className="flex items-center gap-2 text-sm text-white/50">
              <FaStar className="text-[#c9a84c]" size={14} />
              <span className="text-white font-semibold">4.9/5</span>
              <span>Rating · Trusted by 2,400+ students</span>
            </div>

            {/* Includes core nodes label */}
            <div className="pt-2">
              <p className="text-white/30 text-xs tracking-[0.25em] uppercase mb-3">
                Includes Core Nodes:
              </p>
              <div className="flex flex-wrap gap-2">
                {["Strategy Call", "Draft + Revisions", "ATS Optimization", "Final Review"].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 border border-white/15 rounded-full text-white/60 text-xs tracking-wide"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <DiscussionSection serviceId="resume-drafting" />
          </div>

          {/* RIGHT — VIDEO */}
          <div className="flex justify-center items-center">
            <div className="relative w-full max-w-md">
              {/* Glowing border frame */}
              <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-br from-[#c9a84c]/40 to-transparent blur-sm" />
              <div className="relative rounded-[2.5rem] overflow-hidden border border-[#c9a84c]/30 shadow-2xl bg-[#111]">
                   <Image
                 src="/resumee.jpg"
                 alt="resume History"
                 width={800}
                 height={500}
               />
               
              </div>

              {/* Rating badge overlay */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/80 border border-[#c9a84c]/50 rounded-full px-3 py-1.5 backdrop-blur-sm">
                <FaStar className="text-[#c9a84c]" size={12} />
                <span className="text-white text-xs font-bold">4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT + SIDEBAR */}
      <section className="max-w-7xl mx-auto px-6 md:px-20 py-24">
        <div className="grid md:grid-cols-3 gap-16">

          {/* LEFT — CONTENT */}
          <div className="md:col-span-2 space-y-16">

            {/* Service Overview */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-white uppercase tracking-tight inline-block relative">
                  Service Overview
                  <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-[#c9a84c]" />
                </h2>
              </div>

              <div className="space-y-6 text-white/60 leading-relaxed text-lg">
                <p>
                  It is extremely critical to have an eye-catching one-page resume unless you have an industry
                  experience of over 5 years. When an employer looks at a stellar resume, they are usually
                  amazed by its conciseness, organization, and pertinence of content.
                </p>
                <p>
                  While the Statement of Purpose covers the most career-shaping experiences, the resume
                  provides insights into your professional experience as a subject-matter expert.
                </p>

                {/* Pull quote */}
                <div className="border-l-4 border-[#c9a84c] bg-white/[0.03] rounded-r-2xl px-8 py-6 my-8">
                  <p className="text-xl font-bold italic text-white leading-snug">
                    "A well-crafted draft can boost your chances of bagging admits and scholarships by over 18%."
                  </p>
                </div>

                <p>
                  An average employer looks at a resume for less than 10 seconds. With a stellar resume,
                  an employer is bound to give your application more attention than your competitors.
                </p>
              </div>
            </div>

            {/* Sample Output */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-7 h-7 rounded-full bg-[#c9a84c] flex items-center justify-center text-black font-black text-xs">
                  ✓
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                  Sample Output
                </h3>
              </div>

              <div className="rounded-3xl overflow-hidden border border-white/10 group cursor-zoom-in relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 z-10" />
                <Image
                  src="/sample-resume.avif"
                  alt="Sample resume"
                  width={800}
                  height={1000}
                  className="w-full transition duration-700 group-hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>

          {/* RIGHT — STICKY SIDEBAR */}
          <div>
            <div className="sticky top-8">
              <AddToCart serviceId="resume-drafting" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}