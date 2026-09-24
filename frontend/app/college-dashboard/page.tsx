"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, getToken } from "@/app/lib/token";
import axios from "axios";
import { CheckCircle, XCircle, Search, Calendar, QrCode } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SeminarQRModal from "@/components/partnership/seminar/SeminarQRModal";

export default function CollegeCoordinatorDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [seminars, setSeminars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrSeminar, setQrSeminar] = useState<any>(null);

  // Verification modal state
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedSeminar, setSelectedSeminar] = useState<any>(null);
  const [verifyRemarks, setVerifyRemarks] = useState("");
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const user = getUser();
    const token = getToken();
    if (!user || user.role !== "college_coordinator" || !token) {
      router.replace("/auth/login");
      return;
    }
    fetchDashboardData(token);
  }, [router]);

  const fetchDashboardData = async (token: string) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [profileRes, seminarsRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011"}/api/college-coordinator/profile`, { headers }),
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011"}/api/college-coordinator/seminars`, { headers })
      ]);
      setProfile(profileRes.data.profile);
      setSeminars(seminarsRes.data.seminars || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!selectedSeminar) return;
    setVerifying(true);
    try {
      const headers = { Authorization: `Bearer ${getToken()}` };
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011"}/api/college-coordinator/seminars/${selectedSeminar._id}/attendance`,
        { remarks: verifyRemarks },
        { headers }
      );
      
      // Update local state
      setSeminars(prev => prev.map((s: any) => s._id === selectedSeminar._id ? { ...s, attendanceVerifiedStatus: "VERIFIED", attendanceRemarks: verifyRemarks } : s));
      setShowVerifyModal(false);
      setVerifyRemarks("");
    } catch (err) {
      console.error(err);
      alert("Failed to verify attendance.");
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#05070a] flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#05070a] text-white flex flex-col">
      <Navbar />
      <div className="flex-grow max-w-6xl w-full mx-auto px-4 py-16">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter">College Coordinator</h1>
          <p className="text-[11px] font-black text-[#c2a878] uppercase tracking-widest mt-1">
            {profile?.collegeId?.name || "College Dashboard"}
          </p>
        </div>

        {/* Seminars List */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2">
              <Calendar size={18} className="text-[#c2a878]" /> College Seminars
            </h2>
          </div>
          
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
              <tr>
                <th className="px-6 py-4">Seminar</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Venue</th>
                <th className="px-6 py-4">Attendance</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {seminars.map((s: any) => (
                <tr key={s._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">{s.title || "Seminar"}</div>
                    <div className="text-[10px] font-mono text-[#c2a878] mt-1">{s.seminarId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-300">{new Date(s.date).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500 mt-1">{s.startTime} - {s.endTime}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-300">{s.venue || "TBD"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${s.attendanceVerifiedStatus === 'VERIFIED' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                      {s.attendanceVerifiedStatus || "PENDING"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {s.status === "APPROVED" && (
                      <button 
                        onClick={() => setQrSeminar(s)}
                        className="px-3 py-1 bg-[#c2a878]/20 text-[#c2a878] font-bold uppercase tracking-wider text-[10px] rounded hover:bg-[#c2a878]/40 border border-[#c2a878]/30 inline-flex items-center gap-1"
                      >
                        <QrCode size={12} /> QR
                      </button>
                    )}
                    {s.attendanceVerifiedStatus !== "VERIFIED" && s.status === "APPROVED" && (
                      <button 
                        onClick={() => { setSelectedSeminar(s); setShowVerifyModal(true); }}
                        className="px-3 py-1 bg-[#c2a878] text-black font-bold uppercase tracking-wider text-[10px] rounded hover:bg-[#b09665] ml-2"
                      >
                        Verify
                      </button>
                    )}
                    {s.attendanceVerifiedStatus === "VERIFIED" && (
                      <span className="text-green-400 text-xs font-bold inline-flex justify-end items-center gap-1 ml-2">
                        <CheckCircle size={14} /> Verified
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {seminars.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm font-bold uppercase tracking-widest">
                    No seminars scheduled for this college yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />

      {qrSeminar && (
        <SeminarQRModal seminar={qrSeminar} onClose={() => setQrSeminar(null)} />
      )}

      {/* Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0d0f12] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-black text-white mb-2">Verify Attendance</h2>
            <p className="text-sm text-gray-400 mb-6">
              You are verifying attendance for <strong>{selectedSeminar?.seminarId}</strong>.
            </p>
            
            <div className="mb-4">
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Remarks / Observations</label>
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded p-3 text-sm text-white resize-none h-24 focus:border-[#c2a878] focus:outline-none"
                placeholder="Any remarks about the seminar attendance..."
                value={verifyRemarks}
                onChange={e => setVerifyRemarks(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowVerifyModal(false)}
                className="px-4 py-2 text-xs font-bold uppercase bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleVerify}
                disabled={verifying}
                className="px-4 py-2 text-xs font-bold uppercase bg-[#c2a878] text-black hover:bg-[#b09665] rounded disabled:opacity-50"
              >
                {verifying ? "Verifying..." : "Confirm Verification"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
