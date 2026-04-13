"use client";

import { useState } from "react";

type RouteTab = "Digital Technology" | "Academia / Research" | "Arts & Culture";
type EligTab  = "Digital Technology" | "Academia / Research" | "Arts & Culture";
type FAQItem  = { q: string; a: string };

// ── palette ──────────────────────────────────────────────────────────────────
const C = {
  cream : "#f5f0e8",
  card  : "#ede8dc",
  border: "#d6cdb8",
  gold  : "#b8953f",
  dark  : "#1c1a14",
  muted : "#7a7060",
  red   : "#c0392b",
  serif : "Georgia, 'Times New Roman', serif",
};

// ── data ─────────────────────────────────────────────────────────────────────
const advantages = [
  { title: "Flexible Duration",        desc: "Up to 5 years, extendable. Renew 1–5 yrs per extension if you continue to meet requirements." },
  { title: "Work Freedom",             desc: "Be employed, self-employed, or act as a company director." },
  { title: "Fast Processing",          desc: "Typically processed faster than other employment-based visas." },
  { title: "Job Adaptability",         desc: "Change or stop your role without informing the Home Office." },
  { title: "Family Inclusion",         desc: "Bring your partner and children as dependents (if eligible)." },
  { title: "Travel Freedom",           desc: "Travel abroad and re-enter the UK freely." },
  { title: "No Language / Salary Bar", desc: "No English language test or minimum salary threshold required." },
  { title: "Fast Endorsement Process", desc: "Fast-track endorsement returns a Home Office decision in 14 working days." },
];

const disadvantages = [
  { title: "Endorsement Requirement",  desc: "Most applicants must secure an endorsement to prove leadership or potential leadership in their field." },
  { title: "Restrictions on Benefits", desc: "You cannot access most public funds, and you cannot work as a sportsperson." },
];

