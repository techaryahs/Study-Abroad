"use client";

import { useState } from "react";
import Link from "next/link";

const currencies = [
  { code: "INR", symbol: "₹", rate: 1 },
  { code: "USD", symbol: "$", rate: 0.012 },
  { code: "EUR", symbol: "€", rate: 0.011 },
  { code: "GBP", symbol: "£", rate: 0.0095 },
];

const ACTUAL_INR = 69534.0;
const DISCOUNTED_INR = 55627.49;
const SAVINGS_INR = 13906.51;

export default function CompleteApplicationReviewPage() {
  const [currency, setCurrency] = useState(currencies[0]);

  const format = (amount) => {
    const converted = amount * currency.rate;
    return `${currency.code} ${converted.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f0e6",
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,800;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

        .page-root {
          background: #f5f0e6;
          min-height: 100vh;
          font-family: 'Cormorant Garamond', Georgia, serif;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #5a4a2a;
          text-decoration: none;
          margin-bottom: 32px;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        .back-link:hover { opacity: 1; }

        .tag-badge {
          display: inline-block;
          font-family: 'Cormorant Garamond', serif;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #5a4a2a;
          border: 1px solid #c8a96a;
          padding: 5px 16px;
          border-radius: 100px;
          margin-bottom: 24px;
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(38px, 6vw, 72px);
          font-weight: 400;
          line-height: 1.1;
          color: #2b2218;
          margin: 0 0 12px;
          letter-spacing: -0.01em;
        }

        .hero-title-gold {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(38px, 6vw, 72px);
          font-weight: 400;
          color: #c8a96a;
          display: block;
          line-height: 1.1;
        }

        .hero-quote {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 17px;
          line-height: 1.75;
          color: #5a4a2a;
          max-width: 500px;
          margin: 20px 0 36px;
        }

        .includes-label {
          font-family: 'Cormorant Garamond', serif;
          font-size: 12px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #9a8060;
          margin-bottom: 16px;
        }

        .icon-pill {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .icon-circle {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-label {
          font-size: 12px;
          letter-spacing: 0.06em;
          color: #5a4a2a;
          font-family: 'Cormorant Garamond', serif;
        }

        .discuss-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1.5px solid #c8a96a;
          background: transparent;
          color: #2b2218;
          padding: 10px 24px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 14px;
          letter-spacing: 0.12em;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          border-radius: 2px;
        }
        .discuss-btn:hover { background: #c8a96a22; }

        .gold-divider {
          width: 60px;
          height: 1.5px;
          background: #c8a96a;
          margin: 0 auto 32px;
        }

        .section-heading {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 400;
          text-align: center;
          color: #2b2218;
          margin-bottom: 12px;
          letter-spacing: 0.01em;
        }

        .body-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px;
          line-height: 1.85;
          color: #4a3c2a;
        }

        .body-text a {
          color: #c8a96a;
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .list-styled {
          padding-left: 20px;
          margin: 10px 0 20px;
        }

        .list-styled li {
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px;
          line-height: 1.8;
          color: #4a3c2a;
          margin-bottom: 4px;
        }

        .note-box {
          border-left: 3px solid #c8a96a;
          background: #fdf8f0;
          padding: 16px 20px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px;
          line-height: 1.7;
          color: #5a4a2a;
          margin-top: 24px;
          border-radius: 0 4px 4px 0;
        }

        .pricing-card {
          background: #fdf8f0;
          border: 1px solid #d9c99a;
          border-radius: 4px;
          overflow: hidden;
          position: sticky;
          top: 24px;
        }

        .pricing-header {
          background: #2b2218;
          padding: 18px 24px;
          text-align: center;
        }

        .pricing-header h3 {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 400;
          color: #e8d9b8;
          margin: 0;
          letter-spacing: 0.06em;
        }

        .pricing-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #e8dcc8;
          font-family: 'Cormorant Garamond', serif;
          font-size: 15px;
        }
        .pricing-row:last-child { border-bottom: none; }

        .pricing-label {
          font-weight: 600;
          color: #3a2e1e;
          letter-spacing: 0.04em;
        }

        .pricing-value {
          color: #5a4a2a;
          text-align: right;
        }

        .strikethrough {
          text-decoration: line-through;
          color: #b0a090;
        }

        .price-highlight {
          font-size: 17px;
          font-weight: 700;
          color: #b5400a;
          font-family: 'Playfair Display', serif;
        }

        .savings-badge {
          background: #c8a96a;
          color: #2b2218;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 3px 9px;
          border-radius: 2px;
          font-family: 'Cormorant Garamond', serif;
        }

        select.currency-select {
          border: 1px solid #d9c99a;
          background: #fdf8f0;
          color: #3a2e1e;
          padding: 5px 10px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 14px;
          border-radius: 2px;
          outline: none;
          cursor: pointer;
        }
        select.currency-select:focus {
          border-color: #c8a96a;
        }

        .cta-row {
          display: flex;
          gap: 10px;
          padding: 18px 24px;
          border-top: 1px solid #d9c99a;
        }

        .btn-outline {
          flex: 1;
          padding: 11px;
          border: 1.5px solid #c8a96a;
          background: transparent;
          color: #2b2218;
          font-family: 'Cormorant Garamond', serif;
          font-size: 14px;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: background 0.2s;
          border-radius: 2px;
        }
        .btn-outline:hover { background: #c8a96a22; }

        .btn-gold {
          flex: 1;
          padding: 11px;
          border: none;
          background: #c8a96a;
          color: #2b2218;
          font-family: 'Cormorant Garamond', serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: background 0.2s;
          border-radius: 2px;
        }
        .btn-gold:hover { background: #b8995a; }

        .discuss-card {
          margin-top: 20px;
          background: #fdf8f0;
          border: 1px solid #d9c99a;
          border-radius: 4px;
          padding: 18px;
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .discuss-card img {
          width: 64px;
          height: 64px;
          object-fit: cover;
          border-radius: 3px;
          flex-shrink: 0;
        }

        .discuss-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 15px;
          font-weight: 400;
          color: #2b2218;
          margin: 0 0 4px;
        }

        .discuss-card-sub {
          font-family: 'Cormorant Garamond', serif;
          font-size: 13px;
          color: #7a6a50;
          margin: 0 0 10px;
          line-height: 1.5;
        }

        .message-btn {
          border: 1px solid #c8a96a;
          background: transparent;
          color: #5a4a2a;
          padding: 6px 14px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 13px;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: background 0.2s;
          border-radius: 2px;
        }
        .message-btn:hover { background: #c8a96a22; }

        @media (max-width: 768px) {
          .main-grid { flex-direction: column !important; }
          .pricing-col { width: 100% !important; }
        }
      `}</style>

      <div className="page-root">
        {/* ── Hero Banner ── */}
        <section
          style={{
            padding: "64px 24px 72px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "48px",
            }}
          >
            {/* Left */}
            <div style={{ maxWidth: "560px", flex: "1 1 320px" }}>
              <Link href="/services" className="back-link">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Services
              </Link>

              <div className="tag-badge">Complete Application Review</div>

              <h1 className="hero-title">
                The Expert
                <span className="hero-title-gold">Decisive Review</span>
              </h1>

              <p className="hero-quote">
                "Leverage deep-tier expert guidance and years of consulting
                expertise to elevate every document that defines your
                application journey."
              </p>

              <p className="includes-label">Includes</p>
              <div style={{ display: "flex", gap: "32px", marginBottom: "40px" }}>
                <div className="icon-pill">
                  <div className="icon-circle" style={{ background: "#2b2218" }}>
                    <svg className="icon" width="20" height="20" fill="white" viewBox="0 0 24 24">
                      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
                    </svg>
                  </div>
                  <span className="icon-label">Audio call</span>
                </div>
                <div className="icon-pill">
                  <div className="icon-circle" style={{ background: "#25d366" }}>
                    <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <span className="icon-label">Text Support</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                <button className="discuss-btn">Discuss Your Case</button>
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "14px",
                    fontStyle: "italic",
                    color: "#9a8060",
                  }}
                >
                  Have questions? Let's talk.
                </span>
              </div>
            </div>

            {/* Right – illustration */}
            <div style={{ flexShrink: 0 }}>
              <img
                src="/complet-appl.jpg"
                alt="Complete Application Review"
                style={{
                  width: "380px",
                  maxWidth: "100%",
                  height: "260px",
                  objectFit: "cover",
                  borderRadius: "3px",
                  filter: "sepia(8%)",
                }}
              />
            </div>
          </div>
        </section>

        {/* Gold horizontal rule */}
        <div
          style={{
            height: "1px",
            background: "linear-gradient(to right, transparent, #c8a96a 30%, #c8a96a 70%, transparent)",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        />

        {/* ── About Service + Pricing ── */}
        <section
          style={{
            padding: "64px 24px 80px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <div
            className="main-grid"
            style={{ display: "flex", gap: "64px", alignItems: "flex-start" }}
          >
            {/* Left – About */}
            <div style={{ flex: 1 }}>
              <h2 className="section-heading">About Service</h2>
              <div className="gold-divider" />

              <p className="body-text" style={{ marginBottom: "20px" }}>
                While most people prefer our{" "}
                <a href="#">Complete Application Help</a> service where we work
                on all the drafts and application material for you from scratch
                in order to make the best of their applications, this service is
                comparable to other consultancies where you receive overall help
                through our experts, but in the form of reviews. Essentially,
                our consulting team will guide you at every step of the way and
                offer unlimited reviews for the documents mentioned below.
              </p>

              <p
                className="body-text"
                style={{
                  fontWeight: 600,
                  marginBottom: "10px",
                  color: "#2b2218",
                }}
              >
                Included in the complete application review service:
              </p>
              <ul className="list-styled">
                <li style={{ fontWeight: 700 }}>Profile Evaluation and University Shortlisting</li>
                <li>1 SOP Review</li>
                <li>3 LOR Reviews</li>
                <li>1 Resume Review</li>
                <li>1 Application Portal Review</li>
              </ul>

              <p className="body-text" style={{ marginBottom: "20px" }}>
                During the service, we are constantly in touch with you and we
                help you get through any impediments you face during your
                applications. The Profile Evaluation and University Shortlisting
                service, which is included in the package, will help you
                determine the right universities for you.
              </p>

              <p
                className="body-text"
                style={{
                  fontWeight: 600,
                  color: "#2b2218",
                  marginBottom: "10px",
                }}
              >
                It is not uncommon to see students get rejections for the
                following reasons:
              </p>
              <ul className="list-styled">
                <li>
                  The student's profile was NOT competitive enough (or, the
                  University is extremely ambitious for the student)
                </li>
                <li>
                  The student's profile was way too good for the university —
                  yes, overqualified applicants do get rejected by safe
                  universities.
                </li>
              </ul>

              <p className="body-text" style={{ marginBottom: "20px" }}>
                The Profile Evaluation and University Shortlisting will save you
                from making such mistakes. The other services like SOP review,
                LOR reviews, resume review, and application portal help review
                will ensure that your application looks consistent and we will
                point out the changes you can make in order to increase your
                chances of getting the admission.
              </p>

              <div className="note-box">
                <strong>Important Note:</strong> The Complete Application Review
                service will ensure that you get validated expert advice on your
                applications and drafts. If you are looking for us to{" "}
                <strong>draft</strong> all of your documents from scratch, you
                should take a look at the{" "}
                <a href="#" style={{ color: "#c8a96a", fontWeight: 600 }}>
                  Complete Application Help
                </a>
                .
              </div>
            </div>

            {/* Right – Pricing */}
            <div
              className="pricing-col"
              style={{ width: "300px", flexShrink: 0 }}
            >
              <div className="pricing-card">
                <div className="pricing-header">
                  <h3>Start Now</h3>
                </div>

                <div style={{ padding: "20px 24px 8px" }}>
                  <div className="pricing-row">
                    <span className="pricing-label">Services</span>
                    <span className="pricing-value" style={{ fontSize: "13px", maxWidth: "150px", textAlign: "right" }}>
                      Application Review (Expert Opinion)
                    </span>
                  </div>

                  <div className="pricing-row">
                    <span className="pricing-label">Duration</span>
                    <span className="pricing-value" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      3–5 days
                      <span
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          border: "1px solid #9a8060",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "10px",
                          color: "#9a8060",
                          cursor: "help",
                        }}
                        title="Business days"
                      >
                        i
                      </span>
                    </span>
                  </div>

                  <div className="pricing-row">
                    <span className="pricing-label">Currency</span>
                    <select
                      className="currency-select"
                      value={currency.code}
                      onChange={(e) =>
                        setCurrency(currencies.find((c) => c.code === e.target.value))
                      }
                    >
                      {currencies.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pricing-row">
                    <span className="pricing-label">Actual Amount</span>
                    <span className="pricing-value strikethrough">
                      {format(ACTUAL_INR)}
                    </span>
                  </div>

                  <div className="pricing-row">
                    <span className="pricing-label">Amount</span>
                    <span className="price-highlight">{format(DISCOUNTED_INR)}</span>
                  </div>

                  <div className="pricing-row" style={{ borderBottom: "none" }}>
                    <span className="pricing-label">You save</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="pricing-value">{format(SAVINGS_INR)}</span>
                      <span className="savings-badge">20% off</span>
                    </div>
                  </div>
                </div>

                <div className="cta-row">
                  <button className="btn-outline">Add to Cart</button>
                  <button className="btn-gold">Buy Now</button>
                </div>
              </div>

              {/* Discuss card */}
              <div className="discuss-card">
                <img src="/man_holding_phone.png" alt="Consultant" />
                <div>
                  <p className="discuss-card-title">Discuss Your Case</p>
                  <p className="discuss-card-sub">
                    Chat with a team member to see how we can help.
                  </p>
                  <button className="message-btn">Message now →</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}