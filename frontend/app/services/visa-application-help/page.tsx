"use client";

import { useState, useEffect, useRef } from "react";

const countries = ["USA", "Canada", "UK"];

const visaData = {
  USA: {
    student: ["F-1", "F-2", "J-1", "J-2", "M-1", "M-2"],
    work: ["H-4", "H-1B", "L-1A", "L-2"],
    business: ["B1", "B2"],
    others: ["K / U / O / C1-D"],
  },
  Canada: {
    student: ["Study Permit", "Co-op Work Permit"],
    work: ["LMIA", "ICT", "PGWP"],
    business: ["Visitor Visa", "eTA"],
    others: ["PR / Express Entry"],
  },
  UK: {
    student: ["Student Visa (Tier 4)"],
    work: ["Skilled Worker", "Graduate Route"],
    business: ["Standard Visitor"],
    others: ["Global Talent", "Health & Care"],
  },
};

const features = [
  { icon: "📋", title: "Visa Documentation", desc: "Ensure correctness in DS-160 & Visa Portal submissions with zero errors." },
  { icon: "💳", title: "Financial Documentation", desc: "Prove the right amount of finances to satisfy consulate requirements." },
  { icon: "🎤", title: "Mock Interviews", desc: "Train for visa interviews with proven techniques and real-time feedback." },
  { icon: "📱", title: "Social Media Vetting", desc: "Ensure your online presence is fully compliant before submission." },
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
  return [ref, visible];
}

function CountUp({ target, duration = 1800, suffix = "" }) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setStarted(true);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(+(target * ease).toFixed(1));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return <span ref={ref}>{val}{suffix}</span>;
}

