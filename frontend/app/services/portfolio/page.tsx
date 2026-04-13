"use client";

import { useState } from "react";

const features = [
  "Get your personalized website with a design that suits your profile.",
  <>Suggestions for the best domain name as per your scenario such as <strong style={{ color: "#1a1a1a" }}>yourname.com</strong>.</>,
  "An account with an AWS EC2 instance, fully managed for you.",
  "Industry grade expert content management and advising for your portfolio.",
  "Short timelines and quick support.",
  "The right way to showcase your profile to both universities and employers with expert counsellors and developers working together on your portfolio.",
  "No cheap frontend-only web applications. With a server, you will be able to provide advanced services, manage a database to collect visitor information, and contact users via emails/SMS.",
];

export default function PortfolioBuildingPage() {
  const [currency, setCurrency] = useState("INR");

  return (
    <div className="min-h-screen font-sans" style={{ background: "#f5f0e8" }}>

      {/* ── Hero ── */}
      <section className="px-6 py-12 md:px-16 lg:px-24" style={{ background: "#f5f0e8" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">

          {/* Left */}
          <div className="flex-1">

            {/* Back link */}
            <div className="flex items-center gap-2 mb-5">
              <svg className="w-3.5 h-3.5" style={{ color: "#999" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-xs tracking-widest uppercase" style={{ color: "#999" }}>Back to services</span>
            </div>

            {/* Badge */}
            <div className="inline-block mb-7">
              <span
                className="text-xs tracking-widest uppercase px-4 py-1.5 rounded-full"
                style={{ border: "1px solid #c8b87a", color: "#8a6f2e" }}
              >
                Professional Identity Forge
              </span>
            </div>

            {/* Title */}
            <h1
              className="leading-tight mb-6"
              style={{
                fontFamily: "Georgia, serif",
                fontWeight: 400,
                fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                color: "#1a1a1a",
              }}
            >
              Portfolio Building &amp;<br />
              <span style={{ color: "#b8952a", fontStyle: "italic" }}>Management</span>
            </h1>

            {/* Quote */}
            <p
              className="text-sm md:text-base leading-relaxed mb-10 max-w-xl"
              style={{
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                color: "#555",
                borderLeft: "3px solid #c8b87a",
                paddingLeft: "16px",
              }}
            >
              &ldquo;Highlight the best parts of your profile and shine to employers,
              universities, and clients worldwide with an online portfolio,
              managed for you all year round.&rdquo;
            </p>

            {/* Support icons */}
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "#999" }}>Includes</p>
            <div className="flex gap-8 mb-10">
              {[
                {
                  label: "Audio call",
                  icon: <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01L6.62 10.79z" />,
                },
                {
                  label: "Text Support",
                  icon: <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2zm0 14H6l-2 2V4h16v12z" />,
                },
              ].map(({ label, icon }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center"
                    style={{ background: "#1a1a1a" }}
                  >
                    <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">{icon}</svg>
                  </div>
                  <span className="text-xs" style={{ color: "#666" }}>{label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-4 flex-wrap">
              <button
                className="text-sm font-medium px-6 py-2.5 rounded transition-colors"
                style={{ border: "1.5px solid #b8952a", background: "transparent", color: "#1a1a1a" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#b8952a";
                  (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "#1a1a1a";
                }}
              >
                Discuss Your Case
              </button>
              <span className="text-xs" style={{ color: "#999" }}>
                Have questions about this service? Let&apos;s chat.
              </span>
            </div>
          </div>

          {/* Right illustration */}
         <div className="flex-shrink-0">
  <img 
    src="/Portfolio Building.jpg" 
    alt="express entry"
    className="w-150 h-100 object-cover"
  />
</div>
        </div>
      </section>

      {/* ── About + Pricing ── */}
      <section className="px-6 py-14 md:px-16 lg:px-24" style={{ background: "#faf7f0" }}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">

          {/* Left: About */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <button style={{ color: "#b8952a" }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2
                className="text-2xl"
                style={{ fontFamily: "Georgia, serif", fontWeight: 400, color: "#1a1a1a" }}
              >
                About Service
              </h2>
            </div>
            <div className="w-16 h-0.5 mb-6 ml-8 rounded" style={{ background: "#b8952a" }} />

            <p className="text-sm leading-relaxed mb-5 text-justify" style={{ color: "#555" }}>
              While looking at students who attended top universities (like Harvard, Stanford, Oxford,
              University of Toronto, and NUS), top business tycoons, and candidates who worked at
              top-ranked organizations (like Netflix, Google, Amazon, and McKinsey &amp; Company), we
              found one common denominator that existed for over 94% of these leaders.
            </p>

            <p className="text-sm leading-relaxed mb-5 text-justify" style={{ color: "#444" }}>
              The factor, you ask? <strong style={{ color: "#1a1a1a" }}>A portfolio website.</strong>
            </p>

            <p className="text-sm leading-relaxed mb-6 text-justify" style={{ color: "#555" }}>
              A portfolio website can replace your business card, and it makes it easy for anyone
              with internet access to view your skills, projects, demos, and availability. Moreover,
              it gives your audience (which may be employers, investors, admissions committees, or
              followers) to connect with you via the means you prefer.
            </p>

            <p className="text-sm font-medium mb-4" style={{ color: "#1a1a1a" }}>
              Global Counsellor Centre&apos;s online portfolio building service helps you in the following ways:
            </p>

            <ul className="space-y-2 mb-6">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "#555" }}>
                  <span className="mt-0.5 font-medium flex-shrink-0" style={{ color: "#b8952a" }}>›</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <p className="text-sm leading-relaxed mb-4 text-justify" style={{ color: "#555" }}>
              Your online portfolio will be coded by some of the best tech teams that brought you
              websites like{" "}
              <a href="#" style={{ color: "#b8952a" }} className="hover:underline">Global Admissions</a>{" "}
              along with the best technical content management specialists we work with.
            </p>

            <p className="text-sm leading-relaxed mb-4 text-justify" style={{ color: "#555" }}>
              Interested in taking your professional network to the next level? We look forward to
              working with you. Start by making a purchase and getting in touch with us for the next steps.
            </p>

            <p className="text-sm leading-relaxed mb-6 text-justify" style={{ color: "#555" }}>
              Interested in seeing a sample? Check out{" "}
              <a href="#" style={{ color: "#b8952a" }} className="hover:underline">this page</a>.
            </p>

            {/* Note box */}
            <div
              className="rounded-lg p-4"
              style={{ background: "#f5f0e8", border: "1px solid #e0d5be" }}
            >
              <p className="text-sm leading-relaxed font-medium text-justify" style={{ color: "#6b5a2e" }}>
                Please Note: Prices for this service may vary based on the exact template, number of
                pages, and the content to be added. The charge mentioned on this page is to be used as
                an estimate which works well in most cases but may need to be modified depending on
                your exact case. Moreover, the price of this service is set to increase in the upcoming
                weeks. This is currently at the introductory offer price.
              </p>
            </div>
          </div>

          {/* Right: Pricing + Chat */}
          <div className="lg:w-80 flex flex-col gap-5">

            {/* Pricing Card */}
            <div
              className="rounded-xl p-6"
              style={{ background: "#fff", border: "1px solid #e0d5be" }}
            >
              <h3
                className="text-lg mb-5"
                style={{ fontFamily: "Georgia, serif", fontWeight: 400, color: "#1a1a1a" }}
              >
                Start Now
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#888" }}>Services:</span>
                  <span style={{ color: "#1a1a1a" }}>Portfolio Building</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span style={{ color: "#888" }}>Duration:</span>
                  <span style={{ color: "#1a1a1a" }} className="flex items-center gap-1">
                    4 weeks
                    <svg className="w-3.5 h-3.5" style={{ color: "#b8952a" }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10A8 8 0 110 10a8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span style={{ color: "#888" }}>Currency:</span>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="rounded px-2 py-1 text-sm focus:outline-none"
                    style={{ border: "1px solid #d4c9a8", background: "#faf7f0", color: "#555" }}
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
                  <span style={{ color: "#888" }}>Actual Amount:</span>
                  <span style={{ color: "#bbb", textDecoration: "line-through" }}>INR 1,15,907.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#888" }}>Amount:</span>
                  <span className="font-medium text-base" style={{ color: "#b8952a" }}>INR 92,725.47</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span style={{ color: "#888" }}>You save:</span>
                  <div className="flex items-center gap-2">
                    <span style={{ color: "#555" }}>INR 23,181.53</span>
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
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#faf7f0")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
                >
                  Add to Cart
                </button>
                <button
                  className="flex-1 text-sm font-medium py-2.5 rounded-lg transition-colors"
                  style={{ background: "#b8952a", color: "#fff", border: "none" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#9e7d22")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#b8952a")}
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Discuss Your Case Card */}
            <div
              className="rounded-xl overflow-hidden"
              style={{ background: "#fff", border: "1px solid #e0d5be" }}
            >
              <div className="flex">
                <div className="flex-shrink-0">
  <img 
    src="/man_holding_phone.png" 
    alt="man holding"
    className="w-20 h-20 object-cover"
  />
</div>
                <div className="flex-1 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: "#b8952a" }}
                    >
                      <svg className="w-3 h-3" fill="white" viewBox="0 0 24 24">
                        <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z" />
                      </svg>
                    </div>
                    <span className="font-medium text-sm" style={{ color: "#1a1a1a" }}>Discuss Your Case</span>
                  </div>
                  <p className="text-xs mb-3 leading-relaxed" style={{ color: "#888" }}>
                    Chat with a team member to see how we can help.
                  </p>
                  <button
                    className="text-xs w-full text-left transition-colors"
                    style={{ color: "#b8952a" }}
                  >
                    Message now →
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}