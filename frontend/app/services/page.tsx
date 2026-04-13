"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import BookCounsellingModal from "@/components/shared/BookCounsellingModal";
import { getUser } from "@/app/lib/token";

// ─── Types ───────────────────────────────────────────────────────────────────

type Badge = "fire" | "popular" | null;

interface Service {
  slug: string;
  title: string;
  description: string;
  icon: string;
  badge: Badge;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const services: Service[] = [
  { slug: "counselling", title: "Counselling Session", description: "Google Meet session with our counsellors. Get transparency on your case for study/work overseas. Charges fully adjustable in services' pricing.", icon: "🎯", badge: "fire" },
  { slug: "research-papers", title: "Research Paper Drafting & Publishing Help", description: "Publishing credible research papers with your name on them can help boost your profile! Extremely crucial for MS/PhD and O-1/EB-1 visa applicants.", icon: "📄", badge: "fire" },
  { slug: "visa-application-help", title: "Visa Application Help", description: "Ace the visa application through our help in the paperwork, financial planning, and visa interview mock rounds. Applicable for USA, Canada, UK, Germany, and more.", icon: "🛂", badge: null },
  { slug: "eb1", title: "Apply For An EB-1 Visa", description: "The EB-1 visa is a talent-based immigrant visa in the US for individuals with extraordinary ability in their field.", icon: "🌟", badge: "fire" },
  { slug: "application-help", title: "Complete Application Help", description: "Get your application into the top 10% of the applications the committee evaluates for admission.", icon: "📋", badge: "popular" },
  { slug: "shortlisting", title: "Profile Evaluation & University Shortlisting", description: "Use our pruning strategy to get admits from the best universities your profile can get you into without wasting money.", icon: "🏛️", badge: null },
  { slug: "sop", title: "Statement of Purpose/Essay Writing", description: "Ivy league graduates work FROM SCRATCH or with your existing draft, zero plagiarism, and unlimited changes - free of charge.", icon: "✍️", badge: null },
  { slug: "o1", title: "Apply For An O-1 Visa", description: "The O-1 visa is a talent-based non-immigrant work visa in the US for individuals with extraordinary ability in their field.", icon: "🏆", badge: null },
  { slug: "visa_mock_interview", title: "US Visa Mock Interview", description: "The final step to your US visa is a Visa interview with an officer from the US consulate. Ace the interview with proven tricks and techniques.", icon: "🎤", badge: null },
  { slug: "letter-of-recommendation-drafting", title: "Letter of Recommendation Drafting", description: "Little known is the art of writing exactly what the admissions committee wants to see in an applicant. This can be more impacting than your SOP if done right.", icon: "📝", badge: null },
  { slug: "personal-history-statement", title: "Personal History Statement", description: "The Personal History Statement reflects your ability to connect the barriers you have overcome in the past to your current interest in the program.", icon: "📖", badge: null },
  { slug: "resume-drafting", title: "Resume Drafting", description: "Learn the secret to a perfect resume that will truly set you apart from any other applicant that you compete with.", icon: "🗂️", badge: null },
  { slug: "gre-prep", title: "GRE Prep-Plan Building", description: "The secret to an excellent GRE score is NOT hard work. I scored a 329/340 and helped thousands do the same. Are you next? (Day-by-day schedule)", icon: "📊", badge: null },
  { slug: "university-finalization", title: "University Finalization Help", description: "Have some of your admits in hand and need help with finalizing on one? Get a detailed review of the right pick as per your circumstances.", icon: "🎓", badge: null },
  { slug: "plagiarism-check", title: "Plagiarism Check Report", description: "Use our best-in-class instructor-level Turnitin reporting software to generate reports for your drafts. Can be used on SOPs, LORs, research papers, and even assignments.", icon: "🔍", badge: null },
  { slug: "scholarship", title: "Scholarship Application Help", description: "Over 60% of our applicants get a scholarship/fellowship before they step into their university. Now, you can get one too.", icon: "💰", badge: null },
  { slug: "toefl", title: "TOEFL Prep-Plan Building/Coaching Session", description: "TOEFL scores are your gateway to financial aid and teaching assistantships. Learn how I scored a 119/120 and YOU can too.", icon: "🗣️", badge: null },
  { slug: "canada-sop", title: "Canada Visa SOP/Letter of Explanation", description: "Over 1000 students have been issued study permits with us. With our expertise in the most common reasons for rejection, we can help you ensure success.", icon: "🍁", badge: null },
  { slug: "profile-building", title: "Profile Building Guidance", description: "Have more than 3 months of time for your applications? Join us for one-on-one mentorship on profile boosting in customized sessions.", icon: "📈", badge: null },
  { slug: "cover-letter", title: "Cover Letter Drafting", description: "Command the attention of top recruiters with a cover letter that makes lasting impressions.", icon: "✉️", badge: null },
  { slug: "linkedin", title: "LinkedIn Profile Boosting", description: "Revamp your LinkedIn profile from 0 to 99. The outcomes include better admits, job opportunities, placements, and a bigger network.", icon: "💡", badge: null },
  { slug: "express-entry", title: "Express Entry/PNP Help", description: "Canada Permanent Residence (PR) via the Express Entry route. Get your applications filed via experts who have changed lives of hundreds of applicants already.", icon: "🍁", badge: null },
  { slug: "review", title: "Complete Application Review", description: "Now, sail through your applications with our expertise and ensure success with in-depth reviews and brainstorming.", icon: "🔎", badge: null },
  { slug: "global-talent", title: "Apply for Global Talent Visa", description: "The UK Global Talent Visa (GTV) is a UK immigration visa for exceptional leaders or potential leaders in the digital technology sector, academia and research, or in arts and culture.", icon: "🇬🇧", badge: null },
  { slug: "portfolio", title: "Portfolio Building & Management", description: "Highlight the best parts of your profile and shine to employers, universities, and clients worldwide with an online portfolio, managed for you all year round.", icon: "🎨", badge: null },
  { slug: "australia-visa", title: "Apply for Australia National Innovation Visa", description: "Highlight your extraordinary abilities and take the next step in your professional journey.", icon: "🦘", badge: null },
  { slug: "singapore-pass", title: "Apply for Singapore ONE Pass", description: "The ONE Pass is Singapore's talent visa for top achievers in business, arts, sports, academia, and research.", icon: "🦁", badge: null },
  { slug: "eb2", title: "Apply for an EB-2 NIW Visa", description: "The EB-2 NIW visa is a talent-based immigrant visa in the U.S. for individuals with exceptional ability in their field.", icon: "⭐", badge: null },
];
// ─── Icons ───────────────────────────────────────────────────────────────────

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ServiceCard({
  service,
  index,
  onCounsellingClick,
}: {
  service: Service;
  index: number;
  onCounsellingClick: () => void;
}) {
  const isCounselling = service.slug === "counselling";

  const inner = (
    <>
      {/* top accent */}
      <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#D4A848] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      {/* badges */}
      {service.badge === "fire" && (
        <span className="absolute top-0 right-0 text-[8px] sm:text-[10px] font-black tracking-wider uppercase bg-[#D4A848] text-[#40332D] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-tr-2xl rounded-bl-xl">
          🔥 On Fire
        </span>
      )}
      {service.badge === "popular" && (
        <span className="absolute top-0 right-0 text-[8px] sm:text-[10px] font-black tracking-wider uppercase bg-[#C0A045] text-[#40332D] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-tr-2xl rounded-bl-xl">
          Popular
        </span>
      )}

      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#D4A848]/10 flex items-center justify-center text-base sm:text-lg flex-shrink-0">
        {service.icon}
      </div>

      <h3 className="font-bold text-[12px] sm:text-[15px] leading-tight text-[#D4A848] group-hover:text-white transition-colors duration-200">
        {service.title}
      </h3>

      <p className="text-[#FDFBF7]/60 text-[10px] sm:text-[13px] leading-relaxed flex-1">
        {service.description}
      </p>

      {isCounselling ? (
        <span className="self-end text-xs font-bold text-[#D4A848] bg-[#D4A848]/10 border border-[#D4A848]/20 px-3 py-1 rounded-full transition-all duration-200 shadow-sm shadow-[#D4A848]/10">
          Book Now →
        </span>
      ) : (
        <span className="self-end text-[#D4A848] text-lg opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
          →
        </span>
      )}
    </>
  );

  if (isCounselling) {
    return (
      <motion.button
        id="book-counselling-btn"
        onClick={onCounsellingClick}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05, duration: 0.5 }}
        className="group relative flex flex-col gap-3 p-3.5 sm:p-5 rounded-2xl border border-[#D4A848]/20 bg-[#40332D] hover:border-[#D4A848]/50 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 overflow-hidden text-left w-full"
      >
        {inner}
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
    >
      <Link
        href={`/services/${service.slug}`}
        className="group relative flex flex-col gap-3 p-3.5 sm:p-5 rounded-2xl border border-[#D4A848]/10 bg-[#40332D] hover:border-[#D4A848]/40 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 overflow-hidden block h-full"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {inner}
      </Link>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  const [query, setQuery] = useState("");
  const [showCounsellingModal, setShowCounsellingModal] = useState(false);
  const contactPhone = process.env.NEXT_PUBLIC_WTSP_PHONE || "919619901999";
  const [form, setForm] = useState({ name: "", email: "", mobile: "", message: "" });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "failed">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  
  // Pre-fill name/email from logged-in user
  useEffect(() => {
    const user = getUser();
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        mobile: user.mobile || prev.mobile || "",
      }));
    }
  }, []);

  const filtered = services.filter(
    (s) =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.description.toLowerCase().includes(query.toLowerCase())
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("loading");
    setErrorMessage("");
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setSubmitted(true);
        setStatus("success");
        setForm({ name: "", email: "", mobile: "", message: "" });
      } else {
        setStatus("failed");
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Failed to send request.");
        setTimeout(() => {
          setStatus("idle");
          setErrorMessage("");
        }, 5000);
      }
    } catch (error) {
      console.error("Enquiry error:", error);
      setStatus("failed");
      setErrorMessage("Service currently unavailable. Please try again later.");
      setTimeout(() => {
        setStatus("idle");
        setErrorMessage("");
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <main className="min-h-screen bg-[#FFFFFF] text-[#675F5B] font-base selection:bg-[#D4A848]/20 overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-8 md:px-14 lg:px-20 pt-14 pb-12 border-b border-white/10 overflow-hidden">
        {/* radial glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[420px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(245,197,24,0.12)_0%,transparent_70%)]" />

        {/* badge */}
        <div className="inline-flex items-center gap-2 mb-6 bg-[#D4A848]/[0.08] border border-[#D4A848]/25 rounded-full px-4 py-1.5">
          <span className="w-2 h-2 rounded-full bg-[#D4A848] animate-pulse" />
          <span className="text-[#D4A848] text-xs font-semibold tracking-widest uppercase">Our Services</span>
        </div>

        {/* heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl sm:text-5xl lg:text-[64px] font-black leading-[1.04] tracking-tight mb-8 max-w-3xl text-[#362B25] uppercase"
        >
          SERVICES
        </motion.h1>

        {/* body */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="max-w-3xl space-y-3.5"
        >
          <p className="text-[#675F5B]/70 text-sm sm:text-[15px] leading-relaxed">
            Having worked with students from over{" "}
            <strong className="text-[#362B25] font-semibold">55 countries</strong> and interviewed a range of professors from various fields, I know exactly what the admissions committee likes to see in their applicants. Now, you can use my secrets to cracking the admissions process and implement it in your applications. Remember, forbids any tie-ups with universities for your protection. The services listed are offered for{" "}
            <strong className="text-[#362B25] font-semibold">Bachelor&apos;s, Master&apos;s (MS, MBA, Finance, Economics, Pharma, Dentistry, etc.), and PhD</strong> applicants.
          </p>
          <p className="text-[#675F5B]/70 text-sm sm:text-[15px] leading-relaxed">
            We support applications to most countries including but not limited to{" "}
            <strong className="text-[#362B25] font-semibold">USA, Canada, Germany, Ireland, UK, Australia, India, and Singapore.</strong>
          </p>
          <p className="text-[#D4A848] text-sm font-medium pt-1">
            ✦ To see the charges, you can click on the service, select the currency and other relevant options (if any). Crypto payments now accepted!
          </p>
        </motion.div>

        {/* chat strip */}
        <div className="mt-8 inline-flex flex-wrap items-center gap-4 bg-[#D4A848]/10 border border-[#D4A848]/20 rounded-xl px-5 py-3.5 shadow-sm">
          <span className="text-[#675F5B]/80 font-medium text-sm">To reach our sales team</span>
          <a
            href={`https://wa.me/${contactPhone}?text=${encodeURIComponent(`I am interested in the your services service. Specifically, I would like to discuss...`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#D4A848] text-[#40332D] font-black text-sm px-5 py-2.5 rounded-lg hover:bg-white active:scale-95 transition-all text-center border border-[#D4A848]/20 shadow-md"
          >
            <ChatIcon className="w-4 h-4" />
            Chat Now →
          </a>
        </div>
      </section>

      {/* ── SEARCH + GRID ────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-8 md:px-14 lg:px-20 py-10 bg-[#F8F6F1] border-y border-[#D4A848]/10 relative z-10">
        {/* Search */}
        <div className="relative max-w-md mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a service…"
            className="w-full bg-white border border-[#D4A848]/20 rounded-2xl px-5 py-3.5 pr-11 text-sm text-[#362B25] font-medium placeholder-[#675F5B]/50 focus:outline-none focus:border-[#D4A848] focus:ring-1 focus:ring-[#D4A848]/50 transition-all shadow-md"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4A848] hover:scale-110 transition-transform" aria-label="Search">
            <SearchIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="max-w-screen-2xl mx-auto">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
              <AnimatePresence>
                {filtered.map((service, i) => (
                  <ServiceCard
                    key={service.slug}
                    service={service}
                    index={i}
                    onCounsellingClick={() => setShowCounsellingModal(true)}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="py-24 text-center text-[#362B25]/50 text-sm">
              No services found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      </section>

      {/* ── HORIZONTAL CHAT BANNER ────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-8 md:px-14 lg:px-20 py-6 sm:py-8 bg-white border-b border-[#D4A848]/10">
        <div className="relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-[#40332D] p-5 sm:p-10 shadow-2xl border border-[#D4A848]/20 flex flex-col md:flex-row items-center justify-between gap-5 md:gap-8 group transition-all hover:border-[#D4A848]/40">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,168,72,0.1),transparent_50%)]" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#D4A848]/10 flex items-center justify-center text-2xl sm:text-3xl shadow-inner border border-[#D4A848]/10 animate-float">
              💬
            </div>
            <div className="space-y-1">
              <h2 className="text-base sm:text-2xl font-black text-[#D4A848] uppercase tracking-normal">Questions? Start a chat with us.</h2>
              <p className="text-[#FDFBF7]/50 text-[10px] sm:text-sm font-medium leading-relaxed">We&apos;re here to help you navigate your study, work, or immigration journey.</p>
            </div>
          </div>

          <div className="relative z-10 shrink-0">
            <a
              href={`https://wa.me/${contactPhone}?text=${encodeURIComponent(`I am interested in your services. I would like to discuss...`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#D4A848] text-[#40332D] font-black text-[10px] sm:text-sm px-6 py-3 sm:px-8 sm:py-4 rounded-xl hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#D4A848]/10 uppercase tracking-widest"
            >
              <ChatIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              Chat on Whatsapp
            </a>
          </div>
        </div>
      </section>

      {/* ── SPACIOUS SERVICE REQUEST FORM ─────────────────────────────────────────── */}
      <section className="px-4 sm:px-8 md:px-14 lg:px-20 py-10 bg-[#F8F6F1] relative overflow-hidden">
        {/* decorative background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4A848]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 mb-2 bg-[#D4A848]/10 px-4 py-1 rounded-full border border-[#D4A848]/20">
              <span className="text-[#D4A848] text-[8px] font-black uppercase tracking-[0.3em]">Custom Solutions</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#362B25] tracking-tight uppercase leading-none mb-3">Request a <span className="text-[#D4A848]">Service</span></h2>
            <p className="text-[#675F5B]/60 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              If our standard offerings don&apos;t fit, tell us what you&apos;re looking for and we&apos;ll craft a unique plan.
            </p>
          </div>

          <div className="bg-white border border-[#D4A848]/20 rounded-[1.5rem] p-6 sm:p-8 shadow-xl">
            {submitted ? (
              <div className="py-8 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#D4A848]/10 flex items-center justify-center text-3xl border border-[#D4A848]/20">✨</div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-[#362B25] uppercase tracking-tight">Request Received</h3>
                  <p className="text-[#675F5B]/70 text-xs font-bold uppercase tracking-widest opacity-60">We&apos;ll reach out within 24 hours.</p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-[#D4A848] font-black text-[10px] uppercase tracking-widest border-b border-[#D4A848] pb-0.5 hover:text-[#362B25] hover:border-[#362B25] transition-all"
                >
                  Submit Another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Full Name", name: "name", type: "text", placeholder: "e.g. John Doe", colSpan: "sm:col-span-2" },
                    { label: "Email", name: "email", type: "email", placeholder: "john@example.com", colSpan: "sm:col-span-1" },
                    { label: "Phone", name: "mobile", type: "tel", placeholder: "+91 90000 00000", colSpan: "sm:col-span-1" },
                  ].map((field) => (
                    <div key={field.name} className={`space-y-1 ${field.colSpan}`}>
                      <label className="text-[9px] font-black text-[#675F5B]/50 uppercase tracking-widest ml-1">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={form[field.name as keyof typeof form]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required={field.name !== "mobile"}
                        className="w-full bg-[#F8F6F1]/50 border border-transparent rounded-xl px-4 py-2.5 text-xs text-[#362B25] placeholder-[#362B25]/20 focus:outline-none focus:border-[#D4A848]/30 focus:bg-white transition-all"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-[#675F5B]/50 uppercase tracking-widest ml-1">
                    What can we do for you?
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Briefly describe your requirements..."
                    required
                    rows={3}
                    className="w-full bg-[#F8F6F1]/50 border border-transparent rounded-xl px-4 py-2.5 text-xs text-[#362B25] placeholder-[#362B25]/20 focus:outline-none focus:border-[#D4A848]/30 focus:bg-white transition-all resize-none"
                  />
                </div>

                {errorMessage && (
                  <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-widest animate-pulse">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full ${status === "failed" ? "bg-red-600 shadow-red-500/20" : "bg-[#362B25]"} text-white font-black text-xs py-3.5 rounded-xl hover:bg-[#D4A848] hover:text-[#362B25] shadow-lg transition-all uppercase tracking-[0.2em] relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className="relative z-10">
                    {isSubmitting ? "Sending Request..." : status === "failed" ? "Failed! Try Again" : "Send Request →"}
                  </span>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Book Counselling Modal ──────────────────────────────────────── */}
      <BookCounsellingModal
        isOpen={showCounsellingModal}
        onClose={() => setShowCounsellingModal(false)}
      />
    </main>
  );
}