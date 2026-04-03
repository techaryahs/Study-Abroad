"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useRef, useMemo } from "react";
import UniversityCard from "../UniversityCard";
import singaporeData from "@/data/singapore.json";
import newZealandData from "@/data/NewZealand Universities.json";
import germanyData from "@/data/YM_Grad_Germany_Universities.json";
import germanyPart2Data from "@/data/Germany_Universities_Part2.json";
import usaData from "@/data/USA.json";

// ─── Helpers ────────────────────────────────────────────────────────────────

function useInView(threshold = 0.08) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

const COUNTRY_META = {
  "singapore":      { flag: "🇸🇬", color: "#ef4444", label: "Singapore",     hero: "Finance & Tech Hub" },
  "new zealand":    { flag: "🇳🇿", color: "#16a34a", label: "New Zealand",   hero: "World-Class Education" },
  "germany":        { flag: "🇩🇪", color: "#60a5fa", label: "Germany",       hero: "Engineering Excellence" },
  "united states":  { flag: "🇺🇸", color: "#3b82f6", label: "United States", hero: "Ivy League & Beyond" },
  "usa":            { flag: "🇺🇸", color: "#3b82f6", label: "United States", hero: "Ivy League & Beyond" },
};

const FILTER_RANGES = {
  acceptance: [
    { label: "Any",       min: 0,   max: 100 },
    { label: "< 10%",     min: 0,   max: 10  },
    { label: "10–30%",    min: 10,  max: 30  },
    { label: "30–60%",    min: 30,  max: 60  },
    { label: "> 60%",     min: 60,  max: 100 },
  ],
  tuition: [
    { label: "Any",       min: 0,        max: Infinity },
    { label: "< $20K",    min: 0,        max: 20000    },
    { label: "$20–40K",   min: 20000,    max: 40000    },
    { label: "$40–60K",   min: 40000,    max: 60000    },
    { label: "> $60K",    min: 60000,    max: Infinity },
  ],
};

const SORT_OPTIONS = ["Ranking", "Name (A–Z)", "Acceptance Rate", "Tuition (Low–High)"];

// ─── Sub-components ──────────────────────────────────────────────────────────

function FilterSection({ title, icon, options, active, onChange }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ borderBottom: "1px solid rgba(202,138,4,.12)", paddingBottom: 16, marginBottom: 16 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", background: "none", border: "none", cursor: "pointer",
          color: "#d6d3d1", fontSize: 13, fontWeight: 600, marginBottom: open ? 12 : 0,
          fontFamily: "'DM Sans', sans-serif", padding: 0,
        }}>
        <span>{icon} {title}</span>
        <span style={{ fontSize: 10, color: "#78716c", transition: "transform .2s", transform: open ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
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
                background: active === i ? "rgba(202,138,4,.15)" : "transparent",
                color: active === i ? "#eab308" : "#a8a29e",
                transition: "all .2s ease",
              }}>
              <span style={{
                width: 14, height: 14, borderRadius: "50%", flexShrink: 0,
                border: active === i ? "none" : "1px solid rgba(202,138,4,.30)",
                background: active === i ? "#eab308" : "transparent",
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

function StatPill({ icon, value, label }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
      padding: "12px 20px", flex: 1,
      borderRight: "1px solid rgba(202,138,4,.12)",
    }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 22, fontWeight: 700, color: "#eab308",
      }}>{value}</span>
      <span style={{ fontSize: 10, color: "#57534e", textTransform: "uppercase", letterSpacing: ".08em" }}>{label}</span>
    </div>
  );
}

