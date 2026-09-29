"use client";

import React, { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getToken } from "@/app/lib/token";
import ConfirmModal from "@/components/admin/ConfirmModal";
import {
  CalendarCheck,
  Video,
  Search,
  Filter,
  RefreshCw,
  X,
  Calendar,
  Clock,
  User,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

interface BookingSession {
  _id: string;
  sessionId: string;
  meetingId: string;
  date: string;
  time: string;
  endTime: string;
  userName: string;
  userEmail: string;
  consultantName: string;
  status: "booked" | "completed" | "cancelled";
  createdAt: string;
}

type StatusFilter = "all" | "active" | "completed" | "cancelled";

function SessionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sessions, setSessions] = useState<BookingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const initialStatus = (searchParams?.get("status") as StatusFilter) || "all";
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(initialStatus);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Cancel Modal State
  const [cancellingSession, setCancellingSession] = useState<BookingSession | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const isSessionPast = (s: BookingSession) => {
    try {
      const [day, month, year] = s.date.split("/");
      const dt = new Date(`${year}-${month}-${day} ${s.endTime}`);
      return dt < new Date();
    } catch {
      return false;
    }
  };

  const fetchSessions = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/bookings?bookingType=counselling`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch sessions");
      const data = await res.json();
      setSessions(data.bookings || data || []);
    } catch (err: any) {
      console.error("Error fetching sessions:", err);
      setError("Unable to load sessions. Please try refreshing.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleCancelSession = async () => {
    if (!cancellingSession) return;
    setCancelLoading(true);
    const token = getToken();

    try {
      const res = await fetch(`${BACKEND_URL}/api/bookings/cancel/${cancellingSession._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Cancellation failed");

      setSessions((prev) =>
        prev.map((s) => (s._id === cancellingSession._id ? { ...s, status: "cancelled" } : s))
      );
      setCancellingSession(null);
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Failed to cancel session. Please try again.");
    } finally {
      setCancelLoading(false);
    }
  };

  // Filtered & Sorted Sessions
  const filteredSessions = useMemo(() => {
    return sessions
      .filter((s) => {
        // Status filter
        if (statusFilter === "active") {
          return s.status?.toLowerCase() === "booked" && !isSessionPast(s);
        }
        if (statusFilter === "completed") {
          return s.status?.toLowerCase() === "completed" || (s.status?.toLowerCase() === "booked" && isSessionPast(s));
        }
        if (statusFilter === "cancelled") {
          return s.status?.toLowerCase() === "cancelled";
        }
        return true;
      })
      .filter((s) => {
        // Search query
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          s.userName?.toLowerCase().includes(q) ||
          s.userEmail?.toLowerCase().includes(q) ||
          s.consultantName?.toLowerCase().includes(q) ||
          s.meetingId?.toLowerCase().includes(q) ||
          s.sessionId?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        // Sort
        try {
          const [d1, m1, y1] = a.date.split("/");
          const [d2, m2, y2] = b.date.split("/");
          const dt1 = new Date(`${y1}-${m1}-${d1} ${a.time}`).getTime();
          const dt2 = new Date(`${y2}-${m2}-${d2} ${b.time}`).getTime();
          return sortOrder === "newest" ? dt2 - dt1 : dt1 - dt2;
        } catch {
          return 0;
        }
      });
  }, [sessions, statusFilter, searchQuery, sortOrder]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredSessions.length / pageSize) || 1;
  const paginatedSessions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSessions.slice(start, start + pageSize);
  }, [filteredSessions, currentPage]);

  const activeCount = sessions.filter((s) => s.status?.toLowerCase() === "booked" && !isSessionPast(s)).length;
  const completedCount = sessions.filter(
    (s) => s.status?.toLowerCase() === "completed" || (s.status?.toLowerCase() === "booked" && isSessionPast(s))
  ).length;
  const cancelledCount = sessions.filter((s) => s.status?.toLowerCase() === "cancelled").length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Sessions & Bookings</h2>
          <p className="text-xs text-white/50 mt-1">
            Real-time management of student appointments, meetings, and cancellations.
          </p>
        </div>
        <button
          onClick={fetchSessions}
          disabled={loading}
          className="flex items-center gap-2 self-start sm:self-auto px-3.5 py-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/80 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-[#c2a878]" : ""} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-2xl bg-[#0d0f12] border border-white/[0.08] overflow-x-auto custom-scrollbar">
        <button
          onClick={() => {
            setStatusFilter("all");
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            statusFilter === "all"
              ? "bg-[#c2a878] text-black shadow-md"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <span>All Sessions</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 text-current">
            {sessions.length}
          </span>
        </button>

        <button
          onClick={() => {
            setStatusFilter("active");
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            statusFilter === "active"
              ? "bg-[#c2a878] text-black shadow-md"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <span>Active / Upcoming</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 text-current">
            {activeCount}
          </span>
        </button>

        <button
          onClick={() => {
            setStatusFilter("completed");
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            statusFilter === "completed"
              ? "bg-[#c2a878] text-black shadow-md"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <span>Completed</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 text-current">
            {completedCount}
          </span>
        </button>

        <button
          onClick={() => {
            setStatusFilter("cancelled");
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            statusFilter === "cancelled"
              ? "bg-[#c2a878] text-black shadow-md"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <span>Cancelled</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 text-current">
            {cancelledCount}
          </span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search student, counsellor, or meeting ID..."
            className="w-full bg-[#0d0f12] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#c2a878]/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-white/10 bg-[#0d0f12] text-xs font-semibold text-white/70 hover:text-white hover:border-white/20 transition-all"
          >
            <ArrowUpDown size={14} className="text-[#c2a878]" />
            <span>{sortOrder === "newest" ? "Newest First" : "Oldest First"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Table for Desktop / Cards for Mobile */}
      <div className="bg-[#0d0f12] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : paginatedSessions.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-white/80">
                <thead className="bg-white/[0.03] text-[10px] font-black uppercase tracking-[0.16em] text-white/40 border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Counsellor</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Meeting ID</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedSessions.map((session) => {
                    const isPast = isSessionPast(session);
                    const isActive = session.status?.toLowerCase() === "booked" && !isPast;
                    const isCompleted = session.status?.toLowerCase() === "completed" || (session.status?.toLowerCase() === "booked" && isPast);
                    const isCancelled = session.status?.toLowerCase() === "cancelled";

                    return (
                      <tr key={session._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-white">
                            {session.userName || "Student"}
                          </div>
                          <div className="text-[11px] text-white/40 mt-0.5">
                            {session.userEmail || "No email"}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-white font-medium">
                            {session.consultantName || "Assigned Consultant"}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 font-medium text-white">
                            <Calendar size={13} className="text-[#c2a878]" />
                            <span>{session.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-white/40 mt-0.5">
                            <Clock size={12} />
                            <span>
                              {session.time} - {session.endTime}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-mono text-[11px] text-[#c2a878] bg-[#c2a878]/10 px-2 py-1 rounded">
                            {session.meetingId || session.sessionId}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isActive
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : isCompleted
                                ? "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                                : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                            }`}
                          >
                            {isActive ? "Active" : isCompleted ? "Completed" : "Cancelled"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isActive && (
                              <button
                                onClick={() => router.push(`/meeting/${session.sessionId}`)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#c2a878] hover:bg-[#d4ba8a] text-black font-bold uppercase text-[10px] tracking-wider rounded-lg transition-all"
                              >
                                <Video size={12} />
                                <span>Join</span>
                              </button>
                            )}

                            {isActive && (
                              <button
                                onClick={() => setCancellingSession(session)}
                                className="p-1.5 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                title="Cancel session"
                              >
                                <X size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden divide-y divide-white/5">
              {paginatedSessions.map((session) => {
                const isPast = isSessionPast(session);
                const isActive = session.status?.toLowerCase() === "booked" && !isPast;
                const isCompleted = session.status?.toLowerCase() === "completed" || (session.status?.toLowerCase() === "booked" && isPast);

                return (
                  <div key={session._id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-white">
                          {session.userName || session.userEmail}
                        </div>
                        <div className="text-xs text-white/40 mt-0.5">
                          With: {session.consultantName || "Counsellor"}
                        </div>
                      </div>
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isActive
                            ? "bg-emerald-500/15 text-emerald-400"
                            : isCompleted
                            ? "bg-blue-500/15 text-blue-300"
                            : "bg-rose-500/15 text-rose-400"
                        }`}
                      >
                        {isActive ? "Active" : isCompleted ? "Completed" : "Cancelled"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/60">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} className="text-[#c2a878]" />
                        {session.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} className="text-[#c2a878]" />
                        {session.time} - {session.endTime}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-[#c2a878]">
                      ID: {session.meetingId}
                    </div>

                    {isActive && (
                      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                        <button
                          onClick={() => router.push(`/meeting/${session.sessionId}`)}
                          className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#c2a878] text-black font-bold uppercase text-xs rounded-xl"
                        >
                          <Video size={14} /> Join Meeting
                        </button>
                        <button
                          onClick={() => setCancellingSession(session)}
                          className="px-3 py-2 text-rose-400 border border-rose-500/20 rounded-xl hover:bg-rose-500/10 text-xs font-bold"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 text-xs text-white/50">
              <div>
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, filteredSessions.length)} of{" "}
                {filteredSessions.length} sessions
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="px-2 font-bold text-white">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="py-20 text-center space-y-3">
            <CheckCircle2 size={36} className="mx-auto text-white/20" />
            <h3 className="text-sm font-bold text-white">No Sessions Match Your Filters</h3>
            <p className="text-xs text-white/40 max-w-sm mx-auto">
              There are currently no sessions in this category. You can clear your search or switch tabs.
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[#c2a878] rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Clear Search Query
              </button>
            )}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <ConfirmModal
        isOpen={!!cancellingSession}
        title="Cancel Counselling Session?"
        description={`Are you sure you want to cancel the session with ${
          cancellingSession?.userName || "the student"
        } scheduled for ${cancellingSession?.date} at ${cancellingSession?.time}? This action will update the booking status.`}
        confirmLabel="Cancel Session"
        cancelLabel="Keep Session"
        variant="danger"
        isLoading={cancelLoading}
        onConfirm={handleCancelSession}
        onClose={() => setCancellingSession(null)}
      />
    </div>
  );
}

export default function AdminSessionsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#c2a878]/30 border-t-[#c2a878] rounded-full animate-spin" />
          <span className="text-xs text-white/50">Loading Sessions...</span>
        </div>
      }
    >
      <SessionsContent />
    </Suspense>
  );
}
