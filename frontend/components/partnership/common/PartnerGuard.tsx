"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, getToken } from "@/app/lib/token";

export default function PartnerGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    const user = getUser();
    const userRole = localStorage.getItem("userRole");

    if (!token) {
      setLoading(false);
      setAuthorized(false);
      return;
    }

    const legacyRoles = ["admin", "super_admin", "eduleader", "edumitra", "college_coordinator"];
    
    // Legacy role check
    if (userRole && legacyRoles.includes(userRole.toLowerCase())) {
      setAuthorized(true);
      setLoading(false);
      return;
    }

    // New partner structure check
    if (user && user.role === "partner") {
      const partnerProfile = user.partnerProfile;
      if (
        partnerProfile &&
        partnerProfile.onboardingStatus === "approved" &&
        partnerProfile.isApproved === true &&
        partnerProfile.isActive !== false
      ) {
        setAuthorized(true);
      } else {
        // Not approved, suspended, or pending
        if (partnerProfile) {
          router.push(`/register/partner/status`);
        }
      }
    } else if (user && legacyRoles.includes(user.role?.toLowerCase())) {
      setAuthorized(true);
    }
    
    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="p-8 text-center">Loading partnership data...</div>;
  }

  if (!authorized) {
    return (
      <div className="p-8 text-center text-red-600">
        <h2>Unauthorized Access</h2>
        <p>You must be logged in with a valid partner role to view this page.</p>
        <button onClick={() => router.push("/auth/login")} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          Go to Login
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
