"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getToken } from "@/app/lib/token";
import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";
import axios from "axios";

export default function ManageCollege() {
  const router = useRouter();
  const params = useParams();
  const [college, setCollege] = useState<any>(null);
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showAddCoord, setShowAddCoord] = useState(false);
  const [coordForm, setCoordForm] = useState({ name: "", email: "", mobile: "", designation: "" });
  const [coordError, setCoordError] = useState("");
  const [tempPassword, setTempPassword] = useState("");

  useEffect(() => {
    fetchCollege();
  }, []);

  const fetchCollege = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011"}/api/admin/colleges/${params.id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setCollege(res.data.college);
      setCoordinators(res.data.coordinators || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoordinator = async (e: React.FormEvent) => {
    e.preventDefault();
    setCoordError("");
    setTempPassword("");
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011"}/api/admin/colleges/${params.id}/coordinators`, coordForm, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setTempPassword(res.data.tempPassword);
      fetchCollege();
    } catch (err: any) {
      setCoordError(err.response?.data?.message || "Failed to add coordinator");
    }
  };

  if (loading) return <div className="min-h-screen bg-[#05070a] text-white flex items-center justify-center">Loading...</div>;
  if (!college) return <div className="min-h-screen bg-[#05070a] text-white p-8">College not found.</div>;

  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-10">
          <Link href="/admin/colleges" className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">{college.name}</h1>
            <p className="text-[11px] font-black text-[#c2a878] uppercase tracking-widest mt-1">ID: {college.collegeId}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
              <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-b border-white/10 pb-4">Details</h2>
              <div className="space-y-4 text-sm text-gray-400">
                <p><span className="font-bold text-gray-500 uppercase text-xs block mb-1">Status</span> 
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${college.status === 'ACTIVE' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>{college.status}</span>
                </p>
                <p><span className="font-bold text-gray-500 uppercase text-xs block mb-1">City</span> {college.city}</p>
                <p><span className="font-bold text-gray-500 uppercase text-xs block mb-1">State</span> {college.state}</p>
                <p><span className="font-bold text-gray-500 uppercase text-xs block mb-1">Country</span> {college.country}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <h2 className="text-lg font-bold uppercase tracking-widest">Coordinators</h2>
                <button onClick={() => setShowAddCoord(!showAddCoord)} className="flex items-center gap-2 px-3 py-1 bg-white/10 text-white font-bold uppercase text-xs rounded hover:bg-white/20">
                  <UserPlus size={14} /> Add Coordinator
                </button>
              </div>
              
              {showAddCoord && (
                <form onSubmit={handleAddCoordinator} className="mb-8 bg-[#0d0f12] p-4 rounded-xl border border-white/10">
                  <h3 className="text-sm font-bold uppercase mb-4 text-[#c2a878]">New Coordinator</h3>
                  {coordError && <div className="p-3 bg-red-900/30 text-red-400 text-xs mb-4 rounded">{coordError}</div>}
                  {tempPassword && (
                    <div className="p-3 bg-green-900/30 text-green-400 text-xs mb-4 rounded border border-green-900/50">
                      Coordinator created successfully!<br/><br/>
                      <strong>Temporary Password: {tempPassword}</strong><br/>
                      Please share this password securely with the coordinator.
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Full Name *</label>
                      <input required type="text" value={coordForm.name} onChange={e => setCoordForm({...coordForm, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded p-2 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Email *</label>
                      <input required type="email" value={coordForm.email} onChange={e => setCoordForm({...coordForm, email: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded p-2 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Mobile</label>
                      <input type="text" value={coordForm.mobile} onChange={e => setCoordForm({...coordForm, mobile: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded p-2 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Designation</label>
                      <input type="text" value={coordForm.designation} onChange={e => setCoordForm({...coordForm, designation: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded p-2 text-sm text-white" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setShowAddCoord(false)} className="px-4 py-2 text-[10px] font-bold uppercase bg-white/5 rounded">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-[10px] font-bold uppercase bg-[#c2a878] text-black rounded">Save Coordinator</button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {coordinators.map((c: any) => (
                  <div key={c._id} className="flex items-center justify-between p-4 bg-[#0d0f12] rounded-xl border border-white/5">
                    <div>
                      <p className="font-bold">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase text-[#c2a878]">{c.partnerProfile?.designation || "Coordinator"}</p>
                    </div>
                  </div>
                ))}
                {coordinators.length === 0 && <p className="text-gray-500 text-xs">No coordinators assigned to this college.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
