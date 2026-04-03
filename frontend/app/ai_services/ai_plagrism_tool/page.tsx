"use client";

import { useState } from "react";

// ── DARK GOLD THEME TOKENS ──
const gold = "#c9a84c";
const goldLight = "#e2c97e";
const goldDark = "#8a6f2e";
const bgBase = "#0d0d0d";
const bgSurface = "#141414";
const bgElevated = "#1c1c1c";
const bgBorder = "#2e2618";
const textPrimary = "#f0e6cc";
const textSub = "#a89060";
const textMuted = "#7a6a50";

const detectors = [
    { name: "Turnitin", icon: "🔵" },
    { name: "GPTZero", icon: "🔷" },
    { name: "Originality.ai", icon: "🟣" },
    { name: "Grammarly", icon: "🟢" },
    { name: "Copyleaks", icon: "⚫" },
    { name: "Quillbot", icon: "🤖" },
    { name: "Other leading AI detectors", icon: "⚙️" },
];

const features = [
    { icon: "🖥️", title: "AI Detection Remover", desc: "Makes your essays undetectable by AI checkers like Turnitin and GPTZero." },
    { icon: "🤖", title: "Plagiarism Bypass Made Easy", desc: "Smart rewriting to pass plagiarism checks without losing meaning." },
    { icon: "✍️", title: "Human-Like Writing Style", desc: "Writes naturally so your work sounds like you, not a bot." },
    { icon: "⚙️", title: "Adjustable AI Removal", desc: "Control AI text by choosing light, moderate, or full rewrite." },
    { icon: "📖", title: "Grammar & Readability Boost", desc: "Fixes grammar and makes your writing smoother for professors." },
    { icon: "🛡️", title: "Safe & Private", desc: "Your files are never stored or shared - 100% confidential." },
];

const refinements = [
    { emoji: "💬", title: "Speak Like a Human", desc: "Swap stiff, robotic phrases for natural, relatable language that flows effortlessly." },
    { emoji: "🔗", title: "Create Seamless Flow", desc: "Make your ideas connect smoothly by refining transitions and clarifying meaning." },
    { emoji: "🖥", title: "Eliminate Echoes", desc: "Avoid the trap of repeated words and phrases. Keep your content dynamic and engaging." },
    { emoji: "🎛", title: "Take Full Control", desc: "Choose how much we transform your text from subtle tweaks to complete rewrites." },
];

const useCases = [
    { tag: "SOPs", title: "SOPs & LORs", desc: "Refine your SOPs and recommendation letters to sound personal and polished." },
    { tag: "Research", title: "Publishing Research", desc: "Avoid AI-triggered plagiarism checks with natural-sounding text." },
    { tag: "Blogging", title: "Blogging & Content", desc: "Scale content creation while keeping your authentic voice intact." },
    { tag: "Academia", title: "Academic Writing", desc: "Submit essays and papers that pass all institutional detection tools." },
    { tag: "Essays", title: "Essays", desc: "Humanize any AI-assisted essay to sound genuinely student-authored." },
    { tag: "Resume / CVs", title: "Resume / CVs", desc: "Make your resume sound polished, personal, and recruiter-ready." },
];

const plans = [
    {
        name: "Starter", originalPrice: "USD 20.00", price: "12.00", highlight: false, badge: null,
        features: ["Up to 20,000 words per month", "Light & Medium humanize levels", "Basic grammar boost", "Email support"],
    },
    {
        name: "Growth", originalPrice: "USD 70.00", price: "39.20", highlight: true, badge: "VALUE",
        features: ["Up to 100,000 words per month", "All humanize levels (Light, Medium, Max)", "Advanced grammar & readability", "Priority support", "Plagiarism bypass mode"],
    },
    {
        name: "Pro", originalPrice: "USD 250.00", price: "159.20", highlight: false, badge: null,
        features: ["Unlimited words per month", "All features + API access", "Dedicated account manager", "Team collaboration tools", "Custom integration support"],
    },
];

