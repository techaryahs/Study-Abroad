"use client";

import { useState, useEffect, useRef } from "react";

const benefits = [
  { icon: "🎓", text: "Admits from top-tier universities worldwide" },
  { icon: "💰", text: "Increased funding & research assistantships" },
  { icon: "🚀", text: "High-pay R&D job offers in elite firms" },
  { icon: "📄", text: "Bridges resume gaps with proven credibility" },
  { icon: "🌍", text: "O-1/EB-1 Visa — fast-track to green card" },
  { icon: "🇬🇧", text: "UK & Australia Global Talent Visa pathway" },
];

const publishers = ["Springer", "IEEE", "Elsevier", "Taylor & Francis"];

const chartData = [
  { uni: "Harvard", with: 50, without: 25 },
  { uni: "Stanford", with: 40, without: 20 },
  { uni: "MIT", with: 30, without: 20 },
  { uni: "Oxford", with: 25, without: 20 },
  { uni: "Cambridge", with: 10, without: 5 },
];

const stats = [
  { value: "500+", label: "Papers Published" },
  { value: "98%", label: "Success Rate" },
  { value: "3–4 Wks", label: "Turnaround" },
];

function useInView() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible] as const;
}

interface AnimatedBarProps {
  pct: number;
  gold: boolean;
  visible: boolean;
  delay: number;
}

function AnimatedBar({ pct, gold, visible, delay }: AnimatedBarProps) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setWidth(pct), delay);
    return () => clearTimeout(t);
  }, [visible, pct, delay]);
  return (
    <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{
          width: `${width}%`,
          background: gold ? "#eab308" : "rgba(255,255,255,0.22)",
          boxShadow: gold ? "0 0 10px rgba(234,179,8,0.4)" : "none",
        }}
      />
    </div>
  );
}

