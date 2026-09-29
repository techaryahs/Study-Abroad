"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { getToken } from "@/app/lib/token";
import {
  GraduationCap,
  Search,
  RefreshCw,
  Mail,
  Phone,
  User,
  Calendar,
  Building,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

interface StudentLead {
  _id: string;
  leadId?: string;
  studentLeadId?: string;
  fullName: string;
  email: string;
  phone?: string;
  mobile?: string;
  collegeId?: { _id: string; name: string } | null;
  collegeName?: string;
  seminarId?: string;
  leadStatus?: string;
  pipelineStage?: string;
  assignedConsultantId?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  createdAt: string;
}

export default function AdminStudentsPage() {
  const [leads, setLeads] = useState<StudentLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [assignmentFilter, setAssignmentFilter] = useState<"all" | "assigned" | "unassigned">("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Selected Detail Modal
  const [selectedLead, setSelectedLead] = useState<StudentLead | null>(null);

  const fetchLeads = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BACKEND_URL}/api/partnership/student-leads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch student leads");
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (err: any) {
      console.error("Fetch student leads error:", err);
      setError("Unable to load student leads. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const filteredLeads = useMemo(() => {
    return leads
      .filter((l) => {
        if (assignmentFilter === "assigned") return !!l.assignedConsultantId;
        if (assignmentFilter === "unassigned") return !l.assignedConsultantId;
        return true;
      })
      .filter((l) => {
        if (stageFilter === "all") return true;
        const stage = (l.pipelineStage || l.leadStatus || "").toLowerCase();
        return stage === stageFilter.toLowerCase();
      })
      .filter((l) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          l.fullName?.toLowerCase().includes(q) ||
          l.email?.toLowerCase().includes(q) ||
          l.phone?.toLowerCase().includes(q) ||
          l.mobile?.toLowerCase().includes(q) ||
          l.leadId?.toLowerCase().includes(q) ||
          l.studentLeadId?.toLowerCase().includes(q) ||
          l.seminarId?.toLowerCase().includes(q) ||
          (l.collegeId?.name || l.collegeName || "")?.toLowerCase().includes(q) ||
          l.assignedConsultantId?.name?.toLowerCase().includes(q)
        );
      });
  }, [leads, assignmentFilter, stageFilter, searchQuery]);

  const totalPages = Math.ceil(filteredLeads.length / pageSize) || 1;
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage]);

  const assignedCount = leads.filter((l) => !!l.assignedConsultantId).length;
  const unassignedCount = leads.length - assignedCount;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Students / Leads Directory</h2>
          <p className="text-xs text-white/50 mt-1">
            Global administrative view of institutional seminar registrations and counselor assignments.
          </p>
        </div>
        <button
          onClick={fetchLeads}
          disabled={loading}
          className="flex items-center gap-2 self-start sm:self-auto px-3.5 py-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/80 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-[#c2a878]" : ""} />
          <span>Refresh Directory</span>
        </button>
      </div>

      {/* Metric Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-[#0d0f12] border border-white/[0.08]">
          <button
            onClick={() => {
              setAssignmentFilter("all");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              assignmentFilter === "all"
                ? "bg-[#c2a878] text-black shadow-md"
                : "text-white/60 hover:text-white"
            }`}
          >
            All Leads ({leads.length})
          </button>
          <button
            onClick={() => {
              setAssignmentFilter("assigned");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              assignmentFilter === "assigned"
                ? "bg-emerald-500 text-black shadow-md"
                : "text-white/60 hover:text-white"
            }`}
          >
            Assigned ({assignedCount})
          </button>
          <button
            onClick={() => {
              setAssignmentFilter("unassigned");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              assignmentFilter === "unassigned"
                ? "bg-amber-500 text-black shadow-md"
                : "text-white/60 hover:text-white"
            }`}
          >
            Unassigned ({unassignedCount})
          </button>
        </div>

        <div className="relative flex-1 min-w-[240px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by student name, email, phone, or ID..."
            className="w-full bg-[#0d0f12] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#c2a878]/50 transition-colors"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Leads Table / Cards */}
      <div className="bg-[#0d0f12] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : paginatedLeads.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-white/80">
                <thead className="bg-white/[0.03] text-[10px] font-black uppercase tracking-[0.16em] text-white/40 border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Lead ID & Seminar</th>
                    <th className="px-6 py-4">College</th>
                    <th className="px-6 py-4">Assigned Counsellor</th>
                    <th className="px-6 py-4">Status / Stage</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedLeads.map((lead) => {
                    const stage = lead.pipelineStage || lead.leadStatus || "NEW";
                    const collegeName = lead.collegeId?.name || lead.collegeName || "N/A";

                    return (
                      <tr key={lead._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-white text-sm capitalize">
                            {lead.fullName}
                          </div>
                          <div className="text-[11px] text-white/40 flex items-center gap-2 mt-0.5">
                            <span>{lead.email}</span>
                            <span>•</span>
                            <span>{lead.phone || lead.mobile || "N/A"}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="font-mono text-[11px] text-[#c2a878]">
                            {lead.leadId || lead.studentLeadId || "N/A"}
                          </div>
                          <div className="text-[10px] text-white/40 mt-0.5">
                            Seminar: {lead.seminarId || "Direct"}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-white/80 font-medium truncate max-w-[160px]">
                            {collegeName}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {lead.assignedConsultantId ? (
                            <div>
                              <div className="font-bold text-white">
                                {lead.assignedConsultantId.name}
                              </div>
                              <div className="text-[10px] text-[#c2a878] uppercase">
                                {lead.assignedConsultantId.role || "Counsellor"}
                              </div>
                            </div>
                          ) : (
                            <span className="inline-flex px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-white/5 text-white/40">
                              Unassigned
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/15 text-blue-300 border border-blue-500/30">
                            {stage}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                            title="View lead details"
                          >
                            <Eye size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden divide-y divide-white/5">
              {paginatedLeads.map((lead) => (
                <div key={lead._id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-white capitalize">{lead.fullName}</div>
                      <div className="text-xs text-white/50">{lead.email} • {lead.phone || lead.mobile || "N/A"}</div>
                    </div>
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-500/15 text-blue-300">
                      {lead.pipelineStage || lead.leadStatus || "NEW"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span className="font-mono text-[#c2a878] text-[11px]">{lead.leadId || lead.studentLeadId || "N/A"}</span>
                    <span>
                      {lead.assignedConsultantId
                        ? `Counsellor: ${lead.assignedConsultantId.name}`
                        : "Unassigned"}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex justify-end">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-semibold"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 text-xs text-white/50">
              <div>
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, filteredLeads.length)} of{" "}
                {filteredLeads.length} student leads
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
            <GraduationCap size={36} className="mx-auto text-white/20" />
            <h3 className="text-sm font-bold text-white">No Student Leads Match</h3>
            <p className="text-xs text-white/40 max-w-sm mx-auto">
              There are currently no student records under the selected filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Student Lead Detail Modal */}
      {selectedLead && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setSelectedLead(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#0d0f12] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Student Lead Record
              </h3>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-white/40 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#c2a878] tracking-widest">
                  Lead Identification
                </span>
                <h4 className="text-lg font-black text-white capitalize">{selectedLead.fullName}</h4>
                <p className="font-mono text-xs text-[#c2a878]">ID: {selectedLead.leadId || selectedLead.studentLeadId || "N/A"}</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/40">Email</span>
                  <span className="font-semibold text-white">{selectedLead.email}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/40">Phone</span>
                  <span className="font-semibold text-white">{selectedLead.phone || selectedLead.mobile || "N/A"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/40">College / Institution</span>
                  <span className="font-semibold text-white">
                    {selectedLead.collegeId?.name || selectedLead.collegeName || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/40">Seminar Reference</span>
                  <span className="font-mono text-white/70">{selectedLead.seminarId || "Direct"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/40">Assigned Counsellor</span>
                  <span className="font-semibold text-[#c2a878]">
                    {selectedLead.assignedConsultantId?.name || "Unassigned"}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-white/40">Pipeline Stage</span>
                  <span className="font-bold uppercase text-white">
                    {selectedLead.pipelineStage || selectedLead.leadStatus || "NEW"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex justify-end">
              <button
                onClick={() => setSelectedLead(null)}
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
