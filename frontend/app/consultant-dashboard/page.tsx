"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Trash2, 
  Check, 
  X, 
  User,
  Video, 
  ArrowRight,
  TrendingUp,
  Clock,
  Mail,
  AlertCircle
} from "lucide-react";
import { getUser, getToken, clearAuth } from "@/app/lib/token";

interface Booking {
  _id: string;
  userEmail: string;
  status: "pending" | "accepted" | "rejected" | "booked" | "completed" | "cancelled";
  date: string;
  time: string;
  consultantVideoEnabled?: boolean;
  [key: string]: any;
}

const ConsultantDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

  useEffect(() => {
    const token = getToken();
    const storedUser = getUser();
    
    if (!token || !storedUser) {
      router.push("/auth/login");
      return;
    }
    
    setUser(storedUser);
    fetchBookings(storedUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBookings = async (currentUser: any) => {
    if (!currentUser?._id) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/bookings/consultant/${currentUser._id}?email=${currentUser.email}`, {
        headers: {
          "Authorization": `Bearer ${getToken()}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const bookingSummary = useMemo(() => {
    const pendingCount = bookings.filter((b) => b.status === "pending").length;
    const acceptedCount = bookings.filter((b) => b.status === "accepted" || b.status === "booked").length;
    const rejectedCount = bookings.filter((b) => b.status === "rejected").length;
    const totalBookings = bookings.length;

    return {
      totalBookings,
      pendingCount,
      acceptedCount,
      rejectedCount,
    };
  }, [bookings]);

  const updateBookingStatus = async (id: string, action: "accept" | "reject") => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/bookings/${id}/${action}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
          "Content-Type": "application/json"
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookings((prev) =>
          prev.map((b) =>
            b._id === id ? { ...b, status: data.booking.status } : b
          )
        );
      }
    } catch (err) {
      console.error("Error updating booking:", err);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!window.confirm("Permanently remove this booking record?")) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/bookings/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${getToken()}`
        }
      });
      
      if (response.ok) {
        setBookings(prev => prev.filter(b => b._id !== id));
      }
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070a] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-[#c2a878] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c2a878]/50">Synchronizing Manager...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        
        {/* Header Section */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-10 bg-[#c2a878] rounded-full" />
                 <h1 className="text-4xl md:text-5xl font-black uppercase italic font-serif tracking-tighter">Consultant Portal</h1>
              </div>
              <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] leading-relaxed">
                Authenticated Node: <span className="text-[#c2a878]">{user?.name || "Premium Member"}</span> • Global Advisory Access
              </p>
            </div>
            
            <button 
              onClick={() => router.push("/consultant-dashboard/edit-profile")}
              className="group flex items-center gap-4 px-8 py-4 bg-white/[0.02] border border-white/10 rounded-2xl hover:border-[#c2a878]/40 transition-all hover:bg-[#c2a878]/5"
            >
              <div className="p-2 rounded-xl bg-[#c2a878]/10 text-[#c2a878] group-hover:scale-110 transition-transform">
                <User size={18} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Edit Professional Profile</span>
              <ArrowRight size={14} className="text-gray-700 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Vital Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            { label: "Total Volume", value: bookingSummary.totalBookings, color: "text-white" },
            { label: "Action Required", value: bookingSummary.pendingCount, color: "text-amber-500" },
            { label: "Confirmed Sessions", value: bookingSummary.acceptedCount, color: "text-[#c2a878]" }
          ].map((stat, idx) => (
            <div key={idx} className="relative overflow-hidden p-8 bg-white/[0.01] border border-white/[0.05] rounded-3xl group hover:border-[#c2a878]/20 transition-colors">
               <div className="absolute top-0 right-0 w-24 h-24 bg-[#c2a878]/5 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2" />
               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 mb-2">{stat.label}</p>
               <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Requests Section */}
        <div className="grid grid-cols-1 gap-16">
          
          {/* Pending Approvals */}
          <section>
             <div className="flex items-center gap-4 mb-10">
                <AlertCircle size={20} className="text-amber-500" />
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/90">Incoming Requests</h2>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent" />
             </div>

             <div className="space-y-4">
                {bookings.filter((b) => b.status === "pending").length > 0 ? (
                  bookings.filter((b) => b.status === "pending").map((booking) => (
                    <div key={booking._id} className="group flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8 bg-white/[0.01] border border-white/[0.05] rounded-[2rem] hover:bg-white/[0.02] transition-colors">
                       <div className="flex flex-col gap-2 text-center md:text-left">
                          <span className="text-sm font-bold text-white tracking-tight">{booking.userEmail}</span>
                          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-600 justify-center md:justify-start">
                             <Clock size={12} className="text-amber-500" />
                             <span>{booking.date}</span>
                             <span className="w-1 h-1 bg-gray-800 rounded-full" />
                             <span className="text-[#c2a878]">{booking.time}</span>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <button 
                            onClick={() => updateBookingStatus(booking._id, "accept")}
                            className="px-6 py-2.5 bg-[#c2a878] text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-100 transition-colors active:scale-95"
                          >
                             Approve
                          </button>
                          <button 
                            onClick={() => updateBookingStatus(booking._id, "reject")}
                            className="px-6 py-2.5 bg-white/5 border border-white/5 text-white/50 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors active:scale-95"
                          >
                             Decline
                          </button>
                          <button 
                            onClick={() => deleteBooking(booking._id)}
                            className="p-2.5 text-gray-700 hover:text-rose-500 transition-colors"
                          >
                             <Trash2 size={16} />
                          </button>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center rounded-[2rem] border border-dashed border-white/5">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700">No pending approvals detected</p>
                  </div>
                )}
             </div>
          </section>

          {/* Confirmed Sessions */}
          <section>
             <div className="flex items-center gap-4 mb-10">
                <Check size={20} className="text-[#c2a878]" />
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/90">Active Admissions List</h2>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent" />
             </div>

             <div className="space-y-4">
                {bookings.filter((b) => b.status === "accepted" || b.status === "booked").length > 0 ? (
                  bookings.filter((b) => b.status === "accepted" || b.status === "booked").map((booking) => (
                    <div key={booking._id} className="group flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8 bg-[#c2a878]/[0.02] border border-[#c2a878]/10 rounded-[2rem] hover:bg-[#c2a878]/[0.04] transition-colors">
                       <div className="flex flex-col gap-2 text-center md:text-left">
                          <div className="flex items-center gap-3 justify-center md:justify-start">
                             <span className="text-sm font-bold text-white tracking-tight">{booking.userEmail}</span>
                             <span className="text-[8px] px-2 py-0.5 bg-[#c2a878] text-black font-black uppercase rounded-full">Active</span>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-600 justify-center md:justify-start">
                             <Clock size={12} className="text-[#c2a878]" />
                             <span>{booking.date}</span>
                             <span className="w-1 h-1 bg-gray-800 rounded-full" />
                             <span className="text-[#c2a878]">{booking.time}</span>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          {booking.consultantVideoEnabled ? (
                            <button 
                              onClick={() => router.push(`/video-call/${booking._id}`)}
                              className="flex items-center gap-3 px-8 py-3 bg-[#c2a878] text-black rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-yellow-100 transition-all active:scale-95 shadow-[0_10px_30px_-10px_rgba(194,168,120,0.3)]"
                            >
                               <Video size={14} /> Start Call
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 px-8 py-3 bg-white/[0.02] border border-white/[0.05] rounded-xl text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">
                               <span>No Video Call Available</span>
                            </div>
                          )}
                          <button 
                            onClick={() => deleteBooking(booking._id)}
                            className="p-2.5 text-gray-700 hover:text-rose-500 transition-colors ml-2"
                          >
                             <Trash2 size={16} />
                          </button>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center rounded-[2rem] border border-dashed border-white/5">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700">No active admissions scheduled</p>
                  </div>
                )}
             </div>
          </section>

          {/* Completed Bookings */}
          {bookings.filter((b) => b.status === "completed").length > 0 && (
             <section>
                <div className="flex items-center gap-4 mb-10">
                   <Check size={20} className="text-emerald-500" />
                   <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/90">Completed Bookings</h2>
                   <div className="flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent" />
                </div>
                
                <div className="space-y-4">
                   {bookings.filter((b) => b.status === "completed").map((booking) => (
                     <div key={booking._id} className="group flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-[2rem] opacity-60">
                        <div className="flex flex-col gap-2 text-center md:text-left">
                           <div className="flex items-center gap-3 justify-center md:justify-start">
                              <span className="text-sm font-bold text-white tracking-tight">{booking.userEmail}</span>
                              <span className="text-[8px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-black uppercase rounded-full">Completed</span>
                           </div>
                           <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-600 justify-center md:justify-start">
                              <Clock size={12} className="text-emerald-500" />
                              <span>{booking.date}</span>
                              <span className="w-1 h-1 bg-gray-800 rounded-full" />
                              <span className="text-emerald-500">{booking.time}</span>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="px-8 py-3 bg-emerald-500/5 border border-emerald-500/10 text-emerald-500/50 rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">
                              Session Complete
                           </div>
                           <button 
                             onClick={() => deleteBooking(booking._id)}
                             className="p-2.5 text-gray-700 hover:text-rose-500 transition-colors ml-2"
                           >
                              <Trash2 size={16} />
                           </button>
                        </div>
                     </div>
                   ))}
                </div>
             </section>
          )}

          {/* Archives */}
          {bookings.filter((b) => b.status === "rejected").length > 0 && (
             <section className="opacity-30 hover:opacity-60 transition-opacity duration-500">
                <div className="flex items-center gap-4 mb-10">
                   <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Archive</h2>
                   <div className="flex-1 h-[1px] bg-gray-900" />
                </div>
                
                <div className="space-y-2">
                   {bookings.filter((b) => b.status === "rejected").map((booking) => (
                     <div key={booking._id} className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/[0.05] rounded-2xl">
                        <div className="flex flex-col">
                           <span className="text-xs text-gray-400">{booking.userEmail}</span>
                           <span className="text-[9px] font-bold uppercase text-gray-700">{booking.date} • Declined</span>
                        </div>
                        <button 
                          onClick={() => deleteBooking(booking._id)}
                          className="text-[9px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-colors"
                        >
                           Clear Records
                        </button>
                     </div>
                   ))}
                </div>
             </section>
          )}

        </div>
      </div>
    </div>
  );
};

export default ConsultantDashboard;
