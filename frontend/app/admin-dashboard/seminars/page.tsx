"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { getToken } from "@/app/lib/token";
import ConfirmModal from "@/components/admin/ConfirmModal";
import {
  CheckSquare,
  Search,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  Building,
  Users,
  RefreshCw,
  Eye,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

interface Seminar {
  _id: string;
  seminarId: string;
  title: string;
  collegeName: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  expectedStudentStrength: number;
  eduLeaderRep: string;
  eduMitraCounsellor: string;
  status: string;
  createdAt: string;
  createdBy: {
    name: string;
    email: string;
  } | null;
  rejectionReason?: string;
}

export default function AdminSeminarsPage() {
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState<string>("PENDING");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Selected Detail Modal
  const [selectedSeminar, setSelectedSeminar] = useState<Seminar | null>(null);

  // Approve Confirm Modal
  const [approvingSeminar, setApprovingSeminar] = useState<Seminar | null>(null);
  const [approveLoading, setApproveLoading] = useState(false);

  // Reject Modal State
  const [rejectingSeminar, setRejectingSeminar] = useState<Seminar | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectLoading, setRejectLoading] = useState(false);

  const fetchSeminars = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/seminars`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch seminars");
      const data = await res.json();
      setSeminars(data.seminars || []);
    } catch (err: any) {
      console.error("Fetch seminars error:", err);
      setError("Unable to load seminar list. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeminars();
  }, [fetchSeminars]);

  const handleApproveConfirm = async () => {
    if (!approvingSeminar) return;
    setApproveLoading(true);
    const token = getToken();

    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/seminars/${approvingSeminar._id}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Approval failed");

      setSeminars((prev) =>
        prev.map((s) => (s._id === approvingSeminar._id ? { ...s, status: "APPROVED" } : s))
      );
      setApprovingSeminar(null);
    } catch (err) {
      console.error("Approve error:", err);
      alert("Failed to approve seminar. Please try again.");
    } finally {
      setApproveLoading(false);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingSeminar || !rejectReason.trim()) return;

    setRejectLoading(true);
    const token = getToken();

    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/seminars/${rejectingSeminar._id}/reject`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: rejectReason.trim() }),
      });
      if (!res.ok) throw new Error("Rejection failed");

      setSeminars((prev) =>
        prev.map((s) =>
          s._id === rejectingSeminar._id
            ? { ...s, status: "REJECTED", rejectionReason: rejectReason }
            : s
        )
      );
      setRejectingSeminar(null);
      setRejectReason("");
    } catch (err) {
      console.error("Reject error:", err);
      alert("Failed to reject seminar. Please try again.");
    } finally {
      setRejectLoading(false);
    }
  };

  const filteredSeminars = useMemo(() => {
    return seminars
      .filter((s) => {
        if (statusFilter === "ALL") return true;
        return (s.status || "").toUpperCase() === statusFilter;
      })
      .filter((s) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          s.title?.toLowerCase().includes(q) ||
          s.collegeName?.toLowerCase().includes(q) ||
          s.seminarId?.toLowerCase().includes(q) ||
          s.eduLeaderRep?.toLowerCase().includes(q) ||
          s.eduMitraCounsellor?.toLowerCase().includes(q)
        );
      });
  }, [seminars, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredSeminars.length / pageSize) || 1;
  const paginatedSeminars = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSeminars.slice(start, start + pageSize);
  }, [filteredSeminars, currentPage]);

  const pendingCount = seminars.filter((s) => s.status === "PENDING").length;
  const approvedCount = seminars.filter((s) => s.status === "APPROVED").length;
  const rejectedCount = seminars.filter((s) => s.status === "REJECTED").length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Seminar Approvals</h2>
          <p className="text-xs text-white/50 mt-1">
            Review institution seminar proposals submitted by Edu Leader partner representatives.
          </p>
        </div>
        <button
          onClick={fetchSeminars}
          disabled={loading}
          className="flex items-center gap-2 self-start sm:self-auto px-3.5 py-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/80 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-[#c2a878]" : ""} />
          <span>Refresh Seminars</span>
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-2xl bg-[#0d0f12] border border-white/[0.08] overflow-x-auto custom-scrollbar">
        <button
          onClick={() => {
            setStatusFilter("PENDING");
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            statusFilter === "PENDING"
              ? "bg-amber-500 text-black shadow-md"
              : "text-white/60 hover:text-white"
          }`}
        >
          <span>Pending Approvals</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 text-current">
            {pendingCount}
          </span>
        </button>

        <button
          onClick={() => {
            setStatusFilter("APPROVED");
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            statusFilter === "APPROVED"
              ? "bg-emerald-500 text-black shadow-md"
              : "text-white/60 hover:text-white"
          }`}
        >
          <span>Approved</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 text-current">
            {approvedCount}
          </span>
        </button>

        <button
          onClick={() => {
            setStatusFilter("REJECTED");
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            statusFilter === "REJECTED"
              ? "bg-rose-500 text-white shadow-md"
              : "text-white/60 hover:text-white"
          }`}
        >
          <span>Rejected</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 text-current">
            {rejectedCount}
          </span>
        </button>

        <button
          onClick={() => {
            setStatusFilter("ALL");
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            statusFilter === "ALL"
              ? "bg-[#c2a878] text-black shadow-md"
              : "text-white/60 hover:text-white"
          }`}
        >
          <span>All Seminars</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/10 text-current">
            {seminars.length}
          </span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by seminar title, college name, or seminar ID..."
          className="w-full bg-[#0d0f12] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#c2a878]/50 transition-colors"
        />
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Table / Cards */}
      <div className="bg-[#0d0f12] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : paginatedSeminars.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-white/80">
                <thead className="bg-white/[0.03] text-[10px] font-black uppercase tracking-[0.16em] text-white/40 border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4">Seminar & ID</th>
                    <th className="px-6 py-4">College & Venue</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Strength & Reps</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedSeminars.map((s) => {
                    const isPending = s.status === "PENDING";
                    const isApproved = s.status === "APPROVED";
                    const isRejected = s.status === "REJECTED";

                    return (
                      <tr key={s._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-white text-sm">{s.title}</div>
                          <div className="font-mono text-[11px] text-[#c2a878] mt-0.5">
                            {s.seminarId}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{s.collegeName}</div>
                          <div className="text-[11px] text-white/40 mt-0.5">{s.venue}</div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 font-medium text-white">
                            <Calendar size={13} className="text-[#c2a878]" />
                            <span>{s.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-white/40 mt-0.5">
                            <Clock size={12} />
                            <span>
                              {s.startTime} - {s.endTime}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="font-semibold text-white">
                            {s.expectedStudentStrength || 0} Students
                          </div>
                          <div className="text-[11px] text-white/40 mt-0.5">
                            Rep: {s.eduLeaderRep || "N/A"}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isApproved
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : isPending
                                ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                                : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedSeminar(s)}
                              className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                              title="View seminar details"
                            >
                              <Eye size={15} />
                            </button>

                            {isPending && (
                              <>
                                <button
                                  onClick={() => setApprovingSeminar(s)}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors"
                                >
                                  <CheckCircle size={12} />
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setRejectingSeminar(s);
                                    setRejectReason("");
                                  }}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors"
                                >
                                  <XCircle size={12} />
                                  <span>Reject</span>
                                </button>
                              </>
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
              {paginatedSeminars.map((s) => (
                <div key={s._id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-white">{s.title}</div>
                      <div className="font-mono text-xs text-[#c2a878]">{s.seminarId}</div>
                    </div>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        s.status === "APPROVED"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : s.status === "PENDING"
                          ? "bg-amber-500/15 text-amber-300"
                          : "bg-rose-500/15 text-rose-400"
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>

                  <div className="text-xs text-white/60 space-y-1">
                    <div>College: {s.collegeName}</div>
                    <div>
                      Date: {s.date} ({s.startTime} - {s.endTime})
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => setSelectedSeminar(s)}
                      className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold flex-1"
                    >
                      Details
                    </button>
                    {s.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => setApprovingSeminar(s)}
                          className="px-3 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold flex-1"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setRejectingSeminar(s);
                            setRejectReason("");
                          }}
                          className="px-3 py-2 bg-rose-500/20 text-rose-400 rounded-xl text-xs font-bold flex-1"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 text-xs text-white/50">
              <div>
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, filteredSeminars.length)} of{" "}
                {filteredSeminars.length} seminars
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
            <CheckSquare size={36} className="mx-auto text-white/20" />
            <h3 className="text-sm font-bold text-white">No Seminars Found</h3>
            <p className="text-xs text-white/40 max-w-sm mx-auto">
              There are currently no seminars in this filter status.
            </p>
          </div>
        )}
      </div>

      {/* Approve Confirm Modal */}
      <ConfirmModal
        isOpen={!!approvingSeminar}
        title={`Approve Seminar "${approvingSeminar?.title}"?`}
        description={`Approving this seminar at ${approvingSeminar?.collegeName} on ${approvingSeminar?.date} will mark it as ACTIVE and allow students to register via the seminar link.`}
        confirmLabel="Approve Seminar"
        cancelLabel="Cancel"
        variant="primary"
        isLoading={approveLoading}
        onConfirm={handleApproveConfirm}
        onClose={() => setApprovingSeminar(null)}
      />

      {/* Reject Modal with Reason */}
      {rejectingSeminar && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => {
            if (!rejectLoading) setRejectingSeminar(null);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#0d0f12] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="text-sm font-black uppercase tracking-wider text-rose-400">
                Reject Seminar Proposal
              </h3>
              <button
                onClick={() => setRejectingSeminar(null)}
                disabled={rejectLoading}
                className="text-white/40 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-white/60">
              Please specify the reason for rejecting "{rejectingSeminar.title}". This will be communicated to the organizing partner.
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for rejection (e.g. scheduling conflict, incomplete venue approval)..."
                rows={3}
                required
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-rose-500/50"
              />

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingSeminar(null)}
                  disabled={rejectLoading}
                  className="px-4 py-2 border border-white/10 hover:bg-white/5 text-white/70 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rejectLoading || !rejectReason.trim()}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold uppercase text-xs tracking-wider rounded-xl disabled:opacity-50 flex items-center gap-2"
                >
                  {rejectLoading && (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  <span>Confirm Rejection</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Seminar Details Modal */}
      {selectedSeminar && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setSelectedSeminar(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#0d0f12] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Seminar Details
              </h3>
              <button
                onClick={() => setSelectedSeminar(null)}
                className="text-white/40 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="font-mono text-xs text-[#c2a878]">{selectedSeminar.seminarId}</span>
                <h4 className="text-lg font-black text-white mt-1">{selectedSeminar.title}</h4>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/40">College / Institution</span>
                  <span className="font-semibold text-white">{selectedSeminar.collegeName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/40">Venue</span>
                  <span className="font-semibold text-white">{selectedSeminar.venue}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/40">Scheduled Date</span>
                  <span className="font-semibold text-white">{selectedSeminar.date}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/40">Timing</span>
                  <span className="font-semibold text-white">
                    {selectedSeminar.startTime} - {selectedSeminar.endTime}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/40">Expected Students</span>
                  <span className="font-semibold text-white">
                    {selectedSeminar.expectedStudentStrength || 0}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/40">Edu Leader Rep</span>
                  <span className="font-semibold text-white">
                    {selectedSeminar.eduLeaderRep || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/40">Edu Mitra Counsellor</span>
                  <span className="font-semibold text-[#c2a878]">
                    {selectedSeminar.eduMitraCounsellor || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-white/40">Approval Status</span>
                  <span className="font-bold uppercase text-white">{selectedSeminar.status}</span>
                </div>
                {selectedSeminar.rejectionReason && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 mt-2">
                    <span className="font-bold block mb-1">Rejection Reason:</span>
                    <span>{selectedSeminar.rejectionReason}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex justify-end">
              <button
                onClick={() => setSelectedSeminar(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
