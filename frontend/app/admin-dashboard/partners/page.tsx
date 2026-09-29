"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { getToken } from "@/app/lib/token";
import ConfirmModal from "@/components/admin/ConfirmModal";
import {
  Briefcase,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Mail,
  Phone,
  Building,
  Filter,
  Eye,
  Check,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

interface Partner {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  partnerProfile?: {
    organizationName?: string;
    partnerType?: string;
    designation?: string;
    onboardingStatus?: string;
    isApproved?: boolean;
    isActive?: boolean;
    createdAt?: string;
  };
  createdAt?: string;
}

type PartnerAction = "approve" | "reject" | "suspend";

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Selected Detail Modal
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  // Confirmation Modal
  const [actionModal, setActionModal] = useState<{
    partner: Partner;
    action: PartnerAction;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPartners = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/partners`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch partners");
      const data = await res.json();
      setPartners(data.partners || []);
    } catch (err: any) {
      console.error("Fetch partners error:", err);
      setError("Unable to load partner directory. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  const handleActionConfirm = async () => {
    if (!actionModal) return;
    const { partner, action } = actionModal;
    setActionLoading(true);
    const token = getToken();

    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/partners/${partner._id}/${action}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to ${action} partner`);
      }

      await fetchPartners();
      setActionModal(null);
    } catch (err: any) {
      console.error("Partner action error:", err);
      alert(err.message || "Failed to update partner status");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredPartners = useMemo(() => {
    return partners
      .filter((p) => {
        const status = p.partnerProfile?.onboardingStatus?.toLowerCase() || "unknown";
        if (statusFilter === "pending") return status === "pending";
        if (statusFilter === "approved") return status === "approved";
        if (statusFilter === "other") return ["rejected", "suspended"].includes(status);
        return true;
      })
      .filter((p) => {
        if (typeFilter === "all") return true;
        return p.partnerProfile?.partnerType?.toLowerCase() === typeFilter.toLowerCase();
      })
      .filter((p) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          p.name?.toLowerCase().includes(q) ||
          p.email?.toLowerCase().includes(q) ||
          p.mobile?.toLowerCase().includes(q) ||
          p.partnerProfile?.organizationName?.toLowerCase().includes(q)
        );
      });
  }, [partners, statusFilter, typeFilter, searchQuery]);

  const totalPages = Math.ceil(filteredPartners.length / pageSize) || 1;
  const paginatedPartners = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPartners.slice(start, start + pageSize);
  }, [filteredPartners, currentPage]);

  const pendingCount = partners.filter(
    (p) => p.partnerProfile?.onboardingStatus === "pending"
  ).length;
  const approvedCount = partners.filter(
    (p) => p.partnerProfile?.onboardingStatus === "approved"
  ).length;
  const otherCount = partners.length - pendingCount - approvedCount;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Partner Management</h2>
          <p className="text-xs text-white/50 mt-1">
            Review and oversee Edu Leader and Edu Mitra institutional partner onboarding.
          </p>
        </div>
        <button
          onClick={fetchPartners}
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
              : "text-white/60 hover:text-white"
          }`}
        >
          <span>All Partners</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 text-current">
            {partners.length}
          </span>
        </button>

        <button
          onClick={() => {
            setStatusFilter("pending");
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            statusFilter === "pending"
              ? "bg-amber-500 text-black shadow-md"
              : "text-white/60 hover:text-white"
          }`}
        >
          <span>Pending Review</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 text-current">
            {pendingCount}
          </span>
        </button>

        <button
          onClick={() => {
            setStatusFilter("approved");
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            statusFilter === "approved"
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
            setStatusFilter("other");
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            statusFilter === "other"
              ? "bg-white/20 text-white shadow-md"
              : "text-white/60 hover:text-white"
          }`}
        >
          <span>Suspended / Rejected</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/10 text-current">
            {otherCount}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar */}
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
            placeholder="Search by organization, name, email, or mobile..."
            className="w-full bg-[#0d0f12] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#c2a878]/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider">Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter partners by type"
            className="bg-[#0d0f12] border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-[#c2a878]/50"
          >
            <option value="all">All Partner Types</option>
            <option value="edu_mitra">Edu Mitra (Overseas Counselling)</option>
            <option value="edu_leader">Edu Leader (Institutional Rep)</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Partners List / Table */}
      <div className="bg-[#0d0f12] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : paginatedPartners.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-white/80">
                <thead className="bg-white/[0.03] text-[10px] font-black uppercase tracking-[0.16em] text-white/40 border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4">Organization & Contact</th>
                    <th className="px-6 py-4">Partner Type</th>
                    <th className="px-6 py-4">Designation</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedPartners.map((p) => {
                    const status = p.partnerProfile?.onboardingStatus?.toLowerCase() || "unknown";
                    const isPending = status === "pending";
                    const isApproved = status === "approved";
                    const isSuspended = status === "suspended";
                    const isRejected = status === "rejected";

                    return (
                      <tr key={p._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-white text-sm">
                            {p.partnerProfile?.organizationName || "Independent"}
                          </div>
                          <div className="text-white/70 font-medium mt-0.5">{p.name}</div>
                          <div className="text-[11px] text-white/40 flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1">
                              <Mail size={11} /> {p.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone size={11} /> {p.mobile || "N/A"}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-white/5 text-white/80 border border-white/10">
                            {p.partnerProfile?.partnerType === "edu_mitra"
                              ? "Edu Mitra"
                              : p.partnerProfile?.partnerType === "edu_leader"
                              ? "Edu Leader"
                              : p.partnerProfile?.partnerType || "Partner"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-white font-medium">
                            {p.partnerProfile?.designation || "N/A"}
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
                            {status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedPartner(p)}
                              className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                              title="View details"
                            >
                              <Eye size={15} />
                            </button>

                            {isPending && (
                              <>
                                <button
                                  onClick={() => setActionModal({ partner: p, action: "approve" })}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors"
                                >
                                  <CheckCircle size={12} />
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => setActionModal({ partner: p, action: "reject" })}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors"
                                >
                                  <XCircle size={12} />
                                  <span>Reject</span>
                                </button>
                              </>
                            )}

                            {isApproved && (
                              <button
                                onClick={() => setActionModal({ partner: p, action: "suspend" })}
                                className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors"
                              >
                                <AlertTriangle size={12} />
                                <span>Suspend</span>
                              </button>
                            )}

                            {(isSuspended || isRejected) && (
                              <button
                                onClick={() => setActionModal({ partner: p, action: "approve" })}
                                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors"
                              >
                                <CheckCircle size={12} />
                                <span>Reactivate</span>
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
              {paginatedPartners.map((p) => {
                const status = p.partnerProfile?.onboardingStatus?.toLowerCase() || "unknown";
                const isPending = status === "pending";
                const isApproved = status === "approved";

                return (
                  <div key={p._id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-white">
                          {p.partnerProfile?.organizationName || p.name}
                        </div>
                        <div className="text-xs text-white/50">{p.name} • {p.email}</div>
                      </div>
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isApproved
                            ? "bg-emerald-500/15 text-emerald-400"
                            : isPending
                            ? "bg-amber-500/15 text-amber-300"
                            : "bg-rose-500/15 text-rose-400"
                        }`}
                      >
                        {status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span>Type: {p.partnerProfile?.partnerType || "N/A"}</span>
                      <span>{p.partnerProfile?.designation || ""}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <button
                        onClick={() => setSelectedPartner(p)}
                        className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold flex-1"
                      >
                        Details
                      </button>

                      {isPending && (
                        <>
                          <button
                            onClick={() => setActionModal({ partner: p, action: "approve" })}
                            className="px-3 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold flex-1"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setActionModal({ partner: p, action: "reject" })}
                            className="px-3 py-2 bg-rose-500/20 text-rose-400 rounded-xl text-xs font-bold flex-1"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {isApproved && (
                        <button
                          onClick={() => setActionModal({ partner: p, action: "suspend" })}
                          className="px-3 py-2 bg-amber-500/20 text-amber-300 rounded-xl text-xs font-bold flex-1"
                        >
                          Suspend
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 text-xs text-white/50">
              <div>
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, filteredPartners.length)} of{" "}
                {filteredPartners.length} partners
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
            <Briefcase size={36} className="mx-auto text-white/20" />
            <h3 className="text-sm font-bold text-white">No Partners Match Filters</h3>
            <p className="text-xs text-white/40 max-w-sm mx-auto">
              There are currently no partner accounts under the selected filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!actionModal}
        title={
          actionModal?.action === "approve"
            ? `Approve Partner ${actionModal.partner.name}?`
            : actionModal?.action === "reject"
            ? `Reject Application for ${actionModal?.partner.name}?`
            : `Suspend Partner ${actionModal?.partner.name}?`
        }
        description={
          actionModal?.action === "approve"
            ? `Approving this partner grants them active access to their respective portal (${
                actionModal?.partner.partnerProfile?.partnerType || "partner"
              }) and permits them to organize seminars or manage consultants.`
            : actionModal?.action === "reject"
            ? "Rejecting this partner application will block their account access. They will need to re-apply if they wish to partner with EduLeader Global."
            : "Suspending this partner immediately disables their portal access and associated active privileges."
        }
        confirmLabel={
          actionModal?.action === "approve"
            ? "Approve Partner"
            : actionModal?.action === "reject"
            ? "Reject Partner"
            : "Suspend Partner"
        }
        cancelLabel="Cancel"
        variant={actionModal?.action === "approve" ? "primary" : "danger"}
        isLoading={actionLoading}
        onConfirm={handleActionConfirm}
        onClose={() => setActionModal(null)}
      />

      {/* Partner Details Modal */}
      {selectedPartner && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setSelectedPartner(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#0d0f12] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Partner Details
              </h3>
              <button
                onClick={() => setSelectedPartner(null)}
                className="text-white/40 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#c2a878] tracking-widest">
                  Organization
                </span>
                <h4 className="text-lg font-black text-white">
                  {selectedPartner.partnerProfile?.organizationName || "Independent"}
                </h4>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/40">Contact Person</span>
                  <span className="font-semibold text-white">{selectedPartner.name}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/40">Email</span>
                  <span className="font-semibold text-white">{selectedPartner.email}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/40">Phone / Mobile</span>
                  <span className="font-semibold text-white">{selectedPartner.mobile || "N/A"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/40">Partner Type</span>
                  <span className="font-bold text-[#c2a878] uppercase">
                    {selectedPartner.partnerProfile?.partnerType || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-white/40">Designation</span>
                  <span className="font-semibold text-white">
                    {selectedPartner.partnerProfile?.designation || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-white/40">Status</span>
                  <span className="font-bold uppercase text-white">
                    {selectedPartner.partnerProfile?.onboardingStatus || "unknown"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex justify-end">
              <button
                onClick={() => setSelectedPartner(null)}
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
