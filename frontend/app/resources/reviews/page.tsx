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
            fill={(hovered || value) >= s ? "#d2a14a" : "none"}
            stroke={(hovered || value) >= s ? "#d2a14a" : "#c9bfa8"}
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
      className="bg-white/78 border border-[#10324a]/10 rounded-2xl p-7 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-[#d2a14a]/40 transition-all duration-300"
    >
      {/* Top row: avatar + name + rating */}
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-[#10324a] text-[#d2a14a] font-black text-sm flex items-center justify-center flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="font-bold text-[#10324a] text-sm truncate">{review.name}</span>
            {review.isVerified && (
              <span className="text-[13px] font-bold font-bold text-[#0f4c5c] border border-[#2ca59d]/30 bg-[#2ca59d]/5 px-2 py-0.5 rounded-md uppercase tracking-widest flex-shrink-0">
                Verified
              </span>
            )}
          </div>
          <StarRating value={review.rating} readonly size={14} />
        </div>
      </div>

      {/* Service badge */}
      <span className="self-start text-[13px] font-bold font-bold uppercase tracking-widest bg-[#f7fbfd] text-[#4b5b6a] px-3 py-1 rounded-full border border-[#10324a]/8">
        {review.service}
      </span>

      {/* Title + Body */}
      {review.title && (
        <p className="font-bold text-[#10324a] text-sm">{review.title}</p>
      )}
      <p className="text-sm text-[#4b5b6a] leading-relaxed">{review.body}</p>

      {/* Date */}
      <p className="text-[14px] font-bold text-[#4b5b6a]/50 font-medium mt-auto">{date}</p>
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
      className="min-h-screen pb-32 text-[#10324a]"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(44,165,157,0.16), transparent 30%), linear-gradient(135deg, #f8f4ea 0%, #fcfbf7 100%)",
      }}
    >
      <style>{`
        .gold-shimmer {
          background: linear-gradient(90deg,#d2a14a,#f4d89e,#d2a14a,#b3985e,#d2a14a);
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
        select option { color: #10324a; background: #fff; }
      `}</style>

      {/* ── HERO ── */}
      <section
        className="relative px-6 pt-24 pb-12 text-center overflow-hidden"
        style={{ background: "linear-gradient(180deg,rgba(44,165,157,0.10) 0%,transparent 100%)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto space-y-5"
        >
          <span className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full border border-[#2ca59d]/25 bg-[#2ca59d]/10 text-[#0f4c5c] font-black text-[14px] font-bold tracking-[0.3em] uppercase">
            Student Voices
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-[0.95]">
            <span className="gold-shimmer">Real Reviews</span>
          </h1>
          <p className="text-[#4b5b6a] text-lg font-medium max-w-xl mx-auto leading-relaxed">
            Honest feedback from students who&apos;ve used EduLeaderGlobal&apos;s services to achieve their study-abroad dreams.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-[#10324a] text-[#d2a14a] font-black px-8 py-4 rounded-2xl hover:bg-[#d2a14a] hover:text-[#10324a] transition-all shadow-xl text-sm tracking-widest uppercase"
            >
              <MessageSquare size={16} /> Write a Review
            </button>
            <div className="text-left">
              <p className="text-2xl font-black text-[#10324a]">{total}</p>
              <p className="text-[14px] font-bold text-[#4b5b6a]/60 uppercase tracking-widest font-bold">Reviews</p>
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
                  ? "bg-[#10324a] text-[#d2a14a] border-[#10324a] shadow-lg"
                  : "bg-white/70 text-[#4b5b6a] border-[#10324a]/10 hover:border-[#d2a14a]/40"
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
              <div key={i} className="bg-white/60 rounded-2xl h-56 animate-pulse border border-[#10324a]/8" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[#4b5b6a]/60 font-medium text-lg">No reviews yet for this service.</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-6 bg-[#d2a14a] text-[#10324a] font-black px-8 py-3 rounded-xl text-sm tracking-widest uppercase hover:bg-[#10324a] hover:text-white transition-all"
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
                  className="flex items-center gap-2 border border-[#10324a]/15 text-[#4b5b6a] font-bold px-8 py-3 rounded-xl text-sm tracking-widest uppercase hover:border-[#d2a14a] hover:text-[#d2a14a] transition-all"
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
              className="absolute inset-0 bg-[#10324a]/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[#fcfbf7] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              {/* Modal Header */}
              <div className="bg-[#10324a] px-8 py-7 relative">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(210,161,74,0.15),transparent_50%)]" />
                <button
                  onClick={() => setShowForm(false)}
                  className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
                <p className="relative z-10 text-[14px] font-bold font-black uppercase tracking-[0.3em] text-[#d2a14a] mb-1">Share Your Experience</p>
                <h2 className="relative z-10 text-3xl font-black text-white leading-tight">Write a Review</h2>
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
                    <p className="text-2xl font-black text-[#10324a]">Thank You!</p>
                    <p className="text-[#4b5b6a] text-sm">Your review has been submitted successfully.</p>
                  </motion.div>
                ) : (
                  <>
                    {/* Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[14px] font-bold font-black uppercase tracking-widest text-[#d2a14a]">
                          Your Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="e.g. Arjun Sharma"
                          className="w-full bg-white border border-[#10324a]/12 focus:border-[#2ca59d] outline-none rounded-xl px-4 py-3 text-sm font-medium placeholder:text-[#4b5b6a]/40 transition-colors text-[#10324a]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[14px] font-bold font-black uppercase tracking-widest text-[#d2a14a]">
                          Email <span className="text-[#4b5b6a]/50">(optional)</span>
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="you@example.com"
                          className="w-full bg-white border border-[#10324a]/12 focus:border-[#2ca59d] outline-none rounded-xl px-4 py-3 text-sm font-medium placeholder:text-[#4b5b6a]/40 transition-colors text-[#10324a]"
                        />
                      </div>
                    </div>

                    {/* Service Selector */}
                    <div className="space-y-1.5">
                      <label className="text-[14px] font-bold font-black uppercase tracking-widest text-[#d2a14a]">
                        Service <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={form.service}
                          onChange={(e) => setForm({ ...form, service: e.target.value })}
                          className="w-full appearance-none bg-white border border-[#10324a]/12 focus:border-[#2ca59d] outline-none rounded-xl px-4 py-3 text-sm font-medium text-[#10324a] transition-colors pr-10"
                        >
                          <option value="" disabled>Select a service…</option>
                          {SERVICES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4b5b6a]/50 pointer-events-none" />
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="space-y-1.5">
                      <label className="text-[14px] font-bold font-black uppercase tracking-widest text-[#d2a14a]">
                        Overall Rating <span className="text-red-400">*</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <StarRating
                          value={form.rating}
                          onChange={(v) => setForm({ ...form, rating: v })}
                          size={28}
                        />
                        {form.rating > 0 && (
                          <span className="text-xs font-bold text-[#d2a14a]">
                            {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][form.rating]}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Review Title */}
                    <div className="space-y-1.5">
                      <label className="text-[14px] font-bold font-black uppercase tracking-widest text-[#d2a14a]">
                        Review Title <span className="text-[#4b5b6a]/50">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="Summarize your experience in a line"
                        className="w-full bg-white border border-[#10324a]/12 focus:border-[#2ca59d] outline-none rounded-xl px-4 py-3 text-sm font-medium placeholder:text-[#4b5b6a]/40 transition-colors text-[#10324a]"
                      />
                    </div>

                    {/* Review Body */}
                    <div className="space-y-1.5">
                      <label className="text-[14px] font-bold font-black uppercase tracking-widest text-[#d2a14a]">
                        Your Review <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        rows={4}
                        value={form.body}
                        onChange={(e) => setForm({ ...form, body: e.target.value })}
                        placeholder="Tell us about your experience with this service…"
                        className="w-full bg-white border border-[#10324a]/12 focus:border-[#2ca59d] outline-none rounded-xl px-4 py-3 text-sm font-medium placeholder:text-[#4b5b6a]/40 transition-colors resize-none text-[#10324a]"
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
                      className="w-full bg-[#d2a14a] text-[#10324a] font-black py-4 rounded-2xl text-xs uppercase tracking-[0.3em] hover:bg-[#10324a] hover:text-white transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {submitting ? (
                        <span className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10324a] animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10324a] animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10324a] animate-bounce" />
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