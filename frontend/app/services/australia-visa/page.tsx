"use client";

import { useState } from "react";

/* ─────────────────────────────────────────
   DESIGN TOKENS  (from uploaded screenshot)
   ───────────────────────────────────────── */
const T = {
  bg:       "#f5f0e8",          // parchment – main background
  bgAlt:    "#edeade",          // deeper parchment – alternate sections
  gold:     "#c9a84c",          // gold accent
  goldDark: "#8b6914",          // hover / dark gold
  ink:      "#2c2416",          // primary text
  inkMid:   "#5c4a2a",          // secondary text
  inkFade:  "rgba(92,74,42,0.52)",
  navy:     "#2c3e50",          // dark card / section bg
  navyMid:  "#3d5a6e",
  red:      "#c0392b",          // minus icon
  serif:    "'Georgia','Times New Roman',serif",
};

/* ─────────────────────────────────────────
   REUSABLE ATOMS
   ───────────────────────────────────────── */

/** Pill border tag like "PROFESSIONAL IDENTITY FORGE" in screenshot */
function PillTag({ children }: { children: string }) {
  return (
    <span style={{
      display: "inline-block",
      border: "1px solid rgba(44,36,22,0.3)",
      borderRadius: 999,
      padding: "7px 20px",
      fontFamily: T.serif,
      fontSize: "0.63rem",
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: T.ink,
      marginBottom: 28,
    }}>
      {children}
    </span>
  );
}

/** Big italic pull-quote like screenshot body text */
function ItalicQuote({ text, color = T.ink }: { text: string; color?: string }) {
  return (
    <p style={{
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
      lineHeight: 1.85,
      color,
      maxWidth: 560,
      margin: 0,
    }}>
      &ldquo;{text}&rdquo;
    </p>
  );
}

/** Gold rounded CTA button from screenshot */
function GoldBtn({ label, small = false }: { label: string; small?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        background: hov ? T.goldDark : T.gold,
        color: "#fff",
        border: "none",
        borderRadius: 6,
        padding: small ? "10px 22px" : "13px 28px",
        fontFamily: T.serif,
        fontSize: "0.66rem",
        fontWeight: 600,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "background .22s",
      }}
    >
      {label}
    </button>
  );
}

/** Dark circle with letter — like the "N" avatar in screenshot */
function Avatar({ letter = "N", bg = T.ink }: { letter?: string; bg?: string }) {
  return (
    <div style={{
      width: 42, height: 42, borderRadius: "50%",
      background: bg, color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: T.serif, fontWeight: "bold", fontSize: "1rem", flexShrink: 0,
    }}>
      {letter}
    </div>
  );
}

/** Eyebrow label above section headings */
function EyeBrow({ text, center = false }: { text: string; center?: boolean }) {
  return (
    <p style={{
      fontFamily: T.serif,
      fontSize: "0.62rem",
      letterSpacing: "0.28em",
      textTransform: "uppercase",
      color: T.gold,
      marginBottom: 8,
      textAlign: center ? "center" : "left",
    }}>
      {text}
    </p>
  );
}

/** Short gold rule under heading */
function Rule({ center = false }) {
  return (
    <div style={{
      width: 48, height: 2, background: T.gold,
      marginBottom: 24,
      ...(center ? { margin: "0 auto 24px" } : {}),
    }} />
  );
}

/** Section heading */
function H2({ children, color = T.ink, center = false }: { children: React.ReactNode; color?: string; center?: boolean }) {
  return (
    <h2 style={{
      fontFamily: T.serif, fontWeight: "bold",
      fontSize: "clamp(1.7rem, 3.5vw, 2.5rem)",
      color, marginBottom: 6,
      textAlign: center ? "center" : "left",
    }}>
      {children}
    </h2>
  );
}

/** Body paragraph */
function Body({ children, center = false, color = T.inkFade }: { children: React.ReactNode; center?: boolean; color?: string }) {
  return (
    <p style={{
      fontFamily: T.serif, fontSize: "0.93rem", lineHeight: 1.85,
      color, textAlign: center ? "center" : "left", margin: 0,
    }}>
      {children}
    </p>
  );
}

