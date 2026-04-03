"use client";

import { useState } from "react";

export default function USVisaMockInterview() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [currency, setCurrency] = useState("USD");

    const faqs = [
        {
            q: "How does the US Visa Mock Interview AI work?",
            a: "Our AI model is inspired by real-life visa interviews and follows the same pattern, tonality, and style. It has been trained from more than 1000 real-life interview scripts and can provide real-time insights into preparing yourself for the actual interview.",
        },
        {
            q: "What types of questions can I expect during the mock interview?",
            a: "You can expect questions about your study plans, financial capability, ties to your home country, intended program of study, and future plans after completing your degree — all closely mirroring actual US visa officer questioning patterns.",
        },
        {
            q: "How realistic is the feedback provided by the AI?",
            a: "Our AI provides feedback with 97.6% accuracy, mirroring real visa officer decision-making. It evaluates your answers on clarity, confidence, and factual consistency.",
        },
        {
            q: "Will this mock interview improve my chances of visa approval?",
            a: "Yes. Our data shows that candidates who complete 5+ rounds see a 270% boost in success rates. Practice builds confidence and refines your answers significantly.",
        },
        {
            q: "What should I do if I don't pass the mock interview?",
            a: "Review the detailed feedback provided after each round, identify weak areas, and practice those specific topics in your next session. Multiple rounds are recommended for maximum improvement.",
        },
    ];

    const plans = [
        {
            rounds: "1 Round",
            price: "9.00",
            original: "10.00",
            features: ["1 Mock Interview Round", "Realtime Feedback", "Boosts success rates by 75%"],
            highlight: false,
            label: null,
        },
        {
            rounds: "5 Rounds",
            price: "29.00",
            original: "50.00",
            features: ["5 Mock Interview Rounds", "Boosts success rates by 270%", "Improve based on the feedback from previous rounds"],
            highlight: true,
            label: "VALUE",
        },
        {
            rounds: "10 Rounds",
            price: "59.00",
            original: "100.00",
            features: ["10 Mock Interview Rounds", "Boosts success rates by 730%", "Improve based on the feedback from previous rounds"],
            highlight: false,
            label: null,
        },
    ];

    return (
        <div
            style={{
                background: "#0a0a0a",
                color: "#e8e0cc",
                fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                minHeight: "100vh",
                overflowX: "hidden",
            }}
        >
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Cinzel:wght@400;500;600;700&family=Raleway:wght@300;400;500;600&display=swap');

        :root {
          --gold: #c9a84c;
          --gold-bright: #d4a843;
          --gold-light: #e8c97a;
          --gold-muted: #8a6d2f;
          --bg-deep: #0a0a0a;
          --bg-card: #111009;
          --bg-surface: #161410;
          --bg-elevated: #1c1a14;
          --border: rgba(201,168,76,0.2);
          --border-strong: rgba(201,168,76,0.45);
          --text-primary: #e8e0cc;
          --text-muted: #9a8f77;
          --text-dim: #6b6050;
        }

        * { box-sizing: border-box; }

        .gold-gradient-text {
          background: linear-gradient(135deg, #c9a84c 0%, #e8c97a 40%, #c9a84c 70%, #a07830 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-divider {
          width: 80px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          margin: 0 auto;
        }

        .ornament {
          display: flex;
          align-items: center;
          gap: 12px;
          justify-content: center;
          color: var(--gold-muted);
          font-size: 10px;
          letter-spacing: 4px;
          text-transform: uppercase;
          font-family: 'Raleway', sans-serif;
        }
        .ornament::before, .ornament::after {
          content: '';
          flex: 1;
          max-width: 60px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold-muted));
        }
        .ornament::after {
          background: linear-gradient(270deg, transparent, var(--gold-muted));
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(201,168,76,0.08);
          border: 1px solid var(--border-strong);
          padding: 8px 20px;
          border-radius: 2px;
          font-family: 'Raleway', sans-serif;
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gold);
        }

        .badge-dot {
          width: 7px; height: 7px;
          background: #4ade80;
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(74,222,128,0.6);
          animation: pulse-green 2s infinite;
        }

        @keyframes pulse-green {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 40% 30% at 80% 50%, rgba(201,168,76,0.03) 0%, transparent 60%),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 60px,
              rgba(201,168,76,0.02) 60px,
              rgba(201,168,76,0.02) 61px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 60px,
              rgba(201,168,76,0.02) 60px,
              rgba(201,168,76,0.02) 61px
            );
          pointer-events: none;
        }

        .mock-window {
          background: #0e0d0b;
          border: 1px solid var(--border-strong);
          border-radius: 4px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(201,168,76,0.1),
            0 40px 80px rgba(0,0,0,0.6),
            0 0 120px rgba(201,168,76,0.04);
        }

        .mock-header {
          background: #151310;
          border-bottom: 1px solid var(--border);
          padding: 14px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .mock-sidebar {
          background: #0d0c0a;
          border-right: 1px solid var(--border);
          padding: 20px;
          width: 260px;
          flex-shrink: 0;
        }

        .mock-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 40px;
          min-height: 340px;
          text-align: center;
        }

        .start-btn {
          background: linear-gradient(135deg, #c9a84c 0%, #d4a843 50%, #b8942e 100%);
          color: #0a0a0a;
          border: none;
          padding: 14px 40px;
          font-family: 'Cinzel', serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 3px;
          cursor: pointer;
          text-transform: uppercase;
          border-radius: 2px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(201,168,76,0.3);
        }
        .start-btn:hover {
          box-shadow: 0 6px 30px rgba(201,168,76,0.5);
          transform: translateY(-1px);
        }

        .feature-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 3px;
          padding: 32px;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          opacity: 0;
          transition: opacity 0.4s;
        }
        .feature-card:hover {
          border-color: var(--border-strong);
          background: var(--bg-elevated);
          transform: translateY(-3px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(201,168,76,0.05);
        }
        .feature-card:hover::before { opacity: 1; }

        .stat-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 3px;
          padding: 36px 28px;
          text-align: center;
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          border-color: var(--border-strong);
          box-shadow: 0 0 40px rgba(201,168,76,0.08);
        }

        .pricing-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 3px;
          padding: 36px 28px;
          transition: all 0.3s ease;
          position: relative;
        }
        .pricing-card.featured {
          background: var(--bg-elevated);
          border-color: var(--gold);
          box-shadow: 0 0 0 1px rgba(201,168,76,0.2), 0 20px 60px rgba(201,168,76,0.08);
        }
        .pricing-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 70px rgba(0,0,0,0.5);
        }

        .upgrade-btn {
          width: 100%;
          padding: 14px;
          background: transparent;
          border: 1px solid var(--border-strong);
          color: var(--gold);
          font-family: 'Raleway', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        .upgrade-btn:hover {
          background: rgba(201,168,76,0.08);
          border-color: var(--gold);
        }
        .upgrade-btn.featured {
          background: linear-gradient(135deg, #c9a84c 0%, #d4a843 100%);
          color: #0a0a0a;
          border-color: transparent;
          font-weight: 700;
        }
        .upgrade-btn.featured:hover {
          background: linear-gradient(135deg, #d4a843 0%, #e8c97a 100%);
          box-shadow: 0 8px 30px rgba(201,168,76,0.35);
        }

        .faq-item {
          border: 1px solid var(--border);
          border-radius: 3px;
          overflow: hidden;
          transition: border-color 0.3s;
        }
        .faq-item.open {
          border-color: var(--border-strong);
        }

        .faq-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 22px 28px;
          background: var(--bg-card);
          border: none;
          cursor: pointer;
          text-align: left;
          color: var(--text-primary);
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px;
          font-weight: 500;
          transition: background 0.3s;
        }
        .faq-trigger:hover { background: var(--bg-elevated); }

        .faq-icon {
          width: 28px; height: 28px;
          border: 1px solid var(--border-strong);
          border-radius: 2px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          color: var(--gold);
          font-size: 18px;
          transition: all 0.3s;
        }
        .faq-item.open .faq-icon {
          background: rgba(201,168,76,0.12);
        }

        .faq-body {
          padding: 0 28px 24px;
          background: var(--bg-card);
          color: var(--text-muted);
          font-size: 15px;
          line-height: 1.8;
          font-family: 'Raleway', sans-serif;
          font-weight: 300;
        }

        .nav-link {
          color: var(--text-muted);
          text-decoration: none;
          font-family: 'Raleway', sans-serif;
          font-size: 13px;
          letter-spacing: 1px;
          transition: color 0.3s;
        }
        .nav-link:hover { color: var(--gold); }

        .checkmark {
          width: 18px; height: 18px;
          background: rgba(201,168,76,0.15);
          border: 1px solid var(--gold-muted);
          border-radius: 2px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--gold);
          font-size: 11px;
        }

        .round-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          border: 1px solid var(--border);
          border-radius: 3px;
          margin-bottom: 8px;
          background: rgba(201,168,76,0.02);
        }

        .status-badge {
          font-family: 'Raleway', sans-serif;
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 2px;
        }
        .status-underway {
          background: rgba(201,168,76,0.15);
          color: var(--gold);
          border: 1px solid rgba(201,168,76,0.3);
        }
        .status-accepted {
          background: rgba(74,222,128,0.12);
          color: #4ade80;
          border: 1px solid rgba(74,222,128,0.3);
        }

        .chat-bubble {
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: 3px;
          padding: 14px 18px;
          font-size: 14px;
          line-height: 1.6;
          font-family: 'Raleway', sans-serif;
          color: var(--text-primary);
        }
        .chat-bubble.rejected {
          background: rgba(239,68,68,0.06);
          border-color: rgba(239,68,68,0.2);
        }
        .chat-bubble.approved {
          background: rgba(74,222,128,0.06);
          border-color: rgba(74,222,128,0.2);
        }

        .section-heading {
          font-family: 'Cinzel', serif;
          color: var(--text-primary);
          letter-spacing: 1px;
        }

        select {
          background: var(--bg-card);
          border: 1px solid var(--border-strong);
          color: var(--text-primary);
          padding: 10px 36px 10px 16px;
          font-family: 'Raleway', sans-serif;
          font-size: 13px;
          border-radius: 3px;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23c9a84c' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
        }

        .noise-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        @media (max-width: 768px) {
          .mock-sidebar { display: none; }
          .three-col { grid-template-columns: 1fr !important; }
          .two-col { grid-template-columns: 1fr !important; }
          .mock-main { min-height: 260px; padding: 24px; }
          .hide-mobile { display: none; }
        }
      `}</style>

            <div className="noise-overlay" />

            {/* ─── HERO ─── */}
            <section
                style={{ position: "relative", padding: "120px 40px 100px", textAlign: "center", overflow: "hidden" }}
            >
                <div className="hero-bg" />
                <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto" }}>
                    <div style={{ marginBottom: 28 }}>
                        <span className="badge">
                            <span className="badge-dot" />
                            AI-Optimized Preparation
                        </span>
                    </div>

                    <h1
                        style={{
                            fontFamily: "'Cinzel', serif",
                            fontSize: "clamp(32px, 5vw, 60px)",
                            fontWeight: 700,
                            lineHeight: 1.15,
                            marginBottom: 24,
                            letterSpacing: "0.5px",
                        }}
                        className="gold-gradient-text"
                    >
                        Master Your US Visa Interview
                        <br />
                        <span style={{ color: "var(--text-primary)", WebkitTextFillColor: "var(--text-primary)" }}>
                            with AI-Driven Practice
                        </span>
                    </h1>

                    <p
                        style={{
                            fontFamily: "'Raleway', sans-serif",
                            fontSize: 17,
                            color: "var(--text-muted)",
                            lineHeight: 1.8,
                            marginBottom: 60,
                            fontWeight: 300,
                        }}
                    >
                        Strengthen your interview skills through AI-powered practice and expert feedback.
                    </p>

                    {/* Mock Interview Window */}
                    <div className="mock-window" style={{ textAlign: "left" }}>
                        {/* Header */}
                        <div className="mock-header">
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <span
                                    style={{
                                        background: "rgba(201,168,76,0.15)",
                                        color: "var(--gold)",
                                        border: "1px solid rgba(201,168,76,0.3)",
                                        padding: "3px 10px",
                                        fontSize: 10,
                                        letterSpacing: 2,
                                        textTransform: "uppercase",
                                        fontFamily: "'Raleway', sans-serif",
                                        borderRadius: 2,
                                    }}
                                >
                                    FREE
                                </span>
                                <span
                                    style={{
                                        fontFamily: "'Cinzel', serif",
                                        fontSize: 14,
                                        color: "var(--text-primary)",
                                        letterSpacing: 1,
                                    }}
                                >
                                    US Visa Mock Interview AI
                                </span>
                            </div>
                            <p
                                style={{
                                    fontFamily: "'Raleway', sans-serif",
                                    fontSize: 12,
                                    color: "var(--text-dim)",
                                    maxWidth: 520,
                                    textAlign: "right",
                                    lineHeight: 1.5,
                                }}
                                className="hide-mobile"
                            >
                                Use our AI-trained US Visa Mock Interview officer and practice realistic mock interviews to
                                ensure success. Currently valid for student visa interviews only.
                            </p>
                        </div>

                        {/* Body */}
                        <div style={{ display: "flex", minHeight: 360 }}>
                            {/* Sidebar */}
                            <div className="mock-sidebar">
                                <div
                                    style={{
                                        fontFamily: "'Cinzel', serif",
                                        fontSize: 11,
                                        letterSpacing: 2,
                                        color: "var(--gold-muted)",
                                        textTransform: "uppercase",
                                        marginBottom: 16,
                                    }}
                                >
                                    Previous Rounds
                                </div>

                                <div
                                    style={{
                                        background: "rgba(201,168,76,0.04)",
                                        border: "1px solid var(--border-strong)",
                                        borderLeft: "3px solid var(--gold)",
                                        borderRadius: 2,
                                        padding: "12px 14px",
                                        marginBottom: 8,
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                                        <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, color: "var(--text-primary)" }}>
                                            1 Apr 2026
                                        </span>
                                        <span className="status-badge status-underway">Underway</span>
                                    </div>
                                    <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: "var(--text-dim)" }}>
                                        11:39 AM
                                    </span>
                                </div>

                                <div className="round-item">
                                    <div>
                                        <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, color: "var(--text-muted)" }}>
                                            22 Sep 2024
                                        </div>
                                        <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: "var(--text-dim)" }}>
                                            12:29pm
                                        </div>
                                    </div>
                                    <span className="status-badge status-accepted">Accepted</span>
                                </div>

                                <div className="round-item">
                                    <div>
                                        <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, color: "var(--text-muted)" }}>
                                            22 Sep 2024
                                        </div>
                                        <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: "var(--text-dim)" }}>
                                            12:29pm
                                        </div>
                                    </div>
                                    <span className="status-badge status-accepted">Accepted</span>
                                </div>
                            </div>

                            {/* Main */}
                            <div className="mock-main">
                                <div
                                    style={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: "50%",
                                        background: "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))",
                                        border: "2px solid var(--border-strong)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 28,
                                        marginBottom: 8,
                                    }}
                                >
                                    🎙️
                                </div>
                                <h2
                                    style={{
                                        fontFamily: "'Cinzel', serif",
                                        fontSize: "clamp(20px, 3vw, 28px)",
                                        letterSpacing: 1,
                                    }}
                                    className="gold-gradient-text"
                                >
                                    US Visa Mock Interview AI
                                </h2>
                                <p
                                    style={{
                                        fontFamily: "'Raleway', sans-serif",
                                        fontSize: 14,
                                        color: "var(--text-muted)",
                                        fontWeight: 300,
                                    }}
                                >
                                    Click the start button below to begin a new interview.
                                </p>
                                <button className="start-btn">▶ &nbsp;START</button>
                                <p
                                    style={{
                                        fontFamily: "'Raleway', sans-serif",
                                        fontSize: 11,
                                        color: "var(--text-dim)",
                                        letterSpacing: 1,
                                    }}
                                >
                                    Balance: Your free round is live.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── KEY FEATURES ─── */}
            <section style={{ padding: "80px 40px", background: "var(--bg-surface)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: 64 }}>
                        <div className="ornament" style={{ marginBottom: 20 }}>Features</div>
                        <h2
                            className="section-heading"
                            style={{ fontSize: "clamp(28px, 4vw, 44px)", marginBottom: 16 }}
                        >
                            Key Features to Boost Your Prep
                        </h2>
                        <p
                            style={{
                                fontFamily: "'Raleway', sans-serif",
                                fontSize: 15,
                                color: "var(--text-muted)",
                                fontWeight: 300,
                            }}
                        >
                            Strengthen your interview skills through intelligent, adaptive practice.
                        </p>
                        <div className="section-divider" style={{ marginTop: 28 }} />
                    </div>

                    <div
                        className="three-col"
                        style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}
                    >
                        {/* Previous Rounds */}
                        <div className="feature-card">
                            <h3
                                style={{
                                    fontFamily: "'Cinzel', serif",
                                    fontSize: 16,
                                    marginBottom: 12,
                                    color: "var(--text-primary)",
                                    letterSpacing: 0.5,
                                }}
                            >
                                Previous Rounds
                            </h3>
                            <p
                                style={{
                                    fontFamily: "'Raleway', sans-serif",
                                    fontSize: 14,
                                    color: "var(--text-muted)",
                                    lineHeight: 1.7,
                                    fontWeight: 300,
                                    marginBottom: 24,
                                }}
                            >
                                Track progress over time, showing users how their confidence and answer quality have
                                improved with each session.
                            </p>
                            <div>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                        padding: "10px 14px",
                                        background: "rgba(201,168,76,0.05)",
                                        border: "1px solid var(--border-strong)",
                                        borderLeft: "3px solid var(--gold)",
                                        borderRadius: 2,
                                        marginBottom: 8,
                                    }}
                                >
                                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px rgba(74,222,128,0.5)" }} />
                                    <div>
                                        <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 13, color: "var(--text-primary)" }}>
                                            Live Round
                                        </div>
                                        <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: 11, color: "var(--text-dim)" }}>
                                            This interview is ongoing...
                                        </div>
                                    </div>
                                </div>
                                {[{ date: "22 Sep 2024", status: "Underway", cls: "status-underway" }, { date: "22 Sep 2024", status: "Accepted", cls: "status-accepted" }].map((r) => (
                                    <div key={r.date + r.status} className="round-item">
                                        <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, color: "var(--text-muted)" }}>
                                            {r.date}
                                        </span>
                                        <span className={`status-badge ${r.cls}`}>{r.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Realistic Interview Prep */}
                        <div className="feature-card">
                            <h3
                                style={{
                                    fontFamily: "'Cinzel', serif",
                                    fontSize: 16,
                                    marginBottom: 12,
                                    color: "var(--text-primary)",
                                    letterSpacing: 0.5,
                                }}
                            >
                                Realistic Interview Prep
                            </h3>
                            <p
                                style={{
                                    fontFamily: "'Raleway', sans-serif",
                                    fontSize: 14,
                                    color: "var(--text-muted)",
                                    lineHeight: 1.7,
                                    fontWeight: 300,
                                    marginBottom: 24,
                                }}
                            >
                                Boost confidence with AI-driven mock interviews that mirror real US visa scenarios.
                            </p>
                            <div
                                style={{
                                    background: "var(--bg-elevated)",
                                    border: "1px solid var(--border)",
                                    borderRadius: 3,
                                    padding: 16,
                                }}
                            >
                                <div className="chat-bubble" style={{ marginBottom: 12 }}>
                                    <span style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                        <span
                                            style={{
                                                width: 24,
                                                height: 24,
                                                borderRadius: "50%",
                                                background: "var(--gold)",
                                                display: "inline-flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 11,
                                                fontWeight: 700,
                                                color: "#0a0a0a",
                                                flexShrink: 0,
                                            }}
                                        >
                                            YM
                                        </span>
                                        <span style={{ fontFamily: "'Raleway', sans-serif", fontSize: 12, color: "var(--gold)", letterSpacing: 1 }}>
                                            Officer
                                        </span>
                                    </span>
                                    What do you plan to do after completing your studies in the United States?
                                </div>
                                <div
                                    style={{
                                        textAlign: "right",
                                        fontFamily: "'Raleway', sans-serif",
                                        fontSize: 12,
                                        color: "var(--text-dim)",
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        gap: 8,
                                        alignItems: "center",
                                    }}
                                >
                                    <span>···</span>
                                    <span
                                        style={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: "50%",
                                            background: "var(--bg-surface)",
                                            border: "1px solid var(--border)",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        👤
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Immediate Feedback */}
                        <div className="feature-card">
                            <h3
                                style={{
                                    fontFamily: "'Cinzel', serif",
                                    fontSize: 16,
                                    marginBottom: 12,
                                    color: "var(--text-primary)",
                                    letterSpacing: 0.5,
                                }}
                            >
                                Immediate Feedback
                            </h3>
                            <p
                                style={{
                                    fontFamily: "'Raleway', sans-serif",
                                    fontSize: 14,
                                    color: "var(--text-muted)",
                                    lineHeight: 1.7,
                                    fontWeight: 300,
                                    marginBottom: 24,
                                }}
                            >
                                Get an instant result with feedback for each interview, mirroring real visa officer
                                decision-making for your improvement.
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 10,
                                        alignItems: "flex-start",
                                    }}
                                >
                                    <span
                                        style={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: "50%",
                                            background: "var(--gold)",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 11,
                                            fontWeight: 700,
                                            color: "#0a0a0a",
                                            flexShrink: 0,
                                        }}
                                    >
                                        YM
                                    </span>
                                    <div className="chat-bubble rejected" style={{ flex: 1 }}>
                                        Your visa has been <strong style={{ color: "#ef4444" }}>rejected</strong>. Despite strong...
                                    </div>
                                </div>
                                <div
                                    style={{
                                        textAlign: "center",
                                        color: "var(--gold)",
                                        fontSize: 20,
                                    }}
                                >
                                    ↓
                                </div>
                                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                                    <span
                                        style={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: "50%",
                                            background: "var(--gold)",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 11,
                                            fontWeight: 700,
                                            color: "#0a0a0a",
                                            flexShrink: 0,
                                        }}
                                    >
                                        YM
                                    </span>
                                    <div className="chat-bubble approved" style={{ flex: 1 }}>
                                        Your visa has been <strong style={{ color: "#4ade80" }}>approved</strong>. Based on the...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── WHY CHOOSE ─── */}
            <section style={{ padding: "100px 40px" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div
                        className="two-col"
                        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}
                    >
                        {/* Left */}
                        <div>
                            <div className="ornament" style={{ justifyContent: "flex-start", marginBottom: 20 }}>
                                Why Us
                            </div>
                            <h2
                                className="section-heading"
                                style={{ fontSize: "clamp(26px, 3.5vw, 40px)", marginBottom: 24, lineHeight: 1.3 }}
                            >
                                Why Choose Our
                                <br />
                                <span className="gold-gradient-text">AI Mock Interview Tool?</span>
                            </h2>
                            <p
                                style={{
                                    fontFamily: "'Raleway', sans-serif",
                                    fontSize: 15,
                                    color: "var(--text-muted)",
                                    lineHeight: 1.9,
                                    fontWeight: 300,
                                }}
                            >
                                Our tool equips you with the confidence to face any question, the precision to deliver
                                clear answers, and realistic practice scenarios that closely mirror the actual interview
                                experience.
                            </p>
                            <div
                                style={{
                                    width: 60,
                                    height: 2,
                                    background: "linear-gradient(90deg, var(--gold), transparent)",
                                    marginTop: 32,
                                }}
                            />
                        </div>

                        {/* Right Grid */}
                        <div
                            className="two-col"
                            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
                        >
                            <div className="stat-card">
                                <div
                                    style={{
                                        fontSize: 40,
                                        marginBottom: 12,
                                        filter: "drop-shadow(0 0 12px rgba(201,168,76,0.4))",
                                    }}
                                >
                                    🏆
                                </div>
                                <h4
                                    style={{
                                        fontFamily: "'Cinzel', serif",
                                        fontSize: 14,
                                        color: "var(--text-primary)",
                                        letterSpacing: 0.5,
                                        marginBottom: 8,
                                    }}
                                >
                                    Confidence Boost
                                </h4>
                                <p
                                    style={{
                                        fontFamily: "'Raleway', sans-serif",
                                        fontSize: 12,
                                        color: "var(--text-dim)",
                                        lineHeight: 1.6,
                                        fontWeight: 300,
                                    }}
                                >
                                    Practice sessions to help you feel ready and self-assured.
                                </p>
                            </div>

                            <div className="stat-card" style={{ textAlign: "center" }}>
                                <div className="gold-gradient-text" style={{ fontSize: 44, fontFamily: "'Cinzel', serif", fontWeight: 700, marginBottom: 8 }}>
                                    97.6%
                                </div>
                                <h4
                                    style={{
                                        fontFamily: "'Cinzel', serif",
                                        fontSize: 13,
                                        color: "var(--text-primary)",
                                        letterSpacing: 0.5,
                                        marginBottom: 8,
                                    }}
                                >
                                    Feedback Accuracy
                                </h4>
                                <p
                                    style={{
                                        fontFamily: "'Raleway', sans-serif",
                                        fontSize: 12,
                                        color: "var(--text-dim)",
                                        lineHeight: 1.6,
                                        fontWeight: 300,
                                    }}
                                >
                                    Highly accurate AI-driven feedback for ultimate preparation.
                                </p>
                            </div>

                            <div className="stat-card" style={{ textAlign: "center" }}>
                                <div className="gold-gradient-text" style={{ fontSize: 44, fontFamily: "'Cinzel', serif", fontWeight: 700, marginBottom: 8 }}>
                                    450+
                                </div>
                                <h4
                                    style={{
                                        fontFamily: "'Cinzel', serif",
                                        fontSize: 13,
                                        color: "var(--text-primary)",
                                        letterSpacing: 0.5,
                                        marginBottom: 8,
                                    }}
                                >
                                    Previously Rejected
                                    <br />Candidates Approved
                                </h4>
                            </div>

                            <div className="stat-card">
                                <div
                                    style={{
                                        fontSize: 40,
                                        marginBottom: 12,
                                        filter: "drop-shadow(0 0 12px rgba(201,168,76,0.4))",
                                    }}
                                >
                                    🎯
                                </div>
                                <h4
                                    style={{
                                        fontFamily: "'Cinzel', serif",
                                        fontSize: 14,
                                        color: "var(--text-primary)",
                                        letterSpacing: 0.5,
                                        marginBottom: 8,
                                    }}
                                >
                                    Get Ready to Succeed
                                </h4>
                                <p
                                    style={{
                                        fontFamily: "'Raleway', sans-serif",
                                        fontSize: 12,
                                        color: "var(--text-dim)",
                                        lineHeight: 1.6,
                                        fontWeight: 300,
                                    }}
                                >
                                    Comprehensive sessions to help you ace your visa interview.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── PRICING ─── */}
            <section style={{ padding: "80px 40px 100px", background: "var(--bg-surface)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: 60 }}>
                        <div className="ornament" style={{ marginBottom: 20 }}>Pricing</div>
                        <h2
                            className="section-heading"
                            style={{ fontSize: "clamp(28px, 4vw, 44px)", marginBottom: 16 }}
                        >
                            Small Investment{" "}
                            <span className="gold-gradient-text">→</span>{" "}
                            Huge Savings
                        </h2>
                        <p
                            style={{
                                fontFamily: "'Raleway', sans-serif",
                                fontSize: 15,
                                color: "var(--text-muted)",
                                fontWeight: 300,
                                marginBottom: 28,
                            }}
                        >
                            1 in 4 visas are rejected. Avoid reapplying and ace your interview in your upcoming attempt.
                        </p>
                        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="INR">INR</option>
                            <option value="GBP">GBP</option>
                        </select>
                        <div className="section-divider" style={{ marginTop: 28 }} />
                    </div>

                    <div
                        className="three-col"
                        style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, alignItems: "start" }}
                    >
                        {plans.map((plan) => (
                            <div key={plan.rounds} className={`pricing-card${plan.highlight ? " featured" : ""}`}>
                                {plan.label && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: -1,
                                            right: 20,
                                            background: "linear-gradient(135deg, #c9a84c, #d4a843)",
                                            color: "#0a0a0a",
                                            fontFamily: "'Cinzel', serif",
                                            fontSize: 11,
                                            fontWeight: 700,
                                            letterSpacing: 2,
                                            padding: "6px 14px",
                                            borderRadius: "0 0 4px 4px",
                                        }}
                                    >
                                        {plan.label}
                                    </div>
                                )}
                                <div
                                    style={{
                                        fontFamily: "'Raleway', sans-serif",
                                        fontSize: 12,
                                        color: "var(--text-dim)",
                                        letterSpacing: 1,
                                        marginBottom: 4,
                                    }}
                                >
                                    Price:{" "}
                                    <s>
                                        {currency} {plan.original}
                                    </s>
                                </div>
                                <div
                                    style={{
                                        fontFamily: "'Cinzel', serif",
                                        fontSize: 42,
                                        fontWeight: 700,
                                        marginBottom: 4,
                                        lineHeight: 1,
                                    }}
                                    className="gold-gradient-text"
                                >
                                    <span style={{ fontSize: 16, fontWeight: 400, WebkitTextFillColor: "var(--text-muted)", color: "var(--text-muted)" }}>
                                        {currency}{" "}
                                    </span>
                                    {plan.price}
                                </div>
                                <div
                                    style={{
                                        fontFamily: "'Cinzel', serif",
                                        fontSize: 15,
                                        color: "var(--text-primary)",
                                        letterSpacing: 1,
                                        marginBottom: 28,
                                        marginTop: 8,
                                    }}
                                >
                                    {plan.rounds}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                                    {plan.features.map((f) => (
                                        <div key={f} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                                            <span className="checkmark">✓</span>
                                            <span
                                                style={{
                                                    fontFamily: "'Raleway', sans-serif",
                                                    fontSize: 13,
                                                    color: "var(--text-muted)",
                                                    lineHeight: 1.5,
                                                    fontWeight: 300,
                                                }}
                                            >
                                                {f}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <button className={`upgrade-btn${plan.highlight ? " featured" : ""}`}>
                                    Upgrade Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── FAQ ─── */}
            <section style={{ padding: "80px 40px 100px" }}>
                <div style={{ maxWidth: 860, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: 60 }}>
                        <div className="ornament" style={{ marginBottom: 20 }}>FAQ</div>
                        <h2
                            className="section-heading"
                            style={{ fontSize: "clamp(28px, 4vw, 44px)", marginBottom: 12 }}
                        >
                            Frequently Asked Questions
                        </h2>
                        <p
                            style={{
                                fontFamily: "'Raleway', sans-serif",
                                fontSize: 14,
                                color: "var(--text-muted)",
                                letterSpacing: 1,
                                fontWeight: 300,
                            }}
                        >
                            Helping you understand every step of the way.
                        </p>
                        <div className="section-divider" style={{ marginTop: 24 }} />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {faqs.map((faq, i) => (
                            <div key={i} className={`faq-item${openFaq === i ? " open" : ""}`}>
                                <button
                                    className="faq-trigger"
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                >
                                    {faq.q}
                                    <span className="faq-icon">{openFaq === i ? "−" : "+"}</span>
                                </button>
                                {openFaq === i && (
                                    <div className="faq-body">{faq.a}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer
                style={{
                    borderTop: "1px solid var(--border)",
                    padding: "40px",
                    background: "var(--bg-deep)",
                    textAlign: "center",
                }}
            >
                <div
                    style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: 18,
                        fontWeight: 700,
                        letterSpacing: 3,
                        marginBottom: 16,
                    }}
                    className="gold-gradient-text"
                >
                    
                </div>
                <p
                    style={{
                        fontFamily: "'Raleway', sans-serif",
                        fontSize: 12,
                        color: "var(--text-dim)",
                        letterSpacing: 1,
                    }}
                >
                    © 2026 · Architecting Global Careers
                </p>
            </footer>
        </div>
    );
}