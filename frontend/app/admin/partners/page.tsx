"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getUser } from "@/app/lib/token";
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, Users, Eye } from "lucide-react";

export default function AdminPartners() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = typeof window !== "undefined" ? require("next/navigation").useRouter() : null;

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${BACKEND_URL}/api/admin/partners`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch partners");

      setPartners(data.partners || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: "approve" | "reject" | "suspend") => {
    if (!confirm(`Are you sure you want to ${action} this partner?`)) return;

    try {
      const token = getToken();
      const res = await fetch(`${BACKEND_URL}/api/admin/partners/${id}/${action}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed to ${action} partner`);

      fetchPartners(); // refresh
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#05070a] flex items-center justify-center text-[#c2a878]">Loading...</div>;

  const pending = partners.filter(p => p.partnerProfile?.onboardingStatus === "pending");
  const approved = partners.filter(p => p.partnerProfile?.onboardingStatus === "approved");
  const other = partners.filter(p => !["pending", "approved"].includes(p.partnerProfile?.onboardingStatus));

  return (
    <div className="min-h-screen bg-[#05070a] text-white py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => router?.push("/admin-dashboard")} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-black uppercase italic tracking-tighter text-[#c2a878]">Partner Management</h1>
              <p className="text-white/40 text-sm font-bold uppercase tracking-widest mt-1">Review and manage partner applications</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-center">
              <div className="text-2xl font-black text-[#c2a878]">{pending.length}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/50">Pending</div>
            </div>
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-center">
              <div className="text-2xl font-black text-emerald-400">{approved.length}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/50">Approved</div>
            </div>
          </div>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm">{error}</div>}

        <div className="space-y-8">
          <PartnerSection title="Pending Applications" partners={pending} onAction={handleAction} />
          <PartnerSection title="Approved Partners" partners={approved} onAction={handleAction} />
          <PartnerSection title="Other (Rejected / Suspended)" partners={other} onAction={handleAction} />
        </div>
      </div>
    </div>
  );
}

function PartnerSection({ title, partners, onAction }: { title: string, partners: any[], onAction: (id: string, action: any) => void }) {
  if (partners.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-bold uppercase tracking-widest mb-4 border-b border-white/10 pb-2">{title}</h2>
      <div className="grid gap-4">
        {partners.map(p => (
          <div key={p._id} className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <div className="text-sm font-bold uppercase tracking-widest text-[#c2a878]">{p.partnerProfile?.organizationName || "Independent"}</div>
                <div className="text-lg font-black">{p.name}</div>
                <div className="text-white/60 text-sm mt-1">{p.email} • {p.mobile}</div>
              </div>
              <div className="text-sm">
                <div className="text-white/40 uppercase tracking-widest text-[10px] mb-1">Details</div>
                <div>Type: <span className="text-white">{p.partnerProfile?.partnerType || "Unknown"}</span></div>
                <div>Designation: <span className="text-white">{p.partnerProfile?.designation || "N/A"}</span></div>
                <div>Status: <span className={`font-bold ${
                  p.partnerProfile?.onboardingStatus === "approved" ? "text-emerald-400" :
                  p.partnerProfile?.onboardingStatus === "pending" ? "text-yellow-400" : "text-red-400"
                }`}>{p.partnerProfile?.onboardingStatus?.toUpperCase()}</span></div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {p.partnerProfile?.onboardingStatus === "pending" && (
                <>
                  <button onClick={() => onAction(p._id, "approve")} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-xl text-xs font-bold uppercase tracking-wider transition">
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button onClick={() => onAction(p._id, "reject")} className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl text-xs font-bold uppercase tracking-wider transition">
                    <XCircle size={14} /> Reject
                  </button>
                </>
              )}
              {p.partnerProfile?.onboardingStatus === "approved" && (
                <button onClick={() => onAction(p._id, "suspend")} className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 rounded-xl text-xs font-bold uppercase tracking-wider transition">
                  <AlertTriangle size={14} /> Suspend
                </button>
              )}
              {["rejected", "suspended"].includes(p.partnerProfile?.onboardingStatus) && (
                <button onClick={() => onAction(p._id, "approve")} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-xl text-xs font-bold uppercase tracking-wider transition">
                  <CheckCircle size={14} /> Reactivate (Approve)
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
