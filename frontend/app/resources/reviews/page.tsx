"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, ChevronDown, X, MessageSquare } from "lucide-react";
import { getUser } from "@/app/lib/token";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

const SERVICES = [
  "Initial Counseling Session",
  "Profile Evaluation & University Shortlisting",
  "Statement of Purpose / Essay Writing",
  "Letter of Recommendation Drafting",
  "Personal History Statement Drafting",
  "Premium Resume Drafting",
  "Complete Application Help",
  "Visa Application Help",
  "US Visa Mock Interview",
  "Scholarship Application Help",
  "LinkedIn Profile Boosting",
  "Research Paper Drafting & Publishing Help",
  "Cover Letter Writing",
  "GRE Preparation",
  "TOEFL Preparation",
  "Singapore Pass Application",
  "EB-2 NIW Application",
];

interface Review {
  _id: string;
  name: string;
  service: string;
  rating: number;
  title?: string;
  body: string;
  isVerified: boolean;
  createdAt: string;
}

function StarRating({
  value,
  onChange,
  readonly = false,
  size = 20,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: number;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type={readonly ? "button" : "button"}
          disabled={readonly}
          onClick={() => !readonly && onChange?.(s)}
          onMouseEnter={() => !readonly && setHovered(s)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={readonly ? "cursor-default" : "cursor-pointer"}
        >
          <Star
            size={size}
            className="transition-colors"
            fill={(hovered || value) >= s ? "#C5A059" : "none"}
            stroke={(hovered || value) >= s ? "#C5A059" : "#D4C5B0"}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const initials = review.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const date = new Date(review.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-[rgba(197,160,89,0.15)] rounded-2xl p-7 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-[rgba(197,160,89,0.35)] transition-all duration-300"
    >
      {/* Top row: avatar + name + rating */}
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-[#2D2926] text-[#C5A059] font-black text-sm flex items-center justify-center flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="font-bold text-[#2D2926] text-sm truncate">{review.name}</span>
            {review.isVerified && (
              <span className="text-[13px] font-bold font-bold text-[#C5A059] border border-[rgba(197,160,89,0.3)] px-2 py-0.5 rounded-md uppercase tracking-widest flex-shrink-0">
                Verified
              </span>
            )}
          </div>
          <StarRating value={review.rating} readonly size={14} />
        </div>
      </div>

      {/* Service badge */}
      <span className="self-start text-[13px] font-bold font-bold uppercase tracking-widest bg-[#F8F5F0] text-[#6B5E51] px-3 py-1 rounded-full border border-[#EDE8DF]">
        {review.service}
      </span>

      {/* Title + Body */}
      {review.title && (
        <p className="font-bold text-[#2D2926] text-sm">{review.title}</p>
      )}
      <p className="text-sm text-[#6B5E51] leading-relaxed">{review.body}</p>

      {/* Date */}
      <p className="text-[14px] font-bold text-[#A8A29E] font-medium mt-auto">{date}</p>
    </motion.div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [filterServices, setFilterServices] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    service: "",
    rating: 0,
    title: "",
    body: "",
  });
  const [formError, setFormError] = useState("");

  // Pre-fill name/email from logged-in user
  useEffect(() => {
    const user = getUser();
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, []);

  const fetchReviews = useCallback(async (service: string, p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: "12" });
      if (service !== "all") params.append("service", service);
      const res = await fetch(`${API}/api/reviews?${params}`);
      const data = await res.json();
      if (p === 1) {
        setReviews(data.reviews || []);
      } else {
        setReviews((prev) => [...prev, ...(data.reviews || [])]);
      }
      setTotal(data.total || 0);
      // Build filter list from stats
      if (data.stats) {
        const svcs = (data.stats as { _id: string }[]).map((s) => s._id).filter(Boolean);
        setFilterServices(svcs);
      }
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchReviews(activeFilter, 1);
  }, [activeFilter, fetchReviews]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchReviews(activeFilter, next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.name || !form.service || !form.rating || !form.body) {
      setFormError("Please fill in all required fields and select a rating.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitSuccess(true);
      setForm({ name: "", email: "", service: "", rating: 0, title: "", body: "" });
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowForm(false);
        fetchReviews("all", 1);
        setActiveFilter("all");
      }, 2500);
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const filterTabs = [
    { label: "All Reviews", value: "all" },
    ...filterServices.map((s) => ({ label: s, value: s })),
  ];

  return (
    <main
      className="min-h-screen pb-32"
      style={{ background: "#FDFBF7", color: "#2D2926", fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .fd { font-family: 'Cormorant Garamond', serif; }
        .gold-shimmer {
          background: linear-gradient(90deg,#C5A059,#E6D5B8,#C5A059,#D4AF37,#C5A059);
          background-size: 300% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; animation: shimmer 4s linear infinite;
        }
        @keyframes shimmer {
          0%{background-position:-200% center} 100%{background-position:200% center}
        }
        .filter-scroll::-webkit-scrollbar { display: none; }
        .filter-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        select option { color: #2D2926; background: #fff; }
      `}</style>

      {/* ── HERO ── */}
      <section
        className="relative px-6 pt-24 pb-12 text-center overflow-hidden"
        style={{ background: "linear-gradient(180deg,rgba(197,160,89,0.08) 0%,transparent 100%)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto space-y-5"
        >
          <span className="inline-block px-5 py-1.5 rounded-full border border-[rgba(197,160,89,0.3)] text-[#C5A059] font-bold text-[14px] font-bold tracking-[0.3em] uppercase">
            Student Voices
          </span>
          <h1 className="fd text-5xl sm:text-6xl md:text-7xl font-bold text-[#2D2926] tracking-tight leading-[0.95]">
            Real <span className="gold-shimmer">Reviews</span>
          </h1>
          <p className="text-[#6B5E51] text-lg font-medium max-w-xl mx-auto leading-relaxed">
            Honest feedback from students who&apos;ve used IEC&apos;s services to achieve their study-abroad dreams.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-[#2D2926] text-[#C5A059] font-bold px-8 py-4 rounded-2xl hover:bg-[#C5A059] hover:text-white transition-all shadow-xl text-sm tracking-widest uppercase"
            >
              <MessageSquare size={16} /> Write a Review
            </button>
            <div className="text-left">
              <p className="text-2xl font-bold text-[#2D2926]">{total}</p>
              <p className="text-[14px] font-bold text-[#A8A29E] uppercase tracking-widest font-bold">Reviews</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── FILTER TABS ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-6 pb-2">
        <div className="flex gap-3 overflow-x-auto filter-scroll pb-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`whitespace-nowrap flex-shrink-0 px-5 py-2.5 rounded-xl text-[14px] font-bold font-black uppercase tracking-widest transition-all border ${
                activeFilter === tab.value
                  ? "bg-[#2D2926] text-[#C5A059] border-[#2D2926] shadow-lg"
                  : "bg-white text-[#6B5E51] border-[rgba(197,160,89,0.2)] hover:border-[#C5A059]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── REVIEWS GRID ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        {loading && reviews.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-56 animate-pulse border border-[rgba(197,160,89,0.1)]" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[#A8A29E] font-medium text-lg">No reviews yet for this service.</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-6 bg-[#C5A059] text-white font-bold px-8 py-3 rounded-xl text-sm tracking-widest uppercase hover:bg-[#2D2926] transition-all"
            >
              Be the first to review
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((r) => (
                <ReviewCard key={r._id} review={r} />
              ))}
            </div>

            {reviews.length < total && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="flex items-center gap-2 border border-[rgba(197,160,89,0.3)] text-[#6B5E51] font-bold px-8 py-3 rounded-xl text-sm tracking-widest uppercase hover:border-[#C5A059] hover:text-[#C5A059] transition-all"
                >
                  {loading ? "Loading..." : (<><ChevronDown size={16} /> Load More</>)}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ── REVIEW FORM MODAL ── */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="absolute inset-0 bg-[#2D2926]/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[#FDFBF7] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              {/* Modal Header */}
              <div className="bg-[#2D2926] px-8 py-7 relative">
                <button
                  onClick={() => setShowForm(false)}
                  className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
                <p className="text-[14px] font-bold font-black uppercase tracking-[0.3em] text-[#C5A059] mb-1">Share Your Experience</p>
                <h2 className="fd text-3xl font-bold text-white leading-tight">Write a Review</h2>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">

                {submitSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10 space-y-3"
                  >
                    <div className="text-5xl">🎉</div>
                    <p className="fd text-2xl font-bold text-[#2D2926]">Thank You!</p>
                    <p className="text-[#6B5E51] text-sm">Your review has been submitted successfully.</p>
                  </motion.div>
                ) : (
                  <>
                    {/* Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[14px] font-bold font-black uppercase tracking-widest text-[#C5A059]">
                          Your Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="e.g. Arjun Sharma"
                          className="w-full bg-white border border-[rgba(197,160,89,0.2)] focus:border-[#C5A059] outline-none rounded-xl px-4 py-3 text-sm font-medium placeholder:text-[#A8A29E] transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[14px] font-bold font-black uppercase tracking-widest text-[#C5A059]">
                          Email <span className="text-[#A8A29E]">(optional)</span>
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="you@example.com"
                          className="w-full bg-white border border-[rgba(197,160,89,0.2)] focus:border-[#C5A059] outline-none rounded-xl px-4 py-3 text-sm font-medium placeholder:text-[#A8A29E] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Service Selector */}
                    <div className="space-y-1.5">
                      <label className="text-[14px] font-bold font-black uppercase tracking-widest text-[#C5A059]">
                        Service <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={form.service}
                          onChange={(e) => setForm({ ...form, service: e.target.value })}
                          className="w-full appearance-none bg-white border border-[rgba(197,160,89,0.2)] focus:border-[#C5A059] outline-none rounded-xl px-4 py-3 text-sm font-medium text-[#2D2926] transition-colors pr-10"
                        >
                          <option value="" disabled>Select a service…</option>
                          {SERVICES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A8A29E] pointer-events-none" />
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="space-y-1.5">
                      <label className="text-[14px] font-bold font-black uppercase tracking-widest text-[#C5A059]">
                        Overall Rating <span className="text-red-400">*</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <StarRating
                          value={form.rating}
                          onChange={(v) => setForm({ ...form, rating: v })}
                          size={28}
                        />
                        {form.rating > 0 && (
                          <span className="text-xs font-bold text-[#C5A059]">
                            {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][form.rating]}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Review Title */}
                    <div className="space-y-1.5">
                      <label className="text-[14px] font-bold font-black uppercase tracking-widest text-[#C5A059]">
                        Review Title <span className="text-[#A8A29E]">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="Summarize your experience in a line"
                        className="w-full bg-white border border-[rgba(197,160,89,0.2)] focus:border-[#C5A059] outline-none rounded-xl px-4 py-3 text-sm font-medium placeholder:text-[#A8A29E] transition-colors"
                      />
                    </div>

                    {/* Review Body */}
                    <div className="space-y-1.5">
                      <label className="text-[14px] font-bold font-black uppercase tracking-widest text-[#C5A059]">
                        Your Review <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        rows={4}
                        value={form.body}
                        onChange={(e) => setForm({ ...form, body: e.target.value })}
                        placeholder="Tell us about your experience with this service…"
                        className="w-full bg-white border border-[rgba(197,160,89,0.2)] focus:border-[#C5A059] outline-none rounded-xl px-4 py-3 text-sm font-medium placeholder:text-[#A8A29E] transition-colors resize-none"
                      />
                    </div>

                    {/* Error */}
                    {formError && (
                      <p className="text-red-500 text-xs font-bold">{formError}</p>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#C5A059] text-white font-black py-4 rounded-2xl text-xs uppercase tracking-[0.3em] hover:bg-[#2D2926] transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {submitting ? (
                        <span className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
                        </span>
                      ) : (
                        <><Send size={14} /> Submit Review</>
                      )}
                    </button>
                  </>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
