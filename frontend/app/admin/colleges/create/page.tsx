"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/app/lib/token";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

export default function CreateCollege() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    address: "",
    city: "",
    state: "",
    country: "",
    website: "",
    status: "ACTIVE"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011"}/api/admin/colleges`, formData, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      router.push("/admin/colleges");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error creating college");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-10">
          <Link href="/admin/colleges" className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Add College</h1>
        </div>

        {error && <div className="p-4 bg-red-900/30 text-red-400 mb-6 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">College Name *</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0d0f12] border border-white/10 rounded p-3 text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">College Code</label>
              <input type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full bg-[#0d0f12] border border-white/10 rounded p-3 text-white" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Address</label>
              <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-[#0d0f12] border border-white/10 rounded p-3 text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">City *</label>
              <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-[#0d0f12] border border-white/10 rounded p-3 text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">State *</label>
              <input required type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full bg-[#0d0f12] border border-white/10 rounded p-3 text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Country *</label>
              <input required type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full bg-[#0d0f12] border border-white/10 rounded p-3 text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-[#0d0f12] border border-white/10 rounded p-3 text-white">
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>
          <div className="pt-6 flex justify-end gap-4 border-t border-white/5">
            <Link href="/admin/colleges" className="px-6 py-3 border border-white/10 rounded text-gray-400 font-bold uppercase text-xs hover:bg-white/5">Cancel</Link>
            <button disabled={loading} type="submit" className="px-6 py-3 bg-[#c2a878] text-black font-bold uppercase text-xs rounded hover:bg-[#b09665] disabled:opacity-50">
              {loading ? "Creating..." : "Create College"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
