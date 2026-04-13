"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
interface TimelineStep {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  duration?: React.ReactNode;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const timelineSteps: TimelineStep[] = [
  {
    step: 1,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
        <path d="M8 7h8M8 12h5" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Profile Building",
    description: "Align your qualifications and experience with EB-2 NIW requirements.",
    duration: <span className="text-sm" style={{ color: "#9C7A5B" }}>⏱ Duration — 6 Months</span>,
  },
  {
    step: 2,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth="1.5" />
        <path d="M3 9h18M8 4v5M16 4v5" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Petitioning",
    description: "Build an unbreakable petition.",
    duration: <span className="text-sm" style={{ color: "#9C7A5B" }}>⏱ Duration — 1–2 Months</span>,
  },
  {
    step: 3,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M4 4h16v16H4zM9 4v16M4 9h5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Filing with USCIS",
    description: "Filing the I-140 petition.",
    duration: undefined,
  },
  {
    step: 4,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
      </svg>
    ),
    title: "Form I-140 Processing",
    description: "",
    duration: (
      <div className="mt-3 space-y-2">
        <p className="text-sm font-medium" style={{ color: "#9C7A5B" }}>⏱ Duration</p>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-sm" style={{ background: "#F0D98A", color: "#3D2B1F" }}>Premium</span>
          <span className="text-sm" style={{ color: "#6B4C35" }}>45 Calendar Days</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-sm" style={{ background: "#3D2B1F", color: "#F5F0E8" }}>Standard</span>
          <span className="text-sm" style={{ color: "#6B4C35" }}>4–8 Months</span>
        </div>
      </div>
    ),
  },
];

const successRates = [
  { label: "With 5 Papers", percent: 70 },
  { label: "With 6 Papers", percent: 76 },
  { label: "With 7 Papers", percent: 83 },
  { label: "With 8 Papers", percent: 94 },
];

const otherPathways = [
  { flag: "🇺🇸", title: "United States (O-1 Visa)", subtitle: "Fast Work Visa, No Lottery & Direct PR Pathway." },
  { flag: "🇬🇧", title: "United Kingdom (Global Talent Visa)", subtitle: "UK Work Visa Without Employer & PR Pathway." },
  { flag: "🇦🇺", title: "Australia (National Innovation Visa)", subtitle: "Australia Work Visa & Direct PR (No Employer)." },
  { flag: "🇺🇸", title: "United States (EB-1 Visa)", subtitle: "Fastest Green Card by Employment." },
];

const faqs = [
  {
    q: "Do you only help for applications to the US? What about other countries?",
    a: "We support applications to most countries including but not limited to USA, Canada, Germany, Ireland, UK, Australia, India, and Singapore.",
  },
  {
    q: "Does the price include GST/Taxes?",
    a: "Our pricing is exclusive of applicable taxes. GST or other local taxes will be added at checkout based on your billing country.",
  },
  {
    q: "Since the services are offered online, how do we ensure the process will be as smooth as an offline consulting service?",
    a: "We use a combination of video calls, audio calls, and text support to ensure a seamless experience.",
  },
  {
    q: "What is the best time for me to enroll in the services?",
    a: "The earlier the better! We recommend enrolling at least 6–12 months before your target application deadline.",
  },
  {
    q: "Are the timelines mentioned on the website followed religiously?",
    a: "The timelines provided are estimates based on our experience with past clients. Actual timelines may vary depending on USCIS processing times.",
  },
  {
    q: "Are there any ongoing discount offers?",
    a: "We periodically run promotions. Please check our website or reach out to our team to learn about current discounts.",
  },
];

