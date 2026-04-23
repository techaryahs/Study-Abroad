"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useRef, useMemo } from "react";
import UniversityCard from "../UniversityCard";
import BookCounsellingModal from "@/components/shared/BookCounsellingModal";
import singaporeData from "@/data/singapore.json";
import newZealandData from "@/data/NewZealand Universities.json";
import germanyData from "@/data/Germany.json";
import usaData from "@/data/USA.json";
import ukData from "@/data/UK.json";
import ausData from "@/data/AUS.json";
import canadaData from "@/data/Canada.json";
import dubaiData from "@/data/Dubai.json";
import irelandData from "@/data/Ireland.json";
import switzerlandData from "@/data/Switzerland.json";
import netherlandsData from "@/data/Netherlands.json";
import franceData from "@/data/France.json";

// ─── Helpers ────────────────────────────────────────────────────────────────

function useInView(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible] as const;
}

type CountryKey = "singapore" | "new zealand" | "germany" | "united states" | "usa" | "australia" | "united kingdom" | "uk";

const COUNTRY_META: Record<string, { flag: string; color: string; label: string; hero: string }> = {
  "singapore": { flag: "🇸🇬", color: "#ef4444", label: "Singapore", hero: "Finance & Tech Hub" },
  "new zealand": { flag: "🇳🇿", color: "#16a34a", label: "New Zealand", hero: "World-Class Education" },
  "germany": { flag: "🇩🇪", color: "#60a5fa", label: "Germany", hero: "Engineering Excellence" },
  "united states": { flag: "🇺🇸", color: "#3b82f6", label: "United States", hero: "Ivy League & Beyond" },
  "usa": { flag: "🇺🇸", color: "#3b82f6", label: "United States", hero: "Ivy League & Beyond" },
  "australia": { flag: "🇦🇺", color: "#fbbf24", label: "Australia", hero: "Innovation & Excellence" },
  "united kingdom": { flag: "🇬🇧", color: "#8b5cf6", label: "United Kingdom", hero: "Legacy of Excellence" },
  "uk": { flag: "🇬🇧", color: "#8b5cf6", label: "United Kingdom", hero: "Legacy of Excellence" },
  "canada": { flag: "🇨🇦", color: "#ef4444", label: "Canada", hero: "Quality of Life & Education" },
  "dubai": { flag: "🇦🇪", color: "#10b981", label: "Dubai", hero: "Innovation & Business Hub" },
  "uae": { flag: "🇦🇪", color: "#10b981", label: "Dubai", hero: "Innovation & Business Hub" },
  "ireland": { flag: "🇮🇪", color: "#16a34a", label: "Ireland", hero: "Emerald Isle of Excellence" },
  "switzerland": { flag: "🇨🇭", color: "#ef4444", label: "Switzerland", hero: "Peak of Innovation & Research" },
  "netherlands": { flag: "🇳🇱", color: "#f97316", label: "Netherlands", hero: "Gateway to Global Careers" },
  "france": { flag: "🇫🇷", color: "#3b82f6", label: "France", hero: "Legacy of Elite Education" },
};

const FILTER_RANGES = {
  acceptance: [
    { label: "Any", min: 0, max: 100 },
    { label: "< 10%", min: 0, max: 10 },
    { label: "10–30%", min: 10, max: 30 },
    { label: "30–60%", min: 30, max: 60 },
    { label: "> 60%", min: 60, max: 100 },
  ],
  tuition: [
    { label: "Any", min: 0, max: Infinity },
    { label: "< $20K", min: 0, max: 20000 },
    { label: "$20–40K", min: 20000, max: 40000 },
    { label: "$40–60K", min: 40000, max: 60000 },
    { label: "> $60K", min: 60000, max: Infinity },
  ],
};

const SORT_OPTIONS = ["Ranking", "Name (A–Z)", "Acceptance Rate", "Tuition (Low–High)"];

// ─── Sub-components ──────────────────────────────────────────────────────────

