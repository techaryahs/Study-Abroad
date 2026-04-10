"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

// ─── Micro sparkline for visual flair ────────────────────────────────────────
function AcceptanceBar({ pct }: { pct: number | null }) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setWidth(pct ?? 0); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [pct]);

  if (!pct) return <span style={{ fontWeight: 600, color: "#6B5E51" }}>—</span>;

  const color = pct < 15 ? "#ef4444" : pct < 40 ? "#C5A059" : "#16a34a";

  return (
    <div ref={ref} style={{ flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontWeight: 700, color: "#2D2926", fontSize: 13 }}>{pct}%</span>
        <span style={{
          fontSize: 10, padding: "2px 8px", borderRadius: 999,
          background: pct < 15 ? "rgba(239,68,68,.1)" : pct < 40 ? "rgba(197,160,89,.1)" : "rgba(22,163,74,.1)",
          color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em"
        }}>
          {pct < 15 ? "Highly Selective" : pct < 40 ? "Moderate" : "Accessible"}
        </span>
      </div>
      <div style={{ height: 6, borderRadius: 999, background: "#F1EDEA", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 999, background: color,
          width: `${width}%`,
          transition: "width 1.5s cubic-bezier(.16,1,.3,1)",
        }} />
      </div>
    </div>
  );
}

// ─── Stat cell ────────────────────────────────────────────────────────────────
function StatCell({ label, value, icon }: { label: string; value: string | null; icon: string }) {
  return (
    <div style={{
      padding: "12px 16px", borderRadius: 16,
      background: "#FDFBF7",
      border: "1px solid rgba(197,160,89, 0.15)",
      transition: "all .25s ease",
    }}
      className="stat-cell">
      <p style={{ fontSize: 10, color: "#6B5E51", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 6, fontWeight: 700 }}>
        {icon} {label}
      </p>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: "#2D2926", lineHeight: 1 }}>
        {value || "—"}
      </p>
    </div>
  );
}