/** Outer section shell */
function Sec({
  children, bg = T.bg, py = 72, topRule = false, className = "",
}: {
  children: React.ReactNode; bg?: string; py?: number; topRule?: boolean; className?: string;
}) {
  return (
    <section 
      className={className}
      style={{
        background: bg,
        padding: `${py}px clamp(24px, 6vw, 112px)`,
        borderTop: topRule ? "1px solid rgba(201,168,76,0.18)" : "none",
      }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        {children}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   DATA
   ───────────────────────────────────────── */

const faqs = [
  { q: "Do you only help for applications to the US? What about other countries?", a: "We support applications to most countries including but not limited to USA, Canada, Germany, Ireland, UK, Australia, India, and Singapore." },
  { q: "Does the price include GST/Taxes?", a: "Please contact our team for detailed pricing information including applicable taxes and fees." },
  { q: "Since the services are offered online, how do we ensure the process will be as smooth as an offline consulting service?", a: "Our dedicated consultants provide continuous support via audio calls and WhatsApp, ensuring a seamless online experience comparable to in-person consulting." },
  { q: "What is the best time for me to enroll in the services?", a: "The earlier the better. Profile building takes around 6 months, so enrolling early gives you the best chance of success." },
  { q: "Are the timelines mentioned on the website followed religiously?", a: "Timelines are estimates based on past client data. Individual results may vary depending on specific circumstances and government processing times." },
  { q: "Are there any ongoing discount offers?", a: "Please reach out to our team directly to learn about any current promotions or discount offers." },
];

const eligibility = [
  { num: 1, title: "Nomination", desc: "A completed nomination form (Form 1000) from a recognized Australian citizen, permanent resident, eligible New Zealand citizen, or an Australian organization with a national reputation in your field is mandatory." },
  { num: 2, title: "Awards", desc: "Nationally or internationally recognized awards for excellence in the field." },
  { num: 3, title: "Internationally Recognized Achievement", desc: "Demonstrate a sustained record of exceptional achievement in your field (for instance, via research papers or patents)." },
  { num: 4, title: "Continued Prominence", desc: "Maintain recent exceptional achievements and remain active in your field until the time of application." },
  { num: 5, title: "Memberships", desc: "Show evidence of registration, licensing, or professional memberships in esteemed organizations." },
  { num: 6, title: "Benefit to Australia", desc: "Show that your contributions will have a positive economic, social, cultural, or academic impact on Australia." },
  { num: 7, title: "Ability to Establish Yourself", desc: "Provide evidence of your capacity to secure employment or establish yourself independently in Australia." },
];

const timelineSteps = [
  { step: 1, title: "Profile Building", desc: "Align your qualifications and experience with Australia's visa requirements.", duration: "6 months", dark: false },
  { step: 2, title: "Expression of Interest (EOI)", desc: "Officially initiate the National Innovation Visa Process.", duration: null, dark: true },
  { step: 3, title: "Invitation to Apply", desc: "Get an invitation from the Department of Home Affairs.", duration: "2–4 weeks (priority sectors)", dark: false },
  { step: 4, title: "Nomination", desc: "File Form 1000 through a recognized nominator with us.", duration: "2–4 weeks", dark: true },
  { step: 5, title: "Visa Application", desc: "Submit your application within 60 days from nomination approval.", duration: "Decision: 9 months", dark: false },
];

const advantages = [
  { title: "Permanent Residency", desc: "Live in Australia indefinitely with permanent resident status." },
  { title: "Work and Study Rights", desc: "Enjoy the freedom to work and pursue further studies in Australia." },
  { title: "Access to Medicare", desc: "Enroll in Australia's public healthcare system." },
  { title: "Dependents Allowed", desc: "Sponsor eligible family members to join you in Australia." },
  { title: "Travel Flexibility", desc: "Travel to and from Australia for up to five years from the visa grant date." },
  { title: "Pathway to Citizenship", desc: "Become eligible to apply for Australian citizenship." },
];

const successData = [
  { label: "With 5 Papers", pct: 72 },
  { label: "With 6 Papers", pct: 80 },
  { label: "With 7 Papers", pct: 89 },
  { label: "With 8 Papers", pct: 96 },
];

const otherPathways = [
  { flag: "🇺🇸", title: "United States (O-1 Visa)", sub: "Fast Work Visa, No Lottery & Direct PR Pathway." },
  { flag: "🇺🇸", title: "United States (EB-1 Visa)", sub: "Fastest Green Card by Employment." },
  { flag: "🇬🇧", title: "United Kingdom (Global Talent Visa)", sub: "UK Work Visa Without Employer & PR Pathway." },
  { flag: "🇺🇸", title: "United States (EB-2 NIW Visa)", sub: "No Employer Needed, Direct PR Pathway." },
  { flag: "🇸🇬", title: "Singapore ONE Pass", sub: "No Employer Needed. Live & Work in Singapore." },
];

/* ─────────────────────────────────────────
   PAGE
   ───────────────────────────────────────── */

export default function AustraliaVisaPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main style={{ background: T.bg, color: T.ink, fontFamily: T.serif, minHeight: "100vh" }}>

      {/* ══════════════ HERO ══════════════ */}
      <Sec bg={T.bg} py={80}>

        {/* Back link */}
      

        {/* Two-column grid */}
        <div className="hero-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 400px",
          gap: 60,
          alignItems: "start",
        }}>

          {/* ── LEFT: Headline + quote + CTA ── */}
          <div>
            

            <h1 style={{ fontFamily: T.serif, fontWeight: "bold", fontSize: "clamp(2.6rem, 6.5vw, 5.2rem)", lineHeight: 1.05, color: T.ink, margin: 0 }}>
             Apply for Australia
            </h1>
            <h1 style={{ fontFamily: T.serif, fontWeight: "bold", fontSize: "clamp(2.6rem, 6.5vw, 5.2rem)", lineHeight: 1.05, color: T.gold, margin: "0 0 30px" }}>
              National Innovation Visa
            </h1>

            <div style={{ marginBottom: 40 }}>
              <ItalicQuote text="Highlight your extraordinary abilities and take the next step in your professional journey with Australia's most prestigious permanent visa." />
            </div>

            {/* Avatar + CTA button */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <Avatar letter="N" />
              <div style={{
              background: "#fff",
              border: "1px solid rgba(201,168,76,0.26)",
              borderRadius: 8,
              padding: "22px 22px 18px",
            }}>
              {/* Card header */}
           

              <div style={{ height: 1, background: "rgba(201,168,76,0.18)", marginBottom: 16 }} />

              {/* Includes label */}
              <p style={{
                fontFamily: T.serif, fontSize: "0.6rem",
                letterSpacing: "0.2em", textTransform: "uppercase",
                color: T.gold, marginBottom: 12,
              }}>
                Includes:
              </p>

              {/* Contact rows */}
              <div style={{ 
  display: "flex", 
  flexDirection: "row", 
  gap: 12 
}}>
                {[
                  { bg: T.navy,    icon: "📞", label: "Audio call",   sub: "Book a call with a consultant" },
                  { bg: "#25d366", icon: "💬", label: "Text Support", sub: "Chat with us on WhatsApp"       },
                ].map(({ bg, icon, label, sub }) => (
                  <div key={label} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 13px",
                    border: "1px solid rgba(201,168,76,0.16)",
                    borderRadius: 6,
                    cursor: "pointer",
                    background: "rgba(245,240,232,0.55)",
                    transition: "background .18s",
                  }}>
                    <span style={{
                      width: 34, height: 34, borderRadius: "50%",
                      background: bg, color: "#fff", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.82rem",
                    }}>
                      {icon}
                    </span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: T.serif, fontWeight: "600", fontSize: "0.84rem", color: T.ink }}>{label}</p>
                      <p style={{ fontFamily: T.serif, fontSize: "0.72rem", color: T.inkFade }}>{sub}</p>
                    </div>
                    <span style={{ color: T.gold, fontSize: "0.85rem", flexShrink: 0 }}>→</span>
                  </div>
                  
                ))}

              </div>
   <div style={{
  display: "flex",
  alignItems: "center",
  gap: 12
}}>

  {/* Button */}
  <p style={{
    border: `1px solid ${T.gold}`,
    padding: "10px 16px",
    borderRadius: 6,
    fontFamily: T.serif,
    fontSize: "0.9rem",
    margin: 0,
    whiteSpace: "nowrap"
  }}>
    Discuss Your Case
  </p>

  {/* Text */}
  <p style={{
    fontFamily: T.serif,
    fontSize: "0.8rem",
    color: T.inkFade,
    margin: 0,
    lineHeight: 1.5
  }}>
    Have questions about this service? Let&apos;s chat.
  </p>

