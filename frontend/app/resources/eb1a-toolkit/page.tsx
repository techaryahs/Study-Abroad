"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What is an AAO Case Study?",
    answer:
      "An AAO case study is a published decision by the Administrative Appeals Office (AAO) of USCIS in which it reviews and rules on a previously denied or queried petition. These rulings clarify how immigration law and policy are applied and serve as precedents for similar cases.",
  },
  {
    question: "Do I not need legal assistance at all?",
    answer:
      "While our DIY kit is comprehensive and has helped 200+ applicants succeed without attorneys, some complex cases may still benefit from legal review. Our kit equips you to confidently handle the process yourself, but you can always consult an attorney for added peace of mind.",
  },
  {
    question: "Is RFE the end to my application?",
    answer:
      "Absolutely not. An RFE (Request for Evidence) is simply USCIS asking for more information. Our kit includes a real RFE sample and guidance on how to respond effectively to address any evidence gaps.",
  },
  {
    question: "Should I choose the DIY kit or the full EB-1 visa service?",
    answer:
      "Choose the DIY kit if you're comfortable managing the process yourself and want to save on legal fees. Choose the full EB-1 service if you prefer hands-on expert guidance throughout your entire petition journey.",
  },
  {
    question: "How do I use Overleaf?",
    answer:
      "Our kit includes a step-by-step Overleaf integration guide. Overleaf is a free online LaTeX editor — we provide your petition template pre-formatted so you can simply fill in your details and export a professional PDF.",
  },
];

const kitItems = [
  {
    icon: "📄",
    title: "Sample I-140 & I-907 Forms",
    desc: "Real examples to guide your petition and premium processing request.",
  },
  {
    icon: "⚖️",
    title: "USCIS Officer Decisions + AAO Reviews",
    desc: "Insights from actual USCIS decisions and Administrative Appeals Office (AAO) reviews.",
  },
  {
    icon: "📋",
    title: "Request for Evidence (RFE) Sample",
    desc: "A real RFE document to help you understand what USCIS asks for and how to respond.",
  },
  {
    icon: "✏️",
    title: "Editable Petition (PDF, Word, LaTeX)",
    desc: "Professionally written, editable petition used by successful candidates.",
    highlight: true,
  },
  {
    icon: "⬇️",
    title: "Fresh I-140 Form",
    desc: "Latest downloadable version to process your immigrant petition.",
    highlight: true,
  },
  {
    icon: "🎬",
    title: "Step-by-Step Guide: How to Use the Kit",
    desc: "Walkthrough to make the most of your kit, from start to submission.",
  },
  {
    icon: "📝",
    title: "Fresh I-907",
    desc: "Latest downloadable form to apply for the premium processing.",
  },
  {
    icon: "🍃",
    title: "Overleaf Integration",
    desc: "Step-by-step Overleaf guide with your LaTeX kit.",
  },
];

export default function EB1AToolkitPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#1a1a1a] font-serif">
      {/* Back Navigation */}
      <div className="px-8 pt-8">
        <a
          href="/services"
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#8B7355] hover:text-[#1a1a1a] transition-colors duration-300"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Services
        </a>
      </div>

      {/* Hero Section */}
      <section className="px-8 pt-12 pb-20 max-w-6xl mx-auto">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

    {/* LEFT CONTENT */}
    <div>
      <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-none">
        <span className="block text-[#1a1a1a]">DIY Toolkit for EB-1A</span>
      </h1>

      <p className="mt-6 text-base text-[#4a4a4a] leading-relaxed max-w-md">
        EB-1A DIY Template — 200+ Approvals, No Attorneys Needed.
        Petition Yourself with Ease.
      </p>

      <div className="mt-10">
        <a
          href="#pricing"
          className="inline-flex items-center gap-2 bg-[#F4B400] text-black px-8 py-3 rounded-md font-medium hover:opacity-90"
        >
          Get the Kit Now →
        </a>

        <p className="mt-4 text-sm text-[#4a4a4a] flex items-center gap-2">
          <span className="text-green-600">✔</span>
          Based on <strong>200+</strong> EB-1A approvals
        </p>
      </div>
    </div>

    {/* RIGHT IMAGE COLLAGE */}
    <div className="hidden lg:grid grid-cols-3 grid-rows-3 gap-4 h-[420px]">

      {/* Top small doc */}
      <div className="col-span-1 row-span-1">
        <img
          src="/doc.jpg"
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

      {/* Laptop image */}
      <div className="col-span-1 row-span-2">
        <img
          src="/work.jpg"
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

      {/* Person holding petition */}
      <div className="col-span-2 row-span-2">
        <img
          src="/EB1A.jpg"
          className="w-full h-half object-cover rounded-xl"
        />
      </div>

      
    </div>
  </div>