const faqs = [
    { q: "How does this tool bypass AI detection?", a: "Our tool rewrites content using advanced paraphrasing techniques that make text appear more natural and human-like, avoiding detection by AI checkers." },
    { q: "Will the meaning of my text change after rewriting?", a: "No. Our system is trained to preserve the original intent and meaning while only altering the style, structure, and phrasing to sound more human." },
    { q: "Is my data safe and confidential?", a: "Absolutely. We do not store, log, or share any text you submit. Your content is processed in memory and discarded immediately after." },
    { q: "Does this tool work for all AI detectors?", a: "We actively test against the leading detectors including Turnitin, GPTZero, Originality.ai, Grammarly, Copyleaks, and Quillbot." },
    { q: "Is there a limit to how much text I can process?", a: "Limits depend on your plan. Our Starter plan includes 20,000 words/month, Growth includes 100,000 words/month, and Pro is unlimited." },
];

const trustedLogos = ["Stanford University", "IEEE", "MIT", "Elsevier", "Forbes", "Harvard University"];

const S = {
    label: { fontSize: 11, letterSpacing: "0.15em", color: gold, textTransform: "uppercase" as const, marginBottom: "0.5rem", fontFamily: "sans-serif" } as React.CSSProperties,
    h2: { fontSize: "2rem", fontWeight: 700, color: textPrimary, marginBottom: "0.5rem", fontFamily: "'Georgia', serif" } as React.CSSProperties,
    sub: { color: textMuted, marginBottom: "3.5rem", fontSize: "0.88rem", fontFamily: "sans-serif" } as React.CSSProperties,
    goldIcon: { width: 40, height: 40, background: "linear-gradient(135deg, #1e1608, #2a1f08)", border: `1px solid ${goldDark}66`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: gold, marginBottom: "1rem", fontSize: "1.1rem" } as React.CSSProperties,
    card: { background: bgSurface, border: `1px solid ${bgBorder}`, borderRadius: 20, padding: "2rem" } as React.CSSProperties,
    btn: { background: gold, color: "#0d0d0d", padding: "10px 24px", borderRadius: 10, fontWeight: 700, fontSize: "0.85rem", border: "none", cursor: "pointer", fontFamily: "sans-serif" } as React.CSSProperties,
    btnOutline: { background: "transparent", color: textSub, padding: "10px 24px", borderRadius: 10, fontWeight: 600, fontSize: "0.85rem", border: `1px solid ${bgBorder}`, cursor: "pointer", fontFamily: "sans-serif" } as React.CSSProperties,
};