export default function ResearchPaperServicePage() {
  const [chartRef, chartVisible] = useInView();
  const [benefitsRef, benefitsVisible] = useInView();
  const [publishRef, publishVisible] = useInView();
  const [coauthors, setCoauthors] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const base = 69953;
  const original = 87442;
  const addon = coauthors * 4500;

  return (
    <div className="min-h-screen text-stone-100 overflow-x-hidden relative" style={{ background: "#0a0a0f", fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes spinCW  { from { transform: rotate(0deg); }   to { transform: rotate(360deg); } }
        @keyframes spinCCW { from { transform: rotate(0deg); }   to { transform: rotate(-360deg); } }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(234,179,8,0.45); }
          50%       { box-shadow: 0 0 0 10px rgba(234,179,8,0); }
        }
        @keyframes orbDrift1 {
          0%, 100% { transform: translate(0,0)   scale(1);    }
          50%       { transform: translate(40px,-30px) scale(1.15); }
        }
        @keyframes orbDrift2 {
          0%, 100% { transform: translate(0,0)    scale(1);   }
          50%       { transform: translate(-30px,20px) scale(0.9); }
        }

        .fd { font-family: 'Cormorant Garamond', Georgia, serif; }

        .afu  { animation: fadeUp    0.8s cubic-bezier(.16,1,.3,1) both; }
        .afl  { animation: floatY   6s ease-in-out infinite; }
        .acw  { animation: spinCW  22s linear infinite; }
        .accw { animation: spinCCW 32s linear infinite; }
        .aglow{ animation: pulseGlow 2.5s ease-in-out infinite; }
        .aorb1{ animation: orbDrift1 14s ease-in-out infinite; }
        .aorb2{ animation: orbDrift2 18s ease-in-out infinite; }

        .d1 { animation-delay: 0.10s; }
        .d2 { animation-delay: 0.20s; }
        .d3 { animation-delay: 0.30s; }
        .d4 { animation-delay: 0.40s; }
        .d5 { animation-delay: 0.55s; }

        .gold-shimmer {
          background: linear-gradient(90deg, #ca8a04, #fde68a, #ca8a04, #d4a555, #ca8a04);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .grid-texture {
          background-image:
            linear-gradient(rgba(202,138,4,0.10) 1px, transparent 1px),
            linear-gradient(90deg, rgba(202,138,4,0.10) 1px, transparent 1px);
          background-size: 72px 72px;
        }

        .card {
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(202,138,4,0.14);
          border-radius: 18px;
          transition: transform 0.35s ease, border-color 0.35s ease, background 0.35s ease;
        }
        .card:hover {
          transform: translateY(-4px);
          border-color: rgba(202,138,4,0.40);
          background: rgba(202,138,4,0.05);
        }

        .tag {
          display: inline-block;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #eab308;
          border: 1px solid rgba(202,138,4,0.38);
          border-radius: 999px;
          padding: 5px 16px;
        }

        .btn-gold {
          background: #ca8a04;
          color: #0a0a0f;
          font-weight: 500;
          border: none;
          border-radius: 999px;
          padding: 14px 32px;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.25s, transform 0.2s;
        }
        .btn-gold:hover { background: #eab308; transform: scale(1.04); }

        .btn-outline {
          background: transparent;
          color: #eab308;
          border: 1px solid rgba(202,138,4,0.42);
          border-radius: 12px;
          padding: 11px 20px;
          font-size: 13px;
          cursor: pointer;
          width: 100%;
          transition: background 0.25s, border-color 0.25s;
        }
        .btn-outline:hover { background: rgba(202,138,4,0.10); border-color: #eab308; }

        .stat-divider { border-right: 1px solid rgba(202,138,4,0.18); }
        .stat-divider:last-child { border-right: none; }

        input[type=number] { -moz-appearance: textfield; }
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }

        .field {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(202,138,4,0.20);
          border-radius: 12px;
          color: #f5f5f4;
          font-size: 13px;
          padding: 10px 14px;
          outline: none;
          margin-top: 6px;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.25s;
        }
        .field:focus { border-color: rgba(202,138,4,0.65); }
        select.field option { background: #111118; }

        .pub-pill {
          display: inline-flex;
          align-items: center;
          font-size: 11px;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: #eab308;
          border: 1px solid rgba(202,138,4,0.30);
          border-radius: 999px;
          padding: 8px 20px;
          cursor: default;
          transition: background 0.25s, border-color 0.25s, transform 0.25s;
        }
        .pub-pill:hover {
          background: rgba(202,138,4,0.10);
          border-color: rgba(202,138,4,0.65);
          transform: scale(1.04);
        }
      `}</style>

      {/* ── Ambient Background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="aorb1 absolute rounded-full" style={{ width: 520, height: 520, top: -160, right: -160, background: "radial-gradient(circle, rgba(202,138,4,0.13) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="aorb2 absolute rounded-full" style={{ width: 420, height: 420, bottom: -80, left: -160, background: "radial-gradient(circle, rgba(180,100,20,0.11) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute rounded-full" style={{ width: 300, height: 300, top: "50%", left: "50%", background: "radial-gradient(circle, rgba(234,179,8,0.05) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div className="absolute inset-0 grid-texture" />
      </div>

      {/* ── Page ── */}
      <div className="relative max-w-6xl mx-auto px-6 py-12" style={{ zIndex: 1 }}>

        {/* ══════════ HERO ══════════ */}
        <section className="mb-20">

          <div className={mounted ? "afu mb-6" : "opacity-0 mb-6"}>
            <span className="tag">Our Services</span>
          </div>

          <div className="grid gap-16 items-center" style={{ gridTemplateColumns: "1fr 1fr" }}>

            {/* Copy */}
            <div>
              <h1 className={`fd ${mounted ? "afu d1" : "opacity-0"}`}
                style={{ fontSize: "clamp(48px,6vw,76px)", fontWeight: 700, lineHeight: 1.0, letterSpacing: "-0.02em", marginBottom: 24 }}>
                Research<br />
                Paper <span className="gold-shimmer">Drafting</span><br />
                &amp; Publishing
              </h1>

              <p className={mounted ? "afu d2" : "opacity-0"}
                style={{ color: "#a8a29e", fontSize: 16, lineHeight: 1.7, maxWidth: 440, marginBottom: 28 }}>
                Publishing credible research papers with your name elevates your profile.
                Essential for MS/PhD applicants and O-1/EB-1 visa seekers aiming for elite outcomes.
              </p>

              <div className={`flex flex-wrap gap-3 ${mounted ? "afu d3" : "opacity-0"}`} style={{ marginBottom: 28 }}>
                {["📹 Video Call", "📞 Audio Call", "💬 Text Support"].map((f, i) => (
                  <span key={i} style={{ fontSize: 12, color: "#78716c", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 999, padding: "7px 16px" }}>{f}</span>
                ))}
              </div>

              <div className={`flex items-center gap-4 ${mounted ? "afu d4" : "opacity-0"}`}>
                <button className="btn-gold aglow">Discuss Your Case →</button>
                <span style={{ fontSize: 12, color: "#57534e" }}>Free consultation</span>
              </div>
            </div>

            {/* Orbital graphic */}
            <div className={`flex justify-center ${mounted ? "afu d3" : "opacity-0"}`}>
              <div className="relative" style={{ width: 280, height: 280 }}>
                <div className="acw absolute inset-0 rounded-full" style={{ border: "1px solid rgba(202,138,4,0.20)" }} />
                <div className="accw absolute rounded-full" style={{ inset: 24, border: "1px dashed rgba(202,138,4,0.12)" }} />
                <div className="afl absolute rounded-full flex flex-col items-center justify-center"
                  style={{ inset: 64, background: "rgba(202,138,4,0.08)", border: "1px solid rgba(202,138,4,0.28)" }}>
                  <span style={{ fontSize: 36, marginBottom: 4 }}>📄</span>
                  <span style={{ fontSize: 10, letterSpacing: "0.13em", textTransform: "uppercase", color: "#eab308" }}>Published</span>
                </div>
                {["IEEE", "Springer", "Elsevier"].map((label, i) => {
                  const angle = (i * 120 - 90) * (Math.PI / 180);
                  const r = 106, cx = 140, cy = 140;
                  return (
                    <div key={i} className="afl absolute"
                      style={{
                        left: cx + r * Math.cos(angle) - 26,
                        top: cy + r * Math.sin(angle) - 13,
                        fontSize: 11, color: "#eab308",
                        background: "rgba(202,138,4,0.10)",
                        border: "1px solid rgba(202,138,4,0.30)",
                        borderRadius: 999, padding: "5px 12px",
                        animationDelay: `${i * 0.9}s`,
                      }}>{label}</div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className={`flex ${mounted ? "afu d5" : "opacity-0"}`}
            style={{ marginTop: 48, border: "1px solid rgba(202,138,4,0.16)", borderRadius: 18, background: "rgba(255,255,255,0.03)", overflow: "hidden" }}>
            {stats.map(({ value, label }, i) => (
              <div key={i} className={`flex-1 text-center py-6 ${i < stats.length - 1 ? "stat-divider" : ""}`}>
                <p className="fd" style={{ fontSize: 32, fontWeight: 700, color: "#eab308", marginBottom: 4 }}>{value}</p>
                <p style={{ fontSize: 11, color: "#57534e", letterSpacing: "0.12em", textTransform: "uppercase" }}>{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════ MAIN GRID ══════════ */}
        <div className="grid gap-10" style={{ gridTemplateColumns: "1fr 360px" }}>

          {/* ── LEFT ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 64 }}>

            {/* Heading */}
            <div>
              <span className="tag" style={{ marginBottom: 20, display: "inline-block" }}>About Service</span>
              <h2 className="fd" style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.01em", marginBottom: 12 }}>Advantages of Research Papers</h2>
              <div style={{ width: 52, height: 2, background: "linear-gradient(90deg,#eab308,transparent)", borderRadius: 2, marginBottom: 12 }} />
              <p style={{ color: "#78716c", fontSize: 14 }}>Unlock a world of opportunities with your name on credible research.</p>
            </div>

            {/* Benefits */}
            <div ref={benefitsRef} className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {benefits.map((item, i) => (
                <div key={i} className="card p-6"
                  style={{
                    opacity: benefitsVisible ? 1 : 0,
                    transform: benefitsVisible ? "translateY(0)" : "translateY(28px)",
                    transition: `opacity 0.6s ease ${i * 70}ms, transform 0.6s ease ${i * 70}ms`,
                  }}>
                  <span style={{ fontSize: 30, display: "block", marginBottom: 14 }}>{item.icon}</span>
                  <p style={{ fontSize: 13, color: "#d6d3d1", lineHeight: 1.6 }}>{item.text}</p>
                </div>
              ))}
            </div>

            {/* Publishers */}
            <div ref={publishRef}
              style={{
                position: "relative", overflow: "hidden",
                border: "1px solid rgba(202,138,4,0.24)",
                background: "rgba(202,138,4,0.04)",
                borderRadius: 24, padding: "40px",
                opacity: publishVisible ? 1 : 0,
                transform: publishVisible ? "translateY(0)" : "translateY(28px)",
                transition: "opacity 0.7s ease, transform 0.7s ease",
              }}>
              <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle,rgba(202,138,4,0.14) 0%,transparent 70%)", filter: "blur(24px)", pointerEvents: "none" }} />
              <span className="tag" style={{ marginBottom: 20, display: "inline-block" }}>Guaranteed Publishing</span>
              <h3 className="fd" style={{ fontSize: 30, fontWeight: 600, marginBottom: 12, letterSpacing: "-0.01em" }}>High-Impact Research Publications</h3>
              <p style={{ color: "#a8a29e", fontSize: 14, lineHeight: 1.7, maxWidth: 480, marginBottom: 32 }}>
                We guarantee publication in world-renowned, peer-reviewed journals with global recognition.
              </p>
              <div className="flex flex-wrap gap-3">
                {publishers.map((p, i) => (
                  <span key={i} className="pub-pill">{p}</span>
                ))}
              </div>
            </div>

            {/* Chart */}
            <div ref={chartRef}>
              <span className="tag" style={{ marginBottom: 20, display: "inline-block" }}>Impact Analysis</span>
              <h3 className="fd" style={{ fontSize: 30, fontWeight: 600, marginBottom: 8, letterSpacing: "-0.01em" }}>Research Papers vs No Papers</h3>
              <p style={{ color: "#78716c", fontSize: 13, marginBottom: 32 }}>Admission rate comparison for applicants using our service.</p>

              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(202,138,4,0.10)", borderRadius: 18, padding: 32 }}>
                {/* Legend */}
                <div className="flex gap-6" style={{ marginBottom: 32 }}>
                  {[["#eab308", "With Research Paper"], ["rgba(255,255,255,0.22)", "Without Research Paper"]].map(([color, label], i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span style={{ width: 24, height: 2, background: color, display: "inline-block", borderRadius: 2 }} />
                      <span style={{ fontSize: 12, color: "#78716c" }}>{label}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                  {chartData.map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between" style={{ marginBottom: 10 }}>
                        <span className="fd" style={{ fontSize: 18, fontWeight: 600 }}>{item.uni}</span>
                        <span style={{ fontSize: 12, color: "#eab308" }}>{item.with}% vs {item.without}%</span>
                      </div>
                      <AnimatedBar pct={item.with} gold visible={chartVisible} delay={i * 130} />
                      <div style={{ height: 6 }} />
                      <AnimatedBar pct={item.without} gold={false} visible={chartVisible} delay={i * 130 + 80} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div style={{ position: "sticky", top: 32, height: "fit-content", display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Pricing card */}
            <div style={{ position: "relative", overflow: "hidden", background: "rgba(255,255,255,0.035)", border: "1px solid rgba(202,138,4,0.20)", borderRadius: 20, padding: 28 }}>
              <div style={{ position: "absolute", top: -32, right: -32, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle,rgba(202,138,4,0.15) 0%,transparent 70%)", filter: "blur(20px)", pointerEvents: "none" }} />
              <span className="tag" style={{ marginBottom: 16, display: "inline-block" }}>Limited Offer</span>
              <h3 className="fd" style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>Research Paper Drafting</h3>
              <p style={{ fontSize: 12, color: "#57534e", marginBottom: 24 }}>3–4 weeks from brief to publication</p>

              <div style={{ borderTop: "1px solid rgba(202,138,4,0.10)", paddingTop: 20, marginBottom: 16 }}>
                <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "#57534e", display: "block", marginBottom: 4 }}>Currency</label>
                <select className="field">
                  <option>INR — Indian Rupee</option>
                  <option>USD — US Dollar</option>
                </select>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "#57534e", display: "block", marginBottom: 4 }}>Additional Co-authors</label>
                <input
                  type="number"
                  className="field"
                  min={0} max={5}
                  value={coauthors}
                  onChange={e => setCoauthors(Math.max(0, parseInt(e.target.value) || 0))}
                />
                {coauthors > 0 && (
                  <p style={{ fontSize: 11, color: "#eab308", marginTop: 6 }}>+₹{(coauthors * 4500).toLocaleString()} for {coauthors} co-author{coauthors > 1 ? "s" : ""}</p>
                )}
              </div>

              <div style={{ borderTop: "1px solid rgba(202,138,4,0.10)", paddingTop: 20, marginBottom: 24 }}>
                <p style={{ fontSize: 13, color: "#44403c", textDecoration: "line-through", marginBottom: 4 }}>₹{(original + addon).toLocaleString()}</p>
                <p className="fd" style={{ fontSize: 38, fontWeight: 700, color: "#eab308", lineHeight: 1 }}>₹{(base + addon).toLocaleString()}</p>
                <p style={{ fontSize: 11, color: "#57534e", marginTop: 6 }}>Save ₹{(original - base).toLocaleString()} today</p>
              </div>

              <button className="btn-gold aglow" style={{ width: "100%", borderRadius: 12 }}>Log In to Pay</button>
            </div>

            {/* Chat card */}
            <div style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(202,138,4,0.14)", borderRadius: 20, padding: "24px", textAlign: "center" }}>
              <span style={{ fontSize: 30, display: "block", marginBottom: 12 }}>💬</span>
              <h4 className="fd" style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Have Questions?</h4>
              <p style={{ fontSize: 12, color: "#57534e", marginBottom: 18 }}>Our advisors are available 24/7</p>
              <button className="btn-outline">Message Now</button>
            </div>

            {/* Group card */}
            <div style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(202,138,4,0.14)", borderRadius: 20, padding: "24px" }}>
              <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
                <span style={{ fontSize: 24 }}>🔬</span>
                <div>
                  <h4 className="fd" style={{ fontSize: 16, fontWeight: 600 }}>Join Research Group</h4>
                  <p style={{ fontSize: 11, color: "#57534e" }}>Collaborate &amp; grow</p>
                </div>
              </div>
              <div style={{ background: "rgba(202,138,4,0.06)", border: "1px solid rgba(202,138,4,0.14)", borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: "#e7e5e4", marginBottom: 2 }}>Construction Project Management</p>
                <p style={{ fontSize: 11, color: "#57534e" }}>24 members active</p>
              </div>
              <button className="btn-gold" style={{ width: "100%", borderRadius: 12, padding: "11px 20px" }}>Join Group</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}