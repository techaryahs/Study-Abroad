"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Bell,
  ChevronDown,
  User,
  Shield,
  Key,
  LogOut,
  ExternalLink,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface AdminHeaderProps {
  onToggleMobileMenu: () => void;
  adminUser?: { name?: string; email?: string; role?: string };
  onLogoutClick: () => void;
  pendingApprovalsCount?: number;
  pendingPartnersCount?: number;
  pendingSeminarsCount?: number;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const ROUTE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/admin-dashboard": {
    title: "Executive Overview",
    subtitle: "Real-time system metrics, recent activity & operational health",
  },
  "/admin-dashboard/sessions": {
    title: "Sessions & Bookings",
    subtitle: "Manage student counselling sessions, meetings & status",
  },
  "/admin-dashboard/counsellors": {
    title: "Counsellor Management",
    subtitle: "Control video calling access, tiers & consultant profiles",
  },
  "/admin-dashboard/partners": {
    title: "Partner Management",
    subtitle: "Review partner registrations, onboarding approvals & status",
  },
  "/admin-dashboard/students": {
    title: "Students / Leads",
    subtitle: "Inspect seminar attendance leads & multi-tenant assignments",
  },
  "/admin-dashboard/seminars": {
    title: "Seminar Approvals",
    subtitle: "Review and approve partner-organized institution seminars",
  },
  "/admin-dashboard/colleges": {
    title: "Colleges Master Data",
    subtitle: "Institutional partner database and college coordinator directory",
  },
  "/admin-dashboard/slots": {
    title: "Manage Availability Slots",
    subtitle: "Configure weekly schedule blocks & student booking windows",
  },
  "/admin-dashboard/coupons": {
    title: "Coupon Management",
    subtitle: "Create, monitor & toggle promotional discount campaigns",
  },
  "/admin-dashboard/articles": {
    title: "Articles & Resources",
    subtitle: "Publish and maintain study-abroad guides & editorial content",
  },
  "/admin-dashboard/profile": {
    title: "Profile & Security",
    subtitle: "Administrator credentials, password updates & security controls",
  },
};

export default function AdminHeader({
  onToggleMobileMenu,
  adminUser,
  onLogoutClick,
  pendingApprovalsCount = 0,
  pendingPartnersCount = 0,
  pendingSeminarsCount = 0,
  onRefresh,
  isRefreshing = false,
}: AdminHeaderProps) {
  const pathname = usePathname() || "";
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const meta = ROUTE_TITLES[pathname] || {
    title: "Admin Console",
    subtitle: "Global administration and management system",
  };

  const getInitials = (name?: string) => {
    if (!name) return "AD";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#090b0e]/95 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle + Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 border border-white/10 transition-colors shrink-0"
          aria-label="Open mobile navigation"
        >
          <Menu size={18} />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] font-bold text-white/40 uppercase tracking-widest truncate">
            <span>Admin</span>
            <span>/</span>
            <span className="text-[#c2a878]">{meta.title}</span>
          </div>
          <h1 className="text-sm sm:text-base font-black text-white tracking-tight truncate hidden sm:block">
            {meta.title}
          </h1>
        </div>
      </div>

      {/* Right: Actions, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Refresh Action Button */}
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 text-white/60 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
            title="Refresh dashboard data"
          >
            <RefreshCw
              size={14}
              className={`shrink-0 ${isRefreshing ? "animate-spin text-[#c2a878]" : ""}`}
            />
            <span className="hidden md:inline">Refresh</span>
          </button>
        )}

        {/* Operational Status Pill */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live Console</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setNotifDropdownOpen((prev) => !prev);
              setProfileDropdownOpen(false);
            }}
            className="relative p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={16} />
            {pendingApprovalsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-black">
                {pendingApprovalsCount > 9 ? "9+" : pendingApprovalsCount}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0d0f12] border border-white/10 rounded-2xl shadow-2xl p-4 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  Operational Alerts
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#c2a878]/15 text-[#c2a878]">
                  {pendingApprovalsCount} Pending
                </span>
              </div>

              <div className="space-y-2">
                {pendingPartnersCount > 0 ? (
                  <Link
                    href="/admin-dashboard/partners"
                    onClick={() => setNotifDropdownOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors border border-transparent hover:border-white/5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertCircle size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white">
                        {pendingPartnersCount} Partner Application{pendingPartnersCount > 1 ? "s" : ""}
                      </p>
                      <p className="text-[11px] text-white/50 truncate">
                        Pending review and onboarding approval
                      </p>
                    </div>
                  </Link>
                ) : null}

                {pendingSeminarsCount > 0 ? (
                  <Link
                    href="/admin-dashboard/seminars"
                    onClick={() => setNotifDropdownOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition-colors border border-transparent hover:border-white/5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertCircle size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white">
                        {pendingSeminarsCount} Seminar Request{pendingSeminarsCount > 1 ? "s" : ""}
                      </p>
                      <p className="text-[11px] text-white/50 truncate">
                        College seminars awaiting administrative signoff
                      </p>
                    </div>
                  </Link>
                ) : null}

                {pendingApprovalsCount === 0 && (
                  <div className="py-6 text-center text-white/40 space-y-1">
                    <CheckCircle size={24} className="mx-auto text-emerald-400/80 mb-2" />
                    <p className="text-xs font-bold text-white/70">All Queues Clear</p>
                    <p className="text-[11px] text-white/40">No pending approvals require action</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Pill & Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setProfileDropdownOpen((prev) => !prev);
              setNotifDropdownOpen(false);
            }}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#c2a878] to-[#917646] flex items-center justify-center text-black font-black text-xs shrink-0 shadow-sm">
              {getInitials(adminUser?.name)}
            </div>
            <div className="hidden sm:flex flex-col min-w-0 max-w-[120px]">
              <span className="text-xs font-bold text-white truncate leading-tight">
                {adminUser?.name || "Administrator"}
              </span>
              <span className="text-[10px] font-semibold text-[#c2a878] uppercase tracking-wider">
                Admin
              </span>
            </div>
            <ChevronDown size={14} className="text-white/40 hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#0d0f12] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn">
              <div className="px-3 py-2.5 border-b border-white/5 mb-1">
                <p className="text-xs font-black text-white truncate">
                  {adminUser?.name || "Administrator"}
                </p>
                <p className="text-[11px] text-white/40 truncate">
                  {adminUser?.email || "admin@eduleader.global"}
                </p>
              </div>

              <div className="space-y-0.5">
                <Link
                  href="/admin-dashboard/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  <User size={15} className="text-[#c2a878]" />
                  <span>Admin Profile</span>
                </Link>
                <Link
                  href="/admin-dashboard/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  <Key size={15} className="text-[#c2a878]" />
                  <span>Change Password</span>
                </Link>
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  <ExternalLink size={15} className="text-white/40" />
                  <span>View Public Site</span>
                </Link>
              </div>

              <div className="pt-1 mt-1 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onLogoutClick();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left"
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