const eligibilityContent: Record<EligTab, JSX.Element> = {
  "Digital Technology": (
    <div className="space-y-5">
      <p style={{ color: C.muted, fontStyle: "italic", fontSize: "0.875rem", lineHeight: "1.6" }}>
        Two endorsement tracks — <strong style={{ fontStyle: "normal", color: C.dark }}>Exceptional Talent (Leader)</strong> and{" "}
        <strong style={{ fontStyle: "normal", color: C.dark }}>Exceptional Promise (Potential Leader)</strong> — evaluated by Tech Nation.
      </p>
      {[
        { label: "Exceptional Talent (Leader)", intro: "Recognised as a leading talent in the last 5 years.", items: [
          "Proven track record for innovation as a founder or senior executive of a product-led digital tech company, or as an employee on a new digital field/concept.",
          "Recognition for work beyond occupation that advances the field.",
          "Significant technical, commercial or entrepreneurial contributions as founder, senior executive, board member or employee.",
          "Exceptional academic ability through research published or endorsed by an expert.",
        ]},
        { label: "Exceptional Promise (Potential Leader)", intro: "Early-career — recognised as a potential leader in the last 5 years.", items: [
          "Innovation as a founder of a product-led digital tech company or employee on a new digital field/concept.",
          "Recognition for work beyond occupation contributing to advancement of the field.",
          "Significant technical, commercial or entrepreneurial contributions as a founder or employee.",
          "Exceptional ability through academic contributions via research endorsed by an expert.",
        ]},
      ].map((track) => (
        <div key={track.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "1rem", padding: "1.25rem" }} className="space-y-3">
          <h4 style={{ fontFamily: C.serif, color: C.dark, fontWeight: 700, fontSize: "0.875rem" }}>{track.label}</h4>
          <p style={{ color: C.muted, fontStyle: "italic", fontSize: "0.75rem" }}>{track.intro}</p>
          <p style={{ color: C.muted, fontSize: "0.75rem", fontWeight: 600 }}>Plus at least 2 of the following:</p>
          <div className="space-y-2">
            {track.items.map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span style={{ flexShrink: 0, width: "1.25rem", height: "1.25rem", borderRadius: "50%", background: C.gold, color: "#fff", fontSize: "0.65rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{i + 1}</span>
                <p style={{ color: C.muted, fontSize: "0.75rem", lineHeight: "1.5" }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  "Academia / Research": (
    <div className="space-y-4">
      <p style={{ color: C.muted, fontStyle: "italic", fontSize: "0.875rem", lineHeight: "1.6" }}>
        For outstanding or potential leaders in academia or research. Endorsed by the{" "}
        <strong style={{ fontStyle: "normal" }}>Royal Society</strong>, <strong style={{ fontStyle: "normal" }}>British Academy</strong>,{" "}
        <strong style={{ fontStyle: "normal" }}>Royal Academy of Engineering</strong>, or <strong style={{ fontStyle: "normal" }}>UKRI</strong>.
      </p>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "1rem", padding: "1.25rem" }}>
        <p style={{ color: C.muted, fontSize: "0.875rem", lineHeight: "1.6", fontStyle: "italic" }}>
          Applicants must demonstrate significant contribution to their research field, an internationally recognised reputation,
          and ongoing engagement with the academic community — evidenced through publications, citations, grants, fellowships, and peer recognition.
        </p>
      </div>
    </div>
  ),
  "Arts & Culture": (
    <div className="space-y-4">
      <p style={{ color: C.muted, fontStyle: "italic", fontSize: "0.875rem", lineHeight: "1.6" }}>
        For leaders or potential leaders in arts, dance, literature, music, theatre, visual arts, architecture, fashion design, film or TV.
        Endorsed by <strong style={{ fontStyle: "normal" }}>Arts Council England</strong> or <strong style={{ fontStyle: "normal" }}>British Film Institute (BFI)</strong>.
      </p>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "1rem", padding: "1.25rem" }}>
        <p style={{ color: C.muted, fontSize: "0.875rem", lineHeight: "1.6", fontStyle: "italic" }}>
          Applicants must have an established track record of excellence, demonstrate international recognition, and show a commitment
          to furthering arts and culture in the UK.
        </p>
      </div>
    </div>
  ),
};

const faqs: FAQItem[] = [
  { q: "Do you only help for applications to the US? What about other countries?", a: "We support applications to most countries including USA, Canada, Germany, Ireland, UK, Australia, India, and Singapore." },
  { q: "Does the price include GST/Taxes?", a: "Prices shown are exclusive of applicable taxes. GST or local taxes will be added at checkout based on your location." },
  { q: "Since the services are offered online, how smooth is the process?", a: "Our team uses video calls, audio calls, and chat support. Each client is assigned a dedicated consultant throughout." },
  { q: "What is the best time for me to enroll?", a: "The earlier the better. We recommend starting at least 3–6 months before you plan to submit." },
  { q: "Are the timelines mentioned on the website accurate?", a: "Timelines are typical estimates. Actual times may vary depending on the endorsing body and case complexity." },
  { q: "Are there any ongoing discount offers?", a: "We occasionally run promotional offers. Please contact us or check our website for the latest discounts." },
];

// ── sub-components ────────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return <p style={{ color: C.gold, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.25rem" }}>{children}</p>;
}
function GoldBar() {
  return <div style={{ width: "3rem", height: "2px", background: C.gold, borderRadius: "9999px", marginTop: "0.75rem", marginBottom: "1.5rem" }} />;
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontFamily: C.serif, fontWeight: 700, fontSize: "clamp(1.5rem,3vw,2rem)", color: C.dark, lineHeight: 1.2 }}>{children}</h2>;
}