</section>

      {/* Divider */}
      <div className="border-t border-[#D4C4A8] mx-8" />

      {/* What's Inside */}
      <section className="px-8 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1a1a1a]">
            What&apos;s Inside the Kit?
          </h2>
          <p className="mt-3 text-sm font-sans text-[#8B7355] tracking-widest uppercase">
            Relevant sample documents along with insider guides
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kitItems.map((item, i) => (
            <div
              key={i}
              className={`p-6 border transition-all duration-300 hover:-translate-y-1 ${
                item.highlight
                  ? "bg-[#1a1a1a] border-[#1a1a1a] text-[#F5F0E8]"
                  : "bg-white/50 border-[#D4C4A8] text-[#1a1a1a] hover:border-[#8B7355]"
              }`}
            >
              <div
                className={`text-2xl mb-4 w-10 h-10 flex items-center justify-center border ${
                  item.highlight
                    ? "border-[#8B7355]/40 bg-[#8B7355]/10"
                    : "border-[#D4C4A8] bg-[#F5F0E8]"
                }`}
              >
                {item.icon}
              </div>
              <h3
                className={`text-sm font-bold leading-snug mb-2 font-sans ${
                  item.highlight ? "text-[#F5F0E8]" : "text-[#1a1a1a]"
                }`}
              >
                {item.title}
              </h3>
              <p
                className={`text-xs font-sans leading-relaxed ${
                  item.highlight ? "text-[#D4C4A8]" : "text-[#6a6a6a]"
                }`}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-[#D4C4A8] mx-8" />

      {/* DIY Winning Petition */}
     <section className="px-8 py-20 max-w-6xl mx-auto">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
    
    {/* LEFT CONTENT */}
    <div>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1a1a1a] leading-snug">
        DIY Winning Petition,
        <br />
        <span className="text-[#8B7355]">No Attorney Required</span>
      </h2>

      <p className="mt-6 text-sm font-sans text-[#4a4a4a] leading-relaxed max-w-sm">
        You know your profile better than anyone else. Leverage that to
        exude your achievements in line with EB-1A criteria. Save on legal
        fees and take full control of your success.
      </p>

      <a
        href="#pricing"
        className="mt-8 inline-block bg-[#F4B400] text-black px-8 py-3 rounded-md text-sm font-medium hover:opacity-90 transition"
      >
        Get the Kit Now
      </a>
    </div>

    {/* RIGHT IMAGE */}
    <div className="flex justify-center lg:justify-end">
      <div className="overflow-hidden rounded-2xl shadow-md w-full max-w-md">
        <img
          src="/work.jpg" // 
          alt="Working on laptop"
          className="w-full h-full object-cover"
        />
      </div>
    </div>

  </div>
</section>

      {/* Divider */}
      <div className="border-t border-[#D4C4A8] mx-8" />

      {/* Why Choose */}
     <section className="px-8 py-20 max-w-6xl mx-auto">
  
  {/* Heading */}
  <div className="text-center mb-16">
    <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a]">
      Why Choose Our DIY Kit?
    </h2>
    <p className="mt-3 text-sm text-[#6a6a6a] max-w-xl mx-auto">
      Master your EB-1A petition affordably with YMGRad&apos;s all-in-one toolkit.
      Cut legal costs and preempt RFEs
    </p>
  </div>

  {/* Cards */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
    
    {[
      {
        title: "Clear Instructions",
        desc: "Step-by-step videos and sample petitions to help you file confidently.",
      },
      {
        title: "Avoid RFEs",
        desc: "AAO case studies show what USCIS looks for, so you can fill evidence gaps smartly.",
      },
      {
        title: "Expert-Level Content",
        desc: "Professional petition template designed to maximize your approval success.",
      },
    ].map((item, i) => (
      
      <div key={i} className="text-center">

        {/* Illustration Box */}
        <div className="relative mx-auto mb-6 w-44 h-32 bg-white rounded-xl shadow-sm border border-[#eee] flex items-center justify-center">

          {/* Fake UI lines */}
          <div className="space-y-2 w-24">
            <div className="h-2 bg-gray-300 rounded w-3/4 mx-auto"></div>
            <div className="h-2 bg-gray-200 rounded w-full"></div>
            <div className="h-2 bg-gray-200 rounded w-5/6"></div>
          </div>

          {/* Yellow accent */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-16 h-3 bg-yellow-400 rounded"></div>

          {/* Floating icon */}
          <div className="absolute -top-3 right-3 w-8 h-8 bg-yellow-400 rounded-md flex items-center justify-center text-white text-sm shadow">
            {i === 0 ? "👤" : i === 1 ? "🛡️" : "⚙️"}
          </div>

        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-[#1a1a1a] mb-2">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[#6a6a6a] leading-relaxed max-w-xs mx-auto">
          {item.desc}
        </p>

      </div>
    ))}
  </div>
</section>

      {/* Built on 200+ */}
      <section className="mx-8 my-4 bg-[#1a1a1a] text-[#F5F0E8] px-10 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
         <img
  src="/from 10.png"   
  alt="Form"
  className="w-full h-[260px] object-cover rounded-xl"
/>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-snug">
              Built on{" "}
              <span className="text-[#8B7355]">200+ Approved</span>
              <br />
              EB-1A Petitions
            </h2>
            <p className="mt-5 text-sm font-sans text-[#D4C4A8] leading-relaxed max-w-sm">
              It&apos;s based on over 200+ real, successful petition approvals
              analyzed, reverse-engineered, and converted into clear, editable
              templates you can use for your own application.
            </p>
            <a
              href="#pricing"
              className="mt-8 inline-flex items-center gap-3 bg-[#8B7355] text-[#F5F0E8] px-8 py-4 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-[#1a1a1a] transition-colors duration-300"
            >
              Get the Kit Now
            </a>
          </div>
        </div>
      </section>

      {/* Video Guide */}
      <section className="px-8 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1a1a1a]">
            Step-by-Step Video Guide
          </h2>
          <p className="mt-3 text-sm font-sans text-[#6a6a6a] max-w-xl mx-auto">
            We walk you through every part of the EB-1A petition — from
            choosing the right evidence to structuring your case.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "🎬", title: "Assistive videos for every form" },
            { icon: "⚠️", title: "Learn how to avoid common mistakes" },
            { icon: "👤", title: "Easy, self-paced format — no legal jargon" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-8 border border-[#D4C4A8] bg-white/30 hover:bg-white/60 transition-colors duration-300"
            >
              <div className="w-12 h-12 bg-[#8B7355]/10 border border-[#D4C4A8] flex items-center justify-center text-xl mb-4">
                {item.icon}
              </div>
              <p className="text-sm font-sans text-[#1a1a1a] font-medium">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="px-8 py-20 bg-[#1a1a1a] text-[#F5F0E8]"
      >
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            The Only EB-1A Toolkit
            <br />
            <span className="text-[#8B7355]">You&apos;ll Ever Need</span>
          </h2>
          <p className="mt-4 text-sm font-sans text-[#D4C4A8] tracking-widest uppercase">
            Start Your EB-1A Journey the Right Way
          </p>
        </div>
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 border border-[#8B7355]/30 overflow-hidden">
          <div className="bg-[#F5F0E8] text-[#1a1a1a] p-10 flex flex-col items-center justify-center">
            <p className="text-xs font-sans tracking-widest uppercase text-[#8B7355] mb-4">
              Buy at
            </p>
            <p className="text-5xl font-bold text-[#1a1a1a]">
              <span className="text-lg font-sans font-normal">USD</span> 200
            </p>
            <p className="text-xs font-sans text-[#8B7355] mt-2 tracking-wider">
              billed just once
            </p>
            <a
              href="#"
              className="mt-8 w-full text-center bg-[#8B7355] text-[#F5F0E8] py-4 text-xs tracking-[0.2em] uppercase hover:bg-[#1a1a1a] transition-colors duration-300"
            >
              Buy Now
            </a>
          </div>
          <div className="p-10 space-y-4">
            <p className="text-xs font-sans text-[#D4C4A8] mb-6">
              Just everything you need to create a winning EB-1A petition in
              one place.
            </p>
            {[
              "Full Petition Kit (used in 200+ approvals)",
              "Step-by-Step Video Guide",
              "Templates, Forms & Writing Frameworks",
              "Lifetime Access",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[#8B7355] text-sm">✓</span>
                <span className="text-xs font-sans text-[#D4C4A8]">
                  {feature}
                </span>
              </div>
            ))}
            <div className="pt-4 flex flex-wrap gap-4 text-xs font-sans text-[#8B7355]">
              <span>◎ Cost-effective kit</span>
              <span>◎ 100% assisted</span>
              <span>◎ Customizable</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-8 py-20 max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1a1a1a]">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm font-sans text-[#8B7355] tracking-widest uppercase">
            Helping you understand every step of the way
          </p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-[#D4C4A8] bg-white/40 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/60 transition-colors duration-200"
              >
                <span className="text-sm font-sans font-semibold text-[#1a1a1a] pr-4">
                  {faq.question}
                </span>
                <span
                  className={`w-7 h-7 shrink-0 flex items-center justify-center border transition-colors duration-200 ${
                    openFaq === i
                      ? "bg-[#8B7355] border-[#8B7355] text-white"
                      : "border-[#D4C4A8] text-[#8B7355]"
                  }`}
                >
                  {openFaq === i ? "−" : "+"}
                </span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 border-t border-[#D4C4A8]">
                  <p className="text-sm font-sans text-[#4a4a4a] leading-relaxed pt-4">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      
      
    </main>
  );
}