function FilterSection({ title, icon, options, active, onChange }: { title: string, icon: string, options: any[], active: number, onChange: (i: number) => void }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ borderBottom: "1px solid rgba(197,160,89, 0.12)", paddingBottom: 16, marginBottom: 16 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", background: "none", border: "none", cursor: "pointer",
          color: "#2D2926", fontSize: 13, fontWeight: 700, marginBottom: open ? 12 : 0,
          fontFamily: "'DM Sans', sans-serif", padding: 0,
        }}>
        <span>{icon} {title}</span>
        <span style={{ fontSize: 10, color: "#6B5E51", transition: "transform .2s", transform: open ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
      </button>
      {open && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {options.map((opt, i) => (
            <button key={i}
              onClick={() => onChange(i)}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "7px 10px",
                borderRadius: 10, border: "none", cursor: "pointer", textAlign: "left",
                fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                background: active === i ? "rgba(197,160,89,.15)" : "transparent",
                color: active === i ? "#C5A059" : "#6B5E51",
                transition: "all .2s ease",
              }}>
              <span style={{
                width: 14, height: 14, borderRadius: "50%", flexShrink: 0,
                border: active === i ? "none" : "1px solid rgba(197,160,89,.38)",
                background: active === i ? "#C5A059" : "transparent",
                transition: "all .2s",
              }} />
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function StatPill({ icon, value, label }: { icon: string, value: string | number, label: string }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
      padding: "16px 24px", flex: 1,
      background: "#F8F5F0", borderRadius: 20, margin: "0 4px"
    }}>
      <span style={{ fontSize: 24 }}>{icon}</span>
      <span style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 24, fontWeight: 700, color: "#2D2926",
      }}>{value}</span>
      <span style={{ fontSize: 10, color: "#6B5E51", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 600 }}>{label}</span>
    </div>
  );
}

