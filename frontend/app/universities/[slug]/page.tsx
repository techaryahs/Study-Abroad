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
import irelandData from "@/data/Ireland.json";
import switzerlandData from "@/data/Switzerland.json";
import netherlandsData from "@/data/Netherlands.json";
import franceData from "@/data/France.json";

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

function RingChart({ pct, size = 100, stroke = 9, color = "#C5A059", label }: { pct: number, size?: number, stroke?: number, color?: string, label: string }) {
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
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth={stroke} />
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
                    strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(.16,1,.3,1)" }} />
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
                    fill="#3C2F2F" fontSize={size * 0.18} fontWeight="700" fontFamily="Cormorant Garamond, serif"
                    style={{ transform: "rotate(90deg)", transformOrigin: "center" }}>
                    {pct}%
                </text>
            </svg>
            <span style={{ fontSize: 12, color: "#6B5E51", textAlign: "center", fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
        </div>
    );
}

function ScatterPlot({ points, visible }: { points: Array<{ gre: number, gpa: number, type: 'admit' | 'reject' | 'applied' }>, visible: boolean }) {
    const greMin = 260, greMax = 340, gpaMin = 1, gpaMax = 10;
    const w = 100, h = 100;
    const colors: Record<'admit' | 'reject' | 'applied', string> = { admit: "#22c55e", reject: "#ef4444", applied: "#C5A059" };
    return (
        <svg viewBox="0 0 100 100" style={{ width: "100%", height: 260, overflow: "visible" }}>
            {/* Grid */}
            {[0, 25, 50, 75, 100].map(p => (
                <g key={p}>
                    <line x1={p} y1={0} x2={p} y2={100} stroke="rgba(0,0,0,0.06)" strokeWidth="0.4" />
                    <line x1={0} y1={p} x2={100} y2={p} stroke="rgba(0,0,0,0.06)" strokeWidth="0.4" />
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
            <text x="50" y="107" textAnchor="middle" fill="#6B5E51" fontSize="4" fontFamily="DM Sans, sans-serif">GRE →</text>
            <text x="-50" y="-3" textAnchor="middle" fill="#6B5E51" fontSize="4" fontFamily="DM Sans, sans-serif"
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
        ...singaporeData,
        ...newZealandData,
        ...germanyData,
        ...usaData,
        ...ukData,
        ...ausData,
        ...canadaData,
        ...dubaiData,
        ...irelandData,
        ...switzerlandData,
        ...netherlandsData,
        ...franceData
    ];

    const data: any = combinedData.find((uni: any) => {
        const uniName = uni.university || uni.university_name || uni.name || "";
        const uniSlug = uni.slug || uniName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        return uniSlug === slug;
    });

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] text-[#2D2926]">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">University Not Found</h1>
                    <p className="text-[#6B5E51]">We couldn't find the university you're looking for.</p>
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
        totalStudents: activeBranch?.student_demographics?.total_enrollment || null,
        intlStudents: activeBranch?.student_demographics?.international_students ? 
            Math.floor((activeBranch.student_demographics.total_enrollment * activeBranch.student_demographics.international_students) / 100) : 
            null,
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
        <div className="min-h-screen text-[#2D2926] overflow-x-hidden" style={{ background: "#FDFBF7", fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,300&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes fadeUp   { from{opacity:0;transform:translateY(28px);} to{opacity:1;transform:translateY(0);} }
        @keyframes fadeIn   { from{opacity:0;} to{opacity:1;} }
        @keyframes floatY   { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-8px);} }
        @keyframes shimmer  { 0%{background-position:-200% center;} 100%{background-position:200% center;} }
        @keyframes pulseGlow{ 0%,100%{box-shadow:0 0 0 0 rgba(197,160,89,.45);} 50%{box-shadow:0 0 0 10px rgba(197,160,89,0);} }
        @keyframes slideIn  { from{opacity:0;transform:translateX(-16px);} to{opacity:1;transform:translateX(0);} }
        @keyframes rankPop  { 0%{transform:scale(0) rotate(-15deg);opacity:0;} 70%{transform:scale(1.15) rotate(3deg);} 100%{transform:scale(1) rotate(0deg);opacity:1;} }
        @keyframes progressW{ from{width:0;} to{width:var(--w);} }
        @keyframes badgeSlide{ from{opacity:0;transform:translateX(8px);} to{opacity:1;transform:translateX(0);} }

        .fd  { font-family:'Cormorant Garamond',Georgia,serif; }
        .afu { animation:fadeUp  0.75s cubic-bezier(.16,1,.3,1) both; }
        .afi { animation:fadeIn  0.6s ease both; }
        .afl { animation:floatY 5s ease-in-out infinite; }
        .aglow { animation:pulseGlow 2.5s ease-in-out infinite; }
        .arank { animation:rankPop 0.7s cubic-bezier(.34,1.56,.64,1) 0.5s both; }

        .d1{animation-delay:.08s;} .d2{animation-delay:.16s;} .d3{animation-delay:.24s;}
        .d4{animation-delay:.32s;} .d5{animation-delay:.48s;} .d6{animation-delay:.60s;}

        .gold-shimmer {
          background:linear-gradient(90deg,#C5A059,#E6D5B8,#C5A059,#D4AF37,#C5A059);
          background-size:300% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
          animation:shimmer 4s linear infinite;
        }

        .tag {
          display:inline-block; font-size:10px; letter-spacing:.14em;
          text-transform:uppercase; color:#C5A059;
          border:1px solid rgba(197,160,89,.35); border-radius:999px;
          padding:4px 14px; font-family:'DM Sans',sans-serif;
        }

        .card {
          background: #FFFFFF;
          border: 1px solid rgba(197,160,89, 0.15);
          border-radius: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          transition: transform .3s ease, border-color .3s ease, box-shadow .3s ease;
        }
        .card:hover { border-color: rgba(197,160,89, 0.4); box-shadow: 0 10px 30px rgba(0,0,0,0.05); }

        .nav-item {
          font-size:13px; color:#6B5E51; cursor:pointer; padding:10px 14px;
          border-radius:12px; transition:all .2s ease; white-space:nowrap;
        }
        .nav-item:hover { color:#2D2926; background:rgba(197,160,89,.05); }
        .nav-item.active { color:#C5A059; background:rgba(197,160,89,.10); font-weight:600; }

        .prog-tab {
          padding:10px 24px; border-radius:999px; font-size:13px; font-weight:500;
          cursor:pointer; border:1px solid rgba(197,160,89,.25); color:#6B5E51;
          background:transparent; transition:all .25s ease; white-space:nowrap;
        }
        .prog-tab:hover { border-color:rgba(197,160,89,.6); color:#2D2926; }
        .prog-tab.active { background:#C5A059; color:#FFFFFF; border-color:#C5A059; font-weight:700; }

        .btn-gold {
          background:#C5A059; color:#FFFFFF; font-weight:600;
          border:none; border-radius:999px; padding:12px 28px; font-size:13px;
          cursor:pointer; transition:background .25s,transform .2s; font-family:'DM Sans',sans-serif;
        }
        .btn-gold:hover { background:#D4AF37; transform:scale(1.04); }

        .btn-outline {
          background:transparent; color:#C5A059;
          border:1px solid rgba(197,160,89,.5); border-radius:999px;
          padding:10px 24px; font-size:13px; cursor:pointer; font-family:'DM Sans',sans-serif;
          transition:background .25s,border-color .25s;
        }
        .btn-outline:hover { background:rgba(197,160,89,.05); border-color:#C5A059; }

        .admit-badge {
          position:absolute; top:0; right:0;
          background:linear-gradient(135deg,#22c55e,#15803d);
          color:#fff; font-size:9px; font-weight:800; letter-spacing:.10em;
          text-transform:uppercase; padding:4px 10px;
          border-radius:0 24px 0 12px; animation:badgeSlide .4s ease both;
        }

        .degree-btn {
          font-size:12px; padding:6px 16px; border-radius:999px; cursor:pointer;
          border:1px solid rgba(197,160,89,.20); color:#6B5E51; background:transparent;
          transition:all .2s ease; font-family:'DM Sans',sans-serif;
        }
        .degree-btn.active { background:rgba(197,160,89,.15); color:#C5A059; border-color:rgba(197,160,89,.50); }

        .stat-divider { border-right:1px solid rgba(197,160,89,.15); }
        .stat-divider:last-child { border-right:none; }

        .section-anchor { scroll-margin-top: 80px; }

        .similar-row {
          display:flex; align-items:center; gap:14px; padding:14px 16px;
          border-radius:14px; cursor:pointer;
          transition:background .2s ease, transform .2s ease;
        }
        .similar-row:hover { background:rgba(197,160,89,.08); transform:translateX(4px); }
      `}</style>

            <div className="relative" style={{ zIndex: 1 }}>

                {/* ════════════════════ HERO ════════════════════ */}
                <section style={{ position: "relative", overflow: "hidden", background: "#FDFBF7" }}>
                    <div style={{
                        height: 380, position: "relative", overflow: "hidden",
                    }}>
                        <img
                            src={currentUni.heroImg}
                            alt="University Hero"
                            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.15, filter: "sepia(0.2) saturate(0.8)" }}
                        />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 0%, #FDFBF7 100%)" }} />

                        {/* Rank badge */}
                        <div className="arank" style={{
                            position: "absolute", top: 40, right: 60,
                            width: 80, height: 80, borderRadius: "50%",
                            background: "linear-gradient(135deg,#C5A059,#E6D5B8,#A16207)",
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                            boxShadow: "0 12px 40px rgba(197,160,89,.3)",
                        }}>
                            <span style={{ fontSize: 24, fontWeight: 800, color: "#FFFFFF", lineHeight: 1 }}>#{currentUni.rank}</span>
                            <span style={{ fontSize: 8, color: "#FFFFFF", fontWeight: 700, letterSpacing: ".06em" }}>GLOBAL</span>
                        </div>
                    </div>

                    {/* Info card overlap */}
                    <div className="max-w-6xl mx-auto px-6" style={{ marginTop: -160, paddingBottom: 0, position: "relative" }}>
                        <div className={`card p-10 ${mounted ? "afu" : "opacity-0"}`}
                            style={{ background: "#FFFFFF", border: "1px solid rgba(197,160,89,.2)" }}>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 32, flexWrap: "wrap" }}>

                                {/* Logo */}
                                <div style={{
                                    width: 90, height: 90, borderRadius: 24, flexShrink: 0,
                                    background: "#F8F5F0",
                                    border: "1px solid rgba(197,160,89,.3)",
                                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48,
                                    overflow: "hidden"
                                }} className="afl">
                                    {currentUni.logoUrl ? <img src={currentUni.logoUrl} alt={currentUni.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : "🎓"}
                                </div>

                                <div style={{ flex: 1, minWidth: 260 }}>
                                    <span className="tag" style={{ marginBottom: 12, display: "inline-block" }}>The Elite Selection</span>
                                    <h1 className={`fd ${mounted ? "afu d1" : "opacity-0"}`}
                                        style={{ fontSize: "clamp(36px,5vw,60px)", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.02em", marginBottom: 10, color: "#2D2926" }}>
                                        {currentUni.name}
                                    </h1>
                                    <p className={mounted ? "afu d2" : "opacity-0"}
                                        style={{ fontSize: 14, color: "#6B5E51", display: "flex", alignItems: "center", gap: 8, fontWeight: 500 }}>
                                        <span style={{ color: "#C5A059" }}>📍</span> {currentUni.location}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className={`flex gap-4 flex-wrap ${mounted ? "afu d3" : "opacity-0"}`} style={{ alignItems: "center" }}>
                                    <button className="btn-gold aglow">Request Evaluation</button>
                                    <button className="btn-outline">Visa Guidance</button>
                                </div>
                            </div>

                            {/* Quick stats - NEXSALON Style Stats Cards */}
                            <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 ${mounted ? "afu d4" : "opacity-0"}`}
                                style={{ marginTop: 40, borderTop: "1px solid rgba(197,160,89,.1)", paddingTop: 30 }}>
                                {[
                                    ["🏛️", currentUni.type, "Category"],
                                    currentUni.totalStudents ? ["👥", currentUni.totalStudents.toLocaleString(), "Total Enrollment"] : null,
                                    currentUni.intlStudents ? ["🌍", currentUni.intlStudents.toLocaleString(), "International"] : null,
                                    activeBranch?.stats?.acceptance_rate ? ["📊", `${activeBranch.stats.acceptance_rate}%`, "Acceptance"] : null,
                                    activeBranch?.stats?.avg_salary ? ["💵", `$${Math.round(activeBranch.stats.avg_salary / 1000)}K`, "Avg. Outcome"] : null,
                                ].filter(Boolean).map(([icon, val, label]: any, i) => (
                                    <div key={i} className="p-5" style={{ background: "#F8F5F0", borderRadius: 20, textAlign: "left" }}>
                                        <p style={{ fontSize: 13, color: "#6B5E51", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 8 }}>{label}</p>
                                        <p className="fd" style={{ fontSize: 22, fontWeight: 700, color: "#2D2926" }}>{val}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Program tabs */}
                        <div className={`flex gap-3 flex-wrap ${mounted ? "afu d5" : "opacity-0"}`}
                            style={{ marginTop: 30, paddingBottom: 4, overflowX: "auto" }}>
                            {currentPrograms.map((p: any) => (
                                <button key={p} className={`prog-tab ${activeProgram === p ? "active" : ""}`}
                                    onClick={() => setActiveProgram(p)}>{p}</button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ════════════════════ BODY ════════════════════ */}
                <div className="max-w-6xl mx-auto px-6 py-20">
                    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr 320px", gap: 40, alignItems: "start" }}>

                        {/* ── LEFT NAV ── */}
                        <div style={{ position: "sticky", top: 40 }}>
                            <div className="card" style={{ padding: "16px" }}>
                                {navSections.map((s, i) => (
                                    <div key={s} className={`nav-item ${activeSection === s ? "active" : ""}`}
                                        onClick={() => {
                                            setActiveSection(s);
                                            const id = s.toLowerCase().replace(/\s+|\?/g, "");
                                            document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                                        }}
                                        style={{ animationDelay: `${i * 40}ms` }}>
                                        {s === "Will you get in?" ? <span style={{ color: "#C5A059" }}>✨ Success Matrix</span> : s}
                                    </div>
                                ))}
                                <div style={{ borderTop: "1px solid rgba(197,160,89,.1)", marginTop: 12, paddingTop: 12 }}>
                                    <div className="nav-item" style={{ color: "#C5A059", fontWeight: 700 }}>Exclusive Consulting</div>
                                </div>
                            </div>
                        </div>

                        {/* ── CENTER CONTENT ── */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 70, minWidth: 0 }}>

                            {/* ABOUT */}
                            {currentUni.about && (
                                <div ref={aboutRef} className="section-anchor" id="about">
                                    <span className="tag" style={{ marginBottom: 20, display: "inline-block" }}>Overview</span>
                                    <h2 className="fd" style={{ fontSize: 44, fontWeight: 700, marginBottom: 16, letterSpacing: "-0.01em", color: "#2D2926" }}>{activeProgram}</h2>
                                    <div style={{ width: 60, height: 3, background: "#C5A059", borderRadius: 2, marginBottom: 30 }} />
                                    {currentUni.about.split("\n\n").map((para: any, i: any) => (
                                        <p key={i} style={{
                                            color: "#6B5E51", fontSize: 16, lineHeight: 1.8, marginBottom: 20,
                                            opacity: aboutVisible ? 1 : 0, transform: aboutVisible ? "translateY(0)" : "translateY(16px)",
                                            transition: `opacity .6s ease ${i * 120}ms, transform .6s ease ${i * 120}ms`,
                                        }}>{para}</p>
                                    ))}
                                </div>
                            )}

                            {/* WILL YOU GET IN — Scatter */}
                            {scatterPoints && scatterPoints.length > 0 && (
                                <div ref={scatterRef} className="section-anchor" id="willyougetin">
                                    <span className="tag" style={{ marginBottom: 20, display: "inline-block" }}>Success Analysis</span>
                                    <h2 className="fd" style={{ fontSize: 36, fontWeight: 700, marginBottom: 24, letterSpacing: "-0.01em", color: "#2D2926" }}>
                                        Admission Success Matrix
                                    </h2>

                                    <div className="card" style={{ padding: 40 }}>
                                        {/* Controls */}
                                        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 30, flexWrap: "wrap" }}>
                                            <div style={{ display: "flex", gap: 10 }}>
                                                {["Undergrad", "Master's", "Ph.D."].map(d => (
                                                    <button key={d} className={`degree-btn ${degreeLevel === d ? "active" : ""}`}
                                                        onClick={() => setDegreeLevel(d)}>{d}</button>
                                                ))}
                                            </div>
                                            <div style={{ marginLeft: "auto", display: "flex", gap: 20 }}>
                                                {[["#22c55e", "Admit"], ["#ef4444", "Reject"], ["#C5A059", "Applied"]].map(([c, l]) => (
                                                    <span key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6B5E51", fontWeight: 500 }}>
                                                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: c, display: "inline-block" }} />{l}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <ScatterPlot points={scatterPoints} visible={scatterVisible} />

                                        <div style={{ display: "flex", gap: 16, marginTop: 30 }}>
                                            <button className="btn-gold" style={{ borderRadius: 16, padding: "12px 28px" }}>Compare My Stats</button>
                                            <button className="btn-outline" style={{ borderRadius: 16 }}>Historical Trends</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STUDENT DEMOGRAPHICS */}
                            {activeBranch?.student_demographics && (
                                <div ref={demoRef} className="section-anchor" id="studentdemographics">
                                    <span className="tag" style={{ marginBottom: 20, display: "inline-block" }}>Demographics</span>
                                    <h2 className="fd" style={{ fontSize: 36, fontWeight: 700, marginBottom: 24, letterSpacing: "-0.01em" }}>Student Community</h2>

                                    <div className="card" style={{ padding: 40 }}>
                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 30, marginBottom: 40 }}>
                                            {[
                                                ["♂", `${activeBranch.student_demographics.male}%`, "Male Students", "#C5A059"], 
                                                ["♀", `${activeBranch.student_demographics.female}%`, "Female Students", "#C5A059"], 
                                                ["🌍", `${activeBranch.student_demographics.international_students}%`, "International", "#C5A059"]
                                            ].map(([icon, pct, label, color], i) => (
                                                <div key={i} style={{
                                                    textAlign: "center", padding: "24px", background: "#F8F5F0", borderRadius: 24,
                                                    opacity: demoVisible ? 1 : 0,
                                                    transform: demoVisible ? "translateY(0)" : "translateY(20px)",
                                                    transition: `all .6s ease ${i * 120}ms`,
                                                }}>
                                                    <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
                                                    <p className="fd" style={{ fontSize: 32, fontWeight: 700, color: "#2D2926", marginBottom: 6 }}>{pct}</p>
                                                    <p style={{ fontSize: 13, color: "#6B5E51", fontWeight: 500 }}>{label}</p>
                                                </div>
                                            ))}
                                        </div>
                                        {activeBranch.student_demographics.total_enrollment && (
                                            <div style={{ borderTop: "1px solid rgba(197,160,89,.1)", paddingTop: 24, textAlign: "center" }}>
                                                <span style={{ fontSize: 14, color: "#6B5E51", fontWeight: 500 }}>Global Student Network: </span>
                                                <span className="fd" style={{ fontSize: 24, fontWeight: 700, color: "#C5A059" }}>
                                                    <CountUp target={activeBranch.student_demographics.total_enrollment} /> Members
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ADMITTED PROFILES */}
                            {(activeBranch?.stats?.avg_gpa || activeBranch?.stats?.avg_gre || activeBranch?.admitted_profiles) && (
                                <div ref={admitRef} className="section-anchor" id="admittedprofiles">
                                    <span className="tag" style={{ marginBottom: 20, display: "inline-block" }}>Admit Standards</span>
                                    <h2 className="fd" style={{ fontSize: 36, fontWeight: 700, marginBottom: 24, letterSpacing: "-0.01em" }}>Academic Benchmarks</h2>

                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 30 }}>
                                        {[["Average CGPA", activeBranch?.stats?.avg_gpa], ["Average GRE Score", activeBranch?.stats?.avg_gre]].map(([label, val], i) => val && (
                                            <div key={i} className="card" style={{ padding: 30, textAlign: "center", background: "#F8F5F0" }}>
                                                <p style={{ fontSize: 13, color: "#6B5E51", marginBottom: 10, textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 600 }}>{label}</p>
                                                <p className="fd" style={{ fontSize: 48, fontWeight: 700, color: "#C5A059" }}>{val}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {activeBranch?.admitted_profiles && (
                                        <div className="card" style={{ padding: 30, marginBottom: 30 }}>
                                            <p style={{ fontSize: 13, color: "#6B5E51", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 24, textAlign: "center", fontWeight: 600 }}>Language Proficiency</p>
                                            <div style={{ display: "flex", gap: 0 }}>
                                                {[["TOEFL Min.", activeBranch.admitted_profiles.toefl_min], ["TOEFL Avg.", activeBranch.admitted_profiles.toefl_avg], ["IELTS Target", activeBranch.admitted_profiles.ielts_min]].map(([l, v], i) => v && (
                                                    <div key={i} className={i < 2 ? "stat-divider" : ""} style={{ flex: 1, textAlign: "center", padding: "0 20px" }}>
                                                        <p className="fd" style={{ fontSize: 28, fontWeight: 700, color: "#2D2926", marginBottom: 6 }}>{v}</p>
                                                        <p style={{ fontSize: 12, color: "#6B5E51", fontWeight: 500 }}>{l}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Acceptance rings */}
                                    <div className="card" style={{ padding: 40, marginBottom: 30 }}>
                                        <div style={{ display: "flex", gap: 60, justifyContent: "center", flexWrap: "wrap" }}>
                                            {activeBranch?.stats?.acceptance_rate && <RingChart pct={activeBranch.stats.acceptance_rate} size={140} label={`Selective Admission (${activeProgram})`} />}
                                            <RingChart pct={12} size={140} label="Global Graduate Admit Rate" />
                                        </div>
                                    </div>

                                    {/* Profile cards */}
                                    {(activeBranch?.admitted_profiles_list && activeBranch.admitted_profiles_list.length > 0) && (
                                        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 16 }}>
                                            <h3 className="fd" style={{ fontSize: 24, fontWeight: 700, marginBottom: 10, color: "#2D2926" }}>Recent Success Stories</h3>
                                            {activeBranch.admitted_profiles_list.map((p: any, i: number) => (
                                                <div key={i} className="card" style={{
                                                    padding: "24px 30px", position: "relative", overflow: "hidden",
                                                    opacity: admitVisible ? 1 : 0,
                                                    transform: admitVisible ? "translateY(0)" : "translateY(16px)",
                                                    transition: `all .5s ease ${i * 80}ms`,
                                                }}>
                                                    <div className="admit-badge">OFFER ISSUED</div>
                                                    <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                                                        <div style={{ width: 54, height: 54, borderRadius: "50%", background: "#F8F5F0", border: "1px solid rgba(197,160,89,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>👤</div>
                                                        <div style={{ flex: 1 }}>
                                                            <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 4, color: "#2D2926" }}>{p.name}</p>
                                                            <p style={{ fontSize: 13, color: "#6B5E51" }}>📍 {p.location} &nbsp;•&nbsp; {p.term}</p>
                                                        </div>
                                                        <div style={{ textAlign: "right" }}>
                                                            <p style={{ fontSize: 14, color: "#C5A059", fontWeight: 700 }}>{currentUni.name}</p>
                                                            <p style={{ fontSize: 12, color: "#6B5E51", fontWeight: 500 }}>{p.program}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* COST OF EDUCATION */}
                            {(activeBranch?.stats?.tuition_fee || activeBranch?.stats?.living_expense) && (
                                <div ref={costRef} className="section-anchor" id="costofeducation">
                                    <span className="tag" style={{ marginBottom: 20, display: "inline-block" }}>Investment</span>
                                    <h2 className="fd" style={{ fontSize: 36, fontWeight: 700, marginBottom: 24, letterSpacing: "-0.01em" }}>Financial Commitment</h2>

                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                        {[["🎓", "Annual Tuition", activeBranch?.stats?.tuition_fee, "usd"], ["🏠", "Living Lifestyle", activeBranch?.stats?.living_expense, "usd"]].map(([icon, label, val, unit], i) => val && (
                                            <div key={i} className="card" style={{
                                                padding: 30,
                                                opacity: costVisible ? 1 : 0,
                                                transform: costVisible ? "translateY(0)" : "translateY(20px)",
                                                transition: `all .6s ease ${i * 120}ms`,
                                            }}>
                                                <span style={{ fontSize: 36, display: "block", marginBottom: 16 }}>{icon}</span>
                                                <p style={{ fontSize: 13, color: "#6B5E51", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 600 }}>{label}</p>
                                                <p className="fd" style={{ fontSize: 36, fontWeight: 700, color: "#15803d" }}>
                                                    <CountUp target={val} prefix="$" />
                                                    <span style={{ fontSize: 14, fontWeight: 500, color: "#6B5E51", marginLeft: 4 }}>{unit}</span>
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* EMPLOYMENT */}
                            {(data.common_sections?.employment_figures || activeBranch?.stats?.avg_salary) && (
                                <div ref={empRef} className="section-anchor" id="employmentfigure">
                                    <span className="tag" style={{ marginBottom: 20, display: "inline-block" }}>Outcomes</span>
                                    <h2 className="fd" style={{ fontSize: 36, fontWeight: 700, marginBottom: 24, letterSpacing: "-0.01em" }}>Career Excellence</h2>

                                    <div className="card" style={{ padding: 40 }}>
                                        <div style={{ display: "flex", gap: 60, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
                                            {data.common_sections?.employment_figures?.employed && <RingChart pct={data.common_sections.employment_figures.employed} size={150} label="Career Placement" />}
                                            {data.common_sections?.employment_figures?.employed_within_3_months && <RingChart pct={data.common_sections.employment_figures.employed_within_3_months} size={150} label="Fast-track Employment" />}
                                        </div>
                                        {(activeBranch?.stats?.avg_salary || data.common_sections?.employment_figures?.average_salary) && (
                                            <div style={{ background: "#F8F5F0", border: "1px solid rgba(197,160,89,.2)", borderRadius: 24, padding: "30px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <span style={{ fontSize: 16, color: "#6B5E51", fontWeight: 600 }}>Average Alumni Salary</span>
                                                <span className="fd" style={{ fontSize: 36, fontWeight: 700, color: "#15803d" }}>
                                                    <CountUp target={activeBranch.stats?.avg_salary || data.common_sections?.employment_figures?.average_salary || 0} prefix="$" suffix="/yr" />
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* FINANCIAL AWARDS */}
                            <div ref={awardsRef} className="section-anchor" id="financialawards">
                                <span className="tag" style={{ marginBottom: 20, display: "inline-block" }}>Scholarships</span>
                                <h2 className="fd" style={{ fontSize: 36, fontWeight: 700, marginBottom: 24, letterSpacing: "-0.01em" }}>Elite Funding</h2>

                                <div className="card" style={{ padding: 40 }}>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, marginBottom: 30 }}>
                                        {[["150+", "Prestigious Fellowships"], ["50+", "Academic Assistanceships"], ["200+", "Research Grants"]].map(([val, label], i) => (
                                            <div key={i} className={i < 2 ? "stat-divider" : ""} style={{ flex: 1, textAlign: "center", padding: "0 20px" }}>
                                                <p className="fd" style={{ fontSize: 44, fontWeight: 700, color: "#C5A059", marginBottom: 6 }}>
                                                    {awardsVisible ? <CountUp target={parseInt(val)} suffix="+" /> : val}
                                                </p>
                                                <p style={{ fontSize: 12, color: "#6B5E51", fontWeight: 500, lineHeight: 1.4 }}>{label}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ borderTop: "1px solid rgba(197,160,89,.1)", paddingTop: 30, textAlign: "center" }}>
                                        <p style={{ fontSize: 14, color: "#6B5E51", marginBottom: 20, fontWeight: 500 }}>Concierge Financial Support</p>
                                        <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                                            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#F8F5F0", border: "1px solid rgba(197,160,89,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>💼</div>
                                            <span className="fd" style={{ fontSize: 18, fontWeight: 700, color: "#2D2926" }}>Consult with Award Specialists</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* REVIEWS */}
                            <div className="section-anchor" id="reviews">
                                <span className="tag" style={{ marginBottom: 20, display: "inline-block" }}>Testimonials</span>
                                <h2 className="fd" style={{ fontSize: 36, fontWeight: 700, marginBottom: 24, letterSpacing: "-0.01em" }}>Student Experience</h2>
                                <div className="space-y-6">
                                    {(data.common_sections?.reviews || [
                                        { rating: 5, comment: "Exceptional academic environment and world-class research facilities." }
                                    ]).map((rev: any, i: number) => (
                                        <div key={i} className="card" style={{ padding: 30 }}>
                                            <div style={{ display: "flex", gap: 6, color: "#C5A059", marginBottom: 16, fontSize: 18 }}>
                                                {[...Array(5)].map((_, j) => <span key={j}>{j < rev.rating ? "★" : "☆"}</span>)}
                                            </div>
                                            <p style={{ fontSize: 16, color: "#6B5E51", lineHeight: 1.8, fontStyle: "italic", fontWeight: 400 }}>"{rev.comment}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* FAQ */}
                            <div className="section-anchor" id="faq">
                                <span className="tag" style={{ marginBottom: 20, display: "inline-block" }}>Knowledge Base</span>
                                <h2 className="fd" style={{ fontSize: 36, fontWeight: 700, marginBottom: 24, letterSpacing: "-0.01em" }}>Essential FAQ</h2>
                                <div className="space-y-4">
                                    {(data.common_sections?.faq || [
                                        { q: "What is the application deadline?", a: "Deadlines vary by program. Generally, Fall intake applications close in January-March." }
                                    ]).map((item: any, i: number) => (
                                        <div key={i} className="card" style={{ padding: 24 }}>
                                            <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 10, color: "#2D2926" }}>Q: {item.q}</p>
                                            <p style={{ fontSize: 14, color: "#6B5E51", lineHeight: 1.6 }}>{item.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* ── RIGHT SIDEBAR ── */}
                        <div style={{ position: "sticky", top: 40, display: "flex", flexDirection: "column", gap: 24 }}>

                            {/* Get help card - NEXSALON Notification Style */}
                            <div style={{ background: "#2D2926", borderRadius: 32, padding: 30, color: "#FFFFFF", boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }}>
                                <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
                                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>💬</div>
                                    <div>
                                        <p style={{ fontSize: 13, opacity: 0.8, fontWeight: 400, marginBottom: 2 }}>Exclusive Offer</p>
                                        <p style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.3 }}>Ready to secure your spot at <span style={{ color: "#C5A059" }}>{currentUni.name}</span>?</p>
                                    </div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    <button className="btn-gold" style={{ width: "100%", padding: "14px", borderRadius: 16, fontSize: 14 }}>Apply with Priority</button>
                                    <button style={{ width: "100%", padding: "14px", borderRadius: 16, fontSize: 14, background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#FFFFFF" }}>Speak with Counsellor</button>
                                </div>
                            </div>

                            {/* Similar universities */}
                            <div className="card" style={{ padding: "24px 20px" }}>
                                <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, padding: "0 8px", color: "#201D1A" }}>Global Peer Institutions</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    {(data.similarUniversities || [
                                        { name: "Top Tier Institutional Peer", location: data.location?.country || "International", emoji: "🏛️" }
                                    ]).map((u: any, i: number) => (
                                        <div key={i} className="similar-row">
                                            <div style={{ width: 40, height: 40, borderRadius: 12, background: "#F8F5F0", border: "1px solid rgba(197,160,89,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                                                {u.emoji || "🏛️"}
                                            </div>
                                            <div>
                                                <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 1, color: "#2D2926" }}>{u.university || u.name}</p>
                                                <p style={{ fontSize: 11, color: "#6B5E51", fontWeight: 500 }}>{u.location?.city || u.location}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Stats Card - NEXSALON Style */}
                            <div className="card" style={{ padding: 24, textAlign: "center", background: "#F8F5F0" }}>
                                <p style={{ fontSize: 12, fontWeight: 700, color: "#C5A059", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>Trust Index</p>
                                <p className="fd" style={{ fontSize: 40, fontWeight: 700, color: "#2D2926", lineHeight: 1 }}>98.4%</p>
                                <p style={{ fontSize: 12, color: "#6B5E51", marginTop: 8 }}>Student Satisfaction Rate</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}