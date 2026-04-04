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

  if (!pct) return <span style={{ fontWeight: 600, color: "#e7e5e4" }}>—</span>;

  const color = pct < 15 ? "#ef4444" : pct < 40 ? "#eab308" : "#22c55e";

  return (
    <div ref={ref}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontWeight: 600, color: "#e7e5e4", fontSize: 14 }}>{pct}%</span>
        <span style={{
          fontSize: 10, padding: "1px 8px", borderRadius: 999,
          background: pct < 15 ? "rgba(239,68,68,.12)" : pct < 40 ? "rgba(234,179,8,.12)" : "rgba(34,197,94,.12)",
          color,
        }}>
          {pct < 15 ? "Selective" : pct < 40 ? "Moderate" : "Open"}
        </span>
      </div>
      <div style={{ height: 4, borderRadius: 999, background: "rgba(255,255,255,.07)", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 999, background: color,
          width: `${width}%`,
          transition: "width 1.2s cubic-bezier(.16,1,.3,1)",
          boxShadow: `0 0 8px ${color}66`,
        }} />
      </div>
    </div>
  );
}

// ─── Stat cell ────────────────────────────────────────────────────────────────
function StatCell({ label, value, icon }: { label: string; value: string | null; icon: string }) {
  return (
    <div style={{
      padding: "10px 12px", borderRadius: 12,
      background: "rgba(255,255,255,.03)",
      border: "1px solid rgba(202,138,4,.10)",
      transition: "border-color .25s, background .25s",
    }}
      className="stat-cell">
      <p style={{ fontSize: 10, color: "#57534e", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>
        {icon} {label}
      </p>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: "#e7e5e4", lineHeight: 1 }}>
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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes pulseGlow {
          0%,100% { box-shadow: 0 0 0 0 rgba(234,179,8,.40); }
          50%      { box-shadow: 0 0 0 8px rgba(234,179,8,0); }
        }
        @keyframes badgePop {
          from { transform: scale(0) rotate(-15deg); opacity: 0; }
          70%  { transform: scale(1.18) rotate(3deg); }
          to   { transform: scale(1) rotate(0deg);   opacity: 1; }
        }

        .uni-card {
          position: relative;
          background: rgba(255,255,255,.032);
          border: 1px solid rgba(202,138,4,.14);
          border-radius: 20px;
          overflow: hidden;
          transition: transform .35s cubic-bezier(.16,1,.3,1),
                      border-color .35s ease,
                      box-shadow .35s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .uni-card:hover {
          transform: translateY(-4px);
          border-color: rgba(202,138,4,.38);
          box-shadow: 0 20px 60px rgba(0,0,0,.5), 0 0 0 1px rgba(202,138,4,.10);
        }

        /* Gold top accent line */
        .uni-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(202,138,4,.60), transparent);
          opacity: 0;
          transition: opacity .35s ease;
        }
        .uni-card:hover::before { opacity: 1; }

        .uni-card .stat-cell:hover {
          border-color: rgba(202,138,4,.30) !important;
          background: rgba(202,138,4,.06) !important;
        }

        .name-link {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(18px, 2vw, 22px);
          font-weight: 700;
          color: #e7e5e4;
          text-decoration: none;
          letter-spacing: -0.01em;
          line-height: 1.2;
          transition: color .2s ease;
          display: block;
        }
        .name-link:hover { color: #eab308; }

        .name-shimmer {
          background: linear-gradient(90deg,#e7e5e4,#fde68a,#e7e5e4,#d6d3d1,#e7e5e4);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .btn-primary {
          background: linear-gradient(135deg, #ca8a04, #a16207);
          color: #0a0a0f;
          border: none;
          border-radius: 10px;
          padding: 10px 22px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: .02em;
          transition: transform .2s, box-shadow .2s;
          animation: pulseGlow 2.5s ease-in-out infinite;
        }
        .btn-primary:hover {
          transform: scale(1.04) translateY(-1px);
          box-shadow: 0 8px 24px rgba(202,138,4,.40);
          animation: none;
        }

        .btn-secondary {
          background: transparent;
          color: #eab308;
          border: 1px solid rgba(202,138,4,.38);
          border-radius: 10px;
          padding: 10px 22px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background .2s, border-color .2s, transform .2s;
        }
        .btn-secondary:hover {
          background: rgba(202,138,4,.10);
          border-color: rgba(202,138,4,.70);
          transform: translateY(-1px);
        }

        .rank-badge {
          position: absolute;
          top: 0; right: 0;
          background: linear-gradient(135deg, #ca8a04, #92400e);
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          padding: 6px 14px;
          border-radius: 0 18px 0 14px;
          letter-spacing: .06em;
          animation: badgePop .5s cubic-bezier(.34,1.56,.64,1) .1s both;
          box-shadow: -4px 4px 16px rgba(0,0,0,.3);
        }

        .logo-wrap {
          width: 80px;
          height: 80px;
          border-radius: 16px;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(202,138,4,.18);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
          transition: border-color .3s ease;
        }
        .uni-card:hover .logo-wrap { border-color: rgba(202,138,4,.42); }

        .location-text {
          font-size: 12px;
          color: #57534e;
          margin: 6px 0 18px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, rgba(202,138,4,.18), transparent);
          margin: 16px 0;
        }
      `}</style>

      <div
        className="uni-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Rank badge */}
        <div className="rank-badge">#{uni.ranking}</div>

        {/* Subtle inner glow on hover */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at 80% 10%, rgba(202,138,4,.06) 0%, transparent 60%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity .4s ease",
        }} />

        <div style={{ padding: "24px 24px 20px" }}>

          {/* Top row: logo + info */}
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>

            {/* Logo */}
            <div className="logo-wrap">
              <Image
                src={uni.image}
                alt={uni.name}
                width={64}
                height={64}
                className="object-contain"
                style={{ opacity: 0.92 }}
              />
            </div>

            {/* Name + location */}
            <div style={{ flex: 1, minWidth: 0, paddingRight: 60 }}>
              <Link href={`/universities/${uni.slug}`}>
                <span className={`name-link ${hovered ? "name-shimmer" : ""}`}>
                  {uni.name}
                </span>
              </Link>
              <p className="location-text">
                📍 {uni.location}{uni.address && ` · ${uni.address}`}
              </p>

              {/* Quick pill badges */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {uni.acceptance && (
                  <span style={{
                    fontSize: 11, padding: "3px 10px", borderRadius: 999,
                    background: "rgba(34,197,94,.10)", color: "#22c55e",
                    border: "1px solid rgba(34,197,94,.20)",
                  }}>
                    ✓ {uni.acceptance} Accept Rate
                  </span>
                )}
                {uni.tuition && (
                  <span style={{
                    fontSize: 11, padding: "3px 10px", borderRadius: 999,
                    background: "rgba(96,165,250,.08)", color: "#60a5fa",
                    border: "1px solid rgba(96,165,250,.18)",
                  }}>
                    💵 {uni.tuition}
                  </span>
                )}
                {uni.salary && (
                  <span style={{
                    fontSize: 11, padding: "3px 10px", borderRadius: 999,
                    background: "rgba(234,179,8,.08)", color: "#eab308",
                    border: "1px solid rgba(234,179,8,.18)",
                  }}>
                    💼 {uni.salary} avg salary
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="divider" />

          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
            <StatCell label="Average Salary" value={uni.salary} icon="💼" />
            <StatCell label="Tuition Fees" value={uni.tuition} icon="💵" />
            <StatCell label="Avg SAT Score" value={uni.sat ? String(uni.sat) : null} icon="📝" />
            <StatCell label="Min. TOEFL" value={uni.toefl ? String(uni.toefl) : null} icon="🗣️" />
            <StatCell label="Average GPA" value={uni.gpa ? String(uni.gpa) : null} icon="📊" />

            {/* Acceptance rate with animated bar */}
            <div style={{
              padding: "10px 12px", borderRadius: 12,
              background: "rgba(255,255,255,.03)",
              border: "1px solid rgba(202,138,4,.10)",
            }}>
              <p style={{ fontSize: 10, color: "#57534e", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>
                📈 Acceptance Rate
              </p>
              <AcceptanceBar pct={acceptanceRaw} />
            </div>
          </div>

          {/* CTA row */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button className="btn-primary">⚡ RateMyChances</button>
            <button className="btn-secondary">Apply Now →</button>

            {/* Spacer + view link */}
            <Link
              href={`/universities/${uni.slug}`}
              style={{
                marginLeft: "auto", fontSize: 12, color: "#57534e",
                textDecoration: "none", display: "flex", alignItems: "center", gap: 4,
                transition: "color .2s",
              }}
              onMouseOver={e => (e.currentTarget.style.color = "#eab308")}
              onMouseOut={e => (e.currentTarget.style.color = "#57534e")}
            >
              View Details →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}