"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, XCircle, AlertCircle, LogOut } from "lucide-react";
import { getUser, removeToken } from "@/app/lib/token";

export default function PartnerStatusPage() {
  const router = useRouter();
  const [status, setStatus] = useState<string>("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== "partner") {
      router.push("/auth/login");
      return;
    }

    if (user.partnerProfile?.onboardingStatus) {
      setStatus(user.partnerProfile.onboardingStatus);
    }
    
    // If they are approved, send them to dashboard
    if (
      user.partnerProfile?.onboardingStatus === "approved" &&
      user.partnerProfile?.isApproved === true &&
      user.partnerProfile?.isActive !== false
    ) {
      router.push("/partnership/dashboard");
    }

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    removeToken();
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#FDFBF7]">
        <div className="text-center">Loading status...</div>
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
            <h1 className="text-3xl font-black text-[#3C2A21] mb-4 uppercase italic">Partner Application Under Review</h1>
            <p className="text-[#6B5E51] mb-8 font-bold text-[14px]">
              Thank you for registering. Your application is currently under review by our admin team.
              You will be able to access the Partnership Dashboard after your partner account is approved.
            </p>
          </>
        );
      case "approved":
        return (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-black text-[#3C2A21] mb-4 uppercase italic">Partner Account Approved</h1>
            <p className="text-[#6B5E51] mb-8 font-bold text-[14px]">
              Your partner account has been approved. Redirecting to dashboard...
            </p>
          </>
        );
      case "rejected":
        return (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-black text-[#3C2A21] mb-4 uppercase italic">Partner Application Rejected</h1>
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
            <h1 className="text-3xl font-black text-[#3C2A21] mb-4 uppercase italic">Partner Account Suspended</h1>
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
              We couldn't determine your account status. Please contact support.
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

        <button
          onClick={handleLogout}
          className="mx-auto flex items-center justify-center gap-2 py-4 px-8 bg-[#3C2A21] text-white font-black rounded-xl shadow-lg transition-all hover:bg-[#C5A059] uppercase tracking-widest text-[11px]"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </motion.div>
    </div>
  );
}
