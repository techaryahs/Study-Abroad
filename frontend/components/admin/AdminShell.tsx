"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getUser, getToken, removeToken } from "@/app/lib/token";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import ConfirmModal from "./ConfirmModal";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

interface AdminShellProps {
  children: React.ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Operational notification counts
  const [pendingPartnersCount, setPendingPartnersCount] = useState(0);
  const [pendingSeminarsCount, setPendingSeminarsCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedCollapsed = localStorage.getItem("admin_sidebar_collapsed");
    if (storedCollapsed === "true") {
      setIsCollapsed(true);
    }
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("admin_sidebar_collapsed", String(next));
      return next;
    });
  };

  const fetchAlertCounts = useCallback(async (token: string) => {
    try {
      setIsRefreshing(true);
      // Fetch partners for pending count
      const partnersPromise = fetch(`${BACKEND_URL}/api/admin/partners`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : { partners: [] }))
        .catch(() => ({ partners: [] }));

      // Fetch seminars for pending count
      const seminarsPromise = fetch(`${BACKEND_URL}/api/admin/seminars`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : { seminars: [] }))
        .catch(() => ({ seminars: [] }));

      const [partnersData, seminarsData] = await Promise.all([
        partnersPromise,
        seminarsPromise,
      ]);

      const pendingPartners = (partnersData.partners || []).filter(
        (p: any) => p.partnerProfile?.onboardingStatus === "pending"
      ).length;

      const pendingSeminars = (seminarsData.seminars || []).filter(
        (s: any) => s.status === "PENDING"
      ).length;

      setPendingPartnersCount(pendingPartners);
      setPendingSeminarsCount(pendingSeminars);
    } catch (err) {
      console.error("Failed to fetch alert counts:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const user = getUser();
    const token = getToken();

    if (!user || user.role !== "admin" || !token) {
      router.replace("/auth/login");
      return;
    }

    setAdminUser(user);
    setAuthChecked(true);
    fetchAlertCounts(token);
  }, [router, fetchAlertCounts]);

  const handleLogoutConfirm = () => {
    removeToken();
    router.push("/auth/login");
  };

  const handleRefresh = () => {
    const token = getToken();
    if (token) {
      fetchAlertCounts(token);
      // Dispatch custom event for child pages to refresh their data
      window.dispatchEvent(new CustomEvent("admin-refresh-data"));
    }
  };

  if (!mounted || !authChecked) {
    return (
      <div className="min-h-screen bg-[#05070a] flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-8 h-8 border-2 border-[#c2a878]/30 border-t-[#c2a878] rounded-full animate-spin" />
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#c2a878]/70">
          Loading Admin Console...
        </span>
      </div>
    );
  }

  const totalPending = pendingPartnersCount + pendingSeminarsCount;

  return (
    <div className="flex min-h-screen bg-[#05070a] text-white">
      {/* Persistent / Collapsible Sidebar */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onToggleCollapse={handleToggleCollapse}
        onCloseMobile={() => setIsMobileOpen(false)}
        onLogoutClick={() => setShowLogoutModal(true)}
        pendingApprovalsCount={totalPending}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Compact Admin Header */}
        <AdminHeader
          onToggleMobileMenu={() => setIsMobileOpen(true)}
          adminUser={adminUser}
          onLogoutClick={() => setShowLogoutModal(true)}
          pendingApprovalsCount={totalPending}
          pendingPartnersCount={pendingPartnersCount}
          pendingSeminarsCount={pendingSeminarsCount}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        {/* Page Content Container */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmModal
        isOpen={showLogoutModal}
        title="Sign Out of Admin Console?"
        description="Are you sure you want to end your administrative session? You will need to log back in to access the dashboard."
        confirmLabel="Sign Out"
        cancelLabel="Stay Logged In"
        variant="danger"
        onConfirm={handleLogoutConfirm}
        onClose={() => setShowLogoutModal(false)}
      />
    </div>
  );
}
