"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, getToken } from "@/app/lib/token";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import axios from "axios";

interface AdminCollege {
  _id: string;
  collegeId: string;
  name: string;
  city?: string;
  state?: string;
  status: string;
}

export default function CollegesList() {
  const router = useRouter();
  const [colleges, setColleges] = useState<AdminCollege[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUser();
    const token = getToken();
    if (!user || user.role !== "admin" || !token) {
      router.replace("/auth/login");
      return;
    }
    fetchColleges(token);
  }, [router]);

  const fetchColleges = async (token: string) => {
    try {
      const res = await axios.get<{ colleges: AdminCollege[] }>(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011"}/api/admin/colleges`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setColleges(res.data.colleges || []);
    } catch (err) {
      console.error("Failed to load colleges", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#05070a] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <Link href="/admin-dashboard" className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition">
              <ArrowLeft size={20} />
            </Link>
            <div className="w-2 h-10 bg-[#c2a878] rounded-full" />
            <div>
              <h1 className="text-3xl font-black uppercase italic tracking-tighter">Colleges</h1>
              <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mt-1">Master Data</p>
            </div>
          </div>
          <button onClick={() => router.push("/admin/colleges/create")} className="flex items-center gap-2 px-4 py-2 bg-[#c2a878] text-black font-bold uppercase text-xs rounded hover:bg-[#b09665]">
            <Plus size={16} /> Add College
          </button>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">College Name</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {colleges.map((c) => (
                <tr key={c._id} className="hover:bg-white/[0.02]">
                  <td className="px-6 py-4 font-mono text-[#c2a878] text-xs">{c.collegeId}</td>
                  <td className="px-6 py-4 font-bold">{c.name}</td>
                  <td className="px-6 py-4">{c.city}, {c.state}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                      c.status === "ACTIVE" ? "bg-green-900/30 text-green-400" :
                      c.status === "PENDING" ? "bg-amber-900/30 text-amber-300" :
                      "bg-red-900/30 text-red-400"
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => router.push(`/admin/colleges/${c._id}`)} className="text-[#c2a878] hover:underline text-xs font-bold uppercase tracking-wider">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
              {colleges.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-xs">No colleges found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
