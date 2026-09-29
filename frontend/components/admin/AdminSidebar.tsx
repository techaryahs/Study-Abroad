"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Briefcase,
  GraduationCap,
  CheckSquare,
  Building2,
  Clock,
  Tag,
  FileText,
  ShieldCheck,
  ExternalLink,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string | number;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Operations",
    items: [
      { label: "Overview", href: "/admin-dashboard", icon: LayoutDashboard },
      { label: "Sessions & Bookings", href: "/admin-dashboard/sessions", icon: CalendarCheck },
      { label: "Counsellors", href: "/admin-dashboard/counsellors", icon: Users },
      { label: "Partners", href: "/admin-dashboard/partners", icon: Briefcase },
      { label: "Students / Leads", href: "/admin-dashboard/students", icon: GraduationCap },
    ],
  },
  {
    title: "Platform & Content",
    items: [
      { label: "Seminar Approvals", href: "/admin-dashboard/seminars", icon: CheckSquare },
      { label: "Colleges", href: "/admin-dashboard/colleges", icon: Building2 },
      { label: "Manage Slots", href: "/admin-dashboard/slots", icon: Clock },
      { label: "Coupons", href: "/admin-dashboard/coupons", icon: Tag },
      { label: "Articles", href: "/admin-dashboard/articles", icon: FileText },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Profile & Security", href: "/admin-dashboard/profile", icon: ShieldCheck },
    ],
  },
];

interface AdminSidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  onLogoutClick: () => void;
  pendingApprovalsCount?: number;
}

export default function AdminSidebar({
  isCollapsed,
  isMobileOpen,
  onToggleCollapse,
  onCloseMobile,
  onLogoutClick,
  pendingApprovalsCount = 0,
}: AdminSidebarProps) {
  const pathname = usePathname() || "";

  const isItemActive = (href: string) => {
    if (href === "/admin-dashboard") {
      return pathname === "/admin-dashboard";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#090b0e] border-r border-white/[0.08] text-white">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/[0.08] shrink-0">
        <Link
          href="/admin-dashboard"
          className="flex items-center gap-3 overflow-hidden focus:outline-none"
          onClick={onCloseMobile}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c2a878] to-[#917646] flex items-center justify-center shrink-0 shadow-lg shadow-[#c2a878]/10">
            <Sparkles size={18} className="text-black" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-black tracking-wider text-white uppercase truncate">
                EduLeader
              </span>
              <span className="text-[10px] font-bold text-[#c2a878] tracking-[0.2em] uppercase">
                Admin Console
              </span>
            </div>
          )}
        </Link>

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="space-y-1">
            {!isCollapsed && (
              <h4 className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2">
                {group.title}
              </h4>
            )}
            {group.items.map((item) => {
              const active = isItemActive(item.href);
              const Icon = item.icon;
              const showBadge =
                (item.label === "Seminar Approvals" || item.label === "Partners") &&
                pendingApprovalsCount > 0;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  title={isCollapsed ? item.label : undefined}
                  className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? "bg-[#c2a878]/15 text-[#c2a878] font-bold shadow-sm"
                      : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon
                    size={18}
                    className={`shrink-0 transition-colors ${
                      active
                        ? "text-[#c2a878]"
                        : "text-white/50 group-hover:text-white"
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="flex-1 truncate tracking-wide">
                      {item.label}
                    </span>
                  )}
                  {!isCollapsed && showBadge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      •
                    </span>
                  )}
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-[#c2a878]" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-white/[0.08] space-y-1 shrink-0">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-white/50 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all"
          title={isCollapsed ? "View Public Site" : undefined}
        >
          <ExternalLink size={16} className="shrink-0 text-white/40" />
          {!isCollapsed && <span className="truncate">View Public Site</span>}
        </Link>
        <button
          type="button"
          onClick={onLogoutClick}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all text-left"
          title={isCollapsed ? "Sign Out" : undefined}
        >
          <LogOut size={16} className="shrink-0 text-rose-400/80" />
          {!isCollapsed && <span className="truncate">Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-300 z-30 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div
          className={`fixed top-0 bottom-0 left-0 transition-all duration-300 ${
            isCollapsed ? "w-20" : "w-64"
          }`}
        >
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sliding Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 lg:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
