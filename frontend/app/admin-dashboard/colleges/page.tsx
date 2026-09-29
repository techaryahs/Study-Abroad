"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getToken } from "@/app/lib/token";
import {
  Building2,
  Search,
  Plus,
  RefreshCw,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Building,
} from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

interface AdminCollege {
  _id: string;
  collegeId: string;
  name: string;
  city?: string;
  state?: string;
  status: string;
}

export default function AdminCollegesPage() {
  const router = useRouter();
  const [colleges, setColleges] = useState<AdminCollege[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchColleges = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/colleges`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load colleges");
      const data = await res.json();
      setColleges(data.colleges || []);
    } catch (err: any) {
      console.error("Colleges fetch error:", err);
      setError("Unable to load colleges master directory. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  const filteredColleges = useMemo(() => {
    return colleges
      .filter((c) => {
        if (statusFilter === "all") return true;
        return (c.status || "").toUpperCase() === statusFilter.toUpperCase();
      })
      .filter((c) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          c.name?.toLowerCase().includes(q) ||
          c.collegeId?.toLowerCase().includes(q) ||
          c.city?.toLowerCase().includes(q) ||
          c.state?.toLowerCase().includes(q)
        );
      });
  }, [colleges, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredColleges.length / pageSize) || 1;
  const paginatedColleges = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredColleges.slice(start, start + pageSize);
  }, [filteredColleges, currentPage]);

  const activeCount = colleges.filter((c) => c.status === "ACTIVE").length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Colleges & Institutions</h2>
          <p className="text-xs text-white/50 mt-1">
            Master database of participating universities, colleges, and authorized coordinators.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchColleges}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/80 hover:text-white transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-[#c2a878]" : ""} />
            <span>Refresh</span>
          </button>
          <Link
            href="/admin/colleges/create"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#c2a878] hover:bg-[#d4ba8a] text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
          >
            <Plus size={15} />
            <span>Add College</span>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
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
            placeholder="Search by college name, ID, or location..."
            className="w-full bg-[#0d0f12] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#c2a878]/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider">
            Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter colleges by status"
            className="bg-[#0d0f12] border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-[#c2a878]/50"
          >
            <option value="all">All Statuses ({colleges.length})</option>
            <option value="ACTIVE">Active ({activeCount})</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
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
        ) : paginatedColleges.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-white/80">
                <thead className="bg-white/[0.03] text-[10px] font-black uppercase tracking-[0.16em] text-white/40 border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4">College ID</th>
                    <th className="px-6 py-4">College / University Name</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedColleges.map((c) => (
                    <tr key={c._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-mono text-[#c2a878] text-xs">{c.collegeId}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-white text-sm">{c.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-white/70">
                          <MapPin size={12} className="text-[#c2a878]" />
                          <span>
                            {c.city || "N/A"}, {c.state || "India"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            c.status === "ACTIVE"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/colleges/${c._id}`}
                          className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-[#c2a878] text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1 transition-all"
                        >
                          <span>Manage</span>
                          <ExternalLink size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-white/5">
              {paginatedColleges.map((c) => (
                <div key={c._id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-white">{c.name}</div>
                      <div className="font-mono text-xs text-[#c2a878]">{c.collegeId}</div>
                    </div>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        c.status === "ACTIVE"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-amber-500/15 text-amber-300"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <div className="text-xs text-white/50 flex items-center gap-1">
                    <MapPin size={12} className="text-[#c2a878]" />
                    <span>
                      {c.city || "N/A"}, {c.state || "India"}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex justify-end">
                    <Link
                      href={`/admin/colleges/${c._id}`}
                      className="px-3 py-1.5 bg-[#c2a878] text-black font-bold uppercase text-xs rounded-lg"
                    >
                      Manage College
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 text-xs text-white/50">
              <div>
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, filteredColleges.length)} of{" "}
                {filteredColleges.length} colleges
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
            <Building2 size={36} className="mx-auto text-white/20" />
            <h3 className="text-sm font-bold text-white">No Colleges Match</h3>
            <p className="text-xs text-white/40 max-w-sm mx-auto">
              Try adjusting your search criteria or add a new college.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
