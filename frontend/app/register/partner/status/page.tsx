"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, XCircle, AlertCircle, LogOut, RefreshCw } from "lucide-react";
import { getToken, removeToken, setUser } from "@/app/lib/token";

export default function PartnerStatusPage() {
  const router = useRouter();
  const [status, setStatus] = useState<string>("pending");
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const fetchFreshStatus = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      setIsLoggedIn(true);
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";
      const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok && data.user) {
        // Update global auth state so Navbar sees it
        setUser(data.user);
        window.dispatchEvent(new Event("user-updated"));

        const p = data.user.partnerProfile;
        if (p) {
          setStatus(p.onboardingStatus || "pending");
          
          if (p.onboardingStatus === "approved" && p.isApproved === true && p.isActive !== false) {
            setIsApproved(true);
          } else {
            setIsApproved(false);
          }
        }
      } else {
        removeToken();
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.error("Failed to fetch fresh user status", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreshStatus();
  }, []);

  const handleAction = () => {
    if (isLoggedIn) {
      removeToken();
      window.dispatchEvent(new Event("user-updated"));
    }
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#FDFBF7]">
        <div className="w-8 h-8 border-4 border-[#C5A059]/30 border-t-[#C5A059] rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderStatusContent = () => {
    switch (status) {
      case "pending":
        return (
          <>
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-amber-600" />
            </div>
            <h1 className="text-3xl font-black text-[#3C2A21] mb-4 uppercase italic">PARTNER APPLICATION UNDER REVIEW</h1>
            <p className="text-[#6B5E51] mb-4 font-bold text-[14px]">
              Your partner registration has been successfully submitted.
            </p>
            <p className="text-[#6B5E51] mb-8 font-bold text-[14px]">
              Your application is currently pending administrator approval.
            </p>
            <div className="inline-block bg-amber-50 border border-amber-200 text-amber-600 px-4 py-2 rounded-lg font-bold text-sm tracking-widest uppercase mb-8">
              STATUS: PENDING
            </div>
          </>
        );
      case "approved":
        return (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-black text-[#3C2A21] mb-4 uppercase italic">PARTNER APPLICATION APPROVED</h1>
            <p className="text-[#6B5E51] mb-8 font-bold text-[14px]">
              Your partner application has been approved.
            </p>
            <div className="inline-block bg-green-50 border border-green-200 text-green-600 px-4 py-2 rounded-lg font-bold text-sm tracking-widest uppercase mb-8">
              STATUS: APPROVED
            </div>
          </>
        );
      case "rejected":
        return (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-black text-[#3C2A21] mb-4 uppercase italic">PARTNER APPLICATION NOT APPROVED</h1>
            <p className="text-[#6B5E51] mb-8 font-bold text-[14px]">
              Unfortunately, your partner application could not be approved at this time.
            </p>
          </>
        );
      case "suspended":
        return (
          <>
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-orange-600" />
            </div>
            <h1 className="text-3xl font-black text-[#3C2A21] mb-4 uppercase italic">PARTNER ACCOUNT SUSPENDED</h1>
            <p className="text-[#6B5E51] mb-8 font-bold text-[14px]">
              Your partner account has been suspended. Please contact support for more information.
            </p>
          </>
        );
      default:
        return (
          <>
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-gray-600" />
            </div>
            <h1 className="text-3xl font-black text-[#3C2A21] mb-4 uppercase italic">Unknown Status</h1>
            <p className="text-[#6B5E51] mb-8 font-bold text-[14px]">
              We could not determine your account status. Please contact support.
            </p>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FDFBF7]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-[#C5A059]/15 rounded-[2rem] shadow-xl w-full max-w-xl p-10 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />
        
        {renderStatusContent()}

        {isApproved ? (
          <button
            onClick={() => router.push("/partnership/dashboard")}
            className="mx-auto flex items-center justify-center gap-2 py-4 px-8 bg-[#C5A059] text-white font-black rounded-xl shadow-lg transition-all hover:bg-[#3C2A21] uppercase tracking-widest text-[11px] mb-4 w-full sm:w-auto"
          >
            OPEN PARTNERSHIP DASHBOARD
          </button>
        ) : (
          <button
            onClick={fetchFreshStatus}
            className="mx-auto flex items-center justify-center gap-2 py-4 px-8 bg-[#C5A059]/10 text-[#C5A059] font-black rounded-xl shadow-sm transition-all hover:bg-[#C5A059]/20 uppercase tracking-widest text-[11px] mb-4 w-full sm:w-auto"
          >
            <RefreshCw className="w-4 h-4" />
            REFRESH STATUS
          </button>
        )}

        <button
          onClick={handleAction}
          className="mx-auto flex items-center justify-center gap-2 py-4 px-8 bg-[#3C2A21] text-white font-black rounded-xl shadow-lg transition-all hover:bg-red-500 uppercase tracking-widest text-[11px] w-full sm:w-auto"
        >
          {isLoggedIn ? (
            <>
              <LogOut className="w-4 h-4" />
              Logout
            </>
          ) : (
            <>
              Go to Login
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
