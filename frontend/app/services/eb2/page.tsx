"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FaqItem {
  question: string;
  answer: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const advantages = [
  {
    title: "Self-Petitioning",
    desc: "No employer sponsorship required. File your own petition.",
  },
  {
    title: "Labor Certification Waiver",
    desc: "Skip the Department of Labor process and timeline.",
  },
  {
    title: "Flexible Evidence Standards",
    desc: "With no set eligibility requirements, qualified individuals can submit a diverse portfolio of academic, professional, and industry endorsements.",
  },
  {
    title: "Pathway to a Green Card",
    desc: "The EB-2 NIW leads directly to a green card, allowing you to reside permanently in the U.S. and eventually apply for citizenship without needing to extend your visa status.",
  },
  {
    title: "Dependents Allowed",
    desc: "Include your spouse and unmarried children under the age of 21 in your petition.",
  },
];

const exceptionalAbilityItems = [
  { label: "Academic Records", desc: ", Degree, or Diploma in your area of Exceptional Ability" },
  { label: "Experience Letters", desc: " showing ten years of full-time experience" },
  { label: "A ", desc: "license", extra: " to practice your profession" },
  { label: "High Salary", desc: " proving above-market remuneration" },
  { label: "Membership", desc: " in professional associations" },
  { label: "Industry Recognition", desc: " Industry Recognition by peers or organizations" },
  { label: "Other ", desc: "comparable evidence", extra: " of eligibility" },
];

const timelineSteps = [
  {
    step: "Step 1",
    title: "Profile Building",
    desc: "Align your qualifications and experience with EB-2 NIW requirements.",
    duration: "Duration - 6 Months",
    active: true,
  },
  {
    step: "Step 2",
    title: "Petitioning",
    desc: "Build an unbreakable petition.",
    duration: "Duration - 1-2 Months",
    active: false,
  },
  {
    step: "Step 3",
    title: "Filing with USCIS",
    desc: "Filing the I-129.",
    duration: "",
    active: true,
  },
  {
    step: "Step 4",
    title: "Form I-140 Processing",
    desc: "",
    duration: "",
    active: false,
    special: true,
  },
];

const successRates = [
  { label: "With 5 Papers", pct: 70 },
  { label: "With 6 Papers", pct: 76 },
  { label: "With 7 Papers", pct: 83 },
  { label: "With 8 Papers", pct: 94 },
];

const otherPathways = [
  { flag: "🇺🇸", title: "United States (O-1 Visa)", sub: "Fast Work Visa, No Lottery & Direct PR Pathway." },
  { flag: "🇬🇧", title: "United Kingdom (Global Talent Visa)", sub: "UK Work Visa Without Employer & PR Pathway." },
  { flag: "🇦🇺", title: "Australia (National Innovation Visa)", sub: "Australia Work Visa & Direct PR (No Employer)." },
  { flag: "🇺🇸", title: "United States (EB-1 Visa)", sub: "Fastest Green Card by Employment." },
  { flag: "🇸🇬", title: "Singapore ONE Pass", sub: "No Employer Needed. Live & Work in Singapore." },
];

const faqs: FaqItem[] = [
  {
    question: "Do you only help for applications to the US? What about other countries?",
    answer: "We support applications to most countries including but not limited to USA, Canada, Germany, Ireland, UK, Australia, India, and Singapore.",
  },
  {
    question: "Does the price include GST/Taxes?",
    answer: "Please contact us directly for pricing details including applicable taxes.",
  },
  {
    question: "Since the services are offered online, how do we ensure the process will be as smooth as an offline consulting service?",
    answer: "Our team uses video, audio, and text support channels to ensure a seamless experience at every step.",
  },
  {
    question: "What is the best time for me to enroll in the services?",
    answer: "The earlier the better — ideally 6-12 months before you plan to file.",
  },
  {
    question: "Are the timelines mentioned on the website followed religiously?",
    answer: "We aim to follow timelines closely but individual cases may vary based on document readiness.",
  },
  {
    question: "Are there any ongoing discount offers?",
    answer: "We periodically run promotions. Check our website or contact us for current offers.",
  },
];

// ─── Components ───────────────────────────────────────────────────────────────


