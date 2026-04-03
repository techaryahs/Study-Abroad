"use client";

import React, { useState, ReactNode } from "react";
import Link from "next/link";

interface AccordionProps {
  title: string;
  children?: ReactNode;
}

function Accordion({ title, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-[#c6a96b]/20 rounded-xl bg-[#0a0a0a] overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-5 text-left font-bold text-white"
      >
        <span>{title}</span>
        <span className="text-[#d4af37] text-xl">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && (
        <div className="p-5 text-sm text-white/70 border-t border-white/5">
          {children}
        </div>
      )}
    </div>
  );
}

export default function Page() {
  const [currency, setCurrency] = useState("INR");

  const prices = {
    INR: { current: "₹20,484.22", original: "₹25,605.00" },
    USD: { current: "$245", original: "$305" }
  };

  const currentPrice = currency === "USD" ? prices.USD : prices.INR;

  return (
    <main className="min-h-screen bg-[#050505] text-white">

      {/* HERO */}
      <section className="px-6 md:px-20 py-16 grid lg:grid-cols-2 gap-12 items-center">
        
        <div>
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            COVER LETTER <br/>
            <span className="text-[#c6a96b] italic">DRAFTING</span>
          </h1>

          <p className="text-white/70 mb-8 max-w-xl">
            Command the attention of top recruiters with a cover letter that makes lasting impressions.
            Infuse our professional writing to stand out in today’s competitive job market.
          </p>

          {/* FEATURES */}
          <div className="flex gap-10 mb-8">
            <div className="text-center">
              <div className="text-2xl">📞</div>
              <p className="text-sm text-white/60">Audio call</p>
            </div>
            <div className="text-center">
              <div className="text-2xl">💬</div>
              <p className="text-sm text-white/60">Text Support</p>
            </div>
          </div>

          <button className="bg-[#c6a96b] text-black px-8 py-3 rounded-lg font-bold">
            Discuss Your Case
          </button>
        </div>

        {/* RIGHT */}
      <div className="w-[90%] mx-auto rounded-2xl overflow-hidden border border-[#c6a96b]/20">
  <video
    src="/application1.mp4"
    autoPlay
    muted
    loop
    playsInline
    className="w-full h-[350px] object-cover"
  />
</div>
      </section>

      {/* CONTENT */}
      <section className="px-6 md:px-20 grid lg:grid-cols-3 gap-12 py-16">

       <div className="lg:col-span-2">
  <h2 className="text-2xl font-bold mb-6">About Service</h2>

  <p className="text-white/70 mb-6 leading-relaxed">
    Spotlighting the reasons that make you the perfect fit for a job role is crucial for a successful job application. 
    This is why a cover letter works like a charm. While your resume lists down your past experiences, job responsibilities, 
    and accomplishments; the cover letter is all about why you are a good fit for the applied position. 
    This letter usually works as a precursor to your resume that can compound your chances of selection positively or negatively. 
    We can help you play your cards right with a powerful cover letter tailored for the job role you are applying for.
  </p>

  {/* FOCAL ELEMENTS */}
  <h3 className="text-lg font-semibold mb-3 text-[#c6a96b]">
    The focal elements of our cover letters include:
  </h3>

  <ul className="list-disc pl-6 text-white/70 space-y-2 mb-6">
    <li>Crafting a compelling introduction</li>
    <li>Developing a personalized description of your interest in the applied job role</li>
    <li>Highlighting your top skills relevant to the position</li>
    <li>Explanation of industry switch, if required</li>
    <li>Aligning your personal goals with the position and organizational goals</li>
    <li>Call to action</li>
  </ul>

  <p className="text-white/70 mb-6 leading-relaxed">
    The write up is checked using Turnitin Instructor-level software and Grammarly Premium, 
    so you can be assured that the text would be plagiarism-free and grammatically correct.
  </p>

  {/* PROCESS */}
  <h3 className="text-lg font-semibold mb-3 text-[#c6a96b]">
    The process:
  </h3>

  <ul className="list-disc pl-6 text-white/70 space-y-2">
    <li>We send you a link to a form with the required inputs</li>
    <li>You submit the inputs</li>
    <li>
      We create a base draft for you — a full-fledged draft written from scratch 
      for any job role of your choice
    </li>
    <li>
      If required, we customize the draft for other job roles. These customizations 
      build on top of your base draft and are more cost-effective
    </li>
  </ul>
</div>

        {/* SIDEBAR */}
        <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-[#c6a96b]/20">
          <h3 className="text-xl font-bold mb-4">Start Now</h3>

          <p className="text-sm text-white/60">Service: Cover Letter Drafting</p>
          <p className="text-sm text-white/60 mb-4">Duration: 1.5 - 2 weeks</p>

          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full mb-4 p-2 bg-black border border-[#c6a96b]/20"
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
          </select>

          <p className="line-through text-white/40">{currentPrice.original}</p>
          <p className="text-2xl font-bold mb-4">{currentPrice.current}</p>

          <button className="w-full bg-green-500 py-3 rounded-lg font-bold">
            Log In To Pay
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-20 py-16">
        <h2 className="text-3xl font-bold mb-10 text-center">
  Frequently Asked Questions!
</h2>

<div className="space-y-4 max-w-3xl mx-auto">

  <Accordion title="Do you only help for applications to the US? What about other countries?">
    We support applications to most countries including but not limited to USA, Canada, Germany, Ireland, UK, Australia, India, and Singapore.
  </Accordion>

  <Accordion title="Does the price include GST/Taxes?">
    Yes, all prices shown are inclusive of applicable GST/Taxes unless stated otherwise.
  </Accordion>

  <Accordion title="Since the services are offered online, how do we ensure the process will be as smooth as an offline consulting service?">
    Our process is designed to be seamless with structured workflows, regular updates, and continuous support via calls and chat, ensuring a smooth experience similar to offline consulting.
  </Accordion>

  <Accordion title="What is the best time for me to enroll in the services?">
    The best time to enroll is as early as possible so that you have enough time to prepare, refine your profile, and maximize your chances of success.
  </Accordion>

  <Accordion title="Are the timelines mentioned on the website followed religiously?">
    Yes, we strictly adhere to timelines. However, minor variations may occur depending on complexity, but we always keep you informed.
  </Accordion>

  <Accordion title="Are there any ongoing discount offers?">
    Yes, we occasionally run promotional offers and discounts. Please check the platform or connect with us to know about current deals.
  </Accordion>

</div>
      </section>

    </main>
  );
}