"use client";
import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { getUser, getToken } from "@/app/lib/token";

type AccessStatus = "loading" | "authorized" | "unauthorized" | "approval-pending";

const legacyRoles = ["admin", "super_admin", "eduleader", "edumitra", "college_coordinator"];

function subscribeToAuth(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", onChange);
  window.addEventListener("user-updated", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("user-updated", onChange);
  };
}

function getAccessStatus(): AccessStatus {
  if (typeof window === "undefined") return "loading";
  if (!getToken()) return "unauthorized";

  let user;
  try {
    user = getUser();
  } catch {
    return "unauthorized";
  }

  const legacyRole = localStorage.getItem("userRole")?.toLowerCase();
  const role = String(user?.role || "").toLowerCase();
  if ((legacyRole && legacyRoles.includes(legacyRole)) || legacyRoles.includes(role)) {
    return "authorized";
  }

  if (role === "partner") {
    const partnerProfile = user?.partnerProfile;
    if (!partnerProfile) return "authorized";
    if (
      partnerProfile.onboardingStatus === "approved" &&
      partnerProfile.isApproved === true &&
      partnerProfile.isActive !== false
    ) {
      return "authorized";
    }
    return "approval-pending";
  }

  return "unauthorized";
}

export default function PartnerGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const access = useSyncExternalStore(subscribeToAuth, getAccessStatus, () => "loading");

  useEffect(() => {
    if (access === "approval-pending") router.push("/register/partner/status");
  }, [access, router]);

  if (access === "loading") {
    return <div className="p-8 text-center">Loading partnership data...</div>;
  }

  if (access !== "authorized") {
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