export default function AIHumanizerPage() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [level, setLevel] = useState("Max");
    const [loading, setLoading] = useState(false);
    const [faqOpen, setFaqOpen] = useState<number | null>(0);
    const [activeUseCase, setActiveUseCase] = useState("SOPs");
    const [currency, setCurrency] = useState("USD");

    const handleRewrite = () => {
        if (!input.trim()) return;
        setLoading(true);
        setOutput("");
        setTimeout(() => {
            setOutput("This is your humanized output. Our advanced rewriting engine has transformed your AI-generated content into natural, human-sounding prose. The meaning and intent remain fully intact while all detectable AI patterns have been removed, ensuring your writing passes even the most rigorous detection tools.");
            setLoading(false);
        }, 1800);
    };

    return (
        <div style={{ background: bgBase, color: textPrimary, fontFamily: "'Georgia', serif" }}>
            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        textarea::placeholder { color: ${textMuted}; }
        select option { background: ${bgElevated}; color: ${textPrimary}; }
        @media (max-width: 768px) {
          .grid-2 { grid-template-columns: 1fr !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .grid-4 { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

            {/* ── HERO ── */}
            <section style={{ background: `radial-gradient(ellipse at 60% 0%, #251a06 0%, #110e04 50%, ${bgBase} 100%)`, borderBottom: `1px solid ${bgBorder}`, padding: "120px 1.5rem 4rem" }}>
                <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
                    <div style={{ display: "inline-block", background: `linear-gradient(90deg, ${goldDark}33, ${gold}22, ${goldDark}33)`, border: `1px solid ${goldDark}66`, borderRadius: 99, padding: "4px 18px", fontSize: 11, letterSpacing: "0.15em", color: gold, marginBottom: "1.5rem", textTransform: "uppercase", fontFamily: "sans-serif" }}>
                        AI Paraphrasing Tool
                    </div>
                    <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)", fontWeight: 700, color: textPrimary, marginBottom: "1rem", lineHeight: 1.15, fontFamily: "'Georgia', serif" }}>
                        AI Remover &amp;{" "}
                        <span style={{ color: gold }}>Plagiarism Bypass</span> Tool
                    </h1>
                    <p style={{ color: textSub, marginBottom: "2.5rem", fontSize: "1rem", maxWidth: 560, margin: "0 auto 2.5rem", fontFamily: "sans-serif", lineHeight: 1.6 }}>
                        Easily rewrite your text to bypass AI detection and plagiarism checks while maintaining clarity and readability.
                    </p>

                    {/* Input Card */}
                    <div style={{ background: bgSurface, border: `1px solid ${bgBorder}`, borderRadius: 20, padding: "1.75rem", boxShadow: `0 0 60px ${gold}0d`, textAlign: "left" }}>
                        <p style={{ ...S.label, marginBottom: "0.75rem" }}>Your input content</p>
                        <div style={{ position: "relative" }}>
                            <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Got something on your mind? Start typing..." rows={7}
                                style={{ width: "100%", padding: "1rem", borderRadius: 12, border: `1px solid ${input ? goldDark + "99" : bgBorder}`, background: bgElevated, color: textPrimary, fontSize: "0.9rem", outline: "none", resize: "none", transition: "border-color 0.2s", fontFamily: "sans-serif", lineHeight: 1.6 }} />
                            {!input && (
                                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, border: `2px dashed ${goldDark}77`, borderRadius: 12, padding: "1.5rem 2.5rem", color: textMuted, fontSize: "0.85rem", fontFamily: "sans-serif" }}>
                                        <span style={{ fontSize: "1.5rem" }}>📋</span><span>Paste text</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
                            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                                <span style={{ fontSize: "0.82rem", color: textMuted, fontFamily: "sans-serif" }}>Humanize Level:</span>
                                {["Light", "Medium", "Max"].map((l) => (
                                    <button key={l} onClick={() => setLevel(l)} style={{ padding: "6px 16px", borderRadius: 8, fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", border: `1px solid ${level === l ? gold : bgBorder}`, background: level === l ? gold : "transparent", color: level === l ? "#0d0d0d" : textMuted, transition: "all 0.15s", fontFamily: "sans-serif" }}>{l}</button>
                                ))}
                            </div>
                            <button onClick={handleRewrite} disabled={loading} style={{ background: loading ? goldDark : gold, color: "#0d0d0d", padding: "9px 24px", borderRadius: 10, fontWeight: 700, fontSize: "0.88rem", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "background 0.2s", fontFamily: "sans-serif" }}>
                                {loading ? <><span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid #0d0d0d", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />Processing...</> : "Paraphrase →"}
                            </button>
                        </div>
                        {output && (
                            <div style={{ marginTop: "1.25rem", padding: "1rem 1.25rem", background: "linear-gradient(135deg, #1a1a0d, #141408)", border: `1px solid ${goldDark}66`, borderRadius: 12, fontSize: "0.88rem", color: textPrimary, lineHeight: 1.7, fontFamily: "sans-serif" }}>
                                <p style={{ fontSize: 11, color: gold, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem", fontFamily: "sans-serif" }}>✦ Humanized Output</p>
                                {output}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ── DETECTORS ── */}
            <section style={{ padding: "3rem 1.5rem", borderBottom: `1px solid ${bgBorder}`, background: bgSurface }}>
                <p style={{ textAlign: "center", color: textMuted, fontSize: "0.82rem", marginBottom: "2rem", letterSpacing: "0.05em", fontFamily: "sans-serif" }}>Our Humanizer can bypass these AI and Plagiarism detectors</p>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2rem", maxWidth: 860, margin: "0 auto" }}>
                    {detectors.map((d) => (
                        <div key={d.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 48, height: 48, borderRadius: "50%", background: bgElevated, border: `1px solid ${bgBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }}>{d.icon}</div>
                            <span style={{ fontSize: "0.72rem", color: textMuted, fontFamily: "sans-serif" }}>{d.name}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section style={{ padding: "5rem 1.5rem", borderBottom: `1px solid ${bgBorder}` }}>
                <div className="grid-2" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
                    <div>
                        <p style={S.label}>Process</p>
                        <h2 style={S.h2}>How It Works</h2>
                        <p style={{ color: textMuted, marginBottom: "2.5rem", fontFamily: "sans-serif", fontSize: "0.9rem" }}>Transform your AI content in three simple steps</p>
                        <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                            <div style={{ flex: 1, background: "#1a0808", border: "1px solid #4a1a1a", borderRadius: 12, padding: "1rem" }}>
                                <p style={{ fontSize: 11, color: "#e05555", marginBottom: "0.5rem", fontFamily: "sans-serif", fontWeight: 600 }}>100% AI Content</p>
                                <p style={{ fontSize: "0.75rem", color: "#c06060", lineHeight: 1.6, fontFamily: "sans-serif" }}>Utilizing advanced algorithms, our system ensures optimal efficiency in processing requests. The integration of machine learning enhances accuracy...</p>
                            </div>
                            <div style={{ color: gold, fontSize: "1.25rem", paddingTop: "2rem", flexShrink: 0 }}>→</div>
                            <div style={{ flex: 1, background: "#0a1a0a", border: "1px solid #1a4a1a", borderRadius: 12, padding: "1rem" }}>
                                <p style={{ fontSize: 11, color: "#55b855", marginBottom: "0.5rem", fontFamily: "sans-serif", fontWeight: 600 }}>0% AI Content</p>
                                <p style={{ fontSize: "0.75rem", color: "#60a060", lineHeight: 1.6, fontFamily: "sans-serif" }}>Our smart system uses clever algorithms to handle requests quickly and accurately. Thanks to machine learning, it works smoothly and cuts delays...</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginBottom: "2.5rem" }}>
                            {[
                                { n: "1", title: "Paste Your AI Content", desc: "Simply copy and paste your AI-generated text into our intuitive editor." },
                                { n: "2", title: "Choose Your Style", desc: "Select the option that suits you best (Light, Medium or Max)." },
                                { n: "3", title: "Get Human-Like Results", desc: "Instantly receive natural, emotionally intelligent content that sounds authentically human." },
                            ].map((step) => (
                                <div key={step.n} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                                    <div style={{ width: 36, height: 36, borderRadius: "50%", border: `2px solid ${goldDark}`, display: "flex", alignItems: "center", justifyContent: "center", color: gold, fontWeight: 700, fontSize: "0.85rem", flexShrink: 0, fontFamily: "sans-serif" }}>{step.n}</div>
                                    <div>
                                        <h3 style={{ fontWeight: 600, color: textPrimary, marginBottom: "0.25rem", fontFamily: "sans-serif", fontSize: "0.95rem" }}>{step.title}</h3>
                                        <p style={{ color: textMuted, fontSize: "0.85rem", fontFamily: "sans-serif", lineHeight: 1.5 }}>{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                            <button style={S.btn}>Check Plans ↓</button>
                            <button style={S.btnOutline}>Know More</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── STATS ── */}
            <section style={{ padding: "5rem 1.5rem", background: bgSurface, borderBottom: `1px solid ${bgBorder}` }}>
                <p style={{ ...S.label, textAlign: "center" }}>Performance</p>
                <h2 style={{ ...S.h2, textAlign: "center" }}>Proven to Perform — Built for Real Results</h2>
                <p style={{ ...S.sub, textAlign: "center" }}>Here's why users are switching to the Humanizer.</p>
                <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", maxWidth: 900, margin: "0 auto" }}>
                    {[
                        { stat: "99.1%", label: "Accuracy", sub: "in preserving original meaning and intent", icon: "✦" },
                        { stat: "98.6%", label: "Success Rate", sub: "bypassing GPTZero, Turnitin, and Copyleaks", icon: "◈" },
                        { stat: "<1%", label: "Error Rate", sub: "in grammar, structure, or logical flow", icon: "◉" },
                    ].map((s) => (
                        <div key={s.label} style={{ textAlign: "center" }}>
                            <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg, #1e1608, #2a1f08)", border: `1px solid ${goldDark}66`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", color: gold, margin: "0 auto 1rem" }}>{s.icon}</div>
                            <h3 style={{ fontSize: "1.75rem", fontWeight: 700, color: gold, marginBottom: "0.25rem", fontFamily: "'Georgia', serif" }}>{s.stat}</h3>
                            <p style={{ fontWeight: 600, color: textPrimary, fontSize: "0.9rem", marginBottom: "0.25rem", fontFamily: "sans-serif" }}>{s.label}</p>
                            <p style={{ color: textMuted, fontSize: "0.78rem", fontFamily: "sans-serif" }}>{s.sub}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── WHY TRUST ── */}
            <section style={{ padding: "5rem 1.5rem", borderBottom: `1px solid ${bgBorder}` }}>
                <p style={{ ...S.label, textAlign: "center" }}>Trust</p>
                <h2 style={{ ...S.h2, textAlign: "center" }}>Why You Can Trust Our AI Humanizer</h2>
                <p style={{ ...S.sub, textAlign: "center", maxWidth: 500, margin: "0 auto 3rem" }}>We understand the risks of being flagged — and we've built our tool to handle it with precision.</p>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
                        <div style={S.card}>
                            <div style={S.goldIcon}>⚖️</div>
                            <h3 style={{ fontWeight: 700, color: textPrimary, marginBottom: "0.5rem", fontFamily: "sans-serif" }}>Built on Real Testing, Not Guesswork</h3>
                            <p style={{ color: textMuted, fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "1.5rem", fontFamily: "sans-serif" }}>Our AI humanizer has been trained using thousands of real examples of flagged AI content. It doesn't just rewrite; it learns what works across detection tools and adapts.</p>
                            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                                {["AI", "Human"].map((label) => (
                                    <div key={label} style={{ flex: 1, background: bgElevated, border: `1px solid ${bgBorder}`, borderRadius: 10, padding: "0.75rem" }}>
                                        <p style={{ fontSize: 11, color: textMuted, marginBottom: "0.5rem", fontFamily: "sans-serif" }}>{label}</p>
                                        {[100, 75, 85].map((w, i) => <div key={i} style={{ height: 5, background: bgBorder, borderRadius: 3, marginBottom: 4, width: `${w}%` }} />)}
                                    </div>
                                ))}
                                <span style={{ color: gold, fontSize: "1.1rem" }}>→</span>
                                <div style={{ flex: 1, background: "#0d2010", border: "1px solid #1a5020", borderRadius: 10, padding: "0.75rem", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                                    <span style={{ fontSize: "1.2rem", color: "#44cc66" }}>✓</span>
                                    <p style={{ fontSize: 11, color: "#44cc66", fontWeight: 700, textAlign: "center", fontFamily: "sans-serif" }}>Detection: Passed</p>
                                </div>
                            </div>
                        </div>
                        <div style={S.card}>
                            <div style={S.goldIcon}>👁️</div>
                            <h3 style={{ fontWeight: 700, color: textPrimary, marginBottom: "0.5rem", fontFamily: "sans-serif" }}>Tuned for Real-World Scenarios</h3>
                            <p style={{ color: textMuted, fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "1.5rem", fontFamily: "sans-serif" }}>Whether it's academic writing, professional communication, or long-form content, our tool is field-tested to sound authentic, natural, and undetectable.</p>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <div style={{ background: bgElevated, border: `1px solid ${goldDark}44`, borderRadius: 14, padding: "1.25rem 2.5rem", display: "flex", alignItems: "center", gap: 10 }}>
                                    <div style={{ width: 28, height: 28, background: "#1a3a25", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#44cc66" }}>✓</div>
                                    <p style={{ fontWeight: 600, color: textPrimary, fontFamily: "sans-serif", fontSize: "0.9rem" }}>Humanized</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid-2" style={{ ...S.card, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                        <div>
                            <div style={S.goldIcon}>🔄</div>
                            <h3 style={{ fontWeight: 700, color: textPrimary, marginBottom: "0.5rem", fontFamily: "sans-serif" }}>Always Evolving</h3>
                            <p style={{ color: textMuted, fontSize: "0.85rem", lineHeight: 1.6, fontFamily: "sans-serif" }}>Our AI Humanizer is updated every few months to keep your content ahead of evolving AI detectors. Stay confident knowing you're always protected.</p>
                        </div>
                        <div style={{ background: bgElevated, border: `1px solid ${bgBorder}`, borderRadius: 14, padding: "1.25rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                <div style={{ fontFamily: "sans-serif", fontSize: "0.78rem", color: textMuted, lineHeight: 1.9 }}>
                                    <p>● Turnitin — <span style={{ color: "#44cc66" }}>0% AI</span></p>
                                    <p>● Quillbot — <span style={{ color: "#44cc66" }}>0% AI</span></p>
                                    <p>● Others — <span style={{ color: "#44cc66" }}>0% AI</span></p>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <p style={{ fontSize: "0.72rem", color: textMuted, fontFamily: "sans-serif" }}>June 2025</p>
                                    <p style={{ fontSize: "1.3rem", fontWeight: 700, color: textPrimary }}>0% AI</p>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 56 }}>
                                {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => (
                                    <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
                                        <div style={{ width: "100%", height: `${[30, 50, 45, 60, 40, 55][i]}%`, background: `${gold}55`, borderRadius: "2px 2px 0 0" }} />
                                        <div style={{ width: "100%", height: `${[20, 30, 35, 25, 30, 20][i]}%`, background: `${gold}88`, borderRadius: "2px 2px 0 0" }} />
                                        <p style={{ fontSize: 9, color: textMuted, fontFamily: "sans-serif" }}>{m}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── WHO CAN USE ── */}
            <section style={{ padding: "5rem 1.5rem", background: bgSurface, borderBottom: `1px solid ${bgBorder}` }}>
                <div className="grid-2" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
                    <div>
                        <h2 style={{ fontSize: "2.2rem", fontWeight: 700, lineHeight: 1.2, color: textPrimary, marginBottom: "1.5rem", fontFamily: "'Georgia', serif" }}>
                            Who Can Get the Most Value from Our{" "}
                            <span style={{ background: gold, color: "#0d0d0d", padding: "0 6px", borderRadius: 4 }}>AI Humanizer?</span>
                        </h2>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginBottom: "2rem" }}>
                            {useCases.map((u) => (
                                <button key={u.tag} onClick={() => setActiveUseCase(u.tag)} style={{ border: `1px solid ${activeUseCase === u.tag ? gold : bgBorder}`, background: activeUseCase === u.tag ? gold : "transparent", color: activeUseCase === u.tag ? "#0d0d0d" : textSub, padding: "6px 16px", borderRadius: 99, fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", fontFamily: "sans-serif", transition: "all 0.15s" }}>{u.tag}</button>
                            ))}
                        </div>
                        <button style={S.btn}>Check Plans ↓</button>
                    </div>
                    <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        {useCases.slice(0, 4).map((u) => (
                            <div key={u.tag} onClick={() => setActiveUseCase(u.tag)} style={{ background: activeUseCase === u.tag ? "linear-gradient(135deg, #1e1608, #2a1f08)" : bgElevated, border: `1px solid ${activeUseCase === u.tag ? goldDark : bgBorder}`, borderRadius: 14, padding: "1rem", cursor: "pointer", transition: "all 0.15s", boxShadow: activeUseCase === u.tag ? `0 0 20px ${gold}18` : "none" }}>
                                <div style={{ width: 32, height: 32, background: bgSurface, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.75rem" }}>📄</div>
                                <h4 style={{ fontWeight: 600, fontSize: "0.85rem", color: textPrimary, marginBottom: "0.25rem", fontFamily: "sans-serif" }}>{u.title}</h4>
                                <p style={{ fontSize: "0.75rem", color: textMuted, fontFamily: "sans-serif", lineHeight: 1.5 }}>{u.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section style={{ padding: "5rem 1.5rem", borderBottom: `1px solid ${bgBorder}` }}>
                <p style={{ ...S.label, textAlign: "center" }}>Capabilities</p>
                <h2 style={{ ...S.h2, textAlign: "center" }}>Make Your Writing Undetectable &amp; Plagiarism-Free</h2>
                <p style={{ ...S.sub, textAlign: "center" }}>Bypass AI &amp; Plagiarism Checks While Keeping Your Work Authentic</p>
                <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", maxWidth: 1100, margin: "0 auto" }}>
                    {features.map((f) => (
                        <div key={f.title} style={{ textAlign: "center", padding: "2rem 1.5rem", background: bgSurface, border: `1px solid ${bgBorder}`, borderRadius: 16 }}>
                            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{f.icon}</div>
                            <h3 style={{ fontWeight: 600, color: textPrimary, marginBottom: "0.4rem", fontFamily: "sans-serif", fontSize: "0.95rem" }}>{f.title}</h3>
                            <p style={{ color: textMuted, fontSize: "0.82rem", fontFamily: "sans-serif", lineHeight: 1.6 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── TEXT REFINEMENT ── */}
            <section style={{ padding: "5rem 1.5rem", background: bgSurface, borderBottom: `1px solid ${bgBorder}` }}>
                <p style={{ ...S.label, textAlign: "center" }}>Refinement</p>
                <h2 style={{ ...S.h2, textAlign: "center" }}>What Our Text Refinement Tool Can Do for You</h2>
                <p style={{ ...S.sub, textAlign: "center" }}>Craft writing that reads like you - not a robot.</p>
                <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem", maxWidth: 1100, margin: "0 auto" }}>
                    {refinements.map((r) => (
                        <div key={r.title} style={{ background: bgElevated, border: `1px solid ${bgBorder}`, borderRadius: 16, padding: "1.5rem" }}>
                            <div style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>✅</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "0.75rem" }}>
                                <span style={{ fontSize: "1rem" }}>{r.emoji}</span>
                                <h3 style={{ fontWeight: 600, fontSize: "0.88rem", color: textPrimary, fontFamily: "sans-serif" }}>{r.title}</h3>
                            </div>
                            <p style={{ color: textMuted, fontSize: "0.78rem", fontFamily: "sans-serif", lineHeight: 1.6 }}>{r.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── PRICING ── */}
            <section style={{ padding: "5rem 1.5rem", borderBottom: `1px solid ${bgBorder}` }}>
                <p style={{ ...S.label, textAlign: "center" }}>Pricing</p>
                <h2 style={{ ...S.h2, textAlign: "center" }}>Affordable Plans for Maximum Impact</h2>
                <p style={{ ...S.sub, textAlign: "center" }}>Choose the plan that suits your needs:</p>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "2.5rem" }}>
                    <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ background: bgElevated, border: `1px solid ${bgBorder}`, borderRadius: 8, padding: "8px 16px", color: textPrimary, fontSize: "0.85rem", fontFamily: "sans-serif", cursor: "pointer" }}>
                        <option>USD</option><option>INR</option><option>EUR</option>
                    </select>
                </div>
                <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", maxWidth: 1000, margin: "0 auto", alignItems: "start" }}>
                    {plans.map((p) => (
                        <div key={p.name} style={{ background: p.highlight ? "linear-gradient(160deg, #1e1608 0%, #150f04 100%)" : bgSurface, border: `1px solid ${p.highlight ? gold : bgBorder}`, borderRadius: 20, padding: "2rem", boxShadow: p.highlight ? `0 0 40px ${gold}22` : "none", transform: p.highlight ? "scale(1.04)" : "none" }}>
                            {p.badge && <span style={{ display: "inline-block", background: gold, color: "#0d0d0d", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 99, marginBottom: "1rem", fontFamily: "sans-serif" }}>{p.badge}</span>}
                            <p style={{ fontSize: "0.8rem", textDecoration: "line-through", color: textMuted, marginBottom: "0.25rem", fontFamily: "sans-serif" }}>Price: {p.originalPrice}</p>
                            <p style={{ fontSize: "2rem", fontWeight: 700, color: p.highlight ? gold : textPrimary, fontFamily: "'Georgia', serif" }}>
                                <span style={{ fontSize: "0.85rem", fontWeight: 400, color: textMuted, fontFamily: "sans-serif" }}>{currency} </span>{p.price}
                                <span style={{ fontSize: "0.85rem", fontWeight: 400, color: textMuted, fontFamily: "sans-serif" }}>/mo</span>
                            </p>
                            <hr style={{ border: "none", borderTop: `1px solid ${bgBorder}`, margin: "1.25rem 0" }} />
                            <p style={{ fontSize: 11, letterSpacing: "0.1em", color: textMuted, textTransform: "uppercase", marginBottom: "0.75rem", fontFamily: "sans-serif" }}>What's included</p>
                            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                                {p.features.map((f) => (
                                    <li key={f} style={{ display: "flex", gap: 8, fontSize: "0.82rem", fontFamily: "sans-serif" }}>
                                        <span style={{ color: gold, flexShrink: 0 }}>✓</span>
                                        <span style={{ color: textSub }}>{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <button style={{ width: "100%", marginTop: "1.5rem", padding: "10px", background: p.highlight ? gold : "transparent", border: `1px solid ${p.highlight ? gold : bgBorder}`, color: p.highlight ? "#0d0d0d" : textSub, borderRadius: 10, fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", fontFamily: "sans-serif", transition: "all 0.15s" }}>
                                Get Started
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── TRUSTED BY ── */}
            <section style={{ padding: "3rem 1.5rem", background: bgSurface, borderBottom: `1px solid ${bgBorder}` }}>
                <p style={{ textAlign: "center", color: textMuted, fontSize: "0.82rem", marginBottom: "2rem", letterSpacing: "0.06em", fontFamily: "sans-serif" }}>Trusted by students and researchers at leading institutions</p>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2.5rem", maxWidth: 800, margin: "0 auto" }}>
                    {trustedLogos.map((logo) => (
                        <span key={logo} style={{ color: textMuted, fontWeight: 600, fontSize: "0.82rem", letterSpacing: "0.05em", fontFamily: "sans-serif" }}>{logo}</span>
                    ))}
                </div>
            </section>

            {/* ── FAQ ── */}
            <section style={{ padding: "5rem 1.5rem", borderBottom: `1px solid ${bgBorder}` }}>
                <p style={{ ...S.label, textAlign: "center" }}>FAQ</p>
                <h2 style={{ ...S.h2, textAlign: "center" }}>Frequently Asked Questions!</h2>
                <p style={{ ...S.sub, textAlign: "center" }}>Helping you understand every step of the way.</p>
                <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {faqs.map((faq, i) => (
                        <div key={i} style={{ border: `1px solid ${faqOpen === i ? goldDark : bgBorder}`, borderRadius: 14, overflow: "hidden", transition: "border-color 0.2s" }}>
                            <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{ width: "100%", textAlign: "left", padding: "1.1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: faqOpen === i ? "linear-gradient(135deg, #1e1608, #141008)" : "transparent", color: textPrimary, border: "none", cursor: "pointer", transition: "background 0.2s" }}>
                                <span style={{ fontWeight: 500, fontSize: "0.9rem", fontFamily: "sans-serif" }}>{faq.q}</span>
                                <span style={{ width: 28, height: 28, borderRadius: 8, background: gold, color: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "1.1rem", flexShrink: 0, marginLeft: "1rem" }}>
                                    {faqOpen === i ? "−" : "+"}
                                </span>
                            </button>
                            {faqOpen === i && (
                                <div style={{ padding: "0 1.25rem 1.1rem", paddingTop: "0.85rem", color: textMuted, fontSize: "0.85rem", borderTop: `1px solid ${bgBorder}`, lineHeight: 1.7, fontFamily: "sans-serif" }}>
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FOOTER CTA ── */}
            <section style={{ padding: "5rem 1.5rem", textAlign: "center", background: `radial-gradient(ellipse at 50% 0%, #251a06 0%, ${bgBase} 70%)` }}>
                <p style={{ ...S.label, justifyContent: "center", display: "flex" }}>Get Started</p>
                <h2 style={{ fontSize: "2.2rem", fontWeight: 700, color: textPrimary, marginBottom: "1rem", fontFamily: "'Georgia', serif" }}>Ready to Make Your Writing Undetectable?</h2>
                <p style={{ color: textMuted, marginBottom: "2.5rem", fontFamily: "sans-serif", fontSize: "0.95rem" }}>
                    Join thousands of students, researchers, and professionals using Humanizer.
                </p>
                <button style={{ background: gold, color: "#0d0d0d", padding: "14px 40px", borderRadius: 12, fontWeight: 700, fontSize: "1rem", border: "none", cursor: "pointer", fontFamily: "sans-serif", letterSpacing: "0.02em" }}>
                    Get Started Free →
                </button>
            </section>
        </div>
    );
}