export default function VisaApplicationPage() {
  const [activeCountry, setActiveCountry] = useState("USA");
  const [dependents, setDependents] = useState(0);
  const [mocks, setMocks] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [featuresRef, featuresVisible] = useInView();
  const [visaRef, visaVisible] = useInView();

  useEffect(() => { setMounted(true); }, []);

  const base = 55898;
  const original = 69874;
  const addon = dependents * 3500 + (mocks - 1) * 2500;

  const visa = visaData[activeCountry];

  return (
    <div className="min-h-screen text-stone-100 overflow-x-hidden relative" style={{ background: "#0a0a0f", fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes fadeUp   { from{opacity:0;transform:translateY(32px);}  to{opacity:1;transform:translateY(0);} }
        @keyframes floatY   { 0%,100%{transform:translateY(0);}            50%{transform:translateY(-10px);} }
        @keyframes spinCW   { from{transform:rotate(0deg);}                to{transform:rotate(360deg);} }
        @keyframes spinCCW  { from{transform:rotate(0deg);}                to{transform:rotate(-360deg);} }
        @keyframes shimmer  { 0%{background-position:-200% center;}        100%{background-position:200% center;} }
        @keyframes pulseGlow{ 0%,100%{box-shadow:0 0 0 0 rgba(234,179,8,.45);} 50%{box-shadow:0 0 0 10px rgba(234,179,8,0);} }
        @keyframes orbD1    { 0%,100%{transform:translate(0,0) scale(1);}  50%{transform:translate(40px,-28px) scale(1.12);} }
        @keyframes orbD2    { 0%,100%{transform:translate(0,0) scale(1);}  50%{transform:translate(-28px,20px) scale(0.9);} }
        @keyframes tabSlide { from{opacity:0;transform:translateY(10px);}  to{opacity:1;transform:translateY(0);} }
        @keyframes badgePop { from{opacity:0;transform:scale(0.7);}        to{opacity:1;transform:scale(1);} }

        .fd  { font-family:'Cormorant Garamond',Georgia,serif; }
        .afu { animation:fadeUp   0.8s cubic-bezier(.16,1,.3,1) both; }
        .afl { animation:floatY  6s ease-in-out infinite; }
        .acw { animation:spinCW 22s linear infinite; }
        .accw{ animation:spinCCW 32s linear infinite; }
        .aglow{ animation:pulseGlow 2.5s ease-in-out infinite; }
        .aorb1{ animation:orbD1 14s ease-in-out infinite; }
        .aorb2{ animation:orbD2 18s ease-in-out infinite; }
        .atab { animation:tabSlide 0.35s cubic-bezier(.16,1,.3,1) both; }
        .abadge{ animation:badgePop 0.4s cubic-bezier(.34,1.56,.64,1) both; }

        .d1{animation-delay:.10s;} .d2{animation-delay:.20s;}
        .d3{animation-delay:.30s;} .d4{animation-delay:.40s;}
        .d5{animation-delay:.55s;}

        .gold-shimmer {
          background:linear-gradient(90deg,#ca8a04,#fde68a,#ca8a04,#d4a555,#ca8a04);
          background-size:300% auto;
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
          animation:shimmer 4s linear infinite;
        }

        .grid-texture {
          background-image:
            linear-gradient(rgba(202,138,4,.09) 1px,transparent 1px),
            linear-gradient(90deg,rgba(202,138,4,.09) 1px,transparent 1px);
          background-size:72px 72px;
        }

        .tag {
          display:inline-block; font-size:10px; letter-spacing:.15em;
          text-transform:uppercase; color:#eab308;
          border:1px solid rgba(202,138,4,.38); border-radius:999px;
          padding:5px 16px;
        }

        .card {
          background:rgba(255,255,255,.035);
          border:1px solid rgba(202,138,4,.13);
          border-radius:18px;
          transition:transform .35s ease,border-color .35s ease,background .35s ease;
        }
        .card:hover {
          transform:translateY(-4px);
          border-color:rgba(202,138,4,.38);
          background:rgba(202,138,4,.05);
        }

        .btn-gold {
          background:#ca8a04; color:#0a0a0f; font-weight:600;
          border:none; border-radius:999px; padding:14px 32px;
          font-size:14px; cursor:pointer;
          transition:background .25s,transform .2s;
        }
        .btn-gold:hover{ background:#eab308; transform:scale(1.04); }

        .btn-outline {
          background:transparent; color:#eab308;
          border:1px solid rgba(202,138,4,.42); border-radius:12px;
          padding:11px 20px; font-size:13px; cursor:pointer; width:100%;
          transition:background .25s,border-color .25s;
        }
        .btn-outline:hover{ background:rgba(202,138,4,.10); border-color:#eab308; }

        .country-tab {
          padding:8px 22px; border-radius:999px; font-size:13px;
          font-weight:500; cursor:pointer; border:1px solid rgba(202,138,4,.22);
          color:#a8a29e; background:transparent;
          transition:all .25s ease;
        }
        .country-tab:hover { border-color:rgba(202,138,4,.50); color:#eab308; }
        .country-tab.active {
          background:#ca8a04; color:#0a0a0f;
          border-color:#ca8a04; font-weight:700;
        }

        .visa-pill {
          display:inline-block; font-size:11px; letter-spacing:.06em;
          color:#d6d3d1; border:1px solid rgba(255,255,255,.10);
          border-radius:999px; padding:4px 12px; margin:3px 3px 0 0;
          transition:all .2s ease;
        }
        .visa-pill:hover {
          border-color:rgba(202,138,4,.45); color:#eab308;
          background:rgba(202,138,4,.07);
        }

        .stat-divider { border-right:1px solid rgba(202,138,4,.18); }
        .stat-divider:last-child { border-right:none; }

        .field {
          width:100%; background:rgba(255,255,255,.04);
          border:1px solid rgba(202,138,4,.20); border-radius:12px;
          color:#f5f5f4; font-size:13px; padding:10px 14px;
          outline:none; margin-top:6px;
          font-family:'DM Sans',sans-serif;
          transition:border-color .25s;
        }
        .field:focus{ border-color:rgba(202,138,4,.65); }
        select.field option{ background:#111118; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button{ -webkit-appearance:none; }
        input[type=number]{ -moz-appearance:textfield; }
      `}</style>

      {/* ── Ambient background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="aorb1 absolute rounded-full"
          style={{ width:520,height:520,top:-160,right:-160,background:"radial-gradient(circle,rgba(202,138,4,.12) 0%,transparent 70%)",filter:"blur(60px)" }} />
        <div className="aorb2 absolute rounded-full"
          style={{ width:420,height:420,bottom:-80,left:-160,background:"radial-gradient(circle,rgba(30,80,200,.07) 0%,transparent 70%)",filter:"blur(60px)" }} />
        <div className="absolute rounded-full"
          style={{ width:300,height:300,top:"50%",left:"50%",background:"radial-gradient(circle,rgba(234,179,8,.04) 0%,transparent 70%)",filter:"blur(50px)" }} />
        <div className="absolute inset-0 grid-texture" />
      </div>

      {/* ── Page ── */}
      <div className="relative max-w-6xl mx-auto px-6 py-12" style={{ zIndex:1 }}>

        {/* ══ HERO ══ */}
        <section className="mb-20">
          <div className={mounted ? "afu mb-6" : "opacity-0 mb-6"}>
            <span className="tag">Visa Services</span>
          </div>

          <div className="grid gap-16 items-center" style={{ gridTemplateColumns:"1fr 1fr" }}>
            {/* Copy */}
            <div>
              <h1 className={`fd ${mounted?"afu d1":"opacity-0"}`}
                style={{ fontSize:"clamp(44px,5.5vw,72px)",fontWeight:700,lineHeight:1.0,letterSpacing:"-0.02em",marginBottom:24 }}>
                Visa<br />
                Application <span className="gold-shimmer">Help</span>
              </h1>

              <p className={mounted?"afu d2":"opacity-0"}
                style={{ color:"#a8a29e",fontSize:16,lineHeight:1.7,maxWidth:440,marginBottom:28 }}>
                Ace your visa application through expert help in paperwork, financial planning,
                and mock interviews. Applicable for USA, Canada, UK, Germany, and more.
              </p>

              <div className={`flex flex-wrap gap-3 ${mounted?"afu d3":"opacity-0"}`} style={{ marginBottom:28 }}>
                {["📹 Video Call","📞 Audio Call","💬 Text Support"].map((f,i) => (
                  <span key={i} style={{ fontSize:12,color:"#78716c",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.09)",borderRadius:999,padding:"7px 16px" }}>{f}</span>
                ))}
              </div>

              <div className={`flex items-center gap-4 ${mounted?"afu d4":"opacity-0"}`}>
                <button className="btn-gold aglow">Discuss Your Case →</button>
                <span style={{ fontSize:12,color:"#57534e" }}>Free consultation</span>
              </div>
            </div>

            {/* Orbital graphic — passport / visa theme */}
            <div className={`flex justify-center ${mounted?"afu d3":"opacity-0"}`}>
              <div className="relative" style={{ width:280,height:280 }}>
                <div className="acw absolute inset-0 rounded-full"
                  style={{ border:"1px solid rgba(202,138,4,.18)" }} />
                <div className="accw absolute rounded-full"
                  style={{ inset:24,border:"1px dashed rgba(202,138,4,.10)" }} />

                {/* Center */}
                <div className="afl absolute rounded-full flex flex-col items-center justify-center"
                  style={{ inset:64,background:"rgba(202,138,4,.08)",border:"1px solid rgba(202,138,4,.28)" }}>
                  <span style={{ fontSize:36,marginBottom:4 }}>🛂</span>
                  <span style={{ fontSize:10,letterSpacing:".12em",textTransform:"uppercase",color:"#eab308" }}>Approved</span>
                </div>

                {/* Country flags orbiting */}
                {[["🇺🇸","USA"],["🇨🇦","CA"],["🇬🇧","UK"]].map(([flag,label],i) => {
                  const angle = (i*120 - 90)*(Math.PI/180);
                  const r=108,cx=140,cy=140;
                  return (
                    <div key={i} className="afl absolute"
                      style={{
                        left: cx+r*Math.cos(angle)-26,
                        top:  cy+r*Math.sin(angle)-13,
                        fontSize:11,color:"#e7e5e4",
                        background:"rgba(202,138,4,.10)",
                        border:"1px solid rgba(202,138,4,.28)",
                        borderRadius:999,padding:"5px 12px",
                        animationDelay:`${i*0.8}s`,
                      }}>
                      {flag} {label}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className={`flex ${mounted?"afu d5":"opacity-0"}`}
            style={{ marginTop:48,border:"1px solid rgba(202,138,4,.15)",borderRadius:18,background:"rgba(255,255,255,.03)",overflow:"hidden" }}>
            {[["98.7%","Success Rate"],["10,000+","Visas Approved"],["55+","Countries Served"]].map(([val,label],i) => (
              <div key={i} className={`flex-1 text-center py-6 ${i<2?"stat-divider":""}`}>
                <p className="fd" style={{ fontSize:30,fontWeight:700,color:"#eab308",marginBottom:4 }}>{val}</p>
                <p style={{ fontSize:11,color:"#57534e",letterSpacing:".12em",textTransform:"uppercase" }}>{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ MAIN GRID ══ */}
        <div className="grid gap-10" style={{ gridTemplateColumns:"1fr 360px" }}>

          {/* ── LEFT ── */}
          <div style={{ display:"flex",flexDirection:"column",gap:56 }}>

            {/* Heading */}
            <div>
              <span className="tag" style={{ marginBottom:20,display:"inline-block" }}>About Service</span>
              <h2 className="fd" style={{ fontSize:40,fontWeight:700,letterSpacing:"-0.01em",marginBottom:12 }}>Visa Application Help</h2>
              <div style={{ width:52,height:2,background:"linear-gradient(90deg,#eab308,transparent)",borderRadius:2,marginBottom:12 }} />
              <p style={{ color:"#78716c",fontSize:14 }}>Expert guidance through every step of your visa journey.</p>
            </div>

            {/* Country tabs + visa types */}
            <div ref={visaRef}>
              <div className="flex gap-3" style={{ marginBottom:24 }}>
                {countries.map(c => (
                  <button key={c} className={`country-tab ${activeCountry===c?"active":""}`}
                    onClick={() => setActiveCountry(c)}>{c}</button>
                ))}
              </div>

              <div className="card p-7"
                style={{
                  opacity: visaVisible?1:0,
                  transform: visaVisible?"translateY(0)":"translateY(20px)",
                  transition:"opacity .6s ease,transform .6s ease",
                }}>
                <p style={{ fontSize:13,color:"#a8a29e",marginBottom:20 }}>
                  This service is valid for the following visa types:
                </p>

                {[
                  ["🎓 Student Visas", visa.student],
                  ["💼 Work Visas",    visa.work],
                  ["🤝 Business",      visa.business],
                  ["🔖 Others",        visa.others],
                ].map(([label, items], i) => (
                  <div key={i} style={{ marginBottom:16 }}>
                    <p style={{ fontSize:12,letterSpacing:".08em",textTransform:"uppercase",color:"#eab308",marginBottom:8 }}>{label}</p>
                    <div className="atab" style={{ animationDelay:`${i*60}ms` }}>
                      {items.map(v => <span key={v} className="visa-pill">{v}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick appointment highlight */}
            <div style={{
              position:"relative",overflow:"hidden",
              border:"1px solid rgba(202,138,4,.24)",
              background:"rgba(202,138,4,.04)",
              borderRadius:24,padding:"36px 40px",
            }}>
              <div style={{ position:"absolute",top:-40,right:-40,width:180,height:180,borderRadius:"50%",background:"radial-gradient(circle,rgba(202,138,4,.14) 0%,transparent 70%)",filter:"blur(24px)",pointerEvents:"none" }} />
              <span className="tag" style={{ marginBottom:18,display:"inline-block" }}>Quick Appointments</span>
              <h3 className="fd" style={{ fontSize:28,fontWeight:600,marginBottom:10 }}>24/7 Visa Monitoring</h3>
              <p style={{ color:"#a8a29e",fontSize:14,lineHeight:1.7,maxWidth:480 }}>
                Faster appointment booking with round-the-clock monitoring — no effort required on your end. We handle the queues so you don't have to.
              </p>
            </div>

            {/* Feature cards */}
            <div>
              <span className="tag" style={{ marginBottom:20,display:"inline-block" }}>What's Included</span>
              <div ref={featuresRef} className="grid gap-4" style={{ gridTemplateColumns:"1fr 1fr" }}>
                {features.map((item,i) => (
                  <div key={i} className="card p-6"
                    style={{
                      opacity: featuresVisible?1:0,
                      transform: featuresVisible?"translateY(0)":"translateY(24px)",
                      transition:`opacity .6s ease ${i*80}ms, transform .6s ease ${i*80}ms`,
                    }}>
                    <span style={{ fontSize:28,display:"block",marginBottom:14 }}>{item.icon}</span>
                    <h4 className="fd" style={{ fontSize:20,fontWeight:600,marginBottom:8 }}>{item.title}</h4>
                    <p style={{ fontSize:13,color:"#a8a29e",lineHeight:1.6 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Success rate */}
            <div style={{
              position:"relative",borderRadius:24,overflow:"hidden",
              background:"rgba(202,138,4,.05)",
              border:"1px solid rgba(202,138,4,.22)",
              padding:"48px 40px",
            }}>
              <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 80% 50%,rgba(202,138,4,.12) 0%,transparent 65%)",pointerEvents:"none" }} />
              <span className="tag" style={{ marginBottom:18,display:"inline-block" }}>Track Record</span>
              <h3 className="fd" style={{ fontSize:28,fontWeight:600,marginBottom:10 }}>Success Rate</h3>
              <p style={{ color:"#a8a29e",fontSize:14,marginBottom:24,maxWidth:440 }}>
                You can rest assured your application is in safe hands. Thousands of approvals and counting.
              </p>
              <p className="fd" style={{ fontSize:80,fontWeight:700,lineHeight:1,color:"#eab308",letterSpacing:"-0.03em" }}>
                <CountUp target={98.7} suffix="%" />
              </p>
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div style={{ position:"sticky",top:32,height:"fit-content",display:"flex",flexDirection:"column",gap:16 }}>

            {/* Pricing */}
            <div style={{ position:"relative",overflow:"hidden",background:"rgba(255,255,255,.035)",border:"1px solid rgba(202,138,4,.20)",borderRadius:20,padding:28 }}>
              <div style={{ position:"absolute",top:-32,right:-32,width:120,height:120,borderRadius:"50%",background:"radial-gradient(circle,rgba(202,138,4,.15) 0%,transparent 70%)",filter:"blur(20px)",pointerEvents:"none" }} />

              <span className="tag" style={{ marginBottom:16,display:"inline-block" }}>Limited Offer</span>
              <h3 className="fd" style={{ fontSize:20,fontWeight:600,marginBottom:4 }}>Visa Application Help</h3>
              <p style={{ fontSize:12,color:"#57534e",marginBottom:24 }}>1–2 months end-to-end support</p>

              <div style={{ borderTop:"1px solid rgba(202,138,4,.10)",paddingTop:20,marginBottom:16 }}>
                <label style={{ fontSize:11,textTransform:"uppercase",letterSpacing:".12em",color:"#57534e",display:"block",marginBottom:4 }}>Currency</label>
                <select className="field">
                  <option>INR — Indian Rupee</option>
                  <option>USD — US Dollar</option>
                </select>
              </div>

              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:11,textTransform:"uppercase",letterSpacing:".12em",color:"#57534e",display:"block",marginBottom:4 }}>Dependents</label>
                <input type="number" min={0} max={5} value={dependents} className="field"
                  onChange={e => setDependents(Math.max(0,parseInt(e.target.value)||0))} />
                {dependents>0 && <p style={{ fontSize:11,color:"#eab308",marginTop:5 }}>+₹{(dependents*3500).toLocaleString()} for {dependents} dependent{dependents>1?"s":""}</p>}
              </div>

              <div style={{ marginBottom:24 }}>
                <label style={{ fontSize:11,textTransform:"uppercase",letterSpacing:".12em",color:"#57534e",display:"block",marginBottom:4 }}>Mock Interviews</label>
                <input type="number" min={1} max={5} value={mocks} className="field"
                  onChange={e => setMocks(Math.max(1,parseInt(e.target.value)||1))} />
                {mocks>1 && <p style={{ fontSize:11,color:"#eab308",marginTop:5 }}>+₹{((mocks-1)*2500).toLocaleString()} for {mocks-1} additional mock{mocks>2?"s":""}</p>}
              </div>

              <div style={{ borderTop:"1px solid rgba(202,138,4,.10)",paddingTop:20,marginBottom:24 }}>
                <p style={{ fontSize:13,color:"#44403c",textDecoration:"line-through",marginBottom:4 }}>₹{(original+addon).toLocaleString()}</p>
                <p className="fd" style={{ fontSize:38,fontWeight:700,color:"#eab308",lineHeight:1 }}>₹{(base+addon).toLocaleString()}</p>
                <p style={{ fontSize:11,color:"#57534e",marginTop:6 }}>Save ₹{(original-base).toLocaleString()} today</p>
              </div>

              <button className="btn-gold aglow" style={{ width:"100%",borderRadius:12 }}>Log In to Pay</button>
            </div>

            {/* Chat */}
            <div style={{ background:"rgba(255,255,255,.035)",border:"1px solid rgba(202,138,4,.14)",borderRadius:20,padding:"24px",textAlign:"center" }}>
              <span style={{ fontSize:30,display:"block",marginBottom:12 }}>💬</span>
              <h4 className="fd" style={{ fontSize:18,fontWeight:600,marginBottom:4 }}>Have Questions?</h4>
              <p style={{ fontSize:12,color:"#57534e",marginBottom:18 }}>Our advisors are available 24/7</p>
              <button className="btn-outline">Message Now</button>
            </div>

            {/* Trust badge */}
            <div style={{ background:"rgba(202,138,4,.05)",border:"1px solid rgba(202,138,4,.18)",borderRadius:20,padding:"22px 24px" }}>
              <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:14 }}>
                <span style={{ fontSize:24 }}>🛡️</span>
                <div>
                  <h4 className="fd" style={{ fontSize:16,fontWeight:600 }}>100% Refund Policy</h4>
                  <p style={{ fontSize:11,color:"#57534e" }}>If visa is rejected due to our error</p>
                </div>
              </div>
              <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                {["No hidden charges","Transparent process","Expert counsellors only"].map((t,i) => (
                  <div key={i} style={{ display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#a8a29e" }}>
                    <span style={{ color:"#eab308",fontSize:14 }}>✦</span>{t}
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