function Hero() {
  return (
    <section className="px-6 md:px-16 py-16 flex flex-col md:flex-row items-center justify-between gap-10"
      style={{ background: "linear-gradient(to bottom, #050505, #0a0a0a, #000000)" }}>
      <div className="flex-1 max-w-xl">
        <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4" style={{ color: "#ffffff" }}>
          APPLY FOR AN EB-2 NIW VISA
        </h1>
        <p className="text-lg mb-6" style={{ color: "#a1a1a1" }}>
          The EB-2 NIW visa is a talent-based immigrant visa in the U.S. for individuals with exceptional ability in their field.
        </p>
        <p className="text-sm mb-4" style={{ color: "#a1a1a1" }}>Includes:</p>
        <div className="flex gap-6 mb-8">
          {[
            { icon: "🎥", label: "Video call" },
            { icon: "📞", label: "Audio call" },
            { icon: "💬", label: "Text Support" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                style={{ backgroundColor: "rgba(198,169,107,0.15)", border: "1px solid rgba(198,169,107,0.3)" }}>
                {item.icon}
              </div>
              <span className="text-xs" style={{ color: "#a1a1a1" }}>{item.label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button className="border-2 font-semibold px-6 py-3 rounded transition-all"
            style={{ borderColor: "#c6a96b", color: "#c6a96b", backgroundColor: "transparent" }}
            onMouseEnter={e => { (e.target as HTMLElement).style.backgroundColor = "#c6a96b"; (e.target as HTMLElement).style.color = "#050505"; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.backgroundColor = "transparent"; (e.target as HTMLElement).style.color = "#c6a96b"; }}>
            Discuss Your Case
          </button>
          <span className="text-sm" style={{ color: "#a1a1a1" }}>Have questions about this service? Let's chat.</span>
        </div>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="relative w-72 h-72 md:w-96 md:h-96">
          <div className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0a0a0a, #1a1a1a)", border: "1px solid rgba(198,169,107,0.2)" }}>
            <div className="absolute inset-0 opacity-30">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: "#c6a96b",
                    top: `${(15 + Math.sin(i * 60 * Math.PI / 180) * 35 + 35).toFixed(2)}%`,
                    left: `${(15 + Math.cos(i * 60 * Math.PI / 180) * 35 + 35).toFixed(2)}%`,
                  }}
                />
              ))}
            </div>
            <span className="text-8xl">🌍</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutService() {
  return (
    <section id="about" className="px-6 md:px-16 py-16" style={{ backgroundColor: "#0a0a0a" }}>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold mb-2" style={{ color: "#ffffff" }}>About Service</h2>
        <div className="flex items-center justify-center gap-2">
          <div className="w-16 h-0.5" style={{ backgroundColor: "#c6a96b" }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#c6a96b" }} />
          <div className="w-16 h-0.5" style={{ backgroundColor: "#c6a96b" }} />
        </div>
      </div>

      {/* What is EB-2 NIW */}
      <div className="max-w-5xl mx-auto mb-16">
        <h3 className="text-2xl font-semibold mb-3" style={{ color: "#ffffff" }}>
          What is the EB-2 National Interest Waiver (NIW) Visa?
        </h3>
        <p className="mb-3 leading-relaxed" style={{ color: "#a1a1a1" }}>
          The EB-2 National Interest Waiver is a category under the employment-based second preference immigration US visa. It is designed for professionals who can prove that their work is in the interest of the United States and is of national importance.
        </p>
        <div className="flex items-start gap-2" style={{ color: "#a1a1a1" }}>
          <span className="mt-1" style={{ color: "#c6a96b" }}>✓</span>
          <p>Unlike the standard EB-2, NIW petitioners can bypass the labor certification (PERM) and choose to self-petition.</p>
        </div>
      </div>

      {/* Advantages */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-start">
        <div className="flex-1">
          <h3 className="text-2xl font-semibold mb-6" style={{ color: "#ffffff" }}>
            The EB-2 NIW has the following advantages:
          </h3>
          <div className="space-y-5">
            {advantages.map((adv) => (
              <div key={adv.title} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: "#c6a96b" }}>
                  <span className="text-xs" style={{ color: "#050505" }}>✓</span>
                </div>
                <div>
                  <span className="font-semibold" style={{ color: "#e5e5e5" }}>{adv.title}</span>
                  <p className="text-sm mt-0.5" style={{ color: "#a1a1a1" }}>{adv.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="relative">
            <div className="absolute -right-4 -bottom-4 w-64 h-80 rounded-2xl" style={{ backgroundColor: "#0d1a22" }} />
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&q=80"
              alt="Professional with green card"
              className="relative z-10 w-64 h-80 object-cover rounded-2xl shadow-lg"
              style={{ border: "1px solid rgba(198,169,107,0.2)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function EligibilityCriteria() {
  return (
    <section id="eligibility" className="px-6 md:px-16 py-16" style={{ backgroundColor: "#050505" }}>
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-2" style={{ color: "#ffffff" }}>Eligibility Criteria</h2>
        <p className="text-lg mb-10" style={{ color: "#a1a1a1" }}>
          <span className="font-bold text-2xl" style={{ color: "#c6a96b" }}>A. </span>
          To qualify for the EB-2 NIW, all applicants must first meet the eligibility requirements of an EB-2 visa.
        </p>

        {/* Criteria box */}
        <div className="rounded-2xl p-8 mb-10" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(198,169,107,0.2)" }}>
          <div className="flex flex-col md:flex-row gap-10">
            {/* Image */}
            <div className="flex justify-center md:justify-start">
              <div className="relative">
                <div className="absolute -left-4 -bottom-4 w-52 h-64 rounded-2xl" style={{ backgroundColor: "#0d1a22" }} />
                <img
                  src="https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&q=80"
                  alt="Graduate"
                  className="relative z-10 w-52 h-64 object-cover rounded-2xl"
                  style={{ border: "1px solid rgba(198,169,107,0.2)" }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-8">
              <div>
                <p className="text-sm mb-3" style={{ color: "#a1a1a1" }}>Must meet at least one of the following criteria</p>
                <h4 className="text-lg font-semibold mb-3" style={{ color: "#e5e5e5" }}>Advanced Degree</h4>
                <p className="text-sm mb-3" style={{ color: "#a1a1a1" }}>Candidate must meet the following requirements:</p>
                <div className="space-y-3">
                  {[
                    <>Hold an advanced U.S. <strong style={{ color: "#c6a96b" }}>master's (or higher)</strong> or foreign equivalent. Alternatively, a bachelor's degree + 5 years of experience is needed.</>,
                    "Will be employed in a professional capacity that typically requires a bachelor's degree or higher",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{ backgroundColor: "rgba(198,169,107,0.15)", border: "1px solid rgba(198,169,107,0.4)", color: "#c6a96b" }}>
                        {i + 1}
                      </div>
                      <p className="text-sm" style={{ color: "#a1a1a1" }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-1" style={{ color: "#e5e5e5" }}>Exceptional Ability</h4>
                <p className="text-sm mb-3" style={{ color: "#a1a1a1" }}>
                  Candidate must meet <strong style={{ color: "#c6a96b" }}>at least three</strong> of the following criteria:
                </p>
                <div className="space-y-2">
                  {[
                    <><strong style={{ color: "#c6a96b" }}>Academic Records</strong>, Degree, or Diploma in your area of Exceptional Ability</>,
                    <><strong style={{ color: "#c6a96b" }}>Experience Letters</strong> showing ten years of full-time experience</>,
                    <>A <strong style={{ color: "#c6a96b" }}>license</strong> to practice your profession</>,
                    <><strong style={{ color: "#c6a96b" }}>High Salary</strong> proving above-market remuneration</>,
                    <><strong style={{ color: "#c6a96b" }}>Membership</strong> in professional associations</>,
                    <><strong style={{ color: "#c6a96b" }}>Industry Recognition</strong> Industry Recognition by peers or organizations</>,
                    <>Other <strong style={{ color: "#c6a96b" }}>comparable evidence</strong> of eligibility</>,
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{ backgroundColor: "rgba(198,169,107,0.15)", border: "1px solid rgba(198,169,107,0.4)", color: "#c6a96b" }}>
                        {i + 1}
                      </div>
                      <p className="text-sm" style={{ color: "#a1a1a1" }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Three-Prong Test */}
        <p className="text-lg mb-6" style={{ color: "#a1a1a1" }}>
          <span className="font-bold text-2xl" style={{ color: "#c6a96b" }}>B. </span>
          Once the EB-2 criteria are met, <strong style={{ color: "#e5e5e5" }}>you must meet the NIW Three-Prong Test.</strong>
        </p>

        <div className="rounded-2xl p-8" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(198,169,107,0.2)" }}>
          <div className="flex flex-col md:flex-row gap-10">
            <div className="flex-1 space-y-8">
              {[
                {
                  title: "Substantial Merit & National Importance",
                  items: [
                    "Define your specific endeavor and its broader implications for the U.S. (e.g., public health, technology, economic growth).",
                    "Show how your work extends beyond a single employer.",
                  ],
                },
                {
                  title: "Well-Positioned to Advance the Endeavor",
                  items: [
                    "Highlight your education, skills, track record, and any detailed plans or proposals.",
                    "Include evidence of support from stakeholders, investors, or industry experts.",
                  ],
                },
                {
                  title: "Benefit to the U.S. of Waiving Labor Certification",
                  items: [
                    "Explain the benefits of the NIW exceed the value of labor certification (e.g., Government Targets, Entrepreneurial Nature).",
                    "Demonstrate potential for job creation, economic revitalization, or urgent national need.",
                  ],
                },
              ].map((section) => (
                <div key={section.title}>
                  <h4 className="font-semibold mb-3" style={{ color: "#c6a96b" }}>{section.title}</h4>
                  <div className="space-y-2">
                    {section.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 text-xs font-bold"
                          style={{ backgroundColor: "rgba(198,169,107,0.15)", border: "1px solid rgba(198,169,107,0.4)", color: "#c6a96b" }}>
                          {i + 1}
                        </div>
                        <p className="text-sm" style={{ color: "#a1a1a1" }}>{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex-1 flex justify-center items-start">
              <div className="relative">
                <div className="absolute -right-4 -bottom-4 w-56 h-72 rounded-2xl" style={{ backgroundColor: "#0d1a22" }} />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
                  alt="Professional working"
                  className="relative z-10 w-56 h-72 object-cover rounded-2xl shadow-md"
                  style={{ border: "1px solid rgba(198,169,107,0.2)" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  return (
    <section className="px-6 md:px-16 py-16" style={{ backgroundColor: "#0a0a0a" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-2" style={{ color: "#ffffff" }}>
            Why Choose Global Counselling Center For Your EB-2 NIW Application?
          </h2>
          <p style={{ color: "#a1a1a1" }}>Our services in the end-to-end application for the EB-2 NIW are unlike any other firm's.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {[
            { icon: "🎓", title: "Free Eligibility Check" },
            { icon: "🪪", title: "Build Your Profile" },
            { icon: "💎", title: "Success Rates Over 95%" },
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                style={{ border: "1px solid rgba(198,169,107,0.3)", backgroundColor: "rgba(198,169,107,0.08)" }}>
                {item.icon}
              </div>
              <h3 className="font-semibold" style={{ color: "#e5e5e5" }}>{item.title}</h3>
              <a href="#" className="text-sm hover:underline" style={{ color: "#c6a96b" }}>Learn more →</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Timeline() {
  return (
    <section id="timeline" className="px-6 md:px-16 py-16" style={{ backgroundColor: "#050505" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-1" style={{ color: "#ffffff" }}>Timeline</h2>
          <p style={{ color: "#a1a1a1" }}>Here's how long it takes to get the EB-2 NIW visa.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* Image column */}
          <div className="flex-1 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=500&q=80"
              alt="Office desk"
              className="w-72 h-80 object-cover rounded-2xl shadow-md"
              style={{ border: "1px solid rgba(198,169,107,0.2)" }}
            />
          </div>

          {/* Steps */}
          <div className="flex-1 relative">
            <div className="absolute left-3 top-0 bottom-0 w-0.5" style={{ backgroundColor: "rgba(198,169,107,0.2)" }} />
            <div className="space-y-6">
              {timelineSteps.map((step, i) => (
                <div key={i} className="flex gap-5 items-start">
                  <div className={`relative z-10 w-6 h-6 rounded-full border-2 flex-shrink-0 mt-1`}
                    style={step.active
                      ? { backgroundColor: "#c6a96b", borderColor: "#c6a96b" }
                      : { backgroundColor: "#0a0a0a", borderColor: "rgba(198,169,107,0.3)" }
                    }
                  />
                  <div className="flex-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded"
                      style={{ backgroundColor: "rgba(198,169,107,0.15)", color: "#c6a96b" }}>
                      {step.step}
                    </span>
                    <div className="mt-2 p-4 rounded-xl"
                      style={step.active
                        ? { backgroundColor: "#0d1a22", border: "1px solid rgba(198,169,107,0.3)" }
                        : { backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.05)" }
                      }>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">📋</span>
                        <h4 className="font-semibold" style={{ color: step.active ? "#c6a96b" : "#e5e5e5" }}>
                          {step.title}
                        </h4>
                      </div>
                      {step.desc && (
                        <p className="text-sm" style={{ color: "#a1a1a1" }}>{step.desc}</p>
                      )}
                      {step.duration && (
                        <p className="text-xs mt-2" style={{ color: "#a1a1a1" }}>
                          ⏱ {step.duration}
                        </p>
                      )}
                      {step.special && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs" style={{ color: "#a1a1a1" }}>⏱ Duration</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 rounded font-semibold"
                              style={{ backgroundColor: "#c6a96b", color: "#050505" }}>Premium</span>
                            <span className="text-sm" style={{ color: "#a1a1a1" }}>45 Calendar Days</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 rounded font-semibold"
                              style={{ backgroundColor: "#1a2a35", color: "#c6a96b", border: "1px solid rgba(198,169,107,0.3)" }}>Standard</span>
                            <span className="text-sm" style={{ color: "#a1a1a1" }}>4-8 Months</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SuccessRate() {
  return (
    <section className="px-6 md:px-16 py-16" style={{ backgroundColor: "#0a0a0a" }}>
      <div className="max-w-5xl mx-auto">
        {/* CTA Banner */}
        <div className="rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-16"
          style={{ backgroundColor: "#0d1a22", border: "1px solid rgba(198,169,107,0.3)" }}>
          <div>
            <h3 className="text-2xl font-bold mb-1" style={{ color: "#ffffff" }}>Your Free EB-2 NIW Visa Guide is Waiting!</h3>
            <p style={{ color: "#a1a1a1" }}>Planning to apply for an EB-2 visa?</p>
          </div>
          <div className="flex items-center gap-6">
            <button className="border-2 font-semibold px-6 py-3 rounded transition-all text-sm"
              style={{ borderColor: "#c6a96b", color: "#c6a96b", backgroundColor: "transparent" }}>
              SIGN UP
            </button>
            <div className="hidden md:block w-24 h-24 rounded-full overflow-hidden"
              style={{ border: "2px solid rgba(198,169,107,0.3)" }}>
              <img
                src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&q=80"
                alt="Guide"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Success Rate & Pathways */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold mb-1" style={{ color: "#ffffff" }}>Success Rate & Pathways</h2>
          <p style={{ color: "#a1a1a1" }}>Understand what you need on your profile to get approved.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Success rate chart */}
          <div className="rounded-2xl p-8" style={{ backgroundColor: "#050505", border: "1px solid rgba(198,169,107,0.2)" }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg" style={{ color: "#ffffff" }}>EB-2 Visa Success Rate</h3>
              <span className="text-2xl">🇺🇸</span>
            </div>
            <p className="text-sm mb-6" style={{ color: "#a1a1a1" }}>Based on petition outputs of our clients (2025)</p>
            <div className="space-y-4">
              {successRates.map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <span className="text-sm w-28" style={{ color: "#a1a1a1" }}>{item.label}</span>
                  <div className="flex-1 rounded-full h-8 overflow-hidden"
                    style={{ backgroundColor: "rgba(198,169,107,0.1)" }}>
                    <div
                      className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-700"
                      style={{ width: `${item.pct}%`, backgroundColor: "#c6a96b" }}
                    />
                  </div>
                  <span className="font-semibold w-10 text-right" style={{ color: "#d4af37" }}>{item.pct}%</span>
                </div>
              ))}
            </div>
            <p className="text-sm mt-6 text-center" style={{ color: "#c6a96b" }}>
              Average 20-30 citations per paper (Total 150 to 250 citations)
            </p>
          </div>

          {/* Other pathways */}
          <div className="rounded-2xl p-8" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(198,169,107,0.2)" }}>
            <h3 className="font-semibold mb-1" style={{ color: "#e5e5e5" }}>Other Pathways for working overseas</h3>
            <div className="w-16 h-0.5 mb-5" style={{ backgroundColor: "#c6a96b" }} />
            <div className="space-y-4">
              {otherPathways.map((p) => (
                <div key={p.title} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.flag}</span>
                    <div>
                      <p className="font-medium text-sm" style={{ color: "#e5e5e5" }}>{p.title}</p>
                      <p className="text-xs" style={{ color: "#a1a1a1" }}>{p.sub}</p>
                    </div>
                  </div>
                  <span className="transition-colors" style={{ color: "#c6a96b" }}>↗</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HelpSection() {
  return (
    <section className="px-6 md:px-16 py-16" style={{ backgroundColor: "#0d1a22" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold mb-2" style={{ color: "#ffffff" }}>The Help YOU Need</h2>
          <div className="flex items-center justify-center gap-2">
            <div className="w-16 h-0.5" style={{ backgroundColor: "#c6a96b" }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#c6a96b" }} />
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <p className="text-xl leading-relaxed" style={{ color: "#e5e5e5" }}>
              Understand what's in the service<br />after your purchase.
            </p>
          </div>
          <div className="flex-1">
            <div className="rounded-2xl overflow-hidden aspect-video flex items-center justify-center relative"
              style={{ backgroundColor: "#000000", border: "1px solid rgba(198,169,107,0.2)" }}>
              <img
                src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80"
                alt="Video thumbnail"
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                  style={{ backgroundColor: "#c6a96b" }}>
                  <span className="text-2xl ml-1" style={{ color: "#050505" }}>▶</span>
                </div>
              </div>
              <div className="absolute top-3 left-3 text-xs px-2 py-1 rounded"
                style={{ backgroundColor: "rgba(0,0,0,0.7)", color: "#e5e5e5" }}>
                Why is EB2 NIW Rejected? — Yash Mittra - Global Counselling Center
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section id="faq" className="px-6 md:px-16 py-16" style={{ backgroundColor: "#050505" }}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-semibold text-center mb-10" style={{ color: "#ffffff" }}>
          Frequently Asked Questions!
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden"
              style={{ border: "1px solid rgba(198,169,107,0.2)", backgroundColor: "#0a0a0a" }}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors"
                style={{ backgroundColor: "transparent" }}
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
              >
                <span className="font-medium pr-4" style={{ color: "#e5e5e5" }}>{faq.question}</span>
                <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-lg font-bold"
                  style={{ backgroundColor: "#c6a96b", color: "#050505" }}>
                  {openIndex === i ? "−" : "+"}
                </div>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-4 text-sm leading-relaxed pt-3"
                  style={{ color: "#a1a1a1", borderTop: "1px solid rgba(198,169,107,0.1)" }}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BottomCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 px-6 py-3 flex items-center justify-between z-40 shadow-lg"
      style={{ backgroundColor: "#050505", borderTop: "1px solid rgba(198,169,107,0.2)" }}>
      <p className="text-sm" style={{ color: "#a1a1a1" }}>
        Get a free eligibility check. See if you're eligible for the EB-2 NIW Visa.
      </p>
      <div className="flex items-center gap-3">
        <button className="text-sm rounded px-4 py-2 transition-colors border"
          style={{ borderColor: "rgba(198,169,107,0.4)", color: "#c6a96b", backgroundColor: "transparent" }}>
          Free Cheat Sheet
        </button>
        <button className="text-sm rounded px-4 py-2 transition-colors font-semibold"
          style={{ backgroundColor: "#c6a96b", color: "#050505" }}>
          Check Eligibility
        </button>
      </div>
    </div>
  );
}


// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EB2NIWPage() {
  return (
    <main className="min-h-screen font-sans">
      <Hero />
      <AboutService />
      <EligibilityCriteria />
      <WhyChooseUs />
      <Timeline />
      <SuccessRate />
      <HelpSection />
      <FAQ />
      <BottomCTA />
    </main>
  );
}