</div>

              <div style={{ height: 1, background: "rgba(201,168,76,0.18)", margin: "16px 0" }} />

              {/* CTA inside card */}
             
            </div>
            </div>
          </div>
          

          {/* ── RIGHT: Image + Contact card ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Hero image */}
            <div style={{ position: "relative", borderRadius: 8, overflow: "hidden", aspectRatio: "4/3" }}>
              <img
                src="https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=900&q=80"
                alt="Sydney Opera House, Australia"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              {/* Gradient overlay */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(160deg, rgba(44,36,22,0.12) 0%, rgba(44,36,22,0.48) 100%)",
              }} />
              {/* 🇦🇺 pill */}
              <div style={{
                position: "absolute", top: 16, left: 16,
                display: "flex", alignItems: "center", gap: 7,
                background: "rgba(255,255,255,0.93)", borderRadius: 999,
                padding: "5px 13px",
              }}>
                <span style={{ fontSize: "1rem" }}>🇦🇺</span>
                <span style={{ fontFamily: T.serif, fontSize: "0.68rem", fontWeight: "600", color: T.ink, letterSpacing: "0.06em" }}>Australia</span>
              </div>
              {/* PR badge bottom-right */}
              <div style={{
                position: "absolute", bottom: 16, right: 16,
                background: T.gold, borderRadius: 4,
                padding: "6px 12px",
              }}>
                <p style={{ fontFamily: T.serif, fontSize: "0.65rem", fontWeight: "bold", color: "#fff", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Permanent Residency
                </p>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 860px) {
            .hero-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </Sec>

      {/* ══════════════ ABOUT ══════════════ */}
      <Sec bg={T.bg} py={72} topRule>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center", marginBottom: 48 }}>
          <EyeBrow text="About Srvices" center />
          <H2 center>What is the Australia NIV?</H2>
          <Rule center />
          <Body center>
            The National Innovation Visa (subclass 858) is an Australian permanent visa designed for exceptionally talented migrants from around the world.
          </Body>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 20 }}>
          {[
            { label: "Global Researchers", bg: T.gold,    desc: "Individuals with a strong track record of research, significant publications in top journals, high citation volumes, and prestigious awards." },
            { label: "Entrepreneurs",      bg: T.navy,    desc: "Established entrepreneurs as well as emerging ones with demonstrated success, particularly those involved in state-led initiatives." },
            { label: "Innovative Investors",bg: T.navyMid,desc: "Investors who prioritize the quality of their investments and have the potential to push Australia's innovation and economic sectors." },
            { label: "Athletes & Creatives",bg: "#6b1a1a",desc: "Exceptional talents in sports and the arts." },
          ].map((c) => (
            <div key={c.label} style={{ background: c.bg, padding: 22, borderRadius: 2 }}>
              <p style={{ fontFamily: T.serif, fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.58)", marginBottom: 10 }}>{c.label}</p>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 2, padding: 14 }}>
                <p style={{ fontFamily: T.serif, fontWeight: "bold", color: "#fff", marginBottom: 6 }}>{c.label}</p>
                <p style={{ fontFamily: T.serif, fontSize: "0.85rem", color: "rgba(255,255,255,0.76)", lineHeight: 1.78 }}>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Sec>

      {/* ══════════════ ADVANTAGES ══════════════ */}
 <Sec bg={T.navy} py={72}>
  <EyeBrow text="Benefits" />
  <H2 color="#fff">
    The NIV has the following <span style={{ color: T.gold }}>advantages</span>
  </H2>

  <div style={{ marginBottom: 36 }} />

  {/* Wrapper for left (content) + right (image) */}
  <div
    style={{
      display: "flex",
      gap: 40,
      alignItems: "flex-start",
      flexWrap: "wrap",
    }}
  >
    {/* LEFT SIDE (advantages) */}
    <div style={{ flex: 1, minWidth: 300 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: 22,
        }}
      >
        {advantages.map((a) => (
          <div key={a.title} style={{ display: "flex", gap: 14 }}>
            <span
              style={{
                marginTop: 3,
                width: 20,
                height: 20,
                flexShrink: 0,
                background: T.gold,
                color: "#fff",
                fontSize: "0.68rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✓
            </span>
            <div>
              <p style={{ fontFamily: T.serif, fontWeight: "bold", color: "#fff" }}>
                {a.title}
              </p>
              <p
                style={{
                  fontFamily: T.serif,
                  fontSize: "0.86rem",
                  color: "rgba(255,255,255,0.56)",
                  marginTop: 3,
                  lineHeight: 1.78,
                }}
              >
                {a.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* RIGHT SIDE (image) */}
    <div style={{ flex: 1, minWidth: 280, textAlign: "center" }}>
      <img
        src="/pan.jpg" // replace with your image path
        alt="Benefits illustration"
        style={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 12,
        }}
      />
    </div>
  </div>
</Sec>

      {/* ══════════════ DISADVANTAGES ══════════════ */}
      <Sec bg={T.bg} py={56} topRule>
        <div style={{ maxWidth: 760 }}>
          <H2>The NIV has the following <span style={{ color: T.goldDark }}>disadvantages</span></H2>
          <div style={{ height: 20 }} />
          <div style={{ border: "1px solid rgba(201,168,76,0.26)", borderRadius: 2, padding: 28 }}>
            {[
              { t: "Invitation-Only Process",       d: "After submitting your Expression of Interest, only the selected candidates will be invited to apply for the NIV." },
              { t: "Strict Nomination Requirement", d: "You must secure a nomination from a recognized individual, Australian citizen, permanent resident, eligible New Zealand citizen, or organization." },
            ].map((item, i) => (
              <div key={item.t} style={{ display: "flex", gap: 14, paddingBottom: i === 0 ? 20 : 0, marginBottom: i === 0 ? 20 : 0, borderBottom: i === 0 ? "1px solid rgba(201,168,76,0.14)" : "none" }}>
                <span style={{ marginTop: 2, width: 20, height: 20, flexShrink: 0, background: T.red, color: "#fff", fontSize: "0.9rem", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" }}>–</span>
                <div>
                  <p style={{ fontFamily: T.serif, fontWeight: "bold" }}>{item.t}</p>
                  <p style={{ fontFamily: T.serif, fontSize: "0.875rem", color: T.inkFade, marginTop: 3, lineHeight: 1.78 }}>{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Sec>

      {/* ══════════════ ELIGIBILITY ══════════════ */}
      <Sec bg={T.bgAlt} py={72}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "start",
        }}
          className="eligibility-grid"
        >
          {/* LEFT — Image */}
          <div style={{ position: "relative" }}>
            {/* Main image */}
            <div style={{
              width: "100%",
              aspectRatio: "3/4",
              borderRadius: 4,
              overflow: "hidden",
              position: "relative",
            }}>
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
                alt="Australia landscape"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              {/* Gold overlay tint */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to bottom, transparent 40%, rgba(44,36,22,0.55) 100%)",
              }} />
              {/* Badge on image */}
              <div style={{
                position: "absolute", bottom: 28, left: 28, right: 28,
                background: "rgba(201,168,76,0.92)",
                padding: "16px 20px",
                borderRadius: 3,
              }}>
                <p style={{ fontFamily: T.serif, fontWeight: "bold", color: "#fff", fontSize: "1.05rem", marginBottom: 2 }}>
                  Subclass 858
                </p>
                <p style={{ fontFamily: T.serif, fontSize: "0.78rem", color: "rgba(255,255,255,0.85)" }}>
                  National Innovation Visa · Permanent Residency
                </p>
              </div>
            </div>

            {/* Decorative gold border offset */}
            <div style={{
              position: "absolute",
              top: 18, left: -18,
              width: "60%", height: "40%",
              border: `2px solid rgba(201,168,76,0.35)`,
              borderRadius: 4,
              zIndex: -1,
            }} />

            {/* Stat pill below image */}
            <div style={{
              display: "flex",
              gap: 12,
              marginTop: 20,
            }}>
              {[
                { num: "92%+", label: "Success Rate" },
                { num: "7",    label: "Key Criteria" },
                { num: "6mo",  label: "Profile Build" },
              ].map((s) => (
                <div key={s.label} style={{
                  flex: 1,
                  background: "#fff",
                  border: "1px solid rgba(201,168,76,0.22)",
                  borderRadius: 3,
                  padding: "12px 10px",
                  textAlign: "center",
                }}>
                  <p style={{ fontFamily: T.serif, fontWeight: "bold", fontSize: "1.15rem", color: T.gold }}>{s.num}</p>
                  <p style={{ fontFamily: T.serif, fontSize: "0.7rem", color: T.inkFade, marginTop: 2 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Criteria */}
          <div>
           
            <H2>Eligibility Criteria</H2>
            <Rule />
            <Body color={T.inkFade}>To qualify for the National Innovation Visa, applicants must meet some of the following requirements</Body>
            <div style={{ position: "relative", borderLeft: "2px dashed rgba(201,168,76,0.36)", paddingLeft: 36, marginTop: 36 }}>
              {eligibility.map((e, i) => (
                <div key={e.num} style={{ position: "relative", marginBottom: i < eligibility.length - 1 ? 26 : 0 }}>
                  <span style={{ position: "absolute", left: -47, top: 2, width: 28, height: 28, background: T.gold, color: "#fff", fontSize: "0.7rem", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.serif }}>{e.num}</span>
                  <p style={{ fontFamily: T.serif, fontWeight: "bold", marginBottom: 3 }}>{e.title}</p>
                  <p style={{ fontFamily: T.serif, fontSize: "0.855rem", color: T.inkFade, lineHeight: 1.8 }}>{e.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Responsive style */}
        <style>{`
          @media (max-width: 768px) {
            .eligibility-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </Sec>

      {/* ══════════════ WHY US ══════════════ */}
      <Sec bg={T.bg} py={72} topRule>
        <div style={{ maxWidth: 840, margin: "0 auto", textAlign: "center", marginBottom: 48 }}>
          
          <H2 center>Why Choose Global Counsellor Centre for Your NIV Application?</H2>
          <Rule center />
          <Body center color={T.inkFade}>Our end-to-end NIV application services at Global Counsellor Centre — Global Admissions are unlike any other firm&apos;s.</Body>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
          {[
            { icon: "🎓", title: "Free Eligibility Check", desc: "Get a no-obligation assessment of your profile against NIV criteria.", hi: true },
            { icon: "📈", title: "Profile Boosting",       desc: "We actively help strengthen your academic and professional profile.", hi: false },
            { icon: "✅", title: "Success Rates Over 92%", desc: "Our track record speaks — the highest success rates in the industry.", hi: false },
          ].map((w) => (
            <div key={w.title} style={{ padding: 26, border: w.hi ? `1px solid ${T.gold}` : "1px solid rgba(201,168,76,0.2)", background: w.hi ? "rgba(201,168,76,0.07)" : "transparent", borderRadius: 2, textAlign: "left" }}>
              <span style={{ fontSize: "2rem", display: "block", marginBottom: 14 }}>{w.icon}</span>
              <p style={{ fontFamily: T.serif, fontWeight: "bold", fontSize: "1rem", marginBottom: 8 }}>{w.title}</p>
              <p style={{ fontFamily: T.serif, fontSize: "0.875rem", color: T.inkFade, lineHeight: 1.75 }}>{w.desc}</p>
              <button style={{ marginTop: 14, background: "none", border: "none", fontFamily: T.serif, fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: T.gold, cursor: "pointer" }}>
                Learn more →
              </button>
            </div>
          ))}
        </div>
      </Sec>

      {/* ══════════════ TIMELINE ══════════════ */}
      <Sec py={80} bg={T.bgAlt}>
  <div className="flex flex-col lg:flex-row gap-12 items-start">

          {/* LEFT IMAGE */}
          <div className="w-full lg:w-1/2">
            <img
              src="/timeline-image.jpg" // replace with your image
              alt="Timeline"
              className="w-full max-w-md rounded-xl"
            />
          </div>

          {/* RIGHT CONTENT */}
          <div className="w-full lg:w-1/2">
            <div className="max-w-xl">
              
              {/* HEADER */}
              <H2 center>Timeline</H2>
              <Rule center />

        <div className="text-center mb-10">
          <p className="text-sm" style={{ color: T.inkFade }}>
            Here&apos;s how long it takes to get the Australia NIV.
          </p>
        </div>

              {/* TIMELINE */}
              <div
                className="relative border-l-2 pl-10"
                style={{ borderColor: T.gold }}
              >
                {timelineSteps.map((t, i) => (
                  <div
                    key={t.step}
                    className={`relative ${
                      i < timelineSteps.length - 1 ? "mb-7" : ""
                    }`}
                  >
                    {/* STEP NUMBER */}
                    <span
                      className="absolute -left-[44px] top-3 w-8 h-8 flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: T.gold }}
                    >
                      {t.step}
                    </span>

                    {/* CARD */}
                    <div
                      className="p-5 rounded"
                      style={{
                        background: t.dark ? T.navy : "#fff",
                      }}
                    >
                      <p
                        className="text-[10px] tracking-[0.24em] uppercase mb-1"
                        style={{ color: T.gold }}
                      >
                        Step {t.step}
                      </p>

                      <p
                        className="font-semibold mb-1"
                        style={{ color: t.dark ? "#fff" : T.ink }}
                      >
                        {t.title}
                      </p>

                      <p
                        className="text-sm leading-relaxed"
                        style={{
                          color: t.dark
                            ? "rgba(255,255,255,0.56)"
                            : T.inkFade,
                        }}
                      >
                        {t.desc}
                      </p>

                      {t.duration && (
                        <span
                          className="inline-block mt-3 px-3 py-1 text-xs text-white"
                          style={{ background: T.gold }}
                        >
                          ⏱ {t.duration}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
          </div>
          </div>
        </div>
      </Sec>

      {/* ══════════════ SUCCESS RATES ══════════════ */}
      <Sec bg={T.bg} py={72} topRule>
        <H2 center>Success Rate &amp; Pathways</H2>
        <Rule center />
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Body center color={T.inkFade}>Understand what you need on your profile to get approved.</Body>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 40 }}>

          {/* Bar chart */}
          <div style={{ background: T.navy, color: "#fff", padding: 32, borderRadius: 2 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <p style={{ fontFamily: T.serif, fontWeight: "bold", fontSize: "1rem" }}>NIV Australia Success Rates</p>
              <span style={{ fontSize: "1.4rem" }}>🇦🇺</span>
            </div>
            <p style={{ fontFamily: T.serif, fontSize: "0.66rem", color: "rgba(255,255,255,0.42)", marginBottom: 24 }}>
              Based on petition outputs of our clients (2025)
            </p>
            {successData.map((s) => (
              <div key={s.label} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: T.serif, fontSize: "0.875rem", marginBottom: 5 }}>
                  <span>{s.label}</span>
                  <span style={{ fontWeight: "bold", color: T.gold }}>{s.pct}%</span>
                </div>
                <div style={{ height: 14, background: "rgba(255,255,255,0.1)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${s.pct}%`, background: T.gold }} />
                </div>
              </div>
            ))}
            <p style={{ fontFamily: T.serif, fontSize: "0.66rem", color: T.gold, marginTop: 24, textAlign: "center" }}>
              Average 20–30 citations per paper (Total 150 to 250 citations)
            </p>
          </div>

          {/* Pathways */}
          <div>
            <p style={{ fontFamily: T.serif, fontWeight: "bold", fontSize: "1.1rem", marginBottom: 10 }}>Other Pathways for working overseas</p>
            <div style={{ width: 32, height: 2, background: T.gold, marginBottom: 22 }} />
            {otherPathways.map((p) => (
              <div key={p.title} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 0", borderBottom: "1px solid rgba(201,168,76,0.18)", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: "1.4rem" }}>{p.flag}</span>
                  <div>
                    <p style={{ fontFamily: T.serif, fontWeight: "600", fontSize: "0.875rem" }}>{p.title}</p>
                    <p style={{ fontFamily: T.serif, fontSize: "0.74rem", color: T.inkFade }}>{p.sub}</p>
                  </div>
                </div>
                <span style={{ color: T.gold }}>↗</span>
              </div>
            ))}
          </div>
        </div>
      </Sec>

      {/* ══════════════ FAQs ══════════════ */}
      <Sec bg={T.bgAlt} py={72}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <H2 center>Frequently Asked Questions</H2>
          <Rule center />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ border: "1px solid rgba(201,168,76,0.2)", background: "#fff", borderRadius: 2 }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", textAlign: "left", background: "none", border: "none", cursor: "pointer" }}
                >
                  <span style={{ fontFamily: T.serif, fontWeight: "600", fontSize: "0.88rem", paddingRight: 16, color: T.ink }}>{faq.q}</span>
                  <span style={{ width: 28, height: 28, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${T.gold}`, color: T.gold, fontSize: "1.2rem", transform: openFaq === i ? "rotate(45deg)" : "none", transition: "transform .2s" }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "14px 24px 20px", borderTop: "1px solid rgba(201,168,76,0.12)", fontFamily: T.serif, fontSize: "0.875rem", color: T.inkFade, lineHeight: 1.82 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Sec>
</main>
  );
}