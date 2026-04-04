"use client";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";
import AddToCart from "@/components/shared/AddToCart";
import DiscussionSection from "@/components/shared/DiscussionSection";

export default function ResumeDraftingPage() {

  return (
    <div className="w-full bg-white text-gray-800">
      {/* HERO SECTION */}
      <section className="bg-[#fcfcfc] py-16 px-6 md:px-16 border-b">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          {/* LEFT CONTENT */}
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-black mb-6 uppercase tracking-tight">
              Resume Drafting
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Learn the secret to a perfect resume that will truly set you apart from any other applicant that you compete with. Our expert drafts are optimized for international standards.
            </p>

            <DiscussionSection serviceId="resume-drafting" />
          </div>

          {/* RIGHT VIDEO */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-yellow-500/10 rounded-[3rem] blur-2xl group-hover:bg-yellow-500/20 transition duration-500"></div>
              <video
                className="rounded-[2rem] w-full max-w-md shadow-2xl relative border-8 border-white"
                controls
                autoPlay
                loop
                muted
              >
                <source src="/ResumeDrafting.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT + SIDEBAR */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 py-20">
        <div className="grid md:grid-cols-3 gap-16">
          {/* LEFT CONTENT */}
          <div className="md:col-span-2 space-y-12">
            <div>
              <h2 className="text-3xl font-black text-black mb-6 relative inline-block">
                Service Overview
                <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-yellow-400 rounded-full"></span>
              </h2>
              
              <div className="space-y-6 text-gray-600 leading-relaxed text-lg font-medium">
                <p>
                  It is extremely critical to have an eye-catching one-page resume unless you have an industry experience of over 5 years. When an employer looks at my resume, he is usually amazed by the conciseness, organization, and pertinence of the content.
                </p>

                <p>
                  While the Statement of Purpose covers the most career-shaping experiences, the resume provides insights into your professional experience as a subject-matter expert.
                </p>

                <div className="bg-black text-white p-8 rounded-3xl shadow-2xl border-l-8 border-yellow-500">
                   <p className="text-xl font-bold italic leading-snug">
                    "A well-crafted draft can boost your chances of bagging admits and scholarships by over 18%."
                  </p>
                </div>

                <p>
                  An average employer looks at a resume for less than 10 seconds. With a stellar resume, an employer is bound to give your application more attention than your competitors.
                </p>
              </div>
            </div>

            {/* SAMPLE OUTPUT */}
            <div className="pt-8">
              <h3 className="text-xl font-black text-black mb-6 uppercase tracking-widest flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-sm">✓</span>
                Sample Output
              </h3>

              <div className="border-4 border-gray-50 rounded-[2rem] overflow-hidden shadow-2xl group cursor-zoom-in">
                <Image
                  src="/sample-resume.avif"
                  alt="Sample resume"
                  width={800}
                  height={1000}
                  className="w-full transition duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-8">
            <div className="w-full sticky top-8">
              <AddToCart serviceId="resume-drafting" />
      
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}