interface DarkCardProps { title: string; subtitle: string; pills: { text: string; neg?: boolean }[]; extra?: React.ReactNode }
function DarkCard({ title, subtitle, pills, extra }: DarkCardProps) {
  return (
    <div style={{ position: "relative", borderRadius: "1.5rem", overflow: "hidden", flexShrink: 0, width: "100%" }}>
      <div style={{ position: "absolute", bottom: "-12px", left: "-12px", width: "100%", height: "100%", background: C.border, borderRadius: "1.5rem" }} />
      <div style={{ position: "relative", background: C.dark, borderRadius: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem", padding: "1.75rem", minHeight: "480px", justifyContent: "center" }}>
        <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem", width: "4rem", height: "4rem", borderRadius: "50%", background: C.gold, opacity: 0.08 }} />
        <div style={{ position: "absolute", bottom: "2.5rem", left: "1rem", width: "2.5rem", height: "2.5rem", borderRadius: "50%", background: C.gold, opacity: 0.08 }} />

        <div style={{ width: "6rem", height: "6rem", borderRadius: "50%", background: C.gold, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 24px ${C.gold}44` }}>
          <svg style={{ width: "3rem", height: "3rem", color: "#fff" }} fill="none" viewBox="0 0 48 48" stroke="currentColor">
            <circle cx="24" cy="24" r="18" strokeWidth={2} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 24l5 5 9-9" />
          </svg>
        </div>

        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: C.serif, fontWeight: 700, fontSize: "1.2rem", color: C.cream, lineHeight: 1.3 }}>{title}</p>
          <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.gold, marginTop: "0.25rem" }}>{subtitle}</p>
        </div>
        <div style={{ width: "2.5rem", height: "1px", background: C.gold }} />
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {pills.map((p) => (
            <div key={p.text} style={{ background: "rgba(255,255,255,0.07)", border: `1px solid rgba(255,255,255,0.12)`, borderRadius: "9999px", padding: "0.375rem 1rem", fontSize: "0.7rem", color: C.cream, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ color: p.neg ? C.red : C.gold, fontWeight: 700 }}>{p.neg ? "✕" : "✓"}</span> {p.text}
            </div>
          ))}
        </div>
        {extra}
      </div>
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────
export default function GlobalTalentVisaPage() {
  const [activeRoute, setActiveRoute] = useState<RouteTab>("Digital Technology");
  const [activeElig,  setActiveElig]  = useState<EligTab>("Digital Technology");
  const [openFaq,     setOpenFaq]     = useState<number | null>(0);

  const routeTabs = [
    { label: "Digital Technology"  as RouteTab, badge: "Most Popular",            bg: C.gold,    icon: "🤖", desc: "For exceptional or potential leaders in digital technology." },
    { label: "Academia / Research" as RouteTab, badge: "For Research Scholars",   bg: "#2c3e50", icon: "🔬", desc: "For outstanding or potential leaders in academia or research." },
    { label: "Arts & Culture"      as RouteTab, badge: "For Cultural Innovation", bg: "#4a3728", icon: "🎭", desc: "For leaders in arts, dance, literature, music, theatre, visual arts, fashion, film or TV." },
  ];

  const successData = [
    { label: "With 5 Papers", pct: 78 },
    { label: "With 6 Papers", pct: 85 },
    { label: "With 7 Papers", pct: 91 },
    { label: "With 8 Papers", pct: 96 },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.cream, fontFamily: "'Helvetica Neue', Arial, sans-serif", color: C.dark }}>

      {/* back link */}
      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "2rem 1.5rem 0" }}>
        <a href="/services" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, textDecoration: "none" }}>
          ← Back to Services
        </a>
      </div>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section style={{ background: C.cream, padding: "3rem 1.5rem" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "3rem", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: "280px" }}>
            <h1 style={{ fontFamily: C.serif, fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.02em", fontSize: "clamp(2.5rem,6vw,4.5rem)", color: C.dark, margin: 0 }}>
              APPLY FOR<br />
              <span style={{ color: C.gold }}>GLOBAL TALENT</span><br />
              VISA
            </h1>
            <GoldBar />
            <p style={{ color: C.muted, fontStyle: "italic", lineHeight: 1.7, maxWidth: "480px", fontSize: "0.95rem" }}>
              The <strong style={{ fontStyle: "normal", color: C.dark }}>UK Global Talent Visa (GTV)</strong> is a UK immigration visa for exceptional leaders or potential leaders in the <em>digital technology sector</em>, <em>academia and research</em>, or <em>arts and culture</em>.
            </p>

            <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
              <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: "1rem" }}>Includes</p>
              <div style={{ display: "flex", gap: "1.5rem" }}>
                {[{ icon: "🎥", label: "Video Call" }, { icon: "📞", label: "Audio Call" }, { icon: "💬", label: "Text Support" }].map((i) => (
                  <div key={i.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: "3rem", height: "3rem", borderRadius: "50%", background: C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>{i.icon}</div>
                    <span style={{ fontSize: "0.7rem", fontWeight: 500, color: C.muted }}>{i.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <button style={{ background: C.gold, color: "#fff", border: "none", borderRadius: "9999px", padding: "0.9rem 2rem", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.75rem" }}>
                Begin Consult →
              </button>
              <p style={{ fontSize: "0.75rem", color: C.muted, fontStyle: "italic" }}>Have questions? Let&apos;s chat.</p>
            </div>
          </div>

          {/* hero card */}
          <div style={{ flexShrink: 0, width: "min(22rem, 100%)", height: "22rem", position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "1.5rem", background: C.card, border: `1px solid ${C.border}` }} />
            <div style={{ position: "absolute", inset: "1rem", borderRadius: "1rem", background: `linear-gradient(135deg, ${C.dark} 0%, #2c2a20 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
              <div style={{ fontSize: "3rem" }}>🌍</div>
              <p style={{ fontFamily: C.serif, fontWeight: 700, fontSize: "1.4rem", color: C.cream, textAlign: "center", lineHeight: 1.2 }}>United Kingdom<br />Global Talent</p>
              <div style={{ width: "2.5rem", height: "1px", background: C.gold }} />
              <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.gold }}>Digital · Academia · Arts</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT SERVICE ────────────────────────────────────────── */}
      <section style={{ background: C.card, padding: "3.5rem 1.5rem" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
          <Label>About Service</Label>
          <SectionTitle>What is the Global Talent Visa?</SectionTitle>
          <GoldBar />
          <p style={{ color: C.muted, fontStyle: "italic", lineHeight: 1.7, fontSize: "0.95rem", maxWidth: "700px", marginBottom: "0.75rem" }}>
            The Global Talent Visa is a UK immigration visa for talented individuals recognised — or with the potential to be recognised — as leaders in{" "}
            <strong style={{ fontStyle: "normal", color: C.dark }}>digital technology</strong>,{" "}
            <strong style={{ fontStyle: "normal", color: C.dark }}>academia or research</strong>, and{" "}
            <strong style={{ fontStyle: "normal", color: C.dark }}>arts and culture</strong>.
          </p>
          <p style={{ color: C.muted, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
            <span style={{ color: C.gold }}>✓</span> Eligible applicants must be at least 18 years old.
          </p>

          <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: "1rem" }}>Different routes to GTV</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            {routeTabs.map((r) => (
              <div key={r.label} onClick={() => setActiveRoute(r.label)}
                style={{ borderRadius: "1rem", overflow: "hidden", cursor: "pointer", border: `2px solid ${activeRoute === r.label ? C.gold : C.border}`, background: C.cream, boxShadow: activeRoute === r.label ? `0 4px 20px ${C.gold}33` : "none", transition: "all 0.2s" }}>
                <div style={{ padding: "0.4rem 1rem", background: r.bg, color: "#fff", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center" }}>{r.badge}</div>
                <div style={{ padding: "1.25rem" }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{r.icon}</div>
                  <h5 style={{ fontFamily: C.serif, fontWeight: 700, fontSize: "0.875rem", color: C.dark, marginBottom: "0.25rem" }}>{r.label}</h5>
                  <p style={{ fontSize: "0.75rem", color: C.muted, lineHeight: 1.5 }}>{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ADVANTAGES & DISADVANTAGES ───────────────────────────── */}
      <section style={{ background: C.cream, padding: "3.5rem 1.5rem" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "2.5rem", alignItems: "stretch" }}>
          {/* left card */}
          <div style={{ flexShrink: 0, width: "min(20rem,100%)" }}>
            <DarkCard title={"UK Global\nTalent Visa"} subtitle="Benefits & Limitations"
              pills={[
                { text: "Up to 5-Year Visa" }, { text: "No Salary Limit" }, { text: "Family Included" },
                { text: "Work Freedom" }, { text: "Fast Processing" },
                { text: "Endorsement Needed", neg: true }, { text: "No Public Funds", neg: true },
              ]} />
          </div>

          {/* right column */}
          <div style={{ flex: 1, minWidth: "280px", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            <div>
              <Label>Benefits</Label>
              <SectionTitle>The UK GTV has the following advantages:</SectionTitle>
              <GoldBar />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1rem 2rem" }}>
                {advantages.map((item) => (
                  <div key={item.title} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <span style={{ flexShrink: 0, width: "1.25rem", height: "1.25rem", borderRadius: "50%", border: `1px solid ${C.gold}`, background: `${C.gold}18`, display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px" }}>
                      <svg style={{ width: "0.6rem", color: C.gold }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </span>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: "0.825rem", color: C.dark }}>{item.title}</p>
                      <p style={{ fontSize: "0.75rem", color: C.muted, marginTop: "0.15rem", lineHeight: 1.5, fontStyle: "italic" }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ height: "1px", background: C.border }} />

            <div>
              <Label>Limitations</Label>
              <SectionTitle>The UK GTV has the following disadvantages</SectionTitle>
              <div style={{ width: "3rem", height: "2px", background: C.red, borderRadius: "9999px", marginTop: "0.75rem", marginBottom: "1.5rem" }} />
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "1rem", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {disadvantages.map((item) => (
                  <div key={item.title} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <span style={{ flexShrink: 0, width: "1.25rem", height: "1.25rem", borderRadius: "50%", border: `1px solid ${C.red}`, background: `${C.red}18`, display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px" }}>
                      <svg style={{ width: "0.6rem", color: C.red }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" /></svg>
                    </span>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: "0.825rem", color: C.dark }}>{item.title}</p>
                      <p style={{ fontSize: "0.75rem", color: C.muted, marginTop: "0.15rem", lineHeight: 1.5, fontStyle: "italic" }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ELIGIBILITY ──────────────────────────────────────────── */}
      <section style={{ background: C.card, padding: "3.5rem 1.5rem" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "2.5rem", alignItems: "stretch" }}>
          {/* left card */}
          <div style={{ flexShrink: 0, width: "min(20rem,100%)" }}>
            <DarkCard title={"Eligibility\nCriteria"} subtitle="Are You Eligible?"
              pills={[
                { text: "Min. 18 years old" },
                { text: "Leader or Emerging Leader" },
                { text: "Digital / Academia / Arts" },
                { text: "Endorsement Required" },
                { text: "Direct Apply (with prize)" },
              ]}
              extra={
                <div style={{ background: `${C.gold}22`, border: `1px solid ${C.gold}44`, borderRadius: "1rem", padding: "0.875rem", textAlign: "center", width: "100%" }}>
                  <p style={{ fontSize: "0.65rem", fontWeight: 700, color: C.gold, marginBottom: "0.25rem" }}>Endorsing Bodies</p>
                  <p style={{ fontSize: "0.7rem", color: C.cream, lineHeight: 1.5 }}>Tech Nation · Royal Society<br />Arts Council England · BFI</p>
                </div>
              }
            />
          </div>

          {/* right content */}
          <div style={{ flex: 1, minWidth: "280px" }}>
            <Label>Eligibility</Label>
            <SectionTitle>Eligibility Criteria</SectionTitle>
            <GoldBar />
            <p style={{ color: C.muted, fontStyle: "italic", lineHeight: 1.7, fontSize: "0.875rem", marginBottom: "0.5rem" }}>
              To get a Global Talent Visa, you must first secure an endorsement confirming your status as a leader or emerging leader.
            </p>
            <p style={{ fontSize: "0.85rem", color: C.muted, marginBottom: "1.5rem" }}>
              <strong style={{ color: C.dark }}>Direct Application:</strong>{" "}
              <span style={{ fontStyle: "italic" }}>If you&apos;ve won a <span style={{ color: C.gold, textDecoration: "underline", cursor: "pointer" }}>listed international prize</span>, you can apply directly without an endorsement.</span>
            </p>

            {/* tabs */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
              {(["Digital Technology", "Academia / Research", "Arts & Culture"] as EligTab[]).map((tab) => (
                <button key={tab} onClick={() => setActiveElig(tab)} style={{
                  padding: "0.5rem 1.25rem", borderRadius: "9999px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                  background: activeElig === tab ? C.dark : "transparent",
                  color: activeElig === tab ? C.cream : C.muted,
                  border: `1px solid ${activeElig === tab ? C.dark : C.border}`,
                }}>
                  {tab}
                </button>
              ))}
            </div>
            {eligibilityContent[activeElig]}
          </div>
        </div>
      </section>

      {/* ── WHY GLOBAL COUNSELLING CENTER ────────────────────────── */}
      <section style={{ background: C.cream, padding: "3.5rem 1.5rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", textAlign: "center" }}>
          <Label>Why Us</Label>
          <SectionTitle>Why Choose Global Counselling Center?</SectionTitle>
          <div style={{ display: "flex", justifyContent: "center" }}><GoldBar /></div>
          <p style={{ color: C.muted, fontStyle: "italic", fontSize: "0.875rem", marginBottom: "2.5rem" }}>Our end-to-end GTV application services are unlike any other firm&apos;s.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "1.25rem" }}>
            {[{ icon: "🎓", title: "Free Eligibility Check" }, { icon: "📈", title: "Profile Boosting" }, { icon: "📝", title: "Expert Petition Strategy" }].map((item) => (
              <div key={item.title} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "1.25rem", padding: "2rem", textAlign: "center" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{item.icon}</div>
                <h4 style={{ fontFamily: C.serif, fontWeight: 700, color: C.dark, marginBottom: "0.75rem", fontSize: "0.95rem" }}>{item.title}</h4>
                <a href="#" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.gold, textDecoration: "none" }}>Learn more →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ─────────────────────────────────────────────── */}
      <section style={{ background: C.card, padding: "3.5rem 1.5rem" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "2.5rem", alignItems: "stretch" }}>
          {/* left card */}
          <div style={{ flexShrink: 0, width: "min(20rem,100%)" }}>
            <div style={{ position: "relative", borderRadius: "1.5rem", overflow: "hidden" }}>
              <div style={{ position: "absolute", bottom: "-12px", left: "-12px", width: "100%", height: "100%", background: C.border, borderRadius: "1.5rem" }} />
              <div style={{ position: "relative", background: C.dark, borderRadius: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem", padding: "1.75rem", minHeight: "420px", justifyContent: "center" }}>
                <div style={{ width: "5.5rem", height: "5.5rem", borderRadius: "50%", background: C.gold, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 24px ${C.gold}44` }}>
                  <svg style={{ width: "2.75rem", color: "#fff" }} fill="none" viewBox="0 0 48 48" stroke="currentColor">
                    <rect x="8" y="6" width="32" height="36" rx="4" strokeWidth={2} />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 16h16M16 24h16M16 32h8" />
                  </svg>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontFamily: C.serif, fontWeight: 700, fontSize: "1.2rem", color: C.cream, lineHeight: 1.3 }}>Application<br />Timeline</p>
                  <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.gold, marginTop: "0.25rem" }}>Step-by-Step</p>
                </div>
                <div style={{ width: "2.5rem", height: "1px", background: C.gold }} />
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {[{ n: "01", label: "Endorsement", time: "2–7 weeks" }, { n: "02", label: "Invitation", time: "60 days" }, { n: "03", label: "Visa Decision", time: "3–8 weeks" }].map((s) => (
                    <div key={s.n} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.75rem", padding: "0.625rem 1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span style={{ color: C.gold, fontWeight: 900, fontSize: "0.8rem", width: "1.75rem", flexShrink: 0 }}>{s.n}</span>
                      <div>
                        <p style={{ fontSize: "0.75rem", fontWeight: 600, color: C.cream }}>{s.label}</p>
                        <p style={{ fontSize: "0.7rem", color: C.muted }}>{s.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* right: vertical straight steps */}
          <div style={{ flex: 1, minWidth: "280px" }}>
            <Label>Process</Label>
            <SectionTitle>Timeline</SectionTitle>
            <GoldBar />
            <p style={{ color: C.muted, fontStyle: "italic", fontSize: "0.875rem", marginBottom: "2rem" }}>Here&apos;s how long it takes to get the GTV visa.</p>

            <div style={{ display: "flex", gap: "1.5rem" }}>
              {/* dots + line */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "0.25rem" }}>
                <div style={{ width: "1rem", height: "1rem", borderRadius: "50%", background: C.gold, flexShrink: 0, boxShadow: `0 0 0 4px ${C.card}` }} />
                <div style={{ width: "1px", flex: 1, margin: "0.25rem 0", background: C.border }} />
                <div style={{ width: "1rem", height: "1rem", borderRadius: "50%", background: C.dark, border: `2px solid ${C.gold}`, flexShrink: 0 }} />
                <div style={{ width: "1px", flex: 1, margin: "0.25rem 0", background: C.border }} />
                <div style={{ width: "1rem", height: "1rem", borderRadius: "50%", background: C.gold, flexShrink: 0, boxShadow: `0 0 0 4px ${C.card}` }} />
              </div>

              {/* cards */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {/* step 1 */}
                <div style={{ background: C.cream, border: `1px solid ${C.border}`, borderRadius: "1rem", padding: "1.25rem" }}>
                  <span style={{ display: "inline-block", background: `${C.gold}20`, color: C.gold, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.25rem 0.75rem", borderRadius: "9999px", marginBottom: "0.75rem" }}>Step 1</span>
                  <h4 style={{ fontFamily: C.serif, fontWeight: 700, color: C.dark, marginBottom: "0.75rem" }}>Endorsement Application</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    {[{ t: "Fast-track Endorsements", s: "Job offers, fellowships, research grants", time: "~2 weeks" }, { t: "Peer-reviewed Applications", s: "Standard endorsement review", time: "~5–7 weeks" }].map((c) => (
                      <div key={c.t} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "0.75rem", padding: "0.75rem" }}>
                        <p style={{ fontSize: "0.75rem", fontWeight: 600, color: C.dark, marginBottom: "0.25rem" }}>{c.t}</p>
                        <p style={{ fontSize: "0.7rem", color: C.muted, fontStyle: "italic", marginBottom: "0.5rem" }}>{c.s}</p>
                        <p style={{ fontSize: "0.7rem", fontWeight: 700, color: C.gold }}>🕐 {c.time}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* step 2 */}
                <div style={{ background: C.dark, borderRadius: "1rem", padding: "1.25rem" }}>
                  <span style={{ display: "inline-block", background: C.gold, color: "#fff", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.25rem 0.75rem", borderRadius: "9999px", marginBottom: "0.75rem" }}>Step 2</span>
                  <h4 style={{ fontFamily: C.serif, fontWeight: 700, color: C.cream, marginBottom: "0.5rem" }}>Invitation to Apply</h4>
                  <p style={{ fontSize: "0.8rem", color: C.muted, fontStyle: "italic", marginBottom: "0.75rem" }}>Applicants must submit within</p>
                  <div style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${C.gold}44`, borderRadius: "0.75rem", padding: "0.75rem" }}>
                    <p style={{ fontSize: "0.85rem", fontWeight: 700, color: C.cream }}>🕐 <span style={{ color: C.gold }}>60 days</span> from receiving the invite.</p>
                  </div>
                </div>

                {/* step 3 */}
                <div style={{ background: C.cream, border: `1px solid ${C.border}`, borderRadius: "1rem", padding: "1.25rem" }}>
                  <span style={{ display: "inline-block", background: `${C.gold}20`, color: C.gold, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.25rem 0.75rem", borderRadius: "9999px", marginBottom: "0.75rem" }}>Step 3</span>
                  <h4 style={{ fontFamily: C.serif, fontWeight: 700, color: C.dark, marginBottom: "0.75rem" }}>Visa Decision</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    {[{ t: "Outside the UK", time: "~3 weeks" }, { t: "Within the UK", time: "~8 weeks" }].map((c) => (
                      <div key={c.t} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "0.75rem", padding: "0.75rem" }}>
                        <p style={{ fontSize: "0.75rem", fontWeight: 600, color: C.dark, marginBottom: "0.25rem" }}>{c.t}</p>
                        <p style={{ fontSize: "0.7rem", fontWeight: 700, color: C.gold }}>🕐 {c.time}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: C.dark, borderRadius: "0.75rem", padding: "0.75rem" }}>
                    <p style={{ fontSize: "0.75rem", fontWeight: 600, color: C.cream, marginBottom: "0.25rem" }}>🏳️ Priority service</p>
                    <p style={{ fontSize: "0.7rem", color: C.muted, fontStyle: "italic" }}>Pay £500 extra to receive your decision within 5 working days.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DOCUMENTATION CHECKLIST ──────────────────────────────── */}
      <section style={{ background: C.cream, padding: "3.5rem 1.5rem" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "3rem", alignItems: "start" }}>
          <div>
            <Label>Documents</Label>
            <SectionTitle>Documentation Checklist</SectionTitle>
            <GoldBar />
            <p style={{ color: C.muted, fontStyle: "italic", fontSize: "0.875rem", marginBottom: "2rem" }}>All applicants must submit:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {[
                { n: 1, title: "Current CV", desc: "Detailing roles, dates, responsibilities." },
                { n: 2, title: "Personal Statement", desc: "500–1,000 words explaining your impact and ambitions." },
                { n: 3, title: "Letter Of Recommendation", desc: "1 LOR for Research & Academics · 3 for Arts & Culture · 3 for Digital Technology" },
                { n: 4, title: "Evidence Portfolio", desc: "Exceptional Talent: 2+ Talent items + up to 8 proof points. Exceptional Promise: 2+ Promise items + up to 8 proof points." },
                { n: 5, title: "Supporting Documents", desc: "GitHub/GitLab · Stack Overflow stats · Case studies · Media features · Research Papers, Citations, Patents." },
              ].map((item) => (
                <div key={item.n} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <span style={{ flexShrink: 0, width: "1.75rem", height: "1.75rem", borderRadius: "50%", background: C.gold, color: "#fff", fontSize: "0.7rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.n}</span>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "0.875rem", color: C.dark }}>{item.title}</p>
                    <p style={{ fontSize: "0.75rem", color: C.muted, marginTop: "0.15rem", lineHeight: 1.5, fontStyle: "italic" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "relative", width: "18rem", height: "22rem" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "1.5rem", background: C.border, transform: "translate(0.75rem, 0.75rem)" }} />
              <div style={{ position: "absolute", inset: 0, background: C.dark, borderRadius: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                <div style={{ fontSize: "3.5rem" }}>📄</div>
                <p style={{ fontFamily: C.serif, fontWeight: 700, fontSize: "1.1rem", color: C.cream, textAlign: "center", lineHeight: 1.3 }}>Prepare Your<br />Documents</p>
                <div style={{ width: "2.5rem", height: "1px", background: C.gold }} />
                <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.gold }}>Be Ready to Apply</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SUCCESS RATES ────────────────────────────────────────── */}
      <section style={{ background: C.card, padding: "3.5rem 1.5rem" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <Label>Track Record</Label>
            <SectionTitle>Global Counselling Center — Success Rate &amp; Pathways</SectionTitle>
            <div style={{ display: "flex", justifyContent: "center" }}><GoldBar /></div>
            <p style={{ color: C.muted, fontStyle: "italic", fontSize: "0.875rem" }}>Understand what you need on your profile to get approved.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "1.5rem" }}>
            {/* chart */}
            <div style={{ background: C.dark, borderRadius: "1.5rem", padding: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                <h4 style={{ fontFamily: C.serif, fontWeight: 700, color: C.cream }}>GTV Success Rate</h4>
                <span style={{ fontSize: "1.25rem" }}>🇬🇧</span>
              </div>
              <p style={{ fontSize: "0.75rem", color: C.muted, fontStyle: "italic", marginBottom: "1.5rem" }}>Based on petition outputs of our clients (2025)</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {successData.map((row) => (
                  <div key={row.label} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontSize: "0.7rem", color: C.muted, width: "6rem", flexShrink: 0 }}>{row.label}</span>
                    <div style={{ flex: 1, background: "rgba(255,255,255,0.07)", borderRadius: "9999px", height: "1rem", overflow: "hidden" }}>git commit -m "Your message"
                    
                      <div style={{ width: `${row.pct}%`, height: "100%", background: C.gold, borderRadius: "9999px" }} />
                    </div>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: C.gold, width: "2.5rem", textAlign: "right" }}>{row.pct}%</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <p style={{ fontSize: "0.8rem", textAlign: "center", fontWeight: 600, color: C.gold }}>Average 20–30 citations per paper (Total 150–250 citations)</p>
              </div>
            </div>

            {/* pathways */}
            <div style={{ background: C.cream, border: `1px solid ${C.border}`, borderRadius: "1.5rem", padding: "1.75rem" }}>
              <h4 style={{ fontFamily: C.serif, fontWeight: 700, color: C.dark, textAlign: "center", marginBottom: "0.25rem" }}>Other Pathways for Working Overseas</h4>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}><div style={{ width: "2.5rem", height: "1px", background: C.gold, marginTop: "0.5rem" }} /></div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  { flag: "🇺🇸", name: "United States (O-1 Visa)",           desc: "Fast Work Visa, No Lottery & Direct PR Pathway." },
                  { flag: "🇺🇸", name: "United States (EB-1 Visa)",           desc: "Fastest Green Card by Employment." },
                  { flag: "🇦🇺", name: "Australia (National Innovation Visa)", desc: "Work Visa & Direct PR (No Employer)." },
                  { flag: "🇺🇸", name: "United States (EB-2 NIW Visa)",        desc: "No Employer Needed, Direct PR Pathway." },
                  { flag: "🇸🇬", name: "Singapore ONE Pass",                   desc: "Top Talent Work Visa for Singapore." },
                ].map((p) => (
                  <div key={p.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem", background: C.card, border: `1px solid ${C.border}`, borderRadius: "0.75rem", cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span style={{ fontSize: "1.4rem" }}>{p.flag}</span>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: "0.8rem", color: C.dark }}>{p.name}</p>
                        <p style={{ fontSize: "0.7rem", color: C.muted, fontStyle: "italic" }}>{p.desc}</p>
                      </div>
                    </div>
                    <span style={{ color: C.gold }}>↗</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section style={{ background: C.cream, padding: "3.5rem 1.5rem" }}>
        <div style={{ maxWidth: "52rem", margin: "0 auto" }}>
          <div style={{ textAlign: "center" }}>
            <Label>Questions</Label>
            <SectionTitle>Frequently Asked Questions</SectionTitle>
            <div style={{ display: "flex", justifyContent: "center" }}><GoldBar /></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: "1rem", overflow: "hidden", background: C.card }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.5rem", background: "transparent", border: "none", cursor: "pointer", gap: "1rem", textAlign: "left" }}>
                  <span style={{ fontFamily: C.serif, fontWeight: 600, fontSize: "0.875rem", color: C.dark }}>{faq.q}</span>
                  <span style={{ flexShrink: 0, width: "1.75rem", height: "1.75rem", borderRadius: "50%", background: C.gold, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "1rem" }}>
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 1.5rem 1.25rem" }}>
                    <p style={{ fontSize: "0.85rem", color: C.muted, lineHeight: 1.7, fontStyle: "italic" }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ───────────────────────────────────────────── */}
    

    </div>
  );
}