// ─── Theme tokens ─────────────────────────────────────────────────────────────
const t = {
  cream:      "#F5F0E8",
  cream2:     "#EDE6D6",
  cream3:     "#E5DCC8",
  gold:       "#C9A84C",
  goldLight:  "#F0D98A",
  brown:      "#3D2B1F",
  brownMid:   "#6B4C35",
  brownLight: "#9C7A5B",
  white:      "#FDFAF5",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepBadge({ n }: { n: number }) {
  return (
    <div
      className="flex items-center justify-center w-7 h-7 text-xs font-bold flex-shrink-0"
      style={{ border: `2px solid ${t.gold}`, background: "#FBF5E6", color: t.brown, borderRadius: "2px" }}
    >
      {n}
    </div>
  );
}

function GoldCheck() {
  return (
    <div
      className="flex items-center justify-center w-6 h-6 flex-shrink-0 mt-0.5"
      style={{ background: t.gold, borderRadius: "2px" }}
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="white" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}

function DottedConnector() {
  return (
    <div className="flex flex-col items-center ml-3.5 my-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="w-0.5 h-1.5 mb-0.5 rounded-full" style={{ background: t.gold, opacity: 0.4 }} />
      ))}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center mb-10">
      <h2 className="text-2xl md:text-3xl font-semibold mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: t.brown }}>
        {children}
      </h2>
      <div className="flex items-center justify-center gap-3">
        <div className="h-px w-16" style={{ background: t.gold }} />
        <div className="w-2 h-2 rotate-45 flex-shrink-0" style={{ background: t.gold }} />
        <div className="h-px w-16" style={{ background: t.gold }} />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EB2NIWPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="min-h-screen font-sans" style={{ background: t.cream, color: t.brown }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
      `}</style>

      {/* ══════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════ */}
      <section className="px-6 py-14 md:px-16 lg:px-24" style={{ background: t.cream2 }}>
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-10">

          {/* Left */}
          <div className="max-w-lg">
            {/* Back */}
            <Link href="/services" className="inline-flex items-center gap-1 text-sm mb-6" style={{ color: t.brownMid }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to services
            </Link>

            {/* Badge */}
            <div className="inline-block mb-4 px-3 py-1 text-xs font-medium tracking-widest uppercase" style={{ border: `1px solid ${t.brownLight}`, color: t.brownMid, borderRadius: "2px" }}>
              Third-Party Validation Audit
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: t.brown }}>
              The Art of
            </h1>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-6 italic" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: t.gold }}>
              EB-2 NIW Visa
            </h1>

            <blockquote className="text-sm leading-relaxed mb-6 pl-4 italic" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: t.brownMid, borderLeft: `3px solid ${t.gold}` }}>
              &ldquo;Little known is the art of writing exactly what USCIS wants to see.
              A strong petition can be more impactful than your credentials alone.&rdquo;
            </blockquote>

            <p className="text-sm font-medium mb-3" style={{ color: t.brownMid }}>Includes:</p>
            <div className="flex items-center gap-8 mb-8">
              {[
                { label: "Video call", bg: t.brown, icon: <path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" /> },
                { label: "Audio call", bg: t.brown, icon: <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" /> },
                { label: "Text Support", bg: "#25d366", icon: <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /> },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-1.5">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: item.bg }}>
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
                  </div>
                  <span className="text-xs" style={{ color: t.brownLight }}>{item.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                className="flex items-center gap-3 px-6 py-3 text-sm font-medium transition-opacity hover:opacity-90"
                style={{ background: t.brown, color: t.cream, borderRadius: "2px" }}
              >
                Begin Strategy
                <span className="flex items-center justify-center w-7 h-7 text-sm font-bold" style={{ background: t.gold, color: t.brown, borderRadius: "2px" }}>
                  →
                </span>
              </button>
              <button
                className="px-5 py-3 text-sm font-medium transition-colors hover:opacity-80"
                style={{ border: `1.5px solid ${t.gold}`, background: "transparent", color: t.brownMid, borderRadius: "2px" }}
              >
                Discuss Your Case
              </button>
            </div>
          </div>

          {/* Right – Illustration placeholder */}
          <div className="flex-shrink-0">
            <div className="w-[380px] h-[280px] rounded-lg flex items-center justify-center" style={{ background: t.cream3, border: `1px solid ${t.goldLight}` }}>
              <img src="/eb2-hero.jpg" alt="EB-2 NIW Visa" className="w-full h-full object-cover rounded-lg" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
          </div>
        </div>
      </section>

      {/* Decorative divider */}
      <div className="flex items-center px-6 md:px-16 lg:px-24 py-4 max-w-6xl mx-auto gap-4">
        <div className="flex-1 h-px" style={{ background: t.goldLight }} />
        <div className="w-2 h-2 rotate-45" style={{ background: t.gold }} />
        <div className="flex-1 h-px" style={{ background: t.goldLight }} />
      </div>

      {/* ══════════════════════════════════════════════
          ABOUT SERVICE
      ══════════════════════════════════════════════ */}
      <div className="px-6 md:px-16 lg:px-24 max-w-6xl mx-auto mt-8">
        <SectionHeading>About Service</SectionHeading>
      </div>

      {/* ══════════════════════════════════════════════
          WHAT IS EB-2 NIW
      ══════════════════════════════════════════════ */}
      <section className="px-6 md:px-16 lg:px-24 py-10 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-start">

          {/* Left text */}
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-semibold mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: t.brown }}>
              What is the EB-2 National Interest Waiver (NIW) Visa?
            </h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: t.brownMid }}>
              The EB-2 National Interest Waiver is a category under the employment-based
              second preference immigration US visa. It is designed for professionals who
              can prove that their work is in the interest of the United States and is of
              national importance.
            </p>
            <div className="flex items-start gap-2 text-sm" style={{ color: t.brownMid }}>
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: t.gold }}>
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-5.121-5.121a1 1 0 011.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Unlike the standard EB-2, NIW petitioners can bypass the labor certification (PERM) and choose to self-petition.</span>
            </div>

            <div className="mt-10">
              <h3 className="text-lg font-semibold mb-5" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: t.brown }}>
                The EB-2 NIW has the following advantages:
              </h3>
              <div className="space-y-4">
                {[
                  { title: "Self-Petitioning", desc: "No employer sponsorship required. File your own petition." },
                  { title: "Labor Certification Waiver", desc: "Skip the Department of Labor process and timeline." },
                  { title: "Flexible Evidence Standards", desc: "With no set eligibility requirements, qualified individuals can submit a diverse portfolio of academic, professional, and industry endorsements." },
                  { title: "Pathway to a Green Card", desc: "The EB-2 NIW leads directly to a green card, allowing you to reside permanently in the U.S." },
                  { title: "Dependents Allowed", desc: "Include your spouse and unmarried children under the age of 21 in your petition." },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <GoldCheck />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: t.brown }}>{item.title}</p>
                      <p className="text-sm" style={{ color: t.brownMid }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right image */}
          <div className="lg:w-[380px] flex-shrink-0 relative">
            <div className="absolute top-4 right-0 w-5/6 h-5/6 rounded-2xl -z-10" style={{ background: t.cream2 }} />
            <img src="/eb2-green-card.png" alt="Green Card holder" className="w-full max-w-sm rounded-2xl object-cover shadow-sm" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ELIGIBILITY CRITERIA
      ══════════════════════════════════════════════ */}
      <section className="px-6 md:px-16 lg:px-24 py-12 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: t.brown }}>
          Eligibility Criteria
        </h2>

        {/* Part A */}
        <p className="mb-6" style={{ color: t.brown }}>
          <span className="text-4xl font-bold mr-2 leading-none" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: t.gold }}>A.</span>
          To qualify for the EB-2 NIW, all applicants must first meet the eligibility requirements of an EB-2 visa.
        </p>

        <div className="rounded-xl p-6 md:p-8 flex flex-col lg:flex-row gap-8" style={{ border: `1px solid ${t.cream3}`, background: t.white }}>
          {/* Image */}
          <div className="lg:w-[260px] flex-shrink-0 relative">
            <div className="absolute top-4 left-0 w-5/6 h-full rounded-2xl -z-10" style={{ background: t.cream2 }} />
            <img src="/eb2-graduation.png" alt="Graduate" className="relative z-10 w-full rounded-2xl object-cover shadow-sm" />
          </div>

          {/* Criteria text */}
          <div className="flex-1">
            <p className="text-xs font-medium uppercase tracking-wide mb-4" style={{ color: t.brownLight }}>
              Must meet at least one of the following criteria
            </p>

            <h4 className="text-base font-semibold mb-2" style={{ color: t.brown }}>Advanced Degree</h4>
            <p className="text-sm mb-3" style={{ color: t.brownLight }}>Candidate must meet the following requirements:</p>
            <div className="space-y-0">
              <div className="flex items-start gap-3">
                <StepBadge n={1} />
                <p className="text-sm" style={{ color: t.brown }}>
                  Hold an advanced U.S. <strong>master&apos;s (or higher)</strong> or foreign equivalent.
                  Alternatively, a bachelor&apos;s degree + 5 years of experience is needed.
                </p>
              </div>
              <DottedConnector />
              <div className="flex items-start gap-3">
                <StepBadge n={2} />
                <p className="text-sm" style={{ color: t.brown }}>
                  Will be employed in a professional capacity that typically requires a bachelor&apos;s degree or higher.
                </p>
              </div>
            </div>

            <h4 className="text-base font-semibold mt-6 mb-2" style={{ color: t.brown }}>Exceptional Ability</h4>
            <p className="text-sm mb-3" style={{ color: t.brownLight }}>
              Candidate must meet <strong>at least three</strong> of the following criteria:
            </p>
            <div className="space-y-0">
              {[
                { n: 1, text: <><strong>Academic Records</strong>, Degree, or Diploma in your area of Exceptional Ability</> },
                { n: 2, text: <><strong>Experience Letters</strong> showing ten years of full-time experience</> },
                { n: 3, text: <>A <strong>license</strong> to practice your profession</> },
                { n: 4, text: <><strong>High Salary</strong> proving above-market remuneration</> },
                { n: 5, text: <><strong>Membership</strong> in professional associations</> },
                { n: 6, text: <><strong>Industry Recognition</strong> by peers or organizations</> },
              ].map((item, idx, arr) => (
                <div key={item.n}>
                  <div className="flex items-start gap-3">
                    <StepBadge n={item.n} />
                    <p className="text-sm" style={{ color: t.brown }}>{item.text}</p>
                  </div>
                  {idx < arr.length - 1 && <DottedConnector />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Part B */}
        <p className="mt-10 mb-6" style={{ color: t.brown }}>
          <span className="text-4xl font-bold mr-2 leading-none" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: t.gold }}>B.</span>
          Once the EB-2 criteria are met, <strong>you must meet the NIW Three-Prong Test.</strong>
        </p>

        <div className="rounded-xl p-6 md:p-8 flex flex-col lg:flex-row gap-8" style={{ border: `1px solid ${t.cream3}`, background: t.white }}>
          <div className="flex-1">
            {[
              {
                title: "Substantial Merit & National Importance",
                steps: [
                  "Define your specific endeavor and its broader implications for the U.S. (e.g., public health, technology, economic growth).",
                  "Show how your work extends beyond a single employer.",
                ],
              },
              {
                title: "Well-Positioned to Advance the Endeavor",
                steps: [
                  "Highlight your education, skills, track record, and any detailed plans or proposals.",
                  "Include evidence of support from stakeholders, investors, or industry experts.",
                ],
              },
              {
                title: "Benefit to the U.S. of Waiving Labor Certification",
                steps: [
                  "Explain the benefits of the NIW exceed the value of labor certification (e.g., Government Targets, Entrepreneurial Nature).",
                  "Demonstrate potential for job creation, economic revitalization, or urgent national need.",
                ],
              },
            ].map((prong) => (
              <div key={prong.title} className="mb-6">
                <h4 className="text-base font-semibold mb-3" style={{ color: t.brown }}>{prong.title}</h4>
                <div className="space-y-0">
                  {prong.steps.map((step, idx) => (
                    <div key={idx}>
                      <div className="flex items-start gap-3">
                        <StepBadge n={idx + 1} />
                        <p className="text-sm" style={{ color: t.brown }}>{step}</p>
                      </div>
                      {idx < prong.steps.length - 1 && <DottedConnector />}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:w-[300px] flex-shrink-0 relative">
            <div className="absolute top-4 right-0 w-5/6 h-full rounded-2xl -z-10" style={{ background: t.cream2 }} />
            <img src="/eb2-thinking.png" alt="Professional thinking" className="relative z-10 w-full rounded-2xl object-cover shadow-sm" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          WHY CHOOSE US
      ══════════════════════════════════════════════ */}
      <section className="px-6 md:px-16 lg:px-24 py-14 max-w-6xl mx-auto">
        <SectionHeading>Why Choose Global Counsellor Centre For Your EB-2 NIW Application?</SectionHeading>
        <p className="text-center text-sm -mt-6 mb-12" style={{ color: t.brownLight }}>
          Our services in the end-to-end application for the EB-2 NIW are unlike any other firm&apos;s.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: t.gold }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: "Free Eligibility Check",
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: t.gold }}>
                  <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="1.5" />
                  <path strokeLinecap="round" strokeWidth={1.5} d="M8 10h8M8 14h5" />
                </svg>
              ),
              title: "Build Your Profile",
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: t.gold }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7l3-7z" />
                </svg>
              ),
              title: "Success Rates Over 95%",
            },
          ].map((item) => (
            <div key={item.title} className="flex flex-col gap-3">
              {item.icon}
              <p className="font-semibold" style={{ color: t.brown }}>{item.title}</p>
              <Link href="#" className="text-sm hover:underline" style={{ color: t.gold }}>
                Learn more →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TIMELINE
      ══════════════════════════════════════════════ */}
      <section className="px-6 md:px-16 lg:px-24 py-14" style={{ background: t.cream2 }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeading>Timeline</SectionHeading>
          <p className="text-center text-sm -mt-6 mb-12" style={{ color: t.brownLight }}>
            Here&apos;s how long it takes to get the EB-2 NIW visa.
          </p>

          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Left image */}
            <div className="lg:w-[380px] flex-shrink-0 sticky top-10">
              <img src="/timeline.png" alt="EB-2 NIW Timeline" className="w-full rounded-2xl object-cover shadow-sm" style={{ maxHeight: "400px" }} />
            </div>

            {/* Right timeline */}
            <div className="flex-1 relative">
              <div className="absolute left-3.5 top-0 bottom-0 w-0.5" style={{ background: t.cream3 }} />

              <div className="space-y-0">
                {timelineSteps.map((step) => (
                  <div key={step.step} className="relative">
                    {/* Step dot */}
                    <div
                      className="absolute left-0 top-3 w-7 h-7 flex items-center justify-center text-xs font-bold z-10 cursor-pointer transition-colors"
                      style={{
                        borderRadius: "2px",
                        border: `2px solid ${activeStep === step.step ? t.gold : t.cream3}`,
                        background: activeStep === step.step ? t.gold : t.white,
                        color: activeStep === step.step ? t.brown : t.brownLight,
                      }}
                      onClick={() => setActiveStep(step.step)}
                    />

                    {/* Step label */}
                    <div className="ml-14 mb-3">
                      <span
                        className="inline-block text-xs font-semibold px-3 py-1"
                        style={{ border: `1.5px solid ${t.gold}`, color: t.brownMid, background: t.white, borderRadius: "2px" }}
                      >
                        Step {step.step}
                      </span>
                    </div>

                    {/* Step card */}
                    <div
                      className="ml-14 mb-10 rounded-xl p-5 transition-colors"
                      style={{
                        background: activeStep === step.step ? t.brown : t.white,
                        border: `1px solid ${activeStep === step.step ? t.brown : t.cream3}`,
                      }}
                    >
                      <div className="mb-3" style={{ color: activeStep === step.step ? t.goldLight : t.brownLight }}>
                        {step.icon}
                      </div>
                      <h4
                        className="text-base font-semibold mb-1"
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          color: activeStep === step.step ? t.goldLight : t.brown,
                        }}
                      >
                        {step.title}
                      </h4>
                      {step.description && (
                        <p className="text-sm" style={{ color: activeStep === step.step ? "#C4AE8E" : t.brownMid }}>
                          {step.description}
                        </p>
                      )}
                      <div style={{ color: activeStep === step.step ? "#C4AE8E" : t.brownLight }}>
                        {step.duration}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SUCCESS RATE & PATHWAYS
      ══════════════════════════════════════════════ */}
      <section className="px-6 md:px-16 lg:px-24 py-14 max-w-6xl mx-auto">
        <SectionHeading>Success Rate &amp; Pathways</SectionHeading>
        <p className="text-center text-sm -mt-6 mb-12" style={{ color: t.brownLight }}>
          Understand what you need on your profile to get approved.
        </p>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left – success rate */}
          <div className="flex-1 rounded-2xl p-6 text-white" style={{ background: t.brown }}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-semibold" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: t.goldLight }}>
                EB-2 Visa Success Rate
              </h3>
              <span className="text-2xl">🇺🇸</span>
            </div>
            <p className="text-xs mb-6" style={{ color: "#9C8A76" }}>Based on petition outputs of our clients (2025)</p>

            <div className="space-y-4">
              {successRates.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-xs w-24 flex-shrink-0" style={{ color: "#C4AE8E" }}>{item.label}</span>
                  <div className="flex-1 rounded-full h-5 overflow-hidden" style={{ background: "#2A1E14" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${item.percent}%`, background: `linear-gradient(to right, ${t.gold}, ${t.goldLight})` }}
                    />
                  </div>
                  <span className="text-sm font-bold w-8 text-right" style={{ color: t.goldLight }}>{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right – other pathways */}
          <div className="flex-1 rounded-2xl p-6" style={{ border: `1px solid ${t.cream3}`, background: t.white }}>
            <h3 className="text-base font-semibold mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: t.brown }}>
              Other Pathways for working overseas
            </h3>
            <div className="w-12 h-0.5 mb-5" style={{ background: t.gold }} />
            <div className="divide-y" style={{ borderColor: t.cream3 }}>
              {otherPathways.map((p) => (
                <div key={p.title} className="flex items-center gap-4 py-4 cursor-pointer group transition-colors hover:opacity-80">
                  <span className="text-2xl flex-shrink-0">{p.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: t.brown }}>{p.title}</p>
                    <p className="text-xs" style={{ color: t.brownLight }}>{p.subtitle}</p>
                  </div>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: t.brownLight }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          THE HELP YOU NEED
      ══════════════════════════════════════════════ */}
      <section className="py-16 px-6 md:px-16 lg:px-24" style={{ background: t.brown }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: t.goldLight }}>
              The Help <span className="italic">YOU</span> Need
            </h2>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-20" style={{ background: t.gold }} />
              <div className="w-2 h-2 rotate-45 flex-shrink-0" style={{ background: t.gold }} />
              <div className="h-px w-20" style={{ background: t.gold }} />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 text-center md:text-left">
              <p className="text-lg leading-relaxed" style={{ color: "#C4AE8E" }}>
                Understand what&apos;s in the service<br />after your purchase.
              </p>
            </div>

            <div className="flex-1 w-full max-w-xl rounded-xl overflow-hidden shadow-lg">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full rounded-xl"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Why is EB2 NIW Rejected?"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════ */}
      <section className="px-6 md:px-16 lg:px-24 py-16 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: t.brown }}>
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-lg overflow-hidden transition-shadow hover:shadow-sm"
                style={{ border: `1px solid ${t.cream3}`, background: t.white }}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                >
                  <span className="text-sm font-semibold leading-snug" style={{ color: t.brown }}>{faq.q}</span>
                  <span
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center font-bold text-lg"
                    style={{ background: t.gold, color: t.brown, borderRadius: "2px" }}
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 text-sm leading-relaxed pt-3" style={{ borderTop: `1px solid ${t.cream3}`, color: t.brownMid }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}