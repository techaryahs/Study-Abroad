"use client";

import { useState } from "react";
import { FaGraduationCap, FaChartLine, FaFileAlt } from "react-icons/fa";
import { FaVideo, FaPhoneAlt, FaCommentDots } from "react-icons/fa";
const advantages = [
  {
    title: "No Sponsorship Needed",
    desc: "Eligibility is based on either a fixed monthly salary of SGD 30,000 or exceptional achievements.",
  },
  {
    title: "Renewable Visa",
    desc: "First-time approval allows a stay for up to five years; each renewal also grants up to five years of stay.",
  },
  {
    title: "Career Flexibility",
    desc: "ONE Pass holders are not tied to a single employer and are allowed to change employers or work for multiple companies without needing a new pass.",
  },
  {
    title: "Job Advertising Exemption",
    desc: "Exemption from Complementarity Assessment Framework (COMPASS) and Fair Consideration Framework job advertising requirements.",
  },
  {
    title: "Family-Friendly",
    desc: "Spouses can apply for a Letter of Consent to work in Singapore, and dependent passes are available for children.",
  },
  {
    title: "Zero Levy & Quota Constraints",
    desc: "Employers hiring ONE Pass holders pay no foreign-worker fee and are exempt from dependency-ratio (quota) limits.",
  },
];

const achieverCriteria = [
  "Evidence of your authorship of scholarly articles.",
  "Evidence that you have been asked to judge the work of others, either individually or on a panel.",
  "Evidence of original scientific scholarly contributions of major significance to your field.",
  "Evidence of your membership in associations in the field which demand outstanding achievement of their members.",
  "Evidence of published material about you in professional or major trade publications or other major media.",
  "Evidence of being a recipient of nationally or internationally recognized prizes.",
  "Evidence of playing a critical role in distinguished organizations.",
];

const timeline = [
  {
    step: "01",
    title: "Profile Building",
    desc: "Align your qualifications and experience with ONE Pass requirements.",
    duration: "6 Months",
  },
  {
    step: "02",
    title: "Petitioning",
    desc: "Build an unbreakable petition with expert guidance.",
    duration: "1–2 Months",
  },
  {
    step: "03",
    title: "Standard Turnaround",
    desc: "Within 4 weeks for most straightforward cases.",
    duration: "4–8 Weeks",
  },
  {
    step: "04",
    title: "Outstanding Achiever Track",
    desc: "May take longer if MOM and partner agencies require deeper review of your achievements and endorsements.",
    duration: "4–8 Weeks",
  },
];

const successRates = [
  { label: "With 5 Papers", percent: 77 },
  { label: "With 6 Papers", percent: 80 },
  { label: "With 7 Papers", percent: 85 },
  { label: "With 8 Papers", percent: 94 },
];

const faqs = [
  {
    q: "Do you only help for applications to Singapore? What about other countries?",
    a: "We support applications to most countries including but not limited to USA, Canada, Germany, Ireland, UK, Australia, India, and Singapore.",
  },
  {
    q: "Does the price include GST/Taxes?",
    a: "Please contact our team for detailed pricing information including applicable taxes for your region.",
  },
  {
    q: "Since the services are offered online, how do we ensure the process will be as smooth as an offline consulting service?",
    a: "We provide dedicated support via video call, audio call, and text throughout your entire application journey, ensuring the same quality as in-person consulting.",
  },
  {
    q: "What is the best time for me to enroll in the services?",
    a: "The earlier the better. Profile building alone takes up to 6 months, so we recommend starting at least 8–10 months before your intended move date.",
  },
  {
    q: "Are the timelines mentioned on the website followed religiously?",
    a: "Timelines are estimates based on past client data. Complex cases, especially on the Outstanding Achiever Track, may vary depending on MOM's review process.",
  },
  {
    q: "Are there any ongoing discount offers?",
    a: "We periodically offer promotional pricing. Contact our team or check back regularly for the latest offers.",
  },
];

