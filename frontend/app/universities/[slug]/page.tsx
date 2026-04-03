"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import usaData from "@/data/USA.json";
import ausData from "@/data/AUS.json";
import germanyData from "@/data/Germany.json";
import ukData from "@/data/UK.json";
import canadaData from "@/data/Canada.json";
import dubaiData from "@/data/Dubai.json";
import singaporeData from "@/data/singapore.json";
import newZealandData from "@/data/NewZealand Universities.json";

// ─── Data ────────────────────────────────────────────────────────────────────

const navSections = ["About", "Will you get in?", "Student demographics", "Admitted profiles", "Cost of education", "Employment figure", "Financial awards", "Reviews", "FAQ"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function useInView(threshold = 0.12) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [threshold]);
    return [ref, visible] as const;
}

function CountUp({ target, decimals = 0, prefix = "", suffix = "", duration = 1600 }: { target: number, decimals?: number, prefix?: string, suffix?: string, duration?: number }) {
    const [val, setVal] = useState(0);
    const [started, setStarted] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    useEffect(() => {
        if (!started) return;
        let start: number | null = null;
        const step = (ts: number) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setVal(+(target * ease).toFixed(decimals));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [started, target, decimals, duration]);
    return <span ref={ref}>{prefix}{decimals ? val.toFixed(decimals) : val.toLocaleString()}{suffix}</span>;
}

function RingChart({ pct, size = 100, stroke = 9, color = "#eab308", label }: { pct: number, size?: number, stroke?: number, color?: string, label: string }) {
    const [started, setStarted] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const offset = started ? circ * (1 - pct / 100) : circ;
    return (
        <div ref={ref} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
                    strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(.16,1,.3,1)" }} />
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
                    fill="#f5f5f4" fontSize={size * 0.18} fontWeight="700" fontFamily="Cormorant Garamond, serif"
                    style={{ transform: "rotate(90deg)", transformOrigin: "center" }}>
                    {pct}%
                </text>
            </svg>
            <span style={{ fontSize: 12, color: "#78716c", textAlign: "center", fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
        </div>
    );
}

function ScatterPlot({ points, visible }: { points: Array<{ gre: number, gpa: number, type: 'admit' | 'reject' | 'applied' }>, visible: boolean }) {
    const greMin = 260, greMax = 340, gpaMin = 1, gpaMax = 10;
    const w = 100, h = 100;
    const colors: Record<'admit' | 'reject' | 'applied', string> = { admit: "#22c55e", reject: "#ef4444", applied: "#eab308" };
    return (
        <svg viewBox="0 0 100 100" style={{ width: "100%", height: 260, overflow: "visible" }}>
            {/* Grid */}
            {[0, 25, 50, 75, 100].map(p => (
                <g key={p}>
                    <line x1={p} y1={0} x2={p} y2={100} stroke="rgba(255,255,255,0.06)" strokeWidth="0.4" />
                    <line x1={0} y1={p} x2={100} y2={p} stroke="rgba(255,255,255,0.06)" strokeWidth="0.4" />
                </g>
            ))}
            {/* Dots */}
            {points.map((pt, i) => {
                const x = ((pt.gre - greMin) / (greMax - greMin)) * w;
                const y = h - ((pt.gpa - gpaMin) / (gpaMax - gpaMin)) * h;
                if (x < 0 || x > 100) return null;
                return (
                    <circle key={i} cx={x} cy={y} r={visible ? 1.8 : 0}
                        fill={colors[pt.type]} opacity={0.85}
                        style={{ transition: `r 0.4s ease ${i * 30}ms` }} />
                );
            })}
            {/* Axes labels */}
            <text x="50" y="107" textAnchor="middle" fill="#78716c" fontSize="4" fontFamily="DM Sans, sans-serif">GRE →</text>
            <text x="-50" y="-3" textAnchor="middle" fill="#78716c" fontSize="4" fontFamily="DM Sans, sans-serif"
                transform="rotate(-90)">CGPA →</text>
        </svg>
    );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function UniversityPage() {
    const params = useParams();
    const slug = params?.slug;

    // ─── Dynamic Data Lookup ───────────────────────────────────────────────
    const combinedData = [
        ...singaporeData.universities,
        ...newZealandData.universities,
        ...germanyData,
        ...usaData,
        ...ukData,
        ...ausData,
        ...canadaData,
        ...dubaiData
    ];

    const data: any = combinedData.find((uni: any) => {
        const uniName = uni.university || uni.university_name || uni.name || "";
        const uniSlug = uni.slug || uniName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        return uniSlug === slug;
    });

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">University Not Found</h1>
                    <p className="text-stone-400">We couldn't find the university you're looking for.</p>
                </div>
            </div>
        );
    }
    
    const currentPrograms = data.branches?.map((b: any) => b.name) || ["Engineering"];
    const [activeProgram, setActiveProgram] = useState(currentPrograms[0]);

    const activeBranch = data.branches?.find((b: any) => b.name === activeProgram) || data.branches?.[0] || {};
    
    const currentUni = {
        name: data.name || "University",
        rank: data.rank || 1,
        location: data.location ? `${data.location.city}, ${data.location.state}, ${data.location.country}` : "Location",
        type: data.type || "Private University",
        totalStudents: activeBranch?.student_demographics?.total_enrollment || 11500,
        intlStudents: Math.floor(((activeBranch?.student_demographics?.total_enrollment || 11500) * (activeBranch?.student_demographics?.international_students || 60)) / 100),
        about: activeBranch?.description || "Description coming soon...",
        logoUrl: data.logo || "🎓",
        heroImg: data.heroImg || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    };

    const admittedProfiles = activeBranch?.admitted_profiles_list || [];
    const similarUniversities = data.similarUniversities || [];
    const scatterPoints = data.scatterPoints || [];

    const [activeSection, setActiveSection] = useState("About");
    const [mounted, setMounted] = useState(false);
    const [degreeLevel, setDegreeLevel] = useState("Master's");

    const [aboutRef, aboutVisible] = useInView();
    const [statsRef, statsVisible] = useInView();
    const [scatterRef, scatterVisible] = useInView();
    const [demoRef, demoVisible] = useInView();
    const [admitRef, admitVisible] = useInView();
    const [costRef, costVisible] = useInView();
    const [empRef, empVisible] = useInView();
    const [awardsRef, awardsVisible] = useInView();

    useEffect(() => { setMounted(true); }, []);

    return (
        <div className="min-h-screen text-stone-100 overflow-x-hidden" style={{ background: "#0a0a0f", fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,300&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes fadeUp   { from{opacity:0;transform:translateY(28px);} to{opacity:1;transform:translateY(0);} }
        @keyframes fadeIn   { from{opacity:0;} to{opacity:1;} }
        @keyframes floatY   { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-8px);} }
        @keyframes shimmer  { 0%{background-position:-200% center;} 100%{background-position:200% center;} }
        @keyframes pulseGlow{ 0%,100%{box-shadow:0 0 0 0 rgba(234,179,8,.45);} 50%{box-shadow:0 0 0 10px rgba(234,179,8,0);} }
        @keyframes slideIn  { from{opacity:0;transform:translateX(-16px);} to{opacity:1;transform:translateX(0);} }
        @keyframes orbD1    { 0%,100%{transform:translate(0,0);} 50%{transform:translate(30px,-20px);} }
        @keyframes orbD2    { 0%,100%{transform:translate(0,0);} 50%{transform:translate(-20px,15px);} }
        @keyframes rankPop  { 0%{transform:scale(0) rotate(-15deg);opacity:0;} 70%{transform:scale(1.15) rotate(3deg);} 100%{transform:scale(1) rotate(0deg);opacity:1;} }
        @keyframes progressW{ from{width:0;} to{width:var(--w);} }
        @keyframes badgeSlide{ from{opacity:0;transform:translateX(8px);} to{opacity:1;transform:translateX(0);} }

        .fd  { font-family:'Cormorant Garamond',Georgia,serif; }
        .afu { animation:fadeUp  0.75s cubic-bezier(.16,1,.3,1) both; }
        .afi { animation:fadeIn  0.6s ease both; }
        .afl { animation:floatY 5s ease-in-out infinite; }
        .aglow { animation:pulseGlow 2.5s ease-in-out infinite; }
        .aorb1 { animation:orbD1 13s ease-in-out infinite; }
        .aorb2 { animation:orbD2 17s ease-in-out infinite; }
        .arank { animation:rankPop 0.7s cubic-bezier(.34,1.56,.64,1) 0.5s both; }

        .d1{animation-delay:.08s;} .d2{animation-delay:.16s;} .d3{animation-delay:.24s;}
        .d4{animation-delay:.32s;} .d5{animation-delay:.48s;} .d6{animation-delay:.60s;}

        .gold-shimmer {
          background:linear-gradient(90deg,#ca8a04,#fde68a,#ca8a04,#d4a555,#ca8a04);
          background-size:300% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
          animation:shimmer 4s linear infinite;
        }

        .grid-texture {
          background-image:
            linear-gradient(rgba(202,138,4,.08) 1px,transparent 1px),
            linear-gradient(90deg,rgba(202,138,4,.08) 1px,transparent 1px);
          background-size:72px 72px;
        }

        .tag {
          display:inline-block; font-size:10px; letter-spacing:.14em;
          text-transform:uppercase; color:#eab308;
          border:1px solid rgba(202,138,4,.35); border-radius:999px;
          padding:4px 14px; font-family:'DM Sans',sans-serif;
        }

        .card {
          background:rgba(255,255,255,.032);
          border:1px solid rgba(202,138,4,.12);
          border-radius:18px;
          transition:transform .3s ease,border-color .3s ease,background .3s ease;
        }
        .card:hover { border-color:rgba(202,138,4,.34); background:rgba(202,138,4,.04); }

        .nav-item {
          font-size:13px; color:#78716c; cursor:pointer; padding:8px 12px;
          border-radius:10px; transition:all .2s ease; white-space:nowrap;
        }
        .nav-item:hover { color:#d6d3d1; background:rgba(255,255,255,.04); }
        .nav-item.active { color:#eab308; background:rgba(202,138,4,.10); font-weight:500; }

        .prog-tab {
          padding:9px 22px; border-radius:999px; font-size:13px; font-weight:500;
          cursor:pointer; border:1px solid rgba(202,138,4,.20); color:#78716c;
          background:transparent; transition:all .25s ease; white-space:nowrap;
        }
        .prog-tab:hover { border-color:rgba(202,138,4,.45); color:#d6d3d1; }
        .prog-tab.active { background:#ca8a04; color:#0a0a0f; border-color:#ca8a04; font-weight:700; }

        .btn-gold {
          background:#ca8a04; color:#0a0a0f; font-weight:600;
          border:none; border-radius:999px; padding:12px 28px; font-size:13px;
          cursor:pointer; transition:background .25s,transform .2s; font-family:'DM Sans',sans-serif;
        }
        .btn-gold:hover { background:#eab308; transform:scale(1.04); }

        .btn-outline {
          background:transparent; color:#eab308;
          border:1px solid rgba(202,138,4,.42); border-radius:999px;
          padding:10px 24px; font-size:13px; cursor:pointer; font-family:'DM Sans',sans-serif;
          transition:background .25s,border-color .25s;
        }
        .btn-outline:hover { background:rgba(202,138,4,.10); border-color:#eab308; }

        .admit-badge {
          position:absolute; top:0; right:0;
          background:linear-gradient(135deg,#16a34a,#15803d);
          color:#fff; font-size:9px; font-weight:800; letter-spacing:.10em;
          text-transform:uppercase; padding:4px 10px;
          border-radius:0 14px 0 10px; animation:badgeSlide .4s ease both;
        }

        .degree-btn {
          font-size:12px; padding:6px 16px; border-radius:999px; cursor:pointer;
          border:1px solid rgba(202,138,4,.20); color:#78716c; background:transparent;
          transition:all .2s ease; font-family:'DM Sans',sans-serif;
        }
        .degree-btn.active { background:rgba(202,138,4,.18); color:#eab308; border-color:rgba(202,138,4,.50); }

        .stat-divider { border-right:1px solid rgba(202,138,4,.15); }
        .stat-divider:last-child { border-right:none; }

        .section-anchor { scroll-margin-top: 80px; }

        .similar-row {
          display:flex; align-items:center; gap:14px; padding:14px 16px;
          border-radius:14px; cursor:pointer;
          transition:background .2s ease, transform .2s ease;
        }
        .similar-row:hover { background:rgba(202,138,4,.06); transform:translateX(4px); }
      `}</style>

            {/* ── Ambient ── */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
                <div className="aorb1 absolute rounded-full"
                    style={{ width: 600, height: 600, top: -180, right: -180, background: "radial-gradient(circle,rgba(202,138,4,.11) 0%,transparent 70%)", filter: "blur(70px)" }} />
                <div className="aorb2 absolute rounded-full"
                    style={{ width: 400, height: 400, bottom: 0, left: -100, background: "radial-gradient(circle,rgba(120,80,20,.09) 0%,transparent 70%)", filter: "blur(60px)" }} />
                <div className="absolute inset-0 grid-texture" />
            </div>

            <div className="relative" style={{ zIndex: 1 }}>

                {/* ════════════════════ HERO ════════════════════ */}
                <section style={{ position: "relative", overflow: "hidden" }}>
                    {/* Hero image strip */}
                    <div style={{
                        height: 340, position: "relative", overflow: "hidden",
                        background: "linear-gradient(135deg,#1a1200 0%,#0a0a0f 100%)"
                    }}>
                        <img
                            src={currentUni.heroImg}
                            alt="University Hero"
                            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.22, filter: "saturate(0.6)" }}
                        />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(10,10,15,.2) 0%,rgba(10,10,15,.95) 100%)" }} />

                        {/* Rank badge */}
                        <div className="arank" style={{
                            position: "absolute", top: 28, right: 28,
                            width: 70, height: 70, borderRadius: "50%",
                            background: "linear-gradient(135deg,#ca8a04,#fde68a,#a16207)",
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                            boxShadow: "0 8px 32px rgba(202,138,4,.5)",
                        }}>
                            <span style={{ fontSize: 22, fontWeight: 800, color: "#0a0a0f", lineHeight: 1 }}>#{currentUni.rank}</span>
                            <span style={{ fontSize: 8, color: "#0a0a0f", fontWeight: 700, letterSpacing: ".06em" }}>GLOBAL</span>
                        </div>
                    </div>

                    {/* Info card overlap */}
                    <div className="max-w-6xl mx-auto px-6" style={{ marginTop: -120, paddingBottom: 0, position: "relative" }}>
                        <div className={`card p-8 ${mounted ? "afu" : "opacity-0"}`}
                            style={{ background: "rgba(14,12,8,.92)", backdropFilter: "blur(20px)", border: "1px solid rgba(202,138,4,.20)" }}>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>

                                {/* Logo */}
                                <div style={{
                                    width: 72, height: 72, borderRadius: 16, flexShrink: 0,
                                    background: "linear-gradient(135deg,rgba(202,138,4,.20),rgba(202,138,4,.08))",
                                    border: "1px solid rgba(202,138,4,.30)",
                                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36,
                                    overflow: "hidden"
                                }} className="afl">
                                    {currentUni.logoUrl ? <img src={currentUni.logoUrl} alt={currentUni.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : "🎓"}
                                </div>

                                <div style={{ flex: 1, minWidth: 260 }}>
                                    <span className="tag" style={{ marginBottom: 8, display: "inline-block" }}>#{currentUni.rank} Globally</span>
                                    <h1 className={`fd ${mounted ? "afu d1" : "opacity-0"}`}
                                        style={{ fontSize: "clamp(32px,4vw,54px)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 6 }}>
                                        <span className="gold-shimmer">{currentUni.name}</span>
                                    </h1>
                                    <p className={mounted ? "afu d2" : "opacity-0"}
                                        style={{ fontSize: 13, color: "#78716c", display: "flex", alignItems: "center", gap: 6 }}>
                                        📍 {currentUni.location}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className={`flex gap-3 flex-wrap ${mounted ? "afu d3" : "opacity-0"}`} style={{ alignItems: "center" }}>
                                    <button className="btn-gold aglow">⚡ RateMyChances</button>
                                    <button className="btn-outline">🛂 Visa Approval Chances</button>
                                </div>
                            </div>

                            {/* Quick stats */}
                            <div className={`flex ${mounted ? "afu d4" : "opacity-0"}`}
                                style={{ marginTop: 28, borderTop: "1px solid rgba(202,138,4,.12)", paddingTop: 24, flexWrap: "wrap" }}>
                                {[
                                    ["🏛️", currentUni.type, "Type"],
                                    ["👥", currentUni.totalStudents.toLocaleString(), "Total Students"],
                                    ["🌍", currentUni.intlStudents.toLocaleString(), "International"],
                                    ["📊", `${activeBranch?.stats?.acceptance_rate ?? 7.2}%`, "Admit Rate"],
                                    ["💵", activeBranch?.stats?.avg_salary ? `$${Math.round(activeBranch.stats.avg_salary / 1000)}K` : "$139K", "Avg. Salary"],
                                ].map(([icon, val, label], i) => (
                                    <div key={i} className={i < 4 ? "stat-divider" : ""}
                                        style={{ flex: 1, minWidth: 120, textAlign: "center", padding: "4px 16px" }}>
                                        <p style={{ fontSize: 18, marginBottom: 4 }}>{icon}</p>
                                        <p className="fd" style={{ fontSize: 18, fontWeight: 700, color: "#eab308", marginBottom: 2 }}>{val}</p>
                                        <p style={{ fontSize: 11, color: "#57534e", textTransform: "uppercase", letterSpacing: ".08em" }}>{label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Program tabs */}
                        <div className={`flex gap-3 flex-wrap ${mounted ? "afu d5" : "opacity-0"}`}
                            style={{ marginTop: 20, paddingBottom: 4, overflowX: "auto" }}>
                            {currentPrograms.map((p: any) => (
                                <button key={p} className={`prog-tab ${activeProgram === p ? "active" : ""}`}
                                    onClick={() => setActiveProgram(p)}>{p}</button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ════════════════════ BODY ════════════════════ */}
                <div className="max-w-6xl mx-auto px-6 py-10">
                    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 300px", gap: 28, alignItems: "start" }}>

                        {/* ── LEFT NAV ── */}
                        <div style={{ position: "sticky", top: 24 }}>
                            <div className="card" style={{ padding: "12px 8px" }}>
                                {navSections.map((s, i) => (
                                    <div key={s} className={`nav-item ${activeSection === s ? "active" : ""}`}
                                        onClick={() => setActiveSection(s)}
                                        style={{ animationDelay: `${i * 40}ms` }}>
                                        {s === "Will you get in?" ? <span>🏆 {s}</span> : s}
                                    </div>
                                ))}
                                <div style={{ borderTop: "1px solid rgba(202,138,4,.10)", marginTop: 8, paddingTop: 8 }}>
                                    <div className="nav-item" style={{ color: "#eab308" }}>Connect with us</div>
                                </div>
                            </div>
                        </div>

                        {/* ── CENTER CONTENT ── */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 48, minWidth: 0 }}>

                            {/* ABOUT */}
                            <div ref={aboutRef} className="section-anchor" id="about">
                                <span className="tag" style={{ marginBottom: 16, display: "inline-block" }}>About</span>
                                <h2 className="fd" style={{ fontSize: 34, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.01em" }}>{activeProgram}</h2>
                                <div style={{ width: 48, height: 2, background: "linear-gradient(90deg,#eab308,transparent)", borderRadius: 2, marginBottom: 20 }} />
                                {currentUni.about.split("\n\n").map((para: any, i: any) => (
                                    <p key={i} style={{
                                        color: "#a8a29e", fontSize: 14, lineHeight: 1.8, marginBottom: 16,
                                        opacity: aboutVisible ? 1 : 0, transform: aboutVisible ? "translateY(0)" : "translateY(16px)",
                                        transition: `opacity .6s ease ${i * 120}ms, transform .6s ease ${i * 120}ms`,
                                    }}>{para}</p>
                                ))}
                            </div>

                            {/* WILL YOU GET IN — Scatter */}
                            <div ref={scatterRef} className="section-anchor" id="scatter">
                                <span className="tag" style={{ marginBottom: 16, display: "inline-block" }}>Will You Get In?</span>
                                <h2 className="fd" style={{ fontSize: 28, fontWeight: 700, marginBottom: 20, letterSpacing: "-0.01em" }}>
                                    GPA vs Test Scores — Scatter Analysis
                                </h2>

                                <div className="card" style={{ padding: 28 }}>
                                    {/* Controls */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                                        <div style={{ display: "flex", gap: 8 }}>
                                            {["Undergrad", "Master's", "Ph.D."].map(d => (
                                                <button key={d} className={`degree-btn ${degreeLevel === d ? "active" : ""}`}
                                                    onClick={() => setDegreeLevel(d)}>{d}</button>
                                            ))}
                                        </div>
                                        <div style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
                                            {[["#22c55e", "Admit"], ["#ef4444", "Reject"], ["#eab308", "Applied"]].map(([c, l]) => (
                                                <span key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#78716c" }}>
                                                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: c, display: "inline-block" }} />{l}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <ScatterPlot points={scatterPoints} visible={scatterVisible} />

                                    <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                                        <button className="btn-gold" style={{ borderRadius: 12, padding: "10px 22px" }}>+ Add your Own</button>
                                        <button className="btn-outline" style={{ borderRadius: 12 }}>✓ See Decisions</button>
                                    </div>
                                </div>
                            </div>

                            {/* STUDENT DEMOGRAPHICS */}
                            <div ref={demoRef} className="section-anchor" id="demographics">
                                <span className="tag" style={{ marginBottom: 16, display: "inline-block" }}>Student Demographics</span>
                                <h2 className="fd" style={{ fontSize: 28, fontWeight: 700, marginBottom: 20, letterSpacing: "-0.01em" }}>Who Studies Here?</h2>

                                <div className="card" style={{ padding: 28 }}>
                                    <div style={{ display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
                                        {[["♂", `${activeBranch?.student_demographics?.male ?? 62.8}%`, "Male", "#60a5fa"], ["♀", `${activeBranch?.student_demographics?.female ?? 37.2}%`, "Female", "#f472b6"], ["🌍", `${activeBranch?.student_demographics?.international_students ?? 52.8}%`, "International", "#eab308"]].map(([icon, pct, label, color], i) => (
                                            <div key={i} style={{
                                                textAlign: "center",
                                                opacity: demoVisible ? 1 : 0,
                                                transform: demoVisible ? "translateY(0)" : "translateY(20px)",
                                                transition: `all .6s ease ${i * 120}ms`,
                                            }}>
                                                <div style={{ fontSize: 36, marginBottom: 8 }}>{icon}</div>
                                                <p className="fd" style={{ fontSize: 28, fontWeight: 700, color, marginBottom: 4 }}>{pct}</p>
                                                <p style={{ fontSize: 12, color: "#78716c" }}>{label}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ borderTop: "1px solid rgba(202,138,4,.10)", paddingTop: 16, textAlign: "center" }}>
                                        <span style={{ fontSize: 13, color: "#57534e" }}>Total Enrollment: </span>
                                        <span className="fd" style={{ fontSize: 18, fontWeight: 700, color: "#eab308" }}>
                                            <CountUp target={currentUni.totalStudents} />
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* ADMITTED PROFILES */}
                            <div ref={admitRef} className="section-anchor" id="admitted">
                                <span className="tag" style={{ marginBottom: 16, display: "inline-block" }}>Admitted Profiles</span>
                                <h2 className="fd" style={{ fontSize: 28, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.01em" }}>Average Scores</h2>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                                    {[["Average GPA", activeBranch?.stats?.avg_gpa ?? "3.81"], ["Average GRE Score", activeBranch?.stats?.avg_gre ?? "326"]].map(([label, val], i) => (
                                        <div key={i} className="card" style={{ padding: 20, textAlign: "center" }}>
                                            <p style={{ fontSize: 12, color: "#78716c", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".08em" }}>{label}</p>
                                            <p className="fd" style={{ fontSize: 36, fontWeight: 700, color: "#eab308" }}>{val}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="card" style={{ padding: 20, marginBottom: 20 }}>
                                    <p style={{ fontSize: 12, color: "#78716c", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 16, textAlign: "center" }}>Average Language Scores</p>
                                    <div style={{ display: "flex", gap: 0 }}>
                                        {[["TOEFL Min.", activeBranch?.admitted_profiles?.toefl_min ?? "80"], ["TOEFL Mean", activeBranch?.admitted_profiles?.toefl_avg ?? "105"], ["IELTS Min.", activeBranch?.admitted_profiles?.ielts_min ?? "6.5"]].map(([l, v], i) => (
                                            <div key={i} className={i < 2 ? "stat-divider" : ""} style={{ flex: 1, textAlign: "center", padding: "0 16px" }}>
                                                <p className="fd" style={{ fontSize: 24, fontWeight: 700, color: "#e7e5e4", marginBottom: 4 }}>{v}</p>
                                                <p style={{ fontSize: 11, color: "#57534e" }}>{l}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Acceptance rings */}
                                <div className="card" style={{ padding: 24 }}>
                                    <div style={{ display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
                                        <RingChart pct={activeBranch?.stats?.acceptance_rate ?? 7.2} size={110} label={`Acceptance Rate (${activeProgram})`} />
                                        <RingChart pct={8.1} size={110} label="Acceptance Rate (PhD)" />
                                    </div>
                                </div>

                                {/* Profile cards */}
                                <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
                                    <h3 className="fd" style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>Recent Admits on YMGrad</h3>
                                    {admittedProfiles.map((p: any, i: number) => (
                                        <div key={i} className="card" style={{
                                            padding: "16px 18px", position: "relative", overflow: "hidden",
                                            opacity: admitVisible ? 1 : 0,
                                            transform: admitVisible ? "translateY(0)" : "translateY(16px)",
                                            transition: `all .5s ease ${i * 80}ms`,
                                        }}>
                                            <div className="admit-badge">ADMIT</div>
                                            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                                                <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(202,138,4,.12)", border: "1px solid rgba(202,138,4,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>👤</div>
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{p.name}</p>
                                                    <p style={{ fontSize: 12, color: "#78716c" }}>📍 {p.location} &nbsp;|&nbsp; 🍁 {p.term}</p>
                                                </div>
                                                <div style={{ textAlign: "right" }}>
                                                    <p style={{ fontSize: 12, color: "#eab308", fontWeight: 500 }}>{currentUni.name}</p>
                                                    <p style={{ fontSize: 11, color: "#57534e" }}>{p.program}</p>
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                                                {["Login to view", "0 Research Papers"].map((tag, j) => (
                                                    <span key={j} style={{ fontSize: 10, color: "#78716c", border: "1px solid rgba(255,255,255,.08)", borderRadius: 999, padding: "3px 10px" }}>{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* COST OF EDUCATION */}
                            <div ref={costRef} className="section-anchor" id="cost">
                                <span className="tag" style={{ marginBottom: 16, display: "inline-block" }}>Cost of Education</span>
                                <h2 className="fd" style={{ fontSize: 28, fontWeight: 700, marginBottom: 20, letterSpacing: "-0.01em" }}>Financial Overview</h2>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                    {[["🎓", "Tuition Expenses", `$${(activeBranch?.stats?.tuition_fee ?? 53605).toLocaleString()}`, "/year"], ["🏠", "Living Expenses", `$${(activeBranch?.stats?.living_expense ?? 17682).toLocaleString()}`, "/year"]].map(([icon, label, val, unit], i) => (
                                        <div key={i} className="card" style={{
                                            padding: 24,
                                            opacity: costVisible ? 1 : 0,
                                            transform: costVisible ? "translateY(0)" : "translateY(20px)",
                                            transition: `all .6s ease ${i * 120}ms`,
                                        }}>
                                            <span style={{ fontSize: 28, display: "block", marginBottom: 12 }}>{icon}</span>
                                            <p style={{ fontSize: 12, color: "#78716c", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".08em" }}>{label}</p>
                                            <p className="fd" style={{ fontSize: 30, fontWeight: 700, color: "#22c55e" }}>
                                                {costVisible ? <CountUp target={+val.replace(/\D/g, "")} prefix="$" /> : val}
                                                <span style={{ fontSize: 14, fontWeight: 400, color: "#57534e" }}>{unit}</span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* EMPLOYMENT */}
                            <div ref={empRef} className="section-anchor" id="employment">
                                <span className="tag" style={{ marginBottom: 16, display: "inline-block" }}>Employment Figures</span>
                                <h2 className="fd" style={{ fontSize: 28, fontWeight: 700, marginBottom: 20, letterSpacing: "-0.01em" }}>Career Outcomes</h2>

                                <div className="card" style={{ padding: 28 }}>
                                    <div style={{ display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
                                        <RingChart pct={data?.common_sections?.employment_figures?.employed || 79.1} size={120} label="Employed" />
                                        <RingChart pct={data?.common_sections?.employment_figures?.employed_within_3_months || 89.3} size={120} label="Employed within 3 months" />
                                    </div>
                                    <div style={{ border: "1px solid rgba(202,138,4,.15)", borderRadius: 14, padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ fontSize: 13, color: "#78716c" }}>Average Salary</span>
                                        <span className="fd" style={{ fontSize: 28, fontWeight: 700, color: "#22c55e" }}>
                                            {empVisible ? <CountUp target={activeBranch?.stats?.avg_salary ?? 139339} prefix="$" suffix="/yr" /> : `$${(activeBranch?.stats?.avg_salary ?? 139339).toLocaleString()}/yr`}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* FINANCIAL AWARDS */}
                            <div ref={awardsRef} className="section-anchor" id="awards">
                                <span className="tag" style={{ marginBottom: 16, display: "inline-block" }}>Financial Awards</span>
                                <h2 className="fd" style={{ fontSize: 28, fontWeight: 700, marginBottom: 20, letterSpacing: "-0.01em" }}>Funding Opportunities</h2>

                                <div className="card" style={{ padding: 28 }}>
                                    <div style={{ display: "flex", gap: 0, marginBottom: 24 }}>
                                        {[["154", "Fellowships"], ["81", "Teaching Assistantships"], ["295", "Research Assistantships"]].map(([val, label], i) => (
                                            <div key={i} className={i < 2 ? "stat-divider" : ""} style={{ flex: 1, textAlign: "center", padding: "0 16px" }}>
                                                <p className="fd" style={{ fontSize: 36, fontWeight: 700, color: "#eab308", marginBottom: 4 }}>
                                                    {awardsVisible ? <CountUp target={+val} /> : val}
                                                </p>
                                                <p style={{ fontSize: 11, color: "#57534e", textTransform: "uppercase", letterSpacing: ".08em" }}>{label}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ borderTop: "1px solid rgba(202,138,4,.10)", paddingTop: 18, textAlign: "center" }}>
                                        <p style={{ fontSize: 12, color: "#78716c", marginBottom: 14 }}>Financial Aid Officer</p>
                                        <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                                            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(202,138,4,.10)", border: "1px solid rgba(202,138,4,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>👔</div>
                                            <span className="fd" style={{ fontSize: 16, fontWeight: 600 }}>{data?.common_sections?.financial_awards?.officer?.name || "Tracey Newman"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── RIGHT SIDEBAR ── */}
                        <div style={{ position: "sticky", top: 24, display: "flex", flexDirection: "column", gap: 18 }}>

                            {/* Get help card */}
                            <div style={{ background: "rgba(202,138,4,.06)", border: "1px solid rgba(202,138,4,.22)", borderRadius: 18, padding: 22 }}>
                                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, lineHeight: 1.4 }}>
                                    Get help getting into<br /><span className="fd" style={{ fontSize: 18, color: "#eab308" }}>{currentUni.name}</span>
                                </p>
                                <div className="card" style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                                    <span style={{ fontSize: 24 }}>📋</span>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>Complete Application Help</p>
                                        <p style={{ fontSize: 11, color: "#78716c" }}>Expert-guided application review</p>
                                    </div>
                                    <button className="btn-gold" style={{ padding: "8px 14px", fontSize: 12, borderRadius: 10, whiteSpace: "nowrap" }}>Check Now</button>
                                </div>
                                <div className="card" style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
                                    <span style={{ fontSize: 24 }}>🎯</span>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>Profile Evaluation</p>
                                        <p style={{ fontSize: 11, color: "#78716c" }}>Know your admit chances</p>
                                    </div>
                                    <button className="btn-gold" style={{ padding: "8px 14px", fontSize: 12, borderRadius: 10 }}>Try Free</button>
                                </div>
                            </div>

                            {/* Programs list */}
                            <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(202,138,4,.12)", borderRadius: 18, padding: "18px 14px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, padding: "0 4px" }}>
                                    <p style={{ fontSize: 13, fontWeight: 600 }}>Top Programs</p>
                                    <input placeholder="🔍 Search…" style={{
                                        background: "rgba(255,255,255,.05)", border: "1px solid rgba(202,138,4,.18)",
                                        borderRadius: 8, padding: "5px 10px", fontSize: 11, color: "#d6d3d1",
                                        outline: "none", width: 110, fontFamily: "'DM Sans',sans-serif",
                                    }} />
                                </div>
                                {currentPrograms.map((prog: any, i: number) => (
                                    <div key={i} className="similar-row">
                                        <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(202,138,4,.10)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🎓</div>
                                        <div>
                                            <p style={{ fontSize: 12, fontWeight: 500, marginBottom: 1 }}>{prog}</p>
                                            <p style={{ fontSize: 10, color: "#57534e" }}>{currentUni.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Similar universities */}
                            <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(202,138,4,.12)", borderRadius: 18, padding: "18px 14px" }}>
                                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, padding: "0 4px" }}>Similar Universities</p>
                                {similarUniversities.map((u: any, i: number) => (
                                    <div key={i} className="similar-row">
                                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(202,138,4,.10)", border: "1px solid rgba(202,138,4,.20)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                                            {u.emoji}
                                        </div>
                                        <div>
                                            <p style={{ fontSize: 12, fontWeight: 500, marginBottom: 1 }}>{u.name}</p>
                                            <p style={{ fontSize: 10, color: "#57534e" }}>{u.location}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}