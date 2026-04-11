"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Do you only help for applications to the US? What about other countries?",
    answer:
      "We support applications to most countries including but not limited to USA, Canada, Germany, Ireland, UK, Australia, India, and Singapore.",
  },
  {
    question: "Does the price include GST/Taxes?",
    answer:
      "The displayed price is exclusive of GST/Taxes. Applicable taxes will be added at checkout based on your location.",
  },
  {
    question:
      "Since the services are offered online, how do we ensure the process will be as smooth as an offline consulting service?",
    answer:
      "Our team is available via video call, audio call, and text support throughout the process. We provide dedicated support whenever you need it, ensuring the same quality as an in-person consultation.",
  },
  {
    question: "What is the best time for me to enroll in the services?",
    answer:
      "The best time to enroll is as early as possible. Starting early gives us more time to optimise your profile, improve your CRS score, and explore all available options including PNP schemes.",
  },
  {
    question: "Are the timelines mentioned on the website followed religiously?",
    answer:
      "We aim to follow the timelines as closely as possible. However, timelines can vary based on government processing times and individual profile complexity. We keep you updated at every step.",
  },
];

const features = [
  "Best program selection out of FSWP, FSTP, and CEC for your profile.",
  "CRS score calculation and improvement advise.",
  "Finding jobs that simply fit from dozens of platforms and referrals.",
  "Backing up your chances using PNP schemes.",
  "Customised planning based on your profile.",
  "Building customised ATS-friendly resume for each application.",
  "Cover letters (customised) for each job application.",
  "Exact step-by-step guidance and form filing for your applications.",
  "Attempt to shorten the timeline and get the PR processed as soon as possible.",
  "If you need, help with applying to job offers in Canada is also included.",
  "Dedicated support, whenever you need.",
];