export default function SingaporeONEPassPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="bg-[#FAF7F2] min-h-screen font-serif text-[#1a1a1a]">

      {/* Hero */}
  <section className="relative bg-[#FAF7F2] border-b border-[#e8e0d0] px-6 md:px-16 py-20 overflow-hidden">
  <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

    {/* 🔹 LEFT SIDE CONTENT */}
    <div>
      <h1 className="text-4xl md:text-6xl font-bold text-[#1a1a1a] leading-tight mb-6">
        Apply for <br />
        <span className="text-[#B8942E]">Singapore ONE Pass</span>
      </h1>

      <p className="text-lg text-[#555] font-sans leading-relaxed mb-6">
        The ONE Pass is Singapore’s talent visa for top achievers in business, arts, sports, academia, and research.
      </p>

      <p className="text-[#1a1a1a] font-semibold mb-3">Includes:</p>

      {/* FEATURES */}
      <div className="flex flex-wrap gap-6 mb-8">

        <div className="flex items-center gap-3 text-sm text-[#444]">
    <img src="/vedio.png" alt="video" className="w-6 h-6 object-contain" />
    Video Call
  </div>

  {/* AUDIO */}
  <div className="flex items-center gap-3 text-sm text-[#444]">
    <img src="/audio.jpg" alt="audio" className="w-6 h-6 object-contain" />
    Audio Call
  </div>

  {/* TEXT SUPPORT */}
  <div className="flex items-center gap-3 text-sm text-[#444]">
    <img src="/whatsapp.png" alt="text" className="w-6 h-6 object-contain" />
    Text Support
  </div>

      </div>

      {/* BUTTON */}
      <button className="bg-[#1a1a1a] text-white px-6 py-3 text-sm font-semibold hover:bg-[#333] transition">
        Discuss Your Case
      </button>

      <p className="text-sm text-[#777] mt-4 font-sans">
        Have questions about this service? Let’s chat.
      </p>
    </div>

    {/* 🔹 RIGHT SIDE IMAGE */}
    <div className="flex justify-center">
      <img
        src="/onepass-hero.png"   // 👉 add your image
        alt="ONE Pass"
        className="w-full max-w-md h-auto object-contain"
      />
    </div>

  </div>
</section>

      {/* About */}
      <section id="about" className="px-6 md:px-16 py-20 max-w-5xl mx-auto">
 <div className="text-center mb-4">
  <p className="uppercase tracking-[0.2em] text-lg md:text-xl font-bold text-black">
    About Service
  </p>
  <div className="w-20 h-[2px] bg-[#B8942E] mx-auto mt-2"></div>
</div>
      <h2 className="text-xl md:text-2xl font-semibold text-black mb-6">
  What is the Overseas Networks & Expertise Pass (ONE Pass)?
</h2>
        <div className="w-16 h-px bg-[#B8942E] mb-8" />
        <p className="text-[#555] font-sans leading-relaxed max-w-3xl text-base">
          The ONE Pass is a premium work pass for top-tier foreign professionals looking to live, work,
          and build ventures in Singapore. Designed to attract &ldquo;big-thinkers&rdquo; in business, arts &amp;
          culture, sports, academia, and research, the ONE Pass gives applicants the freedom to change
          jobs without reapplying, launch companies, and bring their family along, all on a single,
          long-duration pass.
        </p>
      </section>

      {/* Advantages */}
     <section className="bg-[#1a1a1a] text-white px-6 md:px-16 py-20">
  <div className="max-w-6xl mx-auto">

    {/* HEADING */}
    <h2 className="text-3xl md:text-4xl font-bold mb-12">
      The ONE Pass has the following advantages:
    </h2>

    {/* GRID */}
    <div className="grid md:grid-cols-2 gap-12 items-center">

      {/* LEFT SIDE */}
      <div className="space-y-6">
        {advantages.map((a) => (
          <div key={a.title} className="flex items-start gap-4">

            {/* 🔘 WHITE BULLET */}
            <span className="w-3 h-3 mt-2 bg-white rounded-full flex-shrink-0"></span>

            {/* TEXT */}
            <div>
              <h3 className="font-bold text-lg mb-1 text-white">
                {a.title}
              </h3>
              <p className="text-[#aaa] text-sm leading-relaxed">
                {a.desc}
              </p>
            </div>

          </div>
        ))}
      </div>

      {/* RIGHT SIDE IMAGE */}
      <div className="flex items-center justify-center">
        <img
          src="/advantages.jpg"
          alt="advantages"
          className="w-full h-auto object-contain"
        />
      </div>

    </div>

  </div>
</section>

 {/* Eligibility */}