// Animated skeleton card while loading
function SkeletonCard() {
  return (
    <div style={{
      background: "#FFFFFF", border: "1px solid rgba(197,160,89, 0.15)",
      borderRadius: 24, padding: 30, overflow: "hidden", position: "relative",
    }}>
      <div className="skel" style={{ height: 24, width: "60%", borderRadius: 8, marginBottom: 16 }} />
      <div className="skel" style={{ height: 16, width: "40%", borderRadius: 6, marginBottom: 24 }} />
      <div style={{ display: "flex", gap: 16 }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="skel" style={{ height: 60, flex: 1, borderRadius: 12 }} />
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function CountryPage() {
  const { country } = useParams();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [sortIdx, setSortIdx] = useState(0);
  const [acceptFilter, setAcceptFilter] = useState(0);
  const [tuitionFilter, setTuitionFilter] = useState(0);
  const [page, setPage] = useState(1);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const PER_PAGE = 10;

  const [heroRef, heroVisible] = useInView(0.05);
  const [listRef, listVisible] = useInView(0.05);

  useEffect(() => { setMounted(true); }, []);

  // ── Dataset selection ──
  const countryLower = (country as string).toLowerCase().replace(/-/g, " ");
  const meta = COUNTRY_META[countryLower] ?? { flag: "🌍", color: "#C5A059", label: (country as string), hero: "World-Class Education" };

  let dataCountry = meta.label;
  let rawUniversities: any[] = [];

  if (countryLower === "singapore") {
    dataCountry = "Singapore";
    rawUniversities = singaporeData;
  } else if (countryLower === "new zealand") {
    dataCountry = "New Zealand";
    rawUniversities = newZealandData;
  } else if (countryLower === "germany") {
    dataCountry = "Germany";
    rawUniversities = germanyData;
  } else if (countryLower === "usa" || countryLower === "united states") {
    dataCountry = "United States";
    rawUniversities = usaData;
  } else if (countryLower === "uk" || countryLower === "united kingdom") {
    dataCountry = "United Kingdom";
    rawUniversities = ukData;
  } else if (countryLower === "australia") {
    dataCountry = "Australia";
    rawUniversities = ausData;
  } else if (countryLower === "canada") {
    dataCountry = "Canada";
    rawUniversities = canadaData;
  } else if (countryLower === "dubai" || countryLower === "uae") {
    dataCountry = "Dubai";
    rawUniversities = dubaiData;
  } else if (countryLower === "ireland") {
    dataCountry = "Ireland";
    rawUniversities = irelandData;
  } else if (countryLower === "switzerland") {
    dataCountry = "Switzerland";
    rawUniversities = switzerlandData;
  } else if (countryLower === "netherlands") {
    dataCountry = "Netherlands";
    rawUniversities = netherlandsData;
  } else if (countryLower === "france") {
    dataCountry = "France";
    rawUniversities = franceData;
  }

  // ── Normalize ──
  const universities = useMemo(() => rawUniversities.map((uni: any, index: number) => {
    const name = uni.university || uni.university_name || uni.name || `University ${index + 1}`;
    let location = uni.location || uni.country || dataCountry;
    let address = uni.address || uni.city || "";
    if (typeof uni.location === "object" && uni.location !== null) {
      location = uni.location.country || dataCountry;
      address = [uni.location.city, uni.location.state].filter(Boolean).join(", ") || "";
    }
    let tuition = null, tuitionRaw = 0;
    if (uni.annual_tuition_sgd) { tuition = `S$${uni.annual_tuition_sgd.toLocaleString()}`; tuitionRaw = uni.annual_tuition_sgd; }
    else if (uni.annual_tuition_eur) { tuition = `€${uni.annual_tuition_eur.toLocaleString()}`; tuitionRaw = uni.annual_tuition_eur; }
    else if (uni.tuition_fees_eur) { tuition = `€${uni.tuition_fees_eur.toLocaleString()}`; tuitionRaw = uni.tuition_fees_eur; }
    else if (uni.tuition_eur) { tuition = `€${uni.tuition_eur.toLocaleString()}`; tuitionRaw = uni.tuition_eur; }
    else if (uni.tuition_fees_chf) { tuition = `CHF ${uni.tuition_fees_chf.toLocaleString()}`; tuitionRaw = uni.tuition_fees_chf; }
    else if (uni.branches?.[0]?.stats?.tuition_fee) {
      const amount = uni.branches[0].stats.tuition_fee;
      if (countryLower === "switzerland") tuition = `CHF ${amount.toLocaleString()}`;
      else if (countryLower === "uk" || countryLower === "united kingdom") tuition = `£${amount.toLocaleString()}`;
      else tuition = `$${amount.toLocaleString()}`;
      tuitionRaw = amount;
    }

    let acceptance = null, acceptanceRaw = null;
    if (uni.acceptance_rate_pct != null) { acceptance = `${uni.acceptance_rate_pct}%`; acceptanceRaw = uni.acceptance_rate_pct; }
    else if (uni.branches?.[0]?.stats?.acceptance_rate != null) { acceptance = `${uni.branches[0].stats.acceptance_rate}%`; acceptanceRaw = uni.branches[0].stats.acceptance_rate; }

    let salary = null, sat = null, toefl = null, gpa = null;
    if (uni.common_sections?.employment_figures?.average_salary) salary = `$${uni.common_sections.employment_figures.average_salary.toLocaleString()}`;
    else if (uni.branches) {
      const b = uni.branches.find((b: any) => b.stats?.avg_salary);
      if (b) salary = `$${b.stats.avg_salary.toLocaleString()}`;
    }

    if (uni.branches && Array.isArray(uni.branches)) {
      // Robust multi-pass extraction
      const firstBranch = uni.branches[0];

      // Pass 1: Try first branch for everything
      sat = firstBranch.stats?.avg_sat || null;
      toefl = firstBranch.admitted_profiles?.toefl_min || firstBranch.stats?.toefl_min || null;
      gpa = firstBranch.stats?.avg_gpa || null;

      // Pass 2: If anything is missing, search all branches
      if (!sat) {
        const b = uni.branches.find((br: any) => br.stats?.avg_sat);
        if (b) sat = b.stats.avg_sat;
      }
      if (!toefl) {
        const b = uni.branches.find((br: any) => br.admitted_profiles?.toefl_min || br.stats?.toefl_min);
        if (b) toefl = b.admitted_profiles?.toefl_min || b.stats?.toefl_min;
      }
      if (!gpa) {
        const b = uni.branches.find((br: any) => br.stats?.avg_gpa);
        if (b) gpa = b.stats.avg_gpa;
      }
    }

    return {
      id: uni.id || uni._id || index + 1,
      name,
      slug: uni.slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      location, address, tuition, tuitionRaw, acceptance, acceptanceRaw,
      salary, sat, toefl, gpa,
      image: uni.logo || "/assets/university-placeholder.jpg",
      ranking: uni.ymgrad_rank || index + 1,
    };
  }), [rawUniversities]);

  // ── Stats Calculation ──
  const stats = useMemo(() => {
    const list = universities.filter(u => u.acceptanceRaw || u.tuitionRaw);
    if (!list.length) return { acc: "N/A", tuition: "N/A" };

    const accPoints = universities.filter(u => u.acceptanceRaw).map(u => u.acceptanceRaw as number);
    const avgAcc = accPoints.length ? Math.round(accPoints.reduce((a, b) => a + b, 0) / accPoints.length) : null;

    const tPoints = universities.filter(u => u.tuitionRaw).map(u => u.tuitionRaw as number);
    const avgT = tPoints.length ? Math.round(tPoints.reduce((a, b) => a + b, 0) / tPoints.length) : null;

    let tFormatted = "N/A";
    if (avgT) {
      if (countryLower === "singapore") tFormatted = `S$${Math.round(avgT / 1000)}K+`;
      else if (["germany", "ireland", "netherlands", "france"].includes(countryLower)) tFormatted = `€${Math.round(avgT / 1000)}K+`;
      else if (countryLower === "switzerland") tFormatted = `CHF ${Math.round(avgT / 1000)}K+`;
      else if (countryLower === "uk" || countryLower === "united kingdom") tFormatted = `£${Math.round(avgT / 1000)}K+`;
      else tFormatted = `$${Math.round(avgT / 1000)}K+`;
    }

    return {
      acc: avgAcc ? `${Math.max(5, avgAcc - 5)}–${avgAcc + 5}%` : "N/A",
      tuition: tFormatted
    };
  }, [universities, countryLower]);

  // ── Filter + sort ──
  const filtered = useMemo(() => {
    let list = universities.filter(u => {
      const q = search.toLowerCase();
      if (q && !u.name.toLowerCase().includes(q) && !u.address.toLowerCase().includes(q)) return false;
      const ar = FILTER_RANGES.acceptance[acceptFilter];
      if (u.acceptanceRaw != null && (u.acceptanceRaw < ar.min || u.acceptanceRaw > ar.max)) return false;
      const tr = FILTER_RANGES.tuition[tuitionFilter];
      if (u.tuitionRaw && (u.tuitionRaw < tr.min || u.tuitionRaw > tr.max)) return false;
      return true;
    });
    if (sortIdx === 1) list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (sortIdx === 2) list = [...list].sort((a, b) => (a.acceptanceRaw ?? 999) - (b.acceptanceRaw ?? 999));
    else if (sortIdx === 3) list = [...list].sort((a, b) => (a.tuitionRaw ?? 999999) - (b.tuitionRaw ?? 999999));
    else list = [...list].sort((a, b) => a.ranking - b.ranking);
    return list;
  }, [universities, search, acceptFilter, tuitionFilter, sortIdx]);

  const paginated = filtered.slice(0, page * PER_PAGE);
  const hasMore = paginated.length < filtered.length;

  return (
    <div className="min-h-screen text-[#2D2926] overflow-x-hidden" style={{ background: "#FDFBF7", fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes fadeUp  { from{opacity:0;transform:translateY(28px);} to{opacity:1;transform:translateY(0);} }
        @keyframes fadeIn  { from{opacity:0;} to{opacity:1;} }
        @keyframes shimmer { 0%{background-position:-200% center;} 100%{background-position:200% center;} }
        @keyframes pulse   { 0%,100%{opacity:.5;} 50%{opacity:1;} }
        @keyframes cardIn  { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
        @keyframes skelPulse{ 0%,100%{opacity:.06;} 50%{opacity:.14;} }

        .fd { font-family:'Cormorant Garamond',Georgia,serif; }

        .afu { animation:fadeUp .75s cubic-bezier(.16,1,.3,1) both; }
        .afi { animation:fadeIn .6s ease both; }

        .d1{animation-delay:.08s;} .d2{animation-delay:.18s;}
        .d3{animation-delay:.28s;} .d4{animation-delay:.40s;}
        .d5{animation-delay:.52s;}

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
          border:1px solid rgba(197,160,89,.38); border-radius:999px;
          padding:4px 14px; fontWeight: 700;
        }

        .card {
          background:#FFFFFF;
          border:1px solid rgba(197,160,89, 0.15);
          border-radius:24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          transition:transform .3s ease, border-color .3s ease, box-shadow .3s ease;
        }
        .card:hover { border-color:rgba(197,160,89, 0.4); box-shadow: 0 10px 30px rgba(0,0,0,0.05); }

        .sort-btn {
          padding:8px 20px; border-radius:999px; font-size:12px; font-weight:600;
          cursor:pointer; border:1px solid rgba(197,160,89, 0.3);
          color:#6B5E51; background:transparent; transition:all .2s ease;
          font-family:'DM Sans',sans-serif; white-space:nowrap;
        }
        .sort-btn:hover { border-color:rgba(197,160,89, 0.6); color:#2D2926; }
        .sort-btn.active { background:rgba(197,160,89, 0.15); color:#C5A059; border-color:rgba(197,160,89, 0.6); }

        .search-box {
          width:100%; background:#FDFBF7;
          border:1px solid rgba(197,160,89, 0.3); border-radius:16px;
          color:#2D2926; font-size:15px; padding:14px 50px 14px 20px;
          outline:none; font-family:'DM Sans',sans-serif;
          transition:border-color .25s, box-shadow .25s;
        }
        .search-box:focus { border-color:rgba(197,160,89, 0.6); box-shadow: 0 0 0 4px rgba(197,160,89, 0.05); }
        .search-box::placeholder { color:#A8A29E; }

        .load-more {
          background:transparent; color:#C5A059;
          border:1px solid rgba(197,160,89, 0.5); border-radius:16px;
          padding:14px 40px; font-size:14px; font-weight:700; cursor:pointer;
          font-family:'DM Sans',sans-serif;
          transition:all .25s;
        }
        .load-more:hover {
          background:rgba(197,160,89, 0.05);
          border-color:#C5A059;
          transform:translateY(-2px);
        }

        .skel {
          background:#F8F5F0;
          animation:skelPulse 1.6s ease-in-out infinite;
        }
      `}</style>

      <div className="relative" style={{ zIndex: 1 }}>

        {/* ══ HERO ══ */}
        <section ref={heroRef} style={{
          background: "linear-gradient(180deg,rgba(197,160,89, 0.05) 0%,transparent 100%)",
          borderBottom: "1px solid rgba(197,160,89, 0.1)",
          padding: "60px 0 50px",
        }}>
          <div className="max-w-6xl mx-auto px-6">
            {/* Breadcrumb */}
            <div className={mounted ? "afu" : "opacity-0"} style={{ marginBottom: 20 }}>
              <span style={{ fontSize: 13, color: "#6B5E51", fontWeight: 500 }}>Global Index</span>
              <span style={{ fontSize: 13, color: "#6B5E51", margin: "0 10px" }}>›</span>
              <span style={{ fontSize: 13, color: "#C5A059", fontWeight: 700 }}>{dataCountry} Institutions</span>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 30 }}>
              <div>
                <span className={`tag ${mounted ? "afu" : "opacity-0"}`} style={{ marginBottom: 16, display: "inline-block" }}>
                  Institutional Catalog
                </span>
                <h1 className={`fd ${mounted ? "afu d1" : "opacity-0"}`}
                  style={{ fontSize: "clamp(40px,6vw,72px)", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.02em", marginBottom: 12, color: "#2D2926" }}>
                  <span style={{ fontSize: "0.9em" }}>{meta.flag}</span>{" "}
                  Elite Education in{" "}
                  <span className="gold-shimmer">{dataCountry}</span>
                </h1>
                <p className={mounted ? "afu d2" : "opacity-0"}
                  style={{ fontSize: 16, color: "#6B5E51", maxWidth: 520, lineHeight: 1.6, fontWeight: 500 }}>
                  {meta.hero} — Curated excellence, admission benchmarks, and global career outcomes.
                </p>
              </div>

              <div 
                className={`card ${mounted ? "afu d3" : "opacity-0"}`} 
                onClick={() => setIsBookingOpen(true)}
                style={{ padding: "16px 24px", display: "flex", alignItems: "center", gap: 14, background: "#2D2926", color: "#FFFFFF", cursor: "pointer" }}
              >
                <span style={{ fontSize: 28 }}>✨</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>Admission Strategy</p>
                  <p style={{ fontSize: 12, opacity: 0.8 }}>Get expert guidance today →</p>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className={`grid grid-cols-2 md:grid-cols-5 gap-4 ${mounted ? "afu d4" : "opacity-0"}`}
              style={{ marginTop: 40 }}>
              <StatPill icon="🏛️" value={universities.length} label="Institutions" />
              <StatPill icon="🌍" value={dataCountry} label="Destination" />
              <StatPill icon="📊" value={stats.acc} label="Admit Selectivity" />
              <StatPill icon="💵" value={stats.tuition} label="Avg. Investment" />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "16px 24px", background: "#F8F5F0", borderRadius: 20 }}>
                <span style={{ fontSize: 24 }}>🎓</span>
                <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: "#2D2926" }}>Global Tier</span>
                <span style={{ fontSize: 10, color: "#6B5E51", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 600 }}>Elite Hub</span>
              </div>
            </div>
          </div>
        </section>

        {/* ══ BODY ══ */}
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 40, alignItems: "start" }}>

            {/* ── FILTERS SIDEBAR ── */}
            <div style={{ position: "sticky", top: 40 }}>
              <div className={`card ${mounted ? "afi" : "opacity-0"}`} style={{ padding: "30px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: "#2D2926" }}>🎛️ Parameters</h2>
                  <button
                    onClick={() => { setAcceptFilter(0); setTuitionFilter(0); setSearch(""); }}
                    style={{
                      fontSize: 12, color: "#6B5E51", background: "none", border: "none",
                      cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
                      transition: "color .2s", fontWeight: 600
                    }}
                    onMouseOver={e => (e.target as HTMLElement).style.color = "#C5A059"}
                    onMouseOut={e => (e.target as HTMLElement).style.color = "#6B5E51"}>
                    Reset
                  </button>
                </div>

                <FilterSection
                  title="Admission Selectivity" icon="📊"
                  options={FILTER_RANGES.acceptance}
                  active={acceptFilter}
                  onChange={i => { setAcceptFilter(i); setPage(1); }}
                />
                <FilterSection
                  title="Annual Fees" icon="💵"
                  options={FILTER_RANGES.tuition}
                  active={tuitionFilter}
                  onChange={i => { setTuitionFilter(i); setPage(1); }}
                />

                {/* Result count */}
                <div style={{
                  marginTop: 10, padding: "20px", borderRadius: 20,
                  background: "#F8F5F0", border: "1px solid rgba(197,160,89, 0.2)",
                }}>
                  <p style={{ fontSize: 13, color: "#6B5E51", marginBottom: 6, fontWeight: 600 }}>Catalogue View</p>
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 700, color: "#2D2926" }}>
                    {filtered.length}
                    <span style={{ fontSize: 15, color: "#6B5E51", fontFamily: "'DM Sans',sans-serif", fontWeight: 500 }}> / {universities.length}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* ── LIST ── */}
            <div ref={listRef}>
              {/* Search + Sort bar */}
              <div className={mounted ? "afu" : "opacity-0"} style={{ marginBottom: 30 }}>
                <div style={{ position: "relative", marginBottom: 20 }}>
                  <input
                    type="text"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                    placeholder={`Find your future at ${dataCountry}…`}
                    className="search-box"
                  />
                  <span style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", fontSize: 20, opacity: 0.5 }}>🔍</span>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "#6B5E51", marginRight: 6, fontWeight: 600 }}>Priority:</span>
                  {SORT_OPTIONS.map((opt, i) => (
                    <button key={i} className={`sort-btn ${sortIdx === i ? "active" : ""}`}
                      onClick={() => { setSortIdx(i); setPage(1); }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cards */}
              {universities.length === 0 ? (
                <div className="card" style={{ padding: 60, textAlign: "center" }}>
                  <p style={{ fontSize: 40, marginBottom: 20 }}>🌐</p>
                  <p className="fd" style={{ fontSize: 28, fontWeight: 700, marginBottom: 12, color: "#2D2926" }}>Access Restricted</p>
                  <p style={{ fontSize: 16, color: "#6B5E51" }}>Broadening our global database. Check back soon.</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="card" style={{ padding: 60, textAlign: "center" }}>
                  <p style={{ fontSize: 40, marginBottom: 20 }}>🔍</p>
                  <p className="fd" style={{ fontSize: 28, fontWeight: 700, marginBottom: 12, color: "#2D2926" }}>Refining Results</p>
                  <p style={{ fontSize: 16, color: "#6B5E51" }}>No institutions match your specific criteria. Try broader parameters.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  {paginated.map((uni, i) => (
                    <div
                      key={uni.id}
                      style={{
                        opacity: listVisible ? 1 : 0,
                        transform: listVisible ? "translateY(0)" : "translateY(20px)",
                        transition: `opacity .55s ease ${Math.min(i, 5) * 60}ms, transform .55s ease ${Math.min(i, 5) * 60}ms`,
                      }}>

                      {/* Card aesthetic is now handled by UniversityCard being upgraded */}
                      <UniversityCard key={uni.id} uni={uni} />
                    </div>
                  ))}

                  {/* Load more */}
                  {hasMore && (
                    <div style={{ textAlign: "center", paddingTop: 30 }}>
                      <button className="load-more" onClick={() => setPage(p => p + 1)}>
                        Reveal More Opportunities ({filtered.length - paginated.length} hidden)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <BookCounsellingModal 
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}