"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import BookCounsellingModal from "@/components/shared/BookCounsellingModal";

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
      <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-yellow-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      {/* badges */}
      {service.badge === "fire" && (
        <span className="absolute top-0 right-0 text-[10px] font-black tracking-wider uppercase bg-orange-600 text-white px-2.5 py-1 rounded-tr-2xl rounded-bl-xl">
          🔥 On Fire
        </span>
      )}
      {service.badge === "popular" && (
        <span className="absolute top-0 right-0 text-[10px] font-black tracking-wider uppercase bg-green-600 text-white px-2.5 py-1 rounded-tr-2xl rounded-bl-xl">
          Popular
        </span>
      )}

      <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 flex items-center justify-center text-lg flex-shrink-0">
        {service.icon}
      </div>

      <h3 className="font-bold text-[15px] leading-snug text-white group-hover:text-[#d4af37] transition-colors duration-200">
        {service.title}
      </h3>

      <p className="text-white/50 text-[13px] leading-relaxed flex-1">
        {service.description}
      </p>

      {isCounselling ? (
        <span className="self-end text-xs font-bold text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/20 px-3 py-1 rounded-full transition-all duration-200 shadow-sm shadow-[#d4af37]/10">
          Book Now →
        </span>
      ) : (
        <span className="self-end text-[#d4af37] text-lg opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
          →
        </span>
      )}
    </>
  );

  if (isCounselling) {
    return (
      <button
        id="book-counselling-btn"
        onClick={onCounsellingClick}
        className="group relative flex flex-col gap-3 p-5 rounded-2xl border border-[#d4af37]/20 bg-gradient-to-br from-[#0f0f0f] to-[#1a1200] hover:border-[#d4af37]/50 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(212,175,55,0.15)] transition-all duration-200 overflow-hidden text-left w-full"
        style={{ animationDelay: `${index * 35}ms` }}
      >
        {inner}
      </button>
    );
  }

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative flex flex-col gap-3 p-5 rounded-2xl border border-white/[0.08] bg-[#0f0f0f] hover:border-[#d4af37]/30 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)] transition-all duration-200 overflow-hidden"
      style={{ animationDelay: `${index * 35}ms` }}
    >
      {inner}
    </Link>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  const [query, setQuery] = useState("");
  const [showCounsellingModal, setShowCounsellingModal] = useState(false);
  const contactPhone = process.env.NEXT_PUBLIC_WTSP_PHONE || "919967716945";
  const [form, setForm] = useState({ name: "", email: "", mobile: "", service: "" });
  const [submitted, setSubmitted] = useState<boolean>(false);

  const filtered = services.filter(
    (s) =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.description.toLowerCase().includes(query.toLowerCase())
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#000000] text-white overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative px-4 sm:px-8 md:px-14 lg:px-20 pt-14 pb-12 border-b border-white/[0.08] overflow-hidden">
        {/* radial glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[420px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(245,197,24,0.12)_0%,transparent_70%)]" />

        {/* badge */}
        <div className="inline-flex items-center gap-2 mb-6 bg-[#d4af37]/[0.08] border border-[#d4af37]/25 rounded-full px-4 py-1.5">
          <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
          <span className="text-[#d4af37] text-xs font-semibold tracking-widest uppercase">Our Services</span>
        </div>

        {/* heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-black leading-[1.04] tracking-tight mb-8 max-w-3xl">
          SERVICES
        </h1>

        {/* body */}
        <div className="max-w-3xl space-y-3.5">
          <p className="text-white/55 text-sm sm:text-[15px] leading-relaxed">
            Having worked with students from over{" "}
            <strong className="text-white font-semibold">55 countries</strong> and interviewed a range of professors from various fields, I know exactly what the admissions committee likes to see in their applicants. Now, you can use my secrets to cracking the admissions process and implement it in your applications. Remember, forbids any tie-ups with universities for your protection. The services listed are offered for{" "}
            <strong className="text-white font-semibold">Bachelor&apos;s, Master&apos;s (MS, MBA, Finance, Economics, Pharma, Dentistry, etc.), and PhD</strong> applicants.
          </p>
          <p className="text-white/55 text-sm sm:text-[15px] leading-relaxed">
            We support applications to most countries including but not limited to{" "}
            <strong className="text-white font-semibold">USA, Canada, Germany, Ireland, UK, Australia, India, and Singapore.</strong>
          </p>
          <p className="text-[#d4af37] text-sm font-medium pt-1">
            ✦ To see the charges, you can click on the service, select the currency and other relevant options (if any). Crypto payments now accepted!
          </p>
        </div>

        {/* chat strip */}
        <div className="mt-8 inline-flex flex-wrap items-center gap-4 bg-[#0f0f0f] border border-white/[0.08] rounded-xl px-5 py-3.5">
          <span className="text-white/45 text-sm">To reach our sales team</span>
          <a
            href={`https://wa.me/${contactPhone}?text=${encodeURIComponent(`I am interested in the your services service. Specifically, I would like to discuss...`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#d4af37] text-black font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-yellow-500 active:scale-95 transition-all text-center"
          >
            <ChatIcon className="w-4 h-4" />
            Chat Now →
          </a>
        </div>
      </section>

      {/* ── SEARCH + GRID ────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-8 md:px-14 lg:px-20 py-10">
        {/* Search */}
        <div className="relative max-w-md mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a service…"
            className="w-full bg-[#0f0f0f] border border-white/[0.08] rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37]/40 transition-colors"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#d4af37]" aria-label="Search">
            <SearchIcon className="w-5 h-5" />
          </button>
        </div>

        <p className="text-white/25 text-xs mb-7 tracking-wide">
          {filtered.length} service{filtered.length !== 1 ? "s" : ""} found
        </p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((service, i) => (
              <ServiceCard
                key={service.slug}
                service={service}
                index={i}
                onCounsellingClick={() => setShowCounsellingModal(true)}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center text-white/30 text-sm">
            No services found for &ldquo;{query}&rdquo;
          </div>
        )}
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-8 md:px-14 lg:px-20 py-4">
        <div className="relative overflow-hidden rounded-2xl border border-[#d4af37]/20 bg-gradient-to-br from-[#1a1500] to-[#111] px-6 py-12 sm:px-14 flex flex-col items-center text-center gap-5">
          <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-48 rounded-full bg-[radial-gradient(ellipse,rgba(245,197,24,0.13),transparent_70%)]" />
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Questions? Start a chat with us.</h2>
          <p className="text-white/45 text-sm sm:text-base max-w-sm">
            We&apos;re here to help you navigate your study, work, or immigration journey.
          </p>
          <a
            href={`https://wa.me/${contactPhone}?text=${encodeURIComponent(`I am interested in the your services service. Specifically, I would like to discuss...`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#d4af37] text-black font-bold text-sm sm:text-base px-7 py-3 rounded-xl hover:bg-yellow-500 active:scale-95 transition-all text-center"
          >
            <ChatIcon className="w-4 h-4" />
            Chat Now →
          </a>
        </div>
      </div>

      {/* ── SERVICE REQUEST ───────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-8 md:px-14 lg:px-20 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 mb-4 bg-[#d4af37]/[0.08] border border-[#d4af37]/20 rounded-full px-3 py-1">
              <span className="text-[#d4af37] text-xs font-semibold tracking-widest uppercase">Custom Request</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">Service Request</h2>
            <p className="text-white/45 text-sm sm:text-[15px] leading-relaxed mb-8">
              Tell us what you need. If it&apos;s not listed, we&apos;ll do our best to create a solution just for you. Use the form for custom services.
            </p>
            {/* Illustration */}
            <div className="bg-[#0f0f0f] border border-white/[0.08] rounded-2xl p-6 flex flex-col gap-3">
              <div className="flex gap-3">
                <div className="h-8 flex-1 rounded-lg bg-[#1e1e1e] border border-white/[0.06]" />
                <div className="h-8 flex-1 rounded-lg bg-[#1e1e1e] border border-white/[0.06]" />
              </div>
              <div className="h-8 rounded-lg bg-[#1e1e1e] border border-white/[0.06]" />
              <div className="h-8 rounded-lg bg-[#1e1e1e] border border-white/[0.06]" />
              <div className="h-16 rounded-lg bg-[#1e1e1e] border border-white/[0.06]" />
              <div className="h-10 rounded-lg bg-[#d4af37] flex items-center justify-center text-black text-xs font-black tracking-widest">
                SUBMIT →
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-[#0f0f0f] border border-white/[0.08] rounded-2xl p-6 sm:p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-3xl">✅</div>
                <h3 className="text-xl font-black">Request Submitted!</h3>
                <p className="text-white/45 text-sm max-w-xs">Thanks! Our team will get back to you shortly with the best solution.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-[#d4af37] text-sm underline underline-offset-2 hover:text-yellow-300"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl sm:text-2xl font-black mb-1">How can we help you?</h3>
                <p className="text-white/35 text-xs sm:text-sm mb-6 leading-relaxed">
                  Tell us what you need. If it&apos;s not listed, we&apos;ll do our best to create a solution just for you.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {[
                    { label: "Name", name: "name", type: "text", placeholder: "Full Name" },
                    { label: "Email ID", name: "email", type: "email", placeholder: "Email" },
                    { label: "Mobile", name: "mobile", type: "tel", placeholder: "Mobile with country code" },
                  ].map((field) => (
                    <div key={field.name} className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-white/55 tracking-wide">{field.label}</label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={form[field.name as keyof typeof form]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required={field.name !== "mobile"}
                        className="bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#d4af37]/40 transition-colors"
                      />
                    </div>
                  ))}

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-white/55 tracking-wide">Service Required</label>
                    <textarea
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      placeholder="What do you need help with? Please be as descriptive as possible and provide time or any other constraints that you may have."
                      required
                      rows={4}
                      className="bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#d4af37]/40 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-1 w-full bg-[#d4af37] text-black font-black text-sm sm:text-base py-3.5 rounded-xl hover:bg-yellow-500 active:scale-[0.98] transition-all"
                  >
                    Submit
                  </button>
                </form>
              </>
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