<section id="eligibility" className="px-6 md:px-16 py-20 max-w-6xl mx-auto">

  <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">
    Eligibility Criteria
  </h2>

  <div className="w-16 h-px bg-[#B8942E] mb-6" />

  <p className="text-[#666] font-sans mb-12">
    Applicants need to either earn a high salary or meet the outstanding achievements criteria.
  </p>

  {/* 🔥 MAIN GRID */}
  <div className="grid md:grid-cols-2 gap-12 items-start">

    {/* 🖼️ LEFT IMAGE */}
    <div>
      <img
        src="/eligibility.png"   // 👉 put image in public folder
        alt="eligibility"
        className="w-full h-auto rounded-xl object-cover"
      />
    </div>

    {/* 📦 RIGHT SIDE (STACKED CARDS) */}
    <div className="space-y-8">

      {/* Salary Track */}
      <div className="bg-white border border-[#e8e0d0] p-8">
        <h3 className="text-xl font-bold text-black mb-1">
          Salary Track
        </h3>

        <div className="w-10 h-px bg-[#B8942E] mb-6" />

        <div className="space-y-5 font-sans">
          {[
            "Earned a fixed monthly salary ≥ S$30,000 for the 12 months before application.",
            "Will earn a fixed monthly salary ≥ S$30,000 under your Singapore employer.",
          ].map((item, i) => (
            <div key={i} className="flex gap-4">
              <span className="w-7 h-7 bg-[#B8942E] text-white text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <p className="text-[#444] text-sm">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Outstanding Achiever Track */}
      <div className="bg-white border border-[#e8e0d0] p-8">
        <h3 className="text-xl font-bold text-black mb-1">
          Outstanding Achiever Track
        </h3>

        <div className="w-10 h-px bg-[#B8942E] mb-4" />

        <p className="text-[#666] font-sans text-sm mb-6">
          Exceptional accomplishments in sports, arts & culture, and academia and research.
        </p>

        <div className="space-y-4 font-sans">
          {achieverCriteria.map((item, i) => (
            <div key={i} className="flex gap-4">
              <span className="w-7 h-7 bg-[#B8942E] text-white text-xs font-bold flex items-center justify-center">
  {i + 1}
</span>
              <p className="text-[#444] text-sm">{item}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-[#888] font-sans italic">
          All applications are reviewed holistically by MOM and partner agencies (MCCY, MOE, NRF, A*STAR).
        </p>
      </div>

    </div>

  </div>
</section>

      {/* Why Choose Us */}
      <section className="bg-[#F3EDD8] px-6 md:px-16 py-20">
        <div className="max-w-5xl mx-auto text-center">
          
         <h2 className="text-3xl md:text-4xl font-bold text-black">
  Why Choose Global Counselling Centre?
</h2>
          <div className="w-16 h-px bg-[#B8942E] mx-auto mb-6" />
          <p className="text-[#666] font-sans max-w-2xl mx-auto mb-14">
            We are a team of experienced immigration counselors and industry experts with the tools,
            strategies, and insights to highlight your achievements in the best possible light.
          </p>
          
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {[
    {
      title: "Free Eligibility Check",
      desc: "Understand your chances before committing — our experts assess your profile at no cost.",
      icon: <FaGraduationCap />,
    },
    {
      title: "Profile Boosting",
      desc: "We identify gaps and guide you on building citations, publications, and recognitions.",
      icon: <FaChartLine />,
    },
    {
      title: "Expert Petition Strategy",
      desc: "Our petition writers craft compelling narratives tailored to MOM's evaluation framework.",
      icon: <FaFileAlt />,
    },
  ].map((s) => (
    <div
      key={s.title}
      className="bg-white border border-[#e8e0d0] p-8 text-center rounded-lg"
    >
      {/* ✅ ICON */}
      <div className="text-[#B8942E] text-4xl mb-4 flex justify-center">
        {s.icon}
      </div>

      {/* ✅ TITLE BLACK */}
      <h3 className="text-black font-bold text-lg mb-3">
        {s.title}
      </h3>

      {/* DESCRIPTION */}
      <p className="text-[#666] font-sans text-sm leading-relaxed">
        {s.desc}
      </p>

      {/* BUTTON */}
      <button className="mt-6 text-[#B8942E] font-sans text-sm underline underline-offset-4">
        Learn more →
      </button>
    </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-6 md:px-16 py-20 max-w-6xl mx-auto">
  
 

 <div className="text-center">

  <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-3">
    Timeline
  </h2>

  <div className="w-16 h-px bg-[#B8942E] mx-auto mb-4" />

  <p className="text-[#666] font-sans mb-14">
    Here’s how long it takes to get the ONE Pass.
  </p>

</div>

  {/* GRID */}
  <div className="grid md:grid-cols-2 gap-12 items-start">

    {/* 🖼️ LEFT SIDE IMAGE */}
    <div className="w-full">
      <img
        src="/timeline-image.jpg"   // 👉 put your image in public folder
        alt="timeline"
        className="w-full h-auto rounded-xl object-cover"
      />
    </div>

    {/* 📍 RIGHT SIDE TIMELINE */}
    <div className="relative">

      {/* YELLOW LINE */}
      <div className="absolute left-[20px] top-0 bottom-0 w-[2px] bg-[#B8942E]" />

      <div className="space-y-12">
        {timeline.map((t, i) => (
          <div key={t.step} className="relative flex items-start gap-8">

            {/* 🟡 ONLY ONE BULLET */}
            <div className="absolute left-[12px] top-2 w-5 h-5 bg-[#B8942E] rounded-full border-4 border-white z-10"></div>

            {/* CONTENT */}
            <div className="bg-white border border-[#e8e0d0] p-6 flex-1 ml-10 rounded-lg shadow-sm">
              
              <p className="uppercase tracking-widest text-xs text-[#B8942E] mb-1">
                Step {i + 1}
              </p>

              <h3 className="font-bold text-lg mb-2">
                {t.title}
              </h3>

              <p className="text-[#666] text-sm mb-3">
                {t.desc}
              </p>

              <span className="text-xs text-[#B8942E] border border-[#B8942E] px-3 py-1 inline-block">
                ⏱ Duration — {t.duration}
              </span>

            </div>

          </div>
        ))}
      </div>

    </div>

  </div>
</section>

      {/* Success Rate */}
      <section className="bg-[#1a1a1a] text-white px-6 md:px-16 py-20">
        <div className="max-w-5xl mx-auto">
          
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center w-full">
  Success Rate & Pathways
</h2>
<p className="text-center text-gray-500 mt-2 text-sm md:text-base">
  Understand what you need on your profile to get approved.
</p>
          <div className="w-16 h-px bg-[#B8942E] mb-12" />

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h3 className="font-sans font-semibold text-sm text-[#aaa] mb-1 uppercase tracking-wider">
                ONE Pass Success Rate
              </h3>
              <p className="text-[#888] font-sans text-xs mb-8">
                Based on petition outputs of our clients (2025)
              </p>
              <div className="space-y-5">
                {successRates.map((r) => (
                  <div key={r.label}>
                    <div className="flex justify-between font-sans text-sm mb-2">
                      <span className="text-[#ccc]">{r.label}</span>
                      <span className="text-[#B8942E] font-bold">{r.percent}%</span>
                    </div>
                    <div className="h-2 bg-[#333] w-full">
                      <div
                        className="h-2 bg-[#B8942E] transition-all"
                        style={{ width: `${r.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-xs text-[#B8942E] font-sans italic">
                Average 20–30 citations per paper (Total 150 to 250 citations)
              </p>
            </div>

            <div>
              <h3 className="font-sans font-semibold text-sm text-[#aaa] mb-6 uppercase tracking-wider">
                Other Pathways for Working Overseas
              </h3>
              <div className="space-y-3">
                {[
                  { flag: "🇺🇸", title: "United States (O-1 Visa)", sub: "Fast Work Visa, No Lottery & Direct PR Pathway." },
                  { flag: "🇬🇧", title: "United Kingdom (Global Talent Visa)", sub: "UK Work Visa Without Employer & PR Pathway." },
                  { flag: "🇦🇺", title: "Australia (National Innovation Visa)", sub: "Australia Work Visa & Direct PR (No Employer)." },
                  { flag: "🇺🇸", title: "United States (EB-2 NIW Visa)", sub: "No Employer Needed, Direct PR Pathway." },
                  { flag: "🇺🇸", title: "United States (EB-1 Visa)", sub: "No Employer Needed, Direct PR Pathway." },
                ].map((p) => (
                  <div
                    key={p.title}
                    className="flex items-center justify-between border border-[#333] p-4 hover:border-[#B8942E] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{p.flag}</span>
                      <div>
                        <p className="font-sans text-sm font-semibold text-white">{p.title}</p>
                        <p className="font-sans text-xs text-[#888]">{p.sub}</p>
                      </div>
                    </div>
                    <span className="text-[#B8942E] text-sm">↗</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-16 py-20 max-w-3xl mx-auto">
        
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-center text-black">
  Frequently Asked Questions
</h2>
        <div className="w-16 h-px bg-[#B8942E] mx-auto mb-14" />

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-[#e8e0d0] bg-white">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left font-sans text-sm font-semibold text-[#1a1a1a] hover:bg-[#FAF7F2] transition-colors"
              >
                <span>{faq.q}</span>
                <span className="ml-4 flex-shrink-0 w-7 h-7 border border-[#B8942E] text-[#B8942E] flex items-center justify-center text-lg leading-none">
                  {openFaq === i ? "−" : "+"}
                </span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 font-sans text-sm text-[#666] leading-relaxed border-t border-[#e8e0d0]">
                  <p className="pt-4">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      
     
    </main>
  );
}