// Animated skeleton card while loading
function SkeletonCard() {
  return (
    <div style={{
      background: "rgba(255,255,255,.03)", border: "1px solid rgba(202,138,4,.10)",
      borderRadius: 18, padding: 24, overflow: "hidden", position: "relative",
    }}>
      <div className="skel" style={{ height: 20, width: "60%", borderRadius: 8, marginBottom: 12 }} />
      <div className="skel" style={{ height: 14, width: "40%", borderRadius: 6, marginBottom: 20 }} />
      <div style={{ display: "flex", gap: 12 }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="skel" style={{ height: 48, flex: 1, borderRadius: 10 }} />
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
  const PER_PAGE = 10;

  const [heroRef, heroVisible] = useInView(0.05);
  const [listRef, listVisible] = useInView(0.05);

  useEffect(() => { setMounted(true); }, []);

  // ── Dataset selection ──
  const countryLower = (country as string).toLowerCase().replace(/-/g, " ");
  const meta = COUNTRY_META[countryLower] ?? { flag: "🌍", color: "#eab308", label: country, hero: "World-Class Education" };

  let dataCountry = meta.label;
  let rawUniversities: any[] = [];

  if (countryLower === "singapore") {
    dataCountry = singaporeData.country || "Singapore";
    rawUniversities = singaporeData.universities;
  } else if (countryLower === "new zealand") {
    dataCountry = newZealandData.country || "New Zealand";
    rawUniversities = newZealandData.universities;
  } else if (countryLower === "germany") {
    dataCountry = germanyData.country || "Germany";
    rawUniversities = [...germanyData.universities, ...(germanyPart2Data as any[])];
  } else if (countryLower === "usa" || countryLower === "united states") {
    dataCountry = "United States";
    rawUniversities = [usaData];
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
    else if (uni.branches?.[0]?.stats?.tuition_fee) { tuition = `$${uni.branches[0].stats.tuition_fee.toLocaleString()}`; tuitionRaw = uni.branches[0].stats.tuition_fee; }

    let acceptance = null, acceptanceRaw = null;
    if (uni.acceptance_rate_pct != null) { acceptance = `${uni.acceptance_rate_pct}%`; acceptanceRaw = uni.acceptance_rate_pct; }
    else if (uni.branches?.[0]?.stats?.acceptance_rate != null) { acceptance = `${uni.branches[0].stats.acceptance_rate}%`; acceptanceRaw = uni.branches[0].stats.acceptance_rate; }

    let salary = null, sat = null, toefl = null, gpa = null;
    if (uni.common_sections?.employment_figures?.average_salary) salary = `$${uni.common_sections.employment_figures.average_salary.toLocaleString()}`;
    else if (uni.branches) {
      const b = uni.branches.find((b: any) => b.stats?.avg_salary);
      if (b) salary = `$${b.stats.avg_salary.toLocaleString()}`;
    }
    if (uni.branches) {
      const bs = uni.branches.find((b: any) => b.stats?.avg_sat);
      if (bs) sat = bs.stats.avg_sat;
      const bt = uni.branches.find((b: any) => b.admitted_profiles?.toefl_min);
      if (bt) toefl = bt.admitted_profiles.toefl_min;
      const bg = uni.branches.find((b: any) => b.stats?.avg_gpa);
      if (bg) gpa = bg.stats.avg_gpa;
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
    <div className="min-h-screen text-stone-100 overflow-x-hidden" style={{ background: "#0a0a0f", fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes fadeUp  { from{opacity:0;transform:translateY(28px);} to{opacity:1;transform:translateY(0);} }
        @keyframes fadeIn  { from{opacity:0;} to{opacity:1;} }
        @keyframes shimmer { 0%{background-position:-200% center;} 100%{background-position:200% center;} }
        @keyframes pulse   { 0%,100%{opacity:.5;} 50%{opacity:1;} }
        @keyframes orbD1   { 0%,100%{transform:translate(0,0);} 50%{transform:translate(30px,-20px);} }
        @keyframes orbD2   { 0%,100%{transform:translate(0,0);} 50%{transform:translate(-20px,14px);} }
        @keyframes cardIn  { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
        @keyframes skelPulse{ 0%,100%{opacity:.06;} 50%{opacity:.14;} }

        .fd { font-family:'Cormorant Garamond',Georgia,serif; }

        .afu { animation:fadeUp .75s cubic-bezier(.16,1,.3,1) both; }
        .afi { animation:fadeIn .6s ease both; }
        .aorb1 { animation:orbD1 13s ease-in-out infinite; }
        .aorb2 { animation:orbD2 17s ease-in-out infinite; }

        .d1{animation-delay:.08s;} .d2{animation-delay:.18s;}
        .d3{animation-delay:.28s;} .d4{animation-delay:.40s;}
        .d5{animation-delay:.52s;}

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
          padding:4px 14px;
        }

        .card {
          background:rgba(255,255,255,.032);
          border:1px solid rgba(202,138,4,.12);
          border-radius:18px;
          transition:transform .3s ease,border-color .3s ease,background .3s ease,box-shadow .3s ease;
        }
        .card:hover {
          border-color:rgba(202,138,4,.32);
          background:rgba(202,138,4,.04);
          box-shadow: 0 12px 40px rgba(0,0,0,.4);
        }

        .sort-btn {
          padding:7px 18px; border-radius:999px; font-size:12px; font-weight:500;
          cursor:pointer; border:1px solid rgba(202,138,4,.20);
          color:#78716c; background:transparent; transition:all .2s ease;
          font-family:'DM Sans',sans-serif; white-space:nowrap;
        }
        .sort-btn:hover { border-color:rgba(202,138,4,.45); color:#d6d3d1; }
        .sort-btn.active { background:rgba(202,138,4,.15); color:#eab308; border-color:rgba(202,138,4,.50); }

        .search-box {
          width:100%; background:rgba(255,255,255,.04);
          border:1px solid rgba(202,138,4,.18); border-radius:14px;
          color:#f5f5f4; font-size:14px; padding:12px 48px 12px 18px;
          outline:none; font-family:'DM Sans',sans-serif;
          transition:border-color .25s;
        }
        .search-box:focus { border-color:rgba(202,138,4,.55); }
        .search-box::placeholder { color:#44403c; }

        .load-more {
          background:transparent; color:#eab308;
          border:1px solid rgba(202,138,4,.38); border-radius:14px;
          padding:13px 36px; font-size:14px; font-weight:500; cursor:pointer;
          font-family:'DM Sans',sans-serif;
          transition:background .25s,border-color .25s,transform .2s;
        }
        .load-more:hover {
          background:rgba(202,138,4,.10);
          border-color:rgba(202,138,4,.70);
          transform:translateY(-2px);
        }

        .skel {
          background:rgba(202,138,4,.08);
          animation:skelPulse 1.6s ease-in-out infinite;
        }

        .stat-divider-last { }
        .stat-row > *:not(:last-child) { border-right:1px solid rgba(202,138,4,.12); }
      `}</style>

      {/* ── Ambient ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="aorb1 absolute rounded-full"
          style={{ width: 560, height: 560, top: -160, right: -160, background: `radial-gradient(circle,${meta.color}1a 0%,transparent 70%)`, filter: "blur(70px)" }} />
        <div className="aorb2 absolute rounded-full"
          style={{ width: 400, height: 400, bottom: 0, left: -100, background: "radial-gradient(circle,rgba(202,138,4,.09) 0%,transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute inset-0 grid-texture" />
      </div>

      <div className="relative" style={{ zIndex: 1 }}>

        {/* ══ HERO ══ */}
        <section ref={heroRef} style={{
          background: "linear-gradient(180deg,rgba(202,138,4,.06) 0%,transparent 100%)",
          borderBottom: "1px solid rgba(202,138,4,.10)",
          padding: "52px 0 40px",
        }}>
          <div className="max-w-6xl mx-auto px-6">
            {/* Breadcrumb */}
            <div className={mounted ? "afu" : "opacity-0"} style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 12, color: "#57534e" }}>Universities</span>
              <span style={{ fontSize: 12, color: "#57534e", margin: "0 8px" }}>›</span>
              <span style={{ fontSize: 12, color: "#eab308" }}>{dataCountry}</span>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
              <div>
                <span className={`tag ${mounted ? "afu" : "opacity-0"}`} style={{ marginBottom: 14, display: "inline-block" }}>
                  Explore Universities
                </span>
                <h1 className={`fd ${mounted ? "afu d1" : "opacity-0"}`}
                  style={{ fontSize: "clamp(36px,5vw,64px)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 10 }}>
                  <span style={{ fontSize: "1.1em" }}>{meta.flag}</span>{" "}
                  Top Universities in{" "}
                  <span className="gold-shimmer">{dataCountry}</span>
                </h1>
                <p className={mounted ? "afu d2" : "opacity-0"}
                  style={{ fontSize: 15, color: "#78716c", maxWidth: 480 }}>
                  {meta.hero} — Explore rankings, acceptance rates, costs, and more.
                </p>
              </div>

              <div className={`card ${mounted ? "afu d3" : "opacity-0"}`} style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 24 }}>🎯</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 1 }}>Not sure where to apply?</p>
                  <p style={{ fontSize: 11, color: "#78716c" }}>Get a personalized shortlist →</p>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className={`card stat-row ${mounted ? "afu d4" : "opacity-0"}`}
              style={{ display: "flex", marginTop: 32, overflow: "hidden" }}>
              <StatPill icon="🏛️" value={universities.length} label="Universities" />
              <StatPill icon="🌍" value={dataCountry} label="Country" />
              <StatPill icon="📊" value="7–15%" label="Avg. Accept Rate" />
              <StatPill icon="💵" value="$40–80K" label="Avg. Tuition / yr" />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "12px 20px" }}>
                <span style={{ fontSize: 20 }}>⭐</span>
                <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, color: "#eab308" }}>Top Ranked</span>
                <span style={{ fontSize: 10, color: "#57534e", textTransform: "uppercase", letterSpacing: ".08em" }}>Global Reputation</span>
              </div>
            </div>
          </div>
        </section>

        {/* ══ BODY ══ */}
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 28, alignItems: "start" }}>

            {/* ── FILTERS SIDEBAR ── */}
            <div style={{ position: "sticky", top: 24 }}>
              <div className={`card ${mounted ? "afi" : "opacity-0"}`} style={{ padding: "20px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h2 style={{ fontSize: 14, fontWeight: 700, color: "#e7e5e4" }}>🎛️ Filters</h2>
                  <button
                    onClick={() => { setAcceptFilter(0); setTuitionFilter(0); setSearch(""); }}
                    style={{
                      fontSize: 11, color: "#78716c", background: "none", border: "none",
                      cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
                      transition: "color .2s",
                    }}
                    onMouseOver={e => (e.target as HTMLElement).style.color = "#eab308"}
                    onMouseOut={e => (e.target as HTMLElement).style.color = "#78716c"}>
                    Clear All
                  </button>
                </div>

                <FilterSection
                  title="Acceptance Rate" icon="📊"
                  options={FILTER_RANGES.acceptance}
                  active={acceptFilter}
                  onChange={i => { setAcceptFilter(i); setPage(1); }}
                />
                <FilterSection
                  title="Tuition Fee" icon="💵"
                  options={FILTER_RANGES.tuition}
                  active={tuitionFilter}
                  onChange={i => { setTuitionFilter(i); setPage(1); }}
                />

                {/* Result count */}
                <div style={{
                  marginTop: 8, padding: "12px 14px", borderRadius: 12,
                  background: "rgba(202,138,4,.08)", border: "1px solid rgba(202,138,4,.15)",
                }}>
                  <p style={{ fontSize: 12, color: "#78716c", marginBottom: 2 }}>Showing results</p>
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, color: "#eab308" }}>
                    {filtered.length}
                    <span style={{ fontSize: 13, color: "#57534e", fontFamily: "'DM Sans',sans-serif", fontWeight: 400 }}> / {universities.length}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* ── LIST ── */}
            <div ref={listRef}>
              {/* Search + Sort bar */}
              <div className={mounted ? "afu" : "opacity-0"} style={{ marginBottom: 20 }}>
                <div style={{ position: "relative", marginBottom: 14 }}>
                  <input
                    type="text"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                    placeholder={`Search universities in ${dataCountry}…`}
                    className="search-box"
                  />
                  <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "#57534e" }}>🔍</span>
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#57534e", marginRight: 4 }}>Sort by:</span>
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
                <div className="card" style={{ padding: 48, textAlign: "center" }}>
                  <p style={{ fontSize: 32, marginBottom: 16 }}>🌐</p>
                  <p className="fd" style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>No Data Available</p>
                  <p style={{ fontSize: 14, color: "#57534e" }}>More countries will be added soon.</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="card" style={{ padding: 48, textAlign: "center" }}>
                  <p style={{ fontSize: 32, marginBottom: 16 }}>🔍</p>
                  <p className="fd" style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>No results found</p>
                  <p style={{ fontSize: 14, color: "#57534e" }}>Try adjusting your filters or search query.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {paginated.map((uni, i) => (
                    <div
                      key={uni.id}
                      style={{
                        opacity: listVisible ? 1 : 0,
                        transform: listVisible ? "translateY(0)" : "translateY(20px)",
                        transition: `opacity .55s ease ${Math.min(i, 5) * 60}ms, transform .55s ease ${Math.min(i, 5) * 60}ms`,
                      }}>

                      {/* Wrap UniversityCard with our theme shell */}
                      <div className="card" style={{ overflow: "hidden", position: "relative" }}>

                        {/* Rank badge */}
                        <div style={{
                          position: "absolute", top: 16, left: 16, zIndex: 2,
                          background: "linear-gradient(135deg,#ca8a04,#92400e)",
                          color: "#fff", fontSize: 10, fontWeight: 800,
                          padding: "4px 10px", borderRadius: 999,
                          letterSpacing: ".06em",
                        }}>
                          #{uni.ranking}
                        </div>

                        {/* Quick stats strip */}
                        <div style={{
                          display: "flex", gap: 0,
                          borderBottom: "1px solid rgba(202,138,4,.10)",
                          padding: "10px 16px 10px 64px",
                          flexWrap: "wrap", alignItems: "center",
                        }}>
                          <span style={{ flex: 1, fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 700, color: "#e7e5e4", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {uni.name}
                          </span>
                          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                            {uni.acceptance && (
                              <span style={{ fontSize: 11, color: "#22c55e", background: "rgba(34,197,94,.10)", border: "1px solid rgba(34,197,94,.20)", borderRadius: 999, padding: "3px 10px" }}>
                                ✓ {uni.acceptance} Accept
                              </span>
                            )}
                            {uni.tuition && (
                              <span style={{ fontSize: 11, color: "#60a5fa", background: "rgba(96,165,250,.08)", border: "1px solid rgba(96,165,250,.18)", borderRadius: 999, padding: "3px 10px" }}>
                                💵 {uni.tuition}
                              </span>
                            )}
                            {uni.salary && (
                              <span style={{ fontSize: 11, color: "#eab308", background: "rgba(234,179,8,.08)", border: "1px solid rgba(234,179,8,.18)", borderRadius: 999, padding: "3px 10px" }}>
                                💼 {uni.salary} avg salary
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Address */}
                        <div style={{ padding: "0 16px 10px", display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 10, color: "#57534e" }}>📍 {uni.address || uni.location}</span>
                        </div>

                        {/* UniversityCard renders inside */}
                        <div style={{ padding: "0 16px 16px" }}>
                          <UniversityCard key={uni.id} uni={uni} />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Load more */}
                  {hasMore && (
                    <div style={{ textAlign: "center", paddingTop: 16 }}>
                      <button className="load-more" onClick={() => setPage(p => p + 1)}>
                        Load more universities ({filtered.length - paginated.length} remaining)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}