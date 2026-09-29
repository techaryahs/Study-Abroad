"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { getToken } from "@/app/lib/token";
import ConfirmModal from "@/components/admin/ConfirmModal";
import {
  Users,
  Search,
  Video,
  VideoOff,
  User,
  Shield,
  Star,
  RefreshCw,
  Mail,
  ChevronRight,
  CheckCircle2,
  X,
  AlertCircle,
  Eye,
} from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

interface Consultant {
  _id: string;
  name: string;
  email: string;
  role: string;
  expertise: string;
  videoCallEnabled: boolean;
  isPremium: boolean;
}

export default function AdminCounsellorsPage() {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVideo, setFilterVideo] = useState<"all" | "enabled" | "disabled">("all");
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);

  // Toggle Confirm Modal
  const [togglingConsultant, setTogglingConsultant] = useState<Consultant | null>(null);
  const [toggleLoading, setToggleLoading] = useState(false);

  const fetchConsultants = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/consultants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch consultants");
      const data = await response.json();
      setConsultants(data.consultants || []);
    } catch (err: any) {
      console.error("Error fetching consultants:", err);
      setError("Unable to load counsellors directory. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConsultants();
  }, [fetchConsultants]);

  const handleToggleConfirm = async () => {
    if (!togglingConsultant) return;
    setToggleLoading(true);
    const token = getToken();

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/admin/consultants/${togglingConsultant._id}/toggle-video`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to toggle access");
      const data = await response.json();

      setConsultants((prev) =>
        prev.map((c) =>
          c._id === togglingConsultant._id
            ? { ...c, videoCallEnabled: data.videoCallEnabled }
            : c
        )
      );
      setTogglingConsultant(null);
    } catch (err) {
      console.error("Error toggling video access:", err);
      alert("Failed to change counsellor status. Please try again.");
    } finally {
      setToggleLoading(false);
    }
  };

  const filteredConsultants = useMemo(() => {
    return consultants
      .filter((c) => {
        if (filterVideo === "enabled") return c.videoCallEnabled;
        if (filterVideo === "disabled") return !c.videoCallEnabled;
        return true;
      })
      .filter((c) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          c.name?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.expertise?.toLowerCase().includes(q) ||
          c.role?.toLowerCase().includes(q)
        );
      });
  }, [consultants, filterVideo, searchQuery]);

  const enabledCount = consultants.filter((c) => c.videoCallEnabled).length;
  const disabledCount = consultants.length - enabledCount;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Counsellor Management</h2>
          <p className="text-xs text-white/50 mt-1">
            Control video calling privileges, mentor tiers, and counsellor platform access.
          </p>
        </div>
        <button
          onClick={fetchConsultants}
          disabled={loading}
          className="flex items-center gap-2 self-start sm:self-auto px-3.5 py-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/80 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-[#c2a878]" : ""} />
          <span>Refresh Directory</span>
        </button>
      </div>

      {/* Metric Pills / Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-[#0d0f12] border border-white/[0.08]">
          <button
            onClick={() => setFilterVideo("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterVideo === "all"
                ? "bg-[#c2a878] text-black shadow-md"
                : "text-white/60 hover:text-white"
            }`}
          >
            All Counsellors ({consultants.length})
          </button>
          <button
            onClick={() => setFilterVideo("enabled")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterVideo === "enabled"
                ? "bg-emerald-500 text-black shadow-md"
                : "text-white/60 hover:text-white"
            }`}
          >
            Video Enabled ({enabledCount})
          </button>
          <button
            onClick={() => setFilterVideo("disabled")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterVideo === "disabled"
                ? "bg-white/20 text-white shadow-md"
                : "text-white/60 hover:text-white"
            }`}
          >
            Disabled ({disabledCount})
          </button>
        </div>

        <div className="relative flex-1 min-w-[240px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or domain expertise..."
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

      {/* Directory Table / Cards */}
      <div className="bg-[#0d0f12] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredConsultants.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-white/80">
                <thead className="bg-white/[0.03] text-[10px] font-black uppercase tracking-[0.16em] text-white/40 border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4">Counsellor</th>
                    <th className="px-6 py-4">Role & Domain</th>
                    <th className="px-6 py-4">Status & Tiers</th>
                    <th className="px-6 py-4">Video Calling</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredConsultants.map((c) => (
                    <tr key={c._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#c2a878]/10 border border-[#c2a878]/20 flex items-center justify-center text-[#c2a878] font-bold shrink-0">
                            <User size={16} />
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">{c.name}</div>
                            <div className="text-[11px] text-white/40 flex items-center gap-1.5 mt-0.5">
                              <Mail size={11} />
                              <span>{c.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-semibold text-white capitalize">{c.role || "Counsellor"}</div>
                        <div className="text-[11px] text-[#c2a878] mt-0.5">{c.expertise || "General Admissions"}</div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {c.isPremium ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#c2a878]/15 text-[#c2a878] border border-[#c2a878]/30">
                              <Star size={10} className="fill-[#c2a878]" />
                              <span>Premium</span>
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] uppercase font-bold bg-white/5 text-white/40">
                              Standard
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            c.videoCallEnabled
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-white/5 text-white/40 border border-white/10"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              c.videoCallEnabled ? "bg-emerald-400" : "bg-white/40"
                            }`}
                          />
                          <span>{c.videoCallEnabled ? "Enabled" : "Disabled"}</span>
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedConsultant(c)}
                            className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                            title="View counsellor details"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            onClick={() => setTogglingConsultant(c)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all ${
                              c.videoCallEnabled
                                ? "bg-white/5 hover:bg-rose-500/20 text-white/60 hover:text-rose-400 border border-white/10"
                                : "bg-[#c2a878] hover:bg-[#d4ba8a] text-black font-bold"
                            }`}
                          >
                            {c.videoCallEnabled ? (
                              <>
                                <VideoOff size={12} />
                                <span>Disable Video</span>
                              </>
                            ) : (
                              <>
                                <Video size={12} />
                                <span>Enable Video</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-white/5">
              {filteredConsultants.map((c) => (
                <div key={c._id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-white">{c.name}</div>
                      <div className="text-xs text-white/40">{c.email}</div>
                    </div>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        c.videoCallEnabled
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-white/5 text-white/40"
                      }`}
                    >
                      {c.videoCallEnabled ? "Video Active" : "Video Disabled"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-white/60 font-semibold">{c.expertise}</span>
                    {c.isPremium && (
                      <span className="text-[10px] text-[#c2a878] font-bold uppercase">
                        • Premium
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => setSelectedConsultant(c)}
                      className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold flex-1"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => setTogglingConsultant(c)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 flex-1 ${
                        c.videoCallEnabled
                          ? "bg-rose-500/20 text-rose-300"
                          : "bg-[#c2a878] text-black"
                      }`}
                    >
                      {c.videoCallEnabled ? "Disable" : "Enable Video"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="py-20 text-center space-y-3">
            <Users size={36} className="mx-auto text-white/20" />
            <h3 className="text-sm font-bold text-white">No Counsellors Match</h3>
            <p className="text-xs text-white/40 max-w-sm mx-auto">
              Try adjusting your search terms or filters above.
            </p>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Toggle */}
      <ConfirmModal
        isOpen={!!togglingConsultant}
        title={
          togglingConsultant?.videoCallEnabled
            ? `Disable Video Access for ${togglingConsultant.name}?`
            : `Enable Video Access for ${togglingConsultant?.name}?`
        }
        description={
          togglingConsultant?.videoCallEnabled
            ? "Disabling video call access prevents students from booking video appointments with this counsellor until re-enabled."
            : "Enabling video call access will allow this counsellor to conduct live video counselling sessions with students."
        }
        confirmLabel={togglingConsultant?.videoCallEnabled ? "Disable Access" : "Enable Access"}
        cancelLabel="Cancel"
        variant={togglingConsultant?.videoCallEnabled ? "danger" : "primary"}
        isLoading={toggleLoading}
        onConfirm={handleToggleConfirm}
        onClose={() => setTogglingConsultant(null)}
      />

      {/* Counsellor Profile Detail Modal */}
      {selectedConsultant && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setSelectedConsultant(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#0d0f12] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Counsellor Profile
              </h3>
              <button
                onClick={() => setSelectedConsultant(null)}
                className="text-white/40 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#c2a878]/10 border border-[#c2a878]/20 flex items-center justify-center text-[#c2a878] font-bold text-lg">
                <User size={24} />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">{selectedConsultant.name}</h4>
                <p className="text-xs text-white/50">{selectedConsultant.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-white/70">
                    {selectedConsultant.role || "Counsellor"}
                  </span>
                  {selectedConsultant.isPremium && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#c2a878]/15 text-[#c2a878]">
                      Premium
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-white/40">Domain / Expertise</span>
                <span className="font-semibold text-white">{selectedConsultant.expertise || "N/A"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-white/40">Video Call Status</span>
                <span
                  className={`font-bold ${
                    selectedConsultant.videoCallEnabled ? "text-emerald-400" : "text-white/50"
                  }`}
                >
                  {selectedConsultant.videoCallEnabled ? "Active & Enabled" : "Disabled"}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-white/40">System Record ID</span>
                <span className="font-mono text-white/60">{selectedConsultant._id}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex justify-end">
              <button
                onClick={() => setSelectedConsultant(null)}
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