// ─── Main Card ────────────────────────────────────────────────────────────────
export default function UniversityCard({ uni }: any) {
  const [hovered, setHovered] = useState(false);
  const acceptanceRaw = uni.acceptanceRaw ?? (uni.acceptance ? parseFloat(uni.acceptance) : null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes badgePop {
          from { transform: scale(0.9) translateY(10px); opacity: 0; }
          to   { transform: scale(1) translateY(0); opacity: 1; }
        }

        .uni-card {
          position: relative;
          background: #FFFFFF;
          border: 1px solid rgba(197,160,89, 0.15);
          border-radius: 24px;
          overflow: hidden;
          transition: all .4s cubic-bezier(.16,1,.3,1);
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 4px 30px rgba(0,0,0,0.03);
        }
        .uni-card:hover {
          transform: translateY(-6px);
          border-color: rgba(197,160,89,.4);
          box-shadow: 0 20px 50px rgba(197,160,89, 0.12);
        }

        .uni-card .stat-cell:hover {
          border-color: rgba(197,160,89,.4) !important;
          background: #FFFFFF !important;
          transform: scale(1.02);
        }

        .name-link {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(22px, 2.5vw, 28px);
          font-weight: 700;
          color: #2D2926;
          text-decoration: none;
          letter-spacing: -0.01em;
          line-height: 1.1;
          transition: color .3s ease;
          display: block;
        }
        .name-link:hover { color: #C5A059; }

        .btn-primary {
          background: #C5A059;
          color: #FFFFFF;
          border: none;
          border-radius: 12px;
          padding: 12px 28px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: .02em;
          transition: all .3s ease;
        }
        .btn-primary:hover {
          background: #2D2926;
          transform: translateY(-2px);
          box-shadow: 0 8px 15px rgba(0,0,0,0.1);
        }

        .btn-secondary {
          background: transparent;
          color: #2D2926;
          border: 1px solid rgba(197,160,89,.5);
          border-radius: 12px;
          padding: 12px 28px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all .3s ease;
        }
        .btn-secondary:hover {
          background: rgba(197,160,89,.05);
          border-color: #2D2926;
          transform: translateY(-2px);
        }

        .rank-badge {
          position: absolute;
          top: 24px; right: 24px;
          background: #F8F5F0;
          color: #C5A059;
          font-size: 12px;
          font-weight: 800;
          padding: 6px 14px;
          border-radius: 10px;
          letter-spacing: .05em;
          border: 1px solid rgba(197,160,89, 0.2);
          box-shadow: 0 4px 10px rgba(0,0,0,0.02);
        }

        .logo-wrap {
          width: 100px;
          height: 100px;
          border-radius: 20px;
          background: #FDFBF7;
          border: 1px solid rgba(197,160,89, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
          transition: all .3s ease;
        }
        .uni-card:hover .logo-wrap { border-color: rgba(197,160,89, 0.3); transform: scale(1.05); }

        .location-text {
          font-size: 14px;
          color: #6B5E51;
          margin: 8px 0 16px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, rgba(197,160,89,.2), transparent);
          margin: 16px 0;
        }

        @media (max-width: 640px) {
          .uni-card { border-radius: 16px; }
          .card-inner { padding: 16px !important; }
          .logo-wrap { width: 50px; height: 50px; border-radius: 12px; }
          .logo-wrap img { width: 35px !important; height: 35px !important; }
          .name-link { font-size: 18px !important; }
          .location-text { font-size: 11px !important; margin: 4px 0 10px; }
          .rank-badge { top: 12px; right: 12px; padding: 4px 8px; font-size: 10px; border-radius: 6px; }
          .info-col { padding-right: 40px !important; }
          .pill-badge { font-size: 9px !important; padding: 3px 8px !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 6px !important; margin-bottom: 16px !important; }
          .stat-cell { padding: 8px 10px !important; border-radius: 10px !important; }
          .stat-cell p:first-child { font-size: 8px !important; margin-bottom: 2px !important; }
          .stat-cell p:last-child { font-size: 14px !important; }
          .cta-row { flex-wrap: wrap; gap: 8px !important; }
          .btn-primary, .btn-secondary { padding: 8px 16px !important; font-size: 11px !important; flex: 1; text-align: center; }
          .req-link { font-size: 11px !important; margin-left: 0 !important; width: 100%; justify-content: center; margin-top: 4px; }
        }
      `}</style>

      <div
        className="uni-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Rank badge */}
        <div className="rank-badge">#{uni.ranking || "—"}</div>

        <div className="card-inner" style={{ padding: "32px" }}>

          {/* Top row: logo + info */}
          <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>

            {/* Logo */}
            <div className="logo-wrap">
              <Image
                src={uni.image}
                alt={uni.name}
                width={80}
                height={80}
                className="object-contain"
                style={{ padding: 10 }}
              />
            </div>

            {/* Name + location */}
            <div className="info-col" style={{ flex: 1, minWidth: 0, paddingRight: 80 }}>
              <Link href={`/universities/${uni.slug}`}>
                <span className="name-link">
                  {uni.name}
                </span>
              </Link>
              <p className="location-text">
                <span style={{ fontSize: 16 }}>📍</span> {uni.location}{uni.address && ` · ${uni.address}`}
              </p>

              {/* Quick pill badges */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {uni.acceptance && (
                  <span className="pill-badge" style={{
                    fontSize: 11, padding: "4px 12px", borderRadius: 999,
                    background: "rgba(22,163,74,.08)", color: "#16a34a",
                    border: "1px solid rgba(22,163,74,.15)", fontWeight: 700
                  }}>
                    ✓ {uni.acceptance}
                  </span>
                )}
                {uni.tuition && (
                  <span className="pill-badge" style={{
                    fontSize: 11, padding: "4px 12px", borderRadius: 999,
                    background: "rgba(197,160,89,.08)", color: "#C5A059",
                    border: "1px solid rgba(197,160,89,.15)", fontWeight: 700
                  }}>
                    💵 {uni.tuition}
                  </span>
                )}
                {uni.salary && (
                  <span className="pill-badge" style={{
                    fontSize: 11, padding: "4px 12px", borderRadius: 999,
                    background: "rgba(45,41,38,.05)", color: "#2D2926",
                    border: "1px solid rgba(45,41,38,.1)", fontWeight: 700
                  }}>
                    💼 {uni.salary}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="divider" />

          {/* Stats grid */}
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginBottom: 24 }}>
            <StatCell label="Average Salary" value={uni.salary} icon="💼" />
            <StatCell label="Tuition Fees" value={uni.tuition} icon="💵" />
            <StatCell label="Avg SAT Score" value={uni.sat ? String(uni.sat) : null} icon="📝" />
            <StatCell label="Min. TOEFL" value={uni.toefl ? String(uni.toefl) : null} icon="🗣️" />
            <StatCell label="Average GPA" value={uni.gpa ? String(uni.gpa) : null} icon="📊" />

            {/* Acceptance rate with animated bar */}
            <div style={{
              padding: "12px 16px", borderRadius: 16,
              background: "#FDFBF7",
              border: "1px solid rgba(197,160,89, 0.15)",
              display: "flex", flexDirection: "column"
            }}>
              <p style={{ fontSize: 10, color: "#6B5E51", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8, fontWeight: 700 }}>
                📈 Acceptance Rate
              </p>
              <AcceptanceBar pct={acceptanceRaw} />
            </div>
          </div>

          {/* CTA row */}
          <div className="cta-row" style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link href={`/universities/${uni.slug}`}>
              <button className="btn-primary">View Details</button>
            </Link>
            <Link href="/universities/RateMyChances">
              <button className="btn-secondary">Check My Chances →</button>
            </Link>

            {/* Spacer + view link */}
            <Link
              href={`/universities/${uni.slug}`}
              className="req-link"
              style={{
                marginLeft: "auto", fontSize: 13, color: "#6B5E51",
                textDecoration: "none", display: "flex", alignItems: "center", gap: 6,
                transition: "color .2s", fontWeight: 700
              }}
              onMouseOver={e => (e.currentTarget.style.color = "#C5A059")}
              onMouseOut={e => (e.currentTarget.style.color = "#6B5E51")}
            >
              Requirements Spec →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}