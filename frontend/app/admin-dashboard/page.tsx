"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, getToken } from "@/app/lib/token";
import { Video, Calendar, Clock, User, X, CheckCircle } from "lucide-react";

interface CounsellingSession {
  _id: string;
  sessionId: string;
  meetingId: string;
  date: string;
  time: string;
  endTime: string;
  userName: string;
  userEmail: string;
  consultantName: string;
  status: "booked" | "completed" | "cancelled";
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"consultants" | "active" | "past">("active");
  const [sessions, setSessions] = useState<CounsellingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

  const [authChecked, setAuthChecked] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const user = getUser();

      if (!user) {
        router.replace("/auth/login");
        return;
      }

      if (user.role !== "admin") {
        router.replace("/auth/login");
        return;
      }

      const token = getToken();

      if (!token) {
        router.replace("/auth/login");
        return;
      }

      setAuthChecked(true);
      fetchSessions();
    };

    checkAuth();
  }, [router]);

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/bookings?bookingType=counselling`, {
        headers: {
          "Authorization": `Bearer ${getToken()}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSessions(data.bookings || data || []);
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelSession = async (sessionId: string) => {
    if (!window.confirm("Cancel this counselling session?")) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/bookings/cancel/${sessionId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      
      if (response.ok) {
        setSessions(prev =>
          prev.map(s =>
            s._id === sessionId
              ? { ...s, status: "cancelled" }
              : s
          )
        );
      }
    } catch (err) {
      console.error("Error cancelling session:", err);
    }
  };

  const isSessionPast = (session: CounsellingSession) => {
    try {
      const [day, month, year] = session.date.split("/"); // if DD/MM/YYYY
      const formattedDate = `${year}-${month}-${day}`;

      const sessionDateTime = new Date(`${formattedDate} ${session.endTime}`);
      return sessionDateTime < new Date();
    } catch {
      return false;
    }
  };

  const activeSessions = sessions.filter(
    s =>
      s.status?.toLowerCase() === "booked" &&
      !isSessionPast(s)
  );

  const pastSessions = sessions.filter(
    s =>
      ["completed", "cancelled"].includes(s.status?.toLowerCase()) ||
      isSessionPast(s)
  );

  if (!mounted) {
    return null; // prevents hydration mismatch
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-10 bg-[#c2a878] rounded-full" />
            <h1 className="text-4xl font-black uppercase italic font-serif tracking-tighter">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em]">
            Counselling Session Management
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-white/5">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-6 py-3 text-sm font-black uppercase tracking-wider transition-all ${
              activeTab === "active"
                ? "text-[#c2a878] border-b-2 border-[#c2a878]"
                : "text-gray-500 hover:text-white"
            }`}
          >
            Active Sessions ({activeSessions.length})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`px-6 py-3 text-sm font-black uppercase tracking-wider transition-all ${
              activeTab === "past"
                ? "text-[#c2a878] border-b-2 border-[#c2a878]"
                : "text-gray-500 hover:text-white"
            }`}
          >
            Past Sessions ({pastSessions.length})
          </button>
          <button
            onClick={() => router.push("/admin-dashboard/slots")}
            className={`px-6 py-3 text-sm font-black uppercase tracking-wider transition-all text-gray-500 hover:text-white`}
          >
            Manage Slots
          </button>
          <button
            onClick={() => router.push("/admin/consultants")}
            className={`px-6 py-3 text-sm font-black uppercase tracking-wider transition-all text-gray-500 hover:text-white`}
          >
            Counsellors
          </button>
        </div>

        {/* Active Sessions */}
        {activeTab === "active" && (
          <div className="space-y-4">
            {activeSessions.length > 0 ? (
              activeSessions.map((session) => (
                <div
                  key={session._id}
                  className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-[#c2a878]/[0.02] border border-[#c2a878]/10 rounded-2xl hover:bg-[#c2a878]/[0.04] transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <User size={16} className="text-[#c2a878]" />
                      <span className="text-white font-bold">{session.userName || session.userEmail}</span>
                      <span className="text-[8px] px-2 py-0.5 bg-[#c2a878] text-black font-black uppercase rounded-full">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-[#c2a878]" />
                        <span>{session.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="text-[#c2a878]" />
                        <span>{session.time} - {session.endTime}</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-1">
                      Meeting ID: <span className="text-[#c2a878] font-mono">{session.meetingId}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => router.push(`/meeting/${session.sessionId}`)}
                      className="flex items-center gap-2 px-6 py-3 bg-[#c2a878] text-black rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-yellow-100 transition-all active:scale-95"
                    >
                      <Video size={14} /> Join Meeting
                    </button>
                    <button
                      onClick={() => cancelSession(session._id)}
                      className="p-3 text-gray-700 hover:text-rose-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center rounded-2xl border border-dashed border-white/5">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700">
                  No active sessions scheduled
                </p>
              </div>
            )}
          </div>
        )}

        {/* Past Sessions */}
        {activeTab === "past" && (
          <div className="space-y-4">
            {pastSessions.length > 0 ? (
              pastSessions.map((session) => (
                <div
                  key={session._id}
                  className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-white/[0.01] border border-white/5 rounded-2xl opacity-60"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <User size={16} className="text-gray-500" />
                      <span className="text-white font-bold">{session.userName || session.userEmail}</span>
                      <span className={`text-[8px] px-2 py-0.5 font-black uppercase rounded-full ${
                        session.status === "completed"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {session.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} />
                        <span>{session.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={12} />
                        <span>{session.time} - {session.endTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-wider">
                    {session.status === "completed" ? "Session Complete" : "Cancelled"}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center rounded-2xl border border-dashed border-white/5">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700">
                  No past sessions found
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
