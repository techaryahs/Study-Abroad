"use client";

<<<<<<< HEAD
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getUser, removeToken } from "@/app/lib/token";
import { io, Socket } from "socket.io-client";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Booking {
  _id: string;
  sessionId?: string;
  meetingId?: string;
  date: string;
  time: string;
  endTime?: string;
  userName?: string;
  userEmail: string;
  status: string;
  bookingType?: string;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL &&
  process.env.NEXT_PUBLIC_BACKEND_URL !== "undefined"
    ? process.env.NEXT_PUBLIC_BACKEND_URL
    : "http://localhost:5001";

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    booked: { label: "Scheduled", cls: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    accepted: { label: "Accepted", cls: "bg-green-500/10 text-green-400 border-green-500/20" },
    pending: { label: "Pending", cls: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    rejected: { label: "Rejected", cls: "bg-red-500/10 text-red-400 border-red-500/20" },
    completed: { label: "Completed", cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    cancelled: { label: "Cancelled", cls: "bg-white/5 text-white/30 border-white/10" },
  };
  const s = map[status] ?? { label: status, cls: "bg-white/5 text-white/30 border-white/10" };
  return (
    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border ${s.cls}`}>
      {s.label}
    </span>
  );
}

// ─── Booking Card ─────────────────────────────────────────────────────────────
function BookingCard({ booking, onAccept, onReject, onEndMeeting, isEnding }: {
  booking: Booking;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onEndMeeting: (id: string) => void;
  isEnding: boolean;
}) {
  const today = new Date().toISOString().split("T")[0];
  const isToday = booking.date === today;
  const hasSession = !!booking.sessionId;
  const isActive = hasSession && (booking.status === "booked" || booking.status === "accepted");
  const isCompleted = booking.status === "completed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[#0d0d0d] border rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300 ${
        isCompleted
          ? "border-emerald-500/10 opacity-70"
          : isToday
          ? "border-[#d4af37]/25 shadow-[0_0_30px_rgba(212,175,55,0.05)]"
          : "border-white/[0.06] hover:border-white/10"
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
            isCompleted
              ? "bg-emerald-500/10 border border-emerald-500/20"
              : "bg-[#d4af37]/10 border border-[#d4af37]/20"
          }`}>
            {isCompleted ? "✅" : booking.bookingType === "counselling" ? "🎓" : "📋"}
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">
              {booking.userName || booking.userEmail.split("@")[0]}
            </p>
            <p className="text-white/30 text-xs mt-1">{booking.userEmail}</p>
          </div>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3">
          <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold mb-1">Date</p>
          <p className="text-white text-xs font-semibold">
            {new Date(booking.date + "T00:00:00").toLocaleDateString("en-GB", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </p>
          {isToday && !isCompleted && (
            <span className="text-[8px] font-black text-[#d4af37] uppercase">Today</span>
          )}
        </div>
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3">
          <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold mb-1">Time</p>
          <p className="text-white text-xs font-semibold">
            {booking.time}
            {booking.endTime ? ` – ${booking.endTime}` : ""}
          </p>
        </div>
      </div>

      {/* Meeting ID */}
      {booking.meetingId && (
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl px-3 py-2 flex items-center justify-between">
          <span className="text-white/30 text-[10px]">Meeting ID</span>
          <span className="text-[#d4af37] text-xs font-mono font-bold tracking-wider">
            {booking.meetingId}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        {isActive ? (
          <>
            <Link
              href={`/meeting/${booking.sessionId}`}
              className="flex-1 py-2.5 bg-[#d4af37] text-black font-black text-xs rounded-xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider shadow-lg shadow-[#d4af37]/10"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.868V15.13a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
              Join
            </Link>

            {/* End Meeting Button */}
            <button
              onClick={() => onEndMeeting(booking._id)}
              disabled={isEnding}
              className="px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all font-black uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {isEnding ? (
                <div className="w-3 h-3 rounded-full border border-red-400/50 border-t-red-400 animate-spin" />
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <rect x="6" y="6" width="12" height="12" rx="1" />
                </svg>
              )}
              End
            </button>
          </>
        ) : isCompleted ? (
          <div className="flex-1 py-2.5 bg-emerald-500/5 border border-emerald-500/10 text-emerald-400/50 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 uppercase tracking-wider cursor-default">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Session Complete
          </div>
        ) : (
          <div className="flex-1 py-2.5 bg-white/5 text-white/20 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 uppercase tracking-wider cursor-not-allowed">
            No Meeting Link
          </div>
        )}

        {booking.status === "pending" && (
          <div className="flex gap-1.5">
            <button
              onClick={() => onAccept(booking._id)}
              className="px-3 py-2.5 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-xl hover:bg-green-500 hover:text-white hover:border-green-500 transition-all font-bold"
            >
              ✓
            </button>
            <button
              onClick={() => onReject(booking._id)}
              className="px-3 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all font-bold"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function ConsultantDashboard() {
=======
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Trash2, 
  Check, 
  X, 
  User,
  Video, 
  ArrowRight,
  TrendingUp,
  Clock,
  Mail,
  AlertCircle
} from "lucide-react";
import { getUser, getToken, clearAuth } from "@/app/lib/token";

interface Booking {
  _id: string;
  userEmail: string;
  status: "pending" | "accepted" | "rejected";
  date: string;
  time: string;
  [key: string]: any;
}

const ConsultantDashboard = () => {
>>>>>>> 11bf9b0681aa7da8e4fda2c1ded58a513e600653
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "today" | "upcoming" | "history">("today");
  const [toast, setToast] = useState("");
  const [endingIds, setEndingIds] = useState<Set<string>>(new Set());
  const socketRef = useRef<Socket | null>(null);

  // ── Auth guard ──────────────────────────────────────────────────────────
  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.replace("/auth/login");
      return;
    }
    if (u.role !== "consultant" && u.role !== "admin") {
      router.replace("/User/dashboard");
      return;
    }
    setUser(u);
  }, [router]);

  // ── Socket connection for force-ending meetings ────────────────────────
  useEffect(() => {
    const sock = io(BACKEND_URL, { transports: ["websocket"] });
    socketRef.current = sock;
    return () => { sock.disconnect(); };
  }, []);

  // ── Fetch bookings ──────────────────────────────────────────────────────
  const fetchBookings = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const consultantId = user._id || user.id || "undefined";
    const email = encodeURIComponent(user.email || "");

    try {
      const r = await fetch(`${BACKEND_URL}/api/bookings/consultant/${consultantId}?email=${email}`);
      const data = await r.json();
      let list = Array.isArray(data) ? data : data.bookings ?? [];
      if (list.length === 0) {
        const r2 = await fetch(`${BACKEND_URL}/api/bookings/by-email?email=${email}`);
        const d2 = await r2.json();
        list = Array.isArray(d2) ? d2 : d2.bookings ?? [];
      }
      setBookings(list);
    } catch {
      setError("Could not load bookings.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  // ── Accept / Reject ────────────────────────────────────────────────────
  const handleAccept = async (id: string) => {
    await fetch(`${BACKEND_URL}/api/bookings/${id}/accept`, { method: "PUT" });
    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status: "accepted" } : b))
    );
    showToast("Booking accepted!");
  };

  const handleReject = async (id: string) => {
    await fetch(`${BACKEND_URL}/api/bookings/${id}/reject`, { method: "PUT" });
    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status: "rejected" } : b))
    );
    showToast("Booking rejected.");
  };

  // ── End Meeting (instant) ──────────────────────────────────────────────
  const handleEndMeeting = async (id: string) => {
    const booking = bookings.find((b) => b._id === id);
    if (!booking) return;

    setEndingIds((prev) => new Set(prev).add(id));

    try {
      // 1. Mark as completed in the database
      await fetch(`${BACKEND_URL}/api/bookings/${id}/complete`, { method: "PUT" });

      // 2. Force-end the meeting via socket so participants are kicked out
      if (socketRef.current && booking.sessionId) {
        socketRef.current.emit("force-end-meeting", {
          sessionId: booking.sessionId,
          meetingId: booking.meetingId,
        });
      }

      // 3. Update local state
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "completed" } : b))
      );
      showToast("Meeting ended & moved to history.");
    } catch {
      showToast("Failed to end meeting. Try again.");
    } finally {
      setEndingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleSignOut = () => {
    removeToken();
    router.push("/auth/login");
  };

  // ── Filter ─────────────────────────────────────────────────────────────
  const today = new Date().toISOString().split("T")[0];
  const filtered = bookings.filter((b) => {
    if (filter === "today") return b.date === today && b.status !== "completed";
    if (filter === "upcoming") return b.date >= today && b.status !== "rejected" && b.status !== "completed";
    if (filter === "history") return b.status === "completed";
    return true;
  });

  const todayCount = bookings.filter((b) => b.date === today && b.status !== "completed").length;
  const upcomingCount = bookings.filter(
    (b) => b.date >= today && b.status !== "rejected" && b.status !== "completed"
  ).length;
  const historyCount = bookings.filter((b) => b.status === "completed").length;

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#d4af37]/4 blur-[200px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#d4af37]/3 blur-[150px] rounded-full" />
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#0d0d0d] border border-[#d4af37]/30 text-[#d4af37] px-5 py-3 rounded-xl text-sm font-bold shadow-2xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center">
              <span className="text-sm">🎓</span>
            </div>
            <div>
              <p className="text-white font-black text-sm uppercase tracking-widest">
                Consultant Portal
              </p>
              <p className="text-white/25 text-[10px]">Global Counselling Center</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-white text-sm font-bold">{user?.name}</p>
              <p className="text-white/30 text-xs">{user?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white/50 text-xs font-bold hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all uppercase tracking-wider"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {[
            { label: "Total", value: bookings.length },
            { label: "Today", value: todayCount },
            { label: "Upcoming", value: upcomingCount },
            { label: "Pending", value: bookings.filter((b) => b.status === "pending").length },
            { label: "Completed", value: historyCount, highlight: true },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`bg-[#0d0d0d] border rounded-2xl p-4 ${
                stat.highlight
                  ? "border-emerald-500/20"
                  : "border-white/[0.06]"
              }`}
            >
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-2">
                {stat.label}
              </p>
              <p className={`text-2xl font-black ${stat.highlight ? "text-emerald-400" : "text-white"}`}>
                {stat.value}
              </p>
=======
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

  useEffect(() => {
    const token = getToken();
    const storedUser = getUser();
    
    if (!token || !storedUser) {
      router.push("/auth/login");
      return;
    }
    
    setUser(storedUser);
    fetchBookings(storedUser);
  }, [router]);

  const fetchBookings = async (currentUser: any) => {
    if (!currentUser?._id) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/bookings/consultant/${currentUser._id}?email=${currentUser.email}`, {
        headers: {
          "Authorization": `Bearer ${getToken()}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const bookingSummary = useMemo(() => {
    const pendingCount = bookings.filter((b) => b.status === "pending").length;
    const acceptedCount = bookings.filter((b) => b.status === "accepted").length;
    const rejectedCount = bookings.filter((b) => b.status === "rejected").length;
    const totalBookings = bookings.length;

    return {
      totalBookings,
      pendingCount,
      acceptedCount,
      rejectedCount,
    };
  }, [bookings]);

  const updateBookingStatus = async (id: string, action: "accept" | "reject") => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/bookings/${id}/${action}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
          "Content-Type": "application/json"
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookings((prev) =>
          prev.map((b) =>
            b._id === id ? { ...b, status: data.booking.status } : b
          )
        );
      }
    } catch (err) {
      console.error("Error updating booking:", err);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!window.confirm("Permanently remove this booking record?")) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/bookings/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${getToken()}`
        }
      });
      
      if (response.ok) {
        setBookings(prev => prev.filter(b => b._id !== id));
      }
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070a] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-[#c2a878] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c2a878]/50">Synchronizing Manager...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        
        {/* Header Section */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-10 bg-[#c2a878] rounded-full" />
                 <h1 className="text-4xl md:text-5xl font-black uppercase italic font-serif tracking-tighter">Consultant Portal</h1>
              </div>
              <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] leading-relaxed">
                Authenticated Node: <span className="text-[#c2a878]">{user?.name || "Premium Member"}</span> • Global Advisory Access
              </p>
            </div>
            
            <button 
              onClick={() => router.push("/consultant-dashboard/edit-profile")}
              className="group flex items-center gap-4 px-8 py-4 bg-white/[0.02] border border-white/10 rounded-2xl hover:border-[#c2a878]/40 transition-all hover:bg-[#c2a878]/5"
            >
              <div className="p-2 rounded-xl bg-[#c2a878]/10 text-[#c2a878] group-hover:scale-110 transition-transform">
                <User size={18} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Edit Professional Profile</span>
              <ArrowRight size={14} className="text-gray-700 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Vital Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            { label: "Total Volume", value: bookingSummary.totalBookings, color: "text-white" },
            { label: "Action Required", value: bookingSummary.pendingCount, color: "text-amber-500" },
            { label: "Confirmed Sessions", value: bookingSummary.acceptedCount, color: "text-[#c2a878]" }
          ].map((stat, idx) => (
            <div key={idx} className="relative overflow-hidden p-8 bg-white/[0.01] border border-white/[0.05] rounded-3xl group hover:border-[#c2a878]/20 transition-colors">
               <div className="absolute top-0 right-0 w-24 h-24 bg-[#c2a878]/5 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2" />
               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 mb-2">{stat.label}</p>
               <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
>>>>>>> 11bf9b0681aa7da8e4fda2c1ded58a513e600653
            </div>
          ))}
        </div>

<<<<<<< HEAD
        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {(["today", "upcoming", "all", "history"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === f
                  ? f === "history"
                    ? "bg-emerald-500 text-black"
                    : "bg-[#d4af37] text-black"
                  : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70"
              }`}
            >
              {f === "history" ? `History (${historyCount})` : f}
            </button>
          ))}
          <span className="ml-auto text-white/20 text-xs">
            {filtered.length} session{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center gap-4 py-20">
            <div className="w-10 h-10 rounded-full border-2 border-[#d4af37]/30 border-t-[#d4af37] animate-spin" />
            <p className="text-white/30 text-sm">Loading your sessions…</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 space-y-3">
            <p className="text-red-400/60 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-[#d4af37] text-xs underline underline-offset-4"
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-3xl">
              {filter === "history" ? "📜" : "🗓️"}
            </div>
            <p className="text-white/30 text-sm">
              {filter === "history"
                ? "No completed sessions yet."
                : <>No sessions found for <span className="text-white/50 font-bold">{filter}</span>.</>}
            </p>
            {filter !== "all" && filter !== "history" && (
              <button
                onClick={() => setFilter("all")}
                className="text-[#d4af37] text-xs underline underline-offset-4"
              >
                View all sessions
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((b, i) => (
              <motion.div
                key={b._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <BookingCard
                  booking={b}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  onEndMeeting={handleEndMeeting}
                  isEnding={endingIds.has(b._id)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
=======
        {/* Requests Section */}
        <div className="grid grid-cols-1 gap-16">
          
          {/* Pending Approvals */}
          <section>
             <div className="flex items-center gap-4 mb-10">
                <AlertCircle size={20} className="text-amber-500" />
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/90">Incoming Requests</h2>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent" />
             </div>

             <div className="space-y-4">
                {bookings.filter((b) => b.status === "pending").length > 0 ? (
                  bookings.filter((b) => b.status === "pending").map((booking) => (
                    <div key={booking._id} className="group flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8 bg-white/[0.01] border border-white/[0.05] rounded-[2rem] hover:bg-white/[0.02] transition-colors">
                       <div className="flex flex-col gap-2 text-center md:text-left">
                          <span className="text-sm font-bold text-white tracking-tight">{booking.userEmail}</span>
                          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-600 justify-center md:justify-start">
                             <Clock size={12} className="text-amber-500" />
                             <span>{booking.date}</span>
                             <span className="w-1 h-1 bg-gray-800 rounded-full" />
                             <span className="text-[#c2a878]">{booking.time}</span>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <button 
                            onClick={() => updateBookingStatus(booking._id, "accept")}
                            className="px-6 py-2.5 bg-[#c2a878] text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-100 transition-colors active:scale-95"
                          >
                             Approve
                          </button>
                          <button 
                            onClick={() => updateBookingStatus(booking._id, "reject")}
                            className="px-6 py-2.5 bg-white/5 border border-white/5 text-white/50 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors active:scale-95"
                          >
                             Decline
                          </button>
                          <button 
                            onClick={() => deleteBooking(booking._id)}
                            className="p-2.5 text-gray-700 hover:text-rose-500 transition-colors"
                          >
                             <Trash2 size={16} />
                          </button>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center rounded-[2rem] border border-dashed border-white/5">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700">No pending approvals detected</p>
                  </div>
                )}
             </div>
          </section>

          {/* Confirmed Sessions */}
          <section>
             <div className="flex items-center gap-4 mb-10">
                <Check size={20} className="text-[#c2a878]" />
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/90">Active Admissions List</h2>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent" />
             </div>

             <div className="space-y-4">
                {bookings.filter((b) => b.status === "accepted").length > 0 ? (
                  bookings.filter((b) => b.status === "accepted").map((booking) => (
                    <div key={booking._id} className="group flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8 bg-[#c2a878]/[0.02] border border-[#c2a878]/10 rounded-[2rem] hover:bg-[#c2a878]/[0.04] transition-colors">
                       <div className="flex flex-col gap-2 text-center md:text-left">
                          <div className="flex items-center gap-3 justify-center md:justify-start">
                             <span className="text-sm font-bold text-white tracking-tight">{booking.userEmail}</span>
                             <span className="text-[8px] px-2 py-0.5 bg-[#c2a878] text-black font-black uppercase rounded-full">Active</span>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-600 justify-center md:justify-start">
                             <Clock size={12} className="text-[#c2a878]" />
                             <span>{booking.date}</span>
                             <span className="w-1 h-1 bg-gray-800 rounded-full" />
                             <span className="text-[#c2a878]">{booking.time}</span>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <button 
                            onClick={() => router.push(`/video-call/${booking._id}`)}
                            className="flex items-center gap-3 px-8 py-3 bg-[#c2a878] text-black rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-yellow-100 transition-all active:scale-95 shadow-[0_10px_30px_-10px_rgba(194,168,120,0.3)]"
                          >
                             <Video size={14} /> Start Call
                          </button>
                          <button 
                            onClick={() => deleteBooking(booking._id)}
                            className="p-2.5 text-gray-700 hover:text-rose-500 transition-colors ml-2"
                          >
                             <Trash2 size={16} />
                          </button>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center rounded-[2rem] border border-dashed border-white/5">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700">No active admissions scheduled</p>
                  </div>
                )}
             </div>
          </section>

          {/* Archives */}
          {bookings.filter((b) => b.status === "rejected").length > 0 && (
             <section className="opacity-30 hover:opacity-60 transition-opacity duration-500">
                <div className="flex items-center gap-4 mb-10">
                   <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Archive</h2>
                   <div className="flex-1 h-[1px] bg-gray-900" />
                </div>
                
                <div className="space-y-2">
                   {bookings.filter((b) => b.status === "rejected").map((booking) => (
                     <div key={booking._id} className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/[0.05] rounded-2xl">
                        <div className="flex flex-col">
                           <span className="text-xs text-gray-400">{booking.userEmail}</span>
                           <span className="text-[9px] font-bold uppercase text-gray-700">{booking.date} • Declined</span>
                        </div>
                        <button 
                          onClick={() => deleteBooking(booking._id)}
                          className="text-[9px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-colors"
                        >
                           Clear Records
                        </button>
                     </div>
                   ))}
                </div>
             </section>
          )}

        </div>
      </div>
    </div>
  );
};

export default ConsultantDashboard;
>>>>>>> 11bf9b0681aa7da8e4fda2c1ded58a513e600653