export default function ExpressEntryPNP() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [currency, setCurrency] = useState("INR");

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: "#f5f0e8" }}>

      {/* ── Hero ── */}
      <section className="px-6 py-12 md:px-16 lg:px-24" style={{ background: "#f5f0e8" }}>
        <div className="max-w-7xl mx-auto">

          {/* Back link */}
          <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "#999" }}>
            ← Back to services
          </p>

          {/* Badge */}
          <div className="inline-block mb-7">
            <span
              className="text-xs uppercase tracking-widest px-4 py-1.5 rounded-full"
              style={{ border: "1px solid #c8b87a", color: "#8a6f2e" }}
            >
              Express Entry / PNP
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-10">
            {/* Left */}
            <div className="flex-1">
              <h1
                className="text-5xl md:text-6xl leading-tight mb-6"
                style={{ fontFamily: "Georgia, serif", fontWeight: 400, color: "#1a1a1a" }}
              >
                Canada Permanent
                <br />
                <span style={{ color: "#b8952a", fontStyle: "italic" }}>
                  Residence Help
                </span>
              </h1>

              {/* Quote */}
              <p
                className="text-sm leading-relaxed max-w-xl mb-8"
                style={{
                  fontFamily: "Georgia, serif",
                  fontStyle: "italic",
                  color: "#555",
                  borderLeft: "3px solid #c8b87a",
                  paddingLeft: "16px",
                }}
              >
                &quot;The Canadian dream is achievable. We architect your path to PR, guiding
                hundreds of applicants through a process that demands precision.&quot;
              </p>

              {/* Support icons */}
              <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#999" }}>
                Includes
              </p>
              <div className="flex gap-8 mb-8">
                {[
                  {
                    label: "Video call",
                    icon: (
                      <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z" />
                    ),
                  },
                  {
                    label: "Audio call",
                    icon: (
                      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01L6.62 10.79z" />
                    ),
                  },
                  {
                    label: "Text support",
                    icon: (
                      <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2zm0 14H6l-2 2V4h16v12z" />
                    ),
                  },
                ].map(({ label, icon }) => (
                  <div key={label} className="flex flex-col items-center gap-2">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center"
                      style={{ background: "#1a1a1a" }}
                    >
                      <svg className="w-5 h-5 text-white" fill="white" viewBox="0 0 24 24">
                        {icon}
                      </svg>
                    </div>
                    <span className="text-xs" style={{ color: "#666" }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  className="text-sm font-medium px-6 py-2.5 rounded transition-colors"
                  style={{
                    border: "1.5px solid #b8952a",
                    background: "transparent",
                    color: "#1a1a1a",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#b8952a";
                    (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color = "#1a1a1a";
                  }}
                >
                  Discuss your case
                </button>
                <span className="text-xs" style={{ color: "#888" }}>
                  Have questions about this service? Let&apos;s chat.
                </span>
              </div>
            </div>

            {/* Right illustration */}
            <div className="flex-shrink-0">
              <img
                src="/Express-Entry.jpg"
                alt="Express Entry"
                className="w-80 h-auto object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── About + Pricing ── */}
      <section className="px-6 py-14 md:px-16 lg:px-24" style={{ background: "#faf7f0" }}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-14">

          {/* About */}
          <div className="flex-1">
            <h2
              className="text-2xl mb-5"
              style={{ fontFamily: "Georgia, serif", fontWeight: 400, color: "#1a1a1a" }}
            >
              About this service
            </h2>
            <div className="w-12 h-0.5 mb-6" style={{ background: "#b8952a" }} />

            <p className="text-sm leading-relaxed mb-5" style={{ color: "#555" }}>
              Whether you already have an employment offer, a stable job in Canada, or none of these,
              the Canadian dream is achievable. Work with Canada visa experts directly who have
              successfully guided over 500 applicants to get into Canada collectively. The Canadian
              Express Entry process can be complex and prone to mistakes — hence we ensure no errors
              are made during this cumbersome process.
            </p>

            <p className="text-sm font-medium mb-4" style={{ color: "#1a1a1a" }}>
              Apply for the Express Entry and Provincial Nominee Program (PNP) programs.
            </p>

            <p className="text-sm leading-relaxed mb-5" style={{ color: "#555" }}>
              We support the{" "}
              <strong>Federal Skilled Worker Program (FSWP)</strong>,{" "}
              <strong>Federal Skilled Trades Program (FSTP)</strong>, and{" "}
              <strong>Canadian Experience Class (CEC)</strong> under Express Entry, as well as{" "}
              <strong>PNP schemes</strong>.
            </p>

            <p className="text-sm font-medium mb-4" style={{ color: "#1a1a1a" }}>
              What&apos;s included:
            </p>

            <ul className="space-y-2 mb-8">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "#555" }}>
                  <span className="mt-0.5 font-bold" style={{ color: "#b8952a" }}>›</span>
                  {feature}
                </li>
              ))}
            </ul>

            <p className="text-sm leading-relaxed" style={{ color: "#555" }}>
              Interested in filing your Canadian PR application? We look forward to working with you
              and changing your life. Start by making a purchase and we&apos;ll get in touch for the
              next steps.
            </p>
          </div>

          {/* Pricing + Discuss */}
          <div className="lg:w-80 flex flex-col gap-5">

            {/* Pricing card */}
            <div
              className="rounded-xl p-6"
              style={{ background: "#fff", border: "1px solid #e0d5be" }}
            >
              <h3
                className="text-lg mb-5"
                style={{ fontFamily: "Georgia, serif", fontWeight: 400, color: "#1a1a1a" }}
              >
                Start now
              </h3>

              <div className="space-y-3 mb-6">
                {[
                  { label: "Service", value: "Express Entry Application" },
                  { label: "Duration", value: "2–4 months" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span style={{ color: "#888" }}>{label}</span>
                    <span style={{ color: "#1a1a1a" }}>{value}</span>
                  </div>
                ))}

                <div className="flex justify-between items-center text-sm">
                  <span style={{ color: "#888" }}>Currency</span>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="rounded px-2 py-1 text-sm focus:outline-none"
                    style={{
                      border: "1px solid #d4c9a8",
                      background: "#faf7f0",
                      color: "#555",
                    }}
                  >
                  <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="USD">United States (USD)</option>
                    <option value="CAD">Canada (CAD)</option>
                    <option value="GBP">United Kingdom (GBP)</option>
                    <option value="EUR">Europe (EUR)</option>
                    <option value="AUD">Australia (AUD)</option>
                  </select>
                </div>

                <div className="flex justify-between text-sm">
                  <span style={{ color: "#888" }}>Actual amount</span>
                  <span style={{ color: "#bbb", textDecoration: "line-through" }}>
                    {currency === "INR" ? "INR 4,05,589.00" : "USD 4,867.00"}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span style={{ color: "#888" }}>Amount</span>
                  <span className="text-base font-medium" style={{ color: "#b8952a" }}>
                    {currency === "INR" ? "INR 3,24,470.95" : "USD 3,893.60"}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span style={{ color: "#888" }}>You save</span>
                  <div className="flex items-center gap-2">
                    <span style={{ color: "#555" }}>
                      {currency === "INR" ? "INR 81,118.05" : "USD 973.40"}
                    </span>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded"
                      style={{ background: "#b8952a", color: "#fff" }}
                    >
                      20% off
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  className="flex-1 text-sm font-medium py-2.5 rounded-lg transition-colors"
                  style={{ border: "1.5px solid #b8952a", background: "transparent", color: "#1a1a1a" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.background = "#faf7f0")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.background = "transparent")
                  }
                >
                  Add to cart
                </button>
                <button
                  className="flex-1 text-sm font-medium py-2.5 rounded-lg transition-colors"
                  style={{ background: "#b8952a", color: "#fff", border: "none" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.background = "#9e7d22")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.background = "#b8952a")
                  }
                >
                  Buy now
                </button>
              </div>
            </div>

            {/* Discuss card */}
            <div
              className="rounded-xl p-5 flex items-center gap-4"
              style={{ background: "#fff", border: "1px solid #e0d5be" }}
            >
              <div
                className="w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #d4c9a8, #b8952a)" }}
              >
                <svg className="w-7 h-7" fill="white" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium mb-1" style={{ color: "#1a1a1a" }}>
                  Discuss your case
                </p>

                <p className="text-xs mb-2" style={{ color: "#888", lineHeight: 1.5 }}>
                  Chat with a team member to see how we can help.
                </p>
                <button className="text-xs" style={{ color: "#b8952a" }}>
                  
                  Message now →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 py-14 md:px-16 lg:px-24" style={{ background: "#f0ebe0" }}>
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-3xl text-center mb-10"
            style={{ fontFamily: "Georgia, serif", fontWeight: 400, color: "#1a1a1a" }}
          >
            Frequently asked questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl overflow-hidden"
                style={{ background: "#fff", border: "1px solid #e0d5be" }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-sm pr-4" style={{ color: "#1a1a1a", lineHeight: 1.5 }}>
                    {faq.question}
                  </span>
                  <span
                    className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-md text-lg font-light"
                    style={{ background: "#b8952a", color: "#fff", lineHeight: 1 }}
                  >
                    {openFaq === index ? "−" : "+"}
                  </span>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5">
                    <p className="text-sm leading-relaxed" style={{ color: "#666" }}>
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}