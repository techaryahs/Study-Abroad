"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, getToken } from "@/app/lib/token";
import { LogOut, ArrowLeft, CheckCircle, XCircle, Search, Eye } from "lucide-react";
import Link from "next/link";

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

export default function SeminarApprovals() {
  const router = useRouter();
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");
  
  const [selectedSeminar, setSelectedSeminar] = useState<Seminar | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const user = getUser();
    const token = getToken();
    if (!user || user.role !== "admin" || !token) {
      router.replace("/auth/login");
      return;
    }
    fetchSeminars(token);
  }, [router]);

  const fetchSeminars = async (token: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/seminars`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setSeminars(data.seminars || []);
      }
    } catch (err) {
      console.error("Failed to fetch seminars:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!window.confirm("Are you sure you want to approve this seminar?")) return;
    setProcessing(true);
    try {
      const token = getToken();
      const res = await fetch(`${BACKEND_URL}/api/admin/seminars/${id}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setSeminars(prev => prev.map(s => s._id === id ? { ...s, status: "APPROVED" } : s));
      } else {
        alert("Failed to approve seminar");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    setProcessing(true);
    try {
      const token = getToken();
      const res = await fetch(`${BACKEND_URL}/api/admin/seminars/${selectedSeminar?._id}/reject`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ reason: rejectReason })
      });
      if (res.ok) {
        setSeminars(prev => prev.map(s => s._id === selectedSeminar?._id ? { ...s, status: "REJECTED", rejectionReason: rejectReason } : s));
        setShowRejectModal(false);
        setRejectReason("");
        setSelectedSeminar(null);
      } else {
        alert("Failed to reject seminar");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const filteredSeminars = seminars.filter(s => filter === "ALL" || s.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070a] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#c2a878]/30 border-t-[#c2a878] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin-dashboard" className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition">
              <ArrowLeft size={20} />
            </Link>
            <div className="w-2 h-10 bg-[#c2a878] rounded-full" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-black uppercase italic font-serif tracking-tighter">
                Seminar Approvals
              </h1>
              <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] mt-1">
                Admin Dashboard / Partnership
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {["PENDING", "APPROVED", "REJECTED", "SCHEDULED", "ALL"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all whitespace-nowrap ${
                filter === f
                  ? "bg-[#c2a878] text-black"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 text-gray-500">
                <tr>
                  <th className="px-6 py-4">Seminar</th>
                  <th className="px-6 py-4">Date/Time</th>
                  <th className="px-6 py-4">Venue & Capacity</th>
                  <th className="px-6 py-4">Representatives</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSeminars.length > 0 ? filteredSeminars.map(s => (
                  <tr key={s._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{s.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{s.collegeName}</div>
                      <div className="text-[10px] font-mono text-[#c2a878] mt-1">{s.seminarId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-300">
                        {new Date(s.date).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {s.startTime} - {s.endTime}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-300">{s.venue || "TBD"}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Capacity: {s.expectedStudentStrength || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-400">
                        <span className="font-bold text-gray-300">EduLeader:</span> {s.eduLeaderRep || "N/A"}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        <span className="font-bold text-gray-300">EduMitra:</span> {s.eduMitraCounsellor || "N/A"}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-2">
                        Created by: {s.createdBy?.name || "Unknown"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        s.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                        s.status === "REJECTED" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                        s.status === "PENDING" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                        "bg-white/5 text-gray-400 border border-white/10"
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {s.status === "PENDING" && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(s._id)}
                            disabled={processing}
                            className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition"
                            title="Approve"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => { setSelectedSeminar(s); setShowRejectModal(true); }}
                            disabled={processing}
                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition"
                            title="Reject"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      )}
                      {s.status === "REJECTED" && s.rejectionReason && (
                        <div className="text-[10px] text-red-400 max-w-[150px] truncate ml-auto" title={s.rejectionReason}>
                          Reason: {s.rejectionReason}
                        </div>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-sm font-bold uppercase tracking-widest">
                      No seminars found for this filter
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#0d0f12] border border-white/8 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-lg font-black text-white mb-2">Reject Seminar</h2>
            <p className="text-sm text-gray-400 mb-6">
              Please provide a reason for rejecting the seminar "{selectedSeminar?.title}".
            </p>
            <textarea
              className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 resize-none mb-6"
              placeholder="Reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setShowRejectModal(false); setRejectReason(""); }}
                className="px-6 py-2 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={processing || !rejectReason.trim()}
                className="px-6 py-2 rounded-xl text-sm font-bold bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50 transition"
              >
                {processing ? "Rejecting..." : "